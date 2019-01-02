const EYE_TRACKING_WIDTH_ERROR_THRESHOLD = 300;
const ROW = 15;
const COLUMN = 24;
const WIDTH = 1920;
const HEIGHT = 1200;
const BLOCK_WIDTH = 80;
const BLOCK_HEIGHT = 80;
const targetOptions = [16, 32, 48];
const xRange = {
  min: EYE_TRACKING_WIDTH_ERROR_THRESHOLD,
  max: WIDTH - 300
};

const yRange = {
  min: EYE_TRACKING_WIDTH_ERROR_THRESHOLD,
  max: HEIGHT - 300
};

const generateButtons = (targetNums, targetSize, targetSpacing, cb) => {
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
      max: spacingTargets[0].x + targetSize
    },
    y: {
      min: spacingTargets[2].y,
      max: spacingTargets[3].y + targetSize
    }
  };
  let buttons = [];
  buttons.push(target);
  buttons = buttons.concat(spacingTargets);
  let positions = [...Array(ROW * COLUMN).keys()];
  // shuffle
  positions = shuffle(positions);
  let i = 0;
  while (num > 0 && i < positions.length) {
    const pos = positions[i];
    const r = Math.round(pos / COLUMN);
    const c = pos % COLUMN;
    i++;
    const distractor = createDistractor(targetBlock, r , c);
    if (distractor) {
      buttons.push(distractor);
      num -= 1;
    }
  }
  cb(buttons);
};

const createTarget = targetSize => {
  const x = Math.random() * (xRange.max - xRange.min) + xRange.min;
  const y = Math.random() * (yRange.max - yRange.min) + yRange.min;

  return {
    x, y, targetSize
  };
}

const createDistractor = (targetBlock, row, col) => {
  const x1 = col * BLOCK_WIDTH;
  const x2 = (col + 1) * BLOCK_WIDTH;
  const y1 = row * BLOCK_HEIGHT;
  const y2 = (row + 1) * BLOCK_HEIGHT;
  const size = randomPickSize();
  const margin = Math.round(size / 2);
  const rx = generateRandomPos(x1 + margin, x2 - size);
  const ry = generateRandomPos(y1 + margin, y2 - size);
  const yInRange = (ry >= targetBlock.y.min && ry <= targetBlock.y.max) || (ry + size >= targetBlock.y.min && ry + size <= targetBlock.y.max);
  const xInRange = (rx >= targetBlock.x.min && rx <= targetBlock.x.max) || (rx + size >= targetBlock.x.min && rx + size <= targetBlock.x.max);
  if (yInRange && xInRange)
    return null;
  return {
    x: rx,
    y: ry,
    targetSize: size
  };
};

const generateRandomPos = (a1, a2) => {
  return Math.round(Math.random() * (a2 - a1) + a1);
};

const randomPickSize = () => {
  const index = Math.round(Math.random() * (2 - 0) + 0);
  return targetOptions[index];
};

const shuffle = positions => {
  let currentIndex = positions.length;
  let temporaryValue = 0;
  let randomIndex = 0;
  const array = [...positions];
  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

module.exports = {
  generateButtons
};
