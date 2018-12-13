import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import Home from './pages/Home';
import List from './pages/List';
import AppSelection from './pages/AppSelection';
import RealApp from './pages/RealApp';

class App extends Component {
  render() {
    return (
      <Switch>
        <Route exact path='/' component={Home} />
        <Route path='/app-selection' component={AppSelection} />
        <Route path='/realistic' component={RealApp} />
      </Switch>
    );
  }
}

export default App;
