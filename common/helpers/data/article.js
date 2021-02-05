import {
    get
} from 'helpers/utils';
import {
    resizeWPImage
} from '@quartz/js-utils';

/**
 * We can't feature every taxonomy that an article belongs to, so we need to pick
 * one. This sets the order of preference.
 */
const getPromotedTaxonomy = ({
    project,
    series,
    show,
    guide,
    obsession
}) => {
    if (project ? .id) {
        return {
            ...project,
            kicker: 'From our Special Project',
        };
    }

    if (show ? .id) {
        return {
            ...show,
            kicker: 'From our Show',
        };
    }

    if (guide ? .id) {
        return {
            ...guide,
            kicker: 'From our Field Guide',
        };
    }

    if (series ? .id) {
        return {
            ...series,
            kicker: 'From our Series',
        };
    }

    if (obsession ? .id) {
        return {
            ...obsession,
            kicker: 'From our Obsession',
        };
    }

    return null;
};

// Note: This function isn't necessarily only parsing "articles." It may also
// parse bulletins, promotions, stacks, and any other content we want to
// represent on the site.
export const getArticleProps = node => {
    // We may be passed data under a node property.
    const post = node.node || node;
    const {
        postId
    } = post;

    const tags = get(post, 'tags.nodes', []);

    const flags = get(post, 'flags.nodes', []);

    // This helps if the reporter has not selected an edition (e.g., previewing).
    const defaultEdition = {
        name: 'Quartz',
        slug: 'quartz',
    };

    // Pull out properties that we want to override or remove from the base object.
    const {
        classifications = [],
            editions,
            guides,
            interactiveShowHeader,
            interactiveSource,
            locations,
            obsessions,
            serieses,
            shows,
            projects,
            topics,
            ...article
    } = post;

    let {
        dateGmt,
        featuredImageSize,
        socialImage,
        trackingUrls
    } = post;

    // In preview, dateGmt is null. Ensure a value.
    if (null === dateGmt) {
        dateGmt = post.date;
    }

    // Inspect the GraphQL typename since multiple data types pass through here.
    const type = 'Post' === post.__typename ? 'article' : 'promotion';

    // Process taxonomies.
    const authors = get(post, 'authors.nodes', []);
    const keywords = tags.map(tag => tag.name).join(',');
    const authorLocation = get(locations, 'nodes[0].name', null);
    const obsession = get(obsessions, 'nodes[0]', {});
    const edition = get(editions, 'nodes[0]', defaultEdition);
    const series = get(serieses, 'nodes[0]', {});
    const show = get(shows, 'nodes[0]', {});
    const project = get(projects, 'nodes[0]', {});
    const topic = get(topics, 'nodes[0]', {});
    const guide = get(guides, 'nodes[0]', {});
    const promotedTaxonomy = getPromotedTaxonomy({
        project,
        series,
        show,
        guide,
        obsession
    });

    // Provide some default values.
    const kicker = get(post, 'kicker', '');
    const readNext = get(post, 'readNext', []);
    const socialDescription = get(post, 'socialDescription', '');
    const subtype = get(post, 'subtype', 'article');
    const summary = socialDescription || post.excerpt || '';

    let interactive = {};

    if ('interactive' === subtype) {
        interactive = {
            id: `${postId}-interactive`,
            size: 'full-width', // Use a special size prop for featured interactives
            src: interactiveSource,
            title: `Featured interactive content for: ${post.title}`,
            showHeader: interactiveShowHeader,
        };
    }

    const ad = {
        path: post.bulletin ? 'bulletin' : 'article',
        targeting: {
            guide: guide.slug,
            obsession: obsession.slug,
            premium: !!guide.slug,
            project: project.slug,
            series: series.slug,
            topic: topic.slug,
            tags: [
                ...tags.map(tag => tag.slug),
                // Merging brand-safety terms into tags.
                ...classifications,
            ].join(','),
            wpid: postId,
        },
        flexSlotSize: [{
                viewport: [0, 0],
                slot: [
                    [600, 431],
                    [600, 600],
                    [300, 250]
                ]
            },
            {
                viewport: [768, 0],
                slot: [
                    [1400, 521],
                    [1200, 1200]
                ]
            },
            {
                viewport: [1200, 0],
                slot: [
                    [1600, 521],
                    [2000, 2000]
                ]
            },
        ],
        engageSlotSize: [{
                viewport: [0, 0],
                slot: [
                    [600, 431]
                ]
            },
            {
                viewport: [768, 0],
                slot: [
                    [1400, 521]
                ]
            },
            {
                viewport: [1200, 0],
                slot: [
                    [1600, 521]
                ]
            },
        ],
    };

    // Set SEO / social fields.
    const seoTitle = post.seoTitle || post.title;

    // Set a default featured image size.
    if (!featuredImageSize) {
        featuredImageSize = 'large';
    }

    // If there is no social image, try and fall back to the featuredImage
    if ('string' !== typeof socialImage && post.featuredImage ? .sourceUrl) {
        socialImage = post.featuredImage.sourceUrl;
    }

    // Resize the social image to an arbitrary width to keep filesizes down (Twitter has a 5MB cap) and reduce processing latency
    if ('string' === typeof socialImage) {
        socialImage = resizeWPImage(socialImage, 1400);
    }

    // add bulletin specific urls to trackingUrls
    if (trackingUrls && post.bulletin && post.bulletin.clientTracking.article) {
        trackingUrls = [...post.bulletin.clientTracking.article, ...trackingUrls];
    }

    // Create spreadable block props from block attributes.
    const blocks = (article.blocks || []).map(block => ({
        ...block,
        blockProps: (block.attributes || []).reduce((props, {
            name,
            value
        }) => ({ ...props,
            [name]: value
        }), {}),
    }));

    return {
        ...article,
        ad,
        authors,
        authorLocation,
        blocks,
        dateGmt,
        edition,
        featuredImageSize,
        flags,
        guide,
        interactive,
        keywords,
        kicker,
        obsession,
        postId,
        project,
        promotedTaxonomy,
        readNext,
        seoTitle,
        series,
        show,
        socialDescription,
        socialImage,
        subtype,
        summary,
        tags,
        topic,
        trackingUrls,
        type,
    };
};