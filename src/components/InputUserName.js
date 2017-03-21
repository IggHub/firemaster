import React from 'react';

class InputUserName extends React.Component{
  render(){
    return (
      <div>

        <input type="text" ref={(node) => {this.props.inputValue = node}} placeholder="input username" />
        <input type="button" value="Enter your username" onClick={this.props.handleSubmitUsername}/>

      </div>
    )
  }
}

export default InputUserName;
