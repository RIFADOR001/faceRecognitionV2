import React from 'react';
import Tilt from 'react-parallax-tilt';
import brain from './brain.png'
import './Logo.css';

const Logo = () => {
	return (
		<div className='ma4 mt0'>
			<Tilt className='Tilt br4 shadow-2' style={{height: '150px', width: '150px'}}>
      			<div style={{ height: '150px', width: '150px'}}>
        			<div className="Tilt-inner pa3">
        				<img alt='logo' src={brain}/>
        			</div>
      			</div>
    		</Tilt>
		</div>
	);
}

export default Logo;