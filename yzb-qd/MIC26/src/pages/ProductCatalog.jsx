import { useState, useEffect } from 'react';
import { Card, Button, Table, Input, Space, Popconfirm, Select, Row, Col, Tag, Modal, Form, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, ExportOutlined } from '@ant-design/icons';
import { FORM_STYLES, getFormLayoutStyle, getModalConfig } from '../utils/formStyles';
import api from '../utils/api';

const { Option } = Select;

const ProductCatalog = () => {
  const [searchParams, setSearchParams] = useState({
    materialCode: '',
    name: '',
    supplier: '',
    manufacturer: '',
    status: ''
  });

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [suppliers, setSuppliers] = useState([]);
  const [qualifications, setQualifications] = useState([]);

  // 加载供应商列表
  const loadSuppliers = async () => {
    try {
      const response = await api.get('/api/scm/suppliers');
      if (response.code === 1 && response.data) {
        const supplierList = response.data.records.map(supplier => ({
          value: supplier.id,
          label: supplier.name
        }));
        setSuppliers(supplierList);
      }
    } catch (error) {
      console.error('加载供应商列表失败:', error);
    }
  };

  // 加载注册证列表
  const loadQualifications = async (supplierId) => {
    try {
      if (!supplierId) {
        setQualifications([]);
        return;
      }
      const response = await api.get(`/api/scm/suppliers/${supplierId}/qualifications`, {
        type: 'REGISTRATION_CERTIFICATE'
      });
      if (response.code === 1 && response.data) {
        const qualificationList = response.data.map(qualification => ({
          value: qualification.id,
          label: `${qualification.certificateName} (${qualification.licenseNumber})`
        }));
        setQualifications(qualificationList);
      }
    } catch (error) {
      console.error('加载注册证列表失败:', error);
    }
  };

  // 加载物资列表
  const loadProducts = async () => {
    try {
      setLoading(true);
      const params = {
        materialCode: searchParams.materialCode,
        name: searchParams.name,
        supplier: searchParams.supplier,
        manufacturer: searchParams.manufacturer,
        status: searchParams.status,
        pageNum: currentPage,
        pageSize: pageSize
      };
      const response = await api.get('/api/scm/materials', params);
      if (response.code === 1 && response.data) {
        const productList = response.data.records.map(product => ({
          key: product.id,
          materialCode: product.materialCode,
          name: product.name,
          materialType: product.materialType,
          specification: product.specification,
          model: product.model,
          minPackage: product.minPackage,
          unit: product.unit,
          purchasePrice: product.purchasePrice,
          qualificationId: product.qualificationId,
          supplierId: product.supplierId,
          supplierName: product.supplierName,
          registrationNumber: product.registrationNumber,
          manufacturer: product.manufacturer,
          storageCondition: product.storageCondition,
          status: product.status
        }));
        setProducts(productList);
        setTotal(response.data.total);
      } else {
        message.error(response.message || '加载物资列表失败');
      }
    } catch (error) {
      console.error('加载物资列表失败:', error);
      message.error('加载物资列表失败，请检查网络连接或联系管理员');
    } finally {
      setLoading(false);
    }
  };

  // 组件加载时获取物资列表
  useEffect(() => {
    loadSuppliers();
    loadProducts();
  }, [currentPage, pageSize]);

  // 处理搜索输入变化
  const handleSearchChange = (field, value) => {
    setSearchParams(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 处理查询按钮点击
  const handleSearch = () => {
    loadProducts();
  };

  // 处理新增物资
  const handleAddProduct = async (values) => {
    try {
      setLoading(true);
      const productData = {
        name: values.name,
        materialType: values.materialType,
        specification: values.specification,
        model: values.model,
        minPackage: values.minPackage,
        unit: values.unit,
        purchasePrice: parseFloat(values.purchasePrice),
        qualificationId: values.qualificationId,
        supplierId: values.supplierId,
        manufacturer: values.manufacturer,
        storageCondition: values.storageCondition,
        status: values.status || 'active'
      };
      if (values.materialCode) {
        productData.materialCode = values.materialCode;
      }
      const response = await api.post('/api/scm/materials', productData);
      if (response.code === 1) {
        message.success('物资新增成功');
        setAddModalVisible(false);
        addForm.resetFields();
        await loadProducts();
      } else {
        message.error(response.message || '物资新增失败');
      }
    } catch (error) {
      console.error('物资新增失败:', error);
      message.error('物资新增失败，请检查网络连接或联系管理员');
    } finally {
      setLoading(false);
    }
  };

  // 处理编辑物资
  const handleEditProduct = async (values) => {
    try {
      setLoading(true);
      const productData = {
        materialCode: values.materialCode,
        name: values.name,
        materialType: values.materialType,
        specification: values.specification,
        model: values.model,
        minPackage: values.minPackage,
        unit: values.unit,
        purchasePrice: parseFloat(values.purchasePrice),
        qualificationId: values.qualificationId,
        supplierId: values.supplierId,
        manufacturer: values.manufacturer,
        storageCondition: values.storageCondition,
        status: values.status
      };
      const response = await api.put(`/api/scm/materials/${editingProduct.key}`, productData);
      if (response.code === 1) {
        message.success('物资编辑成功');
        setEditModalVisible(false);
        editForm.resetFields();
        setEditingProduct(null);
        await loadProducts();
      } else {
        message.error(response.message || '物资编辑失败');
      }
    } catch (error) {
      console.error('物资编辑失败:', error);
      message.error('物资编辑失败，请检查网络连接或联系管理员');
    } finally {
      setLoading(false);
    }
  };

  // 处理删除物资
  const handleDeleteProduct = async (record) => {
    try {
      setLoading(true);
      const response = await api.delete(`/api/scm/materials/${record.key}`);
      if (response.code === 1) {
        message.success('物资删除成功');
        await loadProducts();
      } else {
        message.error(response.message || '物资删除失败');
      }
    } catch (error) {
      console.error('物资删除失败:', error);
      message.error('物资删除失败，请检查网络连接或联系管理员');
    } finally {
      setLoading(false);
    }
  };

  // 处理编辑按钮点击
  const handleEdit = async (record) => {
    setEditingProduct(record);
    editForm.setFieldsValue({
      materialCode: record.materialCode,
      name: record.name,
      materialType: record.materialType,
      specification: record.specification,
      model: record.model,
      minPackage: record.minPackage,
      unit: record.unit,
      purchasePrice: record.purchasePrice,
      qualificationId: record.qualificationId,
      supplierId: record.supplierId,
      manufacturer: record.manufacturer,
      storageCondition: record.storageCondition,
      status: record.status
    });
    // 加载该供应商的注册证列表
    if (record.supplierId) {
      await loadQualifications(record.supplierId);
    }
    setEditModalVisible(true);
  };

  const columns = [
    { 
      title: '序号', 
      key: 'index', 
      width: 60, 
      fixed: 'left',
      render: (_, __, index) => index + 1
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
    { title: '供应商', dataIndex: 'supplierName', key: 'supplierName', width: 150 },
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
            onConfirm={() => handleDeleteProduct(record)}
            okText="确定"
            cancelText="取消"
          >
            <a style={{ color: 'red' }}><DeleteOutlined />删除</a>
          </Popconfirm>
        </Space>
      )
    },
  ];



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
                onChange={(e) => handleSearchChange('materialCode', e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ whiteSpace: 'nowrap' }}>物资名称：</span>
              <Input 
                placeholder="请输入物资名称"
                value={searchParams.name}
                allowClear
                style={{ width: 200 }}
                onChange={(e) => handleSearchChange('name', e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ whiteSpace: 'nowrap' }}>供应商：</span>
              <Input 
                placeholder="请输入供应商"
                value={searchParams.supplier}
                allowClear
                style={{ width: 200 }}
                onChange={(e) => handleSearchChange('supplier', e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ whiteSpace: 'nowrap' }}>生产厂家：</span>
              <Input 
                placeholder="请输入生产厂家"
                value={searchParams.manufacturer}
                allowClear
                style={{ width: 200 }}
                onChange={(e) => handleSearchChange('manufacturer', e.target.value)}
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
              查询
            </Button>
            <Button onClick={() => {
              setSearchParams({
                materialCode: '',
                name: '',
                supplier: '',
                manufacturer: ''
              });
            }}>
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
            <span>共 {products.length} 条商品记录</span>
            <span style={{ marginLeft: 16 }}>
              启用商品: {products.filter(item => item.status === 'active').length} 种
            </span>
            <span style={{ marginLeft: 16, color: '#faad14' }}>
              停用商品: {products.filter(item => item.status === 'inactive').length} 种
            </span>
          </div>
        </div>
        <Table 
          columns={columns} 
          dataSource={products} 
          loading={loading}
          rowSelection={{
            selectedRowKeys,
            onChange: (keys) => setSelectedRowKeys(keys),
          }}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: total,
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            },
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (t) => `共 ${t} 条记录`,
            style: FORM_STYLES.table.pagination.style
          }}
          scroll={{ x: 1600 }}
          size={FORM_STYLES.table.size}
        />
      </Card>

      <Modal
        title="编辑字典"
        open={editModalVisible}
        onOk={() => {
          editForm.validateFields().then((values) => {
            handleEditProduct(values);
          });
        }}
        onCancel={() => {
          setEditModalVisible(false);
          editForm.resetFields();
          setEditingProduct(null);
        }}
        {...getModalConfig()}
      >
        <Form form={editForm} {...getFormLayoutStyle('edit')}>
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
                name="supplierId"
                label="供应商"
                rules={[{ required: true, message: '请选择供应商' }]}
              >
                <Select 
                  placeholder="请选择供应商"
                  options={suppliers}
                  onChange={(value) => {
                    loadQualifications(value);
                    editForm.setFieldsValue({ qualificationId: undefined });
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={FORM_STYLES.form.edit.colSpan}>
              <Form.Item
                name="qualificationId"
                label="注册证"
                rules={[{ required: true, message: '请选择注册证' }]}
              >
                <Select 
                  placeholder="请先选择供应商"
                  options={qualifications}
                  disabled={!editForm.getFieldValue('supplierId')}
                />
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

      <Modal
        title="新增字典"
        open={addModalVisible}
        onOk={() => {
          addForm.validateFields().then((values) => {
            handleAddProduct(values);
          });
        }}
        onCancel={() => {
          setAddModalVisible(false);
          addForm.resetFields();
        }}
        {...getModalConfig()}
      >
        <Form form={addForm} {...getFormLayoutStyle('edit')}>
          <Row gutter={FORM_STYLES.form.edit.rowGutter}>
            <Col span={FORM_STYLES.form.edit.colSpan}>
              <Form.Item
                name="materialCode"
                label="物资编码"
              >
                <Input placeholder="留空后系统自动生成" />
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
                name="supplierId"
                label="供应商"
                rules={[{ required: true, message: '请选择供应商' }]}
              >
                <Select 
                  placeholder="请选择供应商"
                  options={suppliers}
                  onChange={(value) => {
                    loadQualifications(value);
                    addForm.setFieldsValue({ qualificationId: undefined });
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={FORM_STYLES.form.edit.colSpan}>
              <Form.Item
                name="qualificationId"
                label="注册证"
                rules={[{ required: true, message: '请选择注册证' }]}
              >
                <Select
                  placeholder="请先选择供应商"
                  options={qualifications}
                  disabled={!addForm.getFieldValue('supplierId')}
                />
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
