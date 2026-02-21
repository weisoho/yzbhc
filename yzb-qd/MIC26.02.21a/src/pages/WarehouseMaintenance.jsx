
import { Card, Button, Table, Input, Space, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';

const WarehouseMaintenance = () => {
  const warehouses = [
    { key: '1', name: '仓库1', location: 'A栋1楼', manager: '张三', capacity: '1000平方米' },
    { key: '2', name: '仓库2', location: 'B栋2楼', manager: '李四', capacity: '800平方米' },
    { key: '3', name: '仓库3', location: 'C栋3楼', manager: '王五', capacity: '500平方米' },
  ];

  const columns = [
    { title: '仓库名称', dataIndex: 'name', key: 'name' },
    { title: '位置', dataIndex: 'location', key: 'location' },
    { title: '负责人', dataIndex: 'manager', key: 'manager' },
    { title: '容量', dataIndex: 'capacity', key: 'capacity' },
    { 
      title: '操作', 
      key: 'action',
      render: () => (
        <Space size="middle">
          <a><EditOutlined />编辑</a>
          <Popconfirm
            title="确定要删除这个仓库吗？"
            onConfirm={() => { /* 删除仓库处理 */ }}
            okText="确定"
            cancelText="取消"
          >
            <a style={{ color: 'red' }}><DeleteOutlined />删除</a>
          </Popconfirm>
        </Space>
      )
    },
  ];

  return (
    <div style={{ padding: '0 16px' }}>
      <h1 style={{ marginBottom: 24 }}>货位维护</h1>
      
      <Card style={{ marginBottom: 16 }}>
        <Space wrap style={{ width: '100%' }}>
          <Input placeholder="仓库名称" style={{ width: 200, minWidth: '120px' }} />
          <Input placeholder="位置" style={{ width: 150, minWidth: '100px' }} />
          <Button type="primary" icon={<SearchOutlined />}>查询</Button>
          <Button type="primary" icon={<PlusOutlined />}>
            新增仓库
          </Button>
        </Space>
      </Card>
      
      <div style={{ overflowX: 'auto' }}>
        <Table columns={columns} dataSource={warehouses} pagination={{ 
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

export default WarehouseMaintenance;
