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
  Checkbox
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

const PurchaseReceipt = () => {
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();
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
  
  // 视图切换状态
  const [viewMode, setViewMode] = useState('summary'); // 'detail' 或 'summary'
  const [hasSelectedView, setHasSelectedView] = useState(false); // 是否已选择视图

  // 模拟数据
  useEffect(() => {
    const mockData = [
      {
        key: '1',
        orderNumber: 'PO-20260110-001',
        supplierName: '医疗用品供应商A',
        supplierCode: 'SUP-A001',
        department: '采购部',
        buyer: '张三',
        contactPerson: '李四',
        contactPhone: '13800138000',
        orderDate: '2026-01-10',
        expectedDeliveryDate: '2026-01-15',
        actualDeliveryDate: '2026-01-14',
        totalAmount: 15000.00,
        status: '待验收',
        itemCount: 3,
        items: [
          { key: '1-1', productCode: 'PROD011', productName: '医用手套', specification: '乳胶 100只/盒', model: 'GLOVE-100', manufacturer: '手套制造厂A', registrationNumber: 'REG-2024-011', unit: '盒', quantity: 500, price: 30.00, amount: 15000.00, status: '待验收' },
          { key: '1-2', productCode: 'PROD012', productName: '医用口罩', specification: 'N95', model: 'MASK-N95', manufacturer: '口罩制造厂B', registrationNumber: 'REG-2024-012', unit: '盒', quantity: 200, price: 25.00, amount: 5000.00, status: '待验收' },
          { key: '1-3', productCode: 'PROD013', productName: '消毒液', specification: '500ml', model: 'DIS-500', manufacturer: '消毒液制造厂C', registrationNumber: 'REG-2024-013', unit: '瓶', quantity: 100, price: 18.00, amount: 1800.00, status: '待验收' }
        ]
      },
      {
        key: '2',
        orderNumber: 'PO-20260109-002',
        supplierName: '医疗器械供应商B',
        supplierCode: 'SUP-B002',
        department: '采购部',
        buyer: '李四',
        contactPerson: '王五',
        contactPhone: '13900139000',
        orderDate: '2026-01-09',
        expectedDeliveryDate: '2026-01-14',
        actualDeliveryDate: '2026-01-13',
        totalAmount: 8000.00,
        status: '已收货',
        itemCount: 2,
        items: [
          { key: '2-1', productCode: 'PROD014', productName: '血压计', specification: '电子血压计', model: 'BP-001', manufacturer: '血压计制造厂B', registrationNumber: 'REG-2024-014', unit: '台', quantity: 10, price: 800.00, amount: 8000.00, status: '已收货' },
          { key: '2-2', productCode: 'PROD015', productName: '体温计', specification: '电子体温计', model: 'TEMP-001', manufacturer: '体温计制造厂C', registrationNumber: 'REG-2024-015', unit: '支', quantity: 50, price: 32.00, amount: 1600.00, status: '已收货' }
        ]
      },
      {
        key: '3',
        orderNumber: 'PO-20260108-003',
        supplierName: '消毒用品供应商C',
        supplierCode: 'SUP-C003',
        department: '采购部',
        buyer: '王五',
        contactPerson: '赵六',
        contactPhone: '13700137000',
        orderDate: '2026-01-08',
        expectedDeliveryDate: '2026-01-13',
        actualDeliveryDate: '2026-01-20',
        totalAmount: 6000.00,
        status: '超时未验收',
        itemCount: 1,
        items: [
          { key: '3-1', productCode: 'PROD016', productName: '消毒湿巾', specification: '100片/包', model: 'WIPE-100', manufacturer: '湿巾制造厂C', registrationNumber: 'REG-2024-016', unit: '包', quantity: 200, price: 30.00, amount: 6000.00, status: '超时未验收' }
        ]
      },
      {
        key: '4',
        orderNumber: 'PO-20260107-004',
        supplierName: '医疗耗材供应商D',
        supplierCode: 'SUP-D004',
        department: '采购部',
        buyer: '赵六',
        contactPerson: '钱七',
        contactPhone: '13600136000',
        orderDate: '2026-01-07',
        expectedDeliveryDate: '2026-01-12',
        actualDeliveryDate: null,
        totalAmount: 12000.00,
        status: '已终止',
        itemCount: 2,
        items: [
          { key: '4-1', productCode: 'PROD017', productName: '注射器', specification: '5ml', model: 'SYR-5', manufacturer: '注射器制造厂D', registrationNumber: 'REG-2024-017', unit: '支', quantity: 1000, price: 1.20, amount: 1200.00, status: '已终止' },
          { key: '4-2', productCode: 'PROD018', productName: '输液器', specification: '一次性', model: 'INF-001', manufacturer: '输液器制造厂E', registrationNumber: 'REG-2024-018', unit: '套', quantity: 500, price: 4.80, amount: 2400.00, status: '已终止' }
        ]
      },
      {
        key: '5',
        orderNumber: 'PO-20260106-005',
        supplierName: '医疗设备供应商E',
        supplierCode: 'SUP-E005',
        department: '采购部',
        buyer: '钱七',
        contactPerson: '孙八',
        contactPhone: '13500135000',
        orderDate: '2026-01-06',
        expectedDeliveryDate: '2026-01-11',
        actualDeliveryDate: '2026-01-10',
        totalAmount: 25000.00,
        status: '已收货',
        itemCount: 1,
        items: [
          { key: '5-1', productCode: 'PROD019', productName: '心电图机', specification: '12导联', model: 'ECG-12', manufacturer: '心电图机制造厂F', registrationNumber: 'REG-2024-019', unit: '台', quantity: 2, price: 12500.00, amount: 25000.00, status: '已收货' }
        ]
      }
    ];
    
    setData(mockData);
    setFilteredData(mockData);
    setPagination(prev => ({
      ...prev,
      total: mockData.length
    }));
  }, []);

  // 搜索处理
  const handleSearch = (values) => {
    setLoading(true);
    
    // 模拟搜索延迟
    setTimeout(() => {
      let filtered = [...data];
      
      // 按采购单号筛选
      if (values.orderNumber) {
        filtered = filtered.filter(item => 
          item.orderNumber.toLowerCase().includes(values.orderNumber.toLowerCase())
        );
      }
      
      // 按供应商名称筛选
      if (values.supplierName) {
        filtered = filtered.filter(item => 
          item.supplierName.toLowerCase().includes(values.supplierName.toLowerCase())
        );
      }
      
      // 按订单状态筛选
      if (values.status && values.status !== 'all') {
        filtered = filtered.filter(item => item.status === values.status);
      }
      
      // 按订单日期筛选
      if (values.dateRange && values.dateRange.length === 2) {
        const [startDate, endDate] = values.dateRange;
        filtered = filtered.filter(item => {
          const orderDate = new Date(item.orderDate);
          return orderDate >= startDate && orderDate <= endDate;
        });
      }
      
      setFilteredData(filtered);
      setPagination(prev => ({
        ...prev,
        current: 1,
        total: filtered.length
      }));
      setLoading(false);
      message.success(`找到 ${filtered.length} 条记录`);
    }, 500);
  };

  // 重置搜索
  const handleReset = () => {
    searchForm.resetFields();
    setFilteredData(data);
    setPagination(prev => ({
      ...prev,
      current: 1,
      total: data.length
    }));
    message.info('搜索条件已重置');
  };

  // 加载数据
  const loadData = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      message.success('数据已刷新');
    }, 500);
  };

  // 表格行选择
  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
    getCheckboxProps: (record) => ({
      // 可以在这里添加禁用的条件，例如：disabled: record.status === '已收货'
    }),
  };

  // 表格分页变化
  const handleTableChange = (newPagination) => {
    setPagination(newPagination);
  };

  // 确认验收处理
  const handleConfirmAcceptance = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择要验收的订单');
      return;
    }
    
    // 这里可以添加实际的验收逻辑
    message.success(`已确认验收 ${selectedRowKeys.length} 个订单`);
    
    // 清空选择
    setSelectedRowKeys([]);
  };

  // 拒收处理
  const handleReject = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择要拒收的订单');
      return;
    }
    
    // 这里可以添加实际的拒收逻辑
    message.success(`已拒收 ${selectedRowKeys.length} 个订单`);
    
    // 清空选择
    setSelectedRowKeys([]);
  };

  // 状态标签
  const getStatusTag = (status) => {
    const statusConfig = {
      '待验收': { color: 'orange', text: '待验收' },
      '已收货': { color: 'green', text: '已收货' },
      '已终止': { color: 'red', text: '已终止' },
      '超时未验收': { color: 'volcano', text: '超时未验收' },
    };
    const config = statusConfig[status] || { color: 'default', text: status };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  // 采购单汇总视图列配置
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
      render: (value) => <strong>¥{value.toFixed(2)}</strong>
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
      render: (date) => date || '-'
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
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
              setIsModalVisible(true);
            }}
          >
            查看
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
      title: '商品编码',
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
      title: '数量',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 80
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      render: (value) => <strong>¥{value?.toFixed(2)}</strong>
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => getStatusTag(status)
    },
  ];

  // 获取明细视图的数据
  const getDetailData = () => {
    const detailData = [];
    filteredData.forEach(order => {
      order.items.forEach(item => {
        detailData.push({
          key: item.key,
          orderNumber: order.orderNumber,
          productCode: item.productCode,
          productName: item.productName,
          specification: item.specification,
          model: item.model,
          manufacturer: item.manufacturer,
          registrationNumber: item.registrationNumber,
          unit: item.unit,
          price: item.price,
          quantity: item.quantity,
          amount: item.amount,
          status: item.status
        });
      });
    });
    return detailData;
  };

  return (
    <div style={{ padding: '0 16px' }}>
      <h1 style={{ marginBottom: 24 }}>采购收货</h1>

      {/* 搜索区域 */}
      <Card style={{ marginBottom: 24 }}>
        <Form
          form={searchForm}
          layout="vertical"
          onFinish={handleSearch}
        >
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item name="orderNumber" label="">
                <Input placeholder="请输入采购单号" size="middle" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="supplierName" label="">
                <Input placeholder="请输入供应商名称" size="middle" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="status" label="" initialValue="all">
                <Select size="middle">
                  <Option value="all">全部状态</Option>
                  <Option value="待验收">待验收</Option>
                  <Option value="已收货">已收货</Option>
                  <Option value="已终止">已终止</Option>
                  <Option value="超时未验收">超时未验收</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="dateRange" label="">
                <RangePicker style={{ width: '100%' }} size="middle" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item label="">
                <Select 
                  placeholder="切换视图" 
                  style={{ width: '100%' }} 
                  size="middle"
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
              </Form.Item>
            </Col>
            <Col span={18}>
              {/* 留空列，用于对齐 */}
            </Col>
          </Row>
          <Row justify="end" style={{ marginTop: 16 }}>
            <Space>
              <Button icon={<DownloadOutlined />}>导出数据</Button>
              <Button icon={<ReloadOutlined />} onClick={loadData}>
                刷新
              </Button>
              <Button icon={<ReloadOutlined />} onClick={handleReset}>
                重置
              </Button>
              <Button type="primary" icon={<SearchOutlined />} htmlType="submit">
                搜索
              </Button>
            </Space>
          </Row>
        </Form>
      </Card>

      {/* 采购单汇总/明细表单 */}
      <Card 
        title={`${viewMode === 'detail' ? '采购明细' : '采购单汇总'} (共 ${viewMode === 'detail' ? getDetailData().length : filteredData.length} 条)`}
        style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
      >
        <Table
          columns={viewMode === 'detail' ? detailColumns : summaryColumns}
          dataSource={viewMode === 'detail' ? getDetailData() : filteredData}
          rowKey="key"
          rowSelection={rowSelection}
          loading={loading}
          pagination={{ 
            ...pagination,
            showSizeChanger: false,
            showQuickJumper: false,
            showTotal: (total) => `共 ${total} 条记录`,
            style: {
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              margin: '24px 0 0 0',
            },
            onChange: (page, pageSize) => {
              setPagination(prev => ({
                ...prev,
                current: page,
                pageSize,
              }));
            },
          }}
          onChange={handleTableChange}
          size="middle"
          scroll={{ x: 1500 }}
        />
        <Row justify="end" style={{ marginTop: 16 }}>
          <Space>
            <Button type="primary" onClick={() => handleConfirmAcceptance()}>
              确认验收
            </Button>
            <Button danger onClick={() => handleReject()}>
              拒收
            </Button>
          </Space>
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
                  { title: '商品编码', dataIndex: 'productCode', key: 'productCode', width: 120 },
                  { title: '商品名称', dataIndex: 'productName', key: 'productName', width: 150 },
                  { title: '规格', dataIndex: 'specification', key: 'specification', width: 100 },
                  { title: '型号', dataIndex: 'model', key: 'model', width: 100 },
                  { title: '单位', dataIndex: 'unit', key: 'unit', width: 80 },
                  { title: '单价', dataIndex: 'price', key: 'price', width: 100, render: (value) => `¥${value?.toFixed(2)}` },
                  { title: '数量', dataIndex: 'quantity', key: 'quantity', width: 80 },
                  { title: '金额', dataIndex: 'amount', key: 'amount', width: 120, render: (value) => `¥${value?.toFixed(2)}` },
                  { title: '状态', dataIndex: 'status', key: 'status', width: 100, render: (status) => getStatusTag(status) },
                ]}
                dataSource={selectedOrder.items}
                rowKey="key"
                pagination={false}
                size="small"
                scroll={{ x: 900 }}
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PurchaseReceipt;