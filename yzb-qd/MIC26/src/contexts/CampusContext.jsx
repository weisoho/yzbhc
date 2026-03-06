/**
 * 院区上下文模块
 * 提供院区状态管理功能，包括院区选择、切换和状态持久化
 */

import React, { createContext, useState, useContext, useEffect } from 'react';

// 创建院区上下文
const CampusContext = createContext();

/**
 * 使用院区上下文的Hook
 * @returns {Object} 院区上下文对象
 */
export const useCampusContext = () => {
  const context = useContext(CampusContext);
  if (!context) {
    throw new Error('useCampusContext must be used within a CampusProvider');
  }
  return context;
};

/**
 * 院区上下文提供者组件
 * @param {Object} props - 组件属性
 * @param {React.ReactNode} props.children - 子组件
 */
export const CampusProvider = ({ children }) => {
  // 院区列表
  const campuses = [
    { id: 1, name: '白云总院', description: '总部所在地，主要管理部门' },
    { id: 2, name: '天河分院', description: '天河区主要分院，设备先进' },
    { id: 3, name: '越秀分院', description: '越秀区老牌分院，历史悠久' },
    { id: 4, name: '北京分院', description: '北京地区分院，规模较大' },
    { id: 5, name: '湛江分院', description: '湛江地区分院，服务粤西' },
  ];

  // 从localStorage读取当前院区，如果不存在则使用默认值'白云总院'
  const [currentCampus, setCurrentCampus] = useState(() => {
    const savedCampus = localStorage.getItem('currentCampus');
    return savedCampus || '白云总院';
  });

  // 院区选择模态框可见状态
  const [isCampusModalVisible, setIsCampusModalVisible] = useState(false);

  // 是否已选择院区（用于登录后首次选择）
  const [hasSelectedCampus, setHasSelectedCampus] = useState(() => {
    const saved = localStorage.getItem('hasSelectedCampus');
    return saved === 'true';
  });

  /**
   * 选择院区
   * @param {string} campusName - 院区名称
   */
  const selectCampus = (campusName) => {
    setCurrentCampus(campusName);
    setHasSelectedCampus(true);
    localStorage.setItem('currentCampus', campusName);
    localStorage.setItem('hasSelectedCampus', 'true');
    setIsCampusModalVisible(false);
  };

  /**
   * 显示院区选择模态框
   */
  const showCampusModal = () => {
    setIsCampusModalVisible(true);
  };

  /**
   * 隐藏院区选择模态框
   */
  const hideCampusModal = () => {
    setIsCampusModalVisible(false);
  };

  /**
   * 检查是否需要显示院区选择（登录后首次）
   */
  const checkNeedCampusSelection = () => {
    return !hasSelectedCampus;
  };

  /**
   * 强制显示院区选择（用于登录后）
   */
  const forceShowCampusSelection = () => {
    setHasSelectedCampus(false);
    localStorage.removeItem('hasSelectedCampus');
    setIsCampusModalVisible(true);
  };

  // 监听登录状态变化
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn && !hasSelectedCampus) {
      setIsCampusModalVisible(true);
    }
  }, [hasSelectedCampus]);

  // 上下文值
  const contextValue = {
    campuses,
    currentCampus,
    selectCampus,
    isCampusModalVisible,
    showCampusModal,
    hideCampusModal,
    hasSelectedCampus,
    checkNeedCampusSelection,
    forceShowCampusSelection,
  };

  return (
    <CampusContext.Provider value={contextValue}>
      {children}
    </CampusContext.Provider>
  );
};