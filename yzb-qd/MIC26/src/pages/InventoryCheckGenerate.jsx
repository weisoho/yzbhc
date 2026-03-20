import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Form, Select, DatePicker, Input, Space, message } from 'antd';
import api from '../utils/api';


const { Option } = Select;

const InventoryCheckGenerate = () => {
  const [checkSheets, setCheckSheets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generateLoading, setGenerateLoading] = useState(false);
  const [form] = Form.useForm();

  // 获取盘点表数据
  const fetchCheckSheets = async () => {
    try {
      setLoading(true);
      // 暂时使用库存API模拟数据，实际应该调用盘点表API
      const response = await api.get('/api/scm/inventory');
      if (response.code === 1 && response.data) {
        // 模拟盘点表数据
        const sheetList = response.data.records.map((item, index) => ({
          key: item.id || index.toString(),
          sheetNumber: `PD${new Date().toISOString().split('T')[0].replace(/-/g, '')}${String(index + 1).padStart(3, '0')}`,
          warehouse: item.warehouse || '仓库1',
          checkDate: new Date().toISOString().split('T')[0],
          checker: '张三',
          status: '待审核',
          difference: '无差异'
        }));
        setCheckSheets(sheetList);
      } else {
        message.error(response.message || '获取盘点表数据失败');
        setCheckSheets([]);
      }
    } catch (error) {
      console.error('获取盘点表数据失败:', error);
      message.error(`获取盘点表数据失败: ${error.message || '未知错误'}`);
      setCheckSheets([]);
    } finally {
      setLoading(false);
    }
  };

  // 初始化数据
  useEffect(() => {
    fetchCheckSheets();
  }, []);

  // 生成盘点表处理函数
  const handleGenerateCheckSheet = async (values) => {
    try {
      setGenerateLoading(true);
      const generateData = {
        warehouse: values.warehouse,
        checkDate: values.checkDate.format('YYYY-MM-DD'),
        checker: values.checker
      };
      
      await api.post('/api/inventory/check/generate', generateData);
      message.success('盘点表生成成功');
      // 重新获取盘点表数据
      await fetchCheckSheets();
      // 清空表单
      form.resetFields();
    } catch (error) {
      message.error(`生成盘点表失败: ${error.message || '未知错误'}`);
    } finally {
      setGenerateLoading(false);
    }
  };

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
      
      <Card style={{ padding: '16px' }}>
        <Form form={form} layout="vertical" onFinish={handleGenerateCheckSheet}>
          <div style={{ marginBottom: '16px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px' }}>
            <Form.Item name="warehouse" rules={[{ required: true, message: '请选择盘点仓库' }]} style={{ marginBottom: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '8px', fontWeight: '500', minWidth: '80px' }}>盘点仓库：</span>
                <Select placeholder="请选择盘点仓库" style={{ width: '200px' }}>
                  <Option value="warehouse1">仓库1</Option>
                  <Option value="warehouse2">仓库2</Option>
                  <Option value="warehouse3">仓库3</Option>
                </Select>
              </div>
            </Form.Item>
            <Form.Item name="checkDate" rules={[{ required: true, message: '请选择盘点日期' }]} style={{ marginBottom: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '8px', fontWeight: '500', minWidth: '80px' }}>盘点日期：</span>
                <DatePicker style={{ width: '200px' }} />
              </div>
            </Form.Item>
            <Form.Item name="checker" rules={[{ required: true, message: '请输入盘点人' }]} style={{ marginBottom: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '8px', fontWeight: '500', minWidth: '80px' }}>盘点人：</span>
                <Input placeholder="请输入盘点人" style={{ width: '200px' }} />
              </div>
            </Form.Item>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Button type="primary" htmlType="submit" loading={generateLoading}>生成盘点表</Button>
          </div>
        </Form>
        
        <div style={{ overflowX: 'auto', marginTop: '24px' }}>
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
            loading={loading}
          />
        </div>
      </Card>
    </div>
  );
};

export default InventoryCheckGenerate;
