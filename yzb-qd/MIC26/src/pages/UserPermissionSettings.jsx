import { useEffect, useMemo, useState } from 'react';
import { Button, Card, Form, Input, Modal, Select, Space, Tree, message } from 'antd';
import api from '../utils/api';
import { normalizeDepartmentTree } from '../utils/departmentTree';

const DATA_SCOPE_OPTIONS = [
  { label: '全部数据', value: 1 },
  { label: '本部门及以下', value: 2 },
  { label: '本部门', value: 3 },
  { label: '仅本人', value: 4 },
  { label: '自定义部门', value: 5 },
];

const STATUS_OPTIONS = [
  { label: '启用', value: 1 },
  { label: '禁用', value: 0 },
];

const mapPermissionTree = (nodes = []) => nodes.map((node) => ({
  title: node.name,
  key: String(node.id),
  value: node.id,
  children: mapPermissionTree(node.children || []),
}));

const UserPermissionSettings = () => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [departmentTree, setDepartmentTree] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState();
  const [selectedUserRoleIds, setSelectedUserRoleIds] = useState([]);
  const [selectedRoleId, setSelectedRoleId] = useState();
  const [checkedPermissionKeys, setCheckedPermissionKeys] = useState([]);
  const [checkedDepartmentKeys, setCheckedDepartmentKeys] = useState([]);
  const [roleModalVisible, setRoleModalVisible] = useState(false);
  const [roleForm] = Form.useForm();

  const selectedRole = useMemo(
    () => roles.find((role) => Number(role.id) === Number(selectedRoleId)) || null,
    [roles, selectedRoleId],
  );

  const permissionTreeData = useMemo(() => mapPermissionTree(permissions), [permissions]);
  const departmentTreeData = useMemo(() => normalizeDepartmentTree(departmentTree), [departmentTree]);

  const loadUsers = async () => {
    const response = await api.get('/api/user/list');
    if (response.code !== 1 || !Array.isArray(response.data)) {
      throw new Error(response.message || '加载用户列表失败');
    }
    setUsers(response.data);
  };

  const loadRoles = async () => {
    const response = await api.get('/api/role/list');
    if (response.code !== 1 || !Array.isArray(response.data)) {
      throw new Error(response.message || '加载角色列表失败');
    }
    setRoles(response.data);
  };

  const loadPermissions = async () => {
    const response = await api.get('/api/permission/tree');
    if (response.code !== 1 || !Array.isArray(response.data)) {
      throw new Error(response.message || '加载权限树失败');
    }
    setPermissions(response.data);
  };

  const loadDepartments = async () => {
    const response = await api.get('/api/department/tree');
    if (response.code !== 1 || !Array.isArray(response.data)) {
      throw new Error(response.message || '加载部门树失败');
    }
    setDepartmentTree(response.data);
  };

  const loadRolePermissionDetail = async (roleId) => {
    if (!roleId) {
      setCheckedPermissionKeys([]);
      setCheckedDepartmentKeys([]);
      return;
    }

    const [permissionResponse, departmentResponse] = await Promise.all([
      api.get(`/api/permission/role/${roleId}`),
      api.get(`/api/department/role/${roleId}/selected-ids`),
    ]);

    if (permissionResponse.code !== 1) {
      throw new Error(permissionResponse.message || '加载角色权限失败');
    }
    if (departmentResponse.code !== 1) {
      throw new Error(departmentResponse.message || '加载角色数据权限失败');
    }

    setCheckedPermissionKeys((permissionResponse.data || []).map((item) => String(item.id)));
    setCheckedDepartmentKeys(Array.from(departmentResponse.data || []).map((item) => String(item)));
  };

  const loadInitialData = async () => {
    try {
      setLoading(true);
      await Promise.all([loadUsers(), loadRoles(), loadPermissions(), loadDepartments()]);
    } catch (error) {
      message.error(error.message || '加载系统管理数据失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const handleUserChange = (userId) => {
    setSelectedUserId(userId);
    const user = users.find((item) => Number(item.id) === Number(userId));
    setSelectedUserRoleIds(user?.roleIds || []);
  };

  const handleRoleChange = async (roleId) => {
    try {
      setLoading(true);
      setSelectedRoleId(roleId);
      await loadRolePermissionDetail(roleId);
    } catch (error) {
      message.error(error.message || '加载角色权限失败');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignRolesToUser = async () => {
    if (!selectedUserId) {
      message.error('请先选择用户');
      return;
    }

    try {
      setLoading(true);
      const response = await api.post(`/api/role/user/${selectedUserId}/roles`, selectedUserRoleIds);
      if (response.code !== 1) {
        throw new Error(response.message || '分配角色失败');
      }
      await loadUsers();
      message.success('用户角色分配成功');
    } catch (error) {
      message.error(error.message || '分配角色失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRolePermissions = async () => {
    if (!selectedRoleId) {
      message.error('请先选择角色');
      return;
    }

    try {
      setLoading(true);
      const permissionResponse = await api.post(
        `/api/role/${selectedRoleId}/permissions`,
        checkedPermissionKeys.map((key) => Number(key)),
      );
      if (permissionResponse.code !== 1) {
        throw new Error(permissionResponse.message || '保存角色权限失败');
      }

      if (selectedRole?.dataScope === 5) {
        const departmentResponse = await api.post(
          `/api/role/${selectedRoleId}/departments`,
          checkedDepartmentKeys.map((key) => Number(key)),
        );
        if (departmentResponse.code !== 1) {
          throw new Error(departmentResponse.message || '保存角色数据权限失败');
        }
      }

      message.success('角色权限保存成功');
    } catch (error) {
      message.error(error.message || '角色权限保存失败');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRole = async () => {
    try {
      const values = await roleForm.validateFields();
      setLoading(true);
      const response = await api.post('/api/role', values);
      if (response.code !== 1) {
        throw new Error(response.message || '创建角色失败');
      }
      message.success('角色创建成功');
      setRoleModalVisible(false);
      roleForm.resetFields();
      await loadRoles();
    } catch (error) {
      if (error?.errorFields) {
        return;
      }
      message.error(error.message || '创建角色失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '0 16px' }}>
      <h1 style={{ marginBottom: 24 }}>用户权限设定</h1>

      <Card title="用户角色分配" style={{ marginBottom: 16 }}>
        <Space wrap>
          <Select
            showSearch
            optionFilterProp="label"
            placeholder="请选择用户"
            style={{ width: 260 }}
            value={selectedUserId}
            onChange={handleUserChange}
            options={users.map((user) => ({
              label: `${user.realName} (${user.userName})`,
              value: user.id,
            }))}
          />
          <Select
            mode="multiple"
            showSearch
            optionFilterProp="label"
            placeholder="请选择角色"
            style={{ width: 320 }}
            value={selectedUserRoleIds}
            onChange={setSelectedUserRoleIds}
            options={roles.map((role) => ({ label: role.roleName, value: role.id }))}
          />
          <Button type="primary" onClick={handleAssignRolesToUser} loading={loading}>保存用户角色</Button>
        </Space>
      </Card>

      <Card title="角色权限分配" extra={<Button onClick={() => setRoleModalVisible(true)}>新建角色</Button>}>
        <Space wrap style={{ marginBottom: 16 }}>
          <Select
            showSearch
            optionFilterProp="label"
            placeholder="请选择角色"
            style={{ width: 320 }}
            value={selectedRoleId}
            onChange={handleRoleChange}
            options={roles.map((role) => ({
              label: `${role.roleName} (${role.roleCode})`,
              value: role.id,
            }))}
          />
          {selectedRole ? <span>数据范围：{DATA_SCOPE_OPTIONS.find((item) => item.value === selectedRole.dataScope)?.label || '未设置'}</span> : null}
        </Space>

        <div style={{ padding: '8px 0 16px' }}>
          <div style={{ marginBottom: 8, fontWeight: 600 }}>功能权限</div>
          <Tree
            checkable
            checkedKeys={checkedPermissionKeys}
            onCheck={(keys) => setCheckedPermissionKeys(Array.isArray(keys) ? keys : keys.checked)}
            treeData={permissionTreeData}
            height={420}
          />
        </div>

        {selectedRole?.dataScope === 5 ? (
          <div style={{ paddingTop: 8 }}>
            <div style={{ marginBottom: 8, fontWeight: 600 }}>自定义部门范围</div>
            <Tree
              checkable
              checkedKeys={checkedDepartmentKeys}
              onCheck={(keys) => setCheckedDepartmentKeys(Array.isArray(keys) ? keys : keys.checked)}
              treeData={departmentTreeData}
              height={320}
            />
          </div>
        ) : null}

        <Space style={{ marginTop: 16 }}>
          <Button type="primary" onClick={handleSaveRolePermissions} loading={loading}>保存角色权限</Button>
          <Button onClick={() => {
            setCheckedPermissionKeys([]);
            setCheckedDepartmentKeys([]);
          }}>清空选择</Button>
        </Space>
      </Card>

      <Modal
        title="新建角色"
        open={roleModalVisible}
        onOk={handleCreateRole}
        onCancel={() => {
          setRoleModalVisible(false);
          roleForm.resetFields();
        }}
        okText="确定"
        cancelText="取消"
        confirmLoading={loading}
        destroyOnHidden
      >
        <Form form={roleForm} layout="vertical" initialValues={{ dataScope: 4, status: 1, sortOrder: roles.length + 1 }}>
          <Form.Item name="roleName" label="角色名称" rules={[{ required: true, message: '请输入角色名称' }]}>
            <Input placeholder="请输入角色名称" />
          </Form.Item>
          <Form.Item name="roleCode" label="角色编码" rules={[{ required: true, message: '请输入角色编码' }]}>
            <Input placeholder="请输入角色编码，如 DEPT_OPERATOR" />
          </Form.Item>
          <Form.Item name="roleDesc" label="角色说明">
            <Input.TextArea rows={3} placeholder="请输入角色说明" />
          </Form.Item>
          <Form.Item name="dataScope" label="数据范围" rules={[{ required: true, message: '请选择数据范围' }]}>
            <Select options={DATA_SCOPE_OPTIONS} />
          </Form.Item>
          <Form.Item name="status" label="状态" rules={[{ required: true, message: '请选择状态' }]}>
            <Select options={STATUS_OPTIONS} />
          </Form.Item>
          <Form.Item name="sortOrder" label="排序">
            <Input type="number" placeholder="请输入排序值" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserPermissionSettings;
