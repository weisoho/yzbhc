import { useState, useEffect } from 'react';
import { Card, Button, Table, Form, Input, Space, Modal, Popconfirm, Checkbox, Radio, Row, Col, Select, message, DatePicker } from 'antd';
import dayjs from 'dayjs';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, DownloadOutlined, EyeOutlined } from '@ant-design/icons';
import { FORM_STYLES, getFormLayoutStyle, getModalConfig } from '../utils/formStyles.js';
import api from '../utils/api.js';


const CREDIT_CODE_REGEX = /^[0-9A-Z]{18}$/;
const CONTACT_PHONE_REGEX = /^1[3-9]\d{9}$|^0\d{2,3}-?\d{7,8}$/;
const NUMERIC_AMOUNT_REGEX = /^\d+(\.\d+)?$/;
const CAPITAL_UNIT_OPTIONS = [
  { label: '万人民币', value: '万人民币' },
  { label: '人民币', value: '人民币' },
  { label: '万美元', value: '万美元' },
  { label: '美元', value: '美元' },
];

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



const SupplierMaintenance = () => {
  const [visible, setVisible] = useState(false);
  const [viewVisible, setViewVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [viewingRecord, setViewingRecord] = useState(null);
  const [form] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [total, setTotal] = useState(0);
  const [searchParams, setSearchParams] = useState({
    name: '',
    contactPerson: '',
    legalRepresentative: '',
    phone: '',
    status: ''
  });

  const normalizeCreditCode = (value) => (value ? value.trim().toUpperCase() : value);

  const sanitizeCapitalInput = (value) => {
    const sanitized = (value || '').replace(/[^\d.]/g, '');
    const [integerPart = '', ...decimalParts] = sanitized.split('.');
    return decimalParts.length > 0 ? `${integerPart}.${decimalParts.join('')}` : integerPart;
  };

  const getErrorMessage = (error, fallback) => error?.msg || error?.message || error?.data?.msg || error?.data?.message || fallback;

  const datePickerProps = {
    style: { width: '100%' },
    placeholder: '请选择注册时间',
    inputReadOnly: true,
    getPopupContainer: (trigger) => trigger.parentElement || trigger.parentNode,
  };

  // 加载供应商列表
  const loadSuppliers = async () => {
    try {
      setLoading(true);
      // 构建查询参数
      const params = {
        name: searchParams.name,
        contactPerson: searchParams.contactPerson,
        legalRepresentative: searchParams.legalRepresentative,
        contactPhone: searchParams.phone,
        status: searchParams.status,
        pageNum: currentPage,
        pageSize: pageSize
      };
      console.log('查询参数:', params);
      const response = await api.get('/api/scm/suppliers', params);
      if (response.code === 1 && response.data) {
        // 转换数据格式以匹配前端需求
        const supplierList = response.data.records.map(supplier => ({
          key: supplier.id,
          name: supplier.name,
          supplierCode: supplier.supplierCode,
          enterpriseType: supplier.enterpriseType,
          creditCode: supplier.creditCode,
          legalRepresentative: supplier.legalRepresentative,
          registeredCapital: formatRegisteredCapitalDisplay(supplier.registeredCapital),
          registrationDate: supplier.registrationDate,
          contactPerson: supplier.contactPerson,
          phone: supplier.contactPhone, // 后端返回的是contactPhone，前端期望的是phone
          address: supplier.address,
          status: supplier.status || '不可用',
        }));
        setSuppliers(supplierList);
        setTotal(response.data.total || supplierList.length);
      } else {
        message.error(response.msg || response.message || '加载供应商列表失败');
      }
    } catch (error) {
      console.error('加载供应商列表失败:', error);
      message.error(getErrorMessage(error, '加载供应商列表失败，请检查网络连接或联系管理员'));
    } finally {
      setLoading(false);
    }
  };

  // 组件加载时获取供应商列表
  useEffect(() => {
    loadSuppliers();
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
    loadSuppliers();
  };

  const handleEdit = (record) => {
    const capitalInfo = parseRegisteredCapital(record.registeredCapital);
    setEditingRecord(record);
    form.setFieldsValue({
      name: record.name,
      enterpriseType: record.enterpriseType,
      creditCode: record.creditCode,
      legalRepresentative: record.legalRepresentative,
      registeredCapitalAmount: capitalInfo.amount,
      registeredCapitalUnit: capitalInfo.unit,
      registrationDate: record.registrationDate ? dayjs(record.registrationDate) : null,
      contactPerson: record.contactPerson,
      phone: record.phone,
      address: record.address,
      status: record.status || '不可用'
    });
    setVisible(true);
  };

  const handleModalOk = async () => {
    if (submitting) return;
    try {
      setSubmitting(true);
      const values = await form.validateFields();
      
      // 构建供应商数据
      const supplierData = {
        name: values.name,
        enterpriseType: values.enterpriseType,
        contactPerson: values.contactPerson?.trim(),
        contactPhone: values.phone.trim(),
        address: values.address,
        creditCode: normalizeCreditCode(values.creditCode),
        legalRepresentative: values.legalRepresentative,
        registeredCapital: formatRegisteredCapital(values.registeredCapitalAmount, values.registeredCapitalUnit),
        registrationDate: values.registrationDate ? values.registrationDate.format('YYYY-MM-DD') : null
      };
      
      if (editingRecord) {
        // 编辑供应商
        const response = await api.put(`/api/scm/suppliers/${editingRecord.key}`, supplierData);
        if (response.code === 1) {
          message.success('供应商编辑成功');
          await loadSuppliers();
        } else {
          message.error(response.msg || response.message || '供应商编辑失败');
        }
      } else {
        // 新增供应商
        const response = await api.post('/api/scm/suppliers', supplierData);
        if (response.code === 1) {
          message.success('供应商新增成功');
          await loadSuppliers();
        } else {
          message.error(response.msg || response.message || '供应商新增失败');
        }
      }
      
      setVisible(false);
      setEditingRecord(null);
      form.resetFields();
    } catch (error) {
      console.error('操作失败:', error);
      message.error(getErrorMessage(error, '操作失败，请检查网络连接或联系管理员'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleModalCancel = () => {
    setVisible(false);
    setEditingRecord(null);
    form.resetFields();
  };

  const handleView = async (record) => {
    try {
      setLoading(true);
      // 调用供应商详情接口
      const response = await api.get(`/api/scm/suppliers/${record.key}`);
      if (response.code === 1 && response.data) {
        setViewingRecord({
          ...response.data,
          phone: response.data.contactPhone // 后端返回的是contactPhone，前端期望的是phone
        });
        setViewVisible(true);
      } else {
        message.error(response.msg || response.message || '加载供应商详情失败');
      }
    } catch (error) {
      message.error(getErrorMessage(error, '加载供应商详情失败'));
    } finally {
      setLoading(false);
    }
  };

  const handleViewCancel = () => {
    setViewVisible(false);
    setViewingRecord(null);
  };

  // 处理导出
  const handleExport = async () => {
    if (!selectedRowKeys.length) {
      message.warning('请先勾选要导出的供应商');
      return;
    }

    try {
      setLoading(true);

      // 调用后端按选中主键导出接口
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_API_URL || ''}/api/scm/suppliers/export/selected`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': localStorage.getItem('token') || ''
        },
        body: JSON.stringify({ ids: selectedRowKeys }),
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('导出失败');
      }
      
      // 获取文件名
      const contentDisposition = response.headers.get('content-disposition');
      let filename = '供应商数据.xlsx';
      if (contentDisposition) {
        const utf8FileNameMatch = /filename\*=UTF-8''([^;]+)/i.exec(contentDisposition);
        const normalFileNameMatch = /filename="?([^";]+)"?/i.exec(contentDisposition);
        if (utf8FileNameMatch && utf8FileNameMatch[1]) {
          filename = decodeURIComponent(utf8FileNameMatch[1]);
        } else if (normalFileNameMatch && normalFileNameMatch[1]) {
          filename = decodeURIComponent(normalFileNameMatch[1]);
        }
      }
      
      // 创建下载链接
      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
      
      message.success(`导出成功，共 ${selectedRowKeys.length} 条`);
    } catch (error) {
      console.error('导出失败:', error);
      message.error('导出失败，请检查网络连接或联系管理员');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: <Checkbox 
        indeterminate={selectedRowKeys.length > 0 && selectedRowKeys.length < suppliers.length}
        checked={selectedRowKeys.length === suppliers.length}
        onChange={(e) => {
          if (e.target.checked) {
            setSelectedRowKeys(suppliers.map(item => item.key));
          } else {
            setSelectedRowKeys([]);
          }
        }}
      />,
      dataIndex: 'checkbox',
      key: 'checkbox',
      width: 60,
      render: (_, record) => (
        <Checkbox 
          checked={selectedRowKeys.includes(record.key)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedRowKeys([...selectedRowKeys, record.key]);
            } else {
              setSelectedRowKeys(selectedRowKeys.filter(key => key !== record.key));
            }
          }}
        />
      )
    },
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
      width: 60,
      render: (_, record, index) => (currentPage - 1) * pageSize + index + 1
    },
    { 
      title: '供应商名称', 
      dataIndex: 'name', 
      key: 'name',
      ellipsis: false,
      align: 'center',
      onHeaderCell: () => ({ style: { whiteSpace: 'nowrap' } }),
      onCell: () => ({ style: { whiteSpace: 'nowrap' } })
    },
    { 
      title: '企业类型', 
      dataIndex: 'enterpriseType', 
      key: 'enterpriseType',
      ellipsis: false,
      align: 'center',
      onHeaderCell: () => ({ style: { whiteSpace: 'nowrap' } }),
      onCell: () => ({ style: { whiteSpace: 'nowrap' } })
    },
    { 
      title: '统一社会信用代码', 
      dataIndex: 'creditCode', 
      key: 'creditCode',
      ellipsis: false,
      align: 'center',
      onHeaderCell: () => ({ style: { whiteSpace: 'nowrap' } }),
      onCell: () => ({ style: { whiteSpace: 'nowrap' } })
    },
    { 
      title: '法定代表人', 
      dataIndex: 'legalRepresentative', 
      key: 'legalRepresentative',
      ellipsis: false,
      align: 'center',
      onHeaderCell: () => ({ style: { whiteSpace: 'nowrap' } }),
      onCell: () => ({ style: { whiteSpace: 'nowrap' } })
    },
    { 
      title: '注册资本', 
      dataIndex: 'registeredCapital', 
      key: 'registeredCapital',
      ellipsis: false,
      align: 'center',
      onHeaderCell: () => ({ style: { whiteSpace: 'nowrap' } }),
      onCell: () => ({ style: { whiteSpace: 'nowrap' } })
    },
    { 
      title: '注册时间', 
      dataIndex: 'registrationDate', 
      key: 'registrationDate',
      ellipsis: false,
      align: 'center',
      onHeaderCell: () => ({ style: { whiteSpace: 'nowrap' } }),
      onCell: () => ({ style: { whiteSpace: 'nowrap' } })
    },
    { 
      title: '企业联系人', 
      dataIndex: 'contactPerson', 
      key: 'contactPerson',
      ellipsis: false,
      align: 'center',
      render: (value) => value || '-',
      onHeaderCell: () => ({ style: { whiteSpace: 'nowrap' } }),
      onCell: () => ({ style: { whiteSpace: 'nowrap' } })
    },
    { 
      title: '联系电话', 
      dataIndex: 'phone', 
      key: 'phone',
      ellipsis: false,
      align: 'center',
      onHeaderCell: () => ({ style: { whiteSpace: 'nowrap' } }),
      onCell: () => ({ style: { whiteSpace: 'nowrap' } })
    },
    { 
      title: '联系地址', 
      dataIndex: 'address', 
      key: 'address',
      ellipsis: false,
      align: 'center',
      onHeaderCell: () => ({ style: { whiteSpace: 'nowrap' } }),
      onCell: () => ({ style: { whiteSpace: 'nowrap' } })
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      ellipsis: false,
      align: 'center',
      render: (value) => (
        <span style={{ color: value === '可用' ? '#52c41a' : '#fa8c16', fontWeight: 600 }}>
          {value || '不可用'}
        </span>
      ),
      onHeaderCell: () => ({ style: { whiteSpace: 'nowrap' } }),
      onCell: () => ({ style: { whiteSpace: 'nowrap' } })
    },
    { 
      title: '操作', 
      key: 'action',
      ellipsis: false,
      align: 'center',
      onHeaderCell: () => ({ style: { whiteSpace: 'nowrap' } }),
      onCell: () => ({ style: { whiteSpace: 'nowrap' } }),
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => handleEdit(record)}><EditOutlined />编辑</a>
          <a onClick={() => handleView(record)}><EyeOutlined />详情</a>
          <Popconfirm
            title="确定要删除这个供应商吗？"
            onConfirm={async () => {
              try {
                setLoading(true);
                const response = await api.delete(`/api/scm/suppliers/${record.key}`);
                if (response.code === 1) {
                  message.success('供应商删除成功');
                  await loadSuppliers();
                } else {
                  message.error(response.msg || response.message || '供应商删除失败');
                }
              } catch (error) {
                message.error(getErrorMessage(error, '供应商删除失败'));
              } finally {
                setLoading(false);
              }
            }}
            okText="确定"
            cancelText="取消"
          >
            <a style={{ color: 'red' }}><DeleteOutlined />删除</a>
          </Popconfirm>
        </Space>
      )
    },
  ];

  return (
    <div style={FORM_STYLES.page}>
      <h1 style={FORM_STYLES.title}>供应商管理</h1>
      
      <Card style={FORM_STYLES.card}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
            <Input 
              placeholder="请输入名称" 
              style={{ width: 200 }} 
              value={searchParams.name}
              onChange={(e) => handleSearchChange('name', e.target.value)}
            />
            <Input 
              placeholder="请输入企业联系人" 
              style={{ width: 200 }} 
              value={searchParams.contactPerson}
              onChange={(e) => handleSearchChange('contactPerson', e.target.value)}
            />
            <Input 
              placeholder="请输入法定代表人" 
              style={{ width: 200 }} 
              value={searchParams.legalRepresentative}
              onChange={(e) => handleSearchChange('legalRepresentative', e.target.value)}
            />
            <Input 
              placeholder="请输入联系电话" 
              style={{ width: 200 }} 
              value={searchParams.phone}
              onChange={(e) => handleSearchChange('phone', e.target.value)}
            />
            <Select
              placeholder="请选择状态"
              allowClear
              style={{ width: 160 }}
              value={searchParams.status || undefined}
              onChange={(value) => handleSearchChange('status', value || '')}
              options={[
                { label: '可用', value: '可用' },
                { label: '不可用', value: '不可用' },
              ]}
            />
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>查询</Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => {
              setEditingRecord(null);
              form.resetFields();
              form.setFieldsValue({ registeredCapitalUnit: '万人民币', status: '不可用' });
              setVisible(true);
            }}>
              新增供应商
            </Button>
            <Button 
              type="primary" 
              icon={<DownloadOutlined />}
              onClick={handleExport}
            >
              批量导出
            </Button>
          </div>
        </div>
      </Card>
      
      <div style={{ overflowX: 'auto' }}>
        <Table 
          columns={columns} 
          dataSource={suppliers} 
          loading={loading}
          pagination={{ 
            total,
            pageSize: pageSize,
            current: currentPage,
            onChange: async (page, size) => {
              setCurrentPage(page);
              setPageSize(size);
              setSelectedRowKeys([]);
              await loadSuppliers();
            },
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
            style: FORM_STYLES.table.pagination.style
          }} 
          size={FORM_STYLES.table.size}
          scroll={{ x: 1600 }}
        />
      </div>

      <Modal
        title={editingRecord ? "编辑供应商" : "新建供应商"}
        open={visible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        confirmLoading={submitting}
        okText="保存"
        cancelText="取消"
        {...getModalConfig()}
      >
        <Form 
          form={form} 
          {...getFormLayoutStyle('edit')}
          initialValues={{
            enterpriseType: "经营企业",
            status: '不可用',
            registeredCapitalUnit: '万人民币'
          }}
        >
          <Form.Item
            name="enterpriseType"
            label="企业类型"
            rules={[{ required: true, message: '请选择企业类型' }]}
          >
            <Radio.Group>
              <Radio value="经营企业">经营企业</Radio>
              <Radio value="生产企业">生产企业</Radio>
              <Radio value="医疗机构">医疗机构</Radio>
            </Radio.Group>
          </Form.Item>
          
          <Row gutter={FORM_STYLES.form.edit.rowGutter}>
            <Col span={FORM_STYLES.form.edit.colSpan}>
              <Form.Item
                name="name"
                label="供应商名称"
                rules={[{ required: true, message: '请输入名称' }]}
              >
                <Input placeholder="请输入名称" />
              </Form.Item>
            </Col>
            <Col span={FORM_STYLES.form.edit.colSpan} />
          </Row>

          <Row gutter={FORM_STYLES.form.edit.rowGutter}>
            <Col span={FORM_STYLES.form.edit.colSpan}>
              <Form.Item
                name="contactPerson"
                label="企业联系人"
                rules={[{ required: true, message: '请输入企业联系人' }]}
              >
                <Input placeholder="请输入企业联系人" />
              </Form.Item>
            </Col>
            <Col span={FORM_STYLES.form.edit.colSpan}>
              <Form.Item
                name="creditCode"
                label="统一社会信用代码"
                normalize={normalizeCreditCode}
                rules={[
                  { required: true, message: '请输入统一社会信用代码' },
                  {
                    validator: (_, value) => {
                      if (!value) {
                        return Promise.resolve();
                      }

                      if (!CREDIT_CODE_REGEX.test(normalizeCreditCode(value))) {
                        return Promise.reject(new Error('统一社会信用代码应为18位大写字母或数字'));
                      }

                      return Promise.resolve();
                    }
                  }
                ]}
              >
                <Input placeholder="请输入统一社会信用代码" />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={FORM_STYLES.form.edit.rowGutter}>
            <Col span={FORM_STYLES.form.edit.colSpan}>
              <Form.Item
                name="legalRepresentative"
                label="法定代表人"
                rules={[{ required: true, message: '请输入法定代表人' }]}
              >
                <Input placeholder="请输入法定代表人" />
              </Form.Item>
            </Col>
            <Col span={FORM_STYLES.form.edit.colSpan}>
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
                          if (!value) {
                            return Promise.resolve();
                          }

                          if (!NUMERIC_AMOUNT_REGEX.test(value.trim())) {
                            return Promise.reject(new Error('注册资本金额只能填写数字'));
                          }

                          return Promise.resolve();
                        }
                      }
                    ]}
                  >
                    <Input style={{ width: '58%' }} placeholder="请输入注册资本金额" inputMode="decimal" />
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
            </Col>
          </Row>
          
          <Row gutter={FORM_STYLES.form.edit.rowGutter}>
            <Col span={FORM_STYLES.form.edit.colSpan}>
              <Form.Item
                name="registrationDate"
                label="注册时间"
                rules={[{ required: true, message: '请选择注册时间' }]}
              >
                <DatePicker {...datePickerProps} />
              </Form.Item>
            </Col>
            <Col span={FORM_STYLES.form.edit.colSpan}>
              <Form.Item
                name="phone"
                label="联系电话"
                rules={[
                  { required: true, message: '请输入联系电话' },
                  {
                    validator: (_, value) => {
                      if (!value) {
                        return Promise.resolve();
                      }

                      if (!CONTACT_PHONE_REGEX.test(value.trim())) {
                        return Promise.reject(new Error('请输入11位手机号或区号-座机号码'));
                      }

                      return Promise.resolve();
                    }
                  }
                ]}
              >
                <Input placeholder="请输入联系电话" />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={FORM_STYLES.form.edit.rowGutter}>
            <Col span={FORM_STYLES.form.edit.colSpan}>
              <Form.Item
                name="address"
                label="联系地址"
                rules={[{ required: true, message: '请输入联系地址' }]}
              >
                <Input placeholder="请输入联系地址" />
              </Form.Item>
            </Col>
            <Col span={FORM_STYLES.form.edit.colSpan}>
              <Form.Item
                name="status"
                label="状态"
                extra="供应商状态由系统根据资质有效性自动维护"
              >
                <Select
                  disabled
                  options={[
                    { label: '可用', value: '可用' },
                    { label: '不可用', value: '不可用' },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* 供应商详情模态框 */}
      <Modal
        title="供应商详情"
        open={viewVisible}
        onCancel={handleViewCancel}
        okText="关闭"
        onOk={handleViewCancel}
        {...getModalConfig()}
      >
        {viewingRecord && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Row gutter={FORM_STYLES.form.edit.rowGutter}>
              <Col span={FORM_STYLES.form.edit.colSpan}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 'bold' }}>企业类型：</span>
                  <span>{viewingRecord.enterpriseType}</span>
                </div>
              </Col>
              <Col span={FORM_STYLES.form.edit.colSpan}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 'bold' }}>供应商名称：</span>
                  <span>{viewingRecord.name}</span>
                </div>
              </Col>
            </Row>
            <Row gutter={FORM_STYLES.form.edit.rowGutter}>
              <Col span={FORM_STYLES.form.edit.colSpan}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 'bold' }}>统一社会信用代码：</span>
                  <span>{viewingRecord.creditCode}</span>
                </div>
              </Col>
              <Col span={FORM_STYLES.form.edit.colSpan}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 'bold' }}>法定代表人：</span>
                  <span>{viewingRecord.legalRepresentative}</span>
                </div>
              </Col>
            </Row>
            <Row gutter={FORM_STYLES.form.edit.rowGutter}>
              <Col span={FORM_STYLES.form.edit.colSpan}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 'bold' }}>注册资本：</span>
                  <span>{formatRegisteredCapitalDisplay(viewingRecord.registeredCapital)}</span>
                </div>
              </Col>
              <Col span={FORM_STYLES.form.edit.colSpan}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 'bold' }}>注册时间：</span>
                  <span>{viewingRecord.registrationDate}</span>
                </div>
              </Col>
            </Row>
            <Row gutter={FORM_STYLES.form.edit.rowGutter}>
              <Col span={FORM_STYLES.form.edit.colSpan}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 'bold' }}>联系电话：</span>
                  <span>{viewingRecord.phone || viewingRecord.contactPhone}</span>
                </div>
              </Col>
              <Col span={FORM_STYLES.form.edit.colSpan}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 'bold' }}>联系地址：</span>
                  <span>{viewingRecord.address}</span>
                </div>
              </Col>
            </Row>
            <Row gutter={FORM_STYLES.form.edit.rowGutter}>
              <Col span={FORM_STYLES.form.edit.colSpan}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 'bold' }}>企业联系人：</span>
                  <span>{viewingRecord.contactPerson || '-'}</span>
                </div>
              </Col>
              <Col span={FORM_STYLES.form.edit.colSpan}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 'bold' }}>状态：</span>
                  <span>{viewingRecord.status || '不可用'}</span>
                </div>
              </Col>
            </Row>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SupplierMaintenance;
