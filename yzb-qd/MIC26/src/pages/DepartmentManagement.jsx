import React, { useEffect, useMemo, useState } from 'react';
import { Button, Card, Form, Input, Modal, Popconfirm, Select, Space, Table, Tag, message } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined, ReloadOutlined, UserOutlined } from '@ant-design/icons';
import api, { getApiErrorMessage, getApiResponseMessage } from '../utils/api';
import { useCampusContext } from '../contexts/CampusContext';
import { findDepartmentById, flattenDepartmentTree, getDepartmentOptionsByCampus, normalizeDepartmentTree } from '../utils/departmentTree';

const DepartmentManagement = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const { currentCampus, currentCampusNode } = useCampusContext();

  const normalizedTree = useMemo(() => normalizeDepartmentTree(departments), [departments]);

  const scopedDepartments = useMemo(() => {
    if (currentCampusNode) {
      return getDepartmentOptionsByCampus(currentCampusNode).filter((item) => item.orgType === 'DEPARTMENT');
    }
    return flattenDepartmentTree(normalizedTree).filter((item) => item.orgType === 'DEPARTMENT');
  }, [currentCampusNode, normalizedTree]);

  const departmentRows = useMemo(() => {
    return scopedDepartments.map((item) => {
      const parent = findDepartmentById(normalizedTree, item.parentId);
      return {
        id: item.id,
        deptName: item.deptName,
        deptCode: item.deptCode,
        remark: item.remark,
        leader: item.leader,
        phone: item.phone,
        email: item.email,
        status: item.status,
        parentId: item.parentId,
        parentName: parent?.deptName || currentCampus || '当前院区',
      };
    });
  }, [currentCampus, normalizedTree, scopedDepartments]);

  const parentOptions = useMemo(() => {
    const options = [];
    if (currentCampusNode) {
      options.push({ label: currentCampusNode.deptName, value: currentCampusNode.id });
    }
    scopedDepartments.forEach((item) => {
      if (!editingDepartment || Number(item.id) !== Number(editingDepartment.id)) {
        options.push({ label: item.deptName, value: item.id });
      }
    });
    return options;
  }, [currentCampusNode, editingDepartment, scopedDepartments]);

  const loadDepartments = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/department/tree');
      if (response.code !== 1 || !Array.isArray(response.data)) {
        message.error(getApiResponseMessage(response, '加载部门列表失败'));
        setDepartments([]);
        return;
      }
      setDepartments(response.data);
    } catch (error) {
      message.error(getApiErrorMessage(error, '加载部门列表失败'));
      setDepartments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  const handleAdd = () => {
    if (!currentCampusNode) {
      message.warning('请先在状态栏选择当前院区');
      return;
    }
    setEditingDepartment(null);
    form.resetFields();
    form.setFieldsValue({
      parentId: currentCampusNode.id,
      status: 1,
    });
    setModalOpen(true);
  };

  const handleEdit = (department) => {
    setEditingDepartment(department);
    form.setFieldsValue({
      deptName: department.deptName,
      remark: department.remark,
      leader: department.leader,
      phone: department.phone,
      email: department.email,
      status: department.status,
      parentId: department.parentId,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const response = await api.delete(`/api/department/${id}`);
      if (response.code !== 1) {
        message.error(getApiResponseMessage(response, '删除失败'));
        return;
      }
      message.success('删除成功');
      await loadDepartments();
    } catch (error) {
      message.error(getApiErrorMessage(error, '删除失败'));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitLoading(true);
      const payload = {
        deptName: values.deptName,
        remark: values.remark,
        leader: values.leader,
        phone: values.phone,
        email: values.email,
        status: values.status,
        parentId: values.parentId,
        orgType: 'DEPARTMENT',
      };

      const response = editingDepartment
        ? await api.put(`/api/department/${editingDepartment.id}`, payload)
        : await api.post('/api/department', payload);

      if (response.code !== 1) {
        message.error(getApiResponseMessage(response, editingDepartment ? '更新失败' : '新增失败'));
        return;
      }

      message.success(editingDepartment ? '部门信息更新成功' : '新增部门成功');
      setModalOpen(false);
      setEditingDepartment(null);
      form.resetFields();
      await loadDepartments();
    } catch (error) {
      if (error?.errorFields) {
        return;
      }
      message.error(getApiErrorMessage(error, '操作失败'));
    } finally {
      setSubmitLoading(false);
    }
  };

  const columns = [
    {
      title: '部门名称',
      dataIndex: 'deptName',
      key: 'deptName',
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 500, color: '#262626' }}>{text}</div>
          <div style={{ fontSize: 12, color: '#8c8c8c' }}>{record.remark || '未填写描述'}</div>
        </div>
      ),
    },
    {
      title: '上级节点',
      dataIndex: 'parentName',
      key: 'parentName',
      width: 160,
    },
    {
      title: '部门经理',
      dataIndex: 'leader',
      key: 'leader',
      width: 140,
      render: (leader) => leader ? <Tag color="blue" icon={<UserOutlined />}>{leader}</Tag> : <Tag>未设置</Tag>,
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      key: 'phone',
      width: 140,
      render: (phone) => phone || '-',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => <Tag color={Number(status) === 1 ? 'green' : 'red'}>{Number(status) === 1 ? '启用' : '禁用'}</Tag>,
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_, record) => (
        <Space size="small">
          <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)} style={{ color: '#1890ff' }}>
            编辑
          </Button>
          <Popconfirm
            title="确定删除这个部门吗？"
            description="删除后无法恢复，请谨慎操作。"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="text" icon={<DeleteOutlined />} danger>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '0 16px' }}>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0 }}>部门管理</h1>
          <div style={{ marginTop: 8, color: '#8c8c8c' }}>当前院区：{currentCampus || '当前院区'}</div>
        </div>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={loadDepartments}>刷新</Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
            style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none' }}
          >
            新增部门
          </Button>
        </Space>
      </div>

      <Card style={{ borderRadius: 12 }}>
        <Table
          columns={columns}
          dataSource={departmentRows}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 个部门`,
          }}
          size="small"
          scroll={{ x: 900 }}
        />
      </Card>

      <Modal
        title={editingDepartment ? '编辑部门' : '新增部门'}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => {
          setModalOpen(false);
          setEditingDepartment(null);
          form.resetFields();
        }}
        okText="保存"
        cancelText="取消"
        confirmLoading={submitLoading}
        destroyOnHidden
      >
        <Form form={form} layout="vertical" initialValues={{ status: 1 }}>
          <Form.Item
            name="deptName"
            label="部门名称"
            rules={[
              { required: true, message: '请输入部门名称' },
              { max: 50, message: '部门名称不能超过50个字符' },
            ]}
          >
            <Input placeholder="请输入部门名称" />
          </Form.Item>

          <Form.Item name="parentId" label="所属节点" rules={[{ required: true, message: '请选择所属节点' }]}>
            <Select placeholder="请选择所属节点" options={parentOptions} />
          </Form.Item>

          <Form.Item name="remark" label="部门描述" rules={[{ max: 200, message: '部门描述不能超过200个字符' }]}>
            <Input.TextArea placeholder="请输入部门描述" rows={3} showCount maxLength={200} />
          </Form.Item>

          <Form.Item name="leader" label="部门经理">
            <Input placeholder="请输入部门经理姓名（非必填）" />
          </Form.Item>

          <Form.Item name="phone" label="联系电话">
            <Input placeholder="请输入联系电话" />
          </Form.Item>

          <Form.Item name="email" label="邮箱">
            <Input placeholder="请输入联系邮箱" />
          </Form.Item>

          <Form.Item name="status" label="状态" rules={[{ required: true, message: '请选择状态' }]}>
            <Select options={[{ label: '启用', value: 1 }, { label: '禁用', value: 0 }]} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DepartmentManagement;