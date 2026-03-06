import React, { useState } from 'react';
import { Card, Table, Input, Select, DatePicker, Button, Space, Tag, Modal, Descriptions, message } from 'antd';
import { SearchOutlined, EyeOutlined, DownloadOutlined, PrinterOutlined } from '@ant-design/icons';

const { Option } = Select;
const { RangePicker } = DatePicker;

const FixedAssetsScrapDetail = () => {
  const [visible, setVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const scrapRecords = [
    { 
      key: '1', 
      scrapNo: 'SC202401001', 
      assetCode: 'FA2018001', 
      assetName: '心电图机', 
      assetType: '医疗设备', 
      specification: '12导联',
      manufacturer: '飞利浦',
      purchaseDate: '2018-05-10',
      originalValue: 80000,
      netValue: 16000,
      scrapValue: 5000,
      department: '心内科',
      scrapReason: '设备老化，维修成本过高',
      scrapDate: '2024-01-15',
      scrapMethod: '报废',
      scrapStatus: '已完成',
      scrapApprover: '王主任',
      scrapApprovalDate: '2024-01-12',
      scrapExecutor: '李师傅',
      scrapExecutionDate: '2024-01-15',
      remark: '设备已拆解处理'
    },
    { 
      key: '2', 
      scrapNo: 'SC202401002', 
      assetCode: 'FA2019001', 
      assetName: '办公电脑', 
      assetType: '办公设备', 
      specification: '联想ThinkCentre',
      manufacturer: '联想',
      purchaseDate: '2019-03-15',
      originalValue: 5000,
      netValue: 1000,
      scrapValue: 300,
      department: '行政部',
      scrapReason: '配置过低，无法满足工作需求',
      scrapDate: '2024-01-20',
      scrapMethod: '报废',
      scrapStatus: '已完成',
      scrapApprover: '赵经理',
      scrapApprovalDate: '2024-01-18',
      scrapExecutor: '张师傅',
      scrapExecutionDate: '2024-01-20',
      remark: '电脑已回收处理'
    },
    { 
      key: '3', 
      scrapNo: 'SC202401003', 
      assetCode: 'FA2020001', 
      assetName: '打印机', 
      assetType: '办公设备', 
      specification: 'HP LaserJet',
      manufacturer: '惠普',
      purchaseDate: '2020-08-20',
      originalValue: 3000,
      netValue: 900,
      scrapValue: 200,
      department: '财务科',
      scrapReason: '频繁卡纸，维修无效',
      scrapDate: '2024-01-25',
      scrapMethod: '报废',
      scrapStatus: '已完成',
      scrapApprover: '孙总监',
      scrapApprovalDate: '2024-01-22',
      scrapExecutor: '王师傅',
      scrapExecutionDate: '2024-01-25',
      remark: '打印机已回收'
    },
    { 
      key: '4', 
      scrapNo: 'SC202402001', 
      assetCode: 'FA2017001', 
      assetName: '文件柜', 
      assetType: '家具', 
      specification: '铁皮文件柜',
      manufacturer: '得力',
      purchaseDate: '2017-11-05',
      originalValue: 800,
      netValue: 80,
      scrapValue: 50,
      department: '档案室',
      scrapReason: '柜体变形，无法正常使用',
      scrapDate: '2024-02-01',
      scrapMethod: '报废',
      scrapStatus: '进行中',
      scrapApprover: '周主任',
      scrapApprovalDate: '2024-01-28',
      scrapExecutor: '陈师傅',
      scrapExecutionDate: '2024-02-01',
      remark: '待处理'
    },
    { 
      key: '5', 
      scrapNo: 'SC202402002', 
      assetCode: 'FA2016001', 
      assetName: '空调', 
      assetType: '电器设备', 
      specification: '格力3匹',
      manufacturer: '格力',
      purchaseDate: '2016-07-20',
      originalValue: 12000,
      netValue: 2400,
      scrapValue: 800,
      department: '会议室',
      scrapReason: '制冷效果差，维修成本高',
      scrapDate: '2024-02-05',
      scrapMethod: '报废',
      scrapStatus: '待执行',
      scrapApprover: '吴主任',
      scrapApprovalDate: '2024-02-03',
      scrapExecutor: '',
      scrapExecutionDate: '',
      remark: '等待执行'
    },
  ];

  const columns = [
    { 
      title: '报废单号', 
      dataIndex: 'scrapNo', 
      key: 'scrapNo', 
      width: 130,
      ellipsis: false,
      align: 'center',
      onHeaderCell: () => ({ style: { whiteSpace: 'nowrap' } }),
      onCell: () => ({ style: { whiteSpace: 'nowrap' } })
    },
    { 
      title: '资产编码', 
      dataIndex: 'assetCode', 
      key: 'assetCode', 
      width: 120,
      ellipsis: false,
      align: 'center',
      onHeaderCell: () => ({ style: { whiteSpace: 'nowrap' } }),
      onCell: () => ({ style: { whiteSpace: 'nowrap' } })
    },
    { 
      title: '资产名称', 
      dataIndex: 'assetName', 
      key: 'assetName', 
      width: 150,
      ellipsis: false,
      align: 'center',
      onHeaderCell: () => ({ style: { whiteSpace: 'nowrap' } }),
      onCell: () => ({ style: { whiteSpace: 'nowrap' } })
    },
    { 
      title: '资产类型', 
      dataIndex: 'assetType', 
      key: 'assetType', 
      width: 100,
      ellipsis: false,
      align: 'center',
      onHeaderCell: () => ({ style: { whiteSpace: 'nowrap' } }),
      onCell: () => ({ style: { whiteSpace: 'nowrap' } })
    },
    { 
      title: '使用部门', 
      dataIndex: 'department', 
      key: 'department', 
      width: 100,
      ellipsis: false,
      align: 'center',
      onHeaderCell: () => ({ style: { whiteSpace: 'nowrap' } }),
      onCell: () => ({ style: { whiteSpace: 'nowrap' } })
    },
    { 
      title: '原值（元）', 
      dataIndex: 'originalValue', 
      key: 'originalValue', 
      width: 110,
      ellipsis: false,
      align: 'center',
      onHeaderCell: () => ({ style: { whiteSpace: 'nowrap' } }),
      onCell: () => ({ style: { whiteSpace: 'nowrap' } }),
      render: (value) => value.toLocaleString()
    },
    { 
      title: '净值（元）', 
      dataIndex: 'netValue', 
      key: 'netValue', 
      width: 110,
      ellipsis: false,
      align: 'center',
      onHeaderCell: () => ({ style: { whiteSpace: 'nowrap' } }),
      onCell: () => ({ style: { whiteSpace: 'nowrap' } }),
      render: (value) => value.toLocaleString()
    },
    { 
      title: '残值（元）', 
      dataIndex: 'scrapValue', 
      key: 'scrapValue', 
      width: 110,
      ellipsis: false,
      align: 'center',
      onHeaderCell: () => ({ style: { whiteSpace: 'nowrap' } }),
      onCell: () => ({ style: { whiteSpace: 'nowrap' } }),
      render: (value) => value.toLocaleString()
    },
    { 
      title: '报废日期', 
      dataIndex: 'scrapDate', 
      key: 'scrapDate', 
      width: 110,
      ellipsis: false,
      align: 'center',
      onHeaderCell: () => ({ style: { whiteSpace: 'nowrap' } }),
      onCell: () => ({ style: { whiteSpace: 'nowrap' } }),
      sorter: (a, b) => new Date(a.scrapDate) - new Date(b.scrapDate)
    },
    { 
      title: '报废状态', 
      dataIndex: 'scrapStatus', 
      key: 'scrapStatus', 
      width: 100,
      ellipsis: false,
      align: 'center',
      onHeaderCell: () => ({ style: { whiteSpace: 'nowrap' } }),
      onCell: () => ({ style: { whiteSpace: 'nowrap' } }),
      render: (status) => {
        let color = 'default';
        if (status === '待执行') color = 'orange';
        if (status === '进行中') color = 'blue';
        if (status === '已完成') color = 'green';
        return <Tag color={color}>{status}</Tag>;
      }
    },
    { 
      title: '操作', 
      key: 'action',
      width: 100,
      ellipsis: false,
      align: 'center',
      onHeaderCell: () => ({ style: { whiteSpace: 'nowrap' } }),
      onCell: () => ({ style: { whiteSpace: 'nowrap' } }),
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
        </Space>
      )
    },
  ];

  const handleViewDetail = (record) => {
    setSelectedRecord(record);
    setVisible(true);
  };

  const handleExport = () => {
    message.success('导出成功！');
  };

  const handlePrint = () => {
    message.success('打印功能已调用！');
  };

  const handleSearch = () => {
    message.success('查询成功！');
  };

  const handleReset = () => {
    message.success('重置成功！');
  };

  return (
    <div style={{ padding: '0 16px' }}>
      <h1 style={{ marginBottom: 24 }}>资产清理明细</h1>
      
      <Card style={{ marginBottom: 16 }}>
        <Space wrap style={{ width: '100%' }}>
          <Input placeholder="报废单号" style={{ width: 150, minWidth: '120px' }} />
          <Input placeholder="资产编码" style={{ width: 150, minWidth: '120px' }} />
          <Input placeholder="资产名称" style={{ width: 150, minWidth: '120px' }} />
          <Select placeholder="资产类型" style={{ width: 120, minWidth: '100px' }}>
            <Option value="all">全部</Option>
            <Option value="医疗设备">医疗设备</Option>
            <Option value="办公设备">办公设备</Option>
            <Option value="家具">家具</Option>
            <Option value="电器设备">电器设备</Option>
          </Select>
          <Select placeholder="使用部门" style={{ width: 120, minWidth: '100px' }}>
            <Option value="all">全部</Option>
            <Option value="心内科">心内科</Option>
            <Option value="行政部">行政部</Option>
            <Option value="财务科">财务科</Option>
            <Option value="档案室">档案室</Option>
            <Option value="会议室">会议室</Option>
          </Select>
          <Select placeholder="报废状态" style={{ width: 120, minWidth: '100px' }}>
            <Option value="all">全部</Option>
            <Option value="待执行">待执行</Option>
            <Option value="进行中">进行中</Option>
            <Option value="已完成">已完成</Option>
          </Select>
          <RangePicker placeholder={['报废开始日期', '报废结束日期']} style={{ width: 240 }} />
          <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
            查询
          </Button>
          <Button onClick={handleReset}>重置</Button>
          <Button icon={<DownloadOutlined />} onClick={handleExport}>导出</Button>
          <Button icon={<PrinterOutlined />} onClick={handlePrint}>打印</Button>
        </Space>
      </Card>
      
      <div style={{ overflowX: 'auto' }}>
        <Table 
          columns={columns} 
          dataSource={scrapRecords} 
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
          scroll={{ x: 1600 }}
        />
      </div>

      <Modal
        title="资产清理明细详情"
        open={visible}
        onCancel={() => setVisible(false)}
        footer={[
          <Button key="close" onClick={() => setVisible(false)}>
            关闭
          </Button>,
          <Button key="print" type="primary" icon={<PrinterOutlined />} onClick={handlePrint}>
            打印
          </Button>
        ]}
        width={800}
      >
        {selectedRecord && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="报废单号">{selectedRecord.scrapNo}</Descriptions.Item>
            <Descriptions.Item label="资产编码">{selectedRecord.assetCode}</Descriptions.Item>
            <Descriptions.Item label="资产名称">{selectedRecord.assetName}</Descriptions.Item>
            <Descriptions.Item label="资产类型">{selectedRecord.assetType}</Descriptions.Item>
            <Descriptions.Item label="规格型号">{selectedRecord.specification}</Descriptions.Item>
            <Descriptions.Item label="生产厂商">{selectedRecord.manufacturer}</Descriptions.Item>
            <Descriptions.Item label="购置日期">{selectedRecord.purchaseDate}</Descriptions.Item>
            <Descriptions.Item label="使用部门">{selectedRecord.department}</Descriptions.Item>
            <Descriptions.Item label="原值">{selectedRecord.originalValue.toLocaleString()}元</Descriptions.Item>
            <Descriptions.Item label="净值">{selectedRecord.netValue.toLocaleString()}元</Descriptions.Item>
            <Descriptions.Item label="残值">{selectedRecord.scrapValue.toLocaleString()}元</Descriptions.Item>
            <Descriptions.Item label="报废原因">{selectedRecord.scrapReason}</Descriptions.Item>
            <Descriptions.Item label="报废日期">{selectedRecord.scrapDate}</Descriptions.Item>
            <Descriptions.Item label="报废方式">{selectedRecord.scrapMethod}</Descriptions.Item>
            <Descriptions.Item label="报废状态">
              <Tag color={
                selectedRecord.scrapStatus === '待执行' ? 'orange' :
                selectedRecord.scrapStatus === '进行中' ? 'blue' : 'green'
              }>
                {selectedRecord.scrapStatus}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="审批人">{selectedRecord.scrapApprover}</Descriptions.Item>
            <Descriptions.Item label="审批日期">{selectedRecord.scrapApprovalDate}</Descriptions.Item>
            <Descriptions.Item label="执行人">{selectedRecord.scrapExecutor || '未指定'}</Descriptions.Item>
            <Descriptions.Item label="执行日期">{selectedRecord.scrapExecutionDate || '未执行'}</Descriptions.Item>
            <Descriptions.Item label="备注" span={2}>{selectedRecord.remark}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default FixedAssetsScrapDetail;