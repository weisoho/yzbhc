import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Form,
  Input,
  Select,
  Modal,
  Tag,
  Row,
  Col,
  message
} from 'antd';
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  DownloadOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;

const SampleProjectManagement = () => {
  const [form] = Form.useForm();
  const [projectForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectModalVisible, setProjectModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  // 模拟检验科数据
  const departments = [
    { value: 'clinical', label: '临床检验科' },
    { value: 'microbiology', label: '微生物检验科' },
    { value: 'biochemistry', label: '生化检验科' },
    { value: 'immunology', label: '免疫检验科' },
    { value: 'hematology', label: '血液检验科' },
    { value: 'pathology', label: '病理检验科' },
  ];

  // 模拟项目数据
  const mockProjects = [
    { key: '1', projectCode: 'PROJ001', projectName: '血常规', department: 'clinical', departmentName: '临床检验科', status: 'active', remark: '常规检测项目' },
    { key: '2', projectCode: 'PROJ002', projectName: '尿常规', department: 'clinical', departmentName: '临床检验科', status: 'active', remark: '常规检测项目' },
    { key: '3', projectCode: 'PROJ003', projectName: '肝功能', department: 'biochemistry', departmentName: '生化检验科', status: 'active', remark: '生化检测项目' },
    { key: '4', projectCode: 'PROJ004', projectName: '肾功能', department: 'biochemistry', departmentName: '生化检验科', status: 'active', remark: '生化检测项目' },
    { key: '5', projectCode: 'PROJ005', projectName: '细菌培养', department: 'microbiology', departmentName: '微生物检验科', status: 'active', remark: '微生物检测项目' },
    { key: '6', projectCode: 'PROJ006', projectName: 'HIV抗体检测', department: 'immunology', departmentName: '免疫检验科', status: 'inactive', remark: '特殊检测项目' },
    { key: '7', projectCode: 'PROJ007', projectName: '血型鉴定', department: 'hematology', departmentName: '血液检验科', status: 'active', remark: '血液检测项目' },
    { key: '8', projectCode: 'PROJ008', projectName: '病理切片', department: 'pathology', departmentName: '病理检验科', status: 'active', remark: '病理检测项目' },
  ];

  // 组件加载时初始化数据
  useEffect(() => {
    setProjects(mockProjects);
  }, []);

  // 项目管理列配置
  const columns = [
    {
      title: '序号',
      key: 'index',
      width: 60,
      render: (_, __, index) => index + 1,
      fixed: 'left',
    },
    {
      title: '项目编码',
      dataIndex: 'projectCode',
      key: 'projectCode',
      width: 120,
      sorter: (a, b) => a.projectCode.localeCompare(b.projectCode),
    },
    {
      title: '项目名称',
      dataIndex: 'projectName',
      key: 'projectName',
      width: 150,
      sorter: (a, b) => a.projectName.localeCompare(b.projectName),
    },
    {
      title: '所属检验科',
      dataIndex: 'departmentName',
      key: 'departmentName',
      width: 150,
      sorter: (a, b) => a.departmentName.localeCompare(b.departmentName),
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
      ),
      sorter: (a, b) => a.status.localeCompare(b.status),
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      ellipsis: true,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEditProject(record)}>
            编辑
          </Button>
          <Button 
            type="link" 
            size="small" 
            icon={record.status === 'active' ? <CloseCircleOutlined /> : <CheckCircleOutlined />}
            onClick={() => handleToggleStatus(record)}
            style={{ color: record.status === 'active' ? '#ff4d4f' : '#52c41a' }}
          >
            {record.status === 'active' ? '停用' : '启用'}
          </Button>
          <Button type="link" size="small" icon={<DeleteOutlined />} onClick={() => handleDeleteProject(record)} style={{ color: '#ff4d4f' }}>
            删除
          </Button>
        </Space>
      )
    }
  ];

  // 处理查询
  const handleSearch = (values) => {
    setLoading(true);
    // 模拟查询
    setTimeout(() => {
      let filteredProjects = [...mockProjects];
      
      if (values.projectName) {
        filteredProjects = filteredProjects.filter(project => 
          project.projectName.includes(values.projectName)
        );
      }
      
      if (values.projectCode) {
        filteredProjects = filteredProjects.filter(project => 
          project.projectCode.includes(values.projectCode)
        );
      }
      
      if (values.department) {
        filteredProjects = filteredProjects.filter(project => 
          project.department === values.department
        );
      }
      
      if (values.status) {
        filteredProjects = filteredProjects.filter(project => 
          project.status === values.status
        );
      }
      
      setProjects(filteredProjects);
      setLoading(false);
    }, 500);
  };

  // 处理重置
  const handleReset = () => {
    form.resetFields();
    setProjects(mockProjects);
  };

  // 处理导出
  const handleExport = () => {
    message.success('项目数据导出成功');
  };

  // 处理编辑项目
  const handleEditProject = (record) => {
    setSelectedProject(record);
    projectForm.setFieldsValue({
      projectCode: record.projectCode,
      projectName: record.projectName,
      department: record.department,
      status: record.status,
      remark: record.remark,
    });
    setProjectModalVisible(true);
  };

  // 处理切换项目状态
  const handleToggleStatus = (record) => {
    const newProjects = projects.map(project => {
      if (project.key === record.key) {
        return {
          ...project,
          status: project.status === 'active' ? 'inactive' : 'active'
        };
      }
      return project;
    });
    setProjects(newProjects);
    message.success(`项目${record.status === 'active' ? '已停用' : '已启用'}`);
  };

  // 处理删除项目
  const handleDeleteProject = (record) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除项目 "${record.projectName}" 吗？`,
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        const newProjects = projects.filter(project => project.key !== record.key);
        setProjects(newProjects);
        message.success('项目删除成功');
      },
    });
  };

  // 处理新增/编辑项目提交
  const handleProjectSubmit = (values) => {
    setLoading(true);
    setTimeout(() => {
      if (selectedProject) {
        // 编辑项目
        const newProjects = projects.map(project => {
          if (project.key === selectedProject.key) {
            return {
              ...project,
              ...values,
              departmentName: departments.find(dept => dept.value === values.department)?.label || values.department,
            };
          }
          return project;
        });
        setProjects(newProjects);
        message.success('项目修改成功');
      } else {
        // 新增项目
        const newProject = {
          key: `PROJ${String(projects.length + 1).padStart(3, '0')}`,
          projectCode: values.projectCode,
          projectName: values.projectName,
          department: values.department,
          departmentName: departments.find(dept => dept.value === values.department)?.label || values.department,
          status: values.status,
          remark: values.remark,
        };
        setProjects([...projects, newProject]);
        message.success('项目新增成功');
      }
      
      setProjectModalVisible(false);
      projectForm.resetFields();
      setSelectedProject(null);
      setLoading(false);
    }, 500);
  };



  return (
    <div style={{ padding: '0 16px' }}>
      <h1 style={{ marginBottom: 24 }}>新增项目管理</h1>
      

      
      {/* 查询表单 */}
      <Card style={{ marginBottom: 16 }}>
        <Form form={form} layout="inline" onFinish={handleSearch}>
          <Row gutter={[16, 16]} style={{ width: '100%' }}>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="projectCode" label="项目编码">
                <Input placeholder="请输入项目编码" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="projectName" label="项目名称">
                <Input placeholder="请输入项目名称" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="department" label="检验科">
                <Select placeholder="请选择检验科" allowClear>
                  {departments.map(dept => (
                    <Option key={dept.value} value={dept.value}>{dept.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="status" label="状态">
                <Select placeholder="请选择状态" allowClear>
                  <Option value="active">启用</Option>
                  <Option value="inactive">停用</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} style={{ textAlign: 'right' }}>
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
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>
      
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
        columns={columns}
        dataSource={projects}
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
          pageSizeOptions: ['10', '20', '50', '100'],
          showTotal: (total) => `共 ${total} 条记录`,
          style: {
            display: 'flex',
            justifyContent: 'center',
            marginTop: '16px'
          }
        }}
        scroll={{ x: 1000 }}
      />
      
      {/* 新增/编辑项目模态框 */}
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
          onFinish={handleProjectSubmit}
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

export default SampleProjectManagement;