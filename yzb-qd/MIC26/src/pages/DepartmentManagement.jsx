import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Input, Select, Space, Tag, message, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
import api from '../utils/api';

const { Option } = Select;

const DepartmentManagement = () => {
  const [departments, setDepartments] = useState([]);
  const [roleOptions, setRoleOptions] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [form] = Form.useForm();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);

  // 加载部门列表
  useEffect(() => {
    loadDepartments();
    loadRoleOptions();
  }, [currentPage, pageSize]);

  const loadDepartments = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/department/list', {
        pageNum: currentPage,
        pageSize: pageSize
      });
      if (response.code === 1 && response.data) {
        setDepartments(response.data.records || []);
      }
    } catch (error) {
      message.error('加载部门列表失败');
    } finally {
      setLoading(false);
    }
  };

  const loadRoleOptions = async () => {
    try {
      const response = await api.get('/api/role/list');
      if (response.code === 1 && response.data) {
        setRoleOptions(response.data.map(role => ({
          label: role.name,
          value: role.id
        })));
      }
    } catch (error) {
      message.error('加载角色选项失败');
    }
  };

  const columns = [
    {
      title: '部门名称',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 500, color: '#262626' }}>{text}</div>
          <div style={{ fontSize: 12, color: '#8c8c8c' }}>{record.description}</div>
        </div>
      ),
    },
    {
      title: '部门经理',
      dataIndex: 'manager',
      key: 'manager',
      render: (manager) => (
        <Tag color="blue" icon={<UserOutlined />}>{manager}</Tag>
      ),
    },
    {
      title: '员工数量',
      dataIndex: 'employeeCount',
      key: 'employeeCount',
      render: (count) => <span style={{ color: '#52c41a', fontWeight: 500 }}>{count} 人</span>,
    },
    {
      title: '角色设置',
      dataIndex: 'roles',
      key: 'roles',
      render: (roles) => (
        <div style={{ maxWidth: 300 }}>
          {roles.map((role, index) => (
            <Tag key={index} color="green" style={{ marginBottom: 4 }}>
              {role}
            </Tag>
          ))}
        </div>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            style={{ color: '#1890ff' }}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定删除这个部门吗？"
            description="删除后无法恢复，请谨慎操作。"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="text"
              icon={<DeleteOutlined />}
              danger
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingDepartment(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (department) => {
    setEditingDepartment(department);
    form.setFieldsValue({
      name: department.name,
      description: department.description,
      manager: department.manager,
      roles: department.roles
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const response = await api.delete(`/api/department/${id}`);
      if (response.code === 1) {
        message.success('删除成功');
        loadDepartments();
      } else {
        message.error('删除失败');
      }
    } catch (error) {
      message.error('删除失败');
    } finally {
      setLoading(false);
    }
  };

  const handleModalOk = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      
      if (editingDepartment) {
        // 编辑模式
        const response = await api.put(`/api/department/${editingDepartment.id}`, values);
        if (response.code === 1) {
          message.success('部门信息更新成功');
          loadDepartments();
        } else {
          message.error('更新失败');
        }
      } else {
        // 新增模式
        const response = await api.post('/api/department', values);
        if (response.code === 1) {
          message.success('新增部门成功');
          loadDepartments();
        } else {
          message.error('新增失败');
        }
      }
      
      setIsModalVisible(false);
    } catch (error) {
      message.error('操作失败');
    } finally {
      setLoading(false);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div style={{ padding: '0 16px' }}>
      <div style={{ 
        marginBottom: 24, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        <h1 style={{ margin: 0 }}>部门管理</h1>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={handleAdd}
          style={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none'
          }}
        >
          新增部门
        </Button>
      </div>

      <Card style={{ borderRadius: 12 }}>
        <Table
          columns={columns}
          dataSource={departments}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: pageSize,
            current: currentPage,
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            },
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 个部门`,
            style: {
              display: 'flex',
              justifyContent: 'center',
              marginTop: '16px'
            }
          }}
          size="small"
          scroll={{ x: 800 }}
        />
      </Card>

      <Modal
        title={editingDepartment ? "编辑部门" : "新增部门"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={600}
        okText="保存"
        cancelText="取消"
        destroyOnHidden
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            roles: []
          }}
        >
          <Form.Item
            name="name"
            label="部门名称"
            rules={[
              { required: true, message: '请输入部门名称' },
              { max: 50, message: '部门名称不能超过50个字符' }
            ]}
          >
            <Input placeholder="请输入部门名称" />
          </Form.Item>

          <Form.Item
            name="description"
            label="部门描述"
            rules={[
              { required: true, message: '请输入部门描述' },
              { max: 200, message: '部门描述不能超过200个字符' }
            ]}
          >
            <Input.TextArea 
              placeholder="请输入部门描述" 
              rows={3}
              showCount
              maxLength={200}
            />
          </Form.Item>

          <Form.Item
            name="manager"
            label="部门经理"
            rules={[
              { required: true, message: '请输入部门经理' }
            ]}
          >
            <Input placeholder="请输入部门经理姓名" />
          </Form.Item>

          <Form.Item
            name="roles"
            label="角色设置"
            rules={[
              { required: true, message: '请选择至少一个角色' }
            ]}
          >
            <Select
              mode="multiple"
              placeholder="请选择该部门下的角色"
              style={{ width: '100%' }}
              options={roleOptions.map(role => ({
                label: role,
                value: role
              }))}
              maxTagCount={5}
              maxTagPlaceholder={(omittedValues) => `+${omittedValues.length}个角色...`}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DepartmentManagement;