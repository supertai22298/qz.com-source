import PropTypes from 'prop-types';
import articleTeaserPropTypes from './articleTeaserPropTypes';
import authorPropTypes from './authorPropTypes';

const {
    editions: ignored1,
    ...teaserPropTypes
} = articleTeaserPropTypes;

export default {
    ...teaserPropTypes,
    authorLocation: PropTypes.string,
    blocks: PropTypes.arrayOf(PropTypes.shape({
        attributes: PropTypes.arrayOf(PropTypes.shape({
            name: PropTypes.string,
            value: PropTypes.string,
        })),
        innerHtml: PropTypes.string,
        type: PropTypes.string,
    })),
    edition: PropTypes.shape({
        slug: PropTypes.string,
        name: PropTypes.string,
    }).isRequired,
    footnotes: PropTypes.arrayOf(PropTypes.string),
    slug: PropTypes.string,
    seoTitle: PropTypes.string.isRequired,
    socialTitle: PropTypes.string,
    socialDescription: PropTypes.string.isRequired,
    subtype: PropTypes.string.isRequired,
    readNext: PropTypes.arrayOf(PropTypes.string).isRequired,
    suppressAds: PropTypes.bool,
    disableAmp: PropTypes.bool,
    featuredImageSize: PropTypes.oneOf(['large', 'extra-large', 'portrait', 'hidden']),
    video: PropTypes.shape({
        id: PropTypes.string.isRequired,
        autoplay: PropTypes.bool,
        related: PropTypes.bool,
    }),
    interactive: PropTypes.shape({
        id: PropTypes.string,
        src: PropTypes.string,
        size: PropTypes.oneOf(['medium', 'large', 'extra-large']),
        showHeader: PropTypes.bool,
    }),
    authors: PropTypes.arrayOf(PropTypes.shape(authorPropTypes)),
    series: PropTypes.shape({
        slug: PropTypes.string,
        name: PropTypes.string,
    }).isRequired,
    show: PropTypes.shape({
        slug: PropTypes.string,
        name: PropTypes.string,
    }),
    tags: PropTypes.arrayOf(PropTypes.shape({
        slug: PropTypes.string,
        name: PropTypes.string,
    })).isRequired,
    keywords: PropTypes.string.isRequired,
    obsession: PropTypes.shape({
        id: PropTypes.string,
        description: PropTypes.string,
        name: PropTypes.string,
        slug: PropTypes.string,
    }),
    guide: PropTypes.shape({
        slug: PropTypes.string,
        name: PropTypes.string,
    }),
    topic: PropTypes.shape({
        id: PropTypes.string,
        description: PropTypes.string,
        name: PropTypes.string,
        slug: PropTypes.string,
    }).isRequired,
    summary: PropTypes.string.isRequired,
    ad: PropTypes.shape({
        path: PropTypes.string.isRequired,
        targeting: PropTypes.object.isRequired,
        flexSlotSize: PropTypes.arrayOf(PropTypes.shape({
            viewport: PropTypes.arrayOf(PropTypes.number),
            slot: PropTypes.arrayOf(
                PropTypes.arrayOf(PropTypes.number)
            ),
        })).isRequired,
        engageSlotSize: PropTypes.arrayOf(PropTypes.shape({
            viewport: PropTypes.arrayOf(PropTypes.number),
            slot: PropTypes.arrayOf(
                PropTypes.arrayOf(PropTypes.number)
            ),
        })).isRequired,
    }).isRequired,
    trackingUrls: PropTypes.arrayOf(PropTypes.string),
};