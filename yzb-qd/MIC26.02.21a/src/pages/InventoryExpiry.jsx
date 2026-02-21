import React, { useState } from 'react';
import { Table, Card, Input, Select, Button, Space, Row, Col } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const { Option } = Select;

const InventoryExpiry = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const expiryColumns = [
    { title: '商品名称', dataIndex: 'materialName', key: 'materialName' },
    { title: '规格型号', dataIndex: 'specification', key: 'specification' },
    { title: '批号', dataIndex: 'batchNumber', key: 'batchNumber' },
    { title: '当前库存', dataIndex: 'currentStock', key: 'currentStock' },
    { title: '单位', dataIndex: 'unit', key: 'unit' },
    { title: '生产厂商', dataIndex: 'manufacturer', key: 'manufacturer' },
    { title: '生产批号', dataIndex: 'productionBatch', key: 'productionBatch' },
    { title: '生产日期', dataIndex: 'productionDate', key: 'productionDate' },
    { title: '有效期至', dataIndex: 'expiryDate', key: 'expiryDate', render: (date) => (
      <span style={{ color: '#f50' }}>{date}</span>
    )},
    { title: '剩余天数', dataIndex: 'remainingDays', key: 'remainingDays', render: (days) => {
      let color = '#52c41a';
      if (days <= 30) color = '#f50';
      else if (days <= 90) color = '#faad14';
      return <span style={{ color }}>{days}天</span>;
    }},
    { title: '仓库', dataIndex: 'warehouse', key: 'warehouse' },
    { title: '货位', dataIndex: 'location', key: 'location' },
    { 
      title: '操作', 
      key: 'action',
      render: () => (
        <Space size="middle">
          <a>查看详情</a>
          <a>预警设置</a>
        </Space>
      )
    },
  ];

  const expiryData = [
    { key: '1', materialName: '阿莫西林胶囊', specification: '0.25g*24粒', batchNumber: '20230601', currentStock: 150, unit: '盒', manufacturer: 'XX制药厂', productionBatch: '2023060101', productionDate: '2023-06-01', expiryDate: '2024-06-01', remainingDays: 30, warehouse: '仓库1', location: 'A1-03' },
    { key: '2', materialName: '头孢拉定片', specification: '0.25g*24片', batchNumber: '20230501', currentStock: 200, unit: '盒', manufacturer: 'YY制药厂', productionBatch: '2023050102', productionDate: '2023-05-01', expiryDate: '2024-08-01', remainingDays: 90, warehouse: '仓库2', location: 'B2-05' },
    { key: '3', materialName: '布洛芬缓释胶囊', specification: '0.3g*12粒', batchNumber: '20230701', currentStock: 180, unit: '盒', manufacturer: 'ZZ制药厂', productionBatch: '2023070103', productionDate: '2023-07-01', expiryDate: '2024-07-01', remainingDays: 60, warehouse: '仓库1', location: 'A1-04' },
    { key: '4', materialName: '左氧氟沙星片', specification: '0.1g*12片', batchNumber: '20230401', currentStock: 120, unit: '盒', manufacturer: 'AA制药厂', productionBatch: '2023040104', productionDate: '2023-04-01', expiryDate: '2024-06-15', remainingDays: 45, warehouse: '仓库3', location: 'C3-06' },
  ];

  return (
    <div style={{ padding: '0 16px' }}>
      <h1 style={{ marginBottom: 24 }}>近效期查询</h1>
      
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 0]} align="middle">
          <Col xs={24} sm={12} md={8} lg={6}>
            <Input placeholder="商品名称" style={{ width: '100%' }} />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Select placeholder="所属仓库" style={{ width: '100%' }}>
              <Option value="all">全部仓库</Option>
              <Option value="warehouse1">仓库1</Option>
              <Option value="warehouse2">仓库2</Option>
              <Option value="warehouse3">仓库3</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Select placeholder="剩余天数" style={{ width: '100%' }}>
              <Option value="30">30天内</Option>
              <Option value="60">60天内</Option>
              <Option value="90">90天内</Option>
              <Option value="180">180天内</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={12} lg={6}>
            <Space>
              <Button type="primary" icon={<SearchOutlined />}>查询</Button>
              <Button type="primary">导出报表</Button>
            </Space>
          </Col>
        </Row>
      </Card>
      
      <div style={{ overflowX: 'auto' }}>
        <Table columns={expiryColumns} dataSource={expiryData} pagination={{ 
          current: currentPage,
          pageSize: pageSize,
          onChange: (page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          },
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条记录`,
          size: "small",
          style: {
            display: "flex",
            justifyContent: "center",
            marginTop: "16px"
          }
        }} size="small" />
      </div>
    </div>
  );
};

export default InventoryExpiry;
