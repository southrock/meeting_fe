import * as React from 'react';
import { BrowserRouter as Router, Route, withRouter, Redirect, RouteComponentProps, RouteProps } from 'react-router-dom';

import Login from './pages/Login';
import Home from './pages/Home';
import CreateMeeting from './pages/CreateMeeting';
import MyMeetings from './pages/MyMeetings';
import ManageMeeting from './pages/ManageMeeting';

import './App.css';
import { message } from 'antd';
import Signin from './pages/Signin';

const { useState, useEffect } = React;

interface MyRouteProps extends RouteProps {
  auth: string[];
}

const PrivateRoute = ({ component:Component, ...rest }: MyRouteProps ) => {
  const { auth } = rest;
  const role = localStorage.getItem('role');
  const isAuth = auth.includes(role);
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuth ? (
          <Component
            {...props}
          />
        ) : (
          <Redirect
            to={{
              pathname: '/',
              state: { from: props.location }
            }}
          />
        )
      }
    />
  );
};

const Container = (props: RouteComponentProps & {children?: JSX.Element[] | JSX.Element}) => {

  const { history } = props;

  return (
    <>
      {props.children}
    </>
  );
};
const RouteContainer = withRouter(Container);

const App = () => {
  return (
    <Router>
      <RouteContainer>
        <Route exact path="/login" component={Login} />
        <Route exact path="/signin" component={Signin} />
        <PrivateRoute exact path="/" component={Home} auth={['user','organizer','admin']} />
        <PrivateRoute exact path="/user/mymeetings" component={MyMeetings} auth={['user','organizer','admin']} />
        <PrivateRoute exact path="/meeting/create" component={CreateMeeting} auth={['organizer','admin']} />
        <PrivateRoute exact path="/meeting/manage" component={ManageMeeting} auth={['organizer','admin']} />
      </RouteContainer>
    </Router>
  );
};

export default App;
