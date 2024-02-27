import React from 'react';

const Rank = (user) => {
	console.log(user);
	const name = user.userName;
	const entries = user.entries;
	return (
		<div>
			<div className='white f3'>
				{`${name} your current rank is...`}
			</div>
			<div className='white f1'>
				{'#5'}
			</div>
			<div className='white f3'>
				{`with ${entries} entries`}
			</div>
		</div>
	);
}

export default Rank;