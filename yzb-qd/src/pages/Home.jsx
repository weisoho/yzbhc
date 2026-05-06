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
              supplierName: item.supplierName || '-',
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
      note: '首页纳入巡检的库存记录',
      icon: <DatabaseOutlined style={{ fontSize: 20, color: '#0f766e' }} />,
      valueStyle: { color: '#0f172a' },
      accent: 'linear-gradient(135deg, rgba(15,118,110,0.16) 0%, rgba(45,212,191,0.08) 100%)',
    },
    {
      title: '近效期商品',
      value: dashboardCounts.expiring,
      suffix: '条',
      note: '90 天内需要重点跟进',
      icon: <ClockCircleOutlined style={{ fontSize: 20, color: '#d97706' }} />,
      valueStyle: { color: '#b45309' },
      accent: 'linear-gradient(135deg, rgba(245,158,11,0.16) 0%, rgba(251,191,36,0.08) 100%)',
    },
    {
      title: '已过期商品',
      value: dashboardCounts.expired,
      suffix: '条',
      note: '建议优先处理失效库存',
      icon: <WarningOutlined style={{ fontSize: 20, color: '#dc2626' }} />,
      valueStyle: { color: '#b91c1c' },
      accent: 'linear-gradient(135deg, rgba(239,68,68,0.16) 0%, rgba(248,113,113,0.08) 100%)',
    },
    {
      title: '资质预警',
      value: dashboardCounts.qualification,
      suffix: '条',
      note: '供应商证照需要复核',
      icon: <FileProtectOutlined style={{ fontSize: 20, color: '#2563eb' }} />,
      valueStyle: { color: '#1d4ed8' },
      accent: 'linear-gradient(135deg, rgba(37,99,235,0.16) 0%, rgba(96,165,250,0.08) 100%)',
    },
  ], [dashboardCounts]);

  const quickActions = useMemo(() => [
    {
      key: 'inventory-detail',
      title: '库存台账',
      description: '查看库存明细、仓库分布与实时存量。',
      icon: <DatabaseOutlined style={{ fontSize: 22, color: '#0f766e' }} />,
      path: '/inventory-detail',
      color: '#0f766e',
      badge: `${dashboardCounts.inventory} 项`,
      badgeLabel: '实时库存',
    },
    {
      key: 'inventory-expiry',
      title: '效期管理',
      description: '集中处理近效期和已过期商品。',
      icon: <ClockCircleOutlined style={{ fontSize: 22, color: '#d97706' }} />,
      path: '/inventory-expiry',
      color: '#d97706',
      badge: `${dashboardCounts.expiring + dashboardCounts.expired} 条`,
      badgeLabel: '待处理效期',
    },
    {
      key: 'qualification-warning',
      title: '资质预警',
      description: '快速筛查供应商资质失效风险。',
      icon: <FileProtectOutlined style={{ fontSize: 22, color: '#1d4ed8' }} />,
      path: '/supplier-qualification-warning',
      color: '#1d4ed8',
      badge: `${dashboardCounts.qualification} 条`,
      badgeLabel: '待复核证照',
    },
    {
      key: 'purchase-order-query',
      title: '采购订单',
      description: '跟踪采购进度和到货执行情况。',
      icon: <ShoppingCartOutlined style={{ fontSize: 22, color: '#7c3aed' }} />,
      path: '/purchase-order-query',
      color: '#7c3aed',
      badge: '业务入口',
      badgeLabel: '采购执行',
    },
    {
      key: 'purchase-receipt',
      title: '采购入库',
      description: '处理采购收货和入库登记流程。',
      icon: <FileSearchOutlined style={{ fontSize: 22, color: '#0f766e' }} />,
      path: '/purchase-receipt',
      color: '#0f766e',
      badge: '业务入口',
      badgeLabel: '入库处理',
    },
    {
      key: 'operation-log',
      title: '操作日志',
      description: '查看近期关键业务动作和审计轨迹。',
      icon: <AlertOutlined style={{ fontSize: 22, color: '#be123c' }} />,
      path: '/operation-log',
      color: '#be123c',
      badge: '审计入口',
      badgeLabel: '日志巡检',
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
        description: `${expiredItems[0].warehouse} 已过期 ${expiredItems[0].daysOverdue} 天`,
        actionText: '去处理效期',
        path: '/inventory-expiry',
      });
    }

    if (qualificationWarningData[0]) {
      feed.push({
        key: `qualification-${qualificationWarningData[0].key}`,
        label: '资质提醒',
        color: 'gold',
        surface: 'linear-gradient(135deg, rgba(254, 243, 199, 0.96) 0%, rgba(255, 255, 255, 0.98) 100%)',
        title: qualificationWarningData[0].supplierName,
        description: `${qualificationWarningData[0].certificateType} ${qualificationWarningData[0].daysUntilExpiry < 0 ? `已过期 ${Math.abs(qualificationWarningData[0].daysUntilExpiry)} 天` : `剩余 ${qualificationWarningData[0].daysUntilExpiry} 天`}`,
        actionText: '查看资质预警',
        path: '/supplier-qualification-warning',
      });
    }

    if (expiringItems[0]) {
      feed.push({
        key: `expiring-${expiringItems[0].key}`,
        label: '库存提醒',
        color: 'blue',
        surface: 'linear-gradient(135deg, rgba(219, 234, 254, 0.96) 0%, rgba(255, 255, 255, 0.98) 100%)',
        title: expiringItems[0].name,
        description: `${expiringItems[0].warehouse} 剩余 ${expiringItems[0].daysLeft} 天到期`,
        actionText: '查看效期明细',
        path: '/inventory-expiry',
      });
    }

    if (!feed.length) {
      feed.push({
        key: 'safe',
        label: '运行状态',
        color: 'green',
        surface: 'linear-gradient(135deg, rgba(220, 252, 231, 0.96) 0%, rgba(255, 255, 255, 0.98) 100%)',
        title: '当前未发现紧急异常',
        description: '可以从快捷入口继续查看库存、采购和资质数据。',
        actionText: '查看库存台账',
        path: '/inventory-detail',
      });
    }

    return feed;
  }, [expiredItems, qualificationWarningData, expiringItems]);

  const reminderPanels = useMemo(() => [
    {
      key: 'expiring',
      title: '效期巡检',
      value: `${dashboardCounts.expiring} 条`,
      note: dashboardCounts.expiring > 0 ? '建议优先查看近效期库存' : '当前近效期压力较低',
      color: '#d97706',
      path: '/inventory-expiry',
    },
    {
      key: 'qualification',
      title: '资质复核',
      value: `${dashboardCounts.qualification} 条`,
      note: dashboardCounts.qualification > 0 ? '供应商证照需及时复核' : '当前证照状态稳定',
      color: '#2563eb',
      path: '/supplier-qualification-warning',
    },
    {
      key: 'log',
      title: '审计巡查',
      value: '日志入口',
      note: '查看系统最新关键操作轨迹',
      color: '#be123c',
      path: '/operation-log',
    },
  ], [dashboardCounts]);

  const tableTitleNode = (title, description, color) => (
    <Space direction="vertical" size={2}>
      <Text strong style={{ fontSize: 16, color }}>{title}</Text>
      <Text style={{ fontSize: 12, color: '#64748b' }}>{description}</Text>
    </Space>
  );

  return (
    <div style={pageStyle}>
      <Space direction="vertical" size={20} style={{ width: '100%' }}>
        <Card bordered={false} style={heroCardStyle} bodyStyle={{ padding: 24 }}>
          <Row gutter={[24, 24]} align="middle">
            <Col xs={24} xl={16}>
              <Space direction="vertical" size={16} style={{ width: '100%' }}>
                <Tag color="cyan" style={{ width: 'fit-content', padding: '4px 10px', borderRadius: 999 }}>
                  智能业务首页
                </Tag>
                <div>
                  <Title level={1} style={{ margin: 0, color: '#f8fafc', fontSize: 34, lineHeight: 1.2 }}>
                    {userName}，欢迎回到医智云管理驾驶舱
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
                    查看资质预警
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
                    打开采购订单
                  </Button>
                </Space>
              </Space>
            </Col>

            <Col xs={24} xl={8}>
              <div style={heroPanelStyle}>
                <Space direction="vertical" size={16} style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start' }}>
                    <div>
                      <Text style={{ color: 'rgba(226,243,255,0.78)', fontSize: 12 }}>今日总览</Text>
                      <Title level={2} style={{ margin: '6px 0 0', color: '#f8fafc' }}>
                        {totalAlerts}
                      </Title>
                      <Text style={{ color: 'rgba(226,243,255,0.82)' }}>项待处理风险</Text>
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
              <Card bordered={false} style={{ ...statCardStyle, background: item.accent }}>
                <Space direction="vertical" size={18} style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ color: '#475569', fontWeight: 600 }}>{item.title}</Text>
                    {item.icon}
                  </div>
                  <Statistic value={item.value} suffix={item.suffix} valueStyle={item.valueStyle} loading={loading} />
                  <Text style={{ color: '#64748b', fontSize: 12 }}>{item.note}</Text>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} xl={16}>
            <Card
              bordered={false}
              style={tableCardStyle}
              title={tableTitleNode('快捷入口', '常用业务模块直接进入，减少首页跳转层级。', '#0f172a')}
            >
              <Row gutter={[12, 12]}>
                {quickActions.map((item) => (
                  <Col xs={24} md={12} key={item.key}>
                    <div
                      style={{
                        borderRadius: 18,
                        padding: 18,
                        border: '1px solid rgba(15, 23, 42, 0.08)',
                        background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
                        minHeight: 148,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}
                    >
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
                                {item.badgeLabel}
                              </Tag>
                            </div>
                            <Text strong style={{ display: 'block', color: '#0f172a', fontSize: 15 }}>{item.title}</Text>
                              <Text style={{ display: 'block', marginTop: 4, color: '#64748b', fontSize: 13 }}>{item.description}</Text>
                              <Text style={{ display: 'block', marginTop: 8, color: item.color, fontWeight: 600 }}>{item.badge}</Text>
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
              <Card
                bordered={false}
                style={tableCardStyle}
                title={tableTitleNode('关键提醒', '首页优先展示今天最值得先处理的事项。', '#0f172a')}
              >
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
                          <Button type="link" onClick={() => navigate(item.path)} style={{ padding: 0, color: '#0f172a', fontWeight: 600 }}>
                            {item.actionText} <ArrowRightOutlined />
                          </Button>
                        </div>
                        <Text strong style={{ color: '#0f172a', fontSize: 15 }}>{item.title}</Text>
                        <Text style={{ color: '#475569', lineHeight: 1.7 }}>{item.description}</Text>
                      </Space>
                    </div>
                  ))}
                </Space>
              </Card>

              <Card
                bordered={false}
                style={tableCardStyle}
                title={tableTitleNode('今日关注', '把首页保留为概览，细节进入业务模块查看。', '#0f172a')}
              >
                <Row gutter={[12, 12]}>
                  {reminderPanels.map((item) => (
                    <Col xs={24} sm={8} xl={24} key={item.key}>
                      <div
                        style={{
                          padding: 16,
                          borderRadius: 18,
                          border: '1px solid rgba(15, 23, 42, 0.08)',
                          background: '#ffffff',
                        }}
                      >
                        <Space direction="vertical" size={8} style={{ width: '100%' }}>
                          <Text style={{ color: item.color, fontWeight: 700 }}>{item.title}</Text>
                          <Text strong style={{ fontSize: 20, color: '#0f172a' }}>{item.value}</Text>
                          <Text style={{ color: '#64748b', minHeight: 40 }}>{item.note}</Text>
                          <Button type="link" onClick={() => navigate(item.path)} style={{ padding: 0, color: item.color, fontWeight: 600 }}>
                            进入模块 <ArrowRightOutlined />
                          </Button>
                        </Space>
                      </div>
                    </Col>
                  ))}
                </Row>
              </Card>
            </Space>
          </Col>
        </Row>
      </Space>
    </div>
  );
};

export default Home;

