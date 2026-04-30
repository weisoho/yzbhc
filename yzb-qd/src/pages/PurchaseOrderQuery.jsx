import React, { useState, useEffect } from 'react';
import { Card, Table, Input, Select, Space, Tag, Button, DatePicker, Modal, Descriptions, message } from 'antd';
import { SearchOutlined, ExportOutlined } from '@ant-design/icons';
import api from '../utils/api.js';

const { Option } = Select;

const PurchaseOrderQuery = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [detailVisible, setDetailVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [searchParams, setSearchParams] = useState({
    orderNumber: '',
    productName: '',
    status: '',
    departmentName: '',
    materialCode: ''
  });
  const [orders, setOrders] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  // 加载部门列表
  const loadDepartments = async () => {
    try {
      const response = await api.get('/api/department/list', {
        pageNum: 1,
        pageSize: 1000
      });
      if (response.code === 1 && response.data) {
        setDepartments(response.data.records || []);
      }
    } catch (error) {
      console.error('加载部门列表失败:', error);
    }
  };

  // 加载供应商列表
  const loadSuppliers = async () => {
    try {
      const response = await api.get('/api/scm/suppliers');
      if (response.code === 1 && response.data) {
        setSuppliers(response.data.records || []);
      }
    } catch (error) {
      console.error('加载供应商列表失败:', error);
    }
  };

  // 加载采购订单数据
  const loadPurchaseOrders = async () => {
    try {
      setLoading(true);
      const params = {
        pageNum: pagination.current,
        pageSize: pagination.pageSize,
        orderNumber: searchParams.orderNumber,
        materialName: searchParams.productName,
        status: searchParams.status,
        departmentName: searchParams.departmentName,
        materialCode: searchParams.materialCode
      };
      const response = await api.get('/api/scm/purchases/orders', params);
      if (response.code === 1 && response.data) {
        const orderList = response.data.records.map(order => ({
          key: order.id,
          orderNo: order.orderNumber,
          department: order.departmentName,
          applicant: order.operatorName,
          approver: order.auditOperatorName || order.approverName || order.approveUserName || order.auditUserName || '',
          quantity: order.itemCount || (order.details || order.items || []).length || 0,
          totalAmount: order.totalAmount,
          status: order.status,
          supplier: order.supplierName,
          warehouse: order.warehouseName,
          createTime: order.createTime,
          approveTime: order.approveTime,
          productCount: order.itemCount,
          reason: order.remark,
          completeTime: order.completeTime,
          items: (order.details || order.items || []).map((item, index) => ({
            key: `${order.id}-${index}`,
            productCode: item.materialCode,
            productName: item.materialName || item.productName,
            specification: item.specification,
            model: item.model,
            unit: item.unit,
            quantity: item.quantity,
            price: item.unitPrice,
            amount: item.amount,
            manufacturer: item.manufacturer,
            registrationNumber: item.registrationNumber,
            createDate: item.createTime,
            approveDate: item.updateTime
          }))
        }));
        setOrders(orderList);
        setPagination(prev => ({
          ...prev,
          total: response.data.total
        }));
      } else {
        messageApi.error(response.message || '加载采购订单失败');
      }
    } catch (error) {
      console.error('加载采购订单失败:', error);
      messageApi.error('加载采购订单失败，请检查网络连接或联系管理员');
    } finally {
      setLoading(false);
    }
  };

  // 组件加载时获取数据
  useEffect(() => {
    loadDepartments();
    loadSuppliers();
  }, []);

  useEffect(() => {
    loadPurchaseOrders();
  }, [pagination.current, pagination.pageSize]);

  // 搜索参数变更处理
  const handleSearch = () => {
    setPagination(prev => ({
      ...prev,
      current: 1
    }));
    loadPurchaseOrders();
  };

  // 重置搜索参数
  const handleReset = () => {
    setSearchParams({
      orderNumber: '',
      productName: '',
      status: '',
      departmentName: '',
      materialCode: ''
    });
    setPagination(prev => ({
      ...prev,
      current: 1
    }));
  };



  const handleViewDetail = (record) => {
    setCurrentRecord(record);
    setDetailVisible(true);
  };

  const itemColumns = [
    { title: '物资编码', dataIndex: 'productCode', key: 'productCode', width: 120 },
    { title: '物资名称', dataIndex: 'productName', key: 'productName', width: 150 },
    { title: '物资类型', dataIndex: 'productType', key: 'productType', width: 100, render: (value) => value || '-' },
    { title: '规格', dataIndex: 'specification', key: 'specification', width: 120 },
    { title: '型号', dataIndex: 'model', key: 'model', width: 100, render: (value) => value || '-' },
    { title: '最小包装', dataIndex: 'minPackage', key: 'minPackage', width: 100, render: (value) => value || '-' },
    { title: '起订量', dataIndex: 'minOrder', key: 'minOrder', width: 100, render: (value) => value || '-' },
    { title: '单位', dataIndex: 'unit', key: 'unit', width: 80 },
    { title: '采购价格', dataIndex: 'price', key: 'price', width: 100, render: (value) => `¥${value.toFixed(2)}` },
    { title: '采购数量', dataIndex: 'quantity', key: 'quantity', width: 100 },
    { title: '注册证号', dataIndex: 'registrationNumber', key: 'registrationNumber', width: 150, render: (value) => value || '-' },
    { title: '供应商', dataIndex: 'supplier', key: 'supplier', width: 120, render: (value) => value || '-' },
    { title: '生产厂家', dataIndex: 'manufacturer', key: 'manufacturer', width: 150, render: (value) => value || '-' },
    { title: '创建日期', dataIndex: 'createDate', key: 'createDate', width: 120, render: (value) => value || '-' },
    { title: '审核日期', dataIndex: 'approveDate', key: 'approveDate', width: 120, render: (value) => value || '-' },
  ];

  const columns = [
    { title: '采购单号', dataIndex: 'orderNo', key: 'orderNo', fixed: 'left', width: 180 },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => {
        const statusMap = {
          'DRAFT': { color: 'warning', text: '待提交' },
          'WAIT_AUDIT': { color: 'blue', text: '待审核' },
          'WAIT_RECEIVE': { color: 'orange', text: '待收货' },
          'WAIT_STOCK_IN': { color: 'purple', text: '待入库' },
          'COMPLETED': { color: 'success', text: '已完成' },
          'REJECTED': { color: 'error', text: '已驳回' },
          '待提交': { color: 'warning', text: '待提交' },
          '待审核': { color: 'blue', text: '待审核' },
          '待收货': { color: 'orange', text: '待收货' },
          '已完成': { color: 'success', text: '已完成' },
          '已驳回': { color: 'error', text: '已驳回' },
          'completed': { color: 'success', text: '已完成' }
        };
        const info = statusMap[status] || { color: 'default', text: status || '未知' };
        return <Tag color={info.color}>{info.text}</Tag>;
      }
    },
    { title: '采购分院', dataIndex: 'department', key: 'department', width: 100 },
    { title: '申请人', dataIndex: 'applicant', key: 'applicant', width: 80 },
    { title: '采购数量', dataIndex: 'quantity', key: 'quantity', width: 100, render: (qty) => `${qty} 种` },
    { title: '合计金额', dataIndex: 'totalAmount', key: 'totalAmount', width: 120, render: (amount) => `¥${amount?.toFixed(2)}` },
    { title: '创建日期', dataIndex: 'createTime', key: 'createTime', width: 160 },
    { title: '审核日期', dataIndex: 'approveTime', key: 'approveTime', width: 160, render: (time) => time || '-' },
    { title: '审核人', dataIndex: 'approver', key: 'approver', width: 100, render: (value) => value || '-' },
    { 
      title: '操作', 
      key: 'action', 
      fixed: 'right', 
      width: 100, 
      render: (_, record) => (
        <Button type="link" size="small" onClick={() => handleViewDetail(record)}>
          详情
        </Button>
      ) 
    },
  ];

  return (
    <div style={{ padding: '0 16px' }}>
      {contextHolder}
      <h1 style={{ marginBottom: 24 }}>采购订单查询</h1>
      
      <Card style={{ marginBottom: 16, padding: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ whiteSpace: 'nowrap' }}>采购单号：</span>
              <Input 
                placeholder="请输入采购单号" 
                allowClear
                style={{ width: 180 }}
                size="middle"
                value={searchParams.orderNumber}
                onChange={(e) => setSearchParams({ ...searchParams, orderNumber: e.target.value })}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ whiteSpace: 'nowrap' }}>物资名称：</span>
              <Input 
                placeholder="请输入物资名称" 
                allowClear
                style={{ width: 180 }}
                size="middle"
                value={searchParams.productName}
                onChange={(e) => setSearchParams({ ...searchParams, productName: e.target.value })}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ whiteSpace: 'nowrap' }}>采购分院：</span>
              <Select 
                placeholder="请选择采购分院" 
                allowClear
                style={{ width: 180 }}
                size="middle"
                value={searchParams.departmentName}
                onChange={(value) => setSearchParams({ ...searchParams, departmentName: value })}
              >
                {departments.map((dept) => (
                  <Select.Option key={dept.id} value={dept.deptName}>{dept.deptName}</Select.Option>
                ))}
              </Select>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ whiteSpace: 'nowrap' }}>物资编码：</span>
              <Input 
                placeholder="请输入物资编码" 
                allowClear
                style={{ width: 180 }}
                size="middle"
                value={searchParams.materialCode}
                onChange={(e) => setSearchParams({ ...searchParams, materialCode: e.target.value })}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ whiteSpace: 'nowrap' }}>状态：</span>
              <Select 
                placeholder="请选择状态" 
                allowClear
                style={{ width: 120 }}
                size="middle"
                value={searchParams.status}
                onChange={(value) => setSearchParams({ ...searchParams, status: value })}
              >
                <Option value="DRAFT">待提交</Option>
                <Option value="WAIT_AUDIT">待审核</Option>
                <Option value="WAIT_RECEIVE">待收货</Option>
                <Option value="COMPLETED">已完成</Option>
                <Option value="REJECTED">已驳回</Option>
              </Select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <Button 
              type="primary" 
              icon={<SearchOutlined />}
              style={{ minWidth: 90 }}
              onClick={handleSearch}
            >
              查询
            </Button>
            <Button 
              icon={<ExportOutlined />}
              style={{ minWidth: 90 }}
            >
              导出
            </Button>
            <Button 
              style={{ minWidth: 90 }}
              onClick={handleReset}
            >
              重置
            </Button>
          </div>
        </div>
      </Card>

      <Card>
        <Table 
          columns={columns} 
          dataSource={orders} 
          pagination={{ 
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
            onChange: (page, pageSize) => {
              setPagination({
                ...pagination,
                current: page,
                pageSize: pageSize
              });
            },
            style: {
              display: 'flex',
              justifyContent: 'center',
              marginTop: '16px'
            }
          }}
          scroll={{ x: 1600 }}
          size="small"
          loading={loading}
        />
      </Card>

      <Modal
        title="采购订单详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        width={1000}
        footer={[
          <Button key="close" onClick={() => setDetailVisible(false)}>
            关 闭
          </Button>,
        ]}
      >
        {currentRecord && (
          <div>
            <Descriptions bordered column={2} size="small">
              <Descriptions.Item label="采购单号">{currentRecord.orderNo}</Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color={
                  currentRecord.status === '待审核' ? 'orange' :
                  currentRecord.status === '已审核' ? 'blue' :
                  currentRecord.status === '已驳回' ? 'red' : 'green'
                }>
                  {currentRecord.status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="采购分院">{currentRecord.department}</Descriptions.Item>
              <Descriptions.Item label="申请人">{currentRecord.applicant}</Descriptions.Item>
              <Descriptions.Item label="创建日期">{currentRecord.createTime}</Descriptions.Item>
              <Descriptions.Item label="供应商">{currentRecord.supplier}</Descriptions.Item>
              <Descriptions.Item label="物资数量">{currentRecord.productCount} 种</Descriptions.Item>
              <Descriptions.Item label="总金额">¥{currentRecord.totalAmount.toFixed(2)}</Descriptions.Item>
              <Descriptions.Item label="申请原因">{currentRecord.reason}</Descriptions.Item>
              <Descriptions.Item label="审核人">{currentRecord.approver || '-'}</Descriptions.Item>
              <Descriptions.Item label="审核时间">{currentRecord.approveTime || '-'}</Descriptions.Item>
              <Descriptions.Item label="完成时间">{currentRecord.completeTime || '-'}</Descriptions.Item>
            </Descriptions>

            <div style={{ marginTop: 24 }}>
              <h4>采购明细</h4>
              <Table
                columns={itemColumns}
                dataSource={currentRecord.items}
                pagination={false}
                size="small"
                rowKey="key"
                scroll={{ x: 1600 }}
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PurchaseOrderQuery;
