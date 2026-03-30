import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Card, Table, Button, Space, Form, Input, Select, Modal, Tag, Row, Col, message } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, DownloadOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import api, { getApiErrorMessage, getApiResponseMessage } from '../utils/api';

const { TextArea } = Input;

const statusOptions = [
  { label: '启用', value: 1, color: 'green' },
  { label: '停用', value: 0, color: 'red' },
];

const getStatusMeta = (value) => statusOptions.find((item) => item.value === value) || { label: '-', color: 'default' };

const normalizeList = (payload) => {
  if (Array.isArray(payload?.records)) {
    return payload.records;
  }
  if (Array.isArray(payload?.list)) {
    return payload.list;
  }
  return [];
};

const mapDepartmentOption = (item) => ({
  label: item.deptName || `部门${item.id}`,
  value: item.id,
});

const mapProject = (item, departmentMap) => ({
  key: item.id,
  id: item.id,
  projectCode: item.itemCode || '-',
  projectName: item.itemName || '-',
  department: item.depId,
  departmentName: item.depName || departmentMap.get(item.depId) || '-',
  status: item.itemState,
  isCharge: item.isCharge,
  chargeCode: item.chargeCode || '-',
  remark: item.remark || '-',
});

const SampleProjectManagement = () => {
  const [form] = Form.useForm();
  const [projectForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectModalVisible, setProjectModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [lastQuery, setLastQuery] = useState({});

  const departmentMap = useMemo(() => {
    return new Map(departments.map((item) => [item.value, item.label]));
  }, [departments]);

  const loadDepartments = useCallback(async () => {
    try {
      const response = await api.get('/api/department/list');
      if (response.code === 1 && Array.isArray(response.data)) {
        const options = response.data
          .filter((item) => item?.id && item?.status === 1 && item?.orgType === 'DEPARTMENT')
          .map(mapDepartmentOption);
        setDepartments(options);
      }
    } catch (error) {
      message.error(getApiErrorMessage(error, '加载检验科列表失败'));
    }
  }, []);

  const loadProjects = useCallback(async (query = {}, page = 1, size = 10) => {
    setLoading(true);
    try {
      const response = await api.post('/api/sampleItem/selectModelList', {
        pageNum: page,
        pageSize: size,
        itemCode: query.projectCode,
        itemName: query.projectName,
        depId: query.department,
        itemState: query.status,
      });

      if (response.code !== 1) {
        message.error(getApiResponseMessage(response, '加载项目字典失败'));
        setProjects([]);
        setTotal(0);
        return;
      }

      const list = normalizeList(response.data).map((item) => mapProject(item, departmentMap));
      setProjects(list);
      setTotal(response.data?.total || list.length);
    } catch (error) {
      message.error(getApiErrorMessage(error, '加载项目字典失败'));
      setProjects([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [departmentMap]);

  useEffect(() => {
    loadDepartments();
  }, [loadDepartments]);

  useEffect(() => {
    loadProjects(lastQuery, currentPage, pageSize);
  }, [currentPage, lastQuery, loadProjects, pageSize]);

  const handleSearch = async (values) => {
    setCurrentPage(1);
    setLastQuery(values);
    await loadProjects(values, 1, pageSize);
  };

  const handleReset = async () => {
    form.resetFields();
    setLastQuery({});
    setCurrentPage(1);
    await loadProjects({}, 1, pageSize);
  };

  const handleExport = async () => {
    try {
      const response = await api.post('/api/sampleItem/export', {
        pageNum: 1,
        pageSize: 10000,
        itemCode: lastQuery.projectCode,
        itemName: lastQuery.projectName,
        depId: lastQuery.department,
        itemState: lastQuery.status,
      });
      message.success(getApiResponseMessage(response, '导出成功'));
    } catch (error) {
      message.error(getApiErrorMessage(error, '导出失败'));
    }
  };

  const openCreateModal = () => {
    setSelectedProject(null);
    projectForm.resetFields();
    projectForm.setFieldsValue({
      status: 1,
      isCharge: 0,
    });
    setProjectModalVisible(true);
  };

  const handleEditProject = (record) => {
    setSelectedProject(record);
    projectForm.setFieldsValue({
      projectCode: record.projectCode === '-' ? undefined : record.projectCode,
      projectName: record.projectName === '-' ? undefined : record.projectName,
      department: record.department,
      status: record.status,
      isCharge: record.isCharge ?? 0,
      chargeCode: record.chargeCode === '-' ? undefined : record.chargeCode,
      remark: record.remark === '-' ? undefined : record.remark,
    });
    setProjectModalVisible(true);
  };

  const handleToggleStatus = async (record) => {
    const nextState = record.status === 1 ? 0 : 1;
    try {
      const response = await api.request('/api/sampleItem/updateItemState', {
        method: 'POST',
        params: { id: record.id, itemState: nextState },
      });
      if (response.code !== 1) {
        message.error(getApiResponseMessage(response, '状态更新失败'));
        return;
      }
      message.success(nextState === 1 ? '项目已启用' : '项目已停用');
      await loadProjects(lastQuery, currentPage, pageSize);
    } catch (error) {
      message.error(getApiErrorMessage(error, '状态更新失败'));
    }
  };

  const handleDeleteProject = (record) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除项目“${record.projectName}”吗？`,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          const response = await api.request('/api/sampleItem/deleteSampleItem', {
            method: 'POST',
            params: { id: record.id },
          });
          if (response.code !== 1) {
            message.error(getApiResponseMessage(response, '删除失败'));
            return;
          }
          message.success('项目删除成功');
          await loadProjects(lastQuery, currentPage, pageSize);
        } catch (error) {
          message.error(getApiErrorMessage(error, '删除失败'));
        }
      },
    });
  };

  const handleProjectSubmit = async (values) => {
    setSubmitLoading(true);
    try {
      const departmentName = departmentMap.get(values.department);
      const payload = {
        id: selectedProject?.id,
        itemCode: values.projectCode,
        itemName: values.projectName,
        depId: values.department,
        depName: departmentName,
        itemState: values.status,
        isCharge: values.isCharge,
        chargeCode: values.isCharge === 1 ? values.chargeCode : '',
        remark: values.remark,
      };

      const response = await api.post('/api/sampleItem/addorupdateSampleItem', payload);
      if (response.code !== 1) {
        message.error(getApiResponseMessage(response, selectedProject ? '项目修改失败' : '项目新增失败'));
        return;
      }

      message.success(selectedProject ? '项目修改成功' : '项目新增成功');
      setProjectModalVisible(false);
      projectForm.resetFields();
      setSelectedProject(null);
      await loadProjects(lastQuery, currentPage, pageSize);
    } catch (error) {
      message.error(getApiErrorMessage(error, selectedProject ? '项目修改失败' : '项目新增失败'));
    } finally {
      setSubmitLoading(false);
    }
  };

  const columns = [
    {
      title: '项目编码',
      dataIndex: 'projectCode',
      key: 'projectCode',
      width: 140,
    },
    {
      title: '项目名称',
      dataIndex: 'projectName',
      key: 'projectName',
      width: 160,
    },
    {
      title: '所属检验科',
      dataIndex: 'departmentName',
      key: 'departmentName',
      width: 160,
    },
    {
      title: '是否收费',
      dataIndex: 'isCharge',
      key: 'isCharge',
      width: 100,
      render: (value) => <Tag color={value === 1 ? 'blue' : 'default'}>{value === 1 ? '是' : '否'}</Tag>,
    },
    {
      title: '收费编码',
      dataIndex: 'chargeCode',
      key: 'chargeCode',
      width: 140,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => {
        const meta = getStatusMeta(status);
        return <Tag color={meta.color}>{meta.label}</Tag>;
      },
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      ellipsis: true,
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_, record) => (
        <Space size="small">
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEditProject(record)}>
            编辑
          </Button>
          <Button
            type="link"
            size="small"
            icon={record.status === 1 ? <CloseCircleOutlined /> : <CheckCircleOutlined />}
            onClick={() => handleToggleStatus(record)}
            style={{ color: record.status === 1 ? '#ff4d4f' : '#52c41a' }}
          >
            {record.status === 1 ? '停用' : '启用'}
          </Button>
          <Button type="link" size="small" icon={<DeleteOutlined />} onClick={() => handleDeleteProject(record)} style={{ color: '#ff4d4f' }}>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '0 16px' }}>
      <h1 style={{ marginBottom: 24 }}>项目字典</h1>

      <Card style={{ marginBottom: 16 }}>
        <Form form={form} layout="inline" onFinish={handleSearch}>
          <Row gutter={[16, 16]} style={{ width: '100%' }}>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="projectCode" label="项目编码">
                <Input placeholder="请输入项目编码" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="projectName" label="项目名称">
                <Input placeholder="请输入项目名称" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="department" label="检验科">
                <Select placeholder="请选择检验科" allowClear options={departments} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="status" label="状态">
                <Select placeholder="请选择状态" allowClear options={statusOptions} />
              </Form.Item>
            </Col>
            <Col xs={24} style={{ textAlign: 'right' }}>
              <Space>
                <Button type="primary" icon={<SearchOutlined />} htmlType="submit" loading={loading}>
                  查询
                </Button>
                <Button onClick={handleReset}>重置</Button>
                <Button icon={<DownloadOutlined />} onClick={handleExport}>
                  导出
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>

      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
          新增项目
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={projects}
        loading={loading}
        rowKey="id"
        pagination={{
          current: currentPage,
          pageSize,
          total,
          onChange: (page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          },
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100'],
          showTotal: (count) => `共 ${count} 条记录`,
        }}
        scroll={{ x: 1200 }}
      />

      <Modal
        title={selectedProject ? '编辑项目' : '新增项目'}
        open={projectModalVisible}
        onCancel={() => {
          setProjectModalVisible(false);
          projectForm.resetFields();
          setSelectedProject(null);
        }}
        footer={null}
        width={680}
      >
        <Form form={projectForm} layout="vertical" onFinish={handleProjectSubmit}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="projectCode" label="项目编码">
                <Input placeholder="留空则自动生成" disabled={Boolean(selectedProject)} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="projectName" label="项目名称" rules={[{ required: true, message: '请输入项目名称' }]}>
                <Input placeholder="请输入项目名称" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="department" label="所属检验科" rules={[{ required: true, message: '请选择所属检验科' }]}>
                <Select placeholder="请选择所属检验科" options={departments} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="status" label="状态" rules={[{ required: true, message: '请选择状态' }]}>
                <Select placeholder="请选择状态" options={statusOptions} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="isCharge" label="是否收费" rules={[{ required: true, message: '请选择是否收费' }]}>
                <Select
                  placeholder="请选择"
                  options={[
                    { label: '否', value: 0 },
                    { label: '是', value: 1 },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                noStyle
                shouldUpdate={(prevValues, currentValues) => prevValues.isCharge !== currentValues.isCharge}
              >
                {({ getFieldValue }) => (
                  <Form.Item
                    name="chargeCode"
                    label="收费编码"
                    rules={getFieldValue('isCharge') === 1 ? [{ required: true, message: '收费项目必须填写收费编码' }] : []}
                  >
                    <Input placeholder="收费项目请填写收费编码" disabled={getFieldValue('isCharge') !== 1} />
                  </Form.Item>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="remark" label="备注">
            <TextArea rows={4} placeholder="请输入备注信息" />
          </Form.Item>
          <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
            <Space>
              <Button onClick={() => {
                setProjectModalVisible(false);
                projectForm.resetFields();
                setSelectedProject(null);
              }}>
                取消
              </Button>
              <Button type="primary" htmlType="submit" loading={submitLoading}>
                {selectedProject ? '保存修改' : '新增项目'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SampleProjectManagement;