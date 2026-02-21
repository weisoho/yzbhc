import React from 'react';
import { Table, Card, Input, Select, Button, Space, Tag, Row, Col } from 'antd';
import { SearchOutlined } from '@ant-design/icons';



const InventoryTransfer = () => {
  const transferColumns = [
    { title: '调拨单号', dataIndex: 'transferNumber', key: 'transferNumber' },
    { title: '商品名称', dataIndex: 'materialName', key: 'materialName' },
    { title: '规格型号', dataIndex: 'specification', key: 'specification' },
    { title: '调出仓库', dataIndex: 'fromWarehouse', key: 'fromWarehouse' },
    { title: '调入仓库', dataIndex: 'toWarehouse', key: 'toWarehouse' },
    { title: '调拨数量', dataIndex: 'quantity', key: 'quantity' },
    { title: '单位', dataIndex: 'unit', key: 'unit' },
    { title: '调拨日期', dataIndex: 'transferDate', key: 'transferDate' },
    { title: '调拨人', dataIndex: 'transferor', key: 'transferor' },
    { title: '状态', dataIndex: 'status', key: 'status', render: (status) => {
      const statusMap = {
        pending: <Tag color="orange">待审核</Tag>,
        approved: <Tag color="blue">已审核</Tag>,
        completed: <Tag color="green">已完成</Tag>,
        canceled: <Tag color="red">已取消</Tag>
      };
      return statusMap[status] || status;
    }},
    { 
      title: '操作', 
      key: 'action',
      render: () => (
        <Space size="middle">
          <a>查看详情</a>
          <a>编辑</a>
          <a>取消</a>
        </Space>
      )
    },
  ];

  const transferData = [
    { key: '1', transferNumber: 'TF20240601001', materialName: '一次性注射器', specification: '10ml', fromWarehouse: '仓库1', toWarehouse: '仓库2', quantity: 200, unit: '支', transferDate: '2024-06-01', transferor: '张三', status: 'completed' },
    { key: '2', transferNumber: 'TF20240601002', materialName: '输液器', specification: '500ml', fromWarehouse: '仓库2', toWarehouse: '仓库3', quantity: 100, unit: '个', transferDate: '2024-06-01', transferor: '李四', status: 'pending' },
    { key: '3', transferNumber: 'TF20240531001', materialName: '医用棉签', specification: '100支/包', fromWarehouse: '仓库1', toWarehouse: '仓库3', quantity: 50, unit: '包', transferDate: '2024-05-31', transferor: '王五', status: 'approved' },
    { key: '4', transferNumber: 'TF20240530001', materialName: '酒精棉球', specification: '50g/瓶', fromWarehouse: '仓库3', toWarehouse: '仓库1', quantity: 30, unit: '瓶', transferDate: '2024-05-30', transferor: '赵六', status: 'canceled' },
  ];

  return (
    <div style={{ padding: '0 16px' }}>
      <h1 style={{ marginBottom: 24 }}>物资调拨</h1>
      
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 0]} align="middle">
          <Col xs={24} sm={12} md={8} lg={6}>
            <Input placeholder="调拨单号" style={{ width: '100%' }} />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Select placeholder="调出仓库" style={{ width: '100%' }}>
              <Select.Option value="all">全部仓库</Select.Option>
              <Select.Option value="warehouse1">仓库1</Select.Option>
              <Select.Option value="warehouse2">仓库2</Select.Option>
              <Select.Option value="warehouse3">仓库3</Select.Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Select placeholder="调入仓库" style={{ width: '100%' }}>
              <Select.Option value="all">全部仓库</Select.Option>
              <Select.Option value="warehouse1">仓库1</Select.Option>
              <Select.Option value="warehouse2">仓库2</Select.Option>
              <Select.Option value="warehouse3">仓库3</Select.Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={12} lg={6}>
            <Space>
              <Button type="primary" icon={<SearchOutlined />}>查询</Button>
              <Button type="primary">新建调拨</Button>
            </Space>
          </Col>
        </Row>
      </Card>
      
      <div style={{ overflowX: 'auto' }}>
        <Table columns={transferColumns} dataSource={transferData} pagination={{ 
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
    </div>
  );
};

export default InventoryTransfer;
