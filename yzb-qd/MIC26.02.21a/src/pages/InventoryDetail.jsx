import React, { useState, useEffect } from 'react';
import { Table, Card, Input, Select, DatePicker, Button, Space, Row, Col, Tag, Badge } from 'antd';
import { SearchOutlined, ExportOutlined, EditOutlined, WarningOutlined, AlertOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;

const InventoryDetail = () => {
  const [inventoryDetails, setInventoryDetails] = useState([]);
  const [searchParams, setSearchParams] = useState({
    materialName: '',
    category: 'all',
    warehouse: 'all',
    supplier: '',
    stockStatus: 'all'
  });

  // 定义表格列
  const columns = [
    { title: '商品编码', dataIndex: 'materialCode', key: 'materialCode', width: 120 },
    { title: '商品名称', dataIndex: 'materialName', key: 'materialName', width: 150 },
    { title: '规格型号', dataIndex: 'specification', key: 'specification', width: 120 },
    { title: '商品分类', dataIndex: 'category', key: 'category', width: 100 },
    { title: '所属仓库', dataIndex: 'warehouse', key: 'warehouse', width: 100 },
    { title: '货架位置', dataIndex: 'shelf', key: 'shelf', width: 100 },
    { title: '当前库存', dataIndex: 'currentStock', key: 'currentStock', width: 100, 
      render: (currentStock, record) => {
        let color = 'default';
        if (currentStock <= record.minStock) color = 'red';
        else if (currentStock <= record.maxStock) color = 'orange';
        else color = 'green';
        return <Badge count={currentStock} style={{ backgroundColor: color }} />;
      }
    },
    { title: '最低库存', dataIndex: 'minStock', key: 'minStock', width: 90 },
    { title: '最高库存', dataIndex: 'maxStock', key: 'maxStock', width: 90 },
    { title: '单位', dataIndex: 'unit', key: 'unit', width: 80 },
    { title: '供应商', dataIndex: 'supplier', key: 'supplier', width: 120 },
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
    { title: '最后入库', dataIndex: 'lastInbound', key: 'lastInbound', width: 100 },
    { title: '库存预警', dataIndex: 'warning', key: 'warning', width: 100,
      render: (warning) => {
        if (!warning) return <Tag color="default">无</Tag>;
        const warningMap = {
          'low_stock': { color: 'red', text: '库存不足', icon: <WarningOutlined /> },
          'overstock': { color: 'orange', text: '库存过多', icon: <AlertOutlined /> },
          'expired': { color: 'purple', text: '即将过期', icon: <WarningOutlined /> }
        };
        const config = warningMap[warning] || { color: 'default', text: '无', icon: null };
        return <Tag color={config.color} icon={config.icon}>{config.text}</Tag>;
      }
    },
    { 
      title: '操作', 
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space size="middle">
          <a key={`adjust-${record.key}`}><EditOutlined />调整</a>
          <a key={`export-${record.key}`}><ExportOutlined />导出</a>
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
      specification: '10ml',
      category: '医疗器械',
      warehouse: '仓库1',
      shelf: 'A1-01',
      currentStock: 500,
      minStock: 200,
      maxStock: 1000,
      unit: '支',
      supplier: '山东威高集团',
      stockStatus: 'normal',
      lastInbound: '2024-01-15',
      warning: null
    },
    {
      key: '2',
      materialCode: 'YZS-002',
      materialName: '输液器',
      specification: '500ml',
      category: '医疗器械',
      warehouse: '仓库1',
      shelf: 'A1-02',
      currentStock: 300,
      minStock: 100,
      maxStock: 800,
      unit: '支',
      supplier: '山东威高集团',
      stockStatus: 'normal',
      lastInbound: '2024-01-20',
      warning: null
    },
    {
      key: '3',
      materialCode: 'YZS-003',
      materialName: '医用棉签',
      specification: '100支/包',
      category: '医疗用品',
      warehouse: '仓库1',
      shelf: 'A2-01',
      currentStock: 50,
      minStock: 100,
      maxStock: 500,
      unit: '包',
      supplier: '稳健医疗用品',
      stockStatus: 'low',
      lastInbound: '2024-01-25',
      warning: 'low_stock'
    },
    {
      key: '4',
      materialCode: 'YZS-004',
      materialName: '酒精棉球',
      specification: '50g/瓶',
      category: '医疗用品',
      warehouse: '仓库2',
      shelf: 'B1-01',
      currentStock: 200,
      minStock: 80,
      maxStock: 300,
      unit: '瓶',
      supplier: '稳健医疗用品',
      stockStatus: 'normal',
      lastInbound: '2024-02-01',
      warning: null
    },
    {
      key: '5',
      materialCode: 'YZS-005',
      materialName: '碘伏消毒液',
      specification: '500ml',
      category: '消毒用品',
      warehouse: '仓库2',
      shelf: 'B1-02',
      currentStock: 100,
      minStock: 50,
      maxStock: 200,
      unit: '瓶',
      supplier: '利尔康消毒科技',
      stockStatus: 'normal',
      lastInbound: '2024-02-05',
      warning: null
    },
    {
      key: '6',
      materialCode: 'YLQ-001',
      materialName: '血压计',
      specification: '台式水银',
      category: '医疗设备',
      warehouse: '仓库3',
      shelf: 'C1-01',
      currentStock: 50,
      minStock: 20,
      maxStock: 100,
      unit: '台',
      supplier: '鱼跃医疗设备',
      stockStatus: 'normal',
      lastInbound: '2024-01-10',
      warning: null
    },
    {
      key: '7',
      materialCode: 'YLQ-002',
      materialName: '体温计',
      specification: '电子式',
      category: '医疗设备',
      warehouse: '仓库3',
      shelf: 'C1-02',
      currentStock: 80,
      minStock: 30,
      maxStock: 120,
      unit: '支',
      supplier: '可孚医疗科技',
      stockStatus: 'normal',
      lastInbound: '2024-01-15',
      warning: null
    },
    {
      key: '8',
      materialCode: 'YHP-001',
      materialName: '一次性手套',
      specification: '乳胶，M码',
      category: '防护用品',
      warehouse: '仓库4',
      shelf: 'D1-01',
      currentStock: 1500,
      minStock: 200,
      maxStock: 1000,
      unit: '双',
      supplier: '蓝帆医疗股份',
      stockStatus: 'high',
      lastInbound: '2024-02-10',
      warning: 'overstock'
    },
    {
      key: '9',
      materialCode: 'YHP-002',
      materialName: '医用口罩',
      specification: 'N95',
      category: '防护用品',
      warehouse: '仓库4',
      shelf: 'D1-02',
      currentStock: 300,
      minStock: 150,
      maxStock: 800,
      unit: '个',
      supplier: '稳健医疗用品',
      stockStatus: 'normal',
      lastInbound: '2024-02-12',
      warning: null
    },
    {
      key: '10',
      materialCode: 'YBF-001',
      materialName: '纱布绷带',
      specification: '7.5cm×600cm',
      category: '医用材料',
      warehouse: '仓库1',
      shelf: 'A2-02',
      currentStock: 300,
      minStock: 100,
      maxStock: 600,
      unit: '卷',
      supplier: '振德医疗用品',
      stockStatus: 'normal',
      lastInbound: '2024-02-15',
      warning: null
    },
    {
      key: '11',
      materialCode: 'YDQ-001',
      materialName: '胰岛素注射器',
      specification: '1ml',
      category: '医疗器械',
      warehouse: '仓库1',
      shelf: 'A1-03',
      currentStock: 20,
      minStock: 50,
      maxStock: 200,
      unit: '支',
      supplier: '山东威高集团',
      stockStatus: 'low',
      lastInbound: '2023-12-20',
      warning: 'low_stock'
    },
    {
      key: '12',
      materialCode: 'YXP-001',
      materialName: '创可贴',
      specification: '透气型',
      category: '医疗用品',
      warehouse: '仓库2',
      shelf: 'B2-01',
      currentStock: 800,
      minStock: 100,
      maxStock: 500,
      unit: '盒',
      supplier: '云南白药集团',
      stockStatus: 'high',
      lastInbound: '2024-01-30',
      warning: 'overstock'
    }
  ];

  // 查询处理函数
  const handleSearch = () => {
    let filteredData = inventoryDetailsData;

    // 按商品名称筛选
    if (searchParams.materialName) {
      filteredData = filteredData.filter(item => 
        item.materialName.toLowerCase().includes(searchParams.materialName.toLowerCase()) ||
        item.materialCode.toLowerCase().includes(searchParams.materialName.toLowerCase())
      );
    }

    // 按商品分类筛选
    if (searchParams.category !== 'all') {
      filteredData = filteredData.filter(item => item.category === searchParams.category);
    }

    // 按仓库筛选
    if (searchParams.warehouse !== 'all') {
      filteredData = filteredData.filter(item => item.warehouse === searchParams.warehouse);
    }

    // 按供应商筛选
    if (searchParams.supplier) {
      filteredData = filteredData.filter(item => 
        item.supplier.toLowerCase().includes(searchParams.supplier.toLowerCase())
      );
    }

    // 按库存状态筛选
    if (searchParams.stockStatus !== 'all') {
      filteredData = filteredData.filter(item => item.stockStatus === searchParams.stockStatus);
    }

    setInventoryDetails(filteredData);
  };

  // 重置查询条件
  const handleReset = () => {
    setSearchParams({
      materialName: '',
      checkNumber: '',
      warehouse: 'all',
      batchNumber: '',
      dateRange: null
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

  // 组件加载时生成初始数据
  useEffect(() => {
    setInventoryDetails(inventoryDetailsData);
  }, []);

  return (
    <div style={{ padding: '0 16px' }}>
      <h1 style={{ marginBottom: 24 }}>盘点明细查询</h1>
      
      <Card>
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col span={6}>
            <Input
              placeholder="商品名称/编码"
              value={searchParams.materialName}
              onChange={(e) => setSearchParams({...searchParams, materialName: e.target.value})}
            />
          </Col>
          <Col span={6}>
            <Select
              placeholder="商品分类"
              value={searchParams.category}
              style={{ width: '100%' }}
              onChange={(value) => setSearchParams({...searchParams, category: value})}
            >
              <Select.Option value="all">全部分类</Select.Option>
              <Select.Option value="医疗器械">医疗器械</Select.Option>
              <Select.Option value="医疗用品">医疗用品</Select.Option>
              <Select.Option value="医疗设备">医疗设备</Select.Option>
              <Select.Option value="防护用品">防护用品</Select.Option>
              <Select.Option value="消毒用品">消毒用品</Select.Option>
              <Select.Option value="医用材料">医用材料</Select.Option>
            </Select>
          </Col>
          <Col span={6}>
            <Select
              placeholder="所属仓库"
              value={searchParams.warehouse}
              style={{ width: '100%' }}
              onChange={(value) => setSearchParams({...searchParams, warehouse: value})}
            >
              <Select.Option value="all">全部仓库</Select.Option>
              <Select.Option value="仓库1">仓库1</Select.Option>
              <Select.Option value="仓库2">仓库2</Select.Option>
              <Select.Option value="仓库3">仓库3</Select.Option>
              <Select.Option value="仓库4">仓库4</Select.Option>
            </Select>
          </Col>
          <Col span={6}>
            <Input
              placeholder="供应商"
              value={searchParams.supplier}
              onChange={(e) => setSearchParams({...searchParams, supplier: e.target.value})}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col span={6}>
            <Select
              placeholder="库存状态"
              value={searchParams.stockStatus}
              style={{ width: '100%' }}
              onChange={(value) => setSearchParams({...searchParams, stockStatus: value})}
            >
              <Select.Option value="all">全部状态</Select.Option>
              <Select.Option value="normal">正常</Select.Option>
              <Select.Option value="low">缺货</Select.Option>
              <Select.Option value="high">积压</Select.Option>
              <Select.Option value="out">停用</Select.Option>
            </Select>
          </Col>
          <Col span={18} style={{ textAlign: 'right' }}>
            <Space>
              <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
                查询
              </Button>
              <Button icon={<ExportOutlined />} onClick={handleExport}>
                导出库存报表
              </Button>
              <Button icon={<WarningOutlined />}>
                导出预警清单
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      <Card style={{ marginTop: 16 }}>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span>共 {inventoryDetails.length} 条记录</span>
            <span style={{ marginLeft: 16, color: '#ff4d4f' }}>
              预警商品: {inventoryDetails.filter(item => item.warning).length} 种
            </span>
            <span style={{ marginLeft: 16, color: '#faad14' }}>
              缺货商品: {inventoryDetails.filter(item => item.stockStatus === 'low').length} 种
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
    </div>
  );
};

export default InventoryDetail;
