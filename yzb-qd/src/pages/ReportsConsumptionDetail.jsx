import React from 'react';
import { Card, Table, DatePicker, Select, Button } from 'antd';
import { SearchOutlined, ExportOutlined } from '@ant-design/icons';

const { Option } = Select;


const { RangePicker } = DatePicker;

const ReportsConsumptionDetail = () => {
  const consumptionDetails = [
    { key: '1', date: '2024-02-20', outboundNumber: 'CK-20240220-01', supplierName: '供应商A', materialCode: 'WZ-001', department: '内科', materialName: '一次性注射器', materialType: '注射类', specification: '10ml', model: 'A10', manufacturer: '厂商甲', registrationNumber: 'ZC-2024-001', batchNumber: 'PH20240201', productionDate: '2024-01-01', expiryDate: '2027-01-01', price: 0.57, quantity: 50, unit: '支', status: '已出库', operator: '张三', reason: '日常消耗' },
    { key: '2', date: '2024-02-19', outboundNumber: 'CK-20240219-02', supplierName: '供应商B', materialCode: 'WZ-002', department: '外科', materialName: '输液器', materialType: '输液类', specification: '500ml', model: 'B05', manufacturer: '厂商乙', registrationNumber: 'ZC-2024-002', batchNumber: 'PH20240115', productionDate: '2024-01-15', expiryDate: '2026-12-31', price: 3.2, quantity: 30, unit: '个', status: '已出库', operator: '李四', reason: '手术使用' },
    { key: '3', date: '2024-02-18', outboundNumber: 'CK-20240218-03', supplierName: '供应商A', materialCode: 'WZ-003', department: '儿科', materialName: '医用棉签', materialType: '护理类', specification: '100支/包', model: 'C01', manufacturer: '厂商丙', registrationNumber: 'ZC-2024-003', batchNumber: 'PH20240108', productionDate: '2024-01-08', expiryDate: '2026-06-30', price: 5.6, quantity: 20, unit: '包', status: '已出库', operator: '王五', reason: '日常消耗' },
  ];

  const columns = [
    { title: '消耗日期', dataIndex: 'date', key: 'date' },
    { title: '出库单号', dataIndex: 'outboundNumber', key: 'outboundNumber' },
    { title: '领用科室', dataIndex: 'department', key: 'department' },
    { title: '供应商名称', dataIndex: 'supplierName', key: 'supplierName' },
    { title: '物资编码', dataIndex: 'materialCode', key: 'materialCode' },
    { title: '商品名称', dataIndex: 'materialName', key: 'materialName' },
    { title: '物资类型', dataIndex: 'materialType', key: 'materialType' },
    { title: '规格', dataIndex: 'specification', key: 'specification' },
    { title: '型号', dataIndex: 'model', key: 'model' },
    { title: '注册证号', dataIndex: 'registrationNumber', key: 'registrationNumber' },
    { title: '生产厂家', dataIndex: 'manufacturer', key: 'manufacturer' },
    { title: '生产批号', dataIndex: 'batchNumber', key: 'batchNumber' },
    { title: '生产日期', dataIndex: 'productionDate', key: 'productionDate' },
    { title: '失效日期', dataIndex: 'expiryDate', key: 'expiryDate' },
    { title: '采购金额', dataIndex: 'price', key: 'price', render: (value) => `¥${Number(value).toFixed(2)}` },
    { title: '消耗数量', dataIndex: 'quantity', key: 'quantity' },
    { title: '单位', dataIndex: 'unit', key: 'unit' },
    { title: '状态', dataIndex: 'status', key: 'status' },
    { title: '操作人', dataIndex: 'operator', key: 'operator' },
    { title: '消耗原因', dataIndex: 'reason', key: 'reason' },
  ];

  return (
    <div style={{ padding: '0 16px' }}>
      <h1 style={{ marginBottom: 24 }}>仓库消耗明细</h1>
      
      <Card style={{ marginBottom: 16, padding: '16px' }}>
        <div style={{ marginBottom: '16px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '8px', fontWeight: '500', minWidth: '80px' }}>日期范围：</span>
            <RangePicker placeholder={['开始日期', '结束日期']} style={{ width: '300px' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '8px', fontWeight: '500', minWidth: '80px' }}>领用科室：</span>
            <Select placeholder="请选择领用科室" style={{ width: '200px' }}>
              <Option value="all">全部科室</Option>
              <Option value="internal">内科</Option>
              <Option value="surgery">外科</Option>
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
        }} size="small" scroll={{ x: 2600 }} />
      </div>
    </div>
  );
};

export default ReportsConsumptionDetail;
