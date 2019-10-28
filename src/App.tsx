import * as React from 'react';
import { BrowserRouter as Router, Route, withRouter, RouteComponentProps } from 'react-router-dom';

import Home from './pages/Home';

import './App.css';

const { useState, useEffect } = React;

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
        <Route exact path="/" component={Home} />
      </RouteContainer>
    </Router>
  );
};

export default App;
