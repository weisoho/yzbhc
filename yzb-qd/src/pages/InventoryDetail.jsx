import React, { useState, useEffect } from 'react';
import { Table, Card, Input, Select, DatePicker, Button, Space, Row, Col, Tag, Badge, Modal, Form, InputNumber, message } from 'antd';
import { SearchOutlined, ExportOutlined, EditOutlined, WarningOutlined, AlertOutlined } from '@ant-design/icons';
import api from '../utils/api.js';

const { RangePicker } = DatePicker;

const InventoryDetail = () => {
  const [inventoryDetails, setInventoryDetails] = useState([]);
  const [searchParams, setSearchParams] = useState({
    materialCode: '',
    materialName: '',
    supplier: '',
    manufacturer: ''
  });
  const [adjustModalVisible, setAdjustModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [adjustForm] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  // 定义表格列
  const columns = [
    {
      title: (
        <input 
          type="checkbox" 
          checked={selectedRowKeys.length === inventoryDetails.length && inventoryDetails.length > 0}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedRowKeys(inventoryDetails.map(item => item.key));
            } else {
              setSelectedRowKeys([]);
            }
          }}
        />
      ),
      dataIndex: 'checkbox',
      key: 'checkbox',
      width: 60,
      render: (_, record) => (
        <input 
          type="checkbox" 
          checked={selectedRowKeys.includes(record.key)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedRowKeys([...selectedRowKeys, record.key]);
            } else {
              setSelectedRowKeys(selectedRowKeys.filter(key => key !== record.key));
            }
          }}
        />
      )
    },
    { title: '物资编码', dataIndex: 'materialCode', key: 'materialCode', width: 120 },
    { title: '物资名称', dataIndex: 'materialName', key: 'materialName', width: 150 },
    { title: '物资类型', dataIndex: 'category', key: 'category', width: 100 },
    { title: '规格', dataIndex: 'specification', key: 'specification', width: 120 },
    { title: '型号', dataIndex: 'model', key: 'model', width: 100 },
    { title: '批号', dataIndex: 'batchNumber', key: 'batchNumber', width: 120 },
    { title: '生产日期', dataIndex: 'productionDate', key: 'productionDate', width: 120 },
    { title: '失效日期', dataIndex: 'expiryDate', key: 'expiryDate', width: 120 },
    { title: '最小包装', dataIndex: 'minPackage', key: 'minPackage', width: 120 },
    { title: '单位', dataIndex: 'unit', key: 'unit', width: 80 },
    { title: '采购价格', dataIndex: 'purchasePrice', key: 'purchasePrice', width: 100, render: (price) => `¥${price?.toFixed(2) || '0.00'}` },
    { title: '库存数量', dataIndex: 'currentStock', key: 'currentStock', width: 100, 
      render: (currentStock, record) => {
        let color = 'default';
        if (currentStock <= (record.minStock || 0)) color = 'red';
        else if (currentStock <= (record.maxStock || 0)) color = 'orange';
        else color = 'green';
        return <span style={{ color: color }}>{currentStock}</span>;
      }
    },
    { title: '注册证号', dataIndex: 'registrationNumber', key: 'registrationNumber', width: 150 },
    { title: '供应商', dataIndex: 'supplier', key: 'supplier', width: 120 },
    { title: '生产厂家', dataIndex: 'manufacturer', key: 'manufacturer', width: 150 },
    { title: '库存状态', dataIndex: 'stockStatus', key: 'stockStatus', width: 100,
      render: (status) => {
        const statusMap = {
          'normal': { color: 'green', text: '正常' },
          'low': { color: 'red', text: '缺货' },
          'high': { color: 'orange', text: '积压' },
          'out': { color: 'purple', text: '停用' }
        };
        const config = statusMap[status] || statusMap.normal;
        return <Tag color={config.color}>{config.text}</Tag>;
      }
    },
    { title: '入库时间', dataIndex: 'lastInbound', key: 'lastInbound', width: 120 },
    {
      title: '操作', 
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space size="middle">
          <a key={`detail-${record.key}`} onClick={() => handleViewDetail(record)}>明细</a>
          <a key={`adjust-${record.key}`} onClick={() => handleAdjustStock(record)}>调整</a>
        </Space>
      )
    },
  ];

  // 加载状态
  const [loading, setLoading] = useState(false);

  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // 查询处理函数
  const handleSearch = async () => {
    try {
      setLoading(true);
      const params = {
        pageNum: 1,
        pageSize: pageSize,
        materialCode: searchParams.materialCode,
        materialName: searchParams.materialName,
        supplierName: searchParams.supplier,
        manufacturer: searchParams.manufacturer
      };
      const response = await api.get('/api/scm/inventory', params);
      if (response.code === 1 && response.data) {
        const inventoryList = response.data.records.map(item => ({
          key: item.id,
          materialCode: item.materialCode,
          materialName: item.materialName,
          category: item.materialType,
          specification: item.specification,
          model: item.model,
          batchNumber: item.batchNumber,
          productionDate: item.productionDate,
          expiryDate: item.expiryDate,
          minPackage: item.minPackage,
          unit: item.unit,
          purchasePrice: item.purchasePrice,
          currentStock: item.stockQuantity,
          registrationNumber: item.registrationNumber,
          supplier: item.supplierName,
          manufacturer: item.manufacturer,
          stockStatus: item.status,
          lastInbound: item.lastInboundDate,
          warning: item.warning,
          minStock: item.minStock,
          maxStock: item.maxStock,
          expiryWarningDays: item.expiryWarningDays,
          batches: item.batches || []
        }));
        setInventoryDetails(inventoryList);
        setCurrentPage(1);
      } else {
        message.error('查询库存数据失败');
      }
    } catch (error) {
      console.error('查询库存数据失败:', error);
      message.error('查询库存数据失败');
    } finally {
      setLoading(false);
    }
  };

  // 重置查询条件
  const handleReset = () => {
    setSearchParams({
      materialCode: '',
      materialName: '',
      supplier: '',
      manufacturer: ''
    });
    loadInventoryDetails();
  };

  // 导出功能
  const handleExport = () => {
    const dataStr = JSON.stringify(inventoryDetails, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `盘点明细查询_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // 打开调整设置模态框
  const handleAdjustStock = (record) => {
    setCurrentRecord(record);
    adjustForm.setFieldsValue({
      minStock: record.minStock,
      maxStock: record.maxStock,
      packageQuantity: 1,
      packageUnit: record.unit,
      expiryWarningDays: record.expiryWarningDays || 30,
      reason: ''
    });
    setAdjustModalVisible(true);
  };

  // 打开明细模态框
  const handleViewDetail = (record) => {
    setCurrentRecord(record);
    setDetailModalVisible(true);
  };

  // 提交设置调整
  const handleAdjustSubmit = async () => {
    try {
      setLoading(true);
      const values = await adjustForm.validateFields();
      const { minStock, maxStock, expiryWarningDays, reason } = values;
      
      // 验证最高库存预警值必须大于或等于最低库存预警值
      if (maxStock < minStock) {
        message.error('最高库存预警值必须大于或等于最低库存预警值');
        return;
      }

      // 调用后端API调整库存阈值
      const adjustData = {
        minStock: minStock,
        maxStock: maxStock,
        expiryWarningDays: expiryWarningDays,
        reason: reason
      };
      
      const response = await api.put(`/api/scm/inventory/${currentRecord.key}/adjust`, adjustData);
      if (response.code === 1) {
        message.success('设置调整成功');
        setAdjustModalVisible(false);
        adjustForm.resetFields();
        loadInventoryDetails(); // 重新加载库存数据
      } else {
        message.error(response.message || '设置调整失败');
      }
    } catch (error) {
      console.error('设置调整失败:', error);
      message.error('设置调整失败，请检查网络连接或联系管理员');
    } finally {
      setLoading(false);
    }
  };

  // 获取库存状态
  const getStockStatus = (currentStock, minStock, maxStock) => {
    if (currentStock <= minStock) return 'low';
    if (currentStock > maxStock) return 'high';
    return 'normal';
  };

  // 获取库存预警
  const getStockWarning = (currentStock, minStock, maxStock) => {
    if (currentStock <= minStock) return 'low_stock';
    if (currentStock > maxStock) return 'overstock';
    return null;
  };

  // 关闭调整模态框
  const handleAdjustCancel = () => {
    setAdjustModalVisible(false);
    adjustForm.resetFields();
  };

  // 加载库存数据
  const loadInventoryDetails = async () => {
    try {
      setLoading(true);
      const params = {
        pageNum: currentPage,
        pageSize: pageSize
      };
      const response = await api.get('/api/scm/inventory', params);
      if (response.code === 1 && response.data) {
        const inventoryList = response.data.records.map(item => ({
          key: item.id,
          materialCode: item.materialCode,
          materialName: item.materialName,
          category: item.materialType,
          specification: item.specification,
          model: item.model,
          batchNumber: item.batchNumber,
          productionDate: item.productionDate,
          expiryDate: item.expiryDate,
          minPackage: item.minPackage,
          unit: item.unit,
          purchasePrice: item.purchasePrice,
          currentStock: item.stockQuantity,
          registrationNumber: item.registrationNumber,
          supplier: item.supplierName,
          manufacturer: item.manufacturer,
          stockStatus: item.status,
          lastInbound: item.lastInboundDate,
          warning: item.warning,
          minStock: item.minStock,
          maxStock: item.maxStock,
          expiryWarningDays: item.expiryWarningDays,
          batches: item.batches || []
        }));
        setInventoryDetails(inventoryList);
      } else {
        message.error('加载库存数据失败');
      }
    } catch (error) {
      console.error('加载库存数据失败:', error);
      message.error('加载库存数据失败');
    } finally {
      setLoading(false);
    }
  };

  // 组件加载时生成初始数据
  useEffect(() => {
    loadInventoryDetails();
  }, []);

  return (
    <div style={{ padding: '0 16px' }}>
      <h1 style={{ marginBottom: 24 }}>物资库存</h1>
      
      <Card style={{ padding: '16px' }}>
        <div style={{ marginBottom: '16px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '8px', fontWeight: '500', minWidth: '80px' }}>物资编码：</span>
            <Input
              placeholder="请输入物资编码"
              value={searchParams.materialCode}
              onChange={(e) => setSearchParams({...searchParams, materialCode: e.target.value})}
              style={{ width: '180px' }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '8px', fontWeight: '500', minWidth: '80px' }}>物资名称：</span>
            <Input
              placeholder="请输入物资名称"
              value={searchParams.materialName}
              onChange={(e) => setSearchParams({...searchParams, materialName: e.target.value})}
              style={{ width: '180px' }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '8px', fontWeight: '500', minWidth: '80px' }}>供应商：</span>
            <Input
              placeholder="请输入供应商"
              value={searchParams.supplier}
              onChange={(e) => setSearchParams({...searchParams, supplier: e.target.value})}
              style={{ width: '180px' }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '8px', fontWeight: '500', minWidth: '80px' }}>生产厂家：</span>
            <Input
              placeholder="请输入生产厂家"
              value={searchParams.manufacturer}
              onChange={(e) => setSearchParams({...searchParams, manufacturer: e.target.value})}
              style={{ width: '180px' }}
            />
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
            查询
          </Button>
          <Button icon={<ExportOutlined />} onClick={handleExport}>
            导出库存报表
          </Button>
        </div>
      </Card>

      <Card style={{ marginTop: 16 }}>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span>共 {inventoryDetails.length} 条记录</span>
            <span style={{ marginLeft: 16, color: '#ff4d4f' }}>
              预警物资: {inventoryDetails.filter(item => item.warning).length} 种
            </span>
            <span style={{ marginLeft: 16, color: '#faad14' }}>
              缺货物资: {inventoryDetails.filter(item => item.stockStatus === 'low').length} 种
            </span>
          </div>
        </div>
        <Table 
          columns={columns} 
          dataSource={inventoryDetails} 
          loading={loading}
          pagination={{ 
            current: currentPage,
            pageSize: pageSize,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
            style: {
              display: 'flex',
              justifyContent: 'center',
              marginTop: '16px'
            },
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size);
              loadInventoryDetails();
            }
          }}
          scroll={{ x: 1400 }}
          size="small"
          rowKey="key"
        />
      </Card>

      {/* 调整设置模态框 */}
      <Modal
        title="调整设置"
        open={adjustModalVisible}
        onOk={handleAdjustSubmit}
        onCancel={handleAdjustCancel}
        width={600}
        okText="确认设置"
        cancelText="取消"
      >
        {currentRecord && (
          <Form
            form={adjustForm}
            layout="vertical"
            style={{ marginTop: 20 }}
          >
            <Form.Item label="物资信息">
              <div style={{ padding: '8px 12px', background: '#f5f5f5', borderRadius: 4 }}>
                <div><strong>物资编码：</strong>{currentRecord.materialCode}</div>
                <div><strong>物资名称：</strong>{currentRecord.materialName}</div>
                <div><strong>当前库存：</strong>{currentRecord.currentStock} {currentRecord.unit}</div>
              </div>
            </Form.Item>

            <Form.Item
              label="最低库存预警值"
              name="minStock"
              rules={[
                { required: true, message: '请输入最低库存预警值' },
                { type: 'number', min: 0, message: '预警值不能为负数' }
              ]}
            >
              <InputNumber 
                style={{ width: '100%' }} 
                placeholder="请输入最低库存预警值"
                min={0}
              />
            </Form.Item>

            <Form.Item
              label="最高库存预警值"
              name="maxStock"
              rules={[
                { required: true, message: '请输入最高库存预警值' },
                { type: 'number', min: 0, message: '预警值不能为负数' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const minStock = getFieldValue('minStock');
                    if (!value || !minStock || value >= minStock) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('最高库存预警值必须大于或等于最低库存预警值'));
                  },
                }),
              ]}
            >
              <InputNumber 
                style={{ width: '100%' }} 
                placeholder="请输入最高库存预警值"
                min={0}
              />
            </Form.Item>

            <Form.Item
              label="打包规格"
              style={{ marginBottom: 0 }}
            >
              <div style={{ display: 'flex', gap: '16px' }}>
                <Form.Item
                  name="packageQuantity"
                  rules={[
                    { required: true, message: '请输入内含数量' },
                    { type: 'number', min: 1, message: '内含数量必须大于0' }
                  ]}
                  style={{ flex: 1, marginBottom: 0 }}
                >
                  <InputNumber 
                    style={{ width: '100%' }} 
                    placeholder="内含数量"
                    min={1}
                  />
                </Form.Item>
                <Form.Item
                  name="packageUnit"
                  rules={[{ required: true, message: '请输入打包单位' }]}
                  style={{ flex: 1, marginBottom: 0 }}
                >
                  <Input 
                    placeholder="打包单位，如：支、瓶、包、台等"
                  />
                </Form.Item>
              </div>
            </Form.Item>

            <Form.Item
              label="近效期提醒设置"
              name="expiryWarningDays"
              rules={[
                { required: true, message: '请输入近效期提醒天数' },
                { type: 'number', min: 1, message: '提醒天数必须大于0' }
              ]}
            >
              <InputNumber 
                style={{ width: '100%' }} 
                placeholder="请输入有效期前多少天提醒"
                min={1}
                addonAfter="天"
              />
            </Form.Item>

            <Form.Item
              label="调整原因"
              name="reason"
              rules={[{ required: true, message: '请输入调整原因' }]}
            >
              <Input.TextArea 
                placeholder="请输入调整原因，如：库存策略调整、单位变更等"
                rows={3}
              />
            </Form.Item>
          </Form>
        )}
      </Modal>

      {/* 明细模态框 */}
      <Modal
        title="物资明细"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        width={1400}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            关闭
          </Button>,
        ]}
      >
        {currentRecord && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <Table
                columns={[
                  { title: '物资编码', dataIndex: 'materialCode', key: 'materialCode', width: 150, align: 'center', ellipsis: false },
                  { title: '物资名称', dataIndex: 'materialName', key: 'materialName', width: 150, render: () => currentRecord.materialName, align: 'center', ellipsis: false },
                  { title: '物资类型', dataIndex: 'category', key: 'category', width: 100, render: () => currentRecord.category, align: 'center', ellipsis: false },
                  { title: '规格', dataIndex: 'specification', key: 'specification', width: 120, render: () => currentRecord.specification, align: 'center', ellipsis: false },
                  { title: '型号', dataIndex: 'model', key: 'model', width: 100, render: () => currentRecord.model, align: 'center', ellipsis: false },
                  { title: '批号', dataIndex: 'batchNumber', key: 'batchNumber', width: 120, align: 'center', ellipsis: false },
                  { title: '生产日期', dataIndex: 'productionDate', key: 'productionDate', width: 120, align: 'center', ellipsis: false },
                  { title: '失效日期', dataIndex: 'expiryDate', key: 'expiryDate', width: 120, align: 'center', ellipsis: false },
                  { title: '最小包装', dataIndex: 'minPackage', key: 'minPackage', width: 120, render: () => currentRecord.minPackage, align: 'center', ellipsis: false },
                  { title: '单位', dataIndex: 'unit', key: 'unit', width: 80, render: () => currentRecord.unit, align: 'center', ellipsis: false },
                  { title: '采购价格', dataIndex: 'purchasePrice', key: 'purchasePrice', width: 100, render: () => `¥${currentRecord.purchasePrice?.toFixed(2) || '0.00'}`, align: 'center', ellipsis: false },
                  { title: '数量', dataIndex: 'quantity', key: 'quantity', width: 100, align: 'center', ellipsis: false },
                  { title: '注册证号', dataIndex: 'registrationNumber', key: 'registrationNumber', width: 150, render: () => currentRecord.registrationNumber, align: 'center', ellipsis: false },
                  { title: '供应商', dataIndex: 'supplier', key: 'supplier', width: 120, render: () => currentRecord.supplier, align: 'center', ellipsis: false },
                  { title: '生产厂家', dataIndex: 'manufacturer', key: 'manufacturer', width: 150, render: () => currentRecord.manufacturer, align: 'center', ellipsis: false },
                  { title: '入库时间', dataIndex: 'inboundDate', key: 'inboundDate', width: 120, align: 'center', ellipsis: false },
                ]}
                dataSource={currentRecord.batches || []}
                pagination={false}
                rowKey="batchKey"
                scroll={{ x: 1600 }}
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default InventoryDetail;
