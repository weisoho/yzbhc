import React, { useState } from 'react';
import { Card, Table, Form, Input, Select, Button, Space, Modal, message, Tag, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SettingOutlined } from '@ant-design/icons';

const { Option } = Select;

const UserRoleTemplate = () => {
  const [visible, setVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [currentTemplate, setCurrentTemplate] = useState(null);
  const [form] = Form.useForm();

  const roles = ['超级管理员', '仓库管理员', '科室操作员', '普通用户'];
  const accountTypes = ['管理员', '操作员'];
  const departments = ['运营组', '内科', '外科', '儿科', '妇产科', '放射科'];
  const warehouses = ['全部仓库', '仓库1', '仓库2', '仓库3'];

  const permissionModules = [
    { key: 'dashboard', label: '首页仪表盘' },
    { key: 'stockIn', label: '入库管理' },
    { key: 'inventory', label: '库存查询' },
    { key: 'stockOut', label: '出库管理' },
    { key: 'inventoryCheck', label: '盘点管理' },
    { key: 'reports', label: '报表管理' },
    { key: 'masterData', label: '主档维护' },
    { key: 'operation', label: '运营组管理' }
  ];

  const permissionActions = [
    { key: 'view', label: '查看' },
    { key: 'add', label: '新增' },
    { key: 'edit', label: '编辑' },
    { key: 'delete', label: '删除' },
    { key: 'audit', label: '审核' }
  ];

  // 模拟数据
  const mockTemplates = [
    {
      key: '1',
      templateName: '超级管理员模板',
      role: '超级管理员',
      accountType: '管理员',
      department: '运营组',
      warehouse: '全部仓库',
      permissions: {
        modules: {
          dashboard: true,
          stockIn: true,
          inventory: true,
          stockOut: true,
          inventoryCheck: true,
          reports: true,
          masterData: true,
          operation: true
        },
        actions: {
          view: true,
          add: true,
          edit: true,
          delete: true,
          audit: true
        }
      }
    },
    {
      key: '2',
      templateName: '仓库管理员模板',
      role: '仓库管理员',
      accountType: '操作员',
      department: '运营组',
      warehouse: '仓库1',
      permissions: {
        modules: {
          dashboard: true,
          stockIn: true,
          inventory: true,
          stockOut: false,
          inventoryCheck: true,
          reports: true,
          masterData: false,
          operation: false
        },
        actions: {
          view: true,
          add: true,
          edit: true,
          delete: false,
          audit: false
        }
      }
    },
    {
      key: '3',
      templateName: '科室操作员模板',
      role: '科室操作员',
      accountType: '操作员',
      department: '内科',
      warehouse: '仓库1',
      permissions: {
        modules: {
          dashboard: true,
          stockIn: false,
          inventory: true,
          stockOut: true,
          inventoryCheck: false,
          reports: false,
          masterData: false,
          operation: false
        },
        actions: {
          view: true,
          add: false,
          edit: false,
          delete: false,
          audit: false
        }
      }
    }
  ];

  const [templateList, setTemplateList] = useState(mockTemplates);

  // 权限模块配置
  const PermissionConfig = ({ permissions, onChange }) => (
    <div style={{ marginTop: 16 }}>
      <h4>模块权限</h4>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        {permissionModules.map(module => (
          <Col span={6} key={module.key}>
            <div style={{ marginBottom: 8 }}>
              <input
                type="checkbox"
                checked={permissions.modules[module.key] || false}
                onChange={(e) => onChange('modules', module.key, e.target.checked)}
              />
              <span style={{ marginLeft: 8 }}>{module.label}</span>
            </div>
          </Col>
        ))}
      </Row>
      
      <h4>操作权限</h4>
      <Row gutter={16}>
        {permissionActions.map(action => (
          <Col span={4} key={action.key}>
            <div style={{ marginBottom: 8 }}>
              <input
                type="checkbox"
                checked={permissions.actions[action.key] || false}
                onChange={(e) => onChange('actions', action.key, e.target.checked)}
              />
              <span style={{ marginLeft: 8 }}>{action.label}</span>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );

  // 处理权限变更
  const handlePermissionChange = (type, key, value) => {
    setCurrentTemplate(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [type]: {
          ...prev.permissions[type],
          [key]: value
        }
      }
    }));
  };

  // 创建模板
  const handleCreateTemplate = async (values) => {
    try {
      setLoading(true);
      
      const templateData = {
        key: Date.now().toString(),
        templateName: values.templateName,
        role: values.role,
        accountType: values.accountType,
        department: values.department,
        warehouse: values.warehouse,
        permissions: currentTemplate?.permissions || {
          modules: {},
          actions: {}
        }
      };

      await new Promise(resolve => setTimeout(resolve, 1000));
      setTemplateList(prev => [...prev, templateData]);
      
      message.success('角色模板创建成功');
      setVisible(false);
      form.resetFields();
      setCurrentTemplate(null);
      
    } catch (error) {
      message.error('创建角色模板失败');
      console.error('创建角色模板失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 编辑模板
  const handleEditTemplate = (record) => {
    setCurrentTemplate(record);
    setEditVisible(true);
    
    form.setFieldsValue({
      templateName: record.templateName,
      role: record.role,
      accountType: record.accountType,
      department: record.department,
      warehouse: record.warehouse
    });
  };

  // 更新模板
  const handleUpdateTemplate = async (values) => {
    try {
      setLoading(true);

      const updateData = {
        ...currentTemplate,
        templateName: values.templateName,
        role: values.role,
        accountType: values.accountType,
        department: values.department,
        warehouse: values.warehouse
      };

      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setTemplateList(prev => 
        prev.map(template => 
          template.key === currentTemplate.key 
            ? updateData
            : template
        )
      );

      message.success('模板更新成功');
      setEditVisible(false);
      form.resetFields();
      setCurrentTemplate(null);

    } catch (error) {
      message.error('更新模板失败');
      console.error('更新模板失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 删除模板
  const handleDeleteTemplate = (record) => {
    setTemplateList(prev => prev.filter(template => template.key !== record.key));
    message.success('模板删除成功');
  };

  const templateColumns = [
    { 
      title: '模板名称', 
      dataIndex: 'templateName', 
      key: 'templateName',
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{text}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.role} - {record.accountType}
          </div>
        </div>
      )
    },
    { title: '所属部门', dataIndex: 'department', key: 'department' },
    { title: '管理仓库', dataIndex: 'warehouse', key: 'warehouse' },
    { 
      title: '权限概览', 
      key: 'permissions',
      render: (_, record) => {
        const moduleCount = Object.values(record.permissions.modules).filter(Boolean).length;
        const actionCount = Object.values(record.permissions.actions).filter(Boolean).length;
        return (
          <div>
            <Tag color="blue">模块: {moduleCount}</Tag>
            <Tag color="green">操作: {actionCount}</Tag>
          </div>
        );
      }
    },
    { 
      title: '操作', 
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => handleEditTemplate(record)}><EditOutlined />编辑</a>
          <a onClick={() => handleDeleteTemplate(record)} style={{ color: 'red' }}><DeleteOutlined />删除</a>
        </Space>
      )
    },
  ];

  return (
    <div style={{ padding: '0 16px' }}>
      <h1 style={{ marginBottom: 24 }}>用户角色模板</h1>
      
      <Card style={{ marginBottom: 16 }}>
        <Space wrap style={{ width: '100%' }}>
          <Input placeholder="模板名称" style={{ width: 200, minWidth: '120px' }} />
          <Select placeholder="角色" style={{ width: 150, minWidth: '100px' }}>
            {roles.map((role, index) => (
              <Option key={index} value={role}>{role}</Option>
            ))}
          </Select>
          <Select placeholder="账号属性" style={{ width: 120, minWidth: '80px' }}>
            {accountTypes.map((type, index) => (
              <Option key={index} value={type}>{type}</Option>
            ))}
          </Select>
          <Button type="primary" icon={<SettingOutlined />}>查询</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setVisible(true)}>
            新建模板
          </Button>
        </Space>
      </Card>
      
      <div style={{ overflowX: 'auto' }}>
        <Table 
          columns={templateColumns} 
          dataSource={templateList} 
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
          rowKey="key"
          size="small"
        />
      </div>

      {/* 新建模板模态框 */}
      <Modal
        title="新建角色模板"
        open={visible}
        onOk={() => {
          form.validateFields().then((values) => {
            if (!currentTemplate?.permissions) {
              message.warning('请配置权限信息');
              return;
            }
            handleCreateTemplate(values);
          });
        }}
        onCancel={() => {
          setVisible(false);
          form.resetFields();
          setCurrentTemplate(null);
        }}
        okText="确定"
        cancelText="取消"
        confirmLoading={loading}
        destroyOnHidden
        width={800}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="templateName"
                label="模板名称"
                rules={[{ required: true, message: '请输入模板名称' }]}
              >
                <Input placeholder="请输入模板名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="role"
                label="角色"
                rules={[{ required: true, message: '请选择角色' }]}
              >
                <Select placeholder="请选择角色" showSearch>
                  {roles.map((role, index) => (
                    <Option key={index} value={role}>{role}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="accountType"
                label="账号属性"
                rules={[{ required: true, message: '请选择账号属性' }]}
              >
                <Select placeholder="请选择账号属性" showSearch>
                  {accountTypes.map((type, index) => (
                    <Option key={index} value={type}>{type}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="department"
                label="所属部门"
                rules={[{ required: true, message: '请选择所属部门' }]}
              >
                <Select placeholder="请选择所属部门" showSearch>
                  {departments.map((dept, index) => (
                    <Option key={index} value={dept}>{dept}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="warehouse"
                label="管理仓库"
                rules={[{ required: true, message: '请选择管理仓库' }]}
              >
                <Select placeholder="请选择管理仓库" showSearch>
                  {warehouses.map((warehouse, index) => (
                    <Option key={index} value={warehouse}>{warehouse}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 16 }}>
            <h4>权限配置</h4>
            <Button 
              type="dashed" 
              onClick={() => {
                setCurrentTemplate({
                  permissions: {
                    modules: {},
                    actions: {}
                  }
                });
              }}
              style={{ marginBottom: 16 }}
            >
              配置权限
            </Button>
            
            {currentTemplate?.permissions && (
              <PermissionConfig 
                permissions={currentTemplate.permissions}
                onChange={handlePermissionChange}
              />
            )}
          </div>
        </Form>
      </Modal>

      {/* 编辑模板模态框 */}
      <Modal
        title="编辑角色模板"
        open={editVisible}
        onOk={() => {
          form.validateFields().then((values) => {
            handleUpdateTemplate(values);
          });
        }}
        onCancel={() => {
          setEditVisible(false);
          form.resetFields();
          setCurrentTemplate(null);
        }}
        okText="确定"
        cancelText="取消"
        confirmLoading={loading}
        destroyOnHidden
        width={800}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="templateName"
                label="模板名称"
                rules={[{ required: true, message: '请输入模板名称' }]}
              >
                <Input placeholder="请输入模板名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="role"
                label="角色"
                rules={[{ required: true, message: '请选择角色' }]}
              >
                <Select placeholder="请选择角色" showSearch>
                  {roles.map((role, index) => (
                    <Option key={index} value={role}>{role}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="accountType"
                label="账号属性"
                rules={[{ required: true, message: '请选择账号属性' }]}
              >
                <Select placeholder="请选择账号属性" showSearch>
                  {accountTypes.map((type, index) => (
                    <Option key={index} value={type}>{type}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="department"
                label="所属部门"
                rules={[{ required: true, message: '请选择所属部门' }]}
              >
                <Select placeholder="请选择所属部门" showSearch>
                  {departments.map((dept, index) => (
                    <Option key={index} value={dept}>{dept}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="warehouse"
                label="管理仓库"
                rules={[{ required: true, message: '请选择管理仓库' }]}
              >
                <Select placeholder="请选择管理仓库" showSearch>
                  {warehouses.map((warehouse, index) => (
                    <Option key={index} value={warehouse}>{warehouse}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default UserRoleTemplate;