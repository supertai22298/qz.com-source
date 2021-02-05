export const baseUrl = 'https://qz.com';
export const baseAssetUrl = 'https://cms.qz.com';
export const baseFeedUrl = `${baseAssetUrl}/feed`;
import QuartzLogo from 'svgs/quartz-logo.svg';
import WorkLogo from 'svgs/quartz-at-work-logo.svg';
import AfricaLogo from 'svgs/quartz-africa-logo.svg';
import IndiaLogo from 'svgs/quartz-india-logo.svg';

const meta = {
    quartz: {
        description: 'Quartz is a guide to the new global economy for people in business who are excited by change. We cover business, economics, markets, finance, technology, science, design, and fashion.',
        favicon: {
            light: '/public/images/favicon-light-mode.ico',
            dark: '/public/images/favicon-dark-mode.ico',
        },
        iconUrl: 'https://cms.qz.com/wp-content/uploads/2020/04/qz-icon.jpg',
        link: '/',
        logo: QuartzLogo,
        manifest: '/public/meta/manifest.json',
        openGraphImage: 'https://cms.qz.com/wp-content/uploads/2018/07/quartz-og.jpg',
        shortDescription: 'Global business journalism about how the world is changing.',
        subtitle: 'Global business news and insights',
        themeColor: '#000000',
        title: 'Quartz',
        twitterName: 'qz',
    },

    africa: {
        link: '/africa/',
        subtitle: 'Stories of innovation across the continent',
        shortDescription: 'Stories of innovation across the continent’s wide-ranging economies.',
        description: 'Quartz Africa is a guide to the important stories of innovation across the continent’s wide-ranging economies. Our journalists in Africa write for both local and global readers.',
        title: 'Quartz Africa',
        twitterName: 'qzafrica',
        openGraphImage: 'https://cms.qz.com/wp-content/uploads/2018/07/quartz-africa-og.jpg',
        iconUrl: 'https://cms.qz.com/wp-content/uploads/2018/07/quartz-africa-icon.jpg',
        logo: AfricaLogo,
    },

    india: {
        description: 'Quartz India is a guide to the world’s fastest-growing major economy. We provide in-depth coverage of the country for India and its far-flung diaspora.',
        iconUrl: 'https://cms.qz.com/wp-content/uploads/2018/07/quartz-india-icon.jpg',
        link: '/india/',
        logo: IndiaLogo,
        openGraphImage: 'https://cms.qz.com/wp-content/uploads/2018/07/quartz-india-og.jpg',
        shortDescription: 'In-depth coverage of the world’s largest democracy',
        subtitle: 'In-depth coverage of the world’s largest democracy',
        title: 'Quartz India',
        twitterName: 'qzindia',
    },

    work: {
        description: 'Quartz at Work is a guide to being a better manager, building a career, and navigating the modern workplace.',
        iconUrl: 'https://cms.qz.com/wp-content/uploads/2018/07/quartz-at-work-icon.jpg',
        link: '/work/',
        logo: WorkLogo,
        openGraphImage: 'https://cms.qz.com/wp-content/uploads/2018/07/quartz-at-work-og.jpg',
        shortDescription: 'Management news, advice, and ideas for business leaders',
        subtitle: 'Management news, advice, and ideas for business leaders',
        title: 'Quartz at Work',
        twitterName: 'quartzatwork',
    },
};

// Extend each edition with defaults (Quartz).
Object.keys(meta).forEach(key => meta[key] = Object.assign({}, meta.quartz, meta[key]));

export const editions = Object.values(meta);

export default edition => meta[edition] || meta.quartz;