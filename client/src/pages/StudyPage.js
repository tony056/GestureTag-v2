import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import { Redirect } from 'react-router-dom';
import { Animate } from 'react-move';
import GTButton from '../components/GTButton';
import GTTrialModal from '../components/GTTrialModal';
import GTTrialPrepModalContent from '../components/GTTrialPrepModalContent';
import { initConnection, subscribeEyetrackerConnection, subscribeTouchpadConnection, subscribeTouchGestureEvent } from '../api/socket-client';
import { InputTypes } from '../api/inputType';
import GTCursor from '../components/GTCursor';

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
    this.cursor = React.createRef();
    this.startTrial = this.startTrial.bind(this);
    this.cancelTrial = this.cancelTrial.bind(this);
    this.setFullscreenStatus = this.setFullscreenStatus.bind(this);
    this.checkInputConnection = this.checkInputConnection.bind(this);
    this.displayModal = this.displayModal.bind(this);
    this.inputMounted = this.inputMounted.bind(this);
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
      subscribeEyetrackerConnection(this.socket, this.inputMounted);
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
    this.cursor.current.click(index);
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
      eyetrackerConnected: newEyetracker,
      touchpadConnected: newTouchpad,
      inputConnected: newEyetracker && newTouchpad
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

  getDisplayButtons() {
    const { buttons } = this.props;
    let displayButtons = [];
    for (let i = 0; i < buttons.length; i++) {
      displayButtons = displayButtons.concat(buttons[i]);
    }
    return buttons;
    // return displayButtons;
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
    return (redirect ? <Redirect push to="/" /> : (
      <div id="bg" style={bgStyle}>
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
            />);
        }) : <p>Waiting...</p>)}
        {this.displayModal()}
        {inputType === InputTypes.GESTURETAG ? <GTCursor ref={this.cursor} socket={this.socket} buttons={buttons} targetButton={targetButton} isFetching={this.props.isFetching} /> : null}
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
