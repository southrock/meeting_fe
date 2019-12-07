import * as React from 'react';
import { Card, Row } from 'antd';

import './style.css';

const Home = () => {
  return (
    <div className="index-container">
      <Card>
        <Row>
          我的会议
        </Row>
        <Row>
          创建会议（organizer）
        </Row>
        <Row>
          管理会议（admin）
        </Row>
        <Row>
          设置要求（admin）
        </Row>
      </Card>
    </div>
  );
};

export default Home;
