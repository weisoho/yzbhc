import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Input, Space, Select, Row, Col, Tag, Modal, Form, InputNumber, message, DatePicker, Divider, Alert, Descriptions } from 'antd';
import { PlusOutlined, EditOutlined, SearchOutlined, DollarOutlined, SwapOutlined, CalculatorOutlined } from '@ant-design/icons';
import api from '../utils/api.js';

const { Option } = Select;
const { RangePicker } = DatePicker;

const ProductPriceAdjustment = () => {
  const [searchParams, setSearchParams] = useState({
    materialCode: '',
    name: '',
    supplier: '',
    manufacturer: '',
  });

  const [adjustModalVisible, setAdjustModalVisible] = useState(false);
  const [historyModalVisible, setHistoryModalVisible] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [form] = Form.useForm();
  const [adjustmentMethod, setAdjustmentMethod] = useState('fixed');
  const [pricePreview, setPricePreview] = useState({});
  const [showOtherReasonInput, setShowOtherReasonInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const [products, setProducts] = useState([]);

  const [priceHistory, setPriceHistory] = useState([]);

  const [editingProduct, setEditingProduct] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyCurrentPage, setHistoryCurrentPage] = useState(1);
  const [historyPageSize, setHistoryPageSize] = useState(10);
  const [historyTotal, setHistoryTotal] = useState(0);

  // 加载物资调价数据
  const loadProducts = async () => {
    try {
      setLoading(true);
      // 构建查询参数
      const params = {
        materialCode: searchParams.materialCode,
        name: searchParams.name,
        supplier: searchParams.supplier,
        manufacturer: searchParams.manufacturer,
        pageNum: currentPage,
        pageSize: pageSize
      };
      const response = await api.get('/api/scm/product-price-adjustment', params);
      if (response.code === 1 && response.data) {
        // 转换数据格式以匹配前端需求
        const productList = response.data.records.map(product => ({
          key: product.productId, // 使用 productId 作为 key
          materialCode: product.materialCode,
          name: product.name,
          materialType: product.materialType,
          specification: product.specification,
          model: product.model,
          minPackage: product.minPackage,
          unit: product.unit,
          purchasePrice: product.purchasePrice,
          registrationNumber: product.registrationNumber,
          supplier: product.supplier,
          manufacturer: product.manufacturer,
          adjustmentReason: product.adjustmentReason,
          currentPrice: product.currentPrice,
          costPrice: product.costPrice
        }));
        setProducts(productList);
        setTotal(response.data.total);
      } else {
        message.error(response.message || '加载物资调价数据失败');
      }
    } catch (error) {
      console.error('加载物资调价数据失败:', error);
      message.error('加载物资调价数据失败');
    } finally {
      setLoading(false);
    }
  };

  // 组件加载时获取物资调价数据
  useEffect(() => {
    loadProducts();
  }, [currentPage, pageSize]);

  // 加载调价历史数据
  const loadPriceHistory = async () => {
    try {
      setHistoryLoading(true);
      // 构建查询参数
      const params = {
        pageNum: historyCurrentPage,
        pageSize: historyPageSize
      };
      const response = await api.get('/api/scm/product-price-adjustment/history', params);
      if (response.code === 1 && response.data) {
        // 转换数据格式以匹配前端需求
        const historyList = response.data.records.map(history => ({
          key: history.id,
          materialCode: history.materialCode,
          name: history.name,
          materialType: history.materialType,
          oldPrice: history.oldPrice,
          newPrice: history.newPrice,
          adjustmentType: history.adjustmentAmount >= 0 ? 'increase' : 'decrease',
          adjustmentAmount: history.adjustmentAmount,
          adjustmentPercent: history.adjustmentPercent,
          adjustedBy: history.adjustedBy,
          adjustedAt: history.adjustedAt,
          reason: history.adjustmentReason
        }));
        setPriceHistory(historyList);
        setHistoryTotal(response.data.total);
      } else {
        message.error(response.message || '加载调价历史失败');
      }
    } catch (error) {
      console.error('加载调价历史失败:', error);
      message.error('加载调价历史失败，请检查网络连接或联系管理员');
    } finally {
      setHistoryLoading(false);
    }
  };

  // 打开历史模态框时加载历史数据
  useEffect(() => {
    if (historyModalVisible) {
      loadPriceHistory();
    }
  }, [historyModalVisible, historyCurrentPage, historyPageSize]);

  const columns = [
    {
      title: '序号',
      key: 'index',
      width: 60,
      fixed: 'left',
      render: (text, record, index) => index + 1
    },
    {
      title: '物资编码',
      dataIndex: 'materialCode',
      key: 'materialCode',
      width: 120,
      fixed: 'left',
    },
    {
      title: '物资名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: '物资类型',
      dataIndex: 'materialType',
      key: 'materialType',
      width: 100,
    },
    {
      title: '规格',
      dataIndex: 'specification',
      key: 'specification',
      width: 120,
    },
    {
      title: '型号',
      dataIndex: 'model',
      key: 'model',
      width: 100,
    },
    {
      title: '最小包装',
      dataIndex: 'minPackage',
      key: 'minPackage',
      width: 120,
    },
    {
      title: '单位',
      dataIndex: 'unit',
      key: 'unit',
      width: 80,
    },
    {
      title: '注册证号',
      dataIndex: 'registrationNumber',
      key: 'registrationNumber',
      width: 180,
    },
    {
      title: '供应商',
      dataIndex: 'supplier',
      key: 'supplier',
      width: 150,
    },
    {
      title: '生产厂家',
      dataIndex: 'manufacturer',
      key: 'manufacturer',
      width: 200,
    },
    {
      title: '调价原因',
      dataIndex: 'adjustmentReason',
      key: 'adjustmentReason',
      width: 150,
    },
    {
      title: '原采购价',
      dataIndex: 'purchasePrice',
      key: 'purchasePrice',
      width: 100,
      render: (price) => price != null ? `¥${Number(price).toFixed(2)}` : '-',
    },
    {
      title: '现采购价',
      dataIndex: 'currentPrice',
      key: 'currentPrice',
      width: 100,
      render: (price) => price != null ? `¥${Number(price).toFixed(2)}` : '-',
    },
  ];

  const historyColumns = [
    {
      title: '序号',
      key: 'index',
      width: 60,
      render: (text, record, index) => index + 1
    },
    {
      title: '物资编码',
      dataIndex: 'materialCode',
      key: 'materialCode',
      width: 120,
    },
    {
      title: '物资名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: '物资类型',
      dataIndex: 'materialType',
      key: 'materialType',
      width: 100,
    },
    {
      title: '调整类型',
      dataIndex: 'adjustmentType',
      key: 'adjustmentType',
      width: 100,
      render: (type) => (
        <Tag color={type === 'increase' ? 'green' : type === 'decrease' ? 'red' : 'blue'}>
          {type === 'increase' ? '涨价' : type === 'decrease' ? '降价' : '批量调整'}
        </Tag>
      ),
    },
    {
      title: '原采购价',
      dataIndex: 'oldPrice',
      key: 'oldPrice',
      width: 100,
      render: (price) => price != null ? `¥${Number(price).toFixed(2)}` : '-',
    },
    {
      title: '现采购价',
      dataIndex: 'newPrice',
      key: 'newPrice',
      width: 100,
      render: (price) => price != null ? `¥${Number(price).toFixed(2)}` : '-',
    },
    {
      title: '调价原因',
      dataIndex: 'reason',
      key: 'reason',
      width: 120,
    },
    {
      title: '操作人',
      dataIndex: 'adjustedBy',
      key: 'adjustedBy',
      width: 80,
    },
    {
      title: '操作日期',
      dataIndex: 'adjustedAt',
      key: 'adjustedAt',
      width: 150,
    },
  ];

  const rowSelection = {
    selectedRowKeys: selectedProducts,
    onChange: (selectedRowKeys) => {
      setSelectedProducts(selectedRowKeys);
    },
  };

  const handleEditPrice = (record) => {
    setEditingProduct(record);
    setAdjustmentMethod('fixed');
    setShowOtherReasonInput(false);
    form.setFieldsValue({
      materialCode: record.materialCode,
      name: record.name,
      currentPrice: record.currentPrice,
      fixedPrice: record.currentPrice,
      percentageValue: 0,
      increaseValue: 0,
      decreaseValue: 0,
      reason: '',
      otherReason: '',
    });
    setPricePreview({
      newPrice: record.currentPrice,
      adjustmentAmount: 0,
      adjustmentPercent: 0,
      newMargin: ((record.currentPrice - record.costPrice) / record.currentPrice * 100).toFixed(2),
    });
    setAdjustModalVisible(true);
  };

  const calculatePreview = () => {
    const values = form.getFieldsValue();
    const currentPrice = editingProduct?.currentPrice || 0;
    const costPrice = editingProduct?.costPrice || 0;
    let newPrice = currentPrice;

    switch (adjustmentMethod) {
      case 'fixed':
        newPrice = values.fixedPrice || currentPrice;
        break;
      case 'percentage':
        newPrice = currentPrice * (1 + (values.percentageValue || 0) / 100);
        break;
      case 'increase':
        newPrice = currentPrice + (values.increaseValue || 0);
        break;
      case 'decrease':
        newPrice = Math.max(0, currentPrice - (values.decreaseValue || 0));
        break;
      default:
        newPrice = currentPrice;
    }

    newPrice = Math.max(0, newPrice);
    const adjustmentAmount = newPrice - currentPrice;
    const adjustmentPercent = currentPrice > 0 ? (adjustmentAmount / currentPrice * 100) : 0;
    const newMargin = newPrice > 0 ? ((newPrice - costPrice) / newPrice * 100) : 0;

    setPricePreview({
      newPrice,
      adjustmentAmount,
      adjustmentPercent,
      newMargin: newMargin.toFixed(2),
    });
  };

  useEffect(() => {
    if (adjustModalVisible && editingProduct) {
      calculatePreview();
    }
  }, [adjustmentMethod, form]);

  const handleAdjustOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
      const { newPrice } = pricePreview;
      const currentPrice = editingProduct.currentPrice;
      const adjustmentAmount = newPrice - currentPrice;
      const adjustmentPercent = currentPrice > 0 ? (adjustmentAmount / currentPrice * 100).toFixed(2) : '0.00';

      // 处理调价原因
      let finalReason = values.reason || '手动调整';
      if (values.reason === '其他原因') {
        finalReason = `其他原因: ${values.otherReason.trim()}`;
      }

      // 构建调价数据
      const adjustmentData = {
        productId: editingProduct.key,
        oldPrice: currentPrice,
        newPrice: parseFloat(newPrice.toFixed(2)),
        adjustmentReason: finalReason,
        adjustmentAmount: parseFloat(adjustmentAmount.toFixed(2)),
        adjustmentPercent: parseFloat(adjustmentPercent)
      };

      // 调用API保存调价数据
      const response = await api.post('/api/scm/product-price-adjustment', adjustmentData);
      if (response.code === 1) {
        message.success('调价成功');
        // 重新加载数据
        await loadProducts();
      } else {
        message.error(response.message || '调价失败');
      }

      setAdjustModalVisible(false);
      setShowOtherReasonInput(false);
    } catch (error) {
      if (error?.errorFields) {
        return;
      }
      console.error('调价失败:', error);
      message.error('调价失败，请检查网络连接或联系管理员');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1); // 重置为第一页
    loadProducts();
  };



  return (
    <div style={{ padding: '8px' }}>
      <Card
        title="物资调价"
        extra={
          <Space>
            <Button type="primary" icon={<DollarOutlined />} onClick={() => setHistoryModalVisible(true)}>
              调价历史
            </Button>
          </Space>
        }
      >


        <div style={{ marginBottom: 16, padding: '16px', border: '1px solid #e8e8e8', borderRadius: '4px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ whiteSpace: 'nowrap' }}>物资编码：</span>
                <Input
                  placeholder="请输入物资编码"
                  value={searchParams.materialCode}
                  style={{ width: 180 }}
                  onChange={(e) => setSearchParams({ ...searchParams, materialCode: e.target.value })}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ whiteSpace: 'nowrap' }}>物资名称：</span>
                <Input
                  placeholder="请输入物资名称"
                  value={searchParams.name}
                  style={{ width: 180 }}
                  onChange={(e) => setSearchParams({ ...searchParams, name: e.target.value })}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ whiteSpace: 'nowrap' }}>供应商：</span>
                <Input
                  placeholder="请输入供应商名称进行模糊查询"
                  style={{ width: 180 }}
                  value={searchParams.supplier}
                  onChange={(e) => setSearchParams({ ...searchParams, supplier: e.target.value })}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ whiteSpace: 'nowrap' }}>生产厂家：</span>
                <Input
                  placeholder="请输入生产厂家"
                  value={searchParams.manufacturer}
                  style={{ width: 180 }}
                  onChange={(e) => setSearchParams({ ...searchParams, manufacturer: e.target.value })}
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
                搜索
              </Button>
              <Button onClick={() => setSearchParams({ materialCode: '', name: '', supplier: '', manufacturer: '' })}>
                重置
              </Button>
              <Button type="primary" icon={<EditOutlined />} onClick={() => {
                if (selectedProducts.length === 0) {
                  message.warning('请先选择要调价的物资');
                  return;
                }
                // 打开调价模态框，使用第一个选中的物资作为示例
                const selectedProduct = products.find(p => p.key === selectedProducts[0]);
                if (selectedProduct) {
                  handleEditPrice(selectedProduct);
                }
              }}>
                调价
              </Button>
            </div>
          </div>
        </div>

        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={products}
          loading={loading}
          pagination={{
            pageSize: pageSize,
            current: currentPage,
            total: total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
            onChange: async (page, size) => {
              setCurrentPage(page);
              setPageSize(size);
              setSelectedProducts([]);
            },
            style: {
              display: 'flex',
              justifyContent: 'center',
              marginTop: '16px'
            }
          }}
          scroll={{ x: 2000 }}
          size="small"
        />
      </Card>

      <Modal
        title={<><CalculatorOutlined /> 物资调价</>}
        open={adjustModalVisible}
        onOk={handleAdjustOk}
        onCancel={() => setAdjustModalVisible(false)}
        width={680}
        okText="确认调价"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Alert
            message="调价预览"
            description={
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <span>原采购价：</span>
                  <span style={{ color: '#1890ff', fontWeight: 'bold' }}>¥{editingProduct?.purchasePrice?.toFixed(2)}</span>
                </div>
                <div>
                  <span>现采购价：</span>
                  <span style={{ 
                    color: pricePreview.adjustmentAmount >= 0 ? '#52c41a' : '#ff4d4f', 
                    fontWeight: 'bold',
                    fontSize: 16
                  }}>¥{pricePreview.newPrice?.toFixed(2)}</span>
                </div>
              </div>
            }
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />

          <Form.Item label="调价方式" required>
            <Select 
              value={adjustmentMethod} 
              onChange={(value) => {
                setAdjustmentMethod(value);
                calculatePreview();
              }}
              style={{ width: '100%' }}
            >
              <Option value="fixed">固定售价 - 直接输入现采购价</Option>
              <Option value="percentage">百分比调整 - 按比例上调或下调</Option>
              <Option value="increase">金额上调 - 在当前基础上增加金额</Option>
              <Option value="decrease">金额下调 - 在当前基础上减少金额</Option>
            </Select>
          </Form.Item>

          {adjustmentMethod === 'fixed' && (
            <Form.Item name="fixedPrice" label="现采购价" rules={[{ required: true, message: '请输入现采购价' }]}>
              <InputNumber
                prefix="¥"
                style={{ width: '100%' }}
                min={0}
                precision={2}
                onChange={calculatePreview}
                placeholder="请输入调整后的现采购价"
              />
            </Form.Item>
          )}

          {adjustmentMethod === 'percentage' && (
            <Form.Item name="percentageValue" label="调整比例" rules={[{ required: true, message: '请输入调整比例' }]}>
              <InputNumber
                style={{ width: '100%' }}
                min={-100}
                max={1000}
                precision={2}
                addonAfter="%"
                onChange={calculatePreview}
                placeholder="正数为上调，负数为下调"
              />
            </Form.Item>
          )}

          {adjustmentMethod === 'increase' && (
            <Form.Item name="increaseValue" label="上调金额" rules={[{ required: true, message: '请输入上调金额' }]}>
              <InputNumber
                prefix="¥"
                style={{ width: '100%' }}
                min={0}
                max={100000}
                precision={2}
                onChange={calculatePreview}
                placeholder="请输入要增加的金额"
              />
            </Form.Item>
          )}

          {adjustmentMethod === 'decrease' && (
            <Form.Item name="decreaseValue" label="下调金额" rules={[{ required: true, message: '请输入下调金额' }]}>
              <InputNumber
                prefix="¥"
                style={{ width: '100%' }}
                min={0}
                max={editingProduct?.currentPrice || 0}
                precision={2}
                onChange={calculatePreview}
                placeholder="请输入要减少的金额"
              />
            </Form.Item>
          )}

          <Divider />

          <Form.Item name="reason" label="调价原因" rules={[{ required: true, message: '请选择调价原因' }]}>
            <Select
              placeholder="请选择调价原因"
              style={{ width: '100%' }}
              onChange={(value) => {
                form.setFieldsValue({ reason: value });
                setShowOtherReasonInput(value === '其他原因');
                if (value !== '其他原因') {
                  form.setFieldsValue({ otherReason: '' });
                }
              }}
            >
              <Option value="成本上涨">成本上涨</Option>
              <Option value="市场竞争">市场竞争</Option>
              <Option value="促销活动">促销活动</Option>
              <Option value="库存清理">库存清理</Option>
              <Option value="新品上市">新品上市</Option>
              <Option value="渠道调整">渠道调整</Option>
              <Option value="其他原因">其他原因</Option>
            </Select>
          </Form.Item>
          {showOtherReasonInput && (
            <Form.Item
              name="otherReason"
              label="具体原因"
              rules={[
                { required: true, message: '请输入具体原因' },
                {
                  validator: (_, value) => {
                    if (!value || value.trim()) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('请输入具体原因'));
                  }
                }
              ]}
            >
              <Input placeholder="请输入具体的调价原因" />
            </Form.Item>
          )}
        </Form>
      </Modal>

      <Modal
        title="调价历史"
        open={historyModalVisible}
        onCancel={() => setHistoryModalVisible(false)}
        width={1200}
        footer={null}
      >
        <Table
          columns={historyColumns}
          dataSource={priceHistory}
          loading={historyLoading}
          pagination={{
            pageSize: historyPageSize,
            current: historyCurrentPage,
            total: historyTotal,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
            onChange: (page, size) => {
              setHistoryCurrentPage(page);
              setHistoryPageSize(size);
            }
          }}
          scroll={{ x: 1200 }}
          size="small"
        />
      </Modal>
    </div>
  );
};

export default ProductPriceAdjustment;
