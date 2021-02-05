import React from 'react';
import { formatDate, parseDateGmt } from 'helpers/dates';
import articlePropTypes from 'helpers/propTypes/articlePropTypes';

class Dateline extends React.Component {
	constructor( props ) {
		super( props );

		this.state = {
			showRelativeDate: false,
		};

	}

	componentDidMount() {
		this.setState( { showRelativeDate: true } );
	}

	render() {
		const { dateGmt } = this.props;
		const { showRelativeDate } = this.state;

		return (
			<time dateTime={parseDateGmt( dateGmt ).toISOString()}>{formatDate( dateGmt, { human: showRelativeDate } )}</time>
		);
	}
}

const { dateGmt } = articlePropTypes;
Dateline.propTypes = { dateGmt };

export default Dateline;
