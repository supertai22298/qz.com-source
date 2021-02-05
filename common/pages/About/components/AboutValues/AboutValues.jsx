import React from 'react';
import classnames from 'classnames/bind';
import styles from './AboutValues.scss';
import PageSectionHeader from 'components/Page/PageSectionHeader/PageSectionHeader';

const cx = classnames.bind( styles );

const AboutValues = () => (
	<div className={cx( 'container' )}>
		<PageSectionHeader title="We believe in..." id="values" />
		<div className={cx( 'content' )}>
			<ul className={cx( 'values' )}>
				<li className={cx( 'value' )}>
					<h4 className={cx( 'decoration-1' )}>Boldness and creativity</h4>
					<p>At Quartz, there’s an opportunity to build something new every day, whether that’s taking up a new obsession, learning a new language, or trying something new in an ad unit. We always look for the chance to do things boldly, and with bracing creativity to produce the greatest work we could aspire to—and we take pride in the hard work of doing so.</p>
				</li>
				<li className={cx( 'value' )}>
					<h4>Users first</h4>
					<p>Our work takes place across different teams, disciplines, and timezones. Communicating with empathy means making sure that your message isn’t just sent, but received. It’s re-reading what you write before sending it off, treating your words with purpose, suggesting a video call when Slack isn’t cutting it. It’s being generous with the context you provide, instead of assuming the other person knows what you know. And we bring the same empathy to our communication with readers, emphasizing clarity in our journalism above all. It’s easy to say we put the user first, but harder to do it consistently.</p>
				</li>
				<li className={cx( 'value' )}>
					<h4 className={cx( 'decoration-2' )}>Force of ideas</h4>
					<p>At the center of our work are the ideas within our writing. We believe that ideas—to the good and not—have consequence. Our highest work is bringing rigor, insight, and intellectual honesty to that ultimate purpose of separating the bad from the good, giving voice, argument, and flight to the latter.</p>
				</li>
			</ul>
			<ul className={cx( 'values' )}>
				<li className={cx( 'value' )}>
					<h4>Taking ownership</h4>
					<p>Our industry is in a constant state of transition. We’re all here, in part, because we’re excited by that change. It is each individual’s responsibility to improve a broken process, to ask questions if something doesn’t make sense, to correct inaccuracies, to fix a bug, to wipe up a coffee spill even if no one is looking. We experiment thoughtfully, challenge ourselves to uphold high standards, and leave things better than how we found them.</p>
				</li>
				<li className={cx( 'value' )}>
					<h4 className={cx( 'decoration-3' )}>A more global world</h4>
					<p>Quartz was created for a “post-national” readership: people who are curious about the world far beyond themselves, reject nationalist ideology, and believe that all cultures play a vital role in the global economy. These are also values of our journalism and of our staff. We hire people who bring new perspectives, cultures, experiences, and languages. We reject racism and xenophobia, among our own employees and in the broader political discourse. We believe a more open and connected world is better for everyone.</p>
				</li>
				<li className={cx( 'value' )}>
					<h4>Spirit of generosity</h4>
					<p>We seek in our ranks a spirit of generosity, a natural disposition in each colleague toward service and selfless conduct. Our writing should be cut from the same cloth—critical on the merits but informed by charity and forbearance in measuring motive and personal character.</p>
				</li>
			</ul>
		</div>
	</div>
);

export default AboutValues;
