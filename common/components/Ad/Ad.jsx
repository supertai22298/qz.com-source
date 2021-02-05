import React from 'react';
import AdUnit from './AdUnit.jsx';

export const Marquee = props => (
	<AdUnit
		lazyLoad={false}
		sizeMapping={[
			{ viewport: [ 0, 0 ], slot: [ [ 640, 360 ], [ 300, 250 ] ] },
			{ viewport: [ 768, 0 ], slot: [ [ 1400, 520 ], [ 728, 90 ] ] },
			{ viewport: [ 1200, 0 ], slot: [ [ 1600, 520 ], [ 970, 250 ] ] },
		]}
		type="marquee"
		{...props}
	/>
);

export const Engage = props => (
	<AdUnit
		sizeMapping={[
			{ viewport: [ 0, 0 ], slot: [ [ 600, 431 ], [ 300, 250 ] ] },
			{ viewport: [ 768, 0 ], slot: [ [ 1400, 521 ], [ 728, 90 ] ] },
			{ viewport: [ 1200, 0 ], slot: [ [ 1600, 521 ], [ 970, 250 ] ] },
		]}
		type="engage"
		{...props}
	/>
);

export const Inline = props => (
	<AdUnit
		autoRefreshInterval={45000}
		autoRefreshLimit={3}
		sizeMapping={[
			{
				viewport: [ 0, 0 ],
				slot: [
					[ 360, 203 ],
					[ 360, 560 ],
					[ 300, 250 ],
					[ 300, 600 ],
					[ 320, 50 ],
				],
			},
			{
				viewport: [ 768, 0 ],
				slot: [
					[ 520, 293 ],
					[ 520, 313 ],
					[ 300, 250 ],
				],
			},
			{
				viewport: [ 1200, 0 ],
				slot: [
					[ 640, 363 ],
					[ 640, 380 ],
					[ 970, 250 ],
					[ 300, 250 ],
					[ 970, 90 ],
					[ 728, 90 ],
				],
			},
		]}
		type="inline"
		{...props}
	/>
);

export const HomeFeedInline = props => (
	<AdUnit
		sizeMapping={[
			{ viewport: [ 0, 0 ], slot: [ [ 600, 431 ] ] },
			{ viewport: [ 768, 0 ], slot: [ [ 520, 293 ] ] },
			{ viewport: [ 1600, 0 ], slot: [ [ 640, 363 ] ] },
		]}
		type="inline"
		{...props}
	/>
);

export const Bulletin = props => (
	<AdUnit
		outOfPage={true}
		lazyLoad={false}
		slotSize={[ [ 1, 1 ] ]}
		type="bulletin"
		{...props}
	/>
);

export const Sponsor = props => (
	<AdUnit
		lazyLoad={false}
		slotSize={[ [ 23, 23 ] ]}
		type="sponsor"
		{...props}
	/>
);

export const Logo = props => (
	<AdUnit
		slotSize={[ [ 120, 34 ] ]}
		type="sponsor-logo"
		{...props}
	/>
);

export const SponsoredObsession = props => (
	<AdUnit
		outOfPage={true}
		lazyLoad={false}
		type="sponsored-obsession"
		{...props}
	/>
);

export const Spotlight = props => (
	<AdUnit
		sizeMapping={[
			{ viewport: [ 0, 0 ], slot: [ [ 600, 431 ], [ 600, 600 ], [ 300, 250 ] ] },
			{ viewport: [ 768, 0 ], slot: [ [ 1400, 521 ], [ 1200, 1200 ] ] },
			{ viewport: [ 1200, 0 ], slot: [ [ 1600, 521 ], [ 2000, 2000 ], [ 970, 250 ] ] },
		]}
		type="spotlight"
		{...props}
	/>
);
