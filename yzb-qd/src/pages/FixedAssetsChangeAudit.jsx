import React, { useCallback, useEffect, useState } from 'react';
import { Button, Card, Descriptions, Form, Input, Modal, Select, Space, Table, Tag, message } from 'antd';
import { CheckOutlined, CloseOutlined, EyeOutlined, HistoryOutlined, SearchOutlined } from '@ant-design/icons';
import api, { getApiErrorMessage, getApiResponseMessage } from '../utils/api.js';

const normalizeList = (payload) => {
  if (Array.isArray(payload?.records)) {
    return payload.records;
  }
  if (Array.isArray(payload?.list)) {
    return payload.list;
  }
  return [];
};

const auditStatusMeta = {
  1: { label: '待审核', color: 'orange' },
  2: { label: '已通过', color: 'green' },
  3: { label: '已驳回', color: 'red' },
  4: { label: '已撤销', color: 'default' },
};

const changeTypeOptions = [
  { value: 'SCRAP', label: '报废申请' },
  { value: 'DEPARTMENT', label: '部门变更' },
  { value: 'RESPONSIBLE', label: '责任人变更' },
  { value: 'LOCATION', label: '存放地点变更' },
  { value: 'INFO', label: '资产信息变更' },
];

const formatDate = (value) => (value ? String(value).replace('T', ' ').slice(0, 19) : '-');

const FixedAssetsChangeAudit = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState([]);
  const [detailRecord, setDetailRecord] = useState(null);
  const [historyRecords, setHistoryRecords] = useState([]);
  const [detailVisible, setDetailVisible] = useState(false);
  const [historyVisible, setHistoryVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [lastQuery, setLastQuery] = useState({ changeType: 'SCRAP' });

  const loadRecords = useCallback(async (query = {}, page = 1, size = 10) => {
    setLoading(true);
    try {
      const response = await api.post('/api/assetChange/selectModelList', {
        pageNum: page,
        pageSize: size,
        changeType: query.changeType,
        assetCode: query.assetCode,
        assetName: query.assetName,
        auditStatus: query.auditStatus,
      });
      if (response.code !== 1) {
        message.error(getApiResponseMessage(response, '加载变更审核数据失败'));
        setRecords([]);
        setTotal(0);
        return;
      }
      const list = normalizeList(response.data).map((item) => ({ ...item, key: item.id }));
      setRecords(list);
      setTotal(response.data?.total || list.length);
    } catch (error) {
      message.error(getApiErrorMessage(error, '加载变更审核数据失败'));
      setRecords([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    form.setFieldsValue({ changeType: 'SCRAP' });
    loadRecords(lastQuery, currentPage, pageSize);
  }, [currentPage, form, lastQuery, loadRecords, pageSize]);

  const handleSearch = async (values) => {
    const query = { ...values };
    setLastQuery(query);
    setCurrentPage(1);
    await loadRecords(query, 1, pageSize);
  };

  const handleReset = async () => {
    form.resetFields();
    const query = { changeType: 'SCRAP' };
    form.setFieldsValue(query);
    setLastQuery(query);
    setCurrentPage(1);
    await loadRecords(query, 1, pageSize);
  };

  const handleAudit = async (record, auditStatus) => {
    try {
      const response = await api.post('/api/assetChange/auditChange', {
        id: record.id,
        auditStatus,
        auditRemark: auditStatus === 2 ? '审核通过' : '审核驳回',
      });
      if (response.code !== 1) {
        message.error(getApiResponseMessage(response, '审核失败'));
        return;
      }
      message.success(auditStatus === 2 ? '已通过审核' : '已驳回申请');
      await loadRecords(lastQuery, currentPage, pageSize);
    } catch (error) {
      message.error(getApiErrorMessage(error, '审核失败'));
    }
  };

  const handleHistory = async (record) => {
    try {
      const response = await api.post('/api/assetChange/selectModelList', {
        pageNum: 1,
        pageSize: 100,
        assetId: record.assetId,
      });
      if (response.code !== 1) {
        message.error(getApiResponseMessage(response, '加载历史记录失败'));
        return;
      }
      setHistoryRecords(normalizeList(response.data));
      setHistoryVisible(true);
    } catch (error) {
      message.error(getApiErrorMessage(error, '加载历史记录失败'));
    }
  };

  const columns = [
    { title: '变更单号', dataIndex: 'changeCode', key: 'changeCode', width: 150 },
    { title: '资产编码', dataIndex: 'assetCode', key: 'assetCode', width: 140 },
    { title: '资产名称', dataIndex: 'assetName', key: 'assetName', width: 160 },
    {
      title: '变更类型',
      dataIndex: 'changeType',
      key: 'changeType',
      width: 140,
      render: (value) => changeTypeOptions.find((item) => item.value === value)?.label || value || '-',
    },
    { title: '原值', dataIndex: 'oldValue', key: 'oldValue', width: 160, ellipsis: true },
    { title: '新值', dataIndex: 'newValue', key: 'newValue', width: 160, ellipsis: true },
    { title: '申请人', dataIndex: 'applicantName', key: 'applicantName', width: 120 },
    { title: '申请时间', dataIndex: 'applyDate', key: 'applyDate', width: 180, render: formatDate },
    {
      title: '审核状态',
      dataIndex: 'auditStatus',
      key: 'auditStatus',
      width: 120,
      render: (value) => <Tag color={auditStatusMeta[value]?.color || 'default'}>{auditStatusMeta[value]?.label || '-'}</Tag>,
    },
    {
      title: '操作',
      key: 'action',
      width: 240,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => { setDetailRecord(record); setDetailVisible(true); }}>
            详情
          </Button>
          {record.auditStatus === 1 ? (
            <>
              <Button type="link" size="small" icon={<CheckOutlined />} onClick={() => handleAudit(record, 2)}>
                通过
              </Button>
              <Button type="link" size="small" danger icon={<CloseOutlined />} onClick={() => handleAudit(record, 3)}>
                驳回
              </Button>
            </>
          ) : null}
          <Button type="link" size="small" icon={<HistoryOutlined />} onClick={() => handleHistory(record)}>
            历史
          </Button>
        </Space>
      ),
    },
  ];

  const historyColumns = [
    { title: '单号', dataIndex: 'changeCode', key: 'changeCode', width: 150 },
    {
      title: '类型',
      dataIndex: 'changeType',
      key: 'changeType',
      width: 120,
      render: (value) => changeTypeOptions.find((item) => item.value === value)?.label || value || '-',
    },
    { title: '原值', dataIndex: 'oldValue', key: 'oldValue', ellipsis: true },
    { title: '新值', dataIndex: 'newValue', key: 'newValue', ellipsis: true },
    { title: '申请时间', dataIndex: 'applyDate', key: 'applyDate', width: 180, render: formatDate },
    {
      title: '状态',
      dataIndex: 'auditStatus',
      key: 'auditStatus',
      width: 120,
      render: (value) => <Tag color={auditStatusMeta[value]?.color || 'default'}>{auditStatusMeta[value]?.label || '-'}</Tag>,
    },
  ];

  return (
    <div style={{ padding: '0 16px' }}>
      <Card style={{ marginBottom: 16 }}>
        <Form form={form} layout="inline" onFinish={handleSearch}>
          <Form.Item name="changeType" initialValue="SCRAP">
            <Select style={{ width: 160 }} options={changeTypeOptions} />
          </Form.Item>
          <Form.Item name="assetCode">
            <Input placeholder="资产编码" allowClear />
          </Form.Item>
          <Form.Item name="assetName">
            <Input placeholder="资产名称" allowClear />
          </Form.Item>
          <Form.Item name="auditStatus">
            <Select placeholder="审核状态" allowClear style={{ width: 140 }} options={Object.entries(auditStatusMeta).map(([value, meta]) => ({ value: Number(value), label: meta.label }))} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                查询
              </Button>
              <Button onClick={handleReset}>重置</Button>
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
          scroll={{ x: 1520 }}
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

      <Modal title="变更详情" open={detailVisible} footer={null} onCancel={() => setDetailVisible(false)} width={760}>
        <Descriptions bordered column={2} size="small">
          <Descriptions.Item label="变更单号">{detailRecord?.changeCode || '-'}</Descriptions.Item>
          <Descriptions.Item label="资产编码">{detailRecord?.assetCode || '-'}</Descriptions.Item>
          <Descriptions.Item label="资产名称">{detailRecord?.assetName || '-'}</Descriptions.Item>
          <Descriptions.Item label="变更类型">{changeTypeOptions.find((item) => item.value === detailRecord?.changeType)?.label || detailRecord?.changeType || '-'}</Descriptions.Item>
          <Descriptions.Item label="原值">{detailRecord?.oldValue || '-'}</Descriptions.Item>
          <Descriptions.Item label="新值">{detailRecord?.newValue || '-'}</Descriptions.Item>
          <Descriptions.Item label="申请人">{detailRecord?.applicantName || '-'}</Descriptions.Item>
          <Descriptions.Item label="申请时间">{formatDate(detailRecord?.applyDate)}</Descriptions.Item>
          <Descriptions.Item label="审核状态">{auditStatusMeta[detailRecord?.auditStatus]?.label || '-'}</Descriptions.Item>
          <Descriptions.Item label="审核意见">{detailRecord?.auditRemark || '-'}</Descriptions.Item>
          <Descriptions.Item label="变更原因" span={2}>{detailRecord?.changeReason || '-'}</Descriptions.Item>
          <Descriptions.Item label="备注" span={2}>{detailRecord?.remark || '-'}</Descriptions.Item>
        </Descriptions>
      </Modal>

      <Modal title="资产历史变更" open={historyVisible} footer={null} onCancel={() => setHistoryVisible(false)} width={900}>
        <Table rowKey="id" columns={historyColumns} dataSource={historyRecords} pagination={false} scroll={{ x: 900, y: 360 }} />
      </Modal>
    </div>
  );
};

export default FixedAssetsChangeAudit;
