import React, { useEffect, useMemo, useState } from 'react';
import { Table, Card, Input, Select, Button, Space, Tag, Row, Col, Form, DatePicker, message, Modal, Descriptions } from 'antd';
import { SearchOutlined, SwapOutlined, CheckCircleOutlined } from '@ant-design/icons';
import api from '../utils/api';

const assetStatusOptions = [
  { label: '在用', value: 1, color: 'green' },
  { label: '闲置', value: 2, color: 'blue' },
  { label: '维修中', value: 3, color: 'orange' },
  { label: '待报废', value: 4, color: 'red' },
];

const transferStatusOptions = [
  { label: '待接收', value: 1, color: 'orange' },
  { label: '已通过', value: 2, color: 'green' },
  { label: '已拒绝', value: 3, color: 'red' },
];

const receiveAssetStatusOptions = [
  { label: '完好无损', value: 1 },
  { label: '轻微磨损', value: 2 },
  { label: '需要维修', value: 3 },
  { label: '严重损坏', value: 4 },
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

const getMeta = (options, value) => options.find((item) => item.value === value) || { label: '-', color: 'default' };

const mapAssetRecord = (item, index = 0) => ({
  key: item.id || `${item.assetCode || 'asset'}-${index}`,
  id: item.id,
  assetCode: item.assetCode || '-',
  assetName: item.assetName || '-',
  assetTypeId: item.assetTypeid,
  assetType: item.assetTypename || '-',
  specification: item.speModel || '-',
  currentWarehouse: item.stoLocation || '-',
  department: item.depName || '-',
  responsiblePerson: item.respPerson || '-',
  assetStatus: item.assetState,
  purchaseDate: item.purchaseDate,
  originalValue: item.origValue,
});

const mapPendingTransfer = (item, index = 0) => ({
  key: item.id || `${item.transferCode || 'transfer'}-${index}`,
  id: item.id,
  transferCode: item.transferCode || '-',
  assetId: item.assetId,
  assetCode: item.assetCode || '-',
  assetName: item.assetName || '-',
  assetTypeId: item.assetTypeid,
  assetType: item.assetTypename || '-',
  specification: item.speModel || '-',
  originalValue: item.origValue || '-',
  fromDepartment: item.depName || '-',
  toDepartment: item.bedepName || '-',
  transferUser: item.userName || '-',
  status: item.status,
  createdAt: item.cdate,
});

const FixedAssetsTransfer = () => {
  const [searchForm] = Form.useForm();
  const [transferForm] = Form.useForm();
  const [receiveForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [transferLoading, setTransferLoading] = useState(false);
  const [receiveLoading, setReceiveLoading] = useState(false);
  const [assetRows, setAssetRows] = useState([]);
  const [pendingTransfers, setPendingTransfers] = useState([]);
  const [assetTypeOptions, setAssetTypeOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [warehouseOptions, setWarehouseOptions] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [selectedPendingTransfer, setSelectedPendingTransfer] = useState(null);
  const [transferModalVisible, setTransferModalVisible] = useState(false);
  const [receiveModalVisible, setReceiveModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const departmentMap = useMemo(() => {
    return new Map(departmentOptions.map((item) => [item.id, item]));
  }, [departmentOptions]);

  const warehouseMap = useMemo(() => {
    return new Map(warehouseOptions.map((item) => [item.id, item]));
  }, [warehouseOptions]);

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

  const loadDepartments = async () => {
    try {
      const response = await api.get('/api/department/list');
      if (response.code === 1 && Array.isArray(response.data)) {
        setDepartmentOptions(response.data.filter((item) => item?.id));
      }
    } catch (error) {
      console.error('加载科室失败:', error);
    }
  };

  const loadWarehouses = async () => {
    try {
      const response = await api.request('/api/selectWarehouse', {
        method: 'POST',
        params: { pageNum: 1, pageSize: 500 },
      });
      if (response.code === 1) {
        setWarehouseOptions(normalizeList(response.data));
      }
    } catch (error) {
      console.error('加载仓库失败:', error);
    }
  };

  const loadAssets = async (params = {}) => {
    setLoading(true);
    try {
      const response = await api.request('/api/asset/selectAsset', {
        method: 'POST',
        params: {
          pageNum: params.pageNum || currentPage,
          pageSize: params.pageSize || pageSize,
          assetCode: params.assetCode,
          assetName: params.assetName,
          assetTypeid: params.assetTypeid,
          assetState: params.assetState,
          purchaseStart: params.purchaseStart,
          purchaseEnd: params.purchaseEnd,
        },
      });
      if (response.code !== 1) {
        message.error(response.message || '获取资产列表失败');
        setAssetRows([]);
        setTotal(0);
        return;
      }
      const list = normalizeList(response.data).map((item, index) => mapAssetRecord(item, index));
      setAssetRows(list);
      setTotal(response.data?.total || list.length);
    } catch (error) {
      console.error('获取资产列表失败:', error);
      message.error('获取资产列表失败，请检查后端接口');
      setAssetRows([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const loadPendingTransfers = async () => {
    try {
      const response = await api.request('/api/assetTransfer/selectModelList', {
        method: 'POST',
      });
      if (response.code === 1) {
        const list = normalizeList(response.data).map((item, index) => mapPendingTransfer(item, index));
        setPendingTransfers(list);
      }
    } catch (error) {
      console.error('加载待接收调拨失败:', error);
    }
  };

  useEffect(() => {
    loadAssetTypes();
    loadDepartments();
    loadWarehouses();
  }, []);

  useEffect(() => {
    loadAssets({ pageNum: currentPage, pageSize });
  }, [currentPage, pageSize]);

  useEffect(() => {
    loadPendingTransfers();
  }, []);

  const handleSearch = async (values) => {
    setCurrentPage(1);
    await loadAssets({
      pageNum: 1,
      pageSize,
      assetCode: values.assetCode,
      assetName: values.assetName,
      assetTypeid: values.assetTypeid,
      assetState: values.assetState,
      purchaseStart: values.dateRange?.[0]?.format('YYYY-MM-DD'),
      purchaseEnd: values.dateRange?.[1]?.format('YYYY-MM-DD'),
    });
  };

  const handleReset = async () => {
    searchForm.resetFields();
    setCurrentPage(1);
    await loadAssets({ pageNum: 1, pageSize });
  };

  const openTransferModal = (record) => {
    setSelectedAsset(record);
    transferForm.resetFields();
    setTransferModalVisible(true);
  };

  const openReceiveModal = (record) => {
    setSelectedPendingTransfer(record);
    receiveForm.setFieldsValue({
      status: 1,
      assetStatus: 1,
    });
    setReceiveModalVisible(true);
  };

  const handleTransferSubmit = async () => {
    try {
      const values = await transferForm.validateFields();
      const department = departmentMap.get(values.bedepId);
      setTransferLoading(true);
      const response = await api.post('/api/assetTransfer/addAssetTransfer', {
        assetId: selectedAsset.id,
        assetCode: selectedAsset.assetCode,
        assetName: selectedAsset.assetName,
        assetTypeid: selectedAsset.assetTypeId,
        assetTypename: selectedAsset.assetType,
        speModel: selectedAsset.specification,
        origValue: selectedAsset.originalValue,
        bedepId: values.bedepId,
        bedepName: department?.name || department?.deptName || '',
        status: 1,
      });

      if (response.code !== 1) {
        message.error(response.message || '提交资产调拨失败');
        return;
      }

      message.success('资产调拨已提交');
      setTransferModalVisible(false);
      await loadPendingTransfers();
    } catch (error) {
      if (error?.errorFields) {
        return;
      }
      console.error('提交资产调拨失败:', error);
      message.error('提交资产调拨失败，请检查表单或接口状态');
    } finally {
      setTransferLoading(false);
    }
  };

  const handleReceiveSubmit = async () => {
    try {
      const values = await receiveForm.validateFields();
      const warehouse = warehouseMap.get(values.inventoryId);
      setReceiveLoading(true);
      const response = await api.post('/api/assetTransfer/confirmTransfer', {
        transferId: selectedPendingTransfer.id,
        assetStatus: values.status === 1 ? values.assetStatus : undefined,
        assetParts: values.assetParts,
        remark: values.remark,
        status: values.status,
        reason: values.status === 2 ? values.reason : undefined,
        respPersion: values.respPersion,
        inventoryId: values.status === 1 ? values.inventoryId : undefined,
        inventoryName: values.status === 1 ? warehouse?.wareName || '' : undefined,
      });

      if (response.code !== 1) {
        message.error(response.message || '调拨确认失败');
        return;
      }

      message.success(values.status === 1 ? '已确认接收调拨' : '已拒绝该调拨');
      setReceiveModalVisible(false);
      await loadPendingTransfers();
    } catch (error) {
      if (error?.errorFields) {
        return;
      }
      console.error('调拨确认失败:', error);
      message.error('调拨确认失败，请检查表单或接口状态');
    } finally {
      setReceiveLoading(false);
    }
  };

  const assetColumns = [
    { title: '资产编码', dataIndex: 'assetCode', key: 'assetCode', width: 120, align: 'center' },
    { title: '资产名称', dataIndex: 'assetName', key: 'assetName', width: 150, align: 'center' },
    { title: '资产类型', dataIndex: 'assetType', key: 'assetType', width: 120, align: 'center' },
    { title: '规格型号', dataIndex: 'specification', key: 'specification', width: 140, align: 'center' },
    { title: '当前地点', dataIndex: 'currentWarehouse', key: 'currentWarehouse', width: 140, align: 'center' },
    { title: '使用部门', dataIndex: 'department', key: 'department', width: 140, align: 'center' },
    { title: '责任人', dataIndex: 'responsiblePerson', key: 'responsiblePerson', width: 120, align: 'center' },
    {
      title: '资产状态',
      dataIndex: 'assetStatus',
      key: 'assetStatus',
      width: 120,
      align: 'center',
      render: (value) => {
        const meta = getMeta(assetStatusOptions, value);
        return <Tag color={meta.color}>{meta.label}</Tag>;
      },
    },
    { title: '购置日期', dataIndex: 'purchaseDate', key: 'purchaseDate', width: 120, align: 'center', render: formatDate },
    {
      title: '操作',
      key: 'action',
      width: 120,
      align: 'center',
      render: (_, record) => (
        <Button type="link" icon={<SwapOutlined />} onClick={() => openTransferModal(record)}>
          发起调拨
        </Button>
      ),
    },
  ];

  const pendingColumns = [
    { title: '调拨单号', dataIndex: 'transferCode', key: 'transferCode', width: 140, align: 'center' },
    { title: '资产编码', dataIndex: 'assetCode', key: 'assetCode', width: 120, align: 'center' },
    { title: '资产名称', dataIndex: 'assetName', key: 'assetName', width: 140, align: 'center' },
    { title: '资产类型', dataIndex: 'assetType', key: 'assetType', width: 120, align: 'center' },
    { title: '来源部门', dataIndex: 'fromDepartment', key: 'fromDepartment', width: 120, align: 'center' },
    { title: '接收部门', dataIndex: 'toDepartment', key: 'toDepartment', width: 120, align: 'center' },
    { title: '调拨人', dataIndex: 'transferUser', key: 'transferUser', width: 100, align: 'center' },
    { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', width: 120, align: 'center', render: formatDate },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      align: 'center',
      render: (value) => {
        const meta = getMeta(transferStatusOptions, value);
        return <Tag color={meta.color}>{meta.label}</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      align: 'center',
      render: (_, record) => (
        <Button
          type="link"
          icon={<CheckCircleOutlined />}
          disabled={record.status !== 1}
          onClick={() => openReceiveModal(record)}
        >
          接收确认
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: '0 16px' }}>
      <h1 style={{ marginBottom: 24 }}>固定资产调拨</h1>

      <Card style={{ marginBottom: 16 }}>
        <Form form={searchForm} layout="vertical" onFinish={handleSearch}>
          <Row gutter={[16, 0]}>
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
              <Form.Item name="assetTypeid" label="资产类型">
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
              <Form.Item name="assetState" label="资产状态">
                <Select allowClear placeholder="请选择资产状态">
                  {assetStatusOptions.map((item) => (
                    <Select.Option key={item.value} value={item.value}>
                      {item.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8}>
              <Form.Item name="dateRange" label="购置日期范围">
                <DatePicker.RangePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Space>
                <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                  查询
                </Button>
                <Button onClick={handleReset}>重置</Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>

      <Table
        columns={assetColumns}
        dataSource={assetRows}
        loading={loading}
        rowKey="key"
        pagination={{
          current: currentPage,
          pageSize,
          total,
          onChange: (page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          },
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (value) => `共 ${value} 条资产记录`,
        }}
        size="small"
        scroll={{ x: 1500 }}
        style={{ marginBottom: 24 }}
      />

      <Card title="待接收调拨列表">
        <Table
          columns={pendingColumns}
          dataSource={pendingTransfers}
          rowKey="key"
          size="small"
          pagination={{
            pageSize: 5,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (value) => `共 ${value} 条调拨记录`,
          }}
          scroll={{ x: 1300 }}
        />
      </Card>

      <Modal
        title="发起资产调拨"
        open={transferModalVisible}
        onCancel={() => setTransferModalVisible(false)}
        onOk={handleTransferSubmit}
        confirmLoading={transferLoading}
        width={760}
      >
        {selectedAsset && (
          <>
            <Descriptions bordered size="small" column={2} style={{ marginBottom: 16 }}>
              <Descriptions.Item label="资产编码">{selectedAsset.assetCode}</Descriptions.Item>
              <Descriptions.Item label="资产名称">{selectedAsset.assetName}</Descriptions.Item>
              <Descriptions.Item label="资产类型">{selectedAsset.assetType}</Descriptions.Item>
              <Descriptions.Item label="规格型号">{selectedAsset.specification}</Descriptions.Item>
              <Descriptions.Item label="当前地点">{selectedAsset.currentWarehouse}</Descriptions.Item>
              <Descriptions.Item label="使用部门">{selectedAsset.department}</Descriptions.Item>
            </Descriptions>
            <Form form={transferForm} layout="vertical">
              <Form.Item name="bedepId" label="目标接收部门" rules={[{ required: true, message: '请选择目标接收部门' }]}>
                <Select placeholder="请选择目标接收部门">
                  {departmentOptions.map((item) => (
                    <Select.Option key={item.id} value={item.id}>
                      {item.name || item.deptName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Form>
          </>
        )}
      </Modal>

      <Modal
        title="调拨接收确认"
        open={receiveModalVisible}
        onCancel={() => setReceiveModalVisible(false)}
        onOk={handleReceiveSubmit}
        confirmLoading={receiveLoading}
        width={760}
      >
        {selectedPendingTransfer && (
          <>
            <Descriptions bordered size="small" column={2} style={{ marginBottom: 16 }}>
              <Descriptions.Item label="调拨单号">{selectedPendingTransfer.transferCode}</Descriptions.Item>
              <Descriptions.Item label="资产编码">{selectedPendingTransfer.assetCode}</Descriptions.Item>
              <Descriptions.Item label="资产名称">{selectedPendingTransfer.assetName}</Descriptions.Item>
              <Descriptions.Item label="来源部门">{selectedPendingTransfer.fromDepartment}</Descriptions.Item>
              <Descriptions.Item label="接收部门">{selectedPendingTransfer.toDepartment}</Descriptions.Item>
              <Descriptions.Item label="调拨人">{selectedPendingTransfer.transferUser}</Descriptions.Item>
            </Descriptions>
            <Form form={receiveForm} layout="vertical">
              <Form.Item name="status" label="处理结果" rules={[{ required: true, message: '请选择处理结果' }]}>
                <Select placeholder="请选择处理结果">
                  <Select.Option value={1}>确认接收</Select.Option>
                  <Select.Option value={2}>拒绝接收</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item shouldUpdate noStyle>
                {({ getFieldValue }) => getFieldValue('status') === 1 ? (
                  <>
                    <Form.Item name="assetStatus" label="资产状态" rules={[{ required: true, message: '请选择资产状态' }]}>
                      <Select placeholder="请选择资产状态">
                        {receiveAssetStatusOptions.map((item) => (
                          <Select.Option key={item.value} value={item.value}>
                            {item.label}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item name="inventoryId" label="接收入库仓库" rules={[{ required: true, message: '请选择接收入库仓库' }]}>
                      <Select placeholder="请选择接收入库仓库">
                        {warehouseOptions.map((item) => (
                          <Select.Option key={item.id} value={item.id}>
                            {item.wareName}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item name="respPersion" label="新责任人" rules={[{ required: true, message: '请输入新责任人' }]}>
                      <Input placeholder="请输入新责任人" />
                    </Form.Item>
                  </>
                ) : (
                  <Form.Item name="reason" label="拒绝原因" rules={[{ required: true, message: '请输入拒绝原因' }]}>
                    <Input.TextArea rows={3} placeholder="请输入拒绝原因" />
                  </Form.Item>
                )}
              </Form.Item>
              <Form.Item name="assetParts" label="配件清单">
                <Input.TextArea rows={3} placeholder="请输入配件清单" />
              </Form.Item>
              <Form.Item name="remark" label="备注">
                <Input.TextArea rows={3} placeholder="请输入备注" />
              </Form.Item>
            </Form>
          </>
        )}
      </Modal>
    </div>
  );
};

export default FixedAssetsTransfer;