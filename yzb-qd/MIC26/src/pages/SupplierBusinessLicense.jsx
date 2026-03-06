import { useState } from 'react';
import { Card, Button, Table, Form, Input, Space, Modal, Upload, DatePicker, Select, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, UploadOutlined } from '@ant-design/icons';
import moment from 'moment';

const SupplierBusinessLicense = () => {
  const [visible, setVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  const suppliers = [
    { key: '1', name: '供应商A', contact: '张三', phone: '13800138001' },
    { key: '2', name: '供应商B', contact: '李四', phone: '13900139001' },
    { key: '3', name: '供应商C', contact: '王五', phone: '13700137001' },
  ];

  const [businessLicenses, setBusinessLicenses] = useState([
    { 
      key: '1', 
      supplierName: '供应商A', 
      licenseNumber: 'BL2024001',
      licenseType: '医疗器械经营许可证',
      issueDate: '2024-01-15',
      expiryDate: '2029-01-15',
      issuingAuthority: '北京市药监局',
      status: '有效',
      licenseFile: '经营许可证_供应商A.pdf',
      remark: ''
    },
    { 
      key: '2', 
      supplierName: '供应商B', 
      licenseNumber: 'BL2024002',
      licenseType: '医疗器械经营许可证',
      issueDate: '2023-06-20',
      expiryDate: '2028-06-20',
      issuingAuthority: '上海市药监局',
      status: '有效',
      licenseFile: '经营许可证_供应商B.pdf',
      remark: ''
    },
    { 
      key: '3', 
      supplierName: '供应商C', 
      licenseNumber: 'BL2024003',
      licenseType: '医疗器械经营许可证',
      issueDate: '2022-12-10',
      expiryDate: '2027-12-10',
      issuingAuthority: '广东省药监局',
      status: '即将过期',
      licenseFile: '经营许可证_供应商C.pdf',
      remark: ''
    },
  ]);

  // 编辑处理函数
  const handleEdit = (record) => {
    setEditingRecord(record);
    editForm.setFieldsValue({
      licenseNumber: record.licenseNumber,
      licenseType: record.licenseType,
      issueDate: record.issueDate ? moment(record.issueDate) : null,
      expiryDate: record.expiryDate ? moment(record.expiryDate) : null,
      issuingAuthority: record.issuingAuthority,
      remark: record.remark || ''
    });
    setEditVisible(true);
  };

  // 保存编辑
  const handleEditSave = () => {
    editForm.validateFields().then(values => {
      const updatedLicenses = businessLicenses.map(license => {
        if (license.key === editingRecord.key) {
          return {
            ...license,
            licenseNumber: values.licenseNumber,
            licenseType: values.licenseType,
            issueDate: values.issueDate ? values.issueDate.format('YYYY-MM-DD') : '',
            expiryDate: values.expiryDate ? values.expiryDate.format('YYYY-MM-DD') : '',
            issuingAuthority: values.issuingAuthority,
            remark: values.remark || ''
          };
        }
        return license;
      });
      
      setBusinessLicenses(updatedLicenses);
      setEditVisible(false);
      setEditingRecord(null);
      editForm.resetFields();
      message.success('经营许可证更新成功');
    });
  };

  // 删除处理函数
  const handleDelete = (key) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这条经营许可证吗？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        const updatedLicenses = businessLicenses.filter(license => license.key !== key);
        setBusinessLicenses(updatedLicenses);
        message.success('经营许可证删除成功');
      }
    });
  };

  const columns = [
    { 
      title: '供应商名称', 
      dataIndex: 'supplierName', 
      key: 'supplierName',
      width: 150,
      align: 'center',
      onCell: () => ({
        style: {
          whiteSpace: 'nowrap',
          overflow: 'visible'
        }
      })
    },
    { 
      title: '许可证编号', 
      dataIndex: 'licenseNumber', 
      key: 'licenseNumber',
      width: 150,
      align: 'center',
      onCell: () => ({
        style: {
          whiteSpace: 'nowrap',
          overflow: 'visible'
        }
      })
    },
    { 
      title: '许可证类型', 
      dataIndex: 'licenseType', 
      key: 'licenseType',
      width: 160,
      align: 'center',
      onCell: () => ({
        style: {
          whiteSpace: 'nowrap',
          overflow: 'visible'
        }
      })
    },
    { 
      title: '发证日期', 
      dataIndex: 'issueDate', 
      key: 'issueDate',
      width: 100,
      align: 'center',
      onCell: () => ({
        style: {
          whiteSpace: 'nowrap',
          overflow: 'visible'
        }
      })
    },
    { 
      title: '有效期至', 
      dataIndex: 'expiryDate', 
      key: 'expiryDate',
      width: 100,
      align: 'center',
      onCell: () => ({
        style: {
          whiteSpace: 'nowrap',
          overflow: 'visible'
        }
      })
    },
    { 
      title: '发证机关', 
      dataIndex: 'issuingAuthority', 
      key: 'issuingAuthority',
      width: 120,
      align: 'center',
      onCell: () => ({
        style: {
          whiteSpace: 'nowrap',
          overflow: 'visible'
        }
      })
    },
    { 
      title: '状态', 
      dataIndex: 'status', 
      key: 'status',
      width: 80,
      align: 'center',
      onCell: () => ({
        style: {
          whiteSpace: 'nowrap',
          overflow: 'visible'
        }
      }),
      render: (status) => (
        <span style={{ 
          color: status === '有效' ? '#52c41a' : status === '即将过期' ? '#faad14' : '#f5222d',
          fontWeight: 'bold'
        }}>
          {status}
        </span>
      )
    },
    { 
      title: '许可证文件', 
      dataIndex: 'licenseFile', 
      key: 'licenseFile',
      width: 150,
      align: 'center',
      onCell: () => ({
        style: {
          whiteSpace: 'nowrap',
          overflow: 'visible'
        }
      })
    },
    { 
      title: '备注', 
      dataIndex: 'remark', 
      key: 'remark',
      width: 200,
      align: 'center',
      onCell: () => ({
        style: {
          whiteSpace: 'nowrap',
          overflow: 'visible'
        }
      })
    },
    { 
      title: '操作', 
      key: 'action',
      width: 150,
      align: 'center',
      onCell: () => ({
        style: {
          whiteSpace: 'nowrap',
          overflow: 'visible'
        }
      }),
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => handleEdit(record)}><EditOutlined />编辑</a>
          <a style={{ color: 'red' }} onClick={() => handleDelete(record.key)}><DeleteOutlined />删除</a>
        </Space>
      )
    },
  ];

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
      <h1 style={{ marginBottom: 24 }}>供应商经营许可证</h1>
      
      <Card style={{ marginBottom: 16 }}>
        <Space wrap style={{ width: '100%' }}>
          <Select placeholder="选择供应商" style={{ width: 200 }}>
            {suppliers.map(supplier => (
              <Select.Option key={supplier.key} value={supplier.name}>
                {supplier.name}
              </Select.Option>
            ))}
          </Select>
          <Input placeholder="许可证编号" style={{ width: 200 }} />
          <Select placeholder="许可证类型" style={{ width: 180 }}>
            <Select.Option value="医疗器械经营许可证">医疗器械经营许可证</Select.Option>
            <Select.Option value="药品经营许可证">药品经营许可证</Select.Option>
            <Select.Option value="营业执照">营业执照</Select.Option>
          </Select>
          <Select placeholder="状态" style={{ width: 120 }}>
            <Select.Option value="有效">有效</Select.Option>
            <Select.Option value="即将过期">即将过期</Select.Option>
            <Select.Option value="已过期">已过期</Select.Option>
          </Select>
          <Button type="primary" icon={<SearchOutlined />}>查询</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setVisible(true)}>
            新增经营许可证
          </Button>
        </Space>
      </Card>
      
      <div style={{ overflowX: 'auto' }}>
        <Table 
          columns={columns} 
          dataSource={businessLicenses} 
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
            style: {
              display: 'flex',
              justifyContent: 'center',
              marginTop: '16px'
            }
          }}
          scroll={{ x: 1400 }}
        />
      </div>

      <Modal
        title="新增经营许可证"
        open={visible}
        onOk={() => {
          form.validateFields().then(() => {
            // 新增经营许可证处理
            setVisible(false);
            form.resetFields();
          });
        }}
        onCancel={() => {
          setVisible(false);
          form.resetFields();
        }}
        okText="确定"
        cancelText="取消"
        width={800}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="supplierName"
            label="供应商名称"
            rules={[{ required: true, message: '请选择供应商' }]}
          >
            <Select placeholder="请选择供应商">
              {suppliers.map(supplier => (
                <Select.Option key={supplier.key} value={supplier.name}>
                  {supplier.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="licenseNumber"
            label="许可证编号"
            rules={[{ required: true, message: '请输入许可证编号' }]}
          >
            <Input placeholder="请输入许可证编号" />
          </Form.Item>
          
          <Form.Item
            name="licenseType"
            label="许可证类型"
            rules={[{ required: true, message: '请选择许可证类型' }]}
          >
            <Select placeholder="请选择许可证类型">
              <Select.Option value="医疗器械经营许可证">医疗器械经营许可证</Select.Option>
              <Select.Option value="第二类医疗器械经营备案凭证">第二类医疗器械经营备案凭证</Select.Option>
              <Select.Option value="第三类医疗器械经营许可证">第三类医疗器械经营许可证</Select.Option>
              <Select.Option value="药品经营许可证">药品经营许可证</Select.Option>
              <Select.Option value="药品经营质量管理规范认证证书">药品经营质量管理规范认证证书</Select.Option>
              <Select.Option value="营业执照">营业执照</Select.Option>
              <Select.Option value="食品经营许可证">食品经营许可证</Select.Option>
              <Select.Option value="化妆品生产许可证">化妆品生产许可证</Select.Option>
              <Select.Option value="消毒产品生产企业卫生许可证">消毒产品生产企业卫生许可证</Select.Option>
              <Select.Option value="其他许可证">其他许可证</Select.Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="businessScope"
            label="经营范围"
            rules={[{ required: true, message: '请输入经营范围' }]}
          >
            <Input.TextArea 
              placeholder="请输入许可证允许的经营范围" 
              rows={3}
              showCount
              maxLength={500}
            />
          </Form.Item>
          
          <Form.Item
            name="businessMode"
            label="经营方式"
            rules={[{ required: true, message: '请选择经营方式' }]}
          >
            <Select placeholder="请选择经营方式">
              <Select.Option value="批发">批发</Select.Option>
              <Select.Option value="零售">零售</Select.Option>
              <Select.Option value="批零兼营">批零兼营</Select.Option>
              <Select.Option value="生产">生产</Select.Option>
              <Select.Option value="研发">研发</Select.Option>
              <Select.Option value="其他">其他</Select.Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="issueDate"
            label="发证日期"
            rules={[{ required: true, message: '请选择发证日期' }]}
          >
            <DatePicker style={{ width: '100%' }} placeholder="请选择发证日期" />
          </Form.Item>
          
          <Form.Item
            name="expiryDate"
            label="有效期至"
            rules={[{ required: true, message: '请选择有效期' }]}
          >
            <DatePicker style={{ width: '100%' }} placeholder="请选择有效期" />
          </Form.Item>
          
          <Form.Item
            name="registeredAddress"
            label="注册地址"
            rules={[{ required: true, message: '请输入注册地址' }]}
          >
            <Input placeholder="请输入许可证上的注册地址" />
          </Form.Item>
          
          <Form.Item
            name="warehouseAddress"
            label="仓库地址"
          >
            <Input placeholder="请输入仓库地址（如有）" />
          </Form.Item>
          
          <Form.Item
            name="issuingAuthority"
            label="发证机关"
            rules={[{ required: true, message: '请输入发证机关' }]}
          >
            <Input placeholder="请输入发证机关" />
          </Form.Item>
          
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ marginBottom: 8 }}>负责人信息</h3>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <Form.Item
                name="legalRepresentative"
                label="法定代表人"
                style={{ flex: '1 1 0%', minWidth: '200px' }}
              >
                <Input placeholder="请输入法定代表人" />
              </Form.Item>
              
              <Form.Item
                name="enterpriseResponsiblePerson"
                label="企业负责人"
                style={{ flex: '1 1 0%', minWidth: '200px' }}
              >
                <Input placeholder="请输入企业负责人" />
              </Form.Item>
              
              <Form.Item
                name="qualityResponsiblePerson"
                label="质量负责人"
                style={{ flex: '1 1 0%', minWidth: '200px' }}
              >
                <Input placeholder="请输入质量负责人" />
              </Form.Item>
            </div>
          </div>
          
          <Form.Item
            name="licenseStatus"
            label="许可证状态"
            rules={[{ required: true, message: '请选择许可证状态' }]}
          >
            <Select placeholder="请选择许可证状态">
              <Select.Option value="有效">有效</Select.Option>
              <Select.Option value="即将过期">即将过期</Select.Option>
              <Select.Option value="已过期">已过期</Select.Option>
              <Select.Option value="注销">注销</Select.Option>
              <Select.Option value="吊销">吊销</Select.Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="remarks"
            label="备注"
          >
            <Input.TextArea 
              placeholder="请输入其他需要说明的信息" 
              rows={2}
              showCount
              maxLength={200}
            />
          </Form.Item>
          
          <Form.Item
            name="licenseFile"
            label="许可证文件"
            rules={[{ required: true, message: '请上传许可证文件' }]}
            valuePropName="fileList"
          >
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>上传许可证</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      {/* 编辑经营许可证模态框 */}
      <Modal
        title="编辑经营许可证"
        open={editVisible}
        onOk={handleEditSave}
        onCancel={() => {
          setEditVisible(false);
          setEditingRecord(null);
          editForm.resetFields();
        }}
        okText="保存"
        cancelText="取消"
        width={800}
      >
        <Form form={editForm} layout="vertical">
          <Form.Item
            name="licenseNumber"
            label="许可证编号"
            rules={[{ required: true, message: '请输入许可证编号' }]}
          >
            <Input placeholder="请输入许可证编号" />
          </Form.Item>
          
          <Form.Item
            name="licenseType"
            label="许可证类型"
            rules={[{ required: true, message: '请选择许可证类型' }]}
          >
            <Select placeholder="请选择许可证类型">
              <Select.Option value="医疗器械经营许可证">医疗器械经营许可证</Select.Option>
              <Select.Option value="第二类医疗器械经营备案凭证">第二类医疗器械经营备案凭证</Select.Option>
              <Select.Option value="第三类医疗器械经营许可证">第三类医疗器械经营许可证</Select.Option>
              <Select.Option value="药品经营许可证">药品经营许可证</Select.Option>
              <Select.Option value="药品经营质量管理规范认证证书">药品经营质量管理规范认证证书</Select.Option>
              <Select.Option value="营业执照">营业执照</Select.Option>
              <Select.Option value="食品经营许可证">食品经营许可证</Select.Option>
              <Select.Option value="化妆品生产许可证">化妆品生产许可证</Select.Option>
              <Select.Option value="消毒产品生产企业卫生许可证">消毒产品生产企业卫生许可证</Select.Option>
              <Select.Option value="其他许可证">其他许可证</Select.Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="issueDate"
            label="发证日期"
            rules={[{ required: true, message: '请选择发证日期' }]}
          >
            <DatePicker style={{ width: '100%' }} placeholder="请选择发证日期" />
          </Form.Item>
          
          <Form.Item
            name="expiryDate"
            label="有效期至"
            rules={[{ required: true, message: '请选择有效期' }]}
          >
            <DatePicker style={{ width: '100%' }} placeholder="请选择有效期" />
          </Form.Item>
          
          <Form.Item
            name="issuingAuthority"
            label="发证机关"
            rules={[{ required: true, message: '请输入发证机关' }]}
          >
            <Input placeholder="请输入发证机关" />
          </Form.Item>
          
          <Form.Item
            name="licenseFile"
            label="许可证文件"
            valuePropName="fileList"
          >
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>重新上传许可证</Button>
            </Upload>
          </Form.Item>
          
          <Form.Item
            name="remark"
            label="备注"
          >
            <Input.TextArea 
              placeholder="请输入备注信息" 
              rows={4}
              showCount 
              maxLength={500}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SupplierBusinessLicense;