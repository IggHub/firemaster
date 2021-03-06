import React, { Component } from 'react';
import './App.css';
import './Custom.css';
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
  Modal,
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
//const timeStamp = firebase.initializeApp(config).database().ServerValue.TIMESTAMP;

class App extends Component {
  constructor(){
    super();
    this.state = {
      roomName: '',
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

  componentWillMount(){
    const cookieUsername = cookie.load('username');
    this.setState({
      userName: cookieUsername
    }, () => {console.log('saved cookieUsername: ', this.state.userName)})
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
    //console.log('display chatroom bool: ', this.state.displayAddChatroomForm);
    //console.log(this.state.userId);
  }
  handleSubmitRoom(e){
    if(e){
      e.preventDefault();
    }
    roomsRef.push({
      roomName: this.state.roomName,
      creator: this.state.userName,
      roomCreatedAt: firebase.database.ServerValue.TIMESTAMP
    });
    this.setState({
      roomName: '',
      roomCreatedAt: '',
    });
  }
  handleSubmitMessage(e){
    if (e) {
      e.preventDefault();
    }
    messagesRef.push({
      content: this.state.content,
      messageCreatedAt: this.state.messageCreatedAt,
      messageRoomName: this.state.currentRoom,
      userName: this.state.userName
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
    this.setState({userName: username});
    cookie.save('username', username, {
      maxAge: 86400
    });
    //console.log('username: ', username);
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
    messagesRef.orderByChild('messageRoomName').equalTo(this.state.currentRoom).on('value', (snap) => {
      this.setState({
        selectRoomInfo: snap.val()
      }, () => {console.log('selectRoomInfo: ', this.state.selectRoomInfo)})
    })
  }
  gimmecookies(){
    const cookieName = cookie.load('username');
    console.log('cookie username: ', cookieName);
  }
  logout(){
    cookie.remove('username');
    this.setState({
      userName: ''
    })
  }
  render() {

    const chatForm = this.state.displayAddChatroomForm ? <NewRoomForm handleSubmitRoom={this.handleSubmitRoom.bind(this)}
                    roomName={this.state.roomName}
                    userName={this.state.userName}
                    handleRoomInfo={this.handleRoomInfo.bind(this)}
                    /> : <div></div>
    return (
      <div className="fill">

        <Grid>
          <Row>
            <Col md={4} className="leftSide">
              <Button bsStyle="primary" bsSize="large" onClick={this.openModal.bind(this)}>Set username</Button>

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

              <button onClick={this.gimmecookies}>Cookie name</button>

              <DisplayEachChatroom
                removeItem={this.removeItem.bind(this)}
                handleCurrentRoom={this.handleCurrentRoom.bind(this)}
                roomsList={this.state.roomsList}
                currentRoom={this.state.currentRoom}
                />
              <Button bsStyle="primary" onClick={this.toggleAddChatroomDisplay.bind(this)}>Add Room</Button>
              {chatForm}
            </Col>

            <Col md={8} className="rightSide">
              <Row>
                <Col md={8}></Col>
                <Col md={4}>
                  <span>Hello, {this.state.userName}. You are in room {this.state.currentRoom}</span>
                  <button onClick={this.logout.bind(this)}>Log out</button>
                </Col>
              </Row>
              <DisplayChatMessages selectRoomInfo={this.state.selectRoomInfo}/>

            <div className="chatSubmitContainer">
              <NewMessageForm
                handleSubmitMessage={this.handleSubmitMessage.bind(this)}
                handleMessageInfo={this.handleMessageInfo.bind(this)}
                content={this.state.content}
                userName={this.state.userName}
                className="chatSubmit"
               />
            </div>

            </Col>
          </Row>
        </Grid>

      </div>
    );
  }
}

export default App;
