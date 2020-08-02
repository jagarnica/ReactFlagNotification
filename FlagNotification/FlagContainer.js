import React, { Component } from "react"
import styled from "styled-components"

import ReactDOM from "react-dom"
import FlagManager from './FlagManager'
import FlagMap from './FlagMapper'
const createID = () => {
  const pattern = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx"
  return pattern.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0
    const v = c === "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

class FlagContainer extends Component {
    constructor(props) {
      super(props)
      this.state = {
        notifications: [],
        containerID: createID(),
        activeContainer: -1,
    }
}
componentDidMount() {
  FlagManager.addChangeListener(this.HandleFlagChange)
  FlagManager.addContainerChangeListener(this.handleUpdateContainerChange)
  FlagManager.updateContainerID(this.state.containerID)

}
componentWillUnmount() {
  FlagManager.containerUnmounting(this.state.containerID)
  FlagManager.removeChangeListener(this.HandleFlagChange)
  FlagManager.removeContainerChangeListener(this.handleUpdateContainerChange)

}
HandleFlagChange = (notifications) =>{
  this.setState({
    notifications
  });
}
HandleRemoveFlag = (notification) =>{
  FlagManager.remove(notification)
}
handleUpdateContainerChange = (containerId) =>{
  if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
    if(this.state.containerID!==containerId){
      console.warn("There are at least two flag containers mounted, flags will only be posted to last one mounted. To prevent bugs, mount only one container per active screen.")
    }
  }
  this.setState({
    activeContainer:containerId
  })
}
render() {
    try {
      return this.state.activeContainer===this.state.containerID? (
        ReactDOM.createPortal( 
          <InnerContainer >
            <FlagMap
        notifications={this.state.notifications}
        handleFlagClose={this.HandleRemoveFlag}
      />
          </InnerContainer>
     ,document.body)
      ) : null
    } catch (e) {
      if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
        console.log(e)
      }
      return null
    }
  }
}
export default FlagContainer



const InnerContainer = styled.div`

position:fixed;
z-index: 999;
min-width:0;
overflow-x: visible;
overflow-y: visible;
pointer-events: none;

/**************** Positioning **********/
display:flex;
flex-direction:column;  
align-content:flex-end;
bottom:20px;
left:50%;
padding-top:0px;








`