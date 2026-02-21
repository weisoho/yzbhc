// 通用工具函数

// 日期格式化
export const formatDate = (date, format = 'YYYY-MM-DD') => {
  if (!date) return '';
  
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  
  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
};

// 计算剩余天数
export const calculateRemainingDays = (expiryDate) => {
  if (!expiryDate) return 0;
  
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

// 生成唯一ID
export const generateId = (prefix = '') => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 10);
  return `${prefix}${timestamp}${random}`;
};

// 状态转换
export const statusMap = {
  // 审核状态
  audit: {
    pending: { text: '待审核', color: 'orange' },
    approved: { text: '已审核', color: 'green' },
    rejected: { text: '已拒绝', color: 'red' },
    canceled: { text: '已取消', color: 'gray' }
  },
  // 调拨状态
  transfer: {
    pending: { text: '待审核', color: 'orange' },
    approved: { text: '已审核', color: 'blue' },
    completed: { text: '已完成', color: 'green' },
    canceled: { text: '已取消', color: 'red' }
  },
  // 货架状态
  shelf: {
    available: { text: '可用', color: 'green' },
    inUse: { text: '使用中', color: 'blue' },
    maintenance: { text: '维护中', color: 'orange' },
    disabled: { text: '停用', color: 'red' }
  },
  // 操作类型
  operation: {
    stockIn: { text: '入库', color: 'green' },
    stockOut: { text: '出库', color: 'red' },
    adjustment: { text: '调整', color: 'blue' }
  }
};

// 获取状态配置
export const getStatusConfig = (statusType, status) => {
  return statusMap[statusType]?.[status] || { text: status, color: 'gray' };
};

// 数字格式化
export const formatNumber = (number, decimals = 0) => {
  if (number === null || number === undefined) return '0';
  return Number(number).toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// 计算百分比
export const calculatePercentage = (current, total) => {
  if (!total || total === 0) return '0%';
  return `${((current / total) * 100).toFixed(2)}%`;
};

// 防抖函数
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// 节流函数
export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// 深拷贝
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (typeof obj === 'object') {
    const clonedObj = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
};

// 导出常量
export const CONSTANTS = {
  // 分页配置
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: ['10', '20', '50', '100'],
  
  // 预警天数
  EXPIRY_WARNING_DAYS: {
    HIGH: 30,
    MEDIUM: 90,
    LOW: 180
  },
  
  // 库存状态
  STOCK_STATUS: {
    NORMAL: 'normal',
    LOW: 'low',
    OUT_OF_STOCK: 'out_of_stock'
  }
};
