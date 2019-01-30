const EYE_TRACKING_WIDTH_ERROR_THRESHOLD = 300;
const ROW = 15;
const COLUMN = 24;
const WIDTH = 1920;
const HEIGHT = 1200;
const BLOCK_WIDTH = 80;
const BLOCK_HEIGHT = 80;
const TARGET_RANGE = [8, 32];
const xRange = {
  min: EYE_TRACKING_WIDTH_ERROR_THRESHOLD,
  max: WIDTH - 300
};

const yRange = {
  min: EYE_TRACKING_WIDTH_ERROR_THRESHOLD,
  max: HEIGHT - 300
};

const dummyButtons = (targetNums, cb) => {
  const btns = range(targetNums).map(d => {
    return {
      x: 0,
      y: 0,
      w: 0,
      h:0,
      id: d
    };
  });
  cb(btns);
}

const convertBtnLabelsToButtons = (jsonObj) => {
  const { Targets } = JSON.parse(jsonObj);
  // console.log(JSON.stringify(jsonObj));
  if (!Targets) {
    console.log('error parsing');
    return;
  }
  return Targets.Target.map((btn, i) => {
    const { X, Y, Width, Height, Name } = btn;
    return {
      x: parseInt(X),
      y: parseInt(Y),
      w: parseInt(Width),
      h: parseInt(Height),
      id: Name
    };
  });
}

const chooseTargetRandomly = (buttons) => {
  const targetIndex = Math.floor(Math.random() * buttons.length);
  const newBtns = buttons.slice(0, targetIndex).concat(buttons.slice(targetIndex + 1));
  return {
    target: buttons[targetIndex],
    buttons: newBtns
  };
};

const generateButtons = (targetNums, targetSize, cb) => {
  const [minTargetNum, maxTargetNum] = targetNums;
  const [minTargetSize, maxTargetSize] = targetSize;
  let num = (minTargetNum === maxTargetNum) ? minTargetNum :Math.floor(Math.random() * (maxTargetNum - minTargetNum + 1) + minTargetNum);
  const size = (minTargetSize === maxTargetSize) ? minTargetSize : Math.floor(Math.random() * (maxTargetSize - minTargetSize + 1) + minTargetSize);
  const target = createTarget(size);
  num -= 1;
  const hw = Math.round(target.w / 2);
  const hh = Math.round(target.h / 2);
  
  const targetBlock = {
    l: {
      x: target.x - hw - 2,
      y: target.y - hh - 2 
    },
    r: {
      x: target.x + hw + 2,
      y: target.y + hh + 2
    }
  };
  const initElement = {
    x: 0,
    y: 0,
    w: -1,
    h: -1,
    id: "",
    row: 0,
    col: 0
  };
  let buttons = [];
  // for (let k = 0; k < ROW; k++) {
  //   let column = [];
  //   for (let j = 0; j < COLUMN; j++) {
  //     column.push(Object.assign({}, initElement));
  //   }
  //   buttons.push(column);
  // }
  
  let positions = [...Array(ROW * COLUMN).keys()];
  // shuffle
  positions = shuffle(positions);
  let i = 0;
  while (num > 0 && i < positions.length) {
    const pos = positions[i];
    const r = Math.floor(pos / COLUMN) >= ROW ? ROW - 1 : Math.floor(pos / COLUMN);
    const c = pos % COLUMN;
    const distractor = createDistractor(targetBlock, r , c);
    i++;
    if (distractor) {
      const { row, col } = distractor;
      // buttons[row][col] = Object.assign({}, distractor);
      buttons.push(distractor);
      num -= 1;
    }
  }
  cb(target, buttons);
};

const createTarget = targetSize => {
  const x = Math.round(Math.random() * (xRange.max - xRange.min) + xRange.min);
  const y = Math.round(Math.random() * (yRange.max - yRange.min) + yRange.min);
  const col = Math.floor(x / BLOCK_WIDTH);
  const row = Math.floor(y / BLOCK_HEIGHT);
  return {
    x, y, w: targetSize, h: targetSize, id: `${x}_${y}`, key: 'target-btn', row, col
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
  const rect1 = {
    l: {
      x: rx - margin,
      y: ry - margin
    },
    r: {
      x: rx + margin,
      y: ry + margin 
    }
  };
  
  if (doOverlap(rect1, targetBlock)) {
    return null;
  }

  return {
    x: rx,
    y: ry,
    w: size,
    h: size,
    id: `${rx}_${ry}`,
    row,
    col
  };
};

const generateRandomPos = (a1, a2) => {
  return Math.round(Math.random() * (a2 - a1) + a1);
};

const randomPickSize = () => {
  return Math.round(Math.random() * (TARGET_RANGE[1] - TARGET_RANGE[0]) + TARGET_RANGE[0] + 1);
};

const doOverlap = (rect1, rect2) => {
  if (rect1.l.x > rect2.r.x || rect2.l.x > rect1.r.x) {
    return false;
  } 
  if (rect1.l.y > rect2.r.y || rect2.l.y > rect1.r.y) {
    return false;
  }
  return true;
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
  generateButtons,
  dummyButtons,
  convertBtnLabelsToButtons,
  chooseTargetRandomly
};
