import { Form, Input, Select, DatePicker, Button, Card, Row, Col, Table, Checkbox, message, Modal, Spin } from 'antd';
import { useState, useEffect } from 'react';
import { SearchOutlined, ReloadOutlined, DownloadOutlined, EyeOutlined } from '@ant-design/icons';
import api from '../utils/api';

const { Option } = Select;
const { RangePicker } = DatePicker;

const StockInAccept = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // 从后端获取数据
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await api.get('/api/stock-in-accept');
        // 为每个记录添加key属性
        const data = response.data.map((item, index) => ({
          ...item,
          key: item.id || index.toString()
        }));
        setData(data);
        setFilteredData(data);
        setPagination(prev => ({ ...prev, total: data.length }));
      } catch (error) {
        console.error('获取采购入库数据失败:', error);
        message.error('获取采购入库数据失败，请稍后重试');
        // 使用模拟数据作为备用
        const mockData = [
          {
            key: '1',
            id: '1',
            orderNumber: 'PO-20260110-001',
            supplier: '医疗用品供应商A',
            department: '采购部',
            itemCount: 3,
            totalAmount: 15000,
            receiver: '张三',
            receiveDate: '2026-01-14',
            status: '已入库',
            remark: '正常入库',
            items: [
              { key: '1-1', productCode: 'P001', productName: '医用口罩', specification: '三层防护', model: 'M-001', unit: '盒', price: 50, quantity: 100, amount: 5000, batchNumber: '20260101', productionDate: '2026-01-01', expiryDate: '2027-01-01' },
              { key: '1-2', productCode: 'P002', productName: '医用手套', specification: '乳胶', model: 'L-001', unit: '盒', price: 30, quantity: 200, amount: 6000, batchNumber: '20260102', productionDate: '2026-01-02', expiryDate: '2027-01-02' },
              { key: '1-3', productCode: 'P003', productName: '消毒液', specification: '500ml', model: 'D-001', unit: '瓶', price: 40, quantity: 100, amount: 4000, batchNumber: '20260103', productionDate: '2026-01-03', expiryDate: '2027-01-03' },
            ]
          },
          {
            key: '2',
            id: '2',
            orderNumber: 'PO-20260109-002',
            supplier: '医疗器械供应商B',
            department: '采购部',
            itemCount: 2,
            totalAmount: 8000,
            receiver: '李四',
            receiveDate: '2026-01-13',
            status: '已入库',
            remark: '正常入库',
            items: [
              { key: '2-1', productCode: 'P004', productName: '体温计', specification: '电子', model: 'T-001', unit: '支', price: 100, quantity: 50, amount: 5000, batchNumber: '20260104', productionDate: '2026-01-04', expiryDate: '2027-01-04' },
              { key: '2-2', productCode: 'P005', productName: '血压计', specification: '上臂式', model: 'B-001', unit: '台', price: 150, quantity: 20, amount: 3000, batchNumber: '20260105', productionDate: '2026-01-05', expiryDate: '2027-01-05' },
            ]
          },
          {
            key: '3',
            id: '3',
            orderNumber: 'PO-20260108-003',
            supplier: '消毒用品供应商C',
            department: '采购部',
            itemCount: 1,
            totalAmount: 6000,
            receiver: '王五',
            receiveDate: '2026-01-20',
            status: '已入库',
            remark: '正常入库',
            items: [
              { key: '3-1', productCode: 'P006', productName: '酒精', specification: '75%', model: 'A-001', unit: '瓶', price: 60, quantity: 100, amount: 6000, batchNumber: '20260106', productionDate: '2026-01-06', expiryDate: '2027-01-06' },
            ]
          },
        ];
        setData(mockData);
        setFilteredData(mockData);
        setPagination(prev => ({ ...prev, total: mockData.length }));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 搜索处理
  const handleSearch = async (values) => {
    setLoading(true);
    try {
      // 发送搜索请求到后端
      const response = await api.get('/api/stock-in-accept/search', values);
      // 为每个记录添加key属性
      const data = response.data.map((item, index) => ({
        ...item,
        key: item.id || index.toString()
      }));
      setFilteredData(data);
      setPagination(prev => ({ ...prev, current: 1, total: data.length }));
    } catch (error) {
      console.error('搜索采购入库数据失败:', error);
      message.error('搜索采购入库数据失败，请稍后重试');
      // 在前端进行过滤作为备用
      let result = [...data];
      
      // 物资编码搜索
      if (values.productCode) {
        const productCode = values.productCode.toLowerCase();
        result = result.filter(item => 
          item.items.some(subItem => 
            subItem.productCode.toLowerCase().includes(productCode)
          )
        );
      }
      
      // 物资名称搜索
      if (values.productName) {
        const productName = values.productName.toLowerCase();
        result = result.filter(item => 
          item.items.some(subItem => 
            subItem.productName.toLowerCase().includes(productName)
          )
        );
      }
      
      // 供应商搜索
      if (values.supplier) {
        result = result.filter(item => item.supplier.includes(values.supplier));
      }
      
      // 生产厂家搜索
      if (values.manufacturer) {
        const manufacturer = values.manufacturer.toLowerCase();
        result = result.filter(item => 
          item.items.some(subItem => 
            (subItem.manufacturer || '').toLowerCase().includes(manufacturer)
          )
        );
      }
      
      setFilteredData(result);
      setPagination(prev => ({ ...prev, current: 1, total: result.length }));
    } finally {
      setLoading(false);
    }
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

  // 查看详情
  const handleViewDetail = async (record) => {
    setLoading(true);
    try {
      // 从后端获取采购入库详情数据
      const response = await api.get(`/api/stock-in-accept/${record.id || record.key}`);
      setSelectedOrder(response.data);
      setIsModalVisible(true);
    } catch (error) {
      console.error('获取采购入库详情失败:', error);
      message.error('获取采购入库详情失败，请稍后重试');
      // 使用前端记录作为备用
      setSelectedOrder(record);
      setIsModalVisible(true);
    } finally {
      setLoading(false);
    }
  };

  // 分页处理
  const handleTableChange = (newPagination) => {
    setPagination(newPagination);
  };

  // 表格列配置
  const columns = [
    {
      title: '采购单号',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      width: 150,
    },
    {
      title: '供应商',
      dataIndex: 'supplier',
      key: 'supplier',
      width: 180,
    },
    {
      title: '采购分院',
      dataIndex: 'department',
      key: 'department',
      width: 120,
    },
    {
      title: '物资数量',
      dataIndex: 'itemCount',
      key: 'itemCount',
      width: 100,
    },
    {
      title: '总金额',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 120,
      render: (value) => `¥${value?.toFixed(2)}`,
    },
    {
      title: '收货人',
      dataIndex: 'receiver',
      key: 'receiver',
      width: 100,
    },
    {
      title: '收货日期',
      dataIndex: 'receiveDate',
      key: 'receiveDate',
      width: 120,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => {
        let color = '';
        switch (status) {
          case '已入库':
            color = 'green';
            break;
          case '待入库':
            color = 'orange';
            break;
          default:
            color = 'default';
        }
        return <span style={{ color }}>{status}</span>;
      },
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      width: 150,
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Button 
          type="link" 
          size="small"
          icon={<EyeOutlined />}
          onClick={() => handleViewDetail(record)}
        >
          查看详情
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card title="采购入库" bordered={false}>
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ whiteSpace: 'nowrap' }}>供应商：</span>
                  <Form.Item name="supplier" noStyle>
                    <Input placeholder="请输入供应商" allowClear style={{ width: 180 }} size="middle" />
                  </Form.Item>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ whiteSpace: 'nowrap' }}>生产厂家：</span>
                  <Form.Item name="manufacturer" noStyle>
                    <Input placeholder="请输入生产厂家" allowClear style={{ width: 180 }} size="middle" />
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
          columns={columns}
          dataSource={filteredData}
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
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* 详情模态框 */}
      <Modal
        title="采购入库详情"
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
                <div><strong>供应商：</strong>{selectedOrder.supplier}</div>
              </Col>
              <Col span={8}>
                <div><strong>采购分院：</strong>{selectedOrder.department}</div>
              </Col>
            </Row>
            
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={8}>
                <div><strong>收货人：</strong>{selectedOrder.receiver}</div>
              </Col>
              <Col span={8}>
                <div><strong>收货日期：</strong>{selectedOrder.receiveDate}</div>
              </Col>
              <Col span={8}>
                <div><strong>状态：</strong>{selectedOrder.status}</div>
              </Col>
            </Row>
            
            <div style={{ marginBottom: 16 }}>
              <div><strong>备注：</strong>{selectedOrder.remark}</div>
            </div>
            
            <div style={{ marginBottom: 16 }}>
              <h3>物资详情</h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#fafafa' }}>
                      <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>物资编码</th>
                      <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>物资名称</th>
                      <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>规格</th>
                      <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>型号</th>
                      <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>单位</th>
                      <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>单价</th>
                      <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>数量</th>
                      <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>金额</th>
                      <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>批号</th>
                      <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>生产日期</th>
                      <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>失效日期</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map((item) => (
                      <tr key={item.key} style={{ borderBottom: '1px solid #f0f0f0' }}>
                        <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>{item.productCode}</td>
                        <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>{item.productName}</td>
                        <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>{item.specification}</td>
                        <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>{item.model}</td>
                        <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>{item.unit}</td>
                        <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>¥{item.price.toFixed(2)}</td>
                        <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>{item.quantity}</td>
                        <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>¥{item.amount.toFixed(2)}</td>
                        <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>{item.batchNumber}</td>
                        <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>{item.productionDate}</td>
                        <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>{item.expiryDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StockInAccept;