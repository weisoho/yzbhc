import { useEffect, useMemo, useState } from 'react';
import { Button, Card, Form, Input, InputNumber, Modal, Popconfirm, Select, Space, Table, Tag, Tree, message } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import api from '../utils/api.js';
import { normalizeDepartmentTree } from '../utils/departmentTree.js';

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

const UserRoleTemplate = () => {
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartmentKeys, setSelectedDepartmentKeys] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [filters, setFilters] = useState({ keyword: '', status: undefined });
  const [form] = Form.useForm();
  const selectedDataScope = Form.useWatch('dataScope', form);

  const departmentTreeData = useMemo(() => normalizeDepartmentTree(departments), [departments]);

  const loadRoles = async () => {
    const response = await api.get('/api/role/list');
    if (response.code !== 1 || !Array.isArray(response.data)) {
      throw new Error(response.message || '加载角色失败');
    }
    setRoles(response.data);
    return response.data;
  };

  const loadDepartments = async () => {
    const response = await api.get('/api/department/tree');
    if (response.code !== 1 || !Array.isArray(response.data)) {
      throw new Error(response.message || '加载部门树失败');
    }
    setDepartments(response.data);
  };

  const loadPageData = async () => {
    try {
      setLoading(true);
      await Promise.all([loadRoles(), loadDepartments()]);
    } catch (error) {
      message.error(error.message || '加载角色模板失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPageData();
  }, []);

  const filteredRoles = useMemo(() => {
    const keyword = filters.keyword.trim().toLowerCase();
    return roles.filter((role) => {
      const hitKeyword = !keyword || [role.roleName, role.roleCode, role.roleDesc]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(keyword));
      const hitStatus = filters.status === undefined || Number(role.status) === Number(filters.status);
      return hitKeyword && hitStatus;
    });
  }, [filters, roles]);

  const openCreateModal = () => {
    setEditingRole(null);
    setSelectedDepartmentKeys([]);
    form.resetFields();
    form.setFieldsValue({ dataScope: 4, status: 1, sortOrder: roles.length + 1 });
    setModalOpen(true);
  };

  const openEditModal = async (role) => {
    try {
      setLoading(true);
      setEditingRole(role);
      form.setFieldsValue({
        roleName: role.roleName,
        roleCode: role.roleCode,
        roleDesc: role.roleDesc,
        dataScope: role.dataScope,
        status: role.status,
        sortOrder: role.sortOrder,
      });
      if (role.dataScope === 5) {
        const response = await api.get(`/api/department/role/${role.id}/selected-ids`);
        if (response.code !== 1) {
          throw new Error(response.message || '加载角色部门范围失败');
        }
        setSelectedDepartmentKeys(Array.from(response.data || []).map((item) => String(item)));
      } else {
        setSelectedDepartmentKeys([]);
      }
      setModalOpen(true);
    } catch (error) {
      message.error(error.message || '加载角色失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      let response;
      if (editingRole) {
        response = await api.put(`/api/role/${editingRole.id}`, values);
      } else {
        response = await api.post('/api/role', values);
      }

      if (response.code !== 1) {
        throw new Error(response.message || '保存角色失败');
      }

      const latestRoles = await loadRoles();
      const targetRole = editingRole || latestRoles.find((role) => role.roleCode === values.roleCode) || null;
      if (targetRole?.id) {
        const departmentResponse = await api.post(
          `/api/role/${targetRole.id}/departments`,
          values.dataScope === 5 ? selectedDepartmentKeys.map((key) => Number(key)) : [],
        );
        if (departmentResponse.code !== 1) {
          throw new Error(departmentResponse.message || '保存角色部门范围失败');
        }
      }

      message.success(editingRole ? '角色模板更新成功' : '角色模板创建成功');
      setModalOpen(false);
      setEditingRole(null);
      form.resetFields();
      setSelectedDepartmentKeys([]);
    } catch (error) {
      if (error?.errorFields) {
        return;
      }
      message.error(error.message || '保存角色失败');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRole = async (role) => {
    try {
      setLoading(true);
      const response = await api.delete(`/api/role/${role.id}`);
      if (response.code !== 1) {
        throw new Error(response.message || '删除角色失败');
      }
      await loadRoles();
      message.success('角色模板删除成功');
    } catch (error) {
      message.error(error.message || '删除角色失败');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: '模板名称',
      dataIndex: 'roleName',
      key: 'roleName',
      width: 180,
    },
    {
      title: '模板编码',
      dataIndex: 'roleCode',
      key: 'roleCode',
      width: 180,
    },
    {
      title: '数据范围',
      dataIndex: 'dataScope',
      key: 'dataScope',
      width: 140,
      render: (value) => DATA_SCOPE_OPTIONS.find((item) => item.value === value)?.label || '-',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (value) => <Tag color={value === 1 ? 'green' : 'default'}>{value === 1 ? '启用' : '禁用'}</Tag>,
    },
    {
      title: '说明',
      dataIndex: 'roleDesc',
      key: 'roleDesc',
      ellipsis: true,
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => openEditModal(record)}><EditOutlined />编辑</a>
          <Popconfirm
            title="确定删除该角色模板吗？"
            okText="确定"
            cancelText="取消"
            onConfirm={() => handleDeleteRole(record)}
          >
            <a style={{ color: 'red' }}><DeleteOutlined />删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '0 16px' }}>
      <h1 style={{ marginBottom: 24 }}>用户角色模板</h1>

      <Card style={{ marginBottom: 16 }}>
        <Space wrap style={{ width: '100%' }}>
          <Input
            placeholder="模板名称/编码/说明"
            value={filters.keyword}
            onChange={(event) => setFilters((prev) => ({ ...prev, keyword: event.target.value }))}
            style={{ width: 240 }}
          />
          <Select
            allowClear
            placeholder="状态"
            value={filters.status}
            onChange={(value) => setFilters((prev) => ({ ...prev, status: value }))}
            style={{ width: 160 }}
            options={STATUS_OPTIONS}
          />
          <Button onClick={() => setFilters({ keyword: '', status: undefined })}>重置</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>新建模板</Button>
        </Space>
      </Card>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={filteredRoles}
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条记录`,
        }}
        scroll={{ x: 1000 }}
        size="small"
      />

      <Modal
        title={editingRole ? '编辑角色模板' : '新建角色模板'}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => {
          setModalOpen(false);
          setEditingRole(null);
          form.resetFields();
          setSelectedDepartmentKeys([]);
        }}
        okText="确定"
        cancelText="取消"
        confirmLoading={loading}
        width={760}
        destroyOnHidden
      >
        <Form form={form} layout="vertical">
          <Form.Item name="roleName" label="模板名称" rules={[{ required: true, message: '请输入模板名称' }]}>
            <Input placeholder="请输入模板名称" />
          </Form.Item>
          <Form.Item name="roleCode" label="模板编码" rules={[{ required: true, message: '请输入模板编码' }]}>
            <Input placeholder="请输入模板编码，如 SUPER_ADMIN" disabled={Boolean(editingRole)} />
          </Form.Item>
          <Form.Item name="roleDesc" label="模板说明">
            <Input.TextArea rows={3} placeholder="请输入模板说明" />
          </Form.Item>
          <Form.Item name="dataScope" label="数据范围" rules={[{ required: true, message: '请选择数据范围' }]}>
            <Select options={DATA_SCOPE_OPTIONS} onChange={(value) => {
              if (value !== 5) {
                setSelectedDepartmentKeys([]);
              }
            }} />
          </Form.Item>
          <Form.Item name="status" label="状态" rules={[{ required: true, message: '请选择状态' }]}>
            <Select options={STATUS_OPTIONS} />
          </Form.Item>
          <Form.Item name="sortOrder" label="排序">
            <InputNumber min={0} precision={0} style={{ width: '100%' }} placeholder="请输入排序值" />
          </Form.Item>

          {selectedDataScope === 5 ? (
            <div>
              <div style={{ marginBottom: 8, fontWeight: 600 }}>自定义部门范围</div>
              <Tree
                checkable
                checkedKeys={selectedDepartmentKeys}
                onCheck={(keys) => setSelectedDepartmentKeys(Array.isArray(keys) ? keys : keys.checked)}
                treeData={departmentTreeData}
                height={280}
              />
            </div>
          ) : null}
        </Form>
      </Modal>
    </div>
  );
};

export default UserRoleTemplate;