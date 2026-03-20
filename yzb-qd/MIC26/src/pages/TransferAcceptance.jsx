import React, { useState, useEffect } from 'react';
import { Table, Card, Input, Select, Button, Space, Tag, Row, Col, Form, DatePicker, message, Modal, Checkbox, ConfigProvider, InputNumber } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import zhCN from 'antd/locale/zh_CN';
import api from '../utils/api';

const { Option } = Select;

const TransferAcceptance = () => {
  const [form] = Form.useForm();
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [acceptLoading, setAcceptLoading] = useState(false);
  const [transferAcceptanceData, setTransferAcceptanceData] = useState([]);
  const [warehouseList, setWarehouseList] = useState([]);
  const [searchParams, setSearchParams] = useState({
    transferNumber: '',
    fromWarehouse: 'all',
    toWarehouse: 'all',
    acceptanceStatus: 'all',
    startDate: undefined,
    endDate: undefined
  });

  const formatDate = (value) => {
    if (!value) return '';
    const s = typeof value === 'string' ? value : String(value);
    return s.length >= 10 ? s.slice(0, 10) : s;
  };

  const transferAcceptanceColumns = [
    { title: '调拨单号', dataIndex: 'transferNumber', key: 'transferNumber', width: 150, align: 'center' },
    { title: '商品名称', dataIndex: 'materialName', key: 'materialName', width: 150, align: 'center' },
    { title: '规格型号', dataIndex: 'specification', key: 'specification', width: 120, align: 'center' },
    { title: '调出仓库', dataIndex: 'fromWarehouse', key: 'fromWarehouse', width: 120, align: 'center' },
    { title: '调入仓库', dataIndex: 'toWarehouse', key: 'toWarehouse', width: 120, align: 'center' },
    { title: '调拨数量', dataIndex: 'quantity', key: 'quantity', width: 100, align: 'center' },
    { title: '单位', dataIndex: 'unit', key: 'unit', width: 80, align: 'center' },
    { title: '调拨日期', dataIndex: 'transferDate', key: 'transferDate', width: 120, align: 'center', render: (v) => formatDate(v) },
    { title: '调拨人', dataIndex: 'transferor', key: 'transferor', width: 100, align: 'center' },
    { title: '验收状态', dataIndex: 'acceptanceStatus', key: 'acceptanceStatus', width: 120, align: 'center', render: (status) => {
      const statusMap = {
        pending: <Tag color="orange">待验收</Tag>,
        accepted: <Tag color="green">已验收</Tag>,
        rejected: <Tag color="red">已拒收</Tag>,
        partially_accepted: <Tag color="blue">部分验收</Tag>
      };
      return statusMap[status] || status;
    }},
    { title: '验收数量', dataIndex: 'acceptedQuantity', key: 'acceptedQuantity', width: 100, align: 'center' },
    { title: '验收人', dataIndex: 'acceptor', key: 'acceptor', width: 100, align: 'center' },
    { title: '验收日期', dataIndex: 'acceptanceDate', key: 'acceptanceDate', width: 120, align: 'center', render: (v) => formatDate(v) },
    { 
      title: '操作', 
      key: 'action',
      width: 200,
      align: 'center',
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => handleViewDetail(record)}>查看详情</a>
        </Space>
      )
    },
  ];

  const loadWarehouseList = async () => {
    try {
      const response = await api.get('/api/scm/transfer/warehouses');
      if (response.code === 1 && response.data) {
        setWarehouseList(response.data);
      }
    } catch (error) {
      console.error('加载仓库列表失败:', error);
    }
  };

  // 获取调拨验收数据
  const fetchTransferAcceptanceData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/scm/transfer/acceptance', {
        ...searchParams,
        pageNum: currentPage,
        pageSize: pageSize
      });
      if (response.code === 1 && response.data) {
        const records = (response.data.records || []).map(item => ({
          ...item,
          key: item.id
        }));
        setTransferAcceptanceData(records);
        setTotal(response.data.total || 0);
      } else {
        message.error(response.message || '获取调拨验收数据失败');
        setTransferAcceptanceData([]);
        setTotal(0);
      }
    } catch (error) {
      message.error(`获取调拨验收数据失败: ${error.message || '未知错误'}`);
      setTransferAcceptanceData([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  // 初始化数据
  useEffect(() => {
    loadWarehouseList();
  }, []);

  useEffect(() => {
    fetchTransferAcceptanceData();
  }, [currentPage, pageSize, searchParams]);

  const handleSearch = async (values) => {
    try {
      const nextParams = {
        transferNumber: values.transferNumber,
        fromWarehouse: values.fromWarehouse || 'all',
        toWarehouse: values.toWarehouse || 'all',
        acceptanceStatus: values.acceptanceStatus || 'all',
        startDate: values.dateRange ? values.dateRange[0].format('YYYY-MM-DD') : undefined,
        endDate: values.dateRange ? values.dateRange[1].format('YYYY-MM-DD') : undefined
      };
      setCurrentPage(1);
      setSearchParams(nextParams);
    } catch (error) {
      message.error(`查询失败: ${error.message || '未知错误'}`);
    }
  };

  const handleReset = () => {
    form.resetFields();
    setCurrentPage(1);
    setPageSize(10);
    setSearchParams({
      transferNumber: '',
      fromWarehouse: 'all',
      toWarehouse: 'all',
      acceptanceStatus: 'all',
      startDate: undefined,
      endDate: undefined
    });
    message.success('已重置搜索条件');
  };

  const handleViewDetail = async (record) => {
    try {
      setDetailLoading(true);
      setSelectedTransfer(record);
      setDetailModalVisible(true);
      const response = await api.get(`/api/scm/transfer/acceptance/detail/${record.transferNumber}`);
      if (response.code === 1) {
        const items = (response.data || []).map(item => {
          const acceptedQuantity = item.acceptedQuantity || 0;
          const quantity = item.quantity || 0;
          const remainingQuantity = Math.max(0, quantity - acceptedQuantity);
          const disabled = item.acceptanceStatus === 'accepted' || item.acceptanceStatus === 'rejected' || remainingQuantity <= 0;
          return ({
            ...item,
            key: item.id,
            selected: false,
            remainingQuantity,
            acceptQuantity: remainingQuantity,
            disabled
          });
        });
        setSelectedItems(items);
      } else {
        message.error(response.message || '获取详细数据失败');
        setSelectedItems([]);
      }
    } catch (error) {
      message.error(`获取详细数据失败: ${error.message || '未知错误'}`);
      setSelectedItems([]);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleCloseDetailModal = () => {
    setDetailModalVisible(false);
    setSelectedTransfer(null);
    setSelectedItems([]);
  };

  const handleItemSelect = (key, checked) => {
    const newItems = selectedItems.map(item => 
      item.key === key ? { ...item, selected: item.disabled ? false : checked } : item
    );
    setSelectedItems(newItems);
  };

  const handleSelectAll = (checked) => {
    const newItems = selectedItems.map(item => ({ ...item, selected: item.disabled ? false : checked }));
    setSelectedItems(newItems);
  };

  const handleAcceptInModal = async () => {
    try {
      setAcceptLoading(true);
      const selectedCount = selectedItems.filter(item => item.selected).length;
      if (selectedCount === 0) {
        message.warning('请选择要验收的物资');
        return;
      }
      const invalidItem = selectedItems.filter(item => item.selected).find(item => !item.batchNumber || !item.acceptQuantity || item.acceptQuantity <= 0 || item.acceptQuantity > (item.remainingQuantity || 0));
      if (invalidItem) {
        message.error('所选物资存在批号为空或本次验收数量不合法的数据');
        return;
      }
      
      const acceptData = {
        transferNumber: selectedTransfer.transferNumber,
        items: selectedItems.filter(item => item.selected).map(item => ({ id: item.id, quantity: item.acceptQuantity })),
        acceptor: '管理员',
        acceptanceDate: new Date().toISOString().split('T')[0]
      };
      
      const resp = await api.post('/api/scm/transfer/acceptance/accept', acceptData);
      if (resp.code !== 1) {
        message.error(resp.message || '验收失败');
        return;
      }
      
      message.success(`已入库 ${selectedCount} 项物资`);
      await fetchTransferAcceptanceData();
      handleCloseDetailModal();
    } catch (error) {
      message.error(`验收失败: ${error.message || '未知错误'}`);
    } finally {
      setAcceptLoading(false);
    }
  };

  const handleRejectInModal = async () => {
    try {
      setAcceptLoading(true);
      const selectedCount = selectedItems.filter(item => item.selected).length;
      if (selectedCount === 0) {
        message.warning('请选择要拒收的物资');
        return;
      }
      const invalidItem = selectedItems.filter(item => item.selected).find(item => !item.batchNumber);
      if (invalidItem) {
        message.error('所选物资存在批号为空的数据');
        return;
      }
      
      const rejectData = {
        transferNumber: selectedTransfer.transferNumber,
        items: selectedItems.filter(item => item.selected).map(item => ({ id: item.id, quantity: 0 })),
        acceptor: '管理员',
        acceptanceDate: new Date().toISOString().split('T')[0]
      };
      
      const resp = await api.post('/api/scm/transfer/acceptance/reject', rejectData);
      if (resp.code !== 1) {
        message.error(resp.message || '拒收失败');
        return;
      }
      
      message.warning(`已拒收 ${selectedCount} 项物资`);
      await fetchTransferAcceptanceData();
      handleCloseDetailModal();
    } catch (error) {
      message.error(`拒收失败: ${error.message || '未知错误'}`);
    } finally {
      setAcceptLoading(false);
    }
  };

  return (
    <ConfigProvider locale={zhCN}>
      <div style={{ padding: '0 16px' }}>
      <style>
        {`
          .custom-scrollbar::-webkit-scrollbar {
            height: 12px;
            background-color: #f5f5f5;
            border-radius: 6px;
          }
          
          .custom-scrollbar::-webkit-scrollbar-track {
            background-color: #f5f5f5;
            border-radius: 6px;
          }
          
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: #c1c1c1;
            border-radius: 6px;
            border: 2px solid #f5f5f5;
          }
          
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background-color: #a8a8a8;
          }
          
          .custom-scrollbar::-webkit-scrollbar-button {
            display: none;
          }
          
          .table-container {
            position: relative;
            margin-bottom: 20px;
          }
          
          .scrollbar-hint {
            text-align: center;
            color: #999;
            font-size: 12px;
            margin-top: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
          }
          

        `}
      </style>
      <h1 style={{ marginBottom: 24 }}>调拨验收入库</h1>
      
      <Card style={{ marginBottom: 16 }}>
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            fromWarehouse: 'all',
            toWarehouse: 'all',
            acceptanceStatus: 'all'
          }}
          onFinish={handleSearch}
        >
          <Row gutter={[16, 0]} align="middle">
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="transferNumber" label="调拨单号">
                <Input placeholder="请输入调拨单号" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="fromWarehouse" label="调出仓库">
                <Select placeholder="请选择调出仓库" style={{ width: '100%' }}>
                  <Option value="all">全部仓库</Option>
                  {warehouseList.map(warehouse => (
                    <Option key={warehouse.value} value={warehouse.value}>
                      {warehouse.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="toWarehouse" label="调入仓库">
                <Select placeholder="请选择调入仓库" style={{ width: '100%' }}>
                  <Option value="all">全部仓库</Option>
                  {warehouseList.map(warehouse => (
                    <Option key={warehouse.value} value={warehouse.value}>
                      {warehouse.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="acceptanceStatus" label="验收状态">
                <Select placeholder="请选择验收状态" style={{ width: '100%' }}>
                  <Option value="all">全部状态</Option>
                  <Option value="pending">待验收</Option>
                  <Option value="accepted">已验收</Option>
                  <Option value="rejected">已拒收</Option>
                  <Option value="partially_accepted">部分验收</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="dateRange" label="调拨日期">
                <DatePicker.RangePicker locale={zhCN} format="YYYY年MM月DD日" placeholder={['开始日期', '结束日期']} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={12} lg={6}>
              <Form.Item label=" ">
                <Space>
                  <Button type="primary" icon={<SearchOutlined />} htmlType="submit" loading={loading}>
                    查询
                  </Button>
                  <Button onClick={handleReset}>
                    重置
                  </Button>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
      
      <div className="table-container">
        <div style={{ overflowX: 'auto' }} className="custom-scrollbar">
          <Table 
            columns={transferAcceptanceColumns} 
            dataSource={transferAcceptanceData} 
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: total,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条记录`,
              style: {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                margin: '24px 0 0 0',
              },
              onChange: (page, size) => {
                setCurrentPage(page);
                setPageSize(size);
              },
            }}
            rowKey="key"
            style={{
              borderRadius: 8,
              overflow: 'hidden',
              minWidth: '1500px', // 增加最小宽度，确保横版显示
              width: '100%',
            }}
            scroll={{ x: 'max-content' }} // 启用横向滚动
            loading={loading}
            components={{
              Header: (props) => (
                <thead {...props} style={{ 
                  backgroundColor: '#f0f4ff',
                  borderRadius: '8px 8px 0 0',
                }} />
              ),
              Th: (props) => (
                <th {...props} style={{
                  fontWeight: 600,
                  color: '#262626',
                  borderBottom: '2px solid #667eea',
                  padding: '12px 16px', // 增加内边距
                  fontSize: 14,
                  whiteSpace: 'nowrap',
                  textAlign: 'center', // 确保表头居中
                }} />
              ),
              Td: (props) => (
                <td {...props} style={{
                  padding: '12px 16px', // 增加内边距
                  borderBottom: '1px solid #f0f0f0',
                  transition: 'all 0.3s ease',
                  fontSize: 14,
                  whiteSpace: 'nowrap', // 确保内容不换行
                  textAlign: 'center', // 确保内容居中
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
        <div className="scrollbar-hint">
        </div>
      </div>


      {/* 查看详情弹窗 */}
      <Modal
        title={`调拨单详情 - ${selectedTransfer?.transferNumber || ''}`}
        open={detailModalVisible}
        onCancel={handleCloseDetailModal}
        width={1000}
        footer={[
          <Button key="reject" type="danger" onClick={handleRejectInModal} loading={acceptLoading}>
            拒收
          </Button>,
          <Button key="accept" type="primary" onClick={handleAcceptInModal} loading={acceptLoading}>
            入库
          </Button>,
        ]}
      >
        {selectedTransfer && (
          <div>
            <div style={{ marginBottom: 16, padding: 16, backgroundColor: '#f8f9fa', borderRadius: 8 }}>
              <Row gutter={[16, 8]}>
                <Col span={8}>
                  <div><strong>调拨单号：</strong>{selectedTransfer.transferNumber}</div>
                </Col>
                <Col span={8}>
                  <div><strong>调出仓库：</strong>{selectedTransfer.fromWarehouse}</div>
                </Col>
                <Col span={8}>
                  <div><strong>调入仓库：</strong>{selectedTransfer.toWarehouse}</div>
                </Col>
                <Col span={8}>
                  <div><strong>调拨日期：</strong>{formatDate(selectedTransfer.transferDate)}</div>
                </Col>
                <Col span={8}>
                  <div><strong>调拨人：</strong>{selectedTransfer.transferor}</div>
                </Col>
                <Col span={8}>
                  <div><strong>验收状态：</strong>
                    {selectedTransfer.acceptanceStatus === 'pending' && <Tag color="orange">待验收</Tag>}
                    {selectedTransfer.acceptanceStatus === 'accepted' && <Tag color="green">已验收</Tag>}
                    {selectedTransfer.acceptanceStatus === 'rejected' && <Tag color="red">已拒收</Tag>}
                    {selectedTransfer.acceptanceStatus === 'partially_accepted' && <Tag color="blue">部分验收</Tag>}
                  </div>
                </Col>
              </Row>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <h4>调拨物资列表</h4>
              </div>
              {detailLoading ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>加载中...</div>
              ) : (
                <div style={{ overflowX: 'auto' }} className="custom-scrollbar">
                  <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
                    <thead style={{ backgroundColor: '#f0f0f0' }}>
                      <tr>
                        <th style={{ padding: '12px 8px', textAlign: 'center', width: '60px', whiteSpace: 'nowrap' }}>
                          <Checkbox onChange={(e) => handleSelectAll(e.target.checked)} />
                        </th>
                        <th style={{ padding: '12px 8px', textAlign: 'center', whiteSpace: 'nowrap' }}>商品名称</th>
                        <th style={{ padding: '12px 8px', textAlign: 'center', whiteSpace: 'nowrap' }}>规格型号</th>
                        <th style={{ padding: '12px 8px', textAlign: 'center', whiteSpace: 'nowrap' }}>批号</th>
                        <th style={{ padding: '12px 8px', textAlign: 'center', whiteSpace: 'nowrap' }}>数量</th>
                        <th style={{ padding: '12px 8px', textAlign: 'center', whiteSpace: 'nowrap' }}>已验收</th>
                        <th style={{ padding: '12px 8px', textAlign: 'center', whiteSpace: 'nowrap' }}>本次验收</th>
                        <th style={{ padding: '12px 8px', textAlign: 'center', whiteSpace: 'nowrap' }}>单位</th>
                        <th style={{ padding: '12px 8px', textAlign: 'center', whiteSpace: 'nowrap' }}>生产日期</th>
                        <th style={{ padding: '12px 8px', textAlign: 'center', whiteSpace: 'nowrap' }}>有效期</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedItems.map(item => (
                        <tr key={item.key} style={{ borderBottom: '1px solid #f0f0f0' }}>
                          <td style={{ padding: '12px 8px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                            <Checkbox 
                              checked={item.selected} 
                              disabled={item.disabled}
                              onChange={(e) => handleItemSelect(item.key, e.target.checked)}
                            />
                          </td>
                          <td style={{ padding: '12px 8px', textAlign: 'center', whiteSpace: 'nowrap' }}>{item.materialName}</td>
                          <td style={{ padding: '12px 8px', textAlign: 'center', whiteSpace: 'nowrap' }}>{item.specification}</td>
                          <td style={{ padding: '12px 8px', textAlign: 'center', whiteSpace: 'nowrap' }}>{item.batchNumber}</td>
                          <td style={{ padding: '12px 8px', textAlign: 'center', whiteSpace: 'nowrap' }}>{item.quantity}</td>
                          <td style={{ padding: '12px 8px', textAlign: 'center', whiteSpace: 'nowrap' }}>{item.acceptedQuantity || 0}</td>
                          <td style={{ padding: '12px 8px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                            {item.disabled ? (
                              0
                            ) : (
                              <InputNumber
                                min={1}
                                max={item.remainingQuantity || 0}
                                value={item.acceptQuantity}
                                disabled={!item.selected}
                                onChange={(val) => {
                                  const next = selectedItems.map(x => x.key === item.key ? { ...x, acceptQuantity: val } : x);
                                  setSelectedItems(next);
                                }}
                                style={{ width: 110 }}
                              />
                            )}
                          </td>
                          <td style={{ padding: '12px 8px', textAlign: 'center', whiteSpace: 'nowrap' }}>{item.unit}</td>
                          <td style={{ padding: '12px 8px', textAlign: 'center', whiteSpace: 'nowrap' }}>{formatDate(item.productionDate)}</td>
                          <td style={{ padding: '12px 8px', textAlign: 'center', whiteSpace: 'nowrap' }}>{formatDate(item.expiryDate)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <div className="scrollbar-hint" style={{ marginTop: '8px', fontSize: '11px' }}>
              </div>
            </div>


          </div>
        )}
      </Modal>
      </div>
    </ConfigProvider>
  );
};

export default TransferAcceptance;
