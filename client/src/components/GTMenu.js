import React, { Component } from 'react';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';

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

  mountLink(key, content, link) {
    const { current } = this.state;
    if (current !== key) {
      return (
          <Menu.Item key={key}>
            <Link to={link}>
              {content}
            </Link>
          </Menu.Item>
      );
    } else {
      return (
        <Menu.Item key={key}>
          {content}
        </Menu.Item>
      );
    }
  }

  render() {
    return (
      <Menu theme="dark" onClick={this.menuClick} selectedKeys={[this.state.current]} mode="horizontal">
        {this.mountLink("abstract", "Abstract Test", "/abstract-selection")}
        {this.mountLink("realistic", "Realistic App", "/app-selection")}
      </Menu>
    );
  }
};
