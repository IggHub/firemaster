import React from 'react';
import {
  InputGroup,
  FormGroup,
  FormControl,
  Glyphicon
  } from 'react-bootstrap';

const contentStyle = {
  width: '100%'
}
class NewMessageForm extends React.Component{
  render (){
    return (
      <div>
        <form onSubmit={this.props.handleSubmitMessage} >
          <FormGroup >
            <InputGroup>
              <FormControl type="text" ref="contentItem" name="content" value={this.props.content} placeholder="message content" onChange={this.props.handleMessageInfo} />
              <InputGroup.Addon><Glyphicon glyph="circle-arrow-up" type="submit"/></InputGroup.Addon>
            </InputGroup>
          </FormGroup>
        </form>
      </div>
    )
  }
}
export default NewMessageForm;
