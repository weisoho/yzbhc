import React, { useState } from 'react';
import { Card, Table, Button, Modal, Form, Input, Select, Space, Tag, message, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';

const { Option } = Select;

const DepartmentManagement = () => {
  const [departments, setDepartments] = useState([
    {
      id: '1',
      name: '运营部',
      description: '负责日常运营管理',
      manager: '张三',
      employeeCount: 15,
      roles: ['运营经理', '运营专员', '数据分析师']
    },
    {
      id: '2',
      name: '技术部',
      description: '负责系统开发和维护',
      manager: '李四',
      employeeCount: 8,
      roles: ['技术总监', '前端工程师', '后端工程师', '测试工程师']
    },
    {
      id: '3',
      name: '采购部',
      description: '负责采购业务管理',
      manager: '王五',
      employeeCount: 6,
      roles: ['采购经理', '采购专员', '供应商管理']
    }
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [form] = Form.useForm();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // 预设的角色选项
  const roleOptions = [
    '部门经理', '副经理', '主管', '专员', '助理',
    '技术总监', '前端工程师', '后端工程师', '测试工程师',
    '采购经理', '采购专员', '供应商管理', '质量控制',
    '运营经理', '运营专员', '数据分析师', '市场专员',
    '财务经理', '会计', '出纳', '人事专员'
  ];

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

  const handleDelete = (id) => {
    setDepartments(departments.filter(dept => dept.id !== id));
    message.success('删除成功');
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingDepartment) {
        // 编辑模式
        setDepartments(departments.map(dept => 
          dept.id === editingDepartment.id 
            ? { 
                ...dept, 
                ...values,
                employeeCount: Math.floor(Math.random() * 20) + 1 // 模拟员工数量变化
              }
            : dept
        ));
        message.success('部门信息更新成功');
      } else {
        // 新增模式
        const newDepartment = {
          id: Date.now().toString(),
          ...values,
          employeeCount: Math.floor(Math.random() * 20) + 1,
        };
        setDepartments([...departments, newDepartment]);
        message.success('新增部门成功');
      }
      
      setIsModalVisible(false);
    } catch (error) {
      console.log('Failed:', error);
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