/**
 * WARNING for those editing this file:
 * ------------------------------------
 * This file governs the URL structure of qz.com. Adding new routes is generally
 * safe, but editing existing routes should be done with care. Please make sure
 * your changes are communicated to the entire engineering team, but especially
 * to engineers working on the iOS and Android app. Some URLs are hardcoded into
 * the app and may need to be updated.
 *
 * Additionally, please consider adding a 301 redirect from the old URL to the
 * new one.
 *
 * ============
 * REMEMBER TO:
 * ============
 *
 * 1. Use a trailing slash in the component’s `canonicalPath` if the URL has a
 *    trailing slash (and it probably should).
 *
 * 2. Double-backslash inside template literals and single quotes, but not
 *    inside double quotes (JSX voodoo):
 *      path={`/:id(\\d+)`}
 *      path="/:id(\d+)"
 *
 * 3. Keep the routes in alphabetical order by component name.
 *
 * 4. ... except for NotFound. That must go last, as a catch-all.
 */

import React from 'react';
import {
    Route,
    Switch
} from 'react-router-dom';
import {
    oneDayInSeconds
} from 'helpers/dates';
import CacheBehavior from 'components/CacheBehavior/CacheBehavior';
import ServerSideBehavior from 'components/SeverSideBehavior/ServerSideBehavior';
import {
    About,
    AppPage,
    Article,
    Author,
    BestCompaniesSubmission,
    Brief,
    Careers,
    Contributors,
    CreativeShowcase,
    Discover,
    Email,
    EmailInstantSignup,
    EmailList,
    EmailReferral,
    Emails,
    EmilyHome,
    Featured,
    Gift,
    Guide,
    Guides,
    Home,
    HomeWork,
    HtmlSitemap,
    HtmlSitemapPage,
    Latest,
    LivingBriefing,
    Login,
    MagicLink,
    MakingBusinessBetter,
    Menu,
    NotFound,
    Obsession,
    Obsessions,
    Popular,
    ResetPassword,
    Search,
    Series,
    Settings,
    Show,
    SponsorSeries,
    StaticPage,
    Subscribe,
    Tag,
    Topic,
} from './bundles';

// Centralize some common matches for easy reuse. Note that even though Quartzy
// has been sunset, it remains useful here since old Quartzy articles are still
// served at their existing URLs.
const allEditions = ':edition(africa|india|quartz|quartzy|work)';
const nonQuartzEditions = ':edition(africa|india|work)';
const pageVariant = ':variant(app|amp)';
const postId = ':postId(\\d+)';

const Routes = () => ( <
    Switch >
    <
    Route exact path = "/about" >
    <
    CacheBehavior baseKey = "about" / >
    <
    About / >
    <
    /Route>

    <
    Route exact path = "/app" >
    <
    CacheBehavior baseKey = "app-page" / >
    <
    AppPage / >
    <
    /Route>

    <
    Route exact path = {
        [
            `/${allEditions}?/${postId}/:postSlug?/${pageVariant}?`,
            `/:preview(preview)/${allEditions}?/${postId}/:time(\\d+)/:token`,
        ]
    } >
    <
    CacheBehavior baseKey = "post"
    maxAge = {
        oneDayInSeconds * 3
    }
    /> <
    Article / >
    <
    /Route>

    <
    Route exact path = "/login/by-email/:token?" >
    <
    CacheBehavior baseKey = "magic-link" / >
    <
    MagicLink / >
    <
    /Route>

    <
    Route exact path = "/login" >
    <
    CacheBehavior baseKey = "login" / >
    <
    Login / >
    <
    /Route>

    <
    Route exact path = "/author/:slug" >
    <
    CacheBehavior baseKey = "author" / >
    <
    Author / >
    <
    /Route>

    <
    Route exact path = "/is/best-companies-for-remote-workers" >
    <
    CacheBehavior baseKey = "best-companies" / >
    <
    BestCompaniesSubmission / >
    <
    /Route>

    <
    Route exact path = "/is/making-business-better" >
    <
    CacheBehavior baseKey = "making-better" / >
    <
    MakingBusinessBetter / >
    <
    /Route>

    <
    Route exact path = "/careers" >
    <
    CacheBehavior baseKey = "careers" / >
    <
    Careers / >
    <
    /Route>

    <
    Route exact path = "/:edition(work)/contributors" >
    <
    CacheBehavior baseKey = "contributors" / >
    <
    Contributors / >
    <
    /Route>

    <
    Route exact path = "/creative/:subpage(about|partner-menu)?" >
    <
    CacheBehavior baseKey = "creative-showcase" / >
    <
    CreativeShowcase / >
    <
    /Route>

    <
    Route exact path = "/discover/:tab?" >
    <
    CacheBehavior baseKey = "discover" / >
    <
    Discover / >
    <
    /Route>

    <
    Route exact path = "/emails/:list/:postId(\d+)" >
    <
    CacheBehavior baseKey = "email" / >
    <
    Email / >
    <
    /Route>

    <
    Route exact path = "/emails/:slug/instant-signup" >
    <
    CacheBehavior baseKey = "instant-signup" / >
    <
    EmailInstantSignup / >
    <
    /Route>

    <
    Route component = {
        EmailList
    }
    exact path = "/emails/:list"
    path = "/emails/:slug" >
    <
    CacheBehavior baseKey = "email-list" / >
    <
    EmailList / >
    <
    /Route>

    <
    Route exact path = "/emails/:list/refer" >
    <
    CacheBehavior baseKey = "email-referral" / >
    <
    EmailReferral / >
    <
    /Route>

    <
    Route exact path = "/emails" >
    <
    CacheBehavior baseKey = "emails" / >
    <
    Emails / >
    <
    /Route>

    <
    Route exact path = "/featured" >
    <
    CacheBehavior baseKey = "featured" / >
    <
    Featured / >
    <
    /Route>

    <
    Route exact path = "/gift/:success(success)?" >
    <
    CacheBehavior baseKey = "gift" / >
    <
    Gift / >
    <
    /Route>

    <
    Route exact path = "/guide/:slug/:tab(latest)?" >
    <
    CacheBehavior baseKey = "guide" / >
    <
    Guide / >
    <
    /Route>

    <
    Route exact path = "/guides/:topic?" >
    <
    CacheBehavior baseKey = "guides" / >
    <
    Guides / >
    <
    /Route>

    <
    Route exact path = {
        [
            '/:edition(africa|india|uk)?',
            `/home/preview/${postId}/:time(\\d+)/:token`,
        ]
    } >
    <
    CacheBehavior baseKey = "home" / >
    <
    Home / >
    <
    /Route>

    <
    Route exact path = {
        [
            '/💎',
            '/emily',
        ]
    } >
    <
    CacheBehavior baseKey = "home-emily" / >
    <
    EmilyHome / >
    <
    /Route>

    <
    Route exact path = "/:edition(work)" >
    <
    CacheBehavior baseKey = "home" / >
    <
    HomeWork / >
    <
    /Route>

    <
    Route exact path = "/sitemap/" >
    <
    CacheBehavior baseKey = "sitemap" / >
    <
    ServerSideBehavior renderStatic = {
        true
    }
    /> <
    HtmlSitemap / >
    <
    /Route>

    <
    Route exact path = "/sitemap/:slug/:year?" >
    <
    CacheBehavior baseKey = "sitemap" / >
    <
    ServerSideBehavior renderStatic = {
        true
    }
    /> <
    HtmlSitemapPage / >
    <
    /Route>

    <
    Route exact path = {
        `/${nonQuartzEditions}?/latest`
    } >
    <
    CacheBehavior baseKey = "latest" / >
    <
    Latest / >
    <
    /Route>

    <
    Route exact path = "/briefing/:slug(coronavirus)" >
    <
    CacheBehavior baseKey = "briefing" / >
    <
    LivingBriefing / >
    <
    /Route>

    <
    Route path = {
        `/briefing/:slug(coronavirus)/${postId}`
    } >
    <
    CacheBehavior baseKey = "brief" / >
    <
    Brief / >
    <
    /Route>

    <
    Route exact path = "/menu" >
    <
    CacheBehavior baseKey = "menu" / >
    <
    Menu / >
    <
    /Route>

    <
    Route exact path = {
        [
            '/on/:slug/:tab(latest)?',
            '/:edition(work)/on/:slug',
        ]
    } >
    <
    CacheBehavior baseKey = "obsession" / >
    <
    Obsession / >
    <
    /Route>

    <
    Route exact path = {
        [
            '/obsessions',
            '/:edition(work)/obsessions',
        ]
    } >
    <
    CacheBehavior baseKey = "obsessions" / >
    <
    Obsessions / >
    <
    /Route>

    <
    Route exact path = {
        `/${nonQuartzEditions}?/popular`
    } >
    <
    CacheBehavior baseKey = "popular" / >
    <
    Popular / >
    <
    /Route>

    <
    Route exact path = "/reset-password/:token?" >
    <
    CacheBehavior baseKey = "reset-password" / >
    <
    ResetPassword / >
    <
    /Route>

    <
    Route exact path = "/search/:search?" >
    <
    CacheBehavior baseKey = "search" / >
    <
    Search / >
    <
    /Route>

    <
    Route exact path = "/se/:slug(new-frontier-workplace-experience|future-of-employee-healthcare)" >
    <
    CacheBehavior baseKey = "series" / >
    <
    SponsorSeries / >
    <
    /Route>

    <
    Route exact path = "/se/:slug" >
    <
    CacheBehavior baseKey = "series" / >
    <
    Series / >
    <
    /Route>

    <
    Route exact path = "/:locale(japan)?/settings/:tab(profile|security|membership)" >
    <
    CacheBehavior baseKey = "settings" / >
    <
    Settings / >
    <
    /Route>

    <
    Route exact path = "/show/:slug" >
    <
    CacheBehavior baseKey = "show" / >
    <
    Show / >
    <
    /Route>

    <
    Route path = {
        `:uri(${[
				'/about/cookies-notice',
				'/about/diversity-inclusion-equality-at-quartz',
				'/about/ethicsandadvertisingguidelines',
				'/about/io-addendum',
				'/about/privacy-policy',
				'/about/privacy-shield',
				'/about/quartz-daily-brief-referral-sweepstakes',
				'/about/referral-terms-and-conditions',
				'/about/terms-conditions',
				'/about/third-party-partners',
				'/japan/about/act-on-specified-commercial-transactions',
				'/japan/about/privacy-policy',
				'/japan/about/terms-conditions',
			].join( '|' )})`
    } >
    <
    CacheBehavior baseKey = "static" / >
    <
    StaticPage / >
    <
    /Route>

    <
    Route exact path = {
        [
            '/:locale(japan)',
            '/:locale(japan)?/:method(subscribe)/:step(email|payment|password|profile|newsletter|confirmation)?',
        ]
    } >
    <
    CacheBehavior baseKey = "subscribe" / >
    <
    Subscribe / >
    <
    /Route>

    <
    Route exact path = "/re/:slug" >
    <
    CacheBehavior baseKey = "tag" / >
    <
    Tag / >
    <
    /Route>

    <
    Route exact path = "/topic/:slug" >
    <
    CacheBehavior baseKey = "topic" / >
    <
    Topic / >
    <
    /Route>

    <
    Route >
    <
    CacheBehavior baseKey = "error" / >
    <
    NotFound / >
    <
    /Route> <
    /Switch>
);

export default Routes;