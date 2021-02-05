import React, { useRef } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { encodeSearchPath } from 'helpers/urls';
import styles from './SearchInput.scss';
import SearchIcon from 'svgs/search.svg';

function SearchInput ( {
	defaultValue,
	onSubmit,
} ) {
	const history = useHistory();
	const ref = useRef();

	function onSearchSubmit ( evt ) {
		evt.preventDefault();
		onSubmit();

		const terms = encodeSearchPath( ref.current.value );
		const path = terms ? `/search/${terms}/` : '/search/';

		history.push( path );
	}

	return (
		<form
			onSubmit={onSearchSubmit}
			role="search"
		>
			<div className={styles.container}>
				<label className={styles.label}>
					<span>Search</span>
					<input
						className={styles.field}
						defaultValue={defaultValue}
						placeholder="Search Quartz"
						ref={ref}
						type="search"
					/>
					<SearchIcon aria-hidden={true} className={styles.searchIcon} />
				</label>
			</div>
		</form>
	);
}

SearchInput.propTypes = {
	defaultValue: PropTypes.string,
	onSubmit: PropTypes.func.isRequired,
};

SearchInput.defaultProps = {
	onSubmit: () => {},
};

export default SearchInput;
