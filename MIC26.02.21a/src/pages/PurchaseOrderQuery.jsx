import React from 'react';
import { Card, Table, Input, Select, Space, Tag, Button, DatePicker } from 'antd';
import { SearchOutlined, ExportOutlined } from '@ant-design/icons';

const { Option } = Select;
const { RangePicker } = DatePicker;

const PurchaseOrderQuery = () => {
  const departments = ['内科', '外科', '儿科', '妇产科', '急诊科'];
  const suppliers = ['供应商A', '供应商B', '供应商C'];

  const orders = [
    { key: '1', orderNo: 'PO-20241227-001', department: '内科', applicant: '张三', product: '医用口罩', quantity: 50, unit: '盒', price: 25.00, totalAmount: 1250.00, status: '待审核', supplier: '供应商A', warehouse: '仓库1', createTime: '2024-12-27 09:30', approveTime: null },
    { key: '2', orderNo: 'PO-20241227-002', department: '外科', applicant: '李四', product: '一次性手套', quantity: 100, unit: '盒', price: 15.00, totalAmount: 1500.00, status: '已审核', supplier: '供应商B', warehouse: '仓库1', createTime: '2024-12-27 10:15', approveTime: '2024-12-27 11:00' },
    { key: '3', orderNo: 'PO-20241226-003', department: '儿科', applicant: '王五', product: '消毒酒精', quantity: 20, unit: '瓶', price: 18.00, totalAmount: 360.00, status: '已完成', supplier: '供应商C', warehouse: '仓库2', createTime: '2024-12-26 14:20', approveTime: '2024-12-26 15:00', completeTime: '2024-12-26 18:00' },
    { key: '4', orderNo: 'PO-20241226-004', department: '急诊科', applicant: '赵六', product: '医用口罩', quantity: 100, unit: '盒', price: 25.00, totalAmount: 2500.00, status: '已驳回', supplier: '供应商A', warehouse: '仓库1', createTime: '2024-12-26 16:30', approveTime: '2024-12-26 17:00' },
    { key: '5', orderNo: 'PO-20241225-005', department: '外科', applicant: '李四', product: '一次性手套', quantity: 200, unit: '盒', price: 15.00, totalAmount: 3000.00, status: '已完成', supplier: '供应商B', warehouse: '仓库3', createTime: '2024-12-25 09:00', approveTime: '2024-12-25 10:00', completeTime: '2024-12-25 16:00' },
    { key: '6', orderNo: 'PO-20241225-006', department: '内科', applicant: '张三', product: '消毒酒精', quantity: 30, unit: '瓶', price: 18.00, totalAmount: 540.00, status: '已审核', supplier: '供应商C', warehouse: '仓库1', createTime: '2024-12-25 11:30', approveTime: '2024-12-25 14:00' },
  ];

  const columns = [
    { title: '订单编号', dataIndex: 'orderNo', key: 'orderNo', fixed: 'left', width: 180 },
    { title: '状态', dataIndex: 'status', key: 'status', width: 100, render: (status) => {
      const colors = { '待审核': 'orange', '已审核': 'blue', '已驳回': 'red', '已完成': 'green' };
      return <Tag color={colors[status]}>{status}</Tag>;
    }},
    { title: '申请部门', dataIndex: 'department', key: 'department', width: 100 },
    { title: '申请人', dataIndex: 'applicant', key: 'applicant', width: 80 },
    { title: '商品名称', dataIndex: 'product', key: 'product', width: 120 },
    { title: '数量', dataIndex: 'quantity', key: 'quantity', width: 80, render: (qty, record) => `${qty} ${record.unit}` },
    { title: '单价(元)', dataIndex: 'price', key: 'price', width: 100, render: (price) => `¥${price?.toFixed(2)}` },
    { title: '总价(元)', dataIndex: 'totalAmount', key: 'totalAmount', width: 120, render: (amount) => `¥${amount?.toFixed(2)}` },
    { title: '供应商', dataIndex: 'supplier', key: 'supplier', width: 100 },
    { title: '收货仓库', dataIndex: 'warehouse', key: 'warehouse', width: 100 },
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 160 },
    { title: '审核时间', dataIndex: 'approveTime', key: 'approveTime', width: 160, render: (time) => time || '-' },
    { title: '完成时间', dataIndex: 'completeTime', key: 'completeTime', width: 160, render: (time) => time || '-' },
    { title: '操作', key: 'action', fixed: 'right', width: 100, render: () => <Button type="link" size="small">详情</Button> },
  ];

  return (
    <div style={{ padding: '0 16px' }}>
      <h1 style={{ marginBottom: 24 }}>采购订单查询</h1>
      


      <Card style={{ marginBottom: 16 }}>
        <Space wrap>
          <Input placeholder="订单编号/商品名称" style={{ width: 200 }} />
          <Select placeholder="申请部门" style={{ width: 150 }} allowClear>
            {departments.map((dept, index) => (
              <Option key={index} value={dept}>{dept}</Option>
            ))}
          </Select>
          <Select placeholder="供应商" style={{ width: 150 }} allowClear>
            {suppliers.map((sup, index) => (
              <Option key={index} value={sup}>{sup}</Option>
            ))}
          </Select>
          <Select placeholder="状态" style={{ width: 120 }} allowClear>
            <Option value="pending">待审核</Option>
            <Option value="approved">已审核</Option>
            <Option value="completed">已完成</Option>
            <Option value="rejected">已驳回</Option>
          </Select>
          <RangePicker />
          <Button type="primary" icon={<SearchOutlined />}>查询</Button>
          <Button icon={<ExportOutlined />}>导出</Button>
        </Space>
      </Card>

      <Card>
        <Table 
          columns={columns} 
          dataSource={orders} 
          pagination={{ 
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
            style: {
              display: 'flex',
              justifyContent: 'center',
              marginTop: '16px'
            }
          }}
          scroll={{ x: 1600 }}
          size="small"
        />
      </Card>
    </div>
  );
};

export default PurchaseOrderQuery;
