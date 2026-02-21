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

  // 模拟数据
  const adverseEvents = [
    {
      key: '1',
      eventNo: 'AE202401001',
      patientName: '张三',
      patientAge: 45,
      patientGender: '男',
      deviceName: '心脏起搏器',
      deviceModel: 'PM-2023',
      deviceSerialNo: 'SN2023123456',
      eventDate: '2024-01-15',
      eventType: '设备故障',
      severity: '严重',
      reporter: '李医生',
      department: '心内科',
      status: '调查中',
      currentStep: 2,
      attachment: '事件报告.pdf'
    },
    {
      key: '2',
      eventNo: 'AE202401002',
      patientName: '李四',
      patientAge: 62,
      patientGender: '女',
      deviceName: '呼吸机',
      deviceModel: 'Vent-2022',
      deviceSerialNo: 'SN2023112345',
      eventDate: '2024-01-12',
      eventType: '使用错误',
      severity: '一般',
      reporter: '王护士',
      department: 'ICU',
      status: '已处理',
      currentStep: 4,
      attachment: '调查报告.docx'
    },
    {
      key: '3',
      eventNo: 'AE202401003',
      patientName: '王五',
      patientAge: 38,
      patientGender: '男',
      deviceName: '输液泵',
      deviceModel: 'Infusion-2023',
      deviceSerialNo: 'SN2023109876',
      eventDate: '2024-01-10',
      eventType: '不良反应',
      severity: '轻微',
      reporter: '赵医生',
      department: '外科',
      status: '待调查',
      currentStep: 1,
      attachment: '医疗记录.pdf'
    },
    {
      key: '4',
      eventNo: 'AE202401004',
      patientName: '赵六',
      patientAge: 55,
      patientGender: '女',
      deviceName: '监护仪',
      deviceModel: 'Monitor-2023',
      deviceSerialNo: 'SN2023098765',
      eventDate: '2024-01-08',
      eventType: '设备损坏',
      severity: '严重',
      reporter: '孙护士',
      department: '急诊科',
      status: '已上报',
      currentStep: 3,
      attachment: '设备检查报告.pdf'
    },
    {
      key: '5',
      eventNo: 'AE202401005',
      patientName: '孙七',
      patientAge: 28,
      patientGender: '男',
      deviceName: '除颤仪',
      deviceModel: 'Defib-2022',
      deviceSerialNo: 'SN2023087654',
      eventDate: '2024-01-05',
      eventType: '性能异常',
      severity: '一般',
      reporter: '周医生',
      department: '手术室',
      status: '已关闭',
      currentStep: 5,
      attachment: '性能测试报告.pdf'
    }
  ];

  const columns = [
    { 
      title: '事件编号', 
      dataIndex: 'eventNo', 
      key: 'eventNo', 
      width: 140,
      fixed: 'left'
    },
    { 
      title: '患者姓名', 
      dataIndex: 'patientName', 
      key: 'patientName', 
      width: 100 
    },
    { 
      title: '年龄/性别', 
      key: 'patientInfo',
      width: 100,
      render: (_, record) => `${record.patientAge}岁/${record.patientGender}`
    },
    { 
      title: '设备名称', 
      dataIndex: 'deviceName', 
      key: 'deviceName', 
      width: 150 
    },
    { 
      title: '设备型号', 
      dataIndex: 'deviceModel', 
      key: 'deviceModel', 
      width: 120 
    },
    { 
      title: '序列号', 
      dataIndex: 'deviceSerialNo', 
      key: 'deviceSerialNo', 
      width: 140 
    },
    { 
      title: '事件日期', 
      dataIndex: 'eventDate', 
      key: 'eventDate', 
      width: 120,
      sorter: (a, b) => new Date(a.eventDate) - new Date(b.eventDate)
    },
    { 
      title: '事件类型', 
      dataIndex: 'eventType', 
      key: 'eventType', 
      width: 120 
    },
    { 
      title: '严重程度', 
      dataIndex: 'severity', 
      key: 'severity', 
      width: 100,
      render: (severity) => {
        let color = 'default';
        if (severity === '严重') color = 'error';
        if (severity === '一般') color = 'warning';
        if (severity === '轻微') color = 'success';
        return <Tag color={color}>{severity}</Tag>;
      }
    },
    { 
      title: '上报人', 
      dataIndex: 'reporter', 
      key: 'reporter', 
      width: 100 
    },
    { 
      title: '科室', 
      dataIndex: 'department', 
      key: 'department', 
      width: 100 
    },
    { 
      title: '状态', 
      dataIndex: 'status', 
      key: 'status', 
      width: 100,
      render: (status) => {
        let color = 'default';
        if (status === '已处理') color = 'success';
        if (status === '调查中') color = 'processing';
        if (status === '待调查') color = 'warning';
        if (status === '已上报') color = 'blue';
        if (status === '已关闭') color = 'default';
        return <Tag color={color}>{status}</Tag>;
      }
    },
    { 
      title: '处理进度', 
      key: 'progress',
      width: 150,
      render: (_, record) => (
        <Steps size="small" current={record.currentStep - 1}>
          <Step title="上报" />
          <Step title="调查" />
          <Step title="分析" />
          <Step title="处理" />
          <Step title="关闭" />
        </Steps>
      )
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
    message.success('导出成功');
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
              <Form.Item name="eventNo" label="事件编号">
                <Input placeholder="请输入事件编号" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="patientName" label="患者姓名">
                <Input placeholder="请输入患者姓名" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="deviceName" label="设备名称">
                <Input placeholder="请输入设备名称" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="deviceSerialNo" label="设备序列号">
                <Input placeholder="请输入设备序列号" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="eventType" label="事件类型">
                <Select placeholder="请选择事件类型" allowClear>
                  <Option value="设备故障">设备故障</Option>
                  <Option value="使用错误">使用错误</Option>
                  <Option value="不良反应">不良反应</Option>
                  <Option value="设备损坏">设备损坏</Option>
                  <Option value="性能异常">性能异常</Option>
                  <Option value="其他">其他</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="severity" label="严重程度">
                <Select placeholder="请选择严重程度" allowClear>
                  <Option value="严重">严重</Option>
                  <Option value="一般">一般</Option>
                  <Option value="轻微">轻微</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="status" label="状态">
                <Select placeholder="请选择状态" allowClear>
                  <Option value="待调查">待调查</Option>
                  <Option value="调查中">调查中</Option>
                  <Option value="已上报">已上报</Option>
                  <Option value="已处理">已处理</Option>
                  <Option value="已关闭">已关闭</Option>
                </Select>
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
            <Tabs activeKey={activeTab} onChange={setActiveTab}>
              <TabPane tab="基本信息" key="1">
                <Descriptions column={2} bordered style={{ marginBottom: 24 }}>
                  <Descriptions.Item label="事件编号" span={2}>
                    {selectedEvent.eventNo}
                  </Descriptions.Item>
                  <Descriptions.Item label="患者姓名">
                    {selectedEvent.patientName}
                  </Descriptions.Item>
                  <Descriptions.Item label="年龄/性别">
                    {selectedEvent.patientAge}岁/{selectedEvent.patientGender}
                  </Descriptions.Item>
                  <Descriptions.Item label="设备名称">
                    {selectedEvent.deviceName}
                  </Descriptions.Item>
                  <Descriptions.Item label="设备型号">
                    {selectedEvent.deviceModel}
                  </Descriptions.Item>
                  <Descriptions.Item label="设备序列号">
                    {selectedEvent.deviceSerialNo}
                  </Descriptions.Item>
                  <Descriptions.Item label="事件日期">
                    {selectedEvent.eventDate}
                  </Descriptions.Item>
                  <Descriptions.Item label="事件类型">
                    {selectedEvent.eventType}
                  </Descriptions.Item>
                  <Descriptions.Item label="严重程度">
                    <Tag color={
                      selectedEvent.severity === '严重' ? 'error' :
                      selectedEvent.severity === '一般' ? 'warning' : 'success'
                    }>
                      {selectedEvent.severity}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="上报人">
                    {selectedEvent.reporter}
                  </Descriptions.Item>
                  <Descriptions.Item label="科室">
                    {selectedEvent.department}
                  </Descriptions.Item>
                  <Descriptions.Item label="状态">
                    <Tag color={
                      selectedEvent.status === '已处理' ? 'success' :
                      selectedEvent.status === '调查中' ? 'processing' :
                      selectedEvent.status === '待调查' ? 'warning' :
                      selectedEvent.status === '已上报' ? 'blue' : 'default'
                    }>
                      {selectedEvent.status}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="附件" span={2}>
                    <Button type="link" icon={<FileTextOutlined />}>
                      {selectedEvent.attachment}
                    </Button>
                  </Descriptions.Item>
                </Descriptions>
              </TabPane>

              <TabPane tab="事件概述" key="2">
                <div style={{ padding: '16px 0' }}>
                  <h3>事件描述</h3>
                  <TextArea 
                    placeholder="请输入事件详细描述" 
                    rows={6}
                    defaultValue="患者在使用心脏起搏器过程中，设备突然停止工作，导致患者出现心悸、头晕等症状。经检查发现设备电池异常放电，需要立即更换设备。"
                  />
                  
                  <Divider />
                  
                  <h3>事件发生时间线</h3>
                  <Timeline>
                    <Timeline.Item color="red">
                      <p><strong>2024-01-15 14:00</strong> - 事件发生</p>
                      <p>患者在使用心脏起搏器时，设备突然停止工作</p>
                    </Timeline.Item>
                    <Timeline.Item color="blue">
                      <p><strong>2024-01-15 14:15</strong> - 初步处理</p>
                      <p>医护人员立即进行紧急处理，更换备用设备</p>
                    </Timeline.Item>
                    <Timeline.Item color="blue">
                      <p><strong>2024-01-15 14:30</strong> - 事件上报</p>
                      <p>医生填写不良事件报告，上报设备科</p>
                    </Timeline.Item>
                    <Timeline.Item color="orange">
                      <p><strong>2024-01-15 16:00</strong> - 初步调查</p>
                      <p>设备科技术人员进行现场检查</p>
                    </Timeline.Item>
                  </Timeline>
                </div>
              </TabPane>

              <TabPane tab="调查情况" key="3">
                <div style={{ padding: '16px 0' }}>
                  <h3>调查人员</h3>
                  <Row gutter={16} style={{ marginBottom: 16 }}>
                    <Col span={8}>
                      <Input placeholder="调查负责人" defaultValue="张工程师" />
                    </Col>
                    <Col span={8}>
                      <Input placeholder="参与人员" defaultValue="李技术员、王医生" />
                    </Col>
                    <Col span={8}>
                      <DatePicker placeholder="调查开始日期" style={{ width: '100%' }} />
                    </Col>
                  </Row>
                  
                  <h3>调查方法</h3>
                  <Checkbox.Group style={{ width: '100%', marginBottom: 16 }}>
                    <Row>
                      <Col span={8}>
                        <Checkbox value="现场检查">现场检查</Checkbox>
                      </Col>
                      <Col span={8}>
                        <Checkbox value="设备测试">设备测试</Checkbox>
                      </Col>
                      <Col span={8}>
                        <Checkbox value="数据分析">数据分析</Checkbox>
                      </Col>
                      <Col span={8}>
                        <Checkbox value="人员访谈">人员访谈</Checkbox>
                      </Col>
                      <Col span={8}>
                        <Checkbox value="文档审查">文档审查</Checkbox>
                      </Col>
                      <Col span={8}>
                        <Checkbox value="其他">其他</Checkbox>
                      </Col>
                    </Row>
                  </Checkbox.Group>
                  
                  <h3>调查发现</h3>
                  <TextArea 
                    placeholder="请输入调查发现" 
                    rows={6}
                    defaultValue="1. 设备电池电压异常，低于正常工作电压\n2. 设备使用记录显示，最近一次维护时间为3个月前\n3. 设备使用环境温度正常，无异常环境因素\n4. 操作人员具备相关资质，操作流程规范"
                  />
                  
                  <h3 style={{ marginTop: 16 }}>证据材料</h3>
                  <Upload>
                    <Button icon={<FileAddOutlined />}>上传调查证据</Button>
                  </Upload>
                </div>
              </TabPane>

              <TabPane tab="事件分析" key="4">
                <div style={{ padding: '16px 0' }}>
                  <h3>根本原因分析</h3>
                  <Radio.Group style={{ marginBottom: 16 }}>
                    <Radio value="设备设计缺陷">设备设计缺陷</Radio>
                    <Radio value="制造质量问题">制造质量问题</Radio>
                    <Radio value="维护保养不当">维护保养不当</Radio>
                    <Radio value="操作使用错误">操作使用错误</Radio>
                    <Radio value="环境因素">环境因素</Radio>
                    <Radio value="其他">其他</Radio>
                  </Radio.Group>
                  
                  <TextArea 
                    placeholder="请输入详细分析" 
                    rows={4}
                    defaultValue="经分析，本次事件的根本原因为设备电池质量问题。电池在正常使用周期内出现异常放电，属于制造质量问题。"
                  />
                  
                  <Divider />
                  
                  <h3>影响评估</h3>
                  <Row gutter={16} style={{ marginBottom: 16 }}>
                    <Col span={8}>
                      <div>
                        <p>对患者影响：</p>
                        <Rate disabled defaultValue={4} />
                      </div>
                    </Col>
                    <Col span={8}>
                      <div>
                        <p>对医疗安全影响：</p>
                        <Rate disabled defaultValue={3} />
                      </div>
                    </Col>
                    <Col span={8}>
                      <div>
                        <p>对设备影响：</p>
                        <Rate disabled defaultValue={5} />
                      </div>
                    </Col>
                  </Row>
                  
                  <TextArea 
                    placeholder="请输入影响评估详情" 
                    rows={4}
                    defaultValue="本次事件对患者健康造成了一定影响，但及时发现和处理避免了严重后果。设备需要更换，对医院设备管理提出了警示。"
                  />
                </div>
              </TabPane>

              <TabPane tab="事件总结" key="5">
                <div style={{ padding: '16px 0' }}>
                  <h3>事件性质</h3>
                  <Select placeholder="请选择事件性质" style={{ width: '100%', marginBottom: 16 }} defaultValue="可预防">
                    <Option value="可预防">可预防</Option>
                    <Option value="不可避免">不可避免</Option>
                    <Option value="系统性问题">系统性问题</Option>
                    <Option value="偶然事件">偶然事件</Option>
                  </Select>
                  
                  <h3>经验教训</h3>
                  <TextArea 
                    placeholder="请输入经验教训" 
                    rows={6}
                    defaultValue="1. 加强设备日常维护检查，特别是电池状态监测\n2. 建立设备预警机制，及时发现潜在问题\n3. 加强操作人员培训，提高应急处理能力\n4. 完善设备质量管理体系，从源头控制质量风险"
                  />
                  
                  <Divider />
                  
                  <h3>改进建议</h3>
                  <TextArea 
                    placeholder="请输入改进建议" 
                    rows={6}
                    defaultValue="1. 建议供应商改进电池设计，提高可靠性\n2. 建立设备定期检测制度，每季度进行全面检查\n3. 增加备用设备数量，确保应急使用\n4. 完善不良事件报告和处理流程"
                  />
                </div>
              </TabPane>

              <TabPane tab="后续措施" key="6">
                <div style={{ padding: '16px 0' }}>
                  <h3>立即措施</h3>
                  <TextArea 
                    placeholder="请输入立即采取的措施" 
                    rows={4}
                    defaultValue="1. 立即停止使用该设备，进行隔离\n2. 为患者更换备用设备，确保治疗连续性\n3. 通知设备科进行紧急维修\n4. 上报医院管理部门"
                  />
                  
                  <Divider />
                  
                  <h3>长期措施</h3>
                  <TextArea 
                    placeholder="请输入长期改进措施" 
                    rows={4}
                    defaultValue="1. 修订设备维护保养规程\n2. 加强设备操作培训\n3. 建立设备质量追溯体系\n4. 完善供应商评估机制"
                  />
                  
                  <Divider />
                  
                  <h3>责任部门</h3>
                  <Row gutter={16} style={{ marginBottom: 16 }}>
                    <Col span={12}>
                      <Input placeholder="主要责任部门" defaultValue="设备科" />
                    </Col>
                    <Col span={12}>
                      <Input placeholder="配合部门" defaultValue="医务科、护理部" />
                    </Col>
                  </Row>
                  
                  <h3>完成时限</h3>
                  <Row gutter={16}>
                    <Col span={12}>
                      <DatePicker placeholder="措施开始时间" style={{ width: '100%' }} />
                    </Col>
                    <Col span={12}>
                      <DatePicker placeholder="预计完成时间" style={{ width: '100%' }} />
                    </Col>
                  </Row>
                </div>
              </TabPane>

              <TabPane tab="附件管理" key="7">
                <div style={{ padding: '16px 0' }}>
                  <h3>已上传附件</h3>
                  <Space direction="vertical" style={{ width: '100%', marginBottom: 16 }}>
                    <Button type="link" icon={<FileTextOutlined />}>事件报告.pdf</Button>
                    <Button type="link" icon={<FileTextOutlined />}>设备检查记录.xlsx</Button>
                    <Button type="link" icon={<FileTextOutlined />}>患者病历摘要.pdf</Button>
                    <Button type="link" icon={<FileTextOutlined />}>调查照片.zip</Button>
                  </Space>
                  
                  <Divider />
                  
                  <h3>上传新附件</h3>
                  <Upload>
                    <Button icon={<UploadOutlined />}>选择文件</Button>
                  </Upload>
                  
                  <div style={{ marginTop: 16 }}>
                    <h3>附件说明</h3>
                    <TextArea 
                      placeholder="请输入附件说明" 
                      rows={3}
                      defaultValue="包含事件相关所有文档、照片、测试报告等材料"
                    />
                  </div>
                </div>
              </TabPane>
            </Tabs>

            <Divider />
            
            <div style={{ marginTop: 24 }}>
              <h3>处理进度</h3>
              <Steps current={selectedEvent.currentStep - 1}>
                {processSteps.map((step, index) => (
                  <Step 
                    key={index}
                    title={step.title}
                    description={step.description}
                    icon={step.icon}
                  />
                ))}
              </Steps>
            </div>
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
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="eventNo"
                label="事件编号"
                rules={[{ required: true, message: '请输入事件编号' }]}
              >
                <Input placeholder="请输入事件编号" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="patientName"
                label="患者姓名"
                rules={[{ required: true, message: '请输入患者姓名' }]}
              >
                <Input placeholder="请输入患者姓名" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="deviceName"
                label="设备名称"
                rules={[{ required: true, message: '请输入设备名称' }]}
              >
                <Input placeholder="请输入设备名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="deviceSerialNo"
                label="设备序列号"
                rules={[{ required: true, message: '请输入设备序列号' }]}
              >
                <Input placeholder="请输入设备序列号" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="eventType"
                label="事件类型"
                rules={[{ required: true, message: '请选择事件类型' }]}
              >
                <Select placeholder="请选择事件类型">
                  <Option value="设备故障">设备故障</Option>
                  <Option value="使用错误">使用错误</Option>
                  <Option value="不良反应">不良反应</Option>
                  <Option value="设备损坏">设备损坏</Option>
                  <Option value="性能异常">性能异常</Option>
                  <Option value="其他">其他</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="severity"
                label="严重程度"
                rules={[{ required: true, message: '请选择严重程度' }]}
              >
                <Select placeholder="请选择严重程度">
                  <Option value="严重">严重</Option>
                  <Option value="一般">一般</Option>
                  <Option value="轻微">轻微</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="status"
                label="状态"
                rules={[{ required: true, message: '请选择状态' }]}
              >
                <Select placeholder="请选择状态">
                  <Option value="待调查">待调查</Option>
                  <Option value="调查中">调查中</Option>
                  <Option value="已上报">已上报</Option>
                  <Option value="已处理">已处理</Option>
                  <Option value="已关闭">已关闭</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="eventDate"
                label="事件日期"
                rules={[{ required: true, message: '请选择事件日期' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="eventDescription"
            label="事件描述"
            rules={[{ required: true, message: '请输入事件描述' }]}
          >
            <TextArea 
              placeholder="请输入事件详细描述" 
              rows={4}
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