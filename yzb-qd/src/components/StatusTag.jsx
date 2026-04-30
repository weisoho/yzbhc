import React from 'react';
import { Tag } from 'antd';
import { getStatusConfig } from '../utils/common.js';

const StatusTag = ({ statusType, status, text }) => {
  const config = getStatusConfig(statusType, status);
  
  return (
    <Tag color={config.color}>
      {text || config.text}
    </Tag>
  );
};

export default StatusTag;
