import React from 'react';
import { Row, Col, Card } from 'antd';
const { Meta } = Card;

export default class GTStudySwitch extends React.Component {

  render() {
    return (
      <div style={{ padding: '10%' }}>
        <Row gutter={48}>
          <Col span={12}>
            <Card
              hoverable
              style={{ width: '100%' }}
              cover={<img alt="Abstract UI Study" src="https://via.placeholder.com/400x300.png" />}
            >
              <Meta
                title="Abstract UI Study"
                description={""}
              />
            </Card>
          </Col>
          <Col span={12}>
            <Card
              hoverable
              style={{ width: '100%' }}
              cover={<img alt="Abstract UI Study" src="https://via.placeholder.com/400x300.png" />}
            >
              <Meta
                title="Realistic UI Study"
                description={""}
              />
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}
