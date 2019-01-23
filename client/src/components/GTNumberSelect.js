import React from 'react';
import { Switch, InputNumber } from 'antd';


export default class GTNumberSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFixed: true
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(value) {
  }

  render() {
    const { isFixed } = this.state;
    const { min, max } = this.props;
    return (
      <div>
        <Switch checkedChildren="Fixed" unCheckedChildren="Random" checked={isFixed} />
        <br />
        {isFixed ? <InputNumber min={min} max={max} defaultValue={min} onChange={this.handleChange} />} 
      </div>
    );
  }
}