const fs = require('fs');


const createNewLogFilePath = userInfo => {
  const { data_dir_path, userId, inputType, conditions } = userInfo;
  const { targetSize, targetSpacing } = conditions[0];
  return `${data_dir_path}/${userId}_${inputType}_${targetSize}x${targetSpacing}.log`;
};

const initUserInfo = () => {
  let newUserInfo = {
    userId: '',
    inputType: '',
    trialNums: 0,
    targetNums: 5,
    conditions: [],
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

const initUserInfoWithData = ({ userId, inputType, trialNums, targetNums, conditions }, dir_root) => {
  let newUserInfo = {
    userId,
    inputType,
    trialNums,
    targetNums,
    conditions,
    completedNum: 0,
    totalTrialNum: conditions.length * trialNums,
    log_file_path: '',
    data_dir_path: `${dir_root}/study/${userId}`
  };
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
