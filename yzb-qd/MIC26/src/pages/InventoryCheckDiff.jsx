import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Space, message } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import api from '../utils/api';

const InventoryCheckDiff = () => {
  const [checkDetails, setCheckDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [checkSheetId, setCheckSheetId] = useState('PD20240220001'); // 假设从URL参数或其他方式获取
  const [checkSheetInfo, setCheckSheetInfo] = useState({});

  // 加载盘点差异数据
  const loadCheckDiffData = async () => {
    try {
      setLoading(true);
      // 根据checkSheetId调用对应的API
      const response = await api.get(`/api/scm/inventory/check/${checkSheetId}/details`);
      if (response.code === 1 && response.data) {
        setCheckDetails(response.data.records || []);
      } else {
        message.error(response.message || '加载盘点差异数据失败');
      }
    } catch (error) {
      console.error('加载盘点差异数据失败:', error);
      message.error('加载盘点差异数据失败，请检查网络连接或联系管理员');
    } finally {
      setLoading(false);
    }
  };

  // 加载盘点表信息
  const loadCheckSheetInfo = async () => {
    try {
      const response = await api.get(`/api/scm/inventory/check/${checkSheetId}`);
      if (response.code === 1 && response.data) {
        setCheckSheetInfo(response.data);
      }
    } catch (error) {
      console.error('加载盘点表信息失败:', error);
    }
  };

  // 提交盘点结果
  const handleSubmit = async () => {
    try {
      setLoading(true);
      const response = await api.post(`/api/scm/inventory/check/${checkSheetId}/submit`, checkDetails);
      if (response.code === 1) {
        message.success('盘点结果提交成功');
      } else {
        message.error(response.message || '盘点结果提交失败');
      }
    } catch (error) {
      console.error('提交盘点结果失败:', error);
      message.error('提交盘点结果失败，请检查网络连接或联系管理员');
    } finally {
      setLoading(false);
    }
  };

  // 组件加载时获取数据
  useEffect(() => {
    loadCheckDiffData();
    loadCheckSheetInfo();
  }, []);

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
          <h3>盘点表：{checkSheetInfo.sheetNumber || checkSheetId}</h3>
          <p>盘点仓库：{checkSheetInfo.warehouseName || '未知'} | 盘点日期：{checkSheetInfo.checkDate || '未知'} | 盘点人：{checkSheetInfo.operatorName || '未知'}</p>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <Table 
            columns={detailColumns} 
            dataSource={checkDetails} 
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
            rowKey="key"
            size="small"
          />
        </div>
      
        <div style={{ marginTop: 16, textAlign: 'right' }}>
          <Space>
            <Button onClick={() => message.success('保存成功')}>保存</Button>
            <Button type="primary" onClick={handleSubmit}>提交审核</Button>
          </Space>
        </div>
      </Card>
    </div>
  );
};

export default InventoryCheckDiff;
