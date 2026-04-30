import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { getNoteByPage, saveNote } from '../utils/noteStorage.js';

const NoteContext = createContext();

export const useNoteContext = () => {
  const context = useContext(NoteContext);
  if (!context) {
    throw new Error('useNoteContext must be used within a NoteProvider');
  }
  return context;
};

export const NoteProvider = ({ children }) => {
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState({
    path: '/',
    title: '首页'
  });
  const [noteContent, setNoteContent] = useState('');
  
  const [isNoteWindowVisible, setIsNoteWindowVisible] = useState(() => {
    const savedVisibility = localStorage.getItem('noteWindowVisibility');
    return savedVisibility === 'true';
  });

  // 页面路径到标题的映射
  const pageTitles = {
    '/': '首页',
    '/inventory-detail': '物资库存',
    '/inventory-transfer': '物资调拨',

    '/inventory-expiry': '效期管理',
    '/stock-out-consumption': '消耗出库',
    '/stock-out-detail': '出库明细',
    '/stock-out-stats': '出库统计',
    '/stock-out-consumption-undo': '消耗撤销',
    '/inventory-check-generate': '盘点生成',
    '/inventory-check-detail': '盘点明细',
    '/inventory-check-diff': '盘点差异',
    '/reports-stock-in-detail': '入库明细报表',
    '/reports-stock-in-summary': '入库汇总报表',
    '/reports-consumption-detail': '消耗明细报表',
    '/reports-consumption-summary': '消耗汇总报表',
    '/reports-loss-summary': '损耗汇总报表',
    '/supplier-maintenance': '供应商管理',
    '/supplier-inspection-report': '供应商考察报告',
    '/supplier-business-license': '供应商营业执照',
    '/supplier-business-certificate': '供应商经营许可证',
    '/supplier-qualification-warning': '资质预警',
    '/product-catalog': '物资字典',
    '/product-price-adjustment': '物资调价',
    '/warehouse-maintenance': '仓库维护',
    '/user-account-creation': '用户账户创建',
    '/user-permission-settings': '权限设置',
    '/user-account-management': '用户账户管理',
    '/department-management': '部门管理',
    '/purchase-order-request': '采购申请单',
    '/purchase-order-approval': '采购审核',
    '/purchase-order-query': '采购订单查询',
    '/purchase-order-acceptance': '采购入库',
    '/purchase-receipt': '采购收货',
    '/fixed-assets-dictionary': '资产字典维护',
    '/fixed-assets-add': '资产新增',
    '/fixed-assets-detail-query': '资产明细查询',
    '/fixed-assets-scrap': '资产报废',
    '/fixed-assets-scrap-detail': '资产清理明细',
    '/fixed-assets-change-audit': '资产变更审核',
    '/fixed-assets-transfer': '固定资产调拨',
    '/fixed-assets-warning': '固定资产预警',
    '/fixed-assets-maintenance-record': '资产维修记录',
    '/sample-quantity-management': '样本量管理',
    '/sample-project-management': '项目字典',
    '/consumables-quality-issue': '耗材质量问题记录',
    '/medical-device-adverse-event': '异常事件记录',
    '/operation-log': '操作日志',
    '/stock-in-accept': '采购入库',
    '/transfer-acceptance': '调拨验收入库',
    '/stock-in-detail': '入库单查询',
    '/inventory-adjust': '库存调整',
    '/inventory': '库存管理'
  };

  // 获取页面标题
  const getPageTitle = useCallback((path) => {
    return pageTitles[path] || path.split('/').pop() || '未知页面';
  }, []);

  // 页面切换时加载对应备注
  useEffect(() => {
    const path = location.pathname;
    const title = getPageTitle(path);
    
    setCurrentPage({ path, title });
    
    // 加载该页面的备注
    const note = getNoteByPage(path);
    setNoteContent(note?.content || '');
    

  }, [location.pathname, getPageTitle]);



  // 保存当前备注
  const saveCurrentNote = useCallback(() => {
    if (!currentPage.path || !currentPage.title) return false;
    
    return saveNote(currentPage.path, currentPage.title, noteContent);
  }, [currentPage, noteContent]);

  // 更新备注内容
  const updateNoteContent = useCallback((content) => {
    setNoteContent(content);
  }, []);

  // 切换窗口可见性
  const toggleNoteWindow = useCallback(() => {
    const newVisibility = !isNoteWindowVisible;
    setIsNoteWindowVisible(newVisibility);
    localStorage.setItem('noteWindowVisibility', String(newVisibility));
  }, [isNoteWindowVisible]);

  // 清空当前备注
  const clearCurrentNote = useCallback(() => {
    setNoteContent('');
  }, []);

  // 获取当前页面信息
  const getCurrentPageInfo = useCallback(() => {
    return currentPage;
  }, [currentPage]);

  // 获取所有页面的备注统计
  const getNoteStatistics = useCallback(() => {
    const allNotes = JSON.parse(localStorage.getItem('floating_notes_data') || '{}');
    const pagesWithNotes = Object.keys(allNotes).length;
    const totalCharacters = Object.values(allNotes).reduce((sum, note) => sum + (note.content?.length || 0), 0);
    
    return {
      totalPages: Object.keys(pageTitles).length,
      pagesWithNotes,
      totalCharacters
    };
  }, [pageTitles]);

  const value = {
    currentPage,
    noteContent,
    isNoteWindowVisible,
    updateNoteContent,
    toggleNoteWindow,
    saveCurrentNote,
    clearCurrentNote,
    getCurrentPageInfo,
    getNoteStatistics,
    getPageTitle
  };

  return (
    <NoteContext.Provider value={value}>
      {children}
    </NoteContext.Provider>
  );
};