import { useState } from 'react';
import { Card, Button, Table, Form, Input, Space, Modal, Upload, DatePicker, Select, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, UploadOutlined } from '@ant-design/icons';
import moment from 'moment';

const SupplierInspectionReport = () => {
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

  const [inspectionReports, setInspectionReports] = useState([
    { 
      key: '1', 
      supplierName: '供应商A', 
      productName: '一次性输液器', 
      reportNumber: 'IR2024001',
      inspectionDate: '2024-01-15',
      expiryDate: '2025-01-15',
      status: '有效',
      reportFile: '检验报告_供应商A_20240115.pdf',
      remark: ''
    },
    { 
      key: '2', 
      supplierName: '供应商B', 
      productName: '医用纱布', 
      reportNumber: 'IR2024002',
      inspectionDate: '2024-02-20',
      expiryDate: '2025-02-20',
      status: '有效',
      reportFile: '检验报告_供应商B_20240220.pdf',
      remark: ''
    },
    { 
      key: '3', 
      supplierName: '供应商C', 
      productName: '医用手套', 
      reportNumber: 'IR2024003',
      inspectionDate: '2023-12-10',
      expiryDate: '2024-12-10',
      status: '已过期',
      reportFile: '检验报告_供应商C_20231210.pdf',
      remark: ''
    },
  ]);

  // 编辑处理函数
  const handleEdit = (record) => {
    setEditingRecord(record);
    editForm.setFieldsValue({
      productName: record.productName,
      reportNumber: record.reportNumber,
      inspectionDate: record.inspectionDate ? moment(record.inspectionDate) : null,
      expiryDate: record.expiryDate ? moment(record.expiryDate) : null,
      remark: record.remark || ''
    });
    setEditVisible(true);
  };

  // 保存编辑
  const handleEditSave = () => {
    editForm.validateFields().then(values => {
      const updatedReports = inspectionReports.map(report => {
        if (report.key === editingRecord.key) {
          return {
            ...report,
            productName: values.productName,
            reportNumber: values.reportNumber,
            inspectionDate: values.inspectionDate ? values.inspectionDate.format('YYYY-MM-DD') : '',
            expiryDate: values.expiryDate ? values.expiryDate.format('YYYY-MM-DD') : '',
            remark: values.remark || ''
          };
        }
        return report;
      });
      
      setInspectionReports(updatedReports);
      setEditVisible(false);
      setEditingRecord(null);
      editForm.resetFields();
      message.success('检验报告更新成功');
    });
  };

  // 删除处理函数
  const handleDelete = (key) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这条检验报告吗？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        const updatedReports = inspectionReports.filter(report => report.key !== key);
        setInspectionReports(updatedReports);
        message.success('检验报告删除成功');
      }
    });
  };

  const columns = [
    { 
      title: '供应商名称', 
      dataIndex: 'supplierName', 
      key: 'supplierName',
      width: 150
    },
    { 
      title: '产品名称', 
      dataIndex: 'productName', 
      key: 'productName',
      width: 150
    },
    { 
      title: '报告编号', 
      dataIndex: 'reportNumber', 
      key: 'reportNumber',
      width: 120
    },
    { 
      title: '检验日期', 
      dataIndex: 'inspectionDate', 
      key: 'inspectionDate',
      width: 100
    },
    { 
      title: '有效期至', 
      dataIndex: 'expiryDate', 
      key: 'expiryDate',
      width: 100
    },
    { 
      title: '状态', 
      dataIndex: 'status', 
      key: 'status',
      width: 80,
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
      title: '报告文件', 
      dataIndex: 'reportFile', 
      key: 'reportFile',
      width: 150
    },
    { 
      title: '备注', 
      dataIndex: 'remark', 
      key: 'remark',
      width: 200,
      ellipsis: true
    },
    { 
      title: '操作', 
      key: 'action',
      width: 150,
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
      <h1 style={{ marginBottom: 24 }}>供应商检验报告</h1>
      
      <Card style={{ marginBottom: 16 }}>
        <Space wrap style={{ width: '100%' }}>
          <Select placeholder="选择供应商" style={{ width: 200 }}>
            {suppliers.map(supplier => (
              <Select.Option key={supplier.key} value={supplier.name}>
                {supplier.name}
              </Select.Option>
            ))}
          </Select>
          <Input placeholder="产品名称" style={{ width: 200 }} />
          <Select placeholder="状态" style={{ width: 120 }}>
            <Select.Option value="有效">有效</Select.Option>
            <Select.Option value="已过期">已过期</Select.Option>
          </Select>
          <Button type="primary" icon={<SearchOutlined />}>查询</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setVisible(true)}>
            新增检验报告
          </Button>
        </Space>
      </Card>
      
      <div style={{ overflowX: 'auto' }}>
        <Table 
          columns={columns} 
          dataSource={inspectionReports} 
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
          scroll={{ x: 1200 }}
        />
      </div>

      <Modal
        title="新增检验报告"
        open={visible}
        onOk={() => {
          form.validateFields().then(() => {
            // 新增检验报告处理
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
            name="productName"
            label="产品名称"
            rules={[{ required: true, message: '请输入产品名称' }]}
          >
            <Input placeholder="请输入产品名称" />
          </Form.Item>
          
          <Form.Item
            name="reportNumber"
            label="报告编号"
            rules={[{ required: true, message: '请输入报告编号' }]}
          >
            <Input placeholder="请输入报告编号" />
          </Form.Item>
          
          <Form.Item
            name="inspectionDate"
            label="检验日期"
            rules={[{ required: true, message: '请选择检验日期' }]}
          >
            <DatePicker style={{ width: '100%' }} placeholder="请选择检验日期" />
          </Form.Item>
          
          <Form.Item
            name="expiryDate"
            label="有效期至"
            rules={[{ required: true, message: '请选择有效期' }]}
          >
            <DatePicker style={{ width: '100%' }} placeholder="请选择有效期" />
          </Form.Item>
          
          <Form.Item
            name="reportFile"
            label="检验报告文件"
            rules={[{ required: true, message: '请上传检验报告文件' }]}
            valuePropName="fileList"
          >
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>上传检验报告</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      {/* 编辑检验报告模态框 */}
      <Modal
        title="编辑检验报告"
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
            name="reportNumber"
            label="报告编号"
            rules={[{ required: true, message: '请输入报告编号' }]}
          >
            <Input placeholder="请输入报告编号" />
          </Form.Item>
          
          <Form.Item
            name="inspectionDate"
            label="检验日期"
            rules={[{ required: true, message: '请选择检验日期' }]}
          >
            <DatePicker style={{ width: '100%' }} placeholder="请选择检验日期" />
          </Form.Item>
          
          <Form.Item
            name="expiryDate"
            label="有效期至"
            rules={[{ required: true, message: '请选择有效期' }]}
          >
            <DatePicker style={{ width: '100%' }} placeholder="请选择有效期" />
          </Form.Item>
          
          <Form.Item
            name="reportFile"
            label="检验报告文件"
            valuePropName="fileList"
          >
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>重新上传检验报告</Button>
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

export default SupplierInspectionReport;