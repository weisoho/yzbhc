import React from 'react';
import { Card, Table, Input, Select, DatePicker, Button, Space, Row, Col } from 'antd';
import { SearchOutlined, ExportOutlined } from '@ant-design/icons';

const { Option } = Select;
const { RangePicker } = DatePicker;

const StockOutConsumptionUndo = () => {
  // 模拟数据
  const consumptionUndoData = [
    { key: '1', date: '2024-02-20', department: '内科', materialName: '一次性注射器', specification: '10ml', quantity: 50, unit: '支', operator: '张三', reason: '日常消耗', status: '待撤销' },
    { key: '2', date: '2024-02-19', department: '外科', materialName: '输液器', specification: '500ml', quantity: 30, unit: '个', operator: '李四', reason: '手术使用', status: '已撤销' },
    { key: '3', date: '2024-02-18', department: '儿科', materialName: '医用棉签', specification: '100支/包', quantity: 20, unit: '包', operator: '王五', reason: '日常消耗', status: '待撤销' },
  ];

  // 表格列配置
  const columns = [
    { title: '消耗日期', dataIndex: 'date', key: 'date' },
    { title: '领用科室', dataIndex: 'department', key: 'department' },
    { title: '商品名称', dataIndex: 'materialName', key: 'materialName' },
    { title: '规格型号', dataIndex: 'specification', key: 'specification' },
    { title: '消耗数量', dataIndex: 'quantity', key: 'quantity' },
    { title: '单位', dataIndex: 'unit', key: 'unit' },
    { title: '操作人', dataIndex: 'operator', key: 'operator' },
    { title: '消耗原因', dataIndex: 'reason', key: 'reason' },
    { title: '状态', dataIndex: 'status', key: 'status' },
    { 
      title: '操作', 
      key: 'action', 
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" size="small" disabled={record.status === '已撤销'}>确认撤销</Button>
          <Button size="small">查看</Button>
        </Space>
      ) 
    },
  ];

  return (
    <div style={{ padding: '0 16px' }}>
      <h1 style={{ marginBottom: 24 }}>消耗撤销</h1>
      
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 0]} align="middle">
          <Col xs={24} sm={12} md={8} lg={6}>
            <Input placeholder="商品名称" style={{ width: '100%' }} />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Select placeholder="领用科室" style={{ width: '100%' }}>
              <Option value="all">全部科室</Option>
              <Option value="internal">内科</Option>
              <Option value="surgery">外科</Option>
              <Option value="pediatrics">儿科</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Select placeholder="状态" style={{ width: '100%' }}>
              <Option value="all">全部状态</Option>
              <Option value="pending">待撤销</Option>
              <Option value="completed">已撤销</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={12} lg={10}>
            <RangePicker style={{ width: '100%' }} placeholder={['开始日期', '结束日期']} />
          </Col>
          <Col xs={24} sm={12} md={12} lg={6}>
            <Space>
              <Button type="primary" icon={<SearchOutlined />} style={{ minWidth: 100 }}>查询</Button>
              <Button icon={<ExportOutlined />} style={{ minWidth: 100 }}>导出</Button>
            </Space>
          </Col>
        </Row>
      </Card>
      
      <div style={{ overflowX: 'auto' }}>
        <Table columns={columns} dataSource={consumptionUndoData} pagination={{ 
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

export default StockOutConsumptionUndo;