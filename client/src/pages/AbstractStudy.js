import React from 'react';
import { Modal } from 'antd';
import { generateButtons } from '../utils/buttonGeneration';
import GTButton from '../components/GTButton';


export default class AbstractStudy extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      buttons: [],
    };
    this.startTrial = this.startTrial.bind(this);
    this.cancelTrial = this.cancelTrial.bind(this);
  }

  componentDidMount() {
    const { redirectInfo } = this.props.location.state;
    const { targetNums, targetSize, targetSpacing } = redirectInfo;
    // console.log(`${targetSize}, ${targetSpacing}`);
    const buttons = generateButtons(targetNums, targetSize, targetSpacing * targetSize);
    this.setState({ buttons });
  }

  startTrial(e) {
    this.setState({ visible: false });
  }

  cancelTrial(e) {
    this.setState({ visible: false });
  }

  render() {
    const { visible, buttons } = this.state;
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
              <GTButton key={i} top={top} left={left} width={width} height={height} name={i}/>
            )
          }) : <p>Something went wrong...</p>)}
        </div>
        <Modal
          title="Trial Start"
          visible={visible}
          onOk={this.startTrial}
          onCancel={this.cancelTrial}
        >
          <p>Please press 'OK' to start the trial.</p>
        </Modal>
      </div>
    );
  }
}
