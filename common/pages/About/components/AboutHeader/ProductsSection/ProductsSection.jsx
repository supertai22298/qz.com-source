import React from 'react';
import PropTypes from 'prop-types';
import products from './products';
import Link from 'components/Link/Link';
import styles from './ProductsSection.scss';
import classnames from 'classnames/bind';

const cx = classnames.bind( styles );

const ProductsItem = ( { headline, description, links, ext } ) => (
	<div className={cx( 'item-container' )}>
		{
			ext ?
				<Link className={cx( 'item-headline', 'ext' )} to={ext}>{headline}</Link> :
				<h4 className={cx( 'item-headline' )}>{headline}</h4>
		}
		<p className={cx( 'item-description' )}>{description}</p>
		<ul className={cx( 'item-list' )}>
			{
				links?.map( ( link, index ) => (
					<li
						key={`product-${index}`}
						className={cx( 'item-link' )}
					>
						{
							React.isValidElement( link ) ? link : <Link to={link.url}>{link.name}</Link>
						}
					</li>
				) )
			}
		</ul>
	</div>
);

ProductsItem.propTypes = {
	description: PropTypes.string.isRequired,
	ext: PropTypes.string,
	headline: PropTypes.string.isRequired,
	links: PropTypes.arrayOf( PropTypes.oneOfType( [
		PropTypes.shape( {
			name: PropTypes.string,
			url: PropTypes.string,
		} ),
		PropTypes.node,
	] ) ),
};

const ProductsSection = () => (
	<div className={cx( 'container' )}>
		<h3 className={cx( 'headline' )}>Our <span>products</span></h3>
		<div className={cx( 'list' )}>
			{
				products.map( ( product, index ) => <ProductsItem key={index} {...product} /> )
			}
		</div>
	</div>
);

export default ProductsSection;
