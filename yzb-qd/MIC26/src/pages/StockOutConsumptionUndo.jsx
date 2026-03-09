import React, { useState, useEffect } from 'react';
import { Card, Table, Input, DatePicker, Button, Space, Row, Col, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import api from '../utils/api';
const { RangePicker } = DatePicker;

const StockOutConsumptionUndo = () => {
  // 状态管理
  const [consumptionUndoData, setConsumptionUndoData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  // 获取撤销数据
  const fetchUndoData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/consumption/undo');
      setConsumptionUndoData(response.data || []);
    } catch (error) {
      message.error(`获取撤销数据失败: ${error.message || '未知错误'}`);
      // 使用模拟数据作为 fallback
      setConsumptionUndoData([
        { 
          key: '1', 
          materialCode: 'YLQ-001',
          materialName: '一次性注射器',
          materialType: '低值耗材',
          specification: '10ml',
          model: 'SYZ-10',
          batchNumber: 'BATCH-20240101',
          effectiveDate: '2024-01-01',
          expiryDate: '2026-01-01',
          unit: '支',
          outboundQuantity: 50,
          supplier: '医疗用品供应商',
          manufacturer: '医疗器械公司',
          operator: '张三',
          outboundReason: '日常消耗',
          outboundDate: '2024-02-20',
          status: '待撤销'
        },
        { 
          key: '2', 
          materialCode: 'YLQ-002',
          materialName: '输液器',
          materialType: '低值耗材',
          specification: '500ml',
          model: 'SYQ-500',
          batchNumber: 'BATCH-20240102',
          effectiveDate: '2024-01-01',
          expiryDate: '2026-01-01',
          unit: '个',
          outboundQuantity: 30,
          supplier: '医疗用品供应商',
          manufacturer: '医疗器械公司',
          operator: '李四',
          outboundReason: '手术使用',
          outboundDate: '2024-02-19',
          status: '已撤销'
        },
        { 
          key: '3', 
          materialCode: 'YLQ-003',
          materialName: '医用棉签',
          materialType: '低值耗材',
          specification: '100支/包',
          model: 'MQ-100',
          batchNumber: 'BATCH-20240103',
          effectiveDate: '2024-01-01',
          expiryDate: '2026-01-01',
          unit: '包',
          outboundQuantity: 20,
          supplier: '医疗用品供应商',
          manufacturer: '医疗器械公司',
          operator: '王五',
          outboundReason: '日常消耗',
          outboundDate: '2024-02-18',
          status: '待撤销'
        },
        { 
          key: '4', 
          materialCode: 'YLQ-004',
          materialName: '医用口罩',
          materialType: '低值耗材',
          specification: '一次性使用',
          model: 'KZ-001',
          batchNumber: 'BATCH-20240104',
          effectiveDate: '2024-01-01',
          expiryDate: '2026-01-01',
          unit: '个',
          outboundQuantity: 100,
          supplier: '医疗用品供应商',
          manufacturer: '医疗器械公司',
          operator: '赵六',
          outboundReason: '日常消耗',
          outboundDate: '2024-02-17',
          status: '待撤销'
        },
        { 
          key: '5', 
          materialCode: 'YLQ-005',
          materialName: '医用手套',
          materialType: '低值耗材',
          specification: '无菌',
          model: 'ST-001',
          batchNumber: 'BATCH-20240105',
          effectiveDate: '2024-01-01',
          expiryDate: '2026-01-01',
          unit: '双',
          outboundQuantity: 50,
          supplier: '医疗用品供应商',
          manufacturer: '医疗器械公司',
          operator: '孙七',
          outboundReason: '手术使用',
          outboundDate: '2024-02-16',
          status: '已撤销'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // 初始化数据
  useEffect(() => {
    fetchUndoData();
  }, []);

  // 确认撤销处理函数
  const handleConfirmUndo = async (record) => {
    try {
      setConfirmLoading(true);
      // 调用API确认撤销
      await api.put(`/api/consumption/undo/${record.materialCode}/${record.outboundDate}`, {
        status: '已撤销'
      });
      // 更新本地数据
      const updatedData = consumptionUndoData.map(item => {
        if (item.materialCode === record.materialCode && item.outboundDate === record.outboundDate) {
          return { ...item, status: '已撤销' };
        }
        return item;
      });
      setConsumptionUndoData(updatedData);
      message.success('已确认撤销');
    } catch (error) {
      message.error(`确认撤销失败: ${error.message || '未知错误'}`);
    } finally {
      setConfirmLoading(false);
    }
  };

  // 表格列配置
  const columns = [
    { title: '物资编码', dataIndex: 'materialCode', key: 'materialCode' },
    { title: '物资名称', dataIndex: 'materialName', key: 'materialName' },
    { title: '物资类型', dataIndex: 'materialType', key: 'materialType' },
    { title: '规格', dataIndex: 'specification', key: 'specification' },
    { title: '型号', dataIndex: 'model', key: 'model' },
    { title: '批号', dataIndex: 'batchNumber', key: 'batchNumber' },
    { title: '生效日期', dataIndex: 'effectiveDate', key: 'effectiveDate' },
    { title: '失效日期', dataIndex: 'expiryDate', key: 'expiryDate' },
    { title: '单位', dataIndex: 'unit', key: 'unit' },
    { title: '出库数量', dataIndex: 'outboundQuantity', key: 'outboundQuantity' },
    { title: '供应商', dataIndex: 'supplier', key: 'supplier' },
    { title: '生产厂家', dataIndex: 'manufacturer', key: 'manufacturer' },
    { title: '操作人', dataIndex: 'operator', key: 'operator' },
    { title: '出库原因', dataIndex: 'outboundReason', key: 'outboundReason' },
    { title: '出库日期', dataIndex: 'outboundDate', key: 'outboundDate' },
    { title: '状态', dataIndex: 'status', key: 'status' },
    { 
      title: '操作', 
      key: 'action', 
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="primary" 
            size="small" 
            disabled={record.status === '已撤销'}
            loading={confirmLoading}
            onClick={() => handleConfirmUndo(record)}
          >
            确认撤销
          </Button>
        </Space>
      ) 
    },
  ];

  return (
    <div style={{ padding: '0 16px' }}>
      <h1 style={{ marginBottom: 24 }}>消耗撤销</h1>
      
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={6} lg={6}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ whiteSpace: 'nowrap' }}>物资编码：</span>
              <Input placeholder="请输入物资编码" style={{ flex: 1 }} />
            </div>
          </Col>
          <Col xs={24} sm={12} md={6} lg={6}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ whiteSpace: 'nowrap' }}>物资名称：</span>
              <Input placeholder="请输入物资名称" style={{ flex: 1 }} />
            </div>
          </Col>
          <Col xs={24} sm={12} md={6} lg={6}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ whiteSpace: 'nowrap' }}>供应商：</span>
              <Input placeholder="请输入供应商" style={{ flex: 1 }} />
            </div>
          </Col>
          <Col xs={24} sm={12} md={6} lg={6}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ whiteSpace: 'nowrap' }}>生产厂家：</span>
              <Input placeholder="请输入生产厂家" style={{ flex: 1 }} />
            </div>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ whiteSpace: 'nowrap' }}>时间：</span>
              <RangePicker style={{ flex: 1 }} placeholder={['开始日期', '结束日期']} />
            </div>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="primary" icon={<SearchOutlined />} style={{ minWidth: 100 }}>查询</Button>
          </Col>
        </Row>
      </Card>
      
      <div style={{ overflowX: 'auto' }}>
        <Table 
          columns={columns.map(column => ({
            ...column,
            ellipsis: false,
            align: 'center',
            onHeaderCell: () => ({
              style: {
                whiteSpace: 'nowrap'
              }
            }),
            onCell: () => ({
              style: {
                whiteSpace: 'nowrap'
              }
            })
          }))} 
          dataSource={consumptionUndoData} 
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
          scroll={{ x: 1600 }}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default StockOutConsumptionUndo;