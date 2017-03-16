import React from 'react';

class DisplayEachChatroom extends React.Component{
  render(){
      const selectRoomInfo = Object.values(this.props.selectRoomInfo);
      const chatroomMessages = selectRoomInfo.map((chatroomMessage, index) => {
        return <li key={index}>{chatroomMessage.content}</li>
      })
    return(
      <div>
        {chatroomMessages}
      </div>
    )
  }
}

export default DisplayEachChatroom;
