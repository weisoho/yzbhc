import React, { useState, useEffect } from 'react';
import { Form, Input, Select, DatePicker, Button, Card, Table, Row, Col, Space, message, Modal, Tag } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, DownloadOutlined } from '@ant-design/icons';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

const SampleQuantityManagement = () => {
  const [form] = Form.useForm();
  const [uploadForm] = Form.useForm();
  const [projectForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [projects, setProjects] = useState([]);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [projectModalVisible, setProjectModalVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

  // 模拟检验科数据
  const departments = [
    { value: 'clinical', label: '临床检验科' },
    { value: 'microbiology', label: '微生物检验科' },
    { value: 'biochemistry', label: '生化检验科' },
    { value: 'immunology', label: '免疫检验科' },
    { value: 'hematology', label: '血液检验科' },
    { value: 'pathology', label: '病理检验科' }
  ];

  // 模拟项目数据
  const mockProjects = [
    { key: '1', projectCode: 'PROJ001', projectName: '血常规', department: 'clinical', departmentName: '临床检验科', status: 'active', remark: '常规检测项目' },
    { key: '2', projectCode: 'PROJ002', projectName: '尿常规', department: 'clinical', departmentName: '临床检验科', status: 'active', remark: '常规检测项目' },
    { key: '3', projectCode: 'PROJ003', projectName: '肝功能', department: 'biochemistry', departmentName: '生化检验科', status: 'active', remark: '生化检测项目' },
    { key: '4', projectCode: 'PROJ004', projectName: '肾功能', department: 'biochemistry', departmentName: '生化检验科', status: 'active', remark: '生化检测项目' },
    { key: '5', projectCode: 'PROJ005', projectName: '细菌培养', department: 'microbiology', departmentName: '微生物检验科', status: 'active', remark: '微生物检测项目' },
  ];

  // 模拟样本量数据
  const mockData = [
    {
      key: '1',
      date: '2024-01-20',
      department: 'clinical',
      departmentName: '临床检验科',
      totalProjects: 150,
      testedProjects: 145,
      completionRate: 96.67,
      operator: '张三',
      remark: '常规检测日，工作量正常'
    },
    {
      key: '2',
      date: '2024-01-19',
      department: 'microbiology',
      departmentName: '微生物检验科',
      totalProjects: 80,
      testedProjects: 78,
      completionRate: 97.50,
      operator: '李四',
      remark: '有2个样本需要复查'
    },
    {
      key: '3',
      date: '2024-01-18',
      department: 'biochemistry',
      departmentName: '生化检验科',
      totalProjects: 120,
      testedProjects: 118,
      completionRate: 98.33,
      operator: '王五',
      remark: '设备运行正常'
    }
  ];

  // 组件加载时初始化数据
  useEffect(() => {
    setData(mockData);
    setProjects(mockProjects);
  }, []);

  // 样本量管理列配置
  const columns = [
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      width: 120
    },
    {
      title: '检验科',
      dataIndex: 'departmentName',
      key: 'departmentName',
      width: 150
    },
    {
      title: '开展项目数',
      dataIndex: 'totalProjects',
      key: 'totalProjects',
      width: 120
    },
    {
      title: '检测项目数',
      dataIndex: 'testedProjects',
      key: 'testedProjects',
      width: 120
    },
    {
      title: '完成率',
      dataIndex: 'completionRate',
      key: 'completionRate',
      width: 100,
      render: (rate) => (
        <Tag color={rate >= 95 ? 'green' : rate >= 90 ? 'blue' : 'orange'}>
          {rate}%
        </Tag>
      )
    },
    {
      title: '操作人',
      dataIndex: 'operator',
      key: 'operator',
      width: 100
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      ellipsis: true
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Button type="link" size="small" icon={<DeleteOutlined />} onClick={() => handleDelete(record)} style={{ color: '#ff4d4f' }}>
            删除
          </Button>
        </Space>
      )
    }
  ];

  // 项目管理列配置
  const projectColumns = [
    {
      title: '项目编码',
      dataIndex: 'projectCode',
      key: 'projectCode',
      width: 120
    },
    {
      title: '项目名称',
      dataIndex: 'projectName',
      key: 'projectName',
      width: 150
    },
    {
      title: '所属检验科',
      dataIndex: 'departmentName',
      key: 'departmentName',
      width: 150
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? '启用' : '停用'}
        </Tag>
      )
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      ellipsis: true
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleProjectEdit(record)}>
            编辑
          </Button>
          <Button type="link" size="small" icon={<DeleteOutlined />} onClick={() => handleProjectDelete(record)} style={{ color: '#ff4d4f' }}>
            删除
          </Button>
        </Space>
      )
    }
  ];

  // 处理上传
  const handleUpload = (values) => {
    setLoading(true);
    
    // 计算完成率
    const completionRate = values.testedProjects > 0 
      ? parseFloat(((values.testedProjects / values.totalProjects) * 100).toFixed(2)) 
      : 0;
    
    // 查找对应科室名称
    const departmentName = departments.find(dept => dept.value === values.department)?.label || values.department;
    
    // 构造新数据
    const newRecord = {
      key: Date.now().toString(),
      date: values.date ? values.date.toISOString().split('T')[0] : '',
      department: values.department,
      departmentName,
      totalProjects: values.totalProjects,
      testedProjects: values.testedProjects,
      completionRate,
      operator: values.operator,
      remark: values.remark || ''
    };
    
    // 检查是否已存在该日期和科室的记录
    const existingRecordIndex = data.findIndex(
      item => item.date === newRecord.date && item.department === newRecord.department
    );
    
    if (existingRecordIndex >= 0) {
      // 更新现有记录
      const updatedData = [...data];
      updatedData[existingRecordIndex] = newRecord;
      setData(updatedData);
      message.success('数据更新成功');
    } else {
      // 添加新记录
      setData([...data, newRecord]);
      message.success('数据上传成功');
    }
    
    setLoading(false);
    setUploadModalVisible(false);
    uploadForm.resetFields();
  };

  // 处理编辑
  const handleEdit = (record) => {
    setSelectedRow(record);
    uploadForm.setFieldsValue({
      date: record.date ? new Date(record.date) : null,
      department: record.department,
      totalProjects: record.totalProjects,
      testedProjects: record.testedProjects,
      operator: record.operator,
      remark: record.remark
    });
    setUploadModalVisible(true);
  };

  // 处理删除
  const handleDelete = (record) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除 ${record.date} ${record.departmentName} 的样本量记录吗？`,
      onOk: () => {
        setData(data.filter(item => item.key !== record.key));
        message.success('删除成功');
      }
    });
  };

  // 处理查询
  const handleSearch = (values) => {
    setLoading(true);
    setTimeout(() => {
      let filteredData = [...data];
      
      if (values.department) {
        filteredData = filteredData.filter(item => item.department === values.department);
      }
      
      if (values.dateRange) {
        const [startDate, endDate] = values.dateRange;
        filteredData = filteredData.filter(item => {
          const itemDate = new Date(item.date);
          return itemDate >= startDate && itemDate <= endDate;
        });
      }
      
      setData(filteredData);
      message.success('查询成功');
      setLoading(false);
    }, 500);
  };

  // 处理重置
  const handleReset = () => {
    form.resetFields();
    setData(mockData);
    message.success('已重置数据');
  };

  // 处理导出
  const handleExport = () => {
    message.success('导出功能开发中');
  };

  // 处理项目编辑
  const handleProjectEdit = (record) => {
    setSelectedProject(record);
    projectForm.setFieldsValue({
      projectCode: record.projectCode,
      projectName: record.projectName,
      department: record.department,
      status: record.status,
      remark: record.remark
    });
    setProjectModalVisible(true);
  };

  // 处理项目删除
  const handleProjectDelete = (record) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除项目 ${record.projectName} 吗？`,
      onOk: () => {
        setProjects(projects.filter(item => item.key !== record.key));
        message.success('项目删除成功');
      }
    });
  };

  // 处理项目保存
  const handleProjectSave = (values) => {
    setLoading(true);
    
    // 查找对应科室名称
    const departmentName = departments.find(dept => dept.value === values.department)?.label || values.department;
    
    // 构造项目数据
    const projectData = {
      ...values,
      departmentName,
      key: selectedProject ? selectedProject.key : Date.now().toString()
    };
    
    if (selectedProject) {
      // 更新现有项目
      const updatedProjects = projects.map(item => 
        item.key === selectedProject.key ? projectData : item
      );
      setProjects(updatedProjects);
      message.success('项目更新成功');
    } else {
      // 添加新项目
      setProjects([...projects, projectData]);
      message.success('项目添加成功');
    }
    
    setLoading(false);
    setProjectModalVisible(false);
    projectForm.resetFields();
    setSelectedProject(null);
  };

  // 标签页状态
  const [activeTab, setActiveTab] = useState('sample-quantity');

  return (
    <div style={{ padding: '0 16px' }}>
      <h1 style={{ marginBottom: 24 }}>样本量管理</h1>
      
      {/* 标签页切换 */}
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', borderBottom: '1px solid #f0f0f0', marginBottom: 16 }}>
          <Button 
            type={activeTab === 'sample-quantity' ? 'primary' : 'default'} 
            onClick={() => setActiveTab('sample-quantity')}
            style={{ marginRight: 8 }}
          >
            样本量管理
          </Button>
          <Button 
            type={activeTab === 'project-management' ? 'primary' : 'default'} 
            onClick={() => setActiveTab('project-management')}
          >
            项目管理
          </Button>
        </div>
        
        {/* 样本量管理标签页 */}
        {activeTab === 'sample-quantity' && (
          <>
            {/* 查询表单 */}
            <Card style={{ marginBottom: 16 }}>
              <Form form={form} layout="inline" onFinish={handleSearch}>
                <Row gutter={[16, 16]} style={{ width: '100%' }}>
                  <Col xs={24} sm={12} md={8} lg={6}>
                    <Form.Item name="department" label="检验科">
                      <Select placeholder="请选择检验科" allowClear>
                        {departments.map(dept => (
                          <Option key={dept.value} value={dept.value}>{dept.label}</Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={8} lg={8}>
                    <Form.Item name="dateRange" label="日期范围">
                      <RangePicker style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={8} lg={10} style={{ textAlign: 'right' }}>
                    <Space>
                      <Button type="primary" icon={<SearchOutlined />} htmlType="submit" loading={loading}>
                        查询
                      </Button>
                      <Button onClick={handleReset}>
                        重置
                      </Button>
                      <Button icon={<DownloadOutlined />} onClick={handleExport}>
                        导出
                      </Button>
                      <Button type="primary" icon={<PlusOutlined />} onClick={() => {
                        uploadForm.resetFields();
                        setSelectedRow(null);
                        setUploadModalVisible(true);
                      }}>
                        上传数据
                      </Button>
                    </Space>
                  </Col>
                </Row>
              </Form>
            </Card>
            
            {/* 数据表格 */}
            <Table
              columns={columns}
              dataSource={data}
              loading={loading}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `共 ${total} 条记录`,
                style: {
                  display: 'flex',
                  justifyContent: 'center',
                  marginTop: '16px'
                }
              }}
              scroll={{ x: 1000 }}
            />
          </>
        )}
        
        {/* 项目管理标签页 */}
        {activeTab === 'project-management' && (
          <>
            {/* 项目管理操作栏 */}
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => {
                projectForm.resetFields();
                setSelectedProject(null);
                setProjectModalVisible(true);
              }}>
                新增项目
              </Button>
            </div>
            
            {/* 项目管理表格 */}
            <Table
              columns={projectColumns}
              dataSource={projects}
              loading={loading}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `共 ${total} 条记录`
              }}
              scroll={{ x: 1000 }}
            />
          </>
        )}
      </Card>
      
      {/* 上传/编辑模态框 */}
      <Modal
        title={selectedRow ? "编辑样本量数据" : "上传样本量数据"}
        open={uploadModalVisible}
        onCancel={() => {
          setUploadModalVisible(false);
          uploadForm.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={uploadForm}
          layout="vertical"
          onFinish={handleUpload}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="date"
                label="日期"
                rules={[{ required: true, message: '请选择日期' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="department"
                label="检验科"
                rules={[{ required: true, message: '请选择检验科' }]}
              >
                <Select placeholder="请选择检验科">
                  {departments.map(dept => (
                    <Option key={dept.value} value={dept.value}>{dept.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="totalProjects"
                label="开展项目数"
                rules={[{ required: true, message: '请输入开展项目数' }, { type: 'number', min: 0, message: '开展项目数不能为负数' }]}
              >
                <Input type="number" placeholder="请输入开展项目数" min={0} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="testedProjects"
                label="检测项目数"
                rules={[{ required: true, message: '请输入检测项目数' }, { type: 'number', min: 0, message: '检测项目数不能为负数' }]}
              >
                <Input type="number" placeholder="请输入检测项目数" min={0} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="operator"
                label="操作人"
                rules={[{ required: true, message: '请输入操作人' }]}
              >
                <Input placeholder="请输入操作人" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="remark"
            label="备注"
          >
            <TextArea rows={4} placeholder="请输入备注信息" />
          </Form.Item>
          <Form.Item style={{ textAlign: 'right' }}>
            <Space>
              <Button onClick={() => {
                setUploadModalVisible(false);
                uploadForm.resetFields();
              }}>
                取消
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {selectedRow ? "保存修改" : "上传数据"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
      
      {/* 项目管理模态框 */}
      <Modal
        title={selectedProject ? "编辑项目" : "新增项目"}
        open={projectModalVisible}
        onCancel={() => {
          setProjectModalVisible(false);
          projectForm.resetFields();
          setSelectedProject(null);
        }}
        footer={null}
        width={600}
      >
        <Form
          form={projectForm}
          layout="vertical"
          onFinish={handleProjectSave}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="projectCode"
                label="项目编码"
                rules={[{ required: true, message: '请输入项目编码' }]}
              >
                <Input placeholder="请输入项目编码" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="projectName"
                label="项目名称"
                rules={[{ required: true, message: '请输入项目名称' }]}
              >
                <Input placeholder="请输入项目名称" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="department"
                label="所属检验科"
                rules={[{ required: true, message: '请选择所属检验科' }]}
              >
                <Select placeholder="请选择所属检验科">
                  {departments.map(dept => (
                    <Option key={dept.value} value={dept.value}>{dept.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="状态"
                rules={[{ required: true, message: '请选择状态' }]}
              >
                <Select placeholder="请选择状态">
                  <Option value="active">启用</Option>
                  <Option value="inactive">停用</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="remark"
            label="备注"
          >
            <TextArea rows={4} placeholder="请输入备注信息" />
          </Form.Item>
          <Form.Item style={{ textAlign: 'right' }}>
            <Space>
              <Button onClick={() => {
                setProjectModalVisible(false);
                projectForm.resetFields();
                setSelectedProject(null);
              }}>
                取消
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {selectedProject ? "保存修改" : "新增项目"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SampleQuantityManagement;