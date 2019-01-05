import React from 'react';
import { Steps, Icon } from 'antd';
const Step = Steps.Step;

export default function GTTrialPrepModalContent({ fullscreen, inputConnected }) {
  const fullscreenStatus = fullscreen ? 'finish' : 'process';
  let inputConnectionStatus = 'wait';
  if (fullscreen) {
    inputConnectionStatus = inputConnected ? 'finish' : 'process';
  } else {
    inputConnectionStatus = 'wait';
  }

  let inputConnectionIcon = null;
  let inputConnectionDescription = '';
  switch (inputConnectionStatus) {
    case 'finish':
      inputConnectionIcon = <Icon type='api' />;
      inputConnectionDescription = 'Connected';
      break;
    case 'process':
      inputConnectionIcon = <Icon type='loading' />;
      inputConnectionDescription = 'Please open ...';
      break;
    default:
      break;
  }
  return (
    <Steps direction="vertical">
      <Step status={fullscreenStatus} icon={<Icon type={fullscreen? "desktop" : "loading"} />} title="Full Screen Mode" description={`please enable fullscreen mode.`} />
      <Step status={inputConnectionStatus} icon={inputConnectionIcon} title="Input Connection" description={inputConnectionDescription} />
    </Steps>
  );
};
