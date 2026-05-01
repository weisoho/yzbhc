import { useState, useEffect } from 'react';
import { Card, Button, Table, Form, Input, Space, Modal, Upload, DatePicker, message, Select } from 'antd';
import { useParams } from 'react-router-dom';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, UploadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import api, { getApiErrorMessage, getApiResponseMessage } from '../utils/api.js';

const SupplierBusinessLicense = () => {
  const { supplierId } = useParams();
  const [visible, setVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [editFileList, setEditFileList] = useState([]);
  const [businessLicenses, setBusinessLicenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [total, setTotal] = useState(0);
  const [searchParams, setSearchParams] = useState({
    licenseNumber: '',
    supplierName: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [suppliers, setSuppliers] = useState([]);

  const datePickerProps = {
    style: { width: '100%' },
    inputReadOnly: true,
    getPopupContainer: (trigger) => trigger.parentElement || trigger.parentNode,
  };

  // 加载经营许可证列表
  const loadBusinessLicenses = async () => {
    try {
      setLoading(true);
      const params = {
        supplierId: supplierId,
        certificateName: searchParams.supplierName,
        licenseNumber: searchParams.licenseNumber,
        pageNum: currentPage,
        pageSize: pageSize,
        type: 'BUSINESS_LICENSE'
      };
      
      const response = await api.get('/api/scm/suppliers/qualifications', params);
      
      if (response.code === 1 && response.data) {
        const { records, total: totalCount } = response.data;
        if (Array.isArray(records)) {
          const licenseList = records.map(item => ({
            key: item.id,
            licenseNumber: item.licenseNumber,
            name: item.supplierName,
            unifiedSocialCreditCode: item.creditCode,
            legalRepresentative: item.legalRepresentative,
            issuingAuthority: item.issuingAuthority,
            effectiveDate: item.issueDate,
            expiryDate: item.expiryDate,
            attachment: item.attachmentName
          }));
          setBusinessLicenses(licenseList);
          setTotal(totalCount);
        } else {
          setBusinessLicenses([]);
          setTotal(0);
        }
      } else {
        message.error(getApiResponseMessage(response, '加载经营许可证列表失败'));
        setBusinessLicenses([]);
        setTotal(0);
      }
    } catch (error) {
      console.error('加载经营许可证列表失败:', error);
      message.error(getApiErrorMessage(error, '加载经营许可证列表失败'));
      setBusinessLicenses([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  // 组件加载时获取供应商列表和经营许可证列表
  useEffect(() => {
    const loadData = async () => {
      await loadSuppliers();
      await loadBusinessLicenses();
    };
    loadData();
  }, [currentPage, pageSize, supplierId]);

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
    loadBusinessLicenses();
  };

  // 编辑处理函数
  const handleEdit = (record) => {
    setEditingRecord(record);
    // 设置编辑表单数据
    editForm.setFieldsValue({
      licenseNumber: record.licenseNumber,
      name: record.name,
      unifiedSocialCreditCode: record.unifiedSocialCreditCode,
      legalRepresentative: record.legalRepresentative,
      issuingAuthority: record.issuingAuthority,
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
      
      // 构建许可证数据
            const licenseData = {
              type: 'BUSINESS_LICENSE',  // 资质类型
              certificateName: values.name,  // 资质名称
              licenseNumber: values.licenseNumber,  // 证件编号
              licenseType: '经营许可证',  // 证件类别
              issueDate: values.effectiveDate ? values.effectiveDate.format('YYYY-MM-DD') : null,  // 发证日期
              expiryDate: values.expiryDate ? values.expiryDate.format('YYYY-MM-DD') : null,  // 有效期
              issuingAuthority: values.issuingAuthority,  // 发证机构
              legalRepresentative: values.legalRepresentative,  // 法定代表人
              attachmentName: editFileList.length > 0 ? editFileList[editFileList.length - 1].name : editingRecord.attachment,  // 附件名称
              licenseFile: ''  // 附件地址
            };
      
      // 编辑许可证
      // 从选择的供应商名称查找供应商ID
      const selectedSupplier = suppliers.find(s => s.name === values.name);
      if (!selectedSupplier) {
        message.error('未找到选中的供应商信息');
        return;
      }
      // 确保许可证数据中的supplierId正确
      licenseData.supplierId = selectedSupplier.id;
      const response = await api.put(`/api/scm/suppliers/qualifications/${editingRecord.key}`, licenseData);
      if (response.code === 1) {
        message.success('经营许可证更新成功');
        await loadBusinessLicenses();
      } else {
        message.error(getApiResponseMessage(response, '经营许可证更新失败'));
      }
      
      setEditVisible(false);
      setEditingRecord(null);
      editForm.resetFields();
      setEditFileList([]);
    } catch (error) {
      message.error(getApiErrorMessage(error, '操作失败'));
    } finally {
      setSubmitting(false);
    }
  };

  // 删除处理函数
  const handleDelete = async (key) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这条经营许可证吗？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          setLoading(true);
          const response = await api.delete(`/api/scm/suppliers/qualifications/${key}`);
          if (response.code === 1) {
            message.success('经营许可证删除成功');
            await loadBusinessLicenses();
          } else {
            message.error(getApiResponseMessage(response, '经营许可证删除失败'));
          }
        } catch (error) {
          message.error(getApiErrorMessage(error, '经营许可证删除失败'));
        } finally {
          setLoading(false);
        }
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
      dataIndex: 'name', 
      key: 'name',
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
      <h1 style={{ marginBottom: 24 }}>供应商经营许可证</h1>
      
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ whiteSpace: 'nowrap' }}>许可证编号：</span>
              <Input 
                placeholder="请输入许可证编号" 
                style={{ width: 200 }} 
                value={searchParams.licenseNumber}
                onChange={(e) => handleSearchChange('licenseNumber', e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ whiteSpace: 'nowrap' }}>供应商名称：</span>
              <Input 
                placeholder="请输入供应商名称" 
                style={{ width: 200 }} 
                value={searchParams.supplierName}
                onChange={(e) => handleSearchChange('supplierName', e.target.value)}
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>查询</Button>
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
          loading={loading}
          pagination={{ 
            total: total,
            pageSize: pageSize,
            current: currentPage,
            onChange: async (page, size) => {
              setCurrentPage(page);
              setPageSize(size);
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
          scroll={{ x: 1400 }}
        />
      </div>

      <Modal
        title="新增供应商经营许可证"
        open={visible}
        confirmLoading={submitting}
        onOk={async () => {
          if (submitting) return;
          try {
            setSubmitting(true);
            const values = await form.validateFields();
            
            // 构建许可证数据
            const licenseData = {
              type: 'BUSINESS_LICENSE',  // 资质类型
              certificateName: values.name,  // 资质名称
              licenseNumber: values.licenseNumber,  // 证件编号
              licenseType: '经营许可证',  // 证件类别
              issueDate: values.effectiveDate ? values.effectiveDate.format('YYYY-MM-DD') : null,  // 发证日期
              expiryDate: values.expiryDate ? values.expiryDate.format('YYYY-MM-DD') : null,  // 有效期
              issuingAuthority: values.issuingAuthority,  // 发证机构
              legalRepresentative: values.legalRepresentative,  // 法定代表人
              attachmentName: fileList.length > 0 ? fileList[fileList.length - 1].name : '',  // 附件名称
              licenseFile: ''  // 附件地址
            };
            
            // 新增许可证
            // 从选择的供应商名称查找供应商ID
            const selectedSupplier = suppliers.find(s => s.name === values.name);
            if (!selectedSupplier) {
              message.error('未找到选中的供应商信息');
              return;
            }
            const response = await api.post(`/api/scm/suppliers/${selectedSupplier.id}/qualifications`, licenseData);
            if (response.code === 1) {
              message.success('经营许可证新增成功');
              await loadBusinessLicenses();
            } else {
              message.error(getApiResponseMessage(response, '经营许可证新增失败'));
            }
            
            setVisible(false);
            form.resetFields();
            setFileList([]);
          } catch (error) {
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
            label="企业名称"
            rules={[{ required: true, message: '请选择企业名称' }]}
          >
            <Select 
              placeholder="请选择企业名称" 
              style={{ width: '100%' }}
              onChange={(value) => {
                // 查找选择的供应商
                const selectedSupplier = suppliers.find(s => s.name === value);
                if (selectedSupplier) {
                  // 尝试不同的字段名称，确保能够获取到法定代表人
                  const legalRep = selectedSupplier.legalRepresentative || selectedSupplier.legal_representative || '';
                  // 自动填充法定代表人
                  form.setFieldsValue({
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
            name="licenseNumber"
            label="许可证编号"
            rules={[{ required: true, message: '请输入许可证编号' }]}
          >
            <Input placeholder="请输入许可证编号" />
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

      {/* 编辑经营许可证模态框 */}
      <Modal
        title="编辑经营许可证"
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
            label="企业名称"
            rules={[{ required: true, message: '请选择企业名称' }]}
          >
            <Select 
              placeholder="请选择企业名称" 
              style={{ width: '100%' }}
              onChange={(value) => {
                // 查找选择的供应商
                const selectedSupplier = suppliers.find(s => s.name === value);
                if (selectedSupplier) {
                  // 尝试不同的字段名称，确保能够获取到法定代表人
                  const legalRep = selectedSupplier.legalRepresentative || selectedSupplier.legal_representative || '';
                  // 自动填充法定代表人
                  editForm.setFieldsValue({
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
            name="licenseNumber"
            label="许可证编号"
            rules={[{ required: true, message: '请输入许可证编号' }]}
          >
            <Input placeholder="请输入许可证编号" />
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
    </div>
  );
};

export default SupplierBusinessLicense;