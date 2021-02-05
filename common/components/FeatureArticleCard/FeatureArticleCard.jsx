import React from 'react';
import PropTypes from 'prop-types';
import styles from './FeatureArticleCard.scss';
import Link from 'components/Link/Link';
import ResponsiveImage from 'components/ResponsiveImage/ResponsiveImage';
import PlayIcon from 'svgs/play-icon.svg';
import { convertSecondsToMinutes } from 'helpers/dates';

const FeatureArticleCard = ( {
	details,
	link,
	title,
	kicker,
	showPlayIcon,
	thumbnailAltText,
	thumbnailSrc,
	videoDuration,
} ) => (
	<Link to={link} className={styles.container}>
		<div className={styles.imageContainer}>
			{
				thumbnailSrc &&
				<ResponsiveImage
					alt={thumbnailAltText}
					aspectRatio={1.8}
					sources={[
						{
							breakpoint: 'phone-only',
							width: 220,
						},
						{
							breakpoint: 'tablet-portrait-up',
							width: 346,
						},
						{
							breakpoint: 'desktop-up',
							width: 666,
						},
					]}
					src={thumbnailSrc}
				/>
			}
			{
				showPlayIcon && <PlayIcon aria-label="Video" className={styles.playIcon} />
			}
			{
				videoDuration && <time className={styles.duration} dateTime={`${videoDuration}s`}>{convertSecondsToMinutes( videoDuration )}</time>
			}
		</div>
		{
			kicker &&
			<span className={styles.kicker}>{kicker}</span>
		}
		<span className={styles.title}>{title}</span>
		{
			details && <span className={styles.details}>{details}</span>
		}
	</Link>
);

FeatureArticleCard.defaultProps = {
	showPlayIcon: false,
};

FeatureArticleCard.propTypes = {
	details: PropTypes.string,
	kicker: PropTypes.string,
	link: PropTypes.string.isRequired,
	showPlayIcon: PropTypes.bool.isRequired,
	thumbnailAltText: PropTypes.string.isRequired,
	thumbnailSrc: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	videoDuration: PropTypes.number,
};

export default FeatureArticleCard;
