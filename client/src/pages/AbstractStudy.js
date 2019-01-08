import React from 'react';
import { Modal } from 'antd';
import GTButton from '../components/GTButton';
import GTTrialModal from '../components/GTTrialModal';
import GTTrialPrepModalContent from '../components/GTTrialPrepModalContent';
import { Redirect } from 'react-router-dom';

export default class AbstractStudy extends React.Component {
  constructor(props) {
    super(props);
    const fw = window.innerWidth === window.screen.width;
    const fh = window.innerHeight === window.screen.height;
    this.state = {
      buttons: [],
      fullscreen: fw && fh,
      inputConnected: false,
      conditionDone: false,
      visible: !(fw && fh),
      completedNum: 0,
      trialNums: 0,
      totalTrialNum: 10,
      inputType: '',
      redirect: false
    };
    this.startTime = null;
    this.startTrial = this.startTrial.bind(this);
    this.cancelTrial = this.cancelTrial.bind(this);
    this.setFullscreenStatus = this.setFullscreenStatus.bind(this);
    this.checkInputConnection = this.checkInputConnection.bind(this);
    this.updateTargets = this.updateTargets.bind(this);
    this.targetSelected = this.targetSelected.bind(this);
    this.displayModal = this.displayModal.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.setFullscreenStatus);
    const { redirectInfo } = this.props.location.state;
    const { inputType } = redirectInfo;
    this.setState({ inputType });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setFullscreenStatus);
  }

  componentDidUpdate(props) {
    this.startTime = Date.now();
  }

  startTrial(e) {
    // this.updateTargets();
    const { fullscreen, inputConnected, conditionDone, completedNum, totalTrialNum } = this.state;
    const prepCompleted = fullscreen && inputConnected;
    if (prepCompleted || conditionDone) {
      this.updateTargets((btns) => {
        if (completedNum === totalTrialNum)
          this.setState({ visible: false, buttons: [], conditionDone: false, redirect: true });
        else
          this.setState({ visible: false, buttons: btns, conditionDone: false });
      });
    }
  }

  cancelTrial(e) {
    this.setState({ visible: false });
  }

  targetSelected(selectId) {
    // post request to http server with data
    const timeStamp = Date.now();
    const targetId = this.state.buttons[0].id;
    const { startTime } = this;
    fetch('/api/log', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        timeStamp,
        startTime,
        targetId,
        selectId
      }),
    })
    .then(res => res.json())
    .then(jsonRes => {
      const { completedNum, totalTrialNum } = jsonRes;
      if (jsonRes.change) {
        this.setState({ visible: true, conditionDone: true, completedNum, totalTrialNum });
      } else {
        this.updateTargets(btns => {
          this.setState({ buttons: btns, completedNum, totalTrialNum });
        });
      }
    })
    .catch(err => console.error(err));
  }

  setFullscreenStatus() {
    const fullscreen = (window.innerWidth === window.screen.width) && (window.innerHeight === window.screen.height);
    // const { inputConnected } = this.state;
    const isConnected = this.checkInputConnection();
    this.setState({ fullscreen, inputConnected: isConnected });
  }

  displayModal() {
    const { fullscreen, inputConnected, conditionDone, visible, completedNum, totalTrialNum } = this.state;
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

  checkInputConnection() {
    const { inputType } = this.state;
    if (inputType === 'pointing') {
      return true;
    } else {
      // TODO: figure out how to check
    }
    return false;
  }

  updateTargets(cb) {
    // const { targetNums, targetSize, targetSpacing, userId } = this.state;
    fetch('/api/generateButtons', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: ''
    })
    .then(res => res.json())
    .then(jsonObj => cb(jsonObj))
    .catch(err => console.error(err));
  }

  render() {
    const { buttons, redirect } = this.state;

    return (redirect ? <Redirect push to="/" /> : (
      <div>
        <div>
          {(buttons && buttons.length > 0 ? buttons.map((btn, i) => {
            const { x, y, targetSize, id } = btn;
            const top = `${y}px`;
            const left = `${x}px`;
            const width = `${targetSize}px`;
            const height = `${targetSize}px`;
            return (
              <GTButton key={id} styleId={i === 0 ? i : 1} value={id} top={top} left={left} width={width} height={height} name={id} click={this.targetSelected}/>
            )
          }) : <p>Nothing to show...</p>)}
        </div>
        {this.displayModal()}
      </div>
    ));
  }
}
