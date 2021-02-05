import React, { Fragment } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@quartz/interface';
import styles from './ConsentForm.scss';
import { geo } from 'config/http';
import usePageVariant from 'helpers/hooks/usePageVariant';

export default function ConsentForm () {
	const { isAmp } = usePageVariant();

	if ( ! isAmp ) {
		return null;
	}

	return (
		<Fragment>
			<Helmet>
				<script async={undefined} custom-element="amp-geo" src="https://cdn.ampproject.org/v0/amp-geo-0.1.js"></script>
				<script async={undefined} custom-element="amp-consent" src="https://cdn.ampproject.org/v0/amp-consent-0.1.js"></script>
			</Helmet>
			<amp-geo layout="nodisplay">
				<script
					type="application/json"
					dangerouslySetInnerHTML={{ __html:
						`{
						"ISOCountryGroups": {
							"eea": ${JSON.stringify( geo.eeaCountryCodes )}
						}
					}` }}
				/>
			</amp-geo>
			<amp-consent id="gdpr-consent" layout="nodisplay">
				<script
					type="application/json"
					dangerouslySetInnerHTML={{ __html:
						`{
						"consents": {
							"gdpr": {
								"promptIfUnknownForGeoGroup": "eea",
								"promptUI": "gdpr-consent-ui"
							}
						}
					}` }}
				/>
				<div
					id="gdpr-consent-ui"
					className={styles.container}
				>
					<div className={styles.row}>
						<div className={styles.content}>
							<p>Welcome to Quartz! Please read our <a href="https://qz.com/about/privacy-policy/">privacy policy</a>.</p>
							<p><strong>Cookies:</strong> By using this site, you agree to our use of cookies for analytics and personalization.<br/></p>
							<p><strong>Personal data:</strong> Do you agree to the use of your personal data by Quartz and its partners to serve you targeted ads?</p>
						</div>
						<div className={styles.form}>
							<Button on="tap:gdpr-consent.accept">Yes</Button>
							<Button variant="secondary" on="tap:gdpr-consent.reject">No</Button>
						</div>
					</div>
				</div>
			</amp-consent>
		</Fragment>
	);
}
