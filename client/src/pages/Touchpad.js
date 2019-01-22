import React from 'react';
import Hammer from 'hammerjs';
import { Button } from 'antd';
import { touchGestureDetector } from '../api/gesture';
import '../Touchpad.css';
import { initConnection } from '../api/socket-client';

export default class Touchpad extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fullscreen: false,
      gesture: ''
    };
    this.touchManager = null;
    this.socket = null;
    this.handleClick = this.handleClick.bind(this);
    this.handleResizeEvent = this.handleResizeEvent.bind(this);
    this.enableTouchpad = this.enableTouchpad.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResizeEvent);
    this.touchManager = new Hammer.Manager(document.getElementById('touchpad'));
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResizeEvent);
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
        const dir = touchGestureDetector(e);
        // emit direction through socket
        this.socket.emit('gesture', dir);
        this.setState({ gesture: dir });
      });
    }
  }

  handleResizeEvent() {
    const { fullscreen } = this.state;
    const next = (window.innerWidth === window.screen.width) && (window.innerHeight === window.screen.height);
    if (next !== fullscreen) {
      this.setState({ fullscreen: next });
    }
  }

  render () {
    const { fullscreen, gesture } = this.state;
    return (
      <div id="touchpad">
        {fullscreen ? <p>{gesture}</p> : <Button type="primary" onClick={this.handleClick}>Connect</Button>}
      </div>
    );
  }
};
