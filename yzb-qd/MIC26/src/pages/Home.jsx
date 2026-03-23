/**
 * 首页组件
 * 显示系统概览、统计数据、预警信息等
 */

import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Table, Tag, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { 
  DollarOutlined, 
  InboxOutlined, 
  DatabaseOutlined, 
  UnorderedListOutlined,
  AlertOutlined
} from '@ant-design/icons';
import moment from 'moment';
import api from '../utils/api';

/**
 * 首页组件
 * 展示系统概览、库存统计、近效期商品、过期商品和资质预警等信息
 */
const Home = () => {
  const navigate = useNavigate();
  const [qualificationWarningData, setQualificationWarningData] = useState([]);

  // 库存统计数据
  const inventoryData = [
    { 
      name: '库存总金额', 
      value: '1,234,567', 
      icon: <DollarOutlined />, 
      color: '#667eea',
      bgColor: '#f0f4ff'
    },
    { 
      name: '库存总数量', 
      value: '8,912', 
      icon: <DatabaseOutlined />, 
      color: '#52c41a',
      bgColor: '#f6ffed'
    },
    { 
      name: '本月入库', 
      value: '3,456', 
      icon: <InboxOutlined />, 
      color: '#faad14',
      bgColor: '#fffbe6'
    },
    { 
      name: '本月消耗', 
      value: '2,789', 
      icon: <UnorderedListOutlined />, 
      color: '#f5222d',
      bgColor: '#fff1f0'
    },
  ];

  /**
   * 添加CSS动画样式
   */
  const styles = `
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.5;
      }
    }

    @keyframes scaleIn {
      from {
        opacity: 0;
        transform: scale(0.95);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
  `;

  /**
   * 组件挂载时添加动画样式到页面
   */
  useEffect(() => {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, [styles]);

  useEffect(() => {
    const loadQualificationWarnings = async () => {
      try {
        const response = await api.get('/api/scm/suppliers/qualifications', {
          pageNum: 1,
          pageSize: 20,
        });

        if (response.code !== 1 || !response.data) {
          return;
        }

        const rows = (response.data.records || [])
          .filter((item) => item.type !== 'REGISTRATION_CERTIFICATE')
          .map((item) => {
            const { status, daysUntilExpiry } = getQualificationWarningStatus(item.expiryDate);
            return {
              key: item.id,
              supplierName: item.supplierName,
              certificateType: item.licenseType || item.type,
              certificateNumber: item.licenseNumber,
              expiryDate: item.expiryDate,
              status,
              daysUntilExpiry,
            };
          })
          .sort((left, right) => (left.daysUntilExpiry ?? 0) - (right.daysUntilExpiry ?? 0))
          .slice(0, 4);

        setQualificationWarningData(rows);
      } catch (error) {
        console.error('首页资质预警加载失败:', error);
        setQualificationWarningData([]);
      }
    };

    loadQualificationWarnings();
  }, []);

  // 近效期商品数据
  const expiringItems = [
    { key: '1', name: '一次性注射器', specification: '10ml', warehouse: '仓库1', shelf: 'A1-01', productionDate: '2024-01-15', expirationDate: '2024-03-15', daysLeft: 15 },
    { key: '2', name: '输液器', specification: '500ml', warehouse: '仓库2', shelf: 'B2-03', productionDate: '2024-01-20', expirationDate: '2024-03-20', daysLeft: 20 },
    { key: '3', name: '医用棉签', specification: '100支/包', warehouse: '仓库1', shelf: 'C3-05', productionDate: '2024-02-01', expirationDate: '2024-03-25', daysLeft: 25 },
  ];

  // 过期商品数据
  const expiredItems = [
    { key: '1', name: '酒精棉球', specification: '50g/瓶', warehouse: '仓库3', shelf: 'D4-02', productionDate: '2023-11-20', expirationDate: '2024-02-10', daysOverdue: 10 },
  ];

  const getQualificationWarningStatus = (expiryDate) => {
    const today = moment().startOf('day');
    const targetDate = moment(expiryDate).startOf('day');
    const daysUntilExpiry = targetDate.diff(today, 'days');

    if (daysUntilExpiry < 0) {
      return { status: '已过期', daysUntilExpiry };
    }
    if (daysUntilExpiry <= 90) {
      return { status: '即将过期', daysUntilExpiry };
    }
    return { status: '有效', daysUntilExpiry };
  };

  /**
   * 近效期商品表格列配置
   */
  const columns = [
    { 
      title: '商品名称', 
      dataIndex: 'name', 
      key: 'name',
      align: 'left',
      width: 180
    },
    { 
      title: '规格型号', 
      dataIndex: 'specification', 
      key: 'specification',
      align: 'left',
      width: 120
    },
    { 
      title: '所属仓库', 
      dataIndex: 'warehouse', 
      key: 'warehouse',
      align: 'left',
      width: 100
    },
    { 
      title: '货架位置', 
      dataIndex: 'shelf', 
      key: 'shelf',
      align: 'left',
      width: 100
    },
    { 
      title: '生产日期', 
      dataIndex: 'productionDate', 
      key: 'productionDate',
      align: 'left',
      width: 120
    },
    { 
      title: '有效期', 
      dataIndex: 'expirationDate', 
      key: 'expirationDate',
      align: 'left',
      width: 120
    },
    { 
      title: '状态', 
      dataIndex: 'daysLeft', 
      key: 'daysLeft',
      align: 'center',
      render: (daysLeft) => (
        <Tag 
          color={daysLeft < 30 ? 'red' : daysLeft < 60 ? 'orange' : 'yellow'} 
          style={{ borderRadius: 12, padding: '2px 8px', fontSize: 12 }}
        >
          剩余{daysLeft}天
        </Tag>
      )
    },
    { 
      title: '操作', 
      key: 'action',
      align: 'center',
      render: () => (
        <Button 
          type="primary" 
          size="small" 
          style={{ borderRadius: 6 }}
        >
          查看明细
        </Button>
      )
    },
  ];

  /**
   * 过期商品表格列配置
   */
  const expiredColumns = [
    { 
      title: '商品名称', 
      dataIndex: 'name', 
      key: 'name',
      align: 'left',
      width: 160
    },
    { 
      title: '规格型号', 
      dataIndex: 'specification', 
      key: 'specification',
      align: 'left',
      width: 100
    },
    { 
      title: '所属仓库', 
      dataIndex: 'warehouse', 
      key: 'warehouse',
      align: 'left',
      width: 80
    },
    { 
      title: '货架位置', 
      dataIndex: 'shelf', 
      key: 'shelf',
      align: 'left',
      width: 80
    },
    { 
      title: '生产日期', 
      dataIndex: 'productionDate', 
      key: 'productionDate',
      align: 'left',
      width: 100
    },
    { 
      title: '有效期', 
      dataIndex: 'expirationDate', 
      key: 'expirationDate',
      align: 'left',
      width: 100
    },
    { 
      title: '状态', 
      dataIndex: 'daysOverdue', 
      key: 'daysOverdue',
      align: 'center',
      render: (daysOverdue) => (
        <Tag 
          color="red" 
          style={{ borderRadius: 12, padding: '2px 8px', fontSize: 12 }}
        >
          过期{daysOverdue}天
        </Tag>
      )
    },
    { 
      title: '操作', 
      key: 'action',
      align: 'center',
      render: () => (
        <>
          <Button 
            type="primary" 
            size="small" 
            style={{ marginRight: 8, borderRadius: 6 }}
          >
            供应商退货
          </Button>
          <Button 
            type="danger" 
            size="small" 
            style={{ borderRadius: 6 }}
          >
            报溢录入
          </Button>
        </>
      )
    },
  ];

  /**
   * 资质预警表格列配置
   */
  const qualificationColumns = [
    { 
      title: '供应商名称', 
      dataIndex: 'supplierName', 
      key: 'supplierName',
      align: 'left',
      width: 150
    },
    { 
      title: '资质类型', 
      dataIndex: 'certificateType', 
      key: 'certificateType',
      align: 'left',
      width: 120
    },
    { 
      title: '资质编号', 
      dataIndex: 'certificateNumber', 
      key: 'certificateNumber',
      align: 'left',
      width: 120
    },
    { 
      title: '有效期至', 
      dataIndex: 'expiryDate', 
      key: 'expiryDate',
      align: 'left',
      width: 120
    },
    { 
      title: '剩余天数', 
      dataIndex: 'daysUntilExpiry', 
      key: 'daysUntilExpiry',
      align: 'center',
      render: (daysUntilExpiry) => (
        <span style={{ 
          color: daysUntilExpiry < 0 ? '#f5222d' : daysUntilExpiry <= 30 ? '#fa541c' : '#faad14',
          fontWeight: 600
        }}>
          {daysUntilExpiry < 0 ? `过期${Math.abs(daysUntilExpiry)}天` : `剩余${daysUntilExpiry}天`}
        </span>
      )
    },
    { 
      title: '预警状态', 
      dataIndex: 'status', 
      key: 'status',
      align: 'center',
      render: (status) => {
        let color = '#52c41a';
        if (status === '已过期') color = '#f5222d';
        else if (status === '即将过期') color = '#faad14';
        return (
          <Tag 
            color={color} 
            style={{ borderRadius: 12, padding: '2px 8px', fontSize: 12 }}
          >
            {status}
          </Tag>
        );
      }
    },
    { 
      title: '操作', 
      key: 'action',
      align: 'center',
      render: () => (
        <Button 
          type="primary" 
          size="small" 
          onClick={() => navigate('/supplier-qualification-warning')}
          style={{ borderRadius: 6 }}
        >
          打开预警页
        </Button>
      )
    },
  ];

  // 获取用户名
  const userName = localStorage.getItem('userName') || '管理员';

  /**
   * 渲染首页组件
   */
  return (
    <div style={{ padding: '0' }}>
      {/* 欢迎标题 */}
      <h1 style={{ 
        marginBottom: 32, 
        fontSize: 32, 
        fontWeight: 700, 
        color: '#262626',
        display: 'flex',
        alignItems: 'center',
        animation: 'fadeIn 0.6s ease-out forwards',
        opacity: 0,
      }}>
        {userName}，欢迎您！
      </h1>
      
      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
        {inventoryData.map((item, index) => (
          <Col 
            xs={{ span: 24 }} 
            sm={{ span: 12 }} 
            md={{ span: 8 }} 
            lg={{ span: 6 }} 
            xl={{ span: 6 }}
            key={index}
          >
            <Card
              style={{
                borderRadius: 16,
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
                border: '1px solid #e8e8e8',
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                cursor: 'pointer',
                overflow: 'hidden',
                backgroundColor: '#ffffff',
                animation: `fadeIn 0.6s ease-out forwards ${index * 0.15}s`,
                opacity: 0,
                transform: 'translateY(20px)',
              }}
              hoverable
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.12)';
              }}
            >
              <div style={{ padding: 24 }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: 16
                }}>
                  <div 
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 16,
                      background: item.bgColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 28,
                      color: item.color,
                      boxShadow: `0 4px 12px ${item.color}33`,
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {item.icon}
                  </div>
                  <Statistic
                    value={item.value}
                    valueStyle={{ 
                      fontSize: 28, 
                      fontWeight: 700, 
                      color: item.color,
                      letterSpacing: '-0.5px',
                    }}
                  />
                </div>
                <div style={{ 
                  fontSize: 16, 
                  color: '#666666', 
                  fontWeight: 600,
                  marginTop: 12,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                }}>
                  {item.name}
                </div>
                <div 
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: `linear-gradient(90deg, ${item.color}, ${item.color}80)`,
                    opacity: 0.3,
                  }}
                />
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 近效期和过期商品 */}
      <Row gutter={[16, 16]}>
        {/* 近效期商品明细 */}
        <Col xs={{ span: 24 }} lg={{ span: 16 }} xl={{ span: 16 }}>
          <Card
            title={
              <div style={{ 
                fontSize: 18, 
                fontWeight: 700, 
                color: '#262626',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '0 4px',
              }}>
                <span style={{ 
                  width: 4, 
                  height: 24, 
                  borderRadius: 2, 
                  backgroundColor: '#667eea',
                }} />
                近效期商品明细
              </div>
            }
            extra={
              <Button 
                type="primary" 
                ghost
                size="small"
                style={{ 
                  color: '#667eea', 
                  fontWeight: 600,
                  borderRadius: 8,
                  borderColor: '#667eea',
                  whiteSpace: 'nowrap',
                }}
              >
                查看全部
              </Button>
            }
            style={{
              borderRadius: 16,
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
              border: '1px solid #e8e8e8',
              overflow: 'hidden',
              backgroundColor: '#ffffff',
              animation: 'fadeIn 0.7s ease-out forwards 0.7s',
              opacity: 0,
              transform: 'translateY(20px)',
            }}
          >
            <div style={{ overflowX: 'auto' }}>
              <Table 
                columns={columns} 
                dataSource={expiringItems} 
                pagination={false} 
                bordered={false}
                size="middle"
                rowKey="key"
                style={{
                  borderRadius: 8,
                  overflow: 'hidden',
                }}
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
            </div>
          </Card>
        </Col>
        
        {/* 过期商品 */}
        <Col xs={{ span: 24 }} lg={{ span: 8 }} xl={{ span: 8 }}>
          <Card
            title={
              <div style={{ 
                fontSize: 18, 
                fontWeight: 700, 
                color: '#262626',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '0 4px',
              }}>
                <span style={{ 
                  width: 4, 
                  height: 24, 
                  borderRadius: 2, 
                  backgroundColor: '#f5222d',
                }} />
                过期商品
              </div>
            }
            extra={
              <Button 
                type="primary" 
                ghost
                danger
                size="small"
                style={{ 
                  color: '#f5222d', 
                  fontWeight: 600,
                  borderRadius: 8,
                  borderColor: '#f5222d',
                  whiteSpace: 'nowrap',
                }}
              >
                查看全部
              </Button>
            }
            style={{
              borderRadius: 16,
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
              border: '1px solid #e8e8e8',
              overflow: 'hidden',
              backgroundColor: '#ffffff',
              animation: 'fadeIn 0.7s ease-out forwards 0.9s',
              opacity: 0,
              transform: 'translateY(20px)',
            }}
          >
            <div style={{ overflowX: 'auto' }}>
              <Table 
                columns={expiredColumns} 
                dataSource={expiredItems} 
                pagination={false} 
                bordered={false}
                size="middle"
                rowKey="key"
                style={{
                  borderRadius: 8,
                  overflow: 'hidden',
                }}
                components={{
                  Header: (props) => (
                    <thead {...props} style={{ 
                      backgroundColor: '#fff1f0',
                      borderRadius: '8px 8px 0 0',
                    }} />
                  ),
                  Th: (props) => (
                    <th {...props} style={{
                      fontWeight: 600,
                      color: '#262626',
                      borderBottom: '2px solid #ffccc7',
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
                      e.currentTarget.style.backgroundColor = '#fff1f0';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '';
                    }}
                    />
                  ),
                }}
              />
            </div>
          </Card>
        </Col>
      </Row>

      {/* 资质预警 */}
      <Row gutter={[16, 16]} style={{ marginTop: 32 }}>
        <Col xs={{ span: 24 }}>
          <Card
            title={
              <div style={{ 
                fontSize: 18, 
                fontWeight: 700, 
                color: '#262626',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '0 4px',
              }}>
                <span style={{ 
                  width: 4, 
                  height: 24, 
                  borderRadius: 2, 
                  backgroundColor: '#faad14',
                }} />
                <AlertOutlined style={{ fontSize: 18, color: '#faad14' }} />
                资质预警
              </div>
            }
            extra={
              <Button 
                type="primary" 
                ghost
                onClick={() => navigate('/supplier-qualification-warning')}
                style={{ 
                  color: '#faad14', 
                  fontWeight: 600,
                  borderRadius: 8,
                  borderColor: '#faad14',
                  whiteSpace: 'nowrap',
                }}
              >
                查看全部
              </Button>
            }
            style={{
              borderRadius: 16,
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
              border: '1px solid #e8e8e8',
              overflow: 'hidden',
              backgroundColor: '#ffffff',
              animation: 'fadeIn 0.7s ease-out forwards 1.1s',
              opacity: 0,
              transform: 'translateY(20px)',
            }}
          >
            <div style={{ overflowX: 'auto' }}>
              <Table 
                columns={qualificationColumns} 
                dataSource={qualificationWarningData} 
                pagination={false} 
                bordered={false}
                size="middle"
                rowKey="key"
                style={{
                  borderRadius: 8,
                  overflow: 'hidden',
                }}
                components={{
                  Header: (props) => (
                    <thead {...props} style={{ 
                      backgroundColor: '#fffbe6',
                      borderRadius: '8px 8px 0 0',
                    }} />
                  ),
                  Th: (props) => (
                    <th {...props} style={{
                      fontWeight: 600,
                      color: '#262626',
                      borderBottom: '2px solid #ffe58f',
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
                      e.currentTarget.style.backgroundColor = '#fffbe6';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '';
                    }}
                    />
                  ),
                }}
              />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Home;