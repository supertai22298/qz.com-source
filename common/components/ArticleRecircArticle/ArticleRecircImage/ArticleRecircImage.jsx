import React from 'react';
import PropTypes from 'prop-types';
import ArtDirection from 'components/ArtDirection/ArtDirection';
import styles from './ArticleRecircImage.scss';

const ArticleRecircImage = ( { sourceUrl } ) => {
	if ( ! sourceUrl ) {
		return null;
	}

	const sources = [
		{
			breakpoint: 'phone-only',
			url: sourceUrl,
			width: 80,
			height: 80,
		},
		{
			breakpoint: 'tablet-portrait-up',
			url: sourceUrl,
			width: 180,
			height: 101,
		},
	];

	return (
		<div className={styles.container}>
			<ArtDirection alt="" sources={sources} />
		</div>
	);
};

ArticleRecircImage.propTypes = {
	sourceUrl: PropTypes.string,
};

export default ArticleRecircImage;
