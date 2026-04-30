import React, { useState, useEffect } from 'react';
import { Table, Card, Input, Select, Button, Space, Tag, Row, Col, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import api from '../utils/api.js';



const InventoryTransfer = () => {
  const [transferData, setTransferData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState({
    transferNumber: '',
    fromWarehouse: 'all',
    toWarehouse: 'all'
  });
  const [warehouseList, setWarehouseList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const transferColumns = [
    { title: '调拨单号', dataIndex: 'transferNumber', key: 'transferNumber' },
    { title: '商品名称', dataIndex: 'materialName', key: 'materialName' },
    { title: '规格型号', dataIndex: 'specification', key: 'specification' },
    { title: '调出仓库', dataIndex: 'fromWarehouse', key: 'fromWarehouse' },
    { title: '调入仓库', dataIndex: 'toWarehouse', key: 'toWarehouse' },
    { title: '调拨数量', dataIndex: 'quantity', key: 'quantity' },
    { title: '单位', dataIndex: 'unit', key: 'unit' },
    { title: '调拨日期', dataIndex: 'transferDate', key: 'transferDate' },
    { title: '调拨人', dataIndex: 'transferor', key: 'transferor' },
    { title: '状态', dataIndex: 'status', key: 'status', render: (status) => {
      const statusMap = {
        pending: <Tag color="orange">待审核</Tag>,
        approved: <Tag color="blue">已审核</Tag>,
        completed: <Tag color="green">已完成</Tag>,
        canceled: <Tag color="red">已取消</Tag>
      };
      return statusMap[status] || status;
    }},
    { 
      title: '操作', 
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => handleViewDetail(record)}>查看详情</a>
          <a onClick={() => handleEdit(record)}>编辑</a>
          <a onClick={() => handleCancel(record)}>取消</a>
        </Space>
      )
    },
  ];

  // 从API获取仓库列表
  const loadWarehouseList = async () => {
    try {
      const response = await api.get('/api/scm/transfer/warehouses');
      if (response.code === 1 && response.data) {
        setWarehouseList(response.data);
      }
    } catch (error) {
      console.error('加载仓库列表失败:', error);
    }
  };

  // 从API获取调拨数据
  const loadTransferData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/scm/transfer/orders', {
        ...searchParams,
        pageNum: currentPage,
        pageSize: pageSize
      });
      if (response.code === 1 && response.data) {
        const data = response.data.records.map(item => ({
          key: item.id,
          transferNumber: item.transferNumber,
          materialName: item.materialName,
          specification: item.specification,
          fromWarehouse: item.fromWarehouse,
          toWarehouse: item.toWarehouse,
          quantity: item.quantity,
          unit: item.unit,
          transferDate: item.transferDate,
          transferor: item.transferor,
          status: item.status
        }));
        setTransferData(data);
        setTotal(response.data.total);
      } else {
        message.error(response.message || '加载调拨数据失败');
      }
    } catch (error) {
      console.error('加载调拨数据失败:', error);
      message.error('加载调拨数据失败，请检查网络连接或联系管理员');
    } finally {
      setLoading(false);
    }
  };

  // 处理查看详情
  const handleViewDetail = (record) => {
    message.info(`查看调拨单 ${record.transferNumber} 详情`);
  };

  // 处理编辑
  const handleEdit = (record) => {
    message.info(`编辑调拨单 ${record.transferNumber}`);
  };

  // 处理取消
  const handleCancel = (record) => {
    message.info(`取消调拨单 ${record.transferNumber}`);
  };

  // 处理搜索
  const handleSearch = () => {
    setCurrentPage(1);
    loadTransferData();
  };

  // 处理分页变化
  const handlePaginationChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
    loadTransferData();
  };

  // 处理重置
  const handleReset = () => {
    setSearchParams({
      transferNumber: '',
      fromWarehouse: 'all',
      toWarehouse: 'all'
    });
    loadTransferData();
  };

  // 处理新建调拨
  const handleCreateTransfer = () => {
    message.info('新建调拨单');
  };

  // 组件加载时获取数据
  useEffect(() => {
    loadWarehouseList();
    loadTransferData();
  }, []);

  return (
    <div style={{ padding: '0 16px' }}>
      <h1 style={{ marginBottom: 24 }}>物资调拨</h1>
      
      <Card style={{ marginBottom: 16, padding: '16px' }}>
        <div style={{ marginBottom: '16px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '8px', fontWeight: '500', minWidth: '80px' }}>调拨单号：</span>
            <Input 
              placeholder="请输入调拨单号" 
              style={{ width: '200px' }} 
              value={searchParams.transferNumber}
              onChange={(e) => setSearchParams({...searchParams, transferNumber: e.target.value})}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '8px', fontWeight: '500', minWidth: '80px' }}>调出仓库：</span>
            <Select 
              placeholder="请选择调出仓库" 
              style={{ width: '200px' }}
              value={searchParams.fromWarehouse}
              onChange={(value) => setSearchParams({...searchParams, fromWarehouse: value})}
            >
              <Select.Option value="all">全部仓库</Select.Option>
              {warehouseList.map(warehouse => (
                <Select.Option key={warehouse.value} value={warehouse.value}>
                  {warehouse.label}
                </Select.Option>
              ))}
            </Select>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '8px', fontWeight: '500', minWidth: '80px' }}>调入仓库：</span>
            <Select 
              placeholder="请选择调入仓库" 
              style={{ width: '200px' }}
              value={searchParams.toWarehouse}
              onChange={(value) => setSearchParams({...searchParams, toWarehouse: value})}
            >
              <Select.Option value="all">全部仓库</Select.Option>
              {warehouseList.map(warehouse => (
                <Select.Option key={warehouse.value} value={warehouse.value}>
                  {warehouse.label}
                </Select.Option>
              ))}
            </Select>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>查询</Button>
          <Button onClick={handleReset}>重置</Button>
          <Button type="primary" onClick={handleCreateTransfer}>新建调拨</Button>
        </div>
      </Card>
      
      <div style={{ overflowX: 'auto' }}>
        <Table 
          columns={transferColumns.map(column => ({
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
          dataSource={transferData} 
          loading={loading}
          pagination={{ 
            current: currentPage,
            pageSize: pageSize,
            total: total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
            onChange: handlePaginationChange,
            style: {
              display: 'flex',
              justifyContent: 'center',
              marginTop: '16px'
            }
          }} 
          size="small"
          scroll={{ x: 1600 }}
        />
      </div>
    </div>
  );
};

export default InventoryTransfer;
