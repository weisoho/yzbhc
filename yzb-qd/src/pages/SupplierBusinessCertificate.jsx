import { useState, useEffect } from 'react';
import { Card, Button, Table, Form, Input, Space, Modal, Upload, DatePicker, message, Select, Tag } from 'antd';
import { useParams } from 'react-router-dom';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, UploadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import api, { getApiErrorMessage, getApiResponseMessage } from '../utils/api.js';

const getUploadedFileMeta = (file) => {
  const payload = file?.response?.data;
  return {
    attachmentName: payload?.originalName || file?.name || '',
    attachmentUrl: payload?.url || file?.url || '',
  };
};

const sanitizeCapitalInput = (value) => {
  const sanitized = (value || '').replace(/[^\d.]/g, '');
  const [integerPart = '', ...decimalParts] = sanitized.split('.');
  return decimalParts.length > 0 ? `${integerPart}.${decimalParts.join('')}` : integerPart;
};
const NUMERIC_AMOUNT_REGEX = /^\d+(\.\d+)?$/;
const CAPITAL_UNIT_OPTIONS = [
  { label: '万人民币', value: '万人民币' },
  { label: '人民币', value: '人民币' },
  { label: '万美元', value: '万美元' },
  { label: '美元', value: '美元' },
];

const renderStatusTag = (value) => {
  const text = value || '-';
  const color = text === '有效' ? 'success' : text === '即将过期' ? 'warning' : text === '已过期' ? 'error' : 'default';
  return <Tag color={color}>{text}</Tag>;
};

const parseRegisteredCapital = (value) => {
  const normalized = String(value || '').trim();
  if (!normalized) {
    return { amount: '', unit: '万人民币' };
  }

  const matchedUnit = CAPITAL_UNIT_OPTIONS
    .map((item) => item.value)
    .sort((a, b) => b.length - a.length)
    .find((unit) => normalized.endsWith(unit));

  if (matchedUnit) {
    return {
      amount: normalized.slice(0, -matchedUnit.length).trim(),
      unit: matchedUnit,
    };
  }

  if (NUMERIC_AMOUNT_REGEX.test(normalized)) {
    return { amount: normalized, unit: '万人民币' };
  }

  return { amount: normalized, unit: '万人民币' };
};

const formatRegisteredCapital = (amount, unit) => {
  const normalizedAmount = String(amount || '').trim();
  if (!normalizedAmount) {
    return '';
  }
  return `${normalizedAmount}${unit || ''}`;
};

const formatRegisteredCapitalDisplay = (value) => {
  const normalized = String(value || '').trim();
  if (!normalized) {
    return '-';
  }
  return NUMERIC_AMOUNT_REGEX.test(normalized) ? `${normalized}万人民币` : normalized;
};

const SupplierBusinessCertificate = () => {
  const { supplierId } = useParams();
  const [visible, setVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [editFileList, setEditFileList] = useState([]);
  const [businessCertificates, setBusinessCertificates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [total, setTotal] = useState(0);
  const [searchParams, setSearchParams] = useState({
    supplierName: '',
    unifiedSocialCreditCode: '',
    legalRepresentative: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [suppliers, setSuppliers] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewRecord, setPreviewRecord] = useState(null);

  const formatDate = (value) => {
    if (!value) {
      return '--';
    }
    const parsed = dayjs(value);
    return parsed.isValid() ? parsed.format('YYYY-MM-DD') : '--';
  };

  const datePickerProps = {
    style: { width: '100%' },
    inputReadOnly: true,
    getPopupContainer: (trigger) => trigger.parentElement || trigger.parentNode,
  };

  // 加载供应商列表
  const loadSuppliers = async () => {
    try {
      const response = await api.get('/api/scm/suppliers');
      if (response.code === 1 && response.data) {
        setSuppliers(response.data.records);
      }
    } catch (error) {
      console.error('获取供应商列表失败:', error);
    }
  };

  // 加载营业执照列表
  const loadBusinessCertificates = async () => {
    try {
      setLoading(true);
      const params = {
        supplierId: supplierId,
        certificateName: searchParams.supplierName,
        creditCode: searchParams.unifiedSocialCreditCode,
        legalRepresentative: searchParams.legalRepresentative,
        pageNum: currentPage,
        pageSize: pageSize,
        type: 'BUSINESS_CERTIFICATE'  // 添加type参数，查询营业执照类型
      };
      
      const response = await api.get('/api/scm/suppliers/qualifications', params);
      if (response.code === 1 && response.data) {
        const { records, total: totalCount } = response.data;
        if (Array.isArray(records)) {
          const certificateList = records.map(item => ({
            key: item.id,
            supplierId: item.supplierId,
            name: item.supplierName,
            unifiedSocialCreditCode: item.creditCode,
            legalRepresentative: item.legalRepresentative,
            registeredCapital: item.registeredCapital,
            establishmentDate: item.registrationDate,
            expiryDate: item.expiryDate,
            address: item.address,
            registrationAuthority: item.issuingAuthority,
            attachment: item.attachmentName,
            attachmentUrl: item.licenseFile,
            status: item.status,
          }));
          setBusinessCertificates(certificateList);
          setTotal(totalCount);
        } else {
          setBusinessCertificates([]);
          setTotal(0);
        }
      } else {
        message.error(getApiResponseMessage(response, '加载营业执照列表失败'));
        setBusinessCertificates([]);
        setTotal(0);
      }
    } catch (error) {
      console.error('加载营业执照列表失败:', error);
      message.error(getApiErrorMessage(error, '加载营业执照列表失败'));
      setBusinessCertificates([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  // 组件加载时获取供应商列表和营业执照列表
  useEffect(() => {
    const loadData = async () => {
      await loadSuppliers();
      await loadBusinessCertificates();
    };
    loadData();
  }, [currentPage, pageSize, supplierId]);

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
    loadBusinessCertificates();
  };

  // 编辑处理函数
  const handleEdit = (record) => {
    const capitalInfo = parseRegisteredCapital(record.registeredCapital);
    setEditingRecord(record);
    // 设置编辑表单数据
    editForm.setFieldsValue({
      supplierId: record.supplierId,
      name: record.name,
      unifiedSocialCreditCode: record.unifiedSocialCreditCode,
      legalRepresentative: record.legalRepresentative,
      registeredCapitalAmount: capitalInfo.amount,
      registeredCapitalUnit: capitalInfo.unit,
      establishmentDate: record.establishmentDate ? dayjs(record.establishmentDate) : null,
      expiryDate: record.expiryDate ? dayjs(record.expiryDate) : dayjs('2099-12-31'),
      address: record.address,
      registrationAuthority: record.registrationAuthority
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
      
      // 从选择的供应商名称查找供应商ID
      const selectedSupplier = suppliers.find(s => s.id === values.supplierId);
      if (!selectedSupplier) {
        message.error('未找到选中的供应商信息');
        return;
      }
      
      // 构建营业执照数据
      const certificateData = {
        type: 'BUSINESS_CERTIFICATE',
        certificateName: selectedSupplier.name,
        licenseNumber: values.unifiedSocialCreditCode,
        licenseType: '营业执照',
        issueDate: values.establishmentDate ? values.establishmentDate.format('YYYY-MM-DD') : null,
        expiryDate: values.expiryDate ? values.expiryDate.format('YYYY-MM-DD') : '2099-12-31',
        issuingAuthority: values.registrationAuthority,
        legalRepresentative: values.legalRepresentative,
        registeredCapital: formatRegisteredCapital(values.registeredCapitalAmount, values.registeredCapitalUnit),
        address: values.address,
        creditCode: values.unifiedSocialCreditCode,
        supplierId: selectedSupplier.id,
        attachmentName: uploadedFile?.attachmentName || editingRecord.attachment || '',
        licenseFile: uploadedFile?.attachmentUrl || editingRecord.attachmentUrl || ''
      };
      
      // 编辑营业执照
      const response = await api.put(`/api/scm/suppliers/qualifications/${editingRecord.key}`, certificateData);
      if (response.code === 1) {
        message.success('营业执照更新成功');
        await loadBusinessCertificates();
      } else {
        message.error(getApiResponseMessage(response, '营业执照更新失败'));
      }
      
      setEditVisible(false);
      setEditingRecord(null);
      editForm.resetFields();
      setEditFileList([]);
    } catch (error) {
      console.error('编辑营业执照失败:', error);
      message.error(getApiErrorMessage(error, '操作失败'));
    } finally {
      setSubmitting(false);
    }
  };

  // 删除处理函数
  const handleDelete = async (key) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这条营业执照吗？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          setLoading(true);
          const response = await api.delete(`/api/scm/suppliers/qualifications/${key}`);
          if (response.code === 1) {
            message.success('营业执照删除成功');
            await loadBusinessCertificates();
          } else {
            message.error(getApiResponseMessage(response, '营业执照删除失败'));
          }
        } catch (error) {
          message.error(getApiErrorMessage(error, '营业执照删除失败'));
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const columns = [
    { 
      title: '供应商名称', 
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
      width: 160,
      align: 'center',
      ellipsis: false,
      render: (value) => formatRegisteredCapitalDisplay(value),
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
      }),
      render: (value) => formatDate(value)
    },
    {
      title: '失效日期',
      dataIndex: 'expiryDate',
      key: 'expiryDate',
      width: 120,
      align: 'center',
      render: (value) => formatDate(value),
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
      width: 280,
      align: 'center',
      ellipsis: false,
      onHeaderCell: () => ({
        style: {
          whiteSpace: 'nowrap'
        }
      }),
      onCell: () => ({
        style: {
          whiteSpace: 'normal',
          wordBreak: 'break-all',
          lineHeight: 1.5
        }
      })
    },
    { 
      title: '登记机关', 
      dataIndex: 'registrationAuthority', 
      key: 'registrationAuthority',
      width: 180,
      align: 'center',
      ellipsis: false,
      onHeaderCell: () => ({
        style: {
          whiteSpace: 'nowrap'
        }
      }),
      onCell: () => ({
        style: {
          whiteSpace: 'normal',
          wordBreak: 'break-all',
          lineHeight: 1.5
        }
      })
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      align: 'center',
      render: (value) => renderStatusTag(value),
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
        <Button
          type="link"
          size="small"
          disabled={!record.attachment && !record.attachmentUrl}
          onClick={() => {
            setPreviewRecord(record);
            setPreviewVisible(true);
          }}
        >
          {record.attachment || record.attachmentUrl ? '查看附件' : '-'}
        </Button>
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
      <h1 style={{ marginBottom: 24 }}>供应商营业执照</h1>
      
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ whiteSpace: 'nowrap' }}>供应商名称：</span>
              <Input 
                placeholder="请输入供应商名称" 
                style={{ width: 200 }} 
                value={searchParams.supplierName}
                onChange={(e) => handleSearchChange('supplierName', e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ whiteSpace: 'nowrap' }}>统一社会信用代码：</span>
              <Input 
                placeholder="请输入统一社会信用代码" 
                style={{ width: 200 }} 
                value={searchParams.unifiedSocialCreditCode}
                onChange={(e) => handleSearchChange('unifiedSocialCreditCode', e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ whiteSpace: 'nowrap' }}>法定代表人：</span>
              <Input 
                placeholder="请输入法定代表人" 
                style={{ width: 200 }} 
                value={searchParams.legalRepresentative}
                onChange={(e) => handleSearchChange('legalRepresentative', e.target.value)}
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>查询</Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                form.resetFields();
                form.setFieldsValue({
                  registeredCapitalUnit: '万人民币',
                  expiryDate: dayjs('2099-12-31')
                });
                setVisible(true);
              }}
            >
              新增营业执照
            </Button>
          </div>
        </div>
      </Card>
      
      <div style={{ overflowX: 'auto' }}>
        <Table 
          columns={columns} 
          dataSource={businessCertificates} 
          loading={loading}
          pagination={{ 
            total: total,
            pageSize: pageSize,
            current: currentPage,
            onChange: async (page, size) => {
              setCurrentPage(page);
              setPageSize(size);
              // 注意：loadBusinessCertificates 依赖于 currentPage 和 pageSize
              // 在 useEffect 中已经处理了加载逻辑
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
          scroll={{ x: 1600 }}
        />
      </div>

      <Modal
        title="新增营业执照"
        open={visible}
        confirmLoading={submitting}
        onOk={async () => {
          if (submitting) return;
          try {
            setSubmitting(true);
            const values = await form.validateFields();
            const uploadedFile = fileList.length > 0 ? getUploadedFileMeta(fileList[fileList.length - 1]) : null;
            
            const selectedSupplier = suppliers.find(s => s.id === values.supplierId);
            if (!selectedSupplier) {
              message.error('未找到选中的供应商信息');
              return;
            }
            
            // 构建营业执照数据
            const certificateData = {
              type: 'BUSINESS_CERTIFICATE',
              certificateName: selectedSupplier.name,
              licenseNumber: values.unifiedSocialCreditCode,
              licenseType: '营业执照',
              issueDate: values.establishmentDate ? values.establishmentDate.format('YYYY-MM-DD') : null,
              expiryDate: values.expiryDate ? values.expiryDate.format('YYYY-MM-DD') : '2099-12-31',
              issuingAuthority: values.registrationAuthority,
              legalRepresentative: values.legalRepresentative,
              registeredCapital: values.registeredCapital,
              address: values.address,
              attachmentName: uploadedFile?.attachmentName || '',
              licenseFile: uploadedFile?.attachmentUrl || ''
            };
            
            // 新增营业执照
            const targetSupplierId = selectedSupplier.id;
            const response = await api.post(`/api/scm/suppliers/${targetSupplierId}/qualifications`, certificateData);
            if (response.code === 1) {
              message.success('营业执照新增成功');
              await loadBusinessCertificates();
            } else {
              message.error(getApiResponseMessage(response, '营业执照新增失败'));
            }
            
            setVisible(false);
            form.resetFields();
            setFileList([]);
          } catch (error) {
            console.error('新增营业执照失败:', error);
            message.error(getApiErrorMessage(error, '操作失败'));
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
          <Form.Item name="name" hidden>
            <Input />
          </Form.Item>
          <Form.Item
            name="supplierId"
            label="供应商名称"
            rules={[{ required: true, message: '请选择供应商名称' }]}
          >
            <Select 
              placeholder="请选择供应商名称" 
              style={{ width: '100%' }}
              onChange={(value) => {
                const selectedSupplier = suppliers.find(s => s.id === value);
                if (selectedSupplier) {
                  const capitalInfo = parseRegisteredCapital(selectedSupplier.registeredCapital);
                  form.setFieldsValue({
                    name: selectedSupplier.name,
                    unifiedSocialCreditCode: selectedSupplier.creditCode || '',
                    legalRepresentative: selectedSupplier.legalRepresentative || '',
                    registeredCapitalAmount: capitalInfo.amount,
                    registeredCapitalUnit: capitalInfo.unit,
                    address: selectedSupplier.address || ''
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

          <Form.Item name="name" label="企业名称">
            <Input placeholder="自动带出" disabled />
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
          
          <Form.Item label="注册资本" required>
            <Input.Group compact>
              <Form.Item
                name="registeredCapitalAmount"
                noStyle
                getValueFromEvent={(event) => sanitizeCapitalInput(event?.target?.value)}
                rules={[
                  { required: true, message: '请输入注册资本金额' },
                  {
                    validator: (_, value) => {
                      if (!value || NUMERIC_AMOUNT_REGEX.test(String(value).trim())) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('注册资本金额只能填写数字'));
                    }
                  }
                ]}
              >
                <Input style={{ width: '58%' }} placeholder="请输入注册资本金额" />
              </Form.Item>
              <Form.Item
                name="registeredCapitalUnit"
                noStyle
                initialValue="万人民币"
                rules={[{ required: true, message: '请选择币种单位' }]}
              >
                <Select style={{ width: '42%' }} options={CAPITAL_UNIT_OPTIONS} />
              </Form.Item>
            </Input.Group>
          </Form.Item>
          
          <Form.Item
            name="establishmentDate"
            label="成立日期"
            rules={[{ required: true, message: '请选择成立日期' }]}
          >
            <DatePicker {...datePickerProps} placeholder="请选择成立日期" />
          </Form.Item>

          <Form.Item
            name="expiryDate"
            label="失效日期"
            initialValue={dayjs('2099-12-31')}
            rules={[{ required: true, message: '请选择失效日期' }]}
          >
            <DatePicker {...datePickerProps} placeholder="请选择失效日期" />
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
            label="附件"
            rules={[{ required: true, message: '请上传附件' }]}
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
          <Form.Item name="name" hidden>
            <Input />
          </Form.Item>
          <Form.Item
            name="supplierId"
            label="供应商名称"
            rules={[{ required: true, message: '请选择供应商名称' }]}
          >
            <Select 
              placeholder="请选择供应商名称" 
              disabled
              style={{ width: '100%' }}
              onChange={(value) => {
                const selectedSupplier = suppliers.find(s => s.id === value);
                if (selectedSupplier) {
                  const capitalInfo = parseRegisteredCapital(selectedSupplier.registeredCapital);
                  editForm.setFieldsValue({
                    name: selectedSupplier.name,
                    unifiedSocialCreditCode: selectedSupplier.creditCode || '',
                    legalRepresentative: selectedSupplier.legalRepresentative || '',
                    registeredCapitalAmount: capitalInfo.amount,
                    registeredCapitalUnit: capitalInfo.unit,
                    address: selectedSupplier.address || ''
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

          <Form.Item name="name" label="企业名称">
            <Input placeholder="自动带出" disabled />
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
          
          <Form.Item label="注册资本" required>
            <Input.Group compact>
              <Form.Item
                name="registeredCapitalAmount"
                noStyle
                getValueFromEvent={(event) => sanitizeCapitalInput(event?.target?.value)}
                rules={[
                  { required: true, message: '请输入注册资本金额' },
                  {
                    validator: (_, value) => {
                      if (!value || NUMERIC_AMOUNT_REGEX.test(String(value).trim())) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('注册资本金额只能填写数字'));
                    }
                  }
                ]}
              >
                <Input style={{ width: '58%' }} placeholder="请输入注册资本金额" />
              </Form.Item>
              <Form.Item
                name="registeredCapitalUnit"
                noStyle
                rules={[{ required: true, message: '请选择币种单位' }]}
              >
                <Select style={{ width: '42%' }} options={CAPITAL_UNIT_OPTIONS} />
              </Form.Item>
            </Input.Group>
          </Form.Item>
          
          <Form.Item
            name="establishmentDate"
            label="成立日期"
            rules={[{ required: true, message: '请选择成立日期' }]}
          >
            <DatePicker {...datePickerProps} placeholder="请选择成立日期" />
          </Form.Item>

          <Form.Item
            name="expiryDate"
            label="失效日期"
            rules={[{ required: true, message: '请选择失效日期' }]}
          >
            <DatePicker {...datePickerProps} placeholder="请选择失效日期" />
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
            查看附件
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
            title="business-certificate-attachment-preview"
            src={previewRecord.attachmentUrl}
            style={{ width: '100%', height: 640, border: 'none' }}
          />
        ) : (
          <div style={{ padding: 32, textAlign: 'center', color: '#8c8c8c' }}>
            当前附件暂无可预览地址，请重新上传。
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SupplierBusinessCertificate;
