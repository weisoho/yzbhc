import React, { useState } from 'react';
import { Table, Card, Input, Select, Button, Space, Tag, Row, Col, Modal, Form } from 'antd';
import { SearchOutlined, EditOutlined } from '@ant-design/icons';



const InventoryAdjust = () => {
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);

  const batchAuditColumns = [
    { title: '申请编号', dataIndex: 'applyNumber', key: 'applyNumber' },
    { title: '商品名称', dataIndex: 'materialName', key: 'materialName' },
    { title: '规格型号', dataIndex: 'specification', key: 'specification' },
    { title: '修改类型', dataIndex: 'changeType', key: 'changeType', render: (type) => {
      const typeMap = {
        price: '价格调整',
        quantity: '数量调整',
        info: '信息修改'
      };
      return typeMap[type] || type;
    }},
    { title: '申请前值', dataIndex: 'beforeValue', key: 'beforeValue' },
    { title: '申请后值', dataIndex: 'afterValue', key: 'afterValue' },
    { title: '申请人', dataIndex: 'applicant', key: 'applicant' },
    { title: '申请时间', dataIndex: 'applyTime', key: 'applyTime' },
    { title: '审核状态', dataIndex: 'status', key: 'status', render: (status) => {
      const statusMap = {
        pending: <Tag color="orange">待审核</Tag>,
        approved: <Tag color="green">已通过</Tag>,
        rejected: <Tag color="red">已拒绝</Tag>
      };
      return statusMap[status] || status;
    }},
    { 
      title: '操作', 
      key: 'action',
      render: (record) => (
        <Space size="middle">
          {record.status === 'pending' && (
            <>
              <Button type="primary" size="small">通过</Button>
              <Button danger size="small">拒绝</Button>
            </>
          )}
          <a>查看详情</a>
        </Space>
      )
    },
  ];

  const batchAuditData = [
    { key: '1', applyNumber: 'BA20240601001', materialName: '一次性注射器', specification: '10ml', changeType: 'price', beforeValue: '2.5元', afterValue: '2.8元', applicant: '张三', applyTime: '2024-06-01 10:30', status: 'pending' },
    { key: '2', applyNumber: 'BA20240601002', materialName: '输液器', specification: '500ml', changeType: 'quantity', beforeValue: '500个', afterValue: '550个', applicant: '李四', applyTime: '2024-06-01 11:20', status: 'pending' },
    { key: '3', applyNumber: 'BA20240531001', materialName: '医用棉签', specification: '100支/包', changeType: 'info', beforeValue: '旧包装', afterValue: '新包装', applicant: '王五', applyTime: '2024-05-31 15:45', status: 'approved' },
    { key: '4', applyNumber: 'BA20240530001', materialName: '酒精棉球', specification: '50g/瓶', changeType: 'price', beforeValue: '3.0元', afterValue: '3.5元', applicant: '赵六', applyTime: '2024-05-30 09:15', status: 'rejected' },
  ];

  return (
    <div style={{ padding: '0 16px' }}>
      <h1 style={{ marginBottom: 24 }}>商品信息调整</h1>
      
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 0]} align="middle">
          <Col xs={24} sm={12} md={8} lg={6}>
            <Input placeholder="商品名称" style={{ width: '100%' }} />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Select placeholder="修改类型" style={{ width: '100%' }}>
              <Select.Option value="all">全部类型</Select.Option>
              <Select.Option value="price">价格调整</Select.Option>
              <Select.Option value="quantity">数量调整</Select.Option>
              <Select.Option value="info">信息修改</Select.Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Select placeholder="审核状态" style={{ width: '100%' }}>
              <Select.Option value="all">全部状态</Select.Option>
              <Select.Option value="pending">待审核</Select.Option>
              <Select.Option value="approved">已通过</Select.Option>
              <Select.Option value="rejected">已拒绝</Select.Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={12} lg={6}>
            <Space>
              <Button type="primary" icon={<SearchOutlined />}>查询</Button>
              <Button type="primary" icon={<EditOutlined />} onClick={() => setModalVisible(true)}>申请调整</Button>
            </Space>
          </Col>
        </Row>
      </Card>
      
      <div style={{ overflowX: 'auto' }}>
        <Table columns={batchAuditColumns} dataSource={batchAuditData} pagination={{ 
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条记录`,
          style: {
            display: 'flex',
            justifyContent: 'center',
            marginTop: '16px'
          }
        }} size="small" />
      </div>

      <Modal
        title="申请商品信息调整"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => {
          form.validateFields().then(() => {
            setModalVisible(false);
            form.resetFields();
          });
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="materialName" label="商品名称" rules={[{ required: true }]}>
            <Input placeholder="请输入商品名称" />
          </Form.Item>
          <Form.Item name="changeType" label="修改类型" rules={[{ required: true }]}>
            <Select placeholder="请选择修改类型">
              <Select.Option value="price">价格调整</Select.Option>
              <Select.Option value="quantity">数量调整</Select.Option>
              <Select.Option value="info">信息修改</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="beforeValue" label="申请前值" rules={[{ required: true }]}>
            <Input placeholder="请输入申请前值" />
          </Form.Item>
          <Form.Item name="afterValue" label="申请后值" rules={[{ required: true }]}>
            <Input placeholder="请输入申请后值" />
          </Form.Item>
          <Form.Item name="reason" label="调整原因">
            <Input.TextArea rows={3} placeholder="请输入调整原因" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default InventoryAdjust;
