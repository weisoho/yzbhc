import React from 'react';
import { Table, Card, Input, Select, Button, Space, Tag, Row, Col } from 'antd';
import { SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Option } = Select;

const InventoryShelf = () => {
  const shelfMaintenanceColumns = [
    { title: '货架编号', dataIndex: 'shelfNumber', key: 'shelfNumber' },
    { title: '所属仓库', dataIndex: 'warehouse', key: 'warehouse' },
    { title: '货架位置', dataIndex: 'location', key: 'location' },
    { title: '货架类型', dataIndex: 'type', key: 'type', render: (type) => {
      const typeMap = {
        normal: '普通货架',
        coldStorage: '冷藏货架',
        hazardous: '危险物品货架'
      };
      return typeMap[type] || type;
    }},
    { title: '最大容量', dataIndex: 'maxCapacity', key: 'maxCapacity' },
    { title: '当前容量', dataIndex: 'currentCapacity', key: 'currentCapacity' },
    { title: '状态', dataIndex: 'status', key: 'status', render: (status) => {
      const statusMap = {
        available: <Tag color="green">可用</Tag>,
        inUse: <Tag color="blue">使用中</Tag>,
        maintenance: <Tag color="orange">维护中</Tag>,
        disabled: <Tag color="red">停用</Tag>
      };
      return statusMap[status] || status;
    }},
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime' },
    { title: '备注', dataIndex: 'remark', key: 'remark' },
    { 
      title: '操作', 
      key: 'action',
      render: () => (
        <Space size="middle">
          <a><EditOutlined />编辑</a>
          <a><DeleteOutlined />删除</a>
          <a>查看详情</a>
        </Space>
      )
    },
  ];

  const shelfMaintenanceData = [
    { key: '1', shelfNumber: 'S001', warehouse: '仓库1', location: 'A1-01', type: 'normal', maxCapacity: 1000, currentCapacity: 800, status: 'inUse', createTime: '2024-01-01', remark: '普通药品货架' },
    { key: '2', shelfNumber: 'S002', warehouse: '仓库1', location: 'A1-02', type: 'normal', maxCapacity: 1000, currentCapacity: 600, status: 'inUse', createTime: '2024-01-01', remark: '普通药品货架' },
    { key: '3', shelfNumber: 'S003', warehouse: '仓库2', location: 'B2-01', type: 'coldStorage', maxCapacity: 500, currentCapacity: 300, status: 'inUse', createTime: '2024-01-02', remark: '冷藏药品货架' },
    { key: '4', shelfNumber: 'S004', warehouse: '仓库3', location: 'C3-01', type: 'hazardous', maxCapacity: 300, currentCapacity: 150, status: 'available', createTime: '2024-01-03', remark: '危险物品货架' },
  ];

  return (
    <div style={{ padding: '0 16px' }}>
      <h1 style={{ marginBottom: 24 }}>物资库位维护</h1>
      
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 0]} align="middle">
          <Col xs={24} sm={12} md={8} lg={6}>
            <Input placeholder="货架编号" style={{ width: '100%' }} />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Select placeholder="所属仓库" style={{ width: '100%' }}>
              <Option value="all">全部仓库</Option>
              <Option value="warehouse1">仓库1</Option>
              <Option value="warehouse2">仓库2</Option>
              <Option value="warehouse3">仓库3</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Select placeholder="货架类型" style={{ width: '100%' }}>
              <Option value="all">全部类型</Option>
              <Option value="normal">普通货架</Option>
              <Option value="coldStorage">冷藏货架</Option>
              <Option value="hazardous">危险物品货架</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={12} lg={6}>
            <Space>
              <Button type="primary" icon={<SearchOutlined />}>查询</Button>
              <Button type="primary">新增货架</Button>
            </Space>
          </Col>
        </Row>
      </Card>
      
      <div style={{ overflowX: 'auto' }}>
        <Table columns={shelfMaintenanceColumns} dataSource={shelfMaintenanceData} pagination={{ 
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

export default InventoryShelf;
