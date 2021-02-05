import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import styles from './AboutCultureTweet.scss';

const cx = classnames.bind( styles );

const AboutCultureTweet = ( { children, authorName, authorHandle, className } ) => (
	<div className={cx( 'container', className )}>
		<blockquote className={cx( 'contents' )}>
			<h4 className={cx( 'tweet' )}>{children}</h4>
			<p className={cx( 'source' )}><a href={`https://twitter.com/${authorHandle}`}>{authorName}</a>{` @${authorHandle}`}</p>
		</blockquote>
	</div>
);

AboutCultureTweet.propTypes = {
	authorHandle: PropTypes.string.isRequired,
	authorName: PropTypes.string.isRequired,
	children: PropTypes.node,
	className: PropTypes.string,
};

export default AboutCultureTweet;
