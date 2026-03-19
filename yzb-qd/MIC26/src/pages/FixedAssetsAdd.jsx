import React, { useState } from 'react';
import { Card, Form, Input, Select, DatePicker, InputNumber, Button, Row, Col, message, Upload, Modal, Badge, Checkbox, Table } from 'antd';
import { PlusOutlined, UploadOutlined, SwapOutlined } from '@ant-design/icons';
import api from '../utils/api';

const { Option } = Select;
const { TextArea } = Input;

const FixedAssetsAdd = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [transferAcceptModalVisible, setTransferAcceptModalVisible] = useState(false);
  const [transferAcceptForm] = Form.useForm();
  const [selectedTransferAsset, setSelectedTransferAsset] = useState(null);
  const [selectedTransferIds, setSelectedTransferIds] = useState([]);

  const assetTypes = [
    { value: 'FA001', label: '医疗设备' },
    { value: 'FA002', label: '办公设备' },
    { value: 'FA003', label: '家具' },
    { value: 'FA004', label: '车辆' },
  ];

  const departments = [
    { value: '内科', label: '内科' },
    { value: '外科', label: '外科' },
    { value: '儿科', label: '儿科' },
    { value: '妇产科', label: '妇产科' },
    { value: '急诊科', label: '急诊科' },
    { value: '运营组', label: '运营组' },
  ];

  const locations = [
    { value: 'A栋1楼', label: 'A栋1楼' },
    { value: 'A栋2楼', label: 'A栋2楼' },
    { value: 'B栋1楼', label: 'B栋1楼' },
    { value: 'B栋2楼', label: 'B栋2楼' },
    { value: 'C栋1楼', label: 'C栋1楼' },
  ];

  // 模拟调拨到本仓库的资产数据
  const transferAssetsData = [
    {
      id: 'TR001',
      assetCode: 'FA20240601005',
      assetName: '心电图机',
      assetType: '医疗设备',
      specification: '12导联',
      originalValue: 25000.00,
      transferFrom: '仓库2',
      transferTo: '当前仓库',
      transferNumber: 'TR20240615001',
      transferDate: '2024-06-15',
      transferPerson: '李四',
      status: 'pending',
    },
    {
      id: 'TR002',
      assetCode: 'FA20240601006',
      assetName: '监护仪',
      assetType: '医疗设备',
      specification: '多参数',
      originalValue: 18000.00,
      transferFrom: '仓库3',
      transferTo: '当前仓库',
      transferNumber: 'TR20240615002',
      transferDate: '2024-06-15',
      transferPerson: '王五',
      status: 'pending',
    },
    {
      id: 'TR003',
      assetCode: 'FA20240601007',
      assetName: '输液泵',
      assetType: '医疗设备',
      specification: '双通道',
      originalValue: 12000.00,
      transferFrom: '仓库1',
      transferTo: '当前仓库',
      transferNumber: 'TR20240615003',
      transferDate: '2024-06-14',
      transferPerson: '张三',
      status: 'pending',
    },
  ];

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      
      const assetData = {
        assetCode: values.assetCode,
        assetName: values.assetName,
        assetSpec: values.specification,
        manufacturer: values.manufacturer,
        purchaseDate: values.purchaseDate,
        originalValue: values.originalValue,
        netValue: values.originalValue, // 初始净值等于原值
        location: values.location,
        responsiblePerson: values.responsiblePerson,
        assetState: values.status === '在用' ? 1 : 0,
        usefulLife: values.usefulLife,
        serialNumber: values.serialNumber
      };
      
      const response = await api.post('/yzb/addAsset', assetData);
      if (response.code === 1) {
        message.success('资产新增成功！');
        form.resetFields();
      } else {
        message.error('资产新增失败');
      }
    } catch (error) {
      message.error('请检查输入信息！');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    form.resetFields();
  };

  const handleTransferAccept = () => {
    // 在实际应用中，这里应该从API获取待接收的调拨资产列表
    // 这里我们直接使用模拟数据中的第一个资产
    if (transferAssetsData.length > 0) {
      setSelectedTransferAsset(transferAssetsData[0]);
      setTransferAcceptModalVisible(true);
    } else {
      message.info('当前没有待接收的调拨资产');
    }
  };

  const handleCloseTransferAcceptModal = () => {
    setTransferAcceptModalVisible(false);
    transferAcceptForm.resetFields();
    setSelectedTransferAsset(null);
    setSelectedTransferIds([]);
  };

  const handleAcceptTransfer = () => {
    if (selectedTransferIds.length === 0) {
      message.error('请至少选择一个要接收的调拨资产！');
      return;
    }

    transferAcceptForm.validateFields().then(values => {
      // 模拟API调用
      setLoading(true);
      setTimeout(() => {
        const selectedAssets = transferAssetsData.filter(asset => 
          selectedTransferIds.includes(asset.id)
        );
        
        message.success(`成功接收 ${selectedTransferIds.length} 个调拨资产！资产已入库。`);
        
        // 这里可以添加实际的数据处理逻辑
        console.log('接收调拨资产数据:', {
          selectedAssets,
          formValues: values,
          selectedCount: selectedTransferIds.length
        });
        
        // 在实际应用中，这里应该更新资产状态
        // 例如：调用API更新资产状态为'accepted'
        
        handleCloseTransferAcceptModal();
        setLoading(false);
      }, 1000);
    }).catch(error => {
      console.error('表单验证失败:', error);
    });
  };

  const handleRejectTransfer = () => {
    if (selectedTransferIds.length === 0) {
      message.error('请至少选择一个要拒绝的调拨资产！');
      return;
    }

    transferAcceptForm.validateFields(['rejectReason']).then(values => {
      if (!values.rejectReason || values.rejectReason.trim() === '') {
        message.error('请填写拒绝原因！');
        return;
      }
      
      // 模拟API调用
      setLoading(true);
      setTimeout(() => {
        const selectedAssets = transferAssetsData.filter(asset => 
          selectedTransferIds.includes(asset.id)
        );
        
        message.warning(`已拒绝 ${selectedTransferIds.length} 个调拨资产！已通知调拨方。`);
        
        // 这里可以添加实际的数据处理逻辑
        console.log('拒绝调拨资产数据:', {
          selectedAssets,
          formValues: values,
          selectedCount: selectedTransferIds.length,
          rejectReason: values.rejectReason
        });
        
        // 在实际应用中，这里应该更新资产状态
        // 例如：调用API更新资产状态为'rejected'
        
        handleCloseTransferAcceptModal();
        setLoading(false);
      }, 1000);
    }).catch(error => {
      console.error('表单验证失败:', error);
    });
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  return (
    <div style={{ padding: '0 16px' }}>
      <h1 style={{ marginBottom: 24 }}>资产新增</h1>
      
      <div style={{ marginBottom: 24 }}>
        <Badge count={transferAssetsData.length} overflowCount={99}>
          <Button 
            type="primary" 
            icon={<SwapOutlined />}
            onClick={handleTransferAccept}
            style={{ marginRight: 8 }}
          >
            调拨入库
          </Button>
        </Badge>
        <span style={{ marginLeft: 8, color: '#666', fontSize: '14px' }}>
          待接收调拨资产: {transferAssetsData.length} 个
        </span>
      </div>
      
      <Card>
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            status: '在用',
            depreciationMethod: '直线法',
            attachments: [],
          }}
        >
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="assetCode"
                label="资产编码"
                rules={[{ required: true, message: '请输入资产编码' }]}
              >
                <Input placeholder="系统自动生成或手动输入" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="assetName"
                label="资产名称"
                rules={[{ required: true, message: '请输入资产名称' }]}
              >
                <Input placeholder="请输入资产名称" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="assetType"
                label="资产类型"
                rules={[{ required: true, message: '请选择资产类型' }]}
              >
                <Select placeholder="请选择资产类型">
                  {assetTypes.map(type => (
                    <Option key={type.value} value={type.value}>{type.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="specification"
                label="规格型号"
                rules={[{ required: true, message: '请输入规格型号' }]}
              >
                <Input placeholder="请输入规格型号" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="manufacturer"
                label="生产厂商"
                rules={[{ required: true, message: '请输入生产厂商' }]}
              >
                <Input placeholder="请输入生产厂商" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="purchaseDate"
                label="购置日期"
                rules={[{ required: true, message: '请选择购置日期' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="originalValue"
                label="原值（元）"
                rules={[{ required: true, message: '请输入资产原值' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  precision={2}
                  placeholder="请输入资产原值"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="usefulLife"
                label="使用年限（年）"
                rules={[{ required: true, message: '请输入使用年限' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={1}
                  max={50}
                  placeholder="请输入使用年限"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="department"
                label="使用部门"
                rules={[{ required: true, message: '请选择使用部门' }]}
              >
                <Select placeholder="请选择使用部门">
                  {departments.map(dept => (
                    <Option key={dept.value} value={dept.value}>{dept.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="location"
                label="存放地点"
                rules={[{ required: true, message: '请选择存放地点' }]}
              >
                <Select placeholder="请选择存放地点">
                  {locations.map(location => (
                    <Option key={location.value} value={location.value}>{location.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="responsiblePerson"
                label="责任人"
                rules={[{ required: true, message: '请输入责任人' }]}
              >
                <Input placeholder="请输入责任人姓名" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="资产状态"
                rules={[{ required: true, message: '请选择资产状态' }]}
              >
                <Select placeholder="请选择资产状态">
                  <Option value="在用">在用</Option>
                  <Option value="闲置">闲置</Option>
                  <Option value="维修">维修</Option>
                  <Option value="待报废">待报废</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="depreciationMethod"
                label="折旧方法"
                rules={[{ required: true, message: '请选择折旧方法' }]}
              >
                <Select placeholder="请选择折旧方法">
                  <Option value="直线法">直线法</Option>
                  <Option value="双倍余额递减法">双倍余额递减法</Option>
                  <Option value="年数总和法">年数总和法</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="serialNumber"
                label="序列号"
              >
                <Input placeholder="请输入设备序列号（可选）" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="资产描述"
          >
            <TextArea placeholder="请输入资产详细描述" rows={3} />
          </Form.Item>

          <Form.Item
            name="attachments"
            label="附件上传"
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            <Upload
              name="attachments"
              listType="picture"
              beforeUpload={() => false}
              maxCount={5}
            >
              <Button icon={<UploadOutlined />}>上传附件</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Row gutter={16}>
              <Col>
                <Button type="primary" onClick={handleSubmit} loading={loading} icon={<PlusOutlined />}>
                  提交
                </Button>
              </Col>
              <Col>
                <Button onClick={handleReset}>
                  重置
                </Button>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </Card>

      {/* 资产调拨验收入库弹窗 */}
      <Modal
        title="资产调拨验收入库"
        open={transferAcceptModalVisible}
        onCancel={handleCloseTransferAcceptModal}
        width={800}
        footer={[
          <Button key="cancel" onClick={handleCloseTransferAcceptModal}>
            取消
          </Button>,
          <Button key="reject" danger onClick={handleRejectTransfer}>
            拒绝接收
          </Button>,
          <Button key="accept" type="primary" onClick={handleAcceptTransfer}>
            确认接收
          </Button>,
        ]}
      >
        <Form
          form={transferAcceptForm}
          layout="vertical"
        >
          <div style={{ marginBottom: 16 }}>
            <h4>调拨资产信息</h4>
            <p style={{ color: '#666', marginBottom: 12 }}>请选择要接收的调拨资产：</p>
            
            <Table
              dataSource={transferAssetsData}
              rowKey="id"
              pagination={false}
              size="small"
              rowSelection={{
                selectedRowKeys: selectedTransferIds,
                onChange: (selectedRowKeys) => {
                  setSelectedTransferIds(selectedRowKeys);
                  // 如果只选择了一个资产，将其设置为当前选中的资产
                  if (selectedRowKeys.length === 1) {
                    const selectedAsset = transferAssetsData.find(asset => asset.id === selectedRowKeys[0]);
                    setSelectedTransferAsset(selectedAsset);
                  } else {
                    setSelectedTransferAsset(null);
                  }
                },
                getCheckboxProps: (record) => ({
                  disabled: record.status !== 'pending',
                }),
              }}
              columns={[
                {
                  title: '资产编码',
                  dataIndex: 'assetCode',
                  key: 'assetCode',
                  width: 120,
                },
                {
                  title: '资产名称',
                  dataIndex: 'assetName',
                  key: 'assetName',
                  width: 120,
                },
                {
                  title: '资产类型',
                  dataIndex: 'assetType',
                  key: 'assetType',
                  width: 100,
                },
                {
                  title: '规格型号',
                  dataIndex: 'specification',
                  key: 'specification',
                  width: 100,
                },
                {
                  title: '原值',
                  dataIndex: 'originalValue',
                  key: 'originalValue',
                  width: 100,
                  render: (value) => `¥${value.toLocaleString()}.00`,
                },
                {
                  title: '调拨来源',
                  dataIndex: 'transferFrom',
                  key: 'transferFrom',
                  width: 100,
                },
                {
                  title: '调拨单号',
                  dataIndex: 'transferNumber',
                  key: 'transferNumber',
                  width: 120,
                },
                {
                  title: '状态',
                  dataIndex: 'status',
                  key: 'status',
                  width: 80,
                  render: (status) => {
                    const statusMap = {
                      pending: <span style={{ color: '#1890ff' }}>待接收</span>,
                      accepted: <span style={{ color: '#52c41a' }}>已接收</span>,
                      rejected: <span style={{ color: '#ff4d4f' }}>已拒绝</span>,
                    };
                    return statusMap[status] || status;
                  },
                },
              ]}
              style={{ marginBottom: 16 }}
            />
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <Checkbox
                  checked={selectedTransferIds.length === transferAssetsData.filter(a => a.status === 'pending').length && selectedTransferIds.length > 0}
                  indeterminate={selectedTransferIds.length > 0 && selectedTransferIds.length < transferAssetsData.filter(a => a.status === 'pending').length}
                  onChange={(e) => {
                    if (e.target.checked) {
                      const pendingIds = transferAssetsData.filter(a => a.status === 'pending').map(a => a.id);
                      setSelectedTransferIds(pendingIds);
                    } else {
                      setSelectedTransferIds([]);
                    }
                  }}
                >
                  全选待接收资产
                </Checkbox>
                <span style={{ marginLeft: 16, color: '#666' }}>
                  已选择 {selectedTransferIds.length} 个资产
                </span>
              </div>
              <Button 
                size="small" 
                onClick={() => setSelectedTransferIds([])}
                disabled={selectedTransferIds.length === 0}
              >
                清空选择
              </Button>
            </div>
          </div>
          
          {selectedTransferAsset && (
            <div style={{ marginBottom: 16, padding: 16, backgroundColor: '#f8f9fa', borderRadius: 8 }}>
              <h4>当前选中资产详情</h4>
              <Row gutter={[16, 8]}>
                <Col span={8}>
                  <div><strong>资产编码：</strong>{selectedTransferAsset.assetCode}</div>
                </Col>
                <Col span={8}>
                  <div><strong>资产名称：</strong>{selectedTransferAsset.assetName}</div>
                </Col>
                <Col span={8}>
                  <div><strong>调拨来源：</strong>{selectedTransferAsset.transferFrom}</div>
                </Col>
                <Col span={8}>
                  <div><strong>资产类型：</strong>{selectedTransferAsset.assetType}</div>
                </Col>
                <Col span={8}>
                  <div><strong>规格型号：</strong>{selectedTransferAsset.specification}</div>
                </Col>
                <Col span={8}>
                  <div><strong>原值：</strong>¥{selectedTransferAsset.originalValue.toLocaleString()}.00</div>
                </Col>
                <Col span={8}>
                  <div><strong>调拨单号：</strong>{selectedTransferAsset.transferNumber}</div>
                </Col>
                <Col span={8}>
                  <div><strong>调拨日期：</strong>{selectedTransferAsset.transferDate}</div>
                </Col>
                <Col span={8}>
                  <div><strong>调拨人：</strong>{selectedTransferAsset.transferPerson}</div>
                </Col>
              </Row>
            </div>
          )}

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="acceptDate"
                label="接收日期"
                rules={[{ required: true, message: '请选择接收日期' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="acceptPerson"
                label="接收人"
                rules={[{ required: true, message: '请输入接收人' }]}
              >
                <Input placeholder="请输入接收人姓名" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="storageLocation"
                label="存放位置"
                rules={[{ required: true, message: '请选择存放位置' }]}
              >
                <Select placeholder="请选择存放位置">
                  {locations.map(location => (
                    <Option key={location.value} value={location.value}>{location.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="newResponsiblePerson"
                label="新责任人"
                rules={[{ required: true, message: '请输入新责任人' }]}
              >
                <Input placeholder="请输入新责任人姓名" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="assetCondition"
            label="资产状况检查"
            rules={[{ required: true, message: '请选择资产状况' }]}
          >
            <Select placeholder="请选择资产状况">
              <Option value="excellent">完好无损</Option>
              <Option value="good">轻微磨损</Option>
              <Option value="fair">需要维修</Option>
              <Option value="poor">严重损坏</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="accessories"
            label="配件清单"
          >
            <Select
              mode="multiple"
              placeholder="请选择配件（可多选）"
            >
              <Option value="power_cable">电源线</Option>
              <Option value="patient_cable">导联线</Option>
              <Option value="manual">使用手册</Option>
              <Option value="calibration_cert">校准证书</Option>
              <Option value="maintenance_tools">维修工具</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="acceptanceNotes"
            label="验收备注"
          >
            <TextArea placeholder="请输入验收备注信息" rows={3} />
          </Form.Item>

          <Form.Item
            name="rejectReason"
            label="拒绝原因（如拒绝接收）"
          >
            <TextArea placeholder="如拒绝接收，请填写拒绝原因" rows={2} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default FixedAssetsAdd;