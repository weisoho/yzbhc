import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertOutlined,
  ArrowRightOutlined,
  ClockCircleOutlined,
  DatabaseOutlined,
  FileProtectOutlined,
  FileSearchOutlined,
  ShoppingCartOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { Button, Card, Col, Row, Space, Statistic, Tag, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import api from '../utils/api.js';

const { Text, Title } = Typography;

const mapQualificationTab = (type) => {
  if (type === 'BUSINESS_LICENSE') {
    return 'businessLicense';
  }
  if (type === 'BUSINESS_CERTIFICATE') {
    return 'businessCertificate';
  }
  return 'registration';
};

const pageStyle = {
  padding: '0 16px 24px',
  background: 'linear-gradient(180deg, #f4f7fb 0%, #eef3f7 35%, #f7f9fc 100%)',
};

const heroCardStyle = {
  borderRadius: 24,
  border: '1px solid rgba(14, 116, 144, 0.10)',
  background: 'linear-gradient(135deg, #0f766e 0%, #164e63 55%, #0f172a 100%)',
  boxShadow: '0 22px 50px rgba(15, 23, 42, 0.18)',
  overflow: 'hidden',
};

const heroPanelStyle = {
    minHeight: 154,
    borderRadius: 20,
    padding: 20,
    color: '#e2f3ff',
    background: 'linear-gradient(180deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.06) 100%)',
    border: '1px solid rgba(255,255,255,0.12)',
    backdropFilter: 'blur(8px)',
  };

  const statCardStyle = {
    borderRadius: 20,
    border: '1px solid rgba(15, 23, 42, 0.06)',
    boxShadow: '0 14px 30px rgba(15, 23, 42, 0.06)',
  };

  const tableCardStyle = {
    borderRadius: 20,
    border: '1px solid rgba(15, 23, 42, 0.06)',
    boxShadow: '0 14px 30px rgba(15, 23, 42, 0.05)',
    overflow: 'hidden',
  };

  const quickActionStyle = {
    borderRadius: 18,
    padding: 18,
    border: '1px solid rgba(15, 23, 42, 0.08)',
    background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
    minHeight: 132,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  };

  const Home = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [expiringItems, setExpiringItems] = useState([]);
    const [expiredItems, setExpiredItems] = useState([]);
    const [qualificationWarningData, setQualificationWarningData] = useState([]);
    const [dashboardCounts, setDashboardCounts] = useState({
      inventory: 0,
      expiring: 0,
      expired: 0,
      qualification: 0,
    });

    const toNumber = (value) => {
      const num = Number(value);
      return Number.isFinite(num) ? num : 0;
    };

    const getRecordList = (pageData) => {
      if (!pageData || typeof pageData !== 'object') {
        return [];
      }
      if (Array.isArray(pageData.records)) {
        return pageData.records;
      }
      if (Array.isArray(pageData.list)) {
        return pageData.list;
      }
      return [];
    };

    const getRecordTotal = (pageData, recordsLength) => {
      const total = Number(pageData?.total ?? pageData?.count ?? recordsLength ?? 0);
      return Number.isFinite(total) ? total : recordsLength;
    };

    const fetchPagedRecords = async (url, params = {}, maxPages = 20) => {
      const pageSize = Number(params.pageSize || 200);
      const firstResp = await api.get(url, { ...params, pageNum: 1, pageSize });
      if (firstResp?.code !== 1 || !firstResp.data) {
        return [];
      }

      const firstRecords = getRecordList(firstResp.data);
      const total = getRecordTotal(firstResp.data, firstRecords.length);
      const totalPages = Math.min(Math.ceil(total / pageSize), maxPages);
      const records = [...firstRecords];

      for (let pageNum = 2; pageNum <= totalPages; pageNum += 1) {
        const pageResp = await api.get(url, { ...params, pageNum, pageSize });
        if (pageResp?.code !== 1 || !pageResp.data) {
          break;
        }
        records.push(...getRecordList(pageResp.data));
      }

      return records;
    };

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

    const mapInventoryToHomeRow = (item, daysLeft) => ({
      key: String(item.id ?? `${item.materialCode || item.materialName || 'item'}-${item.batchNumber || ''}`),
      name: item.materialName || '-',
      specification: item.specification || item.model || '-',
      warehouse: item.warehouse || item.inventoryName || item.warehouseName || '-',
      expirationDate: item.expiryDate || '-',
      daysLeft,
      daysOverdue: Math.abs(daysLeft),
    });

    useEffect(() => {
      const loadHomeData = async () => {
        setLoading(true);
        try {
          const [inventoryRecords, warningResponse] = await Promise.all([
            fetchPagedRecords('/api/scm/inventory', { pageSize: 200 }),
            api.get('/api/scm/suppliers/qualifications/warnings', {
              pageNum: 1,
              pageSize: 50,
              warningDays: 90,
            }),
          ]);

          const today = moment().startOf('day');
          const expiringRows = [];
          const expiredRows = [];

          inventoryRecords.forEach((item) => {
            if (!item.expiryDate) {
              return;
            }
            const daysLeft = moment(item.expiryDate).startOf('day').diff(today, 'days');
            if (daysLeft >= 0 && daysLeft <= 90) {
              expiringRows.push(mapInventoryToHomeRow(item, daysLeft));
            }
            if (daysLeft < 0) {
              expiredRows.push(mapInventoryToHomeRow(item, daysLeft));
            }
          });

          const warningRows = getRecordList(warningResponse?.data || warningResponse)
            .map((item) => {
              const { status, daysUntilExpiry } = getQualificationWarningStatus(item.expiryDate);
              return {
                key: String(item.id),
                supplierId: item.supplierId,
                supplierName: item.supplierName || '-',
                type: item.type || 'REGISTRATION_CERTIFICATE',
                certificateType: item.licenseType || item.type || '-',
                certificateNumber: item.licenseNumber || '-',
                expiryDate: item.expiryDate || '-',
                status,
                daysUntilExpiry: toNumber(daysUntilExpiry),
              };
            })
            .sort((left, right) => (left.daysUntilExpiry ?? 0) - (right.daysUntilExpiry ?? 0));

          setDashboardCounts({
            inventory: inventoryRecords.length,
            expiring: expiringRows.length,
            expired: expiredRows.length,
            qualification: warningRows.length,
          });
          setExpiringItems(
            expiringRows
              .sort((left, right) => (left.daysLeft ?? 0) - (right.daysLeft ?? 0))
              .slice(0, 8)
          );
          setExpiredItems(
            expiredRows
              .sort((left, right) => (right.daysOverdue ?? 0) - (left.daysOverdue ?? 0))
              .slice(0, 8)
          );
          setQualificationWarningData(warningRows.slice(0, 8));
        } catch (error) {
          setDashboardCounts({ inventory: 0, expiring: 0, expired: 0, qualification: 0 });
          setExpiringItems([]);
          setExpiredItems([]);
          setQualificationWarningData([]);
        } finally {
          setLoading(false);
        }
      };

      loadHomeData();
    }, []);

    const userName = (() => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
        return userInfo.realName || userInfo.name || userInfo.userName || localStorage.getItem('username') || '管理员';
      } catch {
        return localStorage.getItem('username') || '管理员';
      }
    })();

    const todayText = moment().format('YYYY年MM月DD日');
    const totalAlerts = dashboardCounts.expiring + dashboardCounts.expired + dashboardCounts.qualification;

    const statCards = useMemo(() => [
      {
        title: '库存台账',
        value: dashboardCounts.inventory,
        suffix: '项',
        path: '/inventory-detail',
        icon: <DatabaseOutlined style={{ fontSize: 20, color: '#0f766e' }} />,
        valueStyle: { color: '#0f172a' },
        accent: 'linear-gradient(135deg, rgba(15,118,110,0.16) 0%, rgba(45,212,191,0.08) 100%)',
      },
      {
        title: '近效期商品',
        value: dashboardCounts.expiring,
        suffix: '条',
        path: '/inventory-expiry',
        icon: <ClockCircleOutlined style={{ fontSize: 20, color: '#d97706' }} />,
        valueStyle: { color: '#b45309' },
        accent: 'linear-gradient(135deg, rgba(245,158,11,0.16) 0%, rgba(251,191,36,0.08) 100%)',
      },
      {
        title: '已过期商品',
        value: dashboardCounts.expired,
        suffix: '条',
        path: '/inventory-expiry',
        icon: <WarningOutlined style={{ fontSize: 20, color: '#dc2626' }} />,
        valueStyle: { color: '#b91c1c' },
        accent: 'linear-gradient(135deg, rgba(239,68,68,0.16) 0%, rgba(248,113,113,0.08) 100%)',
      },
      {
        title: '资质预警',
        value: dashboardCounts.qualification,
        suffix: '条',
        path: '/supplier-qualification-warning',
        icon: <FileProtectOutlined style={{ fontSize: 20, color: '#2563eb' }} />,
        valueStyle: { color: '#1d4ed8' },
        accent: 'linear-gradient(135deg, rgba(37,99,235,0.16) 0%, rgba(96,165,250,0.08) 100%)',
      },
    ], [dashboardCounts]);

    const quickActions = useMemo(() => [
      {
        key: 'inventory-detail',
        title: '库存台账',
        icon: <DatabaseOutlined style={{ fontSize: 22, color: '#0f766e' }} />,
        path: '/inventory-detail',
        color: '#0f766e',
        badge: `${dashboardCounts.inventory} 项`,
      },
      {
        key: 'inventory-expiry',
        title: '效期管理',
        icon: <ClockCircleOutlined style={{ fontSize: 22, color: '#d97706' }} />,
        path: '/inventory-expiry',
        color: '#d97706',
        badge: `${dashboardCounts.expiring + dashboardCounts.expired} 条`,
      },
      {
        key: 'qualification-warning',
        title: '资质预警',
        icon: <FileProtectOutlined style={{ fontSize: 22, color: '#1d4ed8' }} />,
        path: '/supplier-qualification-warning',
        color: '#1d4ed8',
        badge: `${dashboardCounts.qualification} 条`,
      },
      {
        key: 'purchase-order-query',
        title: '采购订单',
        icon: <ShoppingCartOutlined style={{ fontSize: 22, color: '#7c3aed' }} />,
        path: '/purchase-order-query',
        color: '#7c3aed',
        badge: '进入',
      },
      {
        key: 'purchase-receipt',
        title: '采购入库',
        icon: <FileSearchOutlined style={{ fontSize: 22, color: '#0f766e' }} />,
        path: '/purchase-receipt',
        color: '#0f766e',
        badge: '进入',
      },
      {
        key: 'operation-log',
        title: '操作日志',
        icon: <AlertOutlined style={{ fontSize: 22, color: '#be123c' }} />,
        path: '/operation-log',
        color: '#be123c',
        badge: '进入',
      },
    ], [dashboardCounts]);

    const focusFeed = useMemo(() => {
      const feed = [];

      if (expiredItems[0]) {
        feed.push({
          key: `expired-${expiredItems[0].key}`,
          label: '优先处理',
          color: 'red',
          surface: 'linear-gradient(135deg, rgba(254, 226, 226, 0.92) 0%, rgba(255, 255, 255, 0.98) 100%)',
          title: expiredItems[0].name,
          meta: `${expiredItems[0].warehouse} · 过期 ${expiredItems[0].daysOverdue} 天`,
          actionText: '处理效期',
          path: '/inventory-expiry',
          navigationState: {
            source: 'home-pending',
            initialFilters: {
              materialName: expiredItems[0].name,
              remainingDays: 'expired',
            },
          },
        });
      }

      qualificationWarningData.slice(0, 3).forEach((item) => {
        feed.push({
          key: `qualification-${item.key}`,
          label: '资质提醒',
          color: 'gold',
          surface: 'linear-gradient(135deg, rgba(254, 243, 199, 0.96) 0%, rgba(255, 255, 255, 0.98) 100%)',
          title: item.supplierName,
          meta: item.daysUntilExpiry < 0
            ? `${item.certificateType} · 已过期 ${Math.abs(item.daysUntilExpiry)} 天`
            : `${item.certificateType} · 剩余 ${item.daysUntilExpiry} 天`,
          actionText: '查看预警',
          path: '/supplier-qualification-warning',
          navigationState: {
            source: 'home-pending',
            initialTab: mapQualificationTab(item.type),
            initialFilters: {
              supplierId: item.supplierId ? String(item.supplierId) : '',
              supplierName: item.supplierName || '',
              status: item.status || '',
            },
          },
        });
      });

      if (expiringItems[0]) {
        feed.push({
          key: `expiring-${expiringItems[0].key}`,
          label: '库存提醒',
          color: 'blue',
          surface: 'linear-gradient(135deg, rgba(219, 234, 254, 0.96) 0%, rgba(255, 255, 255, 0.98) 100%)',
          title: expiringItems[0].name,
          meta: `${expiringItems[0].warehouse} · 剩余 ${expiringItems[0].daysLeft} 天`,
          actionText: '查看明细',
          path: '/inventory-expiry',
          navigationState: {
            source: 'home-pending',
            initialFilters: {
              materialName: expiringItems[0].name,
              remainingDays: '90',
            },
          },
        });
      }

      if (!feed.length) {
        feed.push({
          key: 'safe',
          label: '状态正常',
          color: 'green',
          surface: 'linear-gradient(135deg, rgba(220, 252, 231, 0.96) 0%, rgba(255, 255, 255, 0.98) 100%)',
          title: '当前无紧急异常',
          meta: '库存与资质预警正常',
          actionText: '查看库存',
          path: '/inventory-detail',
        });
      }

      return feed;
    }, [expiredItems, qualificationWarningData, expiringItems]);

    const cardTitleNode = (title, color = '#0f172a') => (
      <Text strong style={{ fontSize: 16, color }}>{title}</Text>
    );

    return (
      <div style={pageStyle}>
        <Space direction="vertical" size={20} style={{ width: '100%' }}>
          <Card bordered={false} style={heroCardStyle} bodyStyle={{ padding: 24 }}>
            <Row gutter={[24, 24]} align="middle">
              <Col xs={24} xl={16}>
                <Space direction="vertical" size={16} style={{ width: '100%' }}>
                  <div>
                    <Title level={1} style={{ margin: 0, color: '#f8fafc', fontSize: 34, lineHeight: 1.2 }}>
                      {userName}，欢迎使用医智云
                    </Title>
                  </div>
                  <Space wrap size={[12, 12]}>
                    <Button
                      type="primary"
                      size="large"
                      onClick={() => navigate('/inventory-detail')}
                      style={{
                        height: 44,
                        borderRadius: 999,
                        border: 'none',
                        background: 'linear-gradient(135deg, #f8fafc 0%, #bae6fd 100%)',
                        color: '#0f172a',
                        fontWeight: 600,
                      }}
                    >
                      进入库存台账
                    </Button>
                    <Button
                      size="large"
                      onClick={() => navigate('/supplier-qualification-warning')}
                      style={{
                        height: 44,
                        borderRadius: 999,
                        borderColor: 'rgba(255,255,255,0.24)',
                        background: 'rgba(255,255,255,0.06)',
                        color: '#f8fafc',
                      }}
                    >
                      资质预警
                    </Button>
                    <Button
                      size="large"
                      onClick={() => navigate('/purchase-order-query')}
                      style={{
                        height: 44,
                        borderRadius: 999,
                        borderColor: 'rgba(255,255,255,0.24)',
                        background: 'rgba(255,255,255,0.06)',
                        color: '#f8fafc',
                      }}
                    >
                      采购订单
                    </Button>
                  </Space>
                </Space>
              </Col>

              <Col xs={24} xl={8}>
                <div style={heroPanelStyle}>
                  <Space direction="vertical" size={16} style={{ width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start' }}>
                      <div>
                        <Title level={2} style={{ margin: 0, color: '#f8fafc' }}>
                          {totalAlerts}
                        </Title>
                      </div>
                      <Tag color={totalAlerts > 0 ? 'gold' : 'green'} style={{ borderRadius: 999, padding: '4px 10px' }}>
                        {todayText}
                      </Tag>
                    </div>

                    <div style={{ display: 'grid', gap: 10 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#e2f3ff' }}>
                        <Text style={{ color: '#c7e8f7' }}>近效期商品</Text>
                        <Text strong style={{ color: '#ffffff' }}>{dashboardCounts.expiring} 条</Text>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#e2f3ff' }}>
                        <Text style={{ color: '#c7e8f7' }}>已过期商品</Text>
                        <Text strong style={{ color: '#ffffff' }}>{dashboardCounts.expired} 条</Text>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#e2f3ff' }}>
                        <Text style={{ color: '#c7e8f7' }}>资质预警</Text>
                        <Text strong style={{ color: '#ffffff' }}>{dashboardCounts.qualification} 条</Text>
                      </div>
                    </div>
                  </Space>
                </div>
              </Col>
            </Row>
          </Card>

          <Row gutter={[16, 16]}>
            {statCards.map((item) => (
              <Col xs={24} sm={12} xl={6} key={item.title}>
                <Card
                  bordered={false}
                  hoverable
                  onClick={() => navigate(item.path)}
                  style={{ ...statCardStyle, background: item.accent, cursor: 'pointer' }}
                  bodyStyle={{ padding: 24 }}
                >
                  <Space direction="vertical" size={18} style={{ width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text style={{ color: '#475569', fontWeight: 600 }}>{item.title}</Text>
                      {item.icon}
                    </div>
                    <Statistic value={item.value} suffix={item.suffix} valueStyle={item.valueStyle} loading={loading} />
                    <Text style={{ color: '#334155', fontWeight: 600 }}>点击查看 <ArrowRightOutlined /></Text>
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} xl={16}>
              <Card bordered={false} style={tableCardStyle} title={cardTitleNode('常用入口')}>
                <Row gutter={[12, 12]}>
                  {quickActions.map((item) => (
                    <Col xs={24} md={12} key={item.key}>
                      <div style={quickActionStyle}>
                        <Space direction="vertical" size={10} style={{ width: '100%' }}>
                          <Space size={12} align="start">
                            <div
                              style={{
                                width: 42,
                                height: 42,
                                borderRadius: 14,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: `${item.color}14`,
                                flexShrink: 0,
                              }}
                            >
                              {item.icon}
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
                                <Text strong style={{ display: 'block', color: '#0f172a', fontSize: 15 }}>{item.title}</Text>
                                <Tag
                                  color="default"
                                  style={{
                                    marginInlineEnd: 0,
                                    borderRadius: 999,
                                    borderColor: `${item.color}22`,
                                    background: `${item.color}10`,
                                    color: item.color,
                                  }}
                                >
                                  {item.badge}
                                </Tag>
                              </div>
                            </div>
                          </Space>
                        </Space>
                        <Button type="link" onClick={() => navigate(item.path)} style={{ padding: 0, color: item.color, fontWeight: 600 }}>
                          立即进入 <ArrowRightOutlined />
                        </Button>
                      </div>
                    </Col>
                  ))}
                </Row>
              </Card>
            </Col>

            <Col xs={24} xl={8}>
              <Space direction="vertical" size={16} style={{ width: '100%' }}>
                <Card bordered={false} style={tableCardStyle} title={cardTitleNode('待处理')}>
                  <Space direction="vertical" size={12} style={{ width: '100%' }}>
                    {focusFeed.map((item) => (
                      <div
                        key={item.key}
                        style={{
                          padding: 16,
                          borderRadius: 18,
                          border: '1px solid rgba(15, 23, 42, 0.08)',
                          background: item.surface,
                        }}
                      >
                        <Space direction="vertical" size={10} style={{ width: '100%' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
                            <Tag color={item.color} style={{ width: 'fit-content', borderRadius: 999, marginInlineEnd: 0 }}>{item.label}</Tag>
                            <Button type="link" onClick={() => navigate(item.path, item.navigationState ? { state: item.navigationState } : undefined)} style={{ padding: 0, color: '#0f172a', fontWeight: 600 }}>
                              {item.actionText} <ArrowRightOutlined />
                            </Button>
                          </div>
                          <Text strong style={{ color: '#0f172a', fontSize: 15 }}>{item.title}</Text>
                          <Text style={{ color: '#475569' }}>{item.meta}</Text>
                        </Space>
                      </div>
                    ))}
                  </Space>
                </Card>

              </Space>
            </Col>
          </Row>
        </Space>
      </div>
    );
  };

  export default Home;
