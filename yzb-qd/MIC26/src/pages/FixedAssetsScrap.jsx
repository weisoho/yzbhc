import React, { useCallback, useEffect, useState } from 'react';
import { Button, Card, Descriptions, Form, Input, Modal, Popconfirm, Select, Space, Table, Tag, message } from 'antd';
import { CheckOutlined, CloseOutlined, EyeOutlined, PlusOutlined, SearchOutlined, StopOutlined } from '@ant-design/icons';
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

const auditStatusMeta = {
  1: { label: '待审核', color: 'orange' },
  2: { label: '已通过', color: 'green' },
  3: { label: '已驳回', color: 'red' },
  4: { label: '已撤销', color: 'default' },
};

const toRow = (item) => ({
  key: item.id,
  id: item.id,
  assetId: item.assetId,
  changeCode: item.changeCode || '-',
  assetCode: item.assetCode || '-',
  assetName: item.assetName || '-',
  assetTypeName: item.assetTypeName || '-',
  departmentName: item.depName || '-',
  reason: item.changeReason || '-',
  scrapValue: item.scrapValue || '-',
  applicantName: item.applicantName || '-',
  applyDate: item.applyDate,
  auditStatus: item.auditStatus,
  auditRemark: item.auditRemark || '-',
  remark: item.remark || '-',
});

const formatDate = (value) => (value ? String(value).replace('T', ' ').slice(0, 19) : '-');

const FixedAssetsScrap = () => {
  const [form] = Form.useForm();
  const [applyForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [records, setRecords] = useState([]);
  const [assets, setAssets] = useState([]);
  const [detailRecord, setDetailRecord] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [applyVisible, setApplyVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [lastQuery, setLastQuery] = useState({});

  const loadAssets = useCallback(async (keyword) => {
    try {
      const response = await api.request('/api/asset/selectAsset', {
        method: 'POST',
        params: {
          pageNum: 1,
          pageSize: 200,
          assetCode: keyword,
          assetName: keyword,
          assetState: 1,
        },
      });
      if (response.code !== 1) {
        return;
      }
      const list = normalizeList(response.data).map((item) => ({
        label: `${item.assetCode || ''} / ${item.assetName || ''} / ${item.depName || '未分配部门'}`,
        value: item.id,
      }));
      setAssets(list);
    } catch (error) {
      message.error(getApiErrorMessage(error, '加载可报废资产失败'));
    }
  }, []);

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
        message.error(getApiResponseMessage(response, '加载报废记录失败'));
        setRecords([]);
        setTotal(0);
        return;
      }
      const list = normalizeList(response.data).map(toRow);
      setRecords(list);
      setTotal(response.data?.total || list.length);
    } catch (error) {
      message.error(getApiErrorMessage(error, '加载报废记录失败'));
      setRecords([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAssets('');
  }, [loadAssets]);

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

  const handleApply = async (values) => {
    setSubmitLoading(true);
    try {
      const response = await api.post('/api/assetChange/applyScrap', {
        assetId: values.assetId,
        changeType: 'SCRAP',
        changeReason: values.changeReason,
        scrapValue: values.scrapValue,
        remark: values.remark,
      });
      if (response.code !== 1) {
        message.error(getApiResponseMessage(response, '提交报废申请失败'));
        return;
      }
      message.success('报废申请已提交');
      setApplyVisible(false);
      applyForm.resetFields();
      await loadRecords(lastQuery, currentPage, pageSize);
      await loadAssets('');
    } catch (error) {
      message.error(getApiErrorMessage(error, '提交报废申请失败'));
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleAudit = async (record, auditStatus) => {
    try {
      const response = await api.post('/api/assetChange/auditChange', {
        id: record.id,
        auditStatus,
        auditRemark: auditStatus === 2 ? '报废申请审核通过' : '报废申请审核驳回',
      });
      if (response.code !== 1) {
        message.error(getApiResponseMessage(response, '审核失败'));
        return;
      }
      message.success(auditStatus === 2 ? '已审核通过' : '已驳回申请');
      await loadRecords(lastQuery, currentPage, pageSize);
    } catch (error) {
      message.error(getApiErrorMessage(error, '审核失败'));
    }
  };

  const handleRevoke = async (record) => {
    try {
      const response = await api.request('/api/assetChange/revokeChange', {
        method: 'POST',
        params: {
          id: record.id,
          auditRemark: '前端撤销报废申请',
        },
      });
      if (response.code !== 1) {
        message.error(getApiResponseMessage(response, '撤销失败'));
        return;
      }
      message.success('报废申请已撤销');
      await loadRecords(lastQuery, currentPage, pageSize);
    } catch (error) {
      message.error(getApiErrorMessage(error, '撤销失败'));
    }
  };

  const columns = [
    { title: '报废单号', dataIndex: 'changeCode', key: 'changeCode', width: 150 },
    { title: '资产编码', dataIndex: 'assetCode', key: 'assetCode', width: 140 },
    { title: '资产名称', dataIndex: 'assetName', key: 'assetName', width: 160 },
    { title: '资产类型', dataIndex: 'assetTypeName', key: 'assetTypeName', width: 140 },
    { title: '使用部门', dataIndex: 'departmentName', key: 'departmentName', width: 140 },
    { title: '报废原因', dataIndex: 'reason', key: 'reason', ellipsis: true },
    { title: '净值/残值', dataIndex: 'scrapValue', key: 'scrapValue', width: 120 },
    { title: '申请人', dataIndex: 'applicantName', key: 'applicantName', width: 120 },
    {
      title: '申请时间',
      dataIndex: 'applyDate',
      key: 'applyDate',
      width: 180,
      render: formatDate,
    },
    {
      title: '审核状态',
      dataIndex: 'auditStatus',
      key: 'auditStatus',
      width: 120,
      render: (value) => {
        const meta = auditStatusMeta[value] || { label: '-', color: 'default' };
        return <Tag color={meta.color}>{meta.label}</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 260,
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
              <Button type="link" size="small" icon={<CloseOutlined />} danger onClick={() => handleAudit(record, 3)}>
                驳回
              </Button>
            </>
          ) : null}
          {record.auditStatus === 1 ? (
            <Popconfirm title="确认撤销当前报废申请？" onConfirm={() => handleRevoke(record)}>
              <Button type="link" size="small" icon={<StopOutlined />} danger>
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
              <Button type="primary" icon={<PlusOutlined />} onClick={() => setApplyVisible(true)}>
                新增报废申请
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

      <Modal title="新增报废申请" open={applyVisible} onCancel={() => setApplyVisible(false)} onOk={() => applyForm.submit()} confirmLoading={submitLoading} width={720} destroyOnClose>
        <Form form={applyForm} layout="vertical" onFinish={handleApply}>
          <Form.Item name="assetId" label="选择资产" rules={[{ required: true, message: '请选择资产' }]}> 
            <Select
              showSearch
              placeholder="输入资产编码或名称搜索"
              filterOption={false}
              onSearch={loadAssets}
              options={assets}
            />
          </Form.Item>
          <Form.Item name="changeReason" label="报废原因" rules={[{ required: true, message: '请输入报废原因' }]}> 
            <Input.TextArea rows={4} placeholder="请输入报废原因" />
          </Form.Item>
          <Form.Item name="scrapValue" label="净值/残值"> 
            <Input placeholder="如 1200.00" />
          </Form.Item>
          <Form.Item name="remark" label="备注"> 
            <Input.TextArea rows={3} placeholder="可填写审批说明或补充信息" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal title="报废详情" open={detailVisible} footer={null} onCancel={() => setDetailVisible(false)} width={720}>
        <Descriptions bordered column={2} size="small">
          <Descriptions.Item label="报废单号">{detailRecord?.changeCode || '-'}</Descriptions.Item>
          <Descriptions.Item label="资产编码">{detailRecord?.assetCode || '-'}</Descriptions.Item>
          <Descriptions.Item label="资产名称">{detailRecord?.assetName || '-'}</Descriptions.Item>
          <Descriptions.Item label="资产类型">{detailRecord?.assetTypeName || '-'}</Descriptions.Item>
          <Descriptions.Item label="使用部门">{detailRecord?.departmentName || '-'}</Descriptions.Item>
          <Descriptions.Item label="申请人">{detailRecord?.applicantName || '-'}</Descriptions.Item>
          <Descriptions.Item label="申请时间">{formatDate(detailRecord?.applyDate)}</Descriptions.Item>
          <Descriptions.Item label="审核状态">{auditStatusMeta[detailRecord?.auditStatus]?.label || '-'}</Descriptions.Item>
          <Descriptions.Item label="净值/残值">{detailRecord?.scrapValue || '-'}</Descriptions.Item>
          <Descriptions.Item label="审核意见">{detailRecord?.auditRemark || '-'}</Descriptions.Item>
          <Descriptions.Item label="报废原因" span={2}>{detailRecord?.reason || '-'}</Descriptions.Item>
          <Descriptions.Item label="备注" span={2}>{detailRecord?.remark || '-'}</Descriptions.Item>
        </Descriptions>
      </Modal>
    </div>
  );
};

export default FixedAssetsScrap;
