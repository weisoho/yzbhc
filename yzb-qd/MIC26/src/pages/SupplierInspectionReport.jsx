import { useState } from 'react';
import { Card, Button, Table, Form, Input, Space, Modal, Upload, DatePicker, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, UploadOutlined } from '@ant-design/icons';
import moment from 'moment';

const SupplierInspectionReport = () => {
  const [visible, setVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  const [registrationCertificates, setRegistrationCertificates] = useState([
    { 
      key: '1', 
      registeredCompany: '供应商A', 
      productName: '一次性输液器', 
      registrationNumber: '2023001',
      packagingSpec: '50支/盒',
      storageCondition: '阴凉干燥处',
      effectiveDate: '2024-01-15',
      expiryDate: '2025-01-15',
      attachment: '检验报告_供应商A_20240115.pdf',
      status: '有效'
    },
    { 
      key: '2', 
      registeredCompany: '供应商B', 
      productName: '医用纱布', 
      registrationNumber: '2023002',
      packagingSpec: '100片/包',
      storageCondition: '常温',
      effectiveDate: '2024-02-20',
      expiryDate: '2025-02-20',
      attachment: '检验报告_供应商B_20240220.pdf',
      status: '有效'
    },
    { 
      key: '3', 
      registeredCompany: '供应商C', 
      productName: '医用手套', 
      registrationNumber: '2023003',
      packagingSpec: '100双/盒',
      storageCondition: '常温干燥处',
      effectiveDate: '2023-12-10',
      expiryDate: '2024-12-10',
      attachment: '检验报告_供应商C_20231210.pdf',
      status: '已过期'
    },
  ]);

  // 编辑处理函数
  const handleEdit = (record) => {
    setEditingRecord(record);
    editForm.setFieldsValue({
      productName: record.productName,
      registrationNumber: record.registrationNumber,
      packagingSpec: record.packagingSpec,
      storageCondition: record.storageCondition,
      effectiveDate: record.effectiveDate ? moment(record.effectiveDate) : null,
      expiryDate: record.expiryDate ? moment(record.expiryDate) : null
    });
    setEditVisible(true);
  };

  // 保存编辑
  const handleEditSave = () => {
    editForm.validateFields().then(values => {
      const updatedCertificates = registrationCertificates.map(certificate => {
        if (certificate.key === editingRecord.key) {
          return {
            ...certificate,
            productName: values.productName,
            registrationNumber: values.registrationNumber,
            packagingSpec: values.packagingSpec,
            storageCondition: values.storageCondition,
            effectiveDate: values.effectiveDate ? values.effectiveDate.format('YYYY-MM-DD') : '',
            expiryDate: values.expiryDate ? values.expiryDate.format('YYYY-MM-DD') : ''
          };
        }
        return certificate;
      });
      
      setRegistrationCertificates(updatedCertificates);
      setEditVisible(false);
      setEditingRecord(null);
      editForm.resetFields();
      message.success('注册证更新成功');
    });
  };

  // 删除处理函数
  const handleDelete = (key) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这条注册证吗？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        const updatedCertificates = registrationCertificates.filter(certificate => certificate.key !== key);
        setRegistrationCertificates(updatedCertificates);
        message.success('注册证删除成功');
      }
    });
  };

  const columns = [
    { 
      title: '注册企业名称', 
      dataIndex: 'registeredCompany', 
      key: 'registeredCompany',
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
      title: '产品名称', 
      dataIndex: 'productName', 
      key: 'productName',
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
      title: '注册证编号', 
      dataIndex: 'registrationNumber', 
      key: 'registrationNumber',
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
      title: '包装规格', 
      dataIndex: 'packagingSpec', 
      key: 'packagingSpec',
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
      title: '储存条件', 
      dataIndex: 'storageCondition', 
      key: 'storageCondition',
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
      title: '生效日期', 
      dataIndex: 'effectiveDate', 
      key: 'effectiveDate',
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
      title: '失效日期', 
      dataIndex: 'expiryDate', 
      key: 'expiryDate',
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
      title: '状态', 
      dataIndex: 'status', 
      key: 'status',
      width: 80,
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
      <h1 style={{ marginBottom: 24 }}>供应商注册证</h1>
      
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>注册企业名称：</span>
              <Input placeholder="请输入注册企业名称" style={{ width: 200 }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>产品名称：</span>
              <Input placeholder="请输入产品名称" style={{ width: 200 }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>注册证编号：</span>
              <Input placeholder="请输入注册证编号" style={{ width: 200 }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <Button type="primary" icon={<SearchOutlined />}>查询</Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setVisible(true)}>
              新增注册证
            </Button>
          </div>
        </div>
      </Card>
      
      <div style={{ overflowX: 'auto' }}>
        <Table 
          columns={columns} 
          dataSource={registrationCertificates} 
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
        title="新增注册证"
        open={visible}
        onOk={() => {
          form.validateFields().then(() => {
            // 新增注册证处理
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
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="registeredCompany"
            label="注册企业名称"
            rules={[{ required: true, message: '请输入注册企业名称' }]}
          >
            <Input placeholder="请输入注册企业名称" />
          </Form.Item>
          
          <Form.Item
            name="productName"
            label="产品名称"
            rules={[{ required: true, message: '请输入产品名称' }]}
          >
            <Input placeholder="请输入产品名称" />
          </Form.Item>
          
          <Form.Item
            name="registrationNumber"
            label="注册证编号"
            rules={[{ required: true, message: '请输入注册证编号' }]}
          >
            <Input placeholder="请输入注册证编号" />
          </Form.Item>
          
          <Form.Item
            name="packagingSpec"
            label="包装规格"
            rules={[{ required: true, message: '请输入包装规格' }]}
          >
            <Input placeholder="请输入包装规格" />
          </Form.Item>
          
          <Form.Item
            name="storageCondition"
            label="储存条件"
            rules={[{ required: true, message: '请输入储存条件' }]}
          >
            <Input placeholder="请输入储存条件" />
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

      {/* 编辑注册证模态框 */}
      <Modal
        title="编辑注册证"
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
            name="productName"
            label="产品名称"
            rules={[{ required: true, message: '请输入产品名称' }]}
          >
            <Input placeholder="请输入产品名称" />
          </Form.Item>
          
          <Form.Item
            name="registrationNumber"
            label="注册证编号"
            rules={[{ required: true, message: '请输入注册证编号' }]}
          >
            <Input placeholder="请输入注册证编号" />
          </Form.Item>
          
          <Form.Item
            name="packagingSpec"
            label="包装规格"
            rules={[{ required: true, message: '请输入包装规格' }]}
          >
            <Input placeholder="请输入包装规格" />
          </Form.Item>
          
          <Form.Item
            name="storageCondition"
            label="储存条件"
            rules={[{ required: true, message: '请输入储存条件' }]}
          >
            <Input placeholder="请输入储存条件" />
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

export default SupplierInspectionReport;