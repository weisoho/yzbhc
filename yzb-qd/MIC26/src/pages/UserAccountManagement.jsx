import { useState, useEffect } from 'react';
import { Card, Table, Form, Input, Select, Button, Space, Modal, Popconfirm, Switch, message, Tooltip } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import api from '../utils/api';

const { Option } = Select;

const UserAccountManagement = () => {
  const [visible, setVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();

  const departments = ['运营组', '内科', '外科', '儿科', '妇产科', '放射科'];
  const roles = ['超级管理员', '仓库管理员', '科室操作员', '普通用户'];
  const accountTypes = ['管理员', '操作员'];
  const warehouses = ['全部仓库', '仓库1', '仓库2', '仓库3'];

  // 加载用户列表
  const loadUsers = async () => {
    try {
      setLoading(true);
      // 调用实际的API
      const response = await api.get('/api/user/list');
      if (response.code === 1 && response.data) {
        // 转换数据格式以匹配前端需求
        const users = response.data.map(user => ({
          key: user.id,
          username: user.userName,
          name: user.realName,
          department: user.userDep || '未知部门',
          role: '普通用户', // 从角色表获取，暂时默认
          accountType: user.accountType || '操作员',
          status: user.status === 1 ? '启用' : '禁用',
          warehouse: user.warehouseScope || '全部仓库'
        }));
        setUsers(users);
      } else {
        message.error('加载用户列表失败');
      }
    } catch (error) {
      message.error('加载用户列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 检查用户名是否已存在
  const checkUsernameExists = async (username) => {
    try {
      // 调用实际的API检查用户名
      const response = await api.get(`/api/user/check-username?username=${username}`);
      return response.code === 1 && response.data;
    } catch (error) {
      return false;
    }
  };

  // 密码强度验证
  const validatePassword = (rule, value) => {
    if (!value) {
      return Promise.reject(new Error('请输入密码'));
    }
    if (value.length < 6) {
      return Promise.reject(new Error('密码长度不能少于6位'));
    }
    return Promise.resolve();
  };

  // 确认密码验证
  const validateConfirmPassword = ({ getFieldValue }) => ({
    validator(_, value) {
      if (!value || getFieldValue('password') === value) {
        return Promise.resolve();
      }
      return Promise.reject(new Error('两次输入的密码不一致'));
    },
  });

  // 组件加载时获取用户列表
  useEffect(() => {
    loadUsers();
  }, []);

  // 切换用户状态
  const handleToggleStatus = async (record) => {
    try {
      const newStatus = record.status === '启用' ? 0 : 1;
      const newStatusText = record.status === '启用' ? '禁用' : '启用';
      
      // 调用实际的API
      const response = await api.put(`/api/user/${record.key}/status`, newStatus);
      
      if (response.code === 1) {
        // 更新本地状态
        setUsers(prevUsers => 
          prevUsers.map(user => 
            user.key === record.key 
              ? { ...user, status: newStatusText }
              : user
          )
        );
        
        message.success(`用户已${newStatusText}`);
      } else {
        message.error('状态切换失败');
      }
    } catch (error) {
      message.error('状态切换失败');
    }
  };

  // 删除用户
  const handleDeleteUser = async (record) => {
    try {
      // 调用实际的API
      const response = await api.delete(`/api/user/${record.key}`);
      
      if (response.code === 1) {
        setUsers(prevUsers => prevUsers.filter(user => user.key !== record.key));
        message.success('用户删除成功');
      } else {
        message.error('用户删除失败');
      }
    } catch (error) {
      message.error('用户删除失败');
    }
  };

  // 打开编辑用户弹窗
  const handleEditUser = (record) => {
    setCurrentUser(record);
    setEditVisible(true);
    
    // 填充表单数据
    form.setFieldsValue({
      username: record.username,
      name: record.name,
      department: record.department,
      role: record.role,
      accountType: record.accountType,
      warehouse: record.warehouse,
      status: record.status
    });
  };

  // 保存编辑后的用户信息
  const handleUpdateUser = async (values) => {
    try {
      setLoading(true);

      // 构建更新的用户数据
      const updateData = {
        userName: values.username,
        realName: values.name,
        userDep: values.department,
        accountType: values.accountType,
        warehouseScope: values.warehouse,
        status: values.status === '启用' ? 1 : 0
      };

      // 调用实际的API
      const response = await api.put(`/api/user/${currentUser.key}`, updateData);

      if (response.code === 1) {
        // 更新用户列表
        setUsers(prevUsers => 
          prevUsers.map(user => 
            user.key === currentUser.key 
              ? { 
                  ...user, 
                  username: values.username,
                  name: values.name,
                  department: values.department,
                  accountType: values.accountType,
                  warehouse: values.warehouse,
                  status: values.status
                }
              : user
          )
        );

        message.success('用户信息更新成功');
        setEditVisible(false);
        form.resetFields();
        setCurrentUser(null);
      } else {
        message.error('更新用户信息失败');
      }
    } catch (error) {
      message.error('更新用户信息失败');
    } finally {
      setLoading(false);
    }
  };

  // 打开修改密码弹窗
  const handleChangePassword = (record) => {
    setCurrentUser(record);
    setPasswordVisible(true);
    
    // 模拟获取当前密码（实际应该从API获取）
    // const response = await api.get(`/users/${record.key}/password`);
    const mockPassword = 'password123'; // 模拟当前密码
    setCurrentPassword(mockPassword);
    
    // 重置表单
    passwordForm.resetFields();
  };

  // 修改密码
  const handleUpdatePassword = async (values) => {
    try {
      setLoading(true);

      // 调用实际的API
      const response = await api.put(`/api/user/${currentUser.key}/password`, values.newPassword);

      if (response.code === 1) {
        message.success('密码修改成功');
        setPasswordVisible(false);
        passwordForm.resetFields();
        setCurrentUser(null);
        setCurrentPassword('');
      } else {
        message.error('密码修改失败');
      }
    } catch (error) {
      message.error('密码修改失败');
    } finally {
      setLoading(false);
    }
  };

  // 重置密码为默认值
  const handleResetPassword = async () => {
    try {
      setLoading(true);
      const defaultPassword = '000000';

      // 调用实际的API
      const response = await api.put(`/api/user/${currentUser.key}/password/reset`);

      if (response.code === 1) {
        message.success(`密码已重置为：${defaultPassword}`);
        setPasswordVisible(false);
        passwordForm.resetFields();
        setCurrentUser(null);
        setCurrentPassword('');
      } else {
        message.error('密码重置失败');
      }
    } catch (error) {
      message.error('密码重置失败');
    } finally {
      setLoading(false);
    }
  };

  // 创建新用户
  const handleCreateUser = async (values) => {
    try {
      setLoading(true);
      
      // 检查用户名是否已存在
      const usernameExists = await checkUsernameExists(values.username);
      if (usernameExists) {
        message.error('用户名已存在，请选择其他用户名');
        return;
      }

      // 构建用户数据
      const userData = {
        userName: values.username,
        realName: values.name,
        password: values.password,
        userDep: values.department,
        accountType: values.accountType,
        warehouseScope: values.warehouse,
        status: 1 // 启用状态
      };

      // 调用实际的API
      const response = await api.post('/api/user', userData);
      
      if (response.code === 1) {
        // 重新加载用户列表以获取新用户
        await loadUsers();
        message.success('用户创建成功');
        setVisible(false);
        form.resetFields();
      } else {
        message.error('创建用户失败');
      }
    } catch (error) {
      message.error('创建用户失败');
    } finally {
      setLoading(false);
    }
  };

  const userColumns = [
    { title: '用户名', dataIndex: 'username', key: 'username' },
    { title: '姓名', dataIndex: 'name', key: 'name' },
    { title: '所属部门', dataIndex: 'department', key: 'department' },
    { title: '角色', dataIndex: 'role', key: 'role' },
    { title: '账号属性', dataIndex: 'accountType', key: 'accountType' },
    { title: '管理仓库', dataIndex: 'warehouse', key: 'warehouse' },
    { 
      title: '状态', 
      dataIndex: 'status', 
      key: 'status',
      render: (status, record) => (
        <Tooltip title="点击切换状态">
          <Switch 
            checked={status === '启用'} 
            onChange={() => handleToggleStatus(record)}
          />
        </Tooltip>
      )
    },
    { 
      title: '操作', 
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => handleEditUser(record)}><EditOutlined />编辑</a>
          <a onClick={() => handleChangePassword(record)}>修改密码</a>
          <Popconfirm
            title="确定要删除这个用户吗？"
            onConfirm={() => handleDeleteUser(record)}
            okText="确定"
            cancelText="取消"
            description="删除后无法恢复，请谨慎操作"
            icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
          >
            <a style={{ color: 'red' }}><DeleteOutlined />删除</a>
          </Popconfirm>
        </Space>
      )
    },
  ];

  return (
    <div style={{ padding: '0 16px' }}>
      <h1 style={{ marginBottom: 24 }}>用户账户管理</h1>
      
      <Card style={{ marginBottom: 16 }}>
        <Space wrap style={{ width: '100%' }}>
          <Input placeholder="用户名/姓名" style={{ width: 200, minWidth: '120px' }} />
          <Select placeholder="所属部门" style={{ width: 150, minWidth: '100px' }}>
            {departments.map((dept, index) => (
              <Option key={index} value={dept}>{dept}</Option>
            ))}
          </Select>
          <Select placeholder="角色" style={{ width: 150, minWidth: '100px' }}>
            {roles.map((role, index) => (
              <Option key={index} value={role}>{role}</Option>
            ))}
          </Select>
          <Button type="primary" icon={<SearchOutlined />}>查询</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setVisible(true)}>
            新增用户
          </Button>
        </Space>
      </Card>
      
      <div style={{ overflowX: 'auto' }}>
        <Table 
          columns={userColumns} 
          dataSource={users} 
          loading={loading}
          pagination={{ 
            pageSize: 10,
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
        title="新增用户"
        open={visible}
        onOk={() => {
          form.validateFields().then((values) => {
            handleCreateUser(values);
          });
        }}
        onCancel={() => {
          setVisible(false);
          form.resetFields();
        }}
        okText="确定"
        cancelText="取消"
        confirmLoading={loading}
        destroyOnHidden
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="username"
            label="用户名"
            rules={[
              { required: true, message: '请输入用户名' },
              { min: 3, max: 20, message: '用户名长度应在3-20个字符之间' },
              { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能包含字母、数字和下划线' },
              {
                validator: async (_, value) => {
                  if (value && value.length >= 3) {
                    const exists = await checkUsernameExists(value);
                    if (exists) {
                      throw new Error('用户名已存在，请选择其他用户名');
                    }
                  }
                }
              }
            ]}
            validateTrigger="onBlur"
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>
          
          <Form.Item
            name="name"
            label="姓名"
            rules={[
              { required: true, message: '请输入姓名' },
              { min: 2, max: 10, message: '姓名长度应在2-10个字符之间' }
            ]}
          >
            <Input placeholder="请输入姓名" />
          </Form.Item>
          
          <Form.Item
            name="password"
            label="密码"
            rules={[
              { validator: validatePassword }
            ]}
            hasFeedback
          >
            <Input.Password 
              placeholder="请输入密码（至少6位）" 
            />
          </Form.Item>
          
          <Form.Item
            name="confirmPassword"
            label="确认密码"
            dependencies={['password']}
            rules={[
              { required: true, message: '请确认密码' },
              validateConfirmPassword
            ]}
            hasFeedback
          >
            <Input.Password placeholder="请再次输入密码" />
          </Form.Item>
          
          <Form.Item
            name="department"
            label="所属部门"
            rules={[{ required: true, message: '请选择所属部门' }]}
          >
            <Select placeholder="请选择所属部门" showSearch>
              {departments.map((dept, index) => (
                <Option key={index} value={dept}>{dept}</Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="role"
            label="角色"
            rules={[{ required: true, message: '请选择角色' }]}
          >
            <Select placeholder="请选择角色" showSearch>
              {roles.map((role, index) => (
                <Option key={index} value={role}>{role}</Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="accountType"
            label="账号属性"
            rules={[{ required: true, message: '请选择账号属性' }]}
          >
            <Select placeholder="请选择账号属性" showSearch>
              {accountTypes.map((type, index) => (
                <Option key={index} value={type}>{type}</Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="warehouse"
            label="可管理仓库"
            rules={[{ required: true, message: '请选择可管理仓库' }]}
          >
            <Select placeholder="请选择可管理仓库" showSearch>
              {warehouses.map((warehouse, index) => (
                <Option key={index} value={warehouse}>{warehouse}</Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* 编辑用户模态框 */}
      <Modal
        title="编辑用户"
        open={editVisible}
        onOk={() => {
          form.validateFields().then((values) => {
            handleUpdateUser(values);
          });
        }}
        onCancel={() => {
          setEditVisible(false);
          form.resetFields();
          setCurrentUser(null);
        }}
        okText="确定"
        cancelText="取消"
        confirmLoading={loading}
        destroyOnHidden
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="username"
            label="用户名"
            rules={[
              { required: true, message: '请输入用户名' },
              { min: 3, max: 20, message: '用户名长度应在3-20个字符之间' },
              { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能包含字母、数字和下划线' }
            ]}
            validateTrigger="onBlur"
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>
          
          <Form.Item
            name="name"
            label="姓名"
            rules={[
              { required: true, message: '请输入姓名' },
              { min: 2, max: 10, message: '姓名长度应在2-10个字符之间' }
            ]}
          >
            <Input placeholder="请输入姓名" />
          </Form.Item>
          
          <Form.Item
            name="department"
            label="所属部门"
            rules={[{ required: true, message: '请选择所属部门' }]}
          >
            <Select placeholder="请选择所属部门" showSearch>
              {departments.map((dept, index) => (
                <Option key={index} value={dept}>{dept}</Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="role"
            label="角色"
            rules={[{ required: true, message: '请选择角色' }]}
          >
            <Select placeholder="请选择角色" showSearch>
              {roles.map((role, index) => (
                <Option key={index} value={role}>{role}</Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="accountType"
            label="账号属性"
            rules={[{ required: true, message: '请选择账号属性' }]}
          >
            <Select placeholder="请选择账号属性" showSearch>
              {accountTypes.map((type, index) => (
                <Option key={index} value={type}>{type}</Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="warehouse"
            label="可管理仓库"
            rules={[{ required: true, message: '请选择可管理仓库' }]}
          >
            <Select placeholder="请选择可管理仓库" showSearch>
              {warehouses.map((warehouse, index) => (
                <Option key={index} value={warehouse}>{warehouse}</Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="status"
            label="用户状态"
            rules={[{ required: true, message: '请选择用户状态' }]}
          >
            <Select placeholder="请选择用户状态">
              <Option value="启用">启用</Option>
              <Option value="禁用">禁用</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* 修改密码模态框 */}
      <Modal
        title={`修改密码 - ${currentUser?.name || ''}`}
        open={passwordVisible}
        onCancel={() => {
          setPasswordVisible(false);
          passwordForm.resetFields();
          setCurrentUser(null);
          setCurrentPassword('');
        }}
        footer={null}
        destroyOnHidden
      >
        <Form form={passwordForm} layout="vertical">
          <Form.Item
            label="当前密码"
          >
            <Input.Password 
              value={currentPassword} 
              disabled 
              placeholder="当前密码"
            />
          </Form.Item>
          
          <Form.Item
            name="newPassword"
            label="新密码"
            rules={[
              { validator: validatePassword }
            ]}
            hasFeedback
          >
            <Input.Password 
              placeholder="请输入新密码（至少6位）" 
            />
          </Form.Item>
          
          <Form.Item
            name="confirmNewPassword"
            label="确认新密码"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: '请确认新密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'));
                },
              }),
            ]}
            hasFeedback
          >
            <Input.Password placeholder="请再次输入新密码" />
          </Form.Item>
          
          <div style={{ display: 'flex', gap: '8px', marginTop: '24px' }}>
            <Button 
              type="primary" 
              onClick={() => {
                passwordForm.validateFields().then((values) => {
                  handleUpdatePassword(values);
                });
              }}
              loading={loading}
            >
              修改密码
            </Button>
            
            <Popconfirm
              title="确定要重置密码吗？"
              description="重置后密码将变为：000000"
              onConfirm={handleResetPassword}
              okText="确定"
              cancelText="取消"
              icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
            >
              <Button 
                danger 
                loading={loading}
              >
                重置密码
              </Button>
            </Popconfirm>
            
            <Button onClick={() => {
              setPasswordVisible(false);
              passwordForm.resetFields();
              setCurrentUser(null);
              setCurrentPassword('');
            }}>
              取消
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default UserAccountManagement;
