import React from 'react';
import { Form, Input, Radio, InputNumber, Button, Select } from 'antd';
const SIZES = {
  SMALL: 16,
  MEDIUM: 32,
  LARGE: 48
};
const SPACINGS = {
  SMALL: 0,
  MEDIUM: 0.5,
  LARGE: 1
};
let OPTIONS = [];
const size_arr = Object.values(SIZES);
const spacing_arr = Object.values(SPACINGS);
size_arr.forEach(size => {
  spacing_arr.forEach(spacing => {
    OPTIONS.push({
      targetSize: size,
      targetSpacing: spacing
    });
  });
});

export default class GTSerialConditionForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedItems: [],
      userId: '',
      inputType: '',
      targetNums: 5,
      trialNums: 1
    };
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleIdChange = this.handleIdChange.bind(this);
    this.handleRadioValueChange = this.handleRadioValueChange.bind(this);
    this.handleNumberChange = this.handleNumberChange.bind(this);
    this.handleTrialNumberChange = this.handleTrialNumberChange.bind(this);
  }

  handleSelectChange(selectedItems) {
    this.setState({ selectedItems });
  }

  handleIdChange(e) {
    this.setState({ userId: e.target.value });
  }

  handleRadioValueChange(e) {
    const { value } = e.target;
    this.setState({ inputType: value });
  }

  handleNumberChange(value) {
    this.setState({ targetNums: value });
  }

  handleTrialNumberChange(value) {
    this.setState({ trialNums: value });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.handleSubmit(this.state, '/api/study/multiple');
  }

  render() {
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const { selectedItems, targetNums, trialNums, inputType, userId } = this.state;
    const filteredOptions = OPTIONS.filter(option => !selectedItems.includes(`${option.targetSize}-${option.targetSpacing}`));
    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Item {...formItemLayout} label="User Id">
          <Input placeholder="Please enter the id." value={userId} onChange={this.handleIdChange} />
        </Form.Item>
        <Form.Item {...formItemLayout} label="Input Type">
          <Radio.Group value={inputType} onChange={this.handleRadioValueChange}>
            <Radio value="pointing">Cursor</Radio>
            <Radio value="gesturetag">GestureTag</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item {...formItemLayout} label="Number of Targets">
          <InputNumber min={5} max={300} step={10} value={targetNums} onChange={this.handleNumberChange} />
        </Form.Item>
        <Form.Item {...formItemLayout} label="Number of Trials">
          <InputNumber min={1} max={20} step={1} value={trialNums} onChange={this.handleTrialNumberChange} />
        </Form.Item>
        <Form.Item {...formItemLayout} label="Order of Conditions">
          <Select
            mode="multiple"
            placeholder="Conditions for the user"
            value={selectedItems}
            onChange={this.handleSelectChange}
            style={{ width: '100%' }}
          >
            {filteredOptions.map(item => {
              const key = `${item.targetSize}_${item.targetSpacing}`
              const value = `${item.targetSize}-${item.targetSpacing}`;
              return (<Select.Option key={key} value={value}>
                {value}
              </Select.Option>);
            })}
          </Select>
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
