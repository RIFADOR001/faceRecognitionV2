import React from 'react';
import ParticlesBg from 'particles-bg';
import MouseParticles from 'react-mouse-particles' //mine 
import Clarifai from 'clarifai';
import Navigation from './components/Navigation/Navigation';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Register from './components/Register/Register';
import './App.css';
import 'tachyons';

//https://github.com/lindelof/react-mouse-particles



const clarifaiJSONRequestOptions = (imageUrl) => {
  // Your PAT (Personal Access Token) can be found in the portal under Authentification
  const PAT = 'dddddd4366314e48ab070884a87e40f4';
  // Specify the correct user_id/app_id pairings
  // Since you're making inferences outside your app's scope
  const USER_ID = 'rif01';
  const APP_ID = 'facebrain';
  // Change these to whatever model and image URL you want to use
  const MODEL_ID = 'face-detection';
  const IMAGE_URL = imageUrl;
  const raw = JSON.stringify({
    "user_app_id": {
        "user_id": USER_ID,
        "app_id": APP_ID
    },
    "inputs": [
        {
            "data": {
                "image": {
                    "url": IMAGE_URL
                    // "base64": IMAGE_BYTES_STRING
                }
            }
        }
      ]
  });
  const requestOptions = {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Authorization': 'Key ' + PAT
    },
    body: raw
  };  
  return requestOptions
}


// fetch("https://api.clarifai.com/v2/models/" + "face-detection" + "/outputs", clarifaiJSONRequestOptions(this.state.input))
//     .then(response => response.json())
//     .then(result => {

//         const regions = result.outputs[0].data.regions;

//         regions.forEach(region => {
//             // Accessing and rounding the bounding box values
//             const boundingBox = region.region_info.bounding_box;
//             const topRow = boundingBox.top_row.toFixed(3);
//             const leftCol = boundingBox.left_col.toFixed(3);
//             const bottomRow = boundingBox.bottom_row.toFixed(3);
//             const rightCol = boundingBox.right_col.toFixed(3);

//             region.data.concepts.forEach(concept => {
//                 // Accessing and rounding the concept value
//                 const name = concept.name;
//                 const value = concept.value.toFixed(4);

//                 console.log(`${name}: ${value} BBox: ${topRow}, ${leftCol}, ${bottomRow}, ${rightCol}`);
                
//             });
//         });

//     })
//     .catch(error => console.log('error', error));


class App extends React.Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignIn: false
    }
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width); 
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    this.setState({box: box})
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input})

    fetch("https://api.clarifai.com/v2/models/" + "face-detection" + "/outputs", clarifaiJSONRequestOptions(this.state.input))
      .then(response => response.json())
      .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
      .catch(err => console.log);
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState({isSignIn: false})
    }else if (route === 'home') {
      this.setState({isSignIn: true})
    }
    this.setState({route: route});
  }

// video 288 for corrections

  render (){
    const { isSignIn, imageUrl, route, box } = this.state;
    return (
      <div className="App">
        <MouseParticles g={1} color="random" cull="col,image-wrapper"/> {/*Mine*/}
        <ParticlesBg className='particles' type="circle" bg={true} />
        <Navigation 
          isSignIn={isSignIn}
          onRouteChange={this.onRouteChange} 
        
        />
        { route === 'home' 
          ?<div> 
              <Logo />
              <Rank />
              <ImageLinkForm 
              onInputChange={this.onInputChange} 
              onButtonSubmit={this.onButtonSubmit} 
              />
              <FaceRecognition 
                box={box} 
                imageUrl={imageUrl} />
            </div>
          : route === 'register'
          ? <Register onRouteChange={this.onRouteChange}/>
          : <Signin onRouteChange={this.onRouteChange}/>
          
          }
      </div>
    )
  };
}



export default App;

// "color"
// "ball"
// "lines" nice (change color in letters) (maybe with letters with exterior black, interior)
// "thick" nice (change color in letters)
// "circle" nice
// "cobweb" kind of nice
// "polygon"
// "square"
// "tadpole"
// "fountain"
// "random" Kind of nice, but letters might become hard to read
// "custom"