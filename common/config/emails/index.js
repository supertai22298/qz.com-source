/*
	Config explanation:
	- menuOrder - used in the nav Email dropdown; no menuOrder, and it won't appear
	- shortDescription - the description of the email used in the EmailSignup component
	- title - promotional copy used as EmailSignup title prop when that email is the primary Email for that component
	* note - this hardcoding is temporary - ultimately, this should come from the CMS
*/
const emails = {
    'daily-brief': {
        link: '/emails/daily-brief/',
        badgeUrl: 'https://qz.com/public/svg/badge-quartz-default.svg',
        listId: 3224114,
        menuOrder: 1,
        name: 'Quartz Daily Brief',
        shortDescription: 'The concise, conversational rundown you need to start your day',
        title: 'Kick off each morning with coffee and the Daily Brief (BYO coffee).',
        frequency: 'Every morning except Sunday',
        canonicalSegment: 'americas',
        kicker: 'What you need to know',
    },
    'quartz-obsession': {
        link: '/emails/quartz-obsession/',
        badgeUrl: 'https://qz.com/public/svg/badge-obsession.svg',
        listId: 1827166,
        menuOrder: 2,
        name: 'Quartz Weekly Obsession',
        shortDescription: 'An interactive email on the fascinating histories of everyday ideas',
        title: 'Want to escape the news cycle? Try our Weekly Obsession.',
        frequency: 'Weekly',
        kicker: 'Go down the rabbit hole',
    },
    'members-editorial': {
        listId: 10299706,
        name: 'For Quartz members',
        shortDescription: 'Deep dives into the companies, people, and phenomena defining the global economy',
        frequency: 'Weekly',
    },
    'quartz-at-work': {
        link: '/emails/quartz-at-work',
        badgeUrl: 'https://qz.com/public/svg/badge-quartz-at-work.svg',
        listId: 3225180,
        menuOrder: 3,
        name: 'The Memo from Quartz at Work',
        shortDescription: 'Practical advice for modern workers everywhere',
        title: 'Sign up for our weekly email on the future of work.',
        frequency: 'Weekly',
        kicker: 'For modern workers everywhere',
    },
    'africa-weekly-brief': {
        link: '/emails/africa-weekly-brief/',
        badgeUrl: 'https://qz.com/public/svg/badge-africa.svg',
        listId: 2985278,
        menuOrder: 4,
        name: 'Quartz Africa Weekly Brief',
        shortDescription: 'News and culture from around the continent',
        title: 'Keep up with developments and emerging industries in Africa.',
        frequency: 'Weekly',
        kicker: 'News from the continent',
    },
    coronavirus: {
        link: '/emails/coronavirus/',
        badgeUrl: 'https://qz.com/public/svg/badge-coronavirus.svg',
        listId: 11090937,
        menuOrder: 5,
        name: 'Need to Know: Coronavirus',
        shortDescription: 'A calm, rational, even curious approach to the pandemic',
        title: 'Want to keep up with Covid-19? There’s an email for that.',
        frequency: 'Weekly',
        kicker: 'Tracking a pandemic',
    },
    'space-business': {
        link: '/emails/space-business/',
        listId: 7827898,
        name: 'Space Business',
        shortDescription: 'A glimpse at the economic possibilities of space',
        title: 'Discover the innovators behind growing investment in space.',
        frequency: 'Weekly',
        kicker: 'Eyeing the extraterrestrial sphere',
    },
    'the-race-to-zero-emissions': {
        link: '/emails/the-race-to-zero-emissions/',
        listId: 7827889,
        name: 'The Race to Zero Emissions',
        shortDescription: 'How the global economy is meeting the climate challenge',
        title: 'Sign up for a weekly status report on the fight against climate change.',
        frequency: 'Weekly',
    },
};

const japanConfig = {
    'quartz-japan': {
        link: '/japan/subscribe/',
        listId: 9675205,
        name: 'Quartz Japan',
        shortDescription: 'A glimpse at the future of the global economy-in Japanese',
        title: 'Keep up with developments in business, econ, international relations, and consumer culture.',
        frequency: 'Every weekday morning and afternoon',
        filterableSegments: ['am', 'pm', 'weekend'],
    },
};

// used in EmailsSection - the difference is, we include Quartz Japan - order these in the order we wish them to appear
const emailList = [
    'daily-brief',
    'quartz-at-work',
    'coronavirus',
    'quartz-obsession',
    'africa-weekly-brief',
    'space-business',
    'quartz-japan',
];

const allEmails = Object.assign({}, emails, japanConfig);

export {
    allEmails,
    emails as
    default,
    emailList,
    japanConfig,
};