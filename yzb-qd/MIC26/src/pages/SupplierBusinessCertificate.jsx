import { useState } from 'react';
import { Card, Button, Table, Form, Input, Space, Modal, Upload, DatePicker, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, UploadOutlined } from '@ant-design/icons';
import moment from 'moment';

const SupplierBusinessCertificate = () => {
  const [visible, setVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  const [businessCertificates, setBusinessCertificates] = useState([
    { 
      key: '1', 
      name: '北京医疗科技有限公司',
      unifiedSocialCreditCode: '91110000MA12345678',
      legalRepresentative: '张三',
      registeredCapital: '1000万元',
      establishmentDate: '2020-01-15',
      address: '北京市朝阳区建国路88号',
      registrationAuthority: '北京市工商局',
      attachment: '营业执照_北京医疗科技有限公司.pdf'
    },
    { 
      key: '2', 
      name: '上海医疗设备有限公司',
      unifiedSocialCreditCode: '91310000MA87654321',
      legalRepresentative: '李四',
      registeredCapital: '2000万元',
      establishmentDate: '2019-06-20',
      address: '上海市浦东新区张江高科技园区',
      registrationAuthority: '上海市工商局',
      attachment: '营业执照_上海医疗设备有限公司.pdf'
    },
    { 
      key: '3', 
      name: '广东医疗器械股份有限公司',
      unifiedSocialCreditCode: '91440000MA13579246',
      legalRepresentative: '王五',
      registeredCapital: '5000万元',
      establishmentDate: '2018-12-10',
      address: '广州市天河区珠江新城',
      registrationAuthority: '广东省工商局',
      attachment: '营业执照_广东医疗器械股份有限公司.pdf'
    },
  ]);

  // 编辑处理函数
  const handleEdit = (record) => {
    setEditingRecord(record);
    editForm.setFieldsValue({
      name: record.name,
      unifiedSocialCreditCode: record.unifiedSocialCreditCode,
      legalRepresentative: record.legalRepresentative,
      registeredCapital: record.registeredCapital,
      establishmentDate: record.establishmentDate ? moment(record.establishmentDate) : null,
      address: record.address,
      registrationAuthority: record.registrationAuthority,
      attachment: []
    });
    setEditVisible(true);
  };

  // 保存编辑
  const handleEditSave = () => {
    editForm.validateFields().then(values => {
      const updatedCertificates = businessCertificates.map(certificate => {
        if (certificate.key === editingRecord.key) {
          // 处理附件
          let attachment = editingRecord.attachment;
          // 检查 values.attachment 是否存在且是数组
          if (values.attachment && Array.isArray(values.attachment) && values.attachment.length > 0) {
            // 取数组中的第一个文件
            attachment = values.attachment[0].name;
          }
          
          return {
            ...certificate,
            name: values.name,
            unifiedSocialCreditCode: values.unifiedSocialCreditCode,
            legalRepresentative: values.legalRepresentative,
            registeredCapital: values.registeredCapital,
            establishmentDate: values.establishmentDate ? values.establishmentDate.format('YYYY-MM-DD') : '',
            address: values.address,
            registrationAuthority: values.registrationAuthority,
            attachment: attachment
          };
        }
        return certificate;
      });
      
      setBusinessCertificates(updatedCertificates);
      setEditVisible(false);
      setEditingRecord(null);
      editForm.resetFields();
      message.success('营业执照更新成功');
    }).catch(() => {
      // 表单验证失败
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
      title: '名称', 
      dataIndex: 'name', 
      key: 'name',
      width: 200,
      align: 'center',
      ellipsis: false,
      onHeaderCell: () => ({
        style: {
          whiteSpace: 'nowrap'
        }
      }),
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
      ellipsis: false,
      onHeaderCell: () => ({
        style: {
          whiteSpace: 'nowrap'
        }
      }),
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
      ellipsis: false,
      onHeaderCell: () => ({
        style: {
          whiteSpace: 'nowrap'
        }
      }),
      onCell: () => ({
        style: {
          whiteSpace: 'nowrap',
          overflow: 'visible'
        }
      })
    },
    { 
      title: '注册资本', 
      dataIndex: 'registeredCapital', 
      key: 'registeredCapital',
      width: 100,
      align: 'center',
      ellipsis: false,
      onHeaderCell: () => ({
        style: {
          whiteSpace: 'nowrap'
        }
      }),
      onCell: () => ({
        style: {
          whiteSpace: 'nowrap',
          overflow: 'visible'
        }
      })
    },
    { 
      title: '成立日期', 
      dataIndex: 'establishmentDate', 
      key: 'establishmentDate',
      width: 100,
      align: 'center',
      ellipsis: false,
      onHeaderCell: () => ({
        style: {
          whiteSpace: 'nowrap'
        }
      }),
      onCell: () => ({
        style: {
          whiteSpace: 'nowrap',
          overflow: 'visible'
        }
      })
    },
    { 
      title: '住所', 
      dataIndex: 'address', 
      key: 'address',
      width: 200,
      align: 'center',
      ellipsis: false,
      onHeaderCell: () => ({
        style: {
          whiteSpace: 'nowrap'
        }
      }),
      onCell: () => ({
        style: {
          whiteSpace: 'nowrap',
          overflow: 'visible'
        }
      })
    },
    { 
      title: '登记机关', 
      dataIndex: 'registrationAuthority', 
      key: 'registrationAuthority',
      width: 120,
      align: 'center',
      ellipsis: false,
      onHeaderCell: () => ({
        style: {
          whiteSpace: 'nowrap'
        }
      }),
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
      ellipsis: false,
      onHeaderCell: () => ({
        style: {
          whiteSpace: 'nowrap'
        }
      }),
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
      ellipsis: false,
      onHeaderCell: () => ({
        style: {
          whiteSpace: 'nowrap'
        }
      }),
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
      <h1 style={{ marginBottom: 24 }}>供应商营业执照</h1>
      
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ whiteSpace: 'nowrap' }}>名称：</span>
              <Input placeholder="请输入名称" style={{ width: 200 }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ whiteSpace: 'nowrap' }}>统一社会信用代码：</span>
              <Input placeholder="请输入统一社会信用代码" style={{ width: 200 }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ whiteSpace: 'nowrap' }}>法定代表人：</span>
              <Input placeholder="请输入法定代表人" style={{ width: 200 }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <Button type="primary" icon={<SearchOutlined />}>查询</Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setVisible(true)}>
              新增营业执照
            </Button>
          </div>
        </div>
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
          form.validateFields().then(values => {
            let attachment = '';
            // 检查 values.attachment 是否存在且是数组
            if (values.attachment && Array.isArray(values.attachment) && values.attachment.length > 0) {
              attachment = values.attachment[0].name;
            }
            const newCertificate = {
              key: (businessCertificates.length + 1).toString(),
              name: values.name,
              unifiedSocialCreditCode: values.unifiedSocialCreditCode,
              legalRepresentative: values.legalRepresentative,
              registeredCapital: values.registeredCapital,
              establishmentDate: values.establishmentDate ? values.establishmentDate.format('YYYY-MM-DD') : '',
              address: values.address,
              registrationAuthority: values.registrationAuthority,
              attachment: attachment
            };
            setBusinessCertificates([...businessCertificates, newCertificate]);
            setVisible(false);
            form.resetFields();
            message.success('营业执照新增成功');
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
            name="name"
            label="名称"
            rules={[{ required: true, message: '请输入名称' }]}
          >
            <Input placeholder="请输入名称" />
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
            name="registeredCapital"
            label="注册资本"
            rules={[{ required: true, message: '请输入注册资本' }]}
          >
            <Input placeholder="请输入注册资本" />
          </Form.Item>
          
          <Form.Item
            name="establishmentDate"
            label="成立日期"
            rules={[{ required: true, message: '请选择成立日期' }]}
          >
            <DatePicker style={{ width: '100%' }} placeholder="请选择成立日期" />
          </Form.Item>
          
          <Form.Item
            name="address"
            label="住所"
            rules={[{ required: true, message: '请输入住所' }]}
          >
            <Input placeholder="请输入住所" />
          </Form.Item>
          
          <Form.Item
            name="registrationAuthority"
            label="登记机关"
            rules={[{ required: true, message: '请输入登记机关' }]}
          >
            <Input placeholder="请输入登记机关" />
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
        width={600}
      >
        <Form form={editForm} layout="vertical">
          <Form.Item
            name="name"
            label="名称"
            rules={[{ required: true, message: '请输入名称' }]}
          >
            <Input placeholder="请输入名称" />
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
            name="registeredCapital"
            label="注册资本"
            rules={[{ required: true, message: '请输入注册资本' }]}
          >
            <Input placeholder="请输入注册资本" />
          </Form.Item>
          
          <Form.Item
            name="establishmentDate"
            label="成立日期"
            rules={[{ required: true, message: '请选择成立日期' }]}
          >
            <DatePicker style={{ width: '100%' }} placeholder="请选择成立日期" />
          </Form.Item>
          
          <Form.Item
            name="address"
            label="住所"
            rules={[{ required: true, message: '请输入住所' }]}
          >
            <Input placeholder="请输入住所" />
          </Form.Item>
          
          <Form.Item
            name="registrationAuthority"
            label="登记机关"
            rules={[{ required: true, message: '请输入登记机关' }]}
          >
            <Input placeholder="请输入登记机关" />
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

export default SupplierBusinessCertificate;