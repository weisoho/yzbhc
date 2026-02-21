import React, { createContext, useState, useContext, useEffect } from 'react';

// 创建应用上下文
const AppContext = createContext();

// 应用上下文提供者组件
export const AppProvider = ({ children }) => {
  // 初始化状态
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // 从localStorage加载用户信息
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const username = localStorage.getItem('username');
    
    if (isLoggedIn && username) {
      setUser({ username, isLoggedIn });
    }
  }, []);

  // 登录函数
  const login = (username, password) => {
    setLoading(true);
    
    return new Promise((resolve, reject) => {
      // 模拟API请求
      setTimeout(() => {
        if (username === 'admin' && password === '000000') {
          const userData = { username, isLoggedIn: true };
          setUser(userData);
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('username', username);
          setLoading(false);
          resolve(userData);
        } else {
          setLoading(false);
          reject(new Error('用户名或密码错误'));
        }
      }, 1000);
    });
  };

  // 登出函数
  const logout = () => {
    setUser(null);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
  };

  // 添加通知
  const addNotification = (message, type = 'info', duration = 3000) => {
    const id = Date.now();
    const notification = { id, message, type, duration };
    setNotifications(prev => [...prev, notification]);
    
    // 自动移除通知
    setTimeout(() => {
      removeNotification(id);
    }, duration);
  };

  // 移除通知
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  // 切换主题
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // 上下文值
  const contextValue = {
    user,
    theme,
    loading,
    notifications,
    login,
    logout,
    addNotification,
    removeNotification,
    toggleTheme,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// 自定义Hook，用于访问应用上下文
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext必须在AppProvider内部使用');
  }
  return context;
};
