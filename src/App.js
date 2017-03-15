import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import * as firebase from 'firebase';
import moment from 'moment';
import DisplayFirebaseValues from './components/DisplayFirebaseValues';

const config = {
  apiKey: "AIzaSyDyX1F_BohfqXWzDFFZfJgyo4MBjApbVyQ",
  authDomain: "firemaster-fcec2.firebaseapp.com",
  databaseURL: "https://firemaster-fcec2.firebaseio.com",
  storageBucket: "firemaster-fcec2.appspot.com",
  messagingSenderId: "1054052317953"
};

//setup dbRef constant to: 1. Initialize firebase, 2. Connect to firebase database(), 3. Find the location
const dbRef = firebase.initializeApp(config).database().ref();
const roomsRef = dbRef.child('rooms');
const messagesRef = dbRef.child('messages');

class App extends Component {
  //setup initial state
  constructor(){
    super();
    this.state = {
      text: '',
      roomName: '',
      creator: '',
      roomCreatedAt: '',
      roomDesc: '',
      content: '',
      messageCreatedAt: '',
      roomId: '',
      userName: '',
      firebaseList: {},
      firebaseValuesArray: [],
      firebaseUIDArray: []
    }
  }
  componentDidMount(){
    roomsRef.on('value', snap => {
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

  handleSubmitRoom(){
    roomsRef.push({
      roomName: this.state.roomName,
      creator: this.state.creator,
      roomDesc: this.state.roomDesc,
      roomCreatedAt: this.state.roomCreatedAt
    });
    this.setState({
      roomName: '',
      creator: '',
      roomCreatedAt: '',
      roomDesc: ''
    });
  }

  handleSubmitMessage(){
    messagesRef.push({
      roomId: this.state.roomId,
      content: this.state.content,
      userName: this.state.userName,
      messageCreatedAt: this.state.messageCreatedAt
    });
    this.setState({
      roomId: '',
      content: '',
      userName: '',
      messageCreatedAt: ''
    })
  }

  removeItem(index){
    roomsRef.child(index).remove();
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
      roomCreatedAt: moment().format('MMMM Do YYYY, hh:mm:ss a')
    })
  }

  handleMessageInfo(e){
    this.setState({
      [e.target.name]: e.target.value,
      messageCreatedAt: moment().format('MMMM Do YYYY, hh:mm:ss a')
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
        <h2>{moment().format('MMMM Do YYYY, hh:mm:ss a')}</h2>
        <p className="App-intro">
          Enter room info
        </p>

        <form onSubmit={this.handleSubmitRoom.bind(this)} >
          <input type="text" ref="roomNameItem" name="roomName" value={this.state.roomName} placeholder="room name" onChange={this.handleRoomInfo.bind(this)}></input>
          <input type="text" ref="creatorItem" name="creator" value={this.state.creator} placeholder="creator" onChange={this.handleRoomInfo.bind(this)}></input>
          <input type="text" ref="roomDescItem" name="roomDesc" value={this.state.roomDesc} placeholder="roomDesc" onChange={this.handleRoomInfo.bind(this)}></input>
          <input type="submit" value="Add Room" />
        </form>

        <p>Messages:</p>

        <form onSubmit={this.handleSubmitMessage.bind(this)} >
          <input type="text" ref="contentItem" name="content" value={this.state.content} placeholder="message content" onChange={this.handleMessageInfo.bind(this)} />
          <input type="text" ref="roomIdItem" name="roomId" value={this.state.roomId} placeholder="roomId" onChange={this.handleMessageInfo.bind(this)} />
          <input type="text" ref="userNameItem" name="userName" value={this.state.userName} placeholder="userName" onChange={this.handleMessageInfo.bind(this)} />
          <input type="submit" value="Add message" />
        </form>

        <p>Text: {this.state.text}</p>

        <DisplayFirebaseValues removeItem={this.removeItem.bind(this)} firebaseList={this.state.firebaseList} />
      </div>
    );
  }
}

export default App;
