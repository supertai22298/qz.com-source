import PropTypes from 'prop-types';
import mediaPropTypes from './mediaPropTypes';

export default {
    bulletin: PropTypes.shape({
        sponsor: PropTypes.shape({
            name: PropTypes.string.isRequired,
        }).isRequired,
        campaign: PropTypes.shape({
            logo: PropTypes.string,
        }).isRequired,
        clientTracking: PropTypes.shape({
            article: PropTypes.array.isRequired,
            logo: PropTypes.string,
        }).isRequired,
    }),
    dateGmt: PropTypes.string,
    editions: PropTypes.arrayOf(PropTypes.shape({
        slug: PropTypes.string,
        name: PropTypes.string,
    })),
    featuredImage: PropTypes.shape(mediaPropTypes),
    guide: PropTypes.shape({
        slug: PropTypes.string,
        name: PropTypes.string,
        link: PropTypes.string,
    }),
    id: PropTypes.string.isRequired,
    kicker: PropTypes.string,
    link: PropTypes.string.isRequired,
    postId: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    series: PropTypes.shape({
        slug: PropTypes.string,
        name: PropTypes.string,
        link: PropTypes.string,
    }),
};