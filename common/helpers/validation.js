// Export for reuse in other contexts.
export const emailRegexString = '(?:[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*|"(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21\\x23-\\x5b\\x5d-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21-\\x5a\\x53-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])+)\\])';

// Not exporting; prefer use of helper function below.
const emailValidationRegex = new RegExp(`^${emailRegexString}$`, 'i');

/**
 * Check to make sure the email is valid
 *
 * @param  {string}  email
 * @return {bool}
 */
export const isValidEmail = email => emailValidationRegex.test(email);

/**
 * Make sure the password meets our length requirements
 * @param  {string}  password [description]
 * @return {Boolean}          [description]
 */
export const isValidLengthPassword = (password) => 'string' === typeof password && password.length >= 6;

/**
 * Make sure the password meets our character requirements (no whitespace)
 * @param  {string}  password [description]
 * @return {Boolean}          [description]
 */
export const isValidCharactersPassword = (password) => 'string' === typeof password && password.match(/^\S*$/);