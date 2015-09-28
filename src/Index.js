import React from 'react';
/*eslint-disable */
import {Router, Route} from 'react-router';
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

React.render(
  <Router>
    <Route path="/" component={App}>
    </Route>
  </Router>
  , document.getElementById('content')
);
