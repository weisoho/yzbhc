import React, { useEffect, useMemo, useState } from 'react';
import moment from 'moment';
import { Form, Input, InputNumber, Select, DatePicker, Button, Card, Table, Row, Col, Space, message, Modal, Tag, Alert } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, DownloadOutlined } from '@ant-design/icons';
import api, { getApiErrorMessage, getApiResponseMessage } from '../utils/api';
import { useCampusContext } from '../contexts/CampusContext';
import { flattenDepartmentTree, getDepartmentOptionsByCampus, normalizeDepartmentTree } from '../utils/departmentTree';

const { RangePicker } = DatePicker;
const { TextArea } = Input;

const normalizeList = (payload) => {
  if (Array.isArray(payload?.records)) {
    return payload.records;
  }
  if (Array.isArray(payload?.list)) {
    return payload.list;
  }
  return [];
};

const normalizeDepartmentList = (payload) => {
  if (Array.isArray(payload)) {
    return payload;
  }
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

const mapProjectOption = (item) => ({
  label: `${item.itemName || '-'}${item.itemCode ? ` (${item.itemCode})` : ''}`,
  value: item.id,
  itemName: item.itemName,
  depId: item.depId,
  depName: item.depName,
});

const mapRecord = (item, projectMap) => {
  const project = projectMap.get(item.itemId);
  return {
    key: item.id,
    id: item.id,
    date: item.sampleDate,
    departmentId: item.depId,
    departmentName: item.depName || '-',
    projectId: item.itemId,
    projectName: item.itemName || project?.itemName || '-',
    quantity: item.detectionNum || 0,
    operator: item.userName || '-',
    remark: item.remark || '-',
    canOperate: moment(item.sampleDate).isSame(moment(), 'day'),
  };
};

const SampleQuantityManagement = () => {
  const [form] = Form.useForm();
  const [uploadForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [data, setData] = useState([]);
  const [projects, setProjects] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [lastQuery, setLastQuery] = useState({});
  const { currentCampusNode, currentDepartment } = useCampusContext();

  const currentDepartmentName = currentDepartment?.deptName || localStorage.getItem('currentDepartment') || '当前登录科室';
  const currentDepartmentId = currentDepartment?.id ? Number(currentDepartment.id) : undefined;
  const currentUserName = (() => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      return userInfo.realName || userInfo.name || userInfo.userName || localStorage.getItem('userName') || localStorage.getItem('username') || '当前登录用户';
    } catch {
      return localStorage.getItem('userName') || localStorage.getItem('username') || '当前登录用户';
    }
  })();

  const normalizedDepartmentTree = useMemo(() => normalizeDepartmentTree(departments), [departments]);
  const scopedDepartments = useMemo(() => {
    if (currentCampusNode) {
      return getDepartmentOptionsByCampus(currentCampusNode).filter((item) => item.orgType === 'DEPARTMENT');
    }
    return flattenDepartmentTree(normalizedDepartmentTree).filter((item) => item.orgType === 'DEPARTMENT');
  }, [currentCampusNode, normalizedDepartmentTree]);

  const departmentOptions = useMemo(() => scopedDepartments.map(mapDepartmentOption), [scopedDepartments]);
  const projectOptions = useMemo(() => {
    return projects.map(mapProjectOption);
  }, [projects]);
  const projectMap = useMemo(() => new Map(projectOptions.map((item) => [item.value, item])), [projectOptions]);

  const loadDepartments = async () => {
    try {
      const response = await api.get('/api/department/list');
      if (response.code === 1) {
        setDepartments(normalizeDepartmentList(response.data).filter((item) => item?.id && item?.status === 1));
      }
    } catch (error) {
      message.error(getApiErrorMessage(error, '加载科室失败'));
    }
  };

  const loadProjects = async () => {
    try {
      const response = await api.post('/api/sampleItem/selectModelList', {
        pageNum: 1,
        pageSize: 1000,
        itemState: 1,
      });
      if (response.code === 1) {
        setProjects(normalizeList(response.data));
      }
    } catch (error) {
      message.error(getApiErrorMessage(error, '加载项目字典失败'));
    }
  };

  const loadRecords = async (query = {}, page = currentPage, size = pageSize) => {
    setLoading(true);
    try {
      const response = await api.post('/api/sampleMan/selectModelList', {
        pageNum: page,
        pageSize: size,
        depId: query.department || currentDepartmentId,
        itemId: query.projectId,
        itemName: query.projectName,
        sdate: query.dateRange?.[0] ? query.dateRange[0].toISOString() : undefined,
        edate: query.dateRange?.[1] ? query.dateRange[1].toISOString() : undefined,
      });

      if (response.code !== 1) {
        message.error(getApiResponseMessage(response, '加载样本量记录失败'));
        setData([]);
        setTotal(0);
        return;
      }

      const list = normalizeList(response.data).map((item) => mapRecord(item, projectMap));
      setData(list);
      setTotal(response.data?.total || list.length);
    } catch (error) {
      message.error(getApiErrorMessage(error, '加载样本量记录失败'));
      setData([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDepartments();
    loadProjects();
  }, []);

  useEffect(() => {
    loadRecords(lastQuery, currentPage, pageSize);
  }, [currentDepartmentId, currentPage, pageSize, projectMap.size]);

  useEffect(() => {
    if (currentDepartmentId && !lastQuery.department) {
      form.setFieldValue('department', currentDepartmentId);
      setLastQuery((prev) => ({ ...prev, department: currentDepartmentId }));
    }
  }, [currentDepartmentId, form, lastQuery.department]);

  const handleSearch = async (values) => {
    const nextQuery = {
      department: values.department || currentDepartmentId,
      projectId: values.projectId,
      projectName: values.projectName,
      dateRange: values.dateRange
        ? [values.dateRange[0].toDate(), values.dateRange[1].toDate()]
        : undefined,
    };
    setLastQuery(nextQuery);
    setCurrentPage(1);
    await loadRecords(nextQuery, 1, pageSize);
  };

  const handleReset = async () => {
    form.resetFields();
    if (currentDepartmentId) {
      form.setFieldValue('department', currentDepartmentId);
      setLastQuery({ department: currentDepartmentId });
      setCurrentPage(1);
      await loadRecords({ department: currentDepartmentId }, 1, pageSize);
      return;
    }
    setLastQuery({});
    setCurrentPage(1);
    await loadRecords({}, 1, pageSize);
  };

  const handleExport = async () => {
    try {
      const response = await api.post('/api/sampleMan/export', {
        pageNum: 1,
        pageSize: 10000,
        depId: lastQuery.department,
        itemId: lastQuery.projectId,
        itemName: lastQuery.projectName,
        sdate: lastQuery.dateRange?.[0] ? lastQuery.dateRange[0].toISOString() : undefined,
        edate: lastQuery.dateRange?.[1] ? lastQuery.dateRange[1].toISOString() : undefined,
      });
      message.success(getApiResponseMessage(response, '导出成功'));
    } catch (error) {
      message.error(getApiErrorMessage(error, '导出失败'));
    }
  };

  const openCreateModal = () => {
    setSelectedRow(null);
    uploadForm.resetFields();
    uploadForm.setFieldsValue({
      date: moment(),
      projectId: undefined,
    });
    setUploadModalVisible(true);
  };

  const handleEdit = (record) => {
    if (!record.canOperate) {
      message.warning('仅当天记录允许编辑');
      return;
    }
    setSelectedRow(record);
    uploadForm.setFieldsValue({
      date: record.date ? moment(record.date) : null,
      projectId: record.projectId,
      quantity: record.quantity,
      remark: record.remark === '-' ? undefined : record.remark,
    });
    setUploadModalVisible(true);
  };

  const handleDelete = (record) => {
    if (!record.canOperate) {
      message.warning('仅当天记录允许删除');
      return;
    }
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除 ${moment(record.date).format('YYYY-MM-DD')} 的样本量记录吗？`,
      onOk: async () => {
        try {
          const response = await api.request('/api/sampleMan/deleteSampleMan', {
            method: 'POST',
            params: { id: record.id },
          });
          if (response.code !== 1) {
            message.error(getApiResponseMessage(response, '删除失败'));
            return;
          }
          message.success('删除成功');
          await loadRecords(lastQuery, currentPage, pageSize);
        } catch (error) {
          message.error(getApiErrorMessage(error, '删除失败'));
        }
      },
    });
  };

  const handleUpload = async (values) => {
    setSubmitLoading(true);
    try {
      const project = projectMap.get(values.projectId);
      const payload = {
        id: selectedRow?.id,
        sampleDate: values.date ? values.date.toDate().toISOString() : undefined,
        itemId: values.projectId,
        itemName: project?.itemName,
        depId: currentDepartmentId,
        depName: currentDepartmentName,
        detectionNum: Number(values.quantity),
        remark: values.remark,
      };

      const response = await api.post('/api/sampleMan/addorupdateSampleMan', payload);
      if (response.code !== 1) {
        message.error(getApiResponseMessage(response, selectedRow ? '更新失败' : '上传失败'));
        return;
      }

      message.success(selectedRow ? '记录更新成功' : '数据上传成功');
      setUploadModalVisible(false);
      uploadForm.resetFields();
      setSelectedRow(null);
      await loadRecords(lastQuery, currentPage, pageSize);
    } catch (error) {
      message.error(getApiErrorMessage(error, selectedRow ? '更新失败' : '上传失败'));
    } finally {
      setSubmitLoading(false);
    }
  };

  const columns = [
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      width: 120,
      render: (value) => (value ? moment(value).format('YYYY-MM-DD') : '-'),
    },
    {
      title: '检验科',
      dataIndex: 'departmentName',
      key: 'departmentName',
      width: 160,
    },
    {
      title: '项目名称',
      dataIndex: 'projectName',
      key: 'projectName',
      width: 180,
    },
    {
      title: '检测项目数',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 120,
    },
    {
      title: '操作人',
      dataIndex: 'operator',
      key: 'operator',
      width: 120,
    },
    {
      title: '可编辑',
      dataIndex: 'canOperate',
      key: 'canOperate',
      width: 100,
      render: (value) => <Tag color={value ? 'green' : 'default'}>{value ? '当天' : '锁定'}</Tag>,
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
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)} disabled={!record.canOperate}>
            编辑
          </Button>
          <Button type="link" size="small" icon={<DeleteOutlined />} onClick={() => handleDelete(record)} style={{ color: '#ff4d4f' }} disabled={!record.canOperate}>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '0 16px' }}>
      <h1 style={{ marginBottom: 24 }}>样本量管理</h1>

      <Alert
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
        message={`当前登记科室：${currentDepartmentName}，当前操作人：${currentUserName}`}
        description="样本量记录以单条账单形式登记。根据业务规则，仅当天且由本人提交的记录允许修改或删除。"
      />

      <Card style={{ marginBottom: 16 }}>
        <Form form={form} layout="inline" onFinish={handleSearch}>
          <Row gutter={[16, 16]} style={{ width: '100%' }}>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="department" label="检验科">
                <Select placeholder="请选择检验科" allowClear options={departmentOptions} disabled={Boolean(currentDepartmentId)} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="projectId" label="项目名称">
                <Select placeholder="请选择项目" allowClear options={projectOptions} showSearch optionFilterProp="label" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="projectName" label="项目关键字">
                <Input placeholder="输入项目名称模糊查询" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={6}>
              <Form.Item name="dateRange" label="日期范围">
                <RangePicker style={{ width: '100%' }} />
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
                <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
                  上传数据
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>

      <Table
        columns={columns}
        dataSource={data}
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
          showQuickJumper: true,
          showTotal: (count) => `共 ${count} 条记录`,
        }}
        scroll={{ x: 1100 }}
      />

      <Modal
        title={selectedRow ? '编辑样本量数据' : '上传样本量数据'}
        open={uploadModalVisible}
        onCancel={() => {
          setUploadModalVisible(false);
          uploadForm.resetFields();
          setSelectedRow(null);
        }}
        footer={null}
        width={640}
      >
        <Form form={uploadForm} layout="vertical" onFinish={handleUpload}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="所属科室">
                <Input value={currentDepartmentName} disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="操作人">
                <Input value={currentUserName} disabled />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="date" label="日期" rules={[{ required: true, message: '请选择日期' }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="projectId" label="项目" rules={[{ required: true, message: '请选择项目' }]}>
                <Select placeholder="请选择项目" options={projectOptions} showSearch optionFilterProp="label" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="quantity" label="检测项目数" rules={[
                { required: true, message: '请输入检测项目数' },
                {
                  validator: (_, value) => {
                    if (value === undefined || value === null || value === '') {
                      return Promise.resolve();
                    }
                    const numberValue = Number(value);
                    if (!Number.isFinite(numberValue) || numberValue < 0) {
                      return Promise.reject(new Error('检测项目数不能为负数'));
                    }
                    return Promise.resolve();
                  }
                }
              ]}> 
                <InputNumber min={0} precision={0} style={{ width: '100%' }} placeholder="请输入检测项目数" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="remark" label="备注">
            <TextArea rows={4} placeholder="请输入备注信息" />
          </Form.Item>
          <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
            <Space>
              <Button onClick={() => {
                setUploadModalVisible(false);
                uploadForm.resetFields();
                setSelectedRow(null);
              }}>
                取消
              </Button>
              <Button type="primary" htmlType="submit" loading={submitLoading}>
                {selectedRow ? '保存修改' : '上传数据'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SampleQuantityManagement;