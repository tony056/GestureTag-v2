import React from 'react';
import { Form, Input, Radio, InputNumber, Button } from 'antd';

export default class GTSerialConditionForm extends React.Component {
  render() {
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    return (
      <Form>
        <Form.Item {...formItemLayout} label="User Id">
          <Input placeholder="Please enter the id." />
        </Form.Item>
        <Form.Item {...formItemLayout} label="Input Type">
          <Radio.Group>
            <Radio value="pointing">Cursor</Radio>
            <Radio value="gesturetag">GestureTag</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item {...formItemLayout} label="Target Size">
          <Radio.Group>
            <Radio value="16">16 px</Radio>
            <Radio value="32">32 px</Radio>
            <Radio value="48">48 px</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item {...formItemLayout} label="Target Spacing">
          <Radio.Group>
            <Radio value="0">0</Radio>
            <Radio value="0.5">0.5</Radio>
            <Radio value="1">1</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item {...formItemLayout} label="Number of Targets">
          <InputNumber min={5} max={300} step={10} />
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
