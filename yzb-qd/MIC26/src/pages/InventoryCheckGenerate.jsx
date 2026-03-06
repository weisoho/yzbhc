import React from 'react';
import { Card, Button, Table, Form, Select, DatePicker, Input, Space } from 'antd';


const { Option } = Select;

const InventoryCheckGenerate = () => {
  const checkSheets = [
    { key: '1', sheetNumber: 'PD20240220001', warehouse: '仓库1', checkDate: '2024-02-20', checker: '张三', status: '已完成', difference: '无差异' },
    { key: '2', sheetNumber: 'PD20240215002', warehouse: '仓库2', checkDate: '2024-02-15', checker: '李四', status: '已完成', difference: '有差异' },
    { key: '3', sheetNumber: 'PD20240210003', warehouse: '仓库3', checkDate: '2024-02-10', checker: '王五', status: '待审核', difference: '有差异' },
  ];

  const sheetColumns = [
    { title: '盘点表编号', dataIndex: 'sheetNumber', key: 'sheetNumber' },
    { title: '盘点仓库', dataIndex: 'warehouse', key: 'warehouse' },
    { title: '盘点日期', dataIndex: 'checkDate', key: 'checkDate' },
    { title: '盘点人', dataIndex: 'checker', key: 'checker' },
    { title: '状态', dataIndex: 'status', key: 'status', render: (status) => <span style={{ color: status === '已完成' ? 'green' : 'blue' }}>{status}</span> },
    { title: '差异情况', dataIndex: 'difference', key: 'difference', render: (difference) => <span style={{ color: difference === '有差异' ? 'red' : 'green' }}>{difference}</span> },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space size="middle">
          <a>查看明细</a>
          <a>导出</a>
        </Space>
      )
    },
  ];

  return (
    <div style={{ padding: '0 16px' }}>
      <h1 style={{ marginBottom: 24 }}>盘点表生成</h1>
      
      <Card>
        <Form layout="inline" onFinish={() => {}} style={{ marginBottom: 16 }}>
          <Form.Item name="warehouse" label="盘点仓库" rules={[{ required: true, message: '请选择盘点仓库' }]}>
            <Select placeholder="请选择盘点仓库" style={{ width: 150 }}>
              <Option value="warehouse1">仓库1</Option>
              <Option value="warehouse2">仓库2</Option>
              <Option value="warehouse3">仓库3</Option>
            </Select>
          </Form.Item>
          
          <Form.Item name="checkDate" label="盘点日期" rules={[{ required: true, message: '请选择盘点日期' }]}>
            <DatePicker style={{ width: 150 }} />
          </Form.Item>
          
          <Form.Item name="checker" label="盘点人" rules={[{ required: true, message: '请输入盘点人' }]}>
            <Input placeholder="请输入盘点人" style={{ width: 150 }} />
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit">生成盘点表</Button>
          </Form.Item>
        </Form>
        
        <div style={{ overflowX: 'auto' }}>
          <Table 
            columns={sheetColumns} 
            dataSource={checkSheets} 
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
        </div>
      </Card>
    </div>
  );
};

export default InventoryCheckGenerate;
