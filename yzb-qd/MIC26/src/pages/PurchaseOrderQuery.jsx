import React, { useState } from 'react';
import { Card, Table, Input, Select, Space, Tag, Button, DatePicker, Modal, Descriptions } from 'antd';
import { SearchOutlined, ExportOutlined } from '@ant-design/icons';

const { Option } = Select;

const PurchaseOrderQuery = () => {
  const [detailVisible, setDetailVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);

  const departments = ['内科', '外科', '儿科', '妇产科', '急诊科'];
  const suppliers = ['供应商A', '供应商B', '供应商C'];

  const orders = [
    { 
      key: '1', 
      orderNo: 'PO-20241227-001', 
      department: '内科', 
      applicant: '张三', 
      product: '医用口罩', 
      quantity: 50, 
      unit: '盒', 
      price: 25.00, 
      totalAmount: 1250.00, 
      status: '待审核', 
      supplier: '供应商A', 
      warehouse: '仓库1', 
      createTime: '2024-12-27 09:30', 
      approveTime: null,
      productCount: 1,
      reason: '日常医疗物资补充',
      completeTime: null,
      items: [
        { key: '1-1', productCode: 'PROD001', productName: '医用口罩', specification: 'N95 10只/盒', unit: '盒', quantity: 50, price: 25.00, amount: 1250.00 },
      ]
    },
    { 
      key: '2', 
      orderNo: 'PO-20241227-002', 
      department: '外科', 
      applicant: '李四', 
      product: '一次性手套', 
      quantity: 100, 
      unit: '盒', 
      price: 15.00, 
      totalAmount: 1500.00, 
      status: '已审核', 
      supplier: '供应商B', 
      warehouse: '仓库1', 
      createTime: '2024-12-27 10:15', 
      approveTime: '2024-12-27 11:00',
      productCount: 1,
      reason: '手术室常规耗材补充',
      completeTime: null,
      items: [
        { key: '2-1', productCode: 'PROD002', productName: '一次性手套', specification: '乳胶 100只/盒', unit: '盒', quantity: 100, price: 15.00, amount: 1500.00 },
      ]
    },
    { 
      key: '3', 
      orderNo: 'PO-20241226-003', 
      department: '儿科', 
      applicant: '王五', 
      product: '消毒酒精', 
      quantity: 20, 
      unit: '瓶', 
      price: 18.00, 
      totalAmount: 360.00, 
      status: '已完成', 
      supplier: '供应商C', 
      warehouse: '仓库2', 
      createTime: '2024-12-26 14:20', 
      approveTime: '2024-12-26 15:00', 
      completeTime: '2024-12-26 18:00',
      productCount: 1,
      reason: '儿科消毒用品补充',
      items: [
        { key: '3-1', productCode: 'PROD003', productName: '消毒酒精', specification: '75% 500ml/瓶', unit: '瓶', quantity: 20, price: 18.00, amount: 360.00 },
      ]
    },
    { 
      key: '4', 
      orderNo: 'PO-20241226-004', 
      department: '急诊科', 
      applicant: '赵六', 
      product: '医用口罩', 
      quantity: 100, 
      unit: '盒', 
      price: 25.00, 
      totalAmount: 2500.00, 
      status: '已驳回', 
      supplier: '供应商A', 
      warehouse: '仓库1', 
      createTime: '2024-12-26 16:30', 
      approveTime: '2024-12-26 17:00',
      productCount: 1,
      reason: '急诊科物资补充',
      completeTime: null,
      items: [
        { key: '4-1', productCode: 'PROD001', productName: '医用口罩', specification: 'N95 10只/盒', unit: '盒', quantity: 100, price: 25.00, amount: 2500.00 },
      ]
    },
    { 
      key: '5', 
      orderNo: 'PO-20241225-005', 
      department: '外科', 
      applicant: '李四', 
      product: '一次性手套', 
      quantity: 200, 
      unit: '盒', 
      price: 15.00, 
      totalAmount: 3000.00, 
      status: '已完成', 
      supplier: '供应商B', 
      warehouse: '仓库3', 
      createTime: '2024-12-25 09:00', 
      approveTime: '2024-12-25 10:00', 
      completeTime: '2024-12-25 16:00',
      productCount: 1,
      reason: '手术室耗材补充',
      items: [
        { key: '5-1', productCode: 'PROD002', productName: '一次性手套', specification: '乳胶 100只/盒', unit: '盒', quantity: 200, price: 15.00, amount: 3000.00 },
      ]
    },
    { 
      key: '6', 
      orderNo: 'PO-20241225-006', 
      department: '内科', 
      applicant: '张三', 
      product: '消毒酒精', 
      quantity: 30, 
      unit: '瓶', 
      price: 18.00, 
      totalAmount: 540.00, 
      status: '已审核', 
      supplier: '供应商C', 
      warehouse: '仓库1', 
      createTime: '2024-12-25 11:30', 
      approveTime: '2024-12-25 14:00',
      productCount: 1,
      reason: '内科消毒用品补充',
      completeTime: null,
      items: [
        { key: '6-1', productCode: 'PROD003', productName: '消毒酒精', specification: '75% 500ml/瓶', unit: '瓶', quantity: 30, price: 18.00, amount: 540.00 },
      ]
    },
  ];

  const handleViewDetail = (record) => {
    setCurrentRecord(record);
    setDetailVisible(true);
  };

  const itemColumns = [
    { title: '物资编码', dataIndex: 'productCode', key: 'productCode', width: 120 },
    { title: '物资名称', dataIndex: 'productName', key: 'productName', width: 150 },
    { title: '物资类型', dataIndex: 'productType', key: 'productType', width: 100, render: (value) => value || '-' },
    { title: '规格', dataIndex: 'specification', key: 'specification', width: 120 },
    { title: '型号', dataIndex: 'model', key: 'model', width: 100, render: (value) => value || '-' },
    { title: '最小包装', dataIndex: 'minPackage', key: 'minPackage', width: 100, render: (value) => value || '-' },
    { title: '起订量', dataIndex: 'minOrder', key: 'minOrder', width: 100, render: (value) => value || '-' },
    { title: '单位', dataIndex: 'unit', key: 'unit', width: 80 },
    { title: '采购价格', dataIndex: 'price', key: 'price', width: 100, render: (value) => `¥${value.toFixed(2)}` },
    { title: '采购数量', dataIndex: 'quantity', key: 'quantity', width: 100 },
    { title: '注册证号', dataIndex: 'registrationNumber', key: 'registrationNumber', width: 150, render: (value) => value || '-' },
    { title: '供应商', dataIndex: 'supplier', key: 'supplier', width: 120, render: (value) => value || '-' },
    { title: '生产厂家', dataIndex: 'manufacturer', key: 'manufacturer', width: 150, render: (value) => value || '-' },
    { title: '创建日期', dataIndex: 'createDate', key: 'createDate', width: 120, render: (value) => value || '-' },
    { title: '审核日期', dataIndex: 'approveDate', key: 'approveDate', width: 120, render: (value) => value || '-' },
  ];

  const columns = [
    { title: '采购单号', dataIndex: 'orderNo', key: 'orderNo', fixed: 'left', width: 180 },
    { title: '状态', dataIndex: 'status', key: 'status', width: 100, render: (status) => {
      const colors = { '待审核': 'orange', '已审核': 'blue', '已驳回': 'red', '已完成': 'green' };
      return <Tag color={colors[status]}>{status}</Tag>;
    }},
    { title: '采购分院', dataIndex: 'department', key: 'department', width: 100 },
    { title: '申请人', dataIndex: 'applicant', key: 'applicant', width: 80 },
    { title: '物资名称', dataIndex: 'product', key: 'product', width: 120 },
    { title: '采购数量', dataIndex: 'quantity', key: 'quantity', width: 80, render: (qty, record) => `${qty} ${record.unit}` },
    { title: '采购价格', dataIndex: 'price', key: 'price', width: 100, render: (price) => `¥${price?.toFixed(2)}` },
    { title: '合计金额', dataIndex: 'totalAmount', key: 'totalAmount', width: 120, render: (amount) => `¥${amount?.toFixed(2)}` },
    { title: '创建日期', dataIndex: 'createTime', key: 'createTime', width: 160 },
    { title: '审核日期', dataIndex: 'approveTime', key: 'approveTime', width: 160, render: (time) => time || '-' },
    { title: '审核人', dataIndex: 'approveTime', key: 'approver', width: 80, render: (time) => time ? '管理员' : '-' },
    { 
      title: '操作', 
      key: 'action', 
      fixed: 'right', 
      width: 100, 
      render: (_, record) => (
        <Button type="link" size="small" onClick={() => handleViewDetail(record)}>
          详情
        </Button>
      ) 
    },
  ];

  return (
    <div style={{ padding: '0 16px' }}>
      <h1 style={{ marginBottom: 24 }}>采购订单查询</h1>
      
      <Card style={{ marginBottom: 16, padding: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ whiteSpace: 'nowrap' }}>采购单号：</span>
              <Input 
                placeholder="请输入采购单号" 
                allowClear
                style={{ width: 180 }}
                size="middle"
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ whiteSpace: 'nowrap' }}>物资名称：</span>
              <Input 
                placeholder="请输入物资名称" 
                allowClear
                style={{ width: 180 }}
                size="middle"
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ whiteSpace: 'nowrap' }}>状态：</span>
              <Select 
                placeholder="请选择状态" 
                allowClear
                style={{ width: 120 }}
                size="middle"
              >
                <Option value="已审核">已审核</Option>
                <Option value="已驳回">已驳回</Option>
              </Select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <Button 
              type="primary" 
              icon={<SearchOutlined />}
              style={{ minWidth: 90 }}
            >
              查询
            </Button>
            <Button 
              icon={<ExportOutlined />}
              style={{ minWidth: 90 }}
            >
              导出
            </Button>
          </div>
        </div>
      </Card>

      <Card>
        <Table 
          columns={columns} 
          dataSource={orders.filter(order => order.status === '已审核' || order.status === '已驳回')} 
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

      <Modal
        title="采购订单详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        width={1000}
        footer={[
          <Button key="close" onClick={() => setDetailVisible(false)}>
            关 闭
          </Button>,
        ]}
      >
        {currentRecord && (
          <div>
            <Descriptions bordered column={2} size="small">
              <Descriptions.Item label="采购单号">{currentRecord.orderNo}</Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color={
                  currentRecord.status === '待审核' ? 'orange' :
                  currentRecord.status === '已审核' ? 'blue' :
                  currentRecord.status === '已驳回' ? 'red' : 'green'
                }>
                  {currentRecord.status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="采购分院">{currentRecord.department}</Descriptions.Item>
              <Descriptions.Item label="申请人">{currentRecord.applicant}</Descriptions.Item>
              <Descriptions.Item label="创建日期">{currentRecord.createTime}</Descriptions.Item>
              <Descriptions.Item label="供应商">{currentRecord.supplier}</Descriptions.Item>
              <Descriptions.Item label="物资数量">{currentRecord.productCount} 种</Descriptions.Item>
              <Descriptions.Item label="总金额">¥{currentRecord.totalAmount.toFixed(2)}</Descriptions.Item>
              <Descriptions.Item label="申请原因">{currentRecord.reason}</Descriptions.Item>
              <Descriptions.Item label="审核人">{currentRecord.approveTime ? '管理员' : '-'}</Descriptions.Item>
              <Descriptions.Item label="审核时间">{currentRecord.approveTime || '-'}</Descriptions.Item>
              <Descriptions.Item label="完成时间">{currentRecord.completeTime || '-'}</Descriptions.Item>
            </Descriptions>

            <div style={{ marginTop: 24 }}>
              <h4>采购明细</h4>
              <Table
                columns={itemColumns}
                dataSource={currentRecord.items}
                pagination={false}
                size="small"
                rowKey="key"
                scroll={{ x: 1600 }}
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PurchaseOrderQuery;
