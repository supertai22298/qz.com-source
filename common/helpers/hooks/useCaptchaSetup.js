import {
    useEffect,
    useState,
    useRef
} from 'react';
import {
    loadScriptOnce
} from 'helpers/utils';

const CAPTCHA_BUTTON_ID = 'captcha_button';

/**
 * Setup CAPTCHA and provide a wrapped onSubmit.
 *
 * @param  {Boolean}  useCaptcha Whether CAPTCHA is enabled.
 * @param  {Function} onSubmit   The function to call when the form is successfully submitted.
 * @return {Function}
 */
export default function useCaptchaSetup(useCaptcha, onSubmit) {
    const [hasSetupCaptcha, setHasSetupCaptcha] = useState(false);
    const [widgetId, setWidgetId] = useState(null);

    const [captchaToken, setCaptchaToken] = useState(null);

    // Load reCAPTCHA and intercept onSubmit.
    useEffect(() => {
        if (!useCaptcha || hasSetupCaptcha) {
            return;
        }

        setHasSetupCaptcha(true);

        // Load the reCAPTCHA script and make ready battle stations.
        loadScriptOnce('https://www.google.com/recaptcha/api.js')
            .then(() => {
                const renderOptions = {
                    sitekey: process.env.GOOGLE_RECAPTCHA_V2_SITE_KEY,
                    size: 'invisible',
                    callback: (token) => {
                        setCaptchaToken(token);
                    },
                };

                window.grecaptcha.ready(() => {
                    setWidgetId(window.grecaptcha.render(CAPTCHA_BUTTON_ID, renderOptions));
                });
            });

    }, [hasSetupCaptcha, onSubmit, setHasSetupCaptcha, useCaptcha]);

    const captchaTokenRef = useRef(null);

    useEffect(() => {
        // Did we get a captcha token, and is it new?
        if (captchaToken && captchaToken !== captchaTokenRef.current) {
            captchaTokenRef.current = captchaToken;
            onSubmit(null, {
                captchaToken
            });
        }

    }, [captchaToken, onSubmit]);

    // A wrapped version of onSubmit that enforces CAPTCHA.
    return evt => {
        if (evt) {
            evt.preventDefault();
        }

        // When the user clicks submit, if CAPTCHA is enabled, execute the CAPTCHA
        // check to generate the CAPTCHA token.
        if (useCaptcha && 'testing' !== process.env.QZ_ENV) {
            // reset in case this is a second attempt
            window.grecaptcha.reset(widgetId);
            window.grecaptcha.execute(widgetId);

            return;
        }

        // Not using captcha, return the original onSubmit.
        onSubmit(evt, {});
    };
}