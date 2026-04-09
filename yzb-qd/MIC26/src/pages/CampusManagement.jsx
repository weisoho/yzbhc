import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Button, Card, Form, Input, InputNumber, Modal, Popconfirm, Select, Space, Table, Tag, message } from 'antd';
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import api, { getApiErrorMessage, getApiResponseMessage } from '../utils/api';

const { TextArea } = Input;

const statusOptions = [
  { label: '启用', value: 1 },
  { label: '禁用', value: 0 },
];

const flattenCampusTree = (nodes = [], level = 1, parentName = '-') => {
  const result = [];
  nodes.forEach((node) => {
    result.push({
      id: node.id,
      deptName: node.deptName,
      deptCode: node.deptCode,
      address: node.address,
      leader: node.leader,
      phone: node.phone,
      email: node.email,
      remark: node.remark,
      status: node.status,
      sortOrder: node.sortOrder,
      parentId: node.parentId,
      parentName,
      level,
      children: node.children || [],
      raw: node,
    });
    result.push(...flattenCampusTree(node.children || [], level + 1, node.deptName || '-'));
  });
  return result;
};

const countDepartmentChildren = (node) => {
  const children = node?.children || [];
  let count = 0;
  children.forEach((child) => {
    if (child.orgType === 'DEPARTMENT') {
      count += 1;
    }
    count += countDepartmentChildren(child);
  });
  return count;
};

const countCampusChildren = (node) => (node?.children || []).length;

const CampusManagement = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [editingCampus, setEditingCampus] = useState(null);
  const [detailCampus, setDetailCampus] = useState(null);
  const [campusTree, setCampusTree] = useState([]);

  const campusRows = useMemo(() => flattenCampusTree(campusTree), [campusTree]);

  const parentOptions = useMemo(() => {
    return campusRows
      .filter((item) => !editingCampus || item.id !== editingCampus.id)
      .map((item) => ({
        label: `${'--'.repeat(Math.max(item.level - 1, 0))}${item.deptName}`,
        value: item.id,
      }));
  }, [campusRows, editingCampus]);

  const loadCampuses = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/department/tree');
      if (response.code !== 1 || !Array.isArray(response.data)) {
        message.error(getApiResponseMessage(response, '加载院区数据失败'));
        setCampusTree([]);
        return;
      }

      const campuses = response.data.filter((item) => item?.orgType === 'CAMPUS' || Number(item?.parentId) === 0);
      setCampusTree(campuses);
    } catch (error) {
      message.error(getApiErrorMessage(error, '加载院区数据失败'));
      setCampusTree([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCampuses();
  }, []);

  const openCreateModal = () => {
    setEditingCampus(null);
    form.resetFields();
    form.setFieldsValue({
      status: 1,
      sortOrder: 0,
    });
    setModalOpen(true);
  };

  const openEditModal = (record) => {
    setEditingCampus(record);
    form.setFieldsValue({
      deptName: record.deptName,
      deptCode: record.deptCode,
      address: record.address,
      leader: record.leader,
      phone: record.phone,
      email: record.email,
      remark: record.remark,
      status: record.status,
      parentId: record.parentId && Number(record.parentId) !== 0 ? record.parentId : undefined,
      sortOrder: record.sortOrder ?? 0,
    });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitLoading(true);
      const payload = {
        deptName: values.deptName,
        deptCode: values.deptCode,
        address: values.address,
        leader: values.leader,
        phone: values.phone,
        email: values.email,
        remark: values.remark,
        status: values.status,
        parentId: values.parentId || 0,
        sortOrder: values.sortOrder ?? 0,
        orgType: 'CAMPUS',
      };

      const response = editingCampus
        ? await api.put(`/api/department/${editingCampus.id}`, payload)
        : await api.post('/api/department', payload);

      if (response.code !== 1) {
        message.error(getApiResponseMessage(response, editingCampus ? '院区更新失败' : '院区创建失败'));
        return;
      }

      message.success(editingCampus ? '院区更新成功' : '院区创建成功');
      setModalOpen(false);
      form.resetFields();
      setEditingCampus(null);
      await loadCampuses();
    } catch (error) {
      if (error?.errorFields) {
        return;
      }
      message.error(getApiErrorMessage(error, editingCampus ? '院区更新失败' : '院区创建失败'));
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (record) => {
    if (Number(record.level) === 1) {
      message.warning('默认总院不允许删除');
      return;
    }

    if ((record.children || []).length > 0) {
      message.warning('该院区下仍存在分院或科室，不能直接删除');
      return;
    }

    try {
      const response = await api.delete(`/api/department/${record.id}`);
      if (response.code !== 1) {
        message.error(getApiResponseMessage(response, '院区删除失败'));
        return;
      }
      message.success('院区删除成功');
      await loadCampuses();
    } catch (error) {
      message.error(getApiErrorMessage(error, '院区删除失败'));
    }
  };

  const columns = [
    { title: '院区名称', dataIndex: 'deptName', key: 'deptName', width: 180 },
    { title: '院区编码', dataIndex: 'deptCode', key: 'deptCode', width: 140 },
    { title: '上级院区', dataIndex: 'parentName', key: 'parentName', width: 140 },
    { title: '负责人', dataIndex: 'leader', key: 'leader', width: 120 },
    { title: '联系电话', dataIndex: 'phone', key: 'phone', width: 140 },
    { title: '地址', dataIndex: 'address', key: 'address', ellipsis: true },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (value) => <Tag color={Number(value) === 1 ? 'green' : 'red'}>{Number(value) === 1 ? '启用' : '禁用'}</Tag>,
    },
    {
      title: '级别',
      dataIndex: 'level',
      key: 'level',
      width: 100,
      render: (value) => (value === 1 ? '总院' : '分院'),
    },
    {
      title: '直属分院',
      key: 'campusChildren',
      width: 100,
      render: (_, record) => countCampusChildren(record.raw),
    },
    {
      title: '科室数',
      key: 'departmentChildren',
      width: 100,
      render: (_, record) => countDepartmentChildren(record.raw),
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 220,
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<EyeOutlined />} onClick={() => { setDetailCampus(record); setDetailOpen(true); }}>
            查看
          </Button>
          <Button type="link" icon={<EditOutlined />} onClick={() => openEditModal(record)}>
            编辑
          </Button>
          <Popconfirm title="确定删除该院区吗？" onConfirm={() => handleDelete(record)} okText="确定" cancelText="取消">
            <Button type="link" danger icon={<DeleteOutlined />} disabled={Number(record.level) === 1}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card
        title="院区管理"
        extra={
          <Space>
            <Button icon={<ReloadOutlined />} onClick={loadCampuses}>
              刷新
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
              新建院区
            </Button>
          </Space>
        }
      >
        <Alert
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
          message="当前页面已直接连接真实院区数据"
          description="院区数据复用系统部门树，新增院区会写入 sys_department，并按 CAMPUS 组织类型管理。"
        />

        <Table
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={campusRows}
          scroll={{ x: 1500 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />

        <Modal
          title={editingCampus ? '编辑院区' : '新建院区'}
          open={modalOpen}
          onCancel={() => {
            setModalOpen(false);
            setEditingCampus(null);
            form.resetFields();
          }}
          onOk={handleSubmit}
          confirmLoading={submitLoading}
          width={760}
        >
          <Form form={form} layout="vertical">
            <Form.Item label="院区名称" name="deptName" rules={[{ required: true, message: '请输入院区名称' }]}>
              <Input placeholder="请输入院区名称" />
            </Form.Item>
            <Form.Item label="院区编码" name="deptCode" rules={[{ required: true, message: '请输入院区编码' }]}>
              <Input placeholder="请输入院区编码" />
            </Form.Item>
            <Form.Item label="院区地址" name="address">
              <TextArea rows={2} placeholder="请输入院区地址" />
            </Form.Item>
            <Form.Item label="负责人" name="leader">
              <Input placeholder="请输入负责人姓名" />
            </Form.Item>
            <Form.Item label="联系电话" name="phone">
              <Input placeholder="请输入联系电话" />
            </Form.Item>
            <Form.Item label="联系邮箱" name="email">
              <Input placeholder="请输入联系邮箱" />
            </Form.Item>
            <Form.Item label="上级院区" name="parentId">
              <Select allowClear placeholder="不选则作为总院" options={parentOptions} />
            </Form.Item>
            <Form.Item label="院区状态" name="status" rules={[{ required: true, message: '请选择院区状态' }]}>
              <Select options={statusOptions} />
            </Form.Item>
            <Form.Item label="排序" name="sortOrder">
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item label="备注" name="remark">
              <TextArea rows={3} placeholder="请输入院区备注" />
            </Form.Item>
          </Form>
        </Modal>

        <Modal title="院区详情" open={detailOpen} footer={null} onCancel={() => setDetailOpen(false)} width={720}>
          {detailCampus ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
              <div><strong>院区名称：</strong>{detailCampus.deptName || '-'}</div>
              <div><strong>院区编码：</strong>{detailCampus.deptCode || '-'}</div>
              <div><strong>上级院区：</strong>{detailCampus.parentName || '-'}</div>
              <div><strong>级别：</strong>{detailCampus.level === 1 ? '总院' : '分院'}</div>
              <div><strong>负责人：</strong>{detailCampus.leader || '-'}</div>
              <div><strong>联系电话：</strong>{detailCampus.phone || '-'}</div>
              <div><strong>联系邮箱：</strong>{detailCampus.email || '-'}</div>
              <div><strong>状态：</strong>{Number(detailCampus.status) === 1 ? '启用' : '禁用'}</div>
              <div><strong>直属分院：</strong>{countCampusChildren(detailCampus.raw)}</div>
              <div><strong>科室数量：</strong>{countDepartmentChildren(detailCampus.raw)}</div>
              <div style={{ gridColumn: '1 / span 2' }}><strong>院区地址：</strong>{detailCampus.address || '-'}</div>
              <div style={{ gridColumn: '1 / span 2' }}><strong>备注：</strong>{detailCampus.remark || '-'}</div>
            </div>
          ) : null}
        </Modal>
      </Card>
    </div>
  );
};

export default CampusManagement;