import React from 'react';
import PropTypes from 'prop-types';
import { Link as ReactRouterLink, useLocation } from 'react-router-dom';
import { getRelativeLink } from 'helpers/urls';

export const normalizeTo = ( to = {}, from ) => {
	if ( typeof to === 'string' ) {
		const [ pathname, hash ] = to.split( '#' );

		return {
			hash,
			pathname,
			state: {
				from,
			},
		};
	}

	return {
		...to,
		state: {
			from,
			...to.state,
		},
	};
};

/**
 * Because ref props have magic behavior in React, a ref prop can "stick" to the
 * HOC and React will not pass it down to the wrapped component (e.g., Link)
 * where we want it:
 *
 * https://reactjs.org/docs/forwarding-refs.html#forwarding-refs-in-higher-order-components
 *
 * Forwarding refs is one method of navigating this issue, but it introduces
 * complexity since each HOC must forward the ref so that it doesn't break the
 * chain of forwarded refs. Over time, this will likely lead to every HOC
 * implementing forwardRef just in case the wrapped component needs a ref.
 *
 * If, however, we simply rename the ref prop to something else (e.g.,
 * "innerRef"), it loses its magic behavior and React will continue to pass it
 * down the tree. When we are in control of both the HOC and the wrapped
 * component, this is a much simpler solution.
 *
 * NOTE: React Router 5.1 handles forwarding our refs automatically, so we no
 * longer need to pass our refs to links as innerRef. However, we still
 * *receive* the prop as innerRef for the reasons outlined above.
 */
export const Link = ( {
	ariaExpanded,
	children,
	className,
	current,
	cypressData,
	innerRef,
	label,
	onClick,
	onMouseEnter,
	rel,
	role,
	style,
	target,
	title,
	to,
} ) => {
	const location = useLocation();

	// If no destination was provided, omit the link but preserve formatting.
	if ( ! to ) {
		return (
			<div className={className} ref={innerRef} style={style}>
				{children}
			</div>
		);
	}

	const normalizedTo = normalizeTo( to, location.pathname );
	const relativeLink = getRelativeLink( normalizedTo.pathname );

	if ( !!relativeLink ) {
		return (
			<ReactRouterLink
				aria-current={current}
				aria-expanded={ariaExpanded}
				aria-label={label}
				className={className}
				data-cy={cypressData}
				onClick={onClick}
				onMouseEnter={onMouseEnter}
				ref={innerRef}
				rel={rel}
				role={role}
				style={style}
				target={target}
				title={title}
				to={{
					...normalizedTo,
					pathname: relativeLink,
				}}
			>
				{children}
			</ReactRouterLink>
		);
	}

	return (
		<a
			aria-current={current}
			aria-expanded={ariaExpanded}
			aria-label={label}
			href={normalizedTo.pathname}
			className={className}
			data-cy={cypressData}
			onClick={onClick}
			onMouseEnter={onMouseEnter}
			target={target}
			ref={innerRef}
			rel={rel}
			style={style}
			title={title}
		>
			{children}
		</a>
	);
};

Link.propTypes = {
	ariaExpanded: PropTypes.bool,
	children: PropTypes.node,
	className: PropTypes.string,
	current: PropTypes.oneOfType( [
		PropTypes.bool,
		PropTypes.string,
	] ),
	cypressData: PropTypes.string,
	innerRef: PropTypes.oneOfType( [
		PropTypes.object,
		PropTypes.func,
	] ),
	label: PropTypes.string,
	onClick: PropTypes.func,
	onMouseEnter: PropTypes.func,
	rel: PropTypes.string,
	role: PropTypes.string,
	style: PropTypes.object,
	target: PropTypes.string,
	title: PropTypes.string,
	to: PropTypes.oneOfType( [
		PropTypes.string,
		PropTypes.object,
	] ),
};

Link.defaultProps = {
	className: '',
	onClick: () => {},
};

export const LinkWhen = ( { when, ...props } ) => {
	if ( when ) {
		return <Link {...props} />;
	}

	return props.children;
};

LinkWhen.propTypes = {
	children: PropTypes.node,
};

export default Link;
