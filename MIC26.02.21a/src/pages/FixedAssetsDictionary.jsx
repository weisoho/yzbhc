import React, { useState } from 'react';
import { Card, Button, Table, Input, Space, Popconfirm, Select, Modal, Form, InputNumber, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';

const { Option } = Select;

const FixedAssetsDictionary = () => {
  const [visible, setVisible] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);
  const [form] = Form.useForm();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const assetTypes = [
    { key: '1', code: 'FA001', name: '医疗设备', description: '各类医疗诊断治疗设备', status: '启用' },
    { key: '2', code: 'FA002', name: '办公设备', description: '电脑、打印机等办公设备', status: '启用' },
    { key: '3', code: 'FA003', name: '家具', description: '办公桌椅、文件柜等', status: '启用' },
    { key: '4', code: 'FA004', name: '车辆', description: '公务用车、运输车辆', status: '停用' },
  ];

  const columns = [
    { title: '资产类型编码', dataIndex: 'code', key: 'code', width: 120 },
    { title: '资产类型名称', dataIndex: 'name', key: 'name', width: 150 },
    { title: '类型描述', dataIndex: 'description', key: 'description' },
    { 
      title: '状态', 
      dataIndex: 'status', 
      key: 'status', 
      width: 100,
      render: (status) => (
        <span style={{ color: status === '启用' ? '#52c41a' : '#f5222d' }}>
          {status}
        </span>
      )
    },
    { 
      title: '操作', 
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => handleEdit(record)}><EditOutlined />编辑</a>
          <Popconfirm
            title={`确定要${record.status === '启用' ? '停用' : '启用'}这个资产类型吗？`}
            onConfirm={() => handleToggleStatus(record)}
            okText="确定"
            cancelText="取消"
          >
            <a style={{ color: record.status === '启用' ? '#f5222d' : '#52c41a' }}>
              {record.status === '启用' ? '停用' : '启用'}
            </a>
          </Popconfirm>
        </Space>
      )
    },
  ];

  const handleAdd = () => {
    setEditingAsset(null);
    form.resetFields();
    setVisible(true);
  };

  const handleEdit = (record) => {
    setEditingAsset(record);
    form.setFieldsValue(record);
    setVisible(true);
  };

  const handleToggleStatus = (record) => {
    const newStatus = record.status === '启用' ? '停用' : '启用';
    message.success(`已${newStatus}资产类型：${record.name}`);
  };

  const handleSubmit = () => {
    form.validateFields().then(values => {
      message.success(editingAsset ? '修改成功' : '新增成功');
      setVisible(false);
      form.resetFields();
    }).catch(error => {
      console.error('表单验证失败:', error);
    });
  };

  const handleCancel = () => {
    setVisible(false);
    form.resetFields();
  };

  return (
    <div style={{ padding: '0 16px' }}>
      <h1 style={{ marginBottom: 24 }}>资产字典维护</h1>
      
      <Card style={{ marginBottom: 16 }}>
        <Space wrap style={{ width: '100%' }}>
          <Input placeholder="资产类型编码" style={{ width: 150, minWidth: '120px' }} />
          <Input placeholder="资产类型名称" style={{ width: 150, minWidth: '120px' }} />
          <Select placeholder="状态" style={{ width: 120, minWidth: '100px' }}>
            <Option value="all">全部</Option>
            <Option value="启用">启用</Option>
            <Option value="停用">停用</Option>
          </Select>
          <Button type="primary" icon={<SearchOutlined />}>查询</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新增资产类型
          </Button>
        </Space>
      </Card>
      
      <div style={{ overflowX: 'auto' }}>
        <Table columns={columns} dataSource={assetTypes} pagination={{ 
          pageSize: pageSize,
          current: currentPage,
          onChange: (page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          },
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

      <Modal
        title={editingAsset ? '编辑资产类型' : '新增资产类型'}
        open={visible}
        onOk={handleSubmit}
        onCancel={handleCancel}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="code"
            label="资产类型编码"
            rules={[{ required: true, message: '请输入资产类型编码' }]}
          >
            <Input placeholder="请输入资产类型编码" />
          </Form.Item>
          <Form.Item
            name="name"
            label="资产类型名称"
            rules={[{ required: true, message: '请输入资产类型名称' }]}
          >
            <Input placeholder="请输入资产类型名称" />
          </Form.Item>
          <Form.Item
            name="description"
            label="类型描述"
            rules={[{ required: true, message: '请输入类型描述' }]}
          >
            <Input.TextArea placeholder="请输入类型描述" rows={3} />
          </Form.Item>
          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select placeholder="请选择状态">
              <Option value="启用">启用</Option>
              <Option value="停用">停用</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default FixedAssetsDictionary;