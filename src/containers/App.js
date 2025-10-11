import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';

import GoogleAnalytics from './GoogleAnalytics';
import LocalizedRoute from './LocalizedRoute';
import TopBar from '../components/common/TopBar';

class App extends Component {

  render() {
    return (
      <Router>
        <div className="App h-100">
          <GoogleAnalytics/>
          <TopBar />
          <Route path="/"
            component={LocalizedRoute}/>
        </div>
      </Router>
    );
  }
}

export default App;
