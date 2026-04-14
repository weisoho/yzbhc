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
  const [receiptItems, setReceiptItems] = useState([]);
  const [materialMetaMap, setMaterialMetaMap] = useState({});
  // 待提交入库明细列表（暂存区）
  const [pendingStockInItems, setPendingStockInItems] = useState([]);
  // 待提交明细复选框选中的key
  const [selectedPendingKeys, setSelectedPendingKeys] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const getCurrentUserName = () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      return userInfo.realName || userInfo.name || userInfo.userName || '管理员';
    } catch {
      return '管理员';
    }
  };

  const normalizeDateInput = (value) => {
    if (!value) {
      return '';
    }
    const trimmed = String(value).trim();
    if (/^\d{8}$/.test(trimmed)) {
      return `${trimmed.slice(0, 4)}-${trimmed.slice(4, 6)}-${trimmed.slice(6, 8)}`;
    }
    return trimmed;
  };

  const loadMaterialMetadata = async () => {
    try {
      const response = await api.get('/api/scm/materials/enabled');
      if (response.code === 1 && Array.isArray(response.data)) {
        const metadata = response.data.reduce((accumulator, item) => {
          accumulator[item.materialCode] = item;
          return accumulator;
        }, {});
        setMaterialMetaMap(metadata);
      }
    } catch (error) {
      console.error('加载物资主档失败:', error);
    }
  };

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
    loadMaterialMetadata();
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
    loadMaterialMetadata();
    setSelectedReceipt(null);
    setReceiptItems([]);
    setCreateModalVisible(true);
  };

  const handleSelectReceipt = async (receipt) => {
    setSelectedReceipt(receipt);
    try {
      setLoading(true);
      const response = await api.get(`/api/scm/purchases/receipts/${receipt.id}`);
      if (response.code === 1 && response.data) {
        const detailItems = (response.data.items || []).map((item, index) => {
          const materialMeta = materialMetaMap[item.productCode] || {};
          return {
            key: item.id || `${receipt.id}_${index}`,
            receiveItemId: item.id,
            materialId: materialMeta.id,
            materialCode: item.productCode,
            materialName: item.productName,
            materialType: materialMeta.materialType || '',
            specification: item.specification,
            model: item.model,
            minPackage: materialMeta.minPackage || '1',
            unit: item.unit,
            supplierName: receipt.supplierName,
            manufacturer: item.manufacturer,
            registrationNumber: item.registrationNumber,
            batchNumber: item.batchNumber || '',
            productionDate: item.productionDate || '',
            expiryDate: item.expiryDate || '',
            purchasePrice: item.price,
            orderQuantity: item.quantity,
            stockInQuantity: item.actualReceivedQuantity || item.quantity || 0,
            remark: '',
          };
        });
        setReceiptItems(detailItems);
      } else {
        message.error(response.message || '获取收货单明细失败');
      }
    } catch (error) {
      console.error('获取收货单明细失败:', error);
      message.error('获取收货单明细失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleReceiptItemChange = (key, field, value) => {
    setReceiptItems((prev) => prev.map((item) => {
      if (item.key !== key) {
        return item;
      }
      return {
        ...item,
        [field]: field === 'productionDate' || field === 'expiryDate' ? normalizeDateInput(value) : value,
      };
    }));
  };

  // 将收货单明细添加到待提交列表
  const handleAddToPending = () => {
    if (!selectedReceipt) {
      message.warning('请选择收货单');
      return;
    }
    if (receiptItems.length === 0) {
      message.warning('当前收货单没有可入库明细');
      return;
    }
    const invalidItem = receiptItems.find((item) => !item.batchNumber || !item.productionDate || !item.expiryDate || item.stockInQuantity == null || item.stockInQuantity === '' || Number(item.stockInQuantity) <= 0);
    if (invalidItem) {
      message.error(`请补全 ${invalidItem.materialName} 的批号、生产日期、失效日期和入库数量`);
      return;
    }
    // 检查是否已添加过同一收货单
    const existingReceiptIds = pendingStockInItems.map(item => item._receiptId);
    if (existingReceiptIds.includes(selectedReceipt.id)) {
      message.warning('该收货单已在待提交列表中');
      return;
    }
    const newItems = receiptItems.map((item, index) => ({
      ...item,
      _pendingKey: `${selectedReceipt.id}_${index}_${Date.now()}`,
      _receiptId: selectedReceipt.id,
      _receiptNumber: selectedReceipt.receiptNumber,
      _receiptObj: selectedReceipt,
    }));
    setPendingStockInItems(prev => [...prev, ...newItems]);
    setCreateModalVisible(false);
    setSelectedReceipt(null);
    setReceiptItems([]);
    message.success('已添加到待提交入库列表');
  };

  // 确认提交入库
  const handleConfirmStockIn = () => {
    if (selectedPendingKeys.length === 0) {
      message.warning('请先勾选要提交的入库明细');
      return;
    }
    if (submitting) return;
    Modal.confirm({
      title: '确认提交入库',
      content: `确定要提交选中的 ${selectedPendingKeys.length} 项入库明细吗？提交后将自动生成入库单号。`,
      okText: '确认提交',
      cancelText: '取消',
      onOk: async () => {
        try {
          setSubmitting(true);
          setLoading(true);
          // 按收货单分组
          const selectedItems = pendingStockInItems.filter(item => selectedPendingKeys.includes(item._pendingKey));
          const groupedByReceipt = {};
          for (const item of selectedItems) {
            const receiptId = item._receiptId;
            if (!groupedByReceipt[receiptId]) {
              groupedByReceipt[receiptId] = { receipt: item._receiptObj, items: [] };
            }
            groupedByReceipt[receiptId].items.push(item);
          }
          let successCount = 0;
          let failCount = 0;
          for (const [receiptId, group] of Object.entries(groupedByReceipt)) {
            try {
              const stockInData = {
                stockInType: '采购入库',
                operatorName: getCurrentUserName(),
                remark: `采购收货单 ${group.receipt.receiptNumber} 入库`,
                items: group.items.map((item) => ({
                  receiveItemId: item.receiveItemId,
                  materialId: item.materialId,
                  materialCode: item.materialCode,
                  materialName: item.materialName,
                  materialType: item.materialType,
                  specification: item.specification,
                  model: item.model,
                  minPackage: item.minPackage,
                  unit: item.unit,
                  supplierName: item.supplierName,
                  manufacturer: item.manufacturer,
                  registrationNumber: item.registrationNumber,
                  batchNumber: item.batchNumber,
                  productionDate: normalizeDateInput(item.productionDate),
                  expiryDate: normalizeDateInput(item.expiryDate),
                  purchasePrice: item.purchasePrice,
                  orderQuantity: item.orderQuantity,
                  stockInQuantity: item.stockInQuantity,
                  remark: item.remark,
                }))
              };
              const response = await api.post(`/api/scm/stock-in/receipts/${receiptId}`, stockInData);
              if (response.code === 1) {
                successCount++;
              } else {
                failCount++;
                message.error(response.message || `收货单 ${group.receipt.receiptNumber} 入库失败`);
              }
            } catch (error) {
              failCount++;
              console.error('入库失败:', error);
            }
          }
          if (successCount > 0) {
            message.success(`成功提交 ${successCount} 个入库单${failCount > 0 ? `，${failCount} 个失败` : ''}`);
            // 移除已提交的项
            setPendingStockInItems(prev => prev.filter(item => !selectedPendingKeys.includes(item._pendingKey)));
            setSelectedPendingKeys([]);
            // 刷新入库单列表
            refreshStockInOrders();
          } else {
            message.error('入库提交全部失败');
          }
        } catch (error) {
          console.error('提交入库失败:', error);
          message.error('提交入库失败');
        } finally {
          setSubmitting(false);
          setLoading(false);
        }
      }
    });
  };

  // 刷新入库单列表
  const refreshStockInOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/scm/stock-in/orders', { page: 1, size: 100 });
      if (response.code === 1 && response.data) {
        const list = response.data.records.map((item, index) => ({
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
        setData(list);
        setFilteredData(list);
        setPagination(prev => ({ ...prev, total: response.data.total }));
      }
    } catch (error) {
      console.error('刷新入库数据失败:', error);
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

        {/* 数据表格 - 已提交入库单 */}
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

      {/* 待提交入库明细区域 */}
      {pendingStockInItems.length > 0 && (
        <Card title="待提交入库明细" bordered={false} style={{ marginTop: 16 }}>
          <Table
            rowKey="_pendingKey"
            dataSource={pendingStockInItems}
            rowSelection={{
              selectedRowKeys: selectedPendingKeys,
              onChange: (keys) => setSelectedPendingKeys(keys),
            }}
            pagination={false}
            scroll={{ x: 1600 }}
            columns={[
              { title: '收货单号', dataIndex: '_receiptNumber', key: '_receiptNumber', width: 140 },
              { title: '物资编码', dataIndex: 'materialCode', key: 'materialCode', width: 120 },
              { title: '物资名称', dataIndex: 'materialName', key: 'materialName', width: 150 },
              { title: '规格', dataIndex: 'specification', key: 'specification', width: 120 },
              { title: '型号', dataIndex: 'model', key: 'model', width: 100 },
              { title: '单位', dataIndex: 'unit', key: 'unit', width: 70 },
              { title: '入库数量', dataIndex: 'stockInQuantity', key: 'stockInQuantity', width: 100 },
              { title: '批号', dataIndex: 'batchNumber', key: 'batchNumber', width: 120 },
              { title: '生产日期', dataIndex: 'productionDate', key: 'productionDate', width: 110 },
              { title: '失效日期', dataIndex: 'expiryDate', key: 'expiryDate', width: 110 },
              { title: '供应商', dataIndex: 'supplierName', key: 'supplierName', width: 150 },
              {
                title: '操作',
                key: 'action',
                width: 80,
                render: (_, record) => (
                  <Button type="link" danger size="small" onClick={() => {
                    setPendingStockInItems(prev => prev.filter(item => item._pendingKey !== record._pendingKey));
                    setSelectedPendingKeys(prev => prev.filter(k => k !== record._pendingKey));
                  }}>
                    移除
                  </Button>
                ),
              },
            ]}
          />
          <Row style={{ marginTop: 16 }} justify="end">
            <Col>
              <Button 
                type="primary" 
                disabled={selectedPendingKeys.length === 0 || submitting}
                loading={submitting}
                onClick={handleConfirmStockIn}
              >
                确认提交入库（{selectedPendingKeys.length}/{pendingStockInItems.length}）
              </Button>
            </Col>
          </Row>
        </Card>
      )}

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
          <Button key="create" type="primary" onClick={handleAddToPending} loading={loading}>
            添加到待提交列表
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
                  handleSelectReceipt(receipt);
                } else {
                  setSelectedReceipt(null);
                  setReceiptItems([]);
                }
              },
            }}
            pagination={{
              pageSize: 10,
              showTotal: (total) => `共 ${total} 条记录`,
            }}
            loading={loading}
          />

          {selectedReceipt && (
            <div style={{ marginTop: 16 }}>
              <h3>录入入库明细</h3>
              <Table
                rowKey="key"
                loading={loading}
                dataSource={receiptItems}
                pagination={false}
                scroll={{ x: 1800 }}
                columns={[
                  { title: '物资编码', dataIndex: 'materialCode', key: 'materialCode', width: 120 },
                  { title: '物资名称', dataIndex: 'materialName', key: 'materialName', width: 160 },
                  { title: '规格', dataIndex: 'specification', key: 'specification', width: 140 },
                  { title: '型号', dataIndex: 'model', key: 'model', width: 140 },
                  { title: '单位', dataIndex: 'unit', key: 'unit', width: 80 },
                  { title: '待入库数量', dataIndex: 'stockInQuantity', key: 'stockInQuantityDisplay', width: 110 },
                  {
                    title: '批号',
                    key: 'batchNumber',
                    width: 140,
                    render: (_, record) => (
                      <Input value={record.batchNumber} onChange={(e) => handleReceiptItemChange(record.key, 'batchNumber', e.target.value)} placeholder="请输入批号" />
                    )
                  },
                  {
                    title: '生产日期',
                    key: 'productionDate',
                    width: 140,
                    render: (_, record) => (
                      <Input value={record.productionDate} onChange={(e) => handleReceiptItemChange(record.key, 'productionDate', e.target.value)} placeholder="支持 20250127" />
                    )
                  },
                  {
                    title: '失效日期',
                    key: 'expiryDate',
                    width: 140,
                    render: (_, record) => (
                      <Input value={record.expiryDate} onChange={(e) => handleReceiptItemChange(record.key, 'expiryDate', e.target.value)} placeholder="支持 20250127" />
                    )
                  },
                  {
                    title: '入库数量',
                    key: 'stockInQuantityEdit',
                    width: 120,
                    render: (_, record) => (
                      <Input
                        value={record.stockInQuantity}
                        onChange={(e) => handleReceiptItemChange(record.key, 'stockInQuantity', Number(e.target.value) || 0)}
                        placeholder="请输入入库数量"
                      />
                    )
                  },
                  {
                    title: '备注',
                    key: 'remark',
                    width: 180,
                    render: (_, record) => (
                      <Input value={record.remark} onChange={(e) => handleReceiptItemChange(record.key, 'remark', e.target.value)} placeholder="可选" />
                    )
                  },
                ]}
              />
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default StockInAccept;