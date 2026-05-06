import { useState, useEffect } from 'react';
import { Card, Button, Table, Form, Input, Space, Modal, Upload, DatePicker, message, Select } from 'antd';
import { useParams } from 'react-router-dom';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, UploadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import api from '../utils/api.js';

const getUploadedFileMeta = (file) => {
  const payload = file?.response?.data;
  return {
    attachmentName: payload?.originalName || file?.name || '',
    attachmentUrl: payload?.url || file?.url || '',
  };
};

const SupplierInspectionReport = () => {
  const { supplierId } = useParams();
  const [visible, setVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [editFileList, setEditFileList] = useState([]);
  const [registrationCertificates, setRegistrationCertificates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [searchParams, setSearchParams] = useState({
    supplierName: '',
    productName: '',
    registrationNumber: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [suppliers, setSuppliers] = useState([]);
  const [total, setTotal] = useState(0);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewRecord, setPreviewRecord] = useState(null);

  const datePickerProps = {
    style: { width: '100%' },
    inputReadOnly: true,
    getPopupContainer: (trigger) => trigger.parentElement || trigger.parentNode,
  };

  const getErrorMessage = (error, fallback) => error?.msg || error?.message || error?.data?.msg || error?.data?.message || fallback;
  const formatDate = (value) => {
    if (!value) {
      return '--';
    }
    const parsed = dayjs(value);
    return parsed.isValid() ? parsed.format('YYYY-MM-DD') : '--';
  };

  // 加载供应商列表
  const loadSuppliers = async () => {
    try {
      const response = await api.get('/api/scm/suppliers');
      console.log('供应商列表响应:', response);
      if (response.code === 1 && response.data) {
        console.log('供应商列表数据:', response.data.records);
        setSuppliers(response.data.records);
      } else {
        message.error(response.msg || response.message || '获取供应商列表失败');
      }
    } catch (error) {
      console.error('获取供应商列表失败:', error);
      message.error(getErrorMessage(error, '获取供应商列表失败'));
    }
  };

  // 加载注册证列表
  const loadRegistrationCertificates = async () => {
    try {
      setLoading(true);
      const params = {
        certificateName: searchParams.supplierName || searchParams.productName,
        licenseNumber: searchParams.registrationNumber,
        pageNum: currentPage,
        pageSize: pageSize,
        type: 'REGISTRATION_CERTIFICATE'
      };
      // 使用新的不带供应商ID的资质查询接口，查询所有供应商的资质记录
      const response = await api.get('/api/scm/suppliers/qualifications', params);
      if (response.code === 1 && response.data) {
        const records = Array.isArray(response.data?.records) ? response.data.records : [];
        const totalCount = typeof response.data?.total === 'number' ? response.data.total : records.length;
        const certificateList = records.map(certificate => ({
          key: certificate.id,
          supplierId: certificate.supplierId,
          supplierName: certificate.supplierName || '-',
          registrantName: certificate.registrantName || '-',
          registrantAddress: certificate.address || '-',
          agentName: certificate.agentName || certificate.issuingAuthority || '-',
          productName: certificate.certificateName || '-',
          registrationNumber: certificate.licenseNumber || '-',
          packagingSpec: certificate.packagingSpec || '标准包装',
          effectiveDate: certificate.issueDate,
          expiryDate: certificate.expiryDate,
          attachment: certificate.attachmentName,
          attachmentUrl: certificate.licenseFile,
          status: certificate.status || (certificate.expiryDate && new Date(certificate.expiryDate) < new Date() ? '已过期' : '有效')
        }));
        setRegistrationCertificates(certificateList);
        setTotal(totalCount);
      } else {
        setRegistrationCertificates([]);
        setTotal(0);
        message.error(response.msg || response.message || '加载注册证列表失败');
      }
    } catch (error) {
      setRegistrationCertificates([]);
      setTotal(0);
      message.error(getErrorMessage(error, '加载注册证列表失败'));
    } finally {
      setLoading(false);
    }
  };

  // 组件加载时获取供应商列表
  useEffect(() => {
    loadSuppliers();
  }, []);

  useEffect(() => {
    loadRegistrationCertificates();
  }, [currentPage, pageSize]);

  // 处理搜索输入变化
  const handleSearchChange = (field, value) => {
    setSearchParams(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 处理查询按钮点击
  const handleSearch = () => {
    setCurrentPage(1); // 重置为第一页
    loadRegistrationCertificates();
  };

  // 编辑处理函数
  const handleEdit = (record) => {
    setEditingRecord(record);
    // 设置编辑表单数据
    editForm.setFieldsValue({
      registrantName: record.registrantName,
      productName: record.productName,
      registrationNumber: record.registrationNumber,
      packagingSpec: record.packagingSpec,
      agentName: record.agentName,
      effectiveDate: record.effectiveDate ? dayjs(record.effectiveDate) : null,
      expiryDate: record.expiryDate ? dayjs(record.expiryDate) : null
    });
    // 重置编辑文件列表
    setEditFileList([]);
    setEditVisible(true);
  };

  // 保存编辑
  const handleEditSave = async () => {
    if (submitting) return;
    try {
      setSubmitting(true);
      const values = await editForm.validateFields();
      const uploadedFile = editFileList.length > 0 ? getUploadedFileMeta(editFileList[editFileList.length - 1]) : null;
      
      // 构建注册证数据
      const certificateData = {
        type: 'REGISTRATION_CERTIFICATE',
        certificateName: values.productName,
        licenseNumber: values.registrationNumber,
        licenseType: '注册证',
        issueDate: values.effectiveDate ? values.effectiveDate.format('YYYY-MM-DD') : null,
        expiryDate: values.expiryDate ? values.expiryDate.format('YYYY-MM-DD') : null,
        issuingAuthority: values.agentName || editingRecord?.agentName || '未填写',
        registrantName: values.registrantName || '',
        agentName: values.agentName || '',
        attachmentName: uploadedFile?.attachmentName || editingRecord.attachment || '',
        licenseFile: uploadedFile?.attachmentUrl || editingRecord.attachmentUrl || ''
      };
      
      // 编辑注册证
      const response = await api.put(`/api/scm/suppliers/qualifications/${editingRecord.key}`, certificateData);
      if (response.code === 1) {
        message.success('注册证更新成功');
        await loadRegistrationCertificates();
      } else {
        message.error(response.msg || response.message || '注册证更新失败');
      }
      
      setEditVisible(false);
      setEditingRecord(null);
      editForm.resetFields();
      setEditFileList([]);
    } catch (error) {
      message.error(getErrorMessage(error, '操作失败'));
    } finally {
      setSubmitting(false);
    }
  };

  // 删除处理函数
  const handleDelete = async (key) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这条注册证吗？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          setLoading(true);
          const response = await api.delete(`/api/scm/suppliers/qualifications/${key}`);
          if (response.code === 1) {
            message.success('注册证删除成功');
            await loadRegistrationCertificates();
          } else {
            message.error(response.msg || response.message || '注册证删除失败');
          }
        } catch (error) {
          message.error(getErrorMessage(error, '注册证删除失败'));
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const columns = [
    { 
      title: '供应商名称', 
      dataIndex: 'supplierName', 
      key: 'supplierName',
      width: 260,
      align: 'center',
      ellipsis: true,
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
      title: '注册人名称',
      dataIndex: 'registrantName',
      key: 'registrantName',
      width: 260,
      align: 'center',
      ellipsis: true,
      render: (value) => value || '-',
      onHeaderCell: () => ({
        style: {
          whiteSpace: 'nowrap'
        }
      }),
      onCell: () => ({
        style: {
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }
      })
    },
    {
      title: '注册人住所',
      dataIndex: 'registrantAddress',
      key: 'registrantAddress',
      width: 260,
      align: 'center',
      ellipsis: true,
      render: (value) => value || '-',
      onHeaderCell: () => ({
        style: {
          whiteSpace: 'nowrap'
        }
      }),
      onCell: () => ({
        style: {
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }
      })
    },
    { 
      title: '代理人名称',
      dataIndex: 'agentName',
      key: 'agentName',
      width: 180,
      align: 'center',
      ellipsis: true,
      onHeaderCell: () => ({
        style: {
          whiteSpace: 'nowrap'
        }
      }),
      onCell: () => ({
        style: {
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }
      })
    },
    { 
      title: '产品名称', 
      dataIndex: 'productName', 
      key: 'productName',
      width: 220,
      align: 'center',
      ellipsis: true,
      onHeaderCell: () => ({
        style: {
          whiteSpace: 'nowrap'
        }
      }),
      onCell: () => ({
        style: {
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }
      })
    },
    { 
      title: '注册证编号', 
      dataIndex: 'registrationNumber', 
      key: 'registrationNumber',
      width: 200,
      align: 'center',
      ellipsis: true,
      onHeaderCell: () => ({
        style: {
          whiteSpace: 'nowrap'
        }
      }),
      onCell: () => ({
        style: {
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
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
      }),
      render: (value) => formatDate(value)
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
      }),
      render: (value) => formatDate(value)
    },
    { 
      title: '附件', 
      dataIndex: 'attachment', 
      key: 'attachment',
      width: 120,
      align: 'center',
      ellipsis: true,
      onHeaderCell: () => ({
        style: {
          whiteSpace: 'nowrap'
        }
      }),
      onCell: () => ({
        style: {
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }
      }),
      render: (_, record) => (
        <Button type="link" size="small" onClick={() => {
          setPreviewRecord(record);
          setPreviewVisible(true);
        }} disabled={!record.attachment && !record.attachmentUrl}>
          {record.attachment || record.attachmentUrl ? '查看附件' : '-'}
        </Button>
      )
    },
    { 
      title: '状态', 
      dataIndex: 'status', 
      key: 'status',
      width: 110,
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
          overflow: 'hidden'
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
      width: 170,
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
          overflow: 'hidden'
        }
      }),
      render: (_, record) => (
        <Space size="small" style={{ whiteSpace: 'nowrap' }}>
          <Button type="link" size="small" onClick={() => handleEdit(record)}>
            <EditOutlined />编辑
          </Button>
          <Button type="link" size="small" danger onClick={() => handleDelete(record.key)}>
            <DeleteOutlined />删除
          </Button>
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
    fileList: fileList,
    onChange(info) {
      setFileList(info.fileList);
      if (info.file.status === 'done') {
        message.success('附件上传成功');
      } else if (info.file.status === 'error') {
        message.error('附件上传失败');
      }
    },
  };

  const editUploadProps = {
    name: 'file',
    action: '/api/upload',
    headers: {
      authorization: 'authorization-text',
    },
    fileList: editFileList,
    onChange(info) {
      setEditFileList(info.fileList);
      if (info.file.status === 'done') {
        message.success('附件上传成功');
      } else if (info.file.status === 'error') {
        message.error('附件上传失败');
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
              <span>注册人名称：</span>
              <Input 
                placeholder="请输入注册人名称" 
                style={{ width: 200 }} 
                value={searchParams.supplierName}
                onChange={(e) => handleSearchChange('supplierName', e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>产品名称：</span>
              <Input 
                placeholder="请输入产品名称" 
                style={{ width: 200 }} 
                value={searchParams.productName}
                onChange={(e) => handleSearchChange('productName', e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>注册证编号：</span>
              <Input 
                placeholder="请输入注册证编号" 
                style={{ width: 200 }} 
                value={searchParams.registrationNumber}
                onChange={(e) => handleSearchChange('registrationNumber', e.target.value)}
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>查询</Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => {
              setVisible(true);
              form.resetFields();
              setFileList([]);
            }}>
              新增注册证
            </Button>
          </div>
        </div>
      </Card>
      
      <div style={{ overflowX: 'auto' }}>
        <Table 
          columns={columns} 
          dataSource={registrationCertificates} 
          loading={loading}
          tableLayout="fixed"
          pagination={{ 
            total: total,
            pageSize: pageSize,
            current: currentPage,
            onChange: async (page, size) => {
              setCurrentPage(page);
              setPageSize(size);
              await loadRegistrationCertificates();
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
          scroll={{ x: 1980 }}
        />
      </div>

      <Modal
        title="新增注册证"
        open={visible}
        confirmLoading={submitting}
        onOk={async () => {
          if (submitting) return;
          try {
            setSubmitting(true);
            const values = await form.validateFields();
            const uploadedFile = fileList.length > 0 ? getUploadedFileMeta(fileList[fileList.length - 1]) : null;
            
            // 构建注册证数据
            const certificateData = {
              type: 'REGISTRATION_CERTIFICATE',
              certificateName: values.productName,
              licenseNumber: values.registrationNumber,
              licenseType: '注册证',
              issueDate: values.effectiveDate ? values.effectiveDate.format('YYYY-MM-DD') : null,
              expiryDate: values.expiryDate ? values.expiryDate.format('YYYY-MM-DD') : null,
              issuingAuthority: values.agentName || '未填写',
              registrantName: values.registrantName || '',
              agentName: values.agentName || '',
              attachmentName: uploadedFile?.attachmentName || '',
              licenseFile: uploadedFile?.attachmentUrl || ''
            };
            
            // 新增注册证
            const response = await api.post(`/api/scm/suppliers/${values.supplierId}/qualifications`, certificateData);
            if (response.code === 1) {
              message.success('注册证新增成功');
              await loadRegistrationCertificates();
            } else {
              message.error(response.msg || response.message || '注册证新增失败');
            }
            
            setVisible(false);
            form.resetFields();
            setFileList([]);
          } catch (error) {
            message.error(getErrorMessage(error, '操作失败'));
          } finally {
            setSubmitting(false);
          }
        }}
        onCancel={() => {
          setVisible(false);
          form.resetFields();
          setFileList([]);
        }}
        okText="确定"
        cancelText="取消"
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="supplierId"
            label="供应商名称"
            rules={[{ required: true, message: '请选择供应商名称' }]}
          >
            <Select
              placeholder="请选择已有供应商"
              style={{ width: '100%' }}
              onChange={(value) => {
                const selectedSupplier = suppliers.find((supplier) => supplier.id === value);
                if (selectedSupplier) {
                  form.setFieldsValue({
                    registrantName: selectedSupplier.name || '',
                  });
                }
              }}
            >
              {suppliers.map(supplier => (
                <Select.Option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="registrantName"
            label="注册人名称"
            rules={[{ required: true, message: '请输入注册人名称' }]}
          >
            <Input placeholder="请输入注册人名称" />
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
            name="agentName"
            label="代理人名称"
            rules={[{ required: true, message: '请输入代理人名称' }]}
          >
            <Input placeholder="请输入代理人名称" />
          </Form.Item>
          
          <Form.Item
            name="effectiveDate"
            label="生效日期"
            rules={[{ required: true, message: '请选择生效日期' }]}
          >
            <DatePicker {...datePickerProps} placeholder="请选择生效日期" />
          </Form.Item>
          
          <Form.Item
            name="expiryDate"
            label="失效日期"
            rules={[{ required: true, message: '请选择失效日期' }]}
          >
            <DatePicker {...datePickerProps} placeholder="请选择失效日期" />
          </Form.Item>
          
          <Form.Item
            label="附件"
            rules={[{ required: true, message: '请上传附件' }]}
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
        confirmLoading={submitting}
        onOk={handleEditSave}
        onCancel={() => {
          setEditVisible(false);
          setEditingRecord(null);
          editForm.resetFields();
          setEditFileList([]);
        }}
        okText="保存"
        cancelText="取消"
        width={600}
      >
        <Form form={editForm} layout="vertical">
          <Form.Item
            name="registrantName"
            label="注册人名称"
            rules={[{ required: true, message: '请输入注册人名称' }]}
          >
            <Input placeholder="请输入注册人名称" />
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
            name="agentName"
            label="代理人名称"
            rules={[{ required: true, message: '请输入代理人名称' }]}
          >
            <Input placeholder="请输入代理人名称" />
          </Form.Item>
          
          <Form.Item
            name="effectiveDate"
            label="生效日期"
            rules={[{ required: true, message: '请选择生效日期' }]}
          >
            <DatePicker {...datePickerProps} placeholder="请选择生效日期" />
          </Form.Item>
          
          <Form.Item
            name="expiryDate"
            label="失效日期"
            rules={[{ required: true, message: '请选择失效日期' }]}
          >
            <DatePicker {...datePickerProps} placeholder="请选择失效日期" />
          </Form.Item>
          
          <Form.Item
            label="附件"
          >
            <Upload {...editUploadProps}>
              <Button icon={<UploadOutlined />}>重新上传附件</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="附件预览"
        open={previewVisible}
        onCancel={() => {
          setPreviewVisible(false);
          setPreviewRecord(null);
        }}
        footer={[
          <Button key="download" onClick={() => {
            if (previewRecord?.attachmentUrl) {
              const downloadUrl = `${previewRecord.attachmentUrl}?download=1&filename=${encodeURIComponent(previewRecord.attachment || 'attachment')}`;
              window.open(downloadUrl, '_blank');
            } else {
              message.warning('当前附件暂无可访问地址');
            }
          }}>
            下载附件
          </Button>,
          <Button key="open" onClick={() => {
            if (previewRecord?.attachmentUrl) {
              window.open(previewRecord.attachmentUrl, '_blank');
            } else {
              message.warning('当前附件暂无可访问地址');
            }
          }}>
            查看大图
          </Button>,
          <Button key="close" type="primary" onClick={() => {
            setPreviewVisible(false);
            setPreviewRecord(null);
          }}>
            关闭
          </Button>
        ]}
        width={960}
      >
        {previewRecord?.attachmentUrl ? (
          <iframe
            title="attachment-preview"
            src={previewRecord.attachmentUrl}
            style={{ width: '100%', height: 640, border: 'none' }}
          />
        ) : (
          <div style={{ padding: 32, textAlign: 'center', color: '#8c8c8c' }}>
            当前附件暂无可预览地址，请点击“编辑”后重新上传。
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SupplierInspectionReport;