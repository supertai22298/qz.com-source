/*
	Add a global class of 'intent-mouse' when the user clicks,
	remove it on keydown. This allows us to target CSS based
	on the user's device, e.g. for removing the focus ring on
	buttons when clicked, but not when focused with the tab key.
*/
export const setInputIntentClasses = () => {
    document.addEventListener('mousedown', () => {
        document.documentElement.classList.add('intent-mouse');
    });
    document.addEventListener('keydown', () => {
        document.documentElement.classList.remove('intent-mouse');
    });
};