import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Input, 
  Select, 
  Space, 
  Form, 
  Row, 
  Col, 
  message,
  Tag,
  Checkbox,
  Modal,
  InputNumber,
  Pagination,
  Divider,
  DatePicker
} from 'antd';
import zhCN from 'antd/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import { 
  PlusOutlined,
  SearchOutlined,
  ReloadOutlined,
  DeleteOutlined,
  ExportOutlined
} from '@ant-design/icons';
import api from '../utils/api.js';

const PurchaseOrderRequest = () => {
  // 配置dayjs使用中文
  dayjs.locale('zh-cn');
  
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [materialSelectModalVisible, setMaterialSelectModalVisible] = useState(false);
  const [materials, setMaterials] = useState([]);
  const [viewMode, setViewMode] = useState('summary'); // 'detail' 或 'summary'
  const [hasSelectedView, setHasSelectedView] = useState(false); // 是否已选择视图
  const [selectedDetailKeys, setSelectedDetailKeys] = useState([]); // 采购明细弹窗中选中的商品明细行
  
  // 物资目录数据（用于选择弹窗，从后端加载）
  const [materialCatalog, setMaterialCatalog] = useState([]);
  
  // 搜索表单状态
  const [searchForm] = Form.useForm();
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [catalogSelectAll, setCatalogSelectAll] = useState(false);
  const [catalogCurrentPage, setCatalogCurrentPage] = useState(1);
  const [catalogPageSize, setCatalogPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [selectAll, setSelectAll] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [currentOrderDetails, setCurrentOrderDetails] = useState(null);
  const [editingDetails, setEditingDetails] = useState([]); // 编辑中的商品明细数据
  const [loading, setLoading] = useState(false);
  const [submittingAction, setSubmittingAction] = useState(null);
  const [detailSubmittingAction, setDetailSubmittingAction] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  // 新建采购申请表单字段
  const [newOrderForm] = Form.useForm();

  const getCurrentRequesterInfo = () => {
    let userInfo = {};
    try {
      userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    } catch {
      userInfo = {};
    }

    const currentDepartmentId = localStorage.getItem('currentDepartmentId');
    const currentDepartmentName = localStorage.getItem('currentDepartment');
    const operatorName = userInfo.realName || userInfo.name || userInfo.userName || '管理员';

    return {
      operatorName,
      departmentId: currentDepartmentId ? Number(currentDepartmentId) : undefined,
      departmentName: currentDepartmentName || undefined,
    };
  };

  const resolveDepartmentName = (departmentId) => {
    const matchedDepartment = departments.find(d => Number(d.id) === Number(departmentId));
    if (matchedDepartment?.name) {
      return matchedDepartment.name;
    }
    const requester = getCurrentRequesterInfo();
    if (Number(requester.departmentId) === Number(departmentId) && requester.departmentName) {
      return requester.departmentName;
    }
    return departmentId ? String(departmentId) : '';
  };

  // 加载物资目录（从后端）
  const loadMaterialCatalog = async () => {
    try {
      const response = await api.get('/api/scm/materials/enabled');
      if (response.code === 1 && response.data) {
        const catalog = response.data.map(m => ({
          key: String(m.id),
          materialCode: m.materialCode,
          materialName: m.name,
          specification: m.specification,
          model: m.model,
          manufacturer: m.manufacturer,
          supplier: m.supplierName,
          supplierId: m.supplierId,
          materialType: m.materialType,
          minPackage: m.minPackage,
          minOrderQuantity: 1,
          quantity: 1,
          selected: false,
          unit: m.unit,
          unitPrice: parseFloat(m.purchasePrice) || 0,
          stock: 0,
          registrationNumber: m.registrationNumber
        }));
        setMaterialCatalog(catalog);
        setFilteredMaterials(catalog);
      }
    } catch (error) {
      console.error('加载物资目录失败:', error);
    }
  };

  // 加载供应商列表
  const loadSuppliers = async () => {
    try {
      const response = await api.get('/api/scm/suppliers');
      if (response.code === 1 && response.data) {
        setSuppliers(response.data.records || []);
      }
    } catch (error) {
      console.error('加载供应商失败:', error);
    }
  };

  // 初始化数据
  useEffect(() => {
    loadPurchaseOrders();
    loadDepartments();
    loadMaterialCatalog();
    loadSuppliers();
  }, []);

  // 加载采购订单列表
  const loadPurchaseOrders = async (currentPage = pagination.current, currentSize = pagination.pageSize) => {
    try {
      setLoading(true);
      const values = searchForm.getFieldsValue();
      const params = {
        pageNum: currentPage,
        pageSize: currentSize,
        orderNumber: values.orderNumber,
        productCode: values.materialCode,
        productName: values.materialName,
        createTime: values.createTime ? values.createTime.format('YYYY-MM-DD') : undefined
      };
      const response = await api.get('/api/scm/purchases/orders', params);
      if (response.code === 1 && response.data) {
        const orderList = response.data.records.map(order => ({
          key: order.id,
          orderNumber: order.orderNumber,
          createTime: order.createTime,
          status: order.status,
          supplier: order.supplierName,
          department: order.departmentName,
          totalAmount: order.totalAmount,
          itemCount: order.itemCount,
          operator: order.operatorName,
          planType: order.planType,
          details: (order.details || []).map(item => ({
            key: item.id,
            materialCode: item.materialCode,
            materialName: item.materialName,
            materialType: item.materialType,
            unit: item.unit,
            unitPrice: item.unitPrice,
            quantity: item.quantity,
            amount: item.amount,
            specification: item.specification,
            model: item.model
          }))
        }));
        setPurchaseOrders(orderList);
        setPagination(prev => ({
          ...prev,
          total: response.data.total
        }));
      } else {
        messageApi.error(response.message || '加载采购订单失败');
      }
    } catch (error) {
      console.error('加载采购订单失败:', error);
      messageApi.error('加载采购订单失败，请检查网络连接或联系管理员');
    } finally {
      setLoading(false);
    }
  };

  const [remark, setRemark] = useState('');
  const [departments, setDepartments] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);

  // 加载部门列表
  const loadDepartments = async () => {
    try {
      const response = await api.get('/api/department/list');
      if (response.code === 1 && response.data && response.data.length > 0) {
        setDepartments(response.data.map(d => ({ id: d.id, name: d.deptName || d.name })));
        return;
      }
    } catch (error) {
      console.error('加载部门列表失败:', error);
    }
    // 后端无数据时使用默认值
    setDepartments([
      { id: 1, name: '内科' },
      { id: 2, name: '外科' },
      { id: 3, name: '儿科' },
      { id: 4, name: '妇产科' },
      { id: 5, name: '急诊科' },
      { id: 6, name: '运营组' }
    ]);
  };
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 3
  });

  const statusOptions = [
    { value: 'all', label: '全部' },
    { value: 'terminated', label: '已终止' },
    { value: 'pending', label: '待提交' },
    { value: 'approved', label: '待审核' },
    { value: 'shipping', label: '待发货' },
    { value: 'receiving', label: '待收货' },
    { value: 'completed', label: '已完成' }
  ];

  const departmentOptions = [
    { value: 'all', label: '全部' },
    { value: '内科', label: '内科' },
    { value: '外科', label: '外科' },
    { value: '儿科', label: '儿科' },
    { value: '妇产科', label: '妇产科' },
    { value: '急诊科', label: '急诊科' }
  ];

  const handleSearch = (values) => {
    setPagination(prev => ({ ...prev, current: 1 }));
    loadPurchaseOrders(1);
  };

  const handleReset = () => {
    searchForm.resetFields();
    messageApi.info('搜索条件已重置');
    loadPurchaseOrders();
  };

  const handleNewRequest = () => {
    const requester = getCurrentRequesterInfo();
    newOrderForm.setFieldsValue({
      departmentId: requester.departmentId,
      operatorName: requester.operatorName,
      planType: 'monthly'
    });
    setModalVisible(true);
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    setMaterials(materials.map(item => ({ ...item, selected: false, quantity: 1 })));
    setSelectAll(false);
    setCurrentPage(1);
    setRemark('');
    newOrderForm.resetFields();
  };

  const handleMaterialSelect = (key) => {
    const newMaterials = materials.map(item => 
      item.key === key ? { ...item, selected: !item.selected } : item
    );
    setMaterials(newMaterials);
    
    // 更新全选状态
    const currentPageMaterials = newMaterials.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    const allSelected = currentPageMaterials.length > 0 && currentPageMaterials.every(item => item.selected);
    setSelectAll(allSelected);
  };

  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = currentPage * pageSize;
    
    setMaterials(materials.map((item, index) => 
      index >= startIndex && index < endIndex ? { ...item, selected: newSelectAll } : item
    ));
  };

  const handleQuantityChange = (key, value) => {
    setMaterials(materials.map(item => 
      item.key === key ? { ...item, quantity: value || 1 } : item
    ));
  };

  const handlePackageUnitChange = (key, value) => {
    setMaterials(materials.map(item => 
      item.key === key ? { ...item, packageUnit: value } : item
    ));
  };

  const handleDeleteMaterial = (key) => {
    setMaterials(materials.filter(item => item.key !== key));
  };

  const handleSave = async () => {
    if (submittingAction) return;
    const selectedMaterials = materials.filter(item => item.selected);
    if (selectedMaterials.length === 0) {
      messageApi.warning('请至少选择一项物资');
      return;
    }

    let formValues;
    try {
      formValues = await newOrderForm.validateFields();
    } catch {
      return;
    }

    // 按供应商分组
    const supplierGroups = {};
    selectedMaterials.forEach(item => {
      const sid = item.supplierId || 0;
      if (!supplierGroups[sid]) {
        supplierGroups[sid] = { supplier: item.supplier, supplierId: sid, items: [] };
      }
      supplierGroups[sid].items.push(item);
    });

    try {
      setSubmittingAction('save');
      let savedCount = 0;
      for (const group of Object.values(supplierGroups)) {
        const purchaseData = {
          departmentId: formValues.departmentId,
          departmentName: resolveDepartmentName(formValues.departmentId),
          supplierId: group.supplierId,
          operatorName: formValues.operatorName || getCurrentRequesterInfo().operatorName,
          planType: formValues.planType || 'monthly',
          remark: remark,
          items: group.items.map(item => ({
            materialId: parseInt(item.key),
            quantity: item.quantity
          }))
        };

        const response = await api.post('/api/scm/purchases/orders', purchaseData);
        if (response.code === 1) {
          savedCount++;
        } else {
          messageApi.error(`供应商 ${group.supplier || '未知'} 的订单保存失败: ${response.message}`);
        }
      }
      if (savedCount > 0) {
        messageApi.success(`已按供应商拆分保存 ${savedCount} 个采购单，共 ${selectedMaterials.length} 项物资`);
        handleModalCancel();
        loadPurchaseOrders();
      }
    } catch (error) {
      console.error('保存采购订单失败:', error);
      messageApi.error('保存失败，请检查网络连接或联系管理员');
    } finally {
      setSubmittingAction(null);
    }
  };

  const handleSubmit = async () => {
    if (submittingAction) return;
    const selectedMaterials = materials.filter(item => item.selected);
    if (selectedMaterials.length === 0) {
      messageApi.warning('请至少选择一项物资');
      return;
    }

    let formValues;
    try {
      formValues = await newOrderForm.validateFields();
    } catch {
      return;
    }

    // 按供应商分组
    const supplierGroups = {};
    selectedMaterials.forEach(item => {
      const sid = item.supplierId || 0;
      if (!supplierGroups[sid]) {
        supplierGroups[sid] = { supplier: item.supplier, supplierId: sid, items: [] };
      }
      supplierGroups[sid].items.push(item);
    });

    try {
      setSubmittingAction('submit');
      const operatorName = formValues.operatorName || getCurrentRequesterInfo().operatorName;
      let submittedCount = 0;
      for (const group of Object.values(supplierGroups)) {
        const purchaseData = {
          departmentId: formValues.departmentId,
          departmentName: resolveDepartmentName(formValues.departmentId),
          supplierId: group.supplierId,
          operatorName: operatorName,
          planType: formValues.planType || 'monthly',
          remark: remark,
          items: group.items.map(item => ({
            materialId: parseInt(item.key),
            quantity: item.quantity
          }))
        };

        const response = await api.post('/api/scm/purchases/orders', purchaseData);
        if (response.code === 1) {
          const submitResponse = await api.post(`/api/scm/purchases/orders/${response.data.id}/submit?operatorName=${encodeURIComponent(operatorName)}`);
          if (submitResponse.code === 1) {
            submittedCount++;
          } else {
            messageApi.error(`供应商 ${group.supplier || '未知'} 的订单提交失败: ${submitResponse.message}`);
          }
        } else {
          messageApi.error(`供应商 ${group.supplier || '未知'} 的订单保存失败: ${response.message}`);
        }
      }
      if (submittedCount > 0) {
        messageApi.success(`已按供应商拆分提交 ${submittedCount} 个采购单，共 ${selectedMaterials.length} 项物资`);
        handleModalCancel();
        loadPurchaseOrders();
      }
    } catch (error) {
      console.error('提交采购订单失败:', error);
      messageApi.error('提交失败，请检查网络连接或联系管理员');
    } finally {
      setSubmittingAction(null);
    }
  };

  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
    setSelectAll(false);
  };

  // 物资选择弹窗相关方法
  const handleOpenMaterialSelect = () => {
    setMaterialSelectModalVisible(true);
    setFilteredMaterials([...materialCatalog]);
    searchForm.resetFields();
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
      return isInCurrentPage ? { ...item, selected: newSelectAll } : item;
    });
    setMaterialCatalog(newCatalog);
    
    // 如果 filteredMaterials 不为空，也更新它
    if (filteredMaterials.length > 0) {
      const newFiltered = filteredMaterials.map((item, index) => 
        index >= startIndex && index < endIndex ? { ...item, selected: newSelectAll } : item
      );
      setFilteredMaterials(newFiltered);
    }
  };

  const handleCatalogQuantityChange = (key, value) => {
    // 更新 materialCatalog
    const newCatalog = materialCatalog.map(item => 
      item.key === key ? { ...item, quantity: value || item.minOrderQuantity } : item
    );
    setMaterialCatalog(newCatalog);
    
    // 如果 filteredMaterials 不为空，也更新它
    if (filteredMaterials.length > 0) {
      const newFiltered = filteredMaterials.map(item => 
        item.key === key ? { ...item, quantity: value || item.minOrderQuantity } : item
      );
      setFilteredMaterials(newFiltered);
    }
  };

  const handleSearchMaterials = (values) => {
    let filtered = [...materialCatalog];
    
    if (values.materialName) {
      filtered = filtered.filter(item => item.materialName.includes(values.materialName));
    }
    if (values.materialCode) {
      filtered = filtered.filter(item => item.materialCode.includes(values.materialCode));
    }
    if (values.specification) {
      filtered = filtered.filter(item => item.specification.includes(values.specification));
    }
    if (values.model) {
      filtered = filtered.filter(item => item.model.includes(values.model));
    }
    if (values.manufacturer) {
      filtered = filtered.filter(item => item.manufacturer.includes(values.manufacturer));
    }
    if (values.supplier) {
      filtered = filtered.filter(item => item.supplier.includes(values.supplier));
    }
    if (values.materialType) {
      filtered = filtered.filter(item => item.materialType === values.materialType);
    }
    
    setFilteredMaterials(filtered);
    setCatalogCurrentPage(1);
    setCatalogSelectAll(false);
    messageApi.info(`找到 ${filtered.length} 条记录`);
  };

  const handleResetSearch = () => {
    searchForm.resetFields();
    setFilteredMaterials([...materialCatalog]);
    setCatalogCurrentPage(1);
    setCatalogSelectAll(false);
    messageApi.info('搜索条件已重置');
  };

  const handleConfirmMaterialSelection = () => {
    // 从显示的数据中获取选中的物资
    const displayData = filteredMaterials.length > 0 ? filteredMaterials : materialCatalog;
    const selectedMaterials = displayData.filter(item => item.selected);
    
    // 将选中的物资添加到采购明细中
    const newMaterials = [...materials];
    selectedMaterials.forEach(selectedItem => {
      // 检查是否已存在
      const existingIndex = newMaterials.findIndex(item => item.key === selectedItem.key);
      if (existingIndex === -1) {
        // 添加新物资（保留供应商信息）
        newMaterials.push({
          key: selectedItem.key,
          materialCode: selectedItem.materialCode,
          materialName: selectedItem.materialName,
          materialType: selectedItem.materialType,
          unit: selectedItem.unit,
          unitPrice: selectedItem.unitPrice,
          stock: selectedItem.stock,
          selected: true,
          quantity: selectedItem.quantity,
          supplier: selectedItem.supplier,
          supplierId: selectedItem.supplierId,
          specification: selectedItem.specification,
          model: selectedItem.model
        });
      } else {
        // 更新现有物资的数量
        newMaterials[existingIndex] = {
          ...newMaterials[existingIndex],
          quantity: selectedItem.quantity,
          selected: true
        };
      }
    });
    
    setMaterials(newMaterials);
    messageApi.success(`已添加 ${selectedMaterials.length} 项物资到采购明细`);
    handleCloseMaterialSelect();
  };

  const handleCatalogPageChange = (page, size) => {
    setCatalogCurrentPage(page);
    setCatalogPageSize(size);
    setCatalogSelectAll(false);
  };

  const handleSelectChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys);
    messageApi.info(`已选择 ${selectedRowKeys.length} 条记录`);
  };

  const handleTableChange = (newPagination) => {
    setPagination({
      ...pagination,
      current: newPagination.current,
      pageSize: newPagination.pageSize
    });
    loadPurchaseOrders(newPagination.current, newPagination.pageSize);
  };

  const getStatusTag = (status) => {
    const statusMap = {
      DRAFT: { color: 'warning', text: '待提交' },
      WAIT_AUDIT: { color: 'blue', text: '待审核' },
      WAIT_RECEIVE: { color: 'orange', text: '待收货' },
      WAIT_STOCK_IN: { color: 'purple', text: '待入库' },
      COMPLETED: { color: 'success', text: '已完成' },
      REJECTED: { color: 'error', text: '已驳回' },
      // 兼容旧值和中文
      '待提交': { color: 'warning', text: '待提交' },
      '待审核': { color: 'blue', text: '待审核' },
      '待收货': { color: 'orange', text: '待收货' },
      '待入库': { color: 'purple', text: '待入库' },
      '已完成': { color: 'success', text: '已完成' },
      '已驳回': { color: 'error', text: '已驳回' },
      'pending': { color: 'warning', text: '待提交' },
      'approved': { color: 'blue', text: '待审核' },
      'completed': { color: 'success', text: '已完成' },
      'rejected': { color: 'error', text: '已驳回' }
    };

    const statusInfo = statusMap[status] || { color: 'default', text: status || '未知' };
    return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
  };

  const getFilteredPurchaseOrders = () => {
    return purchaseOrders.filter(order => {
      const status = String(order.status || '').toUpperCase();
      return [
        'DRAFT', 'WAIT_AUDIT', 'REJECTED',
        '待提交', '待审核', '已驳回',
        'PENDING', 'APPROVED', 'REJECTED'
      ].includes(status);
    });
  };

  const filteredPurchaseOrders = getFilteredPurchaseOrders();

  // 采购单汇总视图列配置
  const summaryColumns = [
    {
      title: '采购单号',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      width: 150,
      render: (text) => <Tag color="blue">{text}</Tag>
    },
    {
      title: '采购分院',
      dataIndex: 'department',
      key: 'department',
      width: 120
    },
    {
      title: '供应商',
      dataIndex: 'supplier',
      key: 'supplier',
      width: 120
    },
    {
      title: '物资数量',
      dataIndex: 'itemCount',
      key: 'itemCount',
      width: 100
    },
    {
      title: '总金额',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 120,
      render: (value) => <strong>¥{value.toFixed(2)}</strong>
    },
    {
      title: '申请人',
      dataIndex: 'operator',
      key: 'operator',
      width: 100
    },
    {
      title: '创建日期',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => getStatusTag(status)
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="link" 
            size="small"
            onClick={async () => {
              let orderWithDetails = record;
              // 如果没有详情数据，尝试从后端获取
              if (!record.details || record.details.length === 0) {
                try {
                  setLoading(true);
                  const response = await api.get(`/api/scm/purchases/orders/${record.key}`);
                  if (response.code === 1 && response.data) {
                    const orderData = response.data;
                    orderWithDetails = {
                      ...record,
                      details: (orderData.details || orderData.items || []).map(item => ({
                        key: item.id,
                        materialCode: item.materialCode,
                        materialName: item.materialName || item.productName,
                        materialType: item.materialType || '-',
                        unit: item.unit,
                        unitPrice: item.unitPrice,
                        quantity: item.quantity,
                        amount: item.amount,
                        specification: item.specification,
                        model: item.model
                      }))
                    };
                  }
                } catch (error) {
                  console.error('获取订单详情失败:', error);
                } finally {
                  setLoading(false);
                }
              }
              
              setCurrentOrderDetails(orderWithDetails);
              setSelectedDetailKeys([]); // 重置选中的商品明细行
              // 初始化编辑数据
              setEditingDetails((orderWithDetails.details || []).map(item => ({
                ...item,
                originalKey: item.key // 保存原始key用于标识
              })));
              setDetailModalVisible(true);
            }}
          >
            查看
          </Button>
        </Space>
      ),
    },
  ];

  // 采购明细视图列配置
  const detailColumns = [
    {
      title: () => (
        <Checkbox 
          indeterminate={selectedRowKeys.length > 0 && selectedRowKeys.length < purchaseOrders.flatMap(order => order.details).length}
          checked={purchaseOrders.flatMap(order => order.details).length > 0 && selectedRowKeys.length === purchaseOrders.flatMap(order => order.details).length}
          onChange={(e) => {
            if (e.target.checked) {
              const allDetailKeys = purchaseOrders.flatMap(order => order.details.map(detail => detail.key));
              setSelectedRowKeys(allDetailKeys);
            } else {
              setSelectedRowKeys([]);
            }
          }}
        />
      ),
      dataIndex: 'selection',
      key: 'selection',
      width: 50,
      fixed: 'left',
      render: (_, record) => (
        <Checkbox 
          checked={selectedRowKeys.includes(record.key)}
          onChange={(e) => {
            const newSelectedRowKeys = e.target.checked
              ? [...selectedRowKeys, record.key]
              : selectedRowKeys.filter(key => key !== record.key);
            setSelectedRowKeys(newSelectedRowKeys);
          }}
        />
      ),
    },
    {
      title: '单号',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      width: 150,
      render: (text) => <Tag color="blue">{text}</Tag>
    },
    {
      title: '物资编码',
      dataIndex: 'materialCode',
      key: 'materialCode',
      width: 120
    },
    {
      title: '物资名称',
      dataIndex: 'materialName',
      key: 'materialName',
      width: 150
    },
    {
      title: '规格',
      dataIndex: 'specification',
      key: 'specification',
      width: 100
    },
    {
      title: '单位',
      dataIndex: 'unit',
      key: 'unit',
      width: 80
    },
    {
      title: '单价',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      width: 100,
      render: (value) => `¥${value?.toFixed(2)}`
    },
    {
      title: '采购数量',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 100
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      render: (value) => <strong>¥{value?.toFixed(2)}</strong>
    },
    {
      title: '申领科室',
      dataIndex: 'department',
      key: 'department',
      width: 120
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => getStatusTag(status)
    },
  ];

  // 获取明细视图的数据
  const getDetailData = () => {
    const detailData = [];
    purchaseOrders.forEach(order => {
      order.details.forEach(detail => {
        detailData.push({
          key: detail.key,
          orderNumber: order.orderNumber,
          materialCode: detail.materialCode,
          materialName: detail.materialName,
          specification: detail.specification,
          unit: detail.unit,
          unitPrice: detail.unitPrice,
          quantity: detail.quantity,
          amount: detail.amount,
          department: order.department,
          createTime: order.createTime,
          status: order.status
        });
      });
    });
    return detailData;
  };

  // 处理采购明细弹窗复选框选择
  const handleDetailSelectAll = (checked) => {
    if (checked && editingDetails.length > 0) {
      // 全选：选中所有商品明细的key
      const allKeys = editingDetails.map(item => item.key);
      setSelectedDetailKeys(allKeys);
    } else {
      // 全部取消
      setSelectedDetailKeys([]);
    }
  };

  // 处理单个商品明细的选择
  const handleDetailSelect = (key, checked) => {
    if (checked) {
      // 添加选中
      setSelectedDetailKeys(prev => [...prev, key]);
    } else {
      // 移除选中
      setSelectedDetailKeys(prev => prev.filter(k => k !== key));
    }
  };

  // 删除选中的商品明细记录
  const handleDeleteSelectedDetails = () => {
    if (selectedDetailKeys.length === 0) {
      messageApi.warning('请先选择要删除的商品明细');
      return;
    }

    // 过滤掉选中的记录
    const newEditingDetails = editingDetails.filter(item => !selectedDetailKeys.includes(item.key));
    
    // 更新编辑数据
    setEditingDetails(newEditingDetails);
    
    // 清空选中状态
    setSelectedDetailKeys([]);
    
    // 显示删除成功消息
    messageApi.success(`成功删除 ${selectedDetailKeys.length} 条商品明细记录`);
    
    // 如果删除后没有记录，更新当前订单详情
    if (newEditingDetails.length === 0 && currentOrderDetails) {
      const updatedOrder = {
        ...currentOrderDetails,
        details: [],
        itemCount: 0,
        totalAmount: 0
      };
      setCurrentOrderDetails(updatedOrder);
    }
  };

  // 处理单位变更
  const handleUnitChange = (key, newUnit) => {
    const updatedDetails = editingDetails.map(item => {
      if (item.key === key) {
        return { ...item, unit: newUnit };
      }
      return item;
    });
    setEditingDetails(updatedDetails);
  };

  // 处理采购明细数量变更
  const handleDetailQuantityChange = (key, newQuantity) => {
    if (newQuantity === null || newQuantity < 1) {
      return;
    }
    
    const updatedDetails = editingDetails.map(item => {
      if (item.key === key) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setEditingDetails(updatedDetails);
    
    // 更新当前订单的总金额
    if (currentOrderDetails) {
      const totalAmount = updatedDetails.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
      const updatedOrder = {
        ...currentOrderDetails,
        details: updatedDetails,
        itemCount: updatedDetails.length,
        totalAmount: totalAmount
      };
      setCurrentOrderDetails(updatedOrder);
    }
  };

  return (
    <div style={{ padding: '0 16px' }}>
      {contextHolder}
      <style>
        {`
          .custom-scrollbar::-webkit-scrollbar {
            height: 8px;
            background-color: #f5f5f5;
            border-radius: 4px;
          }
          
          .custom-scrollbar::-webkit-scrollbar-track {
            background-color: #f5f5f5;
            border-radius: 4px;
          }
          
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: #c1c1c1;
            border-radius: 4px;
          }
          
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background-color: #a8a8a8;
          }
          
          .material-table tr:hover {
            background-color: #fafafa;
          }
          
          .material-table td {
            transition: background-color 0.3s;
          }
          
          /* 中文日期选择器样式 */
          .chinese-datepicker .ant-picker-header-view {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
          }
          
          .chinese-datepicker .ant-picker-cell-inner {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
          }
          
          .chinese-datepicker .ant-picker-week-panel-row td {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
          }
        `}
      </style>
      {/* 页面标题 */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <h1 style={{ margin: 0 }}>采购计划申请</h1>
        </Col>
      </Row>

      {/* 顶部搜索栏 */}
      <Card 
        style={{ marginBottom: 24, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
      >
        <Form 
          form={searchForm} 
          style={{ padding: '16px', border: '1px solid #e8e8e8', borderRadius: '4px' }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ whiteSpace: 'nowrap' }}>物资编码：</span>
                <Form.Item name="materialCode" style={{ marginBottom: 0 }}>
                  <Input 
                    placeholder="请输入物资编码" 
                    allowClear
                    style={{ width: 180 }}
                    size="middle"
                  />
                </Form.Item>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ whiteSpace: 'nowrap' }}>物资名称：</span>
                <Form.Item name="materialName" style={{ marginBottom: 0 }}>
                  <Input 
                    placeholder="请输入物资名称" 
                    allowClear
                    style={{ width: 180 }}
                    size="middle"
                  />
                </Form.Item>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ whiteSpace: 'nowrap' }}>采购单号：</span>
                <Form.Item name="orderNumber" style={{ marginBottom: 0 }}>
                  <Input 
                    placeholder="请输入采购单号" 
                    allowClear
                    style={{ width: 180 }}
                    size="middle"
                  />
                </Form.Item>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ whiteSpace: 'nowrap' }}>创建日期：</span>
                <Form.Item name="createTime" style={{ marginBottom: 0 }}>
                  <DatePicker 
                    placeholder="请选择创建日期" 
                    allowClear
                    style={{ width: 180 }}
                    size="middle"
                    format="YYYY年MM月DD日"
                    locale={zhCN}
                    classNames={{ popup: { root: 'chinese-datepicker' } }}
                  />
                </Form.Item>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <Button 
                type="primary" 
                icon={<SearchOutlined />}
                style={{ minWidth: 90 }}
                onClick={() => handleSearch(searchForm.getFieldsValue())}
              >
                搜索
              </Button>
              <Button 
                icon={<ReloadOutlined />}
                onClick={handleReset}
                style={{ minWidth: 90 }}
              >
                重置
              </Button>
              <Button 
                icon={<ExportOutlined />}
                style={{ minWidth: 90 }}
              >
                导出
              </Button>
            </div>
          </div>
        </Form>
      </Card>

      {/* 新建采购申请按钮 */}
      <Button 
        type="primary" 
        icon={<PlusOutlined />}
        onClick={handleNewRequest}
        style={{ marginBottom: 16 }}
      >
        新建采购申请
      </Button>

      {/* 采购单汇总表单 */}
      <Card 
        title={`采购计划申请 (共 ${getFilteredPurchaseOrders().length} 条)`}
        style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
      >
        <Table
          columns={summaryColumns}
          dataSource={getFilteredPurchaseOrders()}
          rowKey="key"
          pagination={{ 
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: getFilteredPurchaseOrders().length,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条记录`,
            position: ['bottomCenter'],
            pageSizeOptions: ['10', '20', '50', '100', '500', '1000'],
            locale: {
              items_per_page: '条/页',
              jump_to: '跳至',
              page: '页',
              prev_page: '上一页',
              next_page: '下一页',
              prev_5: '向前5页',
              next_5: '向后5页',
              prev_3: '向前3页',
              next_3: '向后3页'
            }
          }}
          onChange={handleTableChange}
          size="middle"
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* 创建采购明细弹窗 */}
      <Modal
        title="创建采购明细"
        open={modalVisible}
        onCancel={handleModalCancel}
        width={1200}
        footer={null}
        style={{ top: 20 }}
      >
        {/* 采购基本信息 */}
        <Form form={newOrderForm} layout="inline" style={{ marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid #f0f0f0' }}>
          <Form.Item name="departmentId" label="申领科室" rules={[{ required: true, message: '请选择科室' }]}>
            <Select placeholder="自动识别当前科室" style={{ width: 160 }} disabled>
              {departments.map(d => <Select.Option key={d.id} value={d.id}>{d.name}</Select.Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="operatorName" label="申请人" rules={[{ required: true, message: '请输入申请人' }]}>
            <Input style={{ width: 120 }} disabled />
          </Form.Item>
          <Form.Item name="planType" label="计划类型" rules={[{ required: true, message: '请选择计划类型' }]}>
            <Select placeholder="计划类型" style={{ width: 100 }}>
              <Select.Option value="monthly">月度</Select.Option>
              <Select.Option value="weekly">周度</Select.Option>
              <Select.Option value="emergency">紧急</Select.Option>
            </Select>
          </Form.Item>
        </Form>

        <div style={{
          marginBottom: 16,
          paddingBottom: 16,
          borderBottom: '1px solid #f0f0f0'
        }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleOpenMaterialSelect}
            style={{
              height: '36px',
              padding: '0 20px',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            选择耗材物资
          </Button>
          <span style={{
            marginLeft: '16px',
            color: '#666',
            fontSize: '14px'
          }}>
            已选择 {materials.filter(item => item.selected).length} 项物资
          </span>
        </div>

        <div style={{ 
          overflowX: 'auto', 
          marginBottom: 16,
          border: '1px solid #f0f0f0',
          borderRadius: 8
        }} className="custom-scrollbar">
          <table style={{ width: '100%', borderCollapse: 'collapse' }} className="material-table">
            <thead>
              <tr style={{ backgroundColor: '#fafafa' }}>
                <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '60px' }}>
                  <Checkbox 
                    checked={selectAll}
                    onChange={handleSelectAll}
                  />
                </th>
                <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '120px' }}>供应商</th>
                <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '100px' }}>物资编码</th>
                <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '150px' }}>物资名称</th>
                <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '100px' }}>规格</th>
                <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '100px' }}>物资类型</th>
                <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '80px' }}>单位</th>
                <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '100px' }}>采购价格</th>
                <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '120px' }}>采购数量</th>
                <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '100px' }}>现有库存</th>
              </tr>
            </thead>
            <tbody>
              {/* 按供应商分组排序显示 */}
              {[...materials].sort((a, b) => (a.supplier || '').localeCompare(b.supplier || '')).slice((currentPage - 1) * pageSize, currentPage * pageSize).map((item, index, arr) => {
                const prevItem = index > 0 ? arr[index - 1] : null;
                const showSupplierDivider = !prevItem || prevItem.supplier !== item.supplier;
                return (
                  <React.Fragment key={item.key}>
                    {showSupplierDivider && (
                      <tr style={{ backgroundColor: '#e6f7ff' }}>
                        <td colSpan={10} style={{ padding: '6px 12px', border: '1px solid #f0f0f0', fontWeight: 'bold', color: '#1890ff' }}>
                          供应商：{item.supplier || '未知供应商'}
                        </td>
                      </tr>
                    )}
                    <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>
                        <Checkbox 
                          checked={item.selected}
                          onChange={() => handleMaterialSelect(item.key)}
                        />
                      </td>
                      <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>{item.supplier || '-'}</td>
                      <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>{item.materialCode}</td>
                      <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>{item.materialName}</td>
                      <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>{item.specification || '-'}</td>
                      <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>{item.materialType}</td>
                      <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>{item.unit}</td>
                      <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>¥{item.unitPrice.toFixed(2)}</td>
                      <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>
                        <InputNumber
                          min={1}
                          value={item.quantity}
                          onChange={(value) => handleQuantityChange(item.key, value)}
                          style={{ width: '100%' }}
                        />
                  </td>
                  <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>{item.stock}</td>
                    </tr>
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* 分页控制 */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          marginBottom: 16,
          padding: '16px 0',
          borderTop: '1px solid #f0f0f0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ color: '#666', fontSize: '14px' }}>每页显示：</span>
            <Select
              value={pageSize}
              onChange={(value) => {
                setPageSize(value);
                setCurrentPage(1);
                setSelectAll(false);
              }}
              style={{ width: 90 }}
              size="small"
              options={[
                { value: 5, label: '5条' },
                { value: 10, label: '10条' },
                { value: 20, label: '20条' }
              ]}
            />
            <span style={{ color: '#666', fontSize: '14px' }}>
              第 <strong style={{ color: '#1890ff' }}>{currentPage}</strong> 页 / 共 <strong>{Math.ceil(materials.length / pageSize)}</strong> 页
            </span>
          </div>
        </div>

        {/* 备注栏 */}
        <div style={{ 
          marginBottom: 24,
          padding: '16px',
          border: '1px solid #f0f0f0',
          borderRadius: '8px',
          backgroundColor: '#fafafa'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            marginBottom: '12px',
            color: '#666',
            fontWeight: '500'
          }}>
            <span style={{ 
              display: 'inline-block',
              width: '4px',
              height: '16px',
              backgroundColor: '#1890ff',
              marginRight: '8px',
              borderRadius: '2px'
            }} />
            备注
          </div>
          <Input.TextArea
            placeholder="请输入备注信息"
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            style={{ 
              width: '100%',
              border: '1px solid #d9d9d9',
              borderRadius: '6px'
            }}
            rows={4}
          />
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
            onClick={handleModalCancel}
            style={{ 
              minWidth: '80px',
              height: '36px'
            }}
          >
            关闭
          </Button>
          <Button 
            type="primary" 
            danger
            onClick={() => {
              const selectedItems = materials.filter(item => item.selected);
              if (selectedItems.length === 0) {
                messageApi.warning('请选择要删除的物资');
                return;
              }
              setMaterials(materials.filter(item => !item.selected));
              setSelectAll(false);
              messageApi.success(`已移除 ${selectedItems.length} 项物资`);
            }}
            style={{ 
              minWidth: '80px',
              height: '36px'
            }}
          >
            删除
          </Button>
          <Button 
            type="primary" 
            onClick={handleSave}
            loading={submittingAction === 'save'}
            disabled={Boolean(submittingAction)}
            style={{ 
              minWidth: '80px',
              height: '36px',
              backgroundColor: '#52c41a',
              borderColor: '#52c41a'
            }}
          >
            保存
          </Button>
          <Button 
            type="primary" 
            onClick={handleSubmit}
            loading={submittingAction === 'submit'}
            disabled={Boolean(submittingAction)}
            style={{ 
              minWidth: '80px',
              height: '36px',
              backgroundColor: '#1890ff',
              borderColor: '#1890ff'
            }}
          >
            提交订单
          </Button>
        </div>
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
            form={searchForm} 
            layout="inline" 
            onFinish={handleSearchMaterials}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ whiteSpace: 'nowrap' }}>物资编码：</span>
                  <Form.Item name="materialCode" style={{ marginBottom: 0 }}>
                    <Input 
                      placeholder="请输入物资编码" 
                      allowClear
                      style={{ width: 180 }}
                      size="middle"
                    />
                  </Form.Item>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ whiteSpace: 'nowrap' }}>物资名称：</span>
                  <Form.Item name="materialName" style={{ marginBottom: 0 }}>
                    <Input 
                      placeholder="请输入物资名称" 
                      allowClear
                      style={{ width: 180 }}
                      size="middle"
                    />
                  </Form.Item>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ whiteSpace: 'nowrap' }}>供应商：</span>
                  <Form.Item name="supplier" style={{ marginBottom: 0 }}>
                    <Input 
                      placeholder="请输入供应商" 
                      allowClear
                      style={{ width: 180 }}
                      size="middle"
                    />
                  </Form.Item>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ whiteSpace: 'nowrap' }}>生产厂家：</span>
                  <Form.Item name="manufacturer" style={{ marginBottom: 0 }}>
                    <Input 
                      placeholder="请输入生产厂家" 
                      allowClear
                      style={{ width: 180 }}
                      size="middle"
                    />
                  </Form.Item>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <Button 
                  type="primary" 
                  htmlType="submit"
                  icon={<SearchOutlined />}
                  style={{ minWidth: 90 }}
                >
                  搜索
                </Button>
                <Button 
                  onClick={handleResetSearch}
                  style={{ minWidth: 90 }}
                >
                  重置
                </Button>
              </div>
            </div>
          </Form>
        </Card>

        {/* 物资目录表单 */}
        <div style={{ 
          overflowX: 'auto', 
          marginBottom: 16,
          border: '1px solid #f0f0f0',
          borderRadius: 8
        }} className="custom-scrollbar">
          <table style={{ width: '100%', borderCollapse: 'collapse' }} className="material-table">
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
                <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '100px' }}>物资类型</th>
                <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '100px' }}>规格</th>
                <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '100px' }}>型号</th>
                <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '120px' }}>最小包装</th>
                <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '100px' }}>起订量</th>
                <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '100px' }}>单位</th>
                <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '100px' }}>采购价格</th>
                <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '120px' }}>采购数量</th>
                <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '100px' }}>现有库存</th>
                <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '120px' }}>注册证号</th>
                <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '120px' }}>供应商</th>
                <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '120px' }}>生产厂家</th>
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
                  <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>{item.materialType}</td>
                  <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>{item.specification}</td>
                  <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>{item.model}</td>
                  <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>{item.minPackage}</td>
                  <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>{item.minOrderQuantity}</td>
                  <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>{item.unit}</td>
                  <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>¥{item.unitPrice.toFixed(2)}</td>
                  <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>
                    <InputNumber
                      min={item.minOrderQuantity}
                      value={item.quantity}
                      onChange={(value) => handleCatalogQuantityChange(item.key, value)}
                      style={{ width: '100%' }}
                    />
                  </td>
                  <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>{item.stock}</td>
                  <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>{item.registrationNumber}</td>
                  <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>{item.supplier}</td>
                  <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>{item.manufacturer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 分页控制 */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          marginBottom: 16,
          padding: '16px 0',
          borderTop: '1px solid #f0f0f0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ color: '#666', fontSize: '14px' }}>每页显示：</span>
            <Select
              value={catalogPageSize}
              onChange={(value) => {
                setCatalogPageSize(value);
                setCatalogCurrentPage(1);
                setCatalogSelectAll(false);
              }}
              style={{ width: 90 }}
              size="small"
              options={[
                { value: 5, label: '5条' },
                { value: 10, label: '10条' },
                { value: 20, label: '20条' }
              ]}
            />
            <span style={{ color: '#666', fontSize: '14px' }}>
              第 <strong style={{ color: '#1890ff' }}>{catalogCurrentPage}</strong> 页 / 共 <strong>{Math.ceil((filteredMaterials.length > 0 ? filteredMaterials : materialCatalog).length / catalogPageSize)}</strong> 页
            </span>
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

      {/* 查看采购明细弹窗 */}
      <Modal
        title="采购明细"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        width={1200}
        footer={null}
        style={{ top: 20 }}
      >
        {currentOrderDetails && (
          <>
            {/* 订单基本信息 */}
            <div style={{ 
              marginBottom: 24,
              padding: '16px',
              border: '1px solid #f0f0f0',
              borderRadius: '8px',
              backgroundColor: '#fafafa'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                marginBottom: '12px',
                color: '#666',
                fontWeight: '500'
              }}>
                <span style={{ 
                  display: 'inline-block',
                  width: '4px',
                  height: '16px',
                  backgroundColor: '#1890ff',
                  marginRight: '8px',
                  borderRadius: '2px'
                }} />
                订单信息
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                <div>
                  <div style={{ color: '#8c8c8c', fontSize: '12px', marginBottom: '4px' }}>采购单号</div>
                  <div style={{ fontWeight: '500' }}>{currentOrderDetails.orderNumber}</div>
                </div>
                <div>
                  <div style={{ color: '#8c8c8c', fontSize: '12px', marginBottom: '4px' }}>供应商</div>
                  <div style={{ fontWeight: '500' }}>{currentOrderDetails.supplier}</div>
                </div>
                <div>
                  <div style={{ color: '#8c8c8c', fontSize: '12px', marginBottom: '4px' }}>采购分院</div>
                  <div style={{ fontWeight: '500' }}>{currentOrderDetails.department}</div>
                </div>
                <div>
                  <div style={{ color: '#8c8c8c', fontSize: '12px', marginBottom: '4px' }}>创建日期</div>
                  <div style={{ fontWeight: '500' }}>{currentOrderDetails.createTime}</div>
                </div>
                <div>
                  <div style={{ color: '#8c8c8c', fontSize: '12px', marginBottom: '4px' }}>状态</div>
                  <div style={{ fontWeight: '500' }}>{getStatusTag(currentOrderDetails.status)}</div>
                </div>
                <div>
                  <div style={{ color: '#8c8c8c', fontSize: '12px', marginBottom: '4px' }}>商品数量</div>
                  <div style={{ fontWeight: '500' }}>{editingDetails.length} 项</div>
                </div>
                <div>
                  <div style={{ color: '#8c8c8c', fontSize: '12px', marginBottom: '4px' }}>总金额</div>
                  <div style={{ fontWeight: '500', color: '#1890ff' }}>
                    ¥{editingDetails.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0).toFixed(2)}
                  </div>
                </div>
                <div>
                  <div style={{ color: '#8c8c8c', fontSize: '12px', marginBottom: '4px' }}>申请人</div>
                  <div style={{ fontWeight: '500' }}>{currentOrderDetails.operator}</div>
                </div>
              </div>
            </div>

            {/* 采购明细表格 */}
            <div style={{ 
              overflowX: 'auto', 
              marginBottom: 16,
              border: '1px solid #f0f0f0',
              borderRadius: 8
            }} className="custom-scrollbar">
              <table style={{ width: '100%', borderCollapse: 'collapse' }} className="material-table">
                <thead>
                  <tr style={{ backgroundColor: '#fafafa' }}>
                    <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '60px' }}>
                      <Checkbox 
                        checked={editingDetails.length > 0 && selectedDetailKeys.length === editingDetails.length}
                        indeterminate={editingDetails.length > 0 && selectedDetailKeys.length > 0 && selectedDetailKeys.length < editingDetails.length}
                        onChange={(e) => handleDetailSelectAll(e.target.checked)}
                      />
                    </th>
                    <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '100px' }}>物资编码</th>
                    <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '150px' }}>物资名称</th>
                    <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '100px' }}>物资类型</th>
                    <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '80px' }}>单位</th>
                    <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '100px' }}>采购价格</th>
                    <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '120px' }}>采购数量</th>
                    <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '120px' }}>金额</th>
                  </tr>
                </thead>
                <tbody>
                  {editingDetails.length > 0 ? (
                    editingDetails.map(item => (
                      <tr key={item.key} style={{ borderBottom: '1px solid #f0f0f0' }}>
                        <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>
                          <Checkbox 
                            checked={selectedDetailKeys.includes(item.key)}
                            onChange={(e) => handleDetailSelect(item.key, e.target.checked)}
                          />
                        </td>
                        <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>{item.materialCode}</td>
                        <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>{item.materialName}</td>
                        <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>{item.materialType || '-'}</td>
                        <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>
                          <Input
                            value={item.unit}
                            onChange={(e) => handleUnitChange(item.key, e.target.value)}
                            style={{ width: '80px', textAlign: 'center' }}
                          />
                        </td>
                        <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>¥{item.unitPrice.toFixed(2)}</td>
                        <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>
                          <InputNumber
                            value={item.quantity}
                            onChange={(value) => handleDetailQuantityChange(item.key, value)}
                            min={1}
                            style={{ width: '100px' }}
                          />
                        </td>
                        <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', fontWeight: '500', color: '#1890ff' }}>
                          ¥{(item.unitPrice * item.quantity).toFixed(2)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" style={{ padding: '24px 8px', textAlign: 'center', color: '#999', fontStyle: 'italic' }}>
                        暂无商品明细数据
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot>
                  <tr style={{ backgroundColor: '#fafafa' }}>
                    <td colSpan="7" style={{ padding: '12px 8px', textAlign: 'right', border: '1px solid #f0f0f0', fontWeight: 'bold' }}>总计：</td>
                    <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', fontWeight: 'bold', color: '#1890ff' }}>
                      ¥{editingDetails.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0).toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* 备注 */}
            <div style={{ 
              marginBottom: 24,
              padding: '16px',
              border: '1px solid #f0f0f0',
              borderRadius: '8px',
              backgroundColor: '#fafafa'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                marginBottom: '12px',
                color: '#666',
                fontWeight: '500'
              }}>
                <span style={{ 
                  display: 'inline-block',
                  width: '4px',
                  height: '16px',
                  backgroundColor: '#1890ff',
                  marginRight: '8px',
                  borderRadius: '2px'
                }} />
                备注
              </div>
              <textarea placeholder="请输入备注信息" rows="4" className="ant-input css-dev-only-do-not-override-6ysst ant-input-outlined" style={{width: '100%', border: '1px solid rgb(217, 217, 217)', borderRadius: '6px'}}></textarea>
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
                onClick={() => setDetailModalVisible(false)}
                style={{ 
                  minWidth: '80px',
                  height: '36px'
                }}
              >
                关闭
              </Button>
              <Button 
                type="primary" 
                danger
                onClick={handleDeleteSelectedDetails}
                style={{ 
                  minWidth: '80px',
                  height: '36px'
                }}
              >
                删除
              </Button>
              <Button 
                type="primary"
                onClick={async () => {
                  if (detailSubmittingAction) return;
                  // 保存订单逻辑
                  if (currentOrderDetails) {
                    try {
                      setDetailSubmittingAction('save');
                      const updateData = {
                        id: currentOrderDetails.key,
                        remark: currentOrderDetails.remark,
                        items: editingDetails.map(item => ({
                          materialId: item.materialId || parseInt(item.key),
                          quantity: item.quantity,
                          unit: item.unit
                        }))
                      };
                      const response = await api.put(`/api/scm/purchases/orders/${currentOrderDetails.key}`, updateData);
                      if (response.code === 1) {
                        messageApi.success('订单已保存');
                        loadPurchaseOrders();
                        setDetailModalVisible(false);
                      } else {
                        messageApi.error(response.message || '保存失败');
                      }
                    } catch (error) {
                      console.error('保存订单失败:', error);
                      messageApi.error('保存失败，请检查网络连接');
                    } finally {
                      setDetailSubmittingAction(null);
                    }
                  }
                }}
                loading={detailSubmittingAction === 'save'}
                disabled={Boolean(detailSubmittingAction)}
                style={{ 
                  minWidth: '80px',
                  height: '36px'
                }}
              >
                保存
              </Button>
              <Button 
                type="primary"
                onClick={async () => {
                  if (detailSubmittingAction) return;
                  // 提交订单逻辑
                  if (currentOrderDetails) {
                    try {
                      setDetailSubmittingAction('submit');
                      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
                      const operatorName = userInfo.realName || userInfo.userName || '管理员';
                      
                      const response = await api.post(`/api/scm/purchases/orders/${currentOrderDetails.key}/submit?operatorName=${encodeURIComponent(operatorName)}`);
                      if (response.code === 1) {
                        messageApi.success('订单已提交');
                        loadPurchaseOrders();
                        setDetailModalVisible(false);
                      } else {
                        messageApi.error(response.message || '提交失败');
                      }
                    } catch (error) {
                      console.error('提交订单失败:', error);
                      messageApi.error('提交失败，请检查网络连接');
                    } finally {
                      setDetailSubmittingAction(null);
                    }
                  }
                }}
                loading={detailSubmittingAction === 'submit'}
                disabled={Boolean(detailSubmittingAction)}
                style={{ 
                  minWidth: '80px',
                  height: '36px',
                  backgroundColor: '#52c41a',
                  borderColor: '#52c41a'
                }}
              >
                提交订单
              </Button>
            </div>
          </>
        )}
      </Modal>

    </div>
  );
};

export default PurchaseOrderRequest;