import React, { useEffect, useState } from 'react';
import { CalloutCard } from '@quartz/interface';
import ContentBlocks from 'components/ContentBlocks/ContentBlocks';
import EmailSignup from 'components/EmailSignup/EmailSignup';
import usePromotionsByTag from 'data/hooks/usePromotionsByTag';
import { oneYearInMilliseconds } from 'helpers/dates';
import useLocalStorageState from 'helpers/hooks/useLocalStorageState';
import useUserRole from 'helpers/hooks/useUserRole';
import CloseIcon from 'svgs/close-x.svg';
import Scribble from 'svgs/highlight-triple-underline.svg';
import styles from './HomepagePromo.scss';

const thingsWeAreMakingBetter = [
	'cities',
	'work',
	'trade',
	'capitalism',
	'brands',
	'algorithms',
	'borders',
	'hiring',
	'food',
	'supply chains',
	'robots',
	'leaders',
	<>
		business
		<Scribble className={styles.scribbleFinal} />
	</>,
];

// Array of times in ms to fire the next step.
const timings = [ 1000, 800, 600, 500, 400, 300, 300, 300, 200, 200, 200, 200 ];

function Scribbles( props: {
	takeoverStep: number | null,
} ) {
	const [ step, setStep ] = useState<number>( 0 );

	useEffect( () => {
		let timeout: ReturnType<typeof setTimeout>;

		if ( null === props.takeoverStep && timings[ step ] ) {
			timeout = setTimeout( () => setStep( step + 1 ), timings[ step ] );
		}

		return () => clearTimeout( timeout );
	}, [ step, props.takeoverStep ] );

	const currentStep = null === props.takeoverStep ? step : props.takeoverStep;
	const className = 12 === currentStep ? styles.scribble : `${styles.scribble} ${styles[ `variant${currentStep % 6}` ]}`;

	return (
		<h2 className={styles.header}>
			Make
			<br />
			<span className={className}>
				{thingsWeAreMakingBetter[ currentStep ]}
			</span>
			<br />
			better
		</h2>
	);
}

export default function HomepagePromo () {
	const { isMember } = useUserRole();
	const promotions = usePromotionsByTag( 'homepage-promo', 1 );
	const [ dismissed, setDismissed ] = useLocalStorageState( 'homepage-mbb-promo', isMember );
	const [ takeoverStep, setTakeoverStep ] = useState<number|null>( null );

	// 🐰🥚
	useEffect( () => {
		function listener ( evt: KeyboardEvent ) {
			// Capital Q triggers restores the promo even if it has been dismissed and
			// advances the animation manually.
			if ( 'Q' !== evt.key ) {
				return;
			}

			// First Q: initiate takeover OR
			// User is at the end: go back to the beginning.
			if ( null === takeoverStep || takeoverStep >= timings.length ) {
				setDismissed( false );
				setTakeoverStep( 0 );
				return;
			}

			// User has already taken over, advance step or go back to the beginning.
			setTakeoverStep( takeoverStep + 1 );
		}

		document.addEventListener( 'keydown', listener );

		return () => document.removeEventListener( 'keydown', listener );
	}, [ setDismissed, takeoverStep ] );

	if ( 1 !== promotions?.length ) {
		return null;
	}

	if ( dismissed ) {
		return null;
	}

	return (
		<>
			<CalloutCard>
				<div className={styles.container}>
					<button
						className={styles.close}
						onClick={() => setDismissed ( true, oneYearInMilliseconds )}
						type="button"
						title="Close"
					>
						<CloseIcon aria-hidden="true" className={styles.closeIcon} />
						<span>Close</span>
					</button>
					<Scribbles takeoverStep={takeoverStep} />
					<div className={styles.blocks}>
						<ContentBlocks blocks={promotions[0]?.blocks} />
					</div>
					<hr className={styles.hr} />
					<EmailSignup listIds={[ 3224114 ]} title="Get the Quartz Daily Brief in your inbox each morning." />
				</div>
			</CalloutCard>
			<hr />
		</>
	);
}
