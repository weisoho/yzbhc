import { Form, Input, Select, DatePicker, Button, Table, Card, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useState } from 'react';

const { Option } = Select;

const StockInDetail = () => {
  const [form] = Form.useForm();
  const [filteredData, setFilteredData] = useState([]);
  const [showCatalog, setShowCatalog] = useState(false);

  const stockInDetails = [
    { key: '1', date: '2024-02-20', supplier: '供应商A', materialName: '一次性注射器', specification: '10ml', quantity: 1000, unit: '支', warehouse: '仓库1', operator: '张三' },
    { key: '2', date: '2024-02-19', supplier: '供应商B', materialName: '输液器', specification: '500ml', quantity: 500, unit: '个', warehouse: '仓库2', operator: '李四' },
    { key: '3', date: '2024-02-18', supplier: '供应商A', materialName: '医用棉签', specification: '100支/包', quantity: 200, unit: '包', warehouse: '仓库1', operator: '王五' },
    { key: '4', date: '2024-02-17', supplier: '供应商C', materialName: '医用口罩', specification: 'N95', quantity: 3000, unit: '个', warehouse: '仓库3', operator: '赵六' },
    { key: '5', date: '2024-02-16', supplier: '供应商A', materialName: '消毒液', specification: '500ml', quantity: 200, unit: '瓶', warehouse: '仓库1', operator: '张三' },
    { key: '6', date: '2024-02-15', supplier: '供应商B', materialName: '血压计', specification: '电子', quantity: 50, unit: '台', warehouse: '仓库2', operator: '李四' },
    { key: '7', date: '2024-02-14', supplier: '供应商C', materialName: '体温计', specification: '水银', quantity: 100, unit: '支', warehouse: '仓库3', operator: '赵六' },
    { key: '8', date: '2024-02-13', supplier: '供应商A', materialName: '手术手套', specification: '无菌', quantity: 500, unit: '副', warehouse: '仓库1', operator: '王五' },
    { key: '9', date: '2024-02-12', supplier: '供应商B', materialName: '纱布', specification: '10cm×10cm', quantity: 1000, unit: '片', warehouse: '仓库2', operator: '李四' },
    { key: '10', date: '2024-02-11', supplier: '供应商C', materialName: '注射器', specification: '5ml', quantity: 2000, unit: '支', warehouse: '仓库3', operator: '赵六' },
  ];

  const columns = [
    { title: '入库日期', dataIndex: 'date', key: 'date' },
    { title: '供应商', dataIndex: 'supplier', key: 'supplier' },
    { title: '商品名称', dataIndex: 'materialName', key: 'materialName' },
    { title: '规格型号', dataIndex: 'specification', key: 'specification' },
    { title: '入库数量', dataIndex: 'quantity', key: 'quantity' },
    { title: '单位', dataIndex: 'unit', key: 'unit' },
    { title: '入库仓库', dataIndex: 'warehouse', key: 'warehouse' },
    { title: '操作人', dataIndex: 'operator', key: 'operator' },
    { 
      title: '操作', 
      key: 'action',
      render: () => (
        <Space size="middle">
          <a>查看</a>
          <a>编辑</a>
        </Space>
      )
    },
  ];

  const catalogColumns = [
    { title: '商品名称', dataIndex: 'materialName', key: 'materialName' },
    { title: '规格型号', dataIndex: 'specification', key: 'specification' },
    { title: '单位', dataIndex: 'unit', key: 'unit' },
    { title: '供应商', dataIndex: 'supplier', key: 'supplier' },
    { title: '仓库', dataIndex: 'warehouse', key: 'warehouse' },
  ];

  const handleSearch = (values) => {
    let result = [...stockInDetails];

    // 按日期范围筛选
    if (values.searchDate) {
      const [startDate, endDate] = values.searchDate;
      result = result.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate >= startDate && itemDate <= endDate;
      });
    }

    // 按供应商筛选
    if (values.searchSupplier) {
      const supplierMap = {
        supplierA: '供应商A',
        supplierB: '供应商B',
        supplierC: '供应商C'
      };
      result = result.filter(item => item.supplier === supplierMap[values.searchSupplier]);
    }

    // 按商品名称筛选
    if (values.searchMaterial) {
      result = result.filter(item => 
        item.materialName.toLowerCase().includes(values.searchMaterial.toLowerCase())
      );
    }

    setFilteredData(result);
    setShowCatalog(true);
  };

  return (
    <div style={{ padding: '0 16px' }}>
      <h1 style={{ marginBottom: 24 }}>入库单查询</h1>
      
      <Card style={{ marginBottom: 16 }}>
        <Form form={form} layout="inline" onFinish={handleSearch} style={{ width: '100%' }}>
          <Space wrap style={{ width: '100%' }}>
            <Form.Item name="searchDate" label="日期范围" style={{ flex: 1, minWidth: 200 }}>
              <DatePicker.RangePicker style={{ width: '100%' }} />
            </Form.Item>
            
            <Form.Item name="searchSupplier" label="供应商" style={{ flex: 1, minWidth: 150 }}>
              <Select placeholder="请选择供应商" style={{ width: '100%' }}>
                <Option value="supplierA">供应商A</Option>
                <Option value="supplierB">供应商B</Option>
                <Option value="supplierC">供应商C</Option>
              </Select>
            </Form.Item>
            
            <Form.Item name="searchMaterial" label="商品名称" style={{ flex: 1, minWidth: 150 }}>
              <Input placeholder="请输入商品名称" style={{ width: '100%' }} />
            </Form.Item>
            
            <Form.Item style={{ minWidth: 100 }}>
              <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                查询
              </Button>
            </Form.Item>
          </Space>
        </Form>
      </Card>
      
      <div style={{ overflowX: 'auto', marginBottom: 24 }}>
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
        }} size="small" />
      </div>

      {showCatalog && (
        <Card title="目录明细表" style={{ marginBottom: 16 }}>
          <div style={{ overflowX: 'auto' }}>
            <Table columns={catalogColumns} dataSource={filteredData} pagination={{ 
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
        </Card>
      )}
    </div>
  );
};

export default StockInDetail;
