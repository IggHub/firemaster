import React from 'react';

class NewRoomForm extends React.Component{
  render(){
    return (
      <div>

        <form onSubmit={this.props.handleSubmitRoom.bind(this)} >
          <input type="text" ref="roomNameItem" name="roomName" value={this.props.roomName} placeholder="room name" onChange={this.props.handleRoomInfo}></input>
          <input type="text" ref="creatorItem" name="userName" value={this.props.userName} placeholder="creator" onChange={this.props.handleRoomInfo}></input>
          <input type="submit" value="Add Room" />
        </form>
      </div>
    )
  }
}

export default NewRoomForm;
