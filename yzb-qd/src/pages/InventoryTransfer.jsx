import { useEffect, useMemo, useState } from 'react';
import { Table, Card, Input, Select, Button, Space, Tag, Modal, Form, InputNumber, Empty, message } from 'antd';
import { PlusOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import api from '../utils/api.js';

const formatDate = (value) => (value ? String(value).slice(0, 10) : '-');

const renderTransferStatusTag = (status) => {
  const statusMap = {
    pending: <Tag color="orange">待验收</Tag>,
    partially_accepted: <Tag color="gold">部分验收</Tag>,
    completed: <Tag color="green">已完成</Tag>,
    rejected: <Tag color="red">已拒收</Tag>,
    canceled: <Tag color="default">已取消</Tag>,
  };
  return statusMap[status] || <Tag>{status || '-'}</Tag>;
};

const InventoryTransfer = () => {
  const [createForm] = Form.useForm();
  const selectedFromWarehouse = Form.useWatch('fromWarehouse', createForm);
  const [transferData, setTransferData] = useState([]);
  const [warehouseList, setWarehouseList] = useState([]);
  const [sourceInventory, setSourceInventory] = useState([]);
  const [selectedSourceRowKeys, setSelectedSourceRowKeys] = useState([]);
  const [transferQuantities, setTransferQuantities] = useState({});
  const [loading, setLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [sourceInventoryLoading, setSourceInventoryLoading] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useState({
    transferNumber: '',
    fromWarehouse: 'all',
    toWarehouse: 'all',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const getCurrentUserName = () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      return userInfo.realName || userInfo.name || userInfo.userName || '管理员';
    } catch {
      return '管理员';
    }
  };

  const availableTargetWarehouses = useMemo(() => {
    return warehouseList.filter((item) => item.value !== selectedFromWarehouse);
  }, [selectedFromWarehouse, warehouseList]);

  const transferColumns = [
    { title: '调拨单号', dataIndex: 'transferNumber', key: 'transferNumber' },
    { title: '供应商名称', dataIndex: 'supplierName', key: 'supplierName' },
    { title: '物资编码', dataIndex: 'materialCode', key: 'materialCode' },
    { title: '商品名称', dataIndex: 'materialName', key: 'materialName' },
    { title: '物资类型', dataIndex: 'materialType', key: 'materialType', render: (value) => value || '-' },
    { title: '规格型号', dataIndex: 'specification', key: 'specification' },
    { title: '注册证号', dataIndex: 'registrationNumber', key: 'registrationNumber' },
    { title: '生产厂家', dataIndex: 'manufacturer', key: 'manufacturer' },
    { title: '生产批号', dataIndex: 'batchNumber', key: 'batchNumber' },
    { title: '生产日期', dataIndex: 'productionDate', key: 'productionDate', render: formatDate },
    { title: '失效日期', dataIndex: 'expiryDate', key: 'expiryDate', render: formatDate },
    { title: '调出仓库', dataIndex: 'fromWarehouse', key: 'fromWarehouse' },
    { title: '调入仓库', dataIndex: 'toWarehouse', key: 'toWarehouse' },
    { title: '所属科室', dataIndex: 'department', key: 'department' },
    {
      title: '采购金额',
      dataIndex: 'purchaseAmount',
      key: 'purchaseAmount',
      render: (value) => (value != null ? `¥${Number(value).toFixed(2)}` : '-'),
    },
    { title: '调拨数量', dataIndex: 'quantity', key: 'quantity' },
    { title: '单位', dataIndex: 'unit', key: 'unit' },
    { title: '调拨日期', dataIndex: 'transferDate', key: 'transferDate', render: formatDate },
    { title: '调拨人', dataIndex: 'transferor', key: 'transferor' },
    { title: '状态', dataIndex: 'status', key: 'status', render: (status) => renderTransferStatusTag(status) },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => message.info(`调拨单 ${record.transferNumber} 的详情功能将继续完善`)}>查看详情</a>
          <a onClick={() => message.info(`调拨单 ${record.transferNumber} 的编辑功能将继续完善`)}>编辑</a>
          <a onClick={() => message.info(`调拨单 ${record.transferNumber} 的取消功能将继续完善`)}>取消</a>
        </Space>
      ),
    },
  ];

  const sourceInventoryColumns = [
    { title: '物资编码', dataIndex: 'materialCode', key: 'materialCode', width: 120 },
    { title: '物资名称', dataIndex: 'materialName', key: 'materialName', width: 150 },
    { title: '仓库/科室', dataIndex: 'warehouse', key: 'warehouse', width: 150 },
    { title: '批号', dataIndex: 'batchNumber', key: 'batchNumber', width: 150 },
    { title: '生产日期', dataIndex: 'productionDate', key: 'productionDate', width: 120, render: formatDate },
    { title: '失效日期', dataIndex: 'expiryDate', key: 'expiryDate', width: 120, render: formatDate },
    { title: '当前库存', dataIndex: 'currentStock', key: 'currentStock', width: 100 },
    { title: '单位', dataIndex: 'unit', key: 'unit', width: 80 },
    { title: '供应商', dataIndex: 'supplier', key: 'supplier', width: 180 },
    { title: '生产厂家', dataIndex: 'manufacturer', key: 'manufacturer', width: 160 },
    {
      title: '调拨数量',
      key: 'transferQuantity',
      width: 120,
      render: (_, record) => (
        <InputNumber
          min={1}
          max={record.currentStock}
          value={transferQuantities[record.id] ?? 1}
          onChange={(value) => {
            setTransferQuantities((previous) => ({
              ...previous,
              [record.id]: value,
            }));
          }}
          style={{ width: '100%' }}
        />
      ),
    },
  ];

  const loadWarehouseList = async () => {
    try {
      const response = await api.get('/api/scm/transfer/warehouses');
      if (response.code === 1 && Array.isArray(response.data)) {
        setWarehouseList(response.data);
      } else {
        setWarehouseList([]);
      }
    } catch (error) {
      console.error('加载仓库列表失败:', error);
      setWarehouseList([]);
    }
  };

  const loadTransferData = async (page = currentPage, size = pageSize, params = searchParams) => {
    try {
      setLoading(true);
      const response = await api.get('/api/scm/transfer/orders', {
        ...params,
        pageNum: page,
        pageSize: size,
      });
      if (response.code === 1 && response.data) {
        setTransferData((response.data.records || []).map((item) => ({
          key: item.id,
          transferNumber: item.transferNumber,
          supplierName: item.supplierName,
          materialCode: item.materialCode,
          materialName: item.materialName,
          materialType: item.materialType,
          specification: item.specification,
          registrationNumber: item.registrationNumber,
          manufacturer: item.manufacturer,
          batchNumber: item.batchNumber,
          productionDate: item.productionDate,
          expiryDate: item.expiryDate,
          fromWarehouse: item.fromWarehouse,
          toWarehouse: item.toWarehouse,
          department: item.departmentName || item.department,
          purchaseAmount: item.purchaseAmount,
          quantity: item.quantity,
          unit: item.unit,
          transferDate: item.transferDate,
          transferor: item.transferor,
          status: item.status,
        })));
        setTotal(response.data.total || 0);
        setCurrentPage(page);
        setPageSize(size);
      } else {
        setTransferData([]);
        setTotal(0);
        message.error(response.message || '加载调拨数据失败');
      }
    } catch (error) {
      console.error('加载调拨数据失败:', error);
      setTransferData([]);
      setTotal(0);
      message.error(error.message || '加载调拨数据失败，请检查网络连接或联系管理员');
    } finally {
      setLoading(false);
    }
  };

  const loadSourceInventory = async (warehouseName) => {
    try {
      setSourceInventoryLoading(true);
      const response = await api.get('/api/scm/inventory', {
        pageNum: 1,
        pageSize: 200,
        warehouse: warehouseName,
      });
      if (response.code !== 1 || !response.data) {
        message.error(response.message || '加载可调拨库存失败');
        setSourceInventory([]);
        return;
      }
      setSourceInventory((response.data.records || []).map((item) => ({
        key: item.id,
        id: item.id,
        warehouse: item.warehouse,
        materialCode: item.materialCode,
        materialName: item.materialName,
        category: item.category,
        specification: item.specification,
        model: item.model,
        batchNumber: item.batchNumber,
        productionDate: item.productionDate,
        expiryDate: item.expiryDate,
        currentStock: Number(item.currentStock || 0),
        unit: item.unit,
        supplier: item.supplier,
        manufacturer: item.manufacturer,
      })));
    } catch (error) {
      console.error('加载可调拨库存失败:', error);
      setSourceInventory([]);
      message.error(error.message || '加载可调拨库存失败');
    } finally {
      setSourceInventoryLoading(false);
    }
  };

  useEffect(() => {
    loadWarehouseList();
    loadTransferData();
  }, []);

  const handleSearch = () => {
    loadTransferData(1, pageSize, searchParams);
  };

  const handleReset = () => {
    const resetParams = {
      transferNumber: '',
      fromWarehouse: 'all',
      toWarehouse: 'all',
    };
    setSearchParams(resetParams);
    loadTransferData(1, pageSize, resetParams);
  };

  const handlePaginationChange = (page, size) => {
    loadTransferData(page, size, searchParams);
  };

  const handleCreateTransfer = () => {
    createForm.resetFields();
    createForm.setFieldsValue({
      operatorName: getCurrentUserName(),
      transferDate: new Date().toISOString().slice(0, 10),
      fromWarehouse: undefined,
      toWarehouse: undefined,
    });
    setSelectedSourceRowKeys([]);
    setTransferQuantities({});
    setSourceInventory([]);
    setCreateModalOpen(true);
  };

  const handleSubmitCreateTransfer = async () => {
    try {
      const values = await createForm.validateFields();
      if (selectedSourceRowKeys.length === 0) {
        message.warning('请至少选择一条库存记录发起调拨');
        return;
      }

      const selectedItems = sourceInventory.filter((item) => selectedSourceRowKeys.includes(item.key));
      const invalidItem = selectedItems.find((item) => {
        const quantity = Number(transferQuantities[item.id] || 0);
        return quantity <= 0 || quantity > Number(item.currentStock || 0);
      });
      if (invalidItem) {
        message.error(`请确认 ${invalidItem.materialName} 的调拨数量大于0且不超过当前库存`);
        return;
      }

      setCreateLoading(true);
      const response = await api.post('/api/scm/transfer/orders', {
        fromWarehouse: values.fromWarehouse,
        toWarehouse: values.toWarehouse,
        operatorName: values.operatorName,
        transferDate: values.transferDate,
        items: selectedItems.map((item) => ({
          inventoryId: item.id,
          quantity: Number(transferQuantities[item.id] || 0),
        })),
      });

      if (response.code !== 1) {
        message.error(response.message || '创建调拨单失败');
        return;
      }

      message.success(`调拨单创建成功：${response.data?.transferNumber || ''}`.trim());
      setCreateModalOpen(false);
      setSelectedSourceRowKeys([]);
      setTransferQuantities({});
      setSourceInventory([]);
      createForm.resetFields();
      await Promise.all([loadWarehouseList(), loadTransferData(1, pageSize, searchParams)]);
    } catch (error) {
      if (error?.errorFields) {
        return;
      }
      message.error(error.message || '创建调拨单失败');
    } finally {
      setCreateLoading(false);
    }
  };

  return (
    <div style={{ padding: '0 16px' }}>
      <h1 style={{ marginBottom: 24 }}>物资调拨</h1>

      <Card style={{ marginBottom: 16, padding: '16px' }}>
        <div style={{ marginBottom: '16px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '8px', fontWeight: '500', minWidth: '80px' }}>调拨单号：</span>
            <Input
              placeholder="请输入调拨单号"
              style={{ width: '200px' }}
              value={searchParams.transferNumber}
              onChange={(e) => setSearchParams((previous) => ({ ...previous, transferNumber: e.target.value }))}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '8px', fontWeight: '500', minWidth: '80px' }}>调出仓库：</span>
            <Select
              placeholder="请选择调出仓库"
              style={{ width: '200px' }}
              value={searchParams.fromWarehouse}
              onChange={(value) => setSearchParams((previous) => ({ ...previous, fromWarehouse: value }))}
              options={[{ label: '全部仓库', value: 'all' }, ...warehouseList]}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '8px', fontWeight: '500', minWidth: '80px' }}>调入仓库：</span>
            <Select
              placeholder="请选择调入仓库"
              style={{ width: '200px' }}
              value={searchParams.toWarehouse}
              onChange={(value) => setSearchParams((previous) => ({ ...previous, toWarehouse: value }))}
              options={[{ label: '全部仓库', value: 'all' }, ...warehouseList]}
            />
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>查询</Button>
          <Button icon={<ReloadOutlined />} onClick={handleReset}>重置</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateTransfer}>新建调拨</Button>
        </div>
      </Card>

      <div style={{ overflowX: 'auto' }}>
        <Table
          columns={transferColumns.map((column) => ({
            ...column,
            ellipsis: false,
            align: 'center',
            onHeaderCell: () => ({ style: { whiteSpace: 'nowrap' } }),
            onCell: () => ({ style: { whiteSpace: 'nowrap' } }),
          }))}
          dataSource={transferData}
          loading={loading}
          pagination={{
            current: currentPage,
            pageSize,
            total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (pageTotal) => `共 ${pageTotal} 条记录`,
            onChange: handlePaginationChange,
            style: {
              display: 'flex',
              justifyContent: 'center',
              marginTop: '16px',
            },
          }}
          size="small"
          scroll={{ x: 2600 }}
        />
      </div>

      <Modal
        title="新增调拨"
        open={createModalOpen}
        onOk={handleSubmitCreateTransfer}
        onCancel={() => {
          setCreateModalOpen(false);
          setSelectedSourceRowKeys([]);
          setTransferQuantities({});
          setSourceInventory([]);
          createForm.resetFields();
        }}
        okText="创建调拨单"
        cancelText="取消"
        confirmLoading={createLoading}
        width={1400}
        destroyOnHidden
      >
        <Form form={createForm} layout="vertical">
          <Space align="start" wrap style={{ width: '100%', marginBottom: 12 }}>
            <Form.Item name="fromWarehouse" label="调出仓库" rules={[{ required: true, message: '请选择调出仓库' }]}>
              <Select
                showSearch
                optionFilterProp="label"
                placeholder="请选择调出仓库"
                style={{ width: 220 }}
                options={warehouseList}
                onChange={(value) => {
                  createForm.setFieldValue('toWarehouse', undefined);
                  setSelectedSourceRowKeys([]);
                  setTransferQuantities({});
                  if (value) {
                    loadSourceInventory(value);
                  } else {
                    setSourceInventory([]);
                  }
                }}
              />
            </Form.Item>

            <Form.Item name="toWarehouse" label="调入仓库" rules={[{ required: true, message: '请选择调入仓库' }]}>
              <Select
                showSearch
                optionFilterProp="label"
                placeholder="请选择调入仓库"
                style={{ width: 220 }}
                options={availableTargetWarehouses}
              />
            </Form.Item>

            <Form.Item name="transferDate" label="调拨日期" rules={[{ required: true, message: '请输入调拨日期' }]}>
              <Input type="date" style={{ width: 180 }} />
            </Form.Item>

            <Form.Item name="operatorName" label="调拨人" rules={[{ required: true, message: '请输入调拨人' }]}>
              <Input style={{ width: 180 }} placeholder="请输入调拨人" />
            </Form.Item>
          </Space>
        </Form>

        {selectedFromWarehouse ? (
          <Table
            rowKey="key"
            columns={sourceInventoryColumns}
            dataSource={sourceInventory}
            loading={sourceInventoryLoading}
            rowSelection={{
              selectedRowKeys: selectedSourceRowKeys,
              onChange: (keys) => {
                setSelectedSourceRowKeys(keys);
                setTransferQuantities((previous) => {
                  const next = { ...previous };
                  keys.forEach((key) => {
                    if (!next[key]) {
                      next[key] = 1;
                    }
                  });
                  return next;
                });
              },
            }}
            pagination={false}
            scroll={{ x: 1650, y: 420 }}
            locale={{ emptyText: <Empty description="当前调出仓库暂无可调拨库存" /> }}
          />
        ) : (
          <Empty description="请先选择调出仓库" />
        )}
      </Modal>
    </div>
  );
};

export default InventoryTransfer;
