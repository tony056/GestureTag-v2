import React from 'react';
import { Form, Input, Radio, InputNumber, Button } from 'antd';
import GTNumberSelect from './GTNumberSelect';

export default class GTSingleConditionForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      targetSize: [16, 16],
      targetSpacing: 0,
      targetNums: [5, 5],
      trialNums: 10,
      inputType: 'pointing',
      userId: 'testing',
      abilityType: '',
    };
    this.handleNumberChange = this.handleNumberChange.bind(this);
    this.handleTrialNumberChange = this.handleTrialNumberChange.bind(this);
    this.handleIdChange = this.handleIdChange.bind(this);
    this.handleRadioValueChange = this.handleRadioValueChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleMinChange = this.handleMinChange.bind(this);
    this.handleMaxChange = this.handleMaxChange.bind(this);
  }

  handleNumberChange(value) {
    this.setState({ targetNums: value });
  }

  handleTrialNumberChange(value) {
    this.setState({ trialNums: value });
  }

  handleIdChange(e) {
    this.setState({ userId: e.target.value });
  }

  handleRadioValueChange(e) {
    const { name, value } = e.target;
    if (name === 'inputType')
      this.setState({ inputType: value });
    else if (name === 'abilityType')
      this.setState({ abilityType: value });
    else if (name === 'device')
      this.setState({ device: value });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.handleSubmit(this.state, '/api/study/single');
  }

  handleMinChange(name, value) {
    if (name === 'targetSize') {
      const { targetSize } = this.state;
      this.setState({ targetSize: [value, targetSize[1]] });
    } else if (name === 'targetNums') {
      const { targetNums } = this.state;
      this.setState({ targetNums: [value, targetNums[1]] });
    }
  }

  handleMaxChange(name, value) {
    console.log(`max: ${name}`);
    if (name === 'targetSize') {
      const { targetSize } = this.state;
      this.setState({ targetSize: [targetSize[0], value] });
    } else if (name === 'targetNums') {
      const { targetNums } = this.state;
      this.setState({ targetNums: [targetNums[0], value] });
    }
  }

  render() {
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const { userId, targetNums, targetSize, targetSpacing, inputType, trialNums, abilityType, device } = this.state;
    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Item {...formItemLayout} label="User Id">
          <Input value={userId} onChange={this.handleIdChange} placeholder="Please enter the id." />
        </Form.Item>
        <Form.Item {...formItemLayout} label="Ability Type">
          <Radio.Group name="abilityType" value={abilityType} onChange={this.handleRadioValueChange}>
            <Radio value="nmi">Non-motor impairment</Radio>
            <Radio value="mi">Motor impairment</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item {...formItemLayout} label="Device">
          <Radio.Group name="device" value={device} onChange={this.handleRadioValueChange}>
            <Radio value="mouse">Mouse</Radio>
            <Radio value="touchpad">Touchpad</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item {...formItemLayout} label="Input Type">
          <Radio.Group name="inputType" value={inputType} onChange={this.handleRadioValueChange}>
            <Radio value="pointing">Cursor</Radio>
            <Radio value="gesturetag">GestureTag</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item {...formItemLayout} label="Target Size">
          <GTNumberSelect
            min={8}
            max={32}
            values={targetSize}
            name="targetSize"
            minChange={this.handleMinChange}
            maxChange={this.handleMaxChange}
          />
        </Form.Item>
        <Form.Item {...formItemLayout} label="Number of Targets">
          <GTNumberSelect
            min={1}
            max={300}
            values={targetNums}
            name="targetNums"
            minChange={this.handleMinChange}
            maxChange={this.handleMaxChange}
          />
        </Form.Item>
        <Form.Item {...formItemLayout} label="Number of Trials">
          <InputNumber min={1} max={100} step={1} value={trialNums} onChange={this.handleTrialNumberChange} />
        </Form.Item>
        <Form.Item
          wrapperCol={{ span: 12, offset: 6 }}
        >
          <Button type="primary" htmlType="submit">Submit</Button>
        </Form.Item>
      </Form>
    );
  }
}
