import React from 'react';
import Loadable from 'react-loadable';
import {
    PageLoading
} from 'components/Page/Page';

/*
	the `import` statements are used as split points for webpack to create
	new chunks from -- i.e. each route will output a new chunk
*/

const loading = () => < PageLoading / > ;

export const Home = Loadable({
    loader: () =>
        import ( /* webpackChunkName: "Home" */ '../pages/Home/Home'),
    loading,
});

export const HomeWork = Loadable({
    loader: () =>
        import ( /* webpackChunkName: "HomeWork" */ '../pages/HomeWork/HomeWork'),
    loading,
});

export const Article = Loadable({
    loader: () =>
        import ( /* webpackChunkName: "Article" */ '../pages/Article/Article'),
    loading,
});

export const Latest = Loadable({
    loader: () =>
        import ( /* webpackChunkName: "Latest" */ '../pages/Latest/Latest'),
    loading,
});

export const Login = Loadable({
    loader: () =>
        import ( /* webpackChunkName: "Login" */ '../pages/Login/Login'),
    loading,
});

export const ResetPassword = Loadable({
    loader: () =>
        import ( /* webpackChunkName: "ResetPassword" */ '../pages/ResetPassword/ResetPassword'),
    loading,
});

export const MagicLink = Loadable({
    loader: () =>
        import ( /* webpackChunkName: "MagicLink" */ '../pages/MagicLink/MagicLink'),
    loading,
});

export const Popular = Loadable({
    loader: () =>
        import ( /* webpackChunkName: "Popular" */ '../pages/Popular/Popular'),
    loading,
});

export const About = Loadable({
    loader: () =>
        import ( /* webpackChunkName: "About" */ '../pages/About/About'),
    loading,
});

export const Emails = Loadable({
    loader: () =>
        import ( /* webpackChunkName: "Emails" */ '../pages/Emails/Emails'),
    loading,
});

export const AppPage = Loadable({
    loader: () =>
        import ( /* webpackChunkName: "AppPage" */ '../pages/AppPage/AppPage'),
    loading,
});

export const StaticPage = Loadable({
    loader: () =>
        import ( /* webpackChunkName: "StaticPage" */ '../pages/StaticPage/StaticPage'),
    loading,
});

export const EmailList = Loadable({
    loader: () =>
        import ( /* webpackChunkName: "EmailList" */ '../pages/EmailList/EmailList'),
    loading,
});

export const EmailReferral = Loadable({
    loader: () =>
        import ( /* webpackChunkName: "EmailReferral" */ '../pages/EmailReferral/EmailReferral'),
    loading,
});

export const Careers = Loadable({
    loader: () =>
        import ( /* webpackChunkName: "Careers" */ '../pages/Careers/Careers'),
    loading,
});

export const Menu = Loadable({
    loader: () =>
        import ( /* webpackChunkName: "Menu" */ '../pages/Menu/Menu'),
    loading,
});

export const Obsessions = Loadable({
    loader: () =>
        import ( /* webpackChunkName: "Obsessions" */ '../pages/Obsessions/Obsessions'),
    loading,
});

export const Series = Loadable({
    loader: () =>
        import ( /* webpackChunkName: "Series" */ '../pages/Series/Series'),
    loading,
});

export const SponsorSeries = Loadable({
    loader: () =>
        import ( /* webpackChunkName: "SponsorSeries" */ '../pages/SponsorSeries/SponsorSeries'),
    loading,
});

export const Show = Loadable({
    loader: () =>
        import ( /* webpackChunkName: "Show" */ '../pages/Show/Show'),
    loading,
});

export const Obsession = Loadable({
    loader: () =>
        import ( /* webpackChunkName: "Obsession" */ '../pages/Obsession/Obsession'),
    loading,
});

export const Featured = Loadable({
    loader: () =>
        import ( /* webpackChunkName: "Featured" */ '../pages/Featured/Featured'),
    loading,
});

export const Search = Loadable({
    loader: () =>
        import ( /* webpackChunkName: "Search" */ '../pages/Search/Search'),
    loading,
});

export const Tag = Loadable({
    loader: () =>
        import ( /* webpackChunkName: "Tag" */ '../pages/Tag/Tag'),
    loading,
});

export const Topic = Loadable({
    loader: () =>
        import ( /* webpackChunkName: "Topic" */ '../pages/Topic/Topic'),
    loading,
});

export const Author = Loadable({
    loader: () =>
        import ( /* webpackChunkName: "Author" */ '../pages/Author/Author'),
    loading,
});

export const Contributors = Loadable({
    loader: () =>
        import ( /* webpackChunkName: "Contributors" */ '../pages/Contributors/Contributors'),
    loading,
});

export const Discover = Loadable({
    loader: () =>
        import ( /* webpackChunkName: "Discover" */ '../pages/Discover/Discover'),
    loading,
});

export const HtmlSitemap = Loadable({
    loader: () =>
        import ( /* webpackChunkName: "HtmlSitemap" */ '../pages/HtmlSitemap/HtmlSitemap'),
    loading,
});

export const HtmlSitemapPage = Loadable({
    loader: () =>
        import ( /* webpackChunkName: "HtmlSitemapPage" */ '../pages/HtmlSitemapPage/HtmlSitemapPage'),
    loading,
});

export const NotFound = Loadable({
    loader: () =>
        import ( /* webpackChunkName: "NotFound" */ '../pages/NotFound/NotFound'),
    loading,
});

export const Email = Loadable({
    loader: () =>
        import ( /* webpackChunkName: "Email" */ '../pages/Email/Email'),
    loading,
});

export const EmailInstantSignup = Loadable({
    loader: () =>
        import ( /* webpackChunkName: "EmailInstant" */ '../pages/EmailInstantSignup/EmailInstantSignup'),
    loading,
});

export const Settings = Loadable({
    loader: () =>
        import ( /* webpackChunkName: "Settings" */ '../pages/Settings/Settings'),
    loading,
});

export const Gift = Loadable({
    loader: () =>
        import ( /* webpackChunkName: "Gift" */ '../pages/Gift/Gift'),
    loading,
});

export const Guide = Loadable({
    loader: () =>
        import ( /* webpackChunkName: "Guide" */ '../pages/Guide/Guide'),
    loading,
});

export const Guides = Loadable({
    loader: () =>
        import ( /* webpackChunkName: "Guides" */ '../pages/Guides/Guides'),
    loading,
});

export const Subscribe = Loadable({
    loader: () =>
        import ( /* webpackChunkName: "Subscribe" */ '../pages/Subscribe/Subscribe'),
    loading,
});

export const CreativeShowcase = Loadable({
    loader: () =>
        import ( /* webpackChunkName: "CreativeShowcase" */ '../pages/CreativeShowcase/CreativeShowcase'),
    loading,
});

export const LivingBriefing = Loadable({
    loader: () =>
        import ( /* webpackChunkName: "LivingBriefing" */ '../pages/LivingBriefing/LivingBriefing'),
    loading,
});

export const BestCompaniesSubmission = Loadable({
    loader: () =>
        import ( /* webpackChunkName: "BestCompaniesSubmission" */ '../pages/BestCompaniesSubmission/BestCompaniesSubmission'),
    loading,
});

export const Brief = Loadable({
    loader: () =>
        import ( /* webpackChunkName: "Brief" */ '../pages/Brief/Brief'),
    loading,
});

export const EmilyHome = Loadable({
    loader: () =>
        import ( /* webpackChunkName: "EmilyHome" */ '../pages/Home/EmilyHome'),
    loading,
});

export const MakingBusinessBetter = Loadable({
    loader: () =>
        import ( /* webpackChunkName: "MakingBusinessBetter" */ '../pages/MakingBusinessBetter/MakingBusinessBetter'),
    loading,
});