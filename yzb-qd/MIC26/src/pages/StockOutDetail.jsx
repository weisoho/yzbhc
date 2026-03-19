import React, { useState, useEffect } from 'react';
import { Space, Card, Table, Input, Select, DatePicker, Button, message, Form } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import api from '../utils/api';

const { Option } = Select;
const { RangePicker } = DatePicker;

const StockOutDetail = () => {
  const [consumptionDetails, setConsumptionDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [departments, setDepartments] = useState([]);
  const [form] = Form.useForm();

  // 加载科室列表
  const loadDepartments = async () => {
    try {
      const response = await api.get('/api/department/list');
      if (response.code === 1) {
        setDepartments(response.data || []);
      }
    } catch (error) {
      console.error('加载科室失败:', error);
    }
  };

  // 从后端获取出库单数据
  const fetchStockOutDetails = async (params = {}) => {
    setLoading(true);
    try {
      const queryParams = {
        pageNum: params.pageNum || currentPage,
        pageSize: params.pageSize || pageSize,
        ...params
      };

      // 处理日期范围
      if (queryParams.dateRange) {
        queryParams.startDate = queryParams.dateRange[0].format('YYYY-MM-DD');
        queryParams.endDate = queryParams.dateRange[1].format('YYYY-MM-DD');
        delete queryParams.dateRange;
      }

      const response = await api.get('/api/scm/stock-out/undo-list', queryParams);
      if (response.code === 1 && response.data) {
        // 为每个记录添加key属性
        const data = response.data.records.map((item, index) => ({
          ...item,
          key: item.id || index.toString(),
          date: item.outboundDate,
          department: item.departmentName,
          materialName: item.materialName,
          specification: item.specification,
          quantity: item.outboundQuantity,
          unit: item.unit,
          operator: item.operatorName,
          reason: item.reason
        }));
        setConsumptionDetails(data);
        setTotal(response.data.total || 0);
      } else {
        message.error(response.message || '获取出库单数据失败');
      }
    } catch (error) {
      console.error('获取出库单数据失败:', error);
      message.error('获取出库单数据失败，请检查网络连接或联系管理员');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDepartments();
    fetchStockOutDetails();
  }, []);

  const onSearch = (values) => {
    setCurrentPage(1);
    fetchStockOutDetails({ ...values, pageNum: 1 });
  };

  const onReset = () => {
    form.resetFields();
    setCurrentPage(1);
    fetchStockOutDetails({ pageNum: 1 });
  };

  const onPageChange = (page, pSize) => {
    setCurrentPage(page);
    setPageSize(pSize);
    const values = form.getFieldsValue();
    fetchStockOutDetails({ ...values, pageNum: page, pageSize: pSize });
  };

  const columns = [
    { title: '消耗日期', dataIndex: 'date', key: 'date', align: 'center' },
    { title: '领用科室', dataIndex: 'department', key: 'department', align: 'center' },
    { title: '商品名称', dataIndex: 'materialName', key: 'materialName', align: 'center' },
    { 
      title: '规格型号', 
      key: 'specModel', 
      align: 'center',
      render: (record) => `${record.specification || '-'} / ${record.model || '-'}`
    },
    { title: '消耗数量', dataIndex: 'quantity', key: 'quantity', align: 'center' },
    { title: '单位', dataIndex: 'unit', key: 'unit', align: 'center' },
    { title: '操作人', dataIndex: 'operator', key: 'operator', align: 'center' },
    { title: '消耗原因', dataIndex: 'reason', key: 'reason', align: 'center' },
    { 
      title: '操作', 
      key: 'action',
      align: 'center',
      render: () => (
        <Space size="middle">
          <Button type="link" size="small">查看</Button>
        </Space>
      )
    },
  ];

  return (
    <div style={{ padding: '0 16px' }}>
      <h1 style={{ marginBottom: 24, fontSize: '24px', fontWeight: 'bold' }}>消耗明细查询</h1>
      
      <Card style={{ marginBottom: 16 }}>
        <Form form={form} layout="inline" onFinish={onSearch}>
          <Form.Item name="dateRange">
            <RangePicker placeholder={['开始日期', '结束日期']} style={{ width: 280 }} />
          </Form.Item>
          <Form.Item name="departmentName">
            <Select placeholder="领用科室" style={{ width: 180 }} allowClear>
              {departments.map(dept => (
                <Option key={dept.id} value={dept.name}>{dept.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="materialName">
            <Input placeholder="商品名称" style={{ width: 220 }} prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>查询</Button>
              <Button onClick={onReset}>重置</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      <Table 
        columns={columns} 
        dataSource={consumptionDetails} 
        pagination={{ 
          total: total,
          current: currentPage,
          pageSize: pageSize,
          onChange: onPageChange,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条记录`,
        }} 
        loading={loading}
        rowKey="key"
        size="small"
        bordered
      />
    </div>
  );
};

export default StockOutDetail;
