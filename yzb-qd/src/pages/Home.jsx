/**
 * 首页组件
 * 显示系统概览、统计数据、预警信息等
 */

import React, { useEffect, useMemo, useState } from 'react';
import { AlertOutlined } from '@ant-design/icons';
import { Button, Card, Col, Row, Table, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import api from '../utils/api.js';

/**
 * 首页组件
 * 展示系统概览、库存统计、近效期商品、过期商品和资质预警等信息
 */
const Home = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [expiringItems, setExpiringItems] = useState([]);
  const [expiredItems, setExpiredItems] = useState([]);
  const [qualificationWarningData, setQualificationWarningData] = useState([]);

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
        setExpiringItems([]);
        setExpiredItems([]);
        setQualificationWarningData([]);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  const expiringColumns = useMemo(() => [
    { title: '商品名称', dataIndex: 'name', key: 'name', width: 160 },
    { title: '规格型号', dataIndex: 'specification', key: 'specification', width: 140 },
    { title: '所属仓库', dataIndex: 'warehouse', key: 'warehouse', width: 120 },
    { title: '有效期', dataIndex: 'expirationDate', key: 'expirationDate', width: 120 },
    {
      title: '状态',
      dataIndex: 'daysLeft',
      key: 'daysLeft',
      width: 120,
      render: (daysLeft) => (
        <Tag color={daysLeft < 30 ? 'red' : daysLeft < 60 ? 'orange' : 'gold'}>
          剩余 {daysLeft} 天
        </Tag>
      ),
    },
  ], []);

  const expiredColumns = useMemo(() => [
    { title: '商品名称', dataIndex: 'name', key: 'name', width: 160 },
    { title: '规格型号', dataIndex: 'specification', key: 'specification', width: 140 },
    { title: '所属仓库', dataIndex: 'warehouse', key: 'warehouse', width: 120 },
    { title: '有效期', dataIndex: 'expirationDate', key: 'expirationDate', width: 120 },
    {
      title: '状态',
      dataIndex: 'daysOverdue',
      key: 'daysOverdue',
      width: 120,
      render: (daysOverdue) => <Tag color="red">过期 {daysOverdue} 天</Tag>,
    },
  ], []);

  const qualificationColumns = useMemo(() => [
    { title: '供应商名称', dataIndex: 'supplierName', key: 'supplierName', width: 150 },
    { title: '资质类型', dataIndex: 'certificateType', key: 'certificateType', width: 120 },
    { title: '资质编号', dataIndex: 'certificateNumber', key: 'certificateNumber', width: 150 },
    { title: '有效期至', dataIndex: 'expiryDate', key: 'expiryDate', width: 120 },
    {
      title: '剩余天数',
      dataIndex: 'daysUntilExpiry',
      key: 'daysUntilExpiry',
      width: 120,
      render: (daysUntilExpiry) => {
        if (daysUntilExpiry < 0) {
          return <span style={{ color: '#f5222d' }}>过期 {Math.abs(daysUntilExpiry)} 天</span>;
        }
        return <span style={{ color: daysUntilExpiry <= 30 ? '#fa541c' : '#d48806' }}>剩余 {daysUntilExpiry} 天</span>;
      },
    },
  ], []);

  // 获取用户名
  const userName = (() => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      return userInfo.realName || userInfo.name || userInfo.userName || localStorage.getItem('username') || '管理员';
    } catch {
      return localStorage.getItem('username') || '管理员';
    }
  })();

  /**
   * 渲染首页组件
   */
  return (
    <div style={{ padding: '0 16px' }}>
      {/* 欢迎标题 */}
      <h1 style={{ 
        marginBottom: 24, 
        fontSize: 32, 
        fontWeight: 700, 
        color: '#262626',
        display: 'flex',
        alignItems: 'center',
      }}>
        {userName}，欢迎您！
      </h1>

      <Row gutter={[16, 16]}>
        <Col xs={24} xl={8}>
          <Card
            title="近效期商品明细"
            extra={<Button type="link" onClick={() => navigate('/inventory-expiry')}>查看全部</Button>}
          >
            <Table
              size="small"
              rowKey="key"
              loading={loading}
              columns={expiringColumns}
              dataSource={expiringItems}
              pagination={false}
              scroll={{ x: 640, y: 380 }}
            />
          </Card>
        </Col>

        <Col xs={24} xl={8}>
          <Card
            title="过期商品"
            extra={<Button type="link" danger onClick={() => navigate('/inventory-expiry')}>查看全部</Button>}
          >
            <Table
              size="small"
              rowKey="key"
              loading={loading}
              columns={expiredColumns}
              dataSource={expiredItems}
              pagination={false}
              scroll={{ x: 640, y: 380 }}
            />
          </Card>
        </Col>

        <Col xs={24} xl={8}>
          <Card
            title={<span><AlertOutlined style={{ color: '#faad14', marginRight: 8 }} />资质预警</span>}
            extra={<Button type="link" onClick={() => navigate('/supplier-qualification-warning')}>查看全部</Button>}
          >
            <Table
              size="small"
              rowKey="key"
              loading={loading}
              columns={qualificationColumns}
              dataSource={qualificationWarningData}
              pagination={false}
              scroll={{ x: 680, y: 380 }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Home;

