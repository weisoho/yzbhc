import React, { useState } from 'react';
import { Table, Card, Input, Select, Button, Space, Tag, Row, Col, Form, DatePicker, message, Modal, Transfer } from 'antd';
import { SearchOutlined, SwapOutlined } from '@ant-design/icons';

const { Option } = Select;

const FixedAssetsTransfer = () => {
  const [form] = Form.useForm();
  const [transferModalVisible, setTransferModalVisible] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [targetKeys, setTargetKeys] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fixedAssetsColumns = [
    { title: '资产编码', dataIndex: 'assetCode', key: 'assetCode', width: 120 },
    { title: '资产名称', dataIndex: 'assetName', key: 'assetName', width: 150 },
    { title: '资产类型', dataIndex: 'assetType', key: 'assetType', width: 120 },
    { title: '规格型号', dataIndex: 'specification', key: 'specification', width: 120 },
    { title: '当前仓库', dataIndex: 'currentWarehouse', key: 'currentWarehouse', width: 120 },
    { title: '使用部门', dataIndex: 'department', key: 'department', width: 120 },
    { title: '责任人', dataIndex: 'responsiblePerson', key: 'responsiblePerson', width: 100 },
    { title: '资产状态', dataIndex: 'assetStatus', key: 'assetStatus', width: 120, render: (status) => {
      const statusMap = {
        in_use: <Tag color="green">在用</Tag>,
        idle: <Tag color="blue">闲置</Tag>,
        maintenance: <Tag color="orange">维修中</Tag>,
        scrap_pending: <Tag color="red">待报废</Tag>
      };
      return statusMap[status] || status;
    }},
    { title: '购置日期', dataIndex: 'purchaseDate', key: 'purchaseDate', width: 120 },
    { 
      title: '操作', 
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleTransfer(record)} icon={<SwapOutlined />}>
            调拨
          </Button>
        </Space>
      )
    },
  ];

  const fixedAssetsData = [
    { key: '1', assetCode: 'FA20240601001', assetName: 'B超机', assetType: '医疗设备', specification: '高端型', currentWarehouse: '仓库1', department: '超声科', responsiblePerson: '张三', assetStatus: 'in_use', purchaseDate: '2024-06-01' },
    { key: '2', assetCode: 'FA20240601002', assetName: 'CT机', assetType: '医疗设备', specification: '64排', currentWarehouse: '仓库2', department: '放射科', responsiblePerson: '李四', assetStatus: 'in_use', purchaseDate: '2024-06-01' },
    { key: '3', assetCode: 'FA20240531001', assetName: '办公电脑', assetType: '办公设备', specification: 'i7/16G/512G', currentWarehouse: '仓库3', department: '信息科', responsiblePerson: '王五', assetStatus: 'idle', purchaseDate: '2024-05-31' },
    { key: '4', assetCode: 'FA20240530001', assetName: '文件柜', assetType: '家具', specification: '四层钢制', currentWarehouse: '仓库1', department: '行政部', responsiblePerson: '赵六', assetStatus: 'in_use', purchaseDate: '2024-05-30' },
  ];

  const mockData = [
    { key: '1', title: 'B超机', description: '高端型医疗设备' },
    { key: '2', title: 'CT机', description: '64排医疗设备' },
    { key: '3', title: '办公电脑', description: 'i7/16G/512G办公设备' },
    { key: '4', title: '文件柜', description: '四层钢制家具' },
  ];

  const handleSearch = () => {
    message.success('查询成功');
  };

  const handleReset = () => {
    form.resetFields();
    message.success('已重置搜索条件');
  };

  const handleTransfer = (record) => {
    setSelectedAsset(record);
    setTransferModalVisible(true);
  };

  const handleCloseTransferModal = () => {
    setTransferModalVisible(false);
    setSelectedAsset(null);
    setTargetKeys([]);
  };

  const handleTransferSubmit = () => {
    message.success('固定资产调拨成功');
    handleCloseTransferModal();
  };

  const onChange = (nextTargetKeys) => {
    setTargetKeys(nextTargetKeys);
  };

  return (
    <div style={{ padding: '0 16px' }}>
      <h1 style={{ marginBottom: 24 }}>固定资产调拨</h1>
      
      <Card style={{ marginBottom: 16 }}>
        <Form
          form={form}
          layout="vertical"
        >
          <Row gutter={[16, 0]} align="middle">
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="assetCode" label="资产编码">
                <Input placeholder="请输入资产编码" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="assetName" label="资产名称">
                <Input placeholder="请输入资产名称" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="assetType" label="资产类型">
                <Select placeholder="请选择资产类型" style={{ width: '100%' }}>
                  <Option value="all">全部类型</Option>
                  <Option value="medical">医疗设备</Option>
                  <Option value="office">办公设备</Option>
                  <Option value="furniture">家具</Option>
                  <Option value="vehicle">车辆</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="currentWarehouse" label="当前仓库">
                <Select placeholder="请选择当前仓库" style={{ width: '100%' }}>
                  <Option value="all">全部仓库</Option>
                  <Option value="warehouse1">仓库1</Option>
                  <Option value="warehouse2">仓库2</Option>
                  <Option value="warehouse3">仓库3</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="assetStatus" label="资产状态">
                <Select placeholder="请选择资产状态" style={{ width: '100%' }}>
                  <Option value="all">全部状态</Option>
                  <Option value="in_use">在用</Option>
                  <Option value="idle">闲置</Option>
                  <Option value="maintenance">维修中</Option>
                  <Option value="scrap_pending">待报废</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="dateRange" label="购置日期">
                <DatePicker.RangePicker style={{ width: '100%' }} />
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
      
      <div style={{ overflowX: 'auto' }}>
        <Table 
          columns={fixedAssetsColumns} 
          dataSource={fixedAssetsData} 
          pagination={{ 
            current: currentPage,
            pageSize: pageSize,
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            },
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
            size: "small",
            style: {
              display: "flex",
              justifyContent: "center",
              marginTop: "16px"
            }
          }}
          rowKey="key"
          size="small"
          style={{
            borderRadius: 8,
            overflow: 'hidden',
          }}
        />
      </div>

      {/* 固定资产调拨弹窗 */}
      <Modal
        title={`固定资产调拨 - ${selectedAsset?.assetName || ''}`}
        open={transferModalVisible}
        onCancel={handleCloseTransferModal}
        width={800}
        footer={[
          <Button key="cancel" onClick={handleCloseTransferModal}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={handleTransferSubmit}>
            确认调拨
          </Button>,
        ]}
      >
        {selectedAsset && (
          <div>
            <div style={{ marginBottom: 16, padding: 16, backgroundColor: '#f8f9fa', borderRadius: 8 }}>
              <Row gutter={[16, 8]}>
                <Col span={8}>
                  <div><strong>资产编码：</strong>{selectedAsset.assetCode}</div>
                </Col>
                <Col span={8}>
                  <div><strong>资产名称：</strong>{selectedAsset.assetName}</div>
                </Col>
                <Col span={8}>
                  <div><strong>当前仓库：</strong>{selectedAsset.currentWarehouse}</div>
                </Col>
                <Col span={8}>
                  <div><strong>资产类型：</strong>{selectedAsset.assetType}</div>
                </Col>
                <Col span={8}>
                  <div><strong>使用部门：</strong>{selectedAsset.department}</div>
                </Col>
                <Col span={8}>
                  <div><strong>责任人：</strong>{selectedAsset.responsiblePerson}</div>
                </Col>
              </Row>
            </div>

            <div style={{ marginBottom: 16 }}>
              <h4>选择目标仓库</h4>
              <Select placeholder="请选择目标仓库" style={{ width: '100%', marginBottom: 16 }}>
                <Option value="warehouse1">仓库1</Option>
                <Option value="warehouse2">仓库2</Option>
                <Option value="warehouse3">仓库3</Option>
                <Option value="warehouse4">仓库4</Option>
              </Select>
            </div>

            <div style={{ marginBottom: 16 }}>
              <h4>调拨说明</h4>
              <p>1. 固定资产调拨需要经过审批流程</p>
              <p>2. 调拨后资产责任人需要重新确认</p>
              <p>3. 调拨记录将保存到资产变更历史</p>
              <p>4. 调拨完成后需要更新资产台账</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default FixedAssetsTransfer;