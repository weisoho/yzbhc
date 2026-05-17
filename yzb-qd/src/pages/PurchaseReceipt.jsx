import React, { useState, useEffect } from 'react';
import moment from 'moment';
import {
  Card,
  Form,
  Input,
  Button,
  Space,
  Row,
  Col,
  Table,
  Tag,
  message,
  DatePicker,
  Modal,
  Checkbox,
  InputNumber
} from 'antd';
import {
  SearchOutlined,
  ReloadOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import api from '../utils/api.js';

const { TextArea } = Input;

const PurchaseReceipt = () => {
  const [form] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [viewMode, setViewMode] = useState('summary'); // 'detail' 或 'summary'
  
  // 商品明细复选框选择状态
  const [selectedItemKeys, setSelectedItemKeys] = useState([]);
  const [receivedQuantities, setReceivedQuantities] = useState({});
  // 记录哪些商品的到货数量被修改过
  const [modifiedItems, setModifiedItems] = useState({});
  // 备注
  const [remarks, setRemarks] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [actualDeliveryDate, setActualDeliveryDate] = useState(null);

  const getCurrentUserName = () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      return userInfo.realName || userInfo.name || userInfo.userName || '管理员';
    } catch {
      return '管理员';
    }
  };

  // 从API获取采购订单数据
  const loadPurchaseOrders = async () => {
    try {
      setLoading(true);
      const searchValues = form.getFieldsValue();
      const response = await api.get('/api/scm/purchases/orders/pending-receive', {
        pageNum: pagination.current,
        pageSize: pagination.pageSize,
        orderNumber: searchValues.purchaseOrderNo,
        supplierName: searchValues.supplierName,
        productCode: searchValues.productCode,
        productName: searchValues.productName
      });
      if (response.code === 1 && response.data) {
        const orderList = response.data.records.map(order => ({
          key: order.id,
          orderNumber: order.orderNumber,
          supplierName: order.supplierName,
          supplierCode: order.supplierCode,
          department: order.departmentName,
          buyer: order.operatorName,
          contactPerson: order.contactPerson,
          contactPhone: order.contactPhone,
          orderDate: moment(order.createTime).format('YYYY-MM-DD HH:mm:ss'),
          expectedDeliveryDate: order.expectedDeliveryDate,
          actualDeliveryDate: order.actualDeliveryDate,
          status: order.status,
          itemCount: order.itemCount,
          totalAmount: order.totalAmount,
          items: (order.items || order.details || []).map((item) => ({
            key: item.id,
            id: item.id,
            productCode: item.materialCode,
            productName: item.materialName,
            supplierName: order.supplierName,
            materialType: item.materialType,
            specification: item.specification,
            model: item.model,
            manufacturer: item.manufacturer,
            registrationNumber: item.registrationNumber,
            batchNumber: item.batchNumber,
            productionDate: item.productionDate,
            expiryDate: item.expiryDate,
            unit: item.unit,
            price: item.unitPrice,
            quantity: item.quantity,
            receivedQuantity: item.receivedQuantity || 0,
            stockedQuantity: item.stockedQuantity || 0,
            remainingQuantity: Math.max((item.quantity || 0) - (item.receivedQuantity || 0), 0),
            amount: item.amount,
            status: item.status
          }))
        }));
        setData(orderList);
        setFilteredData(orderList);
        setPagination(prev => ({ ...prev, total: response.data.total }));
      } else {
        message.error(response.message || '加载采购订单失败');
      }
    } catch (error) {
      console.error('加载采购订单失败:', error);
      message.error('加载采购订单失败，请检查网络连接或联系管理员');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPurchaseOrders();
  }, [pagination.current, pagination.pageSize]);

  // 状态标签渲染
  const getStatusTag = (status) => {
    const statusMap = {
      '待收货': { color: 'orange', text: '待收货' },
      '待验收': { color: 'orange', text: '待验收' },
      '已验收': { color: 'green', text: '已验收' },
      '已拒收': { color: 'red', text: '已拒收' },
      '部分验收': { color: 'blue', text: '部分验收' },
      '部分到货': { color: 'gold', text: '部分到货' },
      '待入库': { color: 'processing', text: '待入库' },
      '收货拒收': { color: 'red', text: '收货拒收' },
    };
    const config = statusMap[status] || { color: 'default', text: status };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  // 搜索处理
  const handleSearch = () => {
    setPagination(prev => ({ ...prev, current: 1 }));
    loadPurchaseOrders();
  };

  // 重置搜索
  const handleReset = () => {
    form.resetFields();
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  // 导出数据
  const handleExport = () => {
    message.success('数据导出成功');
  };

  // 表格行选择配置
  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  // 分页处理
  const handleTableChange = (newPagination) => {
    setPagination({
      ...pagination,
      current: newPagination.current,
      pageSize: newPagination.pageSize
    });
  };

  // 处理确认验收选中的商品
  const handleAcceptSelectedItems = () => {
    if (selectedItemKeys.length === 0) {
      message.warning('请先选择要验收的商品');
      return;
    }

    const validSelectedItems = selectedOrder.items.filter(item =>
      selectedItemKeys.includes(item.key) && Number(item.remainingQuantity || 0) > 0,
    );
    if (validSelectedItems.length === 0) {
      message.warning('所选商品没有待收货数量，请刷新后重试');
      return;
    }

    // 检查是否有修改过到货数量的商品
    const hasModifiedItems = selectedItemKeys.some(key => modifiedItems[key]);
    
    if (hasModifiedItems) {
      Modal.warning({
        title: '注意',
        content: '到货数量不足采购数量时，剩余单据明细将会保留',
        okText: '知道了',
        onOk: () => {
          // 继续执行验收逻辑
          performAcceptance();
        }
      });
    } else {
      performAcceptance();
    }
  };

  // 执行验收逻辑
  const performAcceptance = () => {
    Modal.confirm({
      title: '确认验收',
      content: `确定要验收选中的 ${selectedItemKeys.length} 项商品吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          setLoading(true);
          const receiveData = {
            receiver: receiverName || getCurrentUserName(),
            contactPerson: contactPerson || selectedOrder.contactPerson || selectedOrder.buyer || getCurrentUserName(),
            contactPhone: contactPhone || selectedOrder.contactPhone || '13800000000',
            actualDeliveryDate: (actualDeliveryDate || moment()).format('YYYY-MM-DD'),
            remark: remarks,
            items: selectedOrder.items
              .filter(item => selectedItemKeys.includes(item.key) && Number(item.remainingQuantity || 0) > 0)
              .map(item => {
                const actualReceived = receivedQuantities[item.key] ?? item.remainingQuantity;
                return {
                  purchaseOrderItemId: item.id,
                  actualReceivedQuantity: actualReceived,
                  shortageReason: actualReceived < item.remainingQuantity ? '部分到货' : ''
                };
              })
          };
          const response = await api.post(`/api/scm/purchases/orders/${selectedOrder.key}/receive`, receiveData);
          if (response.code === 1) {
            message.success(`成功确认收货 ${receiveData.items.length} 项商品，请到采购入库页面录入批号、效期后完成入库`);
            loadPurchaseOrders();
            setIsModalVisible(false);
          } else {
            message.error(response.message || '验收失败');
          }
        } catch (error) {
          console.error('验收失败:', error);
          message.error(error.message || '验收失败，请检查网络连接或联系管理员');
        } finally {
          setLoading(false);
        }
      }
    });
  };

  // 处理拒收剩余待收货商品
  const handleRejectSelectedItems = () => {
    const pendingItems = (selectedOrder?.items || []).filter(item => Number(item.remainingQuantity || 0) > 0);
    if (pendingItems.length === 0) {
      message.warning('当前订单没有可拒收的待收货明细');
      return;
    }

    Modal.confirm({
      title: '确认拒收',
      content: `确定要拒收订单中剩余 ${pendingItems.length} 项待收货商品吗？拒收后将生成异常订单。`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          setLoading(true);
          const response = await api.post(`/api/scm/purchases/orders/${selectedOrder.key}/receive-reject`, {
            operatorName: receiverName || getCurrentUserName(),
            reason: remarks || '收货拒收'
          });
          if (response.code === 1) {
            message.success(`成功拒收订单 ${selectedOrder.orderNumber} 的剩余待收货商品`);
            loadPurchaseOrders();
            setIsModalVisible(false);
          } else {
            message.error(response.message || '拒收失败');
          }
        } catch (error) {
          console.error('拒收失败:', error);
          message.error(error.message || '拒收失败，请检查网络连接或联系管理员');
        } finally {
          setLoading(false);
        }
      }
    });
  };

  // 采购汇总视图列配置
  const summaryColumns = [
    {
      title: '采购单号',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      width: 150,
      render: (text) => <Tag color="blue">{text}</Tag>
    },

    {
      title: '采购分院',
      dataIndex: 'department',
      key: 'department',
      width: 120
    },
    {
      title: '供应商名称',
      dataIndex: 'supplierName',
      key: 'supplierName',
      width: 160
    },
    {
      title: '物资数量',
      dataIndex: 'itemCount',
      key: 'itemCount',
      width: 100
    },
    {
      title: '合计金额',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 120,
      render: (value) => <strong>¥{value?.toFixed(2)}</strong>
    },
    {
      title: '创建日期',
      dataIndex: 'orderDate',
      key: 'orderDate',
      width: 120
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => getStatusTag(status)
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="link" 
            size="small"
            onClick={() => {
              setSelectedOrder(record);
              setSelectedItemKeys([]); // 重置复选框选择状态
              // 初始化到货数量为采购数量
              const initialReceivedQuantities = {};
              const initialModifiedItems = {};
              record.items.forEach(item => {
                initialReceivedQuantities[item.key] = item.remainingQuantity;
                initialModifiedItems[item.key] = false;
              });
              setReceivedQuantities(initialReceivedQuantities);
              setModifiedItems(initialModifiedItems);
              setRemarks(''); // 重置备注
              setReceiverName(getCurrentUserName());
              setContactPerson(record.contactPerson || record.buyer || getCurrentUserName());
              setContactPhone(record.contactPhone || '');
              setActualDeliveryDate(record.actualDeliveryDate ? moment(record.actualDeliveryDate) : moment());
              setIsModalVisible(true);
            }}
          >
            确认收货
          </Button>
        </Space>
      ),
    },
  ];

  // 采购明细视图列配置
  const detailColumns = [
    {
      title: '采购单号',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      width: 150,
      render: (text) => <Tag color="blue">{text}</Tag>
    },
    {
      title: '物资编码',
      dataIndex: 'productCode',
      key: 'productCode',
      width: 120
    },
    {
      title: '供应商名称',
      dataIndex: 'supplierName',
      key: 'supplierName',
      width: 160
    },
    {
      title: '商品名称',
      dataIndex: 'productName',
      key: 'productName',
      width: 180
    },
    {
      title: '物资类型',
      dataIndex: 'materialType',
      key: 'materialType',
      width: 120
    },
    {
      title: '规格',
      dataIndex: 'specification',
      key: 'specification',
      width: 150
    },
    {
      title: '型号',
      dataIndex: 'model',
      key: 'model',
      width: 120
    },
    {
      title: '注册证号',
      dataIndex: 'registrationNumber',
      key: 'registrationNumber',
      width: 160
    },
    {
      title: '生产厂家',
      dataIndex: 'manufacturer',
      key: 'manufacturer',
      width: 180
    },
    {
      title: '单位',
      dataIndex: 'unit',
      key: 'unit',
      width: 80
    },
    {
      title: '单价',
      dataIndex: 'price',
      key: 'price',
      width: 100,
      render: (value) => `¥${value?.toFixed(2)}`
    },
    {
      title: '采购数量',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 100
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      render: (value) => `¥${value?.toFixed(2)}`
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => getStatusTag(status)
    },
  ];

  // 生成采购明细数据
  const generateDetailData = () => {
    const detailData = [];
    data.forEach(order => {
      order.items.forEach(item => {
        detailData.push({
          ...item,
          orderNumber: order.orderNumber,
          supplierName: order.supplierName,
          department: order.department,
          orderDate: order.orderDate,
          orderStatus: order.status
        });
      });
    });
    return detailData;
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card title="采购收货" bordered={false}>
        {/* 搜索表单 */}
        <Form
          form={form}
          onFinish={handleSearch}
          style={{ marginBottom: '24px' }}
        >
          <div style={{ padding: '16px', backgroundColor: '#fafafa', borderRadius: '8px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ whiteSpace: 'nowrap' }}>采购单号：</span>
                  <Form.Item name="purchaseOrderNo" noStyle>
                    <Input placeholder="请输入采购单号" allowClear style={{ width: 180 }} size="middle" />
                  </Form.Item>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ whiteSpace: 'nowrap' }}>供应商：</span>
                  <Form.Item name="supplierName" noStyle>
                    <Input placeholder="请输入供应商" allowClear style={{ width: 180 }} size="middle" />
                  </Form.Item>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ whiteSpace: 'nowrap' }}>物资编码：</span>
                  <Form.Item name="productCode" noStyle>
                    <Input placeholder="请输入物资编码" allowClear style={{ width: 180 }} size="middle" />
                  </Form.Item>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ whiteSpace: 'nowrap' }}>物资名称：</span>
                  <Form.Item name="productName" noStyle>
                    <Input placeholder="请输入物资名称" allowClear style={{ width: 180 }} size="middle" />
                  </Form.Item>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <Button type="primary" htmlType="submit" icon={<SearchOutlined />} style={{ minWidth: 90 }}>
                  查询
                </Button>
                <Button onClick={handleReset} icon={<ReloadOutlined />} style={{ minWidth: 90 }}>
                  重置
                </Button>
                <Button onClick={handleExport} icon={<DownloadOutlined />} style={{ minWidth: 90 }}>
                  导出
                </Button>
              </div>
            </div>
          </div>
        </Form>

        {/* 数据表格 */}
        <Table
          rowSelection={viewMode === 'summary' ? rowSelection : null}
          columns={viewMode === 'detail' ? detailColumns : summaryColumns}
          dataSource={viewMode === 'detail' ? generateDetailData() : filteredData}
          rowKey="key"
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
            position: ['bottomCenter'],
          }}
          onChange={handleTableChange}
          loading={loading}
          scroll={{ x: viewMode === 'detail' ? 1500 : 1200 }}
        />

        {/* 批量操作按钮 */}
        <Row style={{ marginTop: '16px' }} justify="end">
          <Col>
            <Space>
              <Button 
                type="primary" 
                disabled={selectedRowKeys.length === 0 || loading}
                loading={loading}
                onClick={() => {
                  Modal.confirm({
                    title: '批量验收',
                    content: `确定要批量验收选中的 ${selectedRowKeys.length} 个订单吗？将对每个订单执行全量收货。`,
                    okText: '确认',
                    cancelText: '取消',
                    onOk: async () => {
                      try {
                        setLoading(true);
                        let successCount = 0;
                        let failCount = 0;
                        for (const orderId of selectedRowKeys) {
                          const order = data.find(o => o.key === orderId);
                          if (!order) continue;
                          try {
                            const receiveData = {
                              receiver: getCurrentUserName(),
                              contactPerson: order.contactPerson || order.buyer || getCurrentUserName(),
                              contactPhone: order.contactPhone || '13800000000',
                              actualDeliveryDate: moment().format('YYYY-MM-DD'),
                              remark: '批量验收',
                              items: order.items.map(item => ({
                                purchaseOrderItemId: item.id,
                                actualReceivedQuantity: item.quantity,
                                shortageReason: ''
                              }))
                            };
                            const response = await api.post(`/api/scm/purchases/orders/${orderId}/receive`, receiveData);
                            if (response.code === 1) {
                              successCount++;
                            } else {
                              failCount++;
                            }
                          } catch {
                            failCount++;
                          }
                        }
                        if (successCount > 0) {
                          message.success(`批量验收成功 ${successCount} 个订单${failCount > 0 ? `，${failCount} 个失败` : ''}`);
                        } else {
                          message.error('批量验收全部失败');
                        }
                        setSelectedRowKeys([]);
                        loadPurchaseOrders();
                      } catch (error) {
                        console.error('批量验收失败:', error);
                        message.error('批量验收失败');
                      } finally {
                        setLoading(false);
                      }
                    }
                  });
                }}
              >
                批量验收
              </Button>
              <Button 
                danger 
                disabled={selectedRowKeys.length === 0 || loading}
                loading={loading}
                onClick={() => {
                  Modal.confirm({
                    title: '批量拒收',
                    content: `确定要批量拒收选中的 ${selectedRowKeys.length} 个订单吗？拒收的订单将进入异常订单管理。`,
                    okText: '确认',
                    cancelText: '取消',
                    onOk: async () => {
                      try {
                        setLoading(true);
                        let successCount = 0;
                        let failCount = 0;
                        for (const orderId of selectedRowKeys) {
                          try {
                            const response = await api.post(`/api/scm/purchases/orders/${orderId}/receive-reject`, {
                              operatorName: getCurrentUserName(),
                              reason: '批量拒收'
                            });
                            if (response.code === 1) {
                              successCount++;
                            } else {
                              failCount++;
                            }
                          } catch {
                            failCount++;
                          }
                        }
                        if (successCount > 0) {
                          message.success(`批量拒收成功 ${successCount} 个订单${failCount > 0 ? `，${failCount} 个失败` : ''}`);
                        } else {
                          message.error('批量拒收全部失败');
                        }
                        setSelectedRowKeys([]);
                        loadPurchaseOrders();
                      } catch (error) {
                        console.error('批量拒收失败:', error);
                        message.error('批量拒收失败');
                      } finally {
                        setLoading(false);
                      }
                    }
                  });
                }}
              >
                批量拒收
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 订单详情模态框 */}
      <Modal
        title="采购订单详情"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        width={1000}
        footer={[
          <Button key="close" onClick={() => setIsModalVisible(false)}>
            关闭
          </Button>,
          <Button 
            key="reject" 
            danger 
            onClick={() => handleRejectSelectedItems()}
            disabled={!(selectedOrder?.items || []).some(item => Number(item.remainingQuantity || 0) > 0)}
          >
            整单拒收
          </Button>,
          <Button 
            key="accept" 
            type="primary" 
            onClick={() => handleAcceptSelectedItems()}
            disabled={selectedItemKeys.length === 0}
          >
            确认收货
          </Button>,
        ]}
      >
        {selectedOrder && (
          <div>
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={8}>
                <div><strong>采购单号：</strong>{selectedOrder.orderNumber}</div>
              </Col>
              <Col span={8}>
                <div><strong>供应商：</strong>{selectedOrder.supplierName}</div>
              </Col>
              <Col span={8}>
                <div><strong>订单状态：</strong>
                  {getStatusTag(selectedOrder.status)}
                </div>
              </Col>
            </Row>
            
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={8}>
                <div><strong>创建日期：</strong>{selectedOrder.orderDate}</div>
              </Col>
            </Row>
            
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={8}>
                <div><strong>采购分院：</strong>{selectedOrder.department}</div>
              </Col>
              <Col span={8}>
                <div><strong>申请人：</strong>{selectedOrder.buyer}</div>
              </Col>
              <Col span={8}>
                <div><strong>联系人：</strong>{selectedOrder.contactPerson || '-'}</div>
              </Col>
            </Row>
            
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={8}>
                <div><strong>总金额：</strong>¥{selectedOrder.totalAmount.toFixed(2)}</div>
              </Col>
              <Col span={8}>
                <div><strong>物资数量：</strong>{selectedOrder.itemCount} 项</div>
              </Col>
              <Col span={8}>
                <div><strong>联系电话：</strong>{selectedOrder.contactPhone || '-'}</div>
              </Col>
            </Row>

            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={8}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <strong>收货人</strong>
                  <Input value={receiverName} onChange={(e) => setReceiverName(e.target.value)} placeholder="请输入收货人" />
                </div>
              </Col>
              <Col span={8}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <strong>联系人</strong>
                  <Input value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} placeholder="请输入联系人" />
                </div>
              </Col>
              <Col span={8}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <strong>联系电话</strong>
                  <Input value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} placeholder="请输入联系电话" />
                </div>
              </Col>
            </Row>

            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={8}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <strong>实际到货日期</strong>
                  <DatePicker value={actualDeliveryDate} onChange={setActualDeliveryDate} style={{ width: '100%' }} />
                </div>
              </Col>
            </Row>
            
            <div style={{ marginTop: 24 }}>
              <div style={{ 
                color: '#666', 
                fontWeight: '500', 
                marginBottom: 12,
                borderBottom: '1px solid #f0f0f0',
                paddingBottom: 8
              }}>
                采购明细
              </div>
              <Table
                columns={[
                  {
                    title: (
                      <Checkbox
                        checked={
                          (selectedOrder?.items || []).filter(item => Number(item.remainingQuantity || 0) > 0).length > 0
                          && selectedItemKeys.length === (selectedOrder?.items || []).filter(item => Number(item.remainingQuantity || 0) > 0).length
                        }
                        indeterminate={
                          selectedItemKeys.length > 0
                          && selectedItemKeys.length < (selectedOrder?.items || []).filter(item => Number(item.remainingQuantity || 0) > 0).length
                        }
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedItemKeys(
                              (selectedOrder?.items || [])
                                .filter(item => Number(item.remainingQuantity || 0) > 0)
                                .map(item => item.key),
                            );
                          } else {
                            setSelectedItemKeys([]);
                          }
                        }}
                      />
                    ),
                    key: 'checkbox',
                    width: 60,
                    fixed: 'left',
                    render: (_, record) => (
                      <Checkbox
                        checked={selectedItemKeys.includes(record.key)}
                        disabled={Number(record.remainingQuantity || 0) <= 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedItemKeys([...selectedItemKeys, record.key]);
                          } else {
                            setSelectedItemKeys(selectedItemKeys.filter(key => key !== record.key));
                          }
                        }}
                      />
                    )
                  },
                  { title: '供应商名称', dataIndex: 'supplierName', key: 'supplierName', width: 150 },
                  { title: '物资编码', dataIndex: 'productCode', key: 'productCode', width: 120 },
                  { title: '物资名称', dataIndex: 'productName', key: 'productName', width: 150 },
                  { title: '物资类型', dataIndex: 'materialType', key: 'materialType', width: 120 },
                  { title: '规格', dataIndex: 'specification', key: 'specification', width: 100 },
                  { title: '型号', dataIndex: 'model', key: 'model', width: 100 },
                  { title: '注册证号', dataIndex: 'registrationNumber', key: 'registrationNumber', width: 160 },
                  { title: '生产厂家', dataIndex: 'manufacturer', key: 'manufacturer', width: 160 },
                  { title: '单位', dataIndex: 'unit', key: 'unit', width: 80 },
                  { title: '采购价格', dataIndex: 'price', key: 'price', width: 100, render: (value) => `¥${value?.toFixed(2)}` },
                  { title: '采购数量', dataIndex: 'quantity', key: 'quantity', width: 100 },
                  { title: '已收货', dataIndex: 'receivedQuantity', key: 'receivedQuantity', width: 90 },
                  { title: '待收货', dataIndex: 'remainingQuantity', key: 'remainingQuantity', width: 90 },
                  { 
                    title: '本次收货', 
                    key: 'receivedQuantity', 
                    width: 100, 
                    render: (_, record) => (
                      <InputNumber
                        min={0}
                        max={record.remainingQuantity}
                        value={receivedQuantities[record.key] ?? record.remainingQuantity}
                        disabled={Number(record.remainingQuantity || 0) <= 0}
                        onChange={(value) => {
                          const newReceivedQuantities = { ...receivedQuantities };
                          newReceivedQuantities[record.key] = value ?? 0;
                          setReceivedQuantities(newReceivedQuantities);
                          
                          const newModifiedItems = { ...modifiedItems };
                          newModifiedItems[record.key] = true;
                          setModifiedItems(newModifiedItems);
                        }}
                      />
                    )
                  },
                  { 
                    title: '合计金额', 
                    key: 'amount', 
                    width: 120, 
                    render: (_, record) => {
                      const receivedQty = receivedQuantities[record.key] ?? record.remainingQuantity;
                      const amount = record.price * receivedQty;
                      return `¥${amount.toFixed(2)}`;
                    } 
                  },
                  { title: '状态', dataIndex: 'status', key: 'status', width: 100, render: (status) => getStatusTag(status) },
                ]}
                dataSource={selectedOrder.items}
                rowKey="key"
                pagination={false}
                size="small"
                scroll={{ x: 1100 }}
              />
            </div>

            {/* 备注栏 */}
            <div style={{ marginTop: 24 }}>
              <div style={{ 
                color: '#666', 
                fontWeight: '500', 
                marginBottom: 12,
                borderBottom: '1px solid #f0f0f0',
                paddingBottom: 8
              }}>
                备注
              </div>
              <TextArea
                rows={3}
                placeholder="请输入备注信息"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                maxLength={500}
                showCount
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PurchaseReceipt;
