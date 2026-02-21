import React from 'react';
import { Card, Table, DatePicker, Select, Button, Space } from 'antd';
import { SearchOutlined, ExportOutlined } from '@ant-design/icons';

const { Option } = Select;
const { RangePicker } = DatePicker;

const ReportsStockInDetail = () => {
  const stockInDetails = [
    { key: '1', date: '2024-02-20', supplier: '供应商A', materialName: '一次性注射器', specification: '10ml', quantity: 1000, unit: '支', warehouse: '仓库1', operator: '张三' },
    { key: '2', date: '2024-02-19', supplier: '供应商B', materialName: '输液器', specification: '500ml', quantity: 500, unit: '个', warehouse: '仓库2', operator: '李四' },
    { key: '3', date: '2024-02-18', supplier: '供应商A', materialName: '医用棉签', specification: '100支/包', quantity: 200, unit: '包', warehouse: '仓库1', operator: '王五' },
  ];

  const columns = [
    { title: '入库日期', dataIndex: 'date', key: 'date' },
    { title: '供应商', dataIndex: 'supplier', key: 'supplier' },
    { title: '商品名称', dataIndex: 'materialName', key: 'materialName' },
    { title: '规格型号', dataIndex: 'specification', key: 'specification' },
    { title: '入库数量', dataIndex: 'quantity', key: 'quantity' },
    { title: '单位', dataIndex: 'unit', key: 'unit' },
    { title: '入库仓库', dataIndex: 'warehouse', key: 'warehouse' },
    { title: '操作人', dataIndex: 'operator', key: 'operator' },
  ];

  return (
    <div style={{ padding: '0 16px' }}>
      <h1 style={{ marginBottom: 24 }}>仓库入库明细</h1>
      
      <Card style={{ marginBottom: 16 }}>
        <Space wrap style={{ width: '100%' }}>
          <RangePicker placeholder={['开始日期', '结束日期']} />
          <Select placeholder="供应商" style={{ minWidth: 120 }}>
            <Option value="all">全部供应商</Option>
            <Option value="supplierA">供应商A</Option>
            <Option value="supplierB">供应商B</Option>
          </Select>
          <Select placeholder="仓库" style={{ minWidth: 120 }}>
            <Option value="all">全部仓库</Option>
            <Option value="warehouse1">仓库1</Option>
            <Option value="warehouse2">仓库2</Option>
          </Select>
          <Button type="primary" icon={<SearchOutlined />}>查询</Button>
          <Button icon={<ExportOutlined />}>导出</Button>
        </Space>
      </Card>
      
      <div style={{ overflowX: 'auto' }}>
        <Table columns={columns} dataSource={stockInDetails} pagination={{ 
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

export default ReportsStockInDetail;
