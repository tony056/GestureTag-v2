import io from 'socket.io-client';


export function initConnection() {
  const socket = io('http://localhost:5000');
  socket.on('newconnection', data => {
    if (data === 'received') {
      socket.emit('browser', { news: 'i am the browser' });
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