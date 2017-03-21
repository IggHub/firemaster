import React, { Component } from 'react';
import './App.css';
import * as firebase from 'firebase';
import moment from 'moment';
import cookie from 'react-cookie';
import DisplayChatMessages from './components/DisplayChatMessages';
import DisplayEachChatroom from './components/DisplayEachChatroom';
import NewMessageForm from './components/NewMessageForm';
import NewRoomForm from './components/NewRoomForm';
import InputUserName from './components/InputUserName';
import {
  Grid,
  Col,
  Row,
  Button
} from 'react-bootstrap';

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
  constructor(){
    super();
    this.state = {
      roomName: '',
      creator: '',
      roomCreatedAt: '',
      roomKey: '',
      currentRoom: '',
      content: '',
      messageCreatedAt: '',
      userName: '',
      roomsList: {},
      selectRoomInfo: {},
      firebaseValuesArray: [],
      roomsUIDArray: [],
      messagesList: {},
      displayAddChatroomForm: false,
      userId: ''
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
    });
  }

  toggleAddChatroomDisplay(){
    this.setState({
      displayAddChatroomForm: !this.state.displayAddChatroomForm
    })
    console.log('display chatroom bool: ', this.state.displayAddChatroomForm);
    console.log(this.state.userId);
  }
  handleSubmitRoom(){
    roomsRef.push({
      roomName: this.state.roomName,
      creator: this.state.creator,
      roomCreatedAt: this.state.roomCreatedAt
    });
    this.setState({
      roomName: '',
      creator: '',
      roomCreatedAt: '',
    });
  }
  handleSubmitMessage(){
    messagesRef.push({
      content: this.state.content,
      messageCreatedAt: this.state.messageCreatedAt,
      messageRoomName: this.state.currentRoom
    });
    this.setState({
      content: '',
      messageCreatedAt: '',
      messageRoomName: ''
    })
  }
  handleSubmitUsername = (e) => {
//    cookie.save('username', username)
    if (e) {
      e.preventDefault();
    }
    //const name = this.refs.userNameItem.value;
    console.log('username: ', this.inputValue.value);
  }
  handleEnterUsername(e){
    this.setState({
      userName: e.target.value
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
             /> : <div></div>
    const chatForm = this.state.displayAddChatroomForm ?               <NewRoomForm handleSubmitRoom={this.handleSubmitRoom.bind(this)}
                    roomName={this.state.roomName}
                    handleRoomInfo={this.handleRoomInfo.bind(this)}
                    /> : <div></div>
    return (
      <div className="App">
        <h1>Current room: {this.state.currentRoom}</h1>
        <h2>{moment().format('MMMM Do YYYY, hh:mm:ss a')}</h2>


          <input type="text" id="textbox" placeholder="username"
            ref={ function(node){ this.inputValue = node }.bind(this) }
          />
        <button onClick={this.handleSubmitUsername}>Get it</button>
        <Grid>
          <Row>
            <Col md={4}>

              <DisplayEachChatroom
                removeItem={this.removeItem.bind(this)}
                handleCurrentRoom={this.handleCurrentRoom.bind(this)}
                roomsList={this.state.roomsList}
                currentRoom={this.state.currentRoom}
                />
              <Button bsStyle="primary" onClick={this.toggleAddChatroomDisplay.bind(this)}>Add Room</Button>
              {chatForm}
            </Col>
            <Col md={8}>
              <button onClick={this.getRoom.bind(this)}>Click to get info from Current Room</button>
              <DisplayChatMessages selectRoomInfo={this.state.selectRoomInfo}/>
              {messageForm}
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default App;
