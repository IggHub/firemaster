import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import * as firebase from 'firebase';
import moment from 'moment';
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
      createdAt: '',
      roomDesc: '',
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
    //recreate another 'dbRef' that points to messages node.
    //room1 will be dynamic (whatever user clicks)
    //dbRef.orderByChild('roomName').equalTo('Room1').on('child_added', (snap) => {
    //  console.log('getRoom equalTo orderbychild(room1): ', snap.val());
    //})
  }

  handleSubmitText(){
    dbRef.push({
      roomName: this.state.roomName,
      creator: this.state.creator,
      roomDesc: this.state.roomDesc,
      createdAt: this.state.createdAt
    });
    this.setState({
      roomName: '',
      creator: '',
      createdAt: '',
      roomDesc: ''
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
  handleRoomInfo(e){
    this.setState({
      [e.target.name]: e.target.value,
      createdAt: moment().format('MMMM Do YYYY, hh:mm:ss a')
    })
  }

  getRoom(){

  }
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <h1 id="bigOne">I am a big one</h1>
        <h2>{moment().format('MMMM Do YYYY, hh:mm:ss a')}</h2>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <form onSubmit={this.handleSubmitText.bind(this)} >
          <input type="text" ref="roomNameItem" name="roomName" value={this.state.roomName} placeholder="room name" onChange={this.handleRoomInfo.bind(this)}></input>
          <input type="text" ref="creatorItem" name="creator" value={this.state.creator} placeholder="creator" onChange={this.handleRoomInfo.bind(this)}></input>
          <input type="text" ref="roomDescItem" name="roomDesc" value={this.state.roomDesc} placeholder="roomDescf" onChange={this.handleRoomInfo.bind(this)}></input>
          <input type="submit" value="Add Room" />
        </form>
        <p>Text: {this.state.text}</p>
        <DisplayFirebaseValues removeItem={this.removeItem.bind(this)} firebaseList={this.state.firebaseList} />
        <button onClick={this.getRoom.bind(this)}>GET THIS CHILD</button>
      </div>
    );
  }
}

export default App;
