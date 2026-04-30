import { useEffect, useMemo, useState } from 'react';
import {
  Button,
  Card,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Space,
  Switch,
  Table,
  Tag,
  message,
} from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import api from '../utils/api.js';
import { useCampusContext } from '../contexts/CampusContext.jsx';
import {
  findDepartmentById,
  flattenDepartmentTree,
  getCampusNodes,
  getDepartmentOptionsByCampus,
  normalizeDepartmentTree,
} from '../utils/departmentTree.js';

const DEFAULT_PASSWORD = '000000';

const STATUS_OPTIONS = [
  { label: '启用', value: 1 },
  { label: '禁用', value: 0 },
];

const UserAccountManagement = () => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [filters, setFilters] = useState({ keyword: '', depId: undefined, roleId: undefined });
  const [modalMode, setModalMode] = useState('create');
  const [modalOpen, setModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const selectedCampusId = Form.useWatch('campusId', form);
  const { currentCampusNode } = useCampusContext();

  const normalizedDepartments = useMemo(() => normalizeDepartmentTree(departments), [departments]);
  const campusOptions = useMemo(() => getCampusNodes(normalizedDepartments), [normalizedDepartments]);
  const loggedInUserInfo = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('userInfo') || '{}');
    } catch (error) {
      return {};
    }
  }, []);

  const departmentOptions = useMemo(() => {
    return flattenDepartmentTree(normalizedDepartments).filter((item) => item.orgType !== 'CAMPUS');
  }, [normalizedDepartments]);

  const currentLoginUser = useMemo(() => {
    const loginUserId = Number(loggedInUserInfo.id);
    if (loginUserId) {
      return users.find((item) => Number(item.id) === loginUserId) || null;
    }
    return users.find((item) => item.userName === loggedInUserInfo.userName) || null;
  }, [loggedInUserInfo.id, loggedInUserInfo.userName, users]);

  const currentUserRoleCodes = useMemo(() => {
    if (!currentLoginUser) {
      return [];
    }
    return (currentLoginUser.roleIds || [])
      .map((roleId) => roles.find((role) => Number(role.id) === Number(roleId))?.roleCode)
      .filter(Boolean);
  }, [currentLoginUser, roles]);

  const isSuperAdmin = currentUserRoleCodes.includes('SUPER_ADMIN');

  const modalDepartmentOptions = useMemo(() => {
    if (!campusOptions.length) {
      return departmentOptions;
    }
    const selectedCampus = campusOptions.find((item) => Number(item.id) === Number(selectedCampusId));
    if (selectedCampus) {
      return getDepartmentOptionsByCampus(selectedCampus);
    }
    if (!isSuperAdmin && currentCampusNode) {
      return getDepartmentOptionsByCampus(currentCampusNode);
    }
    return [];
  }, [campusOptions, currentCampusNode, departmentOptions, isSuperAdmin, selectedCampusId]);

  const roleOptions = useMemo(() => {
    return roles.filter((role) => {
      const enabled = role.status === 1 || role.status === undefined;
      if (!enabled) {
        return false;
      }
      if (!isSuperAdmin && role.roleCode === 'SUPER_ADMIN') {
        return false;
      }
      return true;
    });
  }, [isSuperAdmin, roles]);

  function resolveCampusIdByDepartmentId(deptId, campusTree = campusOptions) {
    if (!deptId) {
      return undefined;
    }
    const targetDepartmentId = Number(deptId);
    for (const campus of campusTree) {
      const campusDepartments = getDepartmentOptionsByCampus(campus);
      if (campusDepartments.some((item) => Number(item.id) === targetDepartmentId) || Number(campus.id) === targetDepartmentId) {
        return Number(campus.id);
      }
    }
    return undefined;
  }

  const loadUsers = async () => {
    const response = await api.get('/api/user/list');
    if (response.code !== 1 || !Array.isArray(response.data)) {
      throw new Error(response.message || '加载用户失败');
    }
    setUsers(response.data);
    return response.data;
  };

  const loadRoles = async () => {
    const response = await api.get('/api/role/list');
    if (response.code !== 1 || !Array.isArray(response.data)) {
      throw new Error(response.message || '加载角色失败');
    }
    setRoles(response.data);
  };

  const loadDepartments = async () => {
    const response = await api.get('/api/department/tree');
    if (response.code !== 1 || !Array.isArray(response.data)) {
      throw new Error(response.message || '加载部门失败');
    }
    setDepartments(response.data);
  };

  const loadPageData = async () => {
    try {
      setLoading(true);
      await Promise.all([loadUsers(), loadRoles(), loadDepartments()]);
    } catch (error) {
      message.error(error.message || '加载系统管理数据失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPageData();
  }, []);

  const filteredUsers = useMemo(() => {
    const keyword = filters.keyword.trim().toLowerCase();
    return users.filter((user) => {
      const hitKeyword = !keyword || [user.userName, user.realName, user.userDep, ...(user.roleNames || [])]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(keyword));
      const hitDepartment = !filters.depId || Number(user.depId) === Number(filters.depId);
      const hitRole = !filters.roleId || (user.roleIds || []).some((roleId) => Number(roleId) === Number(filters.roleId));
      const userCampusId = resolveCampusIdByDepartmentId(user.depId, campusOptions);
      const hitCampusScope = isSuperAdmin || !currentCampusNode || Number(userCampusId) === Number(currentCampusNode.id);
      return hitKeyword && hitDepartment && hitRole && hitCampusScope;
    });
  }, [campusOptions, currentCampusNode, filters, isSuperAdmin, users]);

  const openCreateModal = () => {
    setModalMode('create');
    setCurrentUser(null);
    form.resetFields();
    form.setFieldsValue({
      password: DEFAULT_PASSWORD,
      status: 1,
      roleIds: [],
      campusId: currentCampusNode?.id,
      depId: undefined,
      accountType: '普通账号',
      warehouseScope: '当前院区',
    });
    setModalOpen(true);
  };

  const openEditModal = (user) => {
    const userCampusId = resolveCampusIdByDepartmentId(user.depId);
    setModalMode('edit');
    setCurrentUser(user);
    form.setFieldsValue({
      userName: user.userName,
      realName: user.realName,
      campusId: userCampusId || currentCampusNode?.id,
      depId: user.depId,
      phone: user.phone,
      email: user.email,
      accountType: user.accountType,
      warehouseScope: user.warehouseScope,
      status: user.status,
      roleIds: user.roleIds || [],
    });
    setModalOpen(true);
  };

  const openPasswordModal = (user) => {
    setCurrentUser(user);
    passwordForm.resetFields();
    setPasswordModalOpen(true);
  };

  const checkUsernameExists = async (userName, excludeId) => {
    const response = await api.get('/api/user/check-username', { username: userName, excludeId });
    return response.code === 1 && response.data === true;
  };

  const assignRoles = async (userId, roleIds) => {
    const response = await api.post(`/api/role/user/${userId}/roles`, roleIds || []);
    if (response.code !== 1) {
      throw new Error(response.message || '角色分配失败');
    }
  };

  const handleSubmitUser = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const usernameExists = await checkUsernameExists(values.userName, currentUser?.id);
      if (usernameExists) {
        form.setFields([{ name: 'userName', errors: ['用户名已存在'] }]);
        return;
      }

      const selectedDepartment = modalDepartmentOptions.find((item) => Number(item.id) === Number(values.depId))
        || findDepartmentById(departmentOptions, values.depId);
      const payload = {
        userName: values.userName,
        realName: values.realName,
        password: values.password,
        userDep: selectedDepartment?.deptName || '',
        depId: values.depId,
        phone: values.phone,
        email: values.email,
        accountType: values.accountType,
        warehouseScope: values.warehouseScope,
        status: values.status,
      };

      if (modalMode === 'create') {
        const response = await api.post('/api/user', payload);
        if (response.code !== 1) {
          throw new Error(response.message || '创建用户失败');
        }
        const refreshedUsers = await loadUsers();
        const createdUser = refreshedUsers.find((item) => item.userName === values.userName);
        if (!createdUser) {
          throw new Error('未能定位新创建的用户');
        }
        try {
          await assignRoles(createdUser.id, values.roleIds);
          message.success(`用户创建成功，初始密码为 ${payload.password || DEFAULT_PASSWORD}`);
        } catch (assignError) {
          message.warning(assignError.message || '用户已创建，但角色分配失败，请在用户列表中补充角色');
        }
      } else {
        delete payload.password;
        const response = await api.put(`/api/user/${currentUser.id}`, payload);
        if (response.code !== 1) {
          throw new Error(response.message || '更新用户失败');
        }
        try {
          await assignRoles(currentUser.id, values.roleIds);
          message.success('用户更新成功');
        } catch (assignError) {
          message.warning(assignError.message || '用户信息已更新，但角色分配失败，请稍后重试');
        }
      }

      setModalOpen(false);
      setCurrentUser(null);
      form.resetFields();
      await loadUsers();
    } catch (error) {
      if (error?.errorFields) {
        return;
      }
      message.error(error.message || '保存用户失败');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (user) => {
    try {
      setLoading(true);
      const nextStatus = user.status === 1 ? 0 : 1;
      const response = await api.put(`/api/user/${user.id}/status`, nextStatus);
      if (response.code !== 1) {
        throw new Error(response.message || '切换状态失败');
      }
      await loadUsers();
      message.success(nextStatus === 1 ? '用户已启用' : '用户已禁用');
    } catch (error) {
      message.error(error.message || '切换状态失败');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (user) => {
    try {
      setLoading(true);
      const response = await api.delete(`/api/user/${user.id}`);
      if (response.code !== 1) {
        throw new Error(response.message || '删除用户失败');
      }
      await loadUsers();
      message.success('用户删除成功');
    } catch (error) {
      message.error(error.message || '删除用户失败');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    try {
      setLoading(true);
      const response = await api.put(`/api/user/${currentUser.id}/password/reset`);
      if (response.code !== 1) {
        throw new Error(response.message || '重置密码失败');
      }
      message.success(`密码已重置为 ${DEFAULT_PASSWORD}`);
      setPasswordModalOpen(false);
      setCurrentUser(null);
    } catch (error) {
      message.error(error.message || '重置密码失败');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    try {
      const values = await passwordForm.validateFields();
      setLoading(true);
      const response = await api.put(`/api/user/${currentUser.id}/password`, values.newPassword);
      if (response.code !== 1) {
        throw new Error(response.message || '修改密码失败');
      }
      message.success('密码修改成功');
      setPasswordModalOpen(false);
      setCurrentUser(null);
      passwordForm.resetFields();
    } catch (error) {
      if (error?.errorFields) {
        return;
      }
      message.error(error.message || '修改密码失败');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: '用户名',
      dataIndex: 'userName',
      key: 'userName',
      width: 140,
    },
    {
      title: '姓名',
      dataIndex: 'realName',
      key: 'realName',
      width: 120,
    },
    {
      title: '所属院区',
      key: 'campusName',
      width: 140,
      render: (_, record) => {
        const campusId = resolveCampusIdByDepartmentId(record.depId, campusOptions);
        const campus = campusOptions.find((item) => Number(item.id) === Number(campusId));
        return campus?.deptName || '-';
      },
    },
    {
      title: '所属部门',
      dataIndex: 'userDep',
      key: 'userDep',
      width: 140,
    },
    {
      title: '角色',
      key: 'roles',
      width: 220,
      render: (_, record) => (
        <Space size={[4, 4]} wrap>
          {(record.roleNames || []).length ? record.roleNames.map((roleName) => <Tag key={roleName}>{roleName}</Tag>) : <Tag>未分配</Tag>}
        </Space>
      ),
    },
    {
      title: '账号属性',
      dataIndex: 'accountType',
      key: 'accountType',
      width: 120,
    },
    {
      title: '仓库范围',
      dataIndex: 'warehouseScope',
      key: 'warehouseScope',
      width: 140,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (value, record) => (
        <Switch checked={value === 1} onChange={() => handleToggleStatus(record)} />
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 220,
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => openEditModal(record)}><EditOutlined />编辑</a>
          <a onClick={() => openPasswordModal(record)}>修改密码</a>
          <Popconfirm
            title="确定要删除这个用户吗？"
            description="删除后不可恢复，请谨慎操作。"
            okText="确定"
            cancelText="取消"
            icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
            onConfirm={() => handleDeleteUser(record)}
          >
            <a style={{ color: 'red' }}><DeleteOutlined />删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '0 16px' }}>
      <h1 style={{ marginBottom: 24 }}>用户账户管理</h1>

      <Card style={{ marginBottom: 16 }}>
        <Space wrap style={{ width: '100%' }}>
          <Input
            placeholder="用户名/姓名/部门/角色"
            value={filters.keyword}
            onChange={(event) => setFilters((prev) => ({ ...prev, keyword: event.target.value }))}
            style={{ width: 240 }}
          />
          <Select
            allowClear
            placeholder="所属部门"
            value={filters.depId}
            onChange={(value) => setFilters((prev) => ({ ...prev, depId: value }))}
            style={{ width: 180 }}
            options={departmentOptions.map((item) => ({ label: item.deptName, value: item.id }))}
          />
          <Select
            allowClear
            placeholder="角色"
            value={filters.roleId}
            onChange={(value) => setFilters((prev) => ({ ...prev, roleId: value }))}
            style={{ width: 180 }}
            options={roles.map((role) => ({ label: role.roleName, value: role.id }))}
          />
          <Button icon={<SearchOutlined />} onClick={() => setFilters((prev) => ({ ...prev }))}>查询</Button>
          <Button icon={<ReloadOutlined />} onClick={() => setFilters({ keyword: '', depId: undefined, roleId: undefined })}>重置</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>新增用户</Button>
        </Space>
      </Card>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={filteredUsers}
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条记录`,
        }}
        scroll={{ x: 1200 }}
        size="small"
      />

      <Modal
        title={modalMode === 'create' ? '新增用户' : '编辑用户'}
        open={modalOpen}
        onOk={handleSubmitUser}
        onCancel={() => {
          setModalOpen(false);
          setCurrentUser(null);
          form.resetFields();
        }}
        okText="确定"
        cancelText="取消"
        confirmLoading={loading}
        destroyOnHidden
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="userName"
            label="用户名"
            rules={[
              { required: true, message: '请输入用户名' },
              { min: 3, max: 20, message: '用户名长度需在 3 到 20 个字符之间' },
              { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能包含字母、数字和下划线' },
            ]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>
          <Form.Item name="realName" label="姓名" rules={[{ required: true, message: '请输入姓名' }]}>
            <Input placeholder="请输入姓名" />
          </Form.Item>
          {modalMode === 'create' ? (
            <Form.Item
              name="password"
              label="初始密码"
              rules={[{ required: true, message: '请输入初始密码' }, { min: 6, message: '密码至少 6 位' }]}
            >
              <Input.Password placeholder="请输入初始密码" />
            </Form.Item>
          ) : null}
          <Form.Item
            name="campusId"
            label="所属院区"
            rules={[{ required: true, message: '请选择所属院区' }]}
            extra={isSuperAdmin ? '系统超管可切换院区后再选择部门。' : '当前账号仅能在当前院区内创建和维护用户。'}
          >
            <Select
              showSearch
              optionFilterProp="label"
              placeholder="请选择所属院区"
              disabled={!isSuperAdmin}
              onChange={() => form.setFieldValue('depId', undefined)}
              options={(isSuperAdmin ? campusOptions : (currentCampusNode ? [currentCampusNode] : [])).map((item) => ({
                label: item.deptName,
                value: item.id,
              }))}
            />
          </Form.Item>
          <Form.Item name="depId" label="所属部门" rules={[{ required: true, message: '请选择所属部门' }]}>
            <Select
              showSearch
              optionFilterProp="label"
              placeholder="请选择所属部门"
              options={modalDepartmentOptions.map((item) => ({ label: item.deptName, value: item.id }))}
            />
          </Form.Item>
          <Form.Item name="roleIds" label="角色" rules={[{ required: true, message: '请至少选择一个角色' }]}>
            <Select
              mode="multiple"
              showSearch
              optionFilterProp="label"
              placeholder="请选择角色"
              options={roleOptions.map((role) => ({ label: role.roleName, value: role.id }))}
            />
          </Form.Item>
          <Form.Item name="accountType" label="账号属性">
            <Input placeholder="如：管理员、科室管理员、操作员" />
          </Form.Item>
          <Form.Item name="warehouseScope" label="仓库范围">
            <Input placeholder="如：全部仓库、仓库1" />
          </Form.Item>
          <Form.Item name="phone" label="联系电话">
            <Input placeholder="请输入联系电话" />
          </Form.Item>
          <Form.Item name="email" label="邮箱">
            <Input placeholder="请输入邮箱" />
          </Form.Item>
          <Form.Item name="status" label="状态" rules={[{ required: true, message: '请选择状态' }]}> 
            <Select options={STATUS_OPTIONS} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={`修改密码${currentUser ? ` - ${currentUser.realName}` : ''}`}
        open={passwordModalOpen}
        onCancel={() => {
          setPasswordModalOpen(false);
          setCurrentUser(null);
          passwordForm.resetFields();
        }}
        footer={null}
        destroyOnHidden
      >
        <Form form={passwordForm} layout="vertical">
          <Form.Item label="重置说明">
            <Input value={`默认密码为 ${DEFAULT_PASSWORD}`} disabled />
          </Form.Item>
          <Form.Item
            name="newPassword"
            label="新密码"
            rules={[{ required: true, message: '请输入新密码' }, { min: 6, message: '密码至少 6 位' }]}
            hasFeedback
          >
            <Input.Password placeholder="请输入新密码" />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="确认新密码"
            dependencies={['newPassword']}
            hasFeedback
            rules={[
              { required: true, message: '请再次输入新密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="请再次输入新密码" />
          </Form.Item>
          <Space>
            <Button type="primary" onClick={handleUpdatePassword} loading={loading}>修改密码</Button>
            <Popconfirm
              title="确定要重置密码吗？"
              description={`重置后密码将恢复为 ${DEFAULT_PASSWORD}`}
              okText="确定"
              cancelText="取消"
              icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
              onConfirm={handleResetPassword}
            >
              <Button danger loading={loading}>重置密码</Button>
            </Popconfirm>
          </Space>
        </Form>
      </Modal>
    </div>
  );
};

export default UserAccountManagement;
