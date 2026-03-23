import { useState, useEffect } from 'react';
import { Card, Button, Table, Form, Input, Space, Modal, Upload, DatePicker, message, Select } from 'antd';
import { useParams } from 'react-router-dom';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, UploadOutlined } from '@ant-design/icons';
import moment from 'moment';
import api, { getApiErrorMessage, getApiResponseMessage } from '../utils/api';

const SupplierCertificate = () => {
  const { supplierId } = useParams();
  const [visible, setVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [editFileList, setEditFileList] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [searchParams, setSearchParams] = useState({
    certificateName: '',
    licenseNumber: '',
    supplierName: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [suppliers, setSuppliers] = useState([]);

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

  // 加载注册证列表
  const loadCertificates = async () => {
    try {
      setLoading(true);
      const params = {
        supplierId: supplierId,
        certificateName: searchParams.certificateName,
        licenseNumber: searchParams.licenseNumber,
        pageNum: currentPage,
        pageSize: pageSize,
        type: 'REGISTRATION_CERTIFICATE'  // 添加type参数，查询注册证类型
      };
      
      const response = await api.get('/api/scm/suppliers/qualifications', params);
      
      if (response.code === 1 && response.data) {
        const { records, total: totalCount } = response.data;
        if (Array.isArray(records)) {
          const certificateList = records.map(item => ({
            key: item.id,
            licenseNumber: item.licenseNumber,
            certificateName: item.certificateName,
            supplierName: item.supplierName,
            issuingAuthority: item.issuingAuthority,
            effectiveDate: item.issueDate,
            expiryDate: item.expiryDate,
            attachment: item.attachmentName
          }));
          setCertificates(certificateList);
          setTotal(totalCount);
        } else {
          setCertificates([]);
          setTotal(0);
        }
      } else {
        message.error(getApiResponseMessage(response, '加载注册证列表失败'));
        setCertificates([]);
        setTotal(0);
      }
    } catch (error) {
      console.error('加载注册证列表失败:', error);
      message.error(getApiErrorMessage(error, '加载注册证列表失败'));
      setCertificates([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await loadSuppliers();
      await loadCertificates();
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
    setCurrentPage(1);
    loadCertificates();
  };

  // 编辑处理函数
  const handleEdit = (record) => {
    setEditingRecord(record);
    editForm.setFieldsValue({
      licenseNumber: record.licenseNumber,
      certificateName: record.certificateName,
      supplierName: record.supplierName,
      issuingAuthority: record.issuingAuthority,
      effectiveDate: record.effectiveDate ? moment(record.effectiveDate) : null,
      expiryDate: record.expiryDate ? moment(record.expiryDate) : null
    });
    setEditFileList([]);
    setEditVisible(true);
  };

  // 保存编辑
  const handleEditSave = async () => {
    try {
      setLoading(true);
      const values = await editForm.validateFields();
      
      const selectedSupplier = suppliers.find(s => s.name === values.supplierName);
      if (!selectedSupplier) {
        message.error('未找到选中的供应商信息');
        return;
      }
      
      const certificateData = {
        type: 'REGISTRATION_CERTIFICATE',
        certificateName: values.certificateName,
        licenseNumber: values.licenseNumber,
        licenseType: '注册证',
        issueDate: values.effectiveDate ? values.effectiveDate.format('YYYY-MM-DD') : null,
        expiryDate: values.expiryDate ? values.expiryDate.format('YYYY-MM-DD') : null,
        issuingAuthority: values.issuingAuthority,
        supplierId: selectedSupplier.id,
        attachmentName: editFileList.length > 0 ? editFileList[editFileList.length - 1].name : editingRecord.attachment,
        licenseFile: ''
      };
      
      const response = await api.put(`/api/scm/suppliers/qualifications/${editingRecord.key}`, certificateData);
      if (response.code === 1) {
        message.success('注册证更新成功');
        await loadCertificates();
      } else {
        message.error(getApiResponseMessage(response, '注册证更新失败'));
      }
      
      setEditVisible(false);
      setEditingRecord(null);
      editForm.resetFields();
      setEditFileList([]);
    } catch (error) {
      message.error(getApiErrorMessage(error, '操作失败'));
    } finally {
      setLoading(false);
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
            await loadCertificates();
          } else {
            message.error(getApiResponseMessage(response, '注册证删除失败'));
          }
        } catch (error) {
          message.error(getApiErrorMessage(error, '注册证删除失败'));
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const columns = [
    { title: '注册证编号', dataIndex: 'licenseNumber', key: 'licenseNumber', width: 150, align: 'center' },
    { title: '产品名称', dataIndex: 'certificateName', key: 'certificateName', width: 200, align: 'center' },
    { title: '供应商名称', dataIndex: 'supplierName', key: 'supplierName', width: 200, align: 'center' },
    { title: '发证部门', dataIndex: 'issuingAuthority', key: 'issuingAuthority', width: 150, align: 'center' },
    { title: '生效日期', dataIndex: 'effectiveDate', key: 'effectiveDate', width: 120, align: 'center' },
    { title: '失效日期', dataIndex: 'expiryDate', key: 'expiryDate', width: 120, align: 'center' },
    { title: '附件', dataIndex: 'attachment', key: 'attachment', width: 150, align: 'center' },
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
    fileList: fileList,
    onChange(info) {
      setFileList(info.fileList);
    },
  };

  const editUploadProps = {
    name: 'file',
    action: '/api/upload',
    fileList: editFileList,
    onChange(info) {
      setEditFileList(info.fileList);
    },
  };

  return (
    <div style={{ padding: '0 16px' }}>
      <h1 style={{ marginBottom: 24 }}>供应商注册证</h1>
      
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ whiteSpace: 'nowrap' }}>注册证编号：</span>
              <Input 
                placeholder="请输入注册证编号" 
                style={{ width: 200 }} 
                value={searchParams.licenseNumber}
                onChange={(e) => handleSearchChange('licenseNumber', e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ whiteSpace: 'nowrap' }}>产品名称：</span>
              <Input 
                placeholder="请输入产品名称" 
                style={{ width: 200 }} 
                value={searchParams.certificateName}
                onChange={(e) => handleSearchChange('certificateName', e.target.value)}
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
              新增注册证
            </Button>
          </div>
        </div>
      </Card>
      
      <Table 
        columns={columns} 
        dataSource={certificates} 
        loading={loading}
        pagination={{ 
          total: total,
          pageSize: pageSize,
          current: currentPage,
          onChange: (page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          },
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条记录`,
        }} 
        scroll={{ x: 1300 }}
      />

      <Modal
        title="新增注册证"
        open={visible}
        onOk={async () => {
          try {
            setLoading(true);
            const values = await form.validateFields();
            const selectedSupplier = suppliers.find(s => s.name === values.supplierName);
            if (!selectedSupplier) {
              message.error('未找到选中的供应商信息');
              return;
            }
            
            const certificateData = {
              type: 'REGISTRATION_CERTIFICATE',
              certificateName: values.certificateName,
              licenseNumber: values.licenseNumber,
              licenseType: '注册证',
              issueDate: values.effectiveDate ? values.effectiveDate.format('YYYY-MM-DD') : null,
              expiryDate: values.expiryDate ? values.expiryDate.format('YYYY-MM-DD') : null,
              issuingAuthority: values.issuingAuthority,
              supplierId: selectedSupplier.id,
              attachmentName: fileList.length > 0 ? fileList[fileList.length - 1].name : '',
              licenseFile: ''
            };
            
            const response = await api.post(`/api/scm/suppliers/${selectedSupplier.id}/qualifications`, certificateData);
            if (response.code === 1) {
              message.success('注册证新增成功');
              await loadCertificates();
            } else {
              message.error(getApiResponseMessage(response, '注册证新增失败'));
            }
            setVisible(false);
            form.resetFields();
            setFileList([]);
          } catch (error) {
            message.error(getApiErrorMessage(error, '操作失败'));
          } finally {
            setLoading(false);
          }
        }}
        onCancel={() => { setVisible(false); form.resetFields(); setFileList([]); }}
        okText="确定"
        cancelText="取消"
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="licenseNumber" label="注册证编号" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="certificateName" label="产品名称" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="supplierName" label="供应商名称" rules={[{ required: true }]}>
            <Select placeholder="请选择供应商">
              {suppliers.map(s => <Select.Option key={s.id} value={s.name}>{s.name}</Select.Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="issuingAuthority" label="发证部门" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="effectiveDate" label="生效日期" rules={[{ required: true }]}><DatePicker style={{ width: '100%' }} /></Form.Item>
          <Form.Item name="expiryDate" label="失效日期" rules={[{ required: true }]}><DatePicker style={{ width: '100%' }} /></Form.Item>
          <Form.Item label="附件"><Upload {...uploadProps}><Button icon={<UploadOutlined />}>上传附件</Button></Upload></Form.Item>
        </Form>
      </Modal>

      <Modal
        title="编辑注册证"
        open={editVisible}
        onOk={handleEditSave}
        onCancel={() => { setEditVisible(false); editForm.resetFields(); setEditFileList([]); }}
        okText="保存"
        cancelText="取消"
        width={600}
      >
        <Form form={editForm} layout="vertical">
          <Form.Item name="licenseNumber" label="注册证编号" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="certificateName" label="产品名称" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="supplierName" label="供应商名称" rules={[{ required: true }]}>
            <Select placeholder="请选择供应商">
              {suppliers.map(s => <Select.Option key={s.id} value={s.name}>{s.name}</Select.Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="issuingAuthority" label="发证部门" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="effectiveDate" label="生效日期" rules={[{ required: true }]}><DatePicker style={{ width: '100%' }} /></Form.Item>
          <Form.Item name="expiryDate" label="失效日期" rules={[{ required: true }]}><DatePicker style={{ width: '100%' }} /></Form.Item>
          <Form.Item label="附件"><Upload {...editUploadProps}><Button icon={<UploadOutlined />}>重新上传附件</Button></Upload></Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SupplierCertificate;
