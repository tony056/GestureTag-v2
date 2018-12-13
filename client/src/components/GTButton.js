import React from 'react';

export default function GTButton({ width, height, left, top }) {
  const styles = {
    left,
    top,
    width,
    height,
    position: 'relative',
    zIndex: 100,
    border: "2px solid #4CAF50",
    background: 'rgba(255, 255, 255, 0.0)',
  };
  return (
    <button style={styles}></button>
  );
}
