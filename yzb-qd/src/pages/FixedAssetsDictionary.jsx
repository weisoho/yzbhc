import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Input, Space, Popconfirm, Select, Modal, Form, InputNumber, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import api from '../utils/api.js';

const { Option } = Select;

const FixedAssetsDictionary = () => {
  const [visible, setVisible] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);
  const [form] = Form.useForm();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [assetTypes, setAssetTypes] = useState([]);
  const [loading, setLoading] = useState(false);

  // 加载资产类型列表
  useEffect(() => {
    loadAssetTypes();
  }, []);

  const loadAssetTypes = async () => {
    try {
      setLoading(true);
      const response = await api.post('/yzb/selectAssetType', {
        pageNum: currentPage,
        pageSize: pageSize
      });
      if (response.code === 1 && response.data) {
        const types = response.data.list.map(type => ({
          key: type.id,
          id: type.id,
          code: type.assetCode,
          name: type.assetName,
          description: type.assetDesc,
          status: type.assetState === 1 ? '启用' : '停用'
        }));
        setAssetTypes(types);
      }
    } catch (error) {
      message.error('加载资产类型列表失败');
    } finally {
      setLoading(false);
    }
  };

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
    form.setFieldsValue({
      code: record.code,
      name: record.name,
      description: record.description,
      status: record.status
    });
    setVisible(true);
  };

  const handleToggleStatus = async (record) => {
    try {
      setLoading(true);
      const newStatus = record.status === '启用' ? 0 : 1;
      const response = await api.post('/yzb/updateAssetType', {
        id: record.id,
        assetCode: record.code,
        assetName: record.name,
        assetDesc: record.description,
        assetState: newStatus
      });
      if (response.code === 1) {
        const newStatusText = newStatus === 1 ? '启用' : '停用';
        message.success(`已${newStatusText}资产类型：${record.name}`);
        loadAssetTypes();
      } else {
        message.error('状态更新失败');
      }
    } catch (error) {
      message.error('状态更新失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      
      if (editingAsset) {
        // 编辑资产类型
        const response = await api.post('/yzb/updateAssetType', {
          id: editingAsset.id,
          assetCode: values.code,
          assetName: values.name,
          assetDesc: values.description,
          assetState: values.status === '启用' ? 1 : 0
        });
        if (response.code === 1) {
          message.success('修改成功');
        } else {
          message.error('修改失败');
        }
      } else {
        // 新增资产类型
        const response = await api.post('/yzb/addAssetType', {
          assetCode: values.code,
          assetName: values.name,
          assetDesc: values.description,
          assetState: values.status === '启用' ? 1 : 0
        });
        if (response.code === 1) {
          message.success('新增成功');
        } else {
          message.error('新增失败');
        }
      }
      
      setVisible(false);
      form.resetFields();
      loadAssetTypes();
    } catch (error) {
      console.error('表单验证失败:', error);
    } finally {
      setLoading(false);
    }
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
        <Table 
          columns={columns} 
          dataSource={assetTypes} 
          loading={loading}
          pagination={{ 
            pageSize: pageSize,
            current: currentPage,
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size);
              loadAssetTypes();
            },
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
        />
      </div>

      <Modal
        title={editingAsset ? '编辑资产类型' : '新增资产类型'}
        open={visible}
        onOk={handleSubmit}
        onCancel={handleCancel}
        width={600}
        confirmLoading={loading}
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