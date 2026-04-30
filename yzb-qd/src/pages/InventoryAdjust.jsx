import React, { useState, useEffect } from 'react';
import { Table, Card, Input, Select, Button, Space, Tag, Row, Col, Modal, Form, message } from 'antd';
import { SearchOutlined, EditOutlined } from '@ant-design/icons';
import api from '../utils/api.js';



const InventoryAdjust = () => {
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [searchParams, setSearchParams] = useState({
    materialName: '',
    changeType: 'all',
    status: 'all'
  });
  const [inventoryData, setInventoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingInventory, setEditingInventory] = useState(null);

    // 加载库存数据
  const loadInventoryData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/scm/inventory');
      if (response.code === 1 && response.data) {
        const inventoryList = response.data.records.map(item => ({
          key: item.id,
          materialName: item.materialName,
          specification: item.specification,
          model: item.model,
          unit: item.unit,
          currentQuantity: item.quantity,
          minQuantity: item.minQuantity,
          maxQuantity: item.maxQuantity,
          status: item.status
        }));
        setInventoryData(inventoryList);
      } else {
        message.error(response.message || '加载库存数据失败');
      }
    } catch (error) {
      console.error('加载库存数据失败:', error);
      message.error('加载库存数据失败，请检查网络连接或联系管理员');
    } finally {
      setLoading(false);
    }
  };

  // 调整库存预警阈值
  const handleAdjustThreshold = async (inventoryId, values) => {
    try {
      setLoading(true);
      const requestData = {
        minQuantity: values.minQuantity,
        maxQuantity: values.maxQuantity
      };
      const response = await api.put(`/api/scm/inventory/${inventoryId}/adjust`, requestData);
      if (response.code === 1) {
        message.success('库存预警阈值调整成功');
        setModalVisible(false);
        form.resetFields();
        setEditingInventory(null);
        await loadInventoryData();
      } else {
        message.error(response.message || '调整失败');
      }
    } catch (error) {
      console.error('调整库存预警阈值失败:', error);
      message.error('调整失败，请检查网络连接或联系管理员');
    } finally {
      setLoading(false);
    }
  };

  // 组件加载时获取库存数据
  useEffect(() => {
    loadInventoryData();
  }, []);

  // 处理搜索输入变化
  const handleSearchChange = (field, value) => {
    setSearchParams(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 处理查询按钮点击
  const handleSearch = () => {
    // 这里可以根据搜索参数过滤数据或重新调用API
    loadInventoryData();
  };

  // 处理调整按钮点击
  const handleAdjust = (record) => {
    setEditingInventory(record);
    form.setFieldsValue({
      minQuantity: record.minQuantity,
      maxQuantity: record.maxQuantity
    });
    setModalVisible(true);
  };

  const batchAuditColumns = [
    { title: '序号', key: 'index', width: 60, render: (text, record, index) => index + 1 },
    { title: '商品名称', dataIndex: 'materialName', key: 'materialName', width: 150 },
    { title: '规格', dataIndex: 'specification', key: 'specification', width: 150 },
    { title: '型号', dataIndex: 'model', key: 'model', width: 150 },
    { title: '单位', dataIndex: 'unit', key: 'unit', width: 80 },
    { title: '当前库存', dataIndex: 'currentQuantity', key: 'currentQuantity', width: 100 },
    { title: '最低预警', dataIndex: 'minQuantity', key: 'minQuantity', width: 100 },
    { title: '最高预警', dataIndex: 'maxQuantity', key: 'maxQuantity', width: 100 },
    { title: '状态', dataIndex: 'status', key: 'status', width: 80, render: (status) => {
      return status === 'active' ? 
        <Tag color="green">正常</Tag> : 
        <Tag color="red">异常</Tag>;
    }},
    { 
      title: '操作', 
      key: 'action',
      width: 120,
      render: (record) => (
        <Space size="middle">
          <Button type="primary" size="small" onClick={() => handleAdjust(record)}>调整预警</Button>
        </Space>
      )
    },
  ];



  return (
    <div style={{ padding: '0 16px' }}>
      <h1 style={{ marginBottom: 24 }}>商品信息调整</h1>
      
      <Card style={{ marginBottom: 16, padding: '16px' }}>
        <div style={{ marginBottom: '16px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '8px', fontWeight: '500', minWidth: '80px' }}>商品名称：</span>
            <Input 
              placeholder="请输入商品名称" 
              style={{ width: '200px' }}
              value={searchParams.materialName}
              onChange={(e) => handleSearchChange('materialName', e.target.value)}
            />
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>查询</Button>
        </div>
      </Card>
      
      <div style={{ overflowX: 'auto' }}>
        <Table 
          columns={batchAuditColumns} 
          dataSource={inventoryData} 
          loading={loading}
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

      <Modal
        title="库存预警阈值调整"
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
          setEditingInventory(null);
        }}
        onOk={() => {
          form.validateFields().then((values) => {
            if (editingInventory) {
              handleAdjustThreshold(editingInventory.key, values);
            }
          });
        }}
      >
        <Form form={form} layout="vertical">
          {editingInventory && (
            <Form.Item label="商品信息">
              <div>{editingInventory.materialName} - {editingInventory.specification} - {editingInventory.model}</div>
            </Form.Item>
          )}
          <Form.Item name="minQuantity" label="最低预警数量" rules={[{ required: true, message: '请输入最低预警数量' }]}>
            <Input type="number" placeholder="请输入最低预警数量" />
          </Form.Item>
          <Form.Item name="maxQuantity" label="最高预警数量" rules={[{ required: true, message: '请输入最高预警数量' }]}>
            <Input type="number" placeholder="请输入最高预警数量" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default InventoryAdjust;
