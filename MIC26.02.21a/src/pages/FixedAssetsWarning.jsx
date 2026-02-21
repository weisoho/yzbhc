import React, { useState } from 'react';
import { Card, Table, Input, Select, DatePicker, Button, Space, Tag, Modal, message, Progress, Badge, Row, Col } from 'antd';
import { SearchOutlined, WarningOutlined, BellOutlined, ExclamationCircleOutlined, EyeOutlined, DownloadOutlined, PrinterOutlined, FilterOutlined } from '@ant-design/icons';

const { Option } = Select;
const { RangePicker } = DatePicker;

const FixedAssetsWarning = () => {
  const [visible, setVisible] = useState(false);
  const [selectedWarning, setSelectedWarning] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const warningData = [
    { 
      key: '1', 
      assetCode: 'FA2024001', 
      assetName: 'CT扫描仪', 
      assetType: '医疗设备', 
      manufacturer: '西门子医疗',
      specification: '64排128层',
      department: '放射科',
      responsiblePerson: '张医生',
      warningType: '维保到期',
      warningLevel: 'high',
      warningDate: '2026-02-15',
      dueDate: '2026-02-28',
      daysLeft: 13,
      status: 'pending',
      description: '设备维保即将到期，请及时安排维保服务',
      actionRequired: '联系维保服务商',
      lastMaintenanceDate: '2025-02-28',
      maintenanceCycle: '每年',
      purchaseDate: '2024-01-15',
      originalValue: 2800000,
      netValue: 2520000,
      usefulLife: 10
    },
    { 
      key: '2', 
      assetCode: 'FA2024002', 
      assetName: '彩色超声诊断仪', 
      assetType: '医疗设备', 
      manufacturer: 'GE医疗',
      specification: '高端彩超',
      department: '超声科',
      responsiblePerson: '李医生',
      warningType: '校准到期',
      warningLevel: 'medium',
      warningDate: '2026-03-10',
      dueDate: '2026-03-31',
      daysLeft: 21,
      status: 'pending',
      description: '设备校准即将到期，需进行年度校准',
      actionRequired: '安排设备校准',
      lastCalibrationDate: '2025-03-31',
      calibrationCycle: '每年',
      purchaseDate: '2024-02-20',
      originalValue: 1500000,
      netValue: 1425000,
      usefulLife: 8
    },
    { 
      key: '3', 
      assetCode: 'FA2023001', 
      assetName: '公务用车', 
      assetType: '车辆', 
      manufacturer: '丰田',
      specification: '丰田凯美瑞',
      department: '行政部',
      responsiblePerson: '赵主任',
      warningType: '年检到期',
      warningLevel: 'high',
      warningDate: '2026-06-10',
      dueDate: '2026-06-15',
      daysLeft: 5,
      status: 'pending',
      description: '车辆年检即将到期',
      actionRequired: '安排车辆年检',
      lastInspectionDate: '2025-06-15',
      inspectionCycle: '每年',
      purchaseDate: '2023-06-15',
      originalValue: 250000,
      netValue: 212500,
      usefulLife: 8
    },
    { 
      key: '4', 
      assetCode: 'FA2024003', 
      assetName: '服务器', 
      assetType: '办公设备', 
      manufacturer: '戴尔',
      specification: 'Dell PowerEdge',
      department: '信息科',
      responsiblePerson: '王工程师',
      warningType: '使用年限预警',
      warningLevel: 'medium',
      warningDate: '2029-03-01',
      dueDate: '2029-03-10',
      daysLeft: 1100,
      status: 'pending',
      description: '设备使用年限即将达到5年，建议评估更新',
      actionRequired: '制定设备更新计划',
      purchaseDate: '2024-03-10',
      originalValue: 80000,
      netValue: 76000,
      usefulLife: 5
    },
    { 
      key: '5', 
      assetCode: 'FA2022001', 
      assetName: '办公桌椅', 
      assetType: '家具', 
      manufacturer: '宜家',
      specification: '实木办公桌椅',
      department: '运营组',
      responsiblePerson: '孙经理',
      warningType: '资产闲置',
      warningLevel: 'low',
      warningDate: '2026-01-01',
      dueDate: '2026-02-01',
      daysLeft: 30,
      status: 'pending',
      description: '资产已闲置超过3个月',
      actionRequired: '评估资产使用需求',
      purchaseDate: '2022-08-20',
      originalValue: 5000,
      netValue: 4000,
      usefulLife: 10
    },
    { 
      key: '6', 
      assetCode: 'FA2023002', 
      assetName: 'X光机', 
      assetType: '医疗设备', 
      manufacturer: '飞利浦医疗',
      specification: '数字化X光机',
      department: '放射科',
      responsiblePerson: '张医生',
      warningType: '折旧完成',
      warningLevel: 'medium',
      warningDate: '2026-12-01',
      dueDate: '2027-01-01',
      daysLeft: 330,
      status: 'pending',
      description: '设备折旧即将完成，净值接近残值',
      actionRequired: '评估设备使用状态',
      purchaseDate: '2017-01-01',
      originalValue: 1200000,
      netValue: 120000,
      usefulLife: 10
    },
    { 
      key: '7', 
      assetCode: 'FA2023003', 
      assetName: '空调', 
      assetType: '办公设备', 
      manufacturer: '格力',
      specification: '3匹柜式空调',
      department: '行政部',
      responsiblePerson: '赵主任',
      warningType: '维保到期',
      warningLevel: 'low',
      warningDate: '2026-03-01',
      dueDate: '2026-03-31',
      daysLeft: 30,
      status: 'pending',
      description: '空调维保即将到期，建议进行年度维保',
      actionRequired: '联系维保服务商',
      lastMaintenanceDate: '2025-03-31',
      maintenanceCycle: '每年',
      purchaseDate: '2023-03-01',
      originalValue: 5000,
      netValue: 4500,
      usefulLife: 8
    },
    { 
      key: '8', 
      assetCode: 'FA2023004', 
      assetName: '投影仪', 
      assetType: '办公设备', 
      manufacturer: '爱普生',
      specification: '高清投影仪',
      department: '会议室',
      responsiblePerson: '赵主任',
      warningType: '耗材更换',
      warningLevel: 'low',
      warningDate: '2026-02-15',
      dueDate: '2026-02-28',
      daysLeft: 13,
      status: 'pending',
      description: '投影仪灯泡使用时间即将达到寿命上限',
      actionRequired: '准备更换灯泡',
      consumableType: '投影仪灯泡',
      lastReplacementDate: '2025-02-28',
      replacementCycle: '每年',
      purchaseDate: '2023-02-28',
      originalValue: 15000,
      netValue: 13500,
      usefulLife: 5
    }
  ];

  const columns = [
    { 
      title: '预警级别', 
      dataIndex: 'warningLevel', 
      key: 'warningLevel', 
      width: 100,
      fixed: 'left',
      render: (level) => {
        const config = {
          high: { color: '#ff4d4f', text: '高', icon: <ExclamationCircleOutlined /> },
          medium: { color: '#faad14', text: '中', icon: <WarningOutlined /> },
          low: { color: '#52c41a', text: '低', icon: <BellOutlined /> }
        };
        const { color, text, icon } = config[level] || config.low;
        return (
          <Tag color={color} icon={icon}>
            {text}
          </Tag>
        );
      }
    },
    { title: '资产编码', dataIndex: 'assetCode', key: 'assetCode', width: 120, fixed: 'left' },
    { title: '资产名称', dataIndex: 'assetName', key: 'assetName', width: 150, fixed: 'left' },
    { title: '资产类型', dataIndex: 'assetType', key: 'assetType', width: 100 },
    { title: '生产厂商', dataIndex: 'manufacturer', key: 'manufacturer', width: 120 },
    { title: '规格型号', dataIndex: 'specification', key: 'specification', width: 120 },
    { title: '购置日期', dataIndex: 'purchaseDate', key: 'purchaseDate', width: 120 },
    { 
      title: '原值(元)', 
      dataIndex: 'originalValue', 
      key: 'originalValue', 
      width: 100,
      render: (value) => value.toLocaleString()
    },
    { 
      title: '净值(元)', 
      dataIndex: 'netValue', 
      key: 'netValue', 
      width: 100,
      render: (value) => value.toLocaleString()
    },
    { title: '使用部门', dataIndex: 'department', key: 'department', width: 100 },
    { title: '责任人', dataIndex: 'responsiblePerson', key: 'responsiblePerson', width: 100 },
    { 
      title: '预警类型', 
      dataIndex: 'warningType', 
      key: 'warningType', 
      width: 120,
      render: (type) => <Tag color="blue">{type}</Tag>
    },
    { 
      title: '剩余天数', 
      dataIndex: 'daysLeft', 
      key: 'daysLeft', 
      width: 100,
      render: (days) => {
        let color = '#52c41a';
        if (days <= 7) color = '#ff4d4f';
        else if (days <= 30) color = '#faad14';
        return <span style={{ color, fontWeight: 'bold' }}>{days}天</span>;
      }
    },
    { 
      title: '到期日期', 
      dataIndex: 'dueDate', 
      key: 'dueDate', 
      width: 120 
    },
    { 
      title: '处理状态', 
      dataIndex: 'status', 
      key: 'status', 
      width: 100,
      render: (status) => {
        const config = {
          pending: { color: 'orange', text: '待处理' },
          processing: { color: 'blue', text: '处理中' },
          completed: { color: 'green', text: '已完成' }
        };
        const { color, text } = config[status] || config.pending;
        return <Tag color={color}>{text}</Tag>;
      }
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      fixed: 'right',
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
    }
  ];

  const handleViewDetail = (record) => {
    setSelectedWarning(record);
    setVisible(true);
  };

  const handleCloseModal = () => {
    setVisible(false);
    setSelectedWarning(null);
  };

  const handleSearch = () => {
    message.success('查询成功！');
  };

  const handleReset = () => {
    setFilterStatus('all');
    setFilterType('all');
    message.success('重置成功！');
  };

  const handleExport = () => {
    message.success('导出成功！');
  };

  const handlePrint = () => {
    message.success('打印成功！');
  };

  const handleMarkAsProcessing = () => {
    if (selectedWarning) {
      message.success(`已将预警 ${selectedWarning.assetName} 标记为处理中`);
      handleCloseModal();
    }
  };

  const handleMarkAsCompleted = () => {
    if (selectedWarning) {
      message.success(`已将预警 ${selectedWarning.assetName} 标记为已完成`);
      handleCloseModal();
    }
  };

  const filteredData = warningData.filter(item => {
    if (filterStatus !== 'all' && item.status !== filterStatus) return false;
    if (filterType !== 'all' && item.warningType !== filterType) return false;
    return true;
  });

  return (
    <div style={{ padding: '0 16px' }}>
      <h1 style={{ marginBottom: 24 }}>固定资产预警</h1>
      

      
      <Card style={{ marginBottom: 16 }}>
        <Space wrap style={{ width: '100%' }}>
          <Input placeholder="资产编码" style={{ width: 150, minWidth: '120px' }} />
          <Input placeholder="资产名称" style={{ width: 150, minWidth: '120px' }} />
          <Select 
            placeholder="预警类型" 
            style={{ width: 150, minWidth: '120px' }}
            value={filterType}
            onChange={setFilterType}
          >
            <Option value="all">全部类型</Option>
            <Option value="维保到期">维保到期</Option>
            <Option value="校准到期">校准到期</Option>
            <Option value="折旧完成">折旧完成</Option>
            <Option value="使用年限预警">使用年限预警</Option>
            <Option value="配件库存不足">配件库存不足</Option>
            <Option value="安全检查">安全检查</Option>
            <Option value="年检到期">年检到期</Option>
            <Option value="耗材更换">耗材更换</Option>
          </Select>
          <Select 
            placeholder="预警级别" 
            style={{ width: 120, minWidth: '100px' }}
          >
            <Option value="all">全部级别</Option>
            <Option value="high">高风险</Option>
            <Option value="medium">中风险</Option>
            <Option value="low">低风险</Option>
          </Select>
          <Select 
            placeholder="处理状态" 
            style={{ width: 120, minWidth: '100px' }}
            value={filterStatus}
            onChange={setFilterStatus}
          >
            <Option value="all">全部状态</Option>
            <Option value="pending">待处理</Option>
            <Option value="processing">处理中</Option>
            <Option value="completed">已完成</Option>
          </Select>
          <RangePicker placeholder={['预警开始日期', '预警结束日期']} style={{ width: 240 }} />
          <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
            查询
          </Button>
          <Button onClick={handleReset} icon={<FilterOutlined />}>重置</Button>
          <Button icon={<DownloadOutlined />} onClick={handleExport}>导出</Button>
          <Button icon={<PrinterOutlined />} onClick={handlePrint}>打印</Button>
        </Space>
      </Card>
      
      <div style={{ overflowX: 'auto' }}>
        <Table 
          columns={columns} 
          dataSource={filteredData} 
          pagination={{ 
            current: currentPage,
            pageSize: pageSize,
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            },
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条预警记录`,
            size: "small",
            style: {
              display: "flex",
              justifyContent: "center",
              marginTop: "16px"
            }
          }} 
          rowKey="key"
          style={{
            borderRadius: 8,
            overflow: 'hidden',
          }}
        />
      </div>

      <Modal
        title={`预警详情 - ${selectedWarning?.assetName || ''}`}
        open={visible}
        onCancel={handleCloseModal}
        width={800}
        footer={[
          <Button key="close" onClick={handleCloseModal}>
            关闭
          </Button>,
          <Button key="processing" type="primary" onClick={handleMarkAsProcessing}>
            标记为处理中
          </Button>,
          <Button key="completed" type="primary" onClick={handleMarkAsCompleted}>
            标记为已完成
          </Button>
        ]}
      >
        {selectedWarning && (
          <div>
            <div style={{ marginBottom: 24, padding: 16, backgroundColor: '#f8f9fa', borderRadius: 8 }}>
              <Row gutter={[16, 8]}>
                <Col span={8}>
                  <div><strong>资产编码：</strong>{selectedWarning.assetCode}</div>
                </Col>
                <Col span={8}>
                  <div><strong>资产名称：</strong>{selectedWarning.assetName}</div>
                </Col>
                <Col span={8}>
                  <div><strong>资产类型：</strong>{selectedWarning.assetType}</div>
                </Col>
                <Col span={8}>
                  <div><strong>生产厂商：</strong>{selectedWarning.manufacturer}</div>
                </Col>
                <Col span={8}>
                  <div><strong>规格型号：</strong>{selectedWarning.specification}</div>
                </Col>
                <Col span={8}>
                  <div><strong>购置日期：</strong>{selectedWarning.purchaseDate}</div>
                </Col>
                <Col span={8}>
                  <div><strong>原值(元)：</strong>{selectedWarning.originalValue.toLocaleString()}</div>
                </Col>
                <Col span={8}>
                  <div><strong>净值(元)：</strong>{selectedWarning.netValue.toLocaleString()}</div>
                </Col>
                <Col span={8}>
                  <div><strong>使用年限：</strong>{selectedWarning.usefulLife}年</div>
                </Col>
                <Col span={8}>
                  <div><strong>使用部门：</strong>{selectedWarning.department}</div>
                </Col>
                <Col span={8}>
                  <div><strong>责任人：</strong>{selectedWarning.responsiblePerson}</div>
                </Col>
                <Col span={8}>
                  <div>
                    <strong>预警级别：</strong>
                    <Tag color={selectedWarning.warningLevel === 'high' ? '#ff4d4f' : selectedWarning.warningLevel === 'medium' ? '#faad14' : '#52c41a'}>
                      {selectedWarning.warningLevel === 'high' ? '高风险' : selectedWarning.warningLevel === 'medium' ? '中风险' : '低风险'}
                    </Tag>
                  </div>
                </Col>
              </Row>
            </div>

            <div style={{ marginBottom: 16 }}>
              <h3>预警信息</h3>
              <Row gutter={[16, 8]}>
                <Col span={12}>
                  <div><strong>预警类型：</strong>{selectedWarning.warningType}</div>
                </Col>
                <Col span={12}>
                  <div><strong>预警日期：</strong>{selectedWarning.warningDate}</div>
                </Col>
                <Col span={12}>
                  <div><strong>到期日期：</strong>{selectedWarning.dueDate}</div>
                </Col>
                <Col span={12}>
                  <div>
                    <strong>剩余天数：</strong>
                    <span style={{ 
                      color: selectedWarning.daysLeft <= 7 ? '#ff4d4f' : selectedWarning.daysLeft <= 30 ? '#faad14' : '#52c41a',
                      fontWeight: 'bold',
                      marginLeft: 8
                    }}>
                      {selectedWarning.daysLeft}天
                    </span>
                  </div>
                </Col>
                <Col span={24}>
                  <div><strong>预警描述：</strong>{selectedWarning.description}</div>
                </Col>
                <Col span={24}>
                  <div><strong>处理建议：</strong>{selectedWarning.actionRequired}</div>
                </Col>
              </Row>
            </div>

            <div style={{ marginBottom: 16 }}>
              <h3>处理状态</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <Tag color={selectedWarning.status === 'pending' ? 'orange' : selectedWarning.status === 'processing' ? 'blue' : 'green'}>
                  {selectedWarning.status === 'pending' ? '待处理' : selectedWarning.status === 'processing' ? '处理中' : '已完成'}
                </Tag>
                <Progress 
                  percent={selectedWarning.status === 'pending' ? 0 : selectedWarning.status === 'processing' ? 50 : 100} 
                  size="small" 
                  style={{ width: 200 }}
                />
              </div>
            </div>

            {selectedWarning.lastMaintenanceDate && (
              <div style={{ marginBottom: 16 }}>
                <h3>维保信息</h3>
                <Row gutter={[16, 8]}>
                  <Col span={12}>
                    <div><strong>上次维保日期：</strong>{selectedWarning.lastMaintenanceDate}</div>
                  </Col>
                  <Col span={12}>
                    <div><strong>维保周期：</strong>{selectedWarning.maintenanceCycle}</div>
                  </Col>
                </Row>
              </div>
            )}

            {selectedWarning.criticalPart && (
              <div style={{ marginBottom: 16 }}>
                <h3>配件信息</h3>
                <Row gutter={[16, 8]}>
                  <Col span={12}>
                    <div><strong>关键配件：</strong>{selectedWarning.criticalPart}</div>
                  </Col>
                  <Col span={12}>
                    <div>
                      <strong>当前库存：</strong>
                      <Badge 
                        count={selectedWarning.currentStock} 
                        style={{ backgroundColor: selectedWarning.currentStock < selectedWarning.minStock ? '#ff4d4f' : '#52c41a', marginLeft: 8 }}
                      />
                      <span style={{ marginLeft: 8 }}>/ 最低库存：{selectedWarning.minStock}</span>
                    </div>
                  </Col>
                </Row>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default FixedAssetsWarning;