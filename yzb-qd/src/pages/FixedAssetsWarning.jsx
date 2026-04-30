import React, { useEffect, useState } from 'react';
import { Button, Card, Descriptions, Form, Input, Modal, Select, Space, Table, Tag, message } from 'antd';
import { EyeOutlined, SearchOutlined } from '@ant-design/icons';
import api, { getApiErrorMessage, getApiResponseMessage } from '../utils/api.js';

const warningTypeOptions = [
  { value: '使用年限预警', label: '使用年限预警' },
  { value: '资产闲置', label: '资产闲置' },
  { value: '维修跟进', label: '维修跟进' },
];

const warningLevelMeta = {
  high: { label: '高', color: 'red' },
  medium: { label: '中', color: 'orange' },
  low: { label: '低', color: 'green' },
};

const statusMeta = {
  1: { label: '待处理', color: 'default' },
  2: { label: '处理中', color: 'processing' },
  3: { label: '已完成', color: 'success' },
};

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

const FixedAssetsWarning = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState([]);
  const [detailRecord, setDetailRecord] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [lastQuery, setLastQuery] = useState({});

  const loadWarnings = async (query = {}, page = currentPage, size = pageSize) => {
    setLoading(true);
    try {
      const response = await api.post('/api/assetWarning/page', {
        pageNum: page,
        pageSize: size,
        assetCode: query.assetCode,
        assetName: query.assetName,
        warningType: query.warningType,
        warningLevel: query.warningLevel,
        status: query.status,
      });
      if (response.code !== 1) {
        message.error(getApiResponseMessage(response, '加载预警数据失败'));
        setRecords([]);
        setTotal(0);
        return;
      }
      const list = normalizeList(response.data).map((item, index) => ({ ...item, key: `${item.assetId}-${item.warningType}-${index}` }));
      setRecords(list);
      setTotal(response.data?.total || list.length);
    } catch (error) {
      message.error(getApiErrorMessage(error, '加载预警数据失败'));
      setRecords([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWarnings(lastQuery, currentPage, pageSize);
  }, [currentPage, pageSize]);

  const handleSearch = async (values) => {
    setLastQuery(values);
    setCurrentPage(1);
    await loadWarnings(values, 1, pageSize);
  };

  const handleReset = async () => {
    form.resetFields();
    setLastQuery({});
    setCurrentPage(1);
    await loadWarnings({}, 1, pageSize);
  };

  const handleStatusChange = async (record, status) => {
    try {
      const response = await api.post('/api/assetWarning/updateStatus', {
        assetId: record.assetId,
        warningType: record.warningType,
        warningLevel: record.warningLevel,
        warningDate: record.warningDate,
        dueDate: record.dueDate,
        daysLeft: record.daysLeft,
        description: record.description,
        actionRequired: record.actionRequired,
        status,
        remark: record.remark,
      });
      if (response.code !== 1) {
        message.error(getApiResponseMessage(response, '更新处理状态失败'));
        return;
      }
      message.success('处理状态已更新');
      await loadWarnings(lastQuery, currentPage, pageSize);
    } catch (error) {
      message.error(getApiErrorMessage(error, '更新处理状态失败'));
    }
  };

  const columns = [
    {
      title: '预警级别',
      dataIndex: 'warningLevel',
      key: 'warningLevel',
      width: 100,
      render: (value) => <Tag color={warningLevelMeta[value]?.color || 'default'}>{warningLevelMeta[value]?.label || '-'}</Tag>,
    },
    { title: '资产编码', dataIndex: 'assetCode', key: 'assetCode', width: 140 },
    { title: '资产名称', dataIndex: 'assetName', key: 'assetName', width: 160 },
    { title: '资产类型', dataIndex: 'assetType', key: 'assetType', width: 140 },
    { title: '责任人', dataIndex: 'responsiblePerson', key: 'responsiblePerson', width: 120 },
    { title: '预警类型', dataIndex: 'warningType', key: 'warningType', width: 160 },
    { title: '剩余天数', dataIndex: 'daysLeft', key: 'daysLeft', width: 100 },
    { title: '到期日期', dataIndex: 'dueDate', key: 'dueDate', width: 180, render: formatDate },
    {
      title: '处理状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (value) => <Tag color={statusMeta[value]?.color || 'default'}>{statusMeta[value]?.label || '-'}</Tag>,
    },
    { title: '预警描述', dataIndex: 'description', key: 'description', ellipsis: true },
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
          {record.status !== 2 ? (
            <Button type="link" size="small" onClick={() => handleStatusChange(record, 2)}>
              标记处理中
            </Button>
          ) : null}
          {record.status !== 3 ? (
            <Button type="link" size="small" onClick={() => handleStatusChange(record, 3)}>
              标记完成
            </Button>
          ) : null}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '0 16px' }}>
      <Card style={{ marginBottom: 16 }}>
        <Form form={form} layout="inline" onFinish={handleSearch}>
          <Form.Item name="assetCode">
            <Input placeholder="资产编码" allowClear />
          </Form.Item>
          <Form.Item name="assetName">
            <Input placeholder="资产名称" allowClear />
          </Form.Item>
          <Form.Item name="warningType">
            <Select placeholder="预警类型" allowClear style={{ width: 160 }} options={warningTypeOptions} />
          </Form.Item>
          <Form.Item name="warningLevel">
            <Select placeholder="预警级别" allowClear style={{ width: 140 }} options={Object.entries(warningLevelMeta).map(([value, meta]) => ({ value, label: meta.label }))} />
          </Form.Item>
          <Form.Item name="status">
            <Select placeholder="处理状态" allowClear style={{ width: 140 }} options={Object.entries(statusMeta).map(([value, meta]) => ({ value: Number(value), label: meta.label }))} />
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
          rowKey="key"
          loading={loading}
          columns={columns}
          dataSource={records}
          scroll={{ x: 1500 }}
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

      <Modal title="预警详情" open={detailVisible} footer={null} onCancel={() => setDetailVisible(false)} width={760}>
        <Descriptions bordered column={2} size="small">
          <Descriptions.Item label="资产编码">{detailRecord?.assetCode || '-'}</Descriptions.Item>
          <Descriptions.Item label="资产名称">{detailRecord?.assetName || '-'}</Descriptions.Item>
          <Descriptions.Item label="资产类型">{detailRecord?.assetType || '-'}</Descriptions.Item>
          <Descriptions.Item label="责任人">{detailRecord?.responsiblePerson || '-'}</Descriptions.Item>
          <Descriptions.Item label="预警类型">{detailRecord?.warningType || '-'}</Descriptions.Item>
          <Descriptions.Item label="预警级别">{warningLevelMeta[detailRecord?.warningLevel]?.label || '-'}</Descriptions.Item>
          <Descriptions.Item label="到期日期">{formatDate(detailRecord?.dueDate)}</Descriptions.Item>
          <Descriptions.Item label="剩余天数">{detailRecord?.daysLeft ?? '-'}</Descriptions.Item>
          <Descriptions.Item label="处理状态">{statusMeta[detailRecord?.status]?.label || '-'}</Descriptions.Item>
          <Descriptions.Item label="购置日期">{formatDate(detailRecord?.purchaseDate)}</Descriptions.Item>
          <Descriptions.Item label="原值">{detailRecord?.originalValue || '-'}</Descriptions.Item>
          <Descriptions.Item label="使用年限">{detailRecord?.usefulLife || '-'}</Descriptions.Item>
          <Descriptions.Item label="建议措施">{detailRecord?.actionRequired || '-'}</Descriptions.Item>
          <Descriptions.Item label="预警描述" span={2}>{detailRecord?.description || '-'}</Descriptions.Item>
          <Descriptions.Item label="备注" span={2}>{detailRecord?.remark || '-'}</Descriptions.Item>
        </Descriptions>
      </Modal>
    </div>
  );
};

export default FixedAssetsWarning;
