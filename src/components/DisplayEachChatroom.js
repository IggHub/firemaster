import React from 'react';


class DisplayEachChatroom extends React.Component{
  render(){
    const chatRooms = Object.keys(this.props.roomsList).map((firebaseItem, index) => {
      return <li key={index}><a href="#" onClick={() => this.props.removeItem(firebaseItem)}>X</a> <a href="#" onClick={this.props.handleCurrentRoom}>{this.props.roomsList[firebaseItem].roomName}</a></li>
    })
    console.log('roomslist: ', this.props.roomsList);
    return (
      <div>
        <div>
          <p>List of Chatrooms:</p>
          <ul>
            {chatRooms}
          </ul>
        </div>
      </div>
    )
  }
}

export default DisplayEachChatroom;
