/**
 * 标签页上下文模块
 * 提供标签页管理功能，包括标签页的添加、切换、关闭和重新排序
 */

import React, { createContext, useState, useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// 创建标签页上下文
const TabContext = createContext();
const TAB_EXCLUDED_PATHS = ['/login'];

/**
 * 使用标签页上下文的Hook
 * @returns {Object} 标签页上下文对象
 */
export const useTabContext = () => {
  const context = useContext(TabContext);
  if (!context) {
    throw new Error('useTabContext must be used within a TabProvider');
  }
  return context;
};

/**
 * 标签页上下文提供者组件
 * @param {Object} props - 组件属性
 * @param {React.ReactNode} props.children - 子组件
 */
export const TabProvider = ({ children }) => {
  // 获取当前路由位置
  const location = useLocation();
  // 获取导航函数
  const navigate = useNavigate();
  // 初始化状态
  const [isInitialized, setIsInitialized] = useState(false);
  
  // 标签页列表
  const [tabs, setTabs] = useState([
    { key: '/', title: '首页', path: '/' }
  ]);
  // 当前激活的标签页
  const [activeTab, setActiveTab] = useState({ key: '/', title: '首页', path: '/' });

  const isTabEnabledPath = (path) => !TAB_EXCLUDED_PATHS.includes(path);

  /**
   * 根据路径获取菜单标题
   * @param {string} path - 路径
   * @returns {string} 菜单标题
   */
  const getMenuTitle = (path) => {
    const menuTitles = {
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
      '/supplier-inspection-report': '供应商注册证',
      '/supplier-business-license': '供应商经营许可证',
      '/supplier-business-certificate': '供应商营业执照',
      '/supplier-qualification-warning': '资质预警',
      '/product-catalog': '物资字典',
      '/product-price-adjustment': '物资调价',
      '/warehouse-maintenance': '仓库维护',
      '/user-account-creation': '用户账户创建',
      '/user-role-template': '角色模板',
      '/user-permission-settings': '权限设置',
      '/user-account-management': '用户账户管理',
      '/department-management': '部门管理',
      '/campus-management': '分院管理',
      '/purchase-order-request': '采购计划申请',
      '/purchase-order-approval': '采购审核',
      '/purchase-order-query': '采购订单查询',
      '/purchase-order-acceptance': '采购入库',
      '/purchase-receipt': '采购收货',
      '/manual-stock-in': '初始化入库',
      '/abnormal-order-management': '异常订单管理',
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
      '/consumables-rejection-record': '耗材验收拒收记录',
      '/consumables-quality-issue': '耗材质量问题记录',
      '/medical-device-adverse-event': '异常事件记录',
      '/instrument-maintenance-record': '仪器维修记录',
      '/operation-log': '操作日志',
      '/stock-in-accept': '采购入库',
      '/transfer-acceptance': '调拨验收入库',
      '/stock-in-detail': '入库单查询',
    };
    
    return menuTitles[path] || path.split('/').pop() || '未知页面';
  };

  /**
   * 监听路由变化，自动添加标签页
   */
  useEffect(() => {
    if (!isInitialized) return;
    
    const currentPath = location.pathname;
    if (!isTabEnabledPath(currentPath)) {
      return;
    }

    const title = getMenuTitle(currentPath);
    
    if (currentPath === '/') {
      setActiveTab({ key: '/', title: '首页', path: '/' });
      return;
    }

    // 使用函数式更新来避免依赖 tabs
    setTabs(prevTabs => {
      const existingTab = prevTabs.find(tab => tab.key === currentPath);
      
      if (existingTab) {
        setActiveTab(existingTab);
        return prevTabs;
      } else {
        const newTab = { key: currentPath, title, path: currentPath };
        const updatedTabs = [...prevTabs, newTab];
        setActiveTab(newTab);
        return updatedTabs;
      }
    });
  }, [location.pathname, isInitialized]);

  /**
   * 初始化标签页
   */
  useEffect(() => {
    if (isInitialized) return;

    if (!isTabEnabledPath(location.pathname)) {
      setTabs([{ key: '/', title: '首页', path: '/' }]);
      setActiveTab({ key: '/', title: '首页', path: '/' });
      setIsInitialized(true);
      return;
    }
    
    setTabs([{ key: '/', title: '首页', path: '/' }]);
    setActiveTab({ key: '/', title: '首页', path: '/' });
    setIsInitialized(true);
    
    // 只有在无效路由时才导航到首页
    if (location.pathname !== '/' && !getMenuTitle(location.pathname).includes('未知页面')) {
      // 如果当前路由有效，保持当前路由
      const title = getMenuTitle(location.pathname);
      const newTab = { key: location.pathname, title, path: location.pathname };
      setTabs([{ key: '/', title: '首页', path: '/' }, newTab]);
      setActiveTab(newTab);
    } else if (location.pathname !== '/') {
      navigate('/');
    }
  }, [isInitialized, location.pathname, navigate]);

  /**
   * 处理标签页点击
   * @param {Object} tab - 点击的标签页
   */
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    navigate(tab.path);
  };

  /**
   * 处理标签页关闭
   * @param {Object} tabToClose - 要关闭的标签页
   */
  const handleTabClose = (tabToClose) => {
    // 不能关闭唯一的标签页或首页标签
    if (tabs.length <= 1 || tabToClose.key === '/') {
      return;
    }

    // 过滤掉要关闭的标签页
    const newTabs = tabs.filter(tab => tab.key !== tabToClose.key);
    setTabs(newTabs);

    // 如果关闭的是当前激活的标签页，激活最后一个标签页
    if (activeTab.key === tabToClose.key) {
      const nextTab = newTabs[newTabs.length - 1];
      setActiveTab(nextTab);
      navigate(nextTab.path);
    }
  };

  /**
   * 批量关闭标签页
   * @param {string} action - 关闭动作
   * @param {Object} referenceTab - 参考标签页
   */
  const handleCloseTabs = (action, referenceTab) => {
    const homeTab = tabs.find((tab) => tab.key === '/') || { key: '/', title: '首页', path: '/' };
    const referenceIndex = tabs.findIndex((tab) => tab.key === referenceTab?.key);

    let newTabs = tabs;
    if (action === 'all') {
      newTabs = [homeTab];
    } else if (referenceIndex !== -1) {
      if (action === 'left') {
        newTabs = tabs.filter((tab, index) => tab.key === '/' || index >= referenceIndex);
      } else if (action === 'right') {
        newTabs = tabs.filter((tab, index) => tab.key === '/' || index <= referenceIndex);
      } else if (action === 'others') {
        newTabs = tabs.filter((tab) => tab.key === '/' || tab.key === referenceTab.key);
      } else if (action === 'current') {
        if (referenceTab.key === '/') {
          return;
        }
        newTabs = tabs.filter((tab) => tab.key !== referenceTab.key);
      }
    }

    if (!newTabs.length) {
      newTabs = [homeTab];
    }

    setTabs(newTabs);

    const activeStillExists = newTabs.some((tab) => tab.key === activeTab.key);
    if (activeStillExists) {
      return;
    }

    const nextTab = newTabs.find((tab) => tab.key === referenceTab?.key) || newTabs[newTabs.length - 1] || homeTab;
    setActiveTab(nextTab);
    navigate(nextTab.path);
  };

  /**
   * 处理标签页重新排序
   * @param {Array} newTabs - 重新排序后的标签页列表
   */
  const handleTabsReorder = (newTabs) => {
    // 确保首页标签始终在第一位
    const homeTab = newTabs.find(tab => tab.key === '/');
    const otherTabs = newTabs.filter(tab => tab.key !== '/');
    
    // 重新排序：首页 + 其他标签（保持新顺序）
    const reorderedTabs = homeTab ? [homeTab, ...otherTabs] : newTabs;
    setTabs(reorderedTabs);
  };

  // 上下文值
  const value = {
    tabs,
    activeTab,
    handleTabClick,
    handleTabClose,
    handleCloseTabs,
    handleTabsReorder,
  };

  /**
   * 渲染标签页上下文提供者
   */
  return (
    <TabContext.Provider value={value}>
      {children}
    </TabContext.Provider>
  );
};
