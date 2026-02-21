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
    // 模拟API调用
    setTimeout(() => {
      // 模拟采购订单数据
      const mockPurchaseOrders = [];
      
      setData(mockPurchaseOrders);
      setFilteredData(mockPurchaseOrders);
      setPagination(prev => ({
        ...prev,
        total: mockPurchaseOrders.length,
      }));
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // 搜索处理
  const handleSearch = (values) => {
    let results = [...data];
    
    if (values.orderNumber) {
      results = results.filter(item => 
        item.orderNumber.toLowerCase().includes(values.orderNumber.toLowerCase())
      );
    }
    
    if (values.supplierName) {
      results = results.filter(item => 
        item.supplierName.toLowerCase().includes(values.supplierName.toLowerCase())
      );
    }
    
    if (values.status && values.status !== 'all') {
      results = results.filter(item => item.status === values.status);
    }
    
    if (values.dateRange && values.dateRange.length === 2) {
      const [startDate, endDate] = values.dateRange;
      results = results.filter(item => {
        const orderDate = new Date(item.orderDate);
        return orderDate >= startDate && orderDate <= endDate;
      });
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
        packUnit: '',
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
      onOk: () => {
        setLoading(true);
        // 模拟API调用
        setTimeout(() => {
          const updatedData = data.map(item => {
            if (selectedRowKeys.includes(item.key)) {
              return {
                ...item,
                status: '已验收',
                items: item.items.map(subItem => ({
                  ...subItem,
                  status: '已验收'
                }))
              };
            }
            return item;
          });
          
          setData(updatedData);
          setFilteredData(updatedData);
          setSelectedRowKeys([]);
          setLoading(false);
          message.success(`成功确认收货 ${selectedRowKeys.length} 个订单`);
        }, 1000);
      },
    });
  };

  // 单条记录确认收货
  const handleSingleAccept = (record) => {
    Modal.confirm({
      title: '确认收货',
      content: `确定要确认收货订单 ${record.orderNumber} 吗？`,
      onOk: () => {
        setLoading(true);
        // 模拟API调用
        setTimeout(() => {
          const updatedData = data.map(item => {
            if (item.key === record.key) {
              return {
                ...item,
                status: '已验收',
                items: item.items.map(subItem => ({
                  ...subItem,
                  status: '已验收'
                }))
              };
            }
            return item;
          });
          
          setData(updatedData);
          setFilteredData(updatedData);
          setLoading(false);
          message.success(`订单 ${record.orderNumber} 已确认收货`);
        }, 500);
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
      title: '订单号',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      width: 180,
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: '商品编码',
      dataIndex: 'productCode',
      key: 'productCode',
      width: 120,
    },
    {
      title: '规格',
      dataIndex: 'specification',
      key: 'specification',
      width: 150,
    },
    {
      title: '型号',
      dataIndex: 'model',
      key: 'model',
      width: 100,
    },
    {
      title: '生产厂家',
      dataIndex: 'manufacturer',
      key: 'manufacturer',
      width: 150,
    },
    {
      title: '供应商',
      dataIndex: 'supplierName',
      key: 'supplierName',
      width: 150,
    },
    {
      title: '注册证号',
      dataIndex: 'registrationNumber',
      key: 'registrationNumber',
      width: 150,
    },
    {
      title: '订货数量',
      dataIndex: 'orderQuantity',
      key: 'orderQuantity',
      width: 100,
    },
    {
      title: '订货单位',
      dataIndex: 'orderUnit',
      key: 'orderUnit',
      width: 100,
    },
    {
      title: '入库数量',
      key: 'instockQuantity',
      width: 100,
      render: (_, record) => {
        const itemEditValues = editValues[record.key] || {};
        const instockQuantity = itemEditValues.instockQuantity !== undefined ? itemEditValues.instockQuantity : record.instockQuantity || 0;
        const errorKey = `${record.key}_instockQuantity`;
        const hasError = validationErrors[errorKey];
        
        return (
          <div>
            <InputNumber
              min={0}
              max={record.orderQuantity}
              value={instockQuantity}
              onChange={(value) => handleEditChange(record.key, 'instockQuantity', value)}
              style={{ 
                width: '100%', 
                ...styles.editableField,
                ...(hasError ? styles.errorField : {})
              }}
            />
            {hasError && (
              <div style={{ fontSize: '12px', color: '#ff4d4f', marginTop: '2px' }}>
                {validationErrors[errorKey]}
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: '打包单位',
      key: 'packUnit',
      width: 100,
      render: (_, record) => {
        const itemEditValues = editValues[record.key] || {};
        return (
          <Input
            value={itemEditValues.packUnit || record.packUnit || ''}
            onChange={(e) => handleEditChange(record.key, 'packUnit', e.target.value)}
            placeholder="请输入"
            style={{ width: '100%', ...styles.editableField }}
          />
        );
      },
    },
    {
      title: '批号',
      key: 'batchNumber',
      width: 120,
      render: (_, record) => {
        const itemEditValues = editValues[record.key] || {};
        const errorKey = `${record.key}_batchNumber`;
        const hasError = validationErrors[errorKey];
        
        return (
          <div>
            <Input
              value={itemEditValues.batchNumber || record.batchNumber || ''}
              onChange={(e) => handleEditChange(record.key, 'batchNumber', e.target.value)}
              placeholder="请输入"
              style={{ 
                width: '100%', 
                ...styles.editableField,
                ...(hasError ? styles.errorField : {})
              }}
            />
            {hasError && (
              <div style={{ fontSize: '12px', color: '#ff4d4f', marginTop: '2px' }}>
                {validationErrors[errorKey]}
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: '生产日期',
      key: 'productionDate',
      width: 120,
      render: (_, record) => {
        const itemEditValues = editValues[record.key] || {};
        const productionDate = itemEditValues.productionDate || (record.productionDate ? moment(record.productionDate) : null);
        const errorKey = `${record.key}_productionDate`;
        const hasError = validationErrors[errorKey];
        
        return (
          <div>
            <DatePicker
              value={productionDate}
              onChange={(date) => handleEditChange(record.key, 'productionDate', date)}
              placeholder="请选择"
              style={{ 
                width: '100%', 
                ...styles.editableField,
                ...(hasError ? styles.errorField : {})
              }}
            />
            {hasError && (
              <div style={{ fontSize: '12px', color: '#ff4d4f', marginTop: '2px' }}>
                {validationErrors[errorKey]}
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: '失效日期',
      key: 'expiryDate',
      width: 120,
      render: (_, record) => {
        const itemEditValues = editValues[record.key] || {};
        const expiryDate = itemEditValues.expiryDate || (record.expiryDate ? moment(record.expiryDate) : null);
        const errorKey = `${record.key}_expiryDate`;
        const hasError = validationErrors[errorKey];
        
        return (
          <div>
            <DatePicker
              value={expiryDate}
              onChange={(date) => handleEditChange(record.key, 'expiryDate', date)}
              placeholder="请选择"
              style={{ 
                width: '100%', 
                ...styles.editableField,
                ...(hasError ? styles.errorField : {})
              }}
            />
            {hasError && (
              <div style={{ fontSize: '12px', color: '#ff4d4f', marginTop: '2px' }}>
                {validationErrors[errorKey]}
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: '采购单价',
      dataIndex: 'purchasePrice',
      key: 'purchasePrice',
      width: 100,
      render: (price) => `¥${price?.toFixed(2) || '0.00'}`,
    },
    {
      title: '采购金额',
      dataIndex: 'purchaseAmount',
      key: 'purchaseAmount',
      width: 100,
      render: (amount) => `¥${amount?.toFixed(2) || '0.00'}`,
    },
    {
      title: '申领科室',
      dataIndex: 'department',
      key: 'department',
      width: 120,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 160,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      width: 150,
    },
  ];

  // 订单详情模态框中的商品列定义
  const itemColumns = [
    {
      title: '商品编码',
      dataIndex: 'productCode',
      key: 'productCode',
      width: 100,
      render: (text) => <div style={styles.readonlyText}>{text}</div>,
    },
    {
      title: '商品名称',
      dataIndex: 'productName',
      key: 'productName',
      width: 120,
      render: (text, record) => (
        <div>
          <div style={styles.readonlyText}>{text}</div>
          <div style={{ fontSize: '12px', color: '#bfbfbf', marginTop: '2px' }}>{record.specification}</div>
        </div>
      ),
    },
    {
      title: '单位',
      dataIndex: 'unit',
      key: 'unit',
      width: 80,
      render: (text) => <div style={styles.readonlyText}>{text}</div>,
    },
    {
      title: '订货数量',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 100,
      render: (text) => <div style={styles.readonlyText}>{text}</div>,
    },
    {
      title: '入库数量',
      key: 'instockQuantity',
      width: 100,
      render: (_, record) => {
        const itemEditValues = editValues[record.key] || {};
        const instockQuantity = itemEditValues.instockQuantity !== undefined ? itemEditValues.instockQuantity : record.quantity;
        const errorKey = `${record.key}_instockQuantity`;
        const hasError = validationErrors[errorKey];
        
        return (
          <div>
            <InputNumber
              min={0}
              max={record.quantity}
              value={instockQuantity}
              onChange={(value) => handleEditChange(record.key, 'instockQuantity', value)}
              style={{ 
                width: '100%', 
                ...styles.editableField,
                ...(hasError ? styles.errorField : {})
              }}
            />
            {hasError && (
              <div style={{ fontSize: '12px', color: '#ff4d4f', marginTop: '2px' }}>
                {validationErrors[errorKey]}
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: '打包单位',
      key: 'packUnit',
      width: 100,
      render: (_, record) => {
        const itemEditValues = editValues[record.key] || {};
        return (
          <Input
            value={itemEditValues.packUnit || ''}
            onChange={(e) => handleEditChange(record.key, 'packUnit', e.target.value)}
            placeholder="请输入"
            style={{ width: '100%', ...styles.editableField }}
          />
        );
      },
    },
    {
      title: '批号',
      key: 'batchNumber',
      width: 120,
      render: (_, record) => {
        const itemEditValues = editValues[record.key] || {};
        const errorKey = `${record.key}_batchNumber`;
        const hasError = validationErrors[errorKey];
        
        return (
          <div>
            <Input
              value={itemEditValues.batchNumber || ''}
              onChange={(e) => handleEditChange(record.key, 'batchNumber', e.target.value)}
              placeholder="请输入"
              style={{ 
                width: '100%', 
                ...styles.editableField,
                ...(hasError ? styles.errorField : {})
              }}
            />
            {hasError && (
              <div style={{ fontSize: '12px', color: '#ff4d4f', marginTop: '2px' }}>
                {validationErrors[errorKey]}
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: '生产日期',
      key: 'productionDate',
      width: 120,
      render: (_, record) => {
        const itemEditValues = editValues[record.key] || {};
        return (
          <DatePicker
            value={itemEditValues.productionDate}
            onChange={(date) => handleEditChange(record.key, 'productionDate', date)}
            placeholder="请选择"
            style={{ width: '100%', ...styles.editableField }}
          />
        );
      },
    },
    {
      title: '失效日期',
      key: 'expiryDate',
      width: 120,
      render: (_, record) => {
        const itemEditValues = editValues[record.key] || {};
        return (
          <DatePicker
            value={itemEditValues.expiryDate}
            onChange={(date) => handleEditChange(record.key, 'expiryDate', date)}
            placeholder="请选择"
            style={{ width: '100%', ...styles.editableField }}
          />
        );
      },
    },
    {
      title: '采购单价',
      dataIndex: 'price',
      key: 'price',
      width: 80,
      render: (price) => <div style={styles.readonlyText}>¥{price.toFixed(2)}</div>,
    },
    {
      title: '采购金额',
      key: 'amount',
      width: 100,
      render: (_, record) => {
        const itemEditValues = editValues[record.key] || {};
        const instockQuantity = itemEditValues.instockQuantity !== undefined ? itemEditValues.instockQuantity : record.quantity;
        const amount = (instockQuantity || 0) * record.price;
        return <div style={styles.amountField}>¥{amount.toFixed(2)}</div>;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => {
        const statusConfig = {
          '待验收': { color: 'orange', text: '待验收' },
          '已验收': { color: 'green', text: '已验收' },
          '已拒收': { color: 'red', text: '已拒收' },
        };
        const config = statusConfig[status] || { color: 'default', text: status };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_, item) => (
        <Space size="small">
          {item.status === '待验收' && (
            <>
              <Tooltip title="确认收货">
                <Button
                  type="link"
                  size="small"
                  icon={<CheckCircleOutlined />}
                  onClick={() => {
                    // 检查是否可以提交
                    if (!canSubmitItem(item.key)) {
                      message.error('请先正确填写所有必填字段');
                      return;
                    }
                    
                    // 获取编辑后的值
                    const itemEditValues = editValues[item.key] || {};
                    const instockQuantity = itemEditValues.instockQuantity || item.quantity;
                    
                    // 模拟单条商品确认收货
                    const updatedData = data.map(order => {
                      if (order.key === selectedOrder.key) {
                        const updatedItems = order.items.map(subItem => {
                          if (subItem.key === item.key) {
                            return {
                              ...subItem,
                              status: '已验收',
                              instockQuantity: instockQuantity,
                              packUnit: itemEditValues.packUnit || '',
                              batchNumber: itemEditValues.batchNumber || '',
                              productionDate: itemEditValues.productionDate,
                              expiryDate: itemEditValues.expiryDate,
                              amount: instockQuantity * subItem.price
                            };
                          }
                          return subItem;
                        });
                        
                        // 检查订单状态
                        const allAccepted = updatedItems.every(subItem => subItem.status === '已验收');
                        const allRejected = updatedItems.every(subItem => subItem.status === '已拒收');
                        const hasPending = updatedItems.some(subItem => subItem.status === '待验收');
                        
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
                    
                    setData(updatedData);
                    setFilteredData(updatedData);
                    message.success(`商品 ${item.productName} 已确认收货`);
                  }}
                  style={{ color: '#52c41a' }}
                >
                  收货
                </Button>
              </Tooltip>
              
              <Tooltip title="拒收">
                <Button
                  type="link"
                  danger
                  size="small"
                  icon={<CloseCircleOutlined />}
                  onClick={() => handleOpenRejectModal('single', selectedOrder, item)}
                >
                  拒收
                </Button>
              </Tooltip>
            </>
          )}
        </Space>
      ),
    },
  ];



  return (
    <div style={{ padding: '0 16px' }}>
      <h1 style={{ marginBottom: 24 }}>采购入库</h1>
      

      {/* 搜索区域 */}
      <Card style={{ marginBottom: 24 }}>
        <Form
          form={searchForm}
          layout="vertical"
          onFinish={handleSearch}
        >
          {/* 按键栏 */}
          <Row style={{ marginBottom: 16 }}>
            <Space>
              <Button icon={<EyeOutlined />} onClick={() => {
                // 模拟获取采购订单数据
                const mockReceivedOrders = [
                  { 
                    key: 'R1', 
                    orderNumber: 'PO-20260110-001', 
                    supplierName: '医疗用品供应商A', 
                    supplierCode: 'SUP-A001',
                    totalAmount: 15000.00, 
                    department: '采购部',
                    buyer: '张三',
                    contactPerson: '李四',
                    contactPhone: '13800138000',
                    orderDate: '2026-01-10',
                    expectedDeliveryDate: '2026-01-15',
                    status: '待验收',
                    items: [
                      { key: 'R1-1', productCode: 'PROD011', productName: '医用手套', specification: '乳胶 100只/盒', model: 'GLOVE-100', manufacturer: '手套制造厂A', registrationNumber: 'REG-2024-011', unit: '盒', quantity: 500, price: 30.00, amount: 15000.00, status: '待验收' }
                    ] 
                  },
                  { 
                    key: 'R2', 
                    orderNumber: 'PO-20260109-002', 
                    supplierName: '医疗器械供应商B', 
                    supplierCode: 'SUP-B002',
                    totalAmount: 8000.00, 
                    department: '采购部',
                    buyer: '李四',
                    contactPerson: '王五',
                    contactPhone: '13900139000',
                    orderDate: '2026-01-09',
                    expectedDeliveryDate: '2026-01-14',
                    status: '待验收',
                    items: [
                      { key: 'R2-1', productCode: 'PROD012', productName: '血压计', specification: '电子血压计', model: 'BP-001', manufacturer: '血压计制造厂B', registrationNumber: 'REG-2024-012', unit: '台', quantity: 10, price: 800.00, amount: 8000.00, status: '待验收' }
                    ] 
                  },
                  { 
                    key: 'R3', 
                    orderNumber: 'PO-20260108-003', 
                    supplierName: '消毒用品供应商C', 
                    supplierCode: 'SUP-C003',
                    totalAmount: 6000.00, 
                    department: '采购部',
                    buyer: '王五',
                    contactPerson: '赵六',
                    contactPhone: '13700137000',
                    orderDate: '2026-01-08',
                    expectedDeliveryDate: '2026-01-13',
                    status: '待验收',
                    items: [
                      { key: 'R3-1', productCode: 'PROD013', productName: '消毒湿巾', specification: '100片/包', model: 'WIPE-100', manufacturer: '湿巾制造厂C', registrationNumber: 'REG-2024-013', unit: '包', quantity: 200, price: 30.00, amount: 6000.00, status: '待验收' }
                    ] 
                  },
                ];
                setReceivedOrders(mockReceivedOrders);
                setSelectedReceivedOrder(null);
                setReceivedOrdersModalVisible(true);
              }}>
                查单据
              </Button>
              <Button icon={<DownloadOutlined />}>导出数据</Button>
              <Button icon={<ReloadOutlined />} onClick={loadData}>
                刷新
              </Button>
            </Space>
          </Row>
          
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item name="orderNumber" label="采购单号">
                <Input placeholder="请输入采购单号" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="supplierName" label="供应商名称">
                <Input placeholder="请输入供应商名称" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="status" label="订单状态" initialValue="all">
                <Select>
                  <Option value="all">全部状态</Option>
                  <Option value="待验收">待验收</Option>
                  <Option value="部分验收">部分验收</Option>
                  <Option value="已验收">已验收</Option>
                  <Option value="已拒收">已拒收</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="dateRange" label="订单日期">
                <RangePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row justify="end">
            <Space>
              <Button icon={<ReloadOutlined />} onClick={handleReset}>
                重置
              </Button>
              <Button type="primary" icon={<SearchOutlined />} htmlType="submit">
                搜索
              </Button>
            </Space>
          </Row>
        </Form>
      </Card>
      

      
      {/* 订单表格 */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredData}
          rowSelection={rowSelection}
          loading={loading}
          scroll={{ x: 2500 }}
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
        
        {/* 底部按键栏 */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          marginTop: '16px',
          paddingTop: '16px',
          borderTop: '1px solid #f0f0f0'
        }}>
          <Space>
            <Button type="default" danger onClick={handleDelete}>
              删除
            </Button>
            <Button type="primary" onClick={handleSubmit}>
              提交单据
            </Button>
          </Space>
        </div>
      </Card>
      
      {/* 订单详情模态框 */}
      <Modal
        title="采购订单详情"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        width={1000}
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
                    selectedOrder.status === '待验收' ? 'orange' :
                    selectedOrder.status === '部分验收' ? 'blue' :
                    selectedOrder.status === '已验收' ? 'green' : 'red'
                  }>
                    {selectedOrder.status}
                  </Tag>
                </div>
              </Col>
            </Row>
            
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={8}>
                <div><strong>订单日期：</strong>{selectedOrder.orderDate}</div>
              </Col>
              <Col span={8}>
                <div><strong>预计到货：</strong>{selectedOrder.expectedDeliveryDate}</div>
              </Col>
              <Col span={8}>
                <div><strong>总金额：</strong>¥{selectedOrder.totalAmount.toFixed(2)}</div>
              </Col>
            </Row>
            
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={8}>
                <div><strong>采购部门：</strong>{selectedOrder.department}</div>
              </Col>
              <Col span={8}>
                <div><strong>采购员：</strong>{selectedOrder.buyer}</div>
              </Col>
              <Col span={8}>
                <div><strong>联系人：</strong>{selectedOrder.contactPerson} ({selectedOrder.contactPhone})</div>
              </Col>
            </Row>
            
            <Divider orientation="left">商品明细</Divider>
            <Table
              columns={itemColumns}
              dataSource={selectedOrder.items}
              pagination={false}
              rowKey="key"
              scroll={{ x: 1500 }}
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
                    packUnit: '',
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
                    status: '待验收',
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
            },
            {
              title: '供应商',
              dataIndex: 'supplierName',
              key: 'supplierName',
              width: 150,
            },
            {
              title: '总金额',
              dataIndex: 'totalAmount',
              key: 'totalAmount',
              width: 100,
              render: (amount) => `¥${amount.toFixed(2)}`,
            },
            {
              title: '商品数量',
              dataIndex: 'items',
              key: 'itemCount',
              width: 100,
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