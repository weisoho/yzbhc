import React, { useState } from 'react';
import { Card, Table, Input, Select, DatePicker, Button, Space, Tag, Modal, Form, message, Popconfirm, Descriptions } from 'antd';
import { SearchOutlined, EyeOutlined, CheckOutlined, CloseOutlined, HistoryOutlined } from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;

const FixedAssetsChangeAudit = () => {
  const [visible, setVisible] = useState(false);
  const [historyVisible, setHistoryVisible] = useState(false);
  const [selectedChange, setSelectedChange] = useState(null);
  const [selectedHistory, setSelectedHistory] = useState(null);
  const [form] = Form.useForm();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const changeRecords = [
    { 
      key: '1', 
      changeNo: 'CH202401001', 
      assetCode: 'FA2024001', 
      assetName: 'CT扫描仪', 
      changeType: '使用部门变更',
      oldValue: '放射科',
      newValue: '急诊科',
      changeReason: '急诊科业务需求增加',
      applicant: '张医生',
      applyDate: '2024-01-10',
      changeDate: '2024-01-15',
      auditStatus: '待审核',
      auditor: '',
      auditDate: '',
      remark: '需要紧急调配'
    },
    { 
      key: '2', 
      changeNo: 'CH202401002', 
      assetCode: 'FA2024002', 
      assetName: '彩色超声诊断仪', 
      changeType: '责任人变更',
      oldValue: '李医生',
      newValue: '王医生',
      changeReason: '李医生调离岗位',
      applicant: '李主任',
      applyDate: '2024-01-12',
      changeDate: '2024-01-18',
      auditStatus: '已审核',
      auditor: '赵主任',
      auditDate: '2024-01-15',
      remark: '正常人事变动'
    },
    { 
      key: '3', 
      changeNo: 'CH202401003', 
      assetCode: 'FA2024003', 
      assetName: '服务器', 
      changeType: '存放地点变更',
      oldValue: '数据中心A区',
      newValue: '数据中心B区',
      changeReason: '机房改造升级',
      applicant: '王工程师',
      applyDate: '2024-01-15',
      changeDate: '2024-01-20',
      auditStatus: '已驳回',
      auditor: '孙总监',
      auditDate: '2024-01-18',
      remark: 'B区尚未准备就绪'
    },
    { 
      key: '4', 
      changeNo: 'CH202402001', 
      assetCode: 'FA2023001', 
      assetName: '公务用车', 
      changeType: '使用部门变更',
      oldValue: '行政部',
      newValue: '市场部',
      changeReason: '市场部业务拓展需要',
      applicant: '赵主任',
      applyDate: '2024-02-01',
      changeDate: '2024-02-05',
      auditStatus: '待审核',
      auditor: '',
      auditDate: '',
      remark: '临时借用'
    },
    { 
      key: '5', 
      changeNo: 'CH202402002', 
      assetCode: 'FA2022001', 
      assetName: '办公桌椅', 
      changeType: '存放地点变更',
      oldValue: 'C栋3楼',
      newValue: 'D栋2楼',
      changeReason: '办公室调整',
      applicant: '孙经理',
      applyDate: '2024-02-03',
      changeDate: '2024-02-08',
      auditStatus: '待审核',
      auditor: '',
      auditDate: '',
      remark: '新办公室启用'
    },
  ];

  const changeHistory = [
    { 
      key: '1', 
      changeNo: 'CH202312001', 
      assetCode: 'FA2024001', 
      assetName: 'CT扫描仪', 
      changeType: '责任人变更',
      oldValue: '刘医生',
      newValue: '张医生',
      changeReason: '刘医生退休',
      applicant: '李主任',
      applyDate: '2023-12-05',
      changeDate: '2023-12-10',
      auditStatus: '已审核',
      auditor: '王主任',
      auditDate: '2023-12-08',
      remark: '正常交接'
    },
    { 
      key: '2', 
      changeNo: 'CH202311001', 
      assetCode: 'FA2024002', 
      assetName: '彩色超声诊断仪', 
      changeType: '存放地点变更',
      oldValue: 'B栋1楼',
      newValue: 'B栋2楼',
      changeReason: '科室搬迁',
      applicant: '张主任',
      applyDate: '2023-11-10',
      changeDate: '2023-11-15',
      auditStatus: '已审核',
      auditor: '李主任',
      auditDate: '2023-11-12',
      remark: '新诊室启用'
    },
  ];

  const columns = [
    { title: '变更单号', dataIndex: 'changeNo', key: 'changeNo', width: 130 },
    { title: '资产编码', dataIndex: 'assetCode', key: 'assetCode', width: 120 },
    { title: '资产名称', dataIndex: 'assetName', key: 'assetName', width: 150 },
    { title: '变更类型', dataIndex: 'changeType', key: 'changeType', width: 120 },
    { title: '原值', dataIndex: 'oldValue', key: 'oldValue', width: 120, ellipsis: true },
    { title: '新值', dataIndex: 'newValue', key: 'newValue', width: 120, ellipsis: true },
    { title: '申请人', dataIndex: 'applicant', key: 'applicant', width: 100 },
    { 
      title: '申请日期', 
      dataIndex: 'applyDate', 
      key: 'applyDate', 
      width: 110,
      sorter: (a, b) => new Date(a.applyDate) - new Date(b.applyDate)
    },
    { 
      title: '审核状态', 
      dataIndex: 'auditStatus', 
      key: 'auditStatus', 
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
      width: 200,
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
          {record.auditStatus === '待审核' && (
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
          <Button 
            type="link" 
            size="small"
            icon={<HistoryOutlined />} 
            onClick={() => handleViewHistory(record)}
          >
            历史
          </Button>
        </Space>
      )
    },
  ];

  const handleViewDetail = (record) => {
    setSelectedChange(record);
    setVisible(true);
  };

  const handleViewHistory = (record) => {
    setSelectedHistory(record);
    setHistoryVisible(true);
  };

  const handleApprove = (record) => {
    Modal.confirm({
      title: '确认审核通过',
      content: `确定要通过资产"${record.assetName}"的变更申请吗？`,
      onOk: () => {
        message.success(`已通过"资产${record.assetName}"的变更申请`);
      }
    });
  };

  const handleReject = (record) => {
    Modal.confirm({
      title: '确认驳回申请',
      content: `确定要驳回资产"${record.assetName}"的变更申请吗？`,
      onOk: () => {
        message.success(`已驳回资产"${record.assetName}"的变更申请`);
      }
    });
  };

  const handleSearch = () => {
    message.success('查询成功！');
  };

  const handleReset = () => {
    message.success('重置成功！');
  };

  return (
    <div style={{ padding: '0 16px' }}>
      <h1 style={{ marginBottom: 24 }}>资产变更审核</h1>
      
      <Card style={{ marginBottom: 16 }}>
        <Space wrap style={{ width: '100%' }}>
          <Input placeholder="变更单号" style={{ width: 150, minWidth: '120px' }} />
          <Input placeholder="资产编码" style={{ width: 150, minWidth: '120px' }} />
          <Input placeholder="资产名称" style={{ width: 150, minWidth: '120px' }} />
          <Select placeholder="变更类型" style={{ width: 120, minWidth: '100px' }}>
            <Option value="all">全部</Option>
            <Option value="使用部门变更">使用部门变更</Option>
            <Option value="责任人变更">责任人变更</Option>
            <Option value="存放地点变更">存放地点变更</Option>
            <Option value="资产状态变更">资产状态变更</Option>
          </Select>
          <Select placeholder="审核状态" style={{ width: 120, minWidth: '100px' }}>
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
        </Space>
      </Card>
      
      <div style={{ overflowX: 'auto' }}>
        <Table 
          columns={columns} 
          dataSource={changeRecords} 
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
        title="变更申请详情"
        open={visible}
        onCancel={() => setVisible(false)}
        footer={[
          <Button key="close" onClick={() => setVisible(false)}>
            关闭
          </Button>
        ]}
        width={700}
      >
        {selectedChange && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <h3>资产基本信息</h3>
              <p><strong>资产编码：</strong>{selectedChange.assetCode}</p>
              <p><strong>资产名称：</strong>{selectedChange.assetName}</p>
            </div>
            
            <div style={{ marginBottom: 16 }}>
              <h3>变更申请信息</h3>
              <p><strong>变更单号：</strong>{selectedChange.changeNo}</p>
              <p><strong>变更类型：</strong>{selectedChange.changeType}</p>
              <p><strong>原值：</strong>{selectedChange.oldValue}</p>
              <p><strong>新值：</strong>{selectedChange.newValue}</p>
              <p><strong>变更原因：</strong>{selectedChange.changeReason}</p>
              <p><strong>申请人：</strong>{selectedChange.applicant}</p>
              <p><strong>申请日期：</strong>{selectedChange.applyDate}</p>
              <p><strong>计划变更日期：</strong>{selectedChange.changeDate}</p>
              <p><strong>审核状态：</strong>
                <Tag color={
                  selectedChange.auditStatus === '待审核' ? 'orange' :
                  selectedChange.auditStatus === '已审核' ? 'green' : 'red'
                }>
                  {selectedChange.auditStatus}
                </Tag>
              </p>
              {selectedChange.auditor && (
                <p><strong>审核人：</strong>{selectedChange.auditor}</p>
              )}
              {selectedChange.auditDate && (
                <p><strong>审核日期：</strong>{selectedChange.auditDate}</p>
              )}
              <p><strong>备注：</strong>{selectedChange.remark}</p>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        title="资产变更历史"
        open={historyVisible}
        onCancel={() => setHistoryVisible(false)}
        footer={[
          <Button key="close" onClick={() => setHistoryVisible(false)}>
            关闭
          </Button>
        ]}
        width={800}
      >
        {selectedHistory && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <h3>资产基本信息</h3>
              <p><strong>资产编码：</strong>{selectedHistory.assetCode}</p>
              <p><strong>资产名称：</strong>{selectedHistory.assetName}</p>
            </div>
            
            <div style={{ marginBottom: 16 }}>
              <h3>变更历史记录</h3>
              <Table 
                  columns={[
                    { title: '变更单号', dataIndex: 'changeNo', key: 'changeNo', width: 130 },
                    { title: '变更类型', dataIndex: 'changeType', key: 'changeType', width: 120 },
                    { title: '原值', dataIndex: 'oldValue', key: 'oldValue', width: 120 },
                    { title: '新值', dataIndex: 'newValue', key: 'newValue', width: 120 },
                    { title: '变更原因', dataIndex: 'changeReason', key: 'changeReason', width: 150 },
                    { title: '申请人', dataIndex: 'applicant', key: 'applicant', width: 100 },
                    { title: '申请日期', dataIndex: 'applyDate', key: 'applyDate', width: 110 },
                    { title: '审核人', dataIndex: 'auditor', key: 'auditor', width: 100 },
                    { title: '审核日期', dataIndex: 'auditDate', key: 'auditDate', width: 110 },
                  ]}
                  dataSource={changeHistory}
                  pagination={{
                    pageSize: 5,
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
          </div>
        )}
      </Modal>
    </div>
  );
};

export default FixedAssetsChangeAudit;