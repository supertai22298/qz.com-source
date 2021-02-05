import React from 'react';
import GuideCard from 'components/GuideCard/GuideCard';
import useGuides from 'data/hooks/useGuides';

const LatestGuidePromo = () => {
	const data = useGuides( 1 );

	if ( ! data.guides?.length ) {
		return null;
	}

	const [
		{
			featuredImage,
			link,
			name,
			shortDescription,
		},
	] = data.guides;

	if ( ! featuredImage || ! link || ! name ) {
		return null;
	}

	return (
		<GuideCard
			featuredImage={featuredImage}
			link={link}
			name={name}
			shortDescription={shortDescription}
			size="small"
		/>
	);
};

export default LatestGuidePromo;
