const EYE_TRACKING_WIDTH_ERROR_THRESHOLD = 300;

const xRange = {
  min: EYE_TRACKING_WIDTH_ERROR_THRESHOLD,
  max: window.outerWidth - 300
};

const yRange = {
  min: EYE_TRACKING_WIDTH_ERROR_THRESHOLD,
  max: window.outerHeight - 300
};

const generateButtons = (targetNums, targetSize, targetSpacing) => {
  let num = targetNums;
  const target = createTarget(targetSize);
  const { x, y } = target;
  const spacingTargets = [
    {
      x: x + targetSpacing + targetSize,
      y,
      targetSize
    },
    {
      x: x - targetSpacing - targetSize,
      y,
      targetSize
    },
    {
      x,
      y: y - targetSpacing - targetSize,
      targetSize
    },
    {
      x,
      y: y + targetSpacing + targetSize,
      targetSize
    }
  ];
  num -= 5;
  const targetBlock = {
    x: {
      min: spacingTargets[1].x,
      max: spacingTargets[0].x
    },
    y: {
      min: spacingTargets[2].y,
      max: spacingTargets[3].y
    }
  };
  let buttons = [];
  buttons.push(target);
  buttons = buttons.concat(spacingTargets);
  return buttons;
};

const createTarget = targetSize => {
  const x = Math.random() * (xRange.max - xRange.min) + xRange.min;
  const y = Math.random() * (yRange.max - yRange.min) + yRange.min;

  return {
    x, y, targetSize
  };
}

const createDistractor = (targetBlock, index) => {

};

export { generateButtons };
