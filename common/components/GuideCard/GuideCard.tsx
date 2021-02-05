import React from 'react';
import { GuidePartsFragment, MediaPartsFragment } from '@quartz/content';
import classnames from 'classnames/bind';
import styles from './GuideCard.scss';
import Link from 'components/Link/Link';
import ResponsiveImage from 'components/ResponsiveImage/ResponsiveImage';

const cx = classnames.bind( styles );

function GuideCardImage ( props: { featuredImage?: MediaPartsFragment | null } ) {
	if ( !props.featuredImage?.sourceUrl ) {
		return null;
	}
	const { altText, sourceUrl } = props.featuredImage;
	const sources = [
		{
			breakpoint: 'phone-only',
			width: 285,
		},
		{
			breakpoint: 'desktop-up',
			width: 382,
		},
	];

	return (
		<ResponsiveImage
			alt={altText ?? ''}
			aspectRatio={0.7125}
			sources={sources}
			src={sourceUrl}
		/>
	);
}

export default function GuideCard (
	props: Partial<GuidePartsFragment> & { size?: 'large' | 'small' }
) {
	const size = props.size ?? 'large';
	return (
		<Link to={props.link} className={cx( 'container' )}>
			<div className={cx( 'thumbnail' )}>
				<GuideCardImage featuredImage={props.featuredImage} />
			</div>
			<div className={cx( 'description-container' )}>
				<span className={cx( 'title', size )}>{props.name}</span>
				<p className={cx( 'short-description', size )}>{props.shortDescription}</p>
			</div>
		</Link>
	);
}
