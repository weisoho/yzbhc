import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Badge, Button, Card, Col, DatePicker, Form, Input, InputNumber, Modal, Row, Select, Table, Upload, message } from 'antd';
import { PlusOutlined, SwapOutlined, UploadOutlined } from '@ant-design/icons';
import api, { getApiErrorMessage, getApiResponseMessage } from '../utils/api.js';

const { TextArea } = Input;

const assetStateOptions = [
  { label: '在用', value: 1 },
  { label: '闲置', value: 2 },
  { label: '维修', value: 3 },
  { label: '待报废', value: 4 },
];

const depreciationOptions = [
  { label: '直线法', value: 1 },
  { label: '双倍余额递减法', value: 2 },
  { label: '年数总和法', value: 3 },
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

const buildAssetCode = () => `FA${Date.now()}`;

const FixedAssetsAdd = () => {
  const [form] = Form.useForm();
  const [transferForm] = Form.useForm();
  const [submitLoading, setSubmitLoading] = useState(false);
  const [transferLoading, setTransferLoading] = useState(false);
  const [transferModalVisible, setTransferModalVisible] = useState(false);
  const [assetTypes, setAssetTypes] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [pendingTransfers, setPendingTransfers] = useState([]);
  const [selectedTransferIds, setSelectedTransferIds] = useState([]);

  const departmentOptions = useMemo(() => {
    return departments
      .filter((item) => item?.id && item?.orgType === 'DEPARTMENT' && Number(item?.status) === 1)
      .map((item) => ({ label: item.deptName, value: item.id }));
  }, [departments]);

  const assetTypeOptions = useMemo(() => {
    return assetTypes
      .filter((item) => Number(item.assetState) === 1)
      .map((item) => ({ label: item.assetName, value: item.id, code: item.assetCode }));
  }, [assetTypes]);

  const warehouseOptions = useMemo(() => {
    return warehouses.map((item) => ({ label: item.wareName, value: item.id }));
  }, [warehouses]);

  const selectedTransfers = useMemo(() => {
    return pendingTransfers.filter((item) => selectedTransferIds.includes(item.id));
  }, [pendingTransfers, selectedTransferIds]);

  const loadAssetTypes = async () => {
    try {
      const response = await api.request('/api/assetType/selectAssetType', {
        method: 'POST',
        params: { pageNum: 1, pageSize: 500 },
      });
      if (response.code === 1) {
        setAssetTypes(normalizeList(response.data));
      }
    } catch (error) {
      message.error(getApiErrorMessage(error, '加载资产类型失败'));
    }
  };

  const loadDepartments = async () => {
    try {
      const response = await api.get('/api/department/list');
      if (response.code === 1 && Array.isArray(response.data)) {
        setDepartments(response.data);
      }
    } catch (error) {
      message.error(getApiErrorMessage(error, '加载部门列表失败'));
    }
  };

  const loadWarehouses = async () => {
    try {
      const response = await api.request('/api/selectWarehouse', {
        method: 'POST',
        params: { pageNum: 1, pageSize: 500 },
      });
      if (response.code === 1) {
        setWarehouses(normalizeList(response.data));
      }
    } catch (error) {
      message.error(getApiErrorMessage(error, '加载仓库失败'));
    }
  };

  const loadPendingTransfers = async () => {
    try {
      const response = await api.post('/api/assetTransfer/selectModelList', {
        pageNum: 1,
        pageSize: 500,
        status: 1,
      });
      if (response.code === 1) {
        setPendingTransfers(normalizeList(response.data));
      }
    } catch (error) {
      message.error(getApiErrorMessage(error, '加载待接收调拨资产失败'));
    }
  };

  useEffect(() => {
    loadAssetTypes();
    loadDepartments();
    loadWarehouses();
    loadPendingTransfers();
  }, []);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const assetType = assetTypeOptions.find((item) => item.value === values.assetTypeId);
      const department = departmentOptions.find((item) => item.value === values.depId);
      setSubmitLoading(true);

      const attachmentNames = (values.attachments || []).map((item) => item.name || item.fileName).filter(Boolean).join(',');
      const response = await api.post('/api/asset/addAsset', {
        assetCode: values.assetCode || buildAssetCode(),
        assetName: values.assetName,
        assetTypeid: values.assetTypeId,
        assetTypename: assetType?.label,
        speModel: values.specification,
        manufacturer: values.manufacturer,
        purchaseDate: values.purchaseDate?.format('YYYY-MM-DD'),
        origValue: values.originalValue != null ? String(values.originalValue) : undefined,
        serviceLife: values.usefulLife != null ? `${values.usefulLife}年` : undefined,
        depId: values.depId,
        depName: department?.label,
        stoLocation: values.location,
        respPerson: values.responsiblePerson,
        assetState: values.assetState,
        deprMethod: values.depreciationMethod,
        serialNum: values.serialNumber,
        assetDesc: values.description,
        attachment: attachmentNames,
        inventoryId: values.inventoryId,
      });

      if (response.code !== 1) {
        message.error(getApiResponseMessage(response, '资产新增失败'));
        return;
      }

      message.success('资产新增成功');
      form.resetFields();
      form.setFieldsValue({
        assetState: 1,
        depreciationMethod: 1,
        attachments: [],
      });
    } catch (error) {
      if (error?.errorFields) {
        return;
      }
      message.error(getApiErrorMessage(error, '资产新增失败'));
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleReset = () => {
    form.resetFields();
    form.setFieldsValue({
      assetState: 1,
      depreciationMethod: 1,
      attachments: [],
    });
  };

  const handleCloseTransferModal = () => {
    setTransferModalVisible(false);
    setSelectedTransferIds([]);
    transferForm.resetFields();
  };

  const confirmTransfer = async (status) => {
    if (selectedTransfers.length === 0) {
      message.warning('请至少选择一条调拨资产');
      return;
    }

    try {
      const requiredFields = status === 1 ? ['assetStatus', 'inventoryId', 'respPersion'] : ['reason'];
      const values = await transferForm.validateFields(requiredFields);
      setTransferLoading(true);
      const warehouse = warehouses.find((item) => item.id === values.inventoryId);

      const responses = await Promise.all(selectedTransfers.map((transfer) => api.post('/api/assetTransfer/confirmTransfer', {
        transferId: transfer.id,
        status,
        assetStatus: status === 1 ? values.assetStatus : undefined,
        assetParts: values.assetParts,
        remark: values.remark,
        reason: status === 2 ? values.reason : undefined,
        respPersion: status === 1 ? values.respPersion : undefined,
        inventoryId: status === 1 ? values.inventoryId : undefined,
        inventoryName: status === 1 ? warehouse?.wareName : undefined,
      })));

      const failed = responses.find((item) => item.code !== 1);
      if (failed) {
        message.error(getApiResponseMessage(failed, status === 1 ? '调拨接收失败' : '调拨拒绝失败'));
        return;
      }

      message.success(status === 1 ? '调拨资产已接收入库' : '已拒绝所选调拨资产');
      handleCloseTransferModal();
      await loadPendingTransfers();
    } catch (error) {
      if (error?.errorFields) {
        return;
      }
      message.error(getApiErrorMessage(error, status === 1 ? '调拨接收失败' : '调拨拒绝失败'));
    } finally {
      setTransferLoading(false);
    }
  };

  const normFile = (event) => {
    if (Array.isArray(event)) {
      return event;
    }
    return event?.fileList || [];
  };

  const transferColumns = [
    { title: '调拨单号', dataIndex: 'transferCode', key: 'transferCode', width: 160 },
    { title: '资产编码', dataIndex: 'assetCode', key: 'assetCode', width: 140 },
    { title: '资产名称', dataIndex: 'assetName', key: 'assetName', width: 160 },
    { title: '资产类型', dataIndex: 'assetTypename', key: 'assetTypename', width: 140 },
    { title: '规格型号', dataIndex: 'speModel', key: 'speModel', width: 140 },
    { title: '调出部门', dataIndex: 'depName', key: 'depName', width: 140 },
    { title: '接收部门', dataIndex: 'bedepName', key: 'bedepName', width: 140 },
    { title: '调拨人', dataIndex: 'userName', key: 'userName', width: 120 },
  ];

  return (
    <div style={{ padding: '0 16px' }}>
      <h1 style={{ marginBottom: 24 }}>资产新增</h1>

      <Alert
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
        message="当前页面已连接真实资产接口"
        description="新增资产会写入资产台账，调拨入库会调用资产调拨确认接口并同步更新资产所属部门与仓库。"
      />

      <div style={{ marginBottom: 24 }}>
        <Badge count={pendingTransfers.length} overflowCount={99}>
          <Button type="primary" icon={<SwapOutlined />} onClick={() => setTransferModalVisible(true)}>
            调拨入库
          </Button>
        </Badge>
        <span style={{ marginLeft: 8, color: '#666', fontSize: 14 }}>
          待接收调拨资产: {pendingTransfers.length} 个
        </span>
      </div>

      <Card>
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            assetState: 1,
            depreciationMethod: 1,
            attachments: [],
          }}
        >
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item name="assetCode" label="资产编码">
                <Input placeholder="可手动输入，留空则由后端按现有规则处理" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="assetName" label="资产名称" rules={[{ required: true, message: '请输入资产名称' }]}>
                <Input placeholder="请输入资产名称" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item name="assetTypeId" label="资产类型" rules={[{ required: true, message: '请选择资产类型' }]}>
                <Select placeholder="请选择资产类型" options={assetTypeOptions} showSearch optionFilterProp="label" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="specification" label="规格型号" rules={[{ required: true, message: '请输入规格型号' }]}>
                <Input placeholder="请输入规格型号" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item name="manufacturer" label="生产厂商" rules={[{ required: true, message: '请输入生产厂商' }]}>
                <Input placeholder="请输入生产厂商" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="purchaseDate" label="购置日期" rules={[{ required: true, message: '请选择购置日期' }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item name="originalValue" label="原值（元）" rules={[{ required: true, message: '请输入资产原值' }]}>
                <InputNumber style={{ width: '100%' }} min={0} precision={2} placeholder="请输入资产原值" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="usefulLife" label="使用年限（年）" rules={[{ required: true, message: '请输入使用年限' }]}>
                <InputNumber style={{ width: '100%' }} min={1} max={50} placeholder="请输入使用年限" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item name="depId" label="使用部门" rules={[{ required: true, message: '请选择使用部门' }]}>
                <Select placeholder="请选择使用部门" options={departmentOptions} showSearch optionFilterProp="label" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="inventoryId" label="归属仓库" rules={[{ required: true, message: '请选择归属仓库' }]}>
                <Select placeholder="请选择归属仓库" options={warehouseOptions} showSearch optionFilterProp="label" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item name="location" label="存放地点" rules={[{ required: true, message: '请输入存放地点' }]}>
                <Input placeholder="请输入存放地点" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="responsiblePerson" label="责任人" rules={[{ required: true, message: '请输入责任人' }]}>
                <Input placeholder="请输入责任人姓名" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item name="assetState" label="资产状态" rules={[{ required: true, message: '请选择资产状态' }]}>
                <Select placeholder="请选择资产状态" options={assetStateOptions} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="depreciationMethod" label="折旧方法" rules={[{ required: true, message: '请选择折旧方法' }]}>
                <Select placeholder="请选择折旧方法" options={depreciationOptions} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item name="serialNumber" label="序列号">
                <Input placeholder="请输入设备序列号（可选）" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="description" label="资产描述">
            <TextArea placeholder="请输入资产详细描述" rows={3} />
          </Form.Item>

          <Form.Item name="attachments" label="附件上传" valuePropName="fileList" getValueFromEvent={normFile}>
            <Upload name="attachments" listType="picture" beforeUpload={() => false} maxCount={5}>
              <Button icon={<UploadOutlined />}>上传附件</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Row gutter={16}>
              <Col>
                <Button type="primary" onClick={handleSubmit} loading={submitLoading} icon={<PlusOutlined />}>
                  提交
                </Button>
              </Col>
              <Col>
                <Button onClick={handleReset} disabled={submitLoading}>
                  重置
                </Button>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </Card>

      <Modal
        title="资产调拨验收入库"
        open={transferModalVisible}
        onCancel={handleCloseTransferModal}
        width={980}
        footer={[
          <Button key="cancel" onClick={handleCloseTransferModal}>
            取消
          </Button>,
          <Button key="reject" danger loading={transferLoading} onClick={() => confirmTransfer(2)}>
            拒绝接收
          </Button>,
          <Button key="accept" type="primary" loading={transferLoading} onClick={() => confirmTransfer(1)}>
            确认接收
          </Button>,
        ]}
      >
        <Alert
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
          message="可多选接收或拒绝"
          description="批量操作会对所选调拨资产应用同一组验收信息。"
        />

        <Table
          dataSource={pendingTransfers}
          rowKey="id"
          pagination={false}
          size="small"
          scroll={{ x: 1200, y: 260 }}
          rowSelection={{
            selectedRowKeys: selectedTransferIds,
            onChange: (keys) => setSelectedTransferIds(keys),
          }}
          columns={transferColumns}
        />

        <Form form={transferForm} layout="vertical" style={{ marginTop: 16 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="assetStatus" label="接收后资产状态" rules={[{ required: true, message: '请选择接收后资产状态' }]}> 
                <Select placeholder="请选择资产状态" options={receiveAssetStatusOptions} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="inventoryId" label="接收仓库" rules={[{ required: true, message: '请选择接收仓库' }]}> 
                <Select placeholder="请选择接收仓库" options={warehouseOptions} showSearch optionFilterProp="label" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="respPersion" label="新责任人" rules={[{ required: true, message: '请输入新责任人' }]}> 
                <Input placeholder="请输入新责任人" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="assetParts" label="配件清单">
                <Input placeholder="请输入随资产一并接收的配件" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="remark" label="备注">
            <TextArea rows={3} placeholder="接收备注，可选" />
          </Form.Item>

          <Form.Item name="reason" label="拒绝原因" rules={[{ required: true, message: '拒绝接收时必须填写原因' }]}> 
            <TextArea rows={3} placeholder="仅在拒绝接收时填写" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default FixedAssetsAdd;
