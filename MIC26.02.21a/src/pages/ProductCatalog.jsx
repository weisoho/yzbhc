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
    status: 'all'
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
      specification: '未灭菌 无粉麻面特小号（XS）',
      model: '未灭菌 无粉麻面特小号（XS）',
      supplier: '广州器化医疗设备有限公司',
      registrationNumber: '赣械备20170001号',
      manufacturer: '江西云鸽橡胶有限公司',
      status: 'active',
      packUnit: '只',
      packSpecification: '100只/盒'
    },
    {
      key: '2',
      materialCode: 'MIC100011',
      name: '25-羟基维生素D3标液',
      specification: '4×1 mL(冻干品复溶体积)',
      model: '4×1 mL(冻干品复溶体积)',
      supplier: '广州市迪贤贸易有限公司',
      registrationNumber: '国械注进2018242095',
      manufacturer: '罗氏诊断公司Roche Diagnostics GmbH',
      status: 'active',
      packUnit: '盒',
      packSpecification: '10盒/箱'
    },
    {
      key: '3',
      materialCode: 'MIC100012',
      name: '肌红蛋白（MYO）测定试剂盒',
      specification: '2×100 ml/份',
      model: '2×100 ml/份',
      supplier: '国药控股广州医疗供应链服务有限公司',
      registrationNumber: '粤械注准20152400846',
      manufacturer: '深圳迈瑞生物医疗电子股份有限公司',
      status: 'active',
      packUnit: '盒',
      packSpecification: '10盒/箱'
    },
    {
      key: '4',
      materialCode: 'MIC100013',
      name: '梅毒螺旋体抗体（TP）试验（液体）标准物质',
      specification: '12-0.10A U/ml 0.5ml/管，20管/盒，GBW(E)090852',
      model: '12-0.10A U/ml 0.5ml/管，20管/盒，GBW(E)090852',
      supplier: '广州为众生物科技有限公司',
      registrationNumber: '2017标准物质定值证书17452号',
      manufacturer: '中国计量科学研究院',
      status: 'active',
      packUnit: '盒',
      packSpecification: '5盒/箱'
    },
    {
      key: '5',
      materialCode: 'MIC100014',
      name: '凝血质物',
      specification: '水平2*12ml',
      model: '水平2*12ml',
      supplier: '华润（广东）医学检验有限公司',
      registrationNumber: '国械注进2017241752',
      manufacturer: '伯乐实验有限公司Bio-Rad Laboratories, Inc.',
      status: 'active',
      packUnit: '盒',
      packSpecification: '10盒/箱'
    },
    {
      key: '6',
      materialCode: 'MIC100015',
      name: '细菌计数板',
      specification: '50人份/盒、UZR-RHC02-50',
      model: '50人份/盒、UZR-RHC02-50',
      supplier: '广州市致图医疗科技有限公司',
      registrationNumber: '湘械注准2022130059',
      manufacturer: '湖南友哲科技有限公司',
      status: 'active',
      packUnit: '盒',
      packSpecification: '10盒/箱'
    },
    {
      key: '7',
      materialCode: 'MIC100016',
      name: '血气分析测定试剂盒（电极法）',
      specification: '75人份/盒',
      model: '75人份/盒',
      supplier: '国药控股广州医疗供应链服务有限公司',
      registrationNumber: '国械注进2016245066',
      manufacturer: '瑞士罗氏诊断公司',
      status: 'active',
      packUnit: '盒',
      packSpecification: '10盒/箱'
    },
    {
      key: '8',
      materialCode: 'MIC100017',
      name: '人清洗液ISE Cleaning Solution/SE SysClean',
      specification: '4×1.0 L',
      model: '4×1.0 L（冻干品，复溶体积）',
      supplier: '广州市迪贤贸易有限公司',
      registrationNumber: '国械注进20152430724',
      manufacturer: '罗氏诊断公司Roche Diagnostics GmbH',
      status: 'active',
      packUnit: '瓶',
      packSpecification: '6瓶/箱'
    },
    {
      key: '9',
      materialCode: 'MIC100018',
      name: 'ABO正定型及RhD血型定型试剂卡（柱凝集法）',
      specification: '400卡/盒',
      model: '400卡/盒',
      supplier: '国药控股广州医疗供应链服务有限公司',
      registrationNumber: '国械注进20163404540',
      manufacturer: '奥森多临床诊断（英国）有限责任公司Ortho-Clinical Diagnostics',
      status: 'active',
      packUnit: '盒',
      packSpecification: '5盒/箱'
    },
    {
      key: '10',
      materialCode: 'MIC100019',
      name: '人ABO血型检定用红细胞测定试剂盒',
      specification: '2*20ML(A1/B)',
      model: '2*20ML(A1/B)',
      supplier: '国药控股广州医疗供应链服务有限公司',
      registrationNumber: '国械注准20173400472',
      manufacturer: '基立福诊断股份公司Diagnostic Grifols, S.A.',
      status: 'active',
      packUnit: '盒',
      packSpecification: '10盒/箱'
    },
    {
      key: '11',
      materialCode: 'MIC100020',
      name: '抗人球蛋白检测卡',
      specification: '2*15ML/盒',
      model: '2*15ML/盒',
      supplier: '国药控股广州医疗供应链服务有限公司',
      registrationNumber: '国械注准20163400481',
      manufacturer: '基立福诊断股份公司',
      status: 'active',
      packUnit: '盒',
      packSpecification: '10盒/箱'
    },
    {
      key: '12',
      materialCode: 'MIC100021',
      name: '药兰氏阳性细菌鉴定/药敏板',
      specification: '26ml/块，10块/盒',
      model: '26ml/块，10块/盒',
      supplier: '广州市迪贤贸易有限公司',
      registrationNumber: '国械注准20152401527',
      manufacturer: '碧迪公司 Becton, Dickinson and Company',
      status: 'active',
      packUnit: '盒',
      packSpecification: '5盒/箱'
    },
    {
      key: '13',
      materialCode: 'MIC100022',
      name: '革兰氏阴性细菌鉴定药敏板',
      specification: '25ml/块',
      model: '25ml/块',
      supplier: '广州市迪贤贸易有限公司',
      registrationNumber: '国械注准20142404960',
      manufacturer: '碧迪公司 Becton, Dickinson and Company',
      status: 'active',
      packUnit: '盒',
      packSpecification: '10块/盒'
    },
    {
      key: '14',
      materialCode: 'MIC100023',
      name: '铜蓝蛋白测定试剂盒(散射比浊法)',
      specification: '2ml/盒',
      model: '2ml/盒',
      supplier: '广州为众生物科技有限公司',
      registrationNumber: '国械注准20163400459',
      manufacturer: '德国西门子医学诊断产品有限公司Siemens Healthcare Diagnostics Products GmbH',
      status: 'active',
      packUnit: '盒',
      packSpecification: '10盒/箱'
    },
    {
      key: '15',
      materialCode: 'MIC100024',
      name: '万宝盛华定制实验纸片（打孔法）',
      specification: '550片/盒',
      model: '550片/盒',
      supplier: '华润（广东）医学检验有限公司',
      registrationNumber: '国械注准20152400266',
      manufacturer: '杭州艾科科技有限公司',
      status: 'active',
      packUnit: '盒',
      packSpecification: '5盒/箱'
    },
    {
      key: '16',
      materialCode: 'MIC100025',
      name: '尿糖检测试剂盒（比色法）',
      specification: '1000测试',
      model: '1000测试',
      supplier: '国药控股广东兴宁有限公司',
      registrationNumber: '苏械注准20212401676',
      manufacturer: '罗氏诊断产品（苏州）有限公司',
      status: 'active',
      packUnit: '盒',
      packSpecification: '10盒/箱'
    },
    {
      key: '17',
      materialCode: 'MIC100026',
      name: '甘油三酯检测试剂（比色法）',
      specification: '800测试',
      model: '800测试',
      supplier: '国药控股广东兴宁有限公司',
      registrationNumber: '国械注准20172400977',
      manufacturer: '罗氏诊断公司Roche Diagnostics GmbH',
      status: 'active',
      packUnit: '盒',
      packSpecification: '10盒/箱'
    },
    {
      key: '18',
      materialCode: 'MIC100027',
      name: '胆固醇检测试剂（比色法）',
      specification: '2100测试',
      model: '2100测试',
      supplier: '国药控股广东兴宁有限公司',
      registrationNumber: '国械注准20162400487',
      manufacturer: '罗氏诊断公司Roche Diagnostics GmbH',
      status: 'active',
      packUnit: '盒',
      packSpecification: '10盒/箱'
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
    { title: '商品编码', dataIndex: 'materialCode', key: 'materialCode', width: 100 },
    { title: '商品名称', dataIndex: 'name', key: 'name', width: 150 },
    { title: '规格', dataIndex: 'specification', key: 'specification', width: 120 },
    { title: '型号', dataIndex: 'model', key: 'model', width: 100 },
    { title: '供应商', dataIndex: 'supplier', key: 'supplier', width: 120 },
    { title: '注册证号', dataIndex: 'registrationNumber', key: 'registrationNumber', width: 150 },
    { title: '打包单位', dataIndex: 'packUnit', key: 'packUnit', width: 80 },
    { title: '打包规格', dataIndex: 'packSpecification', key: 'packSpecification', width: 120 },
    { title: '生产厂家', dataIndex: 'manufacturer', key: 'manufacturer', width: 200 },
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
      specification: record.specification,
      model: record.model,
      supplier: record.supplier,
      registrationNumber: record.registrationNumber,
      manufacturer: record.manufacturer,
      status: record.status,
      packUnit: record.packUnit,
      packSpecification: record.packSpecification
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

    // 按商品编码筛选
    if (searchParams.materialCode) {
      filteredData = filteredData.filter(item => 
        item.materialCode.toLowerCase().includes(searchParams.materialCode.toLowerCase())
      );
    }

    // 按商品名称筛选
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

    // 按状态筛选
    if (searchParams.status !== 'all') {
      filteredData = filteredData.filter(item => item.status === searchParams.status);
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
      status: 'all'
    });
    setFilteredProducts(products);
  };

  return (
    <div style={FORM_STYLES.page}>
      <h1 style={FORM_STYLES.title}>物资字典</h1>
      
      <Card style={FORM_STYLES.card}>
        <Form {...getFormLayoutStyle('search')}>
          <Row gutter={FORM_STYLES.form.search.rowGutter} style={{ width: '100%' }}>
            <Col {...getResponsiveColProps()}>
              <Form.Item name="materialCode" label="商品编码">
                <Input 
                  placeholder="请输入商品编码"
                  value={searchParams.materialCode}
                  allowClear
                  onChange={(e) => setSearchParams({...searchParams, materialCode: e.target.value})}
                />
              </Form.Item>
            </Col>
            <Col {...getResponsiveColProps()}>
              <Form.Item name="name" label="商品名称">
                <Input 
                  placeholder="请输入商品名称"
                  value={searchParams.name}
                  allowClear
                  onChange={(e) => setSearchParams({...searchParams, name: e.target.value})}
                />
              </Form.Item>
            </Col>
            <Col {...getResponsiveColProps()}>
              <Form.Item name="supplier" label="供应商">
                <Input 
                  placeholder="请输入供应商"
                  value={searchParams.supplier}
                  allowClear
                  onChange={(e) => setSearchParams({...searchParams, supplier: e.target.value})}
                />
              </Form.Item>
            </Col>
            <Col {...getResponsiveColProps()}>
              <Form.Item name="status" label="状态">
                <Select
                  placeholder="请选择状态"
                  value={searchParams.status}
                  allowClear
                  onChange={(value) => setSearchParams({...searchParams, status: value})}
                >
                  <Option value="all">全部状态</Option>
                  <Option value="active">启用</Option>
                  <Option value="inactive">停用</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24}>
              <Form.Item>
                <Space>
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
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>
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
                label="商品编码"
                rules={[{ required: true, message: '请输入商品编码' }]}
              >
                <Input placeholder="请输入商品编码" />
              </Form.Item>
            </Col>
            <Col span={FORM_STYLES.form.edit.colSpan}>
              <Form.Item
                name="name"
                label="商品名称"
                rules={[{ required: true, message: '请输入商品名称' }]}
              >
                <Input placeholder="请输入商品名称" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={FORM_STYLES.form.edit.rowGutter}>
            <Col span={FORM_STYLES.form.edit.colSpan}>
              <Form.Item
                name="specification"
                label="规格"
                rules={[{ required: true, message: '请输入规格' }]}
              >
                <Input placeholder="请输入规格" />
              </Form.Item>
            </Col>
            <Col span={FORM_STYLES.form.edit.colSpan}>
              <Form.Item
                name="model"
                label="型号"
                rules={[{ required: true, message: '请输入型号' }]}
              >
                <Input placeholder="请输入型号" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={FORM_STYLES.form.edit.rowGutter}>
            <Col span={FORM_STYLES.form.edit.colSpan}>
              <Form.Item
                name="supplier"
                label="供应商"
                rules={[{ required: true, message: '请选择供应商' }]}
              >
                <Input placeholder="请输入供应商" />
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
                name="packUnit"
                label="打包单位"
                rules={[{ required: true, message: '请选择打包单位' }]}
              >
                <Select placeholder="请选择打包单位">
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
                name="packSpecification"
                label="打包规格"
                rules={[{ required: true, message: '请输入打包规格' }]}
              >
                <Input placeholder="例如: 100只/盒" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="manufacturer"
            label="生产厂家"
            rules={[{ required: true, message: '请输入生产厂家' }]}
          >
            <Input placeholder="请输入生产厂家" />
          </Form.Item>
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
                name="name"
                label="商品名称"
                rules={[{ required: true, message: '请输入商品名称' }]}
              >
                <Input placeholder="请输入商品名称" />
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
                name="packUnit"
                label="最小包装单位"
                rules={[{ required: true, message: '请选择最小包装单位' }]}
              >
                <Select placeholder="请选择最小包装单位">
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
                name="packSpecification"
                label="打包规格"
                rules={[{ required: true, message: '请输入打包规格' }]}
              >
                <Input placeholder="例如: 100只/盒" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={FORM_STYLES.form.edit.rowGutter}>
            <Col span={FORM_STYLES.form.edit.colSpan}>
              <Form.Item
                name="purchasePrice"
                label="采购价"
                rules={[{ required: true, message: '请输入采购价' }]}
              >
                <Input placeholder="请输入采购价" prefix="¥" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductCatalog;
