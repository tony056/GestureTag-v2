const registerTwoChannels = (client, server) => {
  client.emit('newconnection', 'received');
  registerBrowserChannel(client, data => {
    console.log(data);
  });
  registerEyetrackerChannel(client,  data => {
    console.log(data);
    if (data === 'ready') {
      broadcastEyetrackerConnected(server);
      registerEyemovedChannel(client, (x, y) => {
        broadcastEyemoved(server, x, y);
      });
    }
  });
};

const registerBrowserChannel = (client, cb) => {
  client.on('browser', cb);
};

const registerEyetrackerChannel = (client, cb) => {
  client.on('eyetracker', cb);
};

const broadcastEyetrackerConnected = io => {
  io.emit('eyetracker-connection', 'ready');
};

const broadcastEyemoved = (io, x, y) => {
  io.emit('eyemoved', x, y);
};

const registerEyemovedChannel = (client, cb) => {
  client.on('eyemoved', cb);
}


module.exports = {
  registerTwoChannels
};
