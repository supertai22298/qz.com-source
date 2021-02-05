import React, {
    Fragment
} from 'react';

const useLocalization = ({
    dictionary,
    language = 'en'
}) => {
    const localize = (phrase, keywords) => {
        const targetDictionary = dictionary[language];
        const translatedPhrase = targetDictionary ? .[phrase] || phrase;

        // if it's a straight phrase translation, return that
        if (!keywords) {
            return translatedPhrase;
        }

        // given a custom dictionary object like { daysLeftInWords: numDays + localize( ' days' ) }
        // and a phrase like "You have #{daysLeftInWords} remaining"
        // replace the templated words in the phrase with their localized translations
        // N.B. - the keyword values should be localized; the dictionary remains the source of truth

        // split any word surrounded by --> #{}, including the bracketed word
        // if a value exists for that word, sub it in
        const splitPhrase = translatedPhrase ? .split(/(\#\{[A-z0-9]+?\})/).map(word => {
            // grab the word separate from the syntax, i.e. daysLeftInWords from #{daysLeftInWords}
            const match = word.match(/\#\{([A-z0-9]+?)\}/);
            // if there's no match for it, we can just return the matching section of the translated phrase
            if (!match) {
                return word;
            }

            const [, keyword] = match;

            // if the phrase has a keyword but no matching value, warn and skip it rather than show the keyword
            if (!keywords[keyword]) {
                console.error('No value provided for localized keyword:', word);
                return '';
            }

            // since we're returning an array, be generous to the dev and provide a key for them
            return <Fragment key = {
                keyword
            } > {
                keywords[keyword]
            } < /Fragment>;
        });

        return splitPhrase;
    };

    return localize;
};

export default useLocalization;