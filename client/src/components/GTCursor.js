import React from 'react';
import { subsribeEyemovedEvent } from '../api/socket-client';

const basicStyle = {
  borderRadius: '50%',
  width: '100px',
  height: '100px',
  background: 'rgba(10, 112, 215, 0.4)',
  marginTop: '-50px',
  marginLeft: '-50px',
  zIndex: 101,
  position: 'absolute',
  float: 'left',
  display: 'block'
};

export default class GTCursor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      x: 0,
      y: 0,
    };
    this.updatePosition = this.updatePosition.bind(this);
  }

  componentDidMount() {
  }
  
  componentWillUnmount() {
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.socket && this.props.socket) {
      subsribeEyemovedEvent(this.props.socket, (x, y) => {
        this.updatePosition({ screenX: x, screenY: y });
      });
    }
  }

  updatePosition(e) {
    const { screenX, screenY } = e;
    this.setState({ x: screenX, y: screenY });
  }
  
  render() {
    const { x, y } = this.state;
    const cursorStyle = {...basicStyle};
    cursorStyle.left = `${x}px`;
    cursorStyle.top = `${y}px`;
    return (<div style={cursorStyle} />);
  }
}