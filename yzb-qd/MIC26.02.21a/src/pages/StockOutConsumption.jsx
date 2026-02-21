import React, { useState, useEffect, useRef } from 'react';
import { Form, Input, Select, DatePicker, Button, Card, Row, Radio, Space, message, Modal, Checkbox, Col } from 'antd';
import { MinusCircleOutlined, PlusOutlined, BarcodeOutlined, EditOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { TextArea } = Input;

const StockOutConsumption = () => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState('scan'); // scan: 扫码出库, manual: 手动出库
  const [currentDepartment, setCurrentDepartment] = useState(() => {
    return localStorage.getItem('currentDepartment') || '测试科室';
  });
  
  // 物资选择弹窗相关状态
  const [materialSelectModalVisible, setMaterialSelectModalVisible] = useState(false);
  const [materialCatalog, setMaterialCatalog] = useState([]);
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [catalogSelectAll, setCatalogSelectAll] = useState(false);
  const [catalogCurrentPage, setCatalogCurrentPage] = useState(1);
  const [catalogPageSize, setCatalogPageSize] = useState(10);
  const [searchForm] = Form.useForm();
  
  // 表格全选状态管理
  const [tableSelectAll, setTableSelectAll] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  
  // 删除确认弹窗状态
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  
  // 确认出库弹窗状态
  const [stockOutConfirmVisible, setStockOutConfirmVisible] = useState(false);
  
  // 数量选择浮窗状态
  const [quantityPopupVisible, setQuantityPopupVisible] = useState(false);
  const [quantityPopupPosition, setQuantityPopupPosition] = useState({ x: 0, y: 0 });
  const [currentQuantityKey, setCurrentQuantityKey] = useState(null);

  // 扫码数据状态管理
  const [scanMaterialsState, setScanMaterialsState] = useState([]);
  
  // 模拟有库存的耗材数据
  const materialsWithStock = [
    { code: 'YZS-001', name: '一次性注射器', specification: '10ml', unit: '支', stock: 200, warehouse: '仓库1' },
    { code: 'YZS-002', name: '输液器', specification: '500ml', unit: '个', stock: 150, warehouse: '仓库1' },
    { code: 'YZS-003', name: '医用棉签', specification: '100支/包', unit: '包', stock: 100, warehouse: '仓库1' },
    { code: 'YZS-004', name: '酒精棉球', specification: '50g/瓶', unit: '瓶', stock: 80, warehouse: '仓库1' },
    { code: 'YLQ-001', name: '碘伏消毒液', specification: '500ml', unit: '瓶', stock: 50, warehouse: '仓库1' },
    { code: 'YZS-005', name: '一次性注射器', specification: '5ml', unit: '支', stock: 300, warehouse: '仓库2' },
    { code: 'YZS-006', name: '一次性注射器', specification: '20ml', unit: '支', stock: 120, warehouse: '仓库2' },
    { code: 'YLQ-002', name: '碘伏消毒液', specification: '100ml', unit: '瓶', stock: 200, warehouse: '仓库2' },
  ];

  // 物资目录数据（用于选择弹窗）- 参考采购计划申请页面
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
      stock: 100,
      outboundQuantity: '',
      batchNumber: 'BATCH-202401001',
      productionDate: '2024-01-15',
      expiryDate: '2026-01-14'
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
      unitPrice: 120.00,
      stock: 50,
      outboundQuantity: '',
      batchNumber: 'BATCH-202402001',
      productionDate: '2024-02-10',
      expiryDate: '2026-02-09'
    },
    {
      key: '3',
      materialCode: 'MAT003',
      materialName: '医用手套',
      specification: '乳胶',
      model: 'GL-303',
      manufacturer: '手套制造公司',
      supplier: '医疗用品供应商',
      materialType: '低值耗材',
      minPackage: '100双/箱',
      minOrderQuantity: 1,
      quantity: 1,
      selected: false,
      unit: '双',
      unitPrice: 0.80,
      stock: 500,
      outboundQuantity: '',
      batchNumber: 'BATCH-202403001',
      productionDate: '2024-03-05',
      expiryDate: '2026-03-04'
    },
    {
      key: '4',
      materialCode: 'MAT004',
      materialName: '体温计',
      specification: '电子',
      model: 'TM-404',
      manufacturer: '医疗器械公司',
      supplier: '医疗设备供应商',
      materialType: '高值耗材',
      minPackage: '10支/盒',
      minOrderQuantity: 1,
      quantity: 1,
      selected: false,
      unit: '支',
      unitPrice: 35.00,
      stock: 80,
      outboundQuantity: '',
      batchNumber: 'BATCH-202404001',
      productionDate: '2024-04-20',
      expiryDate: '2026-04-19'
    },
    {
      key: '5',
      materialCode: 'MAT005',
      materialName: '血压计',
      specification: '电子',
      model: 'BP-505',
      manufacturer: '医疗设备制造厂',
      supplier: '医疗设备供应商',
      materialType: '高值耗材',
      minPackage: '1台/盒',
      minOrderQuantity: 1,
      quantity: 1,
      selected: false,
      unit: '台',
      unitPrice: 280.00,
      stock: 30,
      batchNumber: 'BATCH-202405001',
      productionDate: '2024-05-12',
      expiryDate: '2026-05-11'
    },
    {
      key: '6',
      materialCode: 'MAT006',
      materialName: '注射器',
      specification: '一次性',
      model: 'SY-606',
      manufacturer: '医疗用品公司',
      supplier: '医疗耗材供应商',
      materialType: '低值耗材',
      minPackage: '100支/箱',
      minOrderQuantity: 1,
      quantity: 1,
      selected: false,
      unit: '支',
      unitPrice: 1.20,
      stock: 300,
      batchNumber: 'BATCH-202406001',
      productionDate: '2024-06-18',
      expiryDate: '2026-06-17'
    },
    {
      key: '7',
      materialCode: 'MAT007',
      materialName: '输液器',
      specification: '一次性',
      model: 'IV-701',
      manufacturer: '输液设备公司',
      supplier: '医疗设备供应商',
      materialType: '高值耗材',
      minPackage: '50套/箱',
      minOrderQuantity: 1,
      quantity: 1,
      selected: false,
      unit: '套',
      unitPrice: 4.80,
      stock: 150,
      batchNumber: 'BATCH-202407001',
      productionDate: '2024-07-22',
      expiryDate: '2026-07-21'
    },
    {
      key: '8',
      materialCode: 'MAT008',
      materialName: '纱布',
      specification: '10cm×10cm',
      model: 'GS-810',
      manufacturer: '医用敷料厂',
      supplier: '医疗耗材供应商',
      materialType: '低值耗材',
      minPackage: '100包/箱',
      minOrderQuantity: 1,
      quantity: 1,
      selected: false,
      unit: '包',
      unitPrice: 8.50,
      stock: 120,
      batchNumber: 'BATCH-202408001',
      productionDate: '2024-08-05',
      expiryDate: '2026-08-04'
    },
    {
      key: '9',
      materialCode: 'MAT009',
      materialName: '棉签',
      specification: '医用',
      model: 'CS-920',
      manufacturer: '卫生用品公司',
      supplier: '清洁用品供应商',
      materialType: '低值耗材',
      minPackage: '200包/箱',
      minOrderQuantity: 1,
      quantity: 1,
      selected: false,
      unit: '包',
      unitPrice: 2.50,
      stock: 180,
      batchNumber: 'BATCH-202409001',
      productionDate: '2024-09-14',
      expiryDate: '2026-09-13'
    },
    {
      key: '10',
      materialCode: 'MAT010',
      materialName: '酒精',
      specification: '75%',
      model: 'AL-1030',
      manufacturer: '消毒用品公司',
      supplier: '医疗耗材供应商',
      materialType: '低值耗材',
      minPackage: '500ml/瓶',
      minOrderQuantity: 1,
      quantity: 1,
      selected: false,
      unit: '瓶',
      unitPrice: 12.00,
      stock: 90,
      batchNumber: 'BATCH-202410001',
      productionDate: '2024-10-30',
      expiryDate: '2026-10-29'
    }
  ];

  // 获取当前日期
  const currentDate = dayjs();
  
  // 从localStorage获取当前登录用户
  const getCurrentUser = () => {
    return localStorage.getItem('username') || '管理员';
  };
  
  // 表单初始值
  const initialValues = {
    department: currentDepartment,
    operator: getCurrentUser(),
    outType: 'consumption',
    scanMaterials: [],
    manualMaterials: []
  };

  // 监听科室变化，实时更新表单
  React.useEffect(() => {
    const handleDepartmentChanged = (e) => {
      const newDepartment = e.detail || '测试科室';
      setCurrentDepartment(newDepartment);
      // 更新表单中的科室字段
      form.setFieldsValue({ department: newDepartment });
    };

    const handleStorageChange = (e) => {
      if (e.key === 'currentDepartment') {
        const newDepartment = e.newValue || '测试科室';
        setCurrentDepartment(newDepartment);
        // 更新表单中的科室字段
        form.setFieldsValue({ department: newDepartment });
      }
    };

    // 添加自定义事件监听
    window.addEventListener('departmentChanged', handleDepartmentChanged);
    // 添加storage事件监听（用于跨标签页同步）
    window.addEventListener('storage', handleStorageChange);
    
    // 组件加载时设置表单初始值
    form.setFieldsValue({ department: currentDepartment });

    return () => {
      window.removeEventListener('departmentChanged', handleDepartmentChanged);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [form]);

  const handleStockOut = (values) => {
    // 根据模式获取对应的物料列表
    const materials = mode === 'scan' ? values.scanMaterials : values.manualMaterials;
    
    // 记录操作日志
    console.log('出库操作日志:', {
      operationTime: new Date().toLocaleString(),
      mode: mode === 'scan' ? '扫码出库' : '手动出库',
      出库类型: values.outType,
      department: values.department,
      operator: values.operator,
      materials: materials,
    });
    
    setVisible(true);
  };

  const handleScanBarcode = (barcode) => {
    // 模拟扫码操作
    const material = materialsWithStock.find(item => item.code === barcode);
    if (material) {
      // 添加到扫码出库列表
      const currentMaterials = form.getFieldValue('scanMaterials') || [];
      const existingIndex = currentMaterials.findIndex(item => item.materialCode === material.code);
      
      let updatedMaterials;
      if (existingIndex >= 0) {
        // 如果已存在，数量加1
        updatedMaterials = [...currentMaterials];
        updatedMaterials[existingIndex] = {
          ...updatedMaterials[existingIndex],
          quantity: updatedMaterials[existingIndex].quantity + 1
        };
      } else {
        // 如果不存在，添加新记录
        const newMaterial = {
          key: Date.now().toString(), // 添加唯一的 key
          materialCode: material.code,
          materialName: material.name,
          specification: material.specification,
          warehouse: material.warehouse,
          quantity: 1,
          unit: material.unit,
          reason: '扫码出库'
        };
        updatedMaterials = [...currentMaterials, newMaterial];
      }
      
      // 同时更新表单值和状态
      form.setFieldsValue({ scanMaterials: updatedMaterials });
      setScanMaterialsState(updatedMaterials);
      
      message.success(`扫码成功: ${material.name}`);
    } else {
      message.error('未找到对应物资');
    }
  };

  // 初始化物资目录数据
  React.useEffect(() => {
    setMaterialCatalog([...materialCatalogData]);
    setFilteredMaterials([...materialCatalogData]);
  }, []);

  // 物资选择弹窗相关方法
  const handleOpenMaterialSelect = () => {
    // 重置物资目录数据
    setMaterialCatalog([...materialCatalogData]);
    setFilteredMaterials([...materialCatalogData]);
    
    setMaterialSelectModalVisible(true);
    searchForm.resetFields();
    setCatalogSelectAll(false);
    setCatalogCurrentPage(1);
  };

  const handleCloseMaterialSelect = () => {
    setMaterialSelectModalVisible(false);
  };

  const handleCatalogSelectAll = (e) => {
    const checked = e.target.checked;
    setCatalogSelectAll(checked);
    
    const startIndex = (catalogCurrentPage - 1) * catalogPageSize;
    const endIndex = catalogCurrentPage * catalogPageSize;
    const currentPageMaterials = (filteredMaterials.length > 0 ? filteredMaterials : materialCatalog)
      .slice(startIndex, endIndex);
    
    const updatedCatalog = [...materialCatalog];
    currentPageMaterials.forEach(item => {
      const index = updatedCatalog.findIndex(m => m.key === item.key);
      if (index >= 0) {
        updatedCatalog[index] = { ...updatedCatalog[index], selected: checked };
      } else {
        // 如果materialCatalog中没有这个item，添加它
        updatedCatalog.push({ ...item, selected: checked });
      }
    });
    setMaterialCatalog(updatedCatalog);
  };

  const handleMaterialSelect = (key, checked) => {
    const updatedCatalog = [...materialCatalog];
    const index = updatedCatalog.findIndex(item => item.key === key);
    
    if (index >= 0) {
      updatedCatalog[index] = { ...updatedCatalog[index], selected: checked };
    } else {
      // 如果materialCatalog中没有这个item，从materialCatalogData中获取完整的item信息
      const sourceItem = materialCatalogData.find(item => item.key === key);
      if (sourceItem) {
        // 添加它
        updatedCatalog.push({ ...sourceItem, selected: checked });
      }
    }
    
    setMaterialCatalog(updatedCatalog);
    
    // 检查当前页是否全选
    const startIndex = (catalogCurrentPage - 1) * catalogPageSize;
    const endIndex = catalogCurrentPage * catalogPageSize;
    const currentPageMaterials = (filteredMaterials.length > 0 ? filteredMaterials : materialCatalog)
      .slice(startIndex, endIndex);
    const allSelected = currentPageMaterials.every(item => {
      const catalogItem = updatedCatalog.find(m => m.key === item.key);
      return catalogItem ? catalogItem.selected : false;
    });
    setCatalogSelectAll(allSelected);
  };

  const handleSearchMaterials = (values) => {
    // 模拟搜索功能
    let filtered = [...materialCatalog];
    
    if (values.materialCode) {
      filtered = filtered.filter(item => 
        item.materialCode.toLowerCase().includes(values.materialCode.toLowerCase())
      );
    }
    
    if (values.materialName) {
      filtered = filtered.filter(item => 
        item.materialName.toLowerCase().includes(values.materialName.toLowerCase())
      );
    }
    
    if (values.specification) {
      filtered = filtered.filter(item => 
        item.specification.toLowerCase().includes(values.specification.toLowerCase())
      );
    }
    
    if (values.manufacturer) {
      filtered = filtered.filter(item => 
        item.manufacturer.toLowerCase().includes(values.manufacturer.toLowerCase())
      );
    }
    
    if (values.supplier) {
      filtered = filtered.filter(item => 
        item.supplier.toLowerCase().includes(values.supplier.toLowerCase())
      );
    }
    
    if (values.materialType) {
      filtered = filtered.filter(item => item.materialType === values.materialType);
    }
    
    setFilteredMaterials(filtered);
    setCatalogCurrentPage(1);
    setCatalogSelectAll(false);
  };

  const handleResetSearch = () => {
    searchForm.resetFields();
    setFilteredMaterials([...materialCatalog]);
    setCatalogCurrentPage(1);
    setCatalogSelectAll(false);
  };

  const handleConfirmMaterialSelection = () => {
    const selectedMaterials = materialCatalog.filter(item => item.selected);
    
    if (selectedMaterials.length === 0) {
      message.warning('请至少选择一项物资');
      return;
    }
    
    // 验证出库数量
    const invalidMaterials = selectedMaterials.filter(item => {
      const outboundQty = parseInt(item.outboundQuantity || 0);
      return outboundQty <= 0 || outboundQty > item.stock;
    });
    
    if (invalidMaterials.length > 0) {
      message.error('请检查出库数量，必须大于0且不超过库存数量');
      return;
    }
    
    // 将选中的物资添加到出库列表
    const currentMaterials = form.getFieldValue('manualMaterials') || [];
    const newMaterials = selectedMaterials.map(item => {
      const outboundQty = parseInt(item.outboundQuantity || 1);
      return {
        key: Date.now().toString() + item.key, // 生成唯一key
        orderNumber: `OUT-${Date.now().toString().slice(-6)}`, // 模拟订单号
        materialCode: item.materialCode,
        materialName: item.materialName,
        specification: item.specification,
        model: item.model,
        manufacturer: item.manufacturer,
        supplier: item.supplier,
        registrationNumber: `REG-${item.materialCode}`,
        orderQuantity: outboundQty,
        orderUnit: item.unit,
        stockInQuantity: outboundQty,
        packageUnit: item.minPackage,
        batchNumber: item.batchNumber || `BATCH-${Date.now().toString().slice(-4)}`,
        productionDate: item.productionDate || dayjs().subtract(30, 'day').format('YYYY-MM-DD'),
        expiryDate: item.expiryDate || dayjs().add(365, 'day').format('YYYY-MM-DD'),
        purchasePrice: item.unitPrice,
        purchaseAmount: item.unitPrice * outboundQty,
        department: currentDepartment,
        createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        remark: ''
      };
    });
    
    form.setFieldsValue({ manualMaterials: [...currentMaterials, ...newMaterials] });
    message.success(`已添加 ${selectedMaterials.length} 项物资到出库列表`);
    handleCloseMaterialSelect();
  };

  // 表格全选/取消全选功能
  const handleTableSelectAll = (e) => {
    const checked = e.target.checked;
    setTableSelectAll(checked);
    
    const materials = mode === 'scan' 
      ? scanMaterialsState
      : (form.getFieldValue('manualMaterials') || []);
    if (checked) {
      // 全选：获取所有行的key
      const allKeys = materials.map(item => item.key);
      setSelectedRowKeys(allKeys);
    } else {
      // 取消全选：清空选中的key
      setSelectedRowKeys([]);
    }
  };

  // 处理单行选择
  const handleRowSelect = (key, checked) => {
    const updatedSelectedKeys = [...selectedRowKeys];
    
    if (checked) {
      // 添加key到选中列表
      if (!updatedSelectedKeys.includes(key)) {
        updatedSelectedKeys.push(key);
      }
    } else {
      // 从选中列表中移除key
      const index = updatedSelectedKeys.indexOf(key);
      if (index > -1) {
        updatedSelectedKeys.splice(index, 1);
      }
    }
    
    setSelectedRowKeys(updatedSelectedKeys);
    
    // 检查是否全选
    const materials = mode === 'scan' 
      ? scanMaterialsState
      : (form.getFieldValue('manualMaterials') || []);
    const allSelected = materials.length > 0 && updatedSelectedKeys.length === materials.length;
    setTableSelectAll(allSelected);
  };

  // 删除选中明细
  const handleDeleteSelected = () => {
    const materials = mode === 'scan' 
      ? scanMaterialsState
      : (form.getFieldValue('manualMaterials') || []);
    
    if (materials.length === 0) {
      // 明细表单内没有明细记录时，删除为不可操作
      // 按钮已经通过disabled属性控制，这里不需要额外处理
      return;
    }
    
    if (selectedRowKeys.length === 0) {
      // 当明细中没有通过复选框勾选对应明细时，弹出窗口提示
      message.warning('请选择要删除的明细记录');
      return;
    }
    
    // 显示删除确认弹窗
    setDeleteConfirmVisible(true);
  };

  // 确认删除
  const handleConfirmDelete = () => {
    const materials = mode === 'scan' 
      ? scanMaterialsState
      : (form.getFieldValue('manualMaterials') || []);
    
    // 过滤掉选中的明细记录
    const remainingMaterials = materials.filter(item => !selectedRowKeys.includes(item.key));
    
    // 更新表单数据和状态
    if (mode === 'scan') {
      form.setFieldsValue({ scanMaterials: remainingMaterials });
      setScanMaterialsState(remainingMaterials);
    } else {
      form.setFieldsValue({ manualMaterials: remainingMaterials });
    }
    
    // 清空选中状态
    setSelectedRowKeys([]);
    setTableSelectAll(false);
    
    // 关闭确认弹窗
    setDeleteConfirmVisible(false);
    
    // 显示成功消息
    message.success(`已删除 ${selectedRowKeys.length} 条明细记录`);
  };

  // 取消删除
  const handleCancelDelete = () => {
    setDeleteConfirmVisible(false);
  };

  // 处理出库数量变化
  const handleOutboundQuantityChange = (key, value) => {
    // 更新 materialCatalog
    const updatedCatalog = materialCatalog.map(item => {
      if (item.key === key) {
        return { ...item, outboundQuantity: value };
      }
      return item;
    });
    setMaterialCatalog(updatedCatalog);
    
    // 更新 filteredMaterials
    const updatedFiltered = filteredMaterials.map(item => {
      if (item.key === key) {
        return { ...item, outboundQuantity: value };
      }
      return item;
    });
    setFilteredMaterials(updatedFiltered);
  };

  // 处理数量输入框聚焦
  const handleQuantityInputFocus = (key, e) => {
    const inputElement = e.target;
    const rect = inputElement.getBoundingClientRect();
    
    // 设置浮窗位置（在输入框右侧显示）
    setQuantityPopupPosition({
      x: rect.right + 5,
      y: rect.top
    });
    
    // 设置当前操作的物资key
    setCurrentQuantityKey(key);
    
    // 显示浮窗
    setQuantityPopupVisible(true);
  };

  // 处理数量选择
  const handleQuantitySelect = (increment) => {
    if (!currentQuantityKey) return;
    
    const currentItem = materialCatalog.find(item => item.key === currentQuantityKey);
    if (!currentItem) return;
    
    let newQuantity = 0;
    const currentQuantity = parseInt(currentItem.outboundQuantity || 0);
    
    if (increment === 'max') {
      // 选择最大数量（库存数量）
      newQuantity = currentItem.stock;
    } else {
      // 增加指定数量
      newQuantity = currentQuantity + parseInt(increment);
      
      // 不能超过库存数量
      if (newQuantity > currentItem.stock) {
        newQuantity = currentItem.stock;
      }
    }
    
    // 更新数量
    handleOutboundQuantityChange(currentQuantityKey, newQuantity.toString());
  };

  // 关闭数量选择浮窗
  const handleCloseQuantityPopup = () => {
    setQuantityPopupVisible(false);
    setCurrentQuantityKey(null);
  };

  // 监听全局点击事件，关闭浮窗
  useEffect(() => {
    const handleClickOutside = (event) => {
      // 如果浮窗可见，且点击的不是浮窗本身，则关闭浮窗
      if (quantityPopupVisible) {
        const popupElement = document.querySelector('[data-quantity-popup]');
        if (popupElement && !popupElement.contains(event.target)) {
          // 检查点击的是否是输入框
          const isInputClick = event.target.closest('input[placeholder="请输入"]');
          if (!isInputClick) {
            handleCloseQuantityPopup();
          }
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [quantityPopupVisible]);



  return (
    <div style={{ padding: '0 16px' }}>
      <h1 style={{ marginBottom: 24 }}>消耗出库</h1>
      
      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleStockOut}
          initialValues={initialValues}
        >
          {/* 出库模式选择 */}
          <Form.Item label="出库模式" style={{ marginBottom: 24 }}>
            <Radio.Group value={mode} onChange={(e) => setMode(e.target.value)}>
              <Space>
                <Radio.Button value="scan" icon={<BarcodeOutlined />}>扫码出库</Radio.Button>
                <Radio.Button value="manual" icon={<EditOutlined />}>手动出库</Radio.Button>
              </Space>
            </Radio.Group>
          </Form.Item>

          {/* 基本信息 */}
          <Row gutter={16}>
            <Form.Item
              name="department"
              label="消耗科室"
              rules={[{ required: true, message: '请选择消耗科室' }]}
              xs={{ span: 24 }}
              sm={{ span: 12 }}
              md={{ span: 8 }}
            >
              <Input readOnly style={{ width: '100%' }} />
            </Form.Item>
            

            
            <Form.Item
              name="operator"
              label="操作人"
              rules={[{ required: true, message: '请输入操作人' }]}
              xs={{ span: 24 }}
              sm={{ span: 12 }}
              md={{ span: 8 }}
            >
              <Input readOnly placeholder="请输入操作人" />
            </Form.Item>
          </Row>

          {/* 出库类型（仅手动出库模式显示） */}
          {mode === 'manual' && (
            <Form.Item
              name="outType"
              label="出库类型"
              rules={[{ required: true, message: '请选择出库类型' }]}
              xs={{ span: 24 }}
              sm={{ span: 12 }}
              md={{ span: 8 }}
            >
              <Select placeholder="请选择出库类型">
                <Select.Option value="consumption">消耗出库</Select.Option>
                <Select.Option value="quality">质控出库</Select.Option>
                <Select.Option value="review">复查出库</Select.Option>
                <Select.Option value="loss">损耗出库</Select.Option>
              </Select>
            </Form.Item>
          )}

          {/* 扫码出库模式 */}
          {mode === 'scan' && (
            <Card size="small" style={{ marginBottom: 24, border: '1px dashed #d9d9d9' }}>
              <Form.Item label="扫码输入">
                <Space style={{ width: '100%' }}>
                  <Input
                    placeholder="请输入或扫描条码"
                    onPressEnter={(e) => handleScanBarcode(e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <Button type="primary" icon={<BarcodeOutlined />} onClick={() => {
                    const barcodeInput = document.querySelector('input[placeholder="请输入或扫描条码"]');
                    if (barcodeInput) {
                      handleScanBarcode(barcodeInput.value);
                    }
                  }}>
                    确认扫码
                  </Button>
                </Space>
              </Form.Item>
              <div style={{ color: '#8c8c8c', fontSize: '12px' }}>
                <p>扫码说明：</p>
                <ul>
                  <li>扫描物资条码，系统自动识别并添加到出库列表</li>
                  <li>同一物资重复扫码，数量自动累加</li>
                  <li>支持的条码：{materialsWithStock.map(item => item.code).join(', ')}</li>
                </ul>
              </div>
            </Card>
          )}

          {/* 物资明细表单 */}
          <Card>
            <div className="ant-table-content" style={{ overflow: 'auto hidden', position: 'relative', minHeight: '200px' }}>
              <table style={{ width: '1600px', minWidth: '100%', tableLayout: 'auto' }}>
                <colgroup>
                  <col style={{ width: '60px' }} />
                  <col style={{ width: '140px' }} />
                  <col style={{ width: '100px' }} />
                  <col style={{ width: '120px' }} />
                  <col style={{ width: '80px' }} />
                  <col style={{ width: '120px' }} />
                  <col style={{ width: '120px' }} />
                  <col style={{ width: '120px' }} />
                  <col style={{ width: '80px' }} />
                  <col style={{ width: '80px' }} />
                  <col style={{ width: '100px' }} />
                  <col style={{ width: '100px' }} />
                  <col style={{ width: '100px' }} />
                  <col style={{ width: '80px' }} />
                  <col style={{ width: '80px' }} />
                  <col style={{ width: '140px' }} />
                </colgroup>
                <thead className="ant-table-thead">
                  <tr>
                    <th className="ant-table-cell ant-table-selection-column" scope="col">
                      <div className="ant-table-selection">
                        <label className="ant-checkbox-wrapper">
                          <span className="ant-checkbox ant-wave-target">
                            <input 
                              aria-label="Select all" 
                              className="ant-checkbox-input" 
                              type="checkbox" 
                              checked={tableSelectAll}
                              onChange={handleTableSelectAll}
                            />
                            <span className="ant-checkbox-inner"></span>
                          </span>
                        </label>
                      </div>
                    </th>
                    <th className="ant-table-cell" scope="col">订单号</th>
                    <th className="ant-table-cell" scope="col">商品编码</th>
                    <th className="ant-table-cell" scope="col">规格</th>
                    <th className="ant-table-cell" scope="col">型号</th>
                    <th className="ant-table-cell" scope="col">生产厂家</th>
                    <th className="ant-table-cell" scope="col">供应商</th>
                    <th className="ant-table-cell" scope="col">注册证号</th>
                    <th className="ant-table-cell" scope="col">订货数量</th>
                    <th className="ant-table-cell" scope="col">订货单位</th>
                    <th className="ant-table-cell" scope="col">批号</th>
                    <th className="ant-table-cell" scope="col">生产日期</th>
                    <th className="ant-table-cell" scope="col">失效日期</th>
                    <th className="ant-table-cell" scope="col">采购单价</th>
                    <th className="ant-table-cell" scope="col">采购金额</th>
                    <th className="ant-table-cell" scope="col">创建时间</th>
                  </tr>
                </thead>
                <tbody className="ant-table-tbody">
                  {(() => {
                    const materials = mode === 'scan' 
                      ? scanMaterialsState
                      : (form.getFieldValue('manualMaterials') || []);
                    if (materials.length === 0) {
                      return null;
                    }
                    return materials.map((item, index) => (
                      <tr key={item.key || index} style={{ borderBottom: '1px solid #f0f0f0' }}>
                        <td className="ant-table-cell ant-table-selection-column" style={{ padding: '12px 8px', textAlign: 'center' }}>
                          <div className="ant-table-selection">
                            <label className="ant-checkbox-wrapper">
                              <span className="ant-checkbox ant-wave-target">
                                <input 
                                  aria-label="Select row" 
                                  className="ant-checkbox-input" 
                                  type="checkbox" 
                                  checked={selectedRowKeys.includes(item.key)}
                                  onChange={(e) => handleRowSelect(item.key, e.target.checked)}
                                />
                                <span className="ant-checkbox-inner"></span>
                              </span>
                            </label>
                          </div>
                        </td>
                        <td className="ant-table-cell" style={{ padding: '12px 8px', textAlign: 'center' }}>{item.orderNumber || '-'}</td>
                        <td className="ant-table-cell" style={{ padding: '12px 8px', textAlign: 'center' }}>{item.materialCode || '-'}</td>
                        <td className="ant-table-cell" style={{ padding: '12px 8px', textAlign: 'center' }}>{item.specification || '-'}</td>
                        <td className="ant-table-cell" style={{ padding: '12px 8px', textAlign: 'center' }}>{item.model || '-'}</td>
                        <td className="ant-table-cell" style={{ padding: '12px 8px', textAlign: 'center' }}>{item.manufacturer || '-'}</td>
                        <td className="ant-table-cell" style={{ padding: '12px 8px', textAlign: 'center' }}>{item.supplier || '-'}</td>
                        <td className="ant-table-cell" style={{ padding: '12px 8px', textAlign: 'center' }}>{item.registrationNumber || '-'}</td>
                        <td className="ant-table-cell" style={{ padding: '12px 8px', textAlign: 'center' }}>{item.orderQuantity || 1}</td>
                        <td className="ant-table-cell" style={{ padding: '12px 8px', textAlign: 'center' }}>{item.orderUnit || '-'}</td>
                        <td className="ant-table-cell" style={{ padding: '12px 8px', textAlign: 'center' }}>{item.batchNumber || '-'}</td>
                        <td className="ant-table-cell" style={{ padding: '12px 8px', textAlign: 'center' }}>{item.productionDate || '-'}</td>
                        <td className="ant-table-cell" style={{ padding: '12px 8px', textAlign: 'center' }}>{item.expiryDate || '-'}</td>
                        <td className="ant-table-cell" style={{ padding: '12px 8px', textAlign: 'center' }}>¥{(item.purchasePrice || 0).toFixed(2)}</td>
                        <td className="ant-table-cell" style={{ padding: '12px 8px', textAlign: 'center' }}>¥{(item.purchaseAmount || 0).toFixed(2)}</td>
                        <td className="ant-table-cell" style={{ padding: '12px 8px', textAlign: 'center' }}>{item.createTime || dayjs().format('YYYY-MM-DD HH:mm:ss')}</td>
                      </tr>
                    ));
                  })()}
                </tbody>
              </table>
              
              {/* 固定居中的暂无数据提示 */}
              {(() => {
                const materials = mode === 'scan' 
                  ? scanMaterialsState
                  : (form.getFieldValue('manualMaterials') || []);
                if (materials.length === 0) {
                  return (
                    <div style={{ 
                      position: 'absolute', 
                      top: '50%', 
                      left: '50%', 
                      transform: 'translate(-50%, -50%)',
                      zIndex: 10,
                      pointerEvents: 'none'
                    }}>
                      <div className="ant-empty ant-empty-normal" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div className="ant-empty-image" style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
                          <svg width="64" height="41" viewBox="0 0 64 41" xmlns="http://www.w3.org/2000/svg">
                            <title>暂无数据</title>
                            <g transform="translate(0 1)" fill="none" fillRule="evenodd">
                              <ellipse fill="#f5f5f5" cx="32" cy="33" rx="32" ry="7"></ellipse>
                              <g fillRule="nonzero" stroke="#d9d9d9">
                                <path d="M55 12.76L44.854 1.258C44.367.474 43.656 0 42.907 0H21.093c-.749 0-1.46.474-1.947 1.257L9 12.761V22h46v-9.24z"></path>
                                <path d="M41.613 15.931c0-1.605.994-2.93 2.227-2.931H55v18.137C55 33.26 53.68 35 52.05 35h-40.1C10.32 35 9 33.259 9 31.137V13h11.16c1.233 0 2.227 1.323 2.227 2.928v.022c0 1.605 1.005 2.901 2.237 2.901h14.752c1.232 0 2.237-1.308 2.237-2.913v-.007z" fill="#fafafa"></path>
                              </g>
                            </g>
                          </svg>
                        </div>
                        <div className="ant-empty-description" style={{ textAlign: 'center' }}>暂无数据</div>
                      </div>
                    </div>
                  );
                }
                return null;
              })()}
            </div>
          </Card>

          {/* 添加物资按钮 - 只在手动出库模式下显示 */}
          {mode === 'manual' && (
            <Form.Item>
              <Button type="dashed" block icon={<PlusOutlined />} onClick={handleOpenMaterialSelect}>
                添加物资
              </Button>
            </Form.Item>
          )}

          {/* 备注栏 - 两种模式都显示 */}
          <Form.Item label="备注" style={{ marginBottom: 16 }}>
            <TextArea rows={4} placeholder="请输入备注信息" />
          </Form.Item>

          <Form.Item>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <Button 
                type="primary" 
                danger
                icon={<MinusCircleOutlined />}
                onClick={handleDeleteSelected}
                disabled={selectedRowKeys.length === 0}
              >
                删除
              </Button>
              <Button onClick={() => {
                if (mode === 'scan') {
                  form.setFieldsValue({ scanMaterials: [] });
                  setScanMaterialsState([]);
                } else {
                  form.setFieldsValue({ manualMaterials: [] });
                }
              }}>重置</Button>
              <Button type="primary" onClick={() => setStockOutConfirmVisible(true)}>
                确认出库
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>

      {visible && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: 24, borderRadius: 8, minWidth: 300 }}>
            <h3>出库成功</h3>
            <p>{mode === 'scan' ? '扫码出库' : '手动出库'}操作已成功完成！</p>
            <Button type="primary" onClick={() => {
              setVisible(false);
              if (mode === 'scan') {
                form.setFieldsValue({ scanMaterials: [] });
                setScanMaterialsState([]);
              } else {
                form.setFieldsValue({ manualMaterials: [] });
              }
            }}>确定</Button>
          </div>
        </div>
      )}

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
            <Row gutter={[12, 12]} style={{ width: '100%' }}>
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
                <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '100px' }}>规格</th>
                <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '100px' }}>型号</th>
                <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '80px' }}>库存数量</th>
                <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '100px' }}>出库数量</th>
                <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '120px' }}>批号</th>
                <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '120px' }}>生产日期</th>
                <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '120px' }}>失效日期</th>
                <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '150px' }}>生产厂家</th>
                <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '150px' }}>供应商</th>
                <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '100px' }}>物资类型</th>
                <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '100px' }}>最小包装</th>
                <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '80px' }}>单位</th>
                <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '80px' }}>单价</th>
              </tr>
            </thead>
            <tbody>
              {(filteredMaterials.length > 0 ? filteredMaterials : materialCatalog)
                .slice((catalogCurrentPage - 1) * catalogPageSize, catalogCurrentPage * catalogPageSize)
                .map(item => {
                  const catalogItem = materialCatalog.find(m => m.key === item.key);
                  const isSelected = catalogItem ? catalogItem.selected : false;
                  
                  return (
                    <tr key={item.key} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>
                        <Checkbox 
                          checked={isSelected}
                          onChange={(e) => handleMaterialSelect(item.key, e.target.checked)}
                        />
                      </td>
                      <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>{item.materialCode}</td>
                      <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>{item.materialName}</td>
                      <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>{item.specification}</td>
                      <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>{item.model}</td>
                      <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>{item.stock}</td>
                      <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', position: 'relative' }}>
                        <Input 
                          size="small" 
                          placeholder="请输入" 
                          style={{ width: '80px' }}
                          value={item.outboundQuantity || ''}
                          onChange={(e) => handleOutboundQuantityChange(item.key, e.target.value)}
                          onFocus={(e) => handleQuantityInputFocus(item.key, e)}
                        />
                      </td>
                      <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>{item.batchNumber || '-'}</td>
                      <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>{item.productionDate || '-'}</td>
                      <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>{item.expiryDate || '-'}</td>
                      <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>{item.manufacturer}</td>
                      <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>{item.supplier}</td>
                      <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>{item.materialType}</td>
                      <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>{item.minPackage}</td>
                      <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>{item.unit}</td>
                      <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>¥{item.unitPrice.toFixed(2)}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        {/* 分页控件 */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: 16
        }}>
          <div>
            <span style={{ color: '#666', fontSize: '14px' }}>
              共 <strong>{(filteredMaterials.length > 0 ? filteredMaterials : materialCatalog).length}</strong> 条记录，当前选中 <strong style={{ color: '#1890ff' }}>{materialCatalog.filter(item => item.selected).length}</strong> 项
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Select
              value={catalogPageSize}
              onChange={(value) => {
                setCatalogPageSize(value);
                setCatalogCurrentPage(1);
              }}
              style={{ width: 120 }}
              size="middle"
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

        {/* 数量选择浮窗 */}
        {quantityPopupVisible && (
          <div 
            data-quantity-popup="true"
            style={{
              position: 'fixed',
              left: quantityPopupPosition.x,
              top: quantityPopupPosition.y,
              zIndex: 9999,
              backgroundColor: 'white',
              border: '1px solid #d9d9d9',
              borderRadius: '6px',
              boxShadow: '0 3px 6px -4px rgba(0,0,0,0.12), 0 6px 16px 0 rgba(0,0,0,0.08), 0 9px 28px 8px rgba(0,0,0,0.05)',
              padding: '8px 0',
              minWidth: '80px'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <button
                style={{
                  padding: '6px 12px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: '14px',
                  color: '#333',
                  transition: 'background-color 0.3s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                onClick={() => handleQuantitySelect('1')}
              >
                +1
              </button>
              <button
                style={{
                  padding: '6px 12px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: '14px',
                  color: '#333',
                  transition: 'background-color 0.3s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                onClick={() => handleQuantitySelect('5')}
              >
                +5
              </button>
              <button
                style={{
                  padding: '6px 12px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: '14px',
                  color: '#333',
                  transition: 'background-color 0.3s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                onClick={() => handleQuantitySelect('10')}
              >
                +10
              </button>
              <div style={{ height: '1px', backgroundColor: '#f0f0f0', margin: '4px 0' }}></div>
              <button
                style={{
                  padding: '6px 12px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: '14px',
                  color: '#1890ff',
                  fontWeight: '500',
                  transition: 'background-color 0.3s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                onClick={() => handleQuantitySelect('max')}
              >
                max
              </button>
            </div>
          </div>
        )}
       </Modal>

      {/* 删除确认弹窗 */}
      <Modal
        title="删除确认"
        open={deleteConfirmVisible}
        onCancel={handleCancelDelete}
        footer={[
          <Button key="no" onClick={handleCancelDelete}>
            否
          </Button>,
          <Button key="yes" type="primary" danger onClick={handleConfirmDelete}>
            是
          </Button>
        ]}
      >
        <p>是否确认删除所选明细？</p>
        <p style={{ color: '#ff4d4f', fontSize: '14px', marginTop: '8px' }}>
          将删除 {selectedRowKeys.length} 条明细记录，此操作不可撤销。
        </p>
      </Modal>

      {/* 确认出库弹窗 */}
      <Modal
        title="确认出库"
        open={stockOutConfirmVisible}
        onCancel={() => setStockOutConfirmVisible(false)}
        footer={[
          <Button key="no" onClick={() => setStockOutConfirmVisible(false)}>
            取消
          </Button>,
          <Button key="yes" type="primary" onClick={() => {
            form.submit();
            setStockOutConfirmVisible(false);
          }}>
            确认
          </Button>
        ]}
      >
        <p>是否确认执行出库操作？</p>
        <p style={{ color: '#1890ff', fontSize: '14px', marginTop: '8px' }}>
          {mode === 'scan' ? '扫码出库' : '手动出库'}操作将提交并不可撤销。
        </p>
      </Modal>
     </div>
   );
 };

export default StockOutConsumption;
