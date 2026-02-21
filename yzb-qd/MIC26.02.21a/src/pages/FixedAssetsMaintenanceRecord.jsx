import React, { useState } from 'react';
import { Card, Table, Input, Select, DatePicker, Button, Space, Tag, Modal, Form, message } from 'antd';
import { SearchOutlined, EditOutlined, EyeOutlined, DownloadOutlined, PrinterOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';

const { Option } = Select;
const { RangePicker } = DatePicker;

const FixedAssetsMaintenanceRecord = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [searchParams, setSearchParams] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // 模拟维修记录数据
  const maintenanceRecords = [
    {
      key: '1',
      recordNo: 'MR2026001',
      assetCode: 'FA2024001',
      assetName: 'CT扫描仪',
      assetType: '医疗设备',
      manufacturer: '西门子医疗',
      specification: '64排128层',
      maintenanceDate: '2026-01-15',
      completionDate: '2026-01-20',
      maintenanceType: '定期维护',
      maintenanceReason: '年度例行维护',
      maintenanceContent: '设备全面检测、校准、清洁，更换损耗部件',
      maintenanceVendor: '西门子医疗服务',
      maintenancePerson: '张工程师',
      cost: 25000,
      status: '已完成',
      remarks: '维护后设备运行正常'
    },
    {
      key: '2',
      recordNo: 'MR2026002',
      assetCode: 'FA2024002',
      assetName: '彩色超声诊断仪',
      assetType: '医疗设备',
      manufacturer: 'GE医疗',
      specification: '高端彩超',
      maintenanceDate: '2026-01-10',
      completionDate: '2026-01-12',
      maintenanceType: '故障维修',
      maintenanceReason: '探头故障',
      maintenanceContent: '更换超声探头，重新校准设备',
      maintenanceVendor: 'GE医疗服务',
      maintenancePerson: '李工程师',
      cost: 18000,
      status: '已完成',
      remarks: '故障已修复，设备运行正常'
    },
    {
      key: '3',
      recordNo: 'MR2026003',
      assetCode: 'FA2023001',
      assetName: '公务用车',
      assetType: '车辆',
      manufacturer: '丰田',
      specification: '丰田凯美瑞',
      maintenanceDate: '2026-01-05',
      completionDate: '2026-01-06',
      maintenanceType: '定期维护',
      maintenanceReason: '车辆保养',
      maintenanceContent: '更换机油、机滤，检查刹车系统',
      maintenanceVendor: '丰田4S店',
      maintenancePerson: '王技师',
      cost: 1200,
      status: '已完成',
      remarks: '保养后车辆状态良好'
    },
    {
      key: '4',
      recordNo: 'MR2026004',
      assetCode: 'FA2024003',
      assetName: '服务器',
      assetType: '办公设备',
      manufacturer: '戴尔',
      specification: 'Dell PowerEdge',
      maintenanceDate: '2026-01-18',
      completionDate: null,
      maintenanceType: '故障维修',
      maintenanceReason: '硬盘故障',
      maintenanceContent: '更换故障硬盘，恢复数据',
      maintenanceVendor: '戴尔服务',
      maintenancePerson: '刘工程师',
      cost: 5000,
      status: '处理中',
      remarks: '正在维修中'
    },
    {
      key: '5',
      recordNo: 'MR2025005',
      assetCode: 'FA2022001',
      assetName: '办公桌椅',
      assetType: '家具',
      manufacturer: '宜家',
      specification: '实木办公桌椅',
      maintenanceDate: '2025-12-20',
      completionDate: '2025-12-21',
      maintenanceType: '故障维修',
      maintenanceReason: '椅子损坏',
      maintenanceContent: '更换椅子配件，修复损坏部位',
      maintenanceVendor: '宜家服务',
      maintenancePerson: '陈师傅',
      cost: 300,
      status: '已完成',
      remarks: '维修后正常使用'
    }
  ];

  const columns = [
    {
      title: '维修单号',
      dataIndex: 'recordNo',
      key: 'recordNo',
      width: 140,
      fixed: 'left'
    },
    {
      title: '资产编码',
      dataIndex: 'assetCode',
      key: 'assetCode',
      width: 120
    },
    {
      title: '资产名称',
      dataIndex: 'assetName',
      key: 'assetName',
      width: 150
    },
    {
      title: '资产类型',
      dataIndex: 'assetType',
      key: 'assetType',
      width: 100
    },
    {
      title: '生产厂商',
      dataIndex: 'manufacturer',
      key: 'manufacturer',
      width: 120
    },
    {
      title: '规格型号',
      dataIndex: 'specification',
      key: 'specification',
      width: 120
    },
    {
      title: '维修日期',
      dataIndex: 'maintenanceDate',
      key: 'maintenanceDate',
      width: 120
    },
    {
      title: '完成日期',
      dataIndex: 'completionDate',
      key: 'completionDate',
      width: 120
    },
    {
      title: '维修类型',
      dataIndex: 'maintenanceType',
      key: 'maintenanceType',
      width: 100,
      render: (type) => <Tag color="blue">{type}</Tag>
    },
    {
      title: '维修原因',
      dataIndex: 'maintenanceReason',
      key: 'maintenanceReason',
      width: 120
    },
    {
      title: '维修费用',
      dataIndex: 'cost',
      key: 'cost',
      width: 100,
      render: (cost) => `¥${cost.toLocaleString()}`
    },
    {
      title: '维修状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => {
        let color = 'green';
        if (status === '处理中') color = 'blue';
        if (status === '待处理') color = 'orange';
        return <Tag color={color}>{status}</Tag>;
      }
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => handleViewDetail(record)}>
            详情
          </Button>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Button type="link" size="small" icon={<DeleteOutlined />} onClick={() => handleDelete(record)} style={{ color: '#f5222d' }}>
            删除
          </Button>
        </Space>
      )
    }
  ];

  const handleViewDetail = (record) => {
    setSelectedRecord(record);
    setVisible(true);
  };

  const handleEdit = (record) => {
    setSelectedRecord(record);
    form.setFieldsValue(record);
    setVisible(true);
  };

  const handleDelete = (record) => {
    message.success(`已删除维修记录：${record.recordNo}`);
  };

  const handleAdd = () => {
    form.resetFields();
    setAddModalVisible(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      message.success('保存成功！');
      setAddModalVisible(false);
      setVisible(false);
    } catch (error) {
      message.error('请检查输入信息！');
    }
  };

  const handleSearch = () => {
    message.success('查询成功！');
  };

  const handleReset = () => {
    setSearchParams({});
    message.success('重置成功！');
  };

  const handleExport = () => {
    message.success('导出成功！');
  };

  const handlePrint = () => {
    message.success('打印成功！');
  };

  return (
    <div style={{ padding: '0 16px' }}>
      <h1 style={{ marginBottom: 24 }}>资产维修记录</h1>



      <Card style={{ marginBottom: 16 }}>
        <Space wrap style={{ width: '100%' }}>
          <Input placeholder="维修单号" style={{ width: 150, minWidth: '120px' }} />
          <Input placeholder="资产编码" style={{ width: 150, minWidth: '120px' }} />
          <Input placeholder="资产名称" style={{ width: 150, minWidth: '120px' }} />
          <Select
            placeholder="资产类型"
            style={{ width: 120, minWidth: '100px' }}
          >
            <Option value="all">全部类型</Option>
            <Option value="医疗设备">医疗设备</Option>
            <Option value="办公设备">办公设备</Option>
            <Option value="家具">家具</Option>
            <Option value="车辆">车辆</Option>
          </Select>
          <Select
            placeholder="维修类型"
            style={{ width: 120, minWidth: '100px' }}
          >
            <Option value="all">全部类型</Option>
            <Option value="定期维护">定期维护</Option>
            <Option value="故障维修">故障维修</Option>
          </Select>
          <Select
            placeholder="维修状态"
            style={{ width: 120, minWidth: '100px' }}
          >
            <Option value="all">全部状态</Option>
            <Option value="已完成">已完成</Option>
            <Option value="处理中">处理中</Option>
            <Option value="待处理">待处理</Option>
          </Select>
          <RangePicker placeholder={['维修开始日期', '维修结束日期']} style={{ width: 240 }} />
          <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
            查询
          </Button>
          <Button onClick={handleReset}>重置</Button>
          <Button icon={<DownloadOutlined />} onClick={handleExport}>导出</Button>
          <Button icon={<PrinterOutlined />} onClick={handlePrint}>打印</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新增维修记录
          </Button>
        </Space>
      </Card>

      <div style={{ overflowX: 'auto' }}>
        <Table
          columns={columns}
          dataSource={maintenanceRecords}
          pagination={{
            pageSize: pageSize,
            current: currentPage,
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            },
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条维修记录`,
            style: {
              display: 'flex',
              justifyContent: 'center',
              marginTop: '16px'
            }
          }}
          size="small"
          rowKey="key"
          style={{
            borderRadius: 8,
            overflow: 'hidden',
          }}
        />
      </div>

      {/* 查看/编辑维修记录模态框 */}
      <Modal
        title={selectedRecord ? `维修记录详情 - ${selectedRecord.recordNo}` : '新增维修记录'}
        open={visible || addModalVisible}
        onCancel={() => {
          setVisible(false);
          setAddModalVisible(false);
          setSelectedRecord(null);
        }}
        width={800}
        footer={[
          <Button key="close" onClick={() => {
            setVisible(false);
            setAddModalVisible(false);
            setSelectedRecord(null);
          }}>
            关闭
          </Button>,
          <Button key="save" type="primary" onClick={handleSave}>
            保存
          </Button>
        ]}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={selectedRecord}
        >
          <Form.Item
            name="recordNo"
            label="维修单号"
            rules={[{ required: true, message: '请输入维修单号' }]}
          >
            <Input placeholder="请输入维修单号" />
          </Form.Item>
          <Form.Item
            name="assetCode"
            label="资产编码"
            rules={[{ required: true, message: '请输入资产编码' }]}
          >
            <Input placeholder="请输入资产编码" />
          </Form.Item>
          <Form.Item
            name="assetName"
            label="资产名称"
            rules={[{ required: true, message: '请输入资产名称' }]}
          >
            <Input placeholder="请输入资产名称" />
          </Form.Item>
          <Form.Item
            name="assetType"
            label="资产类型"
            rules={[{ required: true, message: '请选择资产类型' }]}
          >
            <Select placeholder="请选择资产类型">
              <Option value="医疗设备">医疗设备</Option>
              <Option value="办公设备">办公设备</Option>
              <Option value="家具">家具</Option>
              <Option value="车辆">车辆</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="manufacturer"
            label="生产厂商"
          >
            <Input placeholder="请输入生产厂商" />
          </Form.Item>
          <Form.Item
            name="specification"
            label="规格型号"
          >
            <Input placeholder="请输入规格型号" />
          </Form.Item>
          <Form.Item
            name="maintenanceDate"
            label="维修日期"
            rules={[{ required: true, message: '请选择维修日期' }]}
          >
            <Input placeholder="请选择维修日期" />
          </Form.Item>
          <Form.Item
            name="completionDate"
            label="完成日期"
          >
            <Input placeholder="请选择完成日期" />
          </Form.Item>
          <Form.Item
            name="maintenanceType"
            label="维修类型"
            rules={[{ required: true, message: '请选择维修类型' }]}
          >
            <Select placeholder="请选择维修类型">
              <Option value="定期维护">定期维护</Option>
              <Option value="故障维修">故障维修</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="maintenanceReason"
            label="维修原因"
            rules={[{ required: true, message: '请输入维修原因' }]}
          >
            <Input placeholder="请输入维修原因" />
          </Form.Item>
          <Form.Item
            name="maintenanceContent"
            label="维修内容"
            rules={[{ required: true, message: '请输入维修内容' }]}
          >
            <Input.TextArea rows={4} placeholder="请输入维修内容" />
          </Form.Item>
          <Form.Item
            name="maintenanceVendor"
            label="维修厂商"
            rules={[{ required: true, message: '请输入维修厂商' }]}
          >
            <Input placeholder="请输入维修厂商" />
          </Form.Item>
          <Form.Item
            name="maintenancePerson"
            label="维修人员"
            rules={[{ required: true, message: '请输入维修人员' }]}
          >
            <Input placeholder="请输入维修人员" />
          </Form.Item>
          <Form.Item
            name="cost"
            label="维修费用"
            rules={[{ required: true, message: '请输入维修费用' }]}
          >
            <Input type="number" prefix="¥" placeholder="请输入维修费用" />
          </Form.Item>
          <Form.Item
            name="status"
            label="维修状态"
            rules={[{ required: true, message: '请选择维修状态' }]}
          >
            <Select placeholder="请选择维修状态">
              <Option value="已完成">已完成</Option>
              <Option value="处理中">处理中</Option>
              <Option value="待处理">待处理</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="remarks"
            label="备注"
          >
            <Input.TextArea rows={3} placeholder="请输入备注信息" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default FixedAssetsMaintenanceRecord;