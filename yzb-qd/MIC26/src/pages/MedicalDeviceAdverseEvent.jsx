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
  Descriptions,
  Upload,
  Steps,
  Timeline,
  Tabs,
  Divider,
  Radio,
  Checkbox,
  Rate
} from 'antd';
import { 
  SearchOutlined, 
  PlusOutlined, 
  EyeOutlined, 
  EditOutlined, 
  DeleteOutlined,
  DownloadOutlined,
  UploadOutlined,
  FileTextOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
  MedicineBoxOutlined,
  SafetyOutlined,
  FileAddOutlined
} from '@ant-design/icons';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;
const { Step } = Steps;
const { TabPane } = Tabs;

const MedicalDeviceAdverseEvent = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchParams, setSearchParams] = useState({});
  const [activeTab, setActiveTab] = useState('1');
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [addForm] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  // 模拟数据
  const adverseEvents = [
    {
      key: '1',
      eventName: '心脏起搏器故障',
      patientName: '张三',
      gender: '男',
      age: 45,
      barcode: 'BC202401001',
      involvedProject: '心内科手术',
      occurrenceDate: '2024-01-15',
      eventSummary: '心脏起搏器突然停止工作',
      investigationSituation: '设备科进行了初步调查',
      eventAnalysis: '电池异常放电导致',
      eventSummaryDetail: '已更换电池，设备恢复正常',
      handlingResult: '设备已修复',
      rectificationMeasures: '加强设备定期检查',
      attachment: '事件报告.pdf'
    },
    {
      key: '2',
      eventName: '呼吸机使用错误',
      patientName: '李四',
      gender: '女',
      age: 62,
      barcode: 'BC202401002',
      involvedProject: 'ICU治疗',
      occurrenceDate: '2024-01-12',
      eventSummary: '呼吸机参数设置错误',
      investigationSituation: '护理部进行了调查',
      eventAnalysis: '操作人员培训不足',
      eventSummaryDetail: '已重新培训操作人员',
      handlingResult: '已制定操作规范',
      rectificationMeasures: '加强操作培训',
      attachment: '调查报告.docx'
    },
    {
      key: '3',
      eventName: '输液泵不良反应',
      patientName: '王五',
      gender: '男',
      age: 38,
      barcode: 'BC202401003',
      involvedProject: '外科手术',
      occurrenceDate: '2024-01-10',
      eventSummary: '患者对输液泵材料过敏',
      investigationSituation: '过敏反应科进行了调查',
      eventAnalysis: '材料材质问题',
      eventSummaryDetail: '更换了输液泵型号',
      handlingResult: '患者症状缓解',
      rectificationMeasures: '更换所有同型号输液泵',
      attachment: '医疗记录.pdf'
    },
    {
      key: '4',
      eventName: '监护仪设备损坏',
      patientName: '赵六',
      gender: '女',
      age: 55,
      barcode: 'BC202401004',
      involvedProject: '急诊治疗',
      occurrenceDate: '2024-01-08',
      eventSummary: '监护仪显示屏损坏',
      investigationSituation: '设备科进行了调查',
      eventAnalysis: '意外碰撞导致',
      eventSummaryDetail: '已更换显示屏',
      handlingResult: '设备已修复',
      rectificationMeasures: '加强设备保护措施',
      attachment: '设备检查报告.pdf'
    },
    {
      key: '5',
      eventName: '除颤仪性能异常',
      patientName: '孙七',
      gender: '男',
      age: 28,
      barcode: 'BC202401005',
      involvedProject: '手术室',
      occurrenceDate: '2024-01-05',
      eventSummary: '除颤仪放电异常',
      investigationSituation: '设备科进行了调查',
      eventAnalysis: '内部电路故障',
      eventSummaryDetail: '已维修电路',
      handlingResult: '设备已修复',
      rectificationMeasures: '加强定期维护',
      attachment: '性能测试报告.pdf'
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
      title: '事件名称', 
      dataIndex: 'eventName', 
      key: 'eventName', 
      width: 150,
      ellipsis: true
    },
    { 
      title: '患者姓名', 
      dataIndex: 'patientName', 
      key: 'patientName', 
      width: 100 
    },
    { 
      title: '性别', 
      dataIndex: 'gender', 
      key: 'gender', 
      width: 60 
    },
    { 
      title: '年龄', 
      dataIndex: 'age', 
      key: 'age', 
      width: 60 
    },
    { 
      title: '条码号', 
      dataIndex: 'barcode', 
      key: 'barcode', 
      width: 120 
    },
    { 
      title: '涉及项目', 
      dataIndex: 'involvedProject', 
      key: 'involvedProject', 
      width: 120,
      ellipsis: true
    },
    { 
      title: '发生日期', 
      dataIndex: 'occurrenceDate', 
      key: 'occurrenceDate', 
      width: 120,
      sorter: (a, b) => new Date(a.occurrenceDate) - new Date(b.occurrenceDate)
    },
    { 
      title: '事件概述', 
      dataIndex: 'eventSummary', 
      key: 'eventSummary', 
      width: 150,
      ellipsis: true
    },
    { 
      title: '调查情况', 
      dataIndex: 'investigationSituation', 
      key: 'investigationSituation', 
      width: 150,
      ellipsis: true
    },
    { 
      title: '事件分析', 
      dataIndex: 'eventAnalysis', 
      key: 'eventAnalysis', 
      width: 150,
      ellipsis: true
    },
    { 
      title: '事件总结', 
      dataIndex: 'eventSummaryDetail', 
      key: 'eventSummaryDetail', 
      width: 150,
      ellipsis: true
    },
    { 
      title: '处理结果', 
      dataIndex: 'handlingResult', 
      key: 'handlingResult', 
      width: 120,
      ellipsis: true
    },
    { 
      title: '整改措施', 
      dataIndex: 'rectificationMeasures', 
      key: 'rectificationMeasures', 
      width: 150,
      ellipsis: true
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
    }, 500);
  };

  const handleReset = () => {
    form.resetFields();
    setSearchParams({});
    message.success('已重置搜索条件');
  };

  const handleViewDetail = (record) => {
    setSelectedEvent(record);
    setVisible(true);
  };

  const handleEdit = (record) => {
    message.info(`编辑不良事件：${record.eventNo}`);
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除不良事件记录"${record.eventNo}"吗？`,
      onOk: () => {
        message.success(`已删除不良事件记录：${record.eventNo}`);
      }
    });
  };

  const handleAddNew = () => {
    setAddModalVisible(true);
  };

  const handleAddSubmit = () => {
    addForm.validateFields().then(values => {
      console.log('表单数据:', values);
      message.success('已新增不良事件记录');
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

  const handleExport = () => {
    if (selectedRowKeys.length === 0) {
      message.info('请选择要导出的记录');
      return;
    }
    const selectedEvents = adverseEvents.filter(event => selectedRowKeys.includes(event.key));
    console.log('导出选中的记录:', selectedEvents);
    message.success(`成功导出 ${selectedEvents.length} 条记录`);
  };

  const handleUpload = () => {
    message.info('上传附件功能');
  };

  // 处理步骤数据
  const processSteps = [
    {
      title: '事件上报',
      description: '2024-01-15 14:30',
      content: '发现心脏起搏器故障，立即上报',
      icon: <WarningOutlined />
    },
    {
      title: '初步调查',
      description: '2024-01-15 16:00',
 content     : '设备科进行初步调查，确认故障存在',
      icon: <SearchOutlined />
    },
    {
      title: '详细分析',
      description: '进行中',
      content: '分析故障原因，评估影响范围',
      icon: <MedicineBoxOutlined />
    },
    {
      title: '处理措施',
      description: '未开始',
      content: '制定并实施处理方案',
      icon: <EditOutlined />
    },
    {
      title: '事件关闭',
      description: '未开始',
      content: '问题解决后关闭记录',
      icon: <CheckCircleOutlined />
    }
  ];

  return (
    <div style={{ padding: '0 16px' }}>
      <h1 style={{ marginBottom: 24 }}>异常事件记录</h1>
      
      <Card style={{ marginBottom: 16 }}>
        <Form form={form} layout="inline">
          <Row gutter={[16, 16]} style={{ width: '100%' }}>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="eventName" label="事件名称">
                <Input placeholder="请输入事件名称" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="patientName" label="患者姓名">
                <Input placeholder="请输入患者姓名" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="involvedProject" label="涉及项目">
                <Input placeholder="请输入涉及项目" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="barcode" label="条码号">
                <Input placeholder="请输入条码号" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="dateRange" label="事件日期">
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
                    新增异常事件
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
          dataSource={adverseEvents} 
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
          scroll={{ x: 2000 }}
        />
      </div>

      <Modal
        title="异常事件记录详情"
        open={visible}
        onCancel={() => setVisible(false)}
        footer={[
          <Button key="close" onClick={() => setVisible(false)}>
            关闭
          </Button>
        ]}
        width={1200}
      >
        {selectedEvent && (
          <div>
            <Descriptions column={2} bordered style={{ marginBottom: 24 }}>
              <Descriptions.Item label="事件名称" span={2}>
                {selectedEvent.eventName}
              </Descriptions.Item>
              <Descriptions.Item label="患者姓名">
                {selectedEvent.patientName}
              </Descriptions.Item>
              <Descriptions.Item label="性别">
                {selectedEvent.gender}
              </Descriptions.Item>
              <Descriptions.Item label="年龄">
                {selectedEvent.age}
              </Descriptions.Item>
              <Descriptions.Item label="条码号">
                {selectedEvent.barcode}
              </Descriptions.Item>
              <Descriptions.Item label="涉及项目">
                {selectedEvent.involvedProject}
              </Descriptions.Item>
              <Descriptions.Item label="发生日期">
                {selectedEvent.occurrenceDate}
              </Descriptions.Item>
              <Descriptions.Item label="事件概述" span={2}>
                {selectedEvent.eventSummary}
              </Descriptions.Item>
              <Descriptions.Item label="调查情况" span={2}>
                {selectedEvent.investigationSituation}
              </Descriptions.Item>
              <Descriptions.Item label="事件分析" span={2}>
                {selectedEvent.eventAnalysis}
              </Descriptions.Item>
              <Descriptions.Item label="事件总结" span={2}>
                {selectedEvent.eventSummaryDetail}
              </Descriptions.Item>
              <Descriptions.Item label="处理结果" span={2}>
                {selectedEvent.handlingResult}
              </Descriptions.Item>
              <Descriptions.Item label="整改措施" span={2}>
                {selectedEvent.rectificationMeasures}
              </Descriptions.Item>
              <Descriptions.Item label="附件" span={2}>
                <Button type="link" icon={<FileTextOutlined />}>
                  {selectedEvent.attachment}
                </Button>
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>

      <Modal
        title="新增异常事件"
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
          <Form.Item
            name="patientName"
            label="患者姓名"
          >
            <Input placeholder="请输入患者姓名" />
          </Form.Item>

          <Form.Item
            name="gender"
            label="性别"
          >
            <Select placeholder="请选择性别">
              <Option value="男">男</Option>
              <Option value="女">女</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="age"
            label="年龄"
          >
            <Input type="number" placeholder="请输入年龄" />
          </Form.Item>

          <Form.Item
            name="barcode"
            label="条码号"
          >
            <Input placeholder="请输入条码号" />
          </Form.Item>

          <Form.Item
            name="involvedProject"
            label="涉及项目"
          >
            <Input placeholder="请输入涉及项目" />
          </Form.Item>

          <Form.Item
            name="eventName"
            label="事件名称"
          >
            <Input placeholder="请输入事件名称" />
          </Form.Item>

          <Form.Item
            name="occurrenceDate"
            label="发生日期"
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="eventSummary"
            label="事件概述"
          >
            <TextArea 
              placeholder="请输入事件概述" 
              rows={3}
            />
          </Form.Item>

          <Form.Item
            name="investigationSituation"
            label="调查情况"
          >
            <TextArea 
              placeholder="请输入调查情况" 
              rows={3}
            />
          </Form.Item>

          <Form.Item
            name="eventAnalysis"
            label="事件分析"
          >
            <TextArea 
              placeholder="请输入事件分析" 
              rows={3}
            />
          </Form.Item>

          <Form.Item
            name="eventSummaryDetail"
            label="事件总结"
          >
            <TextArea 
              placeholder="请输入事件总结" 
              rows={3}
            />
          </Form.Item>

          <Form.Item
            name="handlingResult"
            label="处理结果"
          >
            <TextArea 
              placeholder="请输入处理结果" 
              rows={3}
            />
          </Form.Item>

          <Form.Item
            name="rectificationMeasures"
            label="整改措施"
          >
            <TextArea 
              placeholder="请输入整改措施" 
              rows={3}
            />
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

export default MedicalDeviceAdverseEvent;