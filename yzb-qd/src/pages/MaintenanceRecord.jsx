import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Space, 
  Input, 
  DatePicker, 
  Modal, 
  Form, 
  message, 
  Tag,
  Row,
  Col,
  Descriptions,
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
import api from '../utils/api.js';

const { RangePicker } = DatePicker;
const { TextArea } = Input;

const MaintenanceRecord = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [searchParams, setSearchParams] = useState({});
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [addForm] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [maintenanceRecords, setMaintenanceRecords] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  // 加载维修记录列表
  useEffect(() => {
    loadMaintenanceRecords();
  }, [currentPage, pageSize]);

  const loadMaintenanceRecords = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/selectRepairList', {
        pageNum: currentPage,
        pageSize: pageSize
      });
      if (response.code === 1 && response.data) {
        const records = response.data.list.map(record => ({
          key: record.id,
          id: record.id,
          deviceName: record.assetName || '未知设备',
          serialNo: record.serialNumber || '无',
          faultReason: record.repairReason,
          maintenancePlan: record.repairPlan,
          cost: record.repairCost,
          maintenanceDate: record.repairDate ? record.repairDate.substring(0, 10) : '',
          attachment: record.attachment || '无附件'
        }));
        setMaintenanceRecords(records);
        setTotal(response.data.total);
      }
    } catch (error) {
      message.error('加载维修记录失败');
    } finally {
      setLoading(false);
    }
  };

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
      width: 150 
    },
    { 
      title: '维修方案', 
      dataIndex: 'maintenancePlan', 
      key: 'maintenancePlan', 
      width: 150 
    },
    { 
      title: '产生费用', 
      dataIndex: 'cost', 
      key: 'cost', 
      width: 100,
      render: (cost) => `¥${cost || 0}`
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
      width: 150,
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
    }, 500);
  };

  const handleReset = () => {
    form.resetFields();
    setSearchParams({});
    message.success('已重置搜索条件');
  };

  const handleViewDetail = (record) => {
    setSelectedRecord(record);
    setVisible(true);
  };

  const handleEdit = (record) => {
    message.info(`编辑维修记录：${record.deviceName}`);
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除维修记录"${record.deviceName}"吗？`,
      onOk: () => {
        message.success(`已删除维修记录：${record.deviceName}`);
      }
    });
  };

  const handleAddNew = () => {
    setAddModalVisible(true);
  };

  const handleAddSubmit = async () => {
    try {
      setLoading(true);
      const values = await addForm.validateFields();
      
      const repairData = {
        repairReason: values.faultReason,
        repairPlan: values.maintenancePlan,
        repairCost: values.cost,
        repairDate: values.maintenanceDate
      };
      
      const response = await api.post('/yzb/addRepair', repairData);
      if (response.code === 1) {
        message.success('已新增维修记录');
        setAddModalVisible(false);
        addForm.resetFields();
        loadMaintenanceRecords();
      } else {
        message.error('新增维修记录失败');
      }
    } catch (error) {
      message.error('请检查输入信息！');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCancel = () => {
    setAddModalVisible(false);
    addForm.resetFields();
  };

  const handleAddReset = () => {
    addForm.resetFields();
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

  const handleUpload = () => {
    message.info('上传附件功能');
  };

  return (
    <div style={{ padding: '0 16px' }}>
      <h1 style={{ marginBottom: 24 }}>维修记录</h1>
      
      <Card style={{ marginBottom: 16 }}>
        <Form form={form} layout="inline">
          <Row gutter={[16, 16]} style={{ width: '100%' }}>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="deviceName" label="设备名称">
                <Input placeholder="请输入设备名称" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="serialNo" label="序列号">
                <Input placeholder="请输入序列号" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="maintenanceDate" label="维修日期">
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
            current: currentPage,
            pageSize: pageSize,
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            },
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
          scroll={{ x: 1200 }}
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
            <Descriptions column={2} bordered style={{ marginBottom: 24 }}>
              <Descriptions.Item label="设备名称" span={2}>
                {selectedRecord.deviceName}
              </Descriptions.Item>
              <Descriptions.Item label="序列号">
                {selectedRecord.serialNo}
              </Descriptions.Item>
              <Descriptions.Item label="故障原因">
                {selectedRecord.faultReason}
              </Descriptions.Item>
              <Descriptions.Item label="维修方案" span={2}>
                {selectedRecord.maintenancePlan}
              </Descriptions.Item>
              <Descriptions.Item label="产生费用">
                ¥{selectedRecord.cost || 0}
              </Descriptions.Item>
              <Descriptions.Item label="维修日期">
                {selectedRecord.maintenanceDate}
              </Descriptions.Item>
              <Descriptions.Item label="附件" span={2}>
                <Button type="link" icon={<FileTextOutlined />}>
                  {selectedRecord.attachment}
                </Button>
              </Descriptions.Item>
            </Descriptions>
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
          <Button key="submit" type="primary" onClick={handleAddSubmit} loading={loading}>
            提交
          </Button>
        ]}
        width={800}
      >
        <Form form={addForm} layout="vertical">
          <Form.Item
            name="deviceName"
            label="设备名称"
          >
            <Input placeholder="请输入设备名称" />
          </Form.Item>

          <Form.Item
            name="serialNo"
            label="序列号"
          >
            <Input placeholder="请输入序列号" />
          </Form.Item>

          <Form.Item
            name="faultReason"
            label="故障原因"
          >
            <TextArea 
              placeholder="请输入故障原因" 
              rows={3}
            />
          </Form.Item>

          <Form.Item
            name="maintenancePlan"
            label="维修方案"
          >
            <TextArea 
              placeholder="请输入维修方案" 
              rows={3}
            />
          </Form.Item>

          <Form.Item
            name="cost"
            label="产生费用"
          >
            <Input type="number" placeholder="请输入产生费用" />
          </Form.Item>

          <Form.Item
            name="maintenanceDate"
            label="维修日期"
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

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

export default MaintenanceRecord;