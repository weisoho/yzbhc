import React, { useCallback, useEffect, useState } from 'react';
import { Button, Card, Descriptions, Form, Input, Modal, Popconfirm, Select, Space, Table, Tag, message } from 'antd';
import { EyeOutlined, SearchOutlined, StopOutlined } from '@ant-design/icons';
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

const executeStatusMeta = {
  0: { label: '未执行', color: 'default' },
  1: { label: '处理中', color: 'processing' },
  2: { label: '已完成', color: 'success' },
};

const formatDate = (value) => (value ? String(value).replace('T', ' ').slice(0, 19) : '-');

const FixedAssetsScrapDetail = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState([]);
  const [detailRecord, setDetailRecord] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [lastQuery, setLastQuery] = useState({});

  const loadRecords = useCallback(async (query = {}, page = 1, size = 10) => {
    setLoading(true);
    try {
      const response = await api.post('/api/assetChange/selectModelList', {
        pageNum: page,
        pageSize: size,
        changeType: 'SCRAP',
        assetCode: query.assetCode,
        assetName: query.assetName,
        auditStatus: query.auditStatus,
      });
      if (response.code !== 1) {
        message.error(getApiResponseMessage(response, '加载报废明细失败'));
        setRecords([]);
        setTotal(0);
        return;
      }
      const list = normalizeList(response.data).map((item) => ({ ...item, key: item.id }));
      setRecords(list);
      setTotal(response.data?.total || list.length);
    } catch (error) {
      message.error(getApiErrorMessage(error, '加载报废明细失败'));
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

  const handleRevoke = async (record) => {
    try {
      const response = await api.request('/api/assetChange/revokeChange', {
        method: 'POST',
        params: {
          id: record.id,
          auditRemark: '从报废明细页撤销',
        },
      });
      if (response.code !== 1) {
        message.error(getApiResponseMessage(response, '撤销失败'));
        return;
      }
      message.success('记录已撤销');
      await loadRecords(lastQuery, currentPage, pageSize);
    } catch (error) {
      message.error(getApiErrorMessage(error, '撤销失败'));
    }
  };

  const columns = [
    { title: '报废单号', dataIndex: 'changeCode', key: 'changeCode', width: 150 },
    { title: '资产编码', dataIndex: 'assetCode', key: 'assetCode', width: 140 },
    { title: '资产名称', dataIndex: 'assetName', key: 'assetName', width: 160 },
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
      title: '执行状态',
      dataIndex: 'executeStatus',
      key: 'executeStatus',
      width: 120,
      render: (value) => <Tag color={executeStatusMeta[value]?.color || 'default'}>{executeStatusMeta[value]?.label || '-'}</Tag>,
    },
    { title: '审核意见', dataIndex: 'auditRemark', key: 'auditRemark', ellipsis: true },
    {
      title: '操作',
      key: 'action',
      width: 180,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => { setDetailRecord(record); setDetailVisible(true); }}>
            详情
          </Button>
          {record.auditStatus === 1 ? (
            <Popconfirm title="确认撤销该报废申请？" onConfirm={() => handleRevoke(record)}>
              <Button type="link" size="small" danger icon={<StopOutlined />}>
                撤销
              </Button>
            </Popconfirm>
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
          scroll={{ x: 1280 }}
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

      <Modal title="报废明细" open={detailVisible} footer={null} onCancel={() => setDetailVisible(false)} width={760}>
        <Descriptions bordered column={2} size="small">
          <Descriptions.Item label="报废单号">{detailRecord?.changeCode || '-'}</Descriptions.Item>
          <Descriptions.Item label="资产编码">{detailRecord?.assetCode || '-'}</Descriptions.Item>
          <Descriptions.Item label="资产名称">{detailRecord?.assetName || '-'}</Descriptions.Item>
          <Descriptions.Item label="资产类型">{detailRecord?.assetTypeName || '-'}</Descriptions.Item>
          <Descriptions.Item label="申请人">{detailRecord?.applicantName || '-'}</Descriptions.Item>
          <Descriptions.Item label="申请时间">{formatDate(detailRecord?.applyDate)}</Descriptions.Item>
          <Descriptions.Item label="审核状态">{auditStatusMeta[detailRecord?.auditStatus]?.label || '-'}</Descriptions.Item>
          <Descriptions.Item label="执行状态">{executeStatusMeta[detailRecord?.executeStatus]?.label || '-'}</Descriptions.Item>
          <Descriptions.Item label="净值/残值">{detailRecord?.scrapValue || '-'}</Descriptions.Item>
          <Descriptions.Item label="审核意见">{detailRecord?.auditRemark || '-'}</Descriptions.Item>
          <Descriptions.Item label="报废原因" span={2}>{detailRecord?.changeReason || '-'}</Descriptions.Item>
          <Descriptions.Item label="备注" span={2}>{detailRecord?.remark || '-'}</Descriptions.Item>
        </Descriptions>
      </Modal>
    </div>
  );
};

export default FixedAssetsScrapDetail;
