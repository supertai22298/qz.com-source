import React, {
    Fragment
} from 'react';
import classnames from 'classnames/bind';
import styles from './NewPerks.scss';
import Link from 'components/Link/Link';
import EmojiList from 'components/EmojiList/EmojiList';
import PropTypes from 'prop-types';
import usePageVariant from 'helpers/hooks/usePageVariant';

const cx = classnames.bind(styles);

const items = {
    long: [{
            title: 'Unlimited access to award winning journalism',
            description: < Fragment > Goodbye paywall!With unlimited access to Quartz you’ ll get contextualized,
            digestible,
            and < Link to = "/discover/" > high - quality business news < /Link> that offers a <Link to="/obsessions / ">fresh perspective</Link> on the ideas and trends shaping the global economy.</Fragment>,
            bullet: '🔐',
        },
        {
            title: 'Weekly Field Guides',
            description: < Fragment > Each week,
            Quartz takes a < Link to = "/guides/" > deep dive < /Link> into the companies, people, and phenomena defining the global economy. <Link to="/guides / ">Field guide</Link> topics range from <Link to=" / guide / geriatric - cool / ">The birth of geriatric cool</Link> to <Link to=" / guide / chinas - influence / ">China’s changing influence</Link> and <Link to=" / guide / gen - z / ">What Gen Z wants</Link>.</Fragment>,
            bullet: '📚',
        },
        {
            title: 'Member-only newsletters',
            description: < Fragment > Every Monday morning we’ ll send you a TLDR of our latest < Link to = "/guides/" > field guide < /Link> to help you save time and get smarter faster. On Thursday, our editors wrap up the best of Quartz coverage on a specific topic to take you into the weekend.</Fragment > ,
            bullet: '📬',
        },
        {
            title: 'Digital events from Quartz at Work',
            description: < Fragment > Get early invites— and access to < Link to = "/re/quartz-at-work-from-home/" > playbacks and recaps < /Link>—for bi-monthly virtual events that explore the challenges of a modern-day worker. Topics range from <Link to="/work / 1859870 / watch - quartzs - workshop - on - remote - communication / ">remote teams</Link> to the <Link to=" / work / 1873741 / watch - quartzs - workshop - on - the - science - of -decision - making / ">science of decision-making</Link> and <Link to=" / work / 1867977 / watch - our - call - on - building - an - anti - racist - company / ">how to build an antiracist company</Link>.</Fragment>,
            bullet: '👨‍💻',
        },
        {
            title: 'Presentations',
            description: < Fragment > Dive into topical < Link to = "/re/quartz-presents/" > presentations < /Link> that you can take to your next meeting and use to guide your decision making. Learn <Link to="/
            1875336 / how - to - give - a - good - presentation - on - zoom - or - google - meet / ">how to ace your next online presentation</Link>, <Link to=" / 1707298 / the - productivity - apps - and - systems - you - need / ">how to be more productive</Link>, and how to understand <Link to=" / 1780968 / the - future - of -cloud - computing / ">the future of cloud computing</Link>, among other topics.</Fragment>,
            bullet: '👩🏽‍🏫',
        },
    ],

    short: [{
            title: 'All of Quartz journalism, unlocked',
            description: 'Goodbye paywall, hello access across platforms, including on our iOS app to global business news that offers a fresh perspective on the financial forces changing the world',
            bullet: '🔐',
        },
        {
            title: 'Weekly Field Guides',
            description: < Fragment > Deep dives on the companies,
            people,
            and phenomena defining the global economy.Topics include < Link to = "/guide/antiracist-company/" > How to build an anti - racist company < /Link>, <Link to="/guide / world - vs - coronavirus / ">World vs. coronavirus</Link>, <Link to=" / guide / startups - fail / ">Why startups fail</Link>, and <Link to=" / guide / gen - z / ">What Gen Z wants</Link>.</Fragment>,
            bullet: '📚',
        },
        {
            title: 'Member-only newsletters',
            description: 'Every Monday, we’ll send you a TLDR of our latest field guide, and on Thursday, an exclusive essay with a wrap up of the best of Quartz for weekend reading.',
            bullet: '📬',
        },
        {
            title: 'Digital events from Quartz at Work',
            description: 'Get early invites—and access to playbacks and recaps—for bi-monthly virtual events that explore the challenges of a modern-day worker.',
            bullet: '👨‍💻',
        },
        {
            title: 'Presentations',
            description: 'Take our topic-based slide presentations to your next meeting and use them to guide your decision making.',
            bullet: '👩🏽‍🏫',
        },
    ],
};

const itemsJa = {
    short: [{
            title: '毎朝・毎夕届く、ビジネスニュース',
            description: '月〜金曜までの平日毎朝、ビジネスの最重要ニュースをひとまとめにした朝刊ニュースレター「Daily Brief」をお届け。平日毎夕には、曜日ごとに注目のトピックを深掘りした夕刊ニュースレター「Deep Dive」を配信しています。',
            bullet: '📬',
        },
        {
            title: '毎週末届く、グローバルインサイト',
            description: < Fragment > 毎週末にお届けする日曜版ニュースレター「 A Guide to Guides」 では、 米国版Quartzの特集〈 Field Guide〉 をベースに、 世界の論点を識者が解説。 テーマは < Link to = "/emails/quartz-japan/1885037/" > 「中国ビジネス」 < /Link>から<Link to="/emails / quartz - japan / 1879541 / ">「メンタルヘルス」</Link><Link to=" / emails / quartz - japan / 1868591 / ">「Gen Z」</Link>まで多岐にわたります。</Fragment>,
            bullet: '🌏',
        },
        {
            title: '米国版Quartzの全記事が読み放題',
            description: < Fragment > QZ.comと < Link to = "/app/" > Quartzアプリ < /Link>の全記事にアクセスできます。特集シリーズ<Link to="/guides / ">〈Field Guide〉</Link>や<Link to=" / re / quartz - presents / ">プレゼンテーションシリーズ</Link>など、Quartz記者がグローバルビジネスの最前線から伝える、有料メンバー限定のコンテンツを閲覧いただけます。</Fragment>,
            bullet: '🔓',
        },
    ],
};

const PerkItems = ({
    listItems
}) => listItems.map(({
    description,
    title
}, i) => ( <
    li key = {
        i
    } >
    <
    h2 className = {
        cx('title')
    } > {
        title
    } < /h2> <
    p className = {
        cx('description')
    } > {
        description
    } < /p> <
    /li>
));

function NewPerks({
    length
}) {
    const {
        language
    } = usePageVariant();
    const listItems = language === 'ja' ? itemsJa.short : items[length];

    return ( <
        EmojiList bullets = {
            listItems.map(({
                bullet
            }) => bullet)
        }
        tagName = "ul" >
        <
        PerkItems listItems = {
            listItems
        }
        /> <
        /EmojiList>
    );
}

NewPerks.propTypes = {
    length: PropTypes.oneOf(['short', 'long']),
};

NewPerks.defaultProps = {
    length: 'long',
};

export default NewPerks;