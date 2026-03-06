import React, { useState } from 'react';
import { Card, Table, Input, Select, DatePicker, Button, Space, Tag, Modal, Descriptions, message, Pagination, Form, Upload } from 'antd';
import { SearchOutlined, EditOutlined, DownloadOutlined, PrinterOutlined, UploadOutlined, EyeOutlined } from '@ant-design/icons';

const { Option } = Select;
const { RangePicker } = DatePicker;

const FixedAssetsDetailQuery = () => {
  const [visible, setVisible] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [editingAsset, setEditingAsset] = useState(null);
  const [form] = Form.useForm();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const assets = [
    { 
      key: '1', 
      assetCode: 'FA2024001', 
      assetName: 'CT扫描仪', 
      assetType: '医疗设备', 
      specification: '64排128层',
      manufacturer: '西门子医疗',
      purchaseDate: '2024-01-15',
      originalValue: 2800000,
      netValue: 2520000,
      department: '放射科',
      location: 'A栋1楼',
      responsiblePerson: '张医生',
      status: '在用',
      depreciationMethod: '直线法',
      usefulLife: 10,
      serialNumber: 'CT-SIEMENS-001',
      qualityCertificate: '资产合格证_FA2024001.pdf',
      calibrationCertificate: '校准报告证书_FA2024001.pdf',
      inspectionCertificate: '检验合格证书_FA2024001.pdf'
    },
    { 
      key: '2', 
      assetCode: 'FA2024002', 
      assetName: '彩色超声诊断仪', 
      assetType: '医疗设备', 
      specification: '高端彩超',
      manufacturer: 'GE医疗',
      purchaseDate: '2024-02-20',
      originalValue: 1500000,
      netValue: 1425000,
      department: '超声科',
      location: 'B栋2楼',
      responsiblePerson: '李医生',
      status: '在用',
      depreciationMethod: '直线法',
      usefulLife: 8,
      serialNumber: 'US-GE-002',
      qualityCertificate: '资产合格证_FA2024002.pdf',
      calibrationCertificate: '校准报告证书_FA2024002.pdf',
      inspectionCertificate: '检验合格证书_FA2024002.pdf'
    },
    { 
      key: '3', 
      assetCode: 'FA2024003', 
      assetName: '服务器', 
      assetType: '办公设备', 
      specification: 'Dell PowerEdge',
      manufacturer: '戴尔',
      purchaseDate: '2024-03-10',
      originalValue: 80000,
      netValue: 76000,
      department: '信息科',
      location: '数据中心',
      responsiblePerson: '王工程师',
      status: '在用',
      depreciationMethod: '直线法',
      usefulLife: 5,
      serialNumber: 'SRV-DELL-003',
      qualityCertificate: '资产合格证_FA2024003.pdf',
      calibrationCertificate: '校准报告证书_FA2024003.pdf',
      inspectionCertificate: '检验合格证书_FA2024003.pdf'
    },
    { 
      key: '4', 
      assetCode: 'FA2023001', 
      assetName: '公务用车', 
      assetType: '车辆', 
      specification: '丰田凯美瑞',
      manufacturer: '丰田',
      purchaseDate: '2023-06-15',
      originalValue: 250000,
      netValue: 212500,
      department: '行政部',
      location: '停车场',
      responsiblePerson: '赵主任',
      status: '在用',
      depreciationMethod: '直线法',
      usefulLife: 8,
      serialNumber: 'CAR-TOYOTA-001',
      qualityCertificate: '资产合格证_FA2023001.pdf',
      calibrationCertificate: '校准报告证书_FA2023001.pdf',
      inspectionCertificate: '检验合格证书_FA2023001.pdf'
    },
    { 
      key: '5', 
      assetCode: 'FA2022001', 
      assetName: '办公桌椅', 
      assetType: '家具', 
      specification: '实木办公桌椅',
      manufacturer: '宜家',
      purchaseDate: '2022-08-20',
      originalValue: 5000,
      netValue: 4000,
      department: '运营组',
      location: 'C栋3楼',
      responsiblePerson: '孙经理',
      status: '闲置',
      depreciationMethod: '直线法',
      usefulLife: 10,
      serialNumber: 'FUR-IKEA-001',
      qualityCertificate: '资产合格证_FA2022001.pdf',
      calibrationCertificate: '校准报告证书_FA2022001.pdf',
      inspectionCertificate: '检验合格证书_FA2022001.pdf'
    },
  ];

  const columns = [
    { title: '资产编码', dataIndex: 'assetCode', key: 'assetCode', width: 120 },
    { title: '资产名称', dataIndex: 'assetName', key: 'assetName', width: 150 },
    { title: '资产类型', dataIndex: 'assetType', key: 'assetType', width: 100 },
    { title: '规格型号', dataIndex: 'specification', key: 'specification', width: 120 },
    { title: '生产厂商', dataIndex: 'manufacturer', key: 'manufacturer', width: 120 },
    { 
      title: '购置日期', 
      dataIndex: 'purchaseDate', 
      key: 'purchaseDate', 
      width: 110,
      sorter: (a, b) => new Date(a.purchaseDate) - new Date(b.purchaseDate)
    },
    { 
      title: '原值（元）', 
      dataIndex: 'originalValue', 
      key: 'originalValue', 
      width: 110,
      render: (value) => value.toLocaleString(),
      sorter: (a, b) => a.originalValue - b.originalValue
    },
    { 
      title: '净值（元）', 
      dataIndex: 'netValue', 
      key: 'netValue', 
      width: 110,
      render: (value) => value.toLocaleString(),
      sorter: (a, b) => a.netValue - b.netValue
    },
    { title: '使用部门', dataIndex: 'department', key: 'department', width: 100 },
    { 
      title: '资产状态', 
      dataIndex: 'status', 
      key: 'status', 
      width: 100,
      render: (status) => {
        let color = 'green';
        if (status === '闲置') color = 'orange';
        if (status === '维修') color = 'blue';
        if (status === '待报废') color = 'red';
        return <Tag color={color}>{status}</Tag>;
      }
    },
    { 
      title: '操作', 
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="link" 
            size="small"
            icon={<EditOutlined />} 
            onClick={() => handleViewDetail(record)}
          >
            修改
          </Button>
        </Space>
      )
    },
  ];

  const handleViewDetail = (record) => {
    setSelectedAsset(record);
    setEditingAsset({ ...record });
    form.setFieldsValue({ ...record });
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

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      // 这里可以添加保存逻辑，例如API调用
      message.success('修改成功！');
      setVisible(false);
      // 可以在这里更新assets数组中的数据
    } catch (error) {
      message.error('请检查输入信息！');
    }
  };

  const uploadProps = {
    name: 'file',
    action: '/api/upload',
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info) {
      if (info.file.status === 'done') {
        console.log('文件上传成功');
      } else if (info.file.status === 'error') {
        console.log('文件上传失败');
      }
    },
  };

  return (
    <div style={{ padding: '0 16px' }}>
      <h1 style={{ marginBottom: 24 }}>资产明细查询</h1>
      
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
            <Option value="放射科">放射科</Option>
            <Option value="超声科">超声科</Option>
            <Option value="信息科">信息科</Option>
            <Option value="行政部">行政部</Option>
            <Option value="运营组">运营组</Option>
          </Select>
          <Select placeholder="资产状态" style={{ width: 120, minWidth: '100px' }}>
            <Option value="all">全部</Option>
            <Option value="在用">在用</Option>
            <Option value="闲置">闲置</Option>
            <Option value="维修">维修</Option>
            <Option value="待报废">待报废</Option>
          </Select>
          <RangePicker placeholder={['购置开始日期', '购置结束日期']} style={{ width: 240 }} />
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
          columns={columns.map(column => ({
            ...column,
            ellipsis: false,
            align: 'center',
            onHeaderCell: () => ({
              style: {
                whiteSpace: 'nowrap'
              }
            }),
            onCell: () => ({
              style: {
                whiteSpace: 'nowrap'
              }
            })
          }))} 
          dataSource={assets} 
          pagination={false}
          scroll={{ x: 1600 }}
        />
      </div>
      
      <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center' }}>
        <Pagination 
          current={currentPage}
          pageSize={pageSize}
          showSizeChanger={true}
          showQuickJumper={true}
          showTotal={(total) => `共 ${total} 条记录`}
          total={assets.length}
          onChange={(page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          }}
        />
      </div>

      <Modal
        title="修改资产信息"
        open={visible}
        onCancel={() => setVisible(false)}
        footer={[
          <Button key="close" onClick={() => setVisible(false)}>
            取消
          </Button>,
          <Button key="save" type="primary" onClick={handleSave}>
            保存
          </Button>
        ]}
        width={800}
      >
        {selectedAsset && (
          <Form
            form={form}
            layout="vertical"
            initialValues={selectedAsset}
          >
            <Form.Item
              name="assetCode"
              label="资产编码"
              rules={[{ required: true, message: '请输入资产编码' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="assetName"
              label="资产名称"
              rules={[{ required: true, message: '请输入资产名称' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="assetType"
              label="资产类型"
              rules={[{ required: true, message: '请选择资产类型' }]}
            >
              <Select>
                <Option value="医疗设备">医疗设备</Option>
                <Option value="办公设备">办公设备</Option>
                <Option value="家具">家具</Option>
                <Option value="车辆">车辆</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="specification"
              label="规格型号"
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="manufacturer"
              label="生产厂商"
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="serialNumber"
              label="序列号"
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="purchaseDate"
              label="购置日期"
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="usefulLife"
              label="使用年限"
            >
              <Input type="number" suffix="年" />
            </Form.Item>
            <Form.Item
              name="originalValue"
              label="原值"
            >
              <Input type="number" suffix="元" />
            </Form.Item>
            <Form.Item
              name="netValue"
              label="净值"
            >
              <Input type="number" suffix="元" />
            </Form.Item>
            <Form.Item
              name="depreciationMethod"
              label="折旧方法"
            >
              <Select>
                <Option value="直线法">直线法</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="department"
              label="使用部门"
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="location"
              label="存放地点"
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="responsiblePerson"
              label="责任人"
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="status"
              label="资产状态"
            >
              <Select>
                <Option value="在用">在用</Option>
                <Option value="闲置">闲置</Option>
                <Option value="维修">维修</Option>
                <Option value="待报废">待报废</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="qualityCertificate"
              label="资产合格证"
              valuePropName="fileList"
            >
              <div>
                {selectedAsset.qualityCertificate && (
                  <div style={{ marginBottom: 8 }}>
                    <Button 
                      type="link" 
                      icon={<EyeOutlined />}
                      onClick={() => console.log('查看资产合格证:', selectedAsset.qualityCertificate)}
                    >
                      {selectedAsset.qualityCertificate}
                    </Button>
                  </div>
                )}
                <Upload {...uploadProps}>
                  <Button icon={<UploadOutlined />}>上传新附件</Button>
                </Upload>
              </div>
            </Form.Item>

            <Form.Item
              name="calibrationCertificate"
              label="校准报告证书"
              valuePropName="fileList"
            >
              <div>
                {selectedAsset.calibrationCertificate && (
                  <div style={{ marginBottom: 8 }}>
                    <Button 
                      type="link" 
                      icon={<EyeOutlined />}
                      onClick={() => console.log('查看校准报告证书:', selectedAsset.calibrationCertificate)}
                    >
                      {selectedAsset.calibrationCertificate}
                    </Button>
                  </div>
                )}
                <Upload {...uploadProps}>
                  <Button icon={<UploadOutlined />}>上传新附件</Button>
                </Upload>
              </div>
            </Form.Item>

            <Form.Item
              name="inspectionCertificate"
              label="检验合格证书"
              valuePropName="fileList"
            >
              <div>
                {selectedAsset.inspectionCertificate && (
                  <div style={{ marginBottom: 8 }}>
                    <Button 
                      type="link" 
                      icon={<EyeOutlined />}
                      onClick={() => console.log('查看检验合格证书:', selectedAsset.inspectionCertificate)}
                    >
                      {selectedAsset.inspectionCertificate}
                    </Button>
                  </div>
                )}
                <Upload {...uploadProps}>
                  <Button icon={<UploadOutlined />}>上传新附件</Button>
                </Upload>
              </div>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default FixedAssetsDetailQuery;