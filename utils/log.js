const CSV = require('csv-string');

const logClickWithUserInfo = (clickData, userInfo) => {
  const { time, error } = clickData;
  const { 
    userId, 
    targetNum, 
    inputType, 
    targetSize, 
    device, 
    abilityType, 
    areaOfTargets, 
    areaOfWindow,
    completedNum 
  } = userInfo;
  const density = areaOfTargets / areaOfWindow;
  const log = [userId, abilityType, device, inputType, completedNum, targetSize, targetNum, density, time, error];
  return CSV.stringify(log);
};


module.exports = {
  logClickWithUserInfo
}