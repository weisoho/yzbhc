import React, { useState, useEffect } from 'react';
import moment from 'moment';
import {
  Card,
  Table,
  Button,
  Space,
  Input,
  Select,
  DatePicker,
  Tag,
  Modal,
  Form,
  Row,
  Col,
  message,
  Typography,
  InputNumber,
  Checkbox,
  Spin
} from 'antd';
import api from '../utils/api.js';
import {
  SearchOutlined,
  PlusOutlined,
  DeleteOutlined,
  ReloadOutlined,
  SaveOutlined,
  DownloadOutlined
} from '@ant-design/icons';

const { Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;

const ManualStockIn = () => {
  const [searchForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]); // 数据库中的历史数据
  const [newItems, setNewItems] = useState([]); // 待提交的新增数据
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // 物资选择相关状态
  const [materialSelectModalVisible, setMaterialSelectModalVisible] = useState(false);
  const [materialCatalog, setMaterialCatalog] = useState([]);
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [catalogSelectAll, setCatalogSelectAll] = useState(false);
  const [catalogCurrentPage, setCatalogCurrentPage] = useState(1);
  const [catalogPageSize, setCatalogPageSize] = useState(10);
  const [materialSearchForm] = Form.useForm();

  // 加载数据库中的入库记录
  const fetchData = async () => {
    try {
      setLoading(true);
      const searchValues = searchForm.getFieldsValue();
      const response = await api.get('/api/scm/stock-in/items', {
        pageNum: pagination.current,
        pageSize: pagination.pageSize,
        productCode: searchValues.productCode,
        productName: searchValues.productName,
        supplier: searchValues.supplierName,
        manufacturer: searchValues.manufacturer
      });

      if (response.code === 1 && response.data) {
        const records = response.data.records.map(item => ({
          ...item,
          key: item.id,
          productCode: item.materialCode,
          productName: item.materialName,
          orderUnit: item.unit,
          instockQuantity: item.stockInQuantity,
          isNew: false
        }));
        setData(records);
        setPagination(prev => ({
          ...prev,
          total: response.data.total
        }));
      }
    } catch (error) {
      console.error('加载入库明细失败:', error);
      message.error('加载数据失败');
    } finally {
      setLoading(false);
    }
  };

  // 初始加载
  useEffect(() => {
    fetchData();
  }, [pagination.current, pagination.pageSize]);

  // 加载物资目录
  const fetchMaterialCatalog = async () => {
    try {
      const response = await api.get('/api/scm/materials/enabled');
      if (response.code === 1) {
        const catalog = response.data.map((item, index) => ({
          ...item,
          key: item.id || `catalog_${index}`,
          materialId: item.id,
          materialCode: item.materialCode,
          materialName: item.name,
          supplierName: item.supplierName,
          unitPrice: Number(item.purchasePrice || 0),
          selected: false,
          quantity: 1,
          batchNumber: '',
          productionDate: null,
          expiryDate: null
        }));
        setMaterialCatalog(catalog);
        setFilteredMaterials(catalog);
      }
    } catch (error) {
      console.error('获取物资目录失败:', error);
    }
  };

  // 搜索处理
  const handleSearch = () => {
    setPagination(prev => ({ ...prev, current: 1 }));
    fetchData();
  };

  // 重置搜索
  const handleReset = () => {
    searchForm.resetFields();
    setPagination(prev => ({ ...prev, current: 1 }));
    fetchData();
  };

  // 打开物资选择
  const handleOpenMaterialSelect = () => {
    setMaterialSelectModalVisible(true);
    fetchMaterialCatalog();
    materialSearchForm.resetFields();
    setCatalogSelectAll(false);
    setCatalogCurrentPage(1);
  };

  // 关闭物资选择
  const handleCloseMaterialSelect = () => {
    setMaterialSelectModalVisible(false);
  };

  // 物资目录搜索
  const handleSearchMaterials = (values) => {
    const filtered = materialCatalog.filter(item => {
      const matchesCode = !values.materialCode || item.materialCode.includes(values.materialCode);
      const matchesName = !values.materialName || item.materialName.includes(values.materialName);
      const matchesSupplier = !values.supplier || (item.supplierName && item.supplierName.includes(values.supplier));
      return matchesCode && matchesName && matchesSupplier;
    });
    setFilteredMaterials(filtered);
    setCatalogCurrentPage(1);
  };

  // 物资全选
  const handleCatalogSelectAll = (e) => {
    const checked = e.target.checked;
    setCatalogSelectAll(checked);
    const startIndex = (catalogCurrentPage - 1) * catalogPageSize;
    const endIndex = startIndex + catalogPageSize;
    const currentPageItems = filteredMaterials.slice(startIndex, endIndex);
    
    const newFiltered = [...filteredMaterials];
    currentPageItems.forEach((item, idx) => {
      newFiltered[startIndex + idx] = { ...item, selected: checked };
    });
    setFilteredMaterials(newFiltered);
  };

  // 物资单选
  const handleMaterialCatalogSelect = (key) => {
    const newFiltered = filteredMaterials.map(item => 
      item.key === key ? { ...item, selected: !item.selected } : item
    );
    setFilteredMaterials(newFiltered);
    
    const startIndex = (catalogCurrentPage - 1) * catalogPageSize;
    const endIndex = startIndex + catalogPageSize;
    const currentPageItems = newFiltered.slice(startIndex, endIndex);
    setCatalogSelectAll(currentPageItems.every(i => i.selected));
  };

  // 确认物资选择
  const handleConfirmMaterialSelection = () => {
    const selected = filteredMaterials.filter(i => i.selected);
    if (selected.length === 0) {
      message.warning('请选择物资');
      return;
    }

    const newItemsToAdd = selected.map(item => ({
      key: `new_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      productCode: item.materialCode,
      productName: item.materialName,
      materialType: item.materialType,
      materialId: item.materialId,
      specification: item.specification,
      model: item.model,
      minPackage: item.minPackage,
      manufacturer: item.manufacturer,
      supplierName: item.supplierName,
      registrationNumber: item.registrationNumber,
      orderUnit: item.unit,
      instockQuantity: item.quantity || 1,
      batchNumber: item.batchNumber || '',
      productionDate: item.productionDate ? item.productionDate.format('YYYY-MM-DD') : null,
      expiryDate: item.expiryDate ? item.expiryDate.format('YYYY-MM-DD') : null,
      purchasePrice: item.unitPrice || 0,
      purchaseAmount: (item.unitPrice || 0) * (item.quantity || 1),
      isNew: true
    }));

    setNewItems([...newItemsToAdd, ...newItems]);
    setMaterialSelectModalVisible(false);
    message.success(`已添加 ${selected.length} 项待入库物资`);
  };

  // 提交入库
  const handleSubmitStockIn = async () => {
    if (newItems.length === 0) {
      message.warning('没有待提交的入库明细');
      return;
    }

    // 简单验证
    const invalidItem = newItems.find(i => !i.materialId || !i.productName || !i.batchNumber || !i.productionDate || !i.expiryDate || !i.instockQuantity);
    if (invalidItem) {
      message.error(`物资 ${invalidItem.productName || invalidItem.productCode} 的主档、批号、生产日期、失效日期或入库数量不完整`);
      return;
    }

    try {
      setLoading(true);
      const saveData = {
        stockInType: '初始化入库',
        operatorName: JSON.parse(localStorage.getItem('userInfo') || '{}').realName || JSON.parse(localStorage.getItem('userInfo') || '{}').userName || '管理员',
        remark: '系统初始化入库',
        items: newItems.map(i => ({
          materialId: i.materialId,
          materialCode: i.productCode,
          materialName: i.productName,
          materialType: i.materialType,
          specification: i.specification,
          model: i.model,
          minPackage: i.minPackage,
          unit: i.orderUnit,
          purchasePrice: i.purchasePrice,
          orderQuantity: i.instockQuantity, // 初始化入库，订货数量等于入库数量
          stockInQuantity: i.instockQuantity,
          supplierName: i.supplierName,
          manufacturer: i.manufacturer,
          registrationNumber: i.registrationNumber,
          batchNumber: i.batchNumber,
          productionDate: i.productionDate,
          expiryDate: i.expiryDate
        }))
      };

      const response = await api.post('/api/scm/stock-in/manual', saveData);
      if (response.code === 1) {
        message.success('入库成功');
        setNewItems([]);
        fetchData();
      } else {
        message.error(response.message || '入库失败');
      }
    } catch (error) {
      console.error('入库失败:', error);
      message.error('系统异常，入库失败');
    } finally {
      setLoading(false);
    }
  };

  // 删除待入库项
  const handleDeleteNewItem = (key) => {
    setNewItems(newItems.filter(i => i.key !== key));
  };

  // 修改待入库项
  const handleUpdateNewItem = (key, field, value) => {
    setNewItems(newItems.map(item => {
      if (item.key === key) {
        const updated = { ...item, [field]: value };
        if (field === 'instockQuantity' || field === 'purchasePrice') {
          updated.purchaseAmount = (updated.instockQuantity || 0) * (updated.purchasePrice || 0);
        }
        return updated;
      }
      return item;
    }));
  };

  const columns = [
    {
      title: '状态',
      key: 'status',
      width: 80,
      render: (_, record) => record.isNew ? <Tag color="blue">待提交</Tag> : <Tag color="green">已入库</Tag>
    },
    { title: '物资编码', dataIndex: 'productCode', key: 'productCode', width: 120 },
    { title: '物资名称', dataIndex: 'productName', key: 'productName', width: 150 },
    { title: '规格', dataIndex: 'specification', key: 'specification', width: 120 },
    { title: '型号', dataIndex: 'model', key: 'model', width: 100 },
    { title: '最小包装', dataIndex: 'minPackage', key: 'minPackage', width: 120 },
    {
      title: '批号',
      key: 'batchNumber',
      width: 150,
      render: (_, record) => record.isNew ? (
        <Input 
          value={record.batchNumber} 
          onChange={e => handleUpdateNewItem(record.key, 'batchNumber', e.target.value)}
          placeholder="必填"
          size="small"
        />
      ) : record.batchNumber
    },
    {
      title: '生产日期',
      key: 'productionDate',
      width: 150,
      render: (_, record) => record.isNew ? (
        <DatePicker 
          value={record.productionDate ? moment(record.productionDate) : null}
          onChange={date => handleUpdateNewItem(record.key, 'productionDate', date ? date.format('YYYY-MM-DD') : null)}
          size="small"
        />
      ) : record.productionDate
    },
    {
      title: '失效日期',
      key: 'expiryDate',
      width: 150,
      render: (_, record) => record.isNew ? (
        <DatePicker 
          value={record.expiryDate ? moment(record.expiryDate) : null}
          onChange={date => handleUpdateNewItem(record.key, 'expiryDate', date ? date.format('YYYY-MM-DD') : null)}
          size="small"
        />
      ) : record.expiryDate
    },
    {
      title: '入库数量',
      key: 'instockQuantity',
      width: 120,
      render: (_, record) => record.isNew ? (
        <InputNumber 
          min={1} 
          value={record.instockQuantity} 
          onChange={val => handleUpdateNewItem(record.key, 'instockQuantity', val)}
          size="small"
        />
      ) : record.instockQuantity
    },
    { title: '单位', dataIndex: 'orderUnit', key: 'orderUnit', width: 80 },
    {
      title: '单价',
      key: 'purchasePrice',
      width: 120,
      render: (_, record) => record.isNew ? (
        <InputNumber 
          min={0} 
          value={record.purchasePrice} 
          onChange={val => handleUpdateNewItem(record.key, 'purchasePrice', val)}
          size="small"
          prefix="¥"
        />
      ) : `¥${record.purchasePrice?.toFixed(2)}`
    },
    {
      title: '金额',
      key: 'purchaseAmount',
      width: 120,
      render: (_, record) => `¥${record.purchaseAmount?.toFixed(2)}`
    },
    { title: '供应商', dataIndex: 'supplierName', key: 'supplierName', width: 150 },
    { title: '生产厂家', dataIndex: 'manufacturer', key: 'manufacturer', width: 150 },
    {
      title: '操作',
      key: 'action',
      width: 80,
      fixed: 'right',
      render: (_, record) => record.isNew ? (
        <Button type="link" danger onClick={() => handleDeleteNewItem(record.key)}>删除</Button>
      ) : null
    }
  ];

  return (
    <div style={{ padding: '0 16px' }}>
      <h1 style={{ marginBottom: 24 }}>初始化入库</h1>
      
      <Card style={{ marginBottom: 24 }}>
        <Form form={searchForm} layout="inline">
          <Form.Item name="productCode" label="物资编码">
            <Input placeholder="请输入物资编码" allowClear style={{ width: 160 }} />
          </Form.Item>
          <Form.Item name="productName" label="物资名称">
            <Input placeholder="请输入物资名称" allowClear style={{ width: 160 }} />
          </Form.Item>
          <Form.Item name="supplierName" label="供应商">
            <Input placeholder="请输入供应商" allowClear style={{ width: 160 }} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>查询</Button>
              <Button onClick={handleReset}>重置</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
          <Space>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenMaterialSelect}>新增入库</Button>
            <Button icon={<DownloadOutlined />}>导出数据</Button>
          </Space>
          <Button 
            type="primary" 
            icon={<SaveOutlined />} 
            onClick={handleSubmitStockIn} 
            disabled={newItems.length === 0}
            loading={loading}
          >
            确认提交入库
          </Button>
        </div>
        
        <Table
          columns={columns}
          dataSource={[...newItems, ...data]}
          loading={loading}
          scroll={{ x: 2200 }}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条历史记录`,
            onChange: (page, pageSize) => {
              setPagination(prev => ({ ...prev, current: page, pageSize }));
            }
          }}
        />
      </Card>

      {/* 物资选择弹窗 */}
      <Modal
        title="选择物资"
        open={materialSelectModalVisible}
        onCancel={handleCloseMaterialSelect}
        width={1200}
        footer={null}
      >
        <Card style={{ marginBottom: 16 }}>
          <Form form={materialSearchForm} layout="inline" onFinish={handleSearchMaterials}>
            <Form.Item name="materialCode" label="编码">
              <Input placeholder="物资编码" allowClear />
            </Form.Item>
            <Form.Item name="materialName" label="名称">
              <Input placeholder="物资名称" allowClear />
            </Form.Item>
            <Form.Item name="supplier" label="供应商">
              <Input placeholder="供应商" allowClear />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">搜索</Button>
            </Form.Item>
          </Form>
        </Card>

        <div style={{ marginBottom: 16 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#fafafa' }}>
                <th style={{ padding: 12, border: '1px solid #f0f0f0' }}>
                  <Checkbox checked={catalogSelectAll} onChange={handleCatalogSelectAll} />
                </th>
                <th style={{ padding: 12, border: '1px solid #f0f0f0' }}>编码</th>
                <th style={{ padding: 12, border: '1px solid #f0f0f0' }}>名称</th>
                <th style={{ padding: 12, border: '1px solid #f0f0f0' }}>规格</th>
                <th style={{ padding: 12, border: '1px solid #f0f0f0' }}>厂家</th>
                <th style={{ padding: 12, border: '1px solid #f0f0f0' }}>供应商</th>
                <th style={{ padding: 12, border: '1px solid #f0f0f0' }}>最小包装</th>
                <th style={{ padding: 12, border: '1px solid #f0f0f0' }}>单价</th>
                <th style={{ padding: 12, border: '1px solid #f0f0f0' }}>数量</th>
              </tr>
            </thead>
            <tbody>
              {filteredMaterials.slice((catalogCurrentPage-1)*catalogPageSize, catalogCurrentPage*catalogPageSize).map(item => (
                <tr key={item.key}>
                  <td style={{ padding: 12, border: '1px solid #f0f0f0', textAlign: 'center' }}>
                    <Checkbox checked={item.selected} onChange={() => handleMaterialCatalogSelect(item.key)} />
                  </td>
                  <td style={{ padding: 12, border: '1px solid #f0f0f0' }}>{item.materialCode}</td>
                  <td style={{ padding: 12, border: '1px solid #f0f0f0' }}>{item.materialName}</td>
                  <td style={{ padding: 12, border: '1px solid #f0f0f0' }}>{item.specification}</td>
                  <td style={{ padding: 12, border: '1px solid #f0f0f0' }}>{item.manufacturer}</td>
                  <td style={{ padding: 12, border: '1px solid #f0f0f0' }}>{item.supplierName}</td>
                  <td style={{ padding: 12, border: '1px solid #f0f0f0' }}>{item.minPackage}</td>
                  <td style={{ padding: 12, border: '1px solid #f0f0f0' }}>¥{item.unitPrice?.toFixed(2)}</td>
                  <td style={{ padding: 12, border: '1px solid #f0f0f0' }}>
                    <InputNumber 
                      min={1} 
                      value={item.quantity} 
                      onChange={val => {
                        const newFiltered = filteredMaterials.map(i => i.key === item.key ? { ...i, quantity: val } : i);
                        setFilteredMaterials(newFiltered);
                      }} 
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button disabled={catalogCurrentPage === 1} onClick={() => setCatalogCurrentPage(c => c - 1)}>上一页</Button>
            <span style={{ alignSelf: 'center' }}>第 {catalogCurrentPage} 页</span>
            <Button 
              disabled={catalogCurrentPage * catalogPageSize >= filteredMaterials.length} 
              onClick={() => setCatalogCurrentPage(c => c + 1)}
            >
              下一页
            </Button>
          </div>
          <Space>
            <Button onClick={handleCloseMaterialSelect}>取消</Button>
            <Button type="primary" onClick={handleConfirmMaterialSelection}>确认选择</Button>
          </Space>
        </div>
      </Modal>
    </div>
  );
};

export default ManualStockIn;
