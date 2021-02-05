import {
    offerCodeCtaText as cta
} from 'config/membership';

const landingPagePromoVariants = [{
        default: true,
    },
    {
        title: 'Become a Quartz member.',
        description: 'Go beyond the headlines to master your understanding of the forces reshaping the world. Get interviews with top CEOs, deep analysis of frontier industries, and exclusive access to our journalists.',
        cta,
        image: '',
        showPerks: true,
    },
    {
        title: 'Unlock Because China and other premium series',
        description: 'Chinese people are reshaping global tourism, education, technology, and more. But superpowers are rare, and each is different—China won’t be like the United States. Subscribe to membership to unlock this series, and unlimited Quartz content.',
        cta,
        image: '',
        showPerks: true,
    },
    {
        title: 'Unlock Because China and other premium series',
        description: 'Chinese people are reshaping global tourism, education, technology, and more. But superpowers are rare, and each is different—China won’t be like the United States. Subscribe to membership to unlock this series, and unlimited Quartz content.',
        cta,
        image: '',
        showPerks: false,
    },
    {
        title: 'While you’re busy building the future, we’ll help you understand it',
        description: 'Go beyond the headlines to master your understanding of the forces reshaping the world. Get interviews with top CEOs, deep analysis of frontier industries, and exclusive access to our journalists.',
        cta,
        image: '',
        showPerks: true,
    },
];

const getVariants = (variant) => landingPagePromoVariants[variant];

export default getVariants;