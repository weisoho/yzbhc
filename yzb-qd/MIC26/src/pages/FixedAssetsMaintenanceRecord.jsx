import React, { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { Card, Table, Input, Select, DatePicker, Button, Space, Tag, Modal, Form, message, Row, Col, Descriptions } from 'antd';
import { SearchOutlined, EditOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import api from '../utils/api';

const { RangePicker } = DatePicker;

const repairTypeOptions = [
  { label: '定期维修', value: 1 },
  { label: '故障维修', value: 2 },
];

const repairStatusOptions = [
  { label: '待处理', value: 1, color: 'orange' },
  { label: '处理中', value: 2, color: 'blue' },
  { label: '已完成', value: 3, color: 'green' },
];

const normalizeList = (payload) => {
  if (Array.isArray(payload?.records)) {
    return payload.records;
  }
  if (Array.isArray(payload?.list)) {
    return payload.list;
  }
  return [];
};

const formatDate = (value) => {
  if (!value) {
    return '-';
  }
  const text = String(value);
  return text.length >= 10 ? text.slice(0, 10) : text;
};

const mapRepairTypeLabel = (value) => repairTypeOptions.find((item) => item.value === value)?.label || '-';
const mapRepairStatusMeta = (value) => repairStatusOptions.find((item) => item.value === value) || { label: '-', color: 'default' };

const mapRepairRecord = (item, index = 0) => ({
  key: item.id || `${item.repairCode || 'repair'}-${index}`,
  id: item.id,
  recordNo: item.repairCode || '-',
  assetId: item.assetId,
  assetCode: item.assetCode || '-',
  assetName: item.assetName || '-',
  assetTypeId: item.assetTypeId,
  assetType: item.assetType || '-',
  manufacturer: item.manufacturer || '-',
  specification: item.speModel || '-',
  maintenanceDate: item.repairDate,
  completionDate: item.finishDate,
  maintenanceType: item.repairType,
  maintenanceReason: item.repairReason || '-',
  maintenanceContent: item.repairContent || '-',
  maintenanceVendor: item.repairBus || '-',
  maintenancePerson: item.repairPerson || '-',
  cost: item.repairFee || '0',
  status: item.repairStatus,
  remarks: item.remark || '-',
});

const FixedAssetsMaintenanceRecord = () => {
  const [searchForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState([]);
  const [assetOptions, setAssetOptions] = useState([]);
  const [assetTypeOptions, setAssetTypeOptions] = useState([]);
  const [detailRecord, setDetailRecord] = useState(null);
  const [editorVisible, setEditorVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [lastQueryPayload, setLastQueryPayload] = useState(null);

  const assetMap = useMemo(() => {
    return new Map(assetOptions.map((item) => [item.id, item]));
  }, [assetOptions]);

  const loadAssetTypes = async () => {
    try {
      const response = await api.request('/api/assetType/selectAssetType', {
        method: 'POST',
        params: { pageNum: 1, pageSize: 500 },
      });
      if (response.code === 1) {
        setAssetTypeOptions(normalizeList(response.data));
      }
    } catch (error) {
      console.error('加载资产类型失败:', error);
    }
  };

  const loadAssets = async () => {
    try {
      const response = await api.request('/api/asset/selectAsset', {
        method: 'POST',
        params: { pageNum: 1, pageSize: 500 },
      });
      if (response.code === 1) {
        setAssetOptions(normalizeList(response.data));
      }
    } catch (error) {
      console.error('加载资产列表失败:', error);
    }
  };

  useEffect(() => {
    loadAssetTypes();
    loadAssets();
    const initialPayload = { pageNum: 1, pageSize };
    setLastQueryPayload(initialPayload);
    queryRecords(initialPayload);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const queryRecords = async (payload) => {
    setLoading(true);
    try {
      const response = await api.post('/api/assetRepair/selectModelList', payload);
      if (response.code !== 1) {
        message.error(response.message || '查询资产维修记录失败');
        setRecords([]);
        setTotal(0);
        return;
      }
      const list = normalizeList(response.data).map((item, index) => mapRepairRecord(item, index));
      setRecords(list);
      setTotal(response.data?.total || list.length);
    } catch (error) {
      console.error('查询资产维修记录失败:', error);
      message.error('查询资产维修记录失败，请检查后端接口状态');
      setRecords([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (values) => {
    const payload = {
      pageNum: 1,
      pageSize,
      repairCode: values.repairCode,
      assetCode: values.assetCode,
      assetName: values.assetName,
      assetTypeId: values.assetTypeId,
      repairType: values.repairType,
      repairStatus: values.repairStatus,
      date1: values.dateRange?.[0] ? values.dateRange[0].toDate().toISOString() : undefined,
      date2: values.dateRange?.[1] ? values.dateRange[1].toDate().toISOString() : undefined,
    };

    setCurrentPage(1);
    setLastQueryPayload(payload);
    await queryRecords(payload);
  };

  const handleReset = async () => {
    searchForm.resetFields();
    const payload = { pageNum: 1, pageSize };
    setLastQueryPayload(payload);
    setCurrentPage(1);
    await queryRecords(payload);
  };

  const openCreateModal = () => {
    setEditingRecord(null);
    editForm.resetFields();
    setEditorVisible(true);
  };

  const openEditModal = (record) => {
    setEditingRecord(record);
    editForm.setFieldsValue({
      assetId: record.assetId,
      assetCode: record.assetCode,
      assetName: record.assetName,
      assetTypeId: record.assetTypeId,
      assetType: record.assetType,
      manufacturer: record.manufacturer,
      speModel: record.specification,
      repairDate: record.maintenanceDate ? dayjs(record.maintenanceDate) : null,
      finishDate: record.completionDate ? dayjs(record.completionDate) : null,
      repairType: record.maintenanceType,
      repairReason: record.maintenanceReason,
      repairContent: record.maintenanceContent,
      repairBus: record.maintenanceVendor,
      repairPerson: record.maintenancePerson,
      repairFee: Number(record.cost) || 0,
      repairStatus: record.status,
      remark: record.remarks,
    });
    setEditorVisible(true);
  };

  const handleAssetChange = (assetId) => {
    const asset = assetMap.get(assetId);
    if (!asset) {
      return;
    }
    editForm.setFieldsValue({
      assetCode: asset.assetCode,
      assetName: asset.assetName,
      assetTypeId: asset.assetTypeid,
      assetType: asset.assetTypename,
      manufacturer: asset.manufacturer,
      speModel: asset.speModel,
    });
  };

  const handleSubmit = async () => {
    try {
      const values = await editForm.validateFields();
      const payload = {
        ...(editingRecord?.id ? { id: editingRecord.id } : {}),
        assetId: values.assetId,
        assetCode: values.assetCode,
        assetName: values.assetName,
        assetTypeId: values.assetTypeId,
        assetType: values.assetType,
        manufacturer: values.manufacturer,
        speModel: values.speModel,
        repairDate: values.repairDate.toDate().toISOString(),
        finishDate: values.finishDate ? values.finishDate.toDate().toISOString() : null,
        repairType: values.repairType,
        repairReason: values.repairReason,
        repairContent: values.repairContent,
        repairBus: values.repairBus,
        repairPerson: values.repairPerson,
        repairFee: String(values.repairFee ?? ''),
        repairStatus: values.repairStatus,
        remark: values.remark,
      };

      const url = editingRecord ? '/api/assetRepair/updateAssetRepair' : '/api/assetRepair/addAssetRepair';
      const response = await api.post(url, payload);
      if (response.code !== 1) {
        message.error(response.message || '保存资产维修记录失败');
        return;
      }

      message.success(editingRecord ? '维修记录已更新' : '维修记录已新增');
      setEditorVisible(false);
      if (lastQueryPayload) {
        await queryRecords(lastQueryPayload);
      } else {
        const nextRecord = mapRepairRecord(response.data || payload, 0);
        setRecords((prev) => {
          if (editingRecord) {
            return prev.map((item) => (item.id === editingRecord.id ? nextRecord : item));
          }
          return [nextRecord, ...prev];
        });
        setTotal((prev) => (editingRecord ? prev : prev + 1));
      }
    } catch (error) {
      if (error?.errorFields) {
        return;
      }
      console.error('保存资产维修记录失败:', error);
      message.error('保存资产维修记录失败，请检查表单或接口状态');
    }
  };

  const handlePageChange = async (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
    if (lastQueryPayload) {
      const payload = { ...lastQueryPayload, pageNum: page, pageSize: size };
      setLastQueryPayload(payload);
      await queryRecords(payload);
    } else {
      const payload = { pageNum: page, pageSize: size };
      setLastQueryPayload(payload);
      await queryRecords(payload);
    }
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除维修单“${record.recordNo}”吗？`,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          const response = await api.request('/api/assetRepair/deleteAssetRepair', {
            method: 'POST',
            params: { id: record.id },
          });
          if (response.code !== 1) {
            message.error(response.message || '删除维修记录失败');
            return;
          }
          message.success('维修记录已删除');
          await queryRecords(lastQueryPayload || { pageNum: currentPage, pageSize });
        } catch (error) {
          console.error('删除维修记录失败:', error);
          message.error('删除维修记录失败，请检查后端接口状态');
        }
      },
    });
  };

  const columns = [
    { title: '维修单号', dataIndex: 'recordNo', key: 'recordNo', width: 140, fixed: 'left', align: 'center' },
    { title: '资产编码', dataIndex: 'assetCode', key: 'assetCode', width: 120, align: 'center' },
    { title: '资产名称', dataIndex: 'assetName', key: 'assetName', width: 150, align: 'center' },
    { title: '资产类型', dataIndex: 'assetType', key: 'assetType', width: 120, align: 'center' },
    { title: '生产厂商', dataIndex: 'manufacturer', key: 'manufacturer', width: 150, align: 'center' },
    { title: '规格型号', dataIndex: 'specification', key: 'specification', width: 150, align: 'center' },
    { title: '维修日期', dataIndex: 'maintenanceDate', key: 'maintenanceDate', width: 120, align: 'center', render: formatDate },
    { title: '完成日期', dataIndex: 'completionDate', key: 'completionDate', width: 120, align: 'center', render: formatDate },
    {
      title: '维修类型',
      dataIndex: 'maintenanceType',
      key: 'maintenanceType',
      width: 110,
      align: 'center',
      render: (value) => <Tag color="blue">{mapRepairTypeLabel(value)}</Tag>,
    },
    { title: '维修原因', dataIndex: 'maintenanceReason', key: 'maintenanceReason', width: 180, align: 'center' },
    {
      title: '维修费用',
      dataIndex: 'cost',
      key: 'cost',
      width: 120,
      align: 'center',
      render: (value) => `¥${Number(value || 0).toLocaleString()}`,
    },
    {
      title: '维修状态',
      dataIndex: 'status',
      key: 'status',
      width: 110,
      align: 'center',
      render: (value) => {
        const meta = mapRepairStatusMeta(value);
        return <Tag color={meta.color}>{meta.label}</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 160,
      fixed: 'right',
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => {
              setDetailRecord(record);
              setDetailVisible(true);
            }}
          >
            详情
          </Button>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => openEditModal(record)}>
            编辑
          </Button>
          <Button type="link" size="small" danger onClick={() => handleDelete(record)}>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '0 16px' }}>
      <h1 style={{ marginBottom: 24 }}>资产维修记录</h1>

      <div style={{ marginBottom: 12, color: '#8c8c8c' }}>
        当前页面已接入真实维修接口，支持按维修单号、资产信息、类型、状态和维修日期范围进行组合查询。
      </div>

      <Card style={{ marginBottom: 16 }}>
        <Form form={searchForm} layout="vertical" onFinish={handleSearch}>
          <Row gutter={[16, 0]}>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="repairCode" label="维修单号">
                <Input placeholder="请输入维修单号" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="assetCode" label="资产编码">
                <Input placeholder="请输入资产编码" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="assetName" label="资产名称">
                <Input placeholder="请输入资产名称" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="assetTypeId" label="资产类型">
                <Select allowClear placeholder="请选择资产类型">
                  {assetTypeOptions.map((item) => (
                    <Select.Option key={item.id} value={item.id}>
                      {item.assetName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="repairType" label="维修类型">
                <Select allowClear placeholder="请选择维修类型">
                  {repairTypeOptions.map((item) => (
                    <Select.Option key={item.value} value={item.value}>
                      {item.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="repairStatus" label="维修状态">
                <Select allowClear placeholder="请选择维修状态">
                  {repairStatusOptions.map((item) => (
                    <Select.Option key={item.value} value={item.value}>
                      {item.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8}>
              <Form.Item name="dateRange" label="维修日期范围">
                <RangePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Space>
                <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                  查询
                </Button>
                <Button onClick={handleReset}>重置</Button>
                <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
                  新增维修记录
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>

      <Table
        columns={columns}
        dataSource={records}
        loading={loading}
        rowKey="key"
        pagination={{
          current: currentPage,
          pageSize,
          total,
          onChange: handlePageChange,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (value) => `共 ${value} 条维修记录`,
        }}
        size="small"
        scroll={{ x: 1800 }}
      />

      <Modal
        title={editingRecord ? '编辑维修记录' : '新增维修记录'}
        open={editorVisible}
        onCancel={() => setEditorVisible(false)}
        onOk={handleSubmit}
        width={860}
        destroyOnClose
      >
        <Form form={editForm} layout="vertical">
          <Row gutter={[16, 0]}>
            <Col span={24}>
              <Form.Item name="assetId" label="选择资产" rules={[{ required: true, message: '请选择资产' }]}>
                <Select
                  showSearch
                  optionFilterProp="children"
                  placeholder="请选择资产"
                  onChange={handleAssetChange}
                  disabled={Boolean(editingRecord)}
                >
                  {assetOptions.map((item) => (
                    <Select.Option key={item.id} value={item.id}>
                      {item.assetCode} / {item.assetName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="assetCode" label="资产编码" rules={[{ required: true, message: '请输入资产编码' }]}>
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="assetName" label="资产名称" rules={[{ required: true, message: '请输入资产名称' }]}>
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="assetType" label="资产类型" rules={[{ required: true, message: '请选择资产类型' }]}>
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="manufacturer" label="生产厂商">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="speModel" label="规格型号">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="repairDate" label="维修日期" rules={[{ required: true, message: '请选择维修日期' }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="finishDate" label="完成日期">
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="repairType" label="维修类型" rules={[{ required: true, message: '请选择维修类型' }]}>
                <Select placeholder="请选择维修类型">
                  {repairTypeOptions.map((item) => (
                    <Select.Option key={item.value} value={item.value}>
                      {item.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="repairStatus" label="维修状态" rules={[{ required: true, message: '请选择维修状态' }]}>
                <Select placeholder="请选择维修状态">
                  {repairStatusOptions.map((item) => (
                    <Select.Option key={item.value} value={item.value}>
                      {item.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="repairBus" label="维修厂商" rules={[{ required: true, message: '请输入维修厂商' }]}>
                <Input placeholder="请输入维修厂商" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="repairPerson" label="维修人员" rules={[{ required: true, message: '请输入维修人员' }]}>
                <Input placeholder="请输入维修人员" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="repairFee" label="维修费用" rules={[{ required: true, message: '请输入维修费用' }]}>
                <Input type="number" placeholder="请输入维修费用" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="repairReason" label="维修原因" rules={[{ required: true, message: '请输入维修原因' }]}>
                <Input placeholder="请输入维修原因" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="repairContent" label="维修内容" rules={[{ required: true, message: '请输入维修内容' }]}>
                <Input.TextArea rows={4} placeholder="请输入维修内容" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="remark" label="备注">
                <Input.TextArea rows={3} placeholder="请输入备注" />
              </Form.Item>
            </Col>
            <Form.Item name="assetTypeId" hidden>
              <Input />
            </Form.Item>
          </Row>
        </Form>
      </Modal>

      <Modal title="维修记录详情" open={detailVisible} onCancel={() => setDetailVisible(false)} footer={null} width={860}>
        {detailRecord && (
          <Descriptions bordered column={2} size="small">
            <Descriptions.Item label="维修单号">{detailRecord.recordNo}</Descriptions.Item>
            <Descriptions.Item label="资产编码">{detailRecord.assetCode}</Descriptions.Item>
            <Descriptions.Item label="资产名称">{detailRecord.assetName}</Descriptions.Item>
            <Descriptions.Item label="资产类型">{detailRecord.assetType}</Descriptions.Item>
            <Descriptions.Item label="生产厂商">{detailRecord.manufacturer}</Descriptions.Item>
            <Descriptions.Item label="规格型号">{detailRecord.specification}</Descriptions.Item>
            <Descriptions.Item label="维修日期">{formatDate(detailRecord.maintenanceDate)}</Descriptions.Item>
            <Descriptions.Item label="完成日期">{formatDate(detailRecord.completionDate)}</Descriptions.Item>
            <Descriptions.Item label="维修类型">{mapRepairTypeLabel(detailRecord.maintenanceType)}</Descriptions.Item>
            <Descriptions.Item label="维修状态">{mapRepairStatusMeta(detailRecord.status).label}</Descriptions.Item>
            <Descriptions.Item label="维修厂商">{detailRecord.maintenanceVendor}</Descriptions.Item>
            <Descriptions.Item label="维修人员">{detailRecord.maintenancePerson}</Descriptions.Item>
            <Descriptions.Item label="维修费用">¥{Number(detailRecord.cost || 0).toLocaleString()}</Descriptions.Item>
            <Descriptions.Item label="维修原因" span={2}>{detailRecord.maintenanceReason}</Descriptions.Item>
            <Descriptions.Item label="维修内容" span={2}>{detailRecord.maintenanceContent}</Descriptions.Item>
            <Descriptions.Item label="备注" span={2}>{detailRecord.remarks}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default FixedAssetsMaintenanceRecord;