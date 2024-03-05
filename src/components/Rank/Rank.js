import React from 'react';

const Rank = (user) => {
	// console.log(user);
	const name = user.userName;
	const entries = user.entries;
	return (
		<div>
			<div className='white f3'>
				{`${name} your current entry count is...`}
			</div>
			<div className='white f1'>
				{entries}
			</div>
			
		</div>
	);
}

export default Rank;


{/*<div className='white f3'>
				{`with ${entries} entries`}
			</div>*/}