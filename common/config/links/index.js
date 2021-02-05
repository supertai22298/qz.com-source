const links = {
    africa: {
        social: {
            facebook: 'https://www.facebook.com/QuartzAfrica/',
            twitter: 'https://twitter.com/qzafrica',
        },
        subscription: {
            name: 'Sign up for the Quartz Africa Weekly Brief',
            url: 'https://qz.com/newsletters/africa-weekly-brief/',
        },
    },
    india: {
        social: {
            twitter: 'https://twitter.com/qzindia',
        },
    },
    quartz: {
        social: {
            facebook: 'https://facebook.com/qz',
            twitter: 'https://twitter.com/qz',
            instagram: 'https://instagram.com/qz/',
            youtube: 'https://youtube.com/channel/UC9f78Z5hgtDt0n8JWyfBk8Q',
            linkedin: 'https://www.linkedin.com/company/quartz-an-atlantic-media-publication/',
        },
        subscription: {
            name: 'Sign up for the Quartz Daily Brief',
            url: 'https://qz.com/daily-brief',
        },
    },
    work: {
        social: {
            facebookGroup: 'https://facebook.com/groups/QuartzAtWork',
            twitter: 'https://twitter.com/QuartzAtWork',
            linkedin: 'https://www.linkedin.com/company/quartz-an-atlantic-media-publication/',
        },
        subscription: {
            name: 'Sign up for the Quartz Daily Brief',
            url: 'https://qz.com/daily-brief',
        },
    },
};

export default edition => links[edition] || links.quartz;