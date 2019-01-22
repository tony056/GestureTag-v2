import React from 'react';
import { subsribeEyemovedEvent } from '../api/socket-client';

const cursorSize = 100;
const basicStyle = {
  borderRadius: '50%',
  width: `${cursorSize}px`,
  height: `${cursorSize}px`,
  background: 'rgba(10, 112, 215, 0.4)',
  marginTop: `-${Math.floor(cursorSize / 2)}px`,
  marginLeft: `-${Math.floor(cursorSize / 2)}px`,
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
      y: 0
    };
    this.updatePosition = this.updatePosition.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.socket && this.props.socket) {
      // subsribeEyemovedEvent(this.props.socket, (x, y) => {
      //   this.updatePosition({ screenX: x, screenY: y });
      // });
      this.props.socket.addEventListener('mousemove', e => {
        console.log('move');
        
        const { screenX, screenY } = e;
        this.updatePosition({ screenX, screenY });
      });
    }
  }

  updatePosition({ screenX, screenY }) {
    const minX = screenX - cursorSize / 2;
    const minY = screenY - cursorSize / 2;
    const maxX = screenX + cursorSize / 2;
    const maxY = screenY + cursorSize / 2;
    const lefTop =  {
      row: Math.floor(minY / 80),
      col: Math.floor(minX / 80),
    };

    const rightBottom = {
      row: Math.floor(maxY / 80),
      col: Math.floor(maxX / 80)
    };
    
    const cursor = {
      x: screenX,
      y: screenY,
      minR: lefTop.row,
      maxR: rightBottom.row,
      minC: lefTop.col,
      maxC: rightBottom.col
    };

    this.props.checkOverlaps(cursor);
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