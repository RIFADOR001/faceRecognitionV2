import React from 'react';
import './FaceRecognition.css';

const BoxList = ({ boxes }) => {
	const BoxArray = boxes.map(box => {
		const num = Math.random();
		return (

			<div 
			key={num}
			className='bounding-box' 
			style={{top: box.topRow, 
			right: box.rightCol, 
			bottom: box.bottomRow, 
			left: box.leftCol}}
			></div>
		)
	})
	return (
		<div>
		{BoxArray}
		</div>
		);

}

export default BoxList;

