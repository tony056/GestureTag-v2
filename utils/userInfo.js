const fs = require('fs');


const createNewLogFilePath = userInfo => {
  const { data_dir_path, userId, inputType } = userInfo;
  const now = new Date();
  const time = `${now.getMonth()}-${now.getDate()}-${now.getHours()}-${now.getMinutes()}`;
  return `${data_dir_path}/${userId}_${inputType}_${time}.csv`;
};

const initUserInfo = () => {
  let newUserInfo = {
    userId: '',
    inputType: '',
    device: '',
    abilityType: '',
    trialNums: 0,
    targetNums: [5, 5],
    targetSize: [16, 16],
    completedNum: 0,
    totalTrialNum: 0,
    log_file_path: '',
    data_dir_path: ''
  };
  return newUserInfo;
};

const updateUserInfoCondition = userInfo => {
  let newUserInfo = Object.assign({}, userInfo);
  const { conditions } = newUserInfo;
  if (conditions.length > 0) {
    newUserInfo.conditions.shift();
  }
  newUserInfo.log_file_path = createNewLogFilePath(newUserInfo);
  return newUserInfo;
};

const initUserInfoWithData = (data, dir_root) => {
  let newUserInfo = { ...data };
  newUserInfo.completedNum = 0;
  newUserInfo.totalTrialNum = data.trialNums;
  newUserInfo.data_dir_path = `${dir_root}/study/${data.userId}`;
  newUserInfo.log_file_path = createNewLogFilePath(newUserInfo);
  return newUserInfo;
};

const initUserInfoWithRealisticApp = (data, dir_root) => {
  let newUserInfo = {...data};
  newUserInfo.completedNum = 0;
  newUserInfo.totalTrialNum = data.trialNums;
  newUserInfo.data_dir_path = `${dir_root}/study/${data.userId}`;
  const { data_dir_path, userId, inputType, app } = newUserInfo;
  newUserInfo.log_file_path = `${data_dir_path}/${userId}_${app}_${inputType}.log`;
  return newUserInfo;
}

module.exports = {
  initUserInfoWithData,
  initUserInfoWithRealisticApp,
  initUserInfo,
  updateUserInfoCondition
};
