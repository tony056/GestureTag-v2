import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import GTStudySwitch from '../components/GTStudySwitch';

class Home extends Component {
  render() {
    return (
    <div className="App">
      <GTStudySwitch />
    </div>
    );
  }
}

export default Home;
