import React from 'react';
import Hammer from 'hammerjs';
import { Button } from 'antd';
import { touchGestureDetector } from '../api/gesture';
import '../Touchpad.css';
import { initConnection } from '../api/socket-client';
import GTTouchPoint from '../components/GTTouchPoint';

export default class Touchpad extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fullscreen: false,
      gesture: 0,
      x: 0,
      y: 0
    };
    this.isEmitting = false;
    this.touchManager = null;
    this.socket = null;
    this.handleClick = this.handleClick.bind(this);
    this.handleResizeEvent = this.handleResizeEvent.bind(this);
    this.enableTouchpad = this.enableTouchpad.bind(this);
  }

  componentDidMount() {
    window.addEventListener('fullscreenchange', this.handleResizeEvent);
    this.touchManager = new Hammer.Manager(document.getElementById('touchpad'));
  }

  componentWillUnmount() {
    window.removeEventListener('fullscreenchange', this.handleResizeEvent);
  }

  handleClick() {
    // connect to
    const element = document.body;
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullScreen) {
      element.webkitRequestFullScreen();
    }
    this.enableTouchpad();
  }

  enableTouchpad() {
    this.socket = initConnection(`${window.location.hostname}:5000`, 'touchpad');
    const customizedPan = new Hammer.Pan({
      direction: Hammer.DIRECTION_ALL,
      threshold: 10,
      pointers: 0,
      event: 'pan'
    });
    if (this.touchManager) {
      this.touchManager.add(customizedPan);
      this.touchManager.on('panend', (e) => {
        if (this.isEmitting) return;
        this.isEmitting = true;
        const dir = touchGestureDetector(e);
        // emit direction through socket
        this.socket.emit('gesture', dir, () => {
          this.isEmitting = false;
        });
      });
      this.touchManager.on('hammer.input', (e) => {
        // console.log(e.pointers,join('-'));
        const { x, y } = e.center;
        this.setState({ x, y });
      });
    }
  }

  handleResizeEvent() {
    if (document.webkitIsFullScreen || document.fullscreen) {
      this.setState({ fullscreen: true });
    }
  }

  render () {
    const { fullscreen, x, y, gesture } = this.state;
    return (
      <div id="touchpad">
        <div style={{ color: 'white' }}>{gesture}</div>
        {fullscreen ? <GTTouchPoint x={x} y={y} /> : <Button type="primary" onClick={this.handleClick}>Connect</Button>}
      </div>
    );
  }
};
