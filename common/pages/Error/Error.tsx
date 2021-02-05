import React from 'react';
import CacheBehavior from 'components/CacheBehavior/CacheBehavior';
import ServerSideBehavior from 'components/SeverSideBehavior/ServerSideBehavior';
import styles from './Error.scss';
import Page from 'components/Page/Page';
import { Hed } from '@quartz/interface';

const templates = {
	404: {
		title: 'Page not found',
		subtitle: 'The page you’re looking for is not available.',
	},
	500: {
		title: 'Unexpected error',
		subtitle: 'An unexpected error occurred.',
	},
};

export default function ErrorPage ( props: {
	location,
	statusCode: number,
} ) {
	const { subtitle, title } = templates[ props.statusCode ] || templates[ 500 ];

	return (
		<Page
			canonicalPath={props.location.pathname}
			pageTitle={title}
			pageType={`${props.statusCode}`}
		>
			<CacheBehavior baseKey="error" />
			<ServerSideBehavior renderStatic={true} />
			<div className={styles.container}>
				<Hed size="extra-large">
					<h1>{props.statusCode}</h1>
				</Hed>
				<Hed size="medium">{subtitle}</Hed>
			</div>
		</Page>
	);
}
