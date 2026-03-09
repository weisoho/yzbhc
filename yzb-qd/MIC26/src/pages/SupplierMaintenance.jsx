import { useState } from 'react';
import { Card, Button, Table, Form, Input, Space, Modal, Popconfirm, Checkbox, Radio, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, DownloadOutlined } from '@ant-design/icons';
import { FORM_STYLES, getFormLayoutStyle, getModalConfig } from '../utils/formStyles';



const SupplierMaintenance = () => {
  const [visible, setVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const suppliers = [
    { key: '1', name: '供应商A', enterpriseType: '经营企业', creditCode: '123456789012345678', legalRepresentative: '张三', registeredCapital: '1000万', registrationDate: '2020-01-01', phone: '13800138001', address: '北京市朝阳区' },
    { key: '2', name: '供应商B', enterpriseType: '生产企业', creditCode: '876543210987654321', legalRepresentative: '李四', registeredCapital: '5000万', registrationDate: '2019-03-15', phone: '13900139001', address: '上海市浦东新区' },
    { key: '3', name: '供应商C', enterpriseType: '医疗机构', creditCode: '112233445566778899', legalRepresentative: '王五', registeredCapital: '2000万', registrationDate: '2021-06-10', phone: '13700137001', address: '广州市天河区' },
  ];

  const handleEdit = (record) => {
    setEditingRecord(record);
    form.setFieldsValue({
      name: record.name,
      enterpriseType: record.enterpriseType,
      creditCode: record.creditCode,
      legalRepresentative: record.legalRepresentative,
      registeredCapital: record.registeredCapital,
      registrationDate: record.registrationDate,
      phone: record.phone,
      address: record.address
    });
    setVisible(true);
  };

  const handleModalOk = () => {
    form.validateFields().then(() => {
      if (editingRecord) {
        // 编辑供应商
      } else {
        // 新增供应商
      }
      setVisible(false);
      setEditingRecord(null);
      form.resetFields();
    });
  };

  const handleModalCancel = () => {
    setVisible(false);
    setEditingRecord(null);
    form.resetFields();
  };

  const columns = [
    {
      title: <Checkbox 
        indeterminate={selectedRowKeys.length > 0 && selectedRowKeys.length < suppliers.length}
        checked={selectedRowKeys.length === suppliers.length}
        onChange={(e) => {
          if (e.target.checked) {
            setSelectedRowKeys(suppliers.map(item => item.key));
          } else {
            setSelectedRowKeys([]);
          }
        }}
      />,
      dataIndex: 'checkbox',
      key: 'checkbox',
      width: 60,
      render: (_, record) => (
        <Checkbox 
          checked={selectedRowKeys.includes(record.key)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedRowKeys([...selectedRowKeys, record.key]);
            } else {
              setSelectedRowKeys(selectedRowKeys.filter(key => key !== record.key));
            }
          }}
        />
      )
    },
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
      width: 60,
      render: (_, record, index) => (currentPage - 1) * pageSize + index + 1
    },
    { 
      title: '名称', 
      dataIndex: 'name', 
      key: 'name',
      ellipsis: false,
      align: 'center',
      onHeaderCell: () => ({ style: { whiteSpace: 'nowrap' } }),
      onCell: () => ({ style: { whiteSpace: 'nowrap' } })
    },
    { 
      title: '企业类型', 
      dataIndex: 'enterpriseType', 
      key: 'enterpriseType',
      ellipsis: false,
      align: 'center',
      onHeaderCell: () => ({ style: { whiteSpace: 'nowrap' } }),
      onCell: () => ({ style: { whiteSpace: 'nowrap' } })
    },
    { 
      title: '统一社会信用代码', 
      dataIndex: 'creditCode', 
      key: 'creditCode',
      ellipsis: false,
      align: 'center',
      onHeaderCell: () => ({ style: { whiteSpace: 'nowrap' } }),
      onCell: () => ({ style: { whiteSpace: 'nowrap' } })
    },
    { 
      title: '法定代表人', 
      dataIndex: 'legalRepresentative', 
      key: 'legalRepresentative',
      ellipsis: false,
      align: 'center',
      onHeaderCell: () => ({ style: { whiteSpace: 'nowrap' } }),
      onCell: () => ({ style: { whiteSpace: 'nowrap' } })
    },
    { 
      title: '注册资本', 
      dataIndex: 'registeredCapital', 
      key: 'registeredCapital',
      ellipsis: false,
      align: 'center',
      onHeaderCell: () => ({ style: { whiteSpace: 'nowrap' } }),
      onCell: () => ({ style: { whiteSpace: 'nowrap' } })
    },
    { 
      title: '注册时间', 
      dataIndex: 'registrationDate', 
      key: 'registrationDate',
      ellipsis: false,
      align: 'center',
      onHeaderCell: () => ({ style: { whiteSpace: 'nowrap' } }),
      onCell: () => ({ style: { whiteSpace: 'nowrap' } })
    },
    { 
      title: '联系电话', 
      dataIndex: 'phone', 
      key: 'phone',
      ellipsis: false,
      align: 'center',
      onHeaderCell: () => ({ style: { whiteSpace: 'nowrap' } }),
      onCell: () => ({ style: { whiteSpace: 'nowrap' } })
    },
    { 
      title: '联系地址', 
      dataIndex: 'address', 
      key: 'address',
      ellipsis: false,
      align: 'center',
      onHeaderCell: () => ({ style: { whiteSpace: 'nowrap' } }),
      onCell: () => ({ style: { whiteSpace: 'nowrap' } })
    },
    { 
      title: '操作', 
      key: 'action',
      ellipsis: false,
      align: 'center',
      onHeaderCell: () => ({ style: { whiteSpace: 'nowrap' } }),
      onCell: () => ({ style: { whiteSpace: 'nowrap' } }),
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => handleEdit(record)}><EditOutlined />编辑</a>
          <Popconfirm
            title="确定要删除这个供应商吗？"
            onConfirm={() => { /* 删除供应商处理 */ }}
            okText="确定"
            cancelText="取消"
          >
            <a style={{ color: 'red' }}><DeleteOutlined />删除</a>
          </Popconfirm>
        </Space>
      )
    },
  ];

  return (
    <div style={FORM_STYLES.page}>
      <h1 style={FORM_STYLES.title}>供应商管理</h1>
      
      <Card style={FORM_STYLES.card}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
            <Form.Item name="name" label="名称" style={{ marginBottom: 0 }}>
              <Input placeholder="请输入名称" style={{ width: 200 }} />
            </Form.Item>
            <Form.Item name="legalRepresentative" label="法定代表人" style={{ marginBottom: 0 }}>
              <Input placeholder="请输入法定代表人" style={{ width: 200 }} />
            </Form.Item>
            <Form.Item name="phone" label="联系电话" style={{ marginBottom: 0 }}>
              <Input placeholder="请输入联系电话" style={{ width: 200 }} />
            </Form.Item>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Button type="primary" icon={<SearchOutlined />}>查询</Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => {
              setEditingRecord(null);
              form.resetFields();
              setVisible(true);
            }}>
              新增供应商
            </Button>
            <Button 
              type="primary" 
              icon={<DownloadOutlined />}
              onClick={() => {
                // 批量导出选中的供应商
                alert(`已导出 ${selectedRowKeys.length} 条供应商记录`);
              }}
            >
              批量导出
            </Button>
          </div>
        </div>
      </Card>
      
      <div style={{ overflowX: 'auto' }}>
        <Table 
          columns={columns} 
          dataSource={suppliers} 
          pagination={{ 
            pageSize: pageSize,
            current: currentPage,
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size);
              setSelectedRowKeys([]);
            },
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
            style: FORM_STYLES.table.pagination.style
          }} 
          size={FORM_STYLES.table.size}
          scroll={{ x: 1600 }}
        />
      </div>

      <Modal
        title={editingRecord ? "编辑供应商" : "新建供应商"}
        open={visible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="保存"
        cancelText="取消"
        {...getModalConfig()}
      >
        <Form 
          form={form} 
          {...getFormLayoutStyle('edit')}
          initialValues={{
            enterpriseType: "经营企业"
          }}
        >
          <Form.Item
            name="enterpriseType"
            label="企业类型"
            rules={[{ required: true, message: '请选择企业类型' }]}
          >
            <Radio.Group>
              <Radio value="经营企业">经营企业</Radio>
              <Radio value="生产企业">生产企业</Radio>
              <Radio value="医疗机构">医疗机构</Radio>
            </Radio.Group>
          </Form.Item>
          
          <Row gutter={FORM_STYLES.form.edit.rowGutter}>
            <Col span={FORM_STYLES.form.edit.colSpan}>
              <Form.Item
                name="name"
                label="名称"
                rules={[{ required: true, message: '请输入名称' }]}
              >
                <Input placeholder="请输入名称" />
              </Form.Item>
            </Col>
            <Col span={FORM_STYLES.form.edit.colSpan}>
              <Form.Item
                name="creditCode"
                label="统一社会信用代码"
                rules={[{ required: true, message: '请输入统一社会信用代码' }]}
              >
                <Input placeholder="请输入统一社会信用代码" />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={FORM_STYLES.form.edit.rowGutter}>
            <Col span={FORM_STYLES.form.edit.colSpan}>
              <Form.Item
                name="legalRepresentative"
                label="法定代表人"
                rules={[{ required: true, message: '请输入法定代表人' }]}
              >
                <Input placeholder="请输入法定代表人" />
              </Form.Item>
            </Col>
            <Col span={FORM_STYLES.form.edit.colSpan}>
              <Form.Item
                name="registeredCapital"
                label="注册资本"
                rules={[{ required: true, message: '请输入注册资本' }]}
              >
                <Input placeholder="请输入注册资本" />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={FORM_STYLES.form.edit.rowGutter}>
            <Col span={FORM_STYLES.form.edit.colSpan}>
              <Form.Item
                name="registrationDate"
                label="注册时间"
                rules={[{ required: true, message: '请输入注册时间' }]}
              >
                <Input placeholder="请输入注册时间" />
              </Form.Item>
            </Col>
            <Col span={FORM_STYLES.form.edit.colSpan}>
              <Form.Item
                name="phone"
                label="联系电话"
                rules={[{ required: true, message: '请输入联系电话' }]}
              >
                <Input placeholder="请输入联系电话" />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={FORM_STYLES.form.edit.rowGutter}>
            <Col span={FORM_STYLES.form.edit.colSpan}>
              <Form.Item
                name="address"
                label="联系地址"
                rules={[{ required: true, message: '请输入联系地址' }]}
              >
                <Input placeholder="请输入联系地址" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default SupplierMaintenance;
