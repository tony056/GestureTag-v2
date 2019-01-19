import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import Home from './pages/Home';
import List from './pages/List';
import AppSelection from './pages/AppSelection';
import AbstractConfig from './pages/AbstractConfig';
import RealApp from './pages/RealApp';
import AbstractStudy from './pages/AbstractStudy';
import Touchpad from './pages/Touchpad';

class App extends Component {
  render() {
    return (
      <Switch>
        <Route exact path='/' component={Home} />
        <Route path='/app-selection' component={AppSelection} />
        <Route path='/abstract-selection' component={AbstractConfig} />
        <Route path='/realistic' component={RealApp} />
        <Route path='/study/single' component={AbstractStudy} />
        <Route path='/touchpad' component={Touchpad} />
      </Switch>
    );
  }
}

export default App;
