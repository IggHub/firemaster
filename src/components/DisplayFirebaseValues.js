import React from 'react';

class DisplayFirebaseValues extends React.Component{
  render(){
    const firebaseUID = Object.keys(this.props.roomsList).map((firebaseItem, index) => {
      return <li key={index}><a href="#" onClick={() => this.props.removeItem(firebaseItem)}>X</a> {firebaseItem}</li>
    })
    const roomsListValues = Object.values(this.props.roomsList);
    const roomsListRoomName = roomsListValues.map((firebaseItem, index) => {
      return <li key={index}>RoomName: <a href="#" onClick={this.props.handleCurrentRoom}>{firebaseItem.roomName}</a></li>
    })
    return (
      <div>
        <div>
          <p>Firebase UID Keys:</p>
          <ul>
            {firebaseUID}
          </ul>
          <p>Firebase room info</p>
          <ul>
            {roomsListRoomName}
          </ul>
        </div>
      </div>
    )
  }
}

export default DisplayFirebaseValues
