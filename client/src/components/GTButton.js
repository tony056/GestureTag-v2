import React from 'react';

export default function GTButton({ width, height, left, top, name }) {
  const styles = {
    left,
    top,
    width,
    height,
    position: 'absolute',
    zIndex: 100,
    border: "2px solid #4CAF50",
    background: 'rgba(255, 255, 255, 0.0)',
    float: 'left'
  };
  return (
    <button name={name} style={styles}></button>
  );
}
