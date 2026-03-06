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
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  // 模拟数据
  const qualityIssues = [
    {
      key: '1',
      productCode: 'MAT001',
      productName: '一次性注射器',
      specification: '5ml',
      model: 'SYR-001',
      batchNo: '20240115A',
      supplierName: '医疗设备有限公司',
      manufacturer: '医疗器械厂',
      occurrenceDate: '2024-01-20',
      issueDescription: '注射器存在漏液现象',
      attachment: '质量问题报告.pdf'
    },
    {
      key: '2',
      productCode: 'MAT002',
      productName: '医用口罩',
      specification: 'N95',
      model: 'MASK-001',
      batchNo: '20240110B',
      supplierName: '医疗器械厂',
      manufacturer: '防护用品公司',
      occurrenceDate: '2024-01-18',
      issueDescription: '包装破损',
      attachment: '包装检查报告.pdf'
    },
    {
      key: '3',
      productCode: 'MAT003',
      productName: '检测试剂盒',
      specification: '新冠检测',
      model: 'TEST-001',
      batchNo: '20240105C',
      supplierName: '生物科技公司',
      manufacturer: '诊断试剂公司',
      occurrenceDate: '2024-01-15',
      issueDescription: '检测结果不准确',
      attachment: '性能测试报告.pdf'
    },
    {
      key: '4',
      productCode: 'MAT004',
      productName: '输液器',
      specification: '标准型',
      model: 'INF-001',
      batchNo: '20240112D',
      supplierName: '制药有限公司',
      manufacturer: '医疗设备厂',
      occurrenceDate: '2024-01-10',
      issueDescription: '标识不清',
      attachment: '标识检查表.xlsx'
    },
    {
      key: '5',
      productCode: 'MAT005',
      productName: '手术衣',
      specification: '无菌型',
      model: 'GOWN-001',
      batchNo: '20240108E',
      supplierName: '医疗耗材公司',
      manufacturer: '卫生材料厂',
      occurrenceDate: '2024-01-05',
      issueDescription: '灭菌不彻底',
      attachment: '灭菌检测报告.pdf'
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
      title: '物资编码', 
      dataIndex: 'productCode', 
      key: 'productCode', 
      width: 120 
    },
    { 
      title: '物资名称', 
      dataIndex: 'productName', 
      key: 'productName', 
      width: 150 
    },
    { 
      title: '规格', 
      dataIndex: 'specification', 
      key: 'specification', 
      width: 100 
    },
    { 
      title: '型号', 
      dataIndex: 'model', 
      key: 'model', 
      width: 100 
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
      width: 150 
    },
    { 
      title: '生产厂商', 
      dataIndex: 'manufacturer', 
      key: 'manufacturer', 
      width: 150 
    },
    { 
      title: '发生日期', 
      dataIndex: 'occurrenceDate', 
      key: 'occurrenceDate', 
      width: 120,
      sorter: (a, b) => new Date(a.occurrenceDate) - new Date(b.occurrenceDate)
    },
    { 
      title: '问题描述', 
      dataIndex: 'issueDescription', 
      key: 'issueDescription', 
      width: 200 
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
    if (selectedRowKeys.length === 0) {
      message.info('请选择要导出的记录');
      return;
    }
    const selectedRecords = qualityIssues.filter(record => selectedRowKeys.includes(record.key));
    console.log('导出选中的记录:', selectedRecords);
    message.success(`成功导出 ${selectedRecords.length} 条记录`);
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
              <Form.Item name="productCode" label="物资编码">
                <Input placeholder="请输入物资编码" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="productName" label="物资名称">
                <Input placeholder="请输入物资名称" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="supplierName" label="供应商">
                <Input placeholder="请输入供应商" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="manufacturer" label="生产厂商">
                <Input placeholder="请输入生产厂商" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="dateRange" label="发生日期">
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
          rowSelection={{
            selectedRowKeys,
            onChange: (keys) => setSelectedRowKeys(keys),
          }}
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
              <Descriptions.Item label="物资编码" span={2}>
                {selectedIssue.productCode}
              </Descriptions.Item>
              <Descriptions.Item label="物资名称">
                {selectedIssue.productName}
              </Descriptions.Item>
              <Descriptions.Item label="规格">
                {selectedIssue.specification}
              </Descriptions.Item>
              <Descriptions.Item label="型号">
                {selectedIssue.model}
              </Descriptions.Item>
              <Descriptions.Item label="批号">
                {selectedIssue.batchNo}
              </Descriptions.Item>
              <Descriptions.Item label="供应商">
                {selectedIssue.supplierName}
              </Descriptions.Item>
              <Descriptions.Item label="生产厂商">
                {selectedIssue.manufacturer}
              </Descriptions.Item>
              <Descriptions.Item label="发生日期">
                {selectedIssue.occurrenceDate}
              </Descriptions.Item>
              <Descriptions.Item label="问题描述" span={2}>
                {selectedIssue.issueDescription}
              </Descriptions.Item>
              <Descriptions.Item label="附件" span={2}>
                <Button type="link" icon={<FileTextOutlined />}>
                  {selectedIssue.attachment}
                </Button>
              </Descriptions.Item>
            </Descriptions>


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
                name="productCode"
                label="物资编码"
              >
                <Input placeholder="请输入物资编码" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="productName"
                label="物资名称"
              >
                <Input placeholder="请输入物资名称" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="specification"
                label="规格"
              >
                <Input placeholder="请输入规格" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="model"
                label="型号"
              >
                <Input placeholder="请输入型号" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="batchNo"
                label="批号"
              >
                <Input placeholder="请输入批号" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="supplierName"
                label="供应商"
              >
                <Input placeholder="请输入供应商" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="manufacturer"
                label="生产厂商"
              >
                <Input placeholder="请输入生产厂商" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="occurrenceDate"
                label="发生日期"
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="issueDescription"
            label="问题描述"
          >
            <TextArea 
              placeholder="请输入问题描述" 
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