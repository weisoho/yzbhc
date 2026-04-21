import { useState, useEffect } from 'react';
import { Card, Button, Table, Form, Input, Space, Modal, Upload, DatePicker, message, Select } from 'antd';
import { useParams } from 'react-router-dom';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, UploadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import api, { getApiErrorMessage, getApiResponseMessage } from '../utils/api';

const sanitizeCapitalInput = (value) => {
  const sanitized = (value || '').replace(/[^\d.]/g, '');
  const [integerPart = '', ...decimalParts] = sanitized.split('.');
  return decimalParts.length > 0 ? `${integerPart}.${decimalParts.join('')}` : integerPart;
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
            name: item.supplierName,
            unifiedSocialCreditCode: item.creditCode,
            legalRepresentative: item.legalRepresentative,
            registeredCapital: item.registeredCapital,
            establishmentDate: item.registrationDate,
            address: item.address,
            registrationAuthority: item.issuingAuthority,
            attachment: item.attachmentName
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
    setEditingRecord(record);
    // 设置编辑表单数据
    editForm.setFieldsValue({
      name: record.name,
      unifiedSocialCreditCode: record.unifiedSocialCreditCode,
      legalRepresentative: record.legalRepresentative,
      registeredCapital: record.registeredCapital,
      establishmentDate: record.establishmentDate ? dayjs(record.establishmentDate) : null,
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
      
      // 从选择的供应商名称查找供应商ID
      const selectedSupplier = suppliers.find(s => s.name === values.name);
      if (!selectedSupplier) {
        message.error('未找到选中的供应商信息');
        return;
      }
      
      // 构建营业执照数据
      const certificateData = {
        type: 'BUSINESS_CERTIFICATE',  // 资质类型
        certificateName: values.name,  // 资质名称
        licenseNumber: values.unifiedSocialCreditCode,  // 证件编号
        licenseType: '营业执照',  // 证件类别
        issueDate: values.establishmentDate ? values.establishmentDate.format('YYYY-MM-DD') : null,  // 发证日期
        expiryDate: '2030-01-01',  // 有效期（默认10年）
        issuingAuthority: values.registrationAuthority,  // 发证机构
        unifiedSocialCreditCode: values.unifiedSocialCreditCode,  // 统一社会信用代码
        legalRepresentative: values.legalRepresentative,  // 法定代表人
        registeredCapital: values.registeredCapital,  // 注册资本
        address: values.address,  // 住所
        supplierId: selectedSupplier.id,  // 供应商ID
        attachmentName: editFileList.length > 0 ? editFileList[editFileList.length - 1].name : editingRecord.attachment,  // 附件名称
        licenseFile: ''  // 附件地址
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
    fileList: fileList,
    onChange(info) {
      setFileList(info.fileList);
      if (info.file.status === 'done') {
        // 文件上传成功
      } else if (info.file.status === 'error') {
        // 文件上传失败
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
            
            // 从选择的供应商名称查找供应商ID
            const selectedSupplier = suppliers.find(s => s.name === values.name);
            if (!selectedSupplier) {
              message.error('未找到选中的供应商信息');
              return;
            }
            
            // 构建营业执照数据
            const certificateData = {
              type: 'BUSINESS_CERTIFICATE',  // 资质类型
              certificateName: values.name,  // 资质名称
              licenseNumber: values.unifiedSocialCreditCode,  // 证件编号
              licenseType: '营业执照',  // 证件类别
              issueDate: values.establishmentDate ? values.establishmentDate.format('YYYY-MM-DD') : null,  // 发证日期
              expiryDate: '2030-01-01',  // 有效期（默认10年）
              issuingAuthority: values.registrationAuthority,  // 发证机构
              unifiedSocialCreditCode: values.unifiedSocialCreditCode,  // 统一社会信用代码
              legalRepresentative: values.legalRepresentative,  // 法定代表人
              registeredCapital: values.registeredCapital,  // 注册资本
              address: values.address,  // 住所
              attachmentName: fileList.length > 0 ? fileList[fileList.length - 1].name : '',  // 附件名称
              licenseFile: ''  // 附件地址
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
          <Form.Item
            name="name"
            label="供应商名称"
            rules={[{ required: true, message: '请选择供应商名称' }]}
          >
            <Select 
              placeholder="请选择供应商名称" 
              style={{ width: '100%' }}
              onChange={(value) => {
                // 查找选择的供应商
                const selectedSupplier = suppliers.find(s => s.name === value);
                if (selectedSupplier) {
                  // 尝试不同的字段名称，确保能够获取到统一社会信用代码
                  const creditCode = selectedSupplier.registrationNumber || selectedSupplier.registration_number || selectedSupplier.creditCode || selectedSupplier.credit_code || '';
                  // 尝试不同的字段名称，确保能够获取到法定代表人
                  const legalRep = selectedSupplier.legalRepresentative || selectedSupplier.legal_representative || '';
                  // 自动填充统一社会信用代码和法定代表人
                  form.setFieldsValue({
                    unifiedSocialCreditCode: creditCode,
                    legalRepresentative: legalRep
                  });
                }
              }}
            >
              {suppliers.map(supplier => (
                <Select.Option key={supplier.id} value={supplier.name}>
                  {supplier.name}
                </Select.Option>
              ))}
            </Select>
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
            getValueFromEvent={(event) => sanitizeCapitalInput(event?.target?.value)}
            rules={[{ required: true, message: '请输入注册资本' }]}
          >
            <Input placeholder="请输入注册资本" />
          </Form.Item>
          
          <Form.Item
            name="establishmentDate"
            label="成立日期"
            rules={[{ required: true, message: '请选择成立日期' }]}
          >
            <DatePicker {...datePickerProps} placeholder="请选择成立日期" />
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
          <Form.Item
            name="name"
            label="供应商名称"
            rules={[{ required: true, message: '请选择供应商名称' }]}
          >
            <Select 
              placeholder="请选择供应商名称" 
              style={{ width: '100%' }}
              onChange={(value) => {
                // 查找选择的供应商
                const selectedSupplier = suppliers.find(s => s.name === value);
                if (selectedSupplier) {
                  // 尝试不同的字段名称，确保能够获取到统一社会信用代码
                  const creditCode = selectedSupplier.registrationNumber || selectedSupplier.registration_number || selectedSupplier.creditCode || selectedSupplier.credit_code || '';
                  // 尝试不同的字段名称，确保能够获取到法定代表人
                  const legalRep = selectedSupplier.legalRepresentative || selectedSupplier.legal_representative || '';
                  // 自动填充统一社会信用代码和法定代表人
                  editForm.setFieldsValue({
                    unifiedSocialCreditCode: creditCode,
                    legalRepresentative: legalRep
                  });
                }
              }}
            >
              {suppliers.map(supplier => (
                <Select.Option key={supplier.id} value={supplier.name}>
                  {supplier.name}
                </Select.Option>
              ))}
            </Select>
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
            getValueFromEvent={(event) => sanitizeCapitalInput(event?.target?.value)}
            rules={[{ required: true, message: '请输入注册资本' }]}
          >
            <Input placeholder="请输入注册资本" />
          </Form.Item>
          
          <Form.Item
            name="establishmentDate"
            label="成立日期"
            rules={[{ required: true, message: '请选择成立日期' }]}
          >
            <DatePicker {...datePickerProps} placeholder="请选择成立日期" />
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
    </div>
  );
};

export default SupplierBusinessCertificate;