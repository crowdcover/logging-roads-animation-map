import React from 'react';
import ReactDom from 'react-dom';
/*eslint-disable */
import { Router, Route, browserHistory } from 'react-router'
import Map from './components/Map';
/*eslint-enable */

window.React = React;

var App = React.createClass({

  render() {
    return (
      <div id="app">
          <Map {...this.props.location.query}/>
      </div>
    )
  }
});

ReactDom.render(
  (
  <Router  history={browserHistory}>
    <Route path="/" component={App}>
    </Route>
  </Router>
  )
  , document.getElementById('content')
);
