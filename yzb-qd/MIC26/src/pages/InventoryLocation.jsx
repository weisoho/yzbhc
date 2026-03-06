import React from 'react';
import { Table, Card, Input, Select, Button, Space, Row, Col } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const { Option } = Select;

const InventoryLocation = () => {
  const locationAdjustmentColumns = [
    { title: '调整单号', dataIndex: 'adjustmentNumber', key: 'adjustmentNumber' },
    { title: '商品名称', dataIndex: 'materialName', key: 'materialName' },
    { title: '规格型号', dataIndex: 'specification', key: 'specification' },
    { title: '批号', dataIndex: 'batchNumber', key: 'batchNumber' },
    { title: '原货位', dataIndex: 'oldLocation', key: 'oldLocation' },
    { title: '新货位', dataIndex: 'newLocation', key: 'newLocation' },
    { title: '调整数量', dataIndex: 'quantity', key: 'quantity' },
    { title: '单位', dataIndex: 'unit', key: 'unit' },
    { title: '调整日期', dataIndex: 'adjustmentDate', key: 'adjustmentDate' },
    { title: '调整人', dataIndex: 'adjuster', key: 'adjuster' },
    { title: '调整原因', dataIndex: 'reason', key: 'reason' },
    { 
      title: '操作', 
      key: 'action',
      render: () => (
        <Space size="middle">
          <a>查看详情</a>
          <a>完成</a>
          <a>取消</a>
        </Space>
      )
    },
  ];

  const locationAdjustmentData = [
    { key: '1', adjustmentNumber: 'AD20240601001', materialName: '一次性注射器', specification: '10ml', batchNumber: '20240201', oldLocation: '仓库1-A1-01', newLocation: '仓库1-A1-02', quantity: 100, unit: '支', adjustmentDate: '2024-06-01', adjuster: '张三', reason: '货位优化' },
    { key: '2', adjustmentNumber: 'AD20240601002', materialName: '输液器', specification: '500ml', batchNumber: '20240202', oldLocation: '仓库2-B2-03', newLocation: '仓库2-B2-04', quantity: 50, unit: '个', adjustmentDate: '2024-06-01', adjuster: '李四', reason: '整理库存' },
    { key: '3', adjustmentNumber: 'AD20240531001', materialName: '医用棉签', specification: '100支/包', batchNumber: '20240203', oldLocation: '仓库1-C3-05', newLocation: '仓库1-C3-06', quantity: 30, unit: '包', adjustmentDate: '2024-05-31', adjuster: '王五', reason: '货位调整' },
    { key: '4', adjustmentNumber: 'AD20240530001', materialName: '酒精棉球', specification: '50g/瓶', batchNumber: '20231201', oldLocation: '仓库3-D4-02', newLocation: '仓库3-D4-03', quantity: 20, unit: '瓶', adjustmentDate: '2024-05-30', adjuster: '赵六', reason: '分类调整' },
  ];

  return (
    <div style={{ padding: '0 16px' }}>
      <h1 style={{ marginBottom: 24 }}>物资库位调整（已弃置）</h1>
      
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 0]} align="middle">
          <Col xs={24} sm={12} md={8} lg={6}>
            <Input placeholder="调整单号" style={{ width: '100%' }} />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Input placeholder="商品名称" style={{ width: '100%' }} />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Select placeholder="所属仓库" style={{ width: '100%' }}>
              <Option value="all">全部仓库</Option>
              <Option value="warehouse1">仓库1</Option>
              <Option value="warehouse2">仓库2</Option>
              <Option value="warehouse3">仓库3</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={12} lg={6}>
            <Space>
              <Button type="primary" icon={<SearchOutlined />}>查询</Button>
              <Button type="primary">新建调整</Button>
            </Space>
          </Col>
        </Row>
      </Card>
      
      <div style={{ overflowX: 'auto' }}>
        <Table columns={locationAdjustmentColumns} dataSource={locationAdjustmentData} pagination={{ 
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

export default InventoryLocation;
