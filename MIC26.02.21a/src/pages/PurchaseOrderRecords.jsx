import React, { useState } from 'react';
import { Card, Table, Button, Tag, Space, Input, Row, Col, Modal, Descriptions } from 'antd';
import { EyeOutlined, ExportOutlined, SearchOutlined } from '@ant-design/icons';

const PurchaseOrderRecords = () => {
  const [searchOrderNumber, setSearchOrderNumber] = useState('');
  const [detailVisible, setDetailVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);

  const columns = [
    { title: '采购单号', dataIndex: 'orderNumber', key: 'orderNumber', width: 150 },
    { title: '采购部门', dataIndex: 'department', key: 'department', width: 100 },
    { title: '申请时间', dataIndex: 'applyTime', key: 'applyTime', width: 160 },
    { title: '商品种类', dataIndex: 'productCount', key: 'productCount', width: 90, render: (value) => `${value} 种` },
    { title: '总金额', dataIndex: 'totalAmount', key: 'totalAmount', width: 100, render: (value) => `¥${value.toFixed(2)}` },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => {
        const colorMap = {
          'pending': 'orange',
          'approved': 'green',
          'rejected': 'red',
          'completed': 'blue'
        };
        const statusMap = {
          'pending': '待审核',
          'approved': '已审核',
          'rejected': '已驳回',
          'completed': '已完成'
        };
        return <Tag color={colorMap[status]}>{statusMap[status]}</Tag>;
      }
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
          >
            查看
          </Button>
        </Space>
      ),
    },
  ];

  const mockData = [
    {
      key: '1',
      orderNumber: 'PO070123202501',
      department: '运营组',
      applyTime: '2025-01-07 10:30:25',
      productCount: 3,
      totalAmount: 2850.00,
      status: 'pending',
      applicant: '张三',
      supplier: '医疗用品供应商A',
      warehouse: '仓库1',
      items: [
        { key: '1-1', productCode: 'PROD001', productName: '医用口罩', specification: 'N95 10只/盒', unit: '盒', quantity: 50, price: 25.00, amount: 1250.00 },
        { key: '1-2', productCode: 'PROD002', productName: '医用手套', specification: '乳胶 100只/盒', unit: '盒', quantity: 20, price: 30.00, amount: 600.00 },
        { key: '1-3', productCode: 'PROD003', productName: '消毒液', specification: '500ml/瓶', unit: '瓶', quantity: 100, price: 10.00, amount: 1000.00 },
      ],
      reason: '日常医疗物资补充',
      approver: null,
      approveTime: null,
      completeTime: null,
    },
    {
      key: '2',
      orderNumber: 'PO060123202501',
      department: '内科',
      applyTime: '2025-01-06 14:22:18',
      productCount: 5,
      totalAmount: 4560.50,
      status: 'approved',
      applicant: '李四',
      supplier: '医疗器械供应商B',
      warehouse: '仓库2',
      items: [
        { key: '2-1', productCode: 'PROD004', productName: '血压计', specification: '电子血压计', unit: '台', quantity: 5, price: 150.00, amount: 750.00 },
        { key: '2-2', productCode: 'PROD005', productName: '体温计', specification: '电子体温计', unit: '支', quantity: 20, price: 35.50, amount: 710.00 },
        { key: '2-3', productCode: 'PROD006', productName: '听诊器', specification: '双面听诊器', unit: '个', quantity: 10, price: 120.00, amount: 1200.00 },
        { key: '2-4', productCode: 'PROD007', productName: '血糖仪', specification: '便携式血糖仪', unit: '台', quantity: 8, price: 150.00, amount: 1200.00 },
        { key: '2-5', productCode: 'PROD008', productName: '试纸', specification: '血糖试纸50片/盒', unit: '盒', quantity: 10, price: 70.05, amount: 700.50 },
      ],
      reason: '内科诊疗设备更新',
      approver: '王五',
      approveTime: '2025-01-06 16:45:30',
      completeTime: null,
    },
    {
      key: '3',
      orderNumber: 'PO050123202501',
      department: '外科',
      applyTime: '2025-01-05 09:15:42',
      productCount: 2,
      totalAmount: 1230.00,
      status: 'completed',
      applicant: '赵六',
      supplier: '手术器械供应商C',
      warehouse: '仓库3',
      items: [
        { key: '3-1', productCode: 'PROD009', productName: '手术刀片', specification: '10号刀片 10片/盒', unit: '盒', quantity: 30, price: 25.00, amount: 750.00 },
        { key: '3-2', productCode: 'PROD010', productName: '缝合线', specification: '3-0 可吸收缝合线', unit: '包', quantity: 20, price: 24.00, amount: 480.00 },
      ],
      reason: '手术室常规耗材补充',
      approver: '孙七',
      approveTime: '2025-01-05 11:30:15',
      completeTime: '2025-01-07 14:20:00',
    },
  ];

  const handleSearch = () => {
    // 搜索单据号
  };

  const handleViewDetail = (record) => {
    setCurrentRecord(record);
    setDetailVisible(true);
  };

  const itemColumns = [
    { title: '商品编码', dataIndex: 'productCode', key: 'productCode', width: 120 },
    { title: '商品名称', dataIndex: 'productName', key: 'productName', width: 150 },
    { title: '规格型号', dataIndex: 'specification', key: 'specification', width: 150 },
    { title: '单位', dataIndex: 'unit', key: 'unit', width: 80 },
    { title: '数量', dataIndex: 'quantity', key: 'quantity', width: 80 },
    { title: '单价', dataIndex: 'price', key: 'price', width: 100, render: (value) => `¥${value.toFixed(2)}` },
    { title: '金额', dataIndex: 'amount', key: 'amount', width: 100, render: (value) => `¥${value.toFixed(2)}` },
  ];

  return (
    <div style={{ padding: '0 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ margin: 0 }}>采购申领记录</h1>
        <Button type="primary" icon={<ExportOutlined />}>
          导出
        </Button>
      </div>

      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16} align="middle">
          <Col>
            <Input
              placeholder="请输入单据号"
              style={{ width: 200 }}
              value={searchOrderNumber}
              onChange={(e) => setSearchOrderNumber(e.target.value)}
              onPressEnter={handleSearch}
            />
          </Col>
          <Col>
            <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
              搜索
            </Button>
          </Col>
        </Row>
      </Card>

      <Card>
        <Table
          columns={columns}
          dataSource={mockData}
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
          size="small"
        />
      </Card>

      <Modal
        title="采购申领单详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        width={1000}
        footer={[
          <Button key="close" onClick={() => setDetailVisible(false)}>
            关闭
          </Button>,
        ]}
      >
        {currentRecord && (
          <div>
            <Descriptions bordered column={2} size="small">
              <Descriptions.Item label="采购单号">{currentRecord.orderNumber}</Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color={
                  currentRecord.status === 'pending' ? 'orange' :
                  currentRecord.status === 'approved' ? 'green' :
                  currentRecord.status === 'rejected' ? 'red' : 'blue'
                }>
                  {currentRecord.status === 'pending' ? '待审核' :
                   currentRecord.status === 'approved' ? '已审核' :
                   currentRecord.status === 'rejected' ? '已驳回' : '已完成'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="采购部门">{currentRecord.department}</Descriptions.Item>
              <Descriptions.Item label="申请人">{currentRecord.applicant}</Descriptions.Item>
              <Descriptions.Item label="申请时间">{currentRecord.applyTime}</Descriptions.Item>
              <Descriptions.Item label="供应商">{currentRecord.supplier}</Descriptions.Item>
              <Descriptions.Item label="仓库">{currentRecord.warehouse}</Descriptions.Item>
              <Descriptions.Item label="商品种类">{currentRecord.productCount} 种</Descriptions.Item>
              <Descriptions.Item label="总金额">¥{currentRecord.totalAmount.toFixed(2)}</Descriptions.Item>
              <Descriptions.Item label="申请原因" span={2}>{currentRecord.reason}</Descriptions.Item>
              <Descriptions.Item label="审核人">{currentRecord.approver || '-'}</Descriptions.Item>
              <Descriptions.Item label="审核时间">{currentRecord.approveTime || '-'}</Descriptions.Item>
              <Descriptions.Item label="完成时间">{currentRecord.completeTime || '-'}</Descriptions.Item>
            </Descriptions>

            <div style={{ marginTop: 24 }}>
              <h4>商品明细</h4>
              <Table
                columns={itemColumns}
                dataSource={currentRecord.items}
                pagination={false}
                size="small"
                rowKey="key"
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PurchaseOrderRecords;
