import React, { useState, useEffect } from 'react';
import { Table, Card, Input, Select, Button, Space, Row, Col, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useLocation } from 'react-router-dom';
import api from '../utils/api.js';

const { Option } = Select;

const InventoryExpiry = () => {
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [expiryData, setExpiryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState({
    materialCode: '',
    materialName: '',
    supplier: '',
    manufacturer: '',
    remainingDays: ''
  });

  // 计算剩余天数
  const calculateRemainingDays = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // 加载近效期数据
  const loadExpiryData = async (params = {}) => {
    try {
      setLoading(true);
      const response = await api.get('/api/scm/inventory');
      if (response.code === 1 && response.data) {
        const expiryList = response.data.records
          .filter(item => item.expiryDate) // 只处理有有效期的记录
          .map(item => {
            const remainingDays = calculateRemainingDays(item.expiryDate);
            return {
              key: item.id,
              materialCode: item.materialCode,
              materialName: item.materialName,
              category: item.materialType,
              specification: item.specification,
              model: item.model,
              batchNumber: item.batchNumber,
              minPackage: item.minPackage,
              unit: item.unit,
              purchasePrice: item.purchasePrice,
              currentStock: item.quantity,
              productionDate: item.productionDate,
              expiryDate: item.expiryDate,
              remainingDays: remainingDays,
              registrationNumber: item.registrationNumber,
              supplier: item.supplierName,
              manufacturer: item.manufacturer
            };
          })
          .filter(item => {
            if (params.materialCode && !String(item.materialCode || '').includes(params.materialCode)) {
              return false;
            }
            if (params.materialName && !String(item.materialName || '').includes(params.materialName)) {
              return false;
            }
            if (params.supplier && !String(item.supplier || '').includes(params.supplier)) {
              return false;
            }
            if (params.manufacturer && !String(item.manufacturer || '').includes(params.manufacturer)) {
              return false;
            }
            // 根据剩余天数筛选
            if (params.remainingDays) {
              if (params.remainingDays === 'expired') {
                return item.remainingDays < 0;
              }
              const days = parseInt(params.remainingDays);
              return item.remainingDays <= days;
            }
            return true;
          });
        setExpiryData(expiryList);
      } else {
        message.error(response.message || '加载近效期数据失败');
        setExpiryData([]);
      }
    } catch (error) {
      console.error('加载近效期数据失败:', error);
      message.error(`加载近效期数据失败: ${error.message || '未知错误'}`);
      setExpiryData([]);
    } finally {
      setLoading(false);
    }
  };

  // 处理搜索
  const handleSearch = () => {
    loadExpiryData(searchParams);
  };

  // 处理搜索参数变化
  const handleSearchParamChange = (field, value) => {
    setSearchParams(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 组件加载时获取数据
  useEffect(() => {
    loadExpiryData();
  }, []);

  useEffect(() => {
    if (location.state?.source !== 'home-pending') {
      return;
    }

    const nextParams = {
      materialCode: '',
      materialName: '',
      supplier: '',
      manufacturer: '',
      remainingDays: '',
      ...(location.state.initialFilters || {}),
    };

    setSearchParams(nextParams);
    setCurrentPage(1);
    loadExpiryData(nextParams);
  }, [location.state]);

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
            <Input 
              placeholder="请输入物资编码" 
              style={{ width: '180px' }}
              value={searchParams.materialCode}
              onChange={(e) => handleSearchParamChange('materialCode', e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '8px', fontWeight: '500', minWidth: '80px' }}>物资名称：</span>
            <Input 
              placeholder="请输入物资名称" 
              style={{ width: '180px' }}
              value={searchParams.materialName}
              onChange={(e) => handleSearchParamChange('materialName', e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '8px', fontWeight: '500', minWidth: '80px' }}>供应商：</span>
            <Input 
              placeholder="请输入供应商" 
              style={{ width: '180px' }}
              value={searchParams.supplier}
              onChange={(e) => handleSearchParamChange('supplier', e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '8px', fontWeight: '500', minWidth: '80px' }}>生产厂家：</span>
            <Input 
              placeholder="请输入生产厂家" 
              style={{ width: '180px' }}
              value={searchParams.manufacturer}
              onChange={(e) => handleSearchParamChange('manufacturer', e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '8px', fontWeight: '500', minWidth: '80px' }}>剩余天数：</span>
            <Select 
              placeholder="请选择天数" 
              style={{ width: '180px' }}
              value={searchParams.remainingDays}
              onChange={(value) => handleSearchParamChange('remainingDays', value)}
            >
              <Option value="expired">已过期</Option>
              <Option value="30">30天内</Option>
              <Option value="60">60天内</Option>
              <Option value="90">90天内</Option>
              <Option value="180">180天内</Option>
            </Select>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>查询</Button>
          <Button type="primary" onClick={() => message.success('报表导出成功')}>导出报表</Button>
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
          loading={loading}
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
