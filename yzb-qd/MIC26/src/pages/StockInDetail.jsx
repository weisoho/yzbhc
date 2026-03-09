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
        const response = await api.get('/api/stock-in-details');
        // 为每个记录添加key属性
        const data = response.data.map((item, index) => ({
          ...item,
          key: item.id || index.toString()
        }));
        setStockInDetails(data);
      } catch (error) {
        console.error('获取入库单数据失败:', error);
        message.error('获取入库单数据失败，请稍后重试');
        // 使用模拟数据作为备用
        const mockData = [
          {
            key: '1',
            id: '1',
            stockInNumber: 'SI-20240220-001',
            date: '2024-02-20',
            operator: '张三',
            stockInType: '采购入库',
            materialCount: 1000,
            totalAmount: 5000,
            remark: '常规采购',
            supplier: '供应商A',
            items: [
              { materialCode: 'MAT001', materialName: '一次性注射器', materialType: '采购入库', specification: '2ml', model: 'SYR-001', batchNumber: '20240201', productionDate: '2024-02-01', expiryDate: '2025-02-01', minPackage: '100支/盒', unit: '支', purchasePrice: 2.5, stockInQuantity: 500, registrationNumber: '国药准字H20240001', supplier: '供应商A', manufacturer: '医疗用品有限公司', remark: '常规采购' },
              { materialCode: 'MAT002', materialName: '输液器', materialType: '采购入库', specification: '50ml', model: 'INF-001', batchNumber: '20240202', productionDate: '2024-02-02', expiryDate: '2025-02-02', minPackage: '50支/盒', unit: '支', purchasePrice: 3.0, stockInQuantity: 300, registrationNumber: '国药准字H20240002', supplier: '供应商A', manufacturer: '医疗用品有限公司', remark: '常规采购' },
              { materialCode: 'MAT003', materialName: '医用棉签', materialType: '采购入库', specification: '10cm', model: 'COT-001', batchNumber: '20240203', productionDate: '2024-02-03', expiryDate: '2025-02-03', minPackage: '1000支/包', unit: '支', purchasePrice: 0.1, stockInQuantity: 2000, registrationNumber: '国药准字H20240003', supplier: '供应商A', manufacturer: '医疗用品有限公司', remark: '常规采购' }
            ]
          },
          {
            key: '2',
            id: '2',
            stockInNumber: 'SI-20240219-002',
            date: '2024-02-19',
            operator: '李四',
            stockInType: '采购入库',
            materialCount: 500,
            totalAmount: 3000,
            remark: '紧急采购',
            supplier: '供应商B',
            items: [
              { materialCode: 'MAT004', materialName: '医用口罩', materialType: '采购入库', specification: 'N95', model: 'MAS-001', batchNumber: '20240204', productionDate: '2024-02-04', expiryDate: '2025-02-04', minPackage: '50个/盒', unit: '个', purchasePrice: 3.0, stockInQuantity: 1000, registrationNumber: '国药准字H20240004', supplier: '供应商B', manufacturer: '防护用品有限公司', remark: '紧急采购' },
              { materialCode: 'MAT005', materialName: '消毒液', materialType: '采购入库', specification: '500ml', model: 'DIS-001', batchNumber: '20240205', productionDate: '2024-02-05', expiryDate: '2025-02-05', minPackage: '20瓶/箱', unit: '瓶', purchasePrice: 10.0, stockInQuantity: 200, registrationNumber: '国药准字H20240005', supplier: '供应商B', manufacturer: '消毒制品有限公司', remark: '紧急采购' },
              { materialCode: 'MAT006', materialName: '手术手套', materialType: '采购入库', specification: '乳胶', model: 'GLO-001', batchNumber: '20240206', productionDate: '2024-02-06', expiryDate: '2025-02-06', minPackage: '100副/盒', unit: '副', purchasePrice: 2.0, stockInQuantity: 500, registrationNumber: '国药准字H20240006', supplier: '供应商B', manufacturer: '医疗用品有限公司', remark: '紧急采购' }
            ]
          },
          {
            key: '3',
            id: '3',
            stockInNumber: 'SI-20240218-003',
            date: '2024-02-18',
            operator: '王五',
            stockInType: '初始化入库',
            materialCount: 200,
            totalAmount: 1000,
            remark: '初始库存',
            supplier: '供应商A',
            items: [
              { materialCode: 'MAT007', materialName: '体温计', materialType: '初始化入库', specification: '电子', model: 'THE-001', batchNumber: '20240207', productionDate: '2024-02-07', expiryDate: '2025-02-07', minPackage: '20个/盒', unit: '个', purchasePrice: 50.0, stockInQuantity: 10, registrationNumber: '国药准字H20240007', supplier: '供应商A', manufacturer: '医疗器械有限公司', remark: '初始库存' },
              { materialCode: 'MAT008', materialName: '血压计', materialType: '初始化入库', specification: '上臂式', model: 'BPG-001', batchNumber: '20240208', productionDate: '2024-02-08', expiryDate: '2025-02-08', minPackage: '10台/箱', unit: '台', purchasePrice: 200.0, stockInQuantity: 5, registrationNumber: '国药准字H20240008', supplier: '供应商A', manufacturer: '医疗器械有限公司', remark: '初始库存' },
              { materialCode: 'MAT009', materialName: '纱布', materialType: '初始化入库', specification: '10cm*10cm', model: 'Gau-001', batchNumber: '20240209', productionDate: '2024-02-09', expiryDate: '2025-02-09', minPackage: '100片/包', unit: '片', purchasePrice: 0.5, stockInQuantity: 1000, registrationNumber: '国药准字H20240009', supplier: '供应商A', manufacturer: '医疗用品有限公司', remark: '初始库存' }
            ]
          }
        ];
        setStockInDetails(mockData);
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
      // 发送搜索请求到后端
      const response = await api.get('/api/stock-in-details/search', values);
      // 为每个记录添加key属性
      const data = response.data.map((item, index) => ({
        ...item,
        key: item.id || index.toString()
      }));
      setFilteredData(data);
      setShowCatalog(true);
    } catch (error) {
      console.error('搜索入库单数据失败:', error);
      message.error('搜索入库单数据失败，请稍后重试');
      // 在前端进行过滤作为备用
      let result = [...stockInDetails];

      // 按入库单号筛选
      if (values.stockInNumber) {
        result = result.filter(item => 
          item.stockInNumber.toLowerCase().includes(values.stockInNumber.toLowerCase())
        );
      }

      // 按物资编码筛选
      if (values.materialCode) {
        result = result.filter(item => 
          item.materialCode && item.materialCode.toLowerCase().includes(values.materialCode.toLowerCase())
        );
      }

      // 按物资名称筛选
      if (values.materialName) {
        result = result.filter(item => 
          item.materialName && item.materialName.toLowerCase().includes(values.materialName.toLowerCase())
        );
      }

      // 按供应商筛选
      if (values.supplier) {
        result = result.filter(item => 
          item.supplier && item.supplier.toLowerCase().includes(values.supplier.toLowerCase())
        );
      }

      // 按生产厂家筛选
      if (values.manufacturer) {
        result = result.filter(item => 
          item.manufacturer && item.manufacturer.toLowerCase().includes(values.manufacturer.toLowerCase())
        );
      }

      setFilteredData(result);
      setShowCatalog(true);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = async (record) => {
    setLoading(true);
    try {
      // 从后端获取入库单详情数据
      const response = await api.get(`/api/stock-in-details/${record.id || record.key}`);
      setSelectedRecord(response.data);
      setIsDetailModalVisible(true);
    } catch (error) {
      console.error('获取入库单详情失败:', error);
      message.error('获取入库单详情失败，请稍后重试');
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
