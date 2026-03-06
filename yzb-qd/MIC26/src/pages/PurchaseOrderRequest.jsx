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

const PurchaseOrderRequest = () => {
  // 配置dayjs使用中文
  dayjs.locale('zh-cn');
  
  const [form] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [materialSelectModalVisible, setMaterialSelectModalVisible] = useState(false);
  const [materials, setMaterials] = useState([]);
  const [viewMode, setViewMode] = useState('summary'); // 'detail' 或 'summary'
  const [hasSelectedView, setHasSelectedView] = useState(false); // 是否已选择视图
  const [selectedDetailKeys, setSelectedDetailKeys] = useState([]); // 采购明细弹窗中选中的商品明细行
  
  // 物资目录数据（用于选择弹窗）
  const [materialCatalog, setMaterialCatalog] = useState([
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
    },
    {
      key: '6',
      materialCode: 'MAT006',
      materialName: '注射器',
      specification: '5ml',
      model: 'SY-605',
      manufacturer: '注射器制造厂',
      supplier: '医疗耗材供应商',
      materialType: '低值耗材',
      minPackage: '100支/箱',
      minOrderQuantity: 1,
      quantity: 50,
      selected: false,
      unit: '支',
      unitPrice: 1.20,
      stock: 300
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
      quantity: 20,
      selected: false,
      unit: '套',
      unitPrice: 4.80,
      stock: 150
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
      quantity: 10,
      selected: false,
      unit: '包',
      unitPrice: 8.50,
      stock: 120
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
      quantity: 20,
      selected: false,
      unit: '包',
      unitPrice: 2.50,
      stock: 180
    },
    {
      key: '10',
      materialCode: 'MAT010',
      materialName: '创可贴',
      specification: '防水',
      model: 'BP-103',
      manufacturer: '创可贴制造厂',
      supplier: '医疗耗材供应商',
      materialType: '低值耗材',
      minPackage: '100片/盒',
      minOrderQuantity: 1,
      quantity: 100,
      selected: false,
      unit: '片',
      unitPrice: 0.80,
      stock: 500
    }
  ]);
  
  // 搜索表单状态
  const [searchForm] = Form.useForm();
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [catalogSelectAll, setCatalogSelectAll] = useState(false);
  const [catalogCurrentPage, setCatalogCurrentPage] = useState(1);
  const [catalogPageSize, setCatalogPageSize] = useState(5);

  // 初始化过滤数据
  useEffect(() => {
    setFilteredMaterials([...materialCatalog]);
  }, []);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [selectAll, setSelectAll] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [currentOrderDetails, setCurrentOrderDetails] = useState(null);
  const [editingDetails, setEditingDetails] = useState([]); // 编辑中的商品明细数据

  const [remark, setRemark] = useState('');
  // 科室列表
  const departments = ['内科', '外科', '儿科', '妇产科', '急诊科'];

  // 随机获取科室
  const getRandomDepartment = () => {
    return departments[Math.floor(Math.random() * departments.length)];
  };

  const [purchaseOrders, setPurchaseOrders] = useState([
    {
      key: '1',
      orderNumber: 'PO250001202601',
      createTime: '2026-01-25 10:00:00',
      status: 'pending',
      supplier: '医疗用品有限公司',
      department: '内科',
      totalAmount: 1250.00,
      itemCount: 5,
      operator: '张三',
      planType: 'weekly',
      details: [
        { key: '1-1', materialCode: 'MAT001', materialName: '医用口罩', specification: 'N95', unit: '盒', unitPrice: 25.00, quantity: 10, amount: 250.00 },
        { key: '1-2', materialCode: 'MAT002', materialName: '医用防护服', specification: 'L号', unit: '件', unitPrice: 85.00, quantity: 5, amount: 425.00 },
        { key: '1-3', materialCode: 'MAT003', materialName: '医用手套', specification: '乳胶', unit: '双', unitPrice: 3.50, quantity: 100, amount: 350.00 },
        { key: '1-4', materialCode: 'MAT004', materialName: '消毒液', specification: '500ml', unit: '瓶', unitPrice: 18.00, quantity: 10, amount: 180.00 },
        { key: '1-5', materialCode: 'MAT005', materialName: '体温计', specification: '电子', unit: '支', unitPrice: 32.00, quantity: 5, amount: 160.00 }
      ]
    },
    {
      key: '2',
      orderNumber: 'PO250002202601',
      createTime: '2026-01-24 14:30:00',
      status: 'approved',
      supplier: '医疗器械有限公司',
      department: '外科',
      totalAmount: 850.50,
      itemCount: 3,
      operator: '李四',
      planType: 'monthly',
      details: [
        { key: '2-1', materialCode: 'MAT006', materialName: '注射器', specification: '5ml', unit: '支', unitPrice: 1.20, quantity: 200, amount: 240.00 },
        { key: '2-2', materialCode: 'MAT007', materialName: '输液器', specification: '一次性', unit: '套', unitPrice: 4.80, quantity: 100, amount: 480.00 },
        { key: '2-3', materialCode: 'MAT008', materialName: '纱布', specification: '10cm×10cm', unit: '包', unitPrice: 8.50, quantity: 15, amount: 127.50 }
      ]
    },
    {
      key: '3',
      orderNumber: 'PO250003202601',
      createTime: '2026-01-23 09:15:00',
      status: 'completed',
      supplier: '消毒用品有限公司',
      department: '儿科',
      totalAmount: 320.00,
      itemCount: 2,
      operator: '王五',
      planType: 'weekly',
      details: [
        { key: '3-1', materialCode: 'MAT009', materialName: '棉签', specification: '医用', unit: '包', unitPrice: 2.50, quantity: 80, amount: 200.00 },
        { key: '3-2', materialCode: 'MAT010', materialName: '创可贴', specification: '防水', unit: '片', unitPrice: 0.80, quantity: 150, amount: 120.00 }
      ]
    },
    {
      key: '4',
      orderNumber: 'PO20241226-004',
      createTime: '2024-12-26 16:30:00',
      status: 'rejected',
      supplier: '医疗用品有限公司',
      department: '妇产科',
      totalAmount: 2500.00,
      itemCount: 1,
      rejectReason: '库存充足，请降低采购数量',
      operator: '赵六',
      planType: 'monthly',
      details: [
        { key: '4-1', materialCode: 'MAT001', materialName: '医用口罩', specification: 'N95', unit: '盒', unitPrice: 25.00, quantity: 100, amount: 2500.00 }
      ]
    },
    {
      key: '5',
      orderNumber: 'PO250004202601',
      createTime: '2026-01-22 11:20:00',
      status: 'shipping',
      supplier: '实验室设备有限公司',
      department: '急诊科',
      totalAmount: 4500.00,
      itemCount: 8,
      operator: '钱七',
      planType: 'weekly',
      details: [
        { key: '5-1', materialCode: 'MAT011', materialName: '显微镜', specification: '1000倍', unit: '台', unitPrice: 1200.00, quantity: 2, amount: 2400.00 },
        { key: '5-2', materialCode: 'MAT012', materialName: '离心机', specification: '5000rpm', unit: '台', unitPrice: 800.00, quantity: 1, amount: 800.00 },
        { key: '5-3', materialCode: 'MAT013', materialName: '培养皿', specification: '90mm', unit: '个', unitPrice: 5.00, quantity: 200, amount: 1000.00 },
        { key: '5-4', materialCode: 'MAT014', materialName: '试管', specification: '15ml', unit: '支', unitPrice: 2.00, quantity: 150, amount: 300.00 }
      ]
    },
    {
      key: '5-1',
      orderNumber: 'PO250005202601',
      createTime: '2026-01-21 15:45:00',
      status: 'receiving',
      supplier: '办公用品有限公司',
      department: '内科',
      totalAmount: 1200.00,
      itemCount: 4,
      operator: '孙八',
      planType: 'monthly',
      details: [
        { key: '5-1-1', materialCode: 'MAT015', materialName: 'A4纸', specification: '80g', unit: '包', unitPrice: 25.00, quantity: 20, amount: 500.00 },
        { key: '5-1-2', materialCode: 'MAT016', materialName: '签字笔', specification: '黑色', unit: '支', unitPrice: 3.00, quantity: 100, amount: 300.00 },
        { key: '5-1-3', materialCode: 'MAT017', materialName: '文件夹', specification: 'A4', unit: '个', unitPrice: 8.00, quantity: 30, amount: 240.00 },
        { key: '5-1-4', materialCode: 'MAT018', materialName: '订书机', specification: '标准', unit: '个', unitPrice: 16.00, quantity: 10, amount: 160.00 }
      ]
    },
    {
      key: '6',
      orderNumber: 'PO250006202601',
      createTime: '2026-01-20 09:30:00',
      status: 'terminated',
      supplier: '测试设备有限公司',
      department: '外科',
      totalAmount: 780.00,
      itemCount: 3,
      operator: '周九',
      planType: 'weekly',
      details: [
        { key: '6-1', materialCode: 'MAT019', materialName: '测试仪', specification: '数字', unit: '台', unitPrice: 300.00, quantity: 2, amount: 600.00 },
        { key: '6-2', materialCode: 'MAT020', materialName: '探头', specification: '温度', unit: '个', unitPrice: 60.00, quantity: 3, amount: 180.00 }
      ]
    },
    {
      key: '7',
      orderNumber: 'PO250007202601',
      createTime: '2026-01-19 14:15:00',
      status: 'pending',
      supplier: '电子设备有限公司',
      department: '儿科',
      totalAmount: 2300.00,
      itemCount: 6,
      operator: '吴十',
      planType: 'monthly',
      details: [
        { key: '7-1', materialCode: 'MAT021', materialName: '笔记本电脑', specification: 'i7/16G', unit: '台', unitPrice: 800.00, quantity: 2, amount: 1600.00 },
        { key: '7-2', materialCode: 'MAT022', materialName: '显示器', specification: '24寸', unit: '台', unitPrice: 120.00, quantity: 3, amount: 360.00 },
        { key: '7-3', materialCode: 'MAT023', materialName: '键盘', specification: '机械', unit: '个', unitPrice: 80.00, quantity: 2, amount: 160.00 },
        { key: '7-4', materialCode: 'MAT024', materialName: '鼠标', specification: '无线', unit: '个', unitPrice: 60.00, quantity: 3, amount: 180.00 }
      ]
    },
    {
      key: '8',
      orderNumber: 'PO250008202601',
      createTime: '2026-01-18 16:50:00',
      status: 'approved',
      supplier: '家具设备有限公司',
      department: '妇产科',
      totalAmount: 5600.00,
      itemCount: 10,
      operator: '郑一',
      planType: 'weekly',
      details: [
        { key: '8-1', materialCode: 'MAT025', materialName: '办公桌', specification: '1.6m', unit: '张', unitPrice: 800.00, quantity: 4, amount: 3200.00 },
        { key: '8-2', materialCode: 'MAT026', materialName: '办公椅', specification: '人体工学', unit: '把', unitPrice: 400.00, quantity: 6, amount: 2400.00 }
      ]
    },
    {
      key: '9',
      orderNumber: 'PO250009202601',
      createTime: '2026-01-17 13:25:00',
      status: 'completed',
      supplier: '清洁用品有限公司',
      department: '急诊科',
      totalAmount: 890.00,
      itemCount: 7,
      operator: '王二',
      planType: 'monthly',
      details: [
        { key: '9-1', materialCode: 'MAT027', materialName: '拖把', specification: '旋转', unit: '把', unitPrice: 45.00, quantity: 10, amount: 450.00 },
        { key: '9-2', materialCode: 'MAT028', materialName: '水桶', specification: '20L', unit: '个', unitPrice: 25.00, quantity: 8, amount: 200.00 },
        { key: '9-3', materialCode: 'MAT029', materialName: '抹布', specification: '超细纤维', unit: '条', unitPrice: 8.00, quantity: 30, amount: 240.00 }
      ]
    },
    {
      key: '10',
      orderNumber: 'PO250010202601',
      createTime: '2026-01-16 10:40:00',
      status: 'shipping',
      supplier: '包装材料有限公司',
      department: '内科',
      totalAmount: 3400.00,
      itemCount: 12,
      operator: '张三',
      planType: 'weekly',
      details: [
        { key: '10-1', materialCode: 'MAT030', materialName: '纸箱', specification: '50×40×30', unit: '个', unitPrice: 8.00, quantity: 200, amount: 1600.00 },
        { key: '10-2', materialCode: 'MAT031', materialName: '气泡膜', specification: '宽60cm', unit: '卷', unitPrice: 60.00, quantity: 20, amount: 1200.00 },
        { key: '10-3', materialCode: 'MAT032', materialName: '胶带', specification: '宽5cm', unit: '卷', unitPrice: 12.00, quantity: 50, amount: 600.00 }
      ]
    },
    {
      key: '11',
      orderNumber: 'PO250011202601',
      createTime: '2026-01-15 08:55:00',
      status: 'receiving',
      supplier: '安全设备有限公司',
      department: '外科',
      totalAmount: 2100.00,
      itemCount: 5,
      operator: '李四',
      planType: 'monthly',
      details: [
        { key: '11-1', materialCode: 'MAT033', materialName: '安全帽', specification: 'ABS', unit: '顶', unitPrice: 35.00, quantity: 40, amount: 1400.00 },
        { key: '11-2', materialCode: 'MAT034', materialName: '防护眼镜', specification: '防冲击', unit: '副', unitPrice: 25.00, quantity: 20, amount: 500.00 },
        { key: '11-3', materialCode: 'MAT035', materialName: '手套', specification: '防割', unit: '双', unitPrice: 20.00, quantity: 10, amount: 200.00 }
      ]
    },
    {
      key: '12',
      orderNumber: 'PO250012202601',
      createTime: '2026-01-14 17:30:00',
      status: 'terminated',
      supplier: '测试仪器有限公司',
      department: '儿科',
      totalAmount: 4300.00,
      itemCount: 9,
      operator: '王五',
      planType: 'weekly',
      details: [
        { key: '12-1', materialCode: 'MAT036', materialName: '光谱仪', specification: '便携式', unit: '台', unitPrice: 2500.00, quantity: 1, amount: 2500.00 },
        { key: '12-2', materialCode: 'MAT037', materialName: 'PH计', specification: '数字', unit: '台', unitPrice: 600.00, quantity: 3, amount: 1800.00 }
      ]
    }
  ]);
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
    message.info('搜索功能已触发');
    console.log('搜索条件:', values);
  };

  const handleReset = () => {
    form.resetFields();
    message.info('搜索条件已重置');
  };

  const handleNewRequest = () => {
    setModalVisible(true);
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    setMaterials(materials.map(item => ({ ...item, selected: false, quantity: 1 })));
    setSelectAll(false);
    setCurrentPage(1);
    setRemark('');
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

  const handleSave = () => {
    const selectedMaterials = materials.filter(item => item.selected);
    console.log('保存的物资:', selectedMaterials);
    console.log('备注信息:', remark);
    message.success(`已保存 ${selectedMaterials.length} 项物资`);
    handleModalCancel();
  };

  const handleSubmit = () => {
    const selectedMaterials = materials.filter(item => item.selected);
    console.log('提交的物资:', selectedMaterials);
    console.log('备注信息:', remark);
    message.success(`已提交 ${selectedMaterials.length} 项物资`);
    handleModalCancel();
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
    message.info(`找到 ${filtered.length} 条记录`);
  };

  const handleResetSearch = () => {
    searchForm.resetFields();
    setFilteredMaterials([...materialCatalog]);
    setCatalogCurrentPage(1);
    setCatalogSelectAll(false);
    message.info('搜索条件已重置');
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
        // 添加新物资
        newMaterials.push({
          key: selectedItem.key,
          materialCode: selectedItem.materialCode,
          materialName: selectedItem.materialName,
          specification: selectedItem.specification,
          unit: selectedItem.unit,
          unitPrice: selectedItem.unitPrice,
          stock: selectedItem.stock,
          selected: true,
          quantity: selectedItem.quantity,
          packageUnit: selectedItem.unit
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
    message.success(`已添加 ${selectedMaterials.length} 项物资到采购明细`);
    handleCloseMaterialSelect();
  };

  const handleCatalogPageChange = (page, size) => {
    setCatalogCurrentPage(page);
    setCatalogPageSize(size);
    setCatalogSelectAll(false);
  };

  const handleSelectChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys);
    message.info(`已选择 ${selectedRowKeys.length} 条记录`);
  };

  const handleTableChange = (newPagination) => {
    setPagination({
      ...pagination,
      current: newPagination.current,
      pageSize: newPagination.pageSize
    });
  };

  const getStatusTag = (status) => {
    const statusMap = {
      terminated: { color: 'error', text: '已终止' },
      pending: { color: 'warning', text: '待提交' },
      approved: { color: 'blue', text: '待审核' },
      shipping: { color: 'purple', text: '待发货' },
      receiving: { color: 'orange', text: '待收货' },
      completed: { color: 'success', text: '已完成' },
      rejected: { color: 'warning', text: '待提交' }
    };
    
    const statusInfo = statusMap[status] || { color: 'default', text: '未知' };
    return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
  };

  const getFilteredPurchaseOrders = () => {
    return purchaseOrders.filter(order => 
      order.status === 'pending' || order.status === 'rejected'
    );
  };

  const filteredPurchaseOrders = getFilteredPurchaseOrders();

  // 采购单汇总视图列配置
  const summaryColumns = [
    {
      title: () => (
        <Checkbox 
          indeterminate={selectedRowKeys.length > 0 && selectedRowKeys.length < filteredPurchaseOrders.length}
          checked={filteredPurchaseOrders.length > 0 && selectedRowKeys.length === filteredPurchaseOrders.length}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedRowKeys(filteredPurchaseOrders.map(item => item.key));
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
      title: '申领科室',
      dataIndex: 'department',
      key: 'department',
      width: 120
    },
    {
      title: '商品数量',
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
      title: '操作人',
      dataIndex: 'operator',
      key: 'operator',
      width: 100
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
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="link" 
            size="small"
            onClick={() => {
              setCurrentOrderDetails(record);
              setSelectedDetailKeys([]); // 重置选中的商品明细行
              // 初始化编辑数据
              setEditingDetails(record.details.map(item => ({
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
      message.warning('请先选择要删除的商品明细');
      return;
    }

    // 过滤掉选中的记录
    const newEditingDetails = editingDetails.filter(item => !selectedDetailKeys.includes(item.key));
    
    // 更新编辑数据
    setEditingDetails(newEditingDetails);
    
    // 清空选中状态
    setSelectedDetailKeys([]);
    
    // 显示删除成功消息
    message.success(`成功删除 ${selectedDetailKeys.length} 条商品明细记录`);
    
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
        <Form form={form} layout="inline" onFinish={handleSearch}>
          <Row gutter={[12, 12]} style={{ width: '100%' }}>
            <Col xs={24} sm={12} md={8} lg={6} xl={4}>
              <Form.Item name="orderNumber" style={{ width: '100%', marginBottom: 0 }}>
                <Input 
                  placeholder="单号" 
                  allowClear
                  style={{ width: '100%' }}
                  size="middle"
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={8} lg={6} xl={4}>
              <Form.Item name="createTime" style={{ width: '100%', marginBottom: 0 }}>
                <DatePicker 
                  placeholder="创建时间" 
                  allowClear
                  style={{ width: '100%' }}
                  size="middle"
                  format="YYYY年MM月DD日"
                  locale={zhCN}
                  popupClassName="chinese-datepicker"
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={8} lg={6} xl={4}>
              <Form.Item name="endTime" style={{ width: '100%', marginBottom: 0 }}>
                <DatePicker 
                  placeholder="结束时间" 
                  allowClear
                  style={{ width: '100%' }}
                  size="middle"
                  format="YYYY年MM月DD日"
                  locale={zhCN}
                  popupClassName="chinese-datepicker"
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={8} lg={6} xl={4}>
              <Form.Item name="status" style={{ width: '100%', marginBottom: 0 }}>
                <Select 
                  placeholder="状态" 
                  allowClear
                  style={{ width: '100%' }}
                  size="middle"
                  options={statusOptions}
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
              <Form.Item name="department" style={{ width: '100%', marginBottom: 0 }}>
                <Select 
                  placeholder="申领科室" 
                  allowClear
                  style={{ width: '100%' }}
                  size="middle"
                  options={departmentOptions}
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={8} lg={6} xl={4}>
              <Form.Item style={{ width: '100%', marginBottom: 0 }}>
                <Select
                  placeholder="单据筛选"
                  style={{ width: '100%' }}
                  value={hasSelectedView ? (viewMode === 'summary' ? 'summary' : 'detail') : undefined}
                  onChange={(value) => {
                    setViewMode(value);
                    setHasSelectedView(true);
                    message.info(`已切换到${value === 'detail' ? '采购明细' : '采购单'}视图`);
                  }}
                >
                  <Select.Option value="summary">采购单据</Select.Option>
                  <Select.Option value="detail">采购明细</Select.Option>
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={24} xl={24} style={{ textAlign: 'right' }}>
              <Form.Item style={{ marginBottom: 0 }}>
                <Space size="middle">
                  <Button 
                    type="primary" 
                    htmlType="submit"
                    icon={<SearchOutlined />}
                    style={{ minWidth: 90 }}
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
                </Space>
              </Form.Item>
            </Col>
          </Row>
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
        title={`${viewMode === 'detail' ? '采购明细' : '采购单汇总'} (共 ${viewMode === 'detail' ? getDetailData().length : getFilteredPurchaseOrders().length} 条)`}
        style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
      >
        <Table
          columns={viewMode === 'detail' ? detailColumns : summaryColumns}
          dataSource={viewMode === 'detail' ? getDetailData() : getFilteredPurchaseOrders()}
          rowKey="key"
          pagination={{ 
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: viewMode === 'detail' ? getDetailData().length : getFilteredPurchaseOrders().length,
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
                <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '100px' }}>物资编码</th>
                <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '150px' }}>商品名称</th>
                <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '100px' }}>规格</th>
                <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '80px' }}>单位</th>
                <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '100px' }}>单价</th>
                <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '100px' }}>剩余库存</th>
                <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '120px' }}>采购数量</th>
                <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '120px' }}>包装单位</th>
                <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '80px' }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {materials.slice((currentPage - 1) * pageSize, currentPage * pageSize).map(item => (
                <tr key={item.key} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>
                    <Checkbox 
                      checked={item.selected}
                      onChange={() => handleMaterialSelect(item.key)}
                    />
                  </td>
                  <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>{item.materialCode}</td>
                  <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>{item.materialName}</td>
                  <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>{item.specification}</td>
                  <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>{item.unit}</td>
                  <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>¥{item.unitPrice.toFixed(2)}</td>
                  <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>{item.stock}</td>
                  <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>
                    <InputNumber
                      min={1}
                      value={item.quantity}
                      onChange={(value) => handleQuantityChange(item.key, value)}
                      style={{ width: '100%' }}
                    />
                  </td>
                  <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>
                    <Select
                      value={item.packageUnit}
                      onChange={(value) => handlePackageUnitChange(item.key, value)}
                      style={{ width: '100%' }}
                      options={[
                        { value: '盒', label: '盒' },
                        { value: '件', label: '件' },
                        { value: '包', label: '包' },
                        { value: '箱', label: '箱' },
                        { value: '支', label: '支' }
                      ]}
                    />
                  </td>
                  <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>
                  </td>
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
            取消
          </Button>
          <Button 
            type="primary" 
            onClick={handleSave}
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
            style={{ 
              minWidth: '80px',
              height: '36px',
              backgroundColor: '#1890ff',
              borderColor: '#1890ff'
            }}
          >
            提交
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
                      onChange={(value) => handleCatalogQuantityChange(item.key, value)}
                      style={{ width: '100%' }}
                    />
                  </td>
                  <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>{item.unit}</td>
                  <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>¥{item.unitPrice.toFixed(2)}</td>
                  <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>{item.stock}</td>
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
                  <div style={{ color: '#8c8c8c', fontSize: '12px', marginBottom: '4px' }}>订单编号</div>
                  <div style={{ fontWeight: '500' }}>{currentOrderDetails.orderNumber}</div>
                </div>
                <div>
                  <div style={{ color: '#8c8c8c', fontSize: '12px', marginBottom: '4px' }}>供应商</div>
                  <div style={{ fontWeight: '500' }}>{currentOrderDetails.supplier}</div>
                </div>
                <div>
                  <div style={{ color: '#8c8c8c', fontSize: '12px', marginBottom: '4px' }}>申领科室</div>
                  <div style={{ fontWeight: '500' }}>{currentOrderDetails.department}</div>
                </div>
                <div>
                  <div style={{ color: '#8c8c8c', fontSize: '12px', marginBottom: '4px' }}>创建时间</div>
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
                  <div style={{ color: '#8c8c8c', fontSize: '12px', marginBottom: '4px' }}>操作人</div>
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
                    <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '100px' }}>规格</th>
                    <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '80px' }}>单位</th>
                    <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '100px' }}>单价</th>
                    <th style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0', minWidth: '120px' }}>数量</th>
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
                        <td style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #f0f0f0' }}>{item.specification}</td>
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
                onClick={() => {
                  // 保存订单逻辑
                  if (currentOrderDetails) {
                    const updatedOrder = {
                      ...currentOrderDetails,
                      details: editingDetails.map(item => ({
                        key: item.key,
                        materialCode: item.materialCode,
                        materialName: item.materialName,
                        specification: item.specification,
                        unit: item.unit,
                        unitPrice: item.unitPrice,
                        quantity: item.quantity,
                        amount: item.unitPrice * item.quantity
                      })),
                      itemCount: editingDetails.length,
                      totalAmount: editingDetails.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0)
                    };
                    
                    // 更新主数据
                    setPurchaseOrders(prev => 
                      prev.map(order => 
                        order.key === currentOrderDetails.key ? updatedOrder : order
                      )
                    );
                    
                    // 更新当前订单详情
                    setCurrentOrderDetails(updatedOrder);
                    
                    message.success('订单已保存');
                  }
                }}
                style={{ 
                  minWidth: '80px',
                  height: '36px'
                }}
              >
                保存
              </Button>
              <Button 
                type="primary"
                onClick={() => {
                  // 提交订单逻辑
                  message.success('订单已提交');
                }}
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