import React from 'react';

class DisplayFirebaseValues extends React.Component{
  render(){
//    const firebaseList = this.props.firebaseList.map((firebaseitem, index) => {
//      return <li key={index}>{firebaseitem.roomName}</li>
//    })
    const firebaseUID = Object.keys(this.props.firebaseList).map((firebaseItem, index) => {
      return <li key={index}>{firebaseItem}</li>
    })

    const firebaseListValues = Object.values(this.props.firebaseList);
    console.log('firebaseListValues: ', firebaseListValues);

    const firebaseListRoomName = firebaseListValues.map((firebaseItem, index) => {
      return <li key={index}>{firebaseItem.roomName}</li>
    })
    const firebaseListCreator = firebaseListValues.map((firebaseItem, index) => {
      return <li key={index}>{firebaseItem.creator}</li>
    })
    console.log('firebaseList from display: ', this.props.firebaseList)
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
          <p>Hello firebase creators!</p>
          <ul>
            {firebaseListCreator}
          </ul>
        </div>
      </div>
    )
  }
}

export default DisplayFirebaseValues
