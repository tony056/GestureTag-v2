const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const parser = require('xml2json');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 5000;
const utils = require('./utils/buttonGeneration');
const uf = require('./utils/userInfo');
const connection = require('./utils/connection');
const LOG = require('./utils/log');

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

let staticButtons = [];

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

const createUserDir = (dirPath, fpath, data, res) => {
  fs.access(dirPath, fs.constants.F_OK, err => {
    if (err) {
      fs.mkdir(dirPath, {}, err => {
        fs.writeFile(fpath, JSON.stringify(data, null, 2), err => {
          if (err) throw err;
          console.log(`${fpath} has been saved. dir created`);
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
    staticButtons = utils.convertBtnLabelsToButtons(jsonObj);
    res.json(staticButtons);
  });
});

app.get('/api/getTarget', (req, res) => {
  console.log('get a new target');
  if (staticButtons && staticButtons.length > 0) {
    res.json(utils.chooseTargetRandomly(staticButtons));
  }
});

app.get('/api/generateButtons', (req, res) => {
  console.log('get button generation request');
  const { targetNums, targetSize } = userInfo;
  utils.generateButtons(targetNums, targetSize, (target, btns) => res.json({ target, buttons: btns }));
});

app.post('/api/log', (req, res) => {
  // subjectId, abilityType, device, technique, trial, targetSize, #oftargets, target_density, time, error
  const prefix = userInfo.completedNum === 0 ? LOG.logDataEntry() : '';
  const msg = prefix + LOG.logClickWithUserInfo(req.body, userInfo);
  fs.appendFile(userInfo.log_file_path, msg, err => {
    if (err) console.error(err);
    console.log(`${msg}`);
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
  const fpath = `${dirPath}/info_${inputType}_multiple_abstract.json`;
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
  createUserDir(dirPath, fpath, data, res);
});

app.post('/api/study/single', (req, res) => {
  console.log('get new single study request');
  const { userId, inputType } = req.body;
  const time = new Date(Date.now()).toLocaleString();
  const dirPath = `${__dirname}/study/${userId}`;
  const fpath = `${dirPath}/info_${inputType}_single_abstract.json`;
  const data = Object.assign({}, req.body);
  userInfo = uf.initUserInfoWithData(data, __dirname);
  createUserDir(dirPath, fpath, Object.assign({time}, data), res);
});

app.post('/api/study/realistic', (req, res) => {
  console.log('get new realistic app request');
  const { userId, inputType, trialNums, app } = req.body;
  const time = new Date(Date.now()).toLocaleString();
  const dirPath = `${__dirname}/study/${userId}`;
  const fpath = `${dirPath}/info_${inputType}_${app}.json`;
  const data = Object.assign({ time }, req.body);
  // init user info state
  userInfo = uf.initUserInfoWithRealisticApp(data, __dirname);
  createUserDir(dirPath, fpath, data, res);
});


// an api to static file
app.get('/', (req, res) => {
  res.sendFile(path.join(`${__dirname}/client/public/index.html`));
});

http.listen(port);

// socket io part
io.on('connection', socketClient => {
  console.log(`a client connected: ${socketClient.id}`);
  // register browser, touchpad, and eyetracker
  connection.registerAllChannels(socketClient, io);
});

console.log(`App is listening on port: ${port}`);
