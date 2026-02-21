import React from 'react';
import { Card, Button, Table, Space } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';

const InventoryCheckDiff = () => {
  const checkDetails = [
    { key: '1', materialName: '一次性注射器', specification: '10ml', shelf: 'A1-01', batchNumber: '20240201', systemQuantity: 500, actualQuantity: 498, difference: -2, reason: '损耗' },
    { key: '2', materialName: '输液器', specification: '500ml', shelf: 'B2-03', batchNumber: '20240202', systemQuantity: 300, actualQuantity: 300, difference: 0, reason: '' },
    { key: '3', materialName: '医用棉签', specification: '100支/包', shelf: 'C3-05', batchNumber: '20240203', systemQuantity: 150, actualQuantity: 155, difference: 5, reason: '盘盈' },
  ];

  const detailColumns = [
    { title: '商品名称', dataIndex: 'materialName', key: 'materialName' },
    { title: '规格型号', dataIndex: 'specification', key: 'specification' },
    { title: '货架位置', dataIndex: 'shelf', key: 'shelf' },
    { title: '批号', dataIndex: 'batchNumber', key: 'batchNumber' },
    { title: '系统数量', dataIndex: 'systemQuantity', key: 'systemQuantity' },
    { title: '实际数量', dataIndex: 'actualQuantity', key: 'actualQuantity' },
    {
      title: '差异',
      dataIndex: 'difference',
      key: 'difference',
      render: (difference) => (
        <span style={{ color: difference === 0 ? 'black' : difference > 0 ? 'red' : 'blue' }}>
          {difference > 0 ? '+' : ''}{difference}
        </span>
      )
    },
    { title: '差异原因', dataIndex: 'reason', key: 'reason' },
    {
      title: '确认',
      key: 'confirm',
      render: () => (
        <Space size="middle">
          <a style={{ color: 'green' }}><CheckOutlined />确认</a>
          <a style={{ color: 'red' }}><CloseOutlined />驳回</a>
        </Space>
      )
    },
  ];

  return (
    <div style={{ padding: '0 16px' }}>
      <h1 style={{ marginBottom: 24 }}>盘点损溢录入</h1>
      
      <Card>
        <div style={{ marginBottom: 16 }}>
          <h3>盘点表：PD20240220001</h3>
          <p>盘点仓库：仓库1 | 盘点日期：2024-02-20 | 盘点人：张三</p>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <Table 
            columns={detailColumns} 
            dataSource={checkDetails} 
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
            rowKey="key"
            size="small"
          />
        </div>
      
        <div style={{ marginTop: 16, textAlign: 'right' }}>
          <Space>
            <Button>保存</Button>
            <Button type="primary">提交审核</Button>
          </Space>
        </div>
      </Card>
    </div>
  );
};

export default InventoryCheckDiff;
