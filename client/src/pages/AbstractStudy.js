import React from 'react';
import { Modal, Steps, Icon } from 'antd';
import GTButton from '../components/GTButton';
const Step = Steps.Step;

export default class AbstractStudy extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      buttons: [],
      prepCompleted: false,
      fullscreen: (window.innerWidth === window.screen.width) && (window.innerHeight === window.screen.height),
      inputConnected: false,
      inputType: '',
      targetSize: 0,
      targetNums: 0,
      targetSpacing: 0,
      userId: ''
    };
    this.startTrial = this.startTrial.bind(this);
    this.cancelTrial = this.cancelTrial.bind(this);
    this.setFullscreenStatus = this.setFullscreenStatus.bind(this);
    this.renderModalContent = this.renderModalContent.bind(this);
    this.checkInputConnection = this.checkInputConnection.bind(this);
    this.updateTargets = this.updateTargets.bind(this);
    this.targetSelected = this.targetSelected.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.setFullscreenStatus);
    const { redirectInfo } = this.props.location.state;
    const { inputType, targetSize, userId, targetNums, targetSpacing } = redirectInfo;
    this.setState({ inputType, targetSize, userId, targetNums, targetSpacing });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setFullscreenStatus);
  }

  startTrial(e) {
    this.updateTargets();
    this.setState({ visible: false });
  }

  cancelTrial(e) {
    this.setState({ visible: false });
  }

  targetSelected(e) {
    // post request to http server with data
    this.updateTargets();
  }

  setFullscreenStatus() {
    const fullscreen = (window.innerWidth === window.screen.width) && (window.innerHeight === window.screen.height);
    // const { inputConnected } = this.state;
    const isConnected = this.checkInputConnection();
    this.setState({ fullscreen, inputConnected: isConnected, prepCompleted: fullscreen && isConnected});
  }

  renderModalContent() {
    const { fullscreen, inputConnected } = this.state;
    const fullscreenStatus = fullscreen ? 'finish' : 'process';
    let inputConnectionStatus = 'wait';
    if (fullscreen) {
      inputConnectionStatus = inputConnected ? 'finish' : 'process';
    } else {
      inputConnectionStatus = 'wait';
    }

    let inputConnectionIcon = null;
    let inputConnectionDescription = '';
    switch (inputConnectionStatus) {
      case 'finish':
        inputConnectionIcon = <Icon type='api' />;
        inputConnectionDescription = 'Connected';
        break;
      case 'process':
        inputConnectionIcon = <Icon type='loading' />;
        inputConnectionDescription = 'Please open ...';
        break;
      default:
        break;
    }

    return (
      <Steps direction="vertical">
        <Step status={fullscreenStatus} icon={<Icon type={fullscreen? "desktop" : "loading"} />} title="Full Screen Mode" description={`please enable fullscreen mode.`} />
        <Step status={inputConnectionStatus} icon={inputConnectionIcon} title="Input Connection" description={inputConnectionDescription} />
      </Steps>
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

  updateTargets() {
    const { targetNums, targetSize, targetSpacing, userId } = this.state;
    fetch('/api/generateButtons', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId,
        targetNums,
        targetSize,
        targetSpacing
      })
    })
    .then(res => res.json())
    .then(jsonObj => this.setState({ buttons: jsonObj }))
    .catch(err => console.error(err));
  }

  render() {
    const { visible, buttons, prepCompleted } = this.state;

    return (
      <div>
        <div>
          {(buttons && buttons.length > 0 ? buttons.map((btn, i) => {
            const { x, y, targetSize } = btn;
            const top = `${y}px`;
            const left = `${x}px`;
            const width = `${targetSize}px`;
            const height = `${targetSize}px`;
            return (
              <GTButton key={i} top={top} left={left} width={width} height={height} name={i} click={this.targetSelected}/>
            )
          }) : <p>Something went wrong...</p>)}
        </div>
        <Modal
          title="Trial Preparation"
          visible={visible}
          onOk={this.startTrial}
          onCancel={this.cancelTrial}
          okButtonProps={{ disabled: !prepCompleted }}
        >
          {this.renderModalContent()}
        </Modal>
      </div>
    );
  }
}
