import { message, notification } from 'antd';

// 通知组件，用于显示系统通知和消息

// 基础消息
const showMessage = (type, content, duration = 3) => {
  message[type]({
    content,
    duration,
    style: {
      borderRadius: 8,
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
    },
  });
};

// 成功消息
export const successMessage = (content, duration = 3) => {
  showMessage('success', content, duration);
};

// 错误消息
export const errorMessage = (content, duration = 3) => {
  showMessage('error', content, duration);
};

// 警告消息
export const warningMessage = (content, duration = 3) => {
  showMessage('warning', content, duration);
};

// 信息消息
export const infoMessage = (content, duration = 3) => {
  showMessage('info', content, duration);
};

// 确认对话框组件
export const ConfirmDialog = ({ title, content, onOk, onCancel, okText = '确定', cancelText = '取消' }) => {
  return notification.confirm({
    message: title,
    description: content,
    buttons: [
      {
        key: 'cancel',
        text: cancelText,
        onClick: () => onCancel?.(),
      },
      {
        key: 'confirm',
        text: okText,
        type: 'primary',
        danger: true,
        onClick: () => onOk?.(),
      },
    ],
    style: {
      borderRadius: 8,
    },
  });
};

// 通知提示组件
export const Notification = ({ type = 'info', title, message, duration = 4.5 }) => {
  return notification[type]({
    message: title,
    description: message,
    duration,
    style: {
      borderRadius: 8,
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
    },
  });
};

// 全局通知管理器
export const NotificationManager = {
  success: (title, message, duration = 4.5) => {
    Notification({ type: 'success', title, message, duration });
  },
  error: (title, message, duration = 4.5) => {
    Notification({ type: 'error', title, message, duration });
  },
  warning: (title, message, duration = 4.5) => {
    Notification({ type: 'warning', title, message, duration });
  },
  info: (title, message, duration = 4.5) => {
    Notification({ type: 'info', title, message, duration });
  },
  confirm: ConfirmDialog,
};

export default NotificationManager;
