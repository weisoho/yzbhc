import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, Table, Button, Input, Select, Space, Tag, Modal, message, InputNumber } from 'antd';
import { EyeOutlined, SearchOutlined } from '@ant-design/icons';
import api from '../utils/api.js';



const PurchaseOrderApproval = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [detailVisible, setDetailVisible] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [viewMode, setViewMode] = useState('summary'); // 'detail' 或 'summary'
  const [hasSelectedView, setHasSelectedView] = useState(false); // 是否已选择视图
  const [selectedRowKeys, setSelectedRowKeys] = useState([]); // 选中的行
  const [selectedSummaryRowKeys, setSelectedSummaryRowKeys] = useState([]); // 选中的汇总行
  const [summaryOrders, setSummaryOrders] = useState([]);
  const [approveModalVisible, setApproveModalVisible] = useState(false); // 批量通过确认弹窗
  const [rejectModalVisible, setRejectModalVisible] = useState(false); // 批量驳回确认弹窗
  const [itemApprovalSelections, setItemApprovalSelections] = useState({}); // 明细项审核选择状态
  const [editableUnitHeader, setEditableUnitHeader] = useState('单位'); // 可编辑的单位表头
  const [editableQuantityHeader, setEditableQuantityHeader] = useState('采购数量'); // 可编辑的采购数量表头
  const [editableUnits, setEditableUnits] = useState({}); // 可编辑的单位数据
  const [editableQuantities, setEditableQuantities] = useState({}); // 可编辑的采购数量数据
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState({
    orderNo: '',
    department: undefined,
    productCode: '',
    productName: ''
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  const [departments, setDepartments] = useState([]);

  // 加载部门列表
  const loadDepartments = async () => {
    try {
      const response = await api.get('/api/department/list', {
        pageNum: 1,
        pageSize: 1000 // 获取全量部门
      });
      if (response.code === 1 && response.data) {
        setDepartments(response.data.records || []);
      }
    } catch (error) {
      console.error('加载部门列表失败:', error);
    }
  };

  // 加载采购订单数据
  const loadPurchaseOrders = async () => {
    try {
      setLoading(true);
      const params = {
        pageNum: pagination.current,
        pageSize: pagination.pageSize,
        status: '待审核', // 兼容后端可能的不同状态名
        orderNumber: searchParams.orderNo,
        departmentName: searchParams.department,
        materialCode: searchParams.productCode,
        materialName: searchParams.productName
      };
      const response = await api.get('/api/scm/purchases/orders', params);
      if (response.code === 1 && response.data) {
        const orderList = response.data.records.map(order => ({
          key: order.id,
          orderNo: order.orderNumber,
          department: order.departmentName,
          createTime: order.createTime,
          status: order.status,
          totalQuantity: order.itemCount,
          totalAmount: order.totalAmount,
          items: (order.details || order.items || []).map(item => ({
            ...item,
            productCode: item.materialCode || item.productCode,
            product: item.materialName || item.productName,
            price: item.unitPrice,
            quantity: item.quantity,
            amount: item.amount,
            manufacturer: item.manufacturer,
            specification: item.specification,
            model: item.model,
            unit: item.unit,
            status: item.status
          })),
          applicant: order.operatorName,
          approver: order.approverName,
          approveTime: order.approveTime,
          reason: order.remark,
          rejectReason: order.rejectReason,
          remark: order.remark
        }));
        setSummaryOrders(orderList);
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

  // 处理搜索输入变化
  const handleSearchChange = (field, value) => {
    setSearchParams(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 处理查询按钮点击
  // 处理查询按钮点击
  const handleSearch = () => {
    setPagination(prev => ({ ...prev, current: 1 }));
    loadPurchaseOrders();
  };

  // 组件加载时获取数据
  useEffect(() => {
    loadDepartments();
  }, []);

  useEffect(() => {
    loadPurchaseOrders();
  }, [pagination.current, pagination.pageSize]);

  const columns = [
    {
      title: '',
      key: 'checkbox',
      width: 40,
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
    { title: '订单号', dataIndex: 'orderNo', key: 'orderNo' },
    { title: '物资编码', dataIndex: 'productCode', key: 'productCode' },
    { title: '商品名称', dataIndex: 'product', key: 'product' },
    { title: '规格', dataIndex: 'specification', key: 'specification' },
    { title: '型号', dataIndex: 'model', key: 'model' },
    { title: '订货数量', dataIndex: 'quantity', key: 'quantity' },
    { title: '订货单位', dataIndex: 'unit', key: 'unit' },
    { title: '生产厂家', dataIndex: 'manufacturer', key: 'manufacturer' },
    { title: '申领科室', dataIndex: 'department', key: 'department' },
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime' },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
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
          '已驳回': { color: 'error', text: '已驳回' }
        };
        const info = statusMap[status] || { color: 'default', text: status || '未知' };
        return <Tag color={info.color}>{info.text}</Tag>;
      }
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      ellipsis: true,
      width: 150
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="link" 
            size="small" 
            icon={<EyeOutlined />}
            onClick={async () => {
              // 如果没有详情数据，尝试从详情接口获取
              if (!record.items || record.items.length === 0) {
                try {
                  setLoading(true);
                  const response = await api.get(`/api/scm/purchases/orders/${record.key}`);
                  if (response.code === 1 && response.data) {
                    const orderData = response.data;
                    record.items = (orderData.details || orderData.items || []).map(item => ({
                      ...item,
                      productCode: item.materialCode || item.productCode,
                      product: item.materialName || item.productName,
                      price: item.unitPrice,
                      quantity: item.quantity,
                      amount: item.amount,
                      manufacturer: item.manufacturer,
                      specification: item.specification,
                      model: item.model,
                      unit: item.unit
                    }));
                    // 更新其他可能的字段
                    record.applicant = orderData.operatorName || record.applicant;
                    record.reason = orderData.remark || record.reason;
                  }
                } catch (error) {
                  console.error('获取订单详情失败:', error);
                } finally {
                  setLoading(false);
                }
              }
              setCurrentOrder(record);
              setItemApprovalSelections({}); // 重置选择状态
              setDetailVisible(true);
            }}
          >
            查看详情
          </Button>
        </Space>
      )
    },
  ];

  // 采购单汇总视图列配置
  const summaryColumns = [
    {
      title: '',
      key: 'checkbox',
      width: 40,
      render: (_, record) => (
        <input 
          type="checkbox" 
          checked={selectedSummaryRowKeys.includes(record.key)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedSummaryRowKeys([...selectedSummaryRowKeys, record.key]);
            } else {
              setSelectedSummaryRowKeys(selectedSummaryRowKeys.filter(key => key !== record.key));
            }
          }}
        />
      )
    },
    { title: '采购单号', dataIndex: 'orderNo', key: 'orderNo' },
    { title: '采购分院', dataIndex: 'department', key: 'department' },
    { 
      title: '物资数量', 
      dataIndex: 'totalQuantity', 
      key: 'totalQuantity',
      render: (quantity) => <span style={{ fontWeight: '500' }}>{quantity}</span>
    },
    { 
      title: '合计金额', 
      dataIndex: 'totalAmount', 
      key: 'totalAmount',
      render: (amount) => <span style={{ fontWeight: '500', color: '#1890ff' }}>¥{amount?.toFixed(2)}</span>
    },
    { title: '申请人', dataIndex: 'applicant', key: 'applicant' },
    { title: '创建日期', dataIndex: 'createTime', key: 'createTime' },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      ellipsis: true,
      width: 150
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="link" 
            size="small" 
            icon={<EyeOutlined />}
            onClick={() => {
              setCurrentOrder(record);
              setItemApprovalSelections({}); // 重置选择状态
              setDetailVisible(true);
            }}
          >
            查看详情
          </Button>
        </Space>
      )
    },
  ];

  const handleApprove = async (record) => {
    try {
      setLoading(true);
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      const operatorName = userInfo.realName || userInfo.userName || '管理员';
      
      const response = await api.post(`/api/scm/purchases/orders/${record.key}/approve`, {
        operatorName: operatorName,
        remark: ''
      });
      if (response.code === 1) {
        messageApi.success(`订单 ${record.orderNo} 已审核通过`);
        loadPurchaseOrders();
        setDetailVisible(false);
      } else {
        messageApi.error(response.message || '审核通过失败');
      }
    } catch (error) {
      console.error('审核通过失败:', error);
      messageApi.error('审核通过失败，请检查网络连接或联系管理员');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (record) => {
    try {
      setLoading(true);
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      const operatorName = userInfo.realName || userInfo.userName || '管理员';

      const response = await api.post(`/api/scm/purchases/orders/${record.key}/reject`, {
        operatorName: operatorName,
        remark: '驳回原因'
      });
      if (response.code === 1) {
        messageApi.warning(`订单 ${record.orderNo} 已被驳回`);
        loadPurchaseOrders();
        setDetailVisible(false);
      } else {
        messageApi.error(response.message || '驳回失败');
      }
    } catch (error) {
      console.error('驳回失败:', error);
      messageApi.error('驳回失败，请检查网络连接或联系管理员');
    } finally {
      setLoading(false);
    }
  };

  const handleBatchApprove = () => {
    const selectedKeys = viewMode === 'detail' ? selectedRowKeys : selectedSummaryRowKeys;
    if (selectedKeys.length === 0) {
      messageApi.warning('请先选择要审核的订单');
      return;
    }
    setApproveModalVisible(true);
  };

  const handleBatchReject = () => {
    const selectedKeys = viewMode === 'detail' ? selectedRowKeys : selectedSummaryRowKeys;
    if (selectedKeys.length === 0) {
      messageApi.warning('请先选择要驳回的订单');
      return;
    }
    setRejectModalVisible(true);
  };

  const confirmBatchApprove = async () => {
    const selectedKeys = viewMode === 'detail' ? selectedRowKeys : selectedSummaryRowKeys;
    try {
      setLoading(true);
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      const operatorName = userInfo.realName || userInfo.userName || '管理员';

      // 批量审核通过
      let successCount = 0;
      for (const key of selectedKeys) {
        const response = await api.post(`/api/scm/purchases/orders/${key}/approve`, {
          operatorName: operatorName,
          remark: ''
        });
        if (response.code === 1) {
          successCount++;
        }
      }
      messageApi.success(`已成功审核通过 ${successCount} 个订单`);
      loadPurchaseOrders();
      setApproveModalVisible(false);
      setSelectedRowKeys([]);
      setSelectedSummaryRowKeys([]);
    } catch (error) {
      console.error('批量审核通过失败:', error);
      messageApi.error('批量审核通过失败，请检查网络连接或联系管理员');
    } finally {
      setLoading(false);
    }
  };

  const confirmBatchReject = async () => {
    const selectedKeys = viewMode === 'detail' ? selectedRowKeys : selectedSummaryRowKeys;
    try {
      setLoading(true);
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      const operatorName = userInfo.realName || userInfo.userName || '管理员';

      // 批量驳回
      let successCount = 0;
      for (const key of selectedKeys) {
        const response = await api.post(`/api/scm/purchases/orders/${key}/reject`, {
          operatorName: operatorName,
          remark: '批量驳回'
        });
        if (response.code === 1) {
          successCount++;
        }
      }
      messageApi.warning(`已成功驳回 ${successCount} 个订单`);
      loadPurchaseOrders();
      setRejectModalVisible(false);
      setSelectedRowKeys([]);
      setSelectedSummaryRowKeys([]);
    } catch (error) {
      console.error('批量驳回失败:', error);
      messageApi.error('批量驳回失败，请检查网络连接或联系管理员');
    } finally {
      setLoading(false);
    }
  };

  const handleItemApprovalChange = (orderNo, itemIndex, action) => {
    const key = `${orderNo}-${itemIndex}`;
    setItemApprovalSelections(prev => {
      const newSelections = { ...prev };
      
      // 如果点击已选中的按钮，则清除选择
      if (newSelections[key] === action) {
        delete newSelections[key];
      } else {
        // 否则设置新的选择
        newSelections[key] = action;
      }
      
      return newSelections;
    });
  };

  const handleUnitChange = (orderNo, itemIndex, value) => {
    const key = `${orderNo}-${itemIndex}`;
    setEditableUnits(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleQuantityChange = (orderNo, itemIndex, value) => {
    const key = `${orderNo}-${itemIndex}`;
    setEditableQuantities(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // 计算单个商品的总价
  const calculateItemTotal = (orderNo, itemIndex, price, quantity) => {
    const editedQuantity = editableQuantities[`${orderNo}-${itemIndex}`];
    const actualQuantity = editedQuantity !== undefined ? editedQuantity : quantity;
    return (price * actualQuantity).toFixed(2);
  };

  // 计算合计金额和数量
  const calculateTotals = () => {
    if (!currentOrder) return { totalQuantity: 0, totalAmount: 0 };
    
    let totalQuantity = 0;
    let totalAmount = 0;
    
    if (currentOrder.items) {
      // 汇总视图：多个明细项
      currentOrder.items.forEach((item, index) => {
        const editedQuantity = editableQuantities[`${currentOrder.orderNo}-${index}`];
        const actualQuantity = editedQuantity !== undefined ? editedQuantity : item.quantity;
        totalQuantity += actualQuantity;
        totalAmount += item.price * actualQuantity;
      });
    } else {
      // 明细视图：单个明细项
      const editedQuantity = editableQuantities[`${currentOrder.orderNo}-0`];
      const actualQuantity = editedQuantity !== undefined ? editedQuantity : currentOrder.quantity;
      totalQuantity = actualQuantity;
      totalAmount = currentOrder.price * actualQuantity;
    }
    
    return {
      totalQuantity,
      totalAmount: totalAmount.toFixed(2)
    };
  };

  const handleSubmitApproval = async () => {
    const selectedItems = Object.entries(itemApprovalSelections);
    
    if (selectedItems.length === 0) {
      messageApi.warning('请至少选择一项进行审核');
      return;
    }
    
    try {
      setLoading(true);
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      const operatorName = userInfo.realName || userInfo.userName || '管理员';
      const itemDecisions = (currentOrder?.items || []).map((item, index) => {
        const action = itemApprovalSelections[`${currentOrder.orderNo}-${index}`];
        return {
          purchaseOrderItemId: item.id,
          action,
        };
      });

      const approveCount = itemDecisions.filter(item => item.action === 'approve').length;
      const rejectCount = itemDecisions.filter(item => item.action === 'reject').length;
      const allRejected = rejectCount === itemDecisions.length;

      const endpoint = allRejected ? 'reject' : 'approve';
      const response = await api.post(`/api/scm/purchases/orders/${currentOrder.key}/${endpoint}`, {
        operatorName,
        reason: rejectCount > 0 ? '采购审核驳回' : '',
        itemDecisions,
      });

      if (response.code !== 1) {
        messageApi.error(response.message || '提交审核失败');
        return;
      }
      
      // 显示汇总信息
      if (approveCount > 0 && rejectCount > 0) {
        messageApi.success(`已提交审核：${approveCount} 项通过，${rejectCount} 项驳回`);
      } else if (approveCount > 0) {
        messageApi.success(`已提交审核：${approveCount} 项全部通过`);
      } else if (rejectCount > 0) {
        messageApi.warning(`已提交审核：${rejectCount} 项全部驳回`);
      }
      
      // 清空选择
      setItemApprovalSelections({});
      setDetailVisible(false);
      loadPurchaseOrders();
    } catch (error) {
      console.error('提交审核失败:', error);
      messageApi.error('提交审核失败，请检查网络连接或联系管理员');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '0 16px' }}>
      {contextHolder}
      <h1 style={{ marginBottom: 24 }}>采购审核</h1>
      
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
                value={searchParams.orderNo}
                onChange={(e) => handleSearchChange('orderNo', e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ whiteSpace: 'nowrap' }}>采购分院：</span>
              <Select 
                placeholder="请选择采购分院" 
                allowClear
                style={{ width: 180 }}
                size="middle"
                value={searchParams.department}
                onChange={(value) => handleSearchChange('department', value)}
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
                value={searchParams.productCode}
                onChange={(e) => handleSearchChange('productCode', e.target.value)}
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
                onChange={(e) => handleSearchChange('productName', e.target.value)}
              />
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
              type="primary" 
              style={{ backgroundColor: '#52c41a', borderColor: '#52c41a', minWidth: 90 }}
              onClick={handleBatchApprove}
            >
              通过
            </Button>
            <Button 
              type="primary" 
              danger
              style={{ minWidth: 90 }}
              onClick={handleBatchReject}
            >
              驳回
            </Button>
          </div>
        </div>
      </Card>

      <Card>
        <Table 
          columns={viewMode === 'detail' ? columns : summaryColumns} 
          dataSource={viewMode === 'detail' ? [] : summaryOrders} 
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
          size="small"
          loading={loading}
        />
      </Card>

      {/* 采购审核弹窗 */}
      <Modal
        title="采购审核"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        width={1200}
        footer={[
          <Button key="close" onClick={() => setDetailVisible(false)} style={{ minWidth: '80px', height: '36px' }}>关闭</Button>,
          currentOrder?.status === '待审核' && (
            <Button key="submit" type="primary" onClick={handleSubmitApproval} style={{ minWidth: '80px', height: '36px', backgroundColor: '#1890ff', borderColor: '#1890ff' }}>
              提交
            </Button>
          )
        ]}
        style={{ top: 20 }}
      >
        {currentOrder && (
          <>
            {/* 订单基本信息 */}
            <div style={{ 
              marginBottom: 24,
              padding: '16px',
              border: '1px solid #f0f0f0',
              borderRadius: '8px',
              backgroundColor: '#fafafa'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                marginBottom: '12px',
                color: '#666',
                fontWeight: '500'
              }}>
                <span style={{ 
                  display: 'inline-block',
                  width: '4px',
                  height: '16px',
                  backgroundColor: '#1890ff',
                  marginRight: '8px',
                  borderRadius: '2px'
                }} />
                采购审核
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                <div>
                  <div style={{ color: '#8c8c8c', fontSize: '12px', marginBottom: '4px' }}>采购单号</div>
                  <div style={{ fontWeight: '500' }}>{currentOrder.orderNo}</div>
                </div>
                <div>
                  <div style={{ color: '#8c8c8c', fontSize: '12px', marginBottom: '4px' }}>采购分院</div>
                  <div style={{ fontWeight: '500' }}>{currentOrder.department}</div>
                </div>
                <div>
                  <div style={{ color: '#8c8c8c', fontSize: '12px', marginBottom: '4px' }}>申请人</div>
                  <div style={{ fontWeight: '500' }}>{currentOrder.applicant}</div>
                </div>
                <div>
                  <div style={{ color: '#8c8c8c', fontSize: '12px', marginBottom: '4px' }}>创建日期</div>
                  <div style={{ fontWeight: '500' }}>{currentOrder.createTime}</div>
                </div>
                <div>
                  <div style={{ color: '#8c8c8c', fontSize: '12px', marginBottom: '4px' }}>状态</div>
                  <div style={{ fontWeight: '500' }}>
                    <Tag color={currentOrder.status === '待审核' ? 'orange' : currentOrder.status === '已审核' ? 'green' : 'red'}>
                      {currentOrder.status}
                    </Tag>
                  </div>
                </div>
                <div>
                  <div style={{ color: '#8c8c8c', fontSize: '12px', marginBottom: '4px' }}>采购数量</div>
                  <div style={{ fontWeight: '500', color: '#1890ff' }}>{currentOrder.totalQuantity || currentOrder.quantity || 0}</div>
                </div>
                <div>
                  <div style={{ color: '#8c8c8c', fontSize: '12px', marginBottom: '4px' }}>合计金额</div>
                  <div style={{ fontWeight: '500', color: '#1890ff' }}>
                    ¥{(currentOrder.totalAmount || 0)?.toFixed(2)}
                  </div>
                </div>
                <div>
                  <div style={{ color: '#8c8c8c', fontSize: '12px', marginBottom: '4px' }}>审核时间</div>
                  <div style={{ fontWeight: '500' }}>{currentOrder.approveTime || '-'}</div>
                </div>
                <div>
                  <div style={{ color: '#8c8c8c', fontSize: '12px', marginBottom: '4px' }}>审核人</div>
                  <div style={{ fontWeight: '500' }}>{currentOrder.approver || '-'}</div>
                </div>
                <div>
                  <div style={{ color: '#8c8c8c', fontSize: '12px', marginBottom: '4px' }}>申请原因</div>
                  <div style={{ fontWeight: '500' }}>{currentOrder.reason}</div>
                </div>
              </div>
            </div>

            {/* 采购明细表格 */}
            <div style={{ 
              overflowX: 'auto', 
              marginBottom: 16,
              border: '1px solid #f0f0f0',
              borderRadius: 8
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#fafafa' }}>
                    <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '100px' }}>物资编码</th>
                    <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '150px' }}>物资名称</th>
                    <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '100px' }}>规格</th>
                    <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '80px' }}>型号</th>
                    <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '80px' }}>单位</th>
                    <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '100px' }}>采购价格</th>
                    <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '120px' }}>采购数量</th>
                    <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '120px' }}>合计金额</th>
                    <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '100px' }}>状态</th>
                    <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '150px' }}>生产厂家</th>
                    <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '80px' }}>通过</th>
                    <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '80px' }}>驳回</th>
                  </tr>
                </thead>
                <tbody>
                  {currentOrder.items ? (
                    // 汇总视图：显示多个明细项
                    currentOrder.items.map((item, index) => (
                      <tr key={index} style={{ borderBottom: '1px solid #f0f0f0' }}>
                        <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>{item.productCode}</td>
                        <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>{item.product}</td>
                        <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>{item.specification}</td>
                        <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>{item.model}</td>
                        <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>
                          <input
                            type="text"
                            value={editableUnits[`${currentOrder.orderNo}-${index}`] || item.unit}
                            onChange={(e) => handleUnitChange(currentOrder.orderNo, index, e.target.value)}
                            style={{
                              width: '100%',
                              border: '1px solid #d9d9d9',
                              borderRadius: '4px',
                              padding: '4px 8px',
                              textAlign: 'center'
                            }}
                            disabled={currentOrder.status !== '待审核'}
                          />
                        </td>
                        <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>¥{item.price?.toFixed(2)}</td>
                        <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>
                          <InputNumber
                            min={1}
                            value={editableQuantities[`${currentOrder.orderNo}-${index}`] || item.quantity}
                            onChange={(value) => handleQuantityChange(currentOrder.orderNo, index, value)}
                            style={{ width: '100%' }}
                            disabled={currentOrder.status !== '待审核'}
                          />
                        </td>
                        <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>
                          ¥{calculateItemTotal(currentOrder.orderNo, index, item.price, item.quantity)}
                        </td>
                        <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>
                          <Tag color={
                            item.status === 'DRAFT' || item.status === '待提交' ? 'warning' :
                            item.status === 'WAIT_AUDIT' || item.status === '待审核' ? 'blue' :
                            item.status === 'REJECTED' || item.status === '已驳回' ? 'error' :
                            'success'
                          }>
                            {item.status || '待处理'}
                          </Tag>
                        </td>
                        <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>{item.manufacturer}</td>
                        <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>
                          <input
                            type="radio"
                            name={`approval-${currentOrder.orderNo}-${index}`}
                            value="approve"
                            checked={itemApprovalSelections[`${currentOrder.orderNo}-${index}`] === 'approve'}
                            onChange={() => handleItemApprovalChange(currentOrder.orderNo, index, 'approve')}
                            disabled={currentOrder.status !== '待审核'}
                          />
                        </td>
                        <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>
                          <input
                            type="radio"
                            name={`approval-${currentOrder.orderNo}-${index}`}
                            value="reject"
                            checked={itemApprovalSelections[`${currentOrder.orderNo}-${index}`] === 'reject'}
                            onChange={() => handleItemApprovalChange(currentOrder.orderNo, index, 'reject')}
                            disabled={currentOrder.status !== '待审核'}
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    // 明细视图：显示单个明细项
                    <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>{currentOrder.productCode}</td>
                      <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>{currentOrder.product}</td>
                      <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>{currentOrder.specification}</td>
                      <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>{currentOrder.model}</td>
                      <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>
                          <input
                            type="text"
                            value={editableUnits[`${currentOrder.orderNo}-0`] || currentOrder.unit}
                            onChange={(e) => handleUnitChange(currentOrder.orderNo, 0, e.target.value)}
                            style={{
                              width: '100%',
                              border: '1px solid #d9d9d9',
                              borderRadius: '4px',
                              padding: '4px 8px',
                              textAlign: 'center'
                            }}
                            disabled={currentOrder.status !== '待审核'}
                          />
                        </td>
                      <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>¥{currentOrder.price?.toFixed(2)}</td>
                      <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>
                          <InputNumber
                            min={1}
                            value={editableQuantities[`${currentOrder.orderNo}-0`] || currentOrder.quantity}
                            onChange={(value) => handleQuantityChange(currentOrder.orderNo, 0, value)}
                            style={{ width: '100%' }}
                            disabled={currentOrder.status !== '待审核'}
                          />
                        </td>
                      <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>
                          ¥{calculateItemTotal(currentOrder.orderNo, 0, currentOrder.price, currentOrder.quantity)}
                        </td>
                      <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>
                        <Tag color={
                          currentOrder.status === 'DRAFT' || currentOrder.status === '待提交' ? 'warning' :
                          currentOrder.status === 'WAIT_AUDIT' || currentOrder.status === '待审核' ? 'blue' :
                          currentOrder.status === 'REJECTED' || currentOrder.status === '已驳回' ? 'error' :
                          'success'
                        }>
                          {currentOrder.status || '待处理'}
                        </Tag>
                      </td>
                      <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>{currentOrder.manufacturer}</td>
                      <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>
                        <input
                          type="radio"
                          name={`approval-${currentOrder.orderNo}-0`}
                          value="approve"
                          checked={itemApprovalSelections[`${currentOrder.orderNo}-0`] === 'approve'}
                          onChange={() => handleItemApprovalChange(currentOrder.orderNo, 0, 'approve')}
                          disabled={currentOrder.status !== '待审核'}
                        />
                      </td>
                      <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>
                        <input
                          type="radio"
                          name={`approval-${currentOrder.orderNo}-0`}
                          value="reject"
                          checked={itemApprovalSelections[`${currentOrder.orderNo}-0`] === 'reject'}
                          onChange={() => handleItemApprovalChange(currentOrder.orderNo, 0, 'reject')}
                          disabled={currentOrder.status !== '待审核'}
                        />
                      </td>
                    </tr>
                  )}
                  {/* 汇总行（仅汇总视图显示） */}
                  {currentOrder.items && currentOrder.items.length > 0 && (
                    <tr style={{ backgroundColor: '#f6ffed', borderTop: '2px solid #52c41a' }}>
                      <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', fontWeight: 'bold' }} colSpan="6">合计</td>
                      <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', fontWeight: 'bold', color: '#1890ff' }}>
                        {calculateTotals().totalQuantity}
                      </td>
                      <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', fontWeight: 'bold', color: '#52c41a' }}>
                        ¥{calculateTotals().totalAmount}
                      </td>
                      <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', fontWeight: 'bold' }} colSpan="4">
                        共 {currentOrder.items.length} 项商品
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>



            {/* 备注栏 */}
            <div style={{ 
              marginBottom: 24,
              padding: '16px',
              border: '1px solid #f0f0f0',
              borderRadius: '8px',
              backgroundColor: '#fafafa'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                marginBottom: '12px',
                color: '#666',
                fontWeight: '500'
              }}>
                <span style={{ 
                  display: 'inline-block',
                  width: '4px',
                  height: '16px',
                  backgroundColor: '#1890ff',
                  marginRight: '8px',
                  borderRadius: '2px'
                }} />
                备注
              </div>
              {currentOrder.rejectReason ? (
                <div style={{ 
                  width: '100%',
                  border: '1px solid #d9d9d9',
                  borderRadius: '6px',
                  padding: '12px',
                  backgroundColor: '#fff1f0',
                  borderColor: '#ffccc7',
                  color: '#cf1322'
                }}>
                  {currentOrder.rejectReason}
                </div>
              ) : (
                <div style={{ 
                  width: '100%',
                  border: '1px solid #d9d9d9',
                  borderRadius: '6px',
                  padding: '12px',
                  backgroundColor: '#ffffff',
                  color: '#8c8c8c'
                }}>
                  无备注信息
                </div>
              )}
            </div>
          </>
        )}
      </Modal>

      <Modal
        title="批量通过确认"
        open={approveModalVisible}
        onOk={confirmBatchApprove}
        onCancel={() => setApproveModalVisible(false)}
        okText="确认通过"
        cancelText="取消"
      >
        <p>确认要审核通过选中的订单吗？</p>
      </Modal>

      <Modal
        title="批量驳回确认"
        open={rejectModalVisible}
        onOk={confirmBatchReject}
        onCancel={() => setRejectModalVisible(false)}
        okText="确认驳回"
        cancelText="取消"
      >
        <p>确认要驳回选中的订单吗？</p>
      </Modal>
    </div>
  );
};

export default PurchaseOrderApproval;
