export const arrowDirection = {
  LEFT: '/images/left.png',
  RIGHT: '/images/right.png',
  UP: '/images/up.png',
  DOWN: '/images/down.png'
};

export const arrowByOrder = order => {
  switch (order) {
    case 0: 
      return arrowDirection.UP;
    case 1:
      return arrowDirection.RIGHT;
    case 2:
      return arrowDirection.DOWN;
    case 3:
      return arrowDirection.LEFT;
    default:
      return '';
  }
};