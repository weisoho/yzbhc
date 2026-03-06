import React, { useState } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Space, 
  Input, 
  Select, 
  DatePicker, 
  Modal, 
  Form, 
  message, 
  Tag,
  Row,
  Col,
  Upload
} from 'antd';
import { 
  SearchOutlined, 
  PlusOutlined, 
  EyeOutlined, 
  EditOutlined, 
  DeleteOutlined,
  DownloadOutlined,
  UploadOutlined,
  FileTextOutlined
} from '@ant-design/icons';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;

const InstrumentMaintenanceRecord = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [addForm] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const maintenanceRecords = [
    {
      key: '1',
      recordNo: 'MR202401001',
      deviceName: '心脏起搏器',
      serialNo: 'SN2023123456',
      faultReason: '电池异常放电',
      maintenancePlan: '更换电池',
      cost: 1500,
      maintenanceDate: '2024-01-15',
      attachment: '维修报告.pdf'
    },
    {
      key: '2',
      recordNo: 'MR202401002',
      deviceName: '呼吸机',
      serialNo: 'SN2023112345',
      faultReason: '氧浓度传感器故障',
      maintenancePlan: '更换传感器',
      cost: 800,
      maintenanceDate: '2024-01-12',
      attachment: '维修记录.docx'
    },
    {
      key: '3',
      recordNo: 'MR202401003',
      deviceName: '输液泵',
      serialNo: 'SN2023109876',
      faultReason: '输液速度不稳定',
      maintenancePlan: '校准泵体',
      cost: 300,
      maintenanceDate: '2024-01-10',
      attachment: '维护记录.pdf'
    },
    {
      key: '4',
      recordNo: 'MR202401004',
      deviceName: '监护仪',
      serialNo: 'SN2023098765',
      faultReason: '显示屏故障',
      maintenancePlan: '更换显示屏',
      cost: 2000,
      maintenanceDate: '2024-01-08',
      attachment: '维修报告.pdf'
    },
    {
      key: '5',
      recordNo: 'MR202401005',
      deviceName: '除颤仪',
      serialNo: 'SN2023087654',
      faultReason: '电极片接触不良',
      maintenancePlan: '清洁接触点',
      cost: 500,
      maintenanceDate: '2024-01-05',
      attachment: '维修记录.docx'
    }
  ];

  const columns = [
    {
      title: '序号',
      dataIndex: 'key',
      key: 'key',
      width: 80,
      fixed: 'left',
      render: (text) => text
    },
    { 
      title: '设备名称', 
      dataIndex: 'deviceName', 
      key: 'deviceName', 
      width: 150 
    },
    { 
      title: '序列号', 
      dataIndex: 'serialNo', 
      key: 'serialNo', 
      width: 140 
    },
    { 
      title: '故障原因', 
      dataIndex: 'faultReason', 
      key: 'faultReason', 
      width: 150,
      ellipsis: true
    },
    { 
      title: '维修方案', 
      dataIndex: 'maintenancePlan', 
      key: 'maintenancePlan', 
      width: 150,
      ellipsis: true
    },
    { 
      title: '产生费用', 
      dataIndex: 'cost', 
      key: 'cost', 
      width: 100,
      render: (cost) => `¥${cost}`
    },
    { 
      title: '维修日期', 
      dataIndex: 'maintenanceDate', 
      key: 'maintenanceDate', 
      width: 120,
      sorter: (a, b) => new Date(a.maintenanceDate) - new Date(b.maintenanceDate)
    },
    {
      title: '附件', 
      dataIndex: 'attachment', 
      key: 'attachment', 
      width: 120,
      render: (attachment) => (
        <Button type="link" size="small" icon={<FileTextOutlined />}>
          {attachment}
        </Button>
      )
    },
    { 
      title: '操作', 
      key: 'action',
      width: 180,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => handleViewDetail(record)}>详情</Button>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>编辑</Button>
          <Button type="link" size="small" icon={<DeleteOutlined />} onClick={() => handleDelete(record)} style={{ color: '#f5222d' }}>删除</Button>
        </Space>
      )
    }
  ];

  const handleSearch = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      message.success('查询成功');
    }, 1000);
  };

  const handleReset = () => {
    form.resetFields();
  };

  const handleAddNew = () => {
    setAddModalVisible(true);
  };

  const handleAddSubmit = () => {
    addForm.validateFields().then(values => {
      console.log('表单数据:', values);
      message.success('已新增维修记录');
      setAddModalVisible(false);
      addForm.resetFields();
    }).catch(errorInfo => {
      console.log('表单验证失败:', errorInfo);
    });
  };

  const handleAddCancel = () => {
    setAddModalVisible(false);
    addForm.resetFields();
  };

  const handleAddReset = () => {
    addForm.resetFields();
  };

  const handleViewDetail = (record) => {
    setSelectedRecord(record);
    setVisible(true);
  };

  const handleEdit = (record) => {
    message.info('编辑功能开发中');
  };

  const handleDelete = (record) => {
    message.success('删除成功');
  };

  const handleExport = () => {
    if (selectedRowKeys.length === 0) {
      message.info('请选择要导出的记录');
      return;
    }
    const selectedRecords = maintenanceRecords.filter(record => selectedRowKeys.includes(record.key));
    console.log('导出选中的记录:', selectedRecords);
    message.success(`成功导出 ${selectedRecords.length} 条记录`);
  };

  return (
    <div style={{ padding: '0 16px' }}>
      <h1 style={{ marginBottom: 24 }}>仪器维修记录</h1>
      
      <Card style={{ marginBottom: 16 }}>
        <Form form={form} layout="inline">
          <Row gutter={[16, 16]} style={{ width: '100%' }}>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="recordNo" label="维修编号">
                <Input placeholder="请输入维修编号" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="instrumentName" label="仪器名称">
                <Input placeholder="请输入仪器名称" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="serialNo" label="序列号">
                <Input placeholder="请输入序列号" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="department" label="使用科室">
                <Select placeholder="请选择科室" allowClear>
                  <Option value="心内科">心内科</Option>
                  <Option value="ICU">ICU</Option>
                  <Option value="外科">外科</Option>
                  <Option value="急诊科">急诊科</Option>
                  <Option value="手术室">手术室</Option>
                  <Option value="内科">内科</Option>
                  <Option value="儿科">儿科</Option>
                  <Option value="妇产科">妇产科</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="maintenanceType" label="维修类型">
                <Select placeholder="请选择维修类型" allowClear>
                  <Option value="故障维修">故障维修</Option>
                  <Option value="预防性维护">预防性维护</Option>
                  <Option value="定期保养">定期保养</Option>
                  <Option value="校准">校准</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="status" label="状态">
                <Select placeholder="请选择状态" allowClear>
                  <Option value="待处理">待处理</Option>
                  <Option value="进行中">进行中</Option>
                  <Option value="已完成">已完成</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="dateRange" label="维修日期">
                <RangePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24}>
              <Form.Item>
                <Space>
                  <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch} loading={loading}>
                    查询
                  </Button>
                  <Button onClick={handleReset}>重置</Button>
                  <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>
                    新增维修记录
                  </Button>
                  <Button icon={<DownloadOutlined />} onClick={handleExport}>
                    导出
                  </Button>
                  <Upload>
                    <Button icon={<UploadOutlined />}>
                      上传附件
                    </Button>
                  </Upload>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
      
      <div style={{ overflowX: 'auto' }}>
        <Table 
          columns={columns} 
          dataSource={maintenanceRecords} 
          loading={loading}
          rowSelection={{
            selectedRowKeys,
            onChange: (keys) => setSelectedRowKeys(keys),
          }}
          pagination={{ 
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
            style: {
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              margin: '24px 0 0 0',
            }
          }} 
          scroll={{ x: 1800 }}
        />
      </div>

      <Modal
        title="维修记录详情"
        open={visible}
        onCancel={() => setVisible(false)}
        footer={[
          <Button key="close" onClick={() => setVisible(false)}>
            关闭
          </Button>
        ]}
        width={800}
      >
        {selectedRecord && (
          <div>
            <Card>
              <p><strong>维修编号：</strong>{selectedRecord.recordNo}</p>
              <p><strong>设备名称：</strong>{selectedRecord.deviceName}</p>
              <p><strong>序列号：</strong>{selectedRecord.serialNo}</p>
              <p><strong>故障原因：</strong>{selectedRecord.faultReason}</p>
              <p><strong>维修方案：</strong>{selectedRecord.maintenancePlan}</p>
              <p><strong>产生费用：</strong>¥{selectedRecord.cost}</p>
              <p><strong>维修日期：</strong>{selectedRecord.maintenanceDate}</p>
              <p><strong>附件：</strong>
                <Button type="link" icon={<FileTextOutlined />}>
                  {selectedRecord.attachment}
                </Button>
              </p>
            </Card>
          </div>
        )}
      </Modal>

      <Modal
        title="新增维修记录"
        open={addModalVisible}
        onCancel={handleAddCancel}
        footer={[
          <Button key="reset" onClick={handleAddReset}>
            重置
          </Button>,
          <Button key="cancel" onClick={handleAddCancel}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={handleAddSubmit}>
            提交
          </Button>
        ]}
        width={800}
      >
        <Form form={addForm} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="recordNo"
                label="维修编号"
              >
                <Input placeholder="请输入维修编号" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="deviceName"
                label="设备名称"
              >
                <Input placeholder="请输入设备名称" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="serialNo"
                label="序列号"
              >
                <Input placeholder="请输入序列号" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="faultReason"
                label="故障原因"
              >
                <Input placeholder="请输入故障原因" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="maintenancePlan"
                label="维修方案"
              >
                <Input placeholder="请输入维修方案" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="cost"
                label="产生费用"
              >
                <Input placeholder="请输入产生费用" type="number" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="maintenanceDate"
                label="维修日期"
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="上传附件">
            <Upload>
              <Button icon={<UploadOutlined />}>选择文件</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default InstrumentMaintenanceRecord;