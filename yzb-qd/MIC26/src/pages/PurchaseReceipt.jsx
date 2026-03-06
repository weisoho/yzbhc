import React, { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Input,
  Select,
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
  EyeOutlined
} from '@ant-design/icons';
import zhCN from 'antd/es/locale/zh_CN';

const { Option } = Select;
const { RangePicker } = DatePicker;
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
  const [hasSelectedView, setHasSelectedView] = useState(false); // 是否已选择视图
  
  // 商品明细复选框选择状态
  const [selectedItemKeys, setSelectedItemKeys] = useState([]);
  const [receivedQuantities, setReceivedQuantities] = useState({});
  // 记录哪些商品的到货数量被修改过
  const [modifiedItems, setModifiedItems] = useState({});
  // 备注
  const [remarks, setRemarks] = useState('');

  // 模拟数据
  useEffect(() => {
    const mockData = [
      {
        key: '1',
        orderNumber: 'PO-20260110-001',
        supplierName: '医疗用品供应商A',
        supplierCode: 'SUP001',
        department: '采购部',
        buyer: '张三',
        contactPerson: '李经理',
        contactPhone: '13800138001',
        orderDate: '2026-01-10',
        expectedDeliveryDate: '2026-01-15',
        actualDeliveryDate: '2026-01-14',
        status: '待验收',
        itemCount: 3,
        totalAmount: 15000,
        items: [
          { key: '1-1', productCode: 'P001', productName: '医用口罩', specification: '三层防护', model: 'M-001', unit: '盒', price: 50, quantity: 100, amount: 5000, status: '待验收' },
          { key: '1-2', productCode: 'P002', productName: '医用手套', specification: '乳胶', model: 'L-001', unit: '盒', price: 30, quantity: 200, amount: 6000, status: '待验收' },
          { key: '1-3', productCode: 'P003', productName: '消毒液', specification: '500ml', model: 'D-001', unit: '瓶', price: 40, quantity: 100, amount: 4000, status: '待验收' },
        ]
      },
      {
        key: '2',
        orderNumber: 'PO-20260109-002',
        supplierName: '医疗器械供应商B',
        supplierCode: 'SUP002',
        department: '采购部',
        buyer: '李四',
        contactPerson: '王经理',
        contactPhone: '13800138002',
        orderDate: '2026-01-09',
        expectedDeliveryDate: '2026-01-14',
        actualDeliveryDate: '2026-01-13',
        status: '待验收',
        itemCount: 2,
        totalAmount: 8000,
        items: [
          { key: '2-1', productCode: 'P004', productName: '体温计', specification: '电子', model: 'T-001', unit: '支', price: 100, quantity: 50, amount: 5000, status: '待验收' },
          { key: '2-2', productCode: 'P005', productName: '血压计', specification: '上臂式', model: 'B-001', unit: '台', price: 150, quantity: 20, amount: 3000, status: '待验收' },
        ]
      },
      {
        key: '3',
        orderNumber: 'PO-20260108-003',
        supplierName: '消毒用品供应商C',
        supplierCode: 'SUP003',
        department: '采购部',
        buyer: '王五',
        contactPerson: '张经理',
        contactPhone: '13800138003',
        orderDate: '2026-01-08',
        expectedDeliveryDate: '2026-01-13',
        actualDeliveryDate: '2026-01-20',
        status: '待验收',
        itemCount: 1,
        totalAmount: 6000,
        items: [
          { key: '3-1', productCode: 'P006', productName: '酒精', specification: '75%', model: 'A-001', unit: '瓶', price: 60, quantity: 100, amount: 6000, status: '待验收' },
        ]
      },
      {
        key: '4',
        orderNumber: 'PO-20260107-004',
        supplierName: '医疗耗材供应商D',
        supplierCode: 'SUP004',
        department: '采购部',
        buyer: '赵六',
        contactPerson: '刘经理',
        contactPhone: '13800138004',
        orderDate: '2026-01-07',
        expectedDeliveryDate: '2026-01-12',
        actualDeliveryDate: null,
        status: '待验收',
        itemCount: 2,
        totalAmount: 12000,
        items: [
          { key: '4-1', productCode: 'P007', productName: '纱布', specification: '无菌', model: 'G-001', unit: '包', price: 20, quantity: 300, amount: 6000, status: '待验收' },
          { key: '4-2', productCode: 'P008', productName: '棉签', specification: '无菌', model: 'Q-001', unit: '包', price: 15, quantity: 400, amount: 6000, status: '待验收' },
        ]
      },
      {
        key: '5',
        orderNumber: 'PO-20260106-005',
        supplierName: '医疗设备供应商E',
        supplierCode: 'SUP005',
        department: '采购部',
        buyer: '钱七',
        contactPerson: '陈经理',
        contactPhone: '13800138005',
        orderDate: '2026-01-06',
        expectedDeliveryDate: '2026-01-11',
        actualDeliveryDate: '2026-01-10',
        status: '待验收',
        itemCount: 1,
        totalAmount: 25000,
        items: [
          { key: '5-1', productCode: 'P009', productName: '监护仪', specification: '多参数', model: 'J-001', unit: '台', price: 25000, quantity: 1, amount: 25000, status: '待验收' },
        ]
      },
    ];
    setData(mockData);
    setFilteredData(mockData);
    setPagination(prev => ({ ...prev, total: mockData.length }));
  }, []);

  // 状态标签渲染
  const getStatusTag = (status) => {
    const statusMap = {
      '待验收': { color: 'orange', text: '待验收' },
      '已验收': { color: 'green', text: '已验收' },
      '已拒收': { color: 'red', text: '已拒收' },
      '部分验收': { color: 'blue', text: '部分验收' },
    };
    const config = statusMap[status] || { color: 'default', text: status };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  // 搜索处理
  const handleSearch = (values) => {
    let result = [...data];
    
    // 输入耗材名称或编码搜索
    if (values.searchText) {
      const searchText = values.searchText.toLowerCase();
      result = result.filter(item => 
        item.orderNumber.toLowerCase().includes(searchText) ||
        item.supplierName.toLowerCase().includes(searchText) ||
        item.items.some(subItem => 
          subItem.productName.toLowerCase().includes(searchText) ||
          subItem.productCode.toLowerCase().includes(searchText)
        )
      );
    }
    
    if (values.supplierName) {
      result = result.filter(item => item.supplierName.includes(values.supplierName));
    }
    if (values.orderDateRange && values.orderDateRange.length === 2) {
      const startDate = values.orderDateRange[0].format('YYYY-MM-DD');
      const endDate = values.orderDateRange[1].format('YYYY-MM-DD');
      result = result.filter(item => item.orderDate >= startDate && item.orderDate <= endDate);
    }
    if (values.status) {
      result = result.filter(item => item.status === values.status);
    }
    
    setFilteredData(result);
    setPagination(prev => ({ ...prev, current: 1, total: result.length }));
  };

  // 重置搜索
  const handleReset = () => {
    form.resetFields();
    setFilteredData(data);
    setPagination(prev => ({ ...prev, current: 1, total: data.length }));
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
    setPagination(newPagination);
  };

  // 处理确认验收选中的商品
  const handleAcceptSelectedItems = () => {
    if (selectedItemKeys.length === 0) {
      message.warning('请先选择要验收的商品');
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
      onOk: () => {
        // 更新数据中选中商品的状态
        const updatedData = data.map(order => {
          if (order.key === selectedOrder.key) {
            let updatedItems = [];
            
            order.items.forEach(item => {
              if (selectedItemKeys.includes(item.key)) {
                const receivedQty = receivedQuantities[item.key] || item.quantity;
                
                if (receivedQty >= item.quantity) {
                  // 全部验收
                  updatedItems.push({
                    ...item,
                    status: '已验收'
                  });
                } else {
                  // 部分验收
                  // 添加已验收的部分
                  updatedItems.push({
                    ...item,
                    quantity: receivedQty,
                    amount: item.price * receivedQty,
                    status: '已验收',
                    key: `${item.key}-accepted`
                  });
                  // 保留剩余的部分
                  updatedItems.push({
                    ...item,
                    quantity: item.quantity - receivedQty,
                    amount: item.price * (item.quantity - receivedQty),
                    status: '待验收',
                    key: `${item.key}-remaining`
                  });
                }
              } else {
                updatedItems.push(item);
              }
            });

            // 检查订单状态
            const allAccepted = updatedItems.every(item => item.status === '已验收');
            const allRejected = updatedItems.every(item => item.status === '已拒收');
            const hasPending = updatedItems.some(item => item.status === '待验收');

            let newStatus = order.status;
            if (allAccepted) {
              newStatus = '已验收';
            } else if (allRejected) {
              newStatus = '已拒收';
            } else if (!hasPending) {
              newStatus = '部分验收';
            }

            return {
              ...order,
              status: newStatus,
              items: updatedItems
            };
          }
          return order;
        });

        setData(updatedData);
        setFilteredData(updatedData);
        
        // 更新当前选中的订单
        const updatedSelectedOrder = updatedData.find(order => order.key === selectedOrder.key);
        setSelectedOrder(updatedSelectedOrder);
        
        // 清空选择状态
        setSelectedItemKeys([]);
        
        message.success(`成功验收 ${selectedItemKeys.length} 项商品`);
      }
    });
  };

  // 处理拒收选中的商品
  const handleRejectSelectedItems = () => {
    if (selectedItemKeys.length === 0) {
      message.warning('请先选择要拒收的商品');
      return;
    }

    Modal.confirm({
      title: '确认拒收',
      content: `确定要拒收选中的 ${selectedItemKeys.length} 项商品吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        // 更新数据中选中商品的状态
        const updatedData = data.map(order => {
          if (order.key === selectedOrder.key) {
            const updatedItems = order.items.map(item => {
              if (selectedItemKeys.includes(item.key)) {
                return {
                  ...item,
                  status: '已拒收'
                };
              }
              return item;
            });

            // 检查订单状态
            const allAccepted = updatedItems.every(item => item.status === '已验收');
            const allRejected = updatedItems.every(item => item.status === '已拒收');
            const hasPending = updatedItems.some(item => item.status === '待验收');

            let newStatus = order.status;
            if (allAccepted) {
              newStatus = '已验收';
            } else if (allRejected) {
              newStatus = '已拒收';
            } else if (!hasPending) {
              newStatus = '部分验收';
            }

            return {
              ...order,
              status: newStatus,
              items: updatedItems
            };
          }
          return order;
        });

        setData(updatedData);
        setFilteredData(updatedData);
        
        // 更新当前选中的订单
        const updatedSelectedOrder = updatedData.find(order => order.key === selectedOrder.key);
        setSelectedOrder(updatedSelectedOrder);
        
        // 清空选择状态
        setSelectedItemKeys([]);
        
        message.success(`成功拒收 ${selectedItemKeys.length} 项商品`);
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
      title: '供应商名称',
      dataIndex: 'supplierName',
      key: 'supplierName',
      width: 180
    },
    {
      title: '采购部门',
      dataIndex: 'department',
      key: 'department',
      width: 120
    },
    {
      title: '商品数量',
      dataIndex: 'itemCount',
      key: 'itemCount',
      width: 100
    },
    {
      title: '总金额',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 120,
      render: (value) => <strong>¥{value?.toFixed(2)}</strong>
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
      title: '实际到货',
      dataIndex: 'actualDeliveryDate',
      key: 'actualDeliveryDate',
      width: 120,
      render: (value) => value || '-'
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
                initialReceivedQuantities[item.key] = item.quantity;
                initialModifiedItems[item.key] = false;
              });
              setReceivedQuantities(initialReceivedQuantities);
              setModifiedItems(initialModifiedItems);
              setRemarks(''); // 重置备注
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
      title: '商品名称',
      dataIndex: 'productName',
      key: 'productName',
      width: 180
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
          layout="vertical"
          onFinish={handleSearch}
          style={{ marginBottom: '24px' }}
        >
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item label="输入耗材名称或编码" name="searchText">
                <Input placeholder="请输入采购单号、供应商或商品信息" allowClear />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item label="供应商" name="supplierName">
                <Select placeholder="请选择供应商" allowClear>
                  <Option value="医疗用品供应商A">医疗用品供应商A</Option>
                  <Option value="医疗器械供应商B">医疗器械供应商B</Option>
                  <Option value="消毒用品供应商C">消毒用品供应商C</Option>
                  <Option value="医疗耗材供应商D">医疗耗材供应商D</Option>
                  <Option value="医疗设备供应商E">医疗设备供应商E</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item label="订单日期" name="orderDateRange">
                <RangePicker style={{ width: '100%' }} locale={zhCN} />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label="状态" name="status">
                <Select placeholder="请选择状态" allowClear>
                  <Option value="待验收">待验收</Option>
                  <Option value="已验收">已验收</Option>
                  <Option value="已拒收">已拒收</Option>
                  <Option value="部分验收">部分验收</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label="单据筛选" name="viewMode">
                <Select 
                  placeholder="单据筛选" 
                  allowClear
                  onChange={(value) => {
                    if (value) {
                      setViewMode(value);
                      setHasSelectedView(true);
                    } else {
                      setHasSelectedView(false);
                    }
                  }}
                >
                  <Option value="summary">采购单汇总</Option>
                  <Option value="detail">采购明细</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24} style={{ textAlign: 'right' }}>
              <Space>
                <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                  查询
                </Button>
                <Button onClick={handleReset} icon={<ReloadOutlined />}>
                  重置
                </Button>
                <Button onClick={handleExport} icon={<DownloadOutlined />}>
                  导出
                </Button>
              </Space>
            </Col>
          </Row>
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
                disabled={selectedRowKeys.length === 0}
                onClick={() => message.success(`批量验收 ${selectedRowKeys.length} 个订单`)}
              >
                批量验收
              </Button>
              <Button 
                danger 
                disabled={selectedRowKeys.length === 0}
                onClick={() => message.success(`批量拒收 ${selectedRowKeys.length} 个订单`)}
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
            disabled={selectedItemKeys.length === 0}
          >
            拒收
          </Button>,
          <Button 
            key="accept" 
            type="primary" 
            onClick={() => handleAcceptSelectedItems()}
            disabled={selectedItemKeys.length === 0}
          >
            确认验收
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
                <div><strong>订单日期：</strong>{selectedOrder.orderDate}</div>
              </Col>
              <Col span={8}>
                <div><strong>预计到货：</strong>{selectedOrder.expectedDeliveryDate}</div>
              </Col>
              <Col span={8}>
                <div><strong>实际到货：</strong>{selectedOrder.actualDeliveryDate || '-'}</div>
              </Col>
            </Row>
            
            <Row gutter={16} style={{ marginBottom: 16 }}>
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
            
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={8}>
                <div><strong>总金额：</strong>¥{selectedOrder.totalAmount.toFixed(2)}</div>
              </Col>
              <Col span={8}>
                <div><strong>商品数量：</strong>{selectedOrder.itemCount} 项</div>
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
                商品明细
              </div>
              <Table
                columns={[
                  {
                    title: (
                      <Checkbox
                        checked={selectedOrder?.items?.length > 0 && selectedItemKeys.length === selectedOrder.items.length}
                        indeterminate={selectedItemKeys.length > 0 && selectedItemKeys.length < (selectedOrder?.items?.length || 0)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            // 全选
                            setSelectedItemKeys(selectedOrder?.items?.map(item => item.key) || []);
                          } else {
                            // 取消全选
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
                  { title: '物资编码', dataIndex: 'productCode', key: 'productCode', width: 120 },
                  { title: '商品名称', dataIndex: 'productName', key: 'productName', width: 150 },
                  { title: '规格', dataIndex: 'specification', key: 'specification', width: 100 },
                  { title: '型号', dataIndex: 'model', key: 'model', width: 100 },
                  { title: '单位', dataIndex: 'unit', key: 'unit', width: 80 },
                  { title: '单价', dataIndex: 'price', key: 'price', width: 100, render: (value) => `¥${value?.toFixed(2)}` },
                  { title: '采购数量', dataIndex: 'quantity', key: 'quantity', width: 80 },
                  { 
                    title: '到货数量', 
                    key: 'receivedQuantity', 
                    width: 100, 
                    render: (_, record) => (
                      <InputNumber
                        min={0}
                        max={record.quantity}
                        value={receivedQuantities[record.key] || record.quantity}
                        onChange={(value) => {
                          const newReceivedQuantities = { ...receivedQuantities };
                          newReceivedQuantities[record.key] = value;
                          setReceivedQuantities(newReceivedQuantities);
                          
                          // 标记该商品已修改过到货数量
                          const newModifiedItems = { ...modifiedItems };
                          newModifiedItems[record.key] = true;
                          setModifiedItems(newModifiedItems);
                        }}
                      />
                    )
                  },
                  { 
                    title: '金额', 
                    key: 'amount', 
                    width: 120, 
                    render: (_, record) => {
                      const receivedQty = receivedQuantities[record.key] || record.quantity;
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
