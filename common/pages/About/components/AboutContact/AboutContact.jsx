import React, { Fragment } from 'react';
import Link from 'components/Link/Link';
import styles from './AboutContact.scss';
import PageSectionHeader from 'components/Page/PageSectionHeader/PageSectionHeader';

const AboutContact = () => (
	<Fragment>
		<div className={styles.container}>
			<PageSectionHeader title="Get in touch" id="contact" />
			<p className={styles.intro}>We’re eager to hear from you. See below for contact information specific to your needs.</p>
			<ul className={styles.methods}>
				<li>
					<h3 className={styles.subheading}>Quartz membership program</h3>
					<p>You can find information about our membership program <Link to="/subscribe/">here</Link>. If you still have questions, email <a href="mailto:join@qz.com">join@qz.com</a>.</p>
				</li>
				<li>
					<h3 className={styles.subheading}>Contacting the Quartz Staff</h3>
					<p>Tap or click any byline on Quartz for that writer’s email address, social media accounts, and latest stories. You can also peruse our staff listing for much of that information. Our email addresses tend to be short, but in a pinch, you can reach us at [first initial][lastname]@qz.com.</p>
					<p>We also have several ways to <a title="tip line" href="https://qz.com/tips/">reach us confidentially.</a></p>
				</li>
				<li>
					<h3 className={styles.subheading}>Quartz Creative and our media kit</h3>
					<p>View the <Link to="https://creative.qz.com">Quartz Creative showcase site here</Link>, and get in touch with us about advertising opportunities at <Link to="mailto:ads@qz.com">ads@qz.com</Link>.</p>
					<p>For further information see the <Link to="https://cms.qz.com/wp-content/uploads/2020/02/Quartz-2020-Media-Kit.pdf">Quartz Media Kit [pdf]</Link>.</p>
				</li>
				<li>
					<h3 className={styles.subheading}>If you’re having trouble with our products</h3>
					<p>Please report bugs and other technical issues you may experience with any of Quartz's products to <a href="mailto:support@qz.com">support@qz.com</a>. We’ll address the issue as soon as we can.</p>
					<p>Quartz supports modern web browsers, which we define as browsers released in the last two years. While your experience on qz.com is always secure, using a <a href="https://browsehappy.com/">modern browser</a> ensures the security of your data across the web and offers improved performance.</p>
				</li>
				<li>
					<h3 className={styles.subheading}>Press inquiries</h3>
					<p>For media and broadcast inquiries, speaker requests, and press passes to Quartz events, please contact <a href="mailto:press@qz.com">press@qz.com</a>.</p>
				</li>
				<li>
					<h3 className={styles.subheading}>Licensing and republication</h3>
					<p>To license Quartz articles for republication in print or digital formats, please email <a href="mailto:license@qz.com">license@qz.com</a>.</p>
				</li>
				<li>
					<h3 className={styles.subheading}>Pitches</h3>
					<p>Quartz accepts a very limited number of freelance pitches. If you are interested in submitting a pitch, please use our Staff section to find the relevant editor and reach out to them directly.  We appreciate your interest, but can’t promise a reply.</p>
				</li>
				<li>
					<h3 className={styles.subheading}>Send us feedback</h3>
					<p>We’re eager to hear from you! Send us feedback, questions, and ideas to <a href="mailto:hi@qz.com">hi@qz.com</a>.</p>
				</li>
				<li>
					<h3 className={styles.subheading}>RSS feeds</h3>
					<p><a title="Quartz RSS" href="https://cms.qz.com/feed">Here’s</a> our RSS feed of all stories published on QZ.com. You can generally obtain the feed for sections of Quartz—obsessions, tags, authors—by adding /feed to the end of the URL. You can also remix our feeds on <a title="Quartz on IFTTT" href="https://ifttt.com/quartz">IFTTT</a>.</p>
				</li>
				<li>
					<h3 className={styles.subheading}>Mailing address</h3>
					<p>Quartz has staff throughout the world, but our headquarters are in New York City. Our mailing address is <a title="View on Google Maps" href="https://www.google.com/maps/place/675+6th+Ave+%23410,+New+York,+NY+10011/@40.742084,-73.9963023,17z">675 Avenue of the Americas, Suite 410, New York, NY, 10010</a>. <a href="mailto:hi@qz.com">Emailing us</a> is faster, though.</p>
				</li>
			</ul>
		</div>
	</Fragment>
);

export default AboutContact;
