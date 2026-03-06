import React, { useState } from 'react';
import { Table, Card, Input, Select, Button, Space, Tag, Row, Col, Form, DatePicker, message, Modal, Checkbox, Pagination, ConfigProvider } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import zhCN from 'antd/locale/zh_CN';

const { Option } = Select;

const TransferAcceptance = () => {
  const [form] = Form.useForm();
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const transferAcceptanceColumns = [
    { title: '调拨单号', dataIndex: 'transferNumber', key: 'transferNumber', width: 150, align: 'center' },
    { title: '商品名称', dataIndex: 'materialName', key: 'materialName', width: 150, align: 'center' },
    { title: '规格型号', dataIndex: 'specification', key: 'specification', width: 120, align: 'center' },
    { title: '调出仓库', dataIndex: 'fromWarehouse', key: 'fromWarehouse', width: 120, align: 'center' },
    { title: '调入仓库', dataIndex: 'toWarehouse', key: 'toWarehouse', width: 120, align: 'center' },
    { title: '调拨数量', dataIndex: 'quantity', key: 'quantity', width: 100, align: 'center' },
    { title: '单位', dataIndex: 'unit', key: 'unit', width: 80, align: 'center' },
    { title: '调拨日期', dataIndex: 'transferDate', key: 'transferDate', width: 120, align: 'center' },
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
    { title: '验收日期', dataIndex: 'acceptanceDate', key: 'acceptanceDate', width: 120, align: 'center' },
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

  const transferAcceptanceData = [
    { key: '1', transferNumber: 'TF20240601001', materialName: '一次性注射器', specification: '10ml', fromWarehouse: '仓库1', toWarehouse: '仓库2', quantity: 200, unit: '支', transferDate: '2024-06-01', transferor: '张三', acceptanceStatus: 'pending', acceptedQuantity: 0, acceptor: '', acceptanceDate: '' },
    { key: '2', transferNumber: 'TF20240601002', materialName: '输液器', specification: '500ml', fromWarehouse: '仓库2', toWarehouse: '仓库3', quantity: 100, unit: '个', transferDate: '2024-06-01', transferor: '李四', acceptanceStatus: 'accepted', acceptedQuantity: 100, acceptor: '王五', acceptanceDate: '2024-06-02' },
    { key: '3', transferNumber: 'TF20240531001', materialName: '医用棉签', specification: '100支/包', fromWarehouse: '仓库1', toWarehouse: '仓库3', quantity: 50, unit: '包', transferDate: '2024-05-31', transferor: '王五', acceptanceStatus: 'rejected', acceptedQuantity: 0, acceptor: '赵六', acceptanceDate: '2024-06-01' },
    { key: '4', transferNumber: 'TF20240530001', materialName: '酒精棉球', specification: '50g/瓶', fromWarehouse: '仓库3', toWarehouse: '仓库1', quantity: 30, unit: '瓶', transferDate: '2024-05-30', transferor: '赵六', acceptanceStatus: 'partially_accepted', acceptedQuantity: 25, acceptor: '张三', acceptanceDate: '2024-05-31' },
  ];

  const handleSearch = () => {
    message.success('查询成功');
  };

  const handleReset = () => {
    form.resetFields();
    message.success('已重置搜索条件');
  };

  const handleViewDetail = (record) => {
    setSelectedTransfer(record);
    setDetailModalVisible(true);
    // 模拟获取详细物资列表数据
    setSelectedItems([
      { key: '1', materialName: '一次性注射器', specification: '10ml', batchNumber: 'B20240601', quantity: 200, unit: '支', productionDate: '2024-05-01', expiryDate: '2025-05-01', selected: false },
      { key: '2', materialName: '一次性注射器', specification: '5ml', batchNumber: 'B20240602', quantity: 150, unit: '支', productionDate: '2024-05-15', expiryDate: '2025-05-15', selected: false },
      { key: '3', materialName: '一次性注射器', specification: '20ml', batchNumber: 'B20240603', quantity: 100, unit: '支', productionDate: '2024-05-20', expiryDate: '2025-05-20', selected: false },
    ]);
  };

  const handleCloseDetailModal = () => {
    setDetailModalVisible(false);
    setSelectedTransfer(null);
    setSelectedItems([]);
  };

  const handleItemSelect = (key, checked) => {
    const newItems = selectedItems.map(item => 
      item.key === key ? { ...item, selected: checked } : item
    );
    setSelectedItems(newItems);
  };

  const handleSelectAll = (checked) => {
    const newItems = selectedItems.map(item => ({ ...item, selected: checked }));
    setSelectedItems(newItems);
  };

  const handleAcceptInModal = () => {
    const selectedCount = selectedItems.filter(item => item.selected).length;
    message.success(`已入库 ${selectedCount} 项物资`);
    handleCloseDetailModal();
  };

  const handleRejectInModal = () => {
    const selectedCount = selectedItems.filter(item => item.selected).length;
    message.warning(`已拒收 ${selectedCount} 项物资`);
    handleCloseDetailModal();
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
                  <Option value="warehouse1">仓库1</Option>
                  <Option value="warehouse2">仓库2</Option>
                  <Option value="warehouse3">仓库3</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="toWarehouse" label="调入仓库">
                <Select placeholder="请选择调入仓库" style={{ width: '100%' }}>
                  <Option value="all">全部仓库</Option>
                  <Option value="warehouse1">仓库1</Option>
                  <Option value="warehouse2">仓库2</Option>
                  <Option value="warehouse3">仓库3</Option>
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
                  <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
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
              pageSize: 10,
              total: transferAcceptanceData.length,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条记录`,
              style: {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                margin: '24px 0 0 0',
              },
              onChange: (page) => setCurrentPage(page),
            }}
            rowKey="key"
            style={{
              borderRadius: 8,
              overflow: 'hidden',
              minWidth: '1500px', // 增加最小宽度，确保横版显示
              width: '100%',
            }}
            scroll={{ x: 'max-content' }} // 启用横向滚动
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
          <Button key="reject" type="danger" onClick={handleRejectInModal}>
            拒收
          </Button>,
          <Button key="accept" type="primary" onClick={handleAcceptInModal}>
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
                  <div><strong>调拨日期：</strong>{selectedTransfer.transferDate}</div>
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
                            onChange={(e) => handleItemSelect(item.key, e.target.checked)}
                          />
                        </td>
                        <td style={{ padding: '12px 8px', textAlign: 'center', whiteSpace: 'nowrap' }}>{item.materialName}</td>
                        <td style={{ padding: '12px 8px', textAlign: 'center', whiteSpace: 'nowrap' }}>{item.specification}</td>
                        <td style={{ padding: '12px 8px', textAlign: 'center', whiteSpace: 'nowrap' }}>{item.batchNumber}</td>
                        <td style={{ padding: '12px 8px', textAlign: 'center', whiteSpace: 'nowrap' }}>{item.quantity}</td>
                        <td style={{ padding: '12px 8px', textAlign: 'center', whiteSpace: 'nowrap' }}>{item.unit}</td>
                        <td style={{ padding: '12px 8px', textAlign: 'center', whiteSpace: 'nowrap' }}>{item.productionDate}</td>
                        <td style={{ padding: '12px 8px', textAlign: 'center', whiteSpace: 'nowrap' }}>{item.expiryDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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