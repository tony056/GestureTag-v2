export const logClickData = (data, rounded, cb) => {
  const { startTime, timeStamp, targetId, selectId, targetButton, buttons, areaOfWindow } = data;
  const scale = rounded ? Math.PI : 1;
  const reducer = (acc, current) => acc + (rounded ? scale * Math.pow(current.w / 2, 2) : scale * current.w * current.h);
  const areaOfTargets = buttons.reduce(reducer, rounded ? scale * Math.pow(targetButton.w / 2, 2) : targetButton.w * targetButton.h * scale);
  const log = {
    time: timeStamp - startTime,
    error: targetId === selectId ? 0 : 1,
    targetSize: rounded ? targetButton.w : `${targetButton.w}x${targetButton.h}`,
    areaOfWindow,
    areaOfTargets,
    targetNum: buttons.length + 1 
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