import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ColorScheme } from '@quartz/interface';

type ColorSchemeProps = React.ComponentProps<typeof ColorScheme>;

/**
 * Helmet only allows HTML tags as children and you cannot delegate this work to
 * another component. Therefore, we cannot pass ColorScheme as a child of Helmet.
 * Instead we'll use a render prop to get access to the css and render a <style>
 * tag ourselves inside <Helmet>.
 *
 * Add amp-custom attribute to ensure that AMP includes it.
 */
export default function HoistedColorScheme ( props: ColorSchemeProps ) {
	return (
		<ColorScheme {...props}>
			{
				( css: string ) => (
					<Helmet>
						<style amp-custom type="text/css">{css}</style>
					</Helmet>
				)
			}
		</ColorScheme>
	);
}
