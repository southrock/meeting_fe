import * as React from 'react';
import { BrowserRouter as Router, Route, withRouter, Redirect, RouteComponentProps, RouteProps } from 'react-router-dom';

import Login from './pages/Login';
import Home from './pages/Home';
import CreateMeeting from './pages/CreateMeeting';
import MyMeetings from './pages/MyMeetings';
import ManageMeeting from './pages/ManageMeeting';

import './App.css';

const { useState, useEffect } = React;

const PrivateRoute = ({ component:Component, ...rest }: RouteProps) => {
  const isAuth = true;
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
        <PrivateRoute exact path="/" component={Home} />
        <PrivateRoute exact path="/meeting/create" component={CreateMeeting} />
        <PrivateRoute exact path="/user/mymeetings" component={MyMeetings} />
        <PrivateRoute exact path="/meeting/manage" component={ManageMeeting} />
      </RouteContainer>
    </Router>
  );
};

export default App;
