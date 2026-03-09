import { useState } from 'react';
import { Card, Button, Table, Form, Input, Space, Modal, Upload, DatePicker, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, UploadOutlined } from '@ant-design/icons';
import moment from 'moment';

const SupplierBusinessLicense = () => {
  const [visible, setVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  const [businessLicenses, setBusinessLicenses] = useState([
    { 
      key: '1', 
      licenseNumber: 'BL2024001',
      companyName: '供应商A',
      unifiedSocialCreditCode: '91110000MA12345678',
      legalRepresentative: '张三',
      issuingAuthority: '北京市药监局',
      effectiveDate: '2024-01-15',
      expiryDate: '2029-01-15',
      attachment: '经营许可证_供应商A.pdf'
    },
    { 
      key: '2', 
      licenseNumber: 'BL2024002',
      companyName: '供应商B',
      unifiedSocialCreditCode: '91310000MA87654321',
      legalRepresentative: '李四',
      issuingAuthority: '上海市药监局',
      effectiveDate: '2023-06-20',
      expiryDate: '2028-06-20',
      attachment: '经营许可证_供应商B.pdf'
    },
    { 
      key: '3', 
      licenseNumber: 'BL2024003',
      companyName: '供应商C',
      unifiedSocialCreditCode: '91440000MA13579246',
      legalRepresentative: '王五',
      issuingAuthority: '广东省药监局',
      effectiveDate: '2022-12-10',
      expiryDate: '2027-12-10',
      attachment: '经营许可证_供应商C.pdf'
    },
  ]);

  // 编辑处理函数
  const handleEdit = (record) => {
    setEditingRecord(record);
    // 设置所有字段，包括附件为空数组
    editForm.setFieldsValue({
      licenseNumber: record.licenseNumber,
      companyName: record.companyName,
      unifiedSocialCreditCode: record.unifiedSocialCreditCode,
      legalRepresentative: record.legalRepresentative,
      issuingAuthority: record.issuingAuthority,
      effectiveDate: record.effectiveDate ? moment(record.effectiveDate) : null,
      expiryDate: record.expiryDate ? moment(record.expiryDate) : null,
      attachment: []
    });
    setEditVisible(true);
  };

  // 保存编辑
  const handleEditSave = () => {
    editForm.validateFields().then(values => {
      const updatedLicenses = businessLicenses.map(license => {
        if (license.key === editingRecord.key) {
          // 处理附件
          let attachment = editingRecord.attachment;
          // 检查 values.attachment 是否存在且是数组
          if (values.attachment && Array.isArray(values.attachment) && values.attachment.length > 0) {
            // 取数组中的第一个文件
            attachment = values.attachment[0].name;
          }
          
          return {
            ...license,
            licenseNumber: values.licenseNumber,
            companyName: values.companyName,
            unifiedSocialCreditCode: values.unifiedSocialCreditCode,
            legalRepresentative: values.legalRepresentative,
            issuingAuthority: values.issuingAuthority,
            effectiveDate: values.effectiveDate ? values.effectiveDate.format('YYYY-MM-DD') : '',
            expiryDate: values.expiryDate ? values.expiryDate.format('YYYY-MM-DD') : '',
            attachment: attachment
          };
        }
        return license;
      });
      
      setBusinessLicenses(updatedLicenses);
      setEditVisible(false);
      setEditingRecord(null);
      editForm.resetFields();
      message.success('经营许可证更新成功');
    }).catch(() => {
      // 表单验证失败
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
      title: '企业名称', 
      dataIndex: 'companyName', 
      key: 'companyName',
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
      title: '统一社会信用代码', 
      dataIndex: 'unifiedSocialCreditCode', 
      key: 'unifiedSocialCreditCode',
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
      title: '法定代表人', 
      dataIndex: 'legalRepresentative', 
      key: 'legalRepresentative',
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
      title: '发证部门', 
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
      title: '生效日期', 
      dataIndex: 'effectiveDate', 
      key: 'effectiveDate',
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
      title: '失效日期', 
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
      title: '附件', 
      dataIndex: 'attachment', 
      key: 'attachment',
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
        // 文件上传成功
      } else if (info.file.status === 'error') {
        // 文件上传失败
      }
    },
  };

  return (
    <div style={{ padding: '0 16px' }}>
      <h1 style={{ marginBottom: 24 }}>供应商经营许可证</h1>
      
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ whiteSpace: 'nowrap' }}>许可证编号：</span>
              <Input placeholder="请输入许可证编号" style={{ width: 200 }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ whiteSpace: 'nowrap' }}>企业名称：</span>
              <Input placeholder="请输入企业名称" style={{ width: 200 }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ whiteSpace: 'nowrap' }}>统一社会信用代码：</span>
              <Input placeholder="请输入统一社会信用代码" style={{ width: 200 }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <Button type="primary" icon={<SearchOutlined />}>查询</Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setVisible(true)}>
              新增供应商经营许可证
            </Button>
          </div>
        </div>
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
        title="新增供应商经营许可证"
        open={visible}
        onOk={() => {
          form.validateFields().then(values => {
            let attachment = '';
            // 检查 values.attachment 是否存在且是数组
            if (values.attachment && Array.isArray(values.attachment) && values.attachment.length > 0) {
              attachment = values.attachment[0].name;
            }
            const newLicense = {
              key: (businessLicenses.length + 1).toString(),
              licenseNumber: values.licenseNumber,
              companyName: values.companyName,
              unifiedSocialCreditCode: values.unifiedSocialCreditCode,
              legalRepresentative: values.legalRepresentative,
              issuingAuthority: values.issuingAuthority,
              effectiveDate: values.effectiveDate ? values.effectiveDate.format('YYYY-MM-DD') : '',
              expiryDate: values.expiryDate ? values.expiryDate.format('YYYY-MM-DD') : '',
              attachment: attachment
            };
            setBusinessLicenses([...businessLicenses, newLicense]);
            setVisible(false);
            form.resetFields();
            message.success('经营许可证新增成功');
          }).catch(() => {
            // 表单验证失败
          });
        }}
        onCancel={() => {
          setVisible(false);
          form.resetFields();
        }}
        okText="确定"
        cancelText="取消"
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="licenseNumber"
            label="许可证编号"
            rules={[{ required: true, message: '请输入许可证编号' }]}
          >
            <Input placeholder="请输入许可证编号" />
          </Form.Item>
          
          <Form.Item
            name="companyName"
            label="企业名称"
            rules={[{ required: true, message: '请输入企业名称' }]}
          >
            <Input placeholder="请输入企业名称" />
          </Form.Item>
          
          <Form.Item
            name="unifiedSocialCreditCode"
            label="统一社会信用代码"
            rules={[{ required: true, message: '请输入统一社会信用代码' }]}
          >
            <Input placeholder="请输入统一社会信用代码" />
          </Form.Item>
          
          <Form.Item
            name="legalRepresentative"
            label="法定代表人"
            rules={[{ required: true, message: '请输入法定代表人' }]}
          >
            <Input placeholder="请输入法定代表人" />
          </Form.Item>
          
          <Form.Item
            name="issuingAuthority"
            label="发证部门"
            rules={[{ required: true, message: '请输入发证部门' }]}
          >
            <Input placeholder="请输入发证部门" />
          </Form.Item>
          
          <Form.Item
            name="effectiveDate"
            label="生效日期"
            rules={[{ required: true, message: '请选择生效日期' }]}
          >
            <DatePicker style={{ width: '100%' }} placeholder="请选择生效日期" />
          </Form.Item>
          
          <Form.Item
            name="expiryDate"
            label="失效日期"
            rules={[{ required: true, message: '请选择失效日期' }]}
          >
            <DatePicker style={{ width: '100%' }} placeholder="请选择失效日期" />
          </Form.Item>
          
          <Form.Item
            name="attachment"
            label="附件"
            rules={[{ required: true, message: '请上传附件' }]}
            valuePropName="fileList"
          >
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>上传附件</Button>
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
        width={600}
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
            name="companyName"
            label="企业名称"
            rules={[{ required: true, message: '请输入企业名称' }]}
          >
            <Input placeholder="请输入企业名称" />
          </Form.Item>
          
          <Form.Item
            name="unifiedSocialCreditCode"
            label="统一社会信用代码"
            rules={[{ required: true, message: '请输入统一社会信用代码' }]}
          >
            <Input placeholder="请输入统一社会信用代码" />
          </Form.Item>
          
          <Form.Item
            name="legalRepresentative"
            label="法定代表人"
            rules={[{ required: true, message: '请输入法定代表人' }]}
          >
            <Input placeholder="请输入法定代表人" />
          </Form.Item>
          
          <Form.Item
            name="issuingAuthority"
            label="发证部门"
            rules={[{ required: true, message: '请输入发证部门' }]}
          >
            <Input placeholder="请输入发证部门" />
          </Form.Item>
          
          <Form.Item
            name="effectiveDate"
            label="生效日期"
            rules={[{ required: true, message: '请选择生效日期' }]}
          >
            <DatePicker style={{ width: '100%' }} placeholder="请选择生效日期" />
          </Form.Item>
          
          <Form.Item
            name="expiryDate"
            label="失效日期"
            rules={[{ required: true, message: '请选择失效日期' }]}
          >
            <DatePicker style={{ width: '100%' }} placeholder="请选择失效日期" />
          </Form.Item>
          
          <Form.Item
            name="attachment"
            label="附件"
            valuePropName="fileList"
          >
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>重新上传附件</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SupplierBusinessLicense;