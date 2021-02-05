import {
    emailRegexString
} from './validation';

// Create the regex once in the outer scope.
const emailReplaceRegex = new RegExp(emailRegexString, 'gi');

/**
 * Redact email addresses (PII) from a string.
 *
 * @param  {string} str String to redact inside.
 * @return {string} str
 */
export const redactEmailAddresses = str => str.replace(emailReplaceRegex, '[REDACTED EMAIL]');

/**
 * Redact email addresses (PII) from a URL or path.
 *
 * @param  {string} str Path to redact inside.
 * @return {string} str
 */
export const redactEmailAddressesFromPath = str => str.split('/')
    .map(decodeURIComponent)
    .map(redactEmailAddresses)
    .join('/');

/**
 * Strip HTML tags from a string.
 *
 * @param  {string} str String to strip.
 * @return {string}     Stripped string.
 */
export const stripTags = str => str.replace(/<(?:.|\n)*?>/gm, '');

/**
 *
 * @param  {string | undefined} str String to strip.
 * @return {string} Stripped string.
 */
export const stripWhitespace = str => str ? str.replace(/\s+/g, '') : str;

/**
 * Truncate text while respecting word boundaries.
 *
 * @param  {string}  str            	String to truncate.
 * @param  {number}  characterLimit 	Character limit to truncate against.
 * @param  {boolean} preserveNewlines	Should the truncated text contain newlines from the provided string?
 * @return {string}                		Truncated string.
 */
export const truncateText = (text, characterLimit, preserveNewlines = false) => {
    let regEx = new RegExp(`^(.{${characterLimit}}[^\\s]*).*`);
    let whitespacePattern = /\s+/g;

    /*
    	If we are to truncate across newlines, use [\S\s] instead of the dot (.) character.
    	A dot will not match newline characters, but [\S\s] matches both whitespace and
    	non-whitespace characters, i.e. everything.
    */
    if (preserveNewlines) {
        regEx = new RegExp(`^([\\S\\s]{${characterLimit}}[^\\s]*)[\\S\\s]*`);
        whitespacePattern = /[^\S\r\n]+/g;
    }

    // remove whitespace, trim, truncate
    return text
        .replace(whitespacePattern, ' ')
        .trim()
        .replace(regEx, '$1');
};

/**
 * Convert HTML entities to characters.
 *
 * @param  {string} str String to unescape.
 * @return {string}     Unescaped string.
 */
export const unescapeText = str => {
    if ('string' !== typeof str) {
        return str;
    }

    const entities = {
        '&amp;': '&',
        '&#38;': '&',
        '&#x26;': '&',
        '&lt;': '<',
        '&#60;': '<',
        '&#x3C;': '<',
        '&gt;': '>',
        '&#62;': '>',
        '&#x3E;': '>',
        '&apos;': "'",
        '&#39;': "'",
        '&#x27;': "'",
        '&quot;': '"',
        '&#34;': '"',
        '&#x22;': '"',
        '&grave;': '`',
        '&#96;': '`',
        '&#x60;': '`',
        '&nbsp;': ' ',
    };

    const re = new RegExp(Object.keys(entities).join('|'), 'g');

    return str.replace(re, entity => entities[entity]);
};

/**
 * Uppercase the first letter of a string.
 *
 * @param  {string} str String to uppercase.
 * @return {string}     Uppercased String.
 */
export const uppercaseFirstLetter = str => `${str.charAt( 0 ).toUpperCase()}${str.substr( 1 )}`;

/**
 * Slugify a string by lowercasing it and replacing spaces with hyphens
 *
 * @param  {string} text Text to stringify.
 * @return {string}     Stringified-text.
 */
export const slugify = text => text.toLowerCase()
    .replace(/\s+/g, '-') // convert spaces to dashes
    .replace(/[^\w\-]+/g, '') // remove non-word chars
    .replace(/\-\-+/g, '-') // replace multiple - with single -
    .trim();

/**
 * Adds rel="nofollow" to any links in user-submitted text.
 *
 * @param  {string} str String to check for links.
 * @return {string}     String with rel=nofollow added.
 */
export const relNoFollow = markup => markup ? .replace(/ ?rel="(?:[^"]+)?"/g, '').replace(/<a\s+/g, '<a rel="nofollow" ');

/**
 * Change newlines to <br /> elements.
 *
 * @param  {string} str String with newlines.
 * @return {string}     String with <br /> markup.
 */
export const nl2br = text => text ? .replace(/\r\n|\r|\n/g, '<br />');

/**
 * Take a word and conditionally add an s depending on passed number value
 * @param {string} text		Singular string
 * @param {int}	   numVal	Int number value relating to text in question
 * @return {string}			String with an s at the end or the original string
 */
export const pluralizeText = (text, numVal) => numVal === 1 ? `${text}` : `${text}s`;

/**
 * Strip any inline styling from HTML strings
 * @param {string} text HTML string
 * @return {string}
 */
export const stripInlineStyling = (text) => text ? .replace(/\s+style\=\"(?:.*)\"/g, '');