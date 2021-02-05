import React, { Fragment, useEffect, useState } from 'react';
import classnames from 'classnames/bind';
import styles from './SiteNavigation.scss';
import useGuides from 'data/hooks/useGuides';
import useLatestArticles from 'data/hooks/useLatestArticles';
import { getArticleProps } from 'helpers/data/article';
import useMenuItems from 'data/hooks/useMenuItems';
import useObsessions from 'data/hooks/useObsessions';
import useUserRole from 'helpers/hooks/useUserRole';
import AnimatedHamburgerIcon from 'svgs/hamburger-animated.svg';
import AvatarLoggedInIcon from 'svgs/default-avatar.svg';
import AvatarLoggedOutIcon from 'svgs/avatar-logged-out.svg';
import HamburgerIcon from 'svgs/hamburger.svg';
import Link from 'components/Link/Link';
import { ArticleStrip } from '@quartz/interface';
import { PlaceholderImage, PlaceholderParagraph } from 'components/Placeholder/Placeholder';
import SiteMenu from 'components/SiteMenu/SiteMenu';
import Switchboard from 'components/Switchboard/Switchboard';
import emails from 'config/emails';
import getMeta from 'config/meta';
import { trackNavClick } from 'helpers/tracking/actions';
import { withTracking } from 'helpers/wrappers';
import { EditionName } from '@quartz/content';

const cx = classnames.bind( styles );

const TrackedLink = withTracking( { onClick: trackNavClick } )( Link );
const TrackedButton = withTracking( { trackNavClick } )( ( { onClick, trackNavClick, ...props } ) => (
	<button
		{...props}
		onClick={() => {
			trackNavClick();
			onClick();
		}}
	/>
) );

function NavLinkWithFlyout( props: {
	FlyoutContents: () => JSX.Element,
	align: 'left' | 'right',
	children: React.ReactNode,
	description?: string,
	url: string,
} ) {
	const {
		FlyoutContents,
		align,
		children,
		description,
		url,
	} = props;

	// Use state to only render the potentially expensive flyout contents
	// when the flyout is made visible for the first time.
	// Show/hide functionality of the container is done using CSS.
	const [ flyoutOpenedOnce, setFlyoutOpenedOnce ] = useState( false );

	return (
		<Fragment>
			<TrackedLink
				ariaExpanded={false}
				className={cx( 'link', 'flyout-trigger', { withHover: flyoutOpenedOnce } )}
				onMouseEnter={() => setFlyoutOpenedOnce( true )}
				to={url}
			>{children}</TrackedLink>
			<div className={cx( 'flyout-container', align )}>
				{
					description && <p className={cx( 'flyout-description' )}>{description}</p>
				}
				{
					flyoutOpenedOnce && <FlyoutContents />
				}
			</div>
		</Fragment>
	);
}

function SwitchboardPlaceholder( props: { rows: number } ) {
	return (
		<Fragment>
			{
				new Array( props.rows )
					.fill( null )
					.map( ( _, index ) => (
						<div
							aria-label="Loading"
							className={styles.placeholderRow}
							key={index}
						>
							<div className={styles.placeholderImage}>
								<PlaceholderImage aspectRatio={1} />
							</div>
							<div className={styles.placeholderText}>
								<PlaceholderParagraph lines={2} />
							</div>
						</div>
					) )
			}
		</Fragment>
	);
}

function FieldGuides() {
	const data = useGuides( 10 );

	if ( ! data?.guides ) {
		return <SwitchboardPlaceholder rows={10} />;
	}

	return (
		<Switchboard
			items={data.guides.map( feature => ( {
				...feature,
				badgeUrl: feature.featuredImage?.sourceUrl,
				title: feature.name,
			} ) )}
			size="small"
		/>
	);
}

function Emails() {
	// Display emails from our config object that have a menuOrder
	// property and sort the emails by those values.
	const filteredEmails = Object.values( emails )
		.filter( email => email.menuOrder )
		.sort( ( a, b ) => a.menuOrder - b.menuOrder );

	return (
		<Switchboard
			items={filteredEmails.map( email => ( {
				...email,
				description: email.shortDescription,
				link: email.link,
				title: email.name,
			} ) )}
			size="small"
		/>
	);
}

function Featured() {
	const features = useMenuItems( 'FEATURED_QUARTZ', 6 );

	if ( ! features ) {
		return <SwitchboardPlaceholder rows={6} />;
	}

	return (
		<Switchboard
			items={features.map( feature => ( {
				...feature,
				badgeUrl: feature.featuredImage?.sourceUrl,
				link: feature.link,
			} ) )}
			size="small"
		/>
	);
}

function Obsessions() {
	const obsessions = useObsessions();

	if ( ! obsessions ) {
		return <SwitchboardPlaceholder rows={10} />;
	}

	return (
		<Switchboard
			items={obsessions.map( obsession => ( {
				...obsession,
				badgeUrl: obsession.featuredImage?.sourceUrl,
				description: obsession.shortDescription,
				title: obsession.name,
			} ) )}
			size="small"
		/>
	);
}

function LatestArticles() {
	const { posts } = useLatestArticles();

	if ( ! posts ) {
		return <SwitchboardPlaceholder rows={10} />;
	}

	return (
		<ul className={styles.latestArticles}>
			{
				posts.map( post => {
					const {
						dateGmt,
						edition,
						featuredImage,
						kicker,
						link,
						sponsor,
						title,
					} = getArticleProps( post );

					return (
						<li className={styles.latestArticleItem} key={post.id}>
							<Link to={link} className={styles.latestArticleLink}>
								<ArticleStrip
									dateGmt={dateGmt}
									edition={edition.name}
									kicker={kicker}
									size="small"
									sponsor={sponsor}
									thumbnailUrl={featuredImage?.sourceUrl}
									title={title}
								/>
							</Link>
						</li>
					);
				} )
			}
		</ul>
	);
}

function WordMark ( props: { edition: EditionName } ) {
	// todo: use GraphQL edition enums throughout instead of slugs
	const editionSlug = props.edition.toLowerCase();
	const { link, logo: Logo, title } = getMeta( editionSlug );

	return (
		<TrackedLink className={styles.logoLink} to={link} label={`${title} home`}>
			<Logo className={cx( 'logo', editionSlug )} />
		</TrackedLink>
	);
}

function SiteMenuToggle() {
	const [ togglesMenu, setTogglesMenu ] = useState( false );
	const [ showMenu, setShowMenu ] = useState( false );
	const handleKeydown = e => {
		if ( e.keyCode === 27 ) {
			setShowMenu( false );
		}
	};

	useEffect( () => {
		// Once the client-side application is available we can use a
		// button to toggle the menu. Until then we'll display a link to
		// the /menu/ page
		setTogglesMenu( true );
		// Close menu on esc key press
		document.addEventListener( 'keydown', handleKeydown );

		// Unbind key handler on cleanup
		return () => document.removeEventListener( 'keydown', handleKeydown );
	}, [] );

	if ( togglesMenu ) {
		return (
			<Fragment>
				<TrackedButton
					aria-expanded={showMenu}
					className={cx( 'link', 'toggle-menu' )}
					onClick={() => setShowMenu( ! showMenu )}
					title="Toggle menu"
				>
					<AnimatedHamburgerIcon className={cx( { open: showMenu } )} />
				</TrackedButton>
				<SiteMenu
					closeDropdown={() => setShowMenu( false )}
					inView={showMenu}
				/>
			</Fragment>
		);
	}

	return (
		<TrackedLink
			to="/menu/"
			className={styles.link}
			title="Menu"
		>
			<HamburgerIcon />
		</TrackedLink>
	);
}

function LogInOrProfileLink() {
	const { isLoggedIn } = useUserRole();

	if ( isLoggedIn ) {
		return (
			<TrackedLink
				className={styles.link}
				title="My profile"
				to="/settings/profile/"
			>
				<AvatarLoggedInIcon />
			</TrackedLink>
		);
	}

	return (
		<TrackedLink
			className={styles.link}
			title="Log in"
			to="/login/"
		>
			<AvatarLoggedOutIcon />
		</TrackedLink>
	);
}

function FieldGuidesOrMemberCTA() {
	const { isMember } = useUserRole();

	if ( isMember ) {
		return (
			<NavLinkWithFlyout
				FlyoutContents={FieldGuides}
				align="right"
				description="Inside the companies, people, and phenomena defining the global economy."
				url="/guides/"
			>Field guides</NavLinkWithFlyout>
		);
	}

	return (
		<TrackedLink className={styles.link} to="/subscribe/">
			<span className={styles.subscribeCta}>Become a member</span>
		</TrackedLink>
	);
}

export default function SiteNavigation( props: { edition: EditionName } ) {
	return (
		<Fragment>
			<div className={cx( 'scroll-border' )} aria-hidden={true} />
			<nav className={styles.container} aria-label="Site navigation" id="site-navigation">
				<ul className={styles.navItems}>
					<li className={cx( 'nav-item' )}>
						<SiteMenuToggle />
					</li>
					<li className={cx( 'nav-item', 'hide-on-mobile' )}>
						<TrackedLink className={styles.link} to="/discover/">Discover</TrackedLink>
					</li>
					<li className={cx( 'nav-item', 'hide-on-mobile' )}>
						<NavLinkWithFlyout
							FlyoutContents={LatestArticles}
							align="left"
							url="/latest/"
						>Latest</NavLinkWithFlyout>
					</li>
					<li className={cx( 'nav-item', 'hide-on-mobile' )}>
						<NavLinkWithFlyout
							FlyoutContents={Obsessions}
							align="left"
							description="These are the core obsessions that drive our newsroom—defining topics of seismic importance to the global economy."
							url="/obsessions/"
						>Obsessions</NavLinkWithFlyout>
					</li>
					<li className={styles.logoContainer}>
						<WordMark edition={props.edition} />
					</li>
					<li className={cx( 'nav-item', 'hide-on-mobile' )}>
						<NavLinkWithFlyout
							FlyoutContents={Featured}
							align="right"
							description="These are some of our most ambitious editorial projects. Enjoy!"
							url="/featured/"
						>Featured</NavLinkWithFlyout>
					</li>
					<li className={cx( 'nav-item', 'hide-on-mobile' )}>
						<NavLinkWithFlyout
							FlyoutContents={Emails}
							align="right"
							description="Our emails are made to shine in your inbox, with something fresh every morning, afternoon, and weekend."
							url="/emails/"
						>Emails</NavLinkWithFlyout>
					</li>
					<li className={cx( 'nav-item', 'hide-on-mobile' )}>
						<FieldGuidesOrMemberCTA />
					</li>
					<li className={cx( 'nav-item' )}>
						<LogInOrProfileLink />
					</li>
				</ul>
			</nav>
		</Fragment>
	);
}
