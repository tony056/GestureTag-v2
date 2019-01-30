import React, { Component } from 'react';
import StudyPage from './StudyPage';
import { logClickData } from '../api/log';

export default class RealApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      targetButton: {
        x: 0,
        y: 0,
        w: 0,
        h: 0,
        id: '0'
      },
      buttons: [],
      conditionDone: false,
      completedNum: 0,
      totalTrialNum: 10,
      inputType: '',
      redirect: false,
      visible: true
    };
    this.startTime = null;
    this.getButtonsFromServer = this.getButtonsFromServer.bind(this);
    this.updateTargets = this.updateTargets.bind(this);
    this.targetSelected = this.targetSelected.bind(this);
    this.updateStartTime = this.updateStartTime.bind(this);
    this.startTrial = this.startTrial.bind(this);
  }

  getButtonsFromServer(filename) {
    const { isLoading } = this.state;
    if (isLoading) return;
    this.setState({ isLoading: true });
    fetch(`/api/getButtons/${filename}`)
    .then(res => res.json())
    .then(jsonObj => {
      console.log('init buttons done');
      // this.updateButtons(JSON.parse(jsonObj));
    })
    .catch(err => console.error(err));
  }

  startTrial() {
    const { completedNum, totalTrialNum } = this.state;
    this.updateTargets(btns => {
      const { target, buttons } = btns;
      if (completedNum === totalTrialNum)
        this.setState({ visible: false, buttons, targetButton: target, conditionDone: false, redirect: true, completedNum: 0 });
      else
        this.setState({ visible: false, buttons, targetButton: target, conditionDone: false });
    });
  }

  updateButtons(fileObj) {
    const { isLoading } = this.state;
    const { Targets } = fileObj;
    if (isLoading) {
      this.setState({ isLoading: false, buttons: Targets.Target });
    } else {
      this.setState({ buttons: Targets.Target });
    }
  }

  componentDidMount() {
    const { item, inputType, trialNums, userId, device, abilityType } = this.props.location.state;
    this.getButtonsFromServer(item.xml_source);
    fetch('/api/study/realistic', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId,
        trialNums,
        inputType,
        device,
        abilityType,
        app: item.name
      })
    }).then(res => res.json())
    .then(jsonObj => console.log(JSON.stringify(jsonObj)))
    .catch(err => console.error(err));
    this.setState({ inputType });
    // post to init user info
  }

  componentWillMount() {
    document.body.style.height = "100%";
    document.getElementById('root').style.height = "100%";
  }

  updateTargets(cb) {
    fetch('/api/getTarget')
    .then(res => res.json())
    .then(jsonObj => cb(jsonObj))
    .catch(err => console.error(err));
  }

  updateStartTime() {
    this.startTime = Date.now();
  }

  targetSelected(selectId) {
    const timeStamp = Date.now();
    const targetId = this.state.targetButton.id;
    const { startTime } = this;
    const { targetButton, buttons } = this.state;
    const data = {
      timeStamp,
      startTime,
      targetId,
      selectId,
      targetButton,
      buttons,
      areaOfWindow: window.innerWidth * window.innerHeight, 
    };
    logClickData(data, false, jsonRes => {
      const { completedNum, totalTrialNum } = jsonRes;
      if (jsonRes.change) {
        this.setState({ visible: true, conditionDone: true, completedNum, totalTrialNum });
      } else {
        this.updateTargets(btns => {
          const { target, buttons } = btns;
          this.setState({ buttons, targetButton: target, completedNum, totalTrialNum, isFetching: false });
        });
      }
    });
  }

  render() {
    const { item } = this.props.location.state;
    const { img_source } = item;
    const bgStyle = {
      backgroundImage: `url(${img_source})`,
      height: "100%",
    };
    const { buttons, targetButton, visible, conditionDone, redirect, completedNum, totalTrialNum, inputType } = this.state;
    return (
      <StudyPage
        bgStyle={bgStyle}
        updateTargets={this.updateTargets}
        targetStyleId={3}
        buttonStyleId={2}
        targetButton={targetButton}
        buttons={buttons}
        targetSelected={this.targetSelected}
        visible={visible}
        redirect={redirect}
        completedNum={completedNum}
        totalTrialNum={totalTrialNum}
        conditionDone={conditionDone}
        inputType={inputType}
        startTrial={this.startTrial}
        updateStartTime={this.updateStartTime}
      />
    );
  }
};
