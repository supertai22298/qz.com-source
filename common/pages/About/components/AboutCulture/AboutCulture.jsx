import React, { Fragment } from 'react';
import classnames from 'classnames/bind';
import Link from 'components/Link/Link';
import styles from './AboutCulture.scss';
import PageSectionHeader from 'components/Page/PageSectionHeader/PageSectionHeader';
import Photo from 'components/Photo/Photo';
import AboutCultureTweet from './AboutCultureTweet/AboutCultureTweet';
import photos from './photos.json';

const cx = classnames.bind( styles );

function getPhoto( index ) {
	const photo = photos[index];
	if ( typeof photo !== 'undefined' ) {
		const { alt, src, title, widths, ratio } = photo;
		return <Photo alt={alt} src={src} title={title} widths={widths} ratio={ratio} className={cx( `photo-${index}` )} />;
	}
}

const AboutCulture = () => (
	<Fragment>
		<PageSectionHeader title="#qzlife" id="culture" />
		<p className={cx( 'intro' )}>Quartz is defined, more than anything, by the people who work here. We're all different, but share a common affinity for that #qzlife.</p>
		{getPhoto( 0 )}
		<div className={cx( 'pinboard' )}>
			<div className={cx( 'row' )}>
				{getPhoto( 1 )}
				<AboutCultureTweet authorName="Kira Bindrim" authorHandle="KiraBind">No one here is fancy.</AboutCultureTweet>
			</div>
			<div className={cx( 'row' )}>
				{getPhoto( 2 )}
				{getPhoto( 3 )}
				<AboutCultureTweet className={cx( 'tweet-2' )} authorName="Annalisa Merelli" authorHandle="missanabeem">Did the product team 3D print <a title="Quartz on Twitter" href="https://twitter.com/qz">@qz</a> cocktail picks for their cocktails? You bet they did. <a title="#qzlife on Twitter" href="https://twitter.com/hashtag/qzlife">#qzlife</a></AboutCultureTweet>
			</div>
			<div className={cx( 'row' )}>
				{getPhoto( 4 )}
				{getPhoto( 5 )}
			</div>
			<div className={cx( 'row' )}>
				<div className={cx( 'annotation' )}>
					See what we are up to on <Link to="https://blog.qz.com/">our blog</Link> and follow us on <Link to="https://twitter.com/qz">Twitter</Link>.
				</div>
			</div>
		</div>
	</Fragment>
);

export default AboutCulture;
