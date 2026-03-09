import React, { useState, useEffect } from 'react';
import { 
  Table, Button, Modal, Form, Input, Select, DatePicker, InputNumber, 
  message, Card, Space, Tag, Divider, Popconfirm, Row, Col, Tooltip 
} from 'antd';
import { 
  DeleteOutlined, EditOutlined, CheckCircleOutlined, WarningOutlined, 
  ClockCircleOutlined, CloseCircleOutlined, EyeOutlined, SaveOutlined,
  ReloadOutlined, SearchOutlined, RedoOutlined 
} from '@ant-design/icons';
import moment from 'moment';

const { Option } = Select;
const { TextArea } = Input;

const AbnormalOrderManagement = () => {
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [abnormalOrders, setAbnormalOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchForm] = Form.useForm();

  // 模拟异常订单数据 - 包含已拒收、超时未验收、已终止的订单
  useEffect(() => {
    const mockData = [
      {
        id: 1,
        orderNo: 'PO-20260110-001',
        supplierName: '医疗用品供应商A',
        supplierCode: 'SUP-A001',
        department: '采购部',
        buyer: '张三',
        contactPerson: '李四',
        contactPhone: '13800138000',
        orderDate: '2026-01-10',
        expectedDeliveryDate: '2026-01-15',
        actualDeliveryDate: '2026-01-15',
        status: '已拒收',
        rejectReason: '产品质量不符合要求，包装破损',
        totalAmount: 15000.00,
        createdAt: '2026-01-16 10:30:00',
        items: [
          {
            key: '1-1',
            productCode: 'PROD011',
            productName: '医用手套',
            specification: '乳胶 100只/盒',
            model: 'GLOVE-100',
            manufacturer: '手套制造厂A',
            registrationNumber: 'REG-2024-011',
            unit: '盒',
            quantity: 500,
            price: 30.00,
            amount: 15000.00,
            status: '已拒收',
            rejectReason: '包装破损，部分产品受潮'
          }
        ]
      },
      {
        id: 2,
        orderNo: 'PO-20260109-002',
        supplierName: '医疗器械供应商B',
        supplierCode: 'SUP-B002',
        department: '采购部',
        buyer: '李四',
        contactPerson: '王五',
        contactPhone: '13900139000',
        orderDate: '2026-01-09',
        expectedDeliveryDate: '2026-01-14',
        actualDeliveryDate: null,
        status: '超时未验收',
        timeoutReason: '供应商未按时送货，已超过约定时间3天',
        totalAmount: 8000.00,
        createdAt: '2026-01-17 14:20:00',
        items: [
          {
            key: '2-1',
            productCode: 'PROD012',
            productName: '血压计',
            specification: '电子血压计',
            model: 'BP-001',
            manufacturer: '血压计制造厂B',
            registrationNumber: 'REG-2024-012',
            unit: '台',
            quantity: 10,
            price: 800.00,
            amount: 8000.00,
            status: '超时未验收',
            timeoutReason: '供应商生产延误'
          }
        ]
      },
      {
        id: 3,
        orderNo: 'PO-20260108-003',
        supplierName: '消毒用品供应商C',
        supplierCode: 'SUP-C003',
        department: '采购部',
        buyer: '王五',
        contactPerson: '赵六',
        contactPhone: '13700137000',
        orderDate: '2026-01-08',
        expectedDeliveryDate: '2026-01-13',
        actualDeliveryDate: '2026-01-13',
        status: '已拒收',
        rejectReason: '供应商无法提供合格的产品注册证',
        totalAmount: 6000.00,
        createdAt: '2026-01-14 09:15:00',
        items: [
          {
            key: '3-1',
            productCode: 'PROD013',
            productName: '消毒湿巾',
            specification: '100片/包',
            model: 'WIPE-100',
            manufacturer: '湿巾制造厂C',
            registrationNumber: 'REG-2024-013',
            unit: '包',
            quantity: 200,
            price: 30.00,
            amount: 6000.00,
            status: '已拒收',
            rejectReason: '产品注册证已过期'
          }
        ]
      },
      {
        id: 4,
        orderNo: 'PO-20260107-004',
        supplierName: '医疗耗材供应商D',
        supplierCode: 'SUP-D004',
        department: '采购部',
        buyer: '赵六',
        contactPerson: '钱七',
        contactPhone: '13600136000',
        orderDate: '2026-01-07',
        expectedDeliveryDate: '2026-01-12',
        actualDeliveryDate: '2026-01-12',
        status: '已拒收',
        rejectReason: '产品规格与订单要求不符',
        totalAmount: 12000.00,
        createdAt: '2026-01-13 11:45:00',
        items: [
          {
            key: '4-1',
            productCode: 'PROD014',
            productName: '手术手套',
            specification: '无菌',
            model: 'SURGICAL-100',
            manufacturer: '手套制造厂D',
            registrationNumber: 'REG-2024-014',
            unit: '盒',
            quantity: 500,
            price: 15.00,
            amount: 7500.00,
            status: '已拒收',
            rejectReason: '规格应为中号，实际收到小号'
          },
          {
            key: '4-2',
            productCode: 'PROD015',
            productName: '一次性口罩',
            specification: 'N95',
            model: 'MASK-N95',
            manufacturer: '口罩制造厂D',
            registrationNumber: 'REG-2024-015',
            unit: '个',
            quantity: 1500,
            price: 3.00,
            amount: 4500.00,
            status: '已拒收',
            rejectReason: '过滤效率不达标'
          }
        ]
      },
      {
        id: 5,
        orderNo: 'PO-20260106-005',
        supplierName: '医疗设备供应商E',
        supplierCode: 'SUP-E005',
        department: '采购部',
        buyer: '钱七',
        contactPerson: '孙八',
        contactPhone: '13500135000',
        orderDate: '2026-01-06',
        expectedDeliveryDate: '2026-01-11',
        actualDeliveryDate: null,
        status: '超时未验收',
        timeoutReason: '供应商内部问题，无法确定交货时间',
        totalAmount: 25000.00,
        createdAt: '2026-01-12 16:30:00',
        items: [
          {
            key: '5-1',
            productCode: 'PROD016',
            productName: '心电图机',
            specification: '十二导联',
            model: 'ECG-12',
            manufacturer: '设备制造厂E',
            registrationNumber: 'REG-2024-016',
            unit: '台',
            quantity: 1,
            price: 25000.00,
            amount: 25000.00,
            status: '超时未验收',
            timeoutReason: '供应商生产线故障'
          }
        ]
      }
    ];

    setAbnormalOrders(mockData);
    setFilteredOrders(mockData);
  }, []);

  // 处理搜索
  const handleSearch = (values) => {
    let filtered = [...abnormalOrders];
    
    if (values.orderNo) {
      filtered = filtered.filter(order => 
        order.orderNo.toLowerCase().includes(values.orderNo.toLowerCase())
      );
    }
    
    if (values.supplierName) {
      filtered = filtered.filter(order => 
        order.supplierName.toLowerCase().includes(values.supplierName.toLowerCase())
      );
    }
    
    if (values.status && values.status !== 'all') {
      filtered = filtered.filter(order => order.status === values.status);
    }
    
    if (values.department) {
      filtered = filtered.filter(order => order.department === values.department);
    }
    
    setFilteredOrders(filtered);
    message.success(`找到 ${filtered.length} 条异常订单`);
  };

  // 重置搜索
  const handleReset = () => {
    searchForm.resetFields();
    setFilteredOrders(abnormalOrders);
    message.success('搜索条件已重置');
  };

  // 处理删除异常订单
  const handleDeleteOrder = (orderId) => {
    setAbnormalOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
    setFilteredOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
    message.success('异常订单已删除');
  };

  // 处理编辑异常订单
  const handleEditOrder = (order) => {
    setSelectedOrder(order);
    editForm.setFieldsValue({
      orderNo: order.orderNo,
      supplierName: order.supplierName,
      supplierCode: order.supplierCode,
      department: order.department,
      buyer: order.buyer,
      contactPerson: order.contactPerson,
      contactPhone: order.contactPhone,
      orderDate: moment(order.orderDate),
      expectedDeliveryDate: moment(order.expectedDeliveryDate),
      totalAmount: order.totalAmount,
      status: order.status,
      ...(order.status === '已拒收' && { rejectReason: order.rejectReason }),
      ...(order.status === '超时未验收' && { timeoutReason: order.timeoutReason })
    });
    setIsEditModalVisible(true);
  };

  // 处理查看订单详情
  const handleViewDetail = (order) => {
    setSelectedOrder(order);
    setIsDetailModalVisible(true);
  };

  // 处理保存编辑
  const handleSaveEdit = () => {
    editForm.validateFields().then(values => {
      const updatedOrder = {
        ...selectedOrder,
        ...values,
        orderDate: moment(values.orderDate).format('YYYY-MM-DD'),
        expectedDeliveryDate: moment(values.expectedDeliveryDate).format('YYYY-MM-DD'),
        totalAmount: values.totalAmount || selectedOrder.totalAmount
      };

      setAbnormalOrders(prevOrders => prevOrders.map(order => 
        order.id === updatedOrder.id ? updatedOrder : order
      ));
      
      setFilteredOrders(prevOrders => prevOrders.map(order => 
        order.id === updatedOrder.id ? updatedOrder : order
      ));

      setIsEditModalVisible(false);
      message.success('异常订单已更新');
    }).catch(info => {
      console.log('验证失败:', info);
    });
  };

  // 处理重新提交订单
  const handleResubmitOrder = (order) => {
    Modal.confirm({
      title: '确认重新提交订单',
      content: `确定要重新提交订单 ${order.orderNo} 吗？重新提交后订单将进入待验收状态。`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        // 更新订单状态为待验收
        const updatedOrder = {
          ...order,
          status: '待验收',
          resubmittedAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
        };

        setAbnormalOrders(prevOrders => prevOrders.map(o => 
          o.id === updatedOrder.id ? updatedOrder : o
        ));
        
        setFilteredOrders(prevOrders => prevOrders.map(o => 
          o.id === updatedOrder.id ? updatedOrder : o
        ));

        message.success(`订单 ${order.orderNo} 已重新提交，状态已更新为待验收`);
      }
    });
  };

  // 获取状态对应的图标
  const getStatusIcon = (status) => {
    switch (status) {
      case '已拒收':
        return <CloseCircleOutlined style={{ color: '#f5222d' }} />;
      case '超时未验收':
        return <ClockCircleOutlined style={{ color: '#faad14' }} />;
      default:
        return <WarningOutlined style={{ color: '#faad14' }} />;
    }
  };

  // 获取状态对应的标签颜色
  const getStatusColor = (status) => {
    switch (status) {
      case '已拒收':
        return 'error';
      case '超时未验收':
        return 'warning';
      default:
        return 'default';
    }
  };

  // 表格列配置
  const columns = [
    {
      title: '订单号',
      dataIndex: 'orderNo',
      key: 'orderNo',
      width: 180,
      fixed: 'left'
    },
    {
      title: '供应商',
      dataIndex: 'supplierName',
      key: 'supplierName',
      width: 150,
      render: (text, record) => (
        <div>
          <div>{text}</div>
          <div style={{ fontSize: '12px', color: '#8c8c8c' }}>{record.supplierCode}</div>
        </div>
      )
    },
    {
      title: '采购部门',
      dataIndex: 'department',
      key: 'department',
      width: 120
    },
    {
      title: '采购员',
      dataIndex: 'buyer',
      key: 'buyer',
      width: 100
    },
    {
      title: '订单日期',
      dataIndex: 'orderDate',
      key: 'orderDate',
      width: 120
    },
    {
      title: '预计到货',
      dataIndex: 'expectedDeliveryDate',
      key: 'expectedDeliveryDate',
      width: 120
    },
    {
      title: '总金额',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 120,
      render: (amount) => <span style={{ fontWeight: '500' }}>¥{amount?.toFixed(2)}</span>
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => (
        <Tag color={getStatusColor(status)} icon={getStatusIcon(status)}>
          {status}
        </Tag>
      )
    },
    {
      title: '异常原因',
      dataIndex: 'status',
      key: 'reason',
      width: 200,
      render: (status, record) => {
        switch (status) {
          case '已拒收':
            return <span style={{ color: '#f5222d' }}>{record.rejectReason}</span>;
          case '超时未验收':
            return <span style={{ color: '#faad14' }}>{record.timeoutReason}</span>;
          default:
            return '-';
        }
      }
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="查看详情">
            <Button
              type="link"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleViewDetail(record)}
            />
          </Tooltip>
          <Tooltip title="编辑订单">
            <Button
              type="link"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEditOrder(record)}
            />
          </Tooltip>
          <Tooltip title="重新提交">
            <Button
              type="link"
              size="small"
              icon={<RedoOutlined />}
              onClick={() => handleResubmitOrder(record)}
              style={{ color: '#52c41a' }}
            />
          </Tooltip>
          <Popconfirm
            title="确定要删除此异常订单吗？"
            onConfirm={() => handleDeleteOrder(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Tooltip title="删除订单">
              <Button
                type="link"
                size="small"
                icon={<DeleteOutlined />}
                danger
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      )
    }
  ];

  // 商品明细表格列配置
  const itemColumns = [
    {
      title: '产品编码',
      dataIndex: 'productCode',
      key: 'productCode',
      width: 120
    },
    {
      title: '产品名称',
      dataIndex: 'productName',
      key: 'productName',
      width: 150
    },
    {
      title: '规格',
      dataIndex: 'specification',
      key: 'specification',
      width: 120
    },
    {
      title: '型号',
      dataIndex: 'model',
      key: 'model',
      width: 100
    },
    {
      title: '生产厂家',
      dataIndex: 'manufacturer',
      key: 'manufacturer',
      width: 150
    },
    {
      title: '注册证号',
      dataIndex: 'registrationNumber',
      key: 'registrationNumber',
      width: 150
    },
    {
      title: '单位',
      dataIndex: 'unit',
      key: 'unit',
      width: 80
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 80
    },
    {
      title: '单价',
      dataIndex: 'price',
      key: 'price',
      width: 100,
      render: (price) => `¥${price?.toFixed(2)}`
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 100,
      render: (amount) => <strong>¥{amount?.toFixed(2)}</strong>
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {status}
        </Tag>
      )
    },
    {
      title: '异常原因',
      dataIndex: 'status',
      key: 'itemReason',
      width: 200,
      render: (status, record) => {
        switch (status) {
          case '已拒收':
            return <span style={{ color: '#f5222d' }}>{record.rejectReason}</span>;
          case '超时未验收':
            return <span style={{ color: '#faad14' }}>{record.timeoutReason}</span>;
          default:
            return '-';
        }
      }
    }
  ];

  return (
    <div style={{ padding: '0 16px' }}>
      <h1 style={{ marginBottom: 24 }}>异常订单管理</h1>
      
      {/* 搜索区域 */}
      <Card style={{ marginBottom: 24, padding: '16px' }}>
        <Form
          form={searchForm}
          onFinish={handleSearch}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <label style={{ fontSize: '14px', color: '#333', minWidth: '80px' }}>订单号</label>
              <Form.Item name="orderNo" noStyle>
                <Input placeholder="请输入订单号" style={{ width: 200 }} />
              </Form.Item>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <label style={{ fontSize: '14px', color: '#333', minWidth: '80px' }}>供应商名称</label>
              <Form.Item name="supplierName" noStyle>
                <Input placeholder="请输入供应商名称" style={{ width: 200 }} />
              </Form.Item>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <label style={{ fontSize: '14px', color: '#333', minWidth: '80px' }}>订单状态</label>
              <Form.Item name="status" noStyle initialValue="all">
                <Select style={{ width: 150 }}>
                  <Option value="all">全部状态</Option>
                  <Option value="已拒收">已拒收</Option>
                  <Option value="超时未验收">超时未验收</Option>
                </Select>
              </Form.Item>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <label style={{ fontSize: '14px', color: '#333', minWidth: '80px' }}>采购部门</label>
              <Form.Item name="department" noStyle>
                <Select placeholder="请选择采购部门" style={{ width: 150 }}>
                  <Option value="采购部">采购部</Option>
                  <Option value="检验科">检验科</Option>
                  <Option value="手术室">手术室</Option>
                  <Option value="急诊科">急诊科</Option>
                </Select>
              </Form.Item>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Button type="primary" icon={<SearchOutlined />} htmlType="submit">
                查询
              </Button>
              <Button onClick={handleReset}>
                重置
              </Button>
              <Button icon={<ReloadOutlined />} onClick={() => {
                setFilteredOrders(abnormalOrders);
                searchForm.resetFields();
              }}>
                刷新
              </Button>
            </div>
          </div>
        </Form>
      </Card>
      
      {/* 异常订单列表 */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredOrders}
          rowKey="id"
          scroll={{ x: 1500 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条异常订单`,
            style: {
              display: 'flex',
              justifyContent: 'center',
              marginTop: '16px'
            }
          }}
          loading={loading}
        />
      </Card>
      
      {/* 编辑订单模态框 */}
      <Modal
        title="编辑异常订单"
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        width={800}
        footer={[
          <Button key="cancel" onClick={() => setIsEditModalVisible(false)}>
            取消
          </Button>,
          <Button key="save" type="primary" icon={<SaveOutlined />} onClick={handleSaveEdit}>
            保存修改
          </Button>
        ]}
      >
        <Form
          form={editForm}
          layout="vertical"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="orderNo" label="订单号" rules={[{ required: true, message: '请输入订单号' }]}>
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="status" label="订单状态" rules={[{ required: true, message: '请选择订单状态' }]}>
                <Select disabled>
                  <Option value="已拒收">已拒收</Option>
                  <Option value="超时未验收">超时未验收</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="supplierName" label="供应商名称" rules={[{ required: true, message: '请输入供应商名称' }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="supplierCode" label="供应商编码" rules={[{ required: true, message: '请输入供应商编码' }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="department" label="采购部门" rules={[{ required: true, message: '请选择采购部门' }]}>
                <Select>
                  <Option value="采购部">采购部</Option>
                  <Option value="检验科">检验科</Option>
                  <Option value="手术室">手术室</Option>
                  <Option value="急诊科">急诊科</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="buyer" label="采购员" rules={[{ required: true, message: '请输入采购员' }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="contactPerson" label="联系人" rules={[{ required: true, message: '请输入联系人' }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="contactPhone" label="联系电话" rules={[{ required: true, message: '请输入联系电话' }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="orderDate" label="订单日期" rules={[{ required: true, message: '请选择订单日期' }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="expectedDeliveryDate" label="预计到货日期" rules={[{ required: true, message: '请选择预计到货日期' }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="totalAmount" label="总金额" rules={[{ required: true, message: '请输入总金额' }]}>
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  precision={2}
                  formatter={value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/¥\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name={editForm.getFieldValue('status') === '已拒收' ? 'rejectReason' : 'timeoutReason'}
            label="异常原因"
            rules={[{ required: true, message: '请输入异常原因' }]}
          >
            <TextArea rows={3} placeholder="请输入异常原因" />
          </Form.Item>
        </Form>
      </Modal>
      
      {/* 订单详情模态框 */}
      <Modal
        title={`订单详情 - ${selectedOrder?.orderNo}`}
        open={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        width={1200}
        footer={[
          <Button key="close" onClick={() => setIsDetailModalVisible(false)}>
            关闭
          </Button>,
          <Button 
            key="edit" 
            type="primary" 
            icon={<EditOutlined />}
            onClick={() => {
              setIsDetailModalVisible(false);
              handleEditOrder(selectedOrder);
            }}
          >
            编辑订单
          </Button>,
          <Button 
            key="resubmit" 
            type="primary" 
            icon={<RedoOutlined />}
            onClick={() => {
              setIsDetailModalVisible(false);
              handleResubmitOrder(selectedOrder);
            }}
            style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
          >
            重新提交
          </Button>
        ]}
      >
        {selectedOrder && (
          <>
            {/* 订单基本信息 */}
            <Card title="订单基本信息" style={{ marginBottom: 16 }}>
              <Row gutter={16}>
                <Col span={8}>
                  <div><strong>订单号：</strong>{selectedOrder.orderNo}</div>
                </Col>
                <Col span={8}>
                  <div><strong>供应商：</strong>{selectedOrder.supplierName} ({selectedOrder.supplierCode})</div>
                </Col>
                <Col span={8}>
                  <div>
                    <strong>状态：</strong>
                    <Tag color={getStatusColor(selectedOrder.status)} icon={getStatusIcon(selectedOrder.status)}>
                      {selectedOrder.status}
                    </Tag>
                  </div>
                </Col>
              </Row>
              
              <Row gutter={16} style={{ marginTop: 12 }}>
                <Col span={8}>
                  <div><strong>采购部门：</strong>{selectedOrder.department}</div>
                </Col>
                <Col span={8}>
                  <div><strong>采购员：</strong>{selectedOrder.buyer}</div>
                </Col>
                <Col span={8}>
                  <div><strong>联系人：</strong>{selectedOrder.contactPerson} ({selectedOrder.contactPhone})</div>
                </Col>
              </Row>
              
              <Row gutter={16} style={{ marginTop: 12 }}>
                <Col span={8}>
                  <div><strong>订单日期：</strong>{selectedOrder.orderDate}</div>
                </Col>
                <Col span={8}>
                  <div><strong>预计到货：</strong>{selectedOrder.expectedDeliveryDate}</div>
                </Col>
                <Col span={8}>
                  <div><strong>实际到货：</strong>{selectedOrder.actualDeliveryDate || '未到货'}</div>
                </Col>
              </Row>
              
              <Row gutter={16} style={{ marginTop: 12 }}>
                <Col span={8}>
                  <div><strong>总金额：</strong>¥{selectedOrder.totalAmount?.toFixed(2)}</div>
                </Col>
                <Col span={16}>
                  <div>
                    <strong>异常原因：</strong>
                    <span style={{ 
                      color: selectedOrder.status === '已拒收' ? '#f5222d' : '#faad14'
                    }}>
                      {selectedOrder.status === '已拒收' ? selectedOrder.rejectReason :
                       selectedOrder.timeoutReason}
                    </span>
                  </div>
                </Col>
              </Row>
            </Card>
            
            {/* 商品明细 */}
            <Card title="商品明细">
              <Table
                columns={itemColumns}
                dataSource={selectedOrder.items}
                rowKey="key"
                pagination={false}
                scroll={{ x: 1200 }}
              />
            </Card>
          </>
        )}
      </Modal>
    </div>
  );
};

export default AbnormalOrderManagement;