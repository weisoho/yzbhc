import React, { useEffect, useMemo, useState } from 'react';
import { Button, Card, Form, Input, InputNumber, Modal, Select, Space, Table, Tag, Tooltip, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getApiErrorMessage, getApiResponseMessage } from '../utils/api';
import {
  CHECK_STATE_OPTIONS,
  archiveCheckRecord,
  confirmCheckRecord,
  fetchCheckRecords,
  fetchInventoryCatalog,
  formatDate,
  mapCheckRecord,
} from '../utils/inventoryCheck';

const InventoryCheckDetail = () => {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState({
    keyword: '',
    supplier: '',
    manufacturer: '',
    warehouse: '',
    batchNumber: '',
    checkState: 'unchecked',
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [recordModalVisible, setRecordModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [form] = Form.useForm();

  const loadRecords = async () => {
    try {
      setLoading(true);
      const [inventoryResult, checkResult] = await Promise.all([
        fetchInventoryCatalog(),
        fetchCheckRecords(0),
      ]);

      const inventoryById = inventoryResult.records.reduce((accumulator, item) => {
        accumulator[item.id] = item;
        return accumulator;
      }, {});

      const mappedRecords = checkResult.records.map((item) => mapCheckRecord(item, inventoryById));
      setRecords(mappedRecords);
    } catch (error) {
      message.error(getApiErrorMessage(error, '加载盘点明细失败'));
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, []);

  const filteredRecords = useMemo(() => {
    const keyword = searchParams.keyword.trim().toLowerCase();
    return records.filter((item) => {
      const hitKeyword = !keyword || [item.materialCode, item.materialName].some((value) => String(value || '').toLowerCase().includes(keyword));
      const hitSupplier = !searchParams.supplier || String(item.supplier || '').includes(searchParams.supplier.trim());
      const hitManufacturer = !searchParams.manufacturer || String(item.manufacturer || '').includes(searchParams.manufacturer.trim());
      const hitWarehouse = !searchParams.warehouse || String(item.warehouse || '').includes(searchParams.warehouse.trim());
      const hitBatchNumber = !searchParams.batchNumber || String(item.batchNumber || '').includes(searchParams.batchNumber.trim());
      const hitCheckState = searchParams.checkState === 'diff'
        ? item.checkState === 'checked' && item.cheStatus !== 0
        : searchParams.checkState === 'checked'
          ? item.checkState === 'checked'
          : item.checkState === 'unchecked';
      return hitKeyword && hitSupplier && hitManufacturer && hitWarehouse && hitBatchNumber && hitCheckState;
    });
  }, [records, searchParams]);

  const uncheckedCount = records.filter((item) => item.checkState === 'unchecked').length;
  const diffCount = records.filter((item) => item.checkState === 'checked' && item.cheStatus !== 0).length;

  const handleOpenRecordModal = (record) => {
    setCurrentRecord(record);
    form.setFieldsValue({
      actualNum: record.actualNum ?? record.sysNum,
      diffReason: record.diffReason || '',
    });
    setRecordModalVisible(true);
  };

  const handleRecordSubmit = async () => {
    if (!currentRecord) {
      return;
    }

    try {
      const values = await form.validateFields();
      if (values.actualNum !== currentRecord.sysNum && !values.diffReason?.trim()) {
        form.setFields([{ name: 'diffReason', errors: ['存在差异时必须填写差异原因'] }]);
        return;
      }

      setSubmitLoading(true);
      const response = await confirmCheckRecord({
        inventoryId: currentRecord.inventoryId,
        actualNum: values.actualNum,
        diffReason: values.diffReason?.trim() || '',
      });
      if (response.code !== 1) {
        message.error(getApiResponseMessage(response, '盘点录入失败'));
        return;
      }

      message.success('盘点结果已保存');
      setRecordModalVisible(false);
      setCurrentRecord(null);
      form.resetFields();
      await loadRecords();
    } catch (error) {
      if (error?.errorFields) {
        return;
      }
      message.error(getApiErrorMessage(error, '盘点录入失败'));
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleBatchConfirm = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择需要确认盘点的明细');
      return;
    }

    const selectedRecords = filteredRecords.filter((item) => selectedRowKeys.includes(item.id));
    if (selectedRecords.length === 0) {
      message.warning('当前没有可处理的盘点明细');
      return;
    }

    try {
      setSubmitLoading(true);
      const responses = await Promise.all(selectedRecords.map((item) => confirmCheckRecord({
        inventoryId: item.inventoryId,
        actualNum: item.sysNum,
        diffReason: '',
      })));
      const failedResponse = responses.find((item) => item.code !== 1);
      if (failedResponse) {
        message.error(getApiResponseMessage(failedResponse, '批量确认盘点失败'));
        return;
      }

      message.success(`已确认 ${selectedRecords.length} 条盘点明细`);
      setSelectedRowKeys([]);
      await loadRecords();
    } catch (error) {
      message.error(getApiErrorMessage(error, '批量确认盘点失败'));
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleSubmitSheet = async () => {
    if (uncheckedCount > 0) {
      message.warning(`还有 ${uncheckedCount} 条未盘点明细，请先完成盘点后再提交单据`);
      return;
    }

    if (records.length === 0) {
      message.warning('当前没有可提交的盘点明细');
      return;
    }

    const sameRecords = records.filter((item) => item.checkState === 'checked' && item.cheStatus === 0);
    try {
      setSubmitLoading(true);
      if (sameRecords.length > 0) {
        const responses = await Promise.all(sameRecords.map((item) => archiveCheckRecord(item.id)));
        const failed = responses.find((item) => item.code !== 1);
        if (failed) {
          message.error(getApiResponseMessage(failed, '提交盘点单失败'));
          return;
        }
      }

      if (diffCount > 0) {
        message.success('无差异明细已归档，存在差异的盘点明细已转入损溢录入');
        await loadRecords();
        navigate('/inventory-check-diff', { state: { source: 'detail-submit' } });
        return;
      }

      message.success('本次盘点单已全部提交并归档');
      await loadRecords();
    } catch (error) {
      message.error(getApiErrorMessage(error, '提交盘点单失败'));
    } finally {
      setSubmitLoading(false);
    }
  };

  const columns = [
    { title: '盘点单号', dataIndex: 'cheCode', key: 'cheCode', width: 180 },
    { title: '物资编码 / 名称', key: 'material', width: 220, render: (_, record) => (
      <div>
        <div>{record.materialCode}</div>
        <div style={{ color: '#595959' }}>{record.materialName}</div>
      </div>
    ) },
    { title: '规格型号', key: 'specification', width: 160, render: (_, record) => `${record.specification} / ${record.model}` },
    { title: '仓库', dataIndex: 'warehouse', key: 'warehouse', width: 120 },
    { title: '批号', dataIndex: 'batchNumber', key: 'batchNumber', width: 140 },
    { title: '系统数量', dataIndex: 'sysNum', key: 'sysNum', width: 100 },
    { title: '实际数量', dataIndex: 'actualNum', key: 'actualNum', width: 100, render: (value) => value ?? '-' },
    { title: '盘点状态', dataIndex: 'checkState', key: 'checkState', width: 110, render: (value) => (
      <Tag color={value === 'checked' ? 'green' : 'default'}>{value === 'checked' ? '已盘点' : '未盘点'}</Tag>
    ) },
    { title: '差异结果', dataIndex: 'resultText', key: 'resultText', width: 100, render: (value, record) => (
      <Tag color={record.resultColor}>{record.checkState === 'unchecked' ? '待确认' : value}</Tag>
    ) },
    { title: '差异原因', dataIndex: 'diffReason', key: 'diffReason', width: 180, render: (value) => value || '-' },
    { title: '盘点日期', dataIndex: 'checkDate', key: 'checkDate', width: 120, render: (value) => formatDate(value) },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 220,
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => handleOpenRecordModal(record)}>
            {record.checkState === 'checked' ? '修改盘点' : '录入盘点'}
          </Button>
          <Tooltip title="后端暂无将已盘点记录重置为未盘点的接口，当前仅支持录入和修改盘点结果。">
            <Button type="link" disabled>
              变更为未盘
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '0 16px' }}>
      <h1 style={{ marginBottom: 24 }}>盘点明细查询</h1>

      <Card>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
          <Input
            style={{ width: 220 }}
            placeholder="物资编码或名称"
            value={searchParams.keyword}
            onChange={(event) => setSearchParams((prev) => ({ ...prev, keyword: event.target.value }))}
          />
          <Input
            style={{ width: 180 }}
            placeholder="供应商"
            value={searchParams.supplier}
            onChange={(event) => setSearchParams((prev) => ({ ...prev, supplier: event.target.value }))}
          />
          <Input
            style={{ width: 180 }}
            placeholder="生产厂家"
            value={searchParams.manufacturer}
            onChange={(event) => setSearchParams((prev) => ({ ...prev, manufacturer: event.target.value }))}
          />
          <Input
            style={{ width: 160 }}
            placeholder="仓库"
            value={searchParams.warehouse}
            onChange={(event) => setSearchParams((prev) => ({ ...prev, warehouse: event.target.value }))}
          />
          <Input
            style={{ width: 160 }}
            placeholder="批号"
            value={searchParams.batchNumber}
            onChange={(event) => setSearchParams((prev) => ({ ...prev, batchNumber: event.target.value }))}
          />
          <Select
            style={{ width: 150 }}
            value={searchParams.checkState}
            options={CHECK_STATE_OPTIONS}
            onChange={(value) => setSearchParams((prev) => ({ ...prev, checkState: value }))}
          />
          <Button onClick={() => {
            setSearchParams({
              keyword: '',
              supplier: '',
              manufacturer: '',
              warehouse: '',
              batchNumber: '',
              checkState: 'unchecked',
            });
          }}>
            重置
          </Button>
          <Button onClick={loadRecords}>刷新</Button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
          <Space wrap>
            <Tag color="default">未盘点 {uncheckedCount}</Tag>
            <Tag color="orange">差异 {diffCount}</Tag>
            <Tag color="blue">当前筛选 {filteredRecords.length}</Tag>
          </Space>
          <Space wrap>
            <Button type="primary" loading={submitLoading} onClick={handleBatchConfirm}>
              确认盘点
            </Button>
            <Button type="primary" ghost onClick={handleSubmitSheet}>
              提交单据
            </Button>
          </Space>
        </div>

        <Table
          rowKey="id"
          size="small"
          loading={loading}
          scroll={{ x: 1800 }}
          dataSource={filteredRecords}
          columns={columns}
          rowSelection={{
            selectedRowKeys,
            onChange: (keys, selectedRows) => {
              const selectableKeys = selectedRows
                .filter((item) => item.checkState === 'unchecked')
                .map((item) => item.id);
              setSelectedRowKeys(selectableKeys);
            },
            getCheckboxProps: (record) => ({ disabled: record.checkState === 'checked' }),
          }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
            style: { display: 'flex', justifyContent: 'center', marginTop: 16 },
          }}
        />
      </Card>

      <Modal
        title={currentRecord ? `盘点录入 - ${currentRecord.materialName}` : '盘点录入'}
        open={recordModalVisible}
        onCancel={() => {
          setRecordModalVisible(false);
          setCurrentRecord(null);
          form.resetFields();
        }}
        onOk={handleRecordSubmit}
        confirmLoading={submitLoading}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item label="系统数量">
            <Input value={currentRecord?.sysNum ?? ''} disabled />
          </Form.Item>
          <Form.Item name="actualNum" label="实际数量" rules={[{ required: true, message: '请输入实际数量' }]}>
            <InputNumber style={{ width: '100%' }} min={0} precision={0} placeholder="请输入实际数量" />
          </Form.Item>
          <Form.Item name="diffReason" label="差异原因">
            <Input.TextArea rows={4} placeholder="如果盘盈或盘亏，请填写差异原因" maxLength={200} showCount />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default InventoryCheckDetail;
