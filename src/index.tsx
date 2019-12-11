import * as React from 'react';
import * as ReactDOM from 'react-dom';

import 'antd/dist/antd.css';

import App from './App';
import axios from 'axios';

axios.defaults.withCredentials=true;

ReactDOM.render(<App />, document.getElementById('root'));
