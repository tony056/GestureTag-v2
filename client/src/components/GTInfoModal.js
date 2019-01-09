import React from 'react';
import { Modal, Form, Button, Input, InputNumber, Radio } from 'antd';
import { Link } from 'react-router-dom';

export default class GTInfoModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: '',
      inputType: '',
      trialNums: 0
    };
    this.handleCancel = this.handleCancel.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.handleIdChange = this.handleIdChange.bind(this);
    this.handleRadioValueChange = this.handleRadioValueChange.bind(this);
    this.handleTrialNumberChange = this.handleTrialNumberChange.bind(this);
    this.getUserInfo = this.getUserInfo.bind(this);
  }

  handleCancel() {
    this.props.closeInfoModal();
  }

  handleOk(e) {
  }

  handleIdChange(e) {
    this.setState({ userId: e.target.value });
  }

  handleRadioValueChange(e) {
    this.setState({ inputType: e.target.value });
  }

  handleTrialNumberChange(value) {
    this.setState({ trialNums: value });
  }

  getUserInfo() {
    const userInfo = { ...this.state };
    userInfo.item = this.props.item;
    return userInfo;
  }

  render() {
    const { userId, trialNums, inputType } = this.state;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    return (
      <Modal
        title="User Info"
        visible={this.props.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        footer={[
          <Button key="back" onClick={this.handleCancel}>Back</Button>,
          <Button key="submit" type="primary" onClick={this.handleOk}>
            <Link key="submit" to={{ pathname: '/realistic', state: this.getUserInfo() }}>
              Submit
            </Link>
          </Button>
        ]}
      >
        <Form>
          <Form.Item {...formItemLayout} label="User Id">
            <Input value={userId} onChange={this.handleIdChange} placeholder="Please enter the id." />
          </Form.Item>
          <Form.Item {...formItemLayout} label="Input Type">
            <Radio.Group name="inputType" value={inputType} onChange={this.handleRadioValueChange}>
              <Radio value="pointing">Cursor</Radio>
              <Radio value="gesturetag">GestureTag</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item {...formItemLayout} label="Number of Trials">
            <InputNumber min={1} max={20} step={1} value={trialNums} onChange={this.handleTrialNumberChange} />
          </Form.Item>
        </Form>
      </Modal>
    );
  }
};
