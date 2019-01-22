import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import { Redirect } from 'react-router-dom';
import { Animate } from 'react-move';
import GTButton from '../components/GTButton';
import GTTrialModal from '../components/GTTrialModal';
import GTTrialPrepModalContent from '../components/GTTrialPrepModalContent';
import { initConnection, subscribeEyetrackerConnection, subsribeEyemovedEvent, subscribeTouchpadConnection, subscribeTouchGestureEvent } from '../api/socket-client';
import { InputTypes } from '../api/inputType';
import GTCursor from '../components/GTCursor';
import { arrowByOrder } from '../api/arrowDirection';
import { enableGestureListener, disableGestureListener, gestureDetector } from '../api/gesture';

const separateBtnsNTarget = btns => {
  const t = btns.shift();
  const target = {...t};
  target.key = 'target';
  return {
    target,
    buttons: btns
  };
};

export default class StudyPage extends React.Component {
  constructor(props) {
    super(props);
    const fw = window.innerWidth === window.screen.width;
    const fh = window.innerHeight === window.screen.height;
    this.state = {
      fullscreen: fw && fh,
      inputConnected: false,
      eyetrackerConnected: false,
      touchpadConnected: false,
      overlaps: []
    };
    this.startTime = null;
    this.socket = null;
    this.testSocket = React.createRef();
    this.startTrial = this.startTrial.bind(this);
    this.cancelTrial = this.cancelTrial.bind(this);
    this.setFullscreenStatus = this.setFullscreenStatus.bind(this);
    this.checkInputConnection = this.checkInputConnection.bind(this);
    this.displayModal = this.displayModal.bind(this);
    this.inputMounted = this.inputMounted.bind(this);
    this.checkOverlapping = this.checkOverlapping.bind(this);
    this.gestureClick = this.gestureClick.bind(this);
    this.getDisplayButtons = this.getDisplayButtons.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.setFullscreenStatus);
    // enableGestureListener(this.gestureClick);
    // this.testSocket = document.getElementById('bg');
  }

  componentDidUpdate(prevProps) {
    if (this.props.inputType !== prevProps.inputType && this.props.inputType === InputTypes.GESTURETAG) {
      this.socket = initConnection('http://localhost:5000', 'browser');
      // subscribeEyetrackerConnection(this.socket, this.inputMounted);
      subscribeTouchpadConnection(this.socket, this.inputMounted);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setFullscreenStatus);
    // disableGestureListener(this.gestureClick);
    if (this.socket) {
      this.socket.close();
    }
  }

  gestureClick(index) {
    // const index = gestureDetector(e);
    console.log(`gesture clicked: ${index}`);
    if (index < 0) return;
    const { overlaps } = this.state;
    if (!overlaps || overlaps.length <= index) {
      return;
    }
    const id = overlaps[index];
    console.log(`click id: ${id}`);
    document.getElementById(id).click();
  }

  startTrial(e) {
    const { fullscreen, inputConnected } = this.state;
    const { conditionDone } = this.props;
    const prepCompleted = fullscreen && inputConnected;
    if (prepCompleted || conditionDone) {
      this.props.startTrial();
    }
  }

  cancelTrial(e) {
    // this.setState({ visible: false });
  }

  inputMounted(data) {
    const { eyetrackerConnected, touchpadConnected } = this.state;
    let newEyetracker = eyetrackerConnected;
    let newTouchpad = touchpadConnected;
    if (data === 'eyetracker') {
      newEyetracker = true;
    } else if (data === 'touchpad') {
      newTouchpad = true;
      subscribeTouchGestureEvent(this.socket, dir => {
        this.gestureClick(dir);
      });
    }
    this.setState({
      eyetrackerConnected: true,
      touchpadConnected: newTouchpad,
      inputConnected: true && newTouchpad
    });
  }

  checkInputConnection() {
    const { inputType } = this.props;
    if (inputType === InputTypes.POINTING) {
      return true;
    } else if (inputType === InputTypes.GESTURETAG) {
      return this.state.inputConnected;
    }
    return false;
  }

  setFullscreenStatus() {
    const fullscreen = (window.innerWidth === window.screen.width) && (window.innerHeight === window.screen.height);
    const isConnected = this.checkInputConnection();
    this.setState({ fullscreen, inputConnected: isConnected });
  }

  displayModal() {
    const { fullscreen, inputConnected } = this.state;
    const { completedNum, totalTrialNum, visible, conditionDone } = this.props;
    const prepCompleted = fullscreen && inputConnected;
    //const visible = prepCompleted || conditionDone;
    let title = '';
    let onOk = null;
    let onCancel = null;
    let okButtonProps = null;
    let okText = 'OK';
    let cancelButtonProps = null;
    if (conditionDone) {
      title = 'Done!';
      onOk = this.startTrial;
      okText = completedNum === totalTrialNum ? 'Done' : 'Next';
      cancelButtonProps = { disabled: true };
      // display modal with condtion done info
      //return <GTTrialModal visible={trialVisble} title="Done" completedNum={0} totalTrialNum={0} handleOk={this.startTrial} />
    } else {
      // display prep modal
      title = 'Trial Preparation';
      onOk = this.startTrial;
      onCancel = this.cancelTrial;
      okButtonProps = { disabled: !prepCompleted };
    }
    return (
      <Modal
        visible={visible}
        title={title}
        onOk={onOk}
        onCancel={onCancel}
        okButtonProps={okButtonProps}
        cancelButtonProps={cancelButtonProps}
        okText={okText}
      >
        {!conditionDone ?
          <GTTrialPrepModalContent fullscreen={fullscreen} inputConnected={inputConnected} />
          : <GTTrialModal completedNum={completedNum} totalTrialNum={totalTrialNum} />}
      </Modal>
    );
  }

  checkOverlapping({ x, y, minR, maxR, minC, maxC }) {

    const { buttons, targetButton } = this.props;
    const intersections = [];
    if (buttons.length !== 0) {
      for (let r = minR; r < maxR + 1; r++) {
        for (let c = minC; c < maxC + 1; c++) {
          if (r >= 15 || r < 0 || c < 0 || c >= 24) {
            continue;
          }
          const grid = buttons[r][c];
          if (grid.w > 0 && grid.h > 0) {
            intersections.push(grid);
          }
        }
      }
    }
    if ((targetButton.row >= minR && targetButton.row <= maxR) && (targetButton.col >= minC && targetButton.col <= maxC)) {
      intersections.push(targetButton);
    }
    // const intersections = all.filter((btn, i) => {
    //   const l2 = { x: btn.x, y: btn.y };
    //   const r2 = { x: btn.x + btn.w, y: btn.y + btn.h };
    //   if (l1.x > r2.x || l2.x > r1.x) {
    //     return false;
    //   }
    //   if (l1.y > r2.y || l2.y > r1.y) {
    //     return false;
    //   }
    //   if (btn.w === btn.h) {
    //     // circle
    //     const d = Math.hypot(x - (btn.x + btn.w / 2), y - (btn.y + btn.h / 2));
    //     const touchD = (width + btn.w) / 2;
    //     return d < touchD;
    //   }
    //   return true;
    // });
    console.log(`intersections: ${intersections.length}`);
    if (!intersections || intersections.length === 0) {
      this.setState({ overlaps: [] });
      return;
    }
    intersections.sort((a, b) => {
      const da = Math.hypot(x - (a.x + a.w / 2), y - (a.y + a.h / 2));
      const db = Math.hypot(x - (b.x + b.w / 2), y - (b.y + b.h / 2));
      return da - db;
    });
    const final = intersections.length > 4 ? intersections.slice(0, 4) : intersections;
    this.setState({ overlaps: final.map(btn => btn.id) });
  }

  getDisplayButtons() {
    const { buttons } = this.props;
    let displayButtons = [];
    for (let i = 0; i < buttons.length; i++) {
      displayButtons = displayButtons.concat(buttons[i]);
    }
    return displayButtons;
  }

  render() {
    const { bgStyle,
            targetStyleId,
            buttonStyleId,
            targetButton,
            buttons,
            targetSelected,
            redirect,
            updateStartTime,
            inputType
    } = this.props;
    const displayButtons = this.getDisplayButtons();
    const { overlaps } = this.state;
    return (redirect ? <Redirect push to="/" /> : (
      <div ref={this.testSocket} id="bg" style={bgStyle}>
        <Animate
          key={'target'}
          start={{ x: targetButton.x, y: targetButton.y, width: targetButton.w, height: targetButton.h }}
          update={{
            x: [targetButton.x],
            y: [targetButton.y],
            width: [targetButton.w],
            height: [targetButton.h],
            timing: {
              duration: 500
            },
            events: { end: () => { updateStartTime(); }}
          }}
        >
        {({ x, y, width, height }) => {
          return (
              <GTButton
                key={targetButton.id}
                styleId={targetStyleId}
                value={targetButton.id}
                top={`${y}px`}
                left={`${x}px`}
                width={`${width}px`}
                height={`${height}px`}
                name={targetButton.id}
                click={targetSelected}
                arrowChild={''}
              />
          );
        }}
      </Animate>
      {(displayButtons && displayButtons.length > 0 ?
        displayButtons.map((btn, i) => {
          const { x, y, w, h, id } = btn;
          if (w < 0 || h < 0) return null;
          return (
            <GTButton
              key={id}
              styleId={buttonStyleId}
              value={id}
              top={`${y}px`}
              left={`${x}px`}
              width={`${w}px`}
              height={`${h}px`}
              name={id}
              click={targetSelected}
              arrowChild={''}
            />);
        }) : <p>Waiting...</p>)}
        {this.displayModal()}
        {inputType === InputTypes.GESTURETAG ? <GTCursor socket={this.testSocket} buttons={buttons} targetButton={targetButton} /> : null}
      </div>)
    );
  }
}

StudyPage.propTypes = {
  bgStyle: PropTypes.object,
  targetStyleId: PropTypes.number,
  buttonStyleId: PropTypes.number,
  targetButton: PropTypes.object,
  buttons: PropTypes.array,
  redirect: PropTypes.bool,
  visible: PropTypes.bool,
  conditionDone: PropTypes.bool,
  completedNum: PropTypes.number,
  totalTrialNum: PropTypes.number,
  startTrial: PropTypes.func,
  targetSelected: PropTypes.func,
  inputType: PropTypes.string,
  updateStartTime: PropTypes.func,
};
