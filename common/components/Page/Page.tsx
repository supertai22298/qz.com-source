import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import classnames from 'classnames/bind';
import { EditionName } from '@quartz/content';
import { schemes, Spinner } from '@quartz/interface';
import { MarqueeAd } from 'components/Ad/Marquee/Marquee';
import SpotlightOverlay from 'components/Ad/SpotlightOverlay/SpotlightOverlay';
import ConsentForm from 'components/ConsentForm/ConsentForm';
import AppMeta from 'components/AppMeta/AppMeta';
import FeedLink from 'components/FeedLink/FeedLink';
import Footer from 'components/Footer/Footer';
import FrameMessagerParent from 'components/FrameMessagerParent/FrameMessagerParent';
import HoistedColorScheme from 'components/HoistedColorScheme/HoistedColorScheme';
import Navigation from 'components/SiteNavigation/SiteNavigation';
import PageMeta from 'components/PageMeta/PageMeta';
import SkipLinks from 'components/SkipLinks/SkipLinks';
import TabBar from 'components/TabBar/TabBar';
import WebPageSchema from 'components/Schema/WebPageSchema';
import { Redirect302Error } from 'helpers/errors';
import usePageVariant from 'helpers/hooks/usePageVariant';
import { resizeWPImage } from '@quartz/js-utils';
import { trackPageView } from 'helpers/tracking/actions';
import useAppMessage from 'helpers/hooks/useAppMessage';
import useRouteChangeBehavior from 'helpers/hooks/useRouteChangeBehavior';
import { useTrackingOnMount } from 'helpers/hooks/useTracking';
import styles from './Page.scss';

const cx = classnames.bind( styles );

type ColorSchemeProps = React.ComponentProps<typeof HoistedColorScheme>;

type ChromeProps = {
	children?: React.ReactNode,
	colorSchemes?: ColorSchemeProps[],
	edition?: EditionName,
	hideNavigation?: boolean,
	loading: boolean,
};

/**
 * This looks a bit heretical, but solves a very narrow use case. We only ever
 * mount one PageChrome component at a time, so we can safely store state as a
 * variable in the outer scope. This state stores the previous props that were
 * passed to PageChrome so that we continue to show the previous page's chrome
 * until we know what the next page's chrome will be. We need this bridge because
 * when navigating between pages, the entire route unmounts and the next route is
 * loaded asynchronously.
 *
 * If there were *any* chance of multiple instances of PageChrome being mounted
 * at the same time, we would need to use a state management tool like Redux or
 * React Context.
 */
let previousChromeProps: ChromeProps = {
	edition: 'QUARTZ',
	hideNavigation: false,
	loading: false,
};

const defaultColorSchemes: ColorSchemeProps[] = [
	{
		...schemes.LIGHT,
		type: 'default',
	},
	{
		...schemes.DARK,
		type: 'dark',
	},
];

function stateSelector ( state ) {
	return {
		marqueeVisible: state.marquee.visible,
		marqueeAdUnit: state.marquee.adUnit,
	};
}

function PageChrome ( props: ChromeProps ) {
	const currentProps = props.loading ? previousChromeProps : props;

	useEffect( () => {
		if ( props.loading ) {
			return;
		}

		// If the page is not loading, store the props as previous props for the next
		// render. They will be available for the next render that *is* loading.
		previousChromeProps = props;
	} );

	const {
		colorSchemes = defaultColorSchemes,
		hideNavigation,
		edition = 'QUARTZ',
	} = currentProps;

	const {
		marqueeVisible,
		marqueeAdUnit,
	} = useSelector( stateSelector );

	const appRef = useRouteChangeBehavior();

	return (
		<div
			className={cx( 'container', marqueeAdUnit, { marqueeVisible } )}
			ref={appRef}
		>
			{
				colorSchemes?.map( scheme => <HoistedColorScheme key={scheme.type} {...scheme} /> )
			}
			<HoistedColorScheme key="print" type="print" {...schemes.PRINT} />
			<SkipLinks hideNavigation={hideNavigation} />
			<MarqueeAd />
			{
				! hideNavigation &&
					<Navigation edition={edition} />
			}
			<main id="site-content" className={styles.main}>
				{props.children}
			</main>
			<ConsentForm />
			<FrameMessagerParent />
			<SpotlightOverlay />
			{
				! hideNavigation &&
					<TabBar />
			}
		</div>
	);
}

export function PageLoading () {
	return (
		<PageChrome loading={true}>
			<div className={styles.loading}>
				<Spinner />
			</div>
		</PageChrome>
	);
}

export default function Page ( props: {
	/**
	 * Canonical path of this page render to make sure that the URL in the user’s
	 * browser bar is correct. Use this to redirect the user to the right place.
	 */
	canonicalPath: string,

	/**
	 * The canonical URL of this piece of content. If provided, will produce a
	 * <link rel="canonical"> tag. Use this when there are multiple "flavors" of a
	 * page (e.g, regular, AMP, in-app) to point to the "main" flavor.
	 */
	canonicalUrl?: string,

	children: React.ReactNode,
	colorSchemes?: ColorSchemeProps[],
	feedLink?: string,
	hideNavigation?: boolean,
	noIndex?: boolean,
	pageDescription?: string,
	pageTitle: string,
	pageType: string,
	pageViewData?: any,
	showAppLinks?: boolean,
	socialImage?: string,
	socialTitle?: string,
} ) {
	const location = useLocation();
	const { edition, isInApp } = usePageVariant();

	// If this isn't the canonical path, redirect.
	if ( location.pathname !== props.canonicalPath ) {
		throw new Redirect302Error( props.canonicalPath );
	}

	useAppMessage( { logoVariant: edition } );

	useTrackingOnMount( trackPageView, {
		data: props.pageViewData,
		pageName: props.pageTitle,
		pageType: props.pageType,
		ventName: props.pageTitle,
		ventType: props.pageType,
	} );

	return (
		<>
			<AppMeta edition={edition} />
			<PageMeta
				canonicalUrl={props.canonicalUrl}
				description={props.pageDescription}
				imageUrl={props.socialImage && resizeWPImage( props.socialImage, 1200, 630, true )}
				includeApp={props.showAppLinks}
				isHome={'home' === props.pageType}
				pageTitle={props.pageTitle}
				noIndex={props.noIndex}
				shareTitle={props.socialTitle}
			/>
			<WebPageSchema
				description={props.pageDescription}
				edition={edition}
				location={location}
				name={props.pageTitle}
			/>
			{
				props.feedLink &&
					<FeedLink path={props.feedLink} title={props.pageTitle} />
			}
			<PageChrome
				colorSchemes={props.colorSchemes}
				edition={edition}
				hideNavigation={props.hideNavigation || isInApp}
				loading={false}
			>
				{props.children}
				<Footer />
			</PageChrome>
		</>
	);
}
