import React from 'react';

class NewRoomForm extends React.Component{
  render(){
    return (
      <div>
        <form onSubmit={this.props.handleSubmitRoom.bind(this)} >
          <input type="text" ref="roomNameItem" name="roomName" value={this.props.roomName} placeholder="room name" onChange={this.props.handleRoomInfo}></input>
          <input type="text" ref="creatorItem" name="creator" value={this.props.creator} placeholder="creator" onChange={this.props.handleRoomInfo}></input>
          <input type="text" ref="roomDescItem" name="roomDesc" value={this.props.roomDesc} placeholder="roomDesc" onChange={this.props.handleRoomInfo}></input>
          <input type="submit" value="Add Room" />
        </form>
      </div>
    )
  }
}

export default NewRoomForm;
