const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const parser = require('xml2json');
const app = express();
const port = process.env.PORT || 5000;
const utils = require('./utils/buttonGeneration');
const uf = require('./utils/userInfo');

let userInfo = {
  data_dir_path: '',
  log_file_path: '',
  inputType: '',
  userId: '',
  trialNums: 0,
  conditions: [],
  totalTrialNum: 0,
  targetNums: 5,
  completedNum: 0
};

app.use(bodyParser.json());
const getAppFiles = (cb) => {
  console.log(`search: ${__dirname}/client/public/apps`);
  fs.readdir(__dirname + '/client/public/apps', (err, items) => {
    if (err) {
      console.error(err);
      return;
    }
    cb(items);
  });
};

const parseXMLFile = (filename, cb) => {
  const filePath = `${__dirname}/client/public/apps/${filename}`;
  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    const jsonObj = parser.toJson(data);
    cb(jsonObj);
  });
};

const updateFilePaths = (dir_path, log_file_path) => {
  if (dir_path)
    userInfo.data_dir_path = dir_path;
  if (log_file_path)
    userInfo.log_file_path = log_file_path;
};

const updateTrialNums = cb => {
  userInfo.completedNum += 1;
  if (userInfo.completedNum === userInfo.totalTrialNum) {
    const num = userInfo.completedNum;
    // resetTrials();
    cb(true, num, num);
    return;
  }
  if ((userInfo.completedNum) % userInfo.trialNums !== 0) {
    console.log(`trial left: ${userInfo.completedNum % userInfo.trialNums}------------`);
    cb(false, userInfo.completedNum, userInfo.totalTrialNum);
  } else {
    console.log(`trial done...................................`);
    userInfo = uf.updateUserInfoCondition(userInfo);
    cb(true, userInfo.completedNum, userInfo.totalTrialNum);
  }
};

const addConditions = conditions => {
  userInfo.conditions = userInfo.conditions.concat(conditions);
};

// serve the static file from the React app
app.use(express.static(path.join(__dirname, 'client/public')));

app.get('/api/getList', (req, res) => {
  console.log('get');
  const list = ['item 1', 'item 2', 'item 3'];
  res.json(list);
});

app.get('/api/getApps', (req, res) => {
  console.log('get apps');
  getAppFiles(files => {
    let apps = new Set();
    files.forEach(file => {
      if (file.endsWith('.png') || file.endsWith('.xml')) {
        const name = file.split('.')[0];
        apps.add(name);
      }
    });
    const items = [...apps].map(item => {
      return {
        name: item,
        img_source: `/apps/${item}.png`,
        xml_source: `${item}.xml`
      };
    });
    res.json(items);
  });
});

app.get('/api/getButtons/:filename', (req, res) => {
  console.log('get filename request');
  parseXMLFile(req.params.filename, jsonObj => {
    res.json(jsonObj);
  });
});

app.post('/api/generateButtons', (req, res) => {
  console.log('get button generation request');
  // const { userId, inputType, targetNums, targetSize, targetSpacing } = req.body;
  const { targetNums, conditions } = userInfo;
  if (conditions.length !== 0) {
    const { targetSize, targetSpacing } = conditions[0];
    console.log(`condition: ${targetSize} ${targetSpacing}`);
    utils.generateButtons(targetNums, targetSize, targetSpacing, btns => res.json(btns));
  } else {
    res.json([]);
  }
});

app.post('/api/log', (req, res) => {
  const { startTime, targetId, selectId, timeStamp } = req.body;
  const msg = `${timeStamp},\t${targetId},\t${selectId},\t${startTime}\n`;
  fs.appendFile(userInfo.log_file_path, msg, err => {
    if (err) console.error(err);
    console.log(`log: ${timeStamp}\t${targetId}\t${selectId}\t${startTime}\n`);
    updateTrialNums((changeCondition, completedNum, totalTrialNum) => {
      res.json({
        change: changeCondition,
        completedNum,
        totalTrialNum
      });
    });
  });
});

app.post('/api/study/multiple', (req, res) => {
  console.log('get new serial study request');
  const { userId, inputType, targetNums, trialNums, selectedItems } = req.body;
  const time = new Date(Date.now()).toLocaleString();
  const dirPath = `${__dirname}/study/${userId}`;
  const fpath = `${dirPath}/info_${inputType}.json`;
  //const logPath = `${dirPath}/${userId}_${inputType}_${targetSize}x${targetSpacing}.log`;

  const conditions = selectedItems.map(item => {
    const [targetSize, targetSpacing] = item.split('-');
    return { targetSize: parseInt(targetSize), targetSpacing: parseFloat(targetSpacing) * parseInt(targetSize) };
  });
  const data = {
    userId,
    inputType,
    trialNums,
    targetNums,
    conditions,
    time,
  };
  userInfo = uf.initUserInfoWithData(data, __dirname);
  fs.access(dirPath, fs.constants.F_OK, err => {
    if (err) {
      fs.mkdir(dirPath, {}, err => {
        fs.writeFile(fpath, JSON.stringify(data, null, 2), err => {
          if (err) throw err;
          console.log(`${fpath} has been saved.`);
        });
      });
    } else {
      fs.writeFile(fpath, JSON.stringify(data, null, 2), err => {
        if (err) throw err;
        console.log(`${fpath} has been saved.`);
      });
    }
    res.json(data);
  });
});

app.post('/api/study/single', (req, res) => {
  console.log('get new single study request');
  const { userId, inputType, targetNums, targetSize, targetSpacing, trialNums } = req.body;
  const time = new Date(Date.now()).toLocaleString();
  const dirPath = `${__dirname}/study/${userId}`;
  const fpath = `${dirPath}/info_${inputType}.json`;
  // const logPath = `${dirPath}/${userId}_${inputType}_${targetSize}x${targetSpacing}.log`;
  const data = {
    userId,
    inputType,
    trialNums,
    targetNums,
    conditions: [{ targetSize, targetSpacing: targetSpacing * targetSize }],
    time,
  };
  userInfo = initUserInfoWithData(data, __dirname);
  fs.access(dirPath, fs.constants.F_OK, err => {
    if (err) {
      fs.writeFile(fpath, JSON.stringify(data, null, 2), err => {
        if (err) throw err;
        console.log(`${fpath} has been saved.`);
      });
    } else {
      fs.mkdir(dirPath, {}, err => {
        fs.writeFile(fpath, JSON.stringify(data, null, 2), err => {
          if (err) throw err;
          console.log(`${fpath} has been saved.`);
        });
      });
    }
    res.json(data);
  });
});


// an api to static file
app.get('/', (req, res) => {
  res.sendFile(path.join(`${__dirname}/client/public/index.html`));
});

app.listen(port);

console.log(`App is listening on port: ${port}`);
