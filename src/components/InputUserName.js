import React from 'react';

class InputUserName extends React.Component{
  render(){
    return (
      <div>
        <input type="text" placeholder="username"
            ref={ (node) => { this.inputValuez = node } }
          />
        <button onClick={this.handleSubmitUsername}>Username</button>
      </div>
    )
  }
}

export default InputUserName;
