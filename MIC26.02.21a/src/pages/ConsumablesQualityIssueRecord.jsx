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
  Timeline
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
  ClockCircleOutlined
} from '@ant-design/icons';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;
const { Step } = Steps;

const ConsumablesQualityIssueRecord = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [searchParams, setSearchParams] = useState({});
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [addForm] = Form.useForm();

  // 模拟数据
  const qualityIssues = [
    {
      key: '1',
      issueNo: 'QI202401001',
      productName: '一次性注射器',
      specification: '5ml',
      batchNo: '20240115A',
      supplierName: '医疗设备有限公司',
      issueType: '质量问题',
      severity: '严重',
      discoveryDate: '2024-01-20',
      discoverer: '张三',
      status: '处理中',
      currentStep: 2,
      attachment: '质量问题报告.pdf'
    },
    {
      key: '2',
      issueNo: 'QI202401002',
      productName: '医用口罩',
      specification: 'N95',
      batchNo: '20240110B',
      supplierName: '医疗器械厂',
      issueType: '包装问题',
      severity: '一般',
      discoveryDate: '2024-01-18',
      discoverer: '李四',
      status: '已解决',
      currentStep: 4,
      attachment: '包装检查报告.pdf'
    },
    {
      key: '3',
      issueNo: 'QI202401003',
      productName: '检测试剂盒',
      specification: '新冠检测',
      batchNo: '20240105C',
      supplierName: '生物科技公司',
      issueType: '性能问题',
      severity: '严重',
      discoveryDate: '2024-01-15',
      discoverer: '王五',
      status: '待处理',
      currentStep: 1,
      attachment: '性能测试报告.pdf'
    },
    {
      key: '4',
      issueNo: 'QI202401004',
      productName: '输液器',
      specification: '标准型',
      batchNo: '20240112D',
      supplierName: '制药有限公司',
      issueType: '标识问题',
      severity: '轻微',
      discoveryDate: '2024-01-10',
      discoverer: '赵六',
      status: '已关闭',
      currentStep: 5,
      attachment: '标识检查表.xlsx'
    },
    {
      key: '5',
      issueNo: 'QI202401005',
      productName: '手术衣',
      specification: '无菌型',
      batchNo: '20240108E',
      supplierName: '医疗耗材公司',
      issueType: '灭菌问题',
      severity: '严重',
      discoveryDate: '2024-01-05',
      discoverer: '孙七',
      status: '处理中',
      currentStep: 3,
      attachment: '灭菌检测报告.pdf'
    }
  ];

  const columns = [
    { 
      title: '问题单号', 
      dataIndex: 'issueNo', 
      key: 'issueNo', 
      width: 140,
      fixed: 'left'
    },
    { 
      title: '产品名称', 
      dataIndex: 'productName', 
      key: 'productName', 
      width: 150 
    },
    { 
      title: '规格型号', 
      dataIndex: 'specification', 
      key: 'specification', 
      width: 120 
    },
    { 
      title: '批号', 
      dataIndex: 'batchNo', 
      key: 'batchNo', 
      width: 120 
    },
    { 
      title: '供应商', 
      dataIndex: 'supplierName', 
      key: 'supplierName', 
      width: 180 
    },
    { 
      title: '问题类型', 
      dataIndex: 'issueType', 
      key: 'issueType', 
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
      title: '发现日期', 
      dataIndex: 'discoveryDate', 
      key: 'discoveryDate', 
      width: 120,
      sorter: (a, b) => new Date(a.discoveryDate) - new Date(b.discoveryDate)
    },
    { 
      title: '发现人', 
      dataIndex: 'discoverer', 
      key: 'discoverer', 
      width: 100 
    },
    {
      title: '状态', 
      dataIndex: 'status', 
      key: 'status', 
      width: 100,
      render: (status) => {
        let color = 'default';
        if (status === '已解决') color = 'success';
        if (status === '处理中') color = 'processing';
        if (status === '待处理') color = 'warning';
        if (status === '已关闭') color = 'default';
        return <Tag color={color}>{status}</Tag>;
      }
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
    setSelectedIssue(record);
    setVisible(true);
  };

  const handleEdit = (record) => {
    message.info(`编辑质量问题：${record.issueNo}`);
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除质量问题记录"${record.issueNo}"吗？`,
      onOk: () => {
        message.success(`已删除质量问题记录：${record.issueNo}`);
      }
    });
  };

  const handleAddNew = () => {
    setAddModalVisible(true);
  };

  const handleAddSubmit = () => {
    addForm.validateFields().then(values => {
      console.log('表单数据:', values);
      message.success('已新增质量问题记录');
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
      title: '问题上报',
      description: '2024-01-20 10:30',
      content: '发现注射器存在质量问题，立即上报',
      icon: <WarningOutlined />
    },
    {
      title: '初步调查',
      description: '2024-01-20 14:00',
      content: '质量部门进行初步调查，确认问题存在',
      icon: <SearchOutlined />
    },
    {
      title: '处理措施',
      description: '2024-01-21 09:00',
      content: '通知供应商，要求提供解决方案',
      icon: <EditOutlined />
    },
    {
      title: '效果验证',
      description: '进行中',
      content: '等待供应商提供解决方案并进行验证',
      icon: <ClockCircleOutlined />
    },
    {
      title: '问题关闭',
      description: '未开始',
      content: '问题解决后关闭记录',
      icon: <CheckCircleOutlined />
    }
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  return (
    <div style={{ padding: '0 16px' }}>
      <h1 style={{ marginBottom: 24 }}>耗材质量问题记录</h1>
      
      <Card style={{ marginBottom: 16 }}>
        <Form form={form} layout="inline">
          <Row gutter={[16, 16]} style={{ width: '100%' }}>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="issueNo" label="问题单号">
                <Input placeholder="请输入问题单号" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="productName" label="产品名称">
                <Input placeholder="请输入产品名称" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="batchNo" label="批号">
                <Input placeholder="请输入批号" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="supplierName" label="供应商">
                <Input placeholder="请输入供应商名称" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="issueType" label="问题类型">
                <Select placeholder="请选择问题类型" allowClear>
                  <Option value="质量问题">质量问题</Option>
                  <Option value="包装问题">包装问题</Option>
                  <Option value="性能问题">性能问题</Option>
                  <Option value="标识问题">标识问题</Option>
                  <Option value="灭菌问题">灭菌问题</Option>
                  <Option value="其他问题">其他问题</Option>
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
                  <Option value="待处理">待处理</Option>
                  <Option value="处理中">处理中</Option>
                  <Option value="已解决">已解决</Option>
                  <Option value="已关闭">已关闭</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="dateRange" label="发现日期">
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
                    新增质量问题
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
          dataSource={qualityIssues} 
          loading={loading}
          pagination={{ 
            pageSize: pageSize,
            current: currentPage,
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
              marginTop: '16px'
            }
          }} 
          size="small"
          scroll={{ x: 1800 }}
        />
      </div>

      <Modal
        title="质量问题详情"
        open={visible}
        onCancel={() => setVisible(false)}
        footer={[
          <Button key="close" onClick={() => setVisible(false)}>
            关闭
          </Button>
        ]}
        width={1000}
      >
        {selectedIssue && (
          <div>
            <Descriptions column={2} bordered style={{ marginBottom: 24 }}>
              <Descriptions.Item label="问题单号" span={2}>
                {selectedIssue.issueNo}
              </Descriptions.Item>
              <Descriptions.Item label="产品名称">
                {selectedIssue.productName}
              </Descriptions.Item>
              <Descriptions.Item label="规格型号">
                {selectedIssue.specification}
              </Descriptions.Item>
              <Descriptions.Item label="批号">
                {selectedIssue.batchNo}
              </Descriptions.Item>
              <Descriptions.Item label="供应商">
                {selectedIssue.supplierName}
              </Descriptions.Item>
              <Descriptions.Item label="问题类型">
                {selectedIssue.issueType}
              </Descriptions.Item>
              <Descriptions.Item label="严重程度">
                <Tag color={
                  selectedIssue.severity === '严重' ? 'error' :
                  selectedIssue.severity === '一般' ? 'warning' : 'success'
                }>
                  {selectedIssue.severity}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="发现日期">
                {selectedIssue.discoveryDate}
              </Descriptions.Item>
              <Descriptions.Item label="发现人">
                {selectedIssue.discoverer}
              </Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color={
                  selectedIssue.status === '已解决' ? 'success' :
                  selectedIssue.status === '处理中' ? 'processing' :
                  selectedIssue.status === '待处理' ? 'warning' : 'default'
                }>
                  {selectedIssue.status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="附件" span={2}>
                <Button type="link" icon={<FileTextOutlined />}>
                  {selectedIssue.attachment}
                </Button>
              </Descriptions.Item>
            </Descriptions>

            <div style={{ marginBottom: 24 }}>
              <h3>问题描述</h3>
              <TextArea 
                placeholder="请输入问题详细描述" 
                rows={4}
                defaultValue="在使用过程中发现注射器存在漏液现象，经检查发现部分注射器针筒与活塞配合不紧密，存在质量问题。"
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <h3>处理进度</h3>
              <Steps current={selectedIssue.currentStep - 1}>
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

            <div>
              <h3>处理记录</h3>
              <Timeline>
                <Timeline.Item color="green">
                  <p><strong>2024-01-20 10:30</strong> - 问题上报</p>
                  <p>发现注射器存在质量问题，立即上报</p>
                </Timeline.Item>
                <Timeline.Item color="blue">
                  <p><strong>2024-01-20 14:00</strong> - 初步调查</p>
                  <p>质量部门进行初步调查，确认问题存在</p>
                </Timeline.Item>
                <Timeline.Item color="blue">
                  <p><strong>2024-01-21 09:00</strong> - 处理措施</p>
                  <p>通知供应商，要求提供解决方案</p>
                </Timeline.Item>
                <Timeline.Item color="orange">
                  <p><strong>2024-01-22 进行中</strong> - 效果验证</p>
                  <p>等待供应商提供解决方案并进行验证</p>
                </Timeline.Item>
                <Timeline.Item color="gray">
                  <p><strong>未开始</strong> - 问题关闭</p>
                  <p>问题解决后关闭记录</p>
                </Timeline.Item>
              </Timeline>
            </div>

            <div style={{ marginTop: 24 }}>
              <h3>处理意见</h3>
              <TextArea 
                placeholder="请输入处理意见" 
                rows={4}
                defaultValue="1. 立即停止使用该批次产品\n2. 通知供应商进行召回\n3. 要求供应商提供质量改进报告\n4. 加强入库检验标准"
              />
            </div>
          </div>
        )}
      </Modal>

      <Modal
        title="新增耗材质量问题"
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
                name="issueNo"
                label="问题单号"
                rules={[{ required: true, message: '请输入问题单号' }]}
              >
                <Input placeholder="请输入问题单号" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="productName"
                label="产品名称"
                rules={[{ required: true, message: '请输入产品名称' }]}
              >
                <Input placeholder="请输入产品名称" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="specification"
                label="规格型号"
                rules={[{ required: true, message: '请输入规格型号' }]}
              >
                <Input placeholder="请输入规格型号" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="batchNo"
                label="批号"
                rules={[{ required: true, message: '请输入批号' }]}
              >
                <Input placeholder="请输入批号" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="supplierName"
                label="供应商"
                rules={[{ required: true, message: '请输入供应商' }]}
              >
                <Input placeholder="请输入供应商" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="issueType"
                label="问题类型"
                rules={[{ required: true, message: '请选择问题类型' }]}
              >
                <Select placeholder="请选择问题类型">
                  <Option value="质量问题">质量问题</Option>
                  <Option value="包装问题">包装问题</Option>
                  <Option value="性能问题">性能问题</Option>
                  <Option value="标识问题">标识问题</Option>
                  <Option value="灭菌问题">灭菌问题</Option>
                  <Option value="其他">其他</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
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
            <Col span={12}>
              <Form.Item
                name="discoveryDate"
                label="发现日期"
                rules={[{ required: true, message: '请选择发现日期' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="discoverer"
                label="发现人"
                rules={[{ required: true, message: '请输入发现人' }]}
              >
                <Input placeholder="请输入发现人" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="状态"
                rules={[{ required: true, message: '请选择状态' }]}
              >
                <Select placeholder="请选择状态">
                  <Option value="待处理">待处理</Option>
                  <Option value="处理中">处理中</Option>
                  <Option value="已解决">已解决</Option>
                  <Option value="已关闭">已关闭</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="issueDescription"
            label="问题描述"
            rules={[{ required: true, message: '请输入问题描述' }]}
          >
            <TextArea 
              placeholder="请输入问题详细描述" 
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

export default ConsumablesQualityIssueRecord;