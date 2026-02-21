import React from 'react';
import { Space, Card, Table, Select, DatePicker, Button, Row, Col, Statistic } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const StockOutStats = () => {
  const { RangePicker } = DatePicker;
  const consumptionStats = {
    total: {
      totalQuantity: 1500,
      totalAmount: 12500,
      averagePerDay: 50
    },
    byDepartment: [
      { key: 'internal', department: '内科', quantity: 600, amount: 5000, percentage: 40 },
      { key: 'surgery', department: '外科', quantity: 450, amount: 3750, percentage: 30 },
      { key: 'pediatrics', department: '儿科', quantity: 300, amount: 2500, percentage: 20 },
      { key: 'obstetrics', department: '妇产科', quantity: 150, amount: 1250, percentage: 10 }
    ],
    byProduct: [
      { key: 'syringe', name: '一次性注射器', quantity: 400, amount: 3000 },
      { key: 'infusion', name: '输液器', quantity: 350, amount: 2800 },
      { key: 'cotton', name: '医用棉签', quantity: 300, amount: 2400 },
      { key: 'gauze', name: '医用纱布', quantity: 250, amount: 2100 },
      { key: 'iodine', name: '碘伏', quantity: 200, amount: 2200 }
    ],
    byTime: [
      { key: '2024-02-15', date: '2024-02-15', quantity: 120 },
      { key: '2024-02-16', date: '2024-02-16', quantity: 100 },
      { key: '2024-02-17', date: '2024-02-17', quantity: 110 },
      { key: '2024-02-18', date: '2024-02-18', quantity: 130 },
      { key: '2024-02-19', date: '2024-02-19', quantity: 140 },
      { key: '2024-02-20', date: '2024-02-20', quantity: 150 },
      { key: '2024-02-21', date: '2024-02-21', quantity: 160 }
    ]
  };

  const statsTableColumns = [
    { title: '科室', dataIndex: 'department', key: 'department' },
    { title: '消耗数量', dataIndex: 'quantity', key: 'quantity' },
    { title: '消耗金额', dataIndex: 'amount', key: 'amount', render: (text) => `¥${text}` },
    {
      title: '占比',
      dataIndex: 'percentage',
      key: 'percentage',
      render: (text) => `${text}%`
    }
  ];

  return (
    <div style={{ padding: '0 16px' }}>
      <h1 style={{ marginBottom: 24 }}>消耗统计</h1>
      
      <Card style={{ marginBottom: 16 }}>
        <Space wrap>
          <RangePicker placeholder={['开始日期', '结束日期']} style={{ minWidth: 200 }} />
          <Select placeholder="统计维度" style={{ minWidth: 150 }}>
              <Select.Option value="department">按科室</Select.Option>
              <Select.Option value="product">按商品</Select.Option>
              <Select.Option value="time">按时间</Select.Option>
            </Select>
          <Button type="primary" icon={<SearchOutlined />} style={{ minWidth: 100 }}>查询</Button>
          <Button style={{ minWidth: 100 }}>导出</Button>
        </Space>
      </Card>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Card>
            <Statistic title="总消耗数量" value={consumptionStats.total.totalQuantity} suffix="件" />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="总消耗金额" value={consumptionStats.total.totalAmount} suffix="元" precision={2} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="日均消耗量" value={consumptionStats.total.averagePerDay} suffix="件" />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={12}>
          <Card title="科室消耗占比">
            <div style={{ height: 300, position: 'relative' }}>
              {/* 科室消耗占比 - 简单的环形图实现 */}
              <div style={{ 
                width: 200, 
                height: 200, 
                margin: '0 auto', 
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                {/* 环形图容器 */}
                <div style={{ 
                  width: '100%', 
                  height: '100%', 
                  borderRadius: '50%', 
                  background: '#f5f5f5',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                  {/* 环形图进度 */}
                  <div style={{ 
                    width: '70%', 
                    height: '70%', 
                    borderRadius: '50%', 
                    background: '#ffffff',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 24, fontWeight: 'bold' }}>100%</div>
                      <div style={{ color: '#8c8c8c', fontSize: 14 }}>总占比</div>
                    </div>
                  </div>
                  {/* 使用伪元素和CSS渐变实现简单的环形图 */}
                  <div style={{ 
                    position: 'absolute', 
                    top: 0, 
                    left: 0,
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    background: 'conic-gradient(#667eea 0deg 144deg, #52c41a 144deg 252deg, #faad14 252deg 324deg, #f5222d 324deg 360deg)',
                    clipPath: 'circle(50% at 50% 50%)',
                    mask: 'radial-gradient(circle at 50% 50%, transparent 35%, #000 35%)',
                  }} />
                </div>
              </div>
              {/* 图例 */}
              <div style={{ 
                position: 'absolute', 
                bottom: 0, 
                left: 0, 
                right: 0,
                padding: '0 20px',
                display: 'flex',
                justifyContent: 'space-around',
              }}>
                {consumptionStats.byDepartment.map((item, index) => (
                  <div key={item.key} style={{ textAlign: 'center' }}>
                    <div style={{ 
                      width: 12, 
                      height: 12, 
                      borderRadius: '50%', 
                      margin: '0 auto 4px',
                      backgroundColor: ['#667eea', '#52c41a', '#faad14', '#f5222d'][index % 4],
                    }} />
                    <div style={{ fontSize: 12, color: '#666' }}>{item.department}</div>
                    <div style={{ fontSize: 12, fontWeight: 'bold' }}>{item.percentage}%</div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="每日消耗趋势">
            <div style={{ height: 300, padding: '20px' }}>
              {/* 每日消耗趋势 - 折线图实现 */}
              <div style={{ position: 'relative', height: '100%' }}>
                {/* Y轴 */}
                <div style={{ 
                  position: 'absolute', 
                  left: 0, 
                  top: 0, 
                  bottom: 0,
                  width: 40,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '10px 0',
                }}>
                  {[160, 140, 120, 100, 80, 60, 40, 20, 0].map((value) => (
                    <div key={value} style={{ 
                      fontSize: 12,
                      color: '#8c8c8c',
                      textAlign: 'right',
                      paddingRight: 8,
                    }}>
                      {value}
                    </div>
                  ))}
                </div>
                {/* 图表区域 */}
                <div style={{ 
                  position: 'absolute', 
                  left: 40, 
                  right: 0, 
                  top: 0, 
                  bottom: 0,
                  borderLeft: '1px solid #e8e8e8',
                  borderBottom: '1px solid #e8e8e8',
                }}>
                  {/* 网格线 */}
                  {[160, 140, 120, 100, 80, 60, 40, 20, 0].map((value, index) => (
                    <div key={index} style={{ 
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      top: `${(100 - (value / 160) * 100)}%`,
                      borderTop: '1px dashed #f0f0f0',
                    }} />
                  ))}
                  {/* 折线和点 */}
                  <svg style={{ width: '100%', height: '100%' }}>
                    {/* 折线 */}
                    <polyline
                      points={consumptionStats.byTime.map((item, index) => {
                        const x = (index / (consumptionStats.byTime.length - 1)) * 100;
                        const y = 100 - (item.quantity / 160) * 100;
                        return `${x}% ${y}%`;
                      }).join(' ')}
                      fill="none"
                      stroke="#667eea"
                      strokeWidth="2"
                    />
                    {/* 数据点 */}
                    {consumptionStats.byTime.map((item, index) => {
                      const x = (index / (consumptionStats.byTime.length - 1)) * 100;
                      const y = 100 - (item.quantity / 160) * 100;
                      return (
                        <g key={index}>
                          <circle cx={`${x}%`} cy={`${y}%`} r="4" fill="#667eea" />
                          <circle cx={`${x}%`} cy={`${y}%`} r="8" fill="rgba(102, 126, 234, 0.2)" />
                        </g>
                      );
                    })}
                  </svg>
                  {/* X轴标签 */}
                  <div style={{ 
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: -25,
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '0 10px',
                  }}>
                    {consumptionStats.byTime.map((item) => (
                      <div key={item.key} style={{ 
                        fontSize: 12,
                        color: '#8c8c8c',
                      }}>
                        {item.date.split('-').slice(1).join('-')}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Card title="商品消耗排行" style={{ marginBottom: 16 }}>
        <div style={{ height: 300, padding: '20px' }}>
          {/* 商品消耗排行 - 柱状图实现 */}
          <div style={{ position: 'relative', height: '100%' }}>
            {/* Y轴 */}
            <div style={{ 
              position: 'absolute', 
              left: 0, 
              top: 0, 
              bottom: 0,
              width: 60,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '10px 0',
            }}>
              {[400, 350, 300, 250, 200, 150, 100, 50, 0].map((value) => (
                <div key={value} style={{ 
                  fontSize: 12,
                  color: '#8c8c8c',
                  textAlign: 'right',
                  paddingRight: 8,
                }}>
                  {value}
                </div>
              ))}
            </div>
            {/* 图表区域 */}
            <div style={{ 
              position: 'absolute', 
              left: 60, 
              right: 0, 
              top: 0, 
              bottom: 0,
              borderLeft: '1px solid #e8e8e8',
              borderBottom: '1px solid #e8e8e8',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-around',
              padding: '0 20px 20px',
            }}>
              {/* 网格线 */}
              {[400, 350, 300, 250, 200, 150, 100, 50, 0].map((value, index) => (
                <div key={index} style={{ 
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: `${(100 - (value / 400) * 100)}%`,
                  borderTop: '1px dashed #f0f0f0',
                }} />
              ))}
              {/* 柱状图 */}
              {consumptionStats.byProduct.map((item) => (
                <div key={item.key} style={{ 
                  flex: 1,
                  margin: '0 5px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                }}>
                  {/* 柱子 */}
                  <div style={{ 
                    width: '80%',
                    height: `${(item.quantity / 400) * 100}%`,
                    backgroundColor: '#667eea',
                    borderRadius: '4px 4px 0 0',
                    position: 'relative',
                    transition: 'all 0.3s',
                  }} onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.05)';
                    e.target.style.backgroundColor = '#5a6fd8';
                  }} onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.backgroundColor = '#667eea';
                  }}>
                    {/* 数值标签 */}
                    <div style={{ 
                      position: 'absolute',
                      top: -25,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      fontSize: 12,
                      fontWeight: 'bold',
                      color: '#667eea',
                    }}>
                      {item.quantity}
                    </div>
                  </div>
                  {/* 商品名称 */}
                  <div style={{ 
                    marginTop: 8,
                    fontSize: 12,
                    color: '#666',
                    textAlign: 'center',
                    lineHeight: '1.2',
                  }}>
                    {item.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <Card title="科室消耗明细">
        <Table columns={statsTableColumns} dataSource={consumptionStats.byDepartment} pagination={false} />
      </Card>
    </div>
  );
};

export default StockOutStats;
