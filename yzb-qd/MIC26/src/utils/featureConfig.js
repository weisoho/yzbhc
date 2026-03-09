/**
 * 主页功能配置管理工具
 * 提供独立配置文件读写功能，用于保存主页功能显示/隐藏状态
 * 前端版本：使用localStorage作为配置存储，模拟文件系统行为
 */

// 存储键名
const STORAGE_KEY = 'featureVisibilityConfig';
const BACKUP_STORAGE_KEY = 'featureVisibilityConfig_backup';

// 默认配置（默认显示所有页面）
const DEFAULT_CONFIG = {
  version: '1.0.0',
  schema: 'feature-visibility',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  settings: {
    // 首页始终显示
    '/': {
      visible: true,
      title: '首页',
      path: '/',
      group: 'root',
      alwaysVisible: true
    },
    // 默认显示所有页面
    visibleKeys: [
      '/supplier-maintenance',
      '/supplier-inspection-report',
      '/supplier-business-license',
      '/supplier-business-certificate',
      '/supplier-qualification-warning',
      '/product-catalog',
      '/product-price-adjustment',
      '/purchase-order-request',
      '/purchase-order-approval',
      '/purchase-order-query',
      '/purchase-receipt',
      '/purchase-order-acceptance',
      '/manual-stock-in',
      '/transfer-acceptance',
      '/stock-in-detail',
      '/abnormal-order-management',
      '/inventory-detail',
      '/inventory-transfer',
      '/inventory-expiry',
      '/stock-out-consumption',
      '/stock-out-detail',
      '/stock-out-stats',
      '/stock-out-consumption-undo',
      '/inventory-check-generate',
      '/inventory-check-detail',
      '/inventory-check-diff',
      '/reports-stock-in-detail',
      '/reports-stock-in-summary',
      '/reports-consumption-detail',
      '/reports-consumption-summary',
      '/reports-loss-summary',
      '/user-account-management',
      '/user-permission-settings',
      '/user-role-template',
      '/department-management',
      '/campus-management',
      '/fixed-assets-dictionary',
      '/fixed-assets-add',
      '/fixed-assets-detail-query',
      '/fixed-assets-transfer',
      '/fixed-assets-scrap',
      '/fixed-assets-scrap-detail',
      '/fixed-assets-change-audit',
      '/fixed-assets-warning',
      '/fixed-assets-maintenance-record',
      '/sample-project-management',
      '/sample-quantity-management',
      '/consumables-quality-issue',
      '/medical-device-adverse-event',
      '/instrument-maintenance-record',
      '/operation-log'
    ]
  }
};

/**
 * 原子性写入配置文件（使用localStorage模拟）
 * @param {Object} config - 配置对象
 * @returns {Promise<boolean>} 是否写入成功
 */
export const writeFeatureConfig = async (config) => {
  try {
    // 准备写入的数据
    const dataToWrite = {
      ...config,
      updatedAt: new Date().toISOString()
    };

    // 原子性写入：先备份当前配置，再写入新配置
    const currentConfig = localStorage.getItem(STORAGE_KEY);
    if (currentConfig) {
      localStorage.setItem(BACKUP_STORAGE_KEY, currentConfig);
    }

    // 写入新配置
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToWrite));
    
    // 验证写入是否成功
    const verifyConfig = localStorage.getItem(STORAGE_KEY);
    if (!verifyConfig) {
      throw new Error('Failed to verify config write');
    }
    
    // 清理备份（写入成功）
    localStorage.removeItem(BACKUP_STORAGE_KEY);
    
    return true;
  } catch (error) {
    console.error('Failed to write feature config:', error);
    
    // 恢复备份（如果存在）
    try {
      const backupConfig = localStorage.getItem(BACKUP_STORAGE_KEY);
      if (backupConfig) {
        localStorage.setItem(STORAGE_KEY, backupConfig);
        localStorage.removeItem(BACKUP_STORAGE_KEY);
      }
    } catch (recoveryError) {
      console.error('Failed to recover from backup:', recoveryError);
    }
    
    return false;
  }
};

/**
 * 读取配置文件
 * @returns {Promise<Object>} 配置对象，读取失败时返回默认配置
 */
export const readFeatureConfig = async () => {
  try {
    // 检查配置是否存在
    const storedConfig = localStorage.getItem(STORAGE_KEY);
    if (!storedConfig) {
      console.log('Feature config not found in localStorage, using default config');
      // 写入默认配置
      await writeFeatureConfig(DEFAULT_CONFIG);
      return DEFAULT_CONFIG;
    }

    // 解析JSON
    const config = JSON.parse(storedConfig);
    
    // 验证配置结构
    if (!config.settings || !config.settings.visibleKeys) {
      console.warn('Invalid config structure, using default config');
      return DEFAULT_CONFIG;
    }
    
    // 验证版本兼容性
    if (!config.version || config.version !== '1.0.0') {
      console.warn('Config version mismatch, migrating to new version');
      // 这里可以添加版本迁移逻辑
      const migratedConfig = {
        ...DEFAULT_CONFIG,
        settings: {
          ...DEFAULT_CONFIG.settings,
          visibleKeys: config.settings.visibleKeys || []
        }
      };
      await writeFeatureConfig(migratedConfig);
      return migratedConfig;
    }
    
    return config;
  } catch (error) {
    console.error('Failed to read feature config:', error);
    
    // 根据错误类型返回不同的默认配置
    if (error instanceof SyntaxError) {
      // JSON解析错误
      console.error('Config contains invalid JSON, using default config');
      // 清理损坏的配置
      localStorage.removeItem(STORAGE_KEY);
    } else {
      // 其他错误
      console.error('Unexpected error reading config:', error);
    }
    
    return DEFAULT_CONFIG;
  }
};

/**
 * 同步读取配置文件（非异步版本，用于同步上下文）
 * @returns {Object} 配置对象
 */
export const readFeatureConfigSync = () => {
  try {
    const storedConfig = localStorage.getItem(STORAGE_KEY);
    if (!storedConfig) {
      return DEFAULT_CONFIG;
    }
    
    const config = JSON.parse(storedConfig);
    
    if (!config.settings || !config.settings.visibleKeys) {
      return DEFAULT_CONFIG;
    }
    
    return config;
  } catch (error) {
    console.error('Failed to read feature config synchronously:', error);
    return DEFAULT_CONFIG;
  }
};

/**
 * 获取所有页面配置（与PageVisibilityContext保持一致）
 * @returns {Array} 页面配置数组
 */
export const getAllPagesConfig = () => [
  { key: '/', title: '首页', path: '/', group: 'root' },
  { key: '/supplier-maintenance', title: '供应商管理', path: '/supplier-maintenance', group: 'supplier' },
  { key: '/supplier-inspection-report', title: '检验报告', path: '/supplier-inspection-report', group: 'supplier' },
  { key: '/supplier-business-license', title: '经营许可证', path: '/supplier-business-license', group: 'supplier' },
  { key: '/supplier-business-certificate', title: '营业执照', path: '/supplier-business-certificate', group: 'supplier' },
  { key: '/supplier-qualification-warning', title: '资质预警', path: '/supplier-qualification-warning', group: 'supplier' },
  { key: '/product-catalog', title: '物资字典', path: '/product-catalog', group: 'master-data' },
  { key: '/product-price-adjustment', title: '物资调价', path: '/product-price-adjustment', group: 'master-data' },
  { key: '/purchase-order-request', title: '采购计划申请', path: '/purchase-order-request', group: 'purchase' },
  { key: '/purchase-order-approval', title: '采购审核', path: '/purchase-order-approval', group: 'purchase' },
  { key: '/purchase-order-query', title: '采购订单查询', path: '/purchase-order-query', group: 'purchase' },
  { key: '/purchase-receipt', title: '采购收货', path: '/purchase-receipt', group: 'stock-in' },
  { key: '/purchase-order-acceptance', title: '采购入库', path: '/purchase-order-acceptance', group: 'stock-in' },
  { key: '/manual-stock-in', title: '初始化入库', path: '/manual-stock-in', group: 'stock-in' },
  { key: '/transfer-acceptance', title: '调拨验收入库', path: '/transfer-acceptance', group: 'stock-in' },
  { key: '/stock-in-detail', title: '入库单查询', path: '/stock-in-detail', group: 'stock-in' },
  { key: '/abnormal-order-management', title: '异常订单管理', path: '/abnormal-order-management', group: 'stock-in' },
  { key: '/inventory-detail', title: '物资库存', path: '/inventory-detail', group: 'inventory' },
  { key: '/inventory-transfer', title: '物资调拨', path: '/inventory-transfer', group: 'inventory' },

  { key: '/inventory-expiry', title: '近效期查询', path: '/inventory-expiry', group: 'inventory' },
  { key: '/stock-out-consumption', title: '消耗出库', path: '/stock-out-consumption', group: 'stock-out' },
  { key: '/stock-out-detail', title: '消耗明细查询', path: '/stock-out-detail', group: 'stock-out' },
  { key: '/stock-out-stats', title: '消耗统计', path: '/stock-out-stats', group: 'stock-out' },
  { key: '/stock-out-consumption-undo', title: '消耗撤销', path: '/stock-out-consumption-undo', group: 'stock-out' },
  { key: '/inventory-check-generate', title: '盘点表生成', path: '/inventory-check-generate', group: 'inventory-check' },
  { key: '/inventory-check-detail', title: '盘点明细查询', path: '/inventory-check-detail', group: 'inventory-check' },
  { key: '/inventory-check-diff', title: '盘点损溢录入', path: '/inventory-check-diff', group: 'inventory-check' },
  { key: '/reports-stock-in-detail', title: '仓库入库明细', path: '/reports-stock-in-detail', group: 'reports' },
  { key: '/reports-stock-in-summary', title: '仓库入库汇总', path: '/reports-stock-in-summary', group: 'reports' },
  { key: '/reports-consumption-detail', title: '仓库消耗明细', path: '/reports-consumption-detail', group: 'reports' },
  { key: '/reports-consumption-summary', title: '仓库消耗汇总', path: '/reports-consumption-summary', group: 'reports' },
  { key: '/reports-loss-summary', title: '损耗汇总', path: '/reports-loss-summary', group: 'reports' },
  { key: '/user-account-management', title: '用户账户管理', path: '/user-account-management', group: 'operation' },
  { key: '/user-permission-settings', title: '用户权限设定', path: '/user-permission-settings', group: 'operation' },
  { key: '/user-role-template', title: '用户角色模板', path: '/user-role-template', group: 'operation' },
  { key: '/department-management', title: '部门管理', path: '/department-management', group: 'campus-management' },
  { key: '/campus-management', title: '分院管理', path: '/campus-management', group: 'campus-management' },
  { key: '/fixed-assets-dictionary', title: '资产字典维护', path: '/fixed-assets-dictionary', group: 'fixed-assets' },
  { key: '/fixed-assets-add', title: '资产新增', path: '/fixed-assets-add', group: 'fixed-assets' },
  { key: '/fixed-assets-detail-query', title: '资产明细查询', path: '/fixed-assets-detail-query', group: 'fixed-assets' },
  { key: '/fixed-assets-transfer', title: '固定资产调拨', path: '/fixed-assets-transfer', group: 'fixed-assets' },
  { key: '/fixed-assets-scrap', title: '资产报废', path: '/fixed-assets-scrap', group: 'fixed-assets' },
  { key: '/fixed-assets-scrap-detail', title: '资产清理明细', path: '/fixed-assets-scrap-detail', group: 'fixed-assets' },
  { key: '/fixed-assets-change-audit', title: '资产变更审核', path: '/fixed-assets-change-audit', group: 'fixed-assets' },
  { key: '/fixed-assets-warning', title: '固定资产预警', path: '/fixed-assets-warning', group: 'fixed-assets' },
  { key: '/fixed-assets-maintenance-record', title: '资产维修记录', path: '/fixed-assets-maintenance-record', group: 'fixed-assets' },
  { key: '/sample-project-management', title: '项目字典', path: '/sample-project-management', group: 'sample' },
  { key: '/sample-quantity-management', title: '样本量管理', path: '/sample-quantity-management', group: 'sample' },
  { key: '/consumables-quality-issue', title: '耗材质量问题记录', path: '/consumables-quality-issue', group: 'abnormal-events' },
  { key: '/medical-device-adverse-event', title: '异常事件记录', path: '/medical-device-adverse-event', group: 'abnormal-events' },
  { key: '/instrument-maintenance-record', title: '仪器维修记录', path: '/instrument-maintenance-record', group: 'abnormal-events' },
  { key: '/operation-log', title: '操作日志', path: '/operation-log', group: 'system' },
];

/**
 * 生成树状图数据（用于主页功能管理）
 * @returns {Array} 树状图数据
 */
export const generateTreeData = () => [
  {
    title: '首页',
    key: '/',
  },
  {
    title: '供应商维护',
    key: 'supplier-group',
    children: [
      { title: '供应商管理', key: '/supplier-maintenance' },
      {
        title: '供应商资质',
        key: 'supplier-qualification',
        children: [
          { title: '检验报告', key: '/supplier-inspection-report' },
          { title: '经营许可证', key: '/supplier-business-license' },
          { title: '营业执照', key: '/supplier-business-certificate' },
        ]
      },
      { title: '资质预警', key: '/supplier-qualification-warning' }
    ]
  },
  {
    title: '字典维护',
    key: 'master-data-group',
    children: [
      { title: '物资字典', key: '/product-catalog' },
      { title: '物资调价', key: '/product-price-adjustment' },
    ]
  },
  {
    title: '采购管理',
    key: 'purchase-group',
    children: [
      { title: '采购计划申请', key: '/purchase-order-request' },
      { title: '采购审核', key: '/purchase-order-approval' },
      { title: '采购订单查询', key: '/purchase-order-query' },
    ]
  },
  {
    title: '入库管理',
    key: 'stock-in-group',
    children: [
      { title: '采购收货', key: '/purchase-receipt' },
      { title: '采购入库', key: '/purchase-order-acceptance' },
      { title: '初始化入库', key: '/manual-stock-in' },
      { title: '调拨验收入库', key: '/transfer-acceptance' },
      { title: '入库单查询', key: '/stock-in-detail' },
      { title: '异常订单管理', key: '/abnormal-order-management' },
    ]
  },
  {
    title: '库存管理',
    key: 'inventory-group',
    children: [
      { title: '物资库存', key: '/inventory-detail' },
      { title: '物资调拨', key: '/inventory-transfer' },

      { title: '近效期查询', key: '/inventory-expiry' },
    ]
  },
  {
    title: '出库管理',
    key: 'stock-out-group',
    children: [
      { title: '消耗出库', key: '/stock-out-consumption' },
      { title: '消耗明细查询', key: '/stock-out-detail' },
      { title: '消耗统计', key: '/stock-out-stats' },
      { title: '消耗撤销', key: '/stock-out-consumption-undo' },
    ]
  },
  {
    title: '库存盘点',
    key: 'inventory-check-group',
    children: [
      { title: '盘点表生成', key: '/inventory-check-generate' },
      { title: '盘点明细查询', key: '/inventory-check-detail' },
      { title: '盘点损溢录入', key: '/inventory-check-diff' },
    ]
  },
  {
    title: '仓库报表',
    key: 'reports-group',
    children: [
      { title: '仓库入库明细', key: '/reports-stock-in-detail' },
      { title: '仓库入库汇总', key: '/reports-stock-in-summary' },
      { title: '仓库消耗明细', key: '/reports-consumption-detail' },
      { title: '仓库消耗汇总', key: '/reports-consumption-summary' },
      { title: '损耗汇总', key: '/reports-loss-summary' },
    ]
  },
  {
    title: '院区管理',
    key: 'all-campus-management-group',
    children: [
      { title: '部门管理', key: '/department-management' },
      { title: '分院管理', key: '/campus-management' },
    ]
  },
  {
    title: '运营组管理',
    key: 'operation-group',
    children: [
      { title: '用户账户管理', key: '/user-account-management' },
      { title: '用户权限设定', key: '/user-permission-settings' },
      { title: '用户角色模板', key: '/user-role-template' },
    ]
  },
  {
    title: '固定资产管理',
    key: 'fixed-assets-group',
    children: [
      { title: '资产字典维护', key: '/fixed-assets-dictionary' },
      { title: '资产新增', key: '/fixed-assets-add' },
      { title: '资产明细查询', key: '/fixed-assets-detail-query' },
      { title: '固定资产调拨', key: '/fixed-assets-transfer' },
      { title: '资产报废', key: '/fixed-assets-scrap' },
      { title: '资产清理明细', key: '/fixed-assets-scrap-detail' },
      { title: '资产变更审核', key: '/fixed-assets-change-audit' },
      { title: '固定资产预警', key: '/fixed-assets-warning' },
      { title: '资产维修记录', key: '/fixed-assets-maintenance-record' },
    ]
  },
  {
    title: '样本量管理',
    key: 'sample-group',
    children: [
      { title: '项目字典', key: '/sample-project-management' },
      { title: '样本量管理', key: '/sample-quantity-management' },
    ]
  },
  {
    title: '异常事件记录',
    key: 'abnormal-events-group',
    children: [
      { title: '耗材质量问题记录', key: '/consumables-quality-issue' },
      { title: '异常事件记录', key: '/medical-device-adverse-event' },
      { title: '仪器维修记录', key: '/instrument-maintenance-record' },
    ]
  },
  {
    title: '操作日志',
    key: '/operation-log',
  },
];

/**
 * 从配置生成可见key列表
 * @param {Object} config - 配置对象
 * @returns {Array} 可见key列表
 */
export const getVisibleKeysFromConfig = (config) => {
  if (!config || !config.settings || !config.settings.visibleKeys) {
    return ['/']; // 默认只显示首页
  }
  
  // 确保首页始终在可见列表中
  const visibleKeys = config.settings.visibleKeys;
  if (!visibleKeys.includes('/')) {
    visibleKeys.push('/');
  }
  
  return visibleKeys;
};

/**
 * 更新配置中的可见key列表
 * @param {Object} config - 原始配置
 * @param {Array} visibleKeys - 新的可见key列表
 * @returns {Object} 更新后的配置
 */
export const updateConfigWithVisibleKeys = (config, visibleKeys) => {
  const baseConfig = config || DEFAULT_CONFIG;
  
  return {
    ...baseConfig,
    settings: {
      ...baseConfig.settings,
      visibleKeys: visibleKeys.filter(key => key !== '/'), // 首页单独处理
      updatedAt: new Date().toISOString()
    },
    updatedAt: new Date().toISOString()
  };
};

/**
 * 检查页面是否可见
 * @param {Object} config - 配置对象
 * @param {string} key - 页面key
 * @returns {boolean} 是否可见
 */
export const isPageVisible = (config, key) => {
  // 首页始终可见
  if (key === '/') return true;
  
  if (!config || !config.settings || !config.settings.visibleKeys) {
    return false; // 默认隐藏
  }
  
  return config.settings.visibleKeys.includes(key);
};
