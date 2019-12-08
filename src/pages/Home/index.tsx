import * as React from 'react';
import { Link } from 'react-router-dom';
import { Card, Row } from 'antd';

import './style.css';

const Home = () => {
  return (
    <div className="index-container">
      <Card>
        <Row>
          <Link to="/user/mymeetings">我的会议</Link>
        </Row>
        <Row>
          <Link to="/meeting/create">创建会议（organizer）</Link>
        </Row>
        <Row>
          <Link to="/meeting/manage">管理会议（admin）</Link>
        </Row>
      </Card>
    </div>
  );
};

export default Home;
