import React from 'react';


export default function GTTouchPoint({ x, y }) {
  const pointSize = 48;
  const basicStyle = {
    left: `${x}px`,
    top: `${y}px`,
    borderRadius: '50%',
    width: `${pointSize}px`,
    height: `${pointSize}px`,
    background: 'rgba(10, 112, 215, 0.4)',
    marginTop: `-${Math.floor(pointSize / 2)}px`,
    marginLeft: `-${Math.floor(pointSize / 2)}px`,
    zIndex: 101,
    position: 'absolute',
    float: 'left',
    display: 'block'
  };


  return (
    <div style={basicStyle} />
  );
}