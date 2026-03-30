import React, { useCallback, useEffect, useState } from 'react';
import { Button, Card, Descriptions, Form, Input, InputNumber, Modal, Select, Space, Table, message } from 'antd';
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

const toInventoryOptions = (list) => list.map((item) => ({
  label: `${item.materialCode || ''} / ${item.materialName || ''} / 批号:${item.batchNumber || '-'} / 库存:${item.currentStock ?? 0}`,
  value: item.id,
}));

const ConsumablesQualityIssueRecord = () => {
  const [form] = Form.useForm();
  const [issueForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [records, setRecords] = useState([]);
  const [inventoryOptions, setInventoryOptions] = useState([]);
  const [detailRecord, setDetailRecord] = useState(null);
  const [editingRecord, setEditingRecord] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [lastQuery, setLastQuery] = useState({});

  const loadInventories = useCallback(async (keyword = '') => {
    try {
      const response = await api.get('/api/scm/inventory', {
        pageNum: 1,
        pageSize: 200,
        materialCode: keyword,
        materialName: keyword,
        batchNumber: keyword,
      });
      if (response.code !== 1) {
        return;
      }
      const list = normalizeList(response.data).filter((item) => (item.currentStock || 0) > 0);
      setInventoryOptions(toInventoryOptions(list));
    } catch (error) {
      message.error(getApiErrorMessage(error, '加载库存失败'));
    }
  }, []);

  const loadRecords = useCallback(async (query = {}, page = 1, size = 10) => {
    setLoading(true);
    try {
      const response = await api.post('/api/qualityIssue/selectModelList', {
        pageNum: page,
        pageSize: size,
        materialCode: query.materialCode,
        materialName: query.materialName,
        batchNumber: query.batchNumber,
        supplier: query.supplier,
        manufacturer: query.manufacturer,
      });
      if (response.code !== 1) {
        message.error(getApiResponseMessage(response, '加载质量问题记录失败'));
        setRecords([]);
        setTotal(0);
        return;
      }
      const list = normalizeList(response.data).map((item) => ({ ...item, key: item.id }));
      setRecords(list);
      setTotal(response.data?.total || list.length);
    } catch (error) {
      message.error(getApiErrorMessage(error, '加载质量问题记录失败'));
      setRecords([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInventories();
  }, [loadInventories]);

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
    issueForm.resetFields();
    issueForm.setFieldsValue({ occurrenceDate: new Date().toISOString().slice(0, 19) });
    setEditVisible(true);
  };

  const openEditModal = (record) => {
    setEditingRecord(record);
    issueForm.setFieldsValue({
      occurrenceDate: record.occurrenceDate ? String(record.occurrenceDate).slice(0, 19) : undefined,
      issueDescription: record.issueDescription,
      attachment: record.attachment,
    });
    setEditVisible(true);
  };

  const handleSubmit = async (values) => {
    setSubmitLoading(true);
    try {
      const payload = editingRecord
        ? {
            id: editingRecord.id,
            occurrenceDate: values.occurrenceDate,
            issueDescription: values.issueDescription,
            attachment: values.attachment,
          }
        : {
            inventoryId: values.inventoryId,
            quantity: values.quantity,
            occurrenceDate: values.occurrenceDate,
            issueDescription: values.issueDescription,
            attachment: values.attachment,
          };
      const response = await api.post('/api/qualityIssue/addOrUpdate', payload);
      if (response.code !== 1) {
        message.error(getApiResponseMessage(response, editingRecord ? '修改失败' : '新增失败'));
        return;
      }
      message.success(editingRecord ? '修改成功' : '新增成功');
      setEditVisible(false);
      issueForm.resetFields();
      setEditingRecord(null);
      await loadRecords(lastQuery, currentPage, pageSize);
      await loadInventories();
    } catch (error) {
      message.error(getApiErrorMessage(error, editingRecord ? '修改失败' : '新增失败'));
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (record) => {
    try {
      const response = await api.request('/api/qualityIssue/delete', {
        method: 'POST',
        params: { id: record.id },
      });
      if (response.code !== 1) {
        message.error(getApiResponseMessage(response, '删除失败'));
        return;
      }
      message.success('删除成功');
      await loadRecords(lastQuery, currentPage, pageSize);
      await loadInventories();
    } catch (error) {
      message.error(getApiErrorMessage(error, '删除失败'));
    }
  };

  const columns = [
    { title: '问题编号', dataIndex: 'issueNo', key: 'issueNo', width: 150 },
    { title: '物资编码', dataIndex: 'materialCode', key: 'materialCode', width: 140 },
    { title: '物资名称', dataIndex: 'materialName', key: 'materialName', width: 160 },
    { title: '规格', dataIndex: 'specification', key: 'specification', width: 120 },
    { title: '型号', dataIndex: 'model', key: 'model', width: 120 },
    { title: '批号', dataIndex: 'batchNumber', key: 'batchNumber', width: 140 },
    { title: '供应商', dataIndex: 'supplierName', key: 'supplierName', width: 160 },
    { title: '生产厂家', dataIndex: 'manufacturer', key: 'manufacturer', width: 160 },
    { title: '问题数量', dataIndex: 'quantity', key: 'quantity', width: 100 },
    { title: '发生时间', dataIndex: 'occurrenceDate', key: 'occurrenceDate', width: 180, render: formatDate },
    { title: '问题描述', dataIndex: 'issueDescription', key: 'issueDescription', ellipsis: true },
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
          <Form.Item name="materialCode">
            <Input placeholder="物资编码" allowClear />
          </Form.Item>
          <Form.Item name="materialName">
            <Input placeholder="物资名称" allowClear />
          </Form.Item>
          <Form.Item name="batchNumber">
            <Input placeholder="批号" allowClear />
          </Form.Item>
          <Form.Item name="supplier">
            <Input placeholder="供应商" allowClear />
          </Form.Item>
          <Form.Item name="manufacturer">
            <Input placeholder="生产厂家" allowClear />
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
          scroll={{ x: 1680 }}
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

      <Modal title={editingRecord ? '编辑质量问题记录' : '新增质量问题记录'} open={editVisible} onCancel={() => setEditVisible(false)} onOk={() => issueForm.submit()} confirmLoading={submitLoading} width={760} destroyOnClose>
        <Form form={issueForm} layout="vertical" onFinish={handleSubmit}>
          {!editingRecord ? (
            <Form.Item name="inventoryId" label="库存批次" rules={[{ required: true, message: '请选择库存批次' }]}> 
              <Select showSearch filterOption={false} onSearch={loadInventories} options={inventoryOptions} placeholder="输入物资编码、名称或批号搜索库存" />
            </Form.Item>
          ) : null}
          {!editingRecord ? (
            <Form.Item name="quantity" label="问题数量" rules={[{ required: true, message: '请输入问题数量' }]}> 
              <InputNumber min={1} style={{ width: '100%' }} placeholder="请输入问题数量" />
            </Form.Item>
          ) : null}
          <Form.Item name="occurrenceDate" label="发生时间" rules={[{ required: true, message: '请输入发生时间' }]}> 
            <Input placeholder="例如 2026-03-30T09:00:00" />
          </Form.Item>
          <Form.Item name="issueDescription" label="问题描述" rules={[{ required: true, message: '请输入问题描述' }]}> 
            <Input.TextArea rows={4} placeholder="请输入问题描述" />
          </Form.Item>
          <Form.Item name="attachment" label="附件"> 
            <Input placeholder="可填写附件名称或路径" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal title="质量问题详情" open={detailVisible} footer={null} onCancel={() => setDetailVisible(false)} width={780}>
        <Descriptions bordered column={2} size="small">
          <Descriptions.Item label="问题编号">{detailRecord?.issueNo || '-'}</Descriptions.Item>
          <Descriptions.Item label="库存ID">{detailRecord?.inventoryId || '-'}</Descriptions.Item>
          <Descriptions.Item label="物资编码">{detailRecord?.materialCode || '-'}</Descriptions.Item>
          <Descriptions.Item label="物资名称">{detailRecord?.materialName || '-'}</Descriptions.Item>
          <Descriptions.Item label="规格">{detailRecord?.specification || '-'}</Descriptions.Item>
          <Descriptions.Item label="型号">{detailRecord?.model || '-'}</Descriptions.Item>
          <Descriptions.Item label="批号">{detailRecord?.batchNumber || '-'}</Descriptions.Item>
          <Descriptions.Item label="问题数量">{detailRecord?.quantity || '-'}</Descriptions.Item>
          <Descriptions.Item label="供应商">{detailRecord?.supplierName || '-'}</Descriptions.Item>
          <Descriptions.Item label="生产厂家">{detailRecord?.manufacturer || '-'}</Descriptions.Item>
          <Descriptions.Item label="发生时间">{formatDate(detailRecord?.occurrenceDate)}</Descriptions.Item>
          <Descriptions.Item label="附件">{detailRecord?.attachment || '-'}</Descriptions.Item>
          <Descriptions.Item label="问题描述" span={2}>{detailRecord?.issueDescription || '-'}</Descriptions.Item>
        </Descriptions>
      </Modal>
    </div>
  );
};

export default ConsumablesQualityIssueRecord;
