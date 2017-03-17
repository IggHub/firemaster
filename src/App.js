import React, { Component } from 'react';
import './App.css';
import * as firebase from 'firebase';
import moment from 'moment';
import DisplayChatMessages from './components/DisplayChatMessages';
import DisplayEachChatroom from './components/DisplayEachChatroom';
import NewMessageForm from './components/NewMessageForm';
import NewRoomForm from './components/NewRoomForm';


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
      selectRoomInfo: {},
      firebaseValuesArray: [],
      roomsUIDArray: [],
      messagesList: {},
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
    messagesRef.orderByChild('messageRoomName').equalTo(this.state.currentRoom).on('value', (snap) => {
      this.setState({
        selectRoomInfo: snap.val()
      }, () => {console.log('selectRoomInfo: ', this.state.selectRoomInfo)})
    })
  }
  render() {
    const messageForm = this.state.currentRoom ?         <NewMessageForm
              handleSubmitMessage={this.handleSubmitMessage.bind(this)}
              handleMessageInfo={this.handleMessageInfo.bind(this)}
              content={this.state.content}
              roomId={this.state.roomId}
              userName={this.state.userName}
             /> : <div></div>
    return (
      <div className="App">
        <h1>Current room: {this.state.currentRoom}</h1>
        <h2>{moment().format('MMMM Do YYYY, hh:mm:ss a')}</h2>
        <p className="App-intro">
          Enter room info
        </p>


        <NewRoomForm handleSubmitRoom={this.handleSubmitRoom.bind(this)}
          roomName={this.state.roomName}
          creator={this.state.creator}
          roomDesc={this.state.roomDesc}
          handleRoomInfo={this.handleRoomInfo.bind(this)}
          />
        {messageForm}
        <DisplayChatMessages
          removeItem={this.removeItem.bind(this)}
          handleCurrentRoom={this.handleCurrentRoom.bind(this)}
          roomsList={this.state.roomsList}
          currentRoom={this.state.currentRoom}
          />
        <button onClick={this.getRoom.bind(this)}>Click to get info from Current Room</button>
        <DisplayEachChatroom selectRoomInfo={this.state.selectRoomInfo}/>
      </div>
    );
  }
}

export default App;
