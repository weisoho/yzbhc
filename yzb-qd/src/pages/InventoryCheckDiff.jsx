import React, { useEffect, useMemo, useState } from 'react';
import { Button, Card, Space, Table, Tabs, Tag, message } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { getApiErrorMessage, getApiResponseMessage } from '../utils/api.js';
import { archiveCheckRecord, fetchCheckRecords, fetchInventoryCatalog, formatDate, mapCheckRecord } from '../utils/inventoryCheck.js';

const InventoryCheckDiff = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [pendingDiffRecords, setPendingDiffRecords] = useState([]);
  const [historyRecords, setHistoryRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('pending');

  const loadDiffData = async () => {
    try {
      setLoading(true);
      const [inventoryResult, pendingResult, historyResult] = await Promise.all([
        fetchInventoryCatalog(),
        fetchCheckRecords(0),
        fetchCheckRecords(2),
      ]);

      const inventoryById = inventoryResult.records.reduce((accumulator, item) => {
        accumulator[item.id] = item;
        return accumulator;
      }, {});

      const pendingRows = pendingResult.records
        .map((item) => mapCheckRecord(item, inventoryById))
        .filter((item) => item.checkState === 'checked' && item.cheStatus !== 0);
      const historyRows = historyResult.records.map((item) => mapCheckRecord(item, inventoryById));

      setPendingDiffRecords(pendingRows);
      setHistoryRecords(historyRows);
    } catch (error) {
      message.error(getApiErrorMessage(error, '加载盘点损溢数据失败'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDiffData();
  }, []);

  useEffect(() => {
    if (location.state?.source === 'detail-submit') {
      setActiveTab('pending');
    }
  }, [location.state]);

  const focusedPendingRecords = useMemo(() => {
    if (!location.state?.focusId) {
      return pendingDiffRecords;
    }
    const focusedRecord = pendingDiffRecords.find((item) => item.id === location.state.focusId);
    return focusedRecord ? [focusedRecord, ...pendingDiffRecords.filter((item) => item.id !== location.state.focusId)] : pendingDiffRecords;
  }, [location.state, pendingDiffRecords]);

  const handleArchive = async (record) => {
    try {
      setLoading(true);
      const response = await archiveCheckRecord(record.id);
      if (response.code !== 1) {
        message.error(getApiResponseMessage(response, '损溢记录确认失败'));
        return;
      }
      message.success('损溢记录已归档');
      await loadDiffData();
    } catch (error) {
      message.error(getApiErrorMessage(error, '损溢记录确认失败'));
    } finally {
      setLoading(false);
    }
  };

  const detailColumns = [
    { title: '盘点单号', dataIndex: 'cheCode', key: 'cheCode', width: 180 },
    { title: '物资编码', dataIndex: 'materialCode', key: 'materialCode', width: 140 },
    { title: '商品名称', dataIndex: 'materialName', key: 'materialName', width: 180 },
    { title: '规格型号', key: 'specification', width: 180, render: (_, record) => `${record.specification} / ${record.model}` },
    { title: '货架位置', dataIndex: 'shelf', key: 'shelf', width: 120 },
    { title: '批号', dataIndex: 'batchNumber', key: 'batchNumber', width: 140 },
    { title: '系统数量', dataIndex: 'sysNum', key: 'sysNum', width: 100 },
    { title: '实际数量', dataIndex: 'actualNum', key: 'actualNum', width: 100 },
    {
      title: '差异',
      dataIndex: 'diffQuantity',
      key: 'diffQuantity',
      width: 100,
      render: (difference) => (
        <span style={{ color: difference === 0 ? '#262626' : difference > 0 ? '#d46b08' : '#cf1322' }}>
          {difference > 0 ? '+' : ''}{difference}
        </span>
      )
    },
    { title: '差异类型', dataIndex: 'resultText', key: 'resultText', width: 100, render: (value, record) => <Tag color={record.resultColor}>{value}</Tag> },
    {
      title: '建议处理',
      key: 'suggestion',
      width: 220,
      render: (_, record) => record.cheStatus === 1 ? '盘亏: 建议走消耗出库或报损' : '盘盈: 仅登记盘盈记录，不增加系统库存'
    },
    { title: '差异原因', dataIndex: 'diffReason', key: 'diffReason', width: 180, render: (value) => value || '-' },
    { title: '盘点日期', dataIndex: 'checkDate', key: 'checkDate', width: 120, render: (value) => formatDate(value) },
    {
      title: '操作',
      key: 'confirm',
      width: 140,
      render: (_, record) => <Button type="link" onClick={() => handleArchive(record)}>登记完成</Button>
    },
  ];

  const historyColumns = [
    ...detailColumns.filter((column) => column.key !== 'confirm'),
    { title: '处理状态', key: 'archiveStatus', width: 100, render: () => <Tag color="green">已归档</Tag> },
  ];

  return (
    <div style={{ padding: '0 16px' }}>
      <h1 style={{ marginBottom: 24 }}>盘点损溢录入</h1>

      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
          <Space wrap>
            <Tag color="orange">待处理差异 {pendingDiffRecords.length}</Tag>
            <Tag color="green">已归档 {historyRecords.length}</Tag>
          </Space>
          <Space wrap>
            <Button onClick={() => navigate('/inventory-check-detail')}>返回盘点明细</Button>
            <Button onClick={loadDiffData}>刷新</Button>
          </Space>
        </div>

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: 'pending',
              label: `待处理差异 (${pendingDiffRecords.length})`,
              children: (
                <Table
                  rowKey="id"
                  columns={detailColumns}
                  dataSource={focusedPendingRecords}
                  loading={loading}
                  scroll={{ x: 1900 }}
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total) => `共 ${total} 条记录`,
                    style: {
                      display: 'flex',
                      justifyContent: 'center',
                      marginTop: '16px'
                    }
                  }}
                  size="small"
                />
              ),
            },
            {
              key: 'history',
              label: `已处理记录 (${historyRecords.length})`,
              children: (
                <Table
                  rowKey="id"
                  columns={historyColumns}
                  dataSource={historyRecords}
                  loading={loading}
                  scroll={{ x: 1900 }}
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total) => `共 ${total} 条记录`,
                    style: {
                      display: 'flex',
                      justifyContent: 'center',
                      marginTop: '16px'
                    }
                  }}
                  size="small"
                />
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
};

export default InventoryCheckDiff;
