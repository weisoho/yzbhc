import React, { useState } from 'react';
import { Table, Card, Input, Select, Button, Space, Row, Col } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const { Option } = Select;

const InventoryExpiry = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  
  const expiryData = [
    { key: '1', materialCode: 'YZS-001', materialName: '阿莫西林胶囊', category: '药品', specification: '0.25g*24粒', model: '标准型', batchNumber: '20230601', minPackage: '100盒/箱', unit: '盒', purchasePrice: 15.50, currentStock: 150, productionDate: '2023-06-01', expiryDate: '2024-06-01', remainingDays: 30, registrationNumber: '国药准字H19993636', supplier: 'XX医药公司', manufacturer: 'XX制药厂' },
    { key: '2', materialCode: 'YZS-002', materialName: '头孢拉定片', category: '药品', specification: '0.25g*24片', model: '普通型', batchNumber: '20230501', minPackage: '50盒/箱', unit: '盒', purchasePrice: 20.00, currentStock: 200, productionDate: '2023-05-01', expiryDate: '2024-08-01', remainingDays: 90, registrationNumber: '国药准字H19993637', supplier: 'YY医药公司', manufacturer: 'YY制药厂' },
    { key: '3', materialCode: 'YZS-003', materialName: '布洛芬缓释胶囊', category: '药品', specification: '0.3g*12粒', model: '缓释型', batchNumber: '20230701', minPackage: '80盒/箱', unit: '盒', purchasePrice: 25.80, currentStock: 180, productionDate: '2023-07-01', expiryDate: '2024-07-01', remainingDays: 60, registrationNumber: '国药准字H19993638', supplier: 'ZZ医药公司', manufacturer: 'ZZ制药厂' },
    { key: '4', materialCode: 'YZS-004', materialName: '左氧氟沙星片', category: '药品', specification: '0.1g*12片', model: '薄膜衣', batchNumber: '20230401', minPackage: '60盒/箱', unit: '盒', purchasePrice: 30.50, currentStock: 120, productionDate: '2023-04-01', expiryDate: '2024-06-15', remainingDays: 45, registrationNumber: '国药准字H19993639', supplier: 'AA医药公司', manufacturer: 'AA制药厂' },
  ];

  const expiryColumns = [
    {
      title: (
        <input 
          type="checkbox" 
          checked={selectedRowKeys.length === expiryData.length && expiryData.length > 0}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedRowKeys(expiryData.map(item => item.key));
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
    { title: '物资编码', dataIndex: 'materialCode', key: 'materialCode' },
    { title: '物资名称', dataIndex: 'materialName', key: 'materialName' },
    { title: '物资类型', dataIndex: 'category', key: 'category' },
    { title: '规格', dataIndex: 'specification', key: 'specification' },
    { title: '型号', dataIndex: 'model', key: 'model' },
    { title: '批号', dataIndex: 'batchNumber', key: 'batchNumber' },
    { title: '最小包装', dataIndex: 'minPackage', key: 'minPackage' },
    { title: '单位', dataIndex: 'unit', key: 'unit' },
    { title: '采购价格', dataIndex: 'purchasePrice', key: 'purchasePrice', render: (price) => `¥${price?.toFixed(2) || '0.00'}` },
    { title: '库存数量', dataIndex: 'currentStock', key: 'currentStock' },
    { title: '生产日期', dataIndex: 'productionDate', key: 'productionDate' },
    { title: '失效日期', dataIndex: 'expiryDate', key: 'expiryDate', render: (date) => (
      <span style={{ color: '#f50' }}>{date}</span>
    )},
    { title: '剩余天数', dataIndex: 'remainingDays', key: 'remainingDays', render: (days) => {
      let color = '#52c41a';
      if (days <= 30) color = '#f50';
      else if (days <= 90) color = '#faad14';
      return <span style={{ color }}>{days}天</span>;
    }},
    { title: '注册证号', dataIndex: 'registrationNumber', key: 'registrationNumber' },
    { title: '供应商', dataIndex: 'supplier', key: 'supplier' },
    { title: '生产厂家', dataIndex: 'manufacturer', key: 'manufacturer' },
  ];

  return (
    <div style={{ padding: '0 16px' }}>
      <h1 style={{ marginBottom: 24 }}>近效期查询</h1>
      
      <Card style={{ marginBottom: 16, padding: '16px' }}>
        <div style={{ marginBottom: '16px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '8px', fontWeight: '500', minWidth: '80px' }}>物资编码：</span>
            <Input placeholder="请输入物资编码" style={{ width: '180px' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '8px', fontWeight: '500', minWidth: '80px' }}>物资名称：</span>
            <Input placeholder="请输入物资名称" style={{ width: '180px' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '8px', fontWeight: '500', minWidth: '80px' }}>供应商：</span>
            <Input placeholder="请输入供应商" style={{ width: '180px' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '8px', fontWeight: '500', minWidth: '80px' }}>生产厂家：</span>
            <Input placeholder="请输入生产厂家" style={{ width: '180px' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '8px', fontWeight: '500', minWidth: '80px' }}>剩余天数：</span>
            <Select placeholder="请选择天数" style={{ width: '180px' }}>
              <Option value="30">30天内</Option>
              <Option value="60">60天内</Option>
              <Option value="90">90天内</Option>
              <Option value="180">180天内</Option>
            </Select>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button type="primary" icon={<SearchOutlined />}>查询</Button>
          <Button type="primary">导出报表</Button>
        </div>
      </Card>
      
      <div style={{ overflowX: 'auto' }}>
        <Table 
          columns={expiryColumns.map(column => ({
            ...column,
            ellipsis: false,
            align: 'center',
            onHeaderCell: () => ({
              style: {
                whiteSpace: 'nowrap'
              }
            }),
            onCell: () => ({
              style: {
                whiteSpace: 'nowrap'
              }
            })
          }))} 
          dataSource={expiryData} 
          pagination={{ 
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
          }} 
          size="small"
          scroll={{ x: 1600 }}
        />
      </div>
    </div>
  );
};

export default InventoryExpiry;
