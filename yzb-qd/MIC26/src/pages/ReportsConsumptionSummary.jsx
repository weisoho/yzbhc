import React from 'react';
import { Card, Table, DatePicker, Select, Button } from 'antd';
import { SearchOutlined, ExportOutlined } from '@ant-design/icons';


const { RangePicker } = DatePicker;

const ReportsConsumptionSummary = () => {
  const consumptionSummary = [
    { key: '1', materialName: '一次性注射器', specification: '10ml', unit: '支', totalQuantity: 200, department: '内科' },
    { key: '2', materialName: '输液器', specification: '500ml', unit: '个', totalQuantity: 150, department: '外科' },
    { key: '3', materialName: '医用棉签', specification: '100支/包', unit: '包', totalQuantity: 80, department: '儿科' },
  ];

  const columns = [
    { title: '商品名称', dataIndex: 'materialName', key: 'materialName' },
    { title: '规格型号', dataIndex: 'specification', key: 'specification' },
    { title: '单位', dataIndex: 'unit', key: 'unit' },
    { title: '总消耗数量', dataIndex: 'totalQuantity', key: 'totalQuantity' },
    { title: '领用科室', dataIndex: 'department', key: 'department' },
  ];

  return (
    <div style={{ padding: '0 16px' }}>
      <h1 style={{ marginBottom: 24 }}>仓库消耗汇总</h1>
      
      <Card style={{ marginBottom: 16, padding: '16px' }}>
        <div style={{ marginBottom: '16px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '8px', fontWeight: '500', minWidth: '80px' }}>日期范围：</span>
            <RangePicker placeholder={['开始日期', '结束日期']} style={{ width: '300px' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '8px', fontWeight: '500', minWidth: '80px' }}>领用科室：</span>
            <Select placeholder="请选择领用科室" style={{ width: '200px' }}>
              <Select.Option value="all">全部科室</Select.Option>
              <Select.Option value="internal">内科</Select.Option>
              <Select.Option value="surgery">外科</Select.Option>
            </Select>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '8px', fontWeight: '500', minWidth: '80px' }}>仓库：</span>
            <Select placeholder="请选择仓库" style={{ width: '200px' }}>
              <Select.Option value="all">全部仓库</Select.Option>
              <Select.Option value="warehouse1">仓库1</Select.Option>
              <Select.Option value="warehouse2">仓库2</Select.Option>
            </Select>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button type="primary" icon={<SearchOutlined />}>查询</Button>
          <Button icon={<ExportOutlined />}>导出</Button>
        </div>
      </Card>
      
      <div style={{ overflowX: 'auto' }}>
        <Table columns={columns} dataSource={consumptionSummary} pagination={{ 
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

export default ReportsConsumptionSummary;
