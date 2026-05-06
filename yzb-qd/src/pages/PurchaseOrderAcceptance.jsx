import React, { useState, useEffect, useCallback } from 'react';
import moment from 'moment';
import {
  Card,
  Table,
  Button,
  Space,
  Input,
  Select,
  DatePicker,
  Tag,
  Modal,
  Form,
  Row,
  Col,
  message,
  Divider,
  Typography,
  Tooltip,
  InputNumber
} from 'antd';
import {
  SearchOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  DownloadOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import api from '../utils/api.js';

const { Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const PurchaseOrderAcceptance = () => {
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejectType, setRejectType] = useState('single'); // 'single' or 'whole'
  const [rejectItem, setRejectItem] = useState(null);
  // 已收货订单相关状态
  const [receivedOrdersModalVisible, setReceivedOrdersModalVisible] = useState(false);
  const [receivedOrders, setReceivedOrders] = useState([]);
  const [selectedReceivedOrder, setSelectedReceivedOrder] = useState(null);
  // 编辑状态管理
  const [editValues, setEditValues] = useState({});
  const [validationErrors, setValidationErrors] = useState({});

  // 样式定义
  const styles = {
    editableField: {
      borderColor: '#1890ff',
      transition: 'all 0.3s ease'
    },
    readonlyField: {
      color: '#8c8c8c',
      backgroundColor: '#f5f5f5',
      cursor: 'not-allowed'
    },
    readonlyText: {
      color: '#8c8c8c',
      padding: '4px 8px',
      borderRadius: '4px',
      backgroundColor: '#fafafa'
    },
    amountField: {
      color: '#8c8c8c',
      fontWeight: 'bold',
      padding: '4px 8px',
      borderRadius: '4px',
      backgroundColor: '#f0f0f0'
    },
    errorField: {
      borderColor: '#ff4d4f',
      backgroundColor: '#fff2f0'
    }
  };

  // 验证函数
  const validateInstockQuantity = (value, maxQuantity) => {
    if (value === undefined || value === null || value === '') {
      return { isValid: false, message: '入库数量不能为空' };
    }
    if (isNaN(value)) {
      return { isValid: false, message: '入库数量必须是数字' };
    }
    if (value < 0) {
      return { isValid: false, message: '入库数量不能小于0' };
    }
    if (value > maxQuantity) {
      return { isValid: false, message: `入库数量不能超过订货数量(${maxQuantity})` };
    }
    return { isValid: true, message: '' };
  };

  const validateBatchNumber = (value) => {
    if (value && value.length > 50) {
      return { isValid: false, message: '批号长度不能超过50个字符' };
    }
    return { isValid: true, message: '' };
  };

  const validateDate = (date, fieldName) => {
    if (date && !(date instanceof Date || (date && date._isAMomentObject))) {
      return { isValid: false, message: `${fieldName}格式不正确` };
    }
    return { isValid: true, message: '' };
  };

  // 检查是否可以提交
  const canSubmitItem = (itemKey) => {
    const item = selectedOrder?.items.find(item => item.key === itemKey);
    if (!item) return false;
    
    const itemEditValues = editValues[itemKey] || {};
    const instockQuantity = itemEditValues.instockQuantity !== undefined ? itemEditValues.instockQuantity : item.quantity;
    
    // 检查入库数量验证
    const quantityValidation = validateInstockQuantity(instockQuantity, item.quantity);
    if (!quantityValidation.isValid) return false;
    
    // 检查批号验证
    const batchValidation = validateBatchNumber(itemEditValues.batchNumber || '');
    if (!batchValidation.isValid) return false;
    
    // 检查日期验证
    const productionDateValidation = validateDate(itemEditValues.productionDate, '生产日期');
    if (!productionDateValidation.isValid) return false;
    
    const expiryDateValidation = validateDate(itemEditValues.expiryDate, '失效日期');
    if (!expiryDateValidation.isValid) return false;
    
    return true;
  };

  // 初始化数据
  const loadData = useCallback(() => {
    setLoading(true);
    // 从API获取待收货的采购订单
    api.get('/api/scm/purchases/orders/pending-receive', {
      pageNum: pagination.current,
      pageSize: pagination.pageSize
    })
      .then(response => {
        if (response.code === 1 && response.data) {
          const orderList = response.data.records.map(order => ({
            key: order.id,
            orderNumber: order.orderNumber,
            supplierName: order.supplierName,
            department: order.departmentName,
            orderDate: order.createTime,
            itemCount: order.itemCount,
            totalAmount: order.totalAmount,
            receiver: order.receiverName || '',
            receiptDate: order.receiptDate || '',
            status: order.status,
            remark: order.remark || '',
            productCode: order.details && order.details.length > 0 ? order.details[0].materialCode : '',
            productName: order.details && order.details.length > 0 ? order.details[0].productName : '',
            manufacturer: order.details && order.details.length > 0 ? order.details[0].manufacturer : '',
            items: order.details ? order.details.map((item, index) => ({
              key: `${order.id}-${index}`,
              id: item.id,
              productCode: item.materialCode,
              productName: item.productName,
              supplierName: order.supplierName,
              materialType: item.materialType,
              specification: item.specification,
              model: item.model,
              manufacturer: item.manufacturer,
              registrationNumber: item.registrationNumber,
              department: order.departmentName,
              unit: item.unit,
              quantity: item.quantity,
              price: item.unitPrice,
              amount: item.amount,
              status: '待验收'
            })) : []
          }));
          setData(orderList);
          setFilteredData(orderList);
          setPagination(prev => ({
            ...prev,
            total: response.data.total,
          }));
        } else {
          message.error(response.message || '加载采购订单失败');
        }
      })
      .catch(error => {
        console.error('加载采购订单失败:', error);
        message.error('加载采购订单失败，请检查网络连接或联系管理员');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [pagination.current, pagination.pageSize]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // 搜索处理
  const handleSearch = (values) => {
    let results = [...data];
    
    if (values.productCode) {
      results = results.filter(item => 
        item.productCode && item.productCode.toLowerCase().includes(values.productCode.toLowerCase())
      );
    }
    
    if (values.productName) {
      results = results.filter(item => 
        item.productName && item.productName.toLowerCase().includes(values.productName.toLowerCase())
      );
    }
    
    if (values.supplierName) {
      results = results.filter(item => 
        item.supplierName && item.supplierName.toLowerCase().includes(values.supplierName.toLowerCase())
      );
    }
    
    if (values.manufacturer) {
      results = results.filter(item => 
        item.manufacturer && item.manufacturer.toLowerCase().includes(values.manufacturer.toLowerCase())
      );
    }
    
    setFilteredData(results);
    setPagination(prev => ({
      ...prev,
      current: 1,
      total: results.length,
    }));
  };

  // 重置搜索
  const handleReset = () => {
    searchForm.resetFields();
    setFilteredData(data);
    setPagination(prev => ({
      ...prev,
      current: 1,
      total: data.length,
    }));
  };

  // 表格选择处理
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  // 删除选中的订单
  const handleDelete = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择要删除的订单');
      return;
    }

    Modal.confirm({
      title: '确认删除',
      content: `确定要删除选中的 ${selectedRowKeys.length} 个订单吗？`,
      onOk: () => {
        const updatedData = data.filter(item => !selectedRowKeys.includes(item.key));
        const updatedFilteredData = filteredData.filter(item => !selectedRowKeys.includes(item.key));
        
        setData(updatedData);
        setFilteredData(updatedFilteredData);
        setSelectedRowKeys([]);
        setPagination(prev => ({
          ...prev,
          total: updatedData.length,
        }));
        
        message.success(`成功删除 ${selectedRowKeys.length} 个订单`);
      },
    });
  };

  // 提交单据
  const handleSubmit = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择要提交的订单');
      return;
    }

    Modal.confirm({
      title: '确认提交',
      content: `确定要提交选中的 ${selectedRowKeys.length} 个订单吗？`,
      onOk: () => {
        // 这里可以添加提交单据的逻辑，例如API调用
        // 暂时只显示成功消息
        message.success(`成功提交 ${selectedRowKeys.length} 个订单`);
        setSelectedRowKeys([]);
      },
    });
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    getCheckboxProps: (record) => ({
      disabled: record.status === '已验收', // 已验收的订单不能选择
    }),
  };

  // 处理编辑字段变化
  const handleEditChange = (itemKey, field, value) => {
    setEditValues(prev => {
      const newEditValues = {
        ...prev,
        [itemKey]: {
          ...prev[itemKey],
          [field]: value
        }
      };
      
      // 验证输入
      setValidationErrors(prevErrors => {
        const newErrors = { ...prevErrors };
        const item = selectedOrder?.items.find(item => item.key === itemKey);
        
        if (field === 'instockQuantity' && item) {
          const validation = validateInstockQuantity(value, item.quantity);
          if (!validation.isValid) {
            newErrors[`${itemKey}_instockQuantity`] = validation.message;
          } else {
            delete newErrors[`${itemKey}_instockQuantity`];
          }
        } else if (field === 'batchNumber') {
          const validation = validateBatchNumber(value);
          if (!validation.isValid) {
            newErrors[`${itemKey}_batchNumber`] = validation.message;
          } else {
            delete newErrors[`${itemKey}_batchNumber`];
          }
        } else if (field === 'productionDate') {
          const validation = validateDate(value, '生产日期');
          if (!validation.isValid) {
            newErrors[`${itemKey}_productionDate`] = validation.message;
          } else {
            delete newErrors[`${itemKey}_productionDate`];
          }
        } else if (field === 'expiryDate') {
          const validation = validateDate(value, '失效日期');
          if (!validation.isValid) {
            newErrors[`${itemKey}_expiryDate`] = validation.message;
          } else {
            delete newErrors[`${itemKey}_expiryDate`];
          }
        }
        
        return newErrors;
      });
      
      // 如果修改的是入库数量，自动计算采购金额
      if (field === 'instockQuantity' && selectedOrder) {
        const item = selectedOrder.items.find(item => item.key === itemKey);
        if (item) {
          const instockQuantity = value !== undefined ? value : (prev[itemKey]?.instockQuantity || item.quantity);
          // 金额计算会在渲染时自动进行，这里不需要额外处理
        }
      }
      
      return newEditValues;
    });
  };

  // 查看订单详情
  const handleViewOrder = (record) => {
    // 初始化编辑状态，设置入库数量默认为订货数量
    const initialEditValues = {};
    record.items.forEach(item => {
      initialEditValues[item.key] = {
        instockQuantity: item.quantity, // 初始入库数量等于订货数量
        unit: '',
        batchNumber: '',
        productionDate: null,
        expiryDate: null
      };
    });
    setEditValues(initialEditValues);
    setSelectedOrder(record);
    setIsModalVisible(true);
  };

  // 批量确认收货
  const handleBatchAccept = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要确认收货的订单');
      return;
    }

    Modal.confirm({
      title: '确认收货',
      content: `确定要确认收货选中的 ${selectedRowKeys.length} 个订单吗？`,
      onOk: async () => {
        setLoading(true);
        try {
          let successCount = 0;
          for (const key of selectedRowKeys) {
            const order = data.find(item => item.key === key);
            if (order) {
              const receiveData = {
                receiverName: '当前用户',
                items: order.items.map(item => ({
                  materialId: item.productCode,
                  quantity: item.quantity
                }))
              };
              const response = await api.post(`/api/scm/purchases/orders/${key}/receive`, receiveData);
              if (response.code === 1) {
                successCount++;
              }
            }
          }
          message.success(`成功确认收货 ${successCount} 个订单`);
          loadData();
          setSelectedRowKeys([]);
        } catch (error) {
          console.error('批量确认收货失败:', error);
          message.error('批量确认收货失败，请检查网络连接或联系管理员');
        } finally {
          setLoading(false);
        }
      },
    });
  };

  // 单条记录确认收货
  const handleSingleAccept = (record) => {
    Modal.confirm({
      title: '确认收货',
      content: `确定要确认收货订单 ${record.orderNumber} 吗？`,
      onOk: async () => {
        setLoading(true);
        try {
          const receiveData = {
            receiverName: '当前用户',
            items: record.items.map(item => ({
              materialId: item.productCode,
              quantity: item.quantity
            }))
          };
          const response = await api.post(`/api/scm/purchases/orders/${record.key}/receive`, receiveData);
          if (response.code === 1) {
            message.success(`订单 ${record.orderNumber} 已确认收货`);
            loadData();
          } else {
            message.error(response.message || '确认收货失败');
          }
        } catch (error) {
          console.error('确认收货失败:', error);
          message.error('确认收货失败，请检查网络连接或联系管理员');
        } finally {
          setLoading(false);
        }
      },
    });
  };

  // 打开拒收模态框
  const handleOpenRejectModal = (type, record = null, item = null) => {
    setRejectType(type);
    setRejectItem(item);
    if (type === 'single' && record) {
      setSelectedOrder(record);
    }
    setRejectModalVisible(true);
  };

  // 处理拒收
  const handleReject = (values) => {
    setLoading(true);
    // 模拟API调用
    setTimeout(() => {
      let updatedData = [...data];
      
      if (rejectType === 'single' && rejectItem) {
        // 单条记录拒收
        updatedData = updatedData.map(order => {
          if (order.key === selectedOrder.key) {
            const updatedItems = order.items.map(item => {
              if (item.key === rejectItem.key) {
                return {
                  ...item,
                  status: '已拒收',
                  rejectReason: values.reason,
                  rejectRemark: values.remark
                };
              }
              return item;
            });
            
            // 检查订单状态
            const allAccepted = updatedItems.every(item => item.status === '已验收');
            const allRejected = updatedItems.every(item => item.status === '已拒收');
            const hasPending = updatedItems.some(item => item.status === '待验收');
            
            let newStatus = order.status;
            if (allAccepted) {
              newStatus = '已验收';
            } else if (allRejected) {
              newStatus = '已拒收';
            } else if (!hasPending) {
              newStatus = '部分验收';
            }
            
            return {
              ...order,
              status: newStatus,
              items: updatedItems
            };
          }
          return order;
        });
        
        message.success(`商品 ${rejectItem.productName} 已拒收`);
      } else if (rejectType === 'whole' && selectedOrder) {
        // 整单拒收
        updatedData = updatedData.map(order => {
          if (order.key === selectedOrder.key) {
            const updatedItems = order.items.map(item => ({
              ...item,
              status: '已拒收',
              rejectReason: values.reason,
              rejectRemark: values.remark
            }));
            
            return {
              ...order,
              status: '已拒收',
              items: updatedItems
            };
          }
          return order;
        });
        
        message.success(`订单 ${selectedOrder.orderNumber} 已整单拒收`);
      }
      
      setData(updatedData);
      setFilteredData(updatedData);
      setRejectModalVisible(false);
      setLoading(false);
      form.resetFields();
    }, 500);
  };

  // 表格列定义
  const columns = [
    {
      title: '采购单号',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      width: 180,
      align: 'center',
      render: (text) => <Tag color="blue">{text}</Tag>,
    },

    {
      title: '采购分院',
      dataIndex: 'department',
      key: 'department',
      width: 120,
      align: 'center',
    },
    {
      title: '供应商名称',
      dataIndex: 'supplierName',
      key: 'supplierName',
      width: 160,
      align: 'center',
    },
    {
      title: '物资数量',
      dataIndex: 'itemCount',
      key: 'itemCount',
      width: 100,
      align: 'center',
    },
    {
      title: '总金额',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 120,
      align: 'center',
      render: (amount) => `¥${amount?.toFixed(2) || '0.00'}`,
    },
    {
      title: '收货人',
      dataIndex: 'receiver',
      key: 'receiver',
      width: 100,
      align: 'center',
    },
    {
      title: '收货日期',
      dataIndex: 'receiptDate',
      key: 'receiptDate',
      width: 120,
      align: 'center',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      align: 'center',
      render: (status) => {
        const statusConfig = {
          '待入库': { color: 'orange', text: '待入库' },
          '已入库': { color: 'green', text: '已入库' },
          '已拒收': { color: 'red', text: '已拒收' },
          '部分入库': { color: 'blue', text: '部分入库' },
          '超时未入库': { color: 'warning', text: '超时未入库' },
          '已终止': { color: 'error', text: '已终止' },
        };
        const config = statusConfig[status] || { color: 'default', text: status };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      width: 150,
      align: 'center',
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewOrder(record)}
          >
            入库详情
          </Button>
          <Button
            type="primary"
            size="small"
            icon={<CheckCircleOutlined />}
            onClick={() => handleSingleAccept(record)}
          >
            确认收货
          </Button>
        </Space>
      ),
    },
  ];

  // 订单详情模态框中的商品列定义
  const itemColumns = [
    {
      title: '采购单号',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      width: 150,
      align: 'center',
      render: (_, record) => <div style={styles.readonlyText}>{selectedOrder?.orderNumber || ''}</div>,
    },
    {
      title: '供应商名称',
      dataIndex: 'supplierName',
      key: 'supplierName',
      width: 150,
      align: 'center',
      render: () => <div style={styles.readonlyText}>{selectedOrder?.supplierName || ''}</div>,
    },
    {
      title: '物资编码',
      dataIndex: 'productCode',
      key: 'productCode',
      width: 100,
      align: 'center',
      render: (text) => <div style={styles.readonlyText}>{text}</div>,
    },
    {
      title: '物资名称',
      dataIndex: 'productName',
      key: 'productName',
      width: 120,
      align: 'center',
      render: (text) => <div style={styles.readonlyText}>{text}</div>,
    },
    {
      title: '物资类型',
      dataIndex: 'materialType',
      key: 'materialType',
      width: 100,
      align: 'center',
      render: (text) => <div style={styles.readonlyText}>{text || ''}</div>,
    },
    {
      title: '规格',
      dataIndex: 'specification',
      key: 'specification',
      width: 100,
      align: 'center',
      render: (text) => <div style={styles.readonlyText}>{text}</div>,
    },
    {
      title: '型号',
      dataIndex: 'model',
      key: 'model',
      width: 100,
      align: 'center',
      render: (text) => <div style={styles.readonlyText}>{text || ''}</div>,
    },
    {
      title: '注册证号',
      dataIndex: 'registrationNumber',
      key: 'registrationNumber',
      width: 140,
      align: 'center',
      render: (text) => <div style={styles.readonlyText}>{text || ''}</div>,
    },
    {
      title: '单位',
      dataIndex: 'unit',
      key: 'unit',
      width: 80,
      align: 'center',
      render: (text) => <div style={styles.readonlyText}>{text}</div>,
    },
    {
      title: '批号',
      dataIndex: 'batchNumber',
      key: 'batchNumber',
      width: 120,
      align: 'center',
      render: (text) => <div style={styles.readonlyText}>{text || ''}</div>,
    },
    {
      title: '生产日期',
      dataIndex: 'productionDate',
      key: 'productionDate',
      width: 120,
      align: 'center',
      render: (text) => <div style={styles.readonlyText}>{text || ''}</div>,
    },
    {
      title: '失效日期',
      dataIndex: 'expiryDate',
      key: 'expiryDate',
      width: 120,
      align: 'center',
      render: (text) => <div style={styles.readonlyText}>{text || ''}</div>,
    },
    {
      title: '采购价格',
      dataIndex: 'price',
      key: 'price',
      width: 100,
      align: 'center',
      render: (price) => <div style={styles.readonlyText}>¥{price?.toFixed(2) || '0.00'}</div>,
    },

    {
      title: '生产厂家',
      dataIndex: 'manufacturer',
      key: 'manufacturer',
      width: 120,
      align: 'center',
      render: (text) => <div style={styles.readonlyText}>{text || ''}</div>,
    },
    {
      title: '入库数量',
      dataIndex: 'instockQuantity',
      key: 'instockQuantity',
      width: 100,
      align: 'center',
      render: (text, record) => <div style={styles.readonlyText}>{text || record.quantity || 0}</div>,
    },
    {
      title: '收货日期',
      dataIndex: 'receiptDate',
      key: 'receiptDate',
      width: 120,
      align: 'center',
      render: (_, record) => <div style={styles.readonlyText}>{selectedOrder?.receiptDate || ''}</div>,
    },
    {
      title: '收货人',
      dataIndex: 'receiver',
      key: 'receiver',
      width: 100,
      align: 'center',
      render: (_, record) => <div style={styles.readonlyText}>{selectedOrder?.receiver || ''}</div>,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      width: 150,
      align: 'center',
      render: (_, record) => <div style={styles.readonlyText}>{selectedOrder?.remark || ''}</div>,
    },
  ];



  return (
    <div style={{ padding: '0 16px' }}>
      <h1 style={{ marginBottom: 24 }}>采购入库</h1>
      

      {/* 搜索区域 */}
      <Card style={{ marginBottom: 24, padding: '16px' }}>
        <Form
          form={searchForm}
          onFinish={handleSearch}
        >

          
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <label style={{ fontSize: '14px', color: '#333', minWidth: '80px' }}>物资编码</label>
              <Form.Item name="productCode" noStyle>
                <Input placeholder="请输入物资编码" style={{ width: 180 }} />
              </Form.Item>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <label style={{ fontSize: '14px', color: '#333', minWidth: '80px' }}>物资名称</label>
              <Form.Item name="productName" noStyle>
                <Input placeholder="请输入物资名称" style={{ width: 180 }} />
              </Form.Item>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <label style={{ fontSize: '14px', color: '#333', minWidth: '80px' }}>生产厂家</label>
              <Form.Item name="manufacturer" noStyle>
                <Input placeholder="请输入生产厂家" style={{ width: 180 }} />
              </Form.Item>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Button type="primary" icon={<SearchOutlined />} htmlType="submit">
                查询
              </Button>
              <Button icon={<ReloadOutlined />} onClick={handleReset}>
                重置
              </Button>
            </div>
          </div>
        </Form>
      </Card>
      

      
      {/* 订单表格 */}
      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end', gap: 16 }}>
          <Button 
            type="primary" 
            icon={<CheckCircleOutlined />}
            onClick={handleBatchAccept}
            disabled={selectedRowKeys.length === 0}
          >
            批量确认收货
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={filteredData}
          rowSelection={rowSelection}
          loading={loading}
          scroll={{ x: 1200 }}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
            style: {
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              margin: '24px 0 0 0',
            },
            onChange: (page, pageSize) => {
              setPagination(prev => ({
                ...prev,
                current: page,
                pageSize,
              }));
            },
          }}
        />
        

      </Card>
      
      {/* 订单详情模态框 */}
      <Modal
        title="入库详情"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        width={1200}
        footer={[
          <Button key="close" onClick={() => setIsModalVisible(false)}>
            关闭
          </Button>,
        ]}
      >
        {selectedOrder && (
          <div>
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={8}>
                <div><strong>采购单号：</strong>{selectedOrder.orderNumber}</div>
              </Col>
              <Col span={8}>
                <div><strong>供应商：</strong>{selectedOrder.supplierName}</div>
              </Col>
              <Col span={8}>
                <div><strong>订单状态：</strong>
                  <Tag color={
                    selectedOrder.status === '待入库' ? 'orange' :
                    selectedOrder.status === '部分入库' ? 'blue' :
                    selectedOrder.status === '已入库' ? 'green' : 'red'
                  }>
                    {selectedOrder.status}
                  </Tag>
                </div>
              </Col>
            </Row>
            
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={8}>
                <div><strong>验收日期：</strong>{selectedOrder.orderDate}</div>
              </Col>
              <Col span={8}>
                <div><strong>总金额：</strong>¥{selectedOrder.totalAmount.toFixed(2)}</div>
              </Col>
            </Row>
            
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={8}>
                <div><strong>采购分院：</strong>{selectedOrder.department}</div>
              </Col>
              <Col span={8}>
                <div><strong>验收人：</strong>{selectedOrder.buyer}</div>
              </Col>
            </Row>
            
            <Divider orientation="left">商品明细</Divider>
            <Table
              columns={itemColumns}
              dataSource={selectedOrder.items}
              pagination={false}
              rowKey="key"
              scroll={{ x: 1800 }}
            />
          </div>
        )}
      </Modal>
      
      {/* 拒收模态框 */}
      <Modal
        title={rejectType === 'single' ? '拒收商品' : '整单拒收'}
        open={rejectModalVisible}
        onCancel={() => setRejectModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleReject}
        >
          <Form.Item
            name="reason"
            label="拒收原因"
            rules={[{ required: true, message: '请输入拒收原因' }]}
          >
            <Select placeholder="请选择拒收原因">
              <Option value="质量问题">质量问题</Option>
              <Option value="数量不符">数量不符</Option>
              <Option value="规格不符">规格不符</Option>
              <Option value="过期产品">过期产品</Option>
              <Option value="包装破损">包装破损</Option>
              <Option value="其他">其他</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="remark"
            label="备注说明"
          >
            <Input.TextArea
              placeholder="请输入拒收的详细说明"
              rows={4}
            />
          </Form.Item>
          
          <Form.Item>
            <Row justify="end">
              <Space>
                <Button onClick={() => setRejectModalVisible(false)}>
                  取消
                </Button>
                <Button type="primary" htmlType="submit" loading={loading}>
                  确认拒收
                </Button>
              </Space>
            </Row>
          </Form.Item>
        </Form>
      </Modal>
      
      {/* 已收货订单模态框 */}
      <Modal
        title="采购订单"
        open={receivedOrdersModalVisible}
        onCancel={() => setReceivedOrdersModalVisible(false)}
        width={1000}
        footer={[
          <Button key="cancel" onClick={() => setReceivedOrdersModalVisible(false)}>
            取消
          </Button>,
          <Button 
            key="import" 
            type="primary" 
            onClick={() => {
              if (selectedReceivedOrder) {
                // 将订单的明细记录导入到采购收货单明细表单中
                const updatedData = [...data];
                
                // 为每个明细项创建单独的订单记录
                selectedReceivedOrder.items.forEach((item, index) => {
                  const newOrder = {
                    key: `new-${Date.now()}-${index}`,
                    orderNumber: selectedReceivedOrder.orderNumber,
                    productCode: item.productCode,
                    specification: item.specification,
                    model: item.model || '',
                    manufacturer: item.manufacturer || '',
                    supplierName: selectedReceivedOrder.supplierName,
                    supplierCode: selectedReceivedOrder.supplierCode,
                    registrationNumber: item.registrationNumber || '',
                    orderQuantity: item.quantity,
                    orderUnit: item.unit,
                    instockQuantity: 0,
                    unit: '',
                    batchNumber: '',
                    productionDate: '',
                    expiryDate: '',
                    purchasePrice: item.price,
                    purchaseAmount: item.amount,
                    department: selectedReceivedOrder.department,
                    createTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
                    remark: '',
                    orderDate: selectedReceivedOrder.orderDate,
                    expectedDeliveryDate: selectedReceivedOrder.expectedDeliveryDate,
                    status: '待入库',
                    totalAmount: item.amount,
                    items: [item]
                  };
                  
                  updatedData.unshift(newOrder);
                });
                
                setData(updatedData);
                setFilteredData(updatedData);
                setPagination(prev => ({
                  ...prev,
                  total: updatedData.length,
                }));
                
                message.success(`成功导入 ${selectedReceivedOrder.items.length} 条明细记录`);
                setReceivedOrdersModalVisible(false);
              } else {
                message.warning('请选择要导入的订单');
              }
            }} 
            disabled={!selectedReceivedOrder}
          >
            确认导入
          </Button>,
        ]}
      >
        <Table
          columns={[
            {
              title: '订单号',
              dataIndex: 'orderNumber',
              key: 'orderNumber',
              width: 200,
              align: 'center',
            },
            {
              title: '供应商',
              dataIndex: 'supplierName',
              key: 'supplierName',
              width: 150,
              align: 'center',
            },
            {
              title: '总金额',
              dataIndex: 'totalAmount',
              key: 'totalAmount',
              width: 100,
              align: 'center',
              render: (amount) => `¥${amount.toFixed(2)}`,
            },
            {
              title: '商品数量',
              dataIndex: 'items',
              key: 'itemCount',
              width: 100,
              align: 'center',
              render: (items) => items.length,
            },
          ]}
          dataSource={receivedOrders}
          rowSelection={{
            type: 'radio',
            selectedRowKeys: selectedReceivedOrder ? [selectedReceivedOrder.key] : [],
            onChange: (selectedRowKeys) => {
              if (selectedRowKeys.length > 0) {
                const selectedKey = selectedRowKeys[0];
                const order = receivedOrders.find(item => item.key === selectedKey);
                setSelectedReceivedOrder(order);
              } else {
                setSelectedReceivedOrder(null);
              }
            },
          }}
          pagination={{
            pageSize: 10,
            showTotal: (total) => `共 ${total} 条记录`,
            style: {
              display: 'flex',
              justifyContent: 'center',
              marginTop: '16px'
            }
          }}
        />
      </Modal>
    </div>
  );
};

export default PurchaseOrderAcceptance;