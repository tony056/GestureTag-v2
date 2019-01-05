import React from 'react';
import { Progress } from 'antd';

export default function GTTrialModal({ completedNum, totalTrialNum }) {
  const progress = Math.round(completedNum / totalTrialNum * 100);
  return (
    <div>
      <p>You just finished {completedNum} trials.</p>
      <Progress percent={progress} format={() => `${completedNum}/${totalTrialNum}`} />
    </div>
  );
}
