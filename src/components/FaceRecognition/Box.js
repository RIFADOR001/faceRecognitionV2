import React from 'react';
import './FaceRecognition.css';

const Box = (box) => {
	const {topRow, rightCol, bottomRow, leftCol} = box;
	// console.log("In Box.js, box: ", box);
	const num = Math.random();
	const key = [topRow, leftCol, num];
	console.log(num);
	return (
		<div 
		key={num}
		className='bounding-box' 
		style={{top: topRow, right: rightCol, bottom: bottomRow, left: leftCol}}
		></div>
	);
}

export default Box;