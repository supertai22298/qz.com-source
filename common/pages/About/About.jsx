import React from 'react';
import { Constrain } from '@quartz/interface';
import Page from 'components/Page/Page';
import PageSection from 'components/Page/PageSection/PageSection';
import AboutSubnav from 'components/AboutSubnav/AboutSubnav';
import AboutHeader from './components/AboutHeader/AboutHeader';
import AboutStaff from './components/AboutStaff/AboutStaff';
import AboutValues from './components/AboutValues/AboutValues';
import AboutCulture from './components/AboutCulture/AboutCulture';
import AboutContact from './components/AboutContact/AboutContact';
import styles from './About.scss';

export default function About() {
	return (
		<Page
			canonicalPath="/about/"
			pageTitle="About"
			pageType="about"
		>
			<Constrain size="extra-large">
				<h1 className={styles.heading}>
					Global news and insights for a <span className={styles.decoration1}>new</span> generation of business <span className={styles.decoration2}>leaders</span>.
				</h1>
			</Constrain>
			<AboutSubnav entries={
				[
					{
						url: '/about/#staff',
						label: 'Staff',
					},
					{
						url: '/about/#values',
						label: 'Values',
					},
					{
						url: '/about/#culture',
						label: 'Culture',
					},
					{
						url: '/about/#contact',
						label: 'Contact',
					},
					{
						url: '/careers/',
						label: 'Careers',
					},
				]
			}
			/>
			<PageSection
				background="alt"
				leftGutter={true}
				hideTopBorder={true}
				hideTopPadding={true}
			>
				<AboutHeader />
			</PageSection>
			<PageSection leftGutter={true}>
				<AboutStaff />
			</PageSection>
			<PageSection background="alt" leftGutter={true}>
				<AboutValues />
			</PageSection>
			<div className={styles.culture}>
				<PageSection leftGutter={true}>
					<AboutCulture />
				</PageSection>
			</div>
			<PageSection background="alt" leftGutter={true}>
				<AboutContact />
			</PageSection>
		</Page>
	);
}
