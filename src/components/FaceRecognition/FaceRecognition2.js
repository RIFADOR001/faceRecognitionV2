import React from 'react';
import BoxList from './BoxList';
import './FaceRecognition.css';

const FaceRecognition2 = ({ imageUrl, boxes }) => {
	// console.log('FaceRecognition2, state of boxes: ', boxes);
	const box = boxes[0];
	return (
		<div className='center ma'>
			<div className='absolute mt2'>
				<img id='inputimage' 
				alt='' 
				src={imageUrl} 
				width='500px' 
				heigh='auto'
				/>
				<BoxList boxes={boxes}/>
			</div>
		</div>
	);
}

export default FaceRecognition2;



