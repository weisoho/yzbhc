import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { Card, Table, Input, Select, DatePicker, Button, Space, Tag, Modal, message, Pagination, Form } from 'antd';
import { SearchOutlined, EditOutlined, DownloadOutlined, PrinterOutlined } from '@ant-design/icons';
import api from '../utils/api.js';

const { RangePicker } = DatePicker;

const normalizeList = (payload) => {
  if (Array.isArray(payload?.records)) {
    return payload.records;
  }
  if (Array.isArray(payload?.list)) {
    return payload.list;
  }
  return [];
};

const assetStatusMeta = {
  1: { label: '在用', color: 'green' },
  2: { label: '闲置', color: 'orange' },
  3: { label: '维修', color: 'blue' },
  4: { label: '待报废', color: 'red' },
};

const depreciationOptions = [
  { label: '直线法', value: 1 },
  { label: '双倍余额递减法', value: 2 },
  { label: '年数总和法', value: 3 },
];

const formatDate = (value) => (value ? String(value).slice(0, 10) : '-');

const formatAmount = (value) => {
  if (value === null || value === undefined || value === '') {
    return '-';
  }
  const amount = Number(value);
  return Number.isNaN(amount) ? value : amount.toLocaleString();
};

const FixedAssetsDetailQuery = () => {
  const [searchForm] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);
  const [form] = Form.useForm();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [lastQuery, setLastQuery] = useState({});
  const [assetTypeOptions, setAssetTypeOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);

  useEffect(() => {
    loadAssetTypes();
    loadDepartments();
  }, []);

  useEffect(() => {
    loadAssets(lastQuery, currentPage, pageSize);
  }, [currentPage, lastQuery, pageSize]);

  const loadAssetTypes = async () => {
    try {
      const response = await api.request('/api/assetType/selectAssetType', {
        method: 'POST',
        params: { pageNum: 1, pageSize: 500, assetState: 1 },
      });
      if (response.code === 1) {
        setAssetTypeOptions(
          normalizeList(response.data).map((item) => ({
            label: `${item.assetCode || ''} / ${item.assetName || ''}`,
            value: item.id,
            assetName: item.assetName,
          })),
        );
      }
    } catch (error) {
      message.error('加载资产类型失败');
    }
  };

  const loadDepartments = async () => {
    try {
      const response = await api.get('/api/department/list');
      if (response.code === 1 && Array.isArray(response.data)) {
        setDepartmentOptions(
          response.data
            .filter((item) => item?.id)
            .map((item) => ({
              label: item.deptName || item.name || `部门${item.id}`,
              value: item.id,
              deptName: item.deptName || item.name || `部门${item.id}`,
            })),
        );
      }
    } catch (error) {
      message.error('加载部门列表失败');
    }
  };

  const loadAssets = async (query = {}, page = 1, size = 10) => {
    try {
      setLoading(true);
      const response = await api.request('/api/asset/selectAsset', {
        method: 'POST',
        params: {
          pageNum: page,
          pageSize: size,
          assetCode: query.assetCode,
          assetName: query.assetName,
          assetTypeid: query.assetTypeid,
          depId: query.depId,
          assetState: query.assetState,
          purchaseStart: query.dateRange?.[0]?.format('YYYY-MM-DD'),
          purchaseEnd: query.dateRange?.[1]?.format('YYYY-MM-DD'),
        },
      });
      if (response.code === 1 && response.data) {
        const assetList = normalizeList(response.data).map((asset) => ({
          key: asset.id,
          id: asset.id,
          assetCode: asset.assetCode,
          assetName: asset.assetName,
          assetTypeid: asset.assetTypeid,
          assetTypeName: asset.assetTypename || '未知类型',
          specification: asset.speModel,
          manufacturer: asset.manufacturer,
          purchaseDate: asset.purchaseDate,
          originalValue: asset.origValue,
          departmentId: asset.depId,
          departmentName: asset.depName || '未知部门',
          location: asset.stoLocation,
          responsiblePerson: asset.respPerson,
          status: asset.assetState,
          depreciationMethod: asset.deprMethod,
          usefulLife: asset.serviceLife,
          serialNumber: asset.serialNum,
          assetDesc: asset.assetDesc,
        }));
        setAssets(assetList);
        setTotal(response.data.total || assetList.length);
      }
    } catch (error) {
      message.error('加载资产列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (values) => {
    setLastQuery(values);
    setCurrentPage(1);
    await loadAssets(values, 1, pageSize);
  };

  const handleReset = async () => {
    searchForm.resetFields();
    setLastQuery({});
    setCurrentPage(1);
    await loadAssets({}, 1, pageSize);
  };

  const columns = [
    { title: '资产编码', dataIndex: 'assetCode', key: 'assetCode', width: 120 },
    { title: '资产名称', dataIndex: 'assetName', key: 'assetName', width: 150 },
    { title: '资产类型', dataIndex: 'assetTypeName', key: 'assetTypeName', width: 120 },
    { title: '规格型号', dataIndex: 'specification', key: 'specification', width: 120 },
    { title: '生产厂商', dataIndex: 'manufacturer', key: 'manufacturer', width: 120 },
    { 
      title: '购置日期', 
      dataIndex: 'purchaseDate', 
      key: 'purchaseDate', 
      width: 110,
      render: formatDate,
    },
    { 
      title: '原值（元）', 
      dataIndex: 'originalValue', 
      key: 'originalValue', 
      width: 110,
      render: formatAmount,
    },
    { title: '使用部门', dataIndex: 'departmentName', key: 'departmentName', width: 120 },
    { title: '存放地点', dataIndex: 'location', key: 'location', width: 140 },
    { title: '责任人', dataIndex: 'responsiblePerson', key: 'responsiblePerson', width: 120 },
    { 
      title: '资产状态', 
      dataIndex: 'status', 
      key: 'status', 
      width: 100,
      render: (status) => {
        const meta = assetStatusMeta[status] || { label: '-', color: 'default' };
        return <Tag color={meta.color}>{meta.label}</Tag>;
      }
    },
    {
      title: '折旧方法',
      dataIndex: 'depreciationMethod',
      key: 'depreciationMethod',
      width: 140,
      render: (value) => depreciationOptions.find((item) => item.value === value)?.label || '-',
    },
    { title: '使用年限', dataIndex: 'usefulLife', key: 'usefulLife', width: 100 },
    { title: '序列号', dataIndex: 'serialNumber', key: 'serialNumber', width: 140 },
    { 
      title: '操作', 
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="link" 
            size="small"
            icon={<EditOutlined />} 
            onClick={() => handleViewDetail(record)}
          >
            修改
          </Button>
        </Space>
      )
    },
  ];

  const handleViewDetail = (record) => {
    setEditingAsset({ ...record });
    form.setFieldsValue({
      ...record,
      assetTypeid: record.assetTypeid,
      depId: record.departmentId,
      purchaseDate: record.purchaseDate ? dayjs(record.purchaseDate) : null,
    });
    setVisible(true);
  };

  const handleExport = () => {
    message.success('导出成功！');
  };

  const handlePrint = () => {
    message.success('打印功能已调用！');
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      const assetType = assetTypeOptions.find((item) => item.value === values.assetTypeid);
      const department = departmentOptions.find((item) => item.value === values.depId);
      
      const assetData = {
        id: editingAsset.id,
        assetCode: values.assetCode,
        assetName: values.assetName,
        assetTypeid: values.assetTypeid,
        assetTypename: assetType?.assetName || editingAsset.assetTypeName,
        speModel: values.specification,
        manufacturer: values.manufacturer,
        purchaseDate: values.purchaseDate ? values.purchaseDate.format('YYYY-MM-DD') : undefined,
        origValue: values.originalValue,
        serviceLife: values.usefulLife,
        deprMethod: values.depreciationMethod,
        depId: values.depId,
        depName: department?.deptName || editingAsset.departmentName,
        stoLocation: values.location,
        respPerson: values.responsiblePerson,
        assetState: values.status,
        serialNum: values.serialNumber,
        assetDesc: values.assetDesc,
      };
      
      const response = await api.post('/api/asset/updateAsset', assetData);
      if (response.code === 1) {
        message.success('修改成功！');
        setVisible(false);
        await loadAssets(lastQuery, currentPage, pageSize);
      } else {
        message.error('修改失败');
      }
    } catch (error) {
      message.error('请检查输入信息！');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '0 16px' }}>
      <h1 style={{ marginBottom: 24 }}>资产明细查询</h1>
      
      <Card style={{ marginBottom: 16 }}>
        <Form form={searchForm} layout="inline" onFinish={handleSearch}>
          <Form.Item name="assetCode">
            <Input placeholder="资产编码" style={{ width: 150 }} allowClear />
          </Form.Item>
          <Form.Item name="assetName">
            <Input placeholder="资产名称" style={{ width: 150 }} allowClear />
          </Form.Item>
          <Form.Item name="assetTypeid">
            <Select placeholder="资产类型" style={{ width: 180 }} allowClear options={assetTypeOptions} />
          </Form.Item>
          <Form.Item name="depId">
            <Select placeholder="使用部门" style={{ width: 180 }} allowClear options={departmentOptions} />
          </Form.Item>
          <Form.Item name="assetState">
            <Select
              placeholder="资产状态"
              style={{ width: 140 }}
              allowClear
              options={Object.entries(assetStatusMeta).map(([value, meta]) => ({ value: Number(value), label: meta.label }))}
            />
          </Form.Item>
          <Form.Item name="dateRange">
            <RangePicker placeholder={['购置开始日期', '购置结束日期']} style={{ width: 240 }} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                查询
              </Button>
              <Button onClick={handleReset}>重置</Button>
              <Button icon={<DownloadOutlined />} onClick={handleExport}>导出</Button>
              <Button icon={<PrinterOutlined />} onClick={handlePrint}>打印</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
      
      <div style={{ overflowX: 'auto' }}>
        <Table 
          columns={columns.map(column => ({
            ...column,
            ellipsis: false,
            align: 'center',
            onHeaderCell: () => ({
              style: {
                whiteSpace: 'nowrap'
              }
            }),
            onCell: () => ({
              style: {
                whiteSpace: 'nowrap'
              }
            })
          }))} 
          dataSource={assets} 
          loading={loading}
          pagination={false}
          scroll={{ x: 1600 }}
        />
      </div>
      
      <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center' }}>
        <Pagination 
          current={currentPage}
          pageSize={pageSize}
          showSizeChanger={true}
          showQuickJumper={true}
          showTotal={(total) => `共 ${total} 条记录`}
          total={total}
          onChange={(page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          }}
        />
      </div>

      <Modal
        title="修改资产信息"
        open={visible}
        onCancel={() => setVisible(false)}
        footer={[
          <Button key="close" onClick={() => setVisible(false)}>
            取消
          </Button>,
          <Button key="save" type="primary" onClick={handleSave} loading={loading}>
            保存
          </Button>
        ]}
        width={800}
      >
        {editingAsset && (
          <Form
            form={form}
            layout="vertical"
            initialValues={editingAsset}
          >
            <Form.Item
              name="assetCode"
              label="资产编码"
              rules={[{ required: true, message: '请输入资产编码' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="assetName"
              label="资产名称"
              rules={[{ required: true, message: '请输入资产名称' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="assetTypeid"
              label="资产类型"
              rules={[{ required: true, message: '请选择资产类型' }]}
            >
              <Select options={assetTypeOptions} />
            </Form.Item>
            <Form.Item
              name="specification"
              label="规格型号"
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="manufacturer"
              label="生产厂商"
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="serialNumber"
              label="序列号"
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="purchaseDate"
              label="购置日期"
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              name="usefulLife"
              label="使用年限"
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="originalValue"
              label="原值"
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="depreciationMethod"
              label="折旧方法"
            >
              <Select options={depreciationOptions} />
            </Form.Item>
            <Form.Item
              name="depId"
              label="使用部门"
            >
              <Select options={departmentOptions} />
            </Form.Item>
            <Form.Item
              name="location"
              label="存放地点"
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="responsiblePerson"
              label="责任人"
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="status"
              label="资产状态"
            >
              <Select options={Object.entries(assetStatusMeta).map(([value, meta]) => ({ value: Number(value), label: meta.label }))} />
            </Form.Item>
            <Form.Item
              name="assetDesc"
              label="资产描述"
            >
              <Input.TextArea rows={3} />
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default FixedAssetsDetailQuery;