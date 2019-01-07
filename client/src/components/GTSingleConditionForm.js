import React from 'react';
import { Form, Input, Radio, InputNumber, Button } from 'antd';

export default class GTSingleConditionForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      targetSize: 16,
      targetSpacing: 0,
      targetNums: 5,
      trialNums: 10,
      inputType: 'pointing',
      userId: 'testing',
    };
    this.handleNumberChange = this.handleNumberChange.bind(this);
    this.handleTrialNumberChange = this.handleTrialNumberChange.bind(this);
    this.handleIdChange = this.handleIdChange.bind(this);
    this.handleRadioValueChange = this.handleRadioValueChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
    if (name === 'targetSpacing')
      this.setState({ targetSpacing: value });
    else if (name === 'targetSize')
      this.setState({ targetSize: value });
    else if (name === 'inputType')
      this.setState({ inputType: value });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.handleSubmit(this.state, '/api/study/single');
  }

  render() {
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const { userId, targetNums, targetSize, targetSpacing, inputType, trialNums } = this.state;
    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Item {...formItemLayout} label="User Id">
          <Input value={userId} onChange={this.handleIdChange} placeholder="Please enter the id." />
        </Form.Item>
        <Form.Item {...formItemLayout} label="Input Type">
          <Radio.Group name="inputType" value={inputType} onChange={this.handleRadioValueChange}>
            <Radio value="pointing">Cursor</Radio>
            <Radio value="gesturetag">GestureTag</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item {...formItemLayout} label="Target Size">
          <Radio.Group value={targetSize} name="targetSize" onChange={this.handleRadioValueChange}>
            <Radio value={16}>16 px</Radio>
            <Radio value={32}>32 px</Radio>
            <Radio value={48}>48 px</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item {...formItemLayout} label="Target Spacing">
          <Radio.Group name="targetSpacing" value={targetSpacing} onChange={this.handleRadioValueChange}>
            <Radio value={0}>0</Radio>
            <Radio value={0.5}>0.5</Radio>
            <Radio value={1}>1</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item {...formItemLayout} label="Number of Targets">
          <InputNumber min={5} max={300} step={10} value={targetNums} onChange={this.handleNumberChange} />
        </Form.Item>
        <Form.Item {...formItemLayout} label="Number of Trials">
          <InputNumber min={1} max={20} step={1} value={trialNums} onChange={this.handleTrialNumberChange} />
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
