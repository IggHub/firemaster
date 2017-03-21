import React, { Component } from 'react';
import './App.css';
import * as firebase from 'firebase';
import moment from 'moment';
import cookie from 'react-cookie';
import DisplayChatMessages from './components/DisplayChatMessages';
import DisplayEachChatroom from './components/DisplayEachChatroom';
import NewMessageForm from './components/NewMessageForm';
import NewRoomForm from './components/NewRoomForm';
//import InputUserName from './components/InputUserName';
import {
  Grid,
  Col,
  Row,
  Button,
  Modal
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
      userId: '',
      showModal: false
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
  openModal(){
    this.setState({showModal: true}, () => {console.log(this.state.showModal)});
  }
  closeModal(){
    this.setState({showModal: false})
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
  handleSubmitUsername(e) {
    if (e) {
      e.preventDefault();
    }

    const username = this.inputValuez.value;
    cookie.save('username', username);
    console.log('username: ', username);
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
  gimmecookies(){
    const cookieUsername = cookie.load('username');
    console.log('cookie username: ', cookieUsername);
  }
  logout(){
    cookie.remove('username');
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
        <Button bsStyle="primary" bsSize="large" onClick={this.openModal.bind(this)}>Demo modal</Button>

        <Modal show={this.state.showModal} onHide={this.closeModal.bind(this)}>
          <Modal.Header closeButton>
            <Modal.Title>Some heading</Modal.Title>
            <Modal.Body>

              @<input type="text" placeholder="username"
                ref={(node) => {this.inputValuez = node}}
                />
              <button onClick={this.handleSubmitUsername.bind(this)}>Set Username</button>

            </Modal.Body>
          </Modal.Header>
        </Modal>

        <h1>Current room: {this.state.currentRoom}</h1>
        <h2>{moment().format('MMMM Do YYYY, hh:mm:ss a')}</h2>

        <button onClick={this.gimmecookies}>Cookie name</button>
        <button onClick={this.logout}>Log out</button>
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
