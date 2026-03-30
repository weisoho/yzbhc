import React, { useCallback, useEffect, useState } from 'react';
import { Button, Card, Descriptions, Form, Input, InputNumber, Modal, Space, Table, message } from 'antd';
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import api, { getApiErrorMessage, getApiResponseMessage } from '../utils/api';

const normalizeList = (payload) => {
  if (Array.isArray(payload?.records)) {
    return payload.records;
  }
  if (Array.isArray(payload?.list)) {
    return payload.list;
  }
  return [];
};

const formatDate = (value) => (value ? String(value).replace('T', ' ').slice(0, 19) : '-');

const MedicalDeviceAdverseEvent = () => {
  const [form] = Form.useForm();
  const [eventForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [records, setRecords] = useState([]);
  const [detailRecord, setDetailRecord] = useState(null);
  const [editingRecord, setEditingRecord] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [lastQuery, setLastQuery] = useState({});

  const loadRecords = useCallback(async (query = {}, page = 1, size = 10) => {
    setLoading(true);
    try {
      const response = await api.post('/api/adverseEvent/selectModelList', {
        pageNum: page,
        pageSize: size,
        eventName: query.eventName,
        patientName: query.patientName,
        involvedProject: query.involvedProject,
      });
      if (response.code !== 1) {
        message.error(getApiResponseMessage(response, '加载不良事件失败'));
        setRecords([]);
        setTotal(0);
        return;
      }
      const list = normalizeList(response.data).map((item) => ({ ...item, key: item.id }));
      setRecords(list);
      setTotal(response.data?.total || list.length);
    } catch (error) {
      message.error(getApiErrorMessage(error, '加载不良事件失败'));
      setRecords([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRecords(lastQuery, currentPage, pageSize);
  }, [currentPage, lastQuery, loadRecords, pageSize]);

  const handleSearch = async (values) => {
    setLastQuery(values);
    setCurrentPage(1);
    await loadRecords(values, 1, pageSize);
  };

  const handleReset = async () => {
    form.resetFields();
    setLastQuery({});
    setCurrentPage(1);
    await loadRecords({}, 1, pageSize);
  };

  const openCreateModal = () => {
    setEditingRecord(null);
    eventForm.resetFields();
    eventForm.setFieldsValue({ occurrenceDate: new Date().toISOString().slice(0, 19) });
    setEditVisible(true);
  };

  const openEditModal = (record) => {
    setEditingRecord(record);
    eventForm.setFieldsValue({
      patientName: record.patientName,
      gender: record.gender,
      age: record.age,
      patientId: record.patientId,
      hospitalizationNo: record.hospitalizationNo,
      involvedProject: record.involvedProject,
      eventName: record.eventName,
      occurrenceDate: record.occurrenceDate ? String(record.occurrenceDate).slice(0, 19) : undefined,
      eventSummary: record.eventSummary,
      investigationSituation: record.investigationSituation,
      eventAnalysis: record.eventAnalysis,
      eventSummaryDetail: record.eventSummaryDetail,
      handlingResult: record.handlingResult,
      rectificationMeasures: record.rectificationMeasures,
      attachment: record.attachment,
    });
    setEditVisible(true);
  };

  const handleSubmit = async (values) => {
    setSubmitLoading(true);
    try {
      const response = await api.post('/api/adverseEvent/addOrUpdate', {
        id: editingRecord?.id,
        patientName: values.patientName,
        gender: values.gender,
        age: values.age,
        patientId: values.patientId,
        hospitalizationNo: values.hospitalizationNo,
        involvedProject: values.involvedProject,
        eventName: values.eventName,
        occurrenceDate: values.occurrenceDate,
        eventSummary: values.eventSummary,
        investigationSituation: values.investigationSituation,
        eventAnalysis: values.eventAnalysis,
        eventSummaryDetail: values.eventSummaryDetail,
        handlingResult: values.handlingResult,
        rectificationMeasures: values.rectificationMeasures,
        attachment: values.attachment,
      });
      if (response.code !== 1) {
        message.error(getApiResponseMessage(response, editingRecord ? '修改失败' : '新增失败'));
        return;
      }
      message.success(editingRecord ? '修改成功' : '新增成功');
      setEditVisible(false);
      eventForm.resetFields();
      setEditingRecord(null);
      await loadRecords(lastQuery, currentPage, pageSize);
    } catch (error) {
      message.error(getApiErrorMessage(error, editingRecord ? '修改失败' : '新增失败'));
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (record) => {
    try {
      const response = await api.request('/api/adverseEvent/delete', {
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
  };

  const columns = [
    { title: '事件编号', dataIndex: 'eventNo', key: 'eventNo', width: 150 },
    { title: '事件名称', dataIndex: 'eventName', key: 'eventName', width: 180 },
    { title: '患者姓名', dataIndex: 'patientName', key: 'patientName', width: 120 },
    { title: '性别', dataIndex: 'gender', key: 'gender', width: 80 },
    { title: '年龄', dataIndex: 'age', key: 'age', width: 80 },
    { title: '患者/条码号', dataIndex: 'patientId', key: 'patientId', width: 160 },
    { title: '涉及项目', dataIndex: 'involvedProject', key: 'involvedProject', width: 160 },
    { title: '发生时间', dataIndex: 'occurrenceDate', key: 'occurrenceDate', width: 180, render: formatDate },
    { title: '事件概述', dataIndex: 'eventSummary', key: 'eventSummary', ellipsis: true },
    {
      title: '操作',
      key: 'action',
      width: 220,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => { setDetailRecord(record); setDetailVisible(true); }}>
            详情
          </Button>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => openEditModal(record)}>
            编辑
          </Button>
          <Button type="link" size="small" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)}>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '0 16px' }}>
      <Card style={{ marginBottom: 16 }}>
        <Form form={form} layout="inline" onFinish={handleSearch}>
          <Form.Item name="eventName">
            <Input placeholder="事件名称" allowClear />
          </Form.Item>
          <Form.Item name="patientName">
            <Input placeholder="患者姓名" allowClear />
          </Form.Item>
          <Form.Item name="involvedProject">
            <Input placeholder="涉及项目" allowClear />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                查询
              </Button>
              <Button onClick={handleReset}>重置</Button>
              <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
                新增登记
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      <Card>
        <Table
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={records}
          scroll={{ x: 1580 }}
          pagination={{
            current: currentPage,
            pageSize,
            total,
            showSizeChanger: true,
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            },
          }}
        />
      </Card>

      <Modal title={editingRecord ? '编辑不良事件' : '新增不良事件'} open={editVisible} onCancel={() => setEditVisible(false)} onOk={() => eventForm.submit()} confirmLoading={submitLoading} width={860} destroyOnClose>
        <Form form={eventForm} layout="vertical" onFinish={handleSubmit}>
          <Space style={{ width: '100%' }} align="start">
            <Form.Item name="patientName" label="患者姓名" rules={[{ required: true, message: '请输入患者姓名' }]} style={{ width: 240 }}>
              <Input />
            </Form.Item>
            <Form.Item name="gender" label="性别" style={{ width: 160 }}>
              <Input />
            </Form.Item>
            <Form.Item name="age" label="年龄" style={{ width: 160 }}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Space>
          <Space style={{ width: '100%' }} align="start">
            <Form.Item name="patientId" label="患者/条码号" style={{ width: 240 }}>
              <Input />
            </Form.Item>
            <Form.Item name="hospitalizationNo" label="住院号" style={{ width: 240 }}>
              <Input />
            </Form.Item>
            <Form.Item name="involvedProject" label="涉及项目" style={{ width: 240 }}>
              <Input />
            </Form.Item>
          </Space>
          <Space style={{ width: '100%' }} align="start">
            <Form.Item name="eventName" label="事件名称" rules={[{ required: true, message: '请输入事件名称' }]} style={{ width: 360 }}>
              <Input />
            </Form.Item>
            <Form.Item name="occurrenceDate" label="发生时间" rules={[{ required: true, message: '请输入发生时间' }]} style={{ width: 360 }}>
              <Input placeholder="例如 2026-03-30T09:00:00" />
            </Form.Item>
          </Space>
          <Form.Item name="eventSummary" label="事件概述">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="investigationSituation" label="调查情况">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="eventAnalysis" label="事件分析">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="eventSummaryDetail" label="事件总结">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="handlingResult" label="处理结果">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="rectificationMeasures" label="整改措施">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="attachment" label="附件">
            <Input placeholder="可填写附件名称或路径" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal title="不良事件详情" open={detailVisible} footer={null} onCancel={() => setDetailVisible(false)} width={860}>
        <Descriptions bordered column={2} size="small">
          <Descriptions.Item label="事件编号">{detailRecord?.eventNo || '-'}</Descriptions.Item>
          <Descriptions.Item label="事件名称">{detailRecord?.eventName || '-'}</Descriptions.Item>
          <Descriptions.Item label="患者姓名">{detailRecord?.patientName || '-'}</Descriptions.Item>
          <Descriptions.Item label="性别">{detailRecord?.gender || '-'}</Descriptions.Item>
          <Descriptions.Item label="年龄">{detailRecord?.age ?? '-'}</Descriptions.Item>
          <Descriptions.Item label="患者/条码号">{detailRecord?.patientId || '-'}</Descriptions.Item>
          <Descriptions.Item label="住院号">{detailRecord?.hospitalizationNo || '-'}</Descriptions.Item>
          <Descriptions.Item label="涉及项目">{detailRecord?.involvedProject || '-'}</Descriptions.Item>
          <Descriptions.Item label="发生时间">{formatDate(detailRecord?.occurrenceDate)}</Descriptions.Item>
          <Descriptions.Item label="附件">{detailRecord?.attachment || '-'}</Descriptions.Item>
          <Descriptions.Item label="事件概述" span={2}>{detailRecord?.eventSummary || '-'}</Descriptions.Item>
          <Descriptions.Item label="调查情况" span={2}>{detailRecord?.investigationSituation || '-'}</Descriptions.Item>
          <Descriptions.Item label="事件分析" span={2}>{detailRecord?.eventAnalysis || '-'}</Descriptions.Item>
          <Descriptions.Item label="事件总结" span={2}>{detailRecord?.eventSummaryDetail || '-'}</Descriptions.Item>
          <Descriptions.Item label="处理结果" span={2}>{detailRecord?.handlingResult || '-'}</Descriptions.Item>
          <Descriptions.Item label="整改措施" span={2}>{detailRecord?.rectificationMeasures || '-'}</Descriptions.Item>
        </Descriptions>
      </Modal>
    </div>
  );
};

export default MedicalDeviceAdverseEvent;
