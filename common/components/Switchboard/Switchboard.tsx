import React from 'react';
import Link from 'components/Link/Link';
import styles from './Switchboard.scss';
import { BadgeGroup } from '@quartz/interface';

export const Switchboard = ( props: {
	items: {
		badgeUrl?: string | null,
		description?: string | null,
		link?: string | null,
		onClick?: () => void,
		sponsor?: {
			name?: string | null,
		} | null,
		title?: string | null,
	}[],
	size: 'small' | 'medium',
} ) => (
	<ul className={styles.container}>
		{
			props.items.map( ( {
				badgeUrl,
				description,
				link,
				onClick,
				sponsor,
				title,
			}, index ) => (
				<li key={index} className={styles.item}>
					<Link onClick={onClick} to={link}>
						<BadgeGroup
							imageUrl={badgeUrl}
							kicker={sponsor?.name}
							size={props.size || 'medium'}
							tagline={description}
							title={title ?? ''}
						/>
					</Link>
				</li>
			) )
		}
	</ul>
);

export default Switchboard;
