import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, Table, Button, Input, Select, Space, Tag, Modal, message, InputNumber } from 'antd';
import { EyeOutlined, SearchOutlined } from '@ant-design/icons';



const PurchaseOrderApproval = () => {
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

  const departments = ['内科', '外科', '儿科', '妇产科', '急诊科'];

  const orders = useMemo(() => [
    // PO-20241227-001 内科采购单 - 3条明细
    { 
      key: '1-1', 
      orderNo: 'PO-20241227-001', 
      productCode: 'MED-001',
      product: '医用口罩', 
      specification: 'N95 医用防护口罩',
      model: 'N95-2024',
      quantity: 20, 
      unit: '盒',
      manufacturer: '医疗用品有限公司',
      department: '内科', 
      applicant: '张三', 
      createTime: '2024-12-27 09:30',
      status: '待审核',
      price: 25.00,
      totalAmount: 500.00,
      reason: '日常消耗补充库存',
      remark: '需加急采购'
    },
    { 
      key: '1-2', 
      orderNo: 'PO-20241227-001', 
      productCode: 'MED-002',
      product: '一次性手套', 
      specification: '医用乳胶手套',
      model: 'GL-2024',
      quantity: 15, 
      unit: '盒',
      manufacturer: '医疗器械有限公司',
      department: '内科', 
      applicant: '张三', 
      createTime: '2024-12-27 09:30',
      status: '待审核',
      price: 15.00,
      totalAmount: 225.00,
      reason: '日常消耗补充库存',
      remark: '需加急采购'
    },
    { 
      key: '1-3', 
      orderNo: 'PO-20241227-001', 
      productCode: 'MED-003',
      product: '消毒酒精', 
      specification: '75% 医用酒精',
      model: 'AL-2024',
      quantity: 15, 
      unit: '瓶',
      manufacturer: '消毒用品有限公司',
      department: '内科', 
      applicant: '张三', 
      createTime: '2024-12-27 09:30',
      status: '待审核',
      price: 18.00,
      totalAmount: 270.00,
      reason: '日常消耗补充库存',
      remark: '需加急采购'
    },
    
    // PO-20241227-002 外科采购单 - 3条明细
    { 
      key: '2-1', 
      orderNo: 'PO-20241227-002', 
      productCode: 'MED-004',
      product: '手术衣', 
      specification: '一次性无菌手术衣',
      model: 'SY-2024',
      quantity: 30, 
      unit: '件',
      manufacturer: '手术用品有限公司',
      department: '外科', 
      applicant: '李四', 
      createTime: '2024-12-27 10:15',
      status: '待审核',
      price: 35.00,
      totalAmount: 1050.00,
      reason: '手术室用品补充',
      remark: '常规采购'
    },
    { 
      key: '2-2', 
      orderNo: 'PO-20241227-002', 
      productCode: 'MED-005',
      product: '手术帽', 
      specification: '一次性无纺布手术帽',
      model: 'SM-2024',
      quantity: 40, 
      unit: '包',
      manufacturer: '手术用品有限公司',
      department: '外科', 
      applicant: '李四', 
      createTime: '2024-12-27 10:15',
      status: '待审核',
      price: 8.00,
      totalAmount: 320.00,
      reason: '手术室用品补充',
      remark: '常规采购'
    },
    { 
      key: '2-3', 
      orderNo: 'PO-20241227-002', 
      productCode: 'MED-006',
      product: '手术鞋套', 
      specification: '一次性防滑鞋套',
      model: 'SX-2024',
      quantity: 30, 
      unit: '双',
      manufacturer: '手术用品有限公司',
      department: '外科', 
      applicant: '李四', 
      createTime: '2024-12-27 10:15',
      status: '待审核',
      price: 4.33,
      totalAmount: 130.00,
      reason: '手术室用品补充',
      remark: '常规采购'
    },
    
    // PO-20241226-003 儿科采购单 - 2条明细
    { 
      key: '3-1', 
      orderNo: 'PO-20241226-003', 
      productCode: 'MED-007',
      product: '儿童退烧贴', 
      specification: '儿童专用退烧贴',
      model: 'ET-2024',
      quantity: 10, 
      unit: '盒',
      manufacturer: '儿童医疗用品有限公司',
      department: '儿科', 
      applicant: '王五', 
      createTime: '2024-12-26 14:20',
      status: '待审核',
      price: 12.00,
      totalAmount: 120.00,
      reason: '常规消毒用品',
      remark: '每月常规采购'
    },
    { 
      key: '3-2', 
      orderNo: 'PO-20241226-003', 
      productCode: 'MED-008',
      product: '儿童体温计', 
      specification: '电子体温计',
      model: 'TT-2024',
      quantity: 10, 
      unit: '个',
      manufacturer: '儿童医疗用品有限公司',
      department: '儿科', 
      applicant: '王五', 
      createTime: '2024-12-26 14:20',
      status: '待审核',
      price: 24.00,
      totalAmount: 240.00,
      reason: '常规消毒用品',
      remark: '每月常规采购'
    },
    
    // PO-20241226-004 急诊科采购单 - 4条明细
    { 
      key: '4-1', 
      orderNo: 'PO-20241226-004', 
      productCode: 'MED-009',
      product: '急救包', 
      specification: '标准急救包',
      model: 'JB-2024',
      quantity: 25, 
      unit: '个',
      manufacturer: '急救用品有限公司',
      department: '急诊科', 
      applicant: '赵六', 
      createTime: '2024-12-26 16:30',
      status: '待审核',
      price: 45.00,
      totalAmount: 1125.00,
      reason: '急诊室消耗',
      remark: '紧急采购，请优先处理'
    },
    { 
      key: '4-2', 
      orderNo: 'PO-20241226-004', 
      productCode: 'MED-010',
      product: '止血带', 
      specification: '医用止血带',
      model: 'ZT-2024',
      quantity: 25, 
      unit: '个',
      manufacturer: '急救用品有限公司',
      department: '急诊科', 
      applicant: '赵六', 
      createTime: '2024-12-26 16:30',
      status: '待审核',
      price: 15.00,
      totalAmount: 375.00,
      reason: '急诊室消耗',
      remark: '紧急采购，请优先处理'
    },
    { 
      key: '4-3', 
      orderNo: 'PO-20241226-004', 
      productCode: 'MED-011',
      product: '氧气面罩', 
      specification: '成人氧气面罩',
      model: 'YM-2024',
      quantity: 25, 
      unit: '个',
      manufacturer: '急救用品有限公司',
      department: '急诊科', 
      applicant: '赵六', 
      createTime: '2024-12-26 16:30',
      status: '待审核',
      price: 25.00,
      totalAmount: 625.00,
      reason: '急诊室消耗',
      remark: '紧急采购，请优先处理'
    },
    { 
      key: '4-4', 
      orderNo: 'PO-20241226-004', 
      productCode: 'MED-012',
      product: '急救担架', 
      specification: '折叠式急救担架',
      model: 'DJ-2024',
      quantity: 25, 
      unit: '个',
      manufacturer: '急救用品有限公司',
      department: '急诊科', 
      applicant: '赵六', 
      createTime: '2024-12-26 16:30',
      status: '待审核',
      price: 15.00,
      totalAmount: 375.00,
      reason: '急诊室消耗',
      remark: '紧急采购，请优先处理'
    },
  ], []);

  // 计算采购单汇总数据
  const calculateSummaryOrders = useCallback(() => {
    const summaryMap = {};
    
    orders.forEach(order => {
      const orderNo = order.orderNo;
      
      if (!summaryMap[orderNo]) {
        summaryMap[orderNo] = {
          key: orderNo,
          orderNo: orderNo,
          department: order.department,
          createTime: order.createTime,
          status: order.status,
          totalQuantity: 0,
          totalAmount: 0,
          items: [],
          applicant: order.applicant,
          approver: order.approver,
          approveTime: order.approveTime,
          reason: order.reason,
          rejectReason: order.rejectReason,
          remark: order.remark
        };
      }
      
      // 累加数量和金额
      summaryMap[orderNo].totalQuantity += order.quantity;
      summaryMap[orderNo].totalAmount += order.totalAmount;
      
      // 添加明细项
      summaryMap[orderNo].items.push({
        productCode: order.productCode,
        product: order.product,
        specification: order.specification,
        model: order.model,
        quantity: order.quantity,
        unit: order.unit,
        price: order.price,
        amount: order.totalAmount,
        manufacturer: order.manufacturer
      });
    });
    
    return Object.values(summaryMap);
  }, [orders]);

  // 初始化汇总数据
  useEffect(() => {
    const calculatedSummary = calculateSummaryOrders();
    setSummaryOrders(calculatedSummary);
  }, [calculateSummaryOrders]);

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
        const colors = {
          '待审核': 'orange',
          '已审核': 'green',
          '已驳回': 'red'
        };
        return <Tag color={colors[status]}>{status}</Tag>;
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

  // 采购单汇总视图列配置
  const summaryColumns = [
    {
      title: '',
      key: 'checkbox',
      width: 40,
      render: (_, record) => (
        <input 
          type="checkbox" 
          checked={selectedSummaryRowKeys.includes(record.orderNo)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedSummaryRowKeys([...selectedSummaryRowKeys, record.orderNo]);
            } else {
              setSelectedSummaryRowKeys(selectedSummaryRowKeys.filter(key => key !== record.orderNo));
            }
          }}
        />
      )
    },
    { title: '订单号', dataIndex: 'orderNo', key: 'orderNo' },
    { title: '申领科室', dataIndex: 'department', key: 'department' },
    { 
      title: '采购数量', 
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
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime' },
    {
      title: '状态', 
      dataIndex: 'status', 
      key: 'status',
      render: (status) => {
        const colors = {
          '待审核': 'orange',
          '已审核': 'green',
          '已驳回': 'red'
        };
        return <Tag color={colors[status]}>{status}</Tag>;
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

  const handleApprove = (record) => {
    message.success(`订单 ${record.orderNo} 已审核通过`);
  };

  const handleReject = (record) => {
    // 这里应该有实际的驳回逻辑，包括添加驳回原因
    // 为了演示，我们假设已经添加了驳回原因
    message.warning(`订单 ${record.orderNo} 已被驳回`);
    setDetailVisible(false);
  };

  const handleBatchApprove = () => {
    const selectedKeys = viewMode === 'detail' ? selectedRowKeys : selectedSummaryRowKeys;
    if (selectedKeys.length === 0) {
      message.warning('请先选择要审核的订单');
      return;
    }
    setApproveModalVisible(true);
  };

  const handleBatchReject = () => {
    const selectedKeys = viewMode === 'detail' ? selectedRowKeys : selectedSummaryRowKeys;
    if (selectedKeys.length === 0) {
      message.warning('请先选择要驳回的订单');
      return;
    }
    setRejectModalVisible(true);
  };

  const confirmBatchApprove = () => {
    const selectedKeys = viewMode === 'detail' ? selectedRowKeys : selectedSummaryRowKeys;
    message.success(`已成功审核通过 ${selectedKeys.length} 个订单`);
    setApproveModalVisible(false);
    setSelectedRowKeys([]);
    setSelectedSummaryRowKeys([]);
  };

  const confirmBatchReject = () => {
    const selectedKeys = viewMode === 'detail' ? selectedRowKeys : selectedSummaryRowKeys;
    message.warning(`已成功驳回 ${selectedKeys.length} 个订单`);
    setRejectModalVisible(false);
    setSelectedRowKeys([]);
    setSelectedSummaryRowKeys([]);
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

  const handleSubmitApproval = () => {
    const selectedItems = Object.entries(itemApprovalSelections);
    
    if (selectedItems.length === 0) {
      message.warning('请至少选择一项进行审核');
      return;
    }
    
    // 显示编辑后的数据
    console.log('编辑后的单位数据:', editableUnits);
    console.log('编辑后的采购数量数据:', editableQuantities);
    
    // 统计通过和驳回的数量
    let approveCount = 0;
    let rejectCount = 0;
    
    selectedItems.forEach(([key, action]) => {
      if (action === 'approve') {
        approveCount++;
      } else if (action === 'reject') {
        rejectCount++;
      }
    });
    
    // 显示汇总信息
    if (approveCount > 0 && rejectCount > 0) {
      message.success(`已提交审核：${approveCount} 项通过，${rejectCount} 项驳回`);
    } else if (approveCount > 0) {
      message.success(`已提交审核：${approveCount} 项全部通过`);
    } else if (rejectCount > 0) {
      message.warning(`已提交审核：${rejectCount} 项全部驳回`);
    }
    
    // 清空选择
    setItemApprovalSelections({});
    setDetailVisible(false);
  };

  return (
    <div style={{ padding: '0 16px' }}>
      <h1 style={{ marginBottom: 24 }}>采购审核</h1>
      
      <Card style={{ marginBottom: 16 }}>
        <Space wrap>
          <Input placeholder="订单号" style={{ width: 200 }} />
          <Select placeholder="申领科室" style={{ width: 150 }}>
            {departments.map((dept, index) => (
              <Select.Option key={index} value={dept}>{dept}</Select.Option>
            ))}
          </Select>
          <Select placeholder="状态" style={{ width: 120 }}>
            <Select.Option value="pending">待审核</Select.Option>
            <Select.Option value="approved">已审核</Select.Option>
            <Select.Option value="rejected">已驳回</Select.Option>
          </Select>
          <Select
            placeholder="单据筛选"
            style={{ width: 150 }}
            value={hasSelectedView ? (viewMode === 'summary' ? 'summary' : 'detail') : undefined}
            onChange={(value) => {
              setViewMode(value);
              setHasSelectedView(true);
              message.info(`已切换到${value === 'detail' ? '采购明细' : '采购单'}视图`);
            }}
          >
            <Select.Option value="summary">采购单据</Select.Option>
            <Select.Option value="detail">采购明细</Select.Option>
          </Select>
          <Button type="primary" icon={<SearchOutlined />}>查询</Button>
          <Button type="primary" style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }} onClick={handleBatchApprove}>通过</Button>
          <Button type="primary" danger onClick={handleBatchReject}>驳回</Button>
        </Space>
      </Card>

      <Card>
        <Table 
          columns={viewMode === 'detail' ? columns : summaryColumns} 
          dataSource={viewMode === 'detail' ? orders : summaryOrders} 
          pagination={{ 
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: false,
            showTotal: (total) => `共 ${total} 条记录`,
            style: {
              display: 'flex',
              justifyContent: 'center',
              marginTop: '16px'
            }
          }} 
          size="small"
          loading={viewMode === 'summary' && summaryOrders.length === 0}
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
                订单信息
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                <div>
                  <div style={{ color: '#8c8c8c', fontSize: '12px', marginBottom: '4px' }}>订单号</div>
                  <div style={{ fontWeight: '500' }}>{currentOrder.orderNo}</div>
                </div>
                <div>
                  <div style={{ color: '#8c8c8c', fontSize: '12px', marginBottom: '4px' }}>申领科室</div>
                  <div style={{ fontWeight: '500' }}>{currentOrder.department}</div>
                </div>
                <div>
                  <div style={{ color: '#8c8c8c', fontSize: '12px', marginBottom: '4px' }}>申请人</div>
                  <div style={{ fontWeight: '500' }}>{currentOrder.applicant}</div>
                </div>
                <div>
                  <div style={{ color: '#8c8c8c', fontSize: '12px', marginBottom: '4px' }}>创建时间</div>
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
                    <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '150px' }}>商品名称</th>
                    <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '100px' }}>规格</th>
                    <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '80px' }}>型号</th>
                    <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '80px' }}>单位</th>
                    <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '100px' }}>单价</th>
                    <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '120px' }}>采购数量</th>
                    <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '120px' }}>总价</th>
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
                      <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', fontWeight: 'bold' }} colSpan="8">合计</td>
                      <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', fontWeight: 'bold', color: '#1890ff' }}>
                        {calculateTotals().totalQuantity}
                      </td>
                      <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', fontWeight: 'bold', color: '#52c41a' }}>
                        ¥{calculateTotals().totalAmount}
                      </td>
                      <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', fontWeight: 'bold' }}>
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
