import { Form, Input, Select, DatePicker, Button, Card, Row, Table, Checkbox, message } from 'antd';
import { useState } from 'react';




const StockInAccept = () => {
  const [form] = Form.useForm();
  const [productDetails, setProductDetails] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedProductKeys, setSelectedProductKeys] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  
  const handleStockIn = () => {
    // 验收入库数据处理
  };

  const handleSearch = () => {
    setSearchLoading(true);
    // 模拟搜索请求
    setTimeout(() => {
      const mockSearchResults = [
        { key: 'search1', productCode: 'PROD001', productName: '搜索结果商品A', specification: '规格A', registrationNumber: 'ZCBH001', supplier: '供应商A', manufacturer: '生产厂家A' },
        { key: 'search2', productCode: 'PROD002', productName: '搜索结果商品B', specification: '规格B', registrationNumber: 'ZCBH002', supplier: '供应商B', manufacturer: '生产厂家B' },
        { key: 'search3', productCode: 'PROD003', productName: '搜索结果商品C', specification: '规格C', registrationNumber: 'ZCBH003', supplier: '供应商C', manufacturer: '生产厂家C' },
      ];
      setSearchResults(mockSearchResults);
      setSearchLoading(false);
    }, 500);
  };

  const handleAddSelectedItems = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择要添加的商品');
      return;
    }

    const selectedItems = searchResults.filter(item => selectedRowKeys.includes(item.key));
    
    // 将选中的商品添加到商品明细表格
    const newProductDetails = [...productDetails];
    selectedItems.forEach(item => {
      // 生成新的唯一key，允许重复添加相同的商品
      const newKey = `${item.key}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      newProductDetails.push({
        key: newKey,
        productCode: item.productCode || '',
        productName: item.productName,
        specification: item.specification,
        spec: item.specification || '',
        model: (item.specification && item.specification.startsWith('规格')) ? item.specification.replace('规格', '型号') : item.specification || '',
        registrationNumber: item.registrationNumber || '',
        supplier: item.supplier || '',
        manufacturer: item.manufacturer || '',
        batchNumber: '', // 默认为空
        unit: '', // 默认为空
        quantity: 0, // 默认为0
        price: 0, // 默认为0
        amount: 0, // 默认为0
        productionDate: '', // 默认为空
        expirationDate: '', // 默认为空
        shelfLocation: '', // 默认为空
      });
    });
    
    setProductDetails(newProductDetails);
    
    // 清空选中的条目
    setSelectedRowKeys([]);
    
    message.success(`成功添加 ${selectedItems.length} 个商品到明细`);
  };

  const handleDeleteProduct = (key) => {
    const newProductDetails = productDetails.filter(item => item.key !== key);
    setProductDetails(newProductDetails);
    
    // 如果被删除的商品在选中列表中，也将其移除
    if (selectedProductKeys.includes(key)) {
      setSelectedProductKeys(selectedProductKeys.filter(k => k !== key));
    }
    
    message.success('商品已删除');
  };



  // 更新商品明细数据
  const handleUpdateProductDetail = (key, field, value) => {
    const newProductDetails = productDetails.map(item => {
      if (item.key === key) {
        const updatedItem = { ...item, [field]: value };
        
        // 如果更新了数量或单价，重新计算金额
        if (field === 'quantity' || field === 'price') {
          const quantity = field === 'quantity' ? value : item.quantity;
          const price = field === 'price' ? value : item.price;
          updatedItem.amount = quantity * price;
        }
        
        return updatedItem;
      }
      return item;
    });
    
    setProductDetails(newProductDetails);
  };



  // 商品明细表格列配置
  const productColumns = [
    { title: '物资编码', dataIndex: 'productCode', key: 'productCode', width: 120 },
    { title: '商品名称', dataIndex: 'productName', key: 'productName', width: 150 },
    { title: '规格', dataIndex: 'spec', key: 'spec', width: 120 },
    { 
      title: '型号', 
      dataIndex: 'model', 
      key: 'model', 
      width: 120,
      render: (text) => text || ''
    },
    { title: '注册证号', dataIndex: 'registrationNumber', key: 'registrationNumber', width: 150 },
    { title: '供应商', dataIndex: 'supplier', key: 'supplier', width: 120 },
    { title: '生产厂家', dataIndex: 'manufacturer', key: 'manufacturer', width: 150 },
    { 
      title: '批号', 
      dataIndex: 'batchNumber', 
      key: 'batchNumber', 
      width: 100,
      render: (text, record) => (
        <Input
          value={text}
          onChange={(e) => handleUpdateProductDetail(record.key, 'batchNumber', e.target.value)}
          placeholder="请输入批号"
          size="small"
        />
      )
    },
    { 
      title: '单位', 
      dataIndex: 'unit', 
      key: 'unit', 
      width: 60,
      render: (text, record) => (
        <Input
          value={text}
          onChange={(e) => handleUpdateProductDetail(record.key, 'unit', e.target.value)}
          placeholder="单位"
          size="small"
        />
      )
    },
    { 
      title: '数量', 
      dataIndex: 'quantity', 
      key: 'quantity', 
      width: 80, 
      align: 'right',
      render: (text, record) => (
        <Input
          type="number"
          value={text}
          onChange={(e) => handleUpdateProductDetail(record.key, 'quantity', parseFloat(e.target.value) || 0)}
          placeholder="0"
          size="small"
          style={{ textAlign: 'right' }}
        />
      )
    },
    { 
      title: '单价', 
      dataIndex: 'price', 
      key: 'price', 
      width: 80, 
      align: 'right',
      render: (text) => `¥${text.toFixed(2)}`
    },
    { 
      title: '金额', 
      dataIndex: 'amount', 
      key: 'amount', 
      width: 100, 
      align: 'right', 
      render: (text) => {
        // 确保text是数字，然后格式化
        const amount = typeof text === 'number' ? text : parseFloat(text) || 0;
        return `¥${amount.toFixed(2)}`;
      }
    },
    { 
      title: '生产日期', 
      dataIndex: 'productionDate', 
      key: 'productionDate', 
      width: 120,
      render: (text, record) => (
        <Input
          value={text}
          onChange={(e) => handleUpdateProductDetail(record.key, 'productionDate', e.target.value)}
          placeholder="YYYY-MM-DD"
          size="small"
        />
      )
    },
    { 
      title: '有效期至', 
      dataIndex: 'expirationDate', 
      key: 'expirationDate', 
      width: 120,
      render: (text, record) => (
        <Input
          value={text}
          onChange={(e) => handleUpdateProductDetail(record.key, 'expirationDate', e.target.value)}
          placeholder="YYYY-MM-DD"
          size="small"
        />
      )
    },
    { 
      title: '货架位置', 
      dataIndex: 'shelfLocation', 
      key: 'shelfLocation', 
      width: 100,
      render: (text, record) => (
        <Input
          value={text}
          onChange={(e) => handleUpdateProductDetail(record.key, 'shelfLocation', e.target.value)}
          placeholder="货架位置"
          size="small"
        />
      )
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Button type="link" size="small" danger onClick={() => handleDeleteProduct(record.key)}>
          删除
        </Button>
      ),
    }
  ];

  // 搜索结果表格列配置
  const searchResultColumns = [
    { title: '物资编码', dataIndex: 'productCode', key: 'productCode', width: 120 },
    { title: '商品名称', dataIndex: 'productName', key: 'productName', width: 150 },
    { title: '规格', dataIndex: 'specification', key: 'spec', width: 120 },
    { 
      title: '型号', 
      dataIndex: 'specification', 
      key: 'model', 
      width: 120,
      render: (text) => {
        // 将"规格X"转换为"型号X"
        if (text && text.startsWith('规格')) {
          return text.replace('规格', '型号');
        }
        return text || '';
      }
    },
    { title: '注册证号', dataIndex: 'registrationNumber', key: 'registrationNumber', width: 150 },
    { title: '供应商', dataIndex: 'supplier', key: 'supplier', width: 120 },
    { title: '生产厂家', dataIndex: 'manufacturer', key: 'manufacturer', width: 150 },
  ];

  return (
    <div style={{ padding: '0 16px' }}>
      <h1 style={{ marginBottom: 24 }}>验收入库</h1>
      
      <div style={{ marginBottom: 16 }}>
        <Button style={{ marginRight: 8 }}>查单据</Button>
        <Button onClick={() => form.resetFields()}>重置</Button>
      </div>
      
      <Card>
        <Form
          id="stockInForm"
          form={form}
          layout="vertical"
          onFinish={handleStockIn}
        >
          <Row gutter={16}>
            <Form.Item
              name="supplier"
              label="供应商"
              rules={[{ required: true, message: '请选择供应商' }]}
              xs={{ span: 24 }}
              sm={{ span: 12 }}
              md={{ span: 8 }}
              lg={{ span: 6 }}
            >
              <Select placeholder="请选择供应商">
                <Select.Option value="supplierA">供应商A</Select.Option>
                <Select.Option value="supplierB">供应商B</Select.Option>
                <Select.Option value="supplierC">供应商C</Select.Option>
              </Select>
            </Form.Item>
            
            <Form.Item
              name="warehouse"
              label="入库仓库"
              rules={[{ required: true, message: '请选择入库仓库' }]}
              xs={{ span: 24 }}
              sm={{ span: 12 }}
              md={{ span: 8 }}
              lg={{ span: 6 }}
            >
              <Select placeholder="请选择入库仓库">
                <Select.Option value="warehouse1">仓库1</Select.Option>
                <Select.Option value="warehouse2">仓库2</Select.Option>
                <Select.Option value="warehouse3">仓库3</Select.Option>
              </Select>
            </Form.Item>
            
            <Form.Item
              name="stockInDate"
              label="入库日期"
              xs={{ span: 24 }}
              sm={{ span: 12 }}
              md={{ span: 8 }}
              lg={{ span: 6 }}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
            
            <Form.Item
              name="operator"
              label="操作人"
              xs={{ span: 24 }}
              sm={{ span: 12 }}
              md={{ span: 8 }}
              lg={{ span: 6 }}
            >
              <Input placeholder="请输入操作人" />
            </Form.Item>
            
            <Form.Item
              name="materialName"
              label="商品名称"
              xs={{ span: 24 }}
              sm={{ span: 12 }}
              md={{ span: 8 }}
              lg={{ span: 6 }}
            >
              <Input placeholder="请输入商品名称" />
            </Form.Item>
            
            <Form.Item
              name="specification"
              label="规格型号"
              xs={{ span: 24 }}
              sm={{ span: 12 }}
              md={{ span: 8 }}
              lg={{ span: 6 }}
            >
              <Input placeholder="请输入规格型号" />
            </Form.Item>
            

            
            <Form.Item
              name="batchNumber"
              label="批号"
              xs={{ span: 24 }}
              sm={{ span: 12 }}
              md={{ span: 8 }}
              lg={{ span: 6 }}
            >
              <Input placeholder="请输入批号" />
            </Form.Item>
            
            <Form.Item
              name="expirationDate"
              label="有效期至"
              xs={{ span: 24 }}
              sm={{ span: 12 }}
              md={{ span: 8 }}
              lg={{ span: 6 }}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
            
            <Form.Item
              name="shelfLocation"
              label="货架位置"
              xs={{ span: 24 }}
              sm={{ span: 12 }}
              md={{ span: 8 }}
              lg={{ span: 6 }}
            >
              <Input placeholder="请输入货架位置" />
            </Form.Item>
          </Row>
          
          <div style={{ marginTop: 16, textAlign: 'right' }}>
            <Button onClick={() => handleSearch()} style={{ marginRight: 8 }}>查询</Button>
            <Button type="primary" onClick={handleAddSelectedItems} disabled={selectedRowKeys.length === 0}>
              添加
            </Button>
          </div>
        </Form>
        
        {/* 搜索结果表格 */}
        <div style={{ marginTop: 24 }}>
          <div style={{ marginBottom: 8, fontSize: 16, fontWeight: 'bold' }}>搜索结果</div>
          <Table
            columns={searchResultColumns}
            dataSource={searchResults}
            loading={searchLoading}
            pagination={{ pageSize: 5 }}
            scroll={{ x: 1700 }}
            locale={{ emptyText: '暂无搜索结果，请点击查询按钮进行搜索' }}
            rowSelection={{
              selectedRowKeys: selectedRowKeys,
              onChange: (newSelectedRowKeys) => {
                setSelectedRowKeys(newSelectedRowKeys);
              },
            }}
            onRow={(record) => ({
              onClick: () => {
                const key = record.key;
                if (selectedRowKeys.includes(key)) {
                  setSelectedRowKeys(selectedRowKeys.filter(k => k !== key));
                } else {
                  setSelectedRowKeys([...selectedRowKeys, key]);
                }
              },
            })}
          />
        </div>
      </Card>
      
      <Card title="商品明细" style={{ marginTop: 16 }}>

        <Table
          columns={productColumns}
          dataSource={productDetails}
          loading={false}
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
          scroll={{ x: 1700 }}
          rowSelection={{
            selectedRowKeys: selectedProductKeys,
            onChange: (newSelectedRowKeys) => {
              setSelectedProductKeys(newSelectedRowKeys);
            },
          }}
          onRow={(record) => ({
            onClick: () => {
              const key = record.key;
              if (selectedProductKeys.includes(key)) {
                setSelectedProductKeys(selectedProductKeys.filter(k => k !== key));
              } else {
                setSelectedProductKeys([...selectedProductKeys, key]);
              }
            },
          })}
          size="small"
        />
        
        {/* 金额合计 */}
        <div style={{ marginTop: 16, textAlign: 'right', fontSize: 16 }}>
          <span style={{ fontWeight: 'bold', marginRight: 8 }}>合计：</span>
          <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>
            ¥{productDetails.reduce((total, item) => total + (item.amount || 0), 0).toFixed(2)}
          </span>
        </div>
      </Card>
      
      <Card style={{ marginTop: 16 }}>
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item label="备注">
            <Input.TextArea rows={4} placeholder="请输入备注信息" />
          </Form.Item>
          <div style={{ marginTop: 16, textAlign: 'right' }}>
            <Button type="primary" htmlType="submit" form="stockInForm">
              确认入库
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default StockInAccept;
