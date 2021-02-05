import {
    get
} from 'helpers/utils';
import {
    parseDateGmt,
    daysFromToday
} from 'helpers/dates';
import {
    getQueryParams,
    isAppArticle
} from 'helpers/urls';
import {
    resetAll,
    resetEphemeral
} from './reset';
import {
    redactEmailAddressesFromPath
} from 'helpers/text';

// Called only once in outer scope. Passing true to redact PII.
const redactedQueryParams = getQueryParams(true);

function getMemberDuration(membership) {
    const createdDate = membership ? .createdAt;
    return createdDate ? daysFromToday(createdDate) : null;
}

function getPayingMemberDuration(membership, memberDuration) {
    const trialing = 'trialing' === membership ? .status;

    // No membership object = the membership has expired.
    if (!memberDuration || trialing) {
        return null;
    }

    const trialEnd = membership ? .subscription ? .trialEnd;

    return trialEnd ? daysFromToday(trialEnd) : memberDuration;
}

function getStateVariables(appState) {
    const {
        auth: {
            membership,
        },
        experiments: {
            started,
        },
    } = appState;

    const memberDuration = getMemberDuration(membership);
    const payingMemberDuration = getPayingMemberDuration(membership, memberDuration);

    // @TODO: Implement ExperimentStarted event so that we can ship more than one
    // experiment ID.
    let experimentId = null;
    let experimentVariant = null;
    if (started.length) {
        [{
            experimentId,
            variant: experimentVariant
        }] = started;
    }

    return {
        adBlocking: null, // we no longer track this
        experimentId,
        experimentVariant,
        memberDuration,
        payingMemberDuration,
    };
}

// Keep track of referrers in memory.
const referrers = [];
if ('object' === typeof document) {
    referrers.push(document.referrer);
}

// Only set EntrancePath once.
let hasSetEntrancePath = false;

/**
 * Take an article and prepares it for the DataLayer
 * @param  {object} article
 * @return {object}
 */
export const getArticleDataLayer = article => {

    const date = parseDateGmt(article.dateGmt);
    const {
        obsession
    } = article;

    return {
        articleId: article.postId,
        AuthorNames: article.authors.map(author => author.name).join(', '),
        Authors: article.authors.map(author => author.name),
        Guide: article.guide.slug,
        Headline: article.title,
        ObsessionName: obsession.name,
        Premium: !!article.guide.slug,
        PublishDate: `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`,
        PublishHour: date.getHours(),
        Published: article.dateGmt,
        RawURL: article.link,
        SEOHeadline: article.socialTitle,
        Series: article.series.slug,
        Sponsor: get(article, 'bulletin.sponsor.slug', null),
        Tags: article.tags.map(tag => tag.slug),
        Topic: article.topic.slug,
    };
};

/**
 * Get data layer variables for various page types (from PageLoaded event).
 *
 * @param  {String} pageType Page type
 * @param  {Object} data     Event payload data
 * @return {Object}
 */
const getDataLayerByPageType = (pageType, data) => {
    switch (pageType) {
        case 'obsession':
            return {
                ObsessionName: data.obsession ? data.obsession.name : null,
            };

        case 'article':
        case 'bulletin':
            return getArticleDataLayer(data.article);
    }

    return {};
};

/**
 * Variables that should be included on every event, and variables that should
 * be included depending on pageType.
 */
export default (payload, appState) => {

    const {
        data,
        pageType,
        ...rest
    } = payload;

    // Set some additional props describing the current URL and path at the time
    // the event is fired. This helps us assemble the correct data even if we
    // don't ship it until later. (This prevents GTM from extracting incorrect
    // info from the window global.)
    //
    // Redact email addresses to avoid passing PII into Google Analytics.
    const {
        href,
        pathname
    } = window.location;
    const OverrideURL = redactEmailAddressesFromPath(href);
    const OverridePath = redactEmailAddressesFromPath(pathname);

    // Add to referer chain.
    if (!referrers.includes(OverrideURL)) {
        referrers.push(OverrideURL);
    }

    // These events are appended to every event and are never reset.
    const universalProps = {
        IsApp: isAppArticle(OverridePath),
        OverridePath,
        OverrideURL,
        Referrer: referrers[referrers.length - 2] || null,
        QueryParams: redactedQueryParams,
        Timestamp: Math.floor(Date.now() / 1000), // unix timestamp (seconds)
        ...getStateVariables(appState),
    };

    // Set EntrancePath once.
    if (!hasSetEntrancePath) {
        universalProps.EntrancePath = OverridePath;
        hasSetEntrancePath = true;
    }

    // If this is a PageLoaded event, reset all data layer variables.
    if (pageType) {
        return {
            ...resetAll(),
            ...universalProps,
            ...getDataLayerByPageType(pageType, data),
            PageType: pageType,
            ...rest,
        };
    }

    // Otherwise, just reset ephemeral variables.
    return {
        ...resetEphemeral(),
        ...universalProps,
        ...rest,
    };
};