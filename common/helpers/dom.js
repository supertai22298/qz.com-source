/*
	Temporarily focus a non-interactive element by giving it a tabindex, focusing
	the element, and removing the tabindex when the element is blurred.

	When is this useful? Sometimes we want to move the focus to a
	non-interactive element, but we don't want the element to be in the
	normal tab order. For example when the page route changes and we
	want to re-focus the app container, we can use this to focus <main>.
*/
export const makeTabbableOnceAndFocus = (el) => {
    if (!el) {
        return;
    }

    el.addEventListener('blur', onTargetBlur);
    el.setAttribute('tabindex', -1);
    el.focus(); // NB: Safari does not yet support options passed to focus.

    function onTargetBlur(e) {
        const {
            target
        } = e;
        target.removeAttribute('tabindex');
        target.removeEventListener('blur', onTargetBlur);
    }
};