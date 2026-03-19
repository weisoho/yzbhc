import { Form, Input, Select, DatePicker, Button, Table, Card, Space, Modal, Row, Col, Divider, Spin, message } from 'antd';
import { SearchOutlined, EyeOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import api from '../utils/api';

const { Option } = Select;

const StockInDetail = () => {
  const [form] = Form.useForm();
  const [stockInDetails, setStockInDetails] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [showCatalog, setShowCatalog] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [loading, setLoading] = useState(false);

  // 从后端获取入库单数据
  useEffect(() => {
    const fetchStockInDetails = async () => {
      setLoading(true);
      try {
        const response = await api.get('/api/scm/stock-in/orders');
        if (response.code === 1 && response.data) {
          // 为每个记录添加key属性
          const data = response.data.records.map((item, index) => ({
            ...item,
            key: item.id || index.toString(),
            date: item.createTime,
            operator: item.operatorName,
            stockInType: item.stockInType,
            materialCount: item.itemCount,
            totalAmount: item.totalAmount,
            remark: item.remark,
            supplier: item.supplierName,
            items: item.details || []
          }));
          setStockInDetails(data);
        } else {
          message.error(response.message || '获取入库单数据失败');
        }
      } catch (error) {
        console.error('获取入库单数据失败:', error);
        message.error('获取入库单数据失败，请检查网络连接或联系管理员');
      } finally {
        setLoading(false);
      }
    };

    fetchStockInDetails();
  }, []);

  const columns = [
    { title: '入库单号', dataIndex: 'stockInNumber', key: 'stockInNumber' },
    { title: '入库日期', dataIndex: 'date', key: 'date' },
    { title: '入库人', dataIndex: 'operator', key: 'operator' },
    { title: '入库类型', dataIndex: 'stockInType', key: 'stockInType' },
    { title: '物资数量', dataIndex: 'materialCount', key: 'materialCount' },
    { title: '总金额', dataIndex: 'totalAmount', key: 'totalAmount', render: (amount) => `¥${amount.toFixed(2)}` },
    { title: '备注', dataIndex: 'remark', key: 'remark' },
    { 
      title: '操作', 
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => handleViewDetail(record)}><EyeOutlined />查看</a>
          <a>编辑</a>
        </Space>
      )
    },
  ];

  const catalogColumns = [
    { title: '入库单号', dataIndex: 'stockInNumber', key: 'stockInNumber' },
    { title: '物资编码', dataIndex: 'materialCode', key: 'materialCode' },
    { title: '物资名称', dataIndex: 'materialName', key: 'materialName' },
    { title: '供应商', dataIndex: 'supplier', key: 'supplier' },
    { title: '生产厂家', dataIndex: 'manufacturer', key: 'manufacturer' },
    { title: '入库数量', dataIndex: 'materialCount', key: 'materialCount' },
    { title: '总金额', dataIndex: 'totalAmount', key: 'totalAmount', render: (amount) => `¥${amount.toFixed(2)}` },
  ];

  const handleSearch = async (values) => {
    setLoading(true);
    try {
      // 构建查询参数
      const params = {
        stockInNumber: values.stockInNumber,
        productCode: values.materialCode,
        productName: values.materialName,
        supplier: values.supplier,
        manufacturer: values.manufacturer
      };
      
      // 发送搜索请求到后端
      const response = await api.get('/api/scm/stock-in/orders', { params });
      if (response.code === 1 && response.data) {
        // 为每个记录添加key属性
        const data = response.data.records.map((item, index) => ({
          ...item,
          key: item.id || index.toString(),
          date: item.createTime,
          operator: item.operatorName,
          stockInType: item.stockInType,
          materialCount: item.itemCount,
          totalAmount: item.totalAmount,
          remark: item.remark,
          supplier: item.supplierName,
          materialCode: item.details?.[0]?.materialCode,
          materialName: item.details?.[0]?.materialName,
          manufacturer: item.details?.[0]?.manufacturer
        }));
        setFilteredData(data);
        setShowCatalog(true);
      } else {
        message.error(response.message || '搜索入库单数据失败');
      }
    } catch (error) {
      console.error('搜索入库单数据失败:', error);
      message.error('搜索入库单数据失败，请检查网络连接或联系管理员');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = async (record) => {
    setLoading(true);
    try {
      // 从后端获取入库单详情数据
      const response = await api.get(`/api/scm/stock-in/orders/${record.id || record.key}`);
      if (response.code === 1 && response.data) {
        const detailData = {
          ...response.data,
          stockInNumber: response.data.stockInNumber,
          date: response.data.createTime,
          operator: response.data.operatorName,
          stockInType: response.data.stockInType,
          materialCount: response.data.itemCount,
          totalAmount: response.data.totalAmount,
          remark: response.data.remark,
          supplier: response.data.supplierName,
          items: response.data.details || []
        };
        setSelectedRecord(detailData);
        setIsDetailModalVisible(true);
      } else {
        message.error(response.message || '获取入库单详情失败');
      }
    } catch (error) {
      console.error('获取入库单详情失败:', error);
      message.error('获取入库单详情失败，请检查网络连接或联系管理员');
      // 使用前端记录作为备用
      setSelectedRecord(record);
      setIsDetailModalVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '0 16px' }}>
      <h1 style={{ marginBottom: 24 }}>入库单查询</h1>
      
      <Card style={{ marginBottom: 16 }}>
        <Form form={form} layout="inline" onFinish={handleSearch} style={{ width: '100%' }}>
          <Space wrap style={{ width: '100%', alignItems: 'center' }}>
            <Form.Item name="stockInNumber" label="入库单号" style={{ flex: 1, minWidth: 150 }}>
              <Input placeholder="请输入入库单号" style={{ width: '100%' }} />
            </Form.Item>
            
            <Form.Item name="materialCode" label="物资编码" style={{ flex: 1, minWidth: 150 }}>
              <Input placeholder="请输入物资编码" style={{ width: '100%' }} />
            </Form.Item>
            
            <Form.Item name="materialName" label="物资名称" style={{ flex: 1, minWidth: 150 }}>
              <Input placeholder="请输入物资名称" style={{ width: '100%' }} />
            </Form.Item>
            
            <Form.Item name="supplier" label="供应商" style={{ flex: 1, minWidth: 150 }}>
              <Input placeholder="请输入供应商" style={{ width: '100%' }} />
            </Form.Item>
            
            <Form.Item name="manufacturer" label="生产厂家" style={{ flex: 1, minWidth: 150 }}>
              <Input placeholder="请输入生产厂家" style={{ width: '100%' }} />
            </Form.Item>
            
            <Form.Item style={{ minWidth: 100 }}>
              <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                查询
              </Button>
            </Form.Item>
          </Space>
        </Form>
      </Card>
      
      <div style={{ overflowX: 'auto', marginBottom: 24 }}>
        <Table 
          columns={columns} 
          dataSource={stockInDetails} 
          pagination={{ 
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
            style: {
              display: 'flex',
              justifyContent: 'center',
              marginTop: '16px'
            }
          }} 
          size="small"
          loading={loading}
        />
      </div>

      {showCatalog && (
        <Card title="目录明细表" style={{ marginBottom: 16 }}>
          <div style={{ overflowX: 'auto' }}>
            <Table columns={catalogColumns} dataSource={filteredData} pagination={{ 
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条记录`,
              style: {
                display: 'flex',
                justifyContent: 'center',
                marginTop: '16px'
              }
            }} size="small" />
          </div>
        </Card>
      )}

      {/* 详情模态框 */}
      <Modal
        title="入库单详情"
        open={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        width={1200}
        footer={[
          <Button key="close" onClick={() => setIsDetailModalVisible(false)}>
            关闭
          </Button>
        ]}
      >
        {selectedRecord && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <div><strong>入库单号：</strong>{selectedRecord.stockInNumber}</div>
                <div><strong>入库日期：</strong>{selectedRecord.date}</div>
                <div><strong>入库人：</strong>{selectedRecord.operator}</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div><strong>入库类型：</strong>{selectedRecord.stockInType}</div>
                <div><strong>物资数量：</strong>{selectedRecord.materialCount}</div>
                <div><strong>总金额：</strong>¥{selectedRecord.totalAmount.toFixed(2)}</div>
              </div>
            </div>
            
            <Divider orientation="left">物资详情</Divider>
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#fafafa' }}>
                    <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '60px' }}>
                      <Input type="checkbox" />
                    </th>
                    <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '100px' }}>物资编码</th>
                    <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '150px' }}>物资名称</th>
                    <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '100px' }}>物资类型</th>
                    <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '100px' }}>规格</th>
                    <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '100px' }}>型号</th>
                    <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '100px' }}>批号</th>
                    <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '120px' }}>生产日期</th>
                    <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '120px' }}>失效日期</th>
                    <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '120px' }}>最小包装</th>
                    <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '80px' }}>单位</th>
                    <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '100px' }}>采购价格</th>
                    <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '100px' }}>入库数量</th>
                    <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '120px' }}>注册证号</th>
                    <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '150px' }}>供应商</th>
                    <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '150px' }}>生产厂家</th>
                    <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '150px' }}>备注</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedRecord.items.map((item, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>
                        <Input type="checkbox" />
                      </td>
                      <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>{item.materialCode}</td>
                      <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>{item.materialName}</td>
                      <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>{item.materialType}</td>
                      <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>{item.specification}</td>
                      <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>{item.model}</td>
                      <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>{item.batchNumber}</td>
                      <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>{item.productionDate}</td>
                      <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>{item.expiryDate}</td>
                      <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>{item.minPackage}</td>
                      <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>{item.unit}</td>
                      <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>¥{item.purchasePrice.toFixed(2)}</td>
                      <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>{item.stockInQuantity}</td>
                      <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>{item.registrationNumber}</td>
                      <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>{item.supplier}</td>
                      <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>{item.manufacturer}</td>
                      <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>{item.remark}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StockInDetail;
