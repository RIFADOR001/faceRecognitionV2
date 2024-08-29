import React from 'react';
import ParticlesBg from 'particles-bg';
import MouseParticles from 'react-mouse-particles' //mine 
// import Clarifai from 'clarifai';
import Navigation from './components/Navigation/Navigation';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import FaceRecognition2 from './components/FaceRecognition/FaceRecognition2';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import ImageLinkForm2 from './components/ImageLinkForm/ImageLinkForm2';
import './App.css';
import 'tachyons';

//https://github.com/lindelof/react-mouse-particles

// Image
//https://www.usatoday.com/gcdn/authoring/authoring-images/2024/07/22/USAT/74506078007-xxx-getty-images-1923851619-sed.JPG?crop=3222,2416,x178,y0


const initialState = {
  input: '',
  imageUrl: '',
  box: {},
  // route: 'signin',
  route: 'home',
  // isSignIn: false,
  isSignIn: true,
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
    console.log('data: ', data);
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

    getBoxBackend = (width, height, box) => {
    // console.log("printing box: ", box);
    // console.log("printing dims: ", width, height);
    return {
      leftCol: box.left_col * width,
      topRow: box.top_row * height,
      rightCol: width - (box.right_col * width),
      bottomRow: height - (box.bottom_row * height)
    }
  }


  calculateFacesLocationsBackend = (data) => {
    // const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width); 
    const height = Number(image.height);
    // console.log(clarifaiFaces);
    // const boxList = clarifaiFaces.map((width, height, face) => this.getBox(width, height, face));
    const boxList = data.map( obj => {
      const box = obj.region_info.bounding_box;
      return this.getBoxBackend(width, height, box)
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

    // fetch("http://localhost:3000/imageurl", {
    fetch("https://facerecognitionbrain-api-1o4x.onrender.com/imageurl", {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        input: this.state.input
      })
    })
      .then(response => {
        // console.log('res (regions?) from testapi: ', response);
        return response.json()
      })
      .then(response => {
        console.log('res from testapi: ', response);
        this.displayFaceBox(this.calculateFaceLocation(response))
        // if (response[0].region_info.bounding_box){
        //   fetch('http://localhost:3000/image', {
        //   // fetch('https://facerecognitionbrain-api-1o4x.onrender.com/image', {
        //     method: 'put',
        //     headers: {'Content-Type': 'application/json'},
        //     body: JSON.stringify({
        //     id: this.state.user.id
        //     })
        //   })
        //   .then(response => response.json())
        //   .then(count => {
        //     this.setState(Object.assign(this.state.user, { entries: count }))
        //   })
        // }
      })
      .catch(err => console.log);
  /**************************************************************/
  }

  onButtonSubmit2 = () => {
    this.setState({imageUrl: this.state.input})

    // fetch("http://localhost:3000/imageurl", {
    fetch("https://facerecognitionbrain-api-1o4x.onrender.com/imageurl", {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        input: this.state.input
      })
    })
      .then(response => {
        // console.log('res (regions?) from testapi: ', response);
        return response.json()
      })
      .then(response => {
        // console.log('res from testapi: ', response);

        this.displayFaceBoxes(this.calculateFacesLocationsBackend(response))

        // if (response[0].region_info.bounding_box){
        //   fetch('http://localhost:3000/image', {
        //   // fetch('https://facerecognitionbrain-api-1o4x.onrender.com/image', {
        //     method: 'put',
        //     headers: {'Content-Type': 'application/json'},
        //     body: JSON.stringify({
        //     id: this.state.user.id
        //     })
        //   })
        //   .then(response => response.json())
        //   .then(count => {
        //     this.setState(Object.assign(this.state.user, { entries: count }))
        //   })
        // }
      })
      .catch(err => console.log);
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


/***********************************************

<ImageLinkForm 
              onInputChange={this.onInputChange} 
              onButtonSubmit={this.onButtonSubmit} 
              />
<FaceRecognition
                box={box} 
                imageUrl={imageUrl} />
/**********************************************/

  render (){
    const { isSignIn, imageUrl, route, box, boxList } = this.state;
    return (
      <div className="App">
        <MouseParticles g={1} color="random" cull="col,image-wrapper"/> {/*Mine*/}
        <ParticlesBg className='particles' type="circle" bg={true} />

            <div> 
              <Logo />
              
              <ImageLinkForm2
              onInputChange={this.onInputChange} 
              onButtonSubmit2={this.onButtonSubmit2} 
              />
              <FaceRecognition2
                boxes={boxList} 
                imageUrl={imageUrl} />
            </div>
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