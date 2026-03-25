import React, { useEffect, useMemo, useState } from 'react';
import { Button, Card, DatePicker, Input, Space, Table, Tag, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getApiErrorMessage, getApiResponseMessage } from '../utils/api';
import {
  buildCheckCode,
  createCheckRecord,
  fetchCheckRecords,
  fetchInventoryCatalog,
  formatDate,
  mapCheckRecord,
} from '../utils/inventoryCheck';

const InventoryCheckGenerate = () => {
  const navigate = useNavigate();
  const [inventoryList, setInventoryList] = useState([]);
  const [checkSheets, setCheckSheets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generateLoading, setGenerateLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchParams, setSearchParams] = useState({
    keyword: '',
    supplier: '',
    manufacturer: '',
    warehouse: '',
  });
  const [checkDate, setCheckDate] = useState(null);

  const loadData = async () => {
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

      const mappedCheckSheets = checkResult.records.map((item) => mapCheckRecord(item, inventoryById));
      const generatedInventoryIds = new Set(mappedCheckSheets.map((item) => item.inventoryId));
      const mappedInventoryList = inventoryResult.records.map((item) => ({
        ...item,
        generated: generatedInventoryIds.has(item.id),
      }));

      setInventoryList(mappedInventoryList);
      setCheckSheets(mappedCheckSheets);
    } catch (error) {
      message.error(getApiErrorMessage(error, '加载盘点数据失败'));
      setInventoryList([]);
      setCheckSheets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredInventoryList = useMemo(() => {
    const keyword = searchParams.keyword.trim().toLowerCase();
    return inventoryList.filter((item) => {
      const hitKeyword = !keyword || [item.materialCode, item.materialName].some((value) => String(value || '').toLowerCase().includes(keyword));
      const hitSupplier = !searchParams.supplier || String(item.supplier || '').includes(searchParams.supplier.trim());
      const hitManufacturer = !searchParams.manufacturer || String(item.manufacturer || '').includes(searchParams.manufacturer.trim());
      const hitWarehouse = !searchParams.warehouse || String(item.warehouse || '').includes(searchParams.warehouse.trim());
      return hitKeyword && hitSupplier && hitManufacturer && hitWarehouse;
    });
  }, [inventoryList, searchParams]);

  const handleGenerateCheckSheet = async (generateAll = false) => {
    const candidates = generateAll
      ? filteredInventoryList.filter((item) => !item.generated)
      : filteredInventoryList.filter((item) => selectedRowKeys.includes(item.id) && !item.generated);

    if (candidates.length === 0) {
      message.warning(generateAll ? '当前筛选结果中没有可生成的盘点明细' : '请先选择需要生成盘点表的库存明细');
      return;
    }

    try {
      setGenerateLoading(true);
      const checkDateValue = checkDate?.format ? checkDate.format('YYYY-MM-DD') : undefined;
      const responses = await Promise.all(candidates.map((item) => createCheckRecord({
        inventoryId: item.id,
        inventoryName: item.materialName,
        cheCode: buildCheckCode(),
        cheDate: checkDateValue,
        status: 0,
      })));
      const failedResponse = responses.find((item) => item.code !== 1);
      if (failedResponse) {
        message.error(getApiResponseMessage(failedResponse, '盘点表生成失败'));
        return;
      }

      message.success(`已生成 ${candidates.length} 条盘点记录`);
      setSelectedRowKeys([]);
      await loadData();
    } catch (error) {
      message.error(getApiErrorMessage(error, '盘点表生成失败'));
    } finally {
      setGenerateLoading(false);
    }
  };

  const inventoryColumns = [
    { title: '物资编码', dataIndex: 'materialCode', key: 'materialCode', width: 140 },
    { title: '物资名称', dataIndex: 'materialName', key: 'materialName', width: 180 },
    { title: '规格', dataIndex: 'specification', key: 'specification', width: 120 },
    { title: '型号', dataIndex: 'model', key: 'model', width: 120 },
    { title: '仓库', dataIndex: 'warehouse', key: 'warehouse', width: 120 },
    { title: '批号', dataIndex: 'batchNumber', key: 'batchNumber', width: 140 },
    { title: '库存数量', dataIndex: 'currentStock', key: 'currentStock', width: 100 },
    { title: '供应商', dataIndex: 'supplier', key: 'supplier', width: 180 },
    { title: '状态', dataIndex: 'generated', key: 'generated', width: 120, render: (value) => (
      <Tag color={value ? 'green' : 'default'}>{value ? '已生成盘点' : '待生成'}</Tag>
    ) },
  ];

  const sheetColumns = [
    { title: '盘点单号', dataIndex: 'cheCode', key: 'cheCode', width: 180 },
    { title: '物资编码', dataIndex: 'materialCode', key: 'materialCode', width: 140 },
    { title: '物资名称', dataIndex: 'materialName', key: 'materialName', width: 180 },
    { title: '仓库', dataIndex: 'warehouse', key: 'warehouse', width: 120 },
    { title: '系统数量', dataIndex: 'sysNum', key: 'sysNum', width: 100 },
    { title: '实际数量', dataIndex: 'actualNum', key: 'actualNum', width: 100, render: (value) => value ?? '-' },
    { title: '盘点日期', dataIndex: 'checkDate', key: 'checkDate', width: 120, render: (value) => formatDate(value) },
    { title: '状态', dataIndex: 'checkState', key: 'checkState', width: 100, render: (value) => <Tag color={value === 'checked' ? 'green' : 'blue'}>{value === 'checked' ? '已盘点' : '未盘点'}</Tag> },
    { title: '差异情况', dataIndex: 'resultText', key: 'resultText', width: 100, render: (value, record) => <Tag color={record.resultColor}>{record.checkState === 'checked' ? value : '待确认'}</Tag> },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => navigate('/inventory-check-detail')}>查看明细</Button>
          <Button type="link" onClick={() => navigate('/inventory-check-diff', { state: { focusId: record.id } })}>差异处理</Button>
        </Space>
      )
    },
  ];

  return (
    <div style={{ padding: '0 16px' }}>
      <h1 style={{ marginBottom: 24 }}>盘点表生成</h1>
      <Card style={{ padding: '16px', marginBottom: 16 }}>
        <div style={{ marginBottom: 16, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}>
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
            style={{ width: 180 }}
            placeholder="仓库"
            value={searchParams.warehouse}
            onChange={(event) => setSearchParams((prev) => ({ ...prev, warehouse: event.target.value }))}
          />
          <DatePicker style={{ width: 160 }} placeholder="盘点日期" value={checkDate} onChange={setCheckDate} />
          <Button onClick={() => setSearchParams({ keyword: '', supplier: '', manufacturer: '', warehouse: '' })}>重置</Button>
          <Button onClick={loadData}>刷新</Button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
          <Space wrap>
            <Tag color="blue">库存记录 {filteredInventoryList.length}</Tag>
            <Tag color="green">已生成 {inventoryList.filter((item) => item.generated).length}</Tag>
            <Tag color="default">待生成 {inventoryList.filter((item) => !item.generated).length}</Tag>
          </Space>
          <Space wrap>
            <Button type="primary" loading={generateLoading} onClick={() => handleGenerateCheckSheet(false)}>生成选中盘点表</Button>
            <Button type="primary" ghost loading={generateLoading} onClick={() => handleGenerateCheckSheet(true)}>生成当前筛选结果</Button>
            <Button onClick={() => navigate('/inventory-check-detail')}>进入盘点明细</Button>
          </Space>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <Table
            rowKey="id"
            columns={inventoryColumns}
            dataSource={filteredInventoryList}
            loading={loading}
            size="small"
            scroll={{ x: 1400 }}
            rowSelection={{
              selectedRowKeys,
              onChange: setSelectedRowKeys,
              getCheckboxProps: (record) => ({ disabled: record.generated }),
            }}
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
          />
        </div>
      </Card>

      <Card style={{ padding: '16px' }}>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <span style={{ fontWeight: 500 }}>已生成的盘点记录</span>
          <Button onClick={() => navigate('/inventory-check-detail')}>去盘点</Button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <Table 
            columns={sheetColumns} 
            dataSource={checkSheets} 
            rowKey="id"
            scroll={{ x: 1500 }}
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
            loading={loading}
          />
        </div>
      </Card>
    </div>
  );
};

export default InventoryCheckGenerate;
