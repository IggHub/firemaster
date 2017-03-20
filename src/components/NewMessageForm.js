import React from 'react';

class NewMessageForm extends React.Component{
  render (){
    return (
      <div>
        <p>Messages:</p>
        <form onSubmit={this.props.handleSubmitMessage} >
          <input type="text" ref="contentItem" name="content" value={this.props.content} placeholder="message content" onChange={this.props.handleMessageInfo} />
          <input type="text" ref="userNameItem" name="userName" value={this.props.userName} placeholder="userName" onChange={this.props.handleMessageInfo} />
          <input type="submit" value="Add message" />
        </form>
      </div>
    )
  }
}
export default NewMessageForm;
