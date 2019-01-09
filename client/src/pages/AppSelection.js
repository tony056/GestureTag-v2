import React, { Component } from 'react';
import { Layout } from 'antd';
import GTMenu from '../components/GTMenu';
import GTAppList from '../components/GTAppList';
import GTInfoModal from '../components/GTInfoModal';

const { Header, Footer, Content } = Layout;

export default class AppSelection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      apps: [],
      modalVisible: false,
      selectedItem: null
    };
    this.getApps = this.getApps.bind(this);
    this.openInfoModal = this.openInfoModal.bind(this);
    this.closeInfoModal = this.closeInfoModal.bind(this);
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

  openInfoModal(e, item) {
    this.setState({ modalVisible: true, selectedItem: item });
  }

  closeInfoModal() {
    this.setState({ modalVisible: false });
  }

  render() {
    const { apps, modalVisible, selectedItem } = this.state;
    return (
      <Layout>
        <Header>
          <GTMenu status={"realistic"}/>
        </Header>
        <Content>
          {apps.length > 0
            ? <GTAppList apps={apps} click={this.openInfoModal} />
            : "No content to show"}
            <GTInfoModal visible={modalVisible} item={selectedItem} closeInfoModal={this.closeInfoModal} />
        </Content>
        <Footer>Footer</Footer>
      </Layout>
    );
  }
};
