import React, { Component } from 'react';
import { Layout } from 'antd';
import GTMenu from '../components/GTMenu';
import GTAppList from '../components/GTAppList';

const { Header, Footer, Content } = Layout;

export default class AppSelection extends Component {
  constructor(props) {
    super(props);
    this.getApps = this.getApps.bind(this);
    this.directToApp = this.directToApp.bind(this);
    this.state = {
      apps: []
    };
  }

  componentDidMount() {
    this.getApps();
  }

  getApps() {
    fetch('/api/getApps')
    .then(res => res.json())
    .then(apps => this.setState({ apps }))
    .catch(err => console.error(err));
  }

  directToApp(name) {
    console.log(`we submitted: ${name}`);
  }

  render() {
    const { apps } = this.state;
    return (
      <Layout>
        <Header>
          <GTMenu status={"realistic"}/>
        </Header>
        <Content>{apps.length > 0 ? <GTAppList apps={apps} click={this.directToApp} />  : "No content to show"}</Content>
        <Footer>Footer</Footer>
      </Layout>
    );
  }
};
