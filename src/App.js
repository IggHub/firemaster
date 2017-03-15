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
      roomKey: '',
      currentRoom: '',
      content: '',
      messageCreatedAt: '',
      roomId: '',
      userName: '',
      roomsList: {},
      firebaseValuesArray: [],
      roomsUIDArray: [],
      messagesList: {}
    }
  }
  componentDidMount(){
    roomsRef.on('value', snap => {
      this.setState({
        roomsList: snap.val(),
        roomsUIDArray: Object.keys(snap.val()),
        roomKey: snap.key,
      }, () => {
        console.log('roomsUIDArray: ', this.state.roomsUIDArray);
        console.log('roomsList: ', this.state.roomsList);
        console.log('roomKey: ', this.state.roomKey);
      });
    });
    messagesRef.on('value', snap => {
      this.setState({
        messagesList: snap.val()
      }, () => {
        console.log('firebase messagesList: ', this.state.messagesList);
      })
    })
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
    //roomsRef; //go to child('rooms');
    //var roomKey; //find currentRoom. Go to firebase db, findbychild, and GET THE KEY.
    messagesRef.push({
      roomId: this.state.roomId, //roomKey goes here
      content: this.state.content,
      userName: this.state.userName,
      messageCreatedAt: this.state.messageCreatedAt,
      messageRoomName: this.state.currentRoom
    });
    this.setState({
      roomId: '',
      content: '',
      userName: '',
      messageCreatedAt: '',
      messageRoomName: ''
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
  handleCurrentRoom(e){
    this.setState({
      currentRoom: e.target.innerHTML,
    })
    console.log("innerHTML: ", e.target.innerHTML)
  }
  getRoom(){

    //this works! It queries ALL messages done in Room10. Now to make it dynamic...
    //next: maybe -> save messageRef.orderBy... into a variable, and then display those variables to list all messages from such messageRoom
    messagesRef.orderByChild('messageRoomName').equalTo(this.state.currentRoom).on('value', (snap) => {
      console.log('get orderByChild(roomName): ', snap.val());
    })

  }
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <h1 id="bigOne">Current room: {this.state.currentRoom}</h1>
        <h2>Room key: </h2>
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

        <DisplayFirebaseValues
          removeItem={this.removeItem.bind(this)}
          handleCurrentRoom={this.handleCurrentRoom.bind(this)}
          roomsList={this.state.roomsList}
          currentRoom={this.state.currentRoom}
          />
        <button onClick={this.getRoom.bind(this)}>Click to get info from Current Room</button>
      </div>
    );
  }
}

export default App;
