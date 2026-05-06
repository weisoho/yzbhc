import React, { useEffect, useMemo, useState } from 'react';
import { Card, Table, Select, Button, Form, Input, Space, message } from 'antd';
import { SearchOutlined, ExportOutlined } from '@ant-design/icons';
import api from '../utils/api.js';

const normalizeList = (payload) => {
  if (Array.isArray(payload?.records)) {
    return payload.records;
  }
  if (Array.isArray(payload?.list)) {
    return payload.list;
  }
  return [];
};

const exportCsv = (filename, headers, rows) => {
  const csvRows = [headers.join(',')].concat(
    rows.map((row) => headers.map((header) => `"${String(row[header] ?? '').replaceAll('"', '""')}"`).join(','))
  );
  const blob = new Blob([`\ufeff${csvRows.join('\n')}`], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
};

const ReportsConsumptionSummary = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [filters, setFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const loadSummary = async () => {
    setLoading(true);
    try {
      const response = await api.post('/api/scm/stock-out/countStock', {
        pageNum: 1,
        pageSize: 1000,
      });

      if (response.code !== 1) {
        message.error(response.message || '获取仓库消耗汇总失败');
        setRows([]);
        return;
      }

      const records = normalizeList(response.data).map((item, index) => ({
        key: `${item.materialName || 'material'}-${item.departmentName || 'department'}-${index}`,
        materialCode: item.materialCode || '-',
        materialName: item.materialName || '-',
        supplierName: item.supplierName || '-',
        specification: item.specification || '-',
        model: item.model || '-',
        manufacturer: item.manufacturer || '-',
        registrationNumber: item.registrationNumber || '-',
        batchNumber: item.batchNumber || '-',
        productionDate: item.productionDate || '-',
        expiryDate: item.expiryDate || '-',
        unit: item.unit || '-',
        purchaseAmount: item.purchaseAmount || item.purchasePrice || 0,
        totalQuantity: item.allStockNum || 0,
        department: item.departmentName || '-',
        warehouse: item.inventory || '-',
        outOrderNo: item.outboundNumber || item.outboundNo || '-',
        status: item.status || '-',
      }));

      setRows(records);
    } catch (error) {
      console.error('获取仓库消耗汇总失败:', error);
      message.error('获取仓库消耗汇总失败，请检查后端接口');
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSummary();
  }, []);

  const departmentOptions = useMemo(() => {
    return [...new Set(rows.map((item) => item.department).filter(Boolean))];
  }, [rows]);

  const warehouseOptions = useMemo(() => {
    return [...new Set(rows.map((item) => item.warehouse).filter(Boolean))];
  }, [rows]);

  const filteredRows = useMemo(() => {
    const materialName = (filters.materialName || '').trim().toLowerCase();
    return rows.filter((item) => {
      if (materialName && !String(item.materialName).toLowerCase().includes(materialName)) {
        return false;
      }
      if (filters.department && item.department !== filters.department) {
        return false;
      }
      if (filters.warehouse && item.warehouse !== filters.warehouse) {
        return false;
      }
      return true;
    });
  }, [filters, rows]);

  const pagedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [currentPage, filteredRows, pageSize]);

  const handleSearch = (values) => {
    setCurrentPage(1);
    setFilters(values);
  };

  const handleReset = () => {
    form.resetFields();
    setFilters({});
    setCurrentPage(1);
  };

  const handleExport = () => {
    if (filteredRows.length === 0) {
      message.warning('当前没有可导出的数据');
      return;
    }
    exportCsv('仓库消耗汇总.csv', ['materialCode', 'materialName', 'supplierName', 'specification', 'model', 'manufacturer', 'registrationNumber', 'batchNumber', 'productionDate', 'expiryDate', 'unit', 'purchaseAmount', 'totalQuantity', 'department', 'warehouse', 'outOrderNo', 'status'], filteredRows);
    message.success(`已导出 ${filteredRows.length} 条记录`);
  };

  const columns = [
    { title: '物资编码', dataIndex: 'materialCode', key: 'materialCode', align: 'center', width: 120 },
    { title: '商品名称', dataIndex: 'materialName', key: 'materialName', align: 'center' },
    { title: '供应商名称', dataIndex: 'supplierName', key: 'supplierName', align: 'center', width: 180 },
    {
      title: '规格型号',
      key: 'specification',
      align: 'center',
      render: (_, record) => `${record.specification || '-'} / ${record.model || '-'}`,
    },
    { title: '注册证号', dataIndex: 'registrationNumber', key: 'registrationNumber', align: 'center', width: 160 },
    { title: '生产厂家', dataIndex: 'manufacturer', key: 'manufacturer', align: 'center', width: 160 },
    { title: '生产批号', dataIndex: 'batchNumber', key: 'batchNumber', align: 'center', width: 140 },
    { title: '生产日期', dataIndex: 'productionDate', key: 'productionDate', align: 'center', width: 120 },
    { title: '失效日期', dataIndex: 'expiryDate', key: 'expiryDate', align: 'center', width: 120 },
    { title: '单位', dataIndex: 'unit', key: 'unit', align: 'center', width: 90 },
    { title: '采购金额', dataIndex: 'purchaseAmount', key: 'purchaseAmount', align: 'center', width: 120, render: (value) => `¥${Number(value || 0).toFixed(2)}` },
    { title: '总消耗数量', dataIndex: 'totalQuantity', key: 'totalQuantity', align: 'center', width: 120 },
    { title: '领用科室', dataIndex: 'department', key: 'department', align: 'center', width: 140 },
    { title: '仓库', dataIndex: 'warehouse', key: 'warehouse', align: 'center', width: 140 },
    { title: '出库单号', dataIndex: 'outOrderNo', key: 'outOrderNo', align: 'center', width: 160 },
    { title: '状态', dataIndex: 'status', key: 'status', align: 'center', width: 100 },
  ];

  return (
    <div style={{ padding: '0 16px' }}>
      <h1 style={{ marginBottom: 24 }}>仓库消耗汇总</h1>

      <Card style={{ marginBottom: 16 }}>
        <Form form={form} layout="inline" onFinish={handleSearch}>
          <Space wrap>
            <Form.Item name="materialName" label="商品名称">
              <Input placeholder="请输入商品名称" style={{ width: 220 }} />
            </Form.Item>
            <Form.Item name="department" label="领用科室">
              <Select allowClear placeholder="请选择领用科室" style={{ width: 220 }}>
                {departmentOptions.map((item) => (
                  <Select.Option key={item} value={item}>
                    {item}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="warehouse" label="仓库">
              <Select allowClear placeholder="请选择仓库" style={{ width: 200 }}>
                {warehouseOptions.map((item) => (
                  <Select.Option key={item} value={item}>
                    {item}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                  查询
                </Button>
                <Button onClick={handleReset}>重置</Button>
                <Button icon={<ExportOutlined />} onClick={handleExport}>
                  导出
                </Button>
              </Space>
            </Form.Item>
          </Space>
        </Form>
      </Card>

      <Table
        columns={columns}
        dataSource={pagedRows}
        loading={loading}
        rowKey="key"
        pagination={{
          current: currentPage,
          pageSize,
          total: filteredRows.length,
          onChange: (page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          },
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条记录`,
        }}
        size="small"
        scroll={{ x: 2400 }}
      />
    </div>
  );
};

export default ReportsConsumptionSummary;
