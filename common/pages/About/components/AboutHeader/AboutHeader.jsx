import React, { Fragment } from 'react';
import ProductsSection from './ProductsSection/ProductsSection';
import styles from './AboutHeader.scss';
import classnames from 'classnames/bind';

const cx = classnames.bind( styles );

const AboutHeader = () => (
	<Fragment>
		<div className={cx( 'content' )}>
			<p>
				Quartz was founded in 2012 to serve a new kind of business leader with bracingly creative and intelligent journalism that’s built for users first. We help our audience see around corners, navigate disruption in their industries, build fulfilling careers, broaden their views of the world, and enjoy lives rich with culture.
			</p>
			<p>
				Our coverage of the global economy is organized around core obsessions—topics and questions of seismic importance to business professionals. These are the issues that energize our newsroom, and we invite you to obsess about them along with us.
			</p>
			<p>
				Our employees are located around the world, with a significant presence in New York, Washington DC, London, Los Angeles, New Delhi, Hong Kong, San Francisco, and Nairobi. Collectively, we speak dozens of languages, reflecting our global perspective and belief in a more open and connected world.			</p>
			<p>
				To serve you best, we produce our journalism across a range of platforms, with a particular focus on design, user experience, and new forms of storytelling. We’ve grown from a single website and email into a suite of digital products and brands, which are listed below.
			</p>
		</div>
		<ProductsSection />
	</Fragment>
);

export default AboutHeader;
