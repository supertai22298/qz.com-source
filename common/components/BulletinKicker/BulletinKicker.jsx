import React from 'react';
import PropTypes from 'prop-types';
import { Kicker } from '@quartz/interface';
import styles from './BulletinKicker.scss';
import Image from 'components/Image/Image';

const BulletinKicker = ( { label, sponsor, attribution, image, link } ) => {
	// @todo Fix output on API side.
	let output = sponsor.replace( /&amp;/g, '&' );

	// image gets output on article page, text everywhere else
	if ( image ) {
		const logo = <Image src={image} alt={sponsor} width={150} height={50}/>;
		output = link ? <a href={link} target="_blank" rel="noopener">{logo}</a> : logo;
	}

	return (
		<Kicker>
			<div className={styles.container}>
				<span className={styles.label}>{label}</span>
				<span>{attribution}</span>
				<span>{output}</span>
			</div>
		</Kicker>
	);
};

BulletinKicker.propTypes = {
	attribution: PropTypes.string,
	image: PropTypes.string,
	label: PropTypes.string,
	link: PropTypes.string,
	sponsor: PropTypes.string.isRequired,
};

BulletinKicker.defaultProps = {
	label: 'Sponsor Content',
	attribution: ' By ',
};

export default BulletinKicker;
