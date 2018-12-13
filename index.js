const express = require('express');
const path = require('path');
const fs = require('fs');
const parser = require('xml2json');
const app = express();
const port = process.env.PORT || 5000;

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


// an api to static file
app.get('/', (req, res) => {
  res.sendFile(path.join(`${__dirname}/client/public/index.html`));
});

app.listen(port);

console.log(`App is listening on port: ${port}`);
