import React, { useState } from 'react';
import { Card, Button, Table, Input, Space, Popconfirm, Select, Row, Col, Tag, Modal, Form, InputNumber, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, ExportOutlined } from '@ant-design/icons';
import { FORM_STYLES, getResponsiveColProps, getFormLayoutStyle, getModalConfig } from '../utils/formStyles';

const { Option } = Select;

const ProductCatalog = () => {
  const [searchParams, setSearchParams] = useState({
    materialCode: '',
    name: '',
    supplier: '',
    manufacturer: ''
  });

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form] = Form.useForm();
  const [addForm] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const [products, setProducts] = useState([
    {
      key: '1',
      materialCode: 'MIC100010',
      name: '医用检查手套',
      materialType: '医用耗材',
      specification: '未灭菌 无粉麻面特小号（XS）',
      model: '未灭菌 无粉麻面特小号（XS）',
      minPackage: '100只/盒',
      unit: '只',
      purchasePrice: '1.5',
      registrationNumber: '赣械备20170001号',
      supplier: '广州器化医疗设备有限公司',
      manufacturer: '江西云鸽橡胶有限公司',
      storageCondition: '常温',
      status: 'active'
    },
    {
      key: '2',
      materialCode: 'MIC100011',
      name: '25-羟基维生素D3标液',
      materialType: '试剂',
      specification: '4×1 mL(冻干品复溶体积)',
      model: '4×1 mL(冻干品复溶体积)',
      minPackage: '10盒/箱',
      unit: '盒',
      purchasePrice: '1200',
      registrationNumber: '国械注进2018242095',
      supplier: '广州市迪贤贸易有限公司',
      manufacturer: '罗氏诊断公司Roche Diagnostics GmbH',
      storageCondition: '冷藏',
      status: 'active'
    },
    {
      key: '3',
      materialCode: 'MIC100012',
      name: '肌红蛋白（MYO）测定试剂盒',
      materialType: '试剂',
      specification: '2×100 ml/份',
      model: '2×100 ml/份',
      minPackage: '10盒/箱',
      unit: '盒',
      purchasePrice: '850',
      registrationNumber: '粤械注准20152400846',
      supplier: '国药控股广州医疗供应链服务有限公司',
      manufacturer: '深圳迈瑞生物医疗电子股份有限公司',
      storageCondition: '冷藏',
      status: 'active'
    },
    {
      key: '4',
      materialCode: 'MIC100013',
      name: '梅毒螺旋体抗体（TP）试验（液体）标准物质',
      materialType: '标准物质',
      specification: '12-0.10A U/ml 0.5ml/管，20管/盒，GBW(E)090852',
      model: '12-0.10A U/ml 0.5ml/管，20管/盒，GBW(E)090852',
      minPackage: '5盒/箱',
      unit: '盒',
      purchasePrice: '2500',
      registrationNumber: '2017标准物质定值证书17452号',
      supplier: '广州为众生物科技有限公司',
      manufacturer: '中国计量科学研究院',
      storageCondition: '冷冻',
      status: 'active'
    },
    {
      key: '5',
      materialCode: 'MIC100014',
      name: '凝血质物',
      materialType: '试剂',
      specification: '水平2*12ml',
      model: '水平2*12ml',
      minPackage: '10盒/箱',
      unit: '盒',
      purchasePrice: '680',
      registrationNumber: '国械注进2017241752',
      supplier: '华润（广东）医学检验有限公司',
      manufacturer: '伯乐实验有限公司Bio-Rad Laboratories, Inc.',
      storageCondition: '冷藏',
      status: 'active'
    }
  ]);

  const columns = [
    { 
      title: '序号', 
      key: 'index', 
      width: 60, 
      fixed: 'left',
      render: (text, record, index) => index + 1
    },
    { title: '物资编码', dataIndex: 'materialCode', key: 'materialCode', width: 120 },
    { title: '物资名称', dataIndex: 'name', key: 'name', width: 150 },
    { title: '物资类型', dataIndex: 'materialType', key: 'materialType', width: 100 },
    { title: '规格', dataIndex: 'specification', key: 'specification', width: 150 },
    { title: '型号', dataIndex: 'model', key: 'model', width: 150 },
    { title: '最小包装', dataIndex: 'minPackage', key: 'minPackage', width: 120 },
    { title: '单位', dataIndex: 'unit', key: 'unit', width: 80 },
    { title: '采购价格', dataIndex: 'purchasePrice', key: 'purchasePrice', width: 100, render: (price) => `¥${price}` },
    { title: '注册证号', dataIndex: 'registrationNumber', key: 'registrationNumber', width: 180 },
    { title: '供应商', dataIndex: 'supplier', key: 'supplier', width: 150 },
    { title: '生产厂家', dataIndex: 'manufacturer', key: 'manufacturer', width: 200 },
    { title: '储存条件', dataIndex: 'storageCondition', key: 'storageCondition', width: 100 },
    { title: '状态', dataIndex: 'status', key: 'status', width: 80,
      render: (status) => {
        return status === 'active' ? 
          <Tag color="green">启用</Tag> : 
          <Tag color="red">停用</Tag>;
      }
    },
    { 
      title: '操作', 
      key: 'action',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => handleEdit(record)}><EditOutlined />编辑</a>
          <Popconfirm
            title="确定要删除这个商品吗？"
            onConfirm={() => handleDelete(record.key)}
            okText="确定"
            cancelText="取消"
          >
            <a style={{ color: 'red' }}><DeleteOutlined />删除</a>
          </Popconfirm>
        </Space>
      )
    },
  ];

  const handleEdit = (record) => {
    setEditingProduct(record);
    form.setFieldsValue({
      materialCode: record.materialCode,
      name: record.name,
      materialType: record.materialType,
      specification: record.specification,
      model: record.model,
      minPackage: record.minPackage,
      unit: record.unit,
      purchasePrice: record.purchasePrice,
      registrationNumber: record.registrationNumber,
      supplier: record.supplier,
      manufacturer: record.manufacturer,
      storageCondition: record.storageCondition,
      status: record.status
    });
    setEditModalVisible(true);
  };

  const handleDelete = (key) => {
    setProducts(products.filter(item => item.key !== key));
    setFilteredProducts(filteredProducts.filter(item => item.key !== key));
    message.success('删除成功');
  };

  const handleEditOk = async () => {
    try {
      const values = await form.validateFields();
      setProducts(products.map(item => 
        item.key === editingProduct.key 
          ? { ...item, ...values }
          : item
      ));
      setFilteredProducts(filteredProducts.map(item => 
        item.key === editingProduct.key 
          ? { ...item, ...values }
          : item
      ));
      setEditModalVisible(false);
      message.success('修改成功');
    } catch (error) {
      console.log('Failed:', error);
    }
  };

  const handleAddOk = async () => {
    try {
      const values = await addForm.validateFields();
      const newProduct = {
        key: Date.now().toString(),
        ...values
      };
      setProducts([...products, newProduct]);
      setFilteredProducts([...filteredProducts, newProduct]);
      setAddModalVisible(false);
      addForm.resetFields();
      message.success('新增成功');
    } catch (error) {
      console.log('Failed:', error);
    }
  };

  // 查询处理函数
  const handleSearch = () => {
    let filteredData = products;

    // 按物资编码筛选
    if (searchParams.materialCode) {
      filteredData = filteredData.filter(item => 
        item.materialCode.toLowerCase().includes(searchParams.materialCode.toLowerCase())
      );
    }

    // 按物资名称筛选
    if (searchParams.name) {
      filteredData = filteredData.filter(item => 
        item.name.toLowerCase().includes(searchParams.name.toLowerCase())
      );
    }

    // 按供应商筛选
    if (searchParams.supplier) {
      filteredData = filteredData.filter(item => 
        item.supplier.toLowerCase().includes(searchParams.supplier.toLowerCase())
      );
    }

    // 按生产厂家筛选
    if (searchParams.manufacturer) {
      filteredData = filteredData.filter(item => 
        item.manufacturer.toLowerCase().includes(searchParams.manufacturer.toLowerCase())
      );
    }

    return filteredData;
  };

  const [filteredProducts, setFilteredProducts] = useState(products);

  // 执行搜索
  const executeSearch = () => {
    const result = handleSearch();
    setFilteredProducts(result);
  };

  // 重置搜索
  const handleReset = () => {
    setSearchParams({
      materialCode: '',
      name: '',
      supplier: '',
      manufacturer: ''
    });
    setFilteredProducts(products);
  };

  return (
    <div style={FORM_STYLES.page}>
      <h1 style={FORM_STYLES.title}>物资字典</h1>
      
      <Card style={FORM_STYLES.card}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ whiteSpace: 'nowrap' }}>物资编码：</span>
              <Input 
                placeholder="请输入物资编码"
                value={searchParams.materialCode}
                allowClear
                style={{ width: 200 }}
                onChange={(e) => setSearchParams({...searchParams, materialCode: e.target.value})}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ whiteSpace: 'nowrap' }}>物资名称：</span>
              <Input 
                placeholder="请输入物资名称"
                value={searchParams.name}
                allowClear
                style={{ width: 200 }}
                onChange={(e) => setSearchParams({...searchParams, name: e.target.value})}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ whiteSpace: 'nowrap' }}>供应商：</span>
              <Input 
                placeholder="请输入供应商"
                value={searchParams.supplier}
                allowClear
                style={{ width: 200 }}
                onChange={(e) => setSearchParams({...searchParams, supplier: e.target.value})}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ whiteSpace: 'nowrap' }}>生产厂家：</span>
              <Input 
                placeholder="请输入生产厂家"
                value={searchParams.manufacturer}
                allowClear
                style={{ width: 200 }}
                onChange={(e) => setSearchParams({...searchParams, manufacturer: e.target.value})}
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Button type="primary" icon={<SearchOutlined />} onClick={executeSearch}>
              查询
            </Button>
            <Button onClick={handleReset}>
              重置
            </Button>
            <Button icon={<ExportOutlined />}>
              导出目录
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => {
              addForm.resetFields();
              setAddModalVisible(true);
            }}>
              新增字典 
            </Button>
          </div>
        </div>
      </Card>

      <Card style={{ marginTop: FORM_STYLES.spacing.cardBottom }}>
        <div style={{ marginBottom: FORM_STYLES.spacing.cardBottom, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span>共 {filteredProducts.length} 条商品记录</span>
            <span style={{ marginLeft: 16 }}>
              启用商品: {filteredProducts.filter(item => item.status === 'active').length} 种
            </span>
            <span style={{ marginLeft: 16, color: '#faad14' }}>
              停用商品: {filteredProducts.filter(item => item.status === 'inactive').length} 种
            </span>
          </div>
        </div>
        <Table 
          columns={columns} 
          dataSource={filteredProducts} 
          rowSelection={{
            selectedRowKeys,
            onChange: (keys) => setSelectedRowKeys(keys),
          }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
            style: FORM_STYLES.table.pagination.style
          }}
          scroll={{ x: 1600 }}
          size={FORM_STYLES.table.size}
        />
      </Card>

      <Modal
        title="编辑字典"
        open={editModalVisible}
        onOk={handleEditOk}
        onCancel={() => setEditModalVisible(false)}
        {...getModalConfig()}
      >
        <Form form={form} {...getFormLayoutStyle('edit')}>
          <Row gutter={FORM_STYLES.form.edit.rowGutter}>
            <Col span={FORM_STYLES.form.edit.colSpan}>
              <Form.Item
                name="materialCode"
                label="物资编码"
                rules={[{ required: true, message: '请输入物资编码' }]}
              >
                <Input placeholder="请输入物资编码" />
              </Form.Item>
            </Col>
            <Col span={FORM_STYLES.form.edit.colSpan}>
              <Form.Item
                name="name"
                label="物资名称"
                rules={[{ required: true, message: '请输入物资名称' }]}
              >
                <Input placeholder="请输入物资名称" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={FORM_STYLES.form.edit.rowGutter}>
            <Col span={FORM_STYLES.form.edit.colSpan}>
              <Form.Item
                name="materialType"
                label="物资类型"
                rules={[{ required: true, message: '请输入物资类型' }]}
              >
                <Input placeholder="请输入物资类型" />
              </Form.Item>
            </Col>
            <Col span={FORM_STYLES.form.edit.colSpan}>
              <Form.Item
                name="specification"
                label="规格"
                rules={[{ required: true, message: '请输入规格' }]}
              >
                <Input placeholder="请输入规格" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={FORM_STYLES.form.edit.rowGutter}>
            <Col span={FORM_STYLES.form.edit.colSpan}>
              <Form.Item
                name="model"
                label="型号"
                rules={[{ required: true, message: '请输入型号' }]}
              >
                <Input placeholder="请输入型号" />
              </Form.Item>
            </Col>
            <Col span={FORM_STYLES.form.edit.colSpan}>
              <Form.Item
                name="minPackage"
                label="最小包装"
                rules={[{ required: true, message: '请输入最小包装' }]}
              >
                <Input placeholder="例如: 100只/盒" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={FORM_STYLES.form.edit.rowGutter}>
            <Col span={FORM_STYLES.form.edit.colSpan}>
              <Form.Item
                name="unit"
                label="单位"
                rules={[{ required: true, message: '请选择单位' }]}
              >
                <Select placeholder="请选择单位">
                  <Option value="只">只</Option>
                  <Option value="套">套</Option>
                  <Option value="包">包</Option>
                  <Option value="瓶">瓶</Option>
                  <Option value="台">台</Option>
                  <Option value="支">支</Option>
                  <Option value="卷">卷</Option>
                  <Option value="片">片</Option>
                  <Option value="盒">盒</Option>
                  <Option value="箱">箱</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={FORM_STYLES.form.edit.colSpan}>
              <Form.Item
                name="purchasePrice"
                label="采购价格"
                rules={[{ required: true, message: '请输入采购价格' }]}
              >
                <Input placeholder="请输入采购价格" prefix="¥" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={FORM_STYLES.form.edit.rowGutter}>
            <Col span={FORM_STYLES.form.edit.colSpan}>
              <Form.Item
                name="purchasePrice"
                label="采购价格"
                rules={[{ required: true, message: '请输入采购价格' }]}
              >
                <Input placeholder="请输入采购价格" prefix="¥" />
              </Form.Item>
            </Col>
            <Col span={FORM_STYLES.form.edit.colSpan}>
              <Form.Item
                name="registrationNumber"
                label="注册证号"
                rules={[{ required: true, message: '请输入注册证号' }]}
              >
                <Input placeholder="请输入注册证号" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={FORM_STYLES.form.edit.rowGutter}>
            <Col span={FORM_STYLES.form.edit.colSpan}>
              <Form.Item
                name="supplier"
                label="供应商"
                rules={[{ required: true, message: '请输入供应商' }]}
              >
                <Input placeholder="请输入供应商" />
              </Form.Item>
            </Col>
            <Col span={FORM_STYLES.form.edit.colSpan}>
              <Form.Item
                name="manufacturer"
                label="生产厂家"
                rules={[{ required: true, message: '请输入生产厂家' }]}
              >
                <Input placeholder="请输入生产厂家" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={FORM_STYLES.form.edit.rowGutter}>
            <Col span={FORM_STYLES.form.edit.colSpan}>
              <Form.Item
                name="storageCondition"
                label="储存条件"
                rules={[{ required: true, message: '请输入储存条件' }]}
              >
                <Input placeholder="请输入储存条件" />
              </Form.Item>
            </Col>
            <Col span={FORM_STYLES.form.edit.colSpan}>
              <Form.Item
                name="status"
                label="状态"
                rules={[{ required: true, message: '请选择状态' }]}
              >
                <Select placeholder="请选择状态">
                  <Option value="active">启用</Option>
                  <Option value="inactive">停用</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      <Modal
        title="新增字典"
        open={addModalVisible}
        onOk={handleAddOk}
        onCancel={() => setAddModalVisible(false)}
        {...getModalConfig()}
      >
        <Form form={addForm} {...getFormLayoutStyle('edit')}>
          <Row gutter={FORM_STYLES.form.edit.rowGutter}>
            <Col span={FORM_STYLES.form.edit.colSpan}>
              <Form.Item
                name="materialCode"
                label="物资编码"
                rules={[{ required: true, message: '请输入物资编码' }]}
              >
                <Input placeholder="请输入物资编码" />
              </Form.Item>
            </Col>
            <Col span={FORM_STYLES.form.edit.colSpan}>
              <Form.Item
                name="name"
                label="物资名称"
                rules={[{ required: true, message: '请输入物资名称' }]}
              >
                <Input placeholder="请输入物资名称" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={FORM_STYLES.form.edit.rowGutter}>
            <Col span={FORM_STYLES.form.edit.colSpan}>
              <Form.Item
                name="materialType"
                label="物资类型"
                rules={[{ required: true, message: '请输入物资类型' }]}
              >
                <Input placeholder="请输入物资类型" />
              </Form.Item>
            </Col>
            <Col span={FORM_STYLES.form.edit.colSpan}>
              <Form.Item
                name="specification"
                label="规格"
                rules={[{ required: true, message: '请输入规格' }]}
              >
                <Input placeholder="请输入规格" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={FORM_STYLES.form.edit.rowGutter}>
            <Col span={FORM_STYLES.form.edit.colSpan}>
              <Form.Item
                name="model"
                label="型号"
                rules={[{ required: true, message: '请输入型号' }]}
              >
                <Input placeholder="请输入型号" />
              </Form.Item>
            </Col>
            <Col span={FORM_STYLES.form.edit.colSpan}>
              <Form.Item
                name="minPackage"
                label="最小包装"
                rules={[{ required: true, message: '请输入最小包装' }]}
              >
                <Input placeholder="例如: 100只/盒" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={FORM_STYLES.form.edit.rowGutter}>
            <Col span={FORM_STYLES.form.edit.colSpan}>
              <Form.Item
                name="unit"
                label="单位"
                rules={[{ required: true, message: '请选择单位' }]}
              >
                <Select placeholder="请选择单位">
                  <Option value="只">只</Option>
                  <Option value="套">套</Option>
                  <Option value="包">包</Option>
                  <Option value="瓶">瓶</Option>
                  <Option value="台">台</Option>
                  <Option value="支">支</Option>
                  <Option value="卷">卷</Option>
                  <Option value="片">片</Option>
                  <Option value="盒">盒</Option>
                  <Option value="箱">箱</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={FORM_STYLES.form.edit.colSpan}>
              <Form.Item
                name="purchasePrice"
                label="采购价格"
                rules={[{ required: true, message: '请输入采购价格' }]}
              >
                <Input placeholder="请输入采购价格" prefix="¥" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={FORM_STYLES.form.edit.rowGutter}>
            <Col span={FORM_STYLES.form.edit.colSpan}>
              <Form.Item
                name="registrationNumber"
                label="注册证号"
                rules={[{ required: true, message: '请输入注册证号' }]}
              >
                <Input placeholder="请输入注册证号" />
              </Form.Item>
            </Col>
            <Col span={FORM_STYLES.form.edit.colSpan}>
              <Form.Item
                name="supplier"
                label="供应商"
                rules={[{ required: true, message: '请输入供应商' }]}
              >
                <Input placeholder="请输入供应商" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={FORM_STYLES.form.edit.rowGutter}>
            <Col span={FORM_STYLES.form.edit.colSpan}>
              <Form.Item
                name="manufacturer"
                label="生产厂家"
                rules={[{ required: true, message: '请输入生产厂家' }]}
              >
                <Input placeholder="请输入生产厂家" />
              </Form.Item>
            </Col>
            <Col span={FORM_STYLES.form.edit.colSpan}>
              <Form.Item
                name="storageCondition"
                label="储存条件"
                rules={[{ required: true, message: '请输入储存条件' }]}
              >
                <Input placeholder="请输入储存条件" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={FORM_STYLES.form.edit.rowGutter}>
            <Col span={FORM_STYLES.form.edit.colSpan}>
              <Form.Item
                name="status"
                label="状态"
                rules={[{ required: true, message: '请选择状态' }]}
              >
                <Select placeholder="请选择状态">
                  <Option value="active">启用</Option>
                  <Option value="inactive">停用</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductCatalog;
