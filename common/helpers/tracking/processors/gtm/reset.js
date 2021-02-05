/**
 * Variable values persist in the datalayer until they are overwritten, and the
 * complete datalayer is sent to Tag Manager on every event.
 *
 * Resetting them to null prevents unrelated data from prior events appearing
 * on new events. Therefore, we will separate events into two categories: events
 * that should persist until the next "PageLoaded" event and events that should
 * be cleared every time. For the latter, we provide a function to clear them
 * out on every push.
 */

// Events that should persist until the next "PageLoaded" event. This does not
// include "universal" variables that are pushed for every event.
const persistedVars = [
    'articleId',
    'AuthorNames',
    'Authors',
    'Guide',
    'Headline',
    'ObsessionName',
    'PageType',
    'Premium',
    'PublishDate',
    'Published',
    'PublishHour',
    'RawURL',
    'SEOHeadline',
    'Series',
    'Sponsor',
    'Tags',
    'Topic',
];

// Events that should be reset on every data layer push.
const ephemeralVars = [
    'articleScrollDepth',
    'destinationHeadline',
    'destinationUrl',
    'eventAction',
    'eventCategory',
    'eventLabel',
    'experimentId',
    'experimentVariant',
    'ListId',
    'pixelDepth',
];

const reducer = (acc, key) => ({ ...acc,
    [key]: null
});

export const resetAll = () => [...persistedVars, ...ephemeralVars].reduce(reducer, {});
export const resetEphemeral = () => ephemeralVars.reduce(reducer, {});