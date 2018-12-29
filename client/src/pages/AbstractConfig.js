import React from 'react';
import { Layout, Radio, Card } from 'antd';
import GTMenu from '../components/GTMenu';
import GTSingleConditionForm from '../components/GTSingleConditionForm';
import GTSerialConditionForm from '../components/GTSerialConditionForm';
import { Redirect } from 'react-router-dom';

const { Header, Footer, Content } = Layout;

export default class AbstractConfig extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formType: 'single',
      redirect: false,
      redirectInfo: null,
    };
    this.formOnChange = this.formOnChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  formOnChange(e) {
    this.setState({ formType: e.target.value });
  }

  handleSubmit(data) {
    // e.preventDefault();
    fetch('/api/study/single', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(jsonObj => this.setState({ redirect: true, redirectInfo: jsonObj }))
    .catch(err => console.error(err));
  }

  renderFormByType() {
    const { formType } = this.state;
    if (formType === 'single')
      return <GTSingleConditionForm  handleSubmit={this.handleSubmit} />;
    else if (formType === 'multiple')
      return <GTSerialConditionForm />;
  }

  render() {
    const { redirect, redirectInfo } = this.state;
    return (redirect ? <Redirect push to={{ pathname: '/study/single', state: { redirectInfo } }} /> :(
      <Layout>
        <Header>
          <GTMenu status={"abstract"} />
        </Header>
        <Content style={{ padding: '50px' }}>
          <Radio.Group
            defaultValue="single"
            buttonStyle="solid"
            size="large"
            onChange={this.formOnChange}
          >
            <Radio.Button value="single">Single Condition</Radio.Button>
            <Radio.Button value="multiple">Serial Conditions</Radio.Button>
          </Radio.Group>
          <Card style={{ padding: '20px' }} title="Condition Form">
            {this.renderFormByType()}
          </Card>
        </Content>
      </Layout>
    ));
  }
};
