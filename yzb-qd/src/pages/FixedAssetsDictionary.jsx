import React, { useEffect, useState } from 'react';
import { Card, Button, Table, Input, Space, Popconfirm, Select, Modal, Form, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import api from '../utils/api.js';

const { Option } = Select;

const normalizeList = (payload) => {
  if (Array.isArray(payload?.records)) {
    return payload.records;
  }
  if (Array.isArray(payload?.list)) {
    return payload.list;
  }
  return [];
};

const assetStateOptions = [
  { label: '启用', value: 1 },
  { label: '停用', value: 0 },
];

const FixedAssetsDictionary = () => {
  const [searchForm] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);
  const [form] = Form.useForm();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [assetTypes, setAssetTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [lastQuery, setLastQuery] = useState({});

  useEffect(() => {
    loadAssetTypes(lastQuery, currentPage, pageSize);
  }, [currentPage, lastQuery, pageSize]);

  const loadAssetTypes = async (query = {}, page = 1, size = 10) => {
    try {
      setLoading(true);
      const response = await api.request('/api/assetType/selectAssetType', {
        method: 'POST',
        params: {
          pageNum: page,
          pageSize: size,
          assetCode: query.assetCode,
          assetName: query.assetName,
          assetState: query.assetState,
        },
      });
      if (response.code === 1 && response.data) {
        const list = normalizeList(response.data);
        const types = list.map((type) => ({
          key: type.id,
          id: type.id,
          code: type.assetCode || '-',
          name: type.assetName || '-',
          description: type.assetDesc || '-',
          status: type.assetState,
        }));
        setAssetTypes(types);
        setTotal(response.data.total || types.length);
      }
    } catch (error) {
      message.error('加载资产类型列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (values) => {
    setLastQuery(values);
    setCurrentPage(1);
    await loadAssetTypes(values, 1, pageSize);
  };

  const handleReset = async () => {
    searchForm.resetFields();
    setLastQuery({});
    setCurrentPage(1);
    await loadAssetTypes({}, 1, pageSize);
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
        <span style={{ color: status === 1 ? '#52c41a' : '#f5222d' }}>
          {status === 1 ? '启用' : '停用'}
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
            title={`确定要${record.status === 1 ? '停用' : '启用'}这个资产类型吗？`}
            onConfirm={() => handleToggleStatus(record)}
            okText="确定"
            cancelText="取消"
          >
            <a style={{ color: record.status === 1 ? '#f5222d' : '#52c41a' }}>
              {record.status === 1 ? '停用' : '启用'}
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
      const newStatus = record.status === 1 ? 0 : 1;
      const response = await api.request('/api/assetType/updateAssetTypeState', {
        method: 'POST',
        params: {
          id: record.id,
          assetState: newStatus,
        },
      });
      if (response.code === 1) {
        const newStatusText = newStatus === 1 ? '启用' : '停用';
        message.success(`已${newStatusText}资产类型：${record.name}`);
        await loadAssetTypes(lastQuery, currentPage, pageSize);
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
        const response = await api.request('/api/assetType/updateAssetType', {
          method: 'POST',
          params: {
            id: editingAsset.id,
            assetCode: values.code,
            assetName: values.name,
            assetDesc: values.description,
            assetState: values.status,
          },
        });
        if (response.code === 1) {
          message.success('修改成功');
        } else {
          message.error('修改失败');
        }
      } else {
        const response = await api.request('/api/assetType/addAssetType', {
          method: 'POST',
          params: {
            assetCode: values.code,
            assetName: values.name,
            assetDesc: values.description,
            assetState: values.status,
          },
        });
        if (response.code === 1) {
          message.success('新增成功');
        } else {
          message.error('新增失败');
        }
      }
      
      setVisible(false);
      form.resetFields();
      await loadAssetTypes(lastQuery, currentPage, pageSize);
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
        <Form form={searchForm} layout="inline" onFinish={handleSearch}>
          <Form.Item name="assetCode">
            <Input placeholder="资产类型编码" style={{ width: 150 }} allowClear />
          </Form.Item>
          <Form.Item name="assetName">
            <Input placeholder="资产类型名称" style={{ width: 150 }} allowClear />
          </Form.Item>
          <Form.Item name="assetState">
            <Select placeholder="状态" allowClear style={{ width: 120 }} options={assetStateOptions} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>查询</Button>
              <Button onClick={handleReset}>重置</Button>
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                新增资产类型
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
      
      <div style={{ overflowX: 'auto' }}>
        <Table 
          columns={columns} 
          dataSource={assetTypes} 
          loading={loading}
          pagination={{ 
            pageSize: pageSize,
            current: currentPage,
            total,
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
              <Option value={1}>启用</Option>
              <Option value={0}>停用</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default FixedAssetsDictionary;