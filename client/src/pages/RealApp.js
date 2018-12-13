import React, { Component } from 'react';


export default class RealApp extends Component {
  constructor(props){
    super(props);
  }

  getButtonsFromServer() {
    fetch('/api/getButtons')
    .then(res => this.setState({  }))
    .catch(err => console.error(err));
  }

  componentWillMount() {
    document.body.style.height = "100%";
    document.getElementById('root').style.height = "100%";
  }

  render() {
    const { item } = this.props.location.state;
    const { img_source } = item;
    const bgStyle = {
      backgroundImage: `url(${img_source})`,
      height: "100%",
    };
    return (
      <div style={bgStyle}>
      </div>
    );
  }
};
