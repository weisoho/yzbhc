import React, { useState, useEffect } from 'react';
import { Card, Table, Input, Select, DatePicker, Button, Space, Tag, Modal, Descriptions, message, Pagination, Form, Upload } from 'antd';
import { SearchOutlined, EditOutlined, DownloadOutlined, PrinterOutlined, UploadOutlined, EyeOutlined } from '@ant-design/icons';
import api from '../utils/api.js';

const { Option } = Select;
const { RangePicker } = DatePicker;

const FixedAssetsDetailQuery = () => {
  const [visible, setVisible] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [editingAsset, setEditingAsset] = useState(null);
  const [form] = Form.useForm();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  // 加载资产列表
  useEffect(() => {
    loadAssets();
  }, [currentPage, pageSize]);

  const loadAssets = async () => {
    try {
      setLoading(true);
      const response = await api.post('/yzb/selectAsset', {
        pageNum: currentPage,
        pageSize: pageSize
      });
      if (response.code === 1 && response.data) {
        const assetList = response.data.list.map(asset => ({
          key: asset.id,
          id: asset.id,
          assetCode: asset.assetCode,
          assetName: asset.assetName,
          assetType: asset.assetTypeName || '未知类型', // 从API获取资产类型名称
          specification: asset.assetSpec,
          manufacturer: asset.manufacturer,
          purchaseDate: asset.purchaseDate ? asset.purchaseDate.substring(0, 10) : '',
          originalValue: asset.originalValue,
          netValue: asset.netValue,
          department: asset.depName || '未知部门', // 从API获取部门名称
          location: asset.location,
          responsiblePerson: asset.responsiblePerson,
          status: asset.assetState === 1 ? '在用' : '闲置',
          depreciationMethod: asset.depreciationMethod || '直线法', // 从API获取折旧方法
          usefulLife: asset.usefulLife,
          serialNumber: asset.serialNumber
        }));
        setAssets(assetList);
        setTotal(response.data.total);
      }
    } catch (error) {
      message.error('加载资产列表失败');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: '资产编码', dataIndex: 'assetCode', key: 'assetCode', width: 120 },
    { title: '资产名称', dataIndex: 'assetName', key: 'assetName', width: 150 },
    { title: '资产类型', dataIndex: 'assetType', key: 'assetType', width: 100 },
    { title: '规格型号', dataIndex: 'specification', key: 'specification', width: 120 },
    { title: '生产厂商', dataIndex: 'manufacturer', key: 'manufacturer', width: 120 },
    { 
      title: '购置日期', 
      dataIndex: 'purchaseDate', 
      key: 'purchaseDate', 
      width: 110,
      sorter: (a, b) => new Date(a.purchaseDate) - new Date(b.purchaseDate)
    },
    { 
      title: '原值（元）', 
      dataIndex: 'originalValue', 
      key: 'originalValue', 
      width: 110,
      render: (value) => value ? value.toLocaleString() : '0',
      sorter: (a, b) => (a.originalValue || 0) - (b.originalValue || 0)
    },
    { 
      title: '净值（元）', 
      dataIndex: 'netValue', 
      key: 'netValue', 
      width: 110,
      render: (value) => value ? value.toLocaleString() : '0',
      sorter: (a, b) => (a.netValue || 0) - (b.netValue || 0)
    },
    { title: '使用部门', dataIndex: 'department', key: 'department', width: 100 },
    { 
      title: '资产状态', 
      dataIndex: 'status', 
      key: 'status', 
      width: 100,
      render: (status) => {
        let color = 'green';
        if (status === '闲置') color = 'orange';
        if (status === '维修') color = 'blue';
        if (status === '待报废') color = 'red';
        return <Tag color={color}>{status}</Tag>;
      }
    },
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
    setSelectedAsset(record);
    setEditingAsset({ ...record });
    form.setFieldsValue({ ...record });
    setVisible(true);
  };

  const handleExport = () => {
    message.success('导出成功！');
  };

  const handlePrint = () => {
    message.success('打印功能已调用！');
  };

  const handleSearch = () => {
    message.success('查询成功！');
  };

  const handleReset = () => {
    message.success('重置成功！');
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      
      const assetData = {
        id: editingAsset.id,
        assetCode: values.assetCode,
        assetName: values.assetName,
        assetSpec: values.specification,
        manufacturer: values.manufacturer,
        purchaseDate: values.purchaseDate,
        originalValue: values.originalValue,
        netValue: values.netValue,
        location: values.location,
        responsiblePerson: values.responsiblePerson,
        assetState: values.status === '在用' ? 1 : 0,
        usefulLife: values.usefulLife,
        serialNumber: values.serialNumber
      };
      
      const response = await api.post('/yzb/updateAsset', assetData);
      if (response.code === 1) {
        message.success('修改成功！');
        setVisible(false);
        loadAssets();
      } else {
        message.error('修改失败');
      }
    } catch (error) {
      message.error('请检查输入信息！');
    } finally {
      setLoading(false);
    }
  };

  const uploadProps = {
    name: 'file',
    action: '/api/upload',
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info) {
      if (info.file.status === 'done') {
        console.log('文件上传成功');
      } else if (info.file.status === 'error') {
        console.log('文件上传失败');
      }
    },
  };

  return (
    <div style={{ padding: '0 16px' }}>
      <h1 style={{ marginBottom: 24 }}>资产明细查询</h1>
      
      <Card style={{ marginBottom: 16 }}>
        <Space wrap style={{ width: '100%' }}>
          <Input placeholder="资产编码" style={{ width: 150, minWidth: '120px' }} />
          <Input placeholder="资产名称" style={{ width: 150, minWidth: '120px' }} />
          <Select placeholder="资产类型" style={{ width: 120, minWidth: '100px' }}>
            <Option value="all">全部</Option>
            <Option value="医疗设备">医疗设备</Option>
            <Option value="办公设备">办公设备</Option>
            <Option value="家具">家具</Option>
            <Option value="车辆">车辆</Option>
          </Select>
          <Select placeholder="使用部门" style={{ width: 120, minWidth: '100px' }}>
            <Option value="all">全部</Option>
            <Option value="放射科">放射科</Option>
            <Option value="超声科">超声科</Option>
            <Option value="信息科">信息科</Option>
            <Option value="行政部">行政部</Option>
            <Option value="运营组">运营组</Option>
          </Select>
          <Select placeholder="资产状态" style={{ width: 120, minWidth: '100px' }}>
            <Option value="all">全部</Option>
            <Option value="在用">在用</Option>
            <Option value="闲置">闲置</Option>
            <Option value="维修">维修</Option>
            <Option value="待报废">待报废</Option>
          </Select>
          <RangePicker placeholder={['购置开始日期', '购置结束日期']} style={{ width: 240 }} />
          <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
            查询
          </Button>
          <Button onClick={handleReset}>重置</Button>
          <Button icon={<DownloadOutlined />} onClick={handleExport}>导出</Button>
          <Button icon={<PrinterOutlined />} onClick={handlePrint}>打印</Button>
        </Space>
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
        {selectedAsset && (
          <Form
            form={form}
            layout="vertical"
            initialValues={selectedAsset}
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
              name="assetType"
              label="资产类型"
              rules={[{ required: true, message: '请选择资产类型' }]}
            >
              <Select>
                <Option value="医疗设备">医疗设备</Option>
                <Option value="办公设备">办公设备</Option>
                <Option value="家具">家具</Option>
                <Option value="车辆">车辆</Option>
              </Select>
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
              <Input />
            </Form.Item>
            <Form.Item
              name="usefulLife"
              label="使用年限"
            >
              <Input type="number" suffix="年" />
            </Form.Item>
            <Form.Item
              name="originalValue"
              label="原值"
            >
              <Input type="number" suffix="元" />
            </Form.Item>
            <Form.Item
              name="netValue"
              label="净值"
            >
              <Input type="number" suffix="元" />
            </Form.Item>
            <Form.Item
              name="depreciationMethod"
              label="折旧方法"
            >
              <Select>
                <Option value="直线法">直线法</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="department"
              label="使用部门"
            >
              <Input />
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
              <Select>
                <Option value="在用">在用</Option>
                <Option value="闲置">闲置</Option>
                <Option value="维修">维修</Option>
                <Option value="待报废">待报废</Option>
              </Select>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default FixedAssetsDetailQuery;