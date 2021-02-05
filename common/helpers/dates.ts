export const oneDayInSeconds = 24 * 60 * 60;
export const oneDayInMilliseconds = oneDayInSeconds * 1000;
export const aboutOneMonthInSeconds = oneDayInSeconds * 31;
export const aboutOneMonthInMilliseconds = aboutOneMonthInSeconds * 1000;
export const oneYearInSeconds = 365 * oneDayInSeconds;
export const oneYearInMilliseconds = oneYearInSeconds * 1000;

export const parseDateGmt = ( date?: Date | string ) => {
	// Catch falsey args
	if ( !date ) {
		return new Date();
	}

	if ( date instanceof Date ) {
		return date;
	}

	// Safari can not understand dates with dashes in them; many other browsers
	// cannot handle "T" as time delimiter. Replacing for cross-browser
	// functionality. See http://bit.ly/2xMwhTC .
	const standardDate = date
		.replace( /-/gi, '/' )
		.replace( /T/gi, ' ' )
		.replace( /(\..*)$/gi, '' ); // Strip out timezone information if it's still included at this point

	// Add the UTC time zone offset so that the date is parsed correctly.
	const dateGmt = new Date( `${standardDate} +0000` );

	// Don't implicitly trust dates passed to this function. Calling a Date
	// method on an Invalid Date will raise an exception.
	if ( dateGmt instanceof Date && !isNaN( dateGmt.valueOf() ) ) {
		return dateGmt;
	}

	return new Date();
};

const months = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December',
];

// These abbreviations are specified in our editorial policy 🤯
const shortMonths = [
	'Jan.', 'Feb.', 'March', 'April', 'May', 'June', 'July', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.',
];

export const formatDate = ( dateGmt?: Date | string, { human, shortMonth }: { human?: boolean; shortMonth?: boolean; } = {} ) => {
	const publishDate = parseDateGmt( dateGmt );

	// Date#getTime is number of seconds since epoch in UTC.
	const time = publishDate.getTime();
	const now = new Date().getTime();

	const diff = now - time;

	const minute = 60 * 1000;
	const hour = 60 * minute;

	const month = ( shortMonth ? shortMonths : months )[publishDate.getMonth()];
	const day = publishDate.getDate();
	const year = publishDate.getFullYear();

	// only do human time format if the publish date is less than 8 hours old
	if ( human && diff < hour * 8 ) {

		// if its more than 1 hour old
		if ( diff >= hour ) {

			const hoursAgo = Math.floor( diff / hour );

			if ( 1 === hoursAgo ) {
				return '1 hour ago';
			}

			return `${hoursAgo} hours ago`;

		}

		// less than 1 hour old
		const minutesAgo = Math.ceil( diff / minute );

		if ( 1 === minutesAgo ) {
			return '1 minute ago';
		}

		return `${minutesAgo} minutes ago`;

	}

	// Server-side rendering and for AMP articles.
	return `${month} ${day}, ${year}`;
};

export const daysFromToday = ( date: string ) => {
	const secondsRemaining = Math.abs( new Date( date ).valueOf() - Date.now() ) / 1000;
	return Math.floor( secondsRemaining / oneDayInSeconds );
};

export const convertSecondsToMinutes = ( duration?: number ) => {
	if ( !duration || typeof duration !== 'number' ) {
		return null;
	}

	const minutes =  Math.floor( duration / 60 );
	const seconds = duration - minutes * 60;

	if ( seconds < 10 ) {
		return `${minutes}:0${seconds}`;
	}

	return `${minutes}:${seconds}`;
};

export const timeBasedGreeting = ( hours: number ) => {
	// Between 6pm and 2am
	if ( hours <= 2 || hours >= 18 ) {
		return 'Good evening';
	}

	// Between 12pm and 6pm
	if ( hours >= 12 ) {
		return 'Good afternoon';
	}

	// Between 2am and 12pm
	return 'Good morning';
};
