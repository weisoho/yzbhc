/**
 * 应用主组件
 * 负责整体布局、路由配置、菜单管理和用户状态管理
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Layout, Menu, ConfigProvider, Avatar, Modal, Radio } from 'antd';
import { Link, Route, Routes, useLocation, Navigate, useNavigate } from 'react-router-dom';
import zhCN from 'antd/locale/zh_CN';

// 导入组件
import AppWithTabs from './components/AppWithTabs.jsx';
import GlobalNoteWindow from './components/GlobalNoteWindow.jsx';
import CampusSelectorModal from './components/CampusSelectorModal.jsx';

// 导入上下文
import { TabProvider } from './contexts/TabContext.jsx';
import { NoteProvider } from './contexts/NoteContext.jsx';
import { useCampusContext } from './contexts/CampusContext.jsx';

// 导入页面组件
import Home from './pages/Home.jsx';
import StockInAccept from './pages/StockInAccept.jsx';
import TransferAcceptance from './pages/TransferAcceptance.jsx';
import StockInDetail from './pages/StockInDetail.jsx';
import InventoryDetail from './pages/InventoryDetail.jsx';
import InventoryAdjust from './pages/InventoryAdjust.jsx';
import InventoryTransfer from './pages/InventoryTransfer.jsx';

import InventoryExpiry from './pages/InventoryExpiry.jsx';
import StockOutConsumption from './pages/StockOutConsumption.jsx';
import StockOutDetail from './pages/StockOutDetail.jsx';
import StockOutStats from './pages/StockOutStats.jsx';
import StockOutConsumptionUndo from './pages/StockOutConsumptionUndo.jsx';
import InventoryCheckGenerate from './pages/InventoryCheckGenerate.jsx';
import InventoryCheckDetail from './pages/InventoryCheckDetail.jsx';
import InventoryCheckDiff from './pages/InventoryCheckDiff.jsx';
import ReportsStockInDetail from './pages/ReportsStockInDetail.jsx';
import ReportsStockInSummary from './pages/ReportsStockInSummary.jsx';
import ReportsConsumptionDetail from './pages/ReportsConsumptionDetail.jsx';
import ReportsConsumptionSummary from './pages/ReportsConsumptionSummary.jsx';
import ReportsLossSummary from './pages/ReportsLossSummary.jsx';
import SupplierMaintenance from './pages/SupplierMaintenance.jsx';
import SupplierInspectionReport from './pages/SupplierInspectionReport.jsx';
import SupplierBusinessLicense from './pages/SupplierBusinessLicense.jsx';
import SupplierBusinessCertificate from './pages/SupplierBusinessCertificate.jsx';
import SupplierQualificationWarning from './pages/SupplierQualificationWarning.jsx';
import ProductCatalog from './pages/ProductCatalog.jsx';
import ProductPriceAdjustment from './pages/ProductPriceAdjustment.jsx';
import UDIMaintenance from './pages/UDIMaintenance.jsx';
import UserRoleTemplate from './pages/UserAccountCreation.jsx';
import UserPermissionSettings from './pages/UserPermissionSettings.jsx';
import UserAccountManagement from './pages/UserAccountManagement.jsx';
import DepartmentManagement from './pages/DepartmentManagement.jsx';
import CampusManagement from './pages/CampusManagement.jsx';
import PurchaseOrderRequest from './pages/PurchaseOrderRequest.jsx';
import PurchaseOrderApproval from './pages/PurchaseOrderApproval.jsx';
import PurchaseOrderQuery from './pages/PurchaseOrderQuery.jsx';
import PurchaseOrderAcceptance from './pages/PurchaseOrderAcceptance.jsx';
import ManualStockIn from './pages/ManualStockIn.jsx';
import PurchaseReceipt from './pages/PurchaseReceipt.jsx';
import AbnormalOrderManagement from './pages/AbnormalOrderManagement.jsx';
import OperationLog from './pages/OperationLog.jsx';
import ConsumablesQualityIssueRecord from './pages/ConsumablesQualityIssueRecord.jsx';
import MedicalDeviceAdverseEvent from './pages/MedicalDeviceAdverseEvent.jsx';
import InstrumentMaintenanceRecord from './pages/InstrumentMaintenanceRecord.jsx';
import MaintenanceRecord from './pages/MaintenanceRecord.jsx';
import FixedAssetsDictionary from './pages/FixedAssetsDictionary.jsx';
import FixedAssetsAdd from './pages/FixedAssetsAdd.jsx';
import FixedAssetsDetailQuery from './pages/FixedAssetsDetailQuery.jsx';
import FixedAssetsScrap from './pages/FixedAssetsScrap.jsx';
import FixedAssetsScrapDetail from './pages/FixedAssetsScrapDetail.jsx';
import FixedAssetsChangeAudit from './pages/FixedAssetsChangeAudit.jsx';
import FixedAssetsTransfer from './pages/FixedAssetsTransfer.jsx';
import FixedAssetsWarning from './pages/FixedAssetsWarning.jsx';
import FixedAssetsMaintenanceRecord from './pages/FixedAssetsMaintenanceRecord.jsx';
import SampleQuantityManagement from './pages/SampleQuantityManagement.jsx';
import SampleProjectManagement from './pages/SampleProjectManagement.jsx';
import Login from './pages/Login.jsx';
import api from './utils/api.js';

// 导入图标
import {
  DashboardOutlined,
  InboxOutlined,
  DatabaseOutlined,
  UnorderedListOutlined,
  FileTextOutlined,
  BarChartOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
  ShoppingOutlined,
  ClockCircleOutlined,
  DesktopOutlined,
  WarningOutlined,
  TeamOutlined,
  ControlOutlined,
  ImportOutlined,
  HomeOutlined,
  ExportOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined
} from '@ant-design/icons';

const { Header, Content, Sider } = Layout;

/**
 * 应用内容组件
 */
const AppContent = () => {
  const navigate = useNavigate();
  
  // 使用院区上下文
  const {
    campuses,
    currentCampus,
    currentCampusNode,
    currentDepartment,
    departmentOptions,
    selectCampus,
    selectDepartment,
    isCampusModalVisible,
    showCampusModal,
    hideCampusModal
  } = useCampusContext();
  
  // 侧边栏折叠状态
  const [collapsed, setCollapsed] = useState(false);
  const [backendMenuItems, setBackendMenuItems] = useState([]);
  const [backendMenuLoaded, setBackendMenuLoaded] = useState(false);
  const [allowedRoutePaths, setAllowedRoutePaths] = useState([]);
  
  // 科室选择模态框可见状态
  const [isDepartmentModalVisible, setIsDepartmentModalVisible] = useState(false);

  const currentDepartmentLabel = currentDepartment?.deptName || currentDepartment?.name || '未选择科室';
  const currentUserName = (() => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      return userInfo.realName || userInfo.name || userInfo.userName || '管理员';
    } catch {
      return '管理员';
    }
  })();
  
  // 获取当前路由位置
  const location = useLocation();
  
  // 检查用户是否已登录
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  /**
   * 主题配置
   * 定义应用的全局样式变量
   */
  const themeConfig = {
    token: {
      colorPrimary: '#667eea',
      colorPrimaryHover: '#5a6fd8',
      colorPrimaryActive: '#4e62c9',
      borderRadius: 8,
      borderRadiusLG: 12,
      borderRadiusSM: 4,
      colorBgContainer: '#ffffff',
      colorBgLayout: '#f8f9fa',
      colorBgElevated: '#ffffff',
      colorTextSecondary: '#8c8c8c',
      colorTextTertiary: '#bfbfbf',
      colorBorder: '#e8e8e8',
      colorBorderSecondary: '#f0f0f0',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
      boxShadowSecondary: '0 4px 16px rgba(0, 0, 0, 0.12)',
      fontSize: 14,
      fontSizeLG: 16,
      fontSizeSM: 12,
      lineHeight: 1.6,
    },
  };
  
  /**
   * 退出登录处理
   * 清除登录状态并跳转到登录页面
   */
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('username');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentCampusId');
    localStorage.removeItem('currentCampus');
    localStorage.removeItem('currentDepartmentId');
    localStorage.removeItem('currentDepartment');
    localStorage.removeItem('hasSelectedCampus');
    window.dispatchEvent(new CustomEvent('authChanged', { detail: { isLoggedIn: false } }));
    window.location.href = '/login';
  };

  /**
   * 显示科室选择模态框
   */
  const showDepartmentModal = () => {
    setIsDepartmentModalVisible(true);
  };

  /**
   * 处理科室变更
   * @param {Object} e - 事件对象
   */
  const handleDepartmentChange = (e) => {
    const newDepartment = e.target.value;
    selectDepartment(newDepartment);
    setIsDepartmentModalVisible(false);
    window.dispatchEvent(new CustomEvent('workspaceScopeChanged'));
    window.location.href = '/';
  };

  /**
   * 取消科室选择
   */
  const handleCancelDepartmentModal = () => {
    setIsDepartmentModalVisible(false);
  };

  /**
   * 获取面包屑导航项
   * @returns {Array} 面包屑导航项数组
   */
  const getBreadcrumbItems = () => {
    const pathSnippets = location.pathname.split('/').filter(i => i);
    const items = [{ title: <Link to="/">首页</Link> }];
    
    if (pathSnippets.length > 0) {
      pathSnippets.forEach((snippet, index) => {
        const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
        const title = getMenuTitle(snippet);
        items.push({ title: <Link to={url}>{title}</Link> });
      });
    }
    
    return items;
  };

  /**
   * 根据路由键获取菜单标题
   * @param {string} key - 路由键
   * @returns {string} 菜单标题
   */
  const getMenuTitle = (key) => {
    const titles = {
      'stock-in-accept': '采购入库',
      'stock-in-detail': '入库单查询',
      'inventory-detail': '物资库存',
      'inventory-transfer': '物资调拨',

      'inventory-expiry': '效期管理',
      'stock-out-consumption': '消耗出库',
      'stock-out-detail': '消耗明细查询',
      'stock-out-stats': '消耗统计',
      'inventory-check-generate': '盘点表生成',
      'inventory-check-diff': '盘点损溢录入',
      'reports-stock-in-detail': '仓库入库明细',
      'reports-stock-in-summary': '仓库入库汇总',
      'reports-consumption-detail': '仓库消耗明细',
      'reports-consumption-summary': '仓库消耗汇总',
      'reports-loss-summary': '损耗汇总',
      'supplier-maintenance': '供应商维护',
      'supplier-inspection-report': '注册证',
      'supplier-business-license': '经营许可证',
      'supplier-business-certificate': '营业执照',
      'product-catalog': '物资字典维护',
      'product-price-adjustment': '物资调价',
      'user-role-template': '用户角色模板',
      'user-permission-settings': '用户权限设定',
      'user-account-management': '用户账户管理',
      'department-management': '部门管理',
      'campus-management': '分院管理',
      'purchase-order-request': '采购计划申请',
      'purchase-order-approval': '采购审核',
      'purchase-order-query': '采购订单查询',
      'purchase-order-acceptance': '采购入库',
      'abnormal-order-management': '异常订单管理',
      'operation-log': '操作日志',
      'fixed-assets-dictionary': '资产字典维护',
      'fixed-assets-add': '资产新增',
      'fixed-assets-detail-query': '资产明细查询',
      'fixed-assets-scrap': '资产报废',
      'fixed-assets-scrap-detail': '资产清理明细',
      'fixed-assets-change-audit': '资产变更审核',
      'fixed-assets-warning': '固定资产预警',
      'fixed-assets-maintenance-record': '资产维修记录',
      'sample-quantity-management': '样本量管理',
      'consumables-quality-issue': '耗材质量问题记录',
      'medical-device-adverse-event': '异常事件记录',
      'instrument-maintenance-record': '仪器维修记录',
      'maintenance-record': '维修记录',
    };
    return titles[key] || key;
  };

  const resolveMenuIcon = useCallback((iconName) => {
    const iconMap = {
      apartment: <TeamOutlined />,
      'bar-chart': <BarChartOutlined />,
      'bar-chart-outlined': <BarChartOutlined />,
      control: <ControlOutlined />,
      dashboard: <DashboardOutlined />,
      database: <DatabaseOutlined />,
      desktop: <DesktopOutlined />,
      export: <ExportOutlined />,
      file: <FileTextOutlined />,
      home: <HomeOutlined />,
      import: <ImportOutlined />,
      inbox: <InboxOutlined />,
      lock: <SettingOutlined />,
      setting: <SettingOutlined />,
      shopping: <ShoppingOutlined />,
      team: <TeamOutlined />,
      user: <UserOutlined />,
      warning: <WarningOutlined />,
      'clock-circle': <ClockCircleOutlined />,
    };

    return iconMap[String(iconName || '').toLowerCase()] || undefined;
  }, []);

  const mapBackendMenuTree = useCallback((menuTree) => {
    return (menuTree || []).map((item) => {
      const key = item.path || item.code || `menu-${item.id}`;
      const children = mapBackendMenuTree(item.children || []);
      const hasRoute = typeof item.path === 'string' && item.path.startsWith('/');

      return {
        key,
        icon: resolveMenuIcon(item.icon),
        label: children.length > 0 || !hasRoute ? item.name : <Link to={item.path}>{item.name}</Link>,
        children: children.length > 0 ? children : undefined,
      };
    });
  }, [resolveMenuIcon]);

  const containsLegacyMenuPath = useCallback((menuTree) => {
    return (menuTree || []).some((item) => {
      if (typeof item.path === 'string' && item.path.startsWith('/system')) {
        return true;
      }
      return containsLegacyMenuPath(item.children || []);
    });
  }, []);

  const extractRoutePaths = useCallback((menuTree) => {
    const paths = [];
    const walk = (nodes = []) => {
      nodes.forEach((node) => {
        if (typeof node?.path === 'string' && node.path.startsWith('/')) {
          paths.push(node.path);
        }
        if (Array.isArray(node?.children) && node.children.length > 0) {
          walk(node.children);
        }
      });
    };
    walk(menuTree);
    return Array.from(new Set(paths));
  }, []);

  useEffect(() => {
    let active = true;

    const loadBackendMenuTree = async () => {
      try {
        const response = await api.get('/api/permission/menu/tree');
        if (!active) {
          return;
        }

        if (response.code === 1 && Array.isArray(response.data) && !containsLegacyMenuPath(response.data)) {
          const mappedMenus = mapBackendMenuTree(response.data);
          setBackendMenuItems(mappedMenus);
          setAllowedRoutePaths(extractRoutePaths(response.data));
        } else {
          setBackendMenuItems([]);
          setAllowedRoutePaths([]);
        }
      } catch (error) {
        if (active) {
          setBackendMenuItems([]);
          setAllowedRoutePaths([]);
        }
      } finally {
        if (active) {
          setBackendMenuLoaded(true);
        }
      }
    };

    if (isLoggedIn) {
      loadBackendMenuTree();
    }

    return () => {
      active = false;
    };
  }, [containsLegacyMenuPath, extractRoutePaths, isLoggedIn, mapBackendMenuTree]);

  const hasRouteAccess = useCallback((pathname) => {
    if (!pathname || pathname === '/' || pathname === '/login') {
      return true;
    }
    if (!backendMenuLoaded || allowedRoutePaths.length === 0) {
      return true;
    }
    return allowedRoutePaths.some((path) => pathname === path || pathname.startsWith(`${path}/`));
  }, [allowedRoutePaths, backendMenuLoaded]);

  useEffect(() => {
    if (!backendMenuLoaded) {
      return;
    }
    if (!hasRouteAccess(location.pathname)) {
      navigate('/', { replace: true });
    }
  }, [backendMenuLoaded, hasRouteAccess, location.pathname, navigate]);

  /**
   * 未登录状态处理
   * 如果用户未登录，只显示登录页面
   */
  if (!isLoggedIn) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  /**
   * 已登录状态处理
   * 显示完整的应用布局，包括头部、侧边栏和内容区域
   */
  return (
    <ConfigProvider theme={themeConfig} locale={zhCN}>
      <TabProvider>
        <NoteProvider>
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            {/* 头部区域 - 固定顶部 */}
            <div
              className="header"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 48px',
                background: '#ffffff',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                zIndex: 100,
                height: 64,
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
              }}
            >
              {/* 系统标题 */}
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div
                  className="logo"
                  style={{
                    fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
                    fontWeight: 'bold',
                    color: '#667eea',
                    marginRight: 'clamp(1rem, 3vw, 3rem)',
                    display: 'flex',
                    alignItems: 'center',
                    letterSpacing: 'clamp(0.25rem, 1vw, 1rem)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '100%',
                    lineHeight: 1.2,
                  }}
                >
                  <img 
                    src="/assets/YLogo.png" 
                    alt="云晟宝" 
                    style={{ 
                      marginRight: 'clamp(0.5rem, 1vw, 1rem)', 
                      width: 'clamp(1.75rem, 4vw, 3.5rem)', 
                      height: 'clamp(1.75rem, 4vw, 3.5rem)',
                      flexShrink: 0 
                    }} 
                  />
                  医智云智能管理系统
                </div>
              </div>
              
              {/* 用户信息和操作区 */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 'clamp(0.5rem, 1vw, 1rem)',
                justifyContent: 'flex-end',
                flex: 1,
                minWidth: 0
              }}>
                <button
                  onClick={showCampusModal}
                  style={{
                    background: 'rgba(102, 126, 234, 0.1)',
                    color: '#667eea',
                    padding: 'clamp(0.25rem, 0.5vw, 0.375rem) clamp(0.5rem, 1vw, 0.75rem)',
                    borderRadius: 4,
                    fontSize: 'clamp(0.75rem, 0.875vw, 0.875rem)',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    lineHeight: 1.5,
                    marginRight: 'clamp(0.5rem, 1vw, 1rem)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'rgba(102, 126, 234, 0.2)';
                    e.target.style.boxShadow = '0 2px 8px rgba(102, 126, 234, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'rgba(102, 126, 234, 0.1)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  {currentCampus || '未选择院区'}
                </button>
                
                <Avatar
                  style={{ 
                    marginRight: 'clamp(0.25rem, 0.5vw, 0.75rem)', 
                    backgroundColor: '#667eea',
                    flexShrink: 0
                  }}
                  icon={<UserOutlined />}
                />
                <span style={{ 
                  color: '#262626', 
                  marginRight: 'clamp(0.5rem, 1vw, 1rem)',
                  fontSize: 'clamp(0.875rem, 1vw, 1rem)',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  lineHeight: 1.5
                }}>{currentUserName}</span>
                
                {/* 科室切换按钮 */}
                <button
                  onClick={showDepartmentModal}
                  style={{
                    background: 'none',
                    border: '1px solid #667eea',
                    color: '#667eea',
                    cursor: 'pointer',
                    padding: 'clamp(0.375rem, 0.75vw, 0.625rem) clamp(0.75rem, 1.25vw, 1rem)',
                    borderRadius: 4,
                    transition: 'all 0.3s',
                    display: 'flex',
                    alignItems: 'center',
                    marginRight: 'clamp(0.5rem, 1vw, 1rem)',
                    fontSize: 'clamp(0.8125rem, 0.9375vw, 0.9375rem)',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    lineHeight: 1.5
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'rgba(102, 126, 234, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                  }}
                >
                  {currentDepartmentLabel}
                </button>
                
                {/* 退出登录按钮 */}
                <button
                  onClick={handleLogout}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#8c8c8c',
                    cursor: 'pointer',
                    padding: 'clamp(0.375rem, 0.75vw, 0.625rem) clamp(0.75rem, 1.25vw, 1rem)',
                    borderRadius: 4,
                    transition: 'all 0.3s',
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: 'clamp(0.8125rem, 0.9375vw, 0.9375rem)',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    lineHeight: 1.5
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = '#f5222d';
                    e.target.style.backgroundColor = 'rgba(245, 34, 45, 0.06)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = '#8c8c8c';
                    e.target.style.backgroundColor = 'transparent';
                  }}
                >
                  <LogoutOutlined style={{ marginRight: 'clamp(0.125rem, 0.25vw, 0.25rem)' }} />
                  退出登录
                </button>
            </div>
          </div>
            
            {/* 科室切换模态框 */}
            <Modal
              title="切换科室"
              open={isDepartmentModalVisible}
              onCancel={handleCancelDepartmentModal}
              footer={null}
              centered
            >
              <Radio.Group
                onChange={handleDepartmentChange}
                value={currentDepartment?.id ?? null}
                style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}
              >
                {departmentOptions.map((dept) => (
                  <Radio.Button
                    key={dept.id}
                    value={dept.id}
                    style={{
                      width: '100%',
                      textAlign: 'center',
                      height: 40,
                      lineHeight: '38px',
                      borderRadius: 6,
                      border: '1px solid #d9d9d9',
                      background: Number(currentDepartment?.id) === Number(dept.id) ? '#667eea' : '#fff',
                      color: Number(currentDepartment?.id) === Number(dept.id) ? '#fff' : '#262626',
                      transition: 'all 0.3s',
                    }}
                  >
                    {dept.deptName || dept.name}
                  </Radio.Button>
                ))}
              </Radio.Group>
            </Modal>
            
            {/* 主体布局 */}
            <div style={{ display: 'flex', flex: 1, marginTop: 64 }}>
              {/* 侧边栏 - 固定左侧 */}
              <div
                style={{
                  width: collapsed ? 80 : 240,
                  boxShadow: '2px 0 8px rgba(0, 0, 0, 0.08)',
                  transition: 'all 0.3s ease',
                  background: '#ffffff',
                  borderRight: '1px solid #e8e8e8',
                  position: 'fixed',
                  left: 0,
                  top: 64,
                  bottom: 0,
                  zIndex: 99,
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* 菜单内容 */}
                <div style={{ flex: 1, overflowY: 'auto' }}>
                  {/* 菜单配置 */}
                  {/* 原始菜单配置 */}
                  {(() => {
                  const originalMenuItems = [
                    { 
                      key: '/', 
                      icon: <DashboardOutlined />, 
                      label: <Link to="/">首页</Link>,
                      style: { marginBottom: 4 }
                    },
                    {
                      key: 'supplier-group',
                      icon: <TeamOutlined />,
                      label: '供应商维护',
                      children: [
                        { key: '/supplier-maintenance', label: <Link to="/supplier-maintenance">供应商管理</Link> },
                        {
                          key: 'supplier-qualification',
                          label: '供应商资质',
                          children: [
                            { key: '/supplier-inspection-report', label: <Link to="/supplier-inspection-report">注册证</Link> },
                            { key: '/supplier-business-license', label: <Link to="/supplier-business-license">经营许可证</Link> },
                            { key: '/supplier-business-certificate', label: <Link to="/supplier-business-certificate">营业执照</Link> },
                          ]
                        },
                        { key: '/supplier-qualification-warning', label: <Link to="/supplier-qualification-warning">资质预警</Link> }
                      ]
                    },
                    {
                      key: 'master-data-group',
                      icon: <SettingOutlined />,
                      label: '字典维护',
                      children: [
                        { key: '/product-catalog', label: <Link to="/product-catalog">物资字典</Link> },
                        { key: '/product-price-adjustment', label: <Link to="/product-price-adjustment">物资调价</Link> },
                      ]
                    },
                    {
                      key: 'purchase-group',
                      icon: <ShoppingOutlined />,
                      label: '采购管理',
                      children: [
                        { key: '/purchase-order-request', label: <Link to="/purchase-order-request">采购计划申请</Link> },
                        { key: '/purchase-order-approval', label: <Link to="/purchase-order-approval">采购审核</Link> },
                        { key: '/purchase-order-query', label: <Link to="/purchase-order-query">采购订单查询</Link> },
                      ]
                    },
                    {
                      key: 'stock-in-group',
                      icon: <ImportOutlined />,
                      label: '入库管理',
                      children: [
                        { key: '/purchase-receipt', label: <Link to="/purchase-receipt">采购收货</Link> },
                        { key: '/purchase-order-acceptance', label: <Link to="/purchase-order-acceptance">采购入库</Link> },
                        { key: '/manual-stock-in', label: <Link to="/manual-stock-in">初始化入库</Link> },
                        { key: '/transfer-acceptance', label: <Link to="/transfer-acceptance">调拨验收入库</Link> },
                        { key: '/stock-in-detail', label: <Link to="/stock-in-detail">入库单查询</Link> },
                        { key: '/abnormal-order-management', label: <Link to="/abnormal-order-management">异常订单管理</Link> },
                      ]
                    },
                    {
                      key: 'inventory-group',
                      icon: <DatabaseOutlined />,
                      label: '库存管理',
                      children: [
                        { key: '/inventory-detail', label: <Link to="/inventory-detail">物资库存</Link> },
                        { key: '/inventory-transfer', label: <Link to="/inventory-transfer">物资调拨</Link> },

                        { key: '/inventory-expiry', label: <Link to="/inventory-expiry">近效期查询</Link> },
                      ]
                    },
                    {
                      key: 'stock-out-group',
                      icon: <ExportOutlined />,
                      label: '出库管理',
                      children: [
                        { key: '/stock-out-consumption', label: <Link to="/stock-out-consumption">消耗出库</Link> },
                        { key: '/stock-out-detail', label: <Link to="/stock-out-detail">消耗明细查询</Link> },
                        { key: '/stock-out-stats', label: <Link to="/stock-out-stats">消耗统计</Link> },
                        { key: '/stock-out-consumption-undo', label: <Link to="/stock-out-consumption-undo">消耗撤销</Link> },
                      ]
                    },
                    {
                      key: 'inventory-check-group',
                      icon: <FileTextOutlined />,
                      label: '库存盘点',
                      children: [
                        { key: '/inventory-check-generate', label: <Link to="/inventory-check-generate">盘点表生成</Link> },
                        { key: '/inventory-check-detail', label: <Link to="/inventory-check-detail">盘点明细查询</Link> },
                        { key: '/inventory-check-diff', label: <Link to="/inventory-check-diff">盘点损溢录入</Link> },
                      ]
                    },
                    {
                      key: 'reports-group',
                      icon: <BarChartOutlined />,
                      label: '仓库报表',
                      children: [
                        { key: '/reports-stock-in-detail', label: <Link to="/reports-stock-in-detail">仓库入库明细</Link> },
                        { key: '/reports-stock-in-summary', label: <Link to="/reports-stock-in-summary">仓库入库汇总</Link> },
                        { key: '/reports-consumption-detail', label: <Link to="/reports-consumption-detail">仓库消耗明细</Link> },
                        { key: '/reports-consumption-summary', label: <Link to="/reports-consumption-summary">仓库消耗汇总</Link> },
                        { key: '/reports-loss-summary', label: <Link to="/reports-loss-summary">损耗汇总</Link> },
                      ]
                    },
                    {
                      key: 'fixed-assets-group',
                      icon: <DesktopOutlined />,
                      label: '固定资产管理',
                      children: [
                        { key: '/fixed-assets-dictionary', label: <Link to="/fixed-assets-dictionary">资产字典维护</Link> },
                        { key: '/fixed-assets-add', label: <Link to="/fixed-assets-add">资产新增</Link> },
                        { key: '/fixed-assets-detail-query', label: <Link to="/fixed-assets-detail-query">资产明细查询</Link> },
                        { key: '/fixed-assets-transfer', label: <Link to="/fixed-assets-transfer">固定资产调拨</Link> },
                        { key: '/fixed-assets-scrap', label: <Link to="/fixed-assets-scrap">资产报废</Link> },
                        { key: '/fixed-assets-scrap-detail', label: <Link to="/fixed-assets-scrap-detail">资产清理明细</Link> },
                        { key: '/fixed-assets-change-audit', label: <Link to="/fixed-assets-change-audit">资产变更审核</Link> },
                        { key: '/fixed-assets-warning', label: <Link to="/fixed-assets-warning">固定资产预警</Link> },
                        { key: '/fixed-assets-maintenance-record', label: <Link to="/fixed-assets-maintenance-record">资产维修记录</Link> },
                      ]
                    },
                    {
                      key: 'sample-group',
                      icon: <DatabaseOutlined />,
                      label: '样本量管理',
                      children: [
                        { key: '/sample-project-management', label: <Link to="/sample-project-management">项目字典</Link> },
                        { key: '/sample-quantity-management', label: <Link to="/sample-quantity-management">样本量管理</Link> },
                      ]
                    },
                    {
                      key: 'abnormal-events-group',
                      icon: <WarningOutlined />,
                      label: '异常事件记录',
                      children: [
                        { key: '/consumables-quality-issue', label: <Link to="/consumables-quality-issue">耗材质量问题记录</Link> },
                        { key: '/medical-device-adverse-event', label: <Link to="/medical-device-adverse-event">异常事件记录</Link> },
                        { key: '/instrument-maintenance-record', label: <Link to="/instrument-maintenance-record">仪器维修记录</Link> },
                        { key: '/maintenance-record', label: <Link to="/maintenance-record">维修记录</Link> },
                      ]
                    },
                    {
                      key: 'all-campus-management-group',
                      icon: <TeamOutlined />,
                      label: '院区管理',
                      children: [
                        { key: '/department-management', label: <Link to="/department-management">部门管理</Link> },
                        { key: '/campus-management', label: <Link to="/campus-management">分院管理</Link> },
                      ]
                    },
                    {
                      key: 'operation-group',
                      icon: <ControlOutlined />,
                      label: '运营组管理',
                      children: [
                        { key: '/user-account-management', label: <Link to="/user-account-management">用户账户管理</Link> },
                        { key: '/user-permission-settings', label: <Link to="/user-permission-settings">用户权限设定</Link> },
                        { key: '/user-role-template', label: <Link to="/user-role-template">用户角色模板</Link> },
                      ]
                    },
                    {
                      key: '/operation-log',
                      icon: <ClockCircleOutlined />,
                      label: <Link to="/operation-log">操作日志</Link>,
                      style: { marginTop: 8 }
                    },
                  ];

                  const menuSource = backendMenuLoaded && backendMenuItems.length > 0
                    ? [originalMenuItems[0], ...backendMenuItems.filter((item) => item.key !== '/')]
                    : originalMenuItems;

                  const filteredMenuItems = menuSource;

                  return (
                    <Menu
                      theme="light"
                      selectedKeys={[location.pathname || '/']}
                      mode="inline"
                      style={{ 
                        borderRight: 0, 
                        background: '#ffffff',
                        padding: '8px 0',
                        borderRadius: '8px',
                      }}
                      items={filteredMenuItems}
                      onOpenChange={() => {}}
                      onClick={() => {}}
                    />
                  );
                })()}
                </div>
                
                {/* 折叠按钮 */}
                <div style={{ padding: '16px', background: '#ffffff', borderTop: '1px solid #e8e8e8' }}>
                  <button
                    onClick={() => setCollapsed(!collapsed)}
                    style={{
                      background: '#667eea',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '12px',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%',
                      color: 'white',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => e.target.style.background = '#5a6fd8'}
                    onMouseLeave={(e) => e.target.style.background = '#667eea'}
                  >
                    {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                  </button>
                </div>
              </div>
              
              {/* 标签页导航栏 - 固定 */}
              <div 
                style={{ 
                  marginLeft: collapsed ? 80 : 240, 
                  padding: '0 24px', 
                  backgroundColor: '#ffffff',
                  borderBottom: '1px solid #e8e8e8',
                  position: 'fixed',
                  top: 64,
                  left: 0,
                  right: 0,
                  zIndex: 90,
                }}
              >
                <AppWithTabs />
              </div>
              
              {/* 内容区域 - 可滚动 */}
              <div 
                style={{ 
                  flex: 1, 
                  marginLeft: collapsed ? 80 : 240, 
                  padding: '24px', 
                  paddingTop: '60px',
                  backgroundColor: '#f8f9fa',
                  minHeight: 'calc(100vh - 64px)',
                  overflowY: 'auto',
                }}
              >
                <div
                  style={{
                    background: '#ffffff',
                    padding: 24,
                    borderRadius: 12,
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
                    border: '1px solid #e8e8e8',
                  }}
                >
                  {/* 路由配置 */}
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Navigate to="/" replace />} />
                    <Route path="/stock-in-accept" element={<StockInAccept />} />
                    <Route path="/transfer-acceptance" element={<TransferAcceptance />} />
                    <Route path="/stock-in-detail" element={<StockInDetail />} />
                    <Route path="/inventory" element={<Navigate to="/inventory-detail" replace />} />
                    <Route path="/inventory-detail" element={<InventoryDetail />} />
                    <Route path="/inventory-adjust" element={<InventoryAdjust />} />
                    <Route path="/inventory-transfer" element={<InventoryTransfer />} />

                    <Route path="/inventory-expiry" element={<InventoryExpiry />} />
                    <Route path="/stock-out-consumption" element={<StockOutConsumption />} />
                    <Route path="/stock-out-detail" element={<StockOutDetail />} />
                    <Route path="/stock-out-stats" element={<StockOutStats />} />
                    <Route path="/stock-out-consumption-undo" element={<StockOutConsumptionUndo />} />
                    <Route path="/inventory-check-generate" element={<InventoryCheckGenerate />} />
                    <Route path="/inventory-check-detail" element={<InventoryCheckDetail />} />
                    <Route path="/inventory-check-diff" element={<InventoryCheckDiff />} />
                    <Route path="/reports-stock-in-detail" element={<ReportsStockInDetail />} />
                    <Route path="/reports-stock-in-summary" element={<ReportsStockInSummary />} />
                    <Route path="/reports-consumption-detail" element={<ReportsConsumptionDetail />} />
                    <Route path="/reports-consumption-summary" element={<ReportsConsumptionSummary />} />
                    <Route path="/reports-loss-summary" element={<ReportsLossSummary />} />
                    <Route path="/supplier-maintenance" element={<SupplierMaintenance />} />
                    <Route path="/supplier-inspection-report/:supplierId?" element={<SupplierInspectionReport />} />
                    <Route path="/supplier-business-license/:supplierId?" element={<SupplierBusinessLicense />} />
                    <Route path="/supplier-business-certificate/:supplierId?" element={<SupplierBusinessCertificate />} />
                    <Route path="/supplier-qualification-warning" element={<SupplierQualificationWarning />} />
                    <Route path="/product-catalog" element={<ProductCatalog />} />
                    <Route path="/product-price-adjustment" element={<ProductPriceAdjustment />} />
                    <Route path="/udi-maintenance" element={<UDIMaintenance />} />
                    <Route path="/user-account-creation" element={<Navigate to="/user-account-management" replace />} />
                    <Route path="/user-role-template" element={<UserRoleTemplate />} />
                    <Route path="/user-permission-settings" element={<UserPermissionSettings />} />
                    <Route path="/user-account-management" element={<UserAccountManagement />} />
                    <Route path="/department-management" element={<DepartmentManagement />} />
                    <Route path="/campus-management" element={<CampusManagement />} />
                    <Route path="/purchase-order-request" element={<PurchaseOrderRequest />} />
                    <Route path="/purchase-order-approval" element={<PurchaseOrderApproval />} />
                    <Route path="/purchase-order-query" element={<PurchaseOrderQuery />} />
                    <Route path="/purchase-order-acceptance" element={<PurchaseOrderAcceptance />} />
                    <Route path="/manual-stock-in" element={<ManualStockIn />} />
                    <Route path="/purchase-receipt" element={<PurchaseReceipt />} />
                    <Route path="/abnormal-order-management" element={<AbnormalOrderManagement />} />
                    <Route path="/fixed-assets-dictionary" element={<FixedAssetsDictionary />} />
                    <Route path="/fixed-assets-add" element={<FixedAssetsAdd />} />
                    <Route path="/fixed-assets-detail-query" element={<FixedAssetsDetailQuery />} />
                    <Route path="/fixed-assets-scrap" element={<FixedAssetsScrap />} />
                    <Route path="/fixed-assets-scrap-detail" element={<FixedAssetsScrapDetail />} />
                    <Route path="/fixed-assets-change-audit" element={<FixedAssetsChangeAudit />} />
                    <Route path="/fixed-assets-transfer" element={<FixedAssetsTransfer />} />
                    <Route path="/fixed-assets-warning" element={<FixedAssetsWarning />} />
                    <Route path="/fixed-assets-maintenance-record" element={<FixedAssetsMaintenanceRecord />} />
                    <Route path="/sample-project-management" element={<SampleProjectManagement />} />
                    <Route path="/sample-quantity-management" element={<SampleQuantityManagement />} />
                    <Route path="/consumables-quality-issue" element={<ConsumablesQualityIssueRecord />} />
                    <Route path="/medical-device-adverse-event" element={<MedicalDeviceAdverseEvent />} />
                    <Route path="/instrument-maintenance-record" element={<InstrumentMaintenanceRecord />} />
                    <Route path="/maintenance-record" element={<MaintenanceRecord />} />
                    <Route path="/operation-log" element={<OperationLog />} />
                  </Routes>
                </div>
                
                {/* 全局悬浮备注窗口 */}
                <GlobalNoteWindow />
                
                {/* 院区选择弹窗 */}
                <CampusSelectorModal
                  visible={isCampusModalVisible}
                  onCancel={hideCampusModal}
                  onSelect={(campus) => {
                    selectCampus(campus);
                    window.dispatchEvent(new CustomEvent('workspaceScopeChanged'));
                    window.location.href = '/';
                  }}
                  currentCampus={currentCampus}
                  currentCampusId={currentCampusNode?.id}
                  campuses={campuses}
                />
                
              </div>
            </div>
          </div>
        </NoteProvider>
      </TabProvider>
    </ConfigProvider>
  );
};

/**
 * 应用主组件
 * 包装 AppContent 以使用 PageVisibilityProvider
 */
const App = () => {
  return <AppContent />;
};

export default App;