import api from './api';

export const CHECK_STATE_OPTIONS = [
  { label: '未盘点', value: 'unchecked' },
  { label: '已盘点', value: 'checked' },
  { label: '仅差异', value: 'diff' },
];

export const CHECK_RESULT_META = {
  0: { text: '无差异', color: 'green' },
  1: { text: '盘亏', color: 'red' },
  2: { text: '盘盈', color: 'orange' },
};

const DEFAULT_PAGE_SIZE = 500;

const padNumber = (value) => String(value).padStart(2, '0');

export const formatDate = (value) => {
  if (!value) {
    return '-';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return `${date.getFullYear()}-${padNumber(date.getMonth() + 1)}-${padNumber(date.getDate())}`;
};

export const buildCheckCode = () => {
  const now = new Date();
  const prefix = `${now.getFullYear()}${padNumber(now.getMonth() + 1)}${padNumber(now.getDate())}${padNumber(now.getHours())}${padNumber(now.getMinutes())}${padNumber(now.getSeconds())}`;
  const suffix = Math.floor(Math.random() * 900 + 100);
  return `PD${prefix}${suffix}`;
};

const extractPagedData = (response) => ({
  records: response?.data?.records || [],
  total: response?.data?.total || 0,
});

export const mapInventoryItem = (item) => ({
  key: item.id,
  id: item.id,
  materialCode: item.materialCode || '-',
  materialName: item.materialName || '-',
  specification: item.specification || '-',
  model: item.model || '-',
  warehouse: item.warehouse || '-',
  shelf: item.shelf || '-',
  batchNumber: item.batchNumber || '-',
  supplier: item.supplier || '-',
  manufacturer: item.manufacturer || '-',
  currentStock: item.currentStock ?? 0,
  unit: item.unit || '',
  productionDate: item.productionDate || '',
  expiryDate: item.expiryDate || '',
});

export const mapCheckRecord = (item, inventoryById = {}) => {
  const inventory = inventoryById[item.inventoryId] || {};
  const actualNum = item.actualNum;
  const sysNum = item.sysNum ?? inventory.currentStock ?? 0;
  const diffQuantity = actualNum === null || actualNum === undefined ? null : actualNum - sysNum;
  const checkState = actualNum === null || actualNum === undefined ? 'unchecked' : 'checked';
  const resultMeta = CHECK_RESULT_META[item.cheStatus] || { text: '待盘点', color: 'default' };

  return {
    key: item.id,
    id: item.id,
    cheCode: item.cheCode || '-',
    inventoryId: item.inventoryId,
    inventoryName: item.inventoryName || inventory.materialName || '-',
    materialCode: inventory.materialCode || '-',
    materialName: inventory.materialName || item.inventoryName || '-',
    specification: inventory.specification || '-',
    model: inventory.model || '-',
    warehouse: inventory.warehouse || '-',
    shelf: inventory.shelf || '-',
    batchNumber: inventory.batchNumber || '-',
    supplier: inventory.supplier || '-',
    manufacturer: inventory.manufacturer || '-',
    sysNum,
    actualNum,
    diffReason: item.diffReason || '',
    cheStatus: item.cheStatus,
    resultText: resultMeta.text,
    resultColor: resultMeta.color,
    status: item.status,
    checkState,
    checkDate: item.cheDate || item.cdate || '',
    createdAt: item.cdate || '',
    updatedAt: item.udate || '',
    diffQuantity,
  };
};

export const fetchInventoryCatalog = async (params = {}) => {
  const response = await api.get('/api/scm/inventory', {
    pageNum: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    ...params,
  });
  const { records, total } = extractPagedData(response);
  return {
    records: records.map(mapInventoryItem),
    total,
  };
};

export const fetchCheckRecords = async (status, params = {}) => {
  const response = await api.post('/api/checkInventory/selectModelList', {
    status,
    pageNum: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    ...params,
  });
  return extractPagedData(response);
};

export const createCheckRecord = (payload) => api.post('/api/checkInventory/addCheckInventory', payload);

export const confirmCheckRecord = (payload) => api.post('/api/checkInventory/Checknow', payload);

export const archiveCheckRecord = (id) => api.post('/api/checkInventory/reCheck', { id });
