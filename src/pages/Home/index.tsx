import * as React from 'react';
import { Link } from 'react-router-dom';
import { Card, Row } from 'antd';

import './style.css';


const Home = () => {

  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('role');
  };

  return (
    <div className="index-container">
      <Card>
        <Row>
          <Link to="/user/mymeetings">我的会议</Link>
        </Row>
        <Row>
          {['admin','organizer'].includes(role) && <Link to="/meeting/create">创建会议</Link>}
        </Row>
        <Row>
          {['admin','organizer'].includes(role) && <Link to="/meeting/manage">管理会议</Link>}
        </Row>
        <Row>
          <Link to="/login" onClick={handleLogout}>退出登录</Link>
        </Row>
      </Card>
    </div>
  );
};

export default Home;
