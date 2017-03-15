import React from 'react';

class DisplayFirebaseValues extends React.Component{
  render(){

    const firebaseUID = Object.keys(this.props.firebaseList).map((firebaseItem, index) => {
      return <li key={index}><a href="#" onClick={() => this.props.removeItem(firebaseItem)}>X</a> {firebaseItem}</li>
    })
    const firebaseListValues = Object.values(this.props.firebaseList);
    const firebaseListRoomName = firebaseListValues.map((firebaseItem, index) => {
      return <li key={index}>RoomName: {firebaseItem.roomName} | creator: {firebaseItem.creator} | at: {firebaseItem.createdAt} | roomDesc: {firebaseItem.roomDesc}</li>
    })
    return (
      <div>
        <div>
          <p>Hello firebase UID Keys!</p>
          <ul>
            {firebaseUID}
          </ul>
          <p>Hello firebase roomName! </p>
          <ul>
            {firebaseListRoomName}
          </ul>
        </div>
      </div>
    )
  }
}

export default DisplayFirebaseValues
