export const enableGestureListener = cb => {
  document.addEventListener('keydown', cb, false);
};

export const disableGestureListener = cb => {
  document.removeEventListener('keydown', cb, false);
};

export const gestureDetector = e => {
  switch(e.keyCode) {
    case 37:
      // left
      return 3;
    case 38:
      // up
      return 0;
    case 39:
      // right
      return 1;
    case 40:
      // down
      return 2;
    default:
      return -1;
  }
}
