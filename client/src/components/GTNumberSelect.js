import React from 'react';
import { Switch, InputNumber, Row, Col } from 'antd';


export default class GTNumberSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFixed: true
    };
    this.displayRangeSelect = this.displayRangeSelect.bind(this);
    this.handleMinChange = this.handleMinChange.bind(this);
    this.handleMaxChange = this.handleMaxChange.bind(this);
    this.toggleChange = this.toggleChange.bind(this);
  }

  toggleChange(status) {
    this.setState({ isFixed: status });
  }

  handleMinChange(value) {
    const { minChange, name } = this.props;
    minChange(name, value);
  }

  handleMaxChange(value) {
    const { maxChange, name } = this.props;
    maxChange(name, value);
  }

  displayRangeSelect() {
    const { min, max, values, minChange, maxChange } = this.props;
    return (
      <div>
        <Row gutter={8}>
          <Col span={6}>
            <b>Min: </b>
            <InputNumber min={min} max={max} value={values[0]} onChange={this.handleMinChange} />
          </Col>
          <Col span={6}>
            <b>Max: </b>
            <InputNumber min={min} max={max} value={values[1]} onChange={this.handleMaxChange} />
          </Col>
        </Row>
      </div>
    );
  }

  render() {
    const { isFixed } = this.state;
    const { min, max, values, minChange } = this.props;
    return (
      <div>
        <Switch checkedChildren="Fixed" unCheckedChildren="Range" checked={isFixed} onChange={this.toggleChange} />
        <br />
        {isFixed ?
          <InputNumber min={min} max={max} value={values[0]} onChange={this.handleMinChange} />
        : this.displayRangeSelect()}
      </div>
    );
  }
}
