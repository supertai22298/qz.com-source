import React from 'react';
import classnames from 'classnames/bind';
import styles from './Footer.scss';
import Link from 'components/Link/Link';
import SubscribeCTAs from 'components/SubscribeCTAs/SubscribeCTAs';
import { ButtonLabel } from '@quartz/interface';
import QuartzLogo from 'svgs/quartz-logo.svg';
import Scribble from 'svgs/highlight-triple-underline.svg';
import usePageVariant from 'helpers/hooks/usePageVariant';

const cx = classnames.bind( styles );
const now = new Date();

const FooterDetails = ( props: { children: React.ReactNode; title: string; } ) => (
	<div className={cx( 'details' )}>
		<p className={cx( 'title' )}>{props.title}</p>
		<div>
			<ul className={cx( 'details-list' )}>
				{props.children}
			</ul>
		</div>
	</div>
);

const FooterLink = ( props: { children: React.ReactNode; to: string; } ) => (
	<li className={cx( 'details-item' )}>
		<Link className={cx( 'link' )} to={props.to}>{props.children}</Link>
	</li>
);

// A special element that will be picked up by OneTrust and used to launch a
// modal. Adding some inline styles to override their gross styling.
const OneTrustDoNotSellLink = () => {
	const style = {
		backgroundColor: 'inherit',
		border: 0,
		color: 'inherit',
		padding: 0,
	};

	return (
		<li className={styles.detailsItem}>
			<span className={`${styles.link} ot-sdk-show-settings`} id="ot-sdk-btn" style={style}>Do not sell my personal information</span>
		</li>
	);
};

export default function Footer () {
	const { isInApp } = usePageVariant();

	if ( isInApp ) {
		return null;
	}

	return (
		<footer className={cx( 'container' )}>
			<div className={cx( 'contents' )}>
				<div className={cx( 'main' )}>
					<div>
						<Link className={cx( 'link' )} to="/">
							<QuartzLogo className={cx( 'qz-logo' )} role="img" aria-label="Quartz" />
						</Link>
						<p className={cx( 'sub-logo' )}>
							Make <span className={styles.callout}>business<Scribble className={styles.scribble} /></span> better
						</p>
						<div className={cx( 'cta', 'top' )}>
							<SubscribeCTAs
								showLogin={false}
								style="side-by-side-small"
								subscribeLabel="Become a member"
								trackingContext="footer"
							/>
						</div>
					</div>
					<div className={cx( 'details-links' )}>
						<FooterDetails title="Discover">
							<FooterLink to="/guides/">Field guides</FooterLink>
							<FooterLink to="/emails/">Emails</FooterLink>
							<FooterLink to="/latest/">Latest</FooterLink>
							<FooterLink to="/popular/">Popular</FooterLink>
							<FooterLink to="/featured/">Featured</FooterLink>
							<FooterLink to="/obsessions/">Obsessions</FooterLink>
						</FooterDetails>
						<FooterDetails title="Topics">
							<FooterLink to="/topic/emerging-industries/">Emerging industries</FooterLink>
							<FooterLink to="/topic/finance-and-economics/">Economics</FooterLink>
							<FooterLink to="/topic/lifestyle/">Lifestyle</FooterLink>
							<FooterLink to="/topic/politics-and-policy/">Politics</FooterLink>
							<FooterLink to="/topic/science-and-human-behavior/">Science</FooterLink>
							<FooterLink to="/topic/tech-and-communications/">Tech</FooterLink>
							<FooterLink to="/topic/work-and-management/">Work</FooterLink>
						</FooterDetails>
						<FooterDetails title="More">
							<FooterLink to="/search/">Search</FooterLink>
							<FooterLink to="/careers/">Careers</FooterLink>
							<FooterLink to="/about/">About us</FooterLink>
							<FooterLink to="/about/#contact">Contact us</FooterLink>
							<FooterLink to="https://help.qz.com/en/">Help center</FooterLink>
							<FooterLink to="/creative/">Quartz Creative</FooterLink>
							<FooterLink to="/tips/">Send us tips</FooterLink>
						</FooterDetails>
					</div>
					<div className={cx( 'cta', 'bottom' )}>
						<SubscribeCTAs
							showLogin={false}
							style="side-by-side-small"
							subscribeLabel="Become a member"
							trackingContext="footer"
						/>
						<Link to="/app/" className={cx( 'app-button' )}>
							<ButtonLabel variant="secondary">Download our app</ButtonLabel>
						</Link>
					</div>
				</div>
				<div className={cx( 'small-links' )}>
					<ul className={cx( 'links' )}>
						<FooterLink to="/sitemap/">Site map</FooterLink>
						<FooterLink to="/about/terms-conditions/">Terms & conditions</FooterLink>
						<FooterLink to="/about/privacy-policy/">Privacy policy</FooterLink>
						<OneTrustDoNotSellLink />
						<FooterLink to="/about/privacy-policy/#_Toc28539902">Notice at Collection</FooterLink>
						<FooterLink to="/about/ethicsandadvertisingguidelines/">Ethics and advertising agreements</FooterLink>
					</ul>
				</div>
				<div className={cx( 'disclaimer' )}>
					<p>{`© ${now.getFullYear()} Quartz Media, Inc. All rights reserved.`}</p>
					<p>
						<a href="#top" className={cx( 'top-link', 'link' )}>↑ Beam me up, Scotty</a>
					</p>
				</div>
			</div>
		</footer>
	);
}
