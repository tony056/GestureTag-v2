import io from 'socket.io-client';


export function initConnection(url, msgSource) {
  console.log(`connection init: ${msgSource}`);
  const socket = io(url);
  socket.on('newconnection', data => {
    if (data === 'received') {
      socket.emit(msgSource, { news: `i am the ${msgSource}` });
    }
  });
  return socket;
};

export function subscribeEyetrackerConnection(socket, cb) {
  socket.on('eyetracker-connection', cb);
};

export function subsribeEyemovedEvent(socket, cb) {
  socket.on('eyemoved', cb);
}

export function subscribeTouchpadConnection(socket, cb) {
  socket.on('touchpad-connection', cb);
}

export function subscribeTouchGestureEvent(socket, cb) {
  socket.on('gesture', cb);
}