import React from 'react';
import { Card, Table, DatePicker, Select, Button } from 'antd';
import { SearchOutlined, ExportOutlined } from '@ant-design/icons';

const { Option } = Select;


const { RangePicker } = DatePicker;

const ReportsStockInDetail = () => {
  const stockInDetails = [
    { key: '1', date: '2024-02-20', supplier: '供应商A', materialCode: 'WZ-001', materialName: '一次性注射器', specification: '10ml', model: 'A10', manufacturer: '厂商甲', registrationNumber: 'ZC-2024-001', batchNumber: 'PH20240201', productionDate: '2024-01-01', expiryDate: '2027-01-01', quantity: 1000, unit: '支', price: 0.57, purchaseOrderNo: 'CG-20240220-01', warehouse: '仓库1', department: '内科', status: '已入库', operator: '张三' },
    { key: '2', date: '2024-02-19', supplier: '供应商B', materialCode: 'WZ-002', materialName: '输液器', specification: '500ml', model: 'B05', manufacturer: '厂商乙', registrationNumber: 'ZC-2024-002', batchNumber: 'PH20240115', productionDate: '2024-01-15', expiryDate: '2026-12-31', quantity: 500, unit: '个', price: 3.2, purchaseOrderNo: 'CG-20240219-02', warehouse: '仓库2', department: '外科', status: '已入库', operator: '李四' },
    { key: '3', date: '2024-02-18', supplier: '供应商A', materialCode: 'WZ-003', materialName: '医用棉签', specification: '100支/包', model: 'C01', manufacturer: '厂商丙', registrationNumber: 'ZC-2024-003', batchNumber: 'PH20240108', productionDate: '2024-01-08', expiryDate: '2026-06-30', quantity: 200, unit: '包', price: 5.6, purchaseOrderNo: 'CG-20240218-03', warehouse: '仓库1', department: '儿科', status: '已入库', operator: '王五' },
  ];

  const columns = [
    { title: '入库日期', dataIndex: 'date', key: 'date' },
    { title: '供应商名称', dataIndex: 'supplier', key: 'supplier' },
    { title: '物资编码', dataIndex: 'materialCode', key: 'materialCode' },
    { title: '商品名称', dataIndex: 'materialName', key: 'materialName' },
    { title: '规格', dataIndex: 'specification', key: 'specification' },
    { title: '型号', dataIndex: 'model', key: 'model' },
    { title: '注册证号', dataIndex: 'registrationNumber', key: 'registrationNumber' },
    { title: '生产厂家', dataIndex: 'manufacturer', key: 'manufacturer' },
    { title: '生产批号', dataIndex: 'batchNumber', key: 'batchNumber' },
    { title: '生产日期', dataIndex: 'productionDate', key: 'productionDate' },
    { title: '失效日期', dataIndex: 'expiryDate', key: 'expiryDate' },
    { title: '采购价格', dataIndex: 'price', key: 'price', render: (value) => `¥${Number(value).toFixed(2)}` },
    { title: '入库数量', dataIndex: 'quantity', key: 'quantity' },
    { title: '单位', dataIndex: 'unit', key: 'unit' },
    { title: '采购单号', dataIndex: 'purchaseOrderNo', key: 'purchaseOrderNo' },
    { title: '申领科室', dataIndex: 'department', key: 'department' },
    { title: '入库仓库', dataIndex: 'warehouse', key: 'warehouse' },
    { title: '状态', dataIndex: 'status', key: 'status' },
    { title: '操作人', dataIndex: 'operator', key: 'operator' },
  ];

  return (
    <div style={{ padding: '0 16px' }}>
      <h1 style={{ marginBottom: 24 }}>仓库入库明细</h1>
      
      <Card style={{ marginBottom: 16, padding: '16px' }}>
        <div style={{ marginBottom: '16px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '8px', fontWeight: '500', minWidth: '80px' }}>日期范围：</span>
            <RangePicker placeholder={['开始日期', '结束日期']} style={{ width: '300px' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '8px', fontWeight: '500', minWidth: '80px' }}>供应商：</span>
            <Select placeholder="请选择供应商" style={{ width: '200px' }}>
              <Option value="all">全部供应商</Option>
              <Option value="supplierA">供应商A</Option>
              <Option value="supplierB">供应商B</Option>
            </Select>
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
        }} size="small" scroll={{ x: 2400 }} />
      </div>
    </div>
  );
};

export default ReportsStockInDetail;
