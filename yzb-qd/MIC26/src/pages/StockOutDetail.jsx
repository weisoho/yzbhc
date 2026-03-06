import React from 'react';
import { Space, Card, Table, Input, Select, DatePicker, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const { Option } = Select;
const { RangePicker } = DatePicker;

const StockOutDetail = () => {
  const consumptionDetails = [
    { key: '1', date: '2024-02-20', department: '内科', materialName: '一次性注射器', specification: '10ml', quantity: 50, unit: '支', operator: '张三', reason: '日常消耗' },
    { key: '2', date: '2024-02-19', department: '外科', materialName: '输液器', specification: '500ml', quantity: 30, unit: '个', operator: '李四', reason: '手术使用' },
    { key: '3', date: '2024-02-18', department: '儿科', materialName: '医用棉签', specification: '100支/包', quantity: 20, unit: '包', operator: '王五', reason: '日常消耗' },
  ];

  const columns = [
    { title: '消耗日期', dataIndex: 'date', key: 'date' },
    { title: '领用科室', dataIndex: 'department', key: 'department' },
    { title: '商品名称', dataIndex: 'materialName', key: 'materialName' },
    { title: '规格型号', dataIndex: 'specification', key: 'specification' },
    { title: '消耗数量', dataIndex: 'quantity', key: 'quantity' },
    { title: '单位', dataIndex: 'unit', key: 'unit' },
    { title: '操作人', dataIndex: 'operator', key: 'operator' },
    { title: '消耗原因', dataIndex: 'reason', key: 'reason' },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space size="middle">
          <a>查看</a>
        </Space>
      )
    },
  ];

  return (
    <div style={{ padding: '0 16px' }}>
      <h1 style={{ marginBottom: 24 }}>消耗明细查询</h1>
      
      <Card style={{ marginBottom: 16 }}>
        <Space wrap style={{ width: '100%' }}>
          <RangePicker placeholder={['开始日期', '结束日期']} style={{ flex: 1, minWidth: 200 }} />
          <Select placeholder="领用科室" style={{ flex: 1, minWidth: 150 }}>
            <Option value="all">全部科室</Option>
            <Option value="internal">内科</Option>
            <Option value="surgery">外科</Option>
            <Option value="pediatrics">儿科</Option>
          </Select>
          <Input placeholder="商品名称" style={{ flex: 1, minWidth: 150 }} />
          <Button type="primary" icon={<SearchOutlined />} style={{ minWidth: 100 }}>查询</Button>
        </Space>
      </Card>

      <div style={{ overflowX: 'auto' }}>
        <Table columns={columns} dataSource={consumptionDetails} pagination={{ 
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

export default StockOutDetail;
