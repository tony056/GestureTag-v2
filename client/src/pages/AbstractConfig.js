import React from 'react';
import { Layout, Radio, Card } from 'antd';
import GTMenu from '../components/GTMenu';
import GTSingleConditionForm from '../components/GTSingleConditionForm';
import GTSerialConditionForm from '../components/GTSerialConditionForm';

const { Header, Footer, Content } = Layout;

export default class AbstractConfig extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formType: 'single'
    };
    this.formOnChange = this.formOnChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  formOnChange(e) {
    this.setState({ formType: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
  }

  renderFormByType() {
    const { formType } = this.state;
    if (formType === 'single')
      return <GTSingleConditionForm  handleSubmit={this.handleSubmit} />;
    else if (formType === 'multiple')
      return <GTSerialConditionForm />;
  }

  render() {

    return (
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
    );
  }
};
