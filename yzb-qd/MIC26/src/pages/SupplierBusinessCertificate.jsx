import { useState } from 'react';
import { Card, Button, Table, Form, Input, Space, Modal, Upload, DatePicker, Select, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, UploadOutlined } from '@ant-design/icons';
import moment from 'moment';

const SupplierBusinessCertificate = () => {
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

  const [businessCertificates, setBusinessCertificates] = useState([
    { 
      key: '1', 
      supplierName: '供应商A', 
      certificateNumber: 'BC2024001',
      certificateType: '营业执照',
      companyName: '北京医疗科技有限公司',
      legalRepresentative: '张三',
      registeredCapital: '1000万元',
      issueDate: '2020-01-15',
      expiryDate: '2050-01-15',
      issuingAuthority: '北京市工商局',
      status: '有效',
      certificateFile: '营业执照_供应商A.pdf',
      remark: ''
    },
    { 
      key: '2', 
      supplierName: '供应商B', 
      certificateNumber: 'BC2024002',
      certificateType: '营业执照',
      companyName: '上海医疗设备有限公司',
      legalRepresentative: '李四',
      registeredCapital: '2000万元',
      issueDate: '2019-06-20',
      expiryDate: '2049-06-20',
      issuingAuthority: '上海市工商局',
      status: '有效',
      certificateFile: '营业执照_供应商B.pdf',
      remark: ''
    },
    { 
      key: '3', 
      supplierName: '供应商C', 
      certificateNumber: 'BC2024003',
      certificateType: '营业执照',
      companyName: '广东医疗器械股份有限公司',
      legalRepresentative: '王五',
      registeredCapital: '5000万元',
      issueDate: '2018-12-10',
      expiryDate: '2048-12-10',
      issuingAuthority: '广东省工商局',
      status: '有效',
      certificateFile: '营业执照_供应商C.pdf',
      remark: ''
    },
  ]);

  // 编辑处理函数
  const handleEdit = (record) => {
    setEditingRecord(record);
    editForm.setFieldsValue({
      certificateNumber: record.certificateNumber,
      certificateType: record.certificateType,
      companyName: record.companyName,
      legalRepresentative: record.legalRepresentative,
      registeredCapital: record.registeredCapital,
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
      const updatedCertificates = businessCertificates.map(certificate => {
        if (certificate.key === editingRecord.key) {
          return {
            ...certificate,
            certificateNumber: values.certificateNumber,
            certificateType: values.certificateType,
            companyName: values.companyName,
            legalRepresentative: values.legalRepresentative,
            registeredCapital: values.registeredCapital,
            issueDate: values.issueDate ? values.issueDate.format('YYYY-MM-DD') : '',
            expiryDate: values.expiryDate ? values.expiryDate.format('YYYY-MM-DD') : '',
            issuingAuthority: values.issuingAuthority,
            remark: values.remark || ''
          };
        }
        return certificate;
      });
      
      setBusinessCertificates(updatedCertificates);
      setEditVisible(false);
      setEditingRecord(null);
      editForm.resetFields();
      message.success('营业执照更新成功');
    });
  };

  // 删除处理函数
  const handleDelete = (key) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这条营业执照吗？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        const updatedCertificates = businessCertificates.filter(certificate => certificate.key !== key);
        setBusinessCertificates(updatedCertificates);
        message.success('营业执照删除成功');
      }
    });
  };

  const columns = [
    { 
      title: '供应商名称', 
      dataIndex: 'supplierName', 
      key: 'supplierName',
      width: 150,
      align: 'center'
    },
    { 
      title: '证照编号', 
      dataIndex: 'certificateNumber', 
      key: 'certificateNumber',
      width: 120,
      align: 'center'
    },
    { 
      title: '证照类型', 
      dataIndex: 'certificateType', 
      key: 'certificateType',
      width: 100,
      align: 'center'
    },
    { 
      title: '公司名称', 
      dataIndex: 'companyName', 
      key: 'companyName',
      width: 220,
      align: 'center',
      ellipsis: true,
      onCell: () => ({
        style: {
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }
      })
    },
    { 
      title: '法定代表人', 
      dataIndex: 'legalRepresentative', 
      key: 'legalRepresentative',
      width: 120,
      align: 'center',
      ellipsis: true,
      onCell: () => ({
        style: {
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }
      })
    },
    { 
      title: '注册资本', 
      dataIndex: 'registeredCapital', 
      key: 'registeredCapital',
      width: 100,
      align: 'center'
    },
    { 
      title: '发证日期', 
      dataIndex: 'issueDate', 
      key: 'issueDate',
      width: 100,
      align: 'center'
    },
    { 
      title: '有效期至', 
      dataIndex: 'expiryDate', 
      key: 'expiryDate',
      width: 100,
      align: 'center'
    },
    { 
      title: '发证机关', 
      dataIndex: 'issuingAuthority', 
      key: 'issuingAuthority',
      width: 120,
      align: 'center'
    },
    { 
      title: '状态', 
      dataIndex: 'status', 
      key: 'status',
      width: 80,
      align: 'center',
      render: (status) => (
        <span style={{ 
          color: status === '有效' ? '#52c41a' : '#f5222d',
          fontWeight: 'bold'
        }}>
          {status}
        </span>
      )
    },
    { 
      title: '证照文件', 
      dataIndex: 'certificateFile', 
      key: 'certificateFile',
      width: 150,
      align: 'center'
    },
    { 
      title: '备注', 
      dataIndex: 'remark', 
      key: 'remark',
      width: 200,
      ellipsis: true,
      align: 'center'
    },
    { 
      title: '操作', 
      key: 'action',
      width: 150,
      align: 'center',
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
      <h1 style={{ marginBottom: 24 }}>供应商营业执照</h1>
      
      <Card style={{ marginBottom: 16 }}>
        <Space wrap style={{ width: '100%' }}>
          <Select placeholder="选择供应商" style={{ width: 200 }}>
            {suppliers.map(supplier => (
              <Select.Option key={supplier.key} value={supplier.name}>
                {supplier.name}
              </Select.Option>
            ))}
          </Select>
          <Input placeholder="证照编号" style={{ width: 200 }} />
          <Input placeholder="公司名称" style={{ width: 200 }} />
          <Input placeholder="法定代表人" style={{ width: 150 }} />
          <Select placeholder="状态" style={{ width: 120 }}>
            <Select.Option value="有效">有效</Select.Option>
            <Select.Option value="已过期">已过期</Select.Option>
          </Select>
          <Button type="primary" icon={<SearchOutlined />}>查询</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setVisible(true)}>
            新增营业执照
          </Button>
        </Space>
      </Card>
      
      <div style={{ overflowX: 'auto' }}>
        <Table 
          columns={columns} 
          dataSource={businessCertificates} 
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
          scroll={{ x: 1600 }}
        />
      </div>

      <Modal
        title="新增营业执照"
        open={visible}
        onOk={() => {
          form.validateFields().then(() => {
            // 新增营业执照处理
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
        width={700}
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
            name="certificateNumber"
            label="证照编号"
            rules={[{ required: true, message: '请输入证照编号' }]}
          >
            <Input placeholder="请输入证照编号" />
          </Form.Item>
          
          <Form.Item
            name="certificateType"
            label="证照类型"
            rules={[{ required: true, message: '请选择证照类型' }]}
          >
            <Select placeholder="请选择证照类型">
              <Select.Option value="营业执照">营业执照</Select.Option>
              <Select.Option value="组织机构代码证">组织机构代码证</Select.Option>
              <Select.Option value="税务登记证">税务登记证</Select.Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="companyName"
            label="公司名称"
            rules={[{ required: true, message: '请输入公司名称' }]}
          >
            <Input placeholder="请输入公司名称" />
          </Form.Item>
          
          <Form.Item
            name="legalRepresentative"
            label="法定代表人"
            rules={[{ required: true, message: '请输入法定代表人' }]}
          >
            <Input placeholder="请输入法定代表人" />
          </Form.Item>
          
          <Form.Item
            name="registeredCapital"
            label="注册资本"
            rules={[{ required: true, message: '请输入注册资本' }]}
          >
            <Input placeholder="请输入注册资本" />
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
            name="certificateFile"
            label="证照文件"
            rules={[{ required: true, message: '请上传证照文件' }]}
            valuePropName="fileList"
          >
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>上传证照</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      {/* 编辑营业执照模态框 */}
      <Modal
        title="编辑营业执照"
        open={editVisible}
        onOk={handleEditSave}
        onCancel={() => {
          setEditVisible(false);
          setEditingRecord(null);
          editForm.resetFields();
        }}
        okText="保存"
        cancelText="取消"
        width={700}
      >
        <Form form={editForm} layout="vertical">
          <Form.Item
            name="certificateNumber"
            label="证照编号"
            rules={[{ required: true, message: '请输入证照编号' }]}
          >
            <Input placeholder="请输入证照编号" />
          </Form.Item>
          
          <Form.Item
            name="certificateType"
            label="证照类型"
            rules={[{ required: true, message: '请选择证照类型' }]}
          >
            <Select placeholder="请选择证照类型">
              <Select.Option value="营业执照">营业执照</Select.Option>
              <Select.Option value="组织机构代码证">组织机构代码证</Select.Option>
              <Select.Option value="税务登记证">税务登记证</Select.Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="companyName"
            label="公司名称"
            rules={[{ required: true, message: '请输入公司名称' }]}
          >
            <Input placeholder="请输入公司名称" />
          </Form.Item>
          
          <Form.Item
            name="legalRepresentative"
            label="法定代表人"
            rules={[{ required: true, message: '请输入法定代表人' }]}
          >
            <Input placeholder="请输入法定代表人" />
          </Form.Item>
          
          <Form.Item
            name="registeredCapital"
            label="注册资本"
            rules={[{ required: true, message: '请输入注册资本' }]}
          >
            <Input placeholder="请输入注册资本" />
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
            name="certificateFile"
            label="证照文件"
            valuePropName="fileList"
          >
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>重新上传证照</Button>
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

export default SupplierBusinessCertificate;