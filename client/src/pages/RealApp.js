import React, { Component } from 'react';
import GTButton from '../components/GTButton';

export default class RealApp extends Component {
  constructor(props){
    super(props);
    this.updateButtons = this.updateButtons.bind(this);
    this.getButtonsFromServer = this.getButtonsFromServer.bind(this);
    this.state = {
      buttons: [],
      isLoading: false,
    };
  }

  getButtonsFromServer(filename) {
    const { isLoading } = this.state;
    if (isLoading) return;
    this.setState({ isLoading: true });
    fetch(`/api/getButtons/${filename}`)
    .then(res => res.json())
    .then(jsonObj => {
      //console.log(typeof jsonObj);
      this.updateButtons(JSON.parse(jsonObj));
    })
    .catch(err => console.error(err));
  }

  updateButtons(fileObj) {
    const { isLoading } = this.state;
    const { Targets } = fileObj;
    if (isLoading) {
      this.setState({ isLoading: false, buttons: Targets.Target });
    } else {
      this.setState({ buttons: Targets.Target });
    }
  }

  componentDidMount() {
    const { xml_source } = this.props.location.state.item;
    this.getButtonsFromServer(xml_source);
  }

  componentWillMount() {
    document.body.style.height = "100%";
    document.getElementById('root').style.height = "100%";
  }

  componentWillUnmount() {

  }

  render() {
    const { item } = this.props.location.state;
    const { img_source } = item;
    const bgStyle = {
      backgroundImage: `url(${img_source})`,
      height: "100%",
    };
    const { buttons } = this.state;
    return (
      <div style={bgStyle}>
        {(buttons && buttons.length > 0) ? buttons.map(btn => {
          const { X, Y, Width, Height, Name } = btn;
          const top = `${Y}px`;
          const left = `${X}px`;
          const width = `${Width}px`;
          const height = `${Height}px`;
          return (
            <GTButton key={Name} top={top} left={left} width={width} height={height}/>
          )
        }) : "Nothing"}
      </div>
    );
  }
};
