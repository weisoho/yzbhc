import React, { useState, useEffect } from 'react';
import { Card, Table, Input, DatePicker, Button, Space, Row, Col, message, Form, Modal, Select } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import api from '../utils/api';
const { RangePicker } = DatePicker;

const StockOutConsumptionUndo = () => {
  // 状态管理
  const [consumptionUndoData, setConsumptionUndoData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [form] = Form.useForm();
  
  // 撤销弹窗相关
  const [undoModalVisible, setUndoModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [undoForm] = Form.useForm();

  // 获取撤销数据
  const fetchUndoData = async (params = {}) => {
    try {
      setLoading(true);
      const queryParams = {
        pageNum: params.pageNum || currentPage,
        pageSize: params.pageSize || pageSize,
        ...params
      };
      
      const response = await api.get('/api/scm/stock-out/undo-list', queryParams);
      if (response.code === 1 && response.data) {
        setConsumptionUndoData(response.data.records || []);
        setTotal(response.data.total || 0);
      }
    } catch (error) {
      console.error('获取撤销数据失败:', error);
      message.error(`获取撤销数据失败: ${error.message || '未知错误'}`);
    } finally {
      setLoading(false);
    }
  };

  // 初始化数据
  useEffect(() => {
    fetchUndoData();
  }, []);

  // 打开撤销弹窗
  const showUndoModal = (record) => {
    setCurrentRecord(record);
    setUndoModalVisible(true);
    undoForm.resetFields();
  };

  // 确认撤销处理函数
  const handleConfirmUndo = async () => {
    try {
      const values = await undoForm.validateFields();
      setConfirmLoading(true);
      
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      const operatorName = userInfo.realName || userInfo.userName || '管理员';
      
      const undoData = {
        operatorName: operatorName,
        reason: values.reason
      };
      
      // 调用API确认撤销
      const response = await api.post(`/api/scm/stock-out/undo?materialCode=${currentRecord.materialCode}&outboundDate=${currentRecord.outboundDate}`, undoData);
      
      if (response.code === 1) {
        message.success('已确认撤销');
        setUndoModalVisible(false);
        fetchUndoData(); // 刷新数据
      } else {
        message.error(response.message || '确认撤销失败');
      }
    } catch (error) {
      console.error('确认撤销失败:', error);
      message.error(`确认撤销失败: ${error.message || '未知错误'}`);
    } finally {
      setConfirmLoading(false);
    }
  };

  // 搜索处理函数
  const handleSearch = (values) => {
    setCurrentPage(1);
    const searchParams = {
      materialCode: values.materialCode,
      materialName: values.materialName,
      supplier: values.supplier,
      manufacturer: values.manufacturer,
      undoStatus: values.undoStatus,
      startDate: values.dateRange ? values.dateRange[0].format('YYYY-MM-DD') : undefined,
      endDate: values.dateRange ? values.dateRange[1].format('YYYY-MM-DD') : undefined,
      pageNum: 1
    };
    fetchUndoData(searchParams);
  };

  // 重置
  const handleReset = () => {
    form.resetFields();
    setCurrentPage(1);
    fetchUndoData({ pageNum: 1 });
  };

  // 分页变化
  const handlePageChange = (page, pSize) => {
    setCurrentPage(page);
    setPageSize(pSize);
    const values = form.getFieldsValue();
    handleSearch({ ...values, pageNum: page, pageSize: pSize });
  };

  // 表格列配置
  const columns = [
    { title: '物资编码', dataIndex: 'materialCode', key: 'materialCode' },
    { title: '物资名称', dataIndex: 'materialName', key: 'materialName' },
    { title: '物资类型', dataIndex: 'materialType', key: 'materialType' },
    { title: '规格', dataIndex: 'specification', key: 'specification' },
    { title: '型号', dataIndex: 'model', key: 'model' },
    { title: '批号', dataIndex: 'batchNumber', key: 'batchNumber' },
    { title: '生产日期', dataIndex: 'productionDate', key: 'productionDate' },
    { title: '有效期', dataIndex: 'expiryDate', key: 'expiryDate' },
    { title: '单位', dataIndex: 'unit', key: 'unit' },
    { title: '出库数量', dataIndex: 'outboundQuantity', key: 'outboundQuantity' },
    { title: '单价', dataIndex: 'unitPrice', key: 'unitPrice', render: (val) => val ? `￥${val}` : '-' },
    { title: '供应商', dataIndex: 'supplier', key: 'supplier' },
    { title: '生产厂家', dataIndex: 'manufacturer', key: 'manufacturer' },
    { title: '出库日期', dataIndex: 'outboundDate', key: 'outboundDate' },
    { 
      title: '状态', 
      dataIndex: 'undoStatus', 
      key: 'undoStatus',
      render: (status) => {
        let color = status === '可撤销' ? 'blue' : 'gray';
        if (status === '已撤销') color = 'red';
        return <span style={{ color }}>{status}</span>;
      }
    },
    { 
      title: '操作', 
      key: 'action', 
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="primary" 
            size="small" 
            disabled={record.undoStatus !== '可撤销'}
            onClick={() => showUndoModal(record)}
          >
            确认撤销
          </Button>
        </Space>
      ) 
    },
  ];

  return (
    <div style={{ padding: '0 16px' }}>
      <h1 style={{ marginBottom: 24, fontSize: '24px', fontWeight: 'bold' }}>消耗撤销</h1>
      
      <Card style={{ marginBottom: 16 }}>
        <Form form={form} layout="inline" onFinish={handleSearch}>
          <Form.Item name="materialCode">
            <Input placeholder="物资编码" style={{ width: 150 }} allowClear />
          </Form.Item>
          <Form.Item name="materialName">
            <Input placeholder="物资名称" style={{ width: 150 }} allowClear />
          </Form.Item>
          <Form.Item name="supplier">
            <Input placeholder="供应商" style={{ width: 150 }} allowClear />
          </Form.Item>
          <Form.Item name="undoStatus">
            <Select placeholder="状态" style={{ width: 120 }} allowClear>
              <Select.Option value="可撤销">可撤销</Select.Option>
              <Select.Option value="已撤销">已撤销</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="dateRange">
            <RangePicker placeholder={['开始日期', '结束日期']} style={{ width: 260 }} allowClear />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" icon={<SearchOutlined />} htmlType="submit">查询</Button>
              <Button icon={<ReloadOutlined />} onClick={handleReset}>重置</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
      
      <Table 
        columns={columns.map(column => ({
          ...column,
          align: 'center',
          onHeaderCell: () => ({ style: { whiteSpace: 'nowrap' } }),
          onCell: () => ({ style: { whiteSpace: 'nowrap' } })
        }))} 
        dataSource={consumptionUndoData} 
        pagination={{ 
          total: total,
          current: currentPage,
          pageSize: pageSize,
          onChange: handlePageChange,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条记录`,
        }} 
        size="small"
        scroll={{ x: 1800 }}
        loading={loading}
        rowKey="id"
        bordered
      />

      <Modal
        title="确认撤销出库"
        open={undoModalVisible}
        onOk={handleConfirmUndo}
        onCancel={() => setUndoModalVisible(false)}
        confirmLoading={confirmLoading}
        destroyOnClose
      >
        <Form form={undoForm} layout="vertical">
          <div style={{ marginBottom: 16 }}>
            <p><strong>物资名称：</strong>{currentRecord?.materialName}</p>
            <p><strong>物资编码：</strong>{currentRecord?.materialCode}</p>
            <p><strong>出库日期：</strong>{currentRecord?.outboundDate}</p>
            <p><strong>出库数量：</strong>{currentRecord?.outboundQuantity} {currentRecord?.unit}</p>
          </div>
          <Form.Item
            name="reason"
            label="撤销原因"
            rules={[{ required: true, message: '请输入撤销原因' }]}
          >
            <Input.TextArea rows={4} placeholder="请输入撤销原因，如：录入错误、病人退货等" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default StockOutConsumptionUndo;