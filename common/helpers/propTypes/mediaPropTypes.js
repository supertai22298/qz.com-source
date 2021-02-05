import PropTypes from 'prop-types';

export default {
    altText: PropTypes.string,
    caption: PropTypes.string,
    credit: PropTypes.string,
    id: PropTypes.string,
    mediaDetails: PropTypes.shape({
        width: PropTypes.number,
        height: PropTypes.number,
    }),
    sourceUrl: PropTypes.string,
    title: PropTypes.string,
};