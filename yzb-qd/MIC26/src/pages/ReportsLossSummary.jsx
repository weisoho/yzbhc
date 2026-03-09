import React from 'react';
import { Card, Table, DatePicker, Select, Button } from 'antd';
import { SearchOutlined, ExportOutlined } from '@ant-design/icons';

const { Option } = Select;


const { RangePicker } = DatePicker;

const ReportsLossSummary = () => {
  const lossSummary = [
    { key: '1', materialName: '一次性注射器', specification: '10ml', unit: '支', beginningInventory: 500, monthlyPurchase: 1000, monthlyInventory: 1200, loss: 300, lossRate: '20%' },
    { key: '2', materialName: '输液器', specification: '500ml', unit: '个', beginningInventory: 300, monthlyPurchase: 500, monthlyInventory: 650, loss: 150, lossRate: '18.75%' },
    { key: '3', materialName: '医用棉签', specification: '100支/包', unit: '包', beginningInventory: 150, monthlyPurchase: 200, monthlyInventory: 280, loss: 70, lossRate: '20%' },
  ];

  const columns = [
    { title: '商品名称', dataIndex: 'materialName', key: 'materialName' },
    { title: '规格型号', dataIndex: 'specification', key: 'specification' },
    { title: '单位', dataIndex: 'unit', key: 'unit' },
    { title: '上月盘点量', dataIndex: 'beginningInventory', key: 'beginningInventory' },
    { title: '本月订货量', dataIndex: 'monthlyPurchase', key: 'monthlyPurchase' },
    { title: '本月盘点量', dataIndex: 'monthlyInventory', key: 'monthlyInventory' },
    { title: '损耗总量', dataIndex: 'loss', key: 'loss' },
    { title: '损耗率', dataIndex: 'lossRate', key: 'lossRate', render: (rate) => <span style={{ color: 'red' }}>{rate}</span> },
  ];

  return (
    <div style={{ padding: '0 16px' }}>
      <h1 style={{ marginBottom: 24 }}>损耗汇总</h1>
      
      <Card style={{ marginBottom: 16, padding: '16px' }}>
        <div style={{ marginBottom: '16px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '8px', fontWeight: '500', minWidth: '80px' }}>日期范围：</span>
            <RangePicker placeholder={['开始日期', '结束日期']} style={{ width: '300px' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '8px', fontWeight: '500', minWidth: '80px' }}>仓库：</span>
            <Select placeholder="请选择仓库" style={{ width: '200px' }}>
              <Option value="all">全部仓库</Option>
              <Option value="warehouse1">仓库1</Option>
              <Option value="warehouse2">仓库2</Option>
            </Select>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button type="primary" icon={<SearchOutlined />}>查询</Button>
          <Button icon={<ExportOutlined />}>导出</Button>
        </div>
      </Card>
      
      <div style={{ overflowX: 'auto' }}>
        <Table columns={columns} dataSource={lossSummary} pagination={{ 
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

export default ReportsLossSummary;
