import React from 'react';

export default function GTButton({ width, height, left, top, name, click, value, styleId, arrowChild }) {
  const styles = {
    dev: {
      left,
      top,
      width,
      height,
      position: 'absolute',
      zIndex: 100,
      float: 'left',
      border: "2px solid #4CAF50",
      background: 'rgba(255, 255, 255, 0.0)',
    },
    abstract: {
      left,
      top,
      width,
      height,
      position: 'absolute',
      zIndex: 100,
      float: 'left',
      borderRadius: '50%',
      borderStyle: 'none',
      background: 'rgba(128, 128, 128, 1.0)'
    },
    target: {
      left,
      top,
      width,
      height,
      position: 'absolute',
      zIndex: 100,
      float: 'left',
      borderRadius: '50%',
      borderStyle: 'none',
      background: 'rgba(43, 91, 159, 1.0)'
    },
    realistic: {
      left,
      top,
      width,
      height,
      position: 'absolute',
      zIndex: 100,
      float: 'left',
      borderStyle: 'none',
      background: 'rgba(43, 91, 159, 0.0)'
    },
    overlapped: {
      left,
      top,
      width,
      height,
      position: 'absolute',
      zIndex: 100,
      float: 'left',
      borderStyle: 'none',
      background: 'rgba(0, 0, 0, 1.0)'
    }
  };

  const imageStyle = {
    width: '100%',
    height: '100%'
  };

  const handleClick = () => {
    click(value);
  }

  const renderStyle = id => {
    switch (id) {
      case 0:
        return styles.target;
      case 1:
        return styles.abstract;
      case 2:
        return styles.realistic;
      default:
        return styles.dev;
    }
  };

  return (
    <button id={value} name={name} style={renderStyle(styleId)} onClick={handleClick}>
      {(arrowChild ? <img style={imageStyle} src={arrowChild} /> : null)}
    </button>
  );
}
