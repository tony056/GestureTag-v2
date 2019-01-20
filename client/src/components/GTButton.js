import React from 'react';
import classNames from 'classnames';
import './GTButton.css';

export default function GTButton({ width, height, left, top, name, click, value, styleId, arrowChild }) {
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
        return classNames('base-button', 'round-button', 'abstract-target');
      case 1:
        return classNames('base-button', 'round-button', 'distractor');
      case 2:
        return classNames('base-button', 'invisible');
      default:
        return classNames('base-button', 'dev');
    }
  };
  const posStyle = {
    top,
    left,
    width,
    height
  };

  return (
    <button id={value} name={name} className={renderStyle(styleId)} style={posStyle} onClick={handleClick}>
      {(arrowChild ? <img style={imageStyle} src={arrowChild} /> : null)}
    </button>
  );
}
