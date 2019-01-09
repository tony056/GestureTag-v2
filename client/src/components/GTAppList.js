import React from 'react';
import { List, Card } from 'antd';

const { Meta } = Card;

export default function GTAppList({ apps, click }) {
  return (
    <List
      grid={{
        gutter: 16,
        xs: 1,
        sm: 2,
        md: 4,
        lg: 4,
        xl: 6,
        xxl: 3,
      }}
      dataSource={apps}
      renderItem={item => (
        <List.Item>
          <Card
            hoverable
            onClick={e => click(e, item)}
            name={item.name}
            cover={<img alt={item.name} src={item.img_source} />}
          >
            <Meta
              title={item.name}
            />
          </Card>
        </List.Item>
      )}
    />
  );
}
