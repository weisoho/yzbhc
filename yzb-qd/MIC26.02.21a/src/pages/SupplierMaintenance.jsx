import { useState } from 'react';
import { Card, Button, Table, Form, Input, Space, Modal, Popconfirm, Checkbox, Select, Radio, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, DownloadOutlined } from '@ant-design/icons';
import { FORM_STYLES, getResponsiveColProps, getFormLayoutStyle, getModalConfig } from '../utils/formStyles';

const { Option } = Select;

const SupplierMaintenance = () => {
  const [visible, setVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const suppliers = [
    { key: '1', name: '供应商A', contact: '张三', phone: '13800138001', address: '北京市朝阳区', registrationNumber: '1234567890' },
    { key: '2', name: '供应商B', contact: '李四', phone: '13900139001', address: '上海市浦东新区', registrationNumber: '0987654321' },
    { key: '3', name: '供应商C', contact: '王五', phone: '13700137001', address: '广州市天河区', registrationNumber: '1122334455' },
  ];

  const handleEdit = (record) => {
    setEditingRecord(record);
    form.setFieldsValue({
      name: record.name,
      contactPerson: record.contact,
      contactPhone: record.phone,
      address: record.address,
      registrationNumber: record.registrationNumber,
      enterpriseType: '经营企业'
    });
    setVisible(true);
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      if (editingRecord) {
        console.log('编辑供应商:', values);
      } else {
        console.log('新增供应商:', values);
      }
      setVisible(false);
      setEditingRecord(null);
      form.resetFields();
    });
  };

  const handleModalCancel = () => {
    setVisible(false);
    setEditingRecord(null);
    form.resetFields();
  };

  const columns = [
    {
      title: <Checkbox 
        indeterminate={selectedRowKeys.length > 0 && selectedRowKeys.length < suppliers.length}
        checked={selectedRowKeys.length === suppliers.length}
        onChange={(e) => {
          if (e.target.checked) {
            setSelectedRowKeys(suppliers.map(item => item.key));
          } else {
            setSelectedRowKeys([]);
          }
        }}
      />,
      dataIndex: 'checkbox',
      key: 'checkbox',
      width: 60,
      render: (_, record) => (
        <Checkbox 
          checked={selectedRowKeys.includes(record.key)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedRowKeys([...selectedRowKeys, record.key]);
            } else {
              setSelectedRowKeys(selectedRowKeys.filter(key => key !== record.key));
            }
          }}
        />
      )
    },
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
      width: 60,
      render: (_, record, index) => (currentPage - 1) * pageSize + index + 1
    },
    { title: '供应商名称', dataIndex: 'name', key: 'name' },
    { title: '联系人', dataIndex: 'contact', key: 'contact' },
    { title: '联系电话', dataIndex: 'phone', key: 'phone' },
    { title: '地址', dataIndex: 'address', key: 'address' },
    { title: '注册证号', dataIndex: 'registrationNumber', key: 'registrationNumber' },
    { 
      title: '操作', 
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => handleEdit(record)}><EditOutlined />编辑</a>
          <Popconfirm
            title="确定要删除这个供应商吗？"
            onConfirm={() => { /* 删除供应商处理 */ }}
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
      <h1 style={FORM_STYLES.title}>供应商管理</h1>
      
      <Card style={FORM_STYLES.card}>
        <Form {...getFormLayoutStyle('search')}>
          <Row gutter={FORM_STYLES.form.search.rowGutter} style={{ width: '100%' }}>
            <Col {...getResponsiveColProps()}>
              <Form.Item name="name" label="供应商名称">
                <Input placeholder="请输入供应商名称" />
              </Form.Item>
            </Col>
            <Col {...getResponsiveColProps()}>
              <Form.Item name="contact" label="联系人">
                <Input placeholder="请输入联系人" />
              </Form.Item>
            </Col>
            <Col {...getResponsiveColProps()}>
              <Form.Item name="phone" label="联系电话">
                <Input placeholder="请输入联系电话" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24}>
              <Form.Item>
                <Space>
                  <Button type="primary" icon={<SearchOutlined />}>查询</Button>
                  <Button type="primary" icon={<PlusOutlined />} onClick={() => {
                    setEditingRecord(null);
                    form.resetFields();
                    setVisible(true);
                  }}>
                    新增供应商
                  </Button>
                  {selectedRowKeys.length > 0 && (
                    <Button 
                      type="primary" 
                      icon={<DownloadOutlined />}
                      onClick={() => {
                        console.log('批量导出选中的供应商:', selectedRowKeys);
                        alert(`已导出 ${selectedRowKeys.length} 条供应商记录`);
                      }}
                    >
                      批量导出
                    </Button>
                  )}
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
      
      <div style={{ overflowX: 'auto' }}>
        <Table 
          columns={columns} 
          dataSource={suppliers} 
          pagination={{ 
            pageSize: pageSize,
            current: currentPage,
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size);
              setSelectedRowKeys([]);
            },
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
            style: FORM_STYLES.table.pagination.style
          }} 
          size={FORM_STYLES.table.size}
        />
      </div>

      <Modal
        title={editingRecord ? "编辑供应商" : "新建供应商"}
        open={visible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="保存"
        cancelText="取消"
        {...getModalConfig()}
      >
        <Form 
          form={form} 
          {...getFormLayoutStyle('edit')}
          initialValues={{
            enterpriseType: "经营企业"
          }}
        >
          <Form.Item
            name="enterpriseType"
            label="企业类型"
            rules={[{ required: true, message: '请选择企业类型' }]}
          >
            <Radio.Group>
              <Radio value="经营企业">经营企业</Radio>
              <Radio value="生产企业">生产企业</Radio>
              <Radio value="医疗机构">医疗机构</Radio>
            </Radio.Group>
          </Form.Item>
          
          <Row gutter={FORM_STYLES.form.edit.rowGutter}>
            <Col span={FORM_STYLES.form.edit.colSpan}>
              <Form.Item
                name="name"
                label="供应商名称"
                rules={[{ required: true, message: '请输入供应商名称' }]}
              >
                <Input placeholder="请输入供应商名称" />
              </Form.Item>
            </Col>
            <Col span={FORM_STYLES.form.edit.colSpan}>
              <Form.Item
                name="creditCode"
                label="企业信用代码"
                rules={[{ required: true, message: '请输入企业信用代码' }]}
              >
                <Input placeholder="请输入企业信用代码" />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={FORM_STYLES.form.edit.rowGutter}>
            <Col span={FORM_STYLES.form.edit.colSpan}>
              <Form.Item
                name="taxNumber"
                label="企业税号"
              >
                <Input placeholder="请输入企业税号" />
              </Form.Item>
            </Col>
            <Col span={FORM_STYLES.form.edit.colSpan}>
              <Form.Item
                label="院内供应商编码"
                tooltip="按默认的数字进行编号，不可自行填写"
              >
                <Input placeholder="请输入院内供应商编码" disabled />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="address"
            label="地址"
          >
            <Input placeholder="请输入地址" />
          </Form.Item>
          
          <div style={{ marginBottom: FORM_STYLES.spacing.cardBottom }}>
            <h3 style={{ marginBottom: 8 }}>联系人信息</h3>
            <Row gutter={FORM_STYLES.form.edit.rowGutter}>
              <Col span={FORM_STYLES.form.edit.colSpan}>
                <Form.Item
                  name="contactPerson"
                  label="企业联系人"
                >
                  <Input placeholder="请输入联系人" />
                </Form.Item>
              </Col>
              <Col span={FORM_STYLES.form.edit.colSpan}>
                <Form.Item
                  name="contactPhone"
                  label="联系电话"
                >
                  <Input placeholder="请输入联系电话" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={FORM_STYLES.form.edit.rowGutter}>
              <Col span={FORM_STYLES.form.edit.colSpan}>
                <Form.Item
                  name="contactCategory"
                  label="类别"
                >
                  <Select placeholder="请选择联系人类别">
                    <Option value="primary">主要联系人</Option>
                    <Option value="technical">技术联系人</Option>
                    <Option value="financial">财务联系人</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={FORM_STYLES.form.edit.colSpan} style={{ display: 'flex', alignItems: 'flex-end' }}>
                <Form.Item>
                  <Button type="primary" icon={<PlusOutlined />}>添加联系人</Button>
                </Form.Item>
              </Col>
            </Row>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default SupplierMaintenance;
