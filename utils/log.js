const CSV = require('csv-string');

const logClickWithUserInfo = (clickData, userInfo) => {
  const { time, error, targetSize, targetNum, areaOfTargets, areaOfWindow } = clickData;
  const { 
    userId,  
    inputType, 
    device, 
    abilityType, 
    completedNum 
  } = userInfo;
  const density = areaOfTargets / areaOfWindow;
  const log = [userId, abilityType, device, inputType, completedNum, targetSize, targetNum, density.toFixed(4), time, error];
  return CSV.stringify(log);
};


const logDataEntry = () => {
  const entry = ["Subject", "Ability", "Device", "Technique", "Trial", "Target_Size", "Num_Total_Targets", "Target_Density", "Time", "Error"];
  return CSV.stringify(entry);
};

module.exports = {
  logClickWithUserInfo,
  logDataEntry
}