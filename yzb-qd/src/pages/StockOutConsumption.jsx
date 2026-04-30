import React, { useState, useEffect, useMemo } from 'react';
import { Form, Input, Select, Button, Card, Radio, Space, message, Modal, Checkbox, Tag, Pagination } from 'antd';
import { MinusCircleOutlined, PlusOutlined, BarcodeOutlined, EditOutlined, SearchOutlined, ExportOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import api from '../utils/api.js';

const { TextArea } = Input;

const StockOutConsumption = () => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState('scan'); // scan: 扫码出库, manual: 手动出库
  
  // 物资选择弹窗相关状态
  const [materialSelectModalVisible, setMaterialSelectModalVisible] = useState(false);
  const [materialCatalog, setMaterialCatalog] = useState([]);
  const [selectedCatalogRows, setSelectedCatalogRows] = useState([]); // 存储选中的完整对象
  const [catalogSelectAll, setCatalogSelectAll] = useState(false);
  const [catalogCurrentPage, setCatalogCurrentPage] = useState(1);
  const [catalogPageSize, setCatalogPageSize] = useState(10);
  const [catalogTotal, setCatalogTotal] = useState(0);
  const [searchForm] = Form.useForm();
  
  // 表格全选状态管理
  const [tableSelectAll, setTableSelectAll] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  
  // 删除确认弹窗状态
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  
  // 确认出库弹窗状态
  const [stockOutConfirmVisible, setStockOutConfirmVisible] = useState(false);
  // 出库类型状态
  const [currentOutType, setCurrentOutType] = useState('consumption');
  
  // 数量选择浮窗状态
  const [quantityPopupVisible, setQuantityPopupVisible] = useState(false);
  const [quantityPopupPosition, setQuantityPopupPosition] = useState({ x: 0, y: 0 });
  const [currentQuantityKey, setCurrentQuantityKey] = useState(null);

  // 扫码数据状态管理
  const [scanMaterialsState, setScanMaterialsState] = useState([]);
  
  // 模拟有库存的耗材数据 - 已删除，使用数据库数据
  const materialsWithStock = [];

  // 物资目录数据（用于选择弹窗）- 已删除，使用数据库数据
  const materialCatalogData = [];

  // 表单初始值
  const initialValues = {
    outType: 'consumption',
    scanMaterials: [],
    manualMaterials: []
  };

  // 监听科室变化，实时更新表单
  React.useEffect(() => {
    // 这个useEffect现在为空，因为消耗科室和操作人表单项已被删除
  }, []);

  // 初始化物资目录数据
  React.useEffect(() => {
    // 初始加载第一页数据
    if (materialSelectModalVisible) {
      loadInventoryData();
    }
  }, [materialSelectModalVisible]);

  // 物资选择弹窗相关方法
  const handleOpenMaterialSelect = () => {
    setMaterialSelectModalVisible(true);
    searchForm.resetFields();
    setSelectedCatalogRows([]); // 每次打开弹窗清空临时选择
    setCatalogSelectAll(false);
    setCatalogCurrentPage(1);
  };

  const handleCloseMaterialSelect = () => {
    setMaterialSelectModalVisible(false);
  };

  const handleCatalogSelectAll = (e) => {
    const checked = e.target.checked;
    setCatalogSelectAll(checked);
    
    let updatedSelectedRows = [...selectedCatalogRows];
    
    materialCatalog.forEach(item => {
      const exists = updatedSelectedRows.some(row => row.key === item.key);
      if (checked) {
        if (!exists) {
          updatedSelectedRows.push({ ...item, selected: true });
        }
      } else {
        updatedSelectedRows = updatedSelectedRows.filter(row => row.key !== item.key);
      }
    });
    
    setSelectedCatalogRows(updatedSelectedRows);
  };

  const handleMaterialSelect = (record, checked) => {
    let updatedSelectedRows = [...selectedCatalogRows];
    
    if (checked) {
      if (!updatedSelectedRows.some(row => row.key === record.key)) {
        updatedSelectedRows.push({ ...record, selected: true });
      }
    } else {
      updatedSelectedRows = updatedSelectedRows.filter(row => row.key !== record.key);
    }
    
    setSelectedCatalogRows(updatedSelectedRows);
    
    // 检查当前页是否全选
    const allCurrentPageSelected = materialCatalog.every(item => 
      updatedSelectedRows.some(row => row.key === item.key)
    );
    setCatalogSelectAll(allCurrentPageSelected);
  };

  const handleSearchMaterials = (values) => {
    setCatalogCurrentPage(1);
    loadInventoryData({ ...values, pageNum: 1 });
  };

  const handleResetSearch = () => {
    searchForm.resetFields();
    setCatalogCurrentPage(1);
    loadInventoryData({ pageNum: 1 });
  };

  const handleCatalogPageChange = (page, pageSize) => {
    setCatalogCurrentPage(page);
    if (pageSize) setCatalogPageSize(pageSize);
    const values = searchForm.getFieldsValue();
    loadInventoryData({ ...values, pageNum: page, pageSize: pageSize || catalogPageSize });
  };

  const handleConfirmMaterialSelection = () => {
    if (selectedCatalogRows.length === 0) {
      message.warning('请至少选择一项物资');
      return;
    }
    
    // 验证出库数量
    const invalidMaterials = selectedCatalogRows.filter(item => {
      const outboundQty = parseInt(item.outboundQuantity || 0);
      return outboundQty <= 0 || outboundQty > item.stock;
    });
    
    if (invalidMaterials.length > 0) {
      message.error('请检查出库数量，必须大于0且不超过库存数量');
      return;
    }
    
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const operatorName = userInfo.realName || userInfo.userName || '管理员';

    // 将选中的物资添加到出库列表
    const currentMaterials = form.getFieldValue('manualMaterials') || [];
    const newMaterials = selectedCatalogRows.map(item => {
      const outboundQty = parseInt(item.outboundQuantity || 1);
      return {
        key: `manual-${Date.now()}-${item.key}`, // 生成唯一key
        inventoryId: item.inventoryId,
        materialCode: item.materialCode,
        materialName: item.materialName,
        specification: item.specification,
        model: item.model,
        materialType: item.materialType,
        manufacturer: item.manufacturer,
        supplier: item.supplier,
        registrationNumber: item.registrationNumber,
        orderQuantity: outboundQty,
        unit: item.unit,
        batchNumber: item.batchNumber,
        productionDate: item.productionDate,
        expiryDate: item.expiryDate,
        purchasePrice: item.unitPrice,
        purchaseAmount: item.unitPrice * outboundQty,
        createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        reason: '手动出库',
        operatorName: operatorName,
        status: '待提交'
      };
    });
    
    form.setFieldsValue({ manualMaterials: [...currentMaterials, ...newMaterials] });
    message.success(`已添加 ${selectedCatalogRows.length} 项物资到出库列表`);
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
    
    // 同时更新 selectedCatalogRows，确保确定的物资带上最新的数量
    const updatedSelectedRows = selectedCatalogRows.map(item => {
      if (item.key === key) {
        return { ...item, outboundQuantity: value };
      }
      return item;
    });
    setSelectedCatalogRows(updatedSelectedRows);
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
    
    // 选择数量后自动关闭弹窗
    handleCloseQuantityPopup();
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

  const [loading, setLoading] = useState(false);
  const [stockOutLoading, setStockOutLoading] = useState(false);
  const [undoLoading, setUndoLoading] = useState(false);

  // 从后端加载实时库存数据（用于手动出库选择）
  const loadInventoryData = async (values = {}) => {
    try {
      setLoading(true);
      const params = {
        pageNum: values.pageNum || catalogCurrentPage,
        pageSize: values.pageSize || catalogPageSize,
        materialCode: values.materialCode,
        materialName: values.materialName,
        supplier: values.supplier,
        manufacturer: values.manufacturer,
        materialType: values.materialType
      };
      // 修复 API 路径，移除 /list，后端 InventoryManagementController 映射的是根路径
      const response = await api.get('/api/scm/inventory', params);
      if (response.code === 1 && response.data) {
        const records = response.data.records || [];
        const catalog = records.map(item => {
          // 检查该项是否已在选中列表中
          const selectedRow = selectedCatalogRows.find(row => row.key === String(item.id));
          return {
            key: String(item.id),
            inventoryId: item.id,
            materialCode: item.materialCode,
            materialName: item.materialName,
            materialType: item.category || '耗材', // 后端字段是 category
            specification: item.specification,
            model: item.model,
            batchNumber: item.batchNumber,
            productionDate: item.productionDate,
            expiryDate: item.expiryDate,
            unit: item.unit,
            unitPrice: item.purchasePrice || 0,
            stock: item.currentStock,
            minPackage: item.minPackage || '-',
            registrationNumber: item.registrationNumber,
            supplier: item.supplier, // 后端字段是 supplier
            manufacturer: item.manufacturer,
            selected: !!selectedRow,
            outboundQuantity: selectedRow ? selectedRow.outboundQuantity : ''
          };
        });
        setMaterialCatalog(catalog);
        setCatalogTotal(response.data.total || 0);
        
        // 更新全选状态
        const allSelected = catalog.length > 0 && catalog.every(item => 
          selectedCatalogRows.some(row => row.key === item.key)
        );
        setCatalogSelectAll(allSelected);
      }
    } catch (error) {
      console.error('加载库存数据失败:', error);
      message.error('加载库存数据失败，请检查网络连接');
    } finally {
      setLoading(false);
    }
  };

  // 扫码处理函数（对接后端接口）
  const handleScanBarcode = async (barcode) => {
    if (!barcode) return;
    try {
      setLoading(true);
      // 后端没有专门的 barcode 接口，改用标准的库存查询接口，通过 materialCode 过滤
      const response = await api.get('/api/scm/inventory', { materialCode: barcode, pageNum: 1, pageSize: 1 });
      if (response.code === 1 && response.data && response.data.records && response.data.records.length > 0) {
        const material = response.data.records[0];
        const currentMaterials = form.getFieldValue('scanMaterials') || [];
        const existingIndex = currentMaterials.findIndex(item => item.materialCode === material.materialCode && item.batchNumber === material.batchNumber);
        
        const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
        const operatorName = userInfo.realName || userInfo.userName || '管理员';

        let updatedMaterials;
        if (existingIndex >= 0) {
          updatedMaterials = [...currentMaterials];
          updatedMaterials[existingIndex] = {
            ...updatedMaterials[existingIndex],
            orderQuantity: (updatedMaterials[existingIndex].orderQuantity || 0) + 1
          };
        } else {
          updatedMaterials = [...currentMaterials, {
            ...material,
            key: `scan-${Date.now()}-${material.id}`,
            inventoryId: material.id,
            orderQuantity: 1,
            reason: '扫码出库',
            operatorName: operatorName,
            status: '待提交'
          }];
        }
        form.setFieldsValue({ scanMaterials: updatedMaterials });
        setScanMaterialsState(updatedMaterials);
        message.success(`扫码成功: ${material.materialName}`);
      } else {
        message.warning('未找到对应物资或库存不足');
      }
    } catch (error) {
      console.error('扫码查询失败:', error);
      message.error('条码查询失败，请手动选择');
    } finally {
      setLoading(false);
    }
  };

  // 确认出库处理函数（对接后端 /api/scm/stock-out）
  const handleConfirmStockOut = async () => {
    try {
      setStockOutLoading(true);
      const outType = form.getFieldValue('outType');
      const materials = mode === 'scan' ? scanMaterialsState : (form.getFieldValue('manualMaterials') || []);
      
      if (materials.length === 0) {
        message.warning('请先添加出库物资');
        return;
      }

      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      const operatorName = userInfo.realName || userInfo.userName || '管理员';
      const departmentName = userInfo.departmentName || userInfo.department || '耗材科'; // 获取科室名称

      const stockOutData = {
        stockOutType: outType,
        departmentName: departmentName, // 补充必填字段
        operatorName: operatorName,
        reason: outType === 'consumption' ? '常规消耗' : (outType === 'quality' ? '质控消耗' : '出库消耗'), // 补充必填字段
        remark: form.getFieldValue('remark') || '',
        outboundDate: dayjs().format('YYYY-MM-DD'),
        items: materials.map(item => ({
          inventoryId: item.inventoryId,
          outboundQuantity: item.orderQuantity
        }))
      };

      const response = await api.post('/api/scm/stock-out', stockOutData);
      if (response.code === 1) {
        // 显示成功提示
        setVisible(true);
        
        // 清空当前列表
        if (mode === 'scan') {
          form.setFieldsValue({ scanMaterials: [] });
          setScanMaterialsState([]);
        } else {
          form.setFieldsValue({ manualMaterials: [] });
        }
        setStockOutConfirmVisible(false);
      } else {
        message.error(response.message || '出库失败');
      }
    } catch (error) {
      console.error('执行出库失败:', error);
      message.error('出库失败，请联系管理员');
    } finally {
      setStockOutLoading(false);
    }
  };

  // 撤销出库处理函数（对接后端 /api/scm/stock-out/undo）
  const handleUndoStockOut = async (item) => {
    try {
      setUndoLoading(true);
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      const operatorName = userInfo.realName || userInfo.userName || '管理员';

      const undoData = {
        operatorName: operatorName,
        reason: '操作撤销'
      };

      // 假设撤销接口需要 materialCode 和 outboundDate 作为查询标识
      const response = await api.post(`/api/scm/stock-out/undo?materialCode=${item.materialCode}&outboundDate=${item.outboundDate}`, undoData);
      
      if (response.code === 1) {
        message.success('撤销出库成功');
        // 更新本地列表状态
        const updateList = (list) => list.map(m => m.key === item.key ? { ...m, status: '已撤销' } : m);
        if (mode === 'scan') {
          const newList = updateList(scanMaterialsState);
          setScanMaterialsState(newList);
          form.setFieldsValue({ scanMaterials: newList });
        } else {
          const newList = updateList(form.getFieldValue('manualMaterials') || []);
          form.setFieldsValue({ manualMaterials: newList });
        }
      } else {
        message.error(response.message || '撤销失败');
      }
    } catch (error) {
      console.error('撤销操作失败:', error);
      message.error('撤销失败，请重试');
    } finally {
      setUndoLoading(false);
    }
  };
  
  // 获取出库类型文本
  const getOutTypeText = (outType) => {
    switch (outType) {
      case 'consumption': return '消耗出库';
      case 'quality': return '质控出库';
      case 'review': return '复查出库';
      case 'loss': return '损耗出库';
      default: return '未知类型';
    }
  };

  return (
    <div style={{ padding: '0 16px' }}>
      <h1 style={{ marginBottom: 24 }}>消耗出库</h1>
      
      <Card>
        <Form 
          form={form} 
          layout="vertical"
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

          {/* 出库类型（两种模式都显示） */}
          <Form.Item
            name="outType"
            label="出库类型"
            rules={[{ required: true, message: '请选择出库类型' }]}
            style={{ marginBottom: 24 }}
          >
            <Select placeholder="请选择出库类型" style={{ width: '300px' }}>
              <Select.Option value="consumption">消耗出库</Select.Option>
              <Select.Option value="quality">质控出库</Select.Option>
              <Select.Option value="review">复查出库</Select.Option>
              <Select.Option value="loss">损耗出库</Select.Option>
            </Select>
          </Form.Item>

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

          {/* 添加物资按钮 - 只在手动出库模式下显示 */}
          {mode === 'manual' && (
            <Form.Item style={{ marginBottom: 16 }}>
              <Button type="dashed" block icon={<PlusOutlined />} onClick={handleOpenMaterialSelect}>
                添加物资
              </Button>
            </Form.Item>
          )}

          {/* 物资明细表单 */}
          <Card>
            <div className="ant-table-content" style={{ overflow: 'auto hidden', position: 'relative', minHeight: '200px' }}>
              <table style={{ width: '1600px', minWidth: '100%', tableLayout: 'auto' }}>
                <colgroup>
                  <col style={{ width: '60px' }} />
                  <col style={{ width: '120px' }} />
                  <col style={{ width: '150px' }} />
                  <col style={{ width: '100px' }} />
                  <col style={{ width: '120px' }} />
                  <col style={{ width: '100px' }} />
                  <col style={{ width: '120px' }} />
                  <col style={{ width: '120px' }} />
                  <col style={{ width: '120px' }} />
                  <col style={{ width: '80px' }} />
                  <col style={{ width: '100px' }} />
                  <col style={{ width: '150px' }} />
                  <col style={{ width: '150px' }} />
                  <col style={{ width: '100px' }} />
                  <col style={{ width: '120px' }} />
                  <col style={{ width: '120px' }} />
                  <col style={{ width: '80px' }} />
                  <col style={{ width: '80px' }} />
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
                    <th className="ant-table-cell" scope="col">物资编码</th>
                    <th className="ant-table-cell" scope="col">物资名称</th>
                    <th className="ant-table-cell" scope="col">物资类型</th>
                    <th className="ant-table-cell" scope="col">规格</th>
                    <th className="ant-table-cell" scope="col">型号</th>
                    <th className="ant-table-cell" scope="col">批号</th>
                    <th className="ant-table-cell" scope="col">生效日期</th>
                    <th className="ant-table-cell" scope="col">失效日期</th>
                    <th className="ant-table-cell" scope="col">单位</th>
                    <th className="ant-table-cell" scope="col">出库数量</th>
                    <th className="ant-table-cell" scope="col">供应商</th>
                    <th className="ant-table-cell" scope="col">生产厂家</th>
                    <th className="ant-table-cell" scope="col">操作人</th>
                    <th className="ant-table-cell" scope="col">出库原因</th>
                    <th className="ant-table-cell" scope="col">出库日期</th>
                    <th className="ant-table-cell" scope="col">状态</th>
                    <th className="ant-table-cell" scope="col">操作</th>
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
                        <td className="ant-table-cell" style={{ padding: '12px 8px', textAlign: 'center' }}>{item.materialCode || '-'}</td>
                        <td className="ant-table-cell" style={{ padding: '12px 8px', textAlign: 'center' }}>{item.materialName || '-'}</td>
                        <td className="ant-table-cell" style={{ padding: '12px 8px', textAlign: 'center' }}>{item.materialType || '-'}</td>
                        <td className="ant-table-cell" style={{ padding: '12px 8px', textAlign: 'center' }}>{item.specification || '-'}</td>
                        <td className="ant-table-cell" style={{ padding: '12px 8px', textAlign: 'center' }}>{item.model || '-'}</td>
                        <td className="ant-table-cell" style={{ padding: '12px 8px', textAlign: 'center' }}>{item.batchNumber || '-'}</td>
                        <td className="ant-table-cell" style={{ padding: '12px 8px', textAlign: 'center' }}>{item.productionDate || '-'}</td>
                        <td className="ant-table-cell" style={{ padding: '12px 8px', textAlign: 'center' }}>{item.expiryDate || '-'}</td>
                        <td className="ant-table-cell" style={{ padding: '12px 8px', textAlign: 'center' }}>{item.unit || item.orderUnit || '-'}</td>
                        <td className="ant-table-cell" style={{ padding: '12px 8px', textAlign: 'center' }}>{item.orderQuantity || 1}</td>
                        <td className="ant-table-cell" style={{ padding: '12px 8px', textAlign: 'center' }}>{item.supplier || '-'}</td>
                        <td className="ant-table-cell" style={{ padding: '12px 8px', textAlign: 'center' }}>{item.manufacturer || '-'}</td>
                        <td className="ant-table-cell" style={{ padding: '12px 8px', textAlign: 'center' }}>{item.operatorName || '管理员'}</td>
                        <td className="ant-table-cell" style={{ padding: '12px 8px', textAlign: 'center' }}>{item.reason || '扫码出库'}</td>
                        <td className="ant-table-cell" style={{ padding: '12px 8px', textAlign: 'center' }}>{item.outboundDate || item.createTime || dayjs().format('YYYY-MM-DD')}</td>
                        <td className="ant-table-cell" style={{ padding: '12px 8px', textAlign: 'center' }}>
                          <Tag color={item.status === '已撤销' ? 'gray' : 'blue'}>{item.status || '待撤销'}</Tag>
                        </td>
                        <td className="ant-table-cell" style={{ padding: '12px 8px', textAlign: 'center' }}>
                          <Button 
                            type="primary" 
                            size="small" 
                            disabled={item.status === '已撤销'}
                            loading={loading}
                            onClick={() => handleUndoStockOut(item)}
                          >
                            撤销出库
                          </Button>
                        </td>
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

          {/* 备注栏 - 只在手动出库模式下显示 */}
          {mode === 'manual' && (
            <Form.Item label="备注" style={{ marginBottom: 16 }}>
              <TextArea rows={4} placeholder="请输入备注信息" />
            </Form.Item>
          )}

          <Form.Item>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              {mode === 'manual' && (
                <>
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
                    form.setFieldsValue({ manualMaterials: [] });
                  }}>重置</Button>
                  <Button 
                    type="primary" 
                    onClick={() => {
                      setCurrentOutType(form.getFieldValue('outType'));
                      setStockOutConfirmVisible(true);
                    }}
                  >
                    确认出库
                  </Button>
                </>
              )}
              {mode === 'scan' && (
                <Button 
                  type="primary" 
                  onClick={() => {
                    setCurrentOutType(form.getFieldValue('outType'));
                    setStockOutConfirmVisible(true);
                  }}
                  disabled={scanMaterialsState.length === 0}
                >
                  确认出库
                </Button>
              )}
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

      {/* 出库确认弹窗 */}
      <Modal
        title="确认出库"
        open={stockOutConfirmVisible}
        onCancel={() => setStockOutConfirmVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setStockOutConfirmVisible(false)} style={{ borderRadius: '6px', height: '36px', minWidth: '80px' }}>
            取消
          </Button>,
          <Button 
            key="confirm" 
            type="primary" 
            loading={stockOutLoading}
            onClick={handleConfirmStockOut}
            style={{ borderRadius: '6px', height: '36px', minWidth: '80px', backgroundColor: '#5c7cfa', borderColor: '#5c7cfa' }}
          >
            确认
          </Button>
        ]}
        centered
        width={450}
      >
        <div style={{ padding: '16px 0' }}>
          <p style={{ fontSize: '16px', color: '#333', marginBottom: '20px' }}>是否确认执行出库操作?</p>
          <p style={{ color: '#1890ff', fontSize: '14px', marginTop: '12px' }}>
            {mode === 'scan' ? '扫码出库' : '手动出库'}操作将提交并不可撤销。
          </p>
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
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            padding: '16px'
          }}
        >
          <Form 
            form={searchForm} 
            layout="vertical" 
            onFinish={handleSearchMaterials}
          >
            <div style={{ marginBottom: '16px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '8px', fontWeight: '500', minWidth: '80px' }}>物资编码：</span>
                <Form.Item name="materialCode" style={{ marginBottom: 0 }}>
                  <Input 
                    placeholder="请输入物资编码" 
                    allowClear
                    style={{ width: '180px' }}
                  />
                </Form.Item>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '8px', fontWeight: '500', minWidth: '80px' }}>物资名称：</span>
                <Form.Item name="materialName" style={{ marginBottom: 0 }}>
                  <Input 
                    placeholder="请输入物资名称" 
                    allowClear
                    style={{ width: '180px' }}
                  />
                </Form.Item>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '8px', fontWeight: '500', minWidth: '80px' }}>供应商：</span>
                <Form.Item name="supplier" style={{ marginBottom: 0 }}>
                  <Input 
                    placeholder="请输入供应商" 
                    allowClear
                    style={{ width: '180px' }}
                  />
                </Form.Item>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '8px', fontWeight: '500', minWidth: '80px' }}>生产厂家：</span>
                <Form.Item name="manufacturer" style={{ marginBottom: 0 }}>
                  <Input 
                    placeholder="请输入生产厂家" 
                    allowClear
                    style={{ width: '180px' }}
                  />
                </Form.Item>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                查询
              </Button>
              <Button icon={<ExportOutlined />}>
                导出库存报表
              </Button>
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
                <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '120px' }}>批号</th>
                <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '120px' }}>生效日期</th>
                <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '120px' }}>失效日期</th>
                <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '100px' }}>最小包装</th>
                <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '80px' }}>单位</th>
                <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '80px' }}>采购价格</th>
                <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '80px' }}>库存数量</th>
                <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '100px' }}>出库数量</th>
                <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '150px' }}>注册证号</th>
                <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '150px' }}>供应商</th>
                <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '150px' }}>生产厂家</th>
              </tr>
            </thead>
            <tbody>
              {materialCatalog.map(item => {
                const isSelected = item.selected;
                
                return (
                  <tr key={item.key} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>
                      <Checkbox 
                        checked={selectedCatalogRows.some(row => row.key === item.key)}
                        onChange={(e) => handleMaterialSelect(item, e.target.checked)}
                      />
                    </td>
                    <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>{item.materialCode}</td>
                    <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>{item.materialName}</td>
                    <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>{item.materialType}</td>
                    <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>{item.specification}</td>
                    <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>{item.model}</td>
                    <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>{item.batchNumber || '-'}</td>
                    <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>{item.productionDate || '-'}</td>
                    <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>{item.expiryDate || '-'}</td>
                    <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>{item.minPackage}</td>
                    <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>{item.unit}</td>
                    <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>¥{item.unitPrice.toFixed(2)}</td>
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
                    <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>{item.registrationNumber || '-'}</td>
                    <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>{item.supplier}</td>
                    <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>{item.manufacturer}</td>
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
              共 <strong>{catalogTotal}</strong> 条记录，当前选中 <strong style={{ color: '#1890ff' }}>{selectedCatalogRows.length}</strong> 项
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Pagination
              size="small"
              current={catalogCurrentPage}
              pageSize={catalogPageSize}
              total={catalogTotal}
              onChange={handleCatalogPageChange}
              showSizeChanger
              showQuickJumper
              pageSizeOptions={['5', '10', '20']}
            />
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
    </div>
  );
};

export default StockOutConsumption;
