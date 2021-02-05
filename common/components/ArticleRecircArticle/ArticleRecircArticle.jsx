import React from 'react';
import PropTypes from 'prop-types';
import compose from 'helpers/compose';
import articlePropTypes from 'helpers/propTypes/articlePropTypes';
import Link from 'components/Link/Link';
import BulletinKicker from 'components/BulletinKicker/BulletinKicker';
import ArticleRecircImage from './ArticleRecircImage/ArticleRecircImage';
import { stringifyUrlParams } from 'helpers/urls';
import styles from './ArticleRecircArticle.scss';
import { formatDate } from 'helpers/dates';
import { trackNavigationClickModule as onClick, trackNavigationViewModule as onMount } from 'helpers/tracking/actions';
import { withTracking, withVisibilityTracking } from 'helpers/wrappers';

export const ArticleRecircArticle = ( { article, className, onClick, urlParams } ) => {
	const {
		bulletin,
		dateGmt,
		edition,
		featuredImage,
		link,
		title,
	} = article;

	const formattedDate = formatDate( dateGmt );
	const stringifiedUrlParams = stringifyUrlParams( urlParams );
	const rel = bulletin ? 'nofollow' : null;

	return (
		<div className={styles.container}>
			<Link
				to={`${link}${stringifiedUrlParams}`}
				className={`${styles.link} ${className}`}
				onClick={onClick}
				rel={rel}
			>
				<ArticleRecircImage sourceUrl={featuredImage?.sourceUrl} />
				<div className={styles.meta}>
					{
						bulletin &&
						<BulletinKicker sponsor={bulletin.sponsor.name} />
					}
					<span className={styles.headline}>{title}</span>
					<div className={styles.dateline}>
						{formattedDate}
						<span className={styles.edition}>{edition.name}</span>
					</div>
				</div>
			</Link>
		</div>
	);
};

ArticleRecircArticle.propTypes = {
	article: PropTypes.shape( articlePropTypes ).isRequired,
	className: PropTypes.string.isRequired,
	onClick: PropTypes.func.isRequired,
	urlParams: PropTypes.object.isRequired,
};

ArticleRecircArticle.defaultProps = {
	className: '',
	urlParams: {},
	onClick: () => {},
};

export default compose(
	withTracking( { onClick } ),
	withVisibilityTracking( { onMount } )
)( ArticleRecircArticle );
