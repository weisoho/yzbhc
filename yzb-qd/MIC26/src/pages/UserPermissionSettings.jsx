import React, { useState, useEffect } from 'react';
import { Card, Select, Button, Space, Tree, message, Checkbox, Form, Modal } from 'antd';
import api from '../utils/api';

const { Option } = Select;
const { TreeNode } = Tree;

const UserPermissionSettings = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checkedKeys, setCheckedKeys] = useState([]);
  const [roleModalVisible, setRoleModalVisible] = useState(false);
  const [roleForm] = Form.useForm();

  // 加载用户列表
  useEffect(() => {
    loadUsers();
    loadRoles();
    loadPermissions();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await api.get('/api/user/list');
      if (response.code === 1 && response.data) {
        setUsers(response.data);
      }
    } catch (error) {
      message.error('加载用户列表失败');
    }
  };

  const loadRoles = async () => {
    try {
      const response = await api.get('/api/role/list');
      if (response.code === 1 && response.data) {
        setRoles(response.data);
      }
    } catch (error) {
      message.error('加载角色列表失败');
    }
  };

  const loadPermissions = async () => {
    try {
      const response = await api.get('/api/permission/tree');
      if (response.code === 1 && response.data) {
        setPermissions(response.data);
      }
    } catch (error) {
      message.error('加载权限列表失败');
    }
  };

  const handleUserSelect = async (userId) => {
    try {
      setLoading(true);
      const response = await api.get(`/api/role/user/${userId}`);
      if (response.code === 1 && response.data && response.data.length > 0) {
        setSelectedRole(response.data[0].id);
        // 加载角色权限
        await handleRoleSelect(response.data[0].id);
      } else {
        setSelectedRole(null);
        setCheckedKeys([]);
      }
      setSelectedUser(userId);
    } catch (error) {
      message.error('获取用户角色失败');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleSelect = async (roleId) => {
    try {
      setLoading(true);
      const response = await api.get(`/api/permission/role/${roleId}`);
      if (response.code === 1 && response.data) {
        const permissionIds = response.data.map(p => p.id.toString());
        setCheckedKeys(permissionIds);
      }
      setSelectedRole(roleId);
    } catch (error) {
      message.error('获取角色权限失败');
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionSave = async () => {
    if (!selectedRole) {
      message.error('请选择角色');
      return;
    }

    try {
      setLoading(true);
      const response = await api.post(`/api/role/${selectedRole}/permissions`, checkedKeys.map(key => parseInt(key)));
      if (response.code === 1) {
        message.success('权限保存成功');
      } else {
        message.error('权限保存失败');
      }
    } catch (error) {
      message.error('权限保存失败');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleCreate = async (values) => {
    try {
      setLoading(true);
      const response = await api.post('/api/role', { name: values.roleName });
      if (response.code === 1) {
        message.success('角色创建成功');
        setRoleModalVisible(false);
        roleForm.resetFields();
        loadRoles();
      } else {
        message.error('角色创建失败');
      }
    } catch (error) {
      message.error('角色创建失败');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleAssign = async () => {
    if (!selectedUser || !selectedRole) {
      message.error('请选择用户和角色');
      return;
    }

    try {
      setLoading(true);
      const response = await api.post(`/api/role/user/${selectedUser}/roles`, [parseInt(selectedRole)]);
      if (response.code === 1) {
        message.success('角色分配成功');
      } else {
        message.error('角色分配失败');
      }
    } catch (error) {
      message.error('角色分配失败');
    } finally {
      setLoading(false);
    }
  };

  const renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={item.name} key={item.id}>
            {renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={item.name} key={item.id} />;
    });
  };

  return (
    <div style={{ padding: '0 16px' }}>
      <h1 style={{ marginBottom: 24 }}>用户权限设定</h1>
      
      <Card style={{ marginBottom: 16 }}>
        <Space wrap style={{ marginBottom: 16, width: '100%' }}>
          <Select 
            placeholder="选择用户" 
            style={{ width: 200, minWidth: '150px' }} 
            onChange={handleUserSelect}
            loading={loading}
          >
            {users.map((user) => (
              <Option key={user.id} value={user.id}>{user.realName} ({user.userName})</Option>
            ))}
          </Select>
          <Select 
            placeholder="选择角色" 
            style={{ width: 200, minWidth: '150px' }} 
            onChange={handleRoleSelect}
            value={selectedRole}
            loading={loading}
          >
            {roles.map((role) => (
              <Option key={role.id} value={role.id}>{role.name}</Option>
            ))}
          </Select>
          <Button type="primary" onClick={() => setRoleModalVisible(true)}>创建角色</Button>
          <Button type="primary" onClick={handleRoleAssign}>分配角色</Button>
        </Space>
      </Card>
      
      <Card>
        <h3>权限设置</h3>
        <div style={{ padding: '16px 0', maxHeight: 400, overflow: 'auto' }}>
          <Tree
            checkable
            onCheck={(checkedKeys) => setCheckedKeys(checkedKeys)}
            checkedKeys={checkedKeys}
            treeData={permissions}
          />
        </div>
        
        <Space style={{ marginTop: 16 }}>
          <Button type="primary" onClick={handlePermissionSave} loading={loading}>保存权限</Button>
          <Button onClick={() => setCheckedKeys([])}>重置</Button>
        </Space>
      </Card>

      <Modal
        title="创建角色"
        open={roleModalVisible}
        onOk={() => {
          roleForm.validateFields().then((values) => {
            handleRoleCreate(values);
          });
        }}
        onCancel={() => {
          setRoleModalVisible(false);
          roleForm.resetFields();
        }}
        okText="确定"
        cancelText="取消"
        confirmLoading={loading}
      >
        <Form form={roleForm} layout="vertical">
          <Form.Item
            name="roleName"
            label="角色名称"
            rules={[{ required: true, message: '请输入角色名称' }]}
          >
            <input placeholder="请输入角色名称" style={{ width: '100%', padding: '8px' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserPermissionSettings;
