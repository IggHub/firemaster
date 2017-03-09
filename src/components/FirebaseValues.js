import React from 'react';

class FirebaseValues extends React.Component{
  render(){
    const firebaseValues = this.props.firebaseValuesArray.map((firebaseitem, index) => {
      return <li key={index}>{firebaseitem}</li>
    })
    return (
      <div>
        Hello firebase Values!
        <ul>{firebaseValues}</ul>
      </div>
    )
  }
}

export default FirebaseValues
