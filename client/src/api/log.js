export const logClickData = (data, cb) => {
  const { startTime, timeStamp, targetId, selectId } = data;
  const log = {
    time: timeStamp - startTime,
    error: targetId === selectId,
  };
  logData(log, cb);
};

const logData = (data, cb) => {
  fetch('/api/log', {
    method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
  })
  .then(res => res.json())
  .then(jsonRes => {
      cb(jsonRes);
  })
  .catch(err => console.error(err));
}