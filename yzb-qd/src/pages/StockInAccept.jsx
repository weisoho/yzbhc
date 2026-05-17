import { useEffect, useMemo, useState } from 'react';
import { Button, Card, DatePicker, Form, Input, InputNumber, Modal, Table, Tag, message } from 'antd';
import { DownloadOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import moment from 'moment';
import api from '../utils/api.js';

const StockInAccept = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [data, setData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [materialMetaMap, setMaterialMetaMap] = useState({});
  const [receiptMap, setReceiptMap] = useState({});

  const getCurrentUserName = () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      return userInfo.realName || userInfo.name || userInfo.userName || '管理员';
    } catch {
      return '管理员';
    }
  };

  const decoratePendingItem = (item, previous = {}) => {
    const meta = materialMetaMap[item.productCode] || materialMetaMap[item.materialCode] || {};
    const receipt = receiptMap[item.receiveId] || receiptMap[item.receiptId] || {};
    return {
      ...item,
      key: String(item.receiveItemId || item.id || previous.key),
      receiveId: item.receiveId || item.receiptId,
      receiveItemId: item.receiveItemId || item.id,
      receiveNumber: item.receiveNumber || receipt.receiveNumber || previous.receiveNumber || '',
      materialId: meta.id || previous.materialId,
      materialType: meta.materialType || previous.materialType || '',
      minPackage: meta.minPackage || previous.minPackage || '1',
      batchNumber: previous.batchNumber || '',
      productionDate: previous.productionDate || '',
      expiryDate: previous.expiryDate || '',
      actualDeliveryDate: item.actualDeliveryDate || previous.actualDeliveryDate || receipt.actualDeliveryDate || '',
      receiveTime: item.receiveTime || previous.receiveTime || receipt.createTime || '',
      stockInQuantity: previous.stockInQuantity ?? item.pendingQuantity ?? 0,
      remark: previous.remark || '',
    };
  };

  const loadMaterialMetadata = async () => {
    const response = await api.get('/api/scm/materials/enabled');
    if (response.code === 1 && Array.isArray(response.data)) {
      setMaterialMetaMap(response.data.reduce((accumulator, item) => {
        accumulator[item.materialCode] = item;
        return accumulator;
      }, {}));
    }
  };

  const loadPendingReceipts = async () => {
    const response = await api.get('/api/scm/purchases/receipts/pending-stock-in');
    if (response.code === 1 && Array.isArray(response.data)) {
      setReceiptMap(response.data.reduce((accumulator, item) => {
        accumulator[item.id] = item;
        return accumulator;
      }, {}));
    }
  };

  const loadPendingItems = async (page = pagination.current, pageSize = pagination.pageSize) => {
    try {
      setLoading(true);
      const values = form.getFieldsValue();
      const response = await api.get('/api/scm/stock-in/pending-items', {
        pageNum: page,
        pageSize,
        orderNumber: values.orderNumber,
        productCode: values.productCode,
        productName: values.productName,
        supplier: values.supplier,
        manufacturer: values.manufacturer,
      });
      if (response.code !== 1 || !response.data) {
        message.error(response.message || '加载待入库明细失败');
        setData([]);
        setPagination((previous) => ({ ...previous, current: page, pageSize, total: 0 }));
        setSelectedRowKeys([]);
        return;
      }
      const records = response.data.records || [];
      setData((previousData) => {
        const previousMap = new Map(previousData.map((item) => [String(item.key), item]));
        return records.map((item) => decoratePendingItem(item, previousMap.get(String(item.receiveItemId || item.id)) || {}));
      });
      setPagination((previous) => ({
        ...previous,
        current: page,
        pageSize,
        total: response.data.total || 0,
      }));
      setSelectedRowKeys([]);
    } catch (error) {
      console.error('加载待入库明细失败:', error);
      message.error(error.message || '加载待入库明细失败');
      setData([]);
      setPagination((previous) => ({ ...previous, current: page, pageSize, total: 0 }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await Promise.all([loadMaterialMetadata(), loadPendingReceipts()]);
      } catch (error) {
        console.error('加载采购入库辅助数据失败:', error);
      }
      await loadPendingItems(1, pagination.pageSize);
    };
    loadInitialData();
  }, []);

  useEffect(() => {
    if (data.length === 0) {
      return;
    }
    setData((previous) => previous.map((item) => decoratePendingItem(item, item)));
  }, [materialMetaMap, receiptMap]);

  const handleSearch = () => {
    loadPendingItems(1, pagination.pageSize);
  };

  const handleReset = () => {
    form.resetFields();
    loadPendingItems(1, pagination.pageSize);
  };

  const handleExport = () => {
    message.info('如需导出，请先完成入库后在“入库单查询”页面导出');
  };

  const handleFieldChange = (key, field, value) => {
    setData((previous) => previous.map((item) => {
      if (item.key !== key) {
        return item;
      }
      return {
        ...item,
        [field]: value,
      };
    }));
  };

  const selectedItems = useMemo(
    () => data.filter((item) => selectedRowKeys.includes(item.key)),
    [data, selectedRowKeys],
  );

  const handleSubmit = () => {
    if (selectedItems.length === 0) {
      message.warning('请先勾选要提交的待入库明细');
      return;
    }

    const invalidItem = selectedItems.find((item) => (
      !item.materialId
      || !item.batchNumber
      || !item.productionDate
      || !item.expiryDate
      || !item.stockInQuantity
      || Number(item.stockInQuantity) <= 0
      || Number(item.stockInQuantity) > Number(item.pendingQuantity || 0)
    ));

    if (invalidItem) {
      message.error(`请补全 ${invalidItem.productName} 的主档、批号、生产日期、失效日期，并确保入库数量不超过待入库数量`);
      return;
    }

    Modal.confirm({
      title: '确认提交入库',
      content: `确定要提交选中的 ${selectedItems.length} 条待入库明细吗？提交后会同步写入库存并生成入库单。`,
      okText: '确认提交',
      cancelText: '取消',
      onOk: async () => {
        try {
          setSubmitting(true);
          setLoading(true);
          const groupedByReceipt = selectedItems.reduce((accumulator, item) => {
            if (!accumulator[item.receiveId]) {
              accumulator[item.receiveId] = [];
            }
            accumulator[item.receiveId].push(item);
            return accumulator;
          }, {});

          let successCount = 0;
          let failCount = 0;

          for (const [receiptId, items] of Object.entries(groupedByReceipt)) {
            const response = await api.post(`/api/scm/stock-in/receipts/${receiptId}`, {
              stockInType: '采购入库',
              operatorName: getCurrentUserName(),
              remark: `采购收货单 ${items[0]?.receiveNumber || receiptId} 入库`,
              items: items.map((item) => ({
                receiveItemId: item.receiveItemId,
                materialId: item.materialId,
                materialCode: item.productCode,
                materialName: item.productName,
                materialType: item.materialType,
                specification: item.specification,
                model: item.model,
                minPackage: item.minPackage,
                unit: item.orderUnit,
                supplierName: item.supplierName,
                manufacturer: item.manufacturer,
                registrationNumber: item.registrationNumber,
                batchNumber: item.batchNumber,
                productionDate: item.productionDate,
                expiryDate: item.expiryDate,
                purchasePrice: item.purchasePrice,
                orderQuantity: item.orderQuantity,
                stockInQuantity: item.stockInQuantity,
                remark: item.remark,
              })),
            });

            if (response.code === 1) {
              successCount++;
            } else {
              failCount++;
              message.error(response.message || `收货单 ${items[0]?.receiveNumber || receiptId} 入库失败`);
            }
          }

          if (successCount > 0) {
            message.success(`成功提交 ${successCount} 张入库单${failCount > 0 ? `，${failCount} 张失败` : ''}`);
            await Promise.all([loadPendingReceipts(), loadPendingItems(1, pagination.pageSize)]);
          } else {
            message.error('入库提交失败');
          }
        } catch (error) {
          console.error('提交入库失败:', error);
          message.error(error.message || '提交入库失败');
        } finally {
          setSubmitting(false);
          setLoading(false);
        }
      },
    });
  };

  const columns = [
    {
      title: '收货单号',
      dataIndex: 'receiveNumber',
      key: 'receiveNumber',
      width: 150,
      render: (value) => <Tag color="blue">{value || '--'}</Tag>,
    },
    {
      title: '采购单号',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      width: 150,
    },
    {
      title: '供应商',
      dataIndex: 'supplierName',
      key: 'supplierName',
      width: 180,
    },
    {
      title: '申领科室',
      dataIndex: 'department',
      key: 'department',
      width: 140,
    },
    {
      title: '物资编码',
      dataIndex: 'productCode',
      key: 'productCode',
      width: 120,
    },
    {
      title: '物资名称',
      dataIndex: 'productName',
      key: 'productName',
      width: 160,
    },
    {
      title: '规格',
      dataIndex: 'specification',
      key: 'specification',
      width: 120,
    },
    {
      title: '型号',
      dataIndex: 'model',
      key: 'model',
      width: 120,
    },
    {
      title: '待入库数量',
      dataIndex: 'pendingQuantity',
      key: 'pendingQuantity',
      width: 110,
    },
    {
      title: '采购收货时间',
      key: 'receiveTime',
      width: 170,
      render: (_, record) => record.receiveTime
        ? moment(record.receiveTime).format('YYYY-MM-DD HH:mm:ss')
        : (record.actualDeliveryDate || '--'),
    },
    {
      title: '批号',
      key: 'batchNumber',
      width: 160,
      render: (_, record) => (
        <Input
          value={record.batchNumber}
          onChange={(event) => handleFieldChange(record.key, 'batchNumber', event.target.value)}
          placeholder="请输入批号"
        />
      ),
    },
    {
      title: '生产日期',
      key: 'productionDate',
      width: 150,
      render: (_, record) => (
        <DatePicker
          value={record.productionDate ? moment(record.productionDate, 'YYYY-MM-DD') : null}
          onChange={(value) => handleFieldChange(record.key, 'productionDate', value ? value.format('YYYY-MM-DD') : '')}
          format="YYYY-MM-DD"
          style={{ width: '100%' }}
        />
      ),
    },
    {
      title: '失效日期',
      key: 'expiryDate',
      width: 150,
      render: (_, record) => (
        <DatePicker
          value={record.expiryDate ? moment(record.expiryDate, 'YYYY-MM-DD') : null}
          onChange={(value) => handleFieldChange(record.key, 'expiryDate', value ? value.format('YYYY-MM-DD') : '')}
          format="YYYY-MM-DD"
          style={{ width: '100%' }}
        />
      ),
    },
    {
      title: '入库数量',
      key: 'stockInQuantity',
      width: 120,
      render: (_, record) => (
        <InputNumber
          min={1}
          max={record.pendingQuantity}
          value={record.stockInQuantity}
          onChange={(value) => handleFieldChange(record.key, 'stockInQuantity', value)}
          style={{ width: '100%' }}
        />
      ),
    },
    {
      title: '单价',
      dataIndex: 'purchasePrice',
      key: 'purchasePrice',
      width: 110,
      render: (value) => `¥${Number(value || 0).toFixed(2)}`,
    },
    {
      title: '金额',
      key: 'purchaseAmount',
      width: 120,
      render: (_, record) => `¥${(Number(record.purchasePrice || 0) * Number(record.stockInQuantity || 0)).toFixed(2)}`,
    },
    {
      title: '备注',
      key: 'remark',
      width: 180,
      render: (_, record) => (
        <Input
          value={record.remark}
          onChange={(event) => handleFieldChange(record.key, 'remark', event.target.value)}
          placeholder="可选"
        />
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card title="采购入库">
        <Form form={form} style={{ marginBottom: 24 }}>
          <div style={{ padding: 16, backgroundColor: '#fafafa', borderRadius: 8 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ whiteSpace: 'nowrap' }}>采购单号：</span>
                  <Form.Item name="orderNumber" noStyle>
                    <Input placeholder="请输入采购单号" allowClear style={{ width: 180 }} size="middle" />
                  </Form.Item>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ whiteSpace: 'nowrap' }}>物资编码：</span>
                  <Form.Item name="productCode" noStyle>
                    <Input placeholder="请输入物资编码" allowClear style={{ width: 180 }} size="middle" />
                  </Form.Item>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ whiteSpace: 'nowrap' }}>物资名称：</span>
                  <Form.Item name="productName" noStyle>
                    <Input placeholder="请输入物资名称" allowClear style={{ width: 180 }} size="middle" />
                  </Form.Item>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ whiteSpace: 'nowrap' }}>供应商：</span>
                  <Form.Item name="supplier" noStyle>
                    <Input placeholder="请输入供应商" allowClear style={{ width: 180 }} size="middle" />
                  </Form.Item>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ whiteSpace: 'nowrap' }}>生产厂家：</span>
                  <Form.Item name="manufacturer" noStyle>
                    <Input placeholder="请输入生产厂家" allowClear style={{ width: 180 }} size="middle" />
                  </Form.Item>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch} style={{ minWidth: 90 }}>
                  查询
                </Button>
                <Button icon={<ReloadOutlined />} onClick={handleReset} style={{ minWidth: 90 }}>
                  重置
                </Button>
                <Button icon={<DownloadOutlined />} onClick={handleExport} style={{ minWidth: 90 }}>
                  导出
                </Button>
                <Button
                  type="primary"
                  disabled={selectedItems.length === 0 || submitting}
                  loading={submitting}
                  onClick={handleSubmit}
                >
                  确认提交入库（{selectedItems.length}/{data.length}）
                </Button>
              </div>
            </div>
          </div>
        </Form>

        <Table
          rowKey="key"
          columns={columns}
          dataSource={data}
          loading={loading}
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
          }}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条待入库明细`,
            position: ['bottomCenter'],
            onChange: (page, pageSize) => loadPendingItems(page, pageSize),
          }}
          scroll={{ x: 2400 }}
          summary={() => (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={8}>
                当前页面合计
              </Table.Summary.Cell>
              <Table.Summary.Cell index={8}>
                {data.reduce((sum, item) => sum + Number(item.pendingQuantity || 0), 0)}
              </Table.Summary.Cell>
              <Table.Summary.Cell index={9} colSpan={4} />
              <Table.Summary.Cell index={13}>
                {data.reduce((sum, item) => sum + Number(item.stockInQuantity || 0), 0)}
              </Table.Summary.Cell>
              <Table.Summary.Cell index={14} />
              <Table.Summary.Cell index={15}>
                ¥{data.reduce((sum, item) => sum + (Number(item.purchasePrice || 0) * Number(item.stockInQuantity || 0)), 0).toFixed(2)}
              </Table.Summary.Cell>
              <Table.Summary.Cell index={16} />
            </Table.Summary.Row>
          )}
        />
      </Card>
    </div>
  );
};

export default StockInAccept;


