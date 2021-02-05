import React from 'react';
import { Helmet } from 'react-helmet-async';
import { EmojiList } from '@quartz/interface';
import usePageVariant from 'helpers/hooks/usePageVariant';

export default function EmojiListWrapper( props: { bullets: Array<string>; tagName?: string; children: React.ReactNode } ) {
	const { isAmp } = usePageVariant();

	// AMP does not allow custom CSS in the body.
	let renderStyles;
	if ( isAmp ) {
		renderStyles = ( css: string ) => (
			<Helmet>
				<style amp-custom>
					{css}
				</style>
			</Helmet>
		);
	}

	return (
		<EmojiList
			renderStyles={renderStyles}
			{...props}
		>
			{props.children}
		</EmojiList>
	);
}
