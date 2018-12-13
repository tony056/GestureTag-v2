import React, { Component } from 'react';
import { Menu } from 'antd';

export default class GTMenu extends Component {

  constructor(props) {
    super(props);
    this.state = {
      current: props.status
    };
    this.menuClick = this.menuClick.bind(this);
  }

  menuClick(event) {
    this.setState({ current: event.key });
  }

  render() {
    return (
      <Menu theme="dark" onClick={this.menuClick} selectedKeys={[this.state.current]} mode="horizontal">
        <Menu.Item key="abstract">
          Abstract Test
        </Menu.Item>
        <Menu.Item key="realistic">
          Realistic App
        </Menu.Item>
      </Menu>
    );
  }
};
