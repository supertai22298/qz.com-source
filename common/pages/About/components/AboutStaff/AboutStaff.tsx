import React, { Fragment, useEffect, useState } from 'react';
import styles from './AboutStaff.scss';
import PageSectionHeader from 'components/Page/PageSectionHeader/PageSectionHeader';
import Link from 'components/Link/Link';
import { Image, Spinner } from '@quartz/interface';

type department = {
	name: string,
	people: person[],
};

type person = {
	first_name: string,
	job_title: string,
	last_name: string,
	link?: string,
	photo?: string,
};

function StaffMember( props: person ) {
	if ( ! props.photo ) {
		return null;
	}

	return (
		<Link to={props.link} className={styles.employeeLink}>
			<div className={styles.headshot}>
				<Image
					alt=""
					fallbackHeight={120}
					fallbackWidth={120}
					src={props.photo}
				/>
			</div>
			<p className={styles.employeeName}>{`${props.first_name} ${props.last_name}`}</p>
			<p className={styles.jobTitle}>{props.job_title}</p>
		</Link>
	);
}

function Department( props: department ) {
	return (
		<li className={styles.department}>
			<h3 className={styles.departmentTitle}>{props.name}</h3>
			<ul className={styles.employees}>
				{
					props.people.map( ( {
						first_name,
						job_title,
						last_name,
						link,
						photo,
					} ) => (
						<li key={`${first_name}.${last_name}.${job_title}`} className={styles.employee}>
							<StaffMember
								first_name={first_name}
								last_name={last_name}
								job_title={job_title}
								link={link}
								photo={photo}
							/>
						</li>
					) )
				}
			</ul>
		</li>
	);
}

function Departments() {
	const [ error, setError ] = useState( false );
	const [ departments, setDepartments ] = useState<department[]>( [] );

	useEffect( () => {
		fetch( '/staff.json' )
			.then( response => {
				if ( !response.ok ) {
					throw Error( response.statusText );
				}
				return response.json();
			} )
			.then( ( { departments } ) => setDepartments( departments ) )
			.catch( () => setError( true ) );
	}, [] );

	if ( error ) {
		return <div className={styles.error}>Could not fetch staff profiles</div>;
	}

	if ( 0 === departments.length ) {
		return (
			<div className={styles.spinner}>
				<Spinner />
			</div>
		);
	}

	return (
		<ul className={styles.departments}>
			{
				departments.map( ( { name, people } ) => (
					<Department
						key={name}
						name={name}
						people={people}
					/>
				) )
			}
		</ul>
	);
}

export default function AboutStaff() {
	return (
		<Fragment>
			<PageSectionHeader title="Meet the team" id="staff" />
			<div className={styles.intro}>
				<p>We’re a nerdy and creative bunch, who embrace the opportunity to change the way news is consumed on the internet. We’re passionate about Quartz’s mission and values.</p>
				<p>Want to see your face here? <Link to="/careers/">Browse our current job openings.</Link></p>
			</div>
			<Departments />
		</Fragment>
	);
}
