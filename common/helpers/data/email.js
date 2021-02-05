import {
    getArticleProps
} from 'helpers/data/article';
import {
    allEmails
} from 'config/emails';

export const getArticleOrEmailProps = (post) => {
    const normalizedPost = getArticleProps(post);
    if (post.__typename !== 'Email') {
        return normalizedPost;
    }
    // clean up the email link
    normalizedPost.link = normalizedPost.link.replace('/email/', '/emails/');
    // use the email slug to grab the Email name
    const {
        emailLists: {
            nodes: [{
                slug
            }]
        }
    } = post;
    if (normalizedPost.edition && allEmails[slug]) {
        normalizedPost.edition.name = allEmails[slug].name;
    }
    normalizedPost.kicker = allEmails[slug] ? .kicker || '';
    return normalizedPost;
};