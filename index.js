const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

// serve the static file from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// an api to static file
app.get('/', (req, res) => {
  res.sendFile(path.join(`${__dirname}/client/build/index.html`));
});

app.listen(port);

console.log(`App is listening on port: ${port}`);
