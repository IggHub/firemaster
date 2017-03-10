import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import logo from './logo.svg';
import './App.css';
//firebase attributes
import * as firebase from 'firebase';
//components
import FirebaseValues from './components/FirebaseValues';

//config for firebase
const config = {
  apiKey: "AIzaSyDyX1F_BohfqXWzDFFZfJgyo4MBjApbVyQ",
  authDomain: "firemaster-fcec2.firebaseapp.com",
  databaseURL: "https://firemaster-fcec2.firebaseio.com",
  storageBucket: "firemaster-fcec2.appspot.com",
  messagingSenderId: "1054052317953"
};

//setup dbRef constant to: 1. Initialize firebase, 2. Connect to firebase database(), 3. Find the location
const dbRef = firebase.initializeApp(config).database().ref().child('rooms');

class App extends Component {
  //setup initial state
  constructor(){
    super();
    this.state = {
      text: "",
      firebaseList: {},
      firebaseValuesArray: [],
      firebaseKeysArray: []
    }
  }
  //currently obsolete
  componentDidMount(){
    //var bigOne = document.getElementById('bigOne');
    //on is an event listener that listens to any changes done to firebase
    dbRef.on('value', snap => {
      console.log(snap.val());
      console.log('firebaseKeysArray: ', Object.keys(snap.val()));
      console.log('firebaseRoomNameArray: ', Object.values(snap.val()).map((v) => v.roomName));
      console.log('firebaseCreatorArray: ', Object.values(snap.val()).map((v) => v["creator"]));
    });
  }
  handleSubmitText(){
    var pushedRef = dbRef.push(this.state.text);
    console.log('pushedRef: ', pushedRef.key);
    this.setState({
      text: ''
    });
    //clears up input after button click
    ReactDOM.findDOMNode(this.refs.textItem).value = '';
  }
  //update state of text
  handleTextState(e){
    this.setState({
      text: e.target.value
    })
  }
  render() {

    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <h1 id="bigOne">I am a big one</h1>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <input type="text" ref="textItem" onChange={this.handleTextState.bind(this)}></input>
        <button onClick={this.handleSubmitText.bind(this)}>Add list</button>
        <p>Text: {this.state.text}</p>
        <FirebaseValues firebaseValuesArray={this.state.firebaseValuesArray} />
      </div>
    );
  }
}

export default App;
