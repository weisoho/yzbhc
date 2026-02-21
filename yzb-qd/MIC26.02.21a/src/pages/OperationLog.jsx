import React, { useState } from 'react';
import { Card, Table, DatePicker, Select, Input, Button, Row, Col, Tag } from 'antd';
import { SearchOutlined, FilterOutlined, ClearOutlined, ClockCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Search } = Input;

const OperationLog = () => {
  // 模拟操作日志数据
  const mockLogs = [
    { 
      key: '1', 
      time: '2024-01-15 10:30:25', 
      user: '张三', 
      type: '入库', 
      content: '验收入库：一次性注射器 10ml，数量 1000', 
      status: 'success',
      ip: '192.168.1.101'
    },
    { 
      key: '2', 
      time: '2024-01-15 09:15:42', 
      user: '李四', 
      type: '出库', 
      content: '消耗出库：输液器 500ml，数量 500', 
      status: 'success',
      ip: '192.168.1.102'
    },
    { 
      key: '3', 
      time: '2024-01-14 16:45:18', 
      user: '王五', 
      type: '盘点', 
      content: '生成盘点表：仓库1 - A区', 
      status: 'success',
      ip: '192.168.1.103'
    },
    { 
      key: '4', 
      time: '2024-01-14 14:20:33', 
      user: '赵六', 
      type: '调整', 
      content: '商品价格调整：一次性注射器 10ml，单价从 1.5 元调整为 1.8 元', 
      status: 'success',
      ip: '192.168.1.104'
    },
    { 
      key: '5', 
      time: '2024-01-13 11:50:05', 
      user: '张三', 
      type: '入库', 
      content: '验收入库：医用棉签 100支/包，数量 2000', 
      status: 'success',
      ip: '192.168.1.101'
    },
    { 
      key: '6', 
      time: '2024-01-13 10:15:22', 
      user: '李四', 
      type: '出库', 
      content: '消耗出库：酒精棉球 50g/瓶，数量 300', 
      status: 'success',
      ip: '192.168.1.102'
    },
    { 
      key: '7', 
      time: '2024-01-12 15:30:40', 
      user: '王五', 
      type: '调拨', 
      content: '商品调拨：仓库1 → 仓库2，一次性注射器 10ml，数量 500', 
      status: 'success',
      ip: '192.168.1.103'
    },
    { 
      key: '8', 
      time: '2024-01-12 09:45:55', 
      user: '赵六', 
      type: '维护', 
      content: '供应商维护：新增供应商 "医疗器械有限公司"', 
      status: 'success',
      ip: '192.168.1.104'
    },
    { 
      key: '9', 
      time: '2024-01-11 14:20:10', 
      user: '张三', 
      type: '盘点', 
      content: '盘点损溢录入：仓库1 - B区，损耗一次性注射器 10ml，数量 10', 
      status: 'warning',
      ip: '192.168.1.101'
    },
    { 
      key: '10', 
      time: '2024-01-11 11:30:35', 
      user: '李四', 
      type: '入库', 
      content: '验收入库：输液器 500ml，数量 1000', 
      status: 'success',
      ip: '192.168.1.102'
    },
  ];

  const [logs, setLogs] = useState(mockLogs);
  const [filteredLogs, setFilteredLogs] = useState(mockLogs);
  const [searchText, setSearchText] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [dateRange, setDateRange] = useState([]);

  // 操作类型选项
  const operationTypes = ['入库', '出库', '盘点', '调整', '调拨', '维护', '删除', '新增'];

  // 状态选项
  const statusOptions = ['success', 'warning', 'error'];

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
      render: (status) => (
        <Tag 
          color={status === 'success' ? 'green' : status === 'warning' ? 'orange' : 'red'} 
          style={{ borderRadius: 12, padding: '2px 8px', fontSize: 12 }}
        >
          {status === 'success' ? '成功' : status === 'warning' ? '警告' : '失败'}
        </Tag>
      )
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
      '新增': 'lime'
    };
    return colorMap[type] || 'default';
  };

  // 搜索和筛选功能
  const handleSearch = () => {
    let result = logs;

    // 按搜索文本筛选
    if (searchText) {
      result = result.filter(log => 
        log.content.includes(searchText) || 
        log.user.includes(searchText) || 
        log.ip.includes(searchText)
      );
    }

    // 按操作类型筛选
    if (selectedType) {
      result = result.filter(log => log.type === selectedType);
    }

    // 按状态筛选
    if (selectedStatus) {
      result = result.filter(log => log.status === selectedStatus);
    }

    // 按日期范围筛选
    if (dateRange.length === 2) {
      const startDate = dayjs(dateRange[0]).startOf('day');
      const endDate = dayjs(dateRange[1]).endOf('day');
      result = result.filter(log => {
        const logDate = dayjs(log.time);
        return logDate.isAfter(startDate) && logDate.isBefore(endDate);
      });
    }

    setFilteredLogs(result);
  };

  // 重置筛选条件
  const handleReset = () => {
    setSearchText('');
    setSelectedType('');
    setSelectedStatus('');
    setDateRange([]);
    setFilteredLogs(logs);
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
          backgroundColor: '#ffffff'
        }}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8} lg={8}>
            <Search
              placeholder="搜索操作内容/操作人员/IP"
              allowClear
              enterButton={<SearchOutlined />}
              size="middle"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onSearch={handleSearch}
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <RangePicker
              size="middle"
              value={dateRange}
              onChange={(dates) => setDateRange(dates)}
              style={{ width: '100%' }}
              placeholder={['开始日期', '结束日期']}
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={5}>
            <Select
              placeholder="选择操作类型"
              allowClear
              size="middle"
              value={selectedType}
              onChange={(value) => setSelectedType(value)}
              style={{ width: '100%' }}
            >
              {operationTypes.map(type => (
                <Option key={type} value={type}>
                  {type}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8} lg={5}>
            <Select
              placeholder="选择操作状态"
              allowClear
              size="middle"
              value={selectedStatus}
              onChange={(value) => setSelectedStatus(value)}
              style={{ width: '100%' }}
            >
              <Option value="success">成功</Option>
              <Option value="warning">警告</Option>
              <Option value="error">失败</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={16} lg={10} style={{ display: 'flex', gap: 12 }}>
            <Button
              type="primary"
              size="middle"
              icon={<FilterOutlined />}
              onClick={handleSearch}
              style={{ flex: 1, borderRadius: 8 }}
            >
              筛选
            </Button>
            <Button
              size="middle"
              icon={<ClearOutlined />}
              onClick={handleReset}
              style={{ flex: 1, borderRadius: 8 }}
            >
              重置
            </Button>
          </Col>
        </Row>
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
          dataSource={filteredLogs}
          rowKey="key"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
            style: { marginBottom: 0 }
          }}
          size="middle"
          bordered={false}
          scroll={{ x: 1000 }}
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