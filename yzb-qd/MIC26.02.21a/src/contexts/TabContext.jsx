import React, { createContext, useState, useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const TabContext = createContext();

export const useTabContext = () => {
  const context = useContext(TabContext);
  if (!context) {
    throw new Error('useTabContext must be used within a TabProvider');
  }
  return context;
};

export const TabProvider = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isInitialized, setIsInitialized] = useState(false);
  
  const [tabs, setTabs] = useState([
    { key: '/', title: '首页', path: '/' }
  ]);
  const [activeTab, setActiveTab] = useState({ key: '/', title: '首页', path: '/' });

  const getMenuTitle = (path) => {
    const menuTitles = {
      '/': '首页',
      '/inventory-detail': '物资库存',
      '/inventory-transfer': '物资调拨',
      '/inventory-shelf': '物资库位维护',
      '/inventory-location': '物资库位调整',
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
      '/user-role-template': '角色模板',
      '/user-permission-settings': '权限设置',
      '/user-account-management': '用户账户管理',
      '/department-management': '部门管理',
      '/purchase-order-request': '采购申请单',
      '/purchase-order-approval': '采购单审批',
      '/purchase-order-query': '采购单查询',
      '/purchase-order-records': '采购记录',
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
      '/sample-project-management': '新增项目管理',
      '/consumables-rejection-record': '耗材验收拒收记录',
      '/consumables-quality-issue': '耗材质量问题记录',
      '/medical-device-adverse-event': '异常事件记录',
      '/operation-log': '操作日志',
      '/stock-in-accept': '采购入库',
      '/transfer-acceptance': '调拨验收入库',
      '/stock-in-detail': '入库单查询',
    };
    
    return menuTitles[path] || path.split('/').pop() || '未知页面';
  };

  useEffect(() => {
    if (!isInitialized) return;
    
    const currentPath = location.pathname;
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

  // Initialize tabs on first load
  useEffect(() => {
    if (isInitialized) return;
    
    setTabs([{ key: '/', title: '首页', path: '/' }]);
    setActiveTab({ key: '/', title: '首页', path: '/' });
    setIsInitialized(true);
    
    // Only navigate to home if we're on an invalid route
    if (location.pathname !== '/' && !getMenuTitle(location.pathname).includes('未知页面')) {
      // Keep current route if it's valid
      const title = getMenuTitle(location.pathname);
      const newTab = { key: location.pathname, title, path: location.pathname };
      setTabs([{ key: '/', title: '首页', path: '/' }, newTab]);
      setActiveTab(newTab);
    } else if (location.pathname !== '/') {
      navigate('/');
    }
  }, [isInitialized, location.pathname, navigate]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    navigate(tab.path);
  };

  const handleTabClose = (tabToClose) => {
    if (tabs.length <= 1 || tabToClose.key === '/') {
      return;
    }

    const newTabs = tabs.filter(tab => tab.key !== tabToClose.key);
    setTabs(newTabs);

    if (activeTab.key === tabToClose.key) {
      const nextTab = newTabs[newTabs.length - 1];
      setActiveTab(nextTab);
      navigate(nextTab.path);
    }
  };

  const handleTabsReorder = (newTabs) => {
    // 确保首页标签始终在第一位
    const homeTab = newTabs.find(tab => tab.key === '/');
    const otherTabs = newTabs.filter(tab => tab.key !== '/');
    
    // 重新排序：首页 + 其他标签（保持新顺序）
    const reorderedTabs = homeTab ? [homeTab, ...otherTabs] : newTabs;
    setTabs(reorderedTabs);
  };

  const value = {
    tabs,
    activeTab,
    handleTabClick,
    handleTabClose,
    handleTabsReorder,
  };

  return (
    <TabContext.Provider value={value}>
      {children}
    </TabContext.Provider>
  );
};