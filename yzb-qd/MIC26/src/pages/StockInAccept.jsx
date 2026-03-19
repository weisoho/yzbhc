import { Form, Input, Select, DatePicker, Button, Card, Row, Col, Table, Checkbox, message, Modal, Spin } from 'antd';
import { useState, useEffect } from 'react';
import { SearchOutlined, ReloadOutlined, DownloadOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
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
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [receipts, setReceipts] = useState([]);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  // 从后端获取数据
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await api.get('/api/scm/stock-in/orders', { page: 1, size: 100 });
        if (response.code === 1 && response.data) {
          // 为每个记录添加key属性
          const data = response.data.records.map((item, index) => ({
            ...item,
            key: item.id || index.toString(),
            orderNumber: item.orderNumber,
            supplier: item.supplierName,
            department: item.departmentName,
            itemCount: item.itemCount,
            totalAmount: item.totalAmount,
            receiver: item.operatorName,
            receiveDate: item.createTime,
            status: item.status,
            remark: item.remark,
            items: item.items || []
          }));
          setData(data);
          setFilteredData(data);
          setPagination(prev => ({ ...prev, total: response.data.total }));
        } else {
          message.error('获取采购入库数据失败');
          setData([]);
          setFilteredData([]);
          setPagination(prev => ({ ...prev, total: 0 }));
        }
      } catch (error) {
        console.error('获取采购入库数据失败:', error);
        message.error('获取采购入库数据失败，请稍后重试');
        setData([]);
        setFilteredData([]);
        setPagination(prev => ({ ...prev, total: 0 }));
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
        // 构建搜索参数
        const params = {
          page: 1,
          size: 100,
          orderNumber: values.orderNumber || '',
          supplier: values.supplier || '',
          department: values.department || '',
          productCode: values.productCode || '',
          productName: values.productName || '',
          manufacturer: values.manufacturer || ''
        };
        
        // 发送搜索请求到后端
        const response = await api.get('/api/scm/stock-in/orders', params);
        if (response.code === 1 && response.data) {
          // 为每个记录添加key属性
          const data = response.data.records.map((item, index) => ({
            ...item,
            key: item.id || index.toString(),
            orderNumber: item.orderNumber,
            supplier: item.supplierName,
            department: item.departmentName,
            itemCount: item.itemCount,
            totalAmount: item.totalAmount,
            receiver: item.operatorName,
            receiveDate: item.createTime,
            status: item.status,
            remark: item.remark,
            items: item.items || []
          }));
          setFilteredData(data);
          setPagination(prev => ({ ...prev, current: 1, total: response.data.total }));
        } else {
          message.error('搜索采购入库数据失败');
          setFilteredData([]);
          setPagination(prev => ({ ...prev, current: 1, total: 0 }));
        }
      } catch (error) {
        console.error('搜索采购入库数据失败:', error);
        message.error('搜索采购入库数据失败，请稍后重试');
        setFilteredData([]);
        setPagination(prev => ({ ...prev, current: 1, total: 0 }));
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

  // 获取待入库收货单
  const loadPendingReceipts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/scm/purchases/receipts/pending-stock-in');
      if (response.code === 1) {
        setReceipts(response.data.map(receipt => ({
          key: receipt.id,
          id: receipt.id,
          receiptNumber: receipt.receiptNumber,
          orderNumber: receipt.orderNumber,
          supplierName: receipt.supplierName,
          departmentName: receipt.departmentName,
          totalAmount: receipt.totalAmount,
          createTime: receipt.createTime
        })));
      } else {
        message.error(response.message || '获取待入库收货单失败');
      }
    } catch (error) {
      console.error('获取待入库收货单失败:', error);
      message.error('获取待入库收货单失败，请检查网络连接或联系管理员');
    } finally {
      setLoading(false);
    }
  };

  // 打开创建入库单模态框
  const handleOpenCreateModal = () => {
    loadPendingReceipts();
    setCreateModalVisible(true);
  };

  // 创建入库单
  const handleCreateStockIn = async () => {
    if (!selectedReceipt) {
      message.warning('请选择收货单');
      return;
    }
    try {
      setLoading(true);
      const stockInData = {
        operatorName: '当前用户',
        items: [] // 这里需要根据实际情况填写入库明细
      };
      const response = await api.post(`/api/scm/stock-in/receipts/${selectedReceipt.id}`, stockInData);
      if (response.code === 1) {
        message.success('入库单创建成功');
        setCreateModalVisible(false);
        // 重新加载入库单列表
        const fetchData = async () => {
          setLoading(true);
          try {
            const response = await api.get('/api/scm/stock-in/orders', { pageNum: 1, pageSize: 10 });
            if (response.code === 1 && response.data) {
              const data = response.data.records.map((item, index) => ({
                ...item,
                key: item.id || index.toString(),
                orderNumber: item.orderNumber,
                supplier: item.supplierName,
                department: item.departmentName,
                itemCount: item.itemCount,
                totalAmount: item.totalAmount,
                receiver: item.operatorName,
                receiveDate: item.createTime,
                status: item.status,
                remark: item.remark,
                items: item.items || []
              }));
              setData(data);
              setFilteredData(data);
              setPagination(prev => ({ ...prev, total: response.data.total }));
            }
          } catch (error) {
            console.error('获取采购入库数据失败:', error);
          } finally {
            setLoading(false);
          }
        };
        fetchData();
      } else {
        message.error(response.message || '创建入库单失败');
      }
    } catch (error) {
      console.error('创建入库单失败:', error);
      message.error('创建入库单失败，请检查网络连接或联系管理员');
    } finally {
      setLoading(false);
    }
  };

  // 查看详情
  const handleViewDetail = async (record) => {
    setLoading(true);
    try {
      // 从后端获取采购入库详情数据
      const response = await api.get(`/api/scm/stock-in/orders/${record.id || record.key}`);
      if (response.code === 1) {
        setSelectedOrder({
          ...response.data,
          orderNumber: response.data.orderNumber,
          supplier: response.data.supplierName,
          department: response.data.departmentName,
          itemCount: response.data.itemCount,
          totalAmount: response.data.totalAmount,
          receiver: response.data.operatorName,
          receiveDate: response.data.createTime,
          status: response.data.status,
          remark: response.data.remark,
          items: response.data.items || []
        });
        setIsModalVisible(true);
      } else {
        message.error('获取采购入库详情失败');
      }
    } catch (error) {
      console.error('获取采购入库详情失败:', error);
      message.error('获取采购入库详情失败，请稍后重试');
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
                <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenCreateModal} style={{ minWidth: 120 }}>
                  创建入库单
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

      {/* 创建入库单模态框 */}
      <Modal
        title="创建入库单"
        open={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        width={800}
        footer={[
          <Button key="close" onClick={() => setCreateModalVisible(false)}>
            关闭
          </Button>,
          <Button key="create" type="primary" onClick={handleCreateStockIn} loading={loading}>
            创建入库单
          </Button>,
        ]}
      >
        <div>
          <h3>选择收货单</h3>
          <Table
            columns={[
              {
                title: '收货单号',
                dataIndex: 'receiptNumber',
                key: 'receiptNumber',
                width: 150,
              },
              {
                title: '采购单号',
                dataIndex: 'orderNumber',
                key: 'orderNumber',
                width: 150,
              },
              {
                title: '供应商',
                dataIndex: 'supplierName',
                key: 'supplierName',
                width: 180,
              },
              {
                title: '采购分院',
                dataIndex: 'departmentName',
                key: 'departmentName',
                width: 120,
              },
              {
                title: '总金额',
                dataIndex: 'totalAmount',
                key: 'totalAmount',
                width: 120,
                render: (value) => `¥${value?.toFixed(2)}`,
              },
              {
                title: '创建时间',
                dataIndex: 'createTime',
                key: 'createTime',
                width: 150,
              },
            ]}
            dataSource={receipts}
            rowKey="key"
            rowSelection={{
              type: 'radio',
              selectedRowKeys: selectedReceipt ? [selectedReceipt.key] : [],
              onChange: (selectedRowKeys) => {
                if (selectedRowKeys.length > 0) {
                  const selectedKey = selectedRowKeys[0];
                  const receipt = receipts.find(item => item.key === selectedKey);
                  setSelectedReceipt(receipt);
                } else {
                  setSelectedReceipt(null);
                }
              },
            }}
            pagination={{
              pageSize: 10,
              showTotal: (total) => `共 ${total} 条记录`,
            }}
            loading={loading}
          />
        </div>
      </Modal>
    </div>
  );
};

export default StockInAccept;