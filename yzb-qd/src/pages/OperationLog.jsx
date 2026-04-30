import React, { useState, useEffect } from 'react';
import { Card, Table, DatePicker, Select, Input, Button, Row, Col, Tag, message } from 'antd';
import { SearchOutlined, FilterOutlined, ClearOutlined, ClockCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import api from '../utils/api.js';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Search } = Input;

const OperationLog = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [searchText, setSearchText] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [dateRange, setDateRange] = useState([]);

  // 从后端获取操作日志数据
  const fetchOperationLogs = async (page = pagination.current, size = pagination.pageSize) => {
    setLoading(true);
    try {
      const params = {
        pageNum: page,
        pageSize: size,
        searchText: searchText,
        operationType: selectedType,
        status: selectedStatus,
        startDate: dateRange && dateRange[0] ? dayjs(dateRange[0]).format('YYYY-MM-DD') : undefined,
        endDate: dateRange && dateRange[1] ? dayjs(dateRange[1]).format('YYYY-MM-DD') : undefined
      };
      
      const response = await api.get('/api/scm/operation-logs', params);
      if (response.code === 1 && response.data) {
        const records = response.data.records.map((item, index) => ({
          ...item,
          key: item.id || index.toString(),
          time: item.operationTime,
          user: item.userName || item.operatorName || '未知',
          type: item.operationType,
          content: item.operationContent || item.content,
          status: item.status,
          ip: item.ipAddress || item.ip
        }));
        setLogs(records);
        setPagination({
          ...pagination,
          current: page,
          pageSize: size,
          total: response.data.total
        });
      } else {
        message.error(response.message || '获取操作日志失败');
      }
    } catch (error) {
      console.error('获取操作日志失败:', error);
      message.error('获取操作日志失败，请检查网络连接或联系管理员');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOperationLogs();
  }, []);

  // 搜索和筛选功能
  const handleSearch = () => {
    fetchOperationLogs(1); // 搜索时回到第一页
  };

  // 重置筛选条件
  const handleReset = () => {
    setSearchText('');
    setSelectedType('');
    setSelectedStatus('');
    setDateRange([]);
    // 重置后立即执行一次查询（回到第一页）
    setTimeout(() => {
      fetchOperationLogs(1);
    }, 0);
  };

  // 处理分页切换
  const handleTableChange = (newPagination) => {
    fetchOperationLogs(newPagination.current, newPagination.pageSize);
  };

  // 操作类型选项
  const operationTypes = ['新增', '修改', '删除', '审核', '提交', '入库', '出库', '盘点', '调整', '调拨', '维护'];

  // 表格列定义
  const columns = [
    {
      title: '操作时间',
      dataIndex: 'time',
      key: 'time',
      width: 180,
      render: (time) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <ClockCircleOutlined style={{ color: '#667eea', fontSize: 14 }} />
          {time}
        </div>
      )
    },
    {
      title: '操作人员',
      dataIndex: 'user',
      key: 'user',
      width: 120
    },
    {
      title: '操作类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type) => (
        <Tag color={getTypeColor(type)} style={{ borderRadius: 12, padding: '2px 8px', fontSize: 12 }}>
          {type}
        </Tag>
      )
    },
    {
      title: '操作内容',
      dataIndex: 'content',
      key: 'content',
      ellipsis: { showTitle: false },
    },
    {
      title: '操作状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => {
        const isSuccess = status === 'success' || status === '1' || status === true;
        const isWarning = status === 'warning';
        return (
          <Tag 
            color={isSuccess ? 'green' : isWarning ? 'orange' : 'red'} 
            style={{ borderRadius: 12, padding: '2px 8px', fontSize: 12 }}
          >
            {isSuccess ? '成功' : isWarning ? '警告' : '失败'}
          </Tag>
        );
      }
    },
    {
      title: 'IP地址',
      dataIndex: 'ip',
      key: 'ip',
      width: 130
    },
  ];

  // 根据操作类型获取颜色
  const getTypeColor = (type) => {
    const colorMap = {
      '入库': 'green',
      '出库': 'blue',
      '盘点': 'purple',
      '调整': 'orange',
      '调拨': 'cyan',
      '维护': 'magenta',
      '删除': 'red',
      '新增': 'lime',
      '修改': 'gold',
      '审核': 'geekblue',
      '提交': 'volcano'
    };
    return colorMap[type] || 'default';
  };

  return (
    <div style={{ padding: '0' }}>
      <h1 style={{ 
        marginBottom: 32, 
        fontSize: 32, 
        fontWeight: 700, 
        color: '#262626',
        display: 'flex',
        alignItems: 'center',
        gap: 12
      }}>
        <ClockCircleOutlined style={{ color: '#667eea', fontSize: 28 }} />
        操作日志
      </h1>
      
      {/* 筛选搜索区域 */}
      <Card
        style={{
          borderRadius: 16,
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
          border: '1px solid #e8e8e8',
          marginBottom: 24,
          backgroundColor: '#ffffff',
          padding: '16px'
        }}
      >
        <div style={{ marginBottom: '16px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '8px', fontWeight: '500', minWidth: '180px' }}>搜索操作内容/操作人员/IP：</span>
            <Search
              placeholder="请输入搜索内容"
              allowClear
              size="middle"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: '300px' }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '8px', fontWeight: '500', minWidth: '80px' }}>操作日期：</span>
            <RangePicker
              size="middle"
              value={dateRange}
              onChange={(dates) => setDateRange(dates)}
              placeholder={['开始日期', '结束日期']}
              style={{ width: '300px' }}
            />
          </div>
        </div>
        <div style={{ marginBottom: '16px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '8px', fontWeight: '500', minWidth: '80px' }}>操作类型：</span>
            <Select
              placeholder="请选择操作类型"
              allowClear
              size="middle"
              value={selectedType}
              onChange={(value) => setSelectedType(value)}
              style={{ width: '200px' }}
            >
              {operationTypes.map(type => (
                <Option key={type} value={type}>
                  {type}
                </Option>
              ))}
            </Select>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '8px', fontWeight: '500', minWidth: '80px' }}>操作状态：</span>
            <Select
              placeholder="请选择操作状态"
              allowClear
              size="middle"
              value={selectedStatus}
              onChange={(value) => setSelectedStatus(value)}
              style={{ width: '200px' }}
            >
              <Option value="success">成功</Option>
              <Option value="warning">警告</Option>
              <Option value="error">失败</Option>
            </Select>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button
            type="primary"
            size="middle"
            icon={<FilterOutlined />}
            onClick={handleSearch}
          >
            筛选
          </Button>
          <Button
            size="middle"
            icon={<ClearOutlined />}
            onClick={handleReset}
          >
            重置
          </Button>
        </div>
      </Card>

      {/* 操作日志表格 */}
      <Card
        style={{
          borderRadius: 16,
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
          border: '1px solid #e8e8e8',
          backgroundColor: '#ffffff'
        }}
      >
        <Table
          columns={columns}
          dataSource={logs}
          rowKey="key"
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
            style: { marginBottom: 0 }
          }}
          onChange={handleTableChange}
          size="middle"
          bordered={false}
          scroll={{ x: 1000 }}
          loading={loading}
          components={{
            Header: (props) => (
              <thead {...props} style={{ 
                backgroundColor: '#fafafa',
                borderRadius: '8px 8px 0 0',
              }} />
            ),
            Th: (props) => (
              <th {...props} style={{
                fontWeight: 600,
                color: '#262626',
                borderBottom: '2px solid #e8e8e8',
                padding: '12px 8px',
                fontSize: 14,
              }} />
            ),
            Td: (props) => (
              <td {...props} style={{
                padding: '12px 8px',
                borderBottom: '1px solid #f0f0f0',
                transition: 'all 0.3s ease',
                fontSize: 14,
              }} />
            ),
            Row: (props) => (
              <tr {...props} style={{
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f0f4ff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '';
              }}
              />
            ),
          }}
        />
      </Card>
    </div>
  );
};

export default OperationLog;