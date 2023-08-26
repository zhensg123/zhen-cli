import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import './reset.css';
import './assets/icon/iconfont.css';
import {
  BrowserRouter as Router
} from "react-router-dom";
import App from './App';

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById('root')
);



