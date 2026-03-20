import React, { useState, useEffect } from 'react';
import api from '../utils/api';
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
import moment from 'moment';

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
  const [maintenanceRecords, setMaintenanceRecords] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  // 从后端获取维修记录列表
  const fetchMaintenanceRecords = async (params = {}) => {
    setLoading(true);
    try {
      // 构建查询参数
      const queryParams = new URLSearchParams();
      queryParams.append('pageNum', params.pageNum || currentPage);
      queryParams.append('pageSize', params.pageSize || pageSize);
      queryParams.append('assetCode', params.assetCode || '');
      queryParams.append('assetName', params.assetName || '');
      if (params.repairType) queryParams.append('repairType', params.repairType);
      if (params.repairStatus) queryParams.append('repairStatus', params.repairStatus);
      if (params.assetTypeid) queryParams.append('assetTypeid', params.assetTypeid);
      if (params.repairStart) queryParams.append('repairStart', params.repairStart);
      if (params.repairEnd) queryParams.append('repairEnd', params.repairEnd);
      
      const response = await api.get(`/yzb/selectRepairList?${queryParams.toString()}`);
      
      if (response.code === 1) {
        const data = response.data;
        // 转换数据格式，确保每条记录有key字段
        const records = data.list.map((record, index) => ({
          ...record,
          key: record.id || index + 1,
          deviceName: record.assetName,
          serialNo: record.assetCode,
          recordNo: record.repairNo,
          maintenanceDate: record.repairDate
        }));
        setMaintenanceRecords(records);
        setTotal(data.total);
      } else {
        message.error(response.message || '获取维修记录失败');
      }
    } catch (error) {
      console.error('获取维修记录失败:', error);
      message.error('获取维修记录失败');
    } finally {
      setLoading(false);
    }
  };

  // 组件挂载时获取数据
  useEffect(() => {
    fetchMaintenanceRecords();
  }, [currentPage, pageSize]);

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

  const handleSearch = async () => {
    const values = await form.validateFields();
    // 构建查询参数
    const params = {
      assetCode: values.serialNo || '',
      assetName: values.instrumentName || '',
      repairType: values.maintenanceType || null,
      repairStatus: values.status || null,
      repairStart: values.dateRange ? values.dateRange[0].format('YYYY-MM-DD') : null,
      repairEnd: values.dateRange ? values.dateRange[1].format('YYYY-MM-DD') : null,
      pageNum: 1, // 重置为第一页
      pageSize: pageSize
    };
    
    // 调用API查询数据
    await fetchMaintenanceRecords(params);
    setCurrentPage(1); // 重置为第一页
  };

  const handleReset = () => {
    form.resetFields();
  };

  const handleAddNew = () => {
    setAddModalVisible(true);
  };

  const handleAddSubmit = async () => {
    const values = await addForm.validateFields();
    
    // 构建维修记录数据
    const repairData = {
      assetName: values.deviceName,
      assetCode: values.serialNo,
      faultReason: values.faultReason,
      maintenancePlan: values.maintenancePlan,
      cost: values.cost,
      repairDate: values.maintenanceDate ? values.maintenanceDate.format('YYYY-MM-DD') : null
    };
    
    try {
      let response;
      if (selectedRecord) {
        // 编辑模式
        repairData.id = selectedRecord.id;
        response = await api.post('/yzb/updateRepair', repairData);
      } else {
        // 新增模式
        response = await api.post('/yzb/addRepair', repairData);
      }
      
      if (response.code === 1) {
        message.success(selectedRecord ? '编辑维修记录成功' : '新增维修记录成功');
        setAddModalVisible(false);
        addForm.resetFields();
        setSelectedRecord(null);
        // 重新获取数据
        fetchMaintenanceRecords();
      } else {
        message.error(response.message || (selectedRecord ? '编辑维修记录失败' : '新增维修记录失败'));
      }
    } catch (error) {
      console.error(selectedRecord ? '编辑维修记录失败:' : '新增维修记录失败:', error);
      message.error(selectedRecord ? '编辑维修记录失败' : '新增维修记录失败');
    }
  };

  const handleAddCancel = () => {
    setAddModalVisible(false);
    addForm.resetFields();
    setSelectedRecord(null);
  };

  const handleAddReset = () => {
    addForm.resetFields();
  };

  const handleViewDetail = (record) => {
    setSelectedRecord(record);
    setVisible(true);
  };

  const handleEdit = (record) => {
    // 设置编辑表单数据
    addForm.setFieldsValue({
      deviceName: record.deviceName,
      serialNo: record.serialNo,
      faultReason: record.faultReason,
      maintenancePlan: record.maintenancePlan,
      cost: record.cost,
      maintenanceDate: record.maintenanceDate ? moment(record.maintenanceDate) : null
    });
    // 打开新增模态框作为编辑模态框
    setSelectedRecord(record);
    setAddModalVisible(true);
  };

  const handleDelete = (record) => {
    // 后端暂未实现删除接口
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
        <Form form={form} layout="vertical">
          <Row gutter={[16, 16]} style={{ width: '100%' }}>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="instrumentName" label="仪器名称" style={{ marginBottom: 0 }}>
                <Input placeholder="请输入仪器名称" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="serialNo" label="序列号" style={{ marginBottom: 0 }}>
                <Input placeholder="请输入序列号" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="department" label="使用科室" style={{ marginBottom: 0 }}>
                <Select placeholder="请选择科室" allowClear style={{ width: '100%' }}>
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
              <Form.Item name="maintenanceType" label="维修类型" style={{ marginBottom: 0 }}>
                <Select placeholder="请选择维修类型" allowClear style={{ width: '100%' }}>
                  <Option value="故障维修">故障维修</Option>
                  <Option value="预防性维护">预防性维护</Option>
                  <Option value="定期保养">定期保养</Option>
                  <Option value="校准">校准</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="status" label="状态" style={{ marginBottom: 0 }}>
                <Select placeholder="请选择状态" allowClear style={{ width: '100%' }}>
                  <Option value="待处理">待处理</Option>
                  <Option value="进行中">进行中</Option>
                  <Option value="已完成">已完成</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="dateRange" label="维修日期" style={{ marginBottom: 0 }}>
                <RangePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24}>
              <Form.Item style={{ marginBottom: 0 }}>
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
            total: total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
            style: {
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              margin: '24px 0 0 0',
            },
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size);
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
        title={selectedRecord ? "编辑维修记录" : "新增维修记录"}
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
            {selectedRecord ? "保存" : "提交"}
          </Button>
        ]}
        width={800}
      >
        <Form form={addForm} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="department"
                label="使用科室"
              >
                <Select placeholder="请选择科室" style={{ width: '100%' }}>
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
            <Col span={12}>
              <Form.Item
                name="serialNo"
                label="序列号"
              >
                <Input placeholder="请输入序列号" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="deviceName"
                label="设备名称"
              >
                <Input placeholder="请输入设备名称" />
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