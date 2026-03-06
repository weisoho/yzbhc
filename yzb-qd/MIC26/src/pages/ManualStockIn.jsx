import React, { useState, useEffect } from 'react';
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
  InputNumber,
  Checkbox
} from 'antd';
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  DownloadOutlined,
  ReloadOutlined,
  SaveOutlined
} from '@ant-design/icons';

const { Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;

const ManualStockIn = () => {
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
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  
  // 物资选择相关状态
  const [materialSelectModalVisible, setMaterialSelectModalVisible] = useState(false);
  const [materialCatalog, setMaterialCatalog] = useState([]);
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [catalogSelectAll, setCatalogSelectAll] = useState(false);
  const [catalogCurrentPage, setCatalogCurrentPage] = useState(1);
  const [catalogPageSize, setCatalogPageSize] = useState(5);
  const [materialSearchForm] = Form.useForm();
  
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

  // 备注和提交单据相关状态
  const [remark, setRemark] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // 提交单据处理函数 - 页面级别
  const handleSubmitDocument = () => {
    // 检查是否有选中的入库单
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择要入库的单据');
      return;
    }

    // 获取选中的入库单数据
    const selectedDocuments = data.filter(item => selectedRowKeys.includes(item.key));
    
    if (selectedDocuments.length === 0) {
      message.warning('未找到选中的入库单数据');
      return;
    }

    setSubmitting(true);
    
    // 模拟提交过程
    setTimeout(() => {
      // 构建提交数据
      const submitData = {
        documents: selectedDocuments.map(doc => ({
          orderNumber: doc.orderNumber,
          productCode: doc.productCode,
          specification: doc.specification,
          model: doc.model,
          manufacturer: doc.manufacturer,
          supplierName: doc.supplierName,
          orderQuantity: doc.orderQuantity,
          instockQuantity: doc.instockQuantity,
          unit: doc.orderUnit,
          batchNumber: doc.batchNumber,
          productionDate: doc.productionDate,
          expiryDate: doc.expiryDate,
          purchasePrice: doc.purchasePrice,
          purchaseAmount: doc.purchaseAmount,
          department: doc.department
        })),
        remark: remark,
        submitTime: new Date().toISOString(),
        totalDocuments: selectedDocuments.length,
        totalItems: selectedDocuments.reduce((sum, doc) => sum + doc.instockQuantity, 0),
        totalAmount: selectedDocuments.reduce((sum, doc) => sum + doc.purchaseAmount, 0)
      };

      console.log('提交入库单据数据:', submitData);
      
      // 显示成功消息
      message.success(`入库单据提交成功！共${selectedDocuments.length}张单据，${submitData.totalItems}项物资，总金额：¥${submitData.totalAmount.toFixed(2)}`);
      
      // 重置状态
      setRemark('');
      setSubmitting(false);
      setSelectedRowKeys([]);
      
      // 可选：从数据中移除已提交的单据
      // const remainingData = data.filter(item => !selectedRowKeys.includes(item.key));
      // setData(remainingData);
      // setFilteredData(remainingData);
      // setPagination(prev => ({ ...prev, total: remainingData.length }));
      
    }, 1500);
  };

  // 物资选择相关函数
  const handleOpenMaterialSelect = () => {
    setMaterialSelectModalVisible(true);
    setFilteredMaterials([...materialCatalog]);
    materialSearchForm.resetFields();
    setCatalogSelectAll(false);
    setCatalogCurrentPage(1);
  };

  const handleCloseMaterialSelect = () => {
    setMaterialSelectModalVisible(false);
    setMaterialCatalog(materialCatalog.map(item => ({ ...item, selected: false, quantity: item.minOrderQuantity })));
    setCatalogSelectAll(false);
    setCatalogCurrentPage(1);
  };

  const handleMaterialCatalogSelect = (key) => {
    // 同时更新 materialCatalog 和 filteredMaterials
    const newCatalog = materialCatalog.map(item => 
      item.key === key ? { ...item, selected: !item.selected } : item
    );
    setMaterialCatalog(newCatalog);
    
    // 如果 filteredMaterials 不为空，也更新它
    if (filteredMaterials.length > 0) {
      const newFiltered = filteredMaterials.map(item => 
        item.key === key ? { ...item, selected: !item.selected } : item
      );
      setFilteredMaterials(newFiltered);
    }
    
    // 更新全选状态
    const displayData = filteredMaterials.length > 0 ? filteredMaterials : materialCatalog;
    const currentPageMaterials = displayData.slice((catalogCurrentPage - 1) * catalogPageSize, catalogCurrentPage * catalogPageSize);
    const allSelected = currentPageMaterials.length > 0 && currentPageMaterials.every(item => item.selected);
    setCatalogSelectAll(allSelected);
  };

  const handleCatalogSelectAll = () => {
    const newSelectAll = !catalogSelectAll;
    setCatalogSelectAll(newSelectAll);
    
    const startIndex = (catalogCurrentPage - 1) * catalogPageSize;
    const endIndex = catalogCurrentPage * catalogPageSize;
    
    // 更新 materialCatalog
    const newCatalog = materialCatalog.map((item) => {
      // 检查当前页面是否包含此 item
      const displayData = filteredMaterials.length > 0 ? filteredMaterials : materialCatalog;
      const currentPageItems = displayData.slice(startIndex, endIndex);
      const isInCurrentPage = currentPageItems.some(pageItem => pageItem.key === item.key);
      
      if (isInCurrentPage) {
        return { ...item, selected: newSelectAll };
      }
      return item;
    });
    setMaterialCatalog(newCatalog);
    
    // 更新 filteredMaterials
    if (filteredMaterials.length > 0) {
      const newFiltered = filteredMaterials.map((item) => {
        const displayData = filteredMaterials.length > 0 ? filteredMaterials : materialCatalog;
        const currentPageItems = displayData.slice(startIndex, endIndex);
        const isInCurrentPage = currentPageItems.some(pageItem => pageItem.key === item.key);
        
        if (isInCurrentPage) {
          return { ...item, selected: newSelectAll };
        }
        return item;
      });
      setFilteredMaterials(newFiltered);
    }
  };

  const handleConfirmMaterialSelection = () => {
    // 从显示的数据中获取选中的物资
    const displayData = filteredMaterials.length > 0 ? filteredMaterials : materialCatalog;
    const selectedMaterials = displayData.filter(item => item.selected);
    
    if (selectedMaterials.length === 0) {
      message.warning('请先选择物资');
      return;
    }
    
    // 将选中的物资添加到入库明细中
    const newData = [...data];
    selectedMaterials.forEach(selectedItem => {
      // 生成唯一的key
      const newKey = `${selectedItem.key}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // 添加新物资到入库明细
      newData.push({
        key: newKey,
        orderNumber: `PO-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${newData.length + 1}`,
        productCode: selectedItem.materialCode,
        specification: selectedItem.specification,
        model: selectedItem.model,
        manufacturer: selectedItem.manufacturer,
        supplierName: selectedItem.supplier,
        registrationNumber: `REG-${new Date().getFullYear()}-${newData.length + 1}`,
        orderQuantity: selectedItem.quantity,
        orderUnit: selectedItem.unit,
        instockQuantity: selectedItem.quantity,
        packUnit: selectedItem.unit,
        batchNumber: `BATCH${new Date().toISOString().slice(0, 10).replace(/-/g, '')}`,
        productionDate: moment().format('YYYY-MM-DD'),
        expiryDate: moment().add(1, 'year').format('YYYY-MM-DD'),
        purchasePrice: selectedItem.unitPrice,
        purchaseAmount: selectedItem.unitPrice * selectedItem.quantity,
        department: '采购部',
        createTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        remark: `从物资目录导入: ${selectedItem.materialName}`
      });
    });
    
    setData(newData);
    setFilteredData(newData);
    message.success(`已添加 ${selectedMaterials.length} 项物资到入库明细`);
    handleCloseMaterialSelect();
  };

  const handleSearchMaterials = (values) => {
    const filtered = materialCatalog.filter(item => {
      const matchesMaterialName = !values.materialName || item.materialName.includes(values.materialName);
      const matchesMaterialCode = !values.materialCode || item.materialCode.includes(values.materialCode);
      const matchesSpecification = !values.specification || item.specification.includes(values.specification);
      const matchesModel = !values.model || item.model.includes(values.model);
      const matchesManufacturer = !values.manufacturer || item.manufacturer.includes(values.manufacturer);
      const matchesSupplier = !values.supplier || item.supplier.includes(values.supplier);
      const matchesMaterialType = !values.materialType || item.materialType === values.materialType;
      
      return matchesMaterialName && matchesMaterialCode && matchesSpecification && 
             matchesModel && matchesManufacturer && matchesSupplier && matchesMaterialType;
    });
    
    setFilteredMaterials(filtered);
    setCatalogCurrentPage(1);
    setCatalogSelectAll(false);
  };

  const handleResetSearch = () => {
    materialSearchForm.resetFields();
    setFilteredMaterials([...materialCatalog]);
    setCatalogCurrentPage(1);
    setCatalogSelectAll(false);
  };

  const handleCatalogPageChange = (page, size) => {
    setCatalogCurrentPage(page);
    setCatalogPageSize(size);
    setCatalogSelectAll(false);
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
        const item = data.find(item => item.key === itemKey);
        
        if (field === 'instockQuantity' && item) {
          const validation = validateInstockQuantity(value, item.orderQuantity);
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
      
      return newEditValues;
    });
  };

  // 初始化数据
  // 初始化物资目录数据
  useEffect(() => {
    const materialCatalogData = [
      {
        key: '1',
        materialCode: 'MAT001',
        materialName: '医用口罩',
        specification: 'N95',
        model: 'N95-001',
        manufacturer: '医疗用品有限公司',
        supplier: '医疗用品供应商',
        materialType: '低值耗材',
        minPackage: '10只/盒',
        minOrderQuantity: 1,
        quantity: 1,
        selected: false,
        unit: '盒',
        unitPrice: 25.00,
        stock: 100
      },
      {
        key: '2',
        materialCode: 'MAT002',
        materialName: '医用防护服',
        specification: 'L号',
        model: 'PF-202',
        manufacturer: '防护设备制造厂',
        supplier: '防护用品供应商',
        materialType: '高值耗材',
        minPackage: '1件/袋',
        minOrderQuantity: 1,
        quantity: 1,
        selected: false,
        unit: '件',
        unitPrice: 85.00,
        stock: 50
      },
      {
        key: '3',
        materialCode: 'MAT003',
        materialName: '医用手套',
        specification: '乳胶',
        model: 'GL-301',
        manufacturer: '乳胶制品厂',
        supplier: '医疗耗材供应商',
        materialType: '低值耗材',
        minPackage: '100双/箱',
        minOrderQuantity: 1,
        quantity: 10,
        selected: false,
        unit: '双',
        unitPrice: 3.50,
        stock: 200
      },
      {
        key: '4',
        materialCode: 'MAT004',
        materialName: '消毒液',
        specification: '500ml',
        model: 'DL-450',
        manufacturer: '消毒制品公司',
        supplier: '清洁用品供应商',
        materialType: '试剂',
        minPackage: '12瓶/箱',
        minOrderQuantity: 1,
        quantity: 5,
        selected: false,
        unit: '瓶',
        unitPrice: 18.00,
        stock: 80
      },
      {
        key: '5',
        materialCode: 'MAT005',
        materialName: '体温计',
        specification: '电子',
        model: 'TM-550',
        manufacturer: '医疗器械公司',
        supplier: '医疗设备供应商',
        materialType: '高值耗材',
        minPackage: '1支/盒',
        minOrderQuantity: 1,
        quantity: 2,
        selected: false,
        unit: '支',
        unitPrice: 32.00,
        stock: 60
      }
    ];
    
    setMaterialCatalog(materialCatalogData);
    setFilteredMaterials(materialCatalogData);
    
    const mockData = [
      {
        key: '1',
        orderNumber: 'PO-20260115-001',
        productCode: 'PROD001',
        specification: '一次性医用口罩',
        model: 'MASK-001',
        manufacturer: '口罩制造厂A',
        supplierName: '医疗用品供应商A',
        registrationNumber: 'REG-2024-001',
        orderQuantity: 1000,
        orderUnit: '个',
        instockQuantity: 1000,
        packUnit: '箱',
        batchNumber: 'BATCH20260115',
        productionDate: '2026-01-01',
        expiryDate: '2027-01-01',
        purchasePrice: 1.50,
        purchaseAmount: 1500.00,
        department: '采购部',
        createTime: '2026-01-15 10:30:00',
        remark: '手动入库测试'
      },
      {
        key: '2',
        orderNumber: 'PO-20260115-002',
        productCode: 'PROD002',
        specification: '乳胶手套',
        model: 'GLOVE-001',
        manufacturer: '手套制造厂B',
        supplierName: '医疗用品供应商B',
        registrationNumber: 'REG-2024-002',
        orderQuantity: 500,
        orderUnit: '双',
        instockQuantity: 500,
        packUnit: '盒',
        batchNumber: 'BATCH20260114',
        productionDate: '2026-01-01',
        expiryDate: '2027-01-01',
        purchasePrice: 3.00,
        purchaseAmount: 1500.00,
        department: '检验科',
        createTime: '2026-01-15 11:15:00',
        remark: '检验科专用'
      },
      {
        key: '3',
        orderNumber: 'PO-20260115-003',
        productCode: 'PROD003',
        specification: '500ml/瓶',
        model: 'DISINFECT-001',
        manufacturer: '消毒液制造厂C',
        supplierName: '消毒用品供应商C',
        registrationNumber: 'REG-2024-003',
        orderQuantity: 200,
        orderUnit: '瓶',
        instockQuantity: 200,
        packUnit: '箱',
        batchNumber: 'BATCH20260113',
        productionDate: '2026-01-01',
        expiryDate: '2027-01-01',
        purchasePrice: 15.00,
        purchaseAmount: 3000.00,
        department: '手术室',
        createTime: '2026-01-15 14:20:00',
        remark: '手术室专用消毒'
      }
    ];
    
    setData(mockData);
    setFilteredData(mockData);
    setPagination(prev => ({
      ...prev,
      total: mockData.length
    }));
  }, []);

  // 处理搜索
  const handleSearch = (values) => {
    let filtered = [...data];
    
    if (values.orderNumber) {
      filtered = filtered.filter(item => 
        item.orderNumber.toLowerCase().includes(values.orderNumber.toLowerCase())
      );
    }
    
    if (values.productCode) {
      filtered = filtered.filter(item => 
        item.productCode.toLowerCase().includes(values.productCode.toLowerCase())
      );
    }
    
    if (values.supplierName) {
      filtered = filtered.filter(item => 
        item.supplierName.toLowerCase().includes(values.supplierName.toLowerCase())
      );
    }
    
    setFilteredData(filtered);
    setPagination(prev => ({
      ...prev,
      current: 1,
      total: filtered.length,
    }));
  };

  // 重置搜索
  const handleReset = () => {
    searchForm.resetFields();
    setFilteredData(data);
    message.success('搜索条件已重置');
  };

  // 处理新增
  const handleAdd = () => {
    setIsEditMode(false);
    form.resetFields();
    setSelectedItem(null);
    setIsModalVisible(true);
  };

  // 处理编辑
  const handleEdit = (record) => {
    setIsEditMode(true);
    setSelectedItem(record);
    form.setFieldsValue({
      ...record,
      productionDate: record.productionDate ? moment(record.productionDate) : null,
      expiryDate: record.expiryDate ? moment(record.expiryDate) : null
    });
    setIsModalVisible(true);
  };

  // 处理删除
  const handleDelete = (record) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除入库单 ${record.stockInNumber} 吗？`,
      onOk: () => {
        const newData = data.filter(item => item.key !== record.key);
        setData(newData);
        setFilteredData(newData);
        setPagination(prev => ({
          ...prev,
          total: newData.length
        }));
        message.success('入库单已删除');
      }
    });
  };

  // 处理批量删除
  const handleBatchDelete = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要删除的记录');
      return;
    }
    
    Modal.confirm({
      title: '确认批量删除',
      content: `确定要删除选中的 ${selectedRowKeys.length} 条记录吗？`,
      onOk: () => {
        const newData = data.filter(item => !selectedRowKeys.includes(item.key));
        setData(newData);
        setFilteredData(newData);
        setSelectedRowKeys([]);
        setPagination(prev => ({
          ...prev,
          total: newData.length
        }));
        message.success(`成功删除 ${selectedRowKeys.length} 条记录`);
      }
    });
  };

  // 处理保存
  const handleSave = () => {
    form.validateFields().then(values => {
      setLoading(true);
      
      // 模拟API调用
      setTimeout(() => {
        const newItem = {
          key: isEditMode ? selectedItem.key : `new-${Date.now()}`,
          stockInNumber: values.stockInNumber,
          productCode: values.productCode,
          productName: values.productName,
          specification: values.specification,
          model: values.model,
          manufacturer: values.manufacturer,
          supplierName: values.supplierName,
          registrationNumber: values.registrationNumber,
          orderQuantity: values.orderQuantity,
          orderUnit: values.orderUnit,
          stockInQuantity: values.stockInQuantity,
          packageUnit: values.packageUnit,
          batchNumber: values.batchNumber,
          productionDate: values.productionDate ? values.productionDate.format('YYYY-MM-DD') : '',
          expiryDate: values.expiryDate ? values.expiryDate.format('YYYY-MM-DD') : '',
          purchasePrice: values.purchasePrice,
          purchaseAmount: values.purchaseAmount,
          department: values.department,
          createTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
          remark: values.remark,
          status: '已入库'
        };
        
        if (isEditMode) {
          const newData = data.map(item => 
            item.key === selectedItem.key ? newItem : item
          );
          setData(newData);
          setFilteredData(newData);
          message.success('入库单已更新');
        } else {
          const newData = [newItem, ...data];
          setData(newData);
          setFilteredData(newData);
          setPagination(prev => ({
            ...prev,
            total: newData.length
          }));
          message.success('入库单已创建');
        }
        
        setLoading(false);
        setIsModalVisible(false);
        form.resetFields();
      }, 1000);
    }).catch(error => {
      console.error('表单验证失败:', error);
    });
  };

  // 表格列配置
  const columns = [
    {
      title: '订单号',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      width: 180,
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: '物资编码',
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
              format="YYYY年MM月DD日"
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
              format="YYYY年MM月DD日"
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

  // 表格行选择配置
  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  return (
    <div style={{ padding: '0 16px' }}>
      <h1 style={{ marginBottom: 24 }}>初始化入库</h1>
      
      {/* 搜索区域 */}
      <Card style={{ marginBottom: 24 }}>
        <Form
          form={searchForm}
          layout="vertical"
          onFinish={handleSearch}
        >
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item name="orderNumber" label="订单号">
                <Input placeholder="请输入订单号" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="productCode" label="物资编码">
                <Input placeholder="请输入物资编码" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="supplierName" label="供应商名称">
                <Input placeholder="请输入供应商名称" />
              </Form.Item>
            </Col>
          </Row>
          
          <Row>
            <Col span={24} style={{ textAlign: 'right' }}>
              <Space>
                <Button type="primary" icon={<SearchOutlined />} htmlType="submit">
                  查询
                </Button>
                <Button onClick={handleReset}>
                  重置
                </Button>
                <Button icon={<ReloadOutlined />} onClick={() => {
                  setFilteredData(data);
                  searchForm.resetFields();
                }}>
                  刷新
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>
      
      {/* 初始化入库列表 */}
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Space>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenMaterialSelect}>
              新增入库
            </Button>
            <Button 
              type="default" 
              danger 
              icon={<DeleteOutlined />}
              onClick={handleBatchDelete}
              disabled={selectedRowKeys.length === 0}
            >
              批量删除
            </Button>
            <Button icon={<DownloadOutlined />}>
              导出数据
            </Button>
          </Space>
        </div>
        
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
      </Card>

      {/* 页面底部备注框和提交按钮 */}
      <Card style={{ marginTop: 24 }}>
        {/* 文字备注框 */}
        <div style={{ 
          marginBottom: 24,
          padding: '16px',
          border: '1px solid #f0f0f0',
          borderRadius: 8,
          backgroundColor: '#fafafa'
        }}>
          <div style={{ 
            fontWeight: '500', 
            marginBottom: 12,
            color: '#333',
            fontSize: '16px'
          }}>
            入库备注
          </div>
          <TextArea
            placeholder="请输入入库备注信息，例如：特殊存储要求、验收注意事项、供应商特殊说明等"
            rows={4}
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            style={{ 
              width: '100%',
              resize: 'vertical',
              fontSize: '14px'
            }}
          />
        </div>

        {/* 提交单据按钮 */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          marginTop: 24
        }}>
          <Button 
            type="primary" 
            onClick={handleSubmitDocument}
            loading={submitting}
          >
            提交入库单据
          </Button>
        </div>
      </Card>
      
      {/* 新增/编辑模态框 */}
      <Modal
        title={isEditMode ? '编辑入库单' : '新增入库单'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        width={800}
        footer={[
          <Button key="cancel" onClick={() => setIsModalVisible(false)}>
            取消
          </Button>,
          <Button key="save" type="primary" icon={<SaveOutlined />} onClick={handleSave} loading={loading}>
            保存
          </Button>
        ]}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item 
                name="orderNumber" 
                label="订单号" 
                rules={[{ required: true, message: '请输入订单号' }]}
              >
                <Input placeholder="请输入订单号" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item 
                name="productCode" 
                label="物资编码" 
                rules={[{ required: true, message: '请输入物资编码' }]}
              >
                <Input placeholder="请输入物资编码" />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item 
                name="specification" 
                label="规格" 
                rules={[{ required: true, message: '请输入规格' }]}
              >
                <Input placeholder="请输入规格" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item 
                name="model" 
                label="型号" 
                rules={[{ required: true, message: '请输入型号' }]}
              >
                <Input placeholder="请输入型号" />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item 
                name="model" 
                label="型号" 
                rules={[{ required: true, message: '请输入型号' }]}
              >
                <Input placeholder="请输入型号" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item 
                name="manufacturer" 
                label="生产厂家" 
                rules={[{ required: true, message: '请输入生产厂家' }]}
              >
                <Input placeholder="请输入生产厂家" />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item 
                name="supplierName" 
                label="供应商" 
                rules={[{ required: true, message: '请输入供应商' }]}
              >
                <Input placeholder="请输入供应商" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item 
                name="registrationNumber" 
                label="注册证号" 
                rules={[{ required: true, message: '请输入注册证号' }]}
              >
                <Input placeholder="请输入注册证号" />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item 
                name="orderQuantity" 
                label="订货数量" 
                rules={[{ required: true, message: '请输入订货数量' }]}
              >
                <InputNumber 
                  style={{ width: '100%' }}
                  min={1}
                  precision={0}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item 
                name="orderUnit" 
                label="订货单位" 
                rules={[{ required: true, message: '请输入订货单位' }]}
              >
                <Input placeholder="请输入订货单位" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item 
                name="instockQuantity" 
                label="入库数量" 
                rules={[{ required: true, message: '请输入入库数量' }]}
              >
                <InputNumber 
                  style={{ width: '100%' }}
                  min={1}
                  precision={0}
                />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item 
                name="packUnit" 
                label="打包单位" 
                rules={[{ required: true, message: '请输入打包单位' }]}
              >
                <Input placeholder="请输入打包单位" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item 
                name="batchNumber" 
                label="批号" 
                rules={[{ required: true, message: '请输入批号' }]}
              >
                <Input placeholder="请输入批号" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item 
                name="department" 
                label="申领科室" 
                rules={[{ required: true, message: '请输入申领科室' }]}
              >
                <Select placeholder="请选择申领科室">
                  <Option value="采购部">采购部</Option>
                  <Option value="检验科">检验科</Option>
                  <Option value="手术室">手术室</Option>
                  <Option value="急诊科">急诊科</Option>
                  <Option value="内科">内科</Option>
                  <Option value="外科">外科</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item 
                name="productionDate" 
                label="生产日期"
              >
                <DatePicker style={{ width: '100%' }} format="YYYY年MM月DD日" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item 
                name="expiryDate" 
                label="失效日期"
              >
                <DatePicker style={{ width: '100%' }} format="YYYY年MM月DD日" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item 
                name="purchasePrice" 
                label="采购单价" 
                rules={[{ required: true, message: '请输入采购单价' }]}
              >
                <InputNumber 
                  style={{ width: '100%' }}
                  min={0}
                  precision={2}
                  formatter={value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/¥\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item 
                name="purchaseAmount" 
                label="采购金额" 
                rules={[{ required: true, message: '请输入采购金额' }]}
              >
                <InputNumber 
                  style={{ width: '100%' }}
                  min={0}
                  precision={2}
                  formatter={value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/¥\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item 
            name="remark" 
            label="备注"
          >
            <TextArea rows={3} placeholder="请输入备注信息" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 物资选择弹窗 */}
      <Modal
        title="选择耗材物资"
        open={materialSelectModalVisible}
        onCancel={handleCloseMaterialSelect}
        width={1400}
        footer={null}
        style={{ top: 20 }}
      >
        {/* 顶部检索框 */}
        <Card 
          style={{ 
            marginBottom: 16,
            borderRadius: 8,
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
          }}
        >
          <Form 
            form={materialSearchForm} 
            layout="inline" 
            onFinish={handleSearchMaterials}
          >
            <Row gutter={[12, 12]} style={{ width: '100%' }}>
              <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                <Form.Item name="materialName" style={{ width: '100%', marginBottom: 0 }}>
                  <Input 
                    placeholder="物资名称" 
                    allowClear
                    style={{ width: '100%' }}
                    size="middle"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                <Form.Item name="materialCode" style={{ width: '100%', marginBottom: 0 }}>
                  <Input 
                    placeholder="物资编码" 
                    allowClear
                    style={{ width: '100%' }}
                    size="middle"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                <Form.Item name="specification" style={{ width: '100%', marginBottom: 0 }}>
                  <Input 
                    placeholder="规格" 
                    allowClear
                    style={{ width: '100%' }}
                    size="middle"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                <Form.Item name="model" style={{ width: '100%', marginBottom: 0 }}>
                  <Input 
                    placeholder="型号" 
                    allowClear
                    style={{ width: '100%' }}
                    size="middle"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                <Form.Item name="manufacturer" style={{ width: '100%', marginBottom: 0 }}>
                  <Input 
                    placeholder="生产厂家" 
                    allowClear
                    style={{ width: '100%' }}
                    size="middle"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                <Form.Item name="supplier" style={{ width: '100%', marginBottom: 0 }}>
                  <Input 
                    placeholder="供应商" 
                    allowClear
                    style={{ width: '100%' }}
                    size="middle"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                <Form.Item name="materialType" style={{ width: '100%', marginBottom: 0 }}>
                  <Select 
                    placeholder="物资类型" 
                    allowClear
                    style={{ width: '100%' }}
                    size="middle"
                    options={[
                      { value: '试剂', label: '试剂' },
                      { value: '低值耗材', label: '低值耗材' },
                      { value: '高值耗材', label: '高值耗材' }
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={24} lg={24} xl={24} style={{ textAlign: 'right' }}>
                <Form.Item style={{ marginBottom: 0 }}>
                  <Space size="middle">
                    <Button 
                      type="primary" 
                      htmlType="submit"
                      style={{ minWidth: 90 }}
                    >
                      查询
                    </Button>
                    <Button 
                      onClick={handleResetSearch}
                      style={{ minWidth: 90 }}
                    >
                      重置
                    </Button>
                  </Space>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>

        {/* 物资目录表单 */}
        <div style={{ 
          overflowX: 'auto', 
          marginBottom: 16,
          border: '1px solid #f0f0f0',
          borderRadius: 8
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#fafafa' }}>
                <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '60px' }}>
                  <Checkbox 
                    checked={catalogSelectAll}
                    onChange={handleCatalogSelectAll}
                  />
                </th>
                <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '100px' }}>物资编码</th>
                <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '150px' }}>物资名称</th>
                <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '100px' }}>规格</th>
                <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '100px' }}>型号</th>
                <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '120px' }}>生产厂家</th>
                <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '120px' }}>供应商</th>
                <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '100px' }}>物资类型</th>
                <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '120px' }}>最小包装</th>
                <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '100px' }}>起订量</th>
                <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '120px' }}>数量</th>
                <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '100px' }}>单位</th>
                <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '100px' }}>单价</th>
                <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '100px' }}>剩余库存</th>
              </tr>
            </thead>
            <tbody>
              {(filteredMaterials.length > 0 ? filteredMaterials : materialCatalog)
                .slice((catalogCurrentPage - 1) * catalogPageSize, catalogCurrentPage * catalogPageSize)
                .map(item => (
                <tr key={item.key} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>
                    <Checkbox 
                      checked={item.selected}
                      onChange={() => handleMaterialCatalogSelect(item.key)}
                    />
                  </td>
                  <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>{item.materialCode}</td>
                  <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>{item.materialName}</td>
                  <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>{item.specification}</td>
                  <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>{item.model}</td>
                  <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>{item.manufacturer}</td>
                  <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>{item.supplier}</td>
                  <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>{item.materialType}</td>
                  <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>{item.minPackage}</td>
                  <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>{item.minOrderQuantity}</td>
                  <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>
                    <InputNumber
                      min={item.minOrderQuantity}
                      value={item.quantity}
                      onChange={(value) => {
                        const newCatalog = materialCatalog.map(catalogItem => 
                          catalogItem.key === item.key ? { ...catalogItem, quantity: value } : catalogItem
                        );
                        setMaterialCatalog(newCatalog);
                        
                        if (filteredMaterials.length > 0) {
                          const newFiltered = filteredMaterials.map(filteredItem => 
                            filteredItem.key === item.key ? { ...filteredItem, quantity: value } : filteredItem
                          );
                          setFilteredMaterials(newFiltered);
                        }
                      }}
                      style={{ width: '80px' }}
                    />
                  </td>
                  <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>{item.unit}</td>
                  <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>¥{item.unitPrice?.toFixed(2)}</td>
                  <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>{item.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 分页 */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Button 
              onClick={() => handleCatalogPageChange(catalogCurrentPage - 1, catalogPageSize)}
              disabled={catalogCurrentPage === 1}
            >
              上一页
            </Button>
            <span>第 {catalogCurrentPage} 页</span>
            <Button 
              onClick={() => handleCatalogPageChange(catalogCurrentPage + 1, catalogPageSize)}
              disabled={catalogCurrentPage * catalogPageSize >= (filteredMaterials.length > 0 ? filteredMaterials.length : materialCatalog.length)}
            >
              下一页
            </Button>
            <span>共 {Math.ceil((filteredMaterials.length > 0 ? filteredMaterials.length : materialCatalog.length) / catalogPageSize)} 页</span>
          </div>
        </div>

        {/* 底部按钮 */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          gap: 12,
          paddingTop: 20,
          borderTop: '1px solid #f0f0f0'
        }}>
          <Button 
            onClick={handleCloseMaterialSelect}
            style={{ 
              minWidth: '80px',
              height: '36px'
            }}
          >
            关闭
          </Button>
          <Button 
            type="primary" 
            onClick={handleConfirmMaterialSelection}
            style={{ 
              minWidth: '80px',
              height: '36px',
              backgroundColor: '#1890ff',
              borderColor: '#1890ff'
            }}
          >
            确定
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default ManualStockIn;