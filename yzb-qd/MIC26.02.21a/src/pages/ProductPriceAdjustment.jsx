import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Input, Space, Select, Row, Col, Tag, Modal, Form, InputNumber, message, DatePicker, Divider, Alert, Descriptions } from 'antd';
import { PlusOutlined, EditOutlined, SearchOutlined, DollarOutlined, SwapOutlined, CalculatorOutlined } from '@ant-design/icons';

const { Option } = Select;
const { RangePicker } = DatePicker;

const ProductPriceAdjustment = () => {
  const [searchParams, setSearchParams] = useState({
    materialCode: '',
    name: '',
    supplier: '',
  });

  const [adjustModalVisible, setAdjustModalVisible] = useState(false);
  const [historyModalVisible, setHistoryModalVisible] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [form] = Form.useForm();
  const [adjustmentMethod, setAdjustmentMethod] = useState('fixed');
  const [pricePreview, setPricePreview] = useState({});

  const [products, setProducts] = useState([
    {
      key: '1',
      materialCode: 'YZS-001',
      name: '一次性注射器',
      specification: '10ml',
      model: 'SYR-10',
      supplier: '山东威高集团',
      currentPrice: 0.85,
      costPrice: 0.45,
    },
    {
      key: '2',
      materialCode: 'YZS-002',
      name: '输液器',
      specification: '500ml',
      model: 'IV-500',
      supplier: '山东威高集团',
      currentPrice: 4.50,
      costPrice: 2.80,
    },
    {
      key: '3',
      materialCode: 'YZS-003',
      name: '医用棉签',
      specification: '100支/包',
      model: 'QJ-100',
      supplier: '稳健医疗用品',
      currentPrice: 2.00,
      costPrice: 1.20,
    },
    {
      key: '4',
      materialCode: 'YZS-004',
      name: '酒精棉球',
      specification: '50g/瓶',
      model: 'JQ-50',
      supplier: '稳健医疗用品',
      currentPrice: 3.50,
      costPrice: 2.00,
    },
    {
      key: '5',
      materialCode: 'YLQ-001',
      name: '碘伏消毒液',
      specification: '500ml',
      model: 'DF-500',
      supplier: '利尔康消毒科技',
      currentPrice: 12.00,
      costPrice: 7.50,
    },
  ]);

  const [priceHistory, setPriceHistory] = useState([
    { key: '1', materialCode: 'YZS-001', name: '一次性注射器', oldPrice: 0.80, newPrice: 0.85, adjustmentType: 'increase', adjustmentAmount: 0.05, adjustmentPercent: 6.25, adjustedBy: '张三', adjustedAt: '2024-01-15 10:30:00', reason: '成本上涨' },
    { key: '2', materialCode: 'YZS-002', name: '输液器', oldPrice: 4.50, newPrice: 4.20, adjustmentType: 'decrease', adjustmentAmount: -0.30, adjustmentPercent: -6.67, adjustedBy: '李四', adjustedAt: '2024-01-14 14:20:00', reason: '促销活动' },
    { key: '3', materialCode: 'YLQ-001', name: '碘伏消毒液', oldPrice: 10.00, newPrice: 12.00, adjustmentType: 'increase', adjustmentAmount: 2.00, adjustmentPercent: 20.00, adjustedBy: '王五', adjustedAt: '2024-01-10 09:15:00', reason: '库存清理' },
  ]);

  const [editingProduct, setEditingProduct] = useState(null);

  const columns = [
    {
      title: '商品编码',
      dataIndex: 'materialCode',
      key: 'materialCode',
      width: 120,
      fixed: 'left',
    },
    {
      title: '商品名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
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
      title: '供应商',
      dataIndex: 'supplier',
      key: 'supplier',
      width: 150,
    },
    {
      title: '当前售价',
      dataIndex: 'currentPrice',
      key: 'currentPrice',
      width: 100,
      render: (price) => `¥${price.toFixed(2)}`,
    },
    {
      title: '成本价',
      dataIndex: 'costPrice',
      key: 'costPrice',
      width: 100,
      render: (price) => `¥${price.toFixed(2)}`,
    },
    {
      title: '毛利率',
      key: 'grossMargin',
      width: 100,
      render: (_, record) => {
        const margin = ((record.currentPrice - record.costPrice) / record.currentPrice * 100).toFixed(2);
        return <Tag color={margin >= 20 ? 'green' : margin >= 10 ? 'orange' : 'red'}>{margin}%</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEditPrice(record)}
          >
            调价
          </Button>
        </Space>
      ),
    },
  ];

  const historyColumns = [
    {
      title: '商品编码',
      dataIndex: 'materialCode',
      key: 'materialCode',
      width: 120,
    },
    {
      title: '商品名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: '原价',
      dataIndex: 'oldPrice',
      key: 'oldPrice',
      width: 100,
      render: (price) => `¥${price.toFixed(2)}`,
    },
    {
      title: '新价',
      dataIndex: 'newPrice',
      key: 'newPrice',
      width: 100,
      render: (price) => `¥${price.toFixed(2)}`,
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
      title: '调整金额',
      dataIndex: 'adjustmentAmount',
      key: 'adjustmentAmount',
      width: 100,
      render: (amount) => (
        <span style={{ color: amount >= 0 ? '#52c41a' : '#ff4d4f' }}>
          {amount >= 0 ? '+' : ''}{amount.toFixed(2)}
        </span>
      ),
    },
    {
      title: '调整幅度',
      dataIndex: 'adjustmentPercent',
      key: 'adjustmentPercent',
      width: 100,
      render: (percent) => (
        <span style={{ color: percent >= 0 ? '#52c41a' : '#ff4d4f' }}>
          {percent >= 0 ? '+' : ''}{percent.toFixed(2)}%
        </span>
      ),
    },
    {
      title: '调整人',
      dataIndex: 'adjustedBy',
      key: 'adjustedBy',
      width: 80,
    },
    {
      title: '调整时间',
      dataIndex: 'adjustedAt',
      key: 'adjustedAt',
      width: 150,
    },
    {
      title: '调整原因',
      dataIndex: 'reason',
      key: 'reason',
      width: 120,
    },
  ];

  const rowSelection = {
    onChange: (selectedRowKeys) => {
      setSelectedProducts(selectedRowKeys);
    },
  };

  const handleEditPrice = (record) => {
    setEditingProduct(record);
    setAdjustmentMethod('fixed');
    form.setFieldsValue({
      materialCode: record.materialCode,
      name: record.name,
      currentPrice: record.currentPrice,
      fixedPrice: record.currentPrice,
      percentageValue: 0,
      increaseValue: 0,
      decreaseValue: 0,
      reason: '',
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

  const handleAdjustOk = () => {
    const values = form.getFieldsValue();
    
    const { newPrice } = pricePreview;
    const currentPrice = editingProduct.currentPrice;
    const adjustmentAmount = newPrice - currentPrice;
    const adjustmentPercent = currentPrice > 0 ? (adjustmentAmount / currentPrice * 100).toFixed(2) : '0.00';

    const updatedProducts = products.map(p => {
      if (p.key === editingProduct.key) {
        return { ...p, currentPrice: parseFloat(newPrice.toFixed(2)) };
      }
      return p;
    });
    setProducts(updatedProducts);

    const newHistory = {
      key: Date.now().toString(),
      materialCode: editingProduct.materialCode,
      name: editingProduct.name,
      oldPrice: currentPrice,
      newPrice: parseFloat(newPrice.toFixed(2)),
      adjustmentType: adjustmentAmount >= 0 ? 'increase' : 'decrease',
      adjustmentAmount: parseFloat(adjustmentAmount.toFixed(2)),
      adjustmentPercent: parseFloat(adjustmentPercent),
      adjustedBy: '当前用户',
      adjustedAt: new Date().toLocaleString(),
      reason: values.reason || '手动调整',
    };
    setPriceHistory([newHistory, ...priceHistory]);

    setAdjustModalVisible(false);
    message.success('调价成功');
  };

  const handleSearch = () => {
    message.loading('正在搜索...', 0.5);
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


        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={6}>
            <Input
              placeholder="商品编码"
              prefix={<SearchOutlined />}
              value={searchParams.materialCode}
              onChange={(e) => setSearchParams({ ...searchParams, materialCode: e.target.value })}
            />
          </Col>
          <Col span={6}>
            <Input
              placeholder="商品名称"
              prefix={<SearchOutlined />}
              value={searchParams.name}
              onChange={(e) => setSearchParams({ ...searchParams, name: e.target.value })}
            />
          </Col>
          <Col span={6}>
            <Select
              placeholder="供应商"
              style={{ width: '100%' }}
              value={searchParams.supplier}
              onChange={(value) => setSearchParams({ ...searchParams, supplier: value })}
              allowClear
            >
              <Option value="山东威高集团">山东威高集团</Option>
              <Option value="稳健医疗用品">稳健医疗用品</Option>
              <Option value="利尔康消毒科技">利尔康消毒科技</Option>
            </Select>
          </Col>
          <Col span={6}>
            <Space>
              <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
                搜索
              </Button>
              <Button onClick={() => setSearchParams({ materialCode: '', name: '', supplier: '' })}>
                重置
              </Button>
            </Space>
          </Col>
        </Row>

        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={products}
          scroll={{ x: 1200 }}
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
              <Descriptions column={2} size="small" bordered>
                <Descriptions.Item label="当前售价">
                  <span style={{ color: '#1890ff', fontWeight: 'bold' }}>¥{editingProduct?.currentPrice?.toFixed(2)}</span>
                </Descriptions.Item>
                <Descriptions.Item label="成本价">
                  <span>¥{editingProduct?.costPrice?.toFixed(2)}</span>
                </Descriptions.Item>
                <Descriptions.Item label="调整后售价">
                  <span style={{ 
                    color: pricePreview.adjustmentAmount >= 0 ? '#52c41a' : '#ff4d4f', 
                    fontWeight: 'bold',
                    fontSize: 16
                  }}>¥{pricePreview.newPrice?.toFixed(2)}</span>
                </Descriptions.Item>
                <Descriptions.Item label="调整后毛利率">
                  <Tag color={parseFloat(pricePreview.newMargin) >= 20 ? 'green' : parseFloat(pricePreview.newMargin) >= 10 ? 'orange' : 'red'}>
                    {pricePreview.newMargin}%
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="调整金额">
                  <span style={{ color: pricePreview.adjustmentAmount >= 0 ? '#52c41a' : '#ff4d4f' }}>
                    {pricePreview.adjustmentAmount >= 0 ? '+' : ''}{pricePreview.adjustmentAmount?.toFixed(2)}
                  </span>
                </Descriptions.Item>
                <Descriptions.Item label="调整幅度">
                  <span style={{ color: pricePreview.adjustmentPercent >= 0 ? '#52c41a' : '#ff4d4f' }}>
                    {pricePreview.adjustmentPercent >= 0 ? '+' : ''}{pricePreview.adjustmentPercent?.toFixed(2)}%
                  </span>
                </Descriptions.Item>
              </Descriptions>
            }
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />

          <Form.Item label="调价方式" required>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Select 
                value={adjustmentMethod} 
                onChange={(value) => {
                  setAdjustmentMethod(value);
                  calculatePreview();
                }}
                style={{ width: '100%' }}
              >
                <Option value="fixed">固定售价 - 直接输入新售价</Option>
                <Option value="percentage">百分比调整 - 按比例上调或下调</Option>
                <Option value="increase">金额上调 - 在当前基础上增加金额</Option>
                <Option value="decrease">金额下调 - 在当前基础上减少金额</Option>
              </Select>

              {adjustmentMethod === 'fixed' && (
                <Form.Item name="fixedPrice" label="新售价" rules={[{ required: true, message: '请输入新售价' }]}>
                  <InputNumber
                    prefix="¥"
                    style={{ width: '100%' }}
                    min={0}
                    precision={2}
                    onChange={calculatePreview}
                    placeholder="请输入调整后的售价"
                  />
                </Form.Item>
              )}

              {adjustmentMethod === 'percentage' && (
                <Row gutter={16}>
                  <Col span={16}>
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
                  </Col>
                  <Col span={8}>
                    <Form.Item label="示例">
                      <Tag color={form.getFieldValue('percentageValue') > 0 ? 'green' : form.getFieldValue('percentageValue') < 0 ? 'red' : 'default'}>
                        {form.getFieldValue('percentageValue') || 0}% = ¥{((editingProduct?.currentPrice || 0) * (1 + (form.getFieldValue('percentageValue') || 0) / 100)).toFixed(2)}
                      </Tag>
                    </Form.Item>
                  </Col>
                </Row>
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
            </Space>
          </Form.Item>

          <Divider />

          <Form.Item name="reason" label="调价原因" rules={[{ required: true, message: '请输入调价原因' }]}>
            <Select
              placeholder="请选择调价原因"
              onChange={(value) => form.setFieldsValue({ reason: value })}
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
          scroll={{ x: 1200 }}
          size="small"
        />
      </Modal>
    </div>
  );
};

export default ProductPriceAdjustment;
