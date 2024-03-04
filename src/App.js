import React from 'react';
import ParticlesBg from 'particles-bg';
import MouseParticles from 'react-mouse-particles' //mine 
import Clarifai from 'clarifai';
import Navigation from './components/Navigation/Navigation';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import FaceRecognition2 from './components/FaceRecognition/FaceRecognition2';
import Signin from './components/Signin/Signin';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import ImageLinkForm2 from './components/ImageLinkForm/ImageLinkForm2';
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


const initialState = {
  input: '',
  imageUrl: '',
  box: {},
  route: 'signin',
  isSignIn: false,
  boxList: [],
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
}

class App extends React.Component {
  constructor() {
    super();
    this.state = initialState;
    }
  


  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }


  // Checking connection with server
  // componentDidMount() {
  //   fetch('http://localhost:3000')
  //     .then(response => response.json())
  //     .then(console.log)
  // }

  calculateFaceLocation = (data) => {
    console.log('data: ', data.outputs);
    // const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const clarifaiFace = data[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width); 
    const height = Number(image.height);
    console.log('face: ', clarifaiFace);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  getBox = (width, height, region) => {
    const box = region.region_info.bounding_box;
    // console.log("printing box: ", box);
    // console.log("printing dims: ", width, height);
    return {
      leftCol: box.left_col * width,
      topRow: box.top_row * height,
      rightCol: width - (box.right_col * width),
      bottomRow: height - (box.bottom_row * height)
    }
  }

  calculateFacesLocations = (data) => {
    // const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const clarifaiFaces = data.outputs[0].data.regions;      
    const image = document.getElementById('inputimage');
    const width = Number(image.width); 
    const height = Number(image.height);
    // console.log(clarifaiFaces);
    // const boxList = clarifaiFaces.map((width, height, face) => this.getBox(width, height, face));
    const boxList = clarifaiFaces.map( region => {
      return this.getBox(width, height, region)
    })
    // console.log("Printing Box list: ",boxList);
    return boxList
  }

  displayFaceBox = (box) => {
    this.setState({box: box})
  }

  displayFaceBoxes = (boxList) => {
    // console.log("Printing again box list: ", boxList)
    this.setState({boxList: boxList})
    // console.log("Printing boxlist state: ", this.state.boxList);
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input})
    // console.log(this.state.input);
    /*********************************************
    fetch("http://localhost:3000/imageurl", {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        input: this.state.input
      })
    })
      .then(response => {
        console.log('res from api: ', response);
        return response.json()
      })
      .then(response => {
        console.log('res from api: ', response);
        return response.json()
      })
      .then(response => {
        console.log('json: ', response);
        if(response) {
          console.log('if response: ')
          fetch('http://localhost:3000/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
            id: this.state.user.id
            })
          })
        }
        this.displayFaceBox(this.calculateFaceLocation(response))
      })
      .catch(err => console.log);
/***************************************************/
/***************************************************
    fetch("https://api.clarifai.com/v2/models/" + "face-detection" + "/outputs", clarifaiJSONRequestOptions(this.state.input))
      .then(response => {
        console.log('api response from app: ', response.outputs);
        return response.json()
      })
      .then(response => {
        console.log('again: ', response.outputs);
        if(response) {
          fetch('http://localhost:3000/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
            id: this.state.user.id
            })
          })
        }
        this.displayFaceBox(this.calculateFaceLocation(response))
      })
      .catch(err => console.log);
/***************************************************/
    fetch("http://localhost:3000/test", {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        input: this.state.input
      })
    })
      .then(response => {
        console.log('res (regions?) from testapi: ', response);
        return response.json()
      })
      .then(response => {
        console.log('res from testapi: ', response);
        this.displayFaceBox(this.calculateFaceLocation(response))
        return response.json()
      })
      .then(response => {
        console.log('json: ', response);
        if(response) {
          console.log('test if response: ')
          fetch('http://localhost:3000/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
            id: this.state.user.id
            })
          })
        }
        this.displayFaceBox(this.calculateFaceLocation(response))
      })
      .catch(err => console.log);
  /**************************************************************/
  }
/**************************************************************
  boxes = async function () {
      // console.log('onButtonSubmit2');
      try {
        // console.log(this.state);
        const response = await fetch("https://api.clarifai.com/v2/models/" + "face-detection" + "/outputs", clarifaiJSONRequestOptions(this.state.input));
        const data = await response.json();
        if(data) {
          // console.log('response');
          // console.log(data);
          fetch('http://localhost:3000/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
            id: this.state.user.id
            })
          })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, { entries: count }))
          })
          .catch(console.log)
        }
        this.displayFaceBoxes(this.calculateFacesLocations(data));
        // setTimeout(() => console.log("state after 1s: ",this.state.boxList) ,1000);
        // console.log(this.state.boxList);
      } catch (err) {
        console.log('Error while fetching and computing boxes', err);
      }
    }

  onButtonSubmit2 = () => {
    this.setState({imageUrl: this.state.input})

    // fetch("https://api.clarifai.com/v2/models/" + "face-detection" + "/outputs", clarifaiJSONRequestOptions(this.state.input))
    //   .then(response => response.json())
    //   .then(response => this.displayFaceBoxes(this.calculateFacesLocations(response)))
    //   .then(() => setTimeout(() => console.log("state after 1s: ",this.state.boxList) ,1000))
    //   .catch(err => console.log);

    this.boxes();
  }
/**************************************************************/
  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState(initialState);
    }else if (route === 'home') {
      this.setState({isSignIn: true});
    }
    this.setState({route: route});
  }

// video 288 for corrections
  // <ImageLinkForm2 
// onButtonSubmit2={this.onButtonSubmit2} 
  //<FaceRecognition2
  //boxes={boxList}
  render (){
    const { isSignIn, imageUrl, route, box, boxList } = this.state;
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
              <Rank userName={this.state.user.name} entries={this.state.user.entries}/>
              <ImageLinkForm 
              onInputChange={this.onInputChange} 
              onButtonSubmit={this.onButtonSubmit} 
              />
              <FaceRecognition
                box={box} 
                imageUrl={imageUrl} />
            </div>
          : route === 'register'
          ? <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
          : <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
          
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