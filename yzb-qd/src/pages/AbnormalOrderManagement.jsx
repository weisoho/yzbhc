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
import api from '../utils/api.js';

const { Option } = Select;
const { TextArea } = Input;

const AbnormalOrderManagement = () => {
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [abnormalOrders, setAbnormalOrders] = useState([]);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchForm] = Form.useForm();
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

  // 从API获取异常订单数据
  const loadAbnormalOrders = async (page = pagination.current, pageSize = pagination.pageSize) => {
    try {
      setLoading(true);
      const values = searchForm.getFieldsValue();
      const response = await api.get('/api/scm/purchases/exceptions', {
        pageNum: page,
        pageSize: pageSize,
        orderNumber: values.orderNo,
        supplierName: values.supplierName,
        status: values.status && values.status !== 'all' ? values.status : undefined,
        department: values.department
      });
      if (response.code === 1 && response.data) {
        setAbnormalOrders((response.data.records || []).map(item => ({ ...item })));
        setPagination({
          current: response.data.pageNum || page,
          pageSize: response.data.pageSize || pageSize,
          total: response.data.total || 0
        });
      } else {
        message.error(response.message || '加载异常订单失败');
      }
    } catch (error) {
      console.error('加载异常订单失败:', error);
      message.error('加载异常订单失败，请检查网络连接或联系管理员');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAbnormalOrders();
  }, []);

  // 处理搜索
  const handleSearch = async () => {
    await loadAbnormalOrders(1, pagination.pageSize);
  };

  // 重置搜索
  const handleReset = () => {
    searchForm.resetFields();
    loadAbnormalOrders(1, pagination.pageSize);
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
      orderDate: order.orderDate ? moment(order.orderDate) : null,
      expectedDeliveryDate: order.expectedDeliveryDate ? moment(order.expectedDeliveryDate) : null,
      totalAmount: order.totalAmount,
      status: order.status,
      ...(order.status === '已拒收' && { rejectReason: order.rejectReason }),
      ...(order.status === '超时未验收' && { timeoutReason: order.timeoutReason })
    });
    setIsEditModalVisible(true);
  };

  // 处理查看订单详情
  const handleViewDetail = async (order) => {
    try {
      setLoading(true);
      setIsDetailModalVisible(true);
      const response = await api.get(`/api/scm/purchases/exceptions/${order.id}`);
      if (response.code === 1 && response.data) {
        setSelectedOrder({
          ...response.data,
          items: (response.data.items || []).map(item => ({ ...item, key: item.id }))
        });
      } else {
        message.error(response.message || '加载异常订单详情失败');
        setSelectedOrder(order);
      }
    } catch (error) {
      console.error('加载异常订单详情失败:', error);
      message.error('加载异常订单详情失败，请检查网络连接或联系管理员');
      setSelectedOrder(order);
    } finally {
      setLoading(false);
    }
  };

  // 处理保存编辑
  const handleSaveEdit = () => {
    editForm.validateFields().then(async values => {
      try {
        setLoading(true);
        const payload = {
          supplierName: values.supplierName,
          supplierCode: values.supplierCode,
          department: values.department,
          buyer: values.buyer,
          contactPerson: values.contactPerson,
          contactPhone: values.contactPhone,
          orderDate: values.orderDate ? moment(values.orderDate).format('YYYY-MM-DD') : undefined,
          expectedDeliveryDate: values.expectedDeliveryDate ? moment(values.expectedDeliveryDate).format('YYYY-MM-DD') : undefined,
          totalAmount: values.totalAmount,
          rejectReason: values.rejectReason,
          timeoutReason: values.timeoutReason
        };
        const response = await api.put(`/api/scm/purchases/exceptions/${selectedOrder.id}`, payload);
        if (response.code === 1) {
          message.success('异常订单已更新');
          setIsEditModalVisible(false);
          await loadAbnormalOrders(pagination.current, pagination.pageSize);
        } else {
          message.error(response.message || '保存失败');
        }
      } catch (error) {
        console.error('保存异常订单失败:', error);
        message.error('保存失败，请检查网络连接或联系管理员');
      } finally {
        setLoading(false);
      }
    }).catch(info => {
      console.log('验证失败:', info);
    });
  };

  // 处理重新提交订单
  const handleResubmitOrder = (order) => {
    Modal.confirm({
      title: '确认重新提交订单',
      content: `确定要重新提交订单 ${order.orderNo} 吗？重新提交后订单将进入待收货状态。`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          setLoading(true);
          const response = await api.post(`/api/scm/purchases/exceptions/${order.id}/resubmit`, null, {
            params: { operatorName: '当前用户' }
          });
          if (response.code === 1) {
            message.success(`订单 ${order.orderNo} 已重新提交，状态已更新为待收货`);
            loadAbnormalOrders();
          } else {
            message.error(response.message || '重新提交订单失败');
          }
        } catch (error) {
          console.error('重新提交订单失败:', error);
          message.error('重新提交订单失败，请检查网络连接或联系管理员');
        } finally {
          setLoading(false);
        }
      }
    });
  };

  // 获取状态对应的图标
  const getStatusIcon = (status) => {
    switch (status) {
      case '已拒收':
        return <CloseCircleOutlined style={{ color: '#f5222d' }} />;
      case '部分到货':
        return <WarningOutlined style={{ color: '#faad14' }} />;
      case '待收货':
        return <ClockCircleOutlined style={{ color: '#1677ff' }} />;
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
      case '部分到货':
        return 'warning';
      case '待收货':
        return 'processing';
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
      render: (amount) => (
        <span style={{ fontWeight: '500' }}>
          ¥{amount === undefined || amount === null ? '-' : Number(amount).toFixed(2)}
        </span>
      )
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
          case '部分到货':
            return <span style={{ color: '#faad14' }}>{record.rejectReason || '部分到货，待补发'}</span>;
          case '待收货':
            return <span style={{ color: '#1677ff' }}>{record.rejectReason || '已重新提交，等待再次收货'}</span>;
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
            onConfirm={async () => {
              try {
                setLoading(true);
                const resp = await api.delete(`/api/scm/purchases/exceptions/${record.id}`, { operatorName: '当前用户' });
                if (resp.code === 1) {
                  message.success('异常订单已删除');
                  await loadAbnormalOrders(1, pagination.pageSize);
                } else {
                  message.error(resp.message || '删除失败');
                }
              } catch (error) {
                console.error('删除异常订单失败:', error);
                message.error('删除失败，请检查网络连接或联系管理员');
              } finally {
                setLoading(false);
              }
            }}
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
      title: '物资编码',
      dataIndex: 'materialCode',
      key: 'materialCode',
      width: 120
    },
    {
      title: '物资名称',
      dataIndex: 'materialName',
      key: 'materialName',
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
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      width: 100,
      render: (price) => `¥${price === undefined || price === null ? '-' : Number(price).toFixed(2)}`
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 100,
      render: (amount) => <strong>¥{amount === undefined || amount === null ? '-' : Number(amount).toFixed(2)}</strong>
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 120
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
                  <Option value="部分到货">部分到货</Option>
                  <Option value="待收货">待收货</Option>
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
                searchForm.resetFields();
                loadAbnormalOrders(1, pagination.pageSize);
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
          dataSource={abnormalOrders}
          rowKey="id"
          scroll={{ x: 1500 }}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条异常订单`,
            onChange: (page, pageSize) => {
              loadAbnormalOrders(page, pageSize);
            },
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
                  <div><strong>总金额：</strong>¥{selectedOrder.totalAmount === undefined || selectedOrder.totalAmount === null ? '-' : Number(selectedOrder.totalAmount).toFixed(2)}</div>
                </Col>
                <Col span={16}>
                  <div>
                    <strong>异常原因：</strong>
                    <span style={{ 
                      color: selectedOrder.status === '已拒收'
                        ? '#f5222d'
                        : selectedOrder.status === '待收货'
                          ? '#1677ff'
                          : '#faad14'
                    }}>
                      {selectedOrder.status === '超时未验收'
                        ? selectedOrder.timeoutReason
                        : selectedOrder.rejectReason}
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
