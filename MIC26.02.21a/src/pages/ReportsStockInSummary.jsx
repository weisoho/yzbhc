import React from 'react';
import { Card, Table, DatePicker, Select, Button, Space } from 'antd';
import { SearchOutlined, ExportOutlined } from '@ant-design/icons';


const { RangePicker } = DatePicker;

const ReportsStockInSummary = () => {
  const stockInSummary = [
    { key: '1', materialName: '一次性注射器', specification: '10ml', unit: '支', totalQuantity: 1500, warehouse: '仓库1', supplier: '供应商A' },
    { key: '2', materialName: '输液器', specification: '500ml', unit: '个', totalQuantity: 800, warehouse: '仓库2', supplier: '供应商B' },
    { key: '3', materialName: '医用棉签', specification: '100支/包', unit: '包', totalQuantity: 500, warehouse: '仓库1', supplier: '供应商A' },
  ];

  const columns = [
    { title: '商品名称', dataIndex: 'materialName', key: 'materialName' },
    { title: '规格型号', dataIndex: 'specification', key: 'specification' },
    { title: '单位', dataIndex: 'unit', key: 'unit' },
    { title: '总入库数量', dataIndex: 'totalQuantity', key: 'totalQuantity' },
    { title: '入库仓库', dataIndex: 'warehouse', key: 'warehouse' },
    { title: '供应商', dataIndex: 'supplier', key: 'supplier' },
  ];

  return (
    <div style={{ padding: '0 16px' }}>
      <h1 style={{ marginBottom: 24 }}>仓库入库汇总</h1>
      
      <Card style={{ marginBottom: 16 }}>
        <Space wrap style={{ width: '100%' }}>
          <RangePicker placeholder={['开始日期', '结束日期']} />
          <Select placeholder="供应商" style={{ minWidth: 120 }}>
            <Select.Option value="all">全部供应商</Select.Option>
            <Select.Option value="supplierA">供应商A</Select.Option>
            <Select.Option value="supplierB">供应商B</Select.Option>
          </Select>
          <Select placeholder="仓库" style={{ minWidth: 120 }}>
            <Select.Option value="all">全部仓库</Select.Option>
            <Select.Option value="warehouse1">仓库1</Select.Option>
            <Select.Option value="warehouse2">仓库2</Select.Option>
          </Select>
          <Button type="primary" icon={<SearchOutlined />}>查询</Button>
          <Button icon={<ExportOutlined />}>导出</Button>
        </Space>
      </Card>
      
      <div style={{ overflowX: 'auto' }}>
        <Table columns={columns} dataSource={stockInSummary} pagination={{ 
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

export default ReportsStockInSummary;
