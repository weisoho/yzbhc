import React, { useState, useEffect } from 'react';
import { Table, Card, Input, Select, DatePicker, Button, Space, Row, Col, Tag, Badge, Modal, Form, InputNumber, message } from 'antd';
import { SearchOutlined, ExportOutlined, EditOutlined, WarningOutlined, AlertOutlined } from '@ant-design/icons';

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

  // 库存明细数据
  const inventoryDetailsData = [
    {
      key: '1',
      materialCode: 'YZS-001',
      materialName: '一次性注射器',
      category: '医疗器械',
      specification: '10ml',
      model: '标准型',
      minPackage: '100支/箱',
      unit: '支',
      purchasePrice: 2.50,
      currentStock: 750,
      registrationNumber: '国械注准20203150001',
      supplier: '山东威高集团',
      manufacturer: '山东威高集团医用高分子制品股份有限公司',
      stockStatus: 'normal',
      lastInbound: '2024-01-15',
      warning: null,
      expiryWarningDays: 30,
      // 不同入库时间的批次信息
      batches: [
        {
          batchKey: '1-1',
          materialCode: 'YZS-001-01',
          batchNumber: '20240101',
          productionDate: '2024-01-01',
          expiryDate: '2025-01-01',
          inboundDate: '2024-01-15',
          quantity: 300,
          status: 'normal'
        },
        {
          batchKey: '1-2',
          materialCode: 'YZS-001-02',
          batchNumber: '20240102',
          productionDate: '2024-01-02',
          expiryDate: '2025-01-02',
          inboundDate: '2024-01-20',
          quantity: 200,
          status: 'normal'
        },
        {
          batchKey: '1-3',
          materialCode: 'YZS-001-03',
          batchNumber: '20240103',
          productionDate: '2024-01-03',
          expiryDate: '2025-01-03',
          inboundDate: '2024-01-25',
          quantity: 150,
          status: 'normal'
        },
        {
          batchKey: '1-4',
          materialCode: 'YZS-001-04',
          batchNumber: '20240104',
          productionDate: '2024-01-04',
          expiryDate: '2025-01-04',
          inboundDate: '2024-01-30',
          quantity: 100,
          status: 'normal'
        }
      ]
    },
    {
      key: '2',
      materialCode: 'YZS-002',
      materialName: '输液器',
      category: '医疗器械',
      specification: '500ml',
      model: '普通型',
      minPackage: '50支/箱',
      unit: '支',
      purchasePrice: 3.00,
      currentStock: 300,
      registrationNumber: '国械注准20203150002',
      supplier: '山东威高集团',
      manufacturer: '山东威高集团医用高分子制品股份有限公司',
      stockStatus: 'normal',
      lastInbound: '2024-01-20',
      warning: null,
      batches: [
        {
          batchKey: '2-1',
          materialCode: 'YZS-002-01',
          batchNumber: '20240102',
          productionDate: '2024-01-02',
          expiryDate: '2025-01-02',
          inboundDate: '2024-01-20',
          quantity: 200,
          status: 'normal'
        },
        {
          batchKey: '2-2',
          materialCode: 'YZS-002-02',
          batchNumber: '20240103',
          productionDate: '2024-01-03',
          expiryDate: '2025-01-03',
          inboundDate: '2024-01-25',
          quantity: 100,
          status: 'normal'
        }
      ]
    },
    {
      key: '3',
      materialCode: 'YZS-003',
      materialName: '医用棉签',
      category: '医疗用品',
      specification: '100支/包',
      model: '无菌型',
      minPackage: '50包/箱',
      unit: '包',
      purchasePrice: 1.50,
      currentStock: 50,
      registrationNumber: '国械注准20201410003',
      supplier: '稳健医疗用品',
      manufacturer: '稳健医疗用品股份有限公司',
      stockStatus: 'low',
      lastInbound: '2024-01-25',
      warning: 'low_stock',
      batches: [
        {
          batchKey: '3-1',
          materialCode: 'YZS-003-01',
          batchNumber: '20240103',
          productionDate: '2024-01-03',
          expiryDate: '2025-01-03',
          inboundDate: '2024-01-25',
          quantity: 50,
          status: 'low'
        }
      ]
    },
    {
      key: '4',
      materialCode: 'YZS-004',
      materialName: '酒精棉球',
      category: '医疗用品',
      specification: '50g/瓶',
      model: '75%',
      batchNumber: '20240104',
      productionDate: '2024-01-04',
      expiryDate: '2024-07-04',
      minPackage: '20瓶/箱',
      unit: '瓶',
      purchasePrice: 2.00,
      currentStock: 200,
      registrationNumber: '鲁卫消证字2020第0004号',
      supplier: '稳健医疗用品',
      manufacturer: '稳健医疗用品股份有限公司',
      stockStatus: 'normal',
      lastInbound: '2024-02-01',
      warning: null
    },
    {
      key: '5',
      materialCode: 'YZS-005',
      materialName: '碘伏消毒液',
      category: '消毒用品',
      specification: '500ml',
      model: '10%',
      batchNumber: '20240105',
      productionDate: '2024-01-05',
      expiryDate: '2024-07-05',
      minPackage: '12瓶/箱',
      unit: '瓶',
      purchasePrice: 5.00,
      currentStock: 100,
      registrationNumber: '鲁卫消证字2020第0005号',
      supplier: '利尔康消毒科技',
      manufacturer: '山东利尔康消毒科技股份有限公司',
      stockStatus: 'normal',
      lastInbound: '2024-02-05',
      warning: null
    },
    {
      key: '6',
      materialCode: 'YLQ-001',
      materialName: '血压计',
      category: '医疗设备',
      specification: '台式水银',
      model: '汞柱式',
      batchNumber: '20240106',
      productionDate: '2024-01-06',
      expiryDate: '2027-01-06',
      minPackage: '1台/箱',
      unit: '台',
      purchasePrice: 200.00,
      currentStock: 50,
      registrationNumber: '国械注准20202070006',
      supplier: '鱼跃医疗设备',
      manufacturer: '江苏鱼跃医疗设备股份有限公司',
      stockStatus: 'normal',
      lastInbound: '2024-01-10',
      warning: null
    },
    {
      key: '7',
      materialCode: 'YLQ-002',
      materialName: '体温计',
      category: '医疗设备',
      specification: '电子式',
      model: '数字显示',
      batchNumber: '20240107',
      productionDate: '2024-01-07',
      expiryDate: '2027-01-07',
      minPackage: '10支/盒',
      unit: '支',
      purchasePrice: 30.00,
      currentStock: 80,
      registrationNumber: '国械注准20202070007',
      supplier: '可孚医疗科技',
      manufacturer: '可孚医疗科技股份有限公司',
      stockStatus: 'normal',
      lastInbound: '2024-01-15',
      warning: null
    },
    {
      key: '8',
      materialCode: 'YHP-001',
      materialName: '一次性手套',
      category: '防护用品',
      specification: '乳胶，M码',
      model: '无菌型',
      batchNumber: '20240108',
      productionDate: '2024-01-08',
      expiryDate: '2025-01-08',
      minPackage: '100双/盒',
      unit: '双',
      purchasePrice: 0.50,
      currentStock: 1500,
      registrationNumber: '国械注准20203140008',
      supplier: '蓝帆医疗股份',
      manufacturer: '蓝帆医疗股份有限公司',
      stockStatus: 'high',
      lastInbound: '2024-02-10',
      warning: 'overstock'
    },
    {
      key: '9',
      materialCode: 'YHP-002',
      materialName: '医用口罩',
      category: '防护用品',
      specification: 'N95',
      model: '头戴式',
      batchNumber: '20240109',
      productionDate: '2024-01-09',
      expiryDate: '2025-01-09',
      minPackage: '20个/盒',
      unit: '个',
      purchasePrice: 3.00,
      currentStock: 300,
      registrationNumber: '国械注准20203140009',
      supplier: '稳健医疗用品',
      manufacturer: '稳健医疗用品股份有限公司',
      stockStatus: 'normal',
      lastInbound: '2024-02-12',
      warning: null
    },
    {
      key: '10',
      materialCode: 'YBF-001',
      materialName: '纱布绷带',
      category: '医用材料',
      specification: '7.5cm×600cm',
      model: '无菌型',
      batchNumber: '20240110',
      productionDate: '2024-01-10',
      expiryDate: '2025-01-10',
      minPackage: '10卷/盒',
      unit: '卷',
      purchasePrice: 5.00,
      currentStock: 300,
      registrationNumber: '国械注准20201410010',
      supplier: '振德医疗用品',
      manufacturer: '振德医疗用品股份有限公司',
      stockStatus: 'normal',
      lastInbound: '2024-02-15',
      warning: null
    },
    {
      key: '11',
      materialCode: 'YDQ-001',
      materialName: '胰岛素注射器',
      category: '医疗器械',
      specification: '1ml',
      model: 'BD型',
      batchNumber: '20240111',
      productionDate: '2024-01-11',
      expiryDate: '2025-01-11',
      minPackage: '100支/盒',
      unit: '支',
      purchasePrice: 2.00,
      currentStock: 20,
      registrationNumber: '国械注准20203150011',
      supplier: '山东威高集团',
      manufacturer: '山东威高集团医用高分子制品股份有限公司',
      stockStatus: 'low',
      lastInbound: '2023-12-20',
      warning: 'low_stock'
    },
    {
      key: '12',
      materialCode: 'YXP-001',
      materialName: '创可贴',
      category: '医疗用品',
      specification: '透气型',
      model: '标准型',
      batchNumber: '20240112',
      productionDate: '2024-01-12',
      expiryDate: '2025-01-12',
      minPackage: '100片/盒',
      unit: '盒',
      purchasePrice: 10.00,
      currentStock: 800,
      registrationNumber: '国械注准20201410012',
      supplier: '云南白药集团',
      manufacturer: '云南白药集团股份有限公司',
      stockStatus: 'high',
      lastInbound: '2024-01-30',
      warning: 'overstock'
    }
  ];

  // 查询处理函数
  const handleSearch = () => {
    let filteredData = inventoryDetailsData;

    // 按物资编码筛选
    if (searchParams.materialCode) {
      filteredData = filteredData.filter(item => 
        item.materialCode.toLowerCase().includes(searchParams.materialCode.toLowerCase())
      );
    }

    // 按物资名称筛选
    if (searchParams.materialName) {
      filteredData = filteredData.filter(item => 
        item.materialName.toLowerCase().includes(searchParams.materialName.toLowerCase())
      );
    }

    // 按供应商筛选
    if (searchParams.supplier) {
      filteredData = filteredData.filter(item => 
        item.supplier.toLowerCase().includes(searchParams.supplier.toLowerCase())
      );
    }

    // 按生产厂家筛选
    if (searchParams.manufacturer) {
      filteredData = filteredData.filter(item => 
        item.manufacturer.toLowerCase().includes(searchParams.manufacturer.toLowerCase())
      );
    }

    setInventoryDetails(filteredData);
  };

  // 重置查询条件
  const handleReset = () => {
    setSearchParams({
      materialCode: '',
      materialName: '',
      supplier: '',
      manufacturer: ''
    });
    setInventoryDetails(inventoryDetailsData);
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
      const values = await adjustForm.validateFields();
      const { minStock, maxStock, packageQuantity, packageUnit, expiryWarningDays, reason } = values;
      
      // 验证最高库存预警值必须大于或等于最低库存预警值
      if (maxStock < minStock) {
        message.error('最高库存预警值必须大于或等于最低库存预警值');
        return;
      }

      // 合并打包规格：内含数量 + 打包单位
      const unit = `${packageQuantity}${packageUnit}`;

      // 更新库存数据
      const updatedDetails = inventoryDetails.map(item => {
        if (item.key === currentRecord.key) {
          return {
            ...item,
            minStock: minStock,
            maxStock: maxStock,
            unit: unit,
            expiryWarningDays: expiryWarningDays,
            stockStatus: getStockStatus(item.currentStock, minStock, maxStock),
            warning: getStockWarning(item.currentStock, minStock, maxStock)
          };
        }
        return item;
      });

      setInventoryDetails(updatedDetails);
      message.success('设置调整成功');
      setAdjustModalVisible(false);
      adjustForm.resetFields();
    } catch (error) {
      console.error('设置调整失败:', error);
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

  // 组件加载时生成初始数据
  useEffect(() => {
    setInventoryDetails(inventoryDetailsData);
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
          pagination={{ 
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
            style: {
              display: 'flex',
              justifyContent: 'center',
              marginTop: '16px'
            }
          }}
          scroll={{ x: 1400 }}
          size="small"
          rowKey="materialCode"
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
