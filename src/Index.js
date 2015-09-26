import React from 'react';
/*eslint-disable */
import {Router, Route} from 'react-router';
import Map from './components/Map';
/*eslint-enable */

window.React = React;

var App = React.createClass({

  render() {
    var {hideUI, lockMouse, hideLogo} = this.props.location.query;

    return (
      <div id="app">
          <Map hideUI={hideUI} lockMouse={lockMouse} hideLogo={hideLogo}/>
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
