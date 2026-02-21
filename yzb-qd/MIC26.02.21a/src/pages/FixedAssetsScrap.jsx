import React, { useState } from 'react';
import { Card, Table, Input, Select, DatePicker, Button, Space, Tag, Modal, Form, message, Popconfirm } from 'antd';
import { SearchOutlined, DeleteOutlined, EyeOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;

const FixedAssetsScrap = () => {
  const [visible, setVisible] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [form] = Form.useForm();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const scrapAssets = [
    { 
      key: '1', 
      assetCode: 'FA2018001', 
      assetName: '心电图机', 
      assetType: '医疗设备', 
      specification: '12导联',
      manufacturer: '飞利浦',
      purchaseDate: '2018-05-10',
      originalValue: 80000,
      netValue: 16000,
      department: '心内科',
      scrapReason: '设备老化，维修成本过高',
      scrapDate: '2024-01-15',
      scrapMethod: '报废',
      scrapStatus: '待审核',
      applicant: '张医生',
      applyDate: '2024-01-10'
    },
    { 
      key: '2', 
      assetCode: 'FA2019001', 
      assetName: '办公电脑', 
      assetType: '办公设备', 
      specification: '联想ThinkCentre',
      manufacturer: '联想',
      purchaseDate: '2019-03-15',
      originalValue: 5000,
      netValue: 1000,
      department: '行政部',
      scrapReason: '配置过低，无法满足工作需求',
      scrapDate: '2024-01-20',
      scrapMethod: '报废',
      scrapStatus: '已审核',
      applicant: '李主任',
      applyDate: '2024-01-18'
    },
    { 
      key: '3', 
      assetCode: 'FA2020001', 
      assetName: '打印机', 
      assetType: '办公设备', 
      specification: 'HP LaserJet',
      manufacturer: '惠普',
      purchaseDate: '2020-08-20',
      originalValue: 3000,
      netValue: 900,
      department: '财务科',
      scrapReason: '频繁卡纸，维修无效',
      scrapDate: '2024-01-25',
      scrapMethod: '报废',
      scrapStatus: '已驳回',
      applicant: '王会计',
      applyDate: '2024-01-22'
    },
    { 
      key: '4', 
      assetCode: 'FA2017001', 
      assetName: '文件柜', 
      assetType: '家具', 
      specification: '铁皮文件柜',
      manufacturer: '得力',
      purchaseDate: '2017-11-05',
      originalValue: 800,
      netValue: 80,
      department: '档案室',
      scrapReason: '柜体变形，无法正常使用',
      scrapDate: '2024-02-01',
      scrapMethod: '报废',
      scrapStatus: '待审核',
      applicant: '赵管理员',
      applyDate: '2024-01-28'
    },
  ];

  const columns = [
    { title: '资产编码', dataIndex: 'assetCode', key: 'assetCode', width: 120 },
    { title: '资产名称', dataIndex: 'assetName', key: 'assetName', width: 150 },
    { title: '资产类型', dataIndex: 'assetType', key: 'assetType', width: 100 },
    { title: '规格型号', dataIndex: 'specification', key: 'specification', width: 120 },
    { title: '使用部门', dataIndex: 'department', key: 'department', width: 100 },
    { 
      title: '原值（元）', 
      dataIndex: 'originalValue', 
      key: 'originalValue', 
      width: 110,
      render: (value) => value.toLocaleString()
    },
    { 
      title: '净值（元）', 
      dataIndex: 'netValue', 
      key: 'netValue', 
      width: 110,
      render: (value) => value.toLocaleString()
    },
    { 
      title: '报废原因', 
      dataIndex: 'scrapReason', 
      key: 'scrapReason', 
      width: 200,
      ellipsis: true
    },
    { 
      title: '报废状态', 
      dataIndex: 'scrapStatus', 
      key: 'scrapStatus', 
      width: 100,
      render: (status) => {
        let color = 'default';
        if (status === '待审核') color = 'orange';
        if (status === '已审核') color = 'green';
        if (status === '已驳回') color = 'red';
        return <Tag color={color}>{status}</Tag>;
      }
    },
    { 
      title: '操作', 
      key: 'action',
      width: 180,
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="link" 
            size="small"
            icon={<EyeOutlined />} 
            onClick={() => handleViewDetail(record)}
          >
            详情
          </Button>
          {record.scrapStatus === '待审核' && (
            <>
              <Button 
                type="link" 
                size="small"
                icon={<CheckOutlined />} 
                onClick={() => handleApprove(record)}
                style={{ color: '#52c41a' }}
              >
                通过
              </Button>
              <Button 
                type="link" 
                size="small"
                icon={<CloseOutlined />} 
                onClick={() => handleReject(record)}
                style={{ color: '#f5222d' }}
              >
                驳回
              </Button>
            </>
          )}
          <Popconfirm
            title="确定要删除这条报废记录吗？"
            onConfirm={() => handleDelete(record)}
            okText="确定"
            cancelText="取消"
          >
            <Button 
              type="link" 
              size="small"
              icon={<DeleteOutlined />} 
              style={{ color: '#f5222d' }}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    },
  ];

  const handleViewDetail = (record) => {
    setSelectedAsset(record);
    setVisible(true);
  };

  const handleApprove = (record) => {
    Modal.confirm({
      title: '确认审核通过',
      content: `确定要通过资产"${record.assetName}"的报废申请吗？`,
      onOk: () => {
        message.success(`已通过"资产${record.assetName}"的报废申请`);
      }
    });
  };

  const handleReject = (record) => {
    Modal.confirm({
      title: '确认驳回申请',
      content: `确定要驳回资产"${record.assetName}"的报废申请吗？`,
      onOk: () => {
        message.success(`已驳回资产"${record.assetName}"的报废申请`);
      }
    });
  };

  const handleDelete = (record) => {
    message.success(`已删除资产"${record.assetName}"的报废记录`);
  };

  const handleSearch = () => {
    message.success('查询成功！');
  };

  const handleReset = () => {
    message.success('重置成功！');
  };

  const handleApplyScrap = () => {
    message.success('已跳转到报废申请页面！');
  };

  return (
    <div style={{ padding: '0 16px' }}>
      <h1 style={{ marginBottom: 24 }}>资产报废</h1>
      
      <Card style={{ marginBottom: 16 }}>
        <Space wrap style={{ width: '100%' }}>
          <Input placeholder="资产编码" style={{ width: 150, minWidth: '120px' }} />
          <Input placeholder="资产名称" style={{ width: 150, minWidth: '120px' }} />
          <Select placeholder="资产类型" style={{ width: 120, minWidth: '100px' }}>
            <Option value="all">全部</Option>
            <Option value="医疗设备">医疗设备</Option>
            <Option value="办公设备">办公设备</Option>
            <Option value="家具">家具</Option>
            <Option value="车辆">车辆</Option>
          </Select>
          <Select placeholder="使用部门" style={{ width: 120, minWidth: '100px' }}>
            <Option value="all">全部</Option>
            <Option value="心内科">心内科</Option>
            <Option value="行政部">行政部</Option>
            <Option value="财务科">财务科</Option>
            <Option value="档案室">档案室</Option>
          </Select>
          <Select placeholder="报废状态" style={{ width: 120, minWidth: '100px' }}>
            <Option value="all">全部</Option>
            <Option value="待审核">待审核</Option>
            <Option value="已审核">已审核</Option>
            <Option value="已驳回">已驳回</Option>
          </Select>
          <DatePicker placeholder="申请日期" style={{ width: 150 }} />
          <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
            查询
          </Button>
          <Button onClick={handleReset}>重置</Button>
          <Button type="primary" onClick={handleApplyScrap}>
            申请报废
          </Button>
        </Space>
      </Card>
      
      <div style={{ overflowX: 'auto' }}>
        <Table 
          columns={columns} 
          dataSource={scrapAssets} 
          pagination={{ 
            pageSize: pageSize,
            current: currentPage,
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            },
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
            style: {
              display: 'flex',
              justifyContent: 'center',
              marginTop: '16px'
            }
          }} 
          size="small"
        />
      </div>

      <Modal
        title="报废申请详情"
        open={visible}
        onCancel={() => setVisible(false)}
        footer={[
          <Button key="close" onClick={() => setVisible(false)}>
            关闭
          </Button>
        ]}
        width={700}
      >
        {selectedAsset && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <h3>资产基本信息</h3>
              <p><strong>资产编码：</strong>{selectedAsset.assetCode}</p>
              <p><strong>资产名称：</strong>{selectedAsset.assetName}</p>
              <p><strong>资产类型：</strong>{selectedAsset.assetType}</p>
              <p><strong>规格型号：</strong>{selectedAsset.specification}</p>
              <p><strong>生产厂商：</strong>{selectedAsset.manufacturer}</p>
              <p><strong>购置日期：</strong>{selectedAsset.purchaseDate}</p>
              <p><strong>原值：</strong>{selectedAsset.originalValue.toLocaleString()}元</p>
              <p><strong>净值：</strong>{selectedAsset.netValue.toLocaleString()}元</p>
              <p><strong>使用部门：</strong>{selectedAsset.department}</p>
            </div>
            
            <div style={{ marginBottom: 16 }}>
              <h3>报废申请信息</h3>
              <p><strong>申请人：</strong>{selectedAsset.applicant}</p>
              <p><strong>申请日期：</strong>{selectedAsset.applyDate}</p>
              <p><strong>计划报废日期：</strong>{selectedAsset.scrapDate}</p>
              <p><strong>报废方式：</strong>{selectedAsset.scrapMethod}</p>
              <p><strong>报废状态：</strong>
                <Tag color={
                  selectedAsset.scrapStatus === '待审核' ? 'orange' :
                  selectedAsset.scrapStatus === '已审核' ? 'green' : 'red'
                }>
                  {selectedAsset.scrapStatus}
                </Tag>
              </p>
            </div>
            
            <div>
              <h3>报废原因</h3>
              <p>{selectedAsset.scrapReason}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default FixedAssetsScrap;