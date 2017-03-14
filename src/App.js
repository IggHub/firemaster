import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
//firebase attributes
import * as firebase from 'firebase';
//components
import DisplayFirebaseValues from './components/DisplayFirebaseValues';

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
      text: '',
      roomName: '',
      creator: '',
      firebaseList: {},
      firebaseValuesArray: [],
      firebaseUIDArray: []
    }
  }
  componentDidMount(){
    dbRef.on('value', snap => {
      this.setState({
        firebaseList: snap.val(),
        firebaseUIDArray: Object.keys(snap.val())
      }, () => {
        console.log('firebaseUIDArray: ', this.state.firebaseUIDArray);
        console.log('firebaseList: ', this.state.firebaseList);
      });
    });
  }

  handleSubmitText(){
    var pushedRef = dbRef.push({
      roomName: this.state.roomName,
      creator: this.state.creator
    });
    console.log('pushedRef: ', pushedRef.key);
    this.setState({
      roomName: '',
      creator: '',
    });
  }

  removeItem(index){
    dbRef.child(index).remove();
  }

  //update state of text
  handleTextState(e){
    this.setState({
      text: e.target.value
    })
  }
  handleRoomName(e){
    this.setState({
      roomName: e.target.value
    })
  }
  handleCreator(e){
    this.setState({
      creator: e.target.value
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

        <input type="text" ref="roomNameItem" value={this.state.roomName} placeholder="room name" onChange={this.handleRoomName.bind(this)}></input>
        <input type="text" ref="creatorItem" value={this.state.creator} placeholder="creator name" onChange={this.handleCreator.bind(this)}></input>
        <button onClick={this.handleSubmitText.bind(this)}>Add Room</button>

        <p>Text: {this.state.text}</p>
        <DisplayFirebaseValues removeItem={this.removeItem.bind(this)} firebaseList={this.state.firebaseList} />
      </div>
    );
  }
}

export default App;
