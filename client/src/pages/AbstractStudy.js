import React from 'react';
import StudyPage from './StudyPage';
import { logClickData } from '../api/log';

export default class AbstractStudy extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      buttons: [],
      targetButton: {
        key: 'target',
        x: 0,
        y: 0,
        w: 0,
        h: 0,
      },
      conditionDone: false,
      completedNum: 0,
      totalTrialNum: 10,
      inputType: '',
      redirect: false,
      visible: true,
      isFetching: false,
    };
    this.startTime = null;
    this.startTrial = this.startTrial.bind(this);
    this.cancelTrial = this.cancelTrial.bind(this);
    this.updateTargets = this.updateTargets.bind(this);
    this.targetSelected = this.targetSelected.bind(this);
    this.updateStartTime = this.updateStartTime.bind(this);
  }

  componentDidMount() {
    const { redirectInfo } = this.props.location.state;
    const { inputType } = redirectInfo;
    this.setState({ inputType });
  }

  updateStartTime() {
    this.startTime = Date.now();
  }

  startTrial(e) {
    const { completedNum, totalTrialNum } = this.state;
    this.updateTargets((btnObj) => {
      const { target, buttons } = btnObj;
      if (completedNum === totalTrialNum)
        this.setState({ visible: false, buttons, targetButton: target, conditionDone: false, redirect: true, completedNum: 0, isFetching: false });
      else
        this.setState({ visible: false, buttons, targetButton: target, conditionDone: false, isFetching: false });
    });
  }

  cancelTrial(e) {
    this.setState({ visible: false });
  }

  targetSelected(selectId) {
    // post request to http server with data
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
    logClickData(data, true, jsonRes => {
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

  updateTargets(cb) {
    // const { targetNums, targetSize, targetSpacing, userId } = this.state;
    this.setState({ isFetching: true });
    fetch('/api/generateButtons')
    .then(res => res.json())
    .then(jsonObj => cb(jsonObj))
    .catch(err => console.error(err));
  }

  render() {
    const { buttons, targetButton, visible, conditionDone, redirect, completedNum, totalTrialNum, inputType, isFetching } = this.state;
    return (
      <StudyPage
        bgStyle={{}}
        targetStyleId={0}
        buttonStyleId={1}
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
        isFetching={isFetching}
      />
    );
  }
}
