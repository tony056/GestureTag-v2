const registerAllChannels = (client, server) => {
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
  registerTouchpadChannel(client, data => {
    console.log(data);
    broadcastTouchpadConnected(server);
    registerTouchgestureChannel(client, dir => {
      broadcastTouchGesture(server, dir);
    });
  });
};

const registerBrowserChannel = (client, cb) => {
  client.on('browser', cb);
};

const registerEyetrackerChannel = (client, cb) => {
  client.on('eyetracker', cb);
};

const registerTouchpadChannel = (client, cb) => {
  client.on('touchpad', cb);
};

const broadcastEyetrackerConnected = io => {
  io.emit('eyetracker-connection', 'eyetracker');
};

const broadcastEyemoved = (io, x, y) => {
  io.emit('eyemoved', x, y);
};

const registerEyemovedChannel = (client, cb) => {
  client.on('eyemoved', cb);
}

const registerTouchgestureChannel = (client, cb) => {
  client.on('gesture', cb);
};

const broadcastTouchpadConnected = io => {
  io.emit('touchpad-connection', 'touchpad');
};

const broadcastTouchGesture = (io, dir) => {
  io.emit('gesture', dir);
};

module.exports = {
  registerAllChannels
};
