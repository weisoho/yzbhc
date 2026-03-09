
import { useState } from 'react';
import { Card, Button, Table, Input, Space, Popconfirm, Modal, Form, Select, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';

const { Option } = Select;

const UDIMaintenance = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState('add'); // 'add' 或 'edit'
  const [currentRecord, setCurrentRecord] = useState(null);
  const [udiData, setUdiData] = useState([
    { key: '1', productCode: 'PRD001', productName: '一次性注射器', specification: '10ml', udiCode: 'UDI1234567890', udiType: '唯一码' },
    { key: '2', productCode: 'PRD002', productName: '输液器', specification: '500ml', udiCode: 'UDI0987654321', udiType: '唯一码' },
  ]);

  // 处理新增UDI按钮点击
  const handleAddUdi = () => {
    setModalType('add');
    form.resetFields();
    setIsModalVisible(true);
  };

  // 处理编辑按钮点击
  const handleEditUdi = (record) => {
    setModalType('edit');
    setCurrentRecord(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  // 处理表单提交
  const handleFormSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (modalType === 'add') {
        // 新增UDI
        const newKey = (udiData.length + 1).toString();
        const newUdi = {
          key: newKey,
          ...values
        };
        setUdiData([...udiData, newUdi]);
        message.success('UDI新增成功');
      } else {
        // 编辑UDI
        const updatedData = udiData.map(item => 
          item.key === currentRecord.key ? { ...item, ...values } : item
        );
        setUdiData(updatedData);
        message.success('UDI编辑成功');
      }
      
      setIsModalVisible(false);
      form.resetFields();
    } catch {
      // 表单验证失败
    }
  };

  // 处理删除UDI
  const handleDeleteUdi = (key) => {
    const newData = udiData.filter(item => item.key !== key);
    setUdiData(newData);
    message.success('UDI删除成功');
  };

  // 更新操作列的render函数
  const updatedColumns = [
    { title: '物资编码', dataIndex: 'productCode', key: 'productCode' },
    { title: '商品名称', dataIndex: 'productName', key: 'productName' },
    { title: '规格', dataIndex: 'specification', key: 'specification' },
    { title: 'UDI码', dataIndex: 'udiCode', key: 'udiCode' },
    { title: 'UDI类型', dataIndex: 'udiType', key: 'udiType' },
    { 
      title: '操作', 
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => handleEditUdi(record)}><EditOutlined />编辑</a>
          <Popconfirm
            title="确定要删除这个UDI吗？"
            onConfirm={() => handleDeleteUdi(record.key)}
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
      <h1 style={{ marginBottom: 24 }}>UDI维护</h1>
      
      <Card style={{ marginBottom: 16 }}>
        <Space wrap style={{ width: '100%' }}>
          <Input placeholder="商品名称" style={{ width: 200, minWidth: '120px' }} />
          <Input placeholder="UDI码" style={{ width: 200, minWidth: '120px' }} />
          <Button type="primary" icon={<SearchOutlined />}>查询</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddUdi}>
            新增UDI
          </Button>
        </Space>
      </Card>
      
      <div style={{ overflowX: 'auto' }}>
        <Table columns={updatedColumns} dataSource={udiData} pagination={{ 
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

      {/* 新增/编辑UDI弹窗 */}
      <Modal
        title={modalType === 'add' ? '新增UDI' : '编辑UDI'}
        open={isModalVisible}
        onOk={handleFormSubmit}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        okText={modalType === 'add' ? '新增' : '保存'}
        cancelText="取消"
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          name="udiForm"
        >
          <Form.Item
            name="productCode"
            label="物资编码"
            rules={[{ required: true, message: '请输入物资编码' }]}
          >
            <Input placeholder="请输入物资编码" />
          </Form.Item>

          <Form.Item
            name="productName"
            label="商品名称"
            rules={[{ required: true, message: '请输入商品名称' }]}
          >
            <Input placeholder="请输入商品名称" />
          </Form.Item>

          <Form.Item
            name="specification"
            label="规格"
            rules={[{ required: true, message: '请输入规格' }]}
          >
            <Input placeholder="请输入规格" />
          </Form.Item>

          <Form.Item
            name="udiCode"
            label="UDI码"
            rules={[{ required: true, message: '请输入UDI码' }]}
          >
            <Input placeholder="请输入UDI码" />
          </Form.Item>

          <Form.Item
            name="udiType"
            label="UDI类型"
            rules={[{ required: true, message: '请选择UDI类型' }]}
          >
            <Select placeholder="请选择UDI类型">
              <Option value="唯一码">唯一码</Option>
              <Option value="批次码">批次码</Option>
              <Option value="生产码">生产码</Option>
              <Option value="其他">其他</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UDIMaintenance;
