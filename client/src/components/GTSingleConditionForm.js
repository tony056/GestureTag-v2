import React from 'react';
import { Form, Input, Radio, InputNumber, Button } from 'antd';
import { Redirect } from 'react-router-dom';

export default class GTSingleConditionForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      targetSize: 16,
      targetSpacing: 0,
      targetNums: 5,
      inputType: 'pointing',
      userId: 'testing',
      redirect: false
    };
    this.handleNumberChange = this.handleNumberChange.bind(this);
    this.handleIdChange = this.handleIdChange.bind(this);
    this.handleRadioValueChange = this.handleRadioValueChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleNumberChange(value) {
    this.setState({ targetNums: value });
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

  handleSubmit() {
    fetch('/api/study/single', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state)
    })
    .then(res => res.json())
    .then(jsonObj => this.setState({ redirect: true }))
    .catch(err => console.error(err));
  }

  render() {
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const { userId, targetNums, targetSize, targetSpacing, inputType, redirect } = this.state;
    if (redirect) {
      return <Redirect to='/study/single' />;
    }
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
        <Form.Item
          wrapperCol={{ span: 12, offset: 6 }}
        >
          <Button type="primary" htmlType="submit">Submit</Button>
        </Form.Item>
      </Form>
    );
  }
}
