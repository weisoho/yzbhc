import React, { useState } from 'react';
import { Tabs, Table, Card, Input, Select, DatePicker, Button, Space, Tag, Row, Col } from 'antd';
import { SearchOutlined, EditOutlined, DeleteOutlined, ExportOutlined } from '@ant-design/icons';


const { RangePicker } = DatePicker;

const Inventory = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  // 库存明细数据
  const inventoryDetails = [
    { key: '1', materialName: '一次性注射器', specification: '10ml', warehouse: '仓库1', shelf: 'A1-01', batchNumber: '20240201', quantity: 500, unit: '支', productionDate: '2024-01-15', expirationDate: '2024-12-31' },
    { key: '2', materialName: '输液器', specification: '500ml', warehouse: '仓库2', shelf: 'B2-03', batchNumber: '20240202', quantity: 300, unit: '个', productionDate: '2024-01-20', expirationDate: '2024-11-30' },
    { key: '3', materialName: '医用棉签', specification: '100支/包', warehouse: '仓库1', shelf: 'C3-05', batchNumber: '20240203', quantity: 150, unit: '包', productionDate: '2024-02-01', expirationDate: '2024-10-31' },
    { key: '4', materialName: '酒精棉球', specification: '50g/瓶', warehouse: '仓库3', shelf: 'D4-02', batchNumber: '20231201', quantity: 80, unit: '瓶', productionDate: '2023-12-15', expirationDate: '2024-06-30' },
  ];

  // 库存明细列
  const inventoryColumns = [
    { title: '商品名称', dataIndex: 'materialName', key: 'materialName' },
    { title: '规格型号', dataIndex: 'specification', key: 'specification' },
    { title: '所属仓库', dataIndex: 'warehouse', key: 'warehouse' },
    { title: '货架位置', dataIndex: 'shelf', key: 'shelf' },
    { title: '批号', dataIndex: 'batchNumber', key: 'batchNumber' },
    { title: '库存数量', dataIndex: 'quantity', key: 'quantity' },
    { title: '单位', dataIndex: 'unit', key: 'unit' },
    { title: '生产日期', dataIndex: 'productionDate', key: 'productionDate' },
    { title: '有效期', dataIndex: 'expirationDate', key: 'expirationDate' },
    { 
      title: '操作', 
      key: 'action',
      render: () => (
        <Space size="middle">
          <a><EditOutlined />编辑</a>
          <a><DeleteOutlined />删除</a>
        </Space>
      )
    },
  ];

  // 批量修改审核列
  const batchAuditColumns = [
    { title: '申请编号', dataIndex: 'applyNumber', key: 'applyNumber' },
    { title: '商品名称', dataIndex: 'materialName', key: 'materialName' },
    { title: '规格型号', dataIndex: 'specification', key: 'specification' },
    { title: '修改类型', dataIndex: 'changeType', key: 'changeType', render: (type) => {
      const typeMap = {
        price: '价格调整',
        quantity: '数量调整',
        info: '信息修改'
      };
      return typeMap[type] || type;
    }},
    { title: '申请前值', dataIndex: 'beforeValue', key: 'beforeValue' },
    { title: '申请后值', dataIndex: 'afterValue', key: 'afterValue' },
    { title: '申请人', dataIndex: 'applicant', key: 'applicant' },
    { title: '申请时间', dataIndex: 'applyTime', key: 'applyTime' },
    { title: '审核状态', dataIndex: 'status', key: 'status', render: (status) => {
      const statusMap = {
        pending: <Tag color="orange">待审核</Tag>,
        approved: <Tag color="green">已通过</Tag>,
        rejected: <Tag color="red">已拒绝</Tag>
      };
      return statusMap[status] || status;
    }},
    { 
      title: '操作', 
      key: 'action',
      render: (record) => (
        <Space size="middle">
          {record.status === 'pending' && (
            <>
              <Button type="primary" size="small">通过</Button>
              <Button danger size="small">拒绝</Button>
            </>
          )}
          <a>查看详情</a>
        </Space>
      )
    },
  ];

  // 批量修改审核数据
  const batchAuditData = [
    { key: '1', applyNumber: 'BA20240601001', materialName: '一次性注射器', specification: '10ml', changeType: 'price', beforeValue: '2.5元', afterValue: '2.8元', applicant: '张三', applyTime: '2024-06-01 10:30', status: 'pending' },
    { key: '2', applyNumber: 'BA20240601002', materialName: '输液器', specification: '500ml', changeType: 'quantity', beforeValue: '500个', afterValue: '550个', applicant: '李四', applyTime: '2024-06-01 11:20', status: 'pending' },
    { key: '3', applyNumber: 'BA20240531001', materialName: '医用棉签', specification: '100支/包', changeType: 'info', beforeValue: '旧包装', afterValue: '新包装', applicant: '王五', applyTime: '2024-05-31 15:45', status: 'approved' },
    { key: '4', applyNumber: 'BA20240530001', materialName: '酒精棉球', specification: '50g/瓶', changeType: 'price', beforeValue: '3.0元', afterValue: '3.5元', applicant: '赵六', applyTime: '2024-05-30 09:15', status: 'rejected' },
  ];

  // 历史库存查询列
  const historicalInventoryColumns = [
    { title: '记录日期', dataIndex: 'recordDate', key: 'recordDate' },
    { title: '商品名称', dataIndex: 'materialName', key: 'materialName' },
    { title: '规格型号', dataIndex: 'specification', key: 'specification' },
    { title: '所属仓库', dataIndex: 'warehouse', key: 'warehouse' },
    { title: '库存数量', dataIndex: 'quantity', key: 'quantity' },
    { title: '单位', dataIndex: 'unit', key: 'unit' },
    { title: '操作类型', dataIndex: 'operationType', key: 'operationType', render: (type) => {
      const typeMap = {
        stockIn: <Tag color="green">入库</Tag>,
        stockOut: <Tag color="red">出库</Tag>,
        adjustment: <Tag color="blue">调整</Tag>
      };
      return typeMap[type] || type;
    }},
    { title: '操作人', dataIndex: 'operator', key: 'operator' },
    { title: '备注', dataIndex: 'remark', key: 'remark' },
  ];

  // 历史库存查询数据
  const historicalInventoryData = [
    { key: '1', recordDate: '2024-06-01', materialName: '一次性注射器', specification: '10ml', warehouse: '仓库1', quantity: 800, unit: '支', operationType: 'stockIn', operator: '张三', remark: '采购入库' },
    { key: '2', recordDate: '2024-05-31', materialName: '一次性注射器', specification: '10ml', warehouse: '仓库1', quantity: 600, unit: '支', operationType: 'stockOut', operator: '李四', remark: '销售出库' },
    { key: '3', recordDate: '2024-05-30', materialName: '输液器', specification: '500ml', warehouse: '仓库2', quantity: 500, unit: '个', operationType: 'stockIn', operator: '王五', remark: '采购入库' },
    { key: '4', recordDate: '2024-05-29', materialName: '医用棉签', specification: '100支/包', warehouse: '仓库1', quantity: 300, unit: '包', operationType: 'adjustment', operator: '赵六', remark: '库存调整' },
  ];

  // 商品调拨列
  const transferColumns = [
    { title: '调拨单号', dataIndex: 'transferNumber', key: 'transferNumber' },
    { title: '商品名称', dataIndex: 'materialName', key: 'materialName' },
    { title: '规格型号', dataIndex: 'specification', key: 'specification' },
    { title: '调出仓库', dataIndex: 'fromWarehouse', key: 'fromWarehouse' },
    { title: '调入仓库', dataIndex: 'toWarehouse', key: 'toWarehouse' },
    { title: '调拨数量', dataIndex: 'quantity', key: 'quantity' },
    { title: '单位', dataIndex: 'unit', key: 'unit' },
    { title: '调拨日期', dataIndex: 'transferDate', key: 'transferDate' },
    { title: '调拨人', dataIndex: 'transferor', key: 'transferor' },
    { title: '状态', dataIndex: 'status', key: 'status', render: (status) => {
      const statusMap = {
        pending: <Tag color="orange">待审核</Tag>,
        approved: <Tag color="blue">已审核</Tag>,
        completed: <Tag color="green">已完成</Tag>,
        canceled: <Tag color="red">已取消</Tag>
      };
      return statusMap[status] || status;
    }},
    { 
      title: '操作', 
      key: 'action',
      render: () => (
        <Space size="middle">
          <a>查看详情</a>
          <a>编辑</a>
          <a>取消</a>
        </Space>
      )
    },
  ];

  // 商品调拨数据
  const transferData = [
    { key: '1', transferNumber: 'TF20240601001', materialName: '一次性注射器', specification: '10ml', fromWarehouse: '仓库1', toWarehouse: '仓库2', quantity: 200, unit: '支', transferDate: '2024-06-01', transferor: '张三', status: 'completed' },
    { key: '2', transferNumber: 'TF20240601002', materialName: '输液器', specification: '500ml', fromWarehouse: '仓库2', toWarehouse: '仓库3', quantity: 100, unit: '个', transferDate: '2024-06-01', transferor: '李四', status: 'pending' },
    { key: '3', transferNumber: 'TF20240531001', materialName: '医用棉签', specification: '100支/包', fromWarehouse: '仓库1', toWarehouse: '仓库3', quantity: 50, unit: '包', transferDate: '2024-05-31', transferor: '王五', status: 'approved' },
    { key: '4', transferNumber: 'TF20240530001', materialName: '酒精棉球', specification: '50g/瓶', fromWarehouse: '仓库3', toWarehouse: '仓库1', quantity: 30, unit: '瓶', transferDate: '2024-05-30', transferor: '赵六', status: 'canceled' },
  ];

  // 库存货架维护列
  const shelfMaintenanceColumns = [
    { title: '货架编号', dataIndex: 'shelfNumber', key: 'shelfNumber' },
    { title: '所属仓库', dataIndex: 'warehouse', key: 'warehouse' },
    { title: '货架位置', dataIndex: 'location', key: 'location' },
    { title: '货架类型', dataIndex: 'type', key: 'type', render: (type) => {
      const typeMap = {
        normal: '普通货架',
        coldStorage: '冷藏货架',
        hazardous: '危险物品货架'
      };
      return typeMap[type] || type;
    }},
    { title: '最大容量', dataIndex: 'maxCapacity', key: 'maxCapacity' },
    { title: '当前容量', dataIndex: 'currentCapacity', key: 'currentCapacity' },
    { title: '状态', dataIndex: 'status', key: 'status', render: (status) => {
      const statusMap = {
        available: <Tag color="green">可用</Tag>,
        inUse: <Tag color="blue">使用中</Tag>,
        maintenance: <Tag color="orange">维护中</Tag>,
        disabled: <Tag color="red">停用</Tag>
      };
      return statusMap[status] || status;
    }},
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime' },
    { title: '备注', dataIndex: 'remark', key: 'remark' },
    { 
      title: '操作', 
      key: 'action',
      render: () => (
        <Space size="middle">
          <a><EditOutlined />编辑</a>
          <a><DeleteOutlined />删除</a>
          <a>查看详情</a>
        </Space>
      )
    },
  ];

  // 库存货架维护数据
  const shelfMaintenanceData = [
    { key: '1', shelfNumber: 'S001', warehouse: '仓库1', location: 'A1-01', type: 'normal', maxCapacity: 1000, currentCapacity: 800, status: 'inUse', createTime: '2024-01-01', remark: '普通药品货架' },
    { key: '2', shelfNumber: 'S002', warehouse: '仓库1', location: 'A1-02', type: 'normal', maxCapacity: 1000, currentCapacity: 600, status: 'inUse', createTime: '2024-01-01', remark: '普通药品货架' },
    { key: '3', shelfNumber: 'S003', warehouse: '仓库2', location: 'B2-01', type: 'coldStorage', maxCapacity: 500, currentCapacity: 300, status: 'inUse', createTime: '2024-01-02', remark: '冷藏药品货架' },
    { key: '4', shelfNumber: 'S004', warehouse: '仓库3', location: 'C3-01', type: 'hazardous', maxCapacity: 300, currentCapacity: 150, status: 'available', createTime: '2024-01-03', remark: '危险物品货架' },
  ];

  // 商品货位调整列
  const locationAdjustmentColumns = [
    { title: '调整单号', dataIndex: 'adjustmentNumber', key: 'adjustmentNumber' },
    { title: '商品名称', dataIndex: 'materialName', key: 'materialName' },
    { title: '规格型号', dataIndex: 'specification', key: 'specification' },
    { title: '批号', dataIndex: 'batchNumber', key: 'batchNumber' },
    { title: '原货位', dataIndex: 'oldLocation', key: 'oldLocation' },
    { title: '新货位', dataIndex: 'newLocation', key: 'newLocation' },
    { title: '调整数量', dataIndex: 'quantity', key: 'quantity' },
    { title: '单位', dataIndex: 'unit', key: 'unit' },
    { title: '调整日期', dataIndex: 'adjustmentDate', key: 'adjustmentDate' },
    { title: '调整人', dataIndex: 'adjuster', key: 'adjuster' },
    { title: '调整原因', dataIndex: 'reason', key: 'reason' },
    { 
      title: '操作', 
      key: 'action',
      render: () => (
        <Space size="middle">
          <a>查看详情</a>
          <a>完成</a>
          <a>取消</a>
        </Space>
      )
    },
  ];

  // 商品货位调整数据
  const locationAdjustmentData = [
    { key: '1', adjustmentNumber: 'AD20240601001', materialName: '一次性注射器', specification: '10ml', batchNumber: '20240201', oldLocation: '仓库1-A1-01', newLocation: '仓库1-A1-02', quantity: 100, unit: '支', adjustmentDate: '2024-06-01', adjuster: '张三', reason: '货位优化' },
    { key: '2', adjustmentNumber: 'AD20240601002', materialName: '输液器', specification: '500ml', batchNumber: '20240202', oldLocation: '仓库2-B2-03', newLocation: '仓库2-B2-04', quantity: 50, unit: '个', adjustmentDate: '2024-06-01', adjuster: '李四', reason: '整理库存' },
    { key: '3', adjustmentNumber: 'AD20240531001', materialName: '医用棉签', specification: '100支/包', batchNumber: '20240203', oldLocation: '仓库1-C3-05', newLocation: '仓库1-C3-06', quantity: 30, unit: '包', adjustmentDate: '2024-05-31', adjuster: '王五', reason: '货位调整' },
    { key: '4', adjustmentNumber: 'AD20240530001', materialName: '酒精棉球', specification: '50g/瓶', batchNumber: '20231201', oldLocation: '仓库3-D4-02', newLocation: '仓库3-D4-03', quantity: 20, unit: '瓶', adjustmentDate: '2024-05-30', adjuster: '赵六', reason: '分类调整' },
  ];

  // 近效期查询列
  const expiryColumns = [
    { title: '商品名称', dataIndex: 'materialName', key: 'materialName' },
    { title: '规格型号', dataIndex: 'specification', key: 'specification' },
    { title: '批号', dataIndex: 'batchNumber', key: 'batchNumber' },
    { title: '当前库存', dataIndex: 'currentStock', key: 'currentStock' },
    { title: '单位', dataIndex: 'unit', key: 'unit' },
    { title: '生产厂商', dataIndex: 'manufacturer', key: 'manufacturer' },
    { title: '生产批号', dataIndex: 'productionBatch', key: 'productionBatch' },
    { title: '生产日期', dataIndex: 'productionDate', key: 'productionDate' },
    { title: '有效期至', dataIndex: 'expiryDate', key: 'expiryDate', render: (date) => (
      <span style={{ color: '#f50' }}>{date}</span>
    )},
    { title: '剩余天数', dataIndex: 'remainingDays', key: 'remainingDays', render: (days) => {
      let color = '#52c41a';
      if (days <= 30) color = '#f50';
      else if (days <= 90) color = '#faad14';
      return <span style={{ color }}>{days}天</span>;
    }},
    { title: '仓库', dataIndex: 'warehouse', key: 'warehouse' },
    { title: '货位', dataIndex: 'location', key: 'location' },
    { 
      title: '操作', 
      key: 'action',
      render: () => (
        <Space size="middle">
          <a>查看详情</a>
          <a>预警设置</a>
        </Space>
      )
    },
  ];

  // 近效期查询数据
  const expiryData = [
    { key: '1', materialName: '阿莫西林胶囊', specification: '0.25g*24粒', batchNumber: '20230601', currentStock: 150, unit: '盒', manufacturer: 'XX制药厂', productionBatch: '2023060101', productionDate: '2023-06-01', expiryDate: '2024-06-01', remainingDays: 30, warehouse: '仓库1', location: 'A1-03' },
    { key: '2', materialName: '头孢拉定片', specification: '0.25g*24片', batchNumber: '20230501', currentStock: 200, unit: '盒', manufacturer: 'YY制药厂', productionBatch: '2023050102', productionDate: '2023-05-01', expiryDate: '2024-08-01', remainingDays: 90, warehouse: '仓库2', location: 'B2-05' },
    { key: '3', materialName: '布洛芬缓释胶囊', specification: '0.3g*12粒', batchNumber: '20230701', currentStock: 180, unit: '盒', manufacturer: 'ZZ制药厂', productionBatch: '2023070103', productionDate: '2023-07-01', expiryDate: '2024-07-01', remainingDays: 60, warehouse: '仓库1', location: 'A1-04' },
    { key: '4', materialName: '左氧氟沙星片', specification: '0.1g*12片', batchNumber: '20230401', currentStock: 120, unit: '盒', manufacturer: 'AA制药厂', productionBatch: '2023040104', productionDate: '2023-04-01', expiryDate: '2024-06-15', remainingDays: 45, warehouse: '仓库3', location: 'C3-06' },
  ];

  // 定义标签页内容
  const tabItems = [
    {
      key: '1',
      label: '库存明细查询',
      children: (
        <>
          <Card style={{ marginBottom: 16, padding: '16px' }}>
            <div style={{ marginBottom: '16px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '8px', fontWeight: '500', minWidth: '80px' }}>商品名称：</span>
                <Input placeholder="请输入商品名称" style={{ width: '200px' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '8px', fontWeight: '500', minWidth: '80px' }}>所属仓库：</span>
                <Select placeholder="请选择仓库" style={{ width: '200px' }}>
                  <Select.Option value="all">全部仓库</Select.Option>
                  <Select.Option value="warehouse1">仓库1</Select.Option>
                  <Select.Option value="warehouse2">仓库2</Select.Option>
                  <Select.Option value="warehouse3">仓库3</Select.Option>
                </Select>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '8px', fontWeight: '500', minWidth: '80px' }}>批号：</span>
                <Input placeholder="请输入批号" style={{ width: '200px' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '8px', fontWeight: '500', minWidth: '80px' }}>日期范围：</span>
                <RangePicker placeholder={['开始日期', '结束日期']} style={{ width: '300px' }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <Button type="primary" icon={<SearchOutlined />}>查询</Button>
              <Button icon={<ExportOutlined />}>导出</Button>
            </div>
          </Card>
          
          <div style={{ overflowX: 'auto' }}>
            <Table columns={inventoryColumns} dataSource={inventoryDetails} pagination={{ 
              current: currentPage,
              pageSize: pageSize,
              onChange: (page, size) => {
                setCurrentPage(page);
                setPageSize(size);
              },
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条记录`,
              size: "small",
              style: {
                display: "flex",
                justifyContent: "center",
                marginTop: "16px"
              }
            }} size="small" />
          </div>
        </>
      ),
    },
    {
      key: '2',
      label: '商品信息调整',
      children: (
        <>
          <Card style={{ marginBottom: 16, padding: '16px' }}>
            <div style={{ marginBottom: '16px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '8px', fontWeight: '500', minWidth: '80px' }}>商品名称：</span>
                <Input placeholder="请输入商品名称" style={{ width: '200px' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '8px', fontWeight: '500', minWidth: '80px' }}>所属仓库：</span>
                <Select placeholder="请选择仓库" style={{ width: '200px' }}>
                  <Select.Option value="all">全部仓库</Select.Option>
                  <Select.Option value="warehouse1">仓库1</Select.Option>
                  <Select.Option value="warehouse2">仓库2</Select.Option>
                  <Select.Option value="warehouse3">仓库3</Select.Option>
                </Select>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '8px', fontWeight: '500', minWidth: '80px' }}>批号：</span>
                <Input placeholder="请输入批号" style={{ width: '200px' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '8px', fontWeight: '500', minWidth: '80px' }}>日期范围：</span>
                <RangePicker placeholder={['开始日期', '结束日期']} style={{ width: '300px' }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <Button type="primary" icon={<SearchOutlined />}>查询</Button>
              <Button icon={<ExportOutlined />}>导出</Button>
            </div>
          </Card>
          
          <div style={{ overflowX: 'auto' }}>
            <Table columns={inventoryColumns} dataSource={inventoryDetails} pagination={{ 
              current: currentPage,
              pageSize: pageSize,
              onChange: (page, size) => {
                setCurrentPage(page);
                setPageSize(size);
              },
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条记录`,
              size: "small",
              style: {
                display: "flex",
                justifyContent: "center",
                marginTop: "16px"
              }
            }} size="small" />
          </div>
        </>
      ),
    },
    {
      key: '3',
      label: '批量修改审核',
      children: (
        <>
          <Card style={{ marginBottom: 16 }}>
            <Row gutter={[16, 0]} align="middle">
              <Col xs={24} sm={12} md={8} lg={6}>
                <Input placeholder="商品名称" style={{ width: '100%' }} />
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Select placeholder="修改类型" style={{ width: '100%' }}>
                  <Select.Option value="all">全部类型</Select.Option>
                  <Select.Option value="price">价格调整</Select.Option>
                  <Select.Option value="quantity">数量调整</Select.Option>
                  <Select.Option value="info">信息修改</Select.Option>
                </Select>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Select placeholder="审核状态" style={{ width: '100%' }}>
                  <Select.Option value="pending">待审核</Select.Option>
                  <Select.Option value="approved">已通过</Select.Option>
                  <Select.Option value="rejected">已拒绝</Select.Option>
                </Select>
              </Col>
              <Col xs={24} sm={12} md={12} lg={6}>
                <RangePicker placeholder={['申请日期', '申请日期']} style={{ width: '100%' }} />
              </Col>
              <Col xs={24} sm={12} md={12} lg={8}>
                <Space>
                  <Button type="primary" icon={<SearchOutlined />} style={{ minWidth: 100 }}>查询</Button>
                  <Button icon={<ExportOutlined />} style={{ minWidth: 100 }}>导出</Button>
                </Space>
              </Col>
            </Row>
          </Card>
          
          <div style={{ overflowX: 'auto' }}>
            <Table columns={batchAuditColumns} dataSource={batchAuditData} pagination={{ 
              current: currentPage,
              pageSize: pageSize,
              onChange: (page, size) => {
                setCurrentPage(page);
                setPageSize(size);
              },
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条记录`,
              size: "small",
              style: {
                display: "flex",
                justifyContent: "center",
                marginTop: "16px"
              }
            }} size="small" />
          </div>
        </>
      ),
    },
    {
      key: '4',
      label: '历史库存查询',
      children: (
        <>
          <Card style={{ marginBottom: 16 }}>
            <Row gutter={[16, 0]} align="middle">
              <Col xs={24} sm={12} md={8} lg={6}>
                <Input placeholder="商品名称" style={{ width: '100%' }} />
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Select placeholder="所属仓库" style={{ width: '100%' }}>
                  <Select.Option value="all">全部仓库</Select.Option>
                  <Select.Option value="warehouse1">仓库1</Select.Option>
                  <Select.Option value="warehouse2">仓库2</Select.Option>
                  <Select.Option value="warehouse3">仓库3</Select.Option>
                </Select>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Select placeholder="操作类型" style={{ width: '100%' }}>
                  <Select.Option value="all">全部类型</Select.Option>
                  <Select.Option value="stockIn">入库</Select.Option>
                  <Select.Option value="stockOut">出库</Select.Option>
                  <Select.Option value="adjustment">调整</Select.Option>
                </Select>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Select placeholder="有库存" style={{ width: '100%' }}>
                  <Select.Option value="all">全部</Select.Option>
                  <Select.Option value="inStock">有库存</Select.Option>
                  <Select.Option value="consumed">已消耗</Select.Option>
                </Select>
              </Col>
              <Col xs={24} sm={12} md={12} lg={6}>
                <RangePicker placeholder={['开始日期', '结束日期']} style={{ width: '100%' }} />
              </Col>
              <Col xs={24} sm={12} md={12} lg={8}>
                <Space>
                  <Button type="primary" icon={<SearchOutlined />} style={{ minWidth: 100 }}>查询</Button>
                  <Button icon={<ExportOutlined />} style={{ minWidth: 100 }}>导出</Button>
                </Space>
              </Col>
            </Row>
          </Card>
          
          <div style={{ overflowX: 'auto' }}>
            <Table columns={historicalInventoryColumns} dataSource={historicalInventoryData} pagination={{ 
              current: currentPage,
              pageSize: pageSize,
              onChange: (page, size) => {
                setCurrentPage(page);
                setPageSize(size);
              },
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条记录`,
              size: "small",
              style: {
                display: "flex",
                justifyContent: "center",
                marginTop: "16px"
              }
            }} size="small" />
          </div>
        </>
      ),
    },
    {
      key: '5',
      label: '商品调拨',
      children: (
        <>
          <Card style={{ marginBottom: 16 }}>
            <Row gutter={[16, 0]} align="middle">
              <Col xs={24} sm={12} md={8} lg={6}>
                <Input placeholder="商品名称" style={{ width: '100%' }} />
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Select placeholder="调出仓库" style={{ width: '100%' }}>
                  <Select.Option value="all">全部仓库</Select.Option>
                  <Select.Option value="warehouse1">仓库1</Select.Option>
                  <Select.Option value="warehouse2">仓库2</Select.Option>
                  <Select.Option value="warehouse3">仓库3</Select.Option>
                </Select>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Select placeholder="调入仓库" style={{ width: '100%' }}>
                  <Select.Option value="all">全部仓库</Select.Option>
                  <Select.Option value="warehouse1">仓库1</Select.Option>
                  <Select.Option value="warehouse2">仓库2</Select.Option>
                  <Select.Option value="warehouse3">仓库3</Select.Option>
                </Select>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Select placeholder="状态" style={{ width: '100%' }}>
                  <Select.Option value="all">全部状态</Select.Option>
                  <Select.Option value="pending">待审核</Select.Option>
                  <Select.Option value="approved">已审核</Select.Option>
                  <Select.Option value="completed">已完成</Select.Option>
                  <Select.Option value="canceled">已取消</Select.Option>
                </Select>
              </Col>
              <Col xs={24} sm={12} md={12} lg={8}>
                <Space>
                  <Button type="primary" icon={<SearchOutlined />} style={{ minWidth: 100 }}>查询</Button>
                  <Button type="default" style={{ minWidth: 100 }}>新建调拨</Button>
                  <Button icon={<ExportOutlined />} style={{ minWidth: 100 }}>导出</Button>
                </Space>
              </Col>
            </Row>
          </Card>
          
          <div style={{ overflowX: 'auto' }}>
            <Table columns={transferColumns} dataSource={transferData} pagination={{ 
              current: currentPage,
              pageSize: pageSize,
              onChange: (page, size) => {
                setCurrentPage(page);
                setPageSize(size);
              },
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条记录`,
              size: "small",
              style: {
                display: "flex",
                justifyContent: "center",
                marginTop: "16px"
              }
            }} size="small" />
          </div>
        </>
      ),
    },
    {
      key: '6',
      label: '库存货架维护',
      children: (
        <>
          <Card style={{ marginBottom: 16 }}>
            <Row gutter={[16, 0]} align="middle">
              <Col xs={24} sm={12} md={8} lg={6}>
                <Input placeholder="货架编号" style={{ width: '100%' }} />
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Select placeholder="所属仓库" style={{ width: '100%' }}>
                  <Select.Option value="all">全部仓库</Select.Option>
                  <Select.Option value="warehouse1">仓库1</Select.Option>
                  <Select.Option value="warehouse2">仓库2</Select.Option>
                  <Select.Option value="warehouse3">仓库3</Select.Option>
                </Select>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Select placeholder="货架类型" style={{ width: '100%' }}>
                  <Select.Option value="all">全部类型</Select.Option>
                  <Select.Option value="normal">普通货架</Select.Option>
                  <Select.Option value="coldStorage">冷藏货架</Select.Option>
                  <Select.Option value="hazardous">危险物品货架</Select.Option>
                </Select>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Select placeholder="状态" style={{ width: '100%' }}>
                  <Select.Option value="all">全部状态</Select.Option>
                  <Select.Option value="available">可用</Select.Option>
                  <Select.Option value="inUse">使用中</Select.Option>
                  <Select.Option value="maintenance">维护中</Select.Option>
                  <Select.Option value="disabled">停用</Select.Option>
                </Select>
              </Col>
              <Col xs={24} sm={12} md={12} lg={8}>
                <Space>
                  <Button type="primary" icon={<SearchOutlined />} style={{ minWidth: 100 }}>查询</Button>
                  <Button type="default" style={{ minWidth: 100 }}>新建货架</Button>
                  <Button icon={<ExportOutlined />} style={{ minWidth: 100 }}>导出</Button>
                </Space>
              </Col>
            </Row>
          </Card>
          
          <div style={{ overflowX: 'auto' }}>
            <Table columns={shelfMaintenanceColumns} dataSource={shelfMaintenanceData} pagination={{ 
              current: currentPage,
              pageSize: pageSize,
              onChange: (page, size) => {
                setCurrentPage(page);
                setPageSize(size);
              },
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条记录`,
              size: "small",
              style: {
                display: "flex",
                justifyContent: "center",
                marginTop: "16px"
              }
            }} size="small" />
          </div>
        </>
      ),
    },
    {
      key: '7',
      label: '商品货位调整（已弃置）',
      children: (
        <>
          <Card style={{ marginBottom: 16 }}>
            <Row gutter={[16, 0]} align="middle">
              <Col xs={24} sm={12} md={8} lg={6}>
                <Input placeholder="商品名称" style={{ width: '100%' }} />
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Input placeholder="批号" style={{ width: '100%' }} />
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Select placeholder="仓库" style={{ width: '100%' }}>
                  <Select.Option value="all">全部仓库</Select.Option>
                  <Select.Option value="warehouse1">仓库1</Select.Option>
                  <Select.Option value="warehouse2">仓库2</Select.Option>
                  <Select.Option value="warehouse3">仓库3</Select.Option>
                </Select>
              </Col>
              <Col xs={24} sm={12} md={12} lg={10}>
                <RangePicker style={{ width: '100%' }} placeholder={['开始日期', '结束日期']} />
              </Col>
              <Col xs={24} sm={12} md={12} lg={8}>
                <Space>
                  <Button type="primary" icon={<SearchOutlined />} style={{ minWidth: 100 }}>查询</Button>
                  <Button type="default" style={{ minWidth: 100 }}>新建调整</Button>
                  <Button icon={<ExportOutlined />} style={{ minWidth: 100 }}>导出</Button>
                </Space>
              </Col>
            </Row>
          </Card>
          
          <div style={{ overflowX: 'auto' }}>
            <Table columns={locationAdjustmentColumns} dataSource={locationAdjustmentData} pagination={{ 
              current: currentPage,
              pageSize: pageSize,
              onChange: (page, size) => {
                setCurrentPage(page);
                setPageSize(size);
              },
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条记录`,
              size: "small",
              style: {
                display: "flex",
                justifyContent: "center",
                marginTop: "16px"
              }
            }} size="small" />
          </div>
        </>
      ),
    },
    {
      key: '8',
      label: '消耗撤销',
      children: (
        <>
          <Card style={{ marginBottom: 16 }}>
            <Row gutter={[16, 0]} align="middle">
              <Col xs={24} sm={12} md={8} lg={6}>
                <Input placeholder="商品名称" style={{ width: '100%' }} />
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Input placeholder="批号" style={{ width: '100%' }} />
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Select placeholder="所属仓库" style={{ width: '100%' }}>
                  <Select.Option value="all">全部仓库</Select.Option>
                  <Select.Option value="warehouse1">仓库1</Select.Option>
                  <Select.Option value="warehouse2">仓库2</Select.Option>
                  <Select.Option value="warehouse3">仓库3</Select.Option>
                </Select>
              </Col>
              <Col xs={24} sm={12} md={12} lg={8}>
                <RangePicker style={{ width: '100%' }} placeholder={['开始日期', '结束日期']} />
              </Col>
              <Col xs={24} sm={12} md={12} lg={8}>
                <Space>
                  <Button type="primary" icon={<SearchOutlined />} style={{ minWidth: 100 }}>查询</Button>
                  <Button icon={<ExportOutlined />} style={{ minWidth: 100 }}>导出</Button>
                </Space>
              </Col>
            </Row>
          </Card>
          
          <div style={{ overflowX: 'auto' }}>
            <Table columns={inventoryColumns} dataSource={inventoryDetails} pagination={{ 
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
        </>
      ),
    },
    {
      key: '9',
      label: '近效期查询',
      children: (
        <>
          <Card style={{ marginBottom: 16 }}>
            <Row gutter={[16, 0]} align="middle">
              <Col xs={24} sm={12} md={8} lg={6}>
                <Input placeholder="商品名称" style={{ width: '100%' }} />
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Select placeholder="仓库" style={{ width: '100%' }}>
                  <Select.Option value="all">全部仓库</Select.Option>
                  <Select.Option value="warehouse1">仓库1</Select.Option>
                  <Select.Option value="warehouse2">仓库2</Select.Option>
                  <Select.Option value="warehouse3">仓库3</Select.Option>
                </Select>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Select placeholder="预警天数" style={{ width: '100%' }}>
                  <Select.Option value="30">30天内</Select.Option>
                  <Select.Option value="60">60天内</Select.Option>
                  <Select.Option value="90">90天内</Select.Option>
                  <Select.Option value="180">180天内</Select.Option>
                  <Select.Option value="expired">已过期</Select.Option>
                </Select>
              </Col>
              <Col xs={24} sm={12} md={12} lg={10}>
                <RangePicker style={{ width: '100%' }} placeholder={['生产日期', '有效期至']} />
              </Col>
              <Col xs={24} sm={12} md={12} lg={8}>
                <Space>
                  <Button type="primary" icon={<SearchOutlined />} style={{ minWidth: 100 }}>查询</Button>
                  <Button type="default" style={{ minWidth: 100 }}>预警设置</Button>
                  <Button icon={<ExportOutlined />} style={{ minWidth: 100 }}>导出</Button>
                </Space>
              </Col>
            </Row>
          </Card>
          
          <div style={{ overflowX: 'auto' }}>
            <Table columns={expiryColumns} dataSource={expiryData} pagination={{ 
              current: currentPage,
              pageSize: pageSize,
              onChange: (page, size) => {
                setCurrentPage(page);
                setPageSize(size);
              },
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条记录`,
              size: "small",
              style: {
                display: "flex",
                justifyContent: "center",
                marginTop: "16px"
              }
            }} size="small" />
          </div>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: '0 16px' }}>
      <h1 style={{ marginBottom: 24 }}>库存管理</h1>
      
      <Tabs defaultActiveKey="1" type="card" items={tabItems} />
    </div>
  );
};

export default Inventory;