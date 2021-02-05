// Enable:  localStorage.setItem( 'QZ_DEBUG', true )
// Disable: localStorage.setItem( 'QZ_DEBUG', false )
const getDebugLog = () => {
    if ('object' === typeof window && 'object' === typeof window.localStorage) {
        try {
            return window.localStorage.getItem('QZ_DEBUG') || false;
        } catch (err) {}
    }

    return false;
};

// Maybe someone else wants to use this.
export const DEBUG = getDebugLog();

/**
 * Log debug information to console (if requested).
 *
 * @param  {string} name Name of event
 * @param  {object} data Data payload to log.
 * @param  {string} TYPE (Sub)type of event.
 */
export const log = (name, data = {}, TYPE = 'UNKNOWN') => DEBUG && console.info({
    [name.toUpperCase()]: data,
    TYPE
});