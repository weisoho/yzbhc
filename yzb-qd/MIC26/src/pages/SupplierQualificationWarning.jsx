import { useState, useEffect } from 'react';
import { Card, Table, Space, Tag, Select, Input, Button, Modal, Checkbox, Divider, Typography } from 'antd';
import { SearchOutlined, WarningOutlined, AlertOutlined, CheckCircleOutlined, EyeOutlined, PlusOutlined, FileOutlined, InboxOutlined, DownloadOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Text } = Typography;

const SupplierQualificationWarning = () => {
  const [warningData, setWarningData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('qualification');
  const [mainTab, setMainTab] = useState('supplier'); // supplier, manufacturer, product
  const [manufacturerData, setManufacturerData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [showSupplyChainModal, setShowSupplyChainModal] = useState(false);
  const [supplyChainData, setSupplyChainData] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState('hefei'); // hefei, asahi
  const [supplyChainTab, setSupplyChainTab] = useState('basic'); // basic, qualification, contract

  // 模拟数据：整合所有供应商的资质信息
  const qualificationData = [
    // 营业执照数据
    {
      key: '1',
      supplierName: '供应商A',
      certificateType: '营业执照',
      certificateNumber: 'BC2024001',
      expiryDate: '2029-12-31',
      status: '有效',
      daysUntilExpiry: 1430,
    },
    {
      key: '2',
      supplierName: '供应商B',
      certificateType: '营业执照',
      certificateNumber: 'BC2024002',
      expiryDate: '2026-11-19',
      status: '即将过期',
      daysUntilExpiry: 300,
    },
    {
      key: '3',
      supplierName: '供应商C',
      certificateType: '营业执照',
      certificateNumber: 'BC2024003',
      expiryDate: '2026-03-15',
      status: '即将过期',
      daysUntilExpiry: 45,
    },
    // 经营许可证数据
    {
      key: '4',
      supplierName: '供应商A',
      certificateType: '经营许可证',
      certificateNumber: 'BL2024001',
      expiryDate: '2028-01-15',
      status: '有效',
      daysUntilExpiry: 730,
    },
    {
      key: '5',
      supplierName: '供应商B',
      certificateType: '经营许可证',
      certificateNumber: 'BL2024002',
      expiryDate: '2026-02-28',
      status: '即将过期',
      daysUntilExpiry: 30,
    },
    {
      key: '6',
      supplierName: '供应商C',
      certificateType: '经营许可证',
      certificateNumber: 'BL2024003',
      expiryDate: '2026-02-15',
      status: '即将过期',
      daysUntilExpiry: 15,
    },
    // 生产许可证数据
    {
      key: '7',
      supplierName: '供应商A',
      certificateType: '生产许可证',
      certificateNumber: 'SC2024001',
      expiryDate: '2027-06-30',
      status: '有效',
      daysUntilExpiry: 1095,
    },
    {
      key: '8',
      supplierName: '供应商B',
      certificateType: '生产许可证',
      certificateNumber: 'SC2024002',
      expiryDate: '2026-02-10',
      status: '即将过期',
      daysUntilExpiry: 10,
    },
    {
      key: '9',
      supplierName: '供应商C',
      certificateType: '生产许可证',
      certificateNumber: 'SC2024003',
      expiryDate: '2026-01-25',
      status: '已过期',
      daysUntilExpiry: -5,
    },
  ];

  // 计算预警状态
  const calculateWarningStatus = (expiryDate) => {
    try {
      const today = moment();
      let expiry;
      
      // 检查 expiryDate 是否为 null 或 undefined
      if (expiryDate == null) {
        return { status: '无效日期', daysUntilExpiry: 0 };
      }
      
      // 检查是否已经是 moment 对象
      if (typeof expiryDate.isValid === 'function') {
        expiry = expiryDate;
      } else {
        // 尝试转换为 moment 对象
        expiry = moment(expiryDate);
      }
      
      // 检查日期是否有效
      if (!expiry.isValid()) {
        return { status: '无效日期', daysUntilExpiry: 0 };
      }
      
      const diffDays = expiry.diff(today, 'days');

      if (diffDays < 0) {
        return { status: '已过期', daysUntilExpiry: diffDays };
      } else if (diffDays <= 90) {
        return { status: '即将过期', daysUntilExpiry: diffDays };
      } else {
        return { status: '有效', daysUntilExpiry: diffDays };
      }
    } catch (error) {
      console.error('日期计算错误:', error);
      return { status: '计算错误', daysUntilExpiry: 0 };
    }
  };

  // 模拟厂商数据
  const mockManufacturerData = [
    { key: '1', manufacturer: '莲花医疗用品有限公司', pinyin: 'LHLYPYXGS', supplier: '安徽精诚医疗器械贸易有限公司', companyType: '生产企业', expiredCount: 0 },
    { key: '2', manufacturer: '波科国际医疗贸易（上海）有限公司', pinyin: 'BKGJLYMY (SH) YXGS', supplier: '安徽精诚医疗器械贸易有限公司', companyType: '生产企业', expiredCount: 0 },
    { key: '3', manufacturer: '爱瑞通医疗器械（北京）有限公司', pinyin: 'ARTYLQJX (BJ) YXGS', supplier: '安徽精诚医疗器械贸易有限公司', companyType: '生产企业', expiredCount: 0 },
    { key: '4', manufacturer: '朝日英达科（北京）有限公司', pinyin: 'CRYDKS (BJ) YXGS', supplier: '安徽精诚医疗器械贸易有限公司', companyType: '生产企业', expiredCount: 0 },
    { key: '5', manufacturer: '美敦力（上海）管理有限公司', pinyin: 'MDL (SH) GLYXGS', supplier: '安徽精诚医疗器械贸易有限公司', companyType: '生产企业', expiredCount: 0 },
    { key: '6', manufacturer: '尼普诺医疗器械贸易（上海）有限公司', pinyin: 'NPNYLQXMY (SH) YXGS', supplier: '安徽精诚医疗器械贸易有限公司', companyType: '生产企业', expiredCount: 0 },
    { key: '7', manufacturer: '北京仙桥医疗科技有限公司', pinyin: 'BJXQLYJS (BJ) YXGS', supplier: '安徽精诚医疗器械贸易有限公司', companyType: '生产企业', expiredCount: 0 },
    { key: '8', manufacturer: '杭州山友医疗器械有限公司', pinyin: 'HSYLYQX (HZ) YXGS', supplier: '安徽精诚医疗器械贸易有限公司', companyType: '生产企业', expiredCount: 0 },
    { key: '9', manufacturer: '扬州晨阳医疗器械有限公司', pinyin: 'YZCYLYQX (YZ) YXGS', supplier: '安徽精诚医疗器械贸易有限公司', companyType: '经营企业', expiredCount: 0 },
  ];

  // 模拟产品数据
  const mockProductData = [
    { key: '1', productName: 'PTCA导丝', productType: '高值耗材', qualificationNumber: '国械注进20183301817', supplier: '合肥博雅医疗科技有限公司', expiryDate: '2028-03-14' },
    { key: '2', productName: 'PTCA导丝', productType: '高值耗材', qualificationNumber: '国械注进20183301817', supplier: '合肥博雅医疗科技有限公司', expiryDate: '2028-03-14' },
    { key: '3', productName: 'PTCA导丝', productType: '高值耗材', qualificationNumber: '国械注进20183301817', supplier: '合肥博雅医疗科技有限公司', expiryDate: '2028-03-14' },
    { key: '4', productName: 'PTCA导丝', productType: '高值耗材', qualificationNumber: '国械注进20183301817', supplier: '合肥博雅医疗科技有限公司', expiryDate: '2028-03-14' },
    { key: '5', productName: 'PTCA导丝', productType: '高值耗材', qualificationNumber: '国械注进20183301817', supplier: '合肥博雅医疗科技有限公司', expiryDate: '2028-03-14' },
    { key: '6', productName: 'PTCA导丝', productType: '高值耗材', qualificationNumber: '国械注进20183301817', supplier: '合肥博雅医疗科技有限公司', expiryDate: '2028-03-14' },
    { key: '7', productName: 'Y形连接器', productType: '低值耗材', qualificationNumber: '注册证许可2025472', supplier: '演示供应商', expiryDate: '2027-12-31' },
    { key: '8', productName: '充盈压力泵系统', productType: '低值耗材', qualificationNumber: '国械注进20183302060', supplier: '演示供应商', expiryDate: '2027-03-29' },
    { key: '9', productName: '穿刺针', productType: '低值耗材', qualificationNumber: '45542446153055', supplier: '测试供应商-kkk', expiryDate: '2099-12-31' },
  ];

  // 加载预警数据
  useEffect(() => {
    setLoading(true);
    
    // 模拟API请求延迟
    setTimeout(() => {
      const processedData = qualificationData.map(item => {
        const { status, daysUntilExpiry } = calculateWarningStatus(item.expiryDate);
        return {
          ...item,
          status,
          daysUntilExpiry,
        };
      });
      
      // 按预警级别排序：已过期 > 即将过期 > 有效
      const sortedData = processedData.sort((a, b) => {
        const statusOrder = { '已过期': 0, '即将过期': 1, '有效': 2 };
        return statusOrder[a.status] - statusOrder[b.status];
      });
      
      setWarningData(sortedData);
      setManufacturerData(mockManufacturerData);
      setProductData(mockProductData);
      setLoading(false);
    }, 500);
  }, []);

  // 状态标签渲染
  const renderStatusTag = (status) => {
    let color, icon;
    
    switch (status) {
      case '已过期':
        color = 'error';
        icon = <AlertOutlined />;
        break;
      case '即将过期':
        color = 'warning';
        icon = <WarningOutlined />;
        break;
      case '有效':
        color = 'success';
        icon = <CheckCircleOutlined />;
        break;
      default:
        color = 'default';
        icon = null;
    }
    
    return (
      <Tag color={color} icon={icon} style={{ fontSize: '14px', padding: '4px 8px' }}>
        {status}
      </Tag>
    );
  };

  // 剩余天数渲染
  const renderDaysUntilExpiry = (days) => {
    if (days < 0) {
      return <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>已过期 {-days} 天</span>;
    } else if (days <= 30) {
      return <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>剩余 {days} 天</span>;
    } else if (days <= 90) {
      return <span style={{ color: '#fa8c16', fontWeight: 'bold' }}>剩余 {days} 天</span>;
    } else {
      return <span style={{ color: '#52c41a' }}>剩余 {days} 天</span>;
    }
  };

  // 查看详情
  const handleViewDetail = (record) => {
    // 检查是产品记录还是供应商记录
    if (record.productName) {
      // 产品详情
      const productDetails = {
        productName: record.productName,
        productType: record.productType,
        qualificationNumber: record.qualificationNumber,
        supplier: record.supplier,
        expiryDate: record.expiryDate,
        basicInfo: {
          productCode: 'PROD' + Math.floor(Math.random() * 10000),
          specification: '标准规格',
          unit: '个',
          manufacturer: '示例医疗器械有限公司',
          registrationNumber: record.qualificationNumber,
          productionLicense: 'SC' + Math.floor(Math.random() * 1000000),
        },
      };
      setSelectedProduct(productDetails);
      setDetailModalVisible(true);
    } else {
      // 供应商详情
      const supplierDetails = {
        supplierName: record.supplierName,
        basicInfo: {
          supplierType: record.supplierName === '供应商A' ? '生产型' : '贸易型',
          productionType: 'Ⅰ类',
          businessLicenseCode: '914411007197177739F',
          productionLicenseNumber: '20210113号',
          manufacturerRegistrationNumber: '20150116号',
          recordCertificateDate: '2020-05-27',
          disinfectionLicenseNumber: '-',
          disinfectionLicenseExpiryDate: '-',
        },
        qualifications: [
          {
            type: '营业执照',
            number: record.certificateType === '营业执照' ? record.certificateNumber : 'BC2024001',
            expiryDate: record.certificateType === '营业执照' ? record.expiryDate : '2029-12-31',
            file: '',
          },
          {
            type: '生产许可证',
            number: '20210113号',
            expiryDate: '2026-11-19',
            file: '',
          },
          {
            type: '经营许可证',
            number: record.certificateType === '经营许可证' ? record.certificateNumber : 'BL2024001',
            expiryDate: record.certificateType === '经营许可证' ? record.expiryDate : '2028-01-15',
            file: '',
          },
        ],
      };
      setSelectedSupplier(supplierDetails);
      setDetailModalVisible(true);
    }
  };

  // 查看供应链资质
  const handleViewSupplyChain = (product) => {
    const chainData = {
      productName: product.productName,
      supplierChain: [
        {
          level: '一级供应商',
          name: product.supplier,
          certificateNumber: product.qualificationNumber,
          expiryDate: product.expiryDate,
        },
        {
          level: '二级供应商',
          name: '上游供应商有限公司',
          certificateNumber: 'UPSTREAM' + Math.floor(Math.random() * 1000),
          expiryDate: '2028-12-31',
        },
      ],
      manufacturerInfo: {
        name: '示例医疗器械有限公司',
        productionLicense: 'SC' + Math.floor(Math.random() * 1000000),
        businessLicense: '91' + Math.floor(Math.random() * 1000000000000000000),
      },
    };
    setSupplyChainData(chainData);
    setShowSupplyChainModal(true);
  };

  const columns = [
    {
      title: '供应商名称',
      dataIndex: 'supplierName',
      key: 'supplierName',
      width: 150,
      sorter: (a, b) => a.supplierName.localeCompare(b.supplierName),
    },
    {
      title: '资质类型',
      dataIndex: 'certificateType',
      key: 'certificateType',
      width: 120,
      sorter: (a, b) => a.certificateType.localeCompare(b.certificateType),
    },
    {
      title: '资质编号',
      dataIndex: 'certificateNumber',
      key: 'certificateNumber',
      width: 120,
    },
    {
      title: '有效期至',
      dataIndex: 'expiryDate',
      key: 'expiryDate',
      width: 120,
      sorter: (a, b) => new Date(a.expiryDate) - new Date(b.expiryDate),
    },
    {
      title: '剩余天数',
      key: 'daysUntilExpiry',
      width: 100,
      render: (_, record) => renderDaysUntilExpiry(record.daysUntilExpiry),
      sorter: (a, b) => a.daysUntilExpiry - b.daysUntilExpiry,
    },
    {
      title: '预警状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: renderStatusTag,
      sorter: (a, b) => {
        const statusOrder = { '已过期': 0, '即将过期': 1, '有效': 2 };
        return statusOrder[a.status] - statusOrder[b.status];
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Space size="middle">
          <Button 
            key={`view-${record.key}`}
            type="link" 
            icon={<EyeOutlined />} 
            onClick={() => handleViewDetail(record)}
          >
            查看
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '0 16px' }}>
      <h1 style={{ marginBottom: 24 }}>资质预警</h1>
      
      {/* 主标签页导航 */}
      <div style={{ marginBottom: 20, borderBottom: '1px solid #e8e8e8', paddingBottom: 10 }}>
        <Space size="middle">
          <Button 
            key="supplier-tab"
            type={mainTab === 'supplier' ? 'primary' : 'default'}
            onClick={() => setMainTab('supplier')}
          >
            供应商 (210)
          </Button>
          <Button 
            key="manufacturer-tab"
            type={mainTab === 'manufacturer' ? 'primary' : 'default'}
            onClick={() => setMainTab('manufacturer')}
          >
            厂商 (353)
          </Button>
          <Button 
            key="product-tab"
            type={mainTab === 'product' ? 'primary' : 'default'}
            onClick={() => setMainTab('product')}
          >
            产品 (891)
          </Button>
        </Space>
      </div>

      {/* 供应商标签页 */}
      {mainTab === 'supplier' && (
        <div>
          {/* 搜索条件 */}
          <Card style={{ marginBottom: 16 }}>
            <Space wrap style={{ width: '100%' }}>
              <Select placeholder="选择供应商" style={{ width: 200 }}>
                <Select.Option value="">全部供应商</Select.Option>
                <Select.Option value="供应商A">供应商A</Select.Option>
                <Select.Option value="供应商B">供应商B</Select.Option>
                <Select.Option value="供应商C">供应商C</Select.Option>
              </Select>
              <Select placeholder="选择资质类型" style={{ width: 180 }}>
                <Select.Option value="">全部类型</Select.Option>
                <Select.Option value="营业执照">营业执照</Select.Option>
                <Select.Option value="经营许可证">经营许可证</Select.Option>
                <Select.Option value="生产许可证">生产许可证</Select.Option>
              </Select>
              <Select placeholder="选择预警状态" style={{ width: 150 }}>
                <Select.Option value="">全部状态</Select.Option>
                <Select.Option value="已过期">已过期</Select.Option>
                <Select.Option value="即将过期">即将过期</Select.Option>
                <Select.Option value="有效">有效</Select.Option>
              </Select>
              <Input placeholder="搜索资质编号" style={{ width: 200 }} />
              <Button type="primary" icon={<SearchOutlined />}>
                查询
              </Button>
              <Button icon={<SearchOutlined />}>
                重置
              </Button>
            </Space>
          </Card>

          {/* 批量操作 */}
          <Card style={{ marginBottom: 16 }}>
            <Space wrap>
              <Button type="primary" icon={<DownloadOutlined />}>
                批量导出
              </Button>
              <Text>已选择0项</Text>
              <Button type="link">清空</Button>
              <Checkbox defaultChecked>仅查看未过期</Checkbox>
            </Space>
          </Card>

          {/* 数据表格 */}
          <Card>
            <Table
              columns={columns}
              dataSource={warningData}
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
              loading={loading}
              scroll={{ x: 800 }}
              rowKey="key"
              rowSelection={{}}
              size="small"
            />
          </Card>
        </div>
      )}

      {/* 厂商标签页 */}
      {mainTab === 'manufacturer' && (
        <div>
          {/* 搜索条件 */}
          <Card style={{ marginBottom: 16 }}>
            <Space wrap style={{ width: '100%' }}>
              <Input placeholder="生产/代理商：输入名称/拼音查询" style={{ width: 250 }} />
              <Input placeholder="供应商：输入名称/拼音缩写查询" style={{ width: 250 }} />
              <Select placeholder="到期天数：请选择到期天数" style={{ width: 200 }}>
                <Select.Option value="">全部</Select.Option>
                <Select.Option value="30">30天内</Select.Option>
                <Select.Option value="60">60天内</Select.Option>
                <Select.Option value="90">90天内</Select.Option>
              </Select>
              <Button type="primary" icon={<SearchOutlined />}>
                查询
              </Button>
              <Button icon={<SearchOutlined />}>
                重置
              </Button>
            </Space>
          </Card>

          {/* 批量操作 */}
          <Card style={{ marginBottom: 16 }}>
            <Space wrap>
              <Button type="primary" icon={<DownloadOutlined />}>
                批量导出
              </Button>
              <Text>已选择0项</Text>
              <Button type="link">清空</Button>
              <Checkbox defaultChecked>仅查看未过期</Checkbox>
            </Space>
          </Card>

          {/* 数据表格 */}
          <Card>
            <Table
              key="manufacturer-table"
              columns={[
                {
                  title: '',
                  dataIndex: 'checkbox',
                  key: 'checkbox',
                  width: 40,
                  render: () => <Checkbox />
                },
                {
                  title: '#',
                  dataIndex: 'index',
                  key: 'index',
                  width: 60,
                  render: (_, record, index) => index + 1
                },
                {
                  title: '生产/代理商',
                  dataIndex: 'manufacturer',
                  key: 'manufacturer',
                  width: 200,
                  render: (text) => <Tag color="purple">{text}</Tag>
                },
                {
                  title: '拼音缩写',
                  dataIndex: 'pinyin',
                  key: 'pinyin',
                  width: 150
                },
                {
                  title: '供应商',
                  dataIndex: 'supplier',
                  key: 'supplier',
                  width: 200,
                  render: (text) => <Tag color="blue">{text}</Tag>
                },
                {
                  title: '企业类型',
                  dataIndex: 'companyType',
                  key: 'companyType',
                  width: 100,
                  render: (text) => (
                    <Tag color={text === '生产企业' ? 'purple' : 'green'}>
                      {text}
                    </Tag>
                  )
                },
                {
                  title: '过期资质',
                  dataIndex: 'expiredCount',
                  key: 'expiredCount',
                  width: 100,
                  render: (count) => (
                    <span style={{ color: '#52c41a', fontWeight: 'bold' }}>{count}个</span>
                  )
                },
                {
                  title: '操作',
                  key: 'action',
                  width: 80,
                  render: (_, record) => (
                    <Button 
                      key={`view-${record.key}`}
                      type="link" 
                      onClick={() => handleViewDetail(record)}
                    >
                      查看
                    </Button>
                  )
                }
              ]}
              dataSource={manufacturerData}
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
              loading={loading}
              scroll={{ x: 1000 }}
              rowKey="key"
              rowSelection={{}}
              size="small"
            />
          </Card>
        </div>
      )}

      {/* 产品标签页 */}
      {mainTab === 'product' && (
        <div>
          {/* 搜索条件 */}
          <Card style={{ marginBottom: 16 }}>
            <Space wrap style={{ width: '100%' }}>
              <Input placeholder="产品名称：输入产品名称模糊查询" style={{ width: 250 }} />
              <Select placeholder="到期天数：请选择到期天数" style={{ width: 200 }}>
                <Select.Option value="">全部</Select.Option>
                <Select.Option value="30">30天内</Select.Option>
                <Select.Option value="60">60天内</Select.Option>
                <Select.Option value="90">90天内</Select.Option>
              </Select>
              <Input placeholder="供应商：输入供应商名称模糊查询" style={{ width: 250 }} />
              <Button type="primary" icon={<SearchOutlined />}>
                查询
              </Button>
              <Button icon={<SearchOutlined />}>
                重置
              </Button>
            </Space>
          </Card>

          {/* 批量操作 */}
          <Card style={{ marginBottom: 16 }}>
            <Space wrap>
              <Button type="primary" icon={<DownloadOutlined />}>
                批量导出
              </Button>
              <Text>已选择0项</Text>
              <Button type="link">清空</Button>
              <Checkbox defaultChecked>仅查看未过期</Checkbox>
            </Space>
          </Card>

          {/* 数据表格 */}
          <Card>
            <Table
              key="product-table"
              columns={[
                {
                  title: '',
                  dataIndex: 'checkbox',
                  key: 'checkbox',
                  width: 40,
                  render: () => <Checkbox />
                },
                {
                  title: '#',
                  dataIndex: 'index',
                  key: 'index',
                  width: 60,
                  render: (_, record, index) => index + 1
                },
                {
                  title: '物资名称',
                  dataIndex: 'productName',
                  key: 'productName',
                  width: 150,
                  render: (text) => <Tag color="blue">{text}</Tag>
                },
                {
                  title: '物资类型',
                  dataIndex: 'productType',
                  key: 'productType',
                  width: 120
                },
                {
                  title: '资质编号',
                  dataIndex: 'qualificationNumber',
                  key: 'qualificationNumber',
                  width: 180
                },
                {
                  title: '供应商',
                  dataIndex: 'supplier',
                  key: 'supplier',
                  width: 150,
                  render: (text) => <Tag color="blue">{text}</Tag>
                },
                {
                  title: '证照到期',
                  dataIndex: 'expiryDate',
                  key: 'expiryDate',
                  width: 120,
                  render: (date) => (
                    <span style={{ color: '#52c41a' }}>{date}</span>
                  )
                },
                {
                  title: '操作',
                  key: 'action',
                  width: 80,
                  render: (_, record) => (
                    <Button 
                      key={`view-${record.key}`}
                      type="link" 
                      onClick={() => handleViewDetail(record)}
                    >
                      查看
                    </Button>
                  )
                }
              ]}
              dataSource={productData}
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
              loading={loading}
              scroll={{ x: 1000 }}
              rowKey="key"
              rowSelection={{}}
              size="small"
            />
          </Card>
        </div>
      )}

      {/* 资质详情模态框 */}
      <Modal
        title={selectedProduct ? `${selectedProduct.productName} - 产品详情` : `${selectedSupplier?.supplierName} - 资质信息`}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        width={900}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            关闭
          </Button>,
        ]}
      >
        {/* 产品详情 */}
        {selectedProduct && (
          <div>
            {/* 页面头部 */}
            <div style={{ borderBottom: '1px solid #e8e8e8', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>{selectedProduct.productName}</h2>
                <p style={{ margin: '8px 0', color: '#666' }}>物资类型：{selectedProduct.productType}</p>
              </div>
              <Button 
                key="supply-chain-btn"
                type="primary" 
                onClick={() => handleViewSupplyChain(selectedProduct)}
              >
                供应链资质
              </Button>
            </div>

            {/* 产品详情内容 */}
            <div style={{ padding: '0 20px' }}>
              {/* 提示信息 */}
              <div style={{ marginBottom: 20, padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                <p style={{ margin: '5px 0', fontSize: '12px', color: '#666' }}>
                  当前供应商产品信息为供应商提交的最新信息，页面中如有红色删除线，表示最新的产品信息与当前物资字典中的信息不同。页面中如有蓝色文字，则表示为无效的历史提交数据
                </p>
              </div>

              {/* 主要信息区域 */}
              <div style={{ marginBottom: 30 }}>
                {/* 生产厂商和供应商信息 */}
                <div style={{ marginBottom: 20 }}>
                  <p style={{ margin: '8px 0' }}>
                    <strong>生产厂商名称：</strong>
                    <span style={{ color: '#1890ff', textDecoration: 'underline' }}>{selectedProduct.basicInfo.manufacturer}</span>
                  </p>
                  <p style={{ margin: '8px 0' }}>
                    <strong>供应商名称：</strong>
                    <span style={{ color: '#1890ff', textDecoration: 'underline' }}>{selectedProduct.supplier}</span>
                  </p>
                </div>

                {/* 产品详细信息 - 三列布局 */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 20 }}>
                  {/* 第一列 */}
                  <div>
                    <p style={{ margin: '8px 0' }}><strong>物资类型：</strong>{selectedProduct.productType}</p>
                    <p style={{ margin: '8px 0' }}><strong>拼音缩写：</strong>PTCA</p>
                    <p style={{ margin: '8px 0' }}><strong>医保类型：</strong>医保</p>
                    <p style={{ margin: '8px 0' }}><strong>是否医保：</strong>是</p>
                    <p style={{ margin: '8px 0' }}><strong>集采类型：</strong>集采</p>
                    <p style={{ margin: '8px 0' }}><strong>线上采购：</strong>-</p>
                    <p style={{ margin: '8px 0' }}><strong>规格：</strong>AFW14R009S</p>
                    <p style={{ margin: '8px 0' }}><strong>单位：</strong>条</p>
                    <p style={{ margin: '8px 0' }}><strong>产品条码规则：</strong>G51</p>
                    <p style={{ margin: '8px 0' }}><strong>注册备案证号：</strong>国械注进20183301817</p>
                    <p style={{ margin: '8px 0' }}><strong>是否进口：</strong>进口</p>
                    <p style={{ margin: '8px 0' }}><strong>存储条件：</strong>常温</p>
                    <p style={{ margin: '8px 0' }}><strong>是否灭菌：</strong>否</p>
                    <p style={{ margin: '8px 0' }}><strong>是否有检验报告书：</strong>否</p>
                    <p style={{ margin: '8px 0' }}><strong>产品照片：</strong>-</p>
                    <p style={{ margin: '8px 0' }}><strong>材质：</strong>-</p>
                    <p style={{ margin: '8px 0' }}><strong>结构及组成：</strong>-</p>
                    <p style={{ margin: '8px 0' }}><strong>适用范围：</strong>-</p>
                  </div>

                  {/* 第二列 */}
                  <div>
                    <p style={{ margin: '8px 0' }}><strong>物资名称：</strong>{selectedProduct.productName}</p>
                    <p style={{ margin: '8px 0' }}><strong>医保通用名：</strong>PTCA导丝</p>
                    <p style={{ margin: '8px 0' }}><strong>阳光采购耗材代码：</strong>-</p>
                    <p style={{ margin: '8px 0' }}><strong>型号：</strong>AFW14R009S</p>
                    <p style={{ margin: '8px 0' }}><strong>产品条码：</strong>120000000003</p>
                    <p style={{ margin: '8px 0' }}><strong>注册证：</strong></p>
                    <div style={{ margin: '5px 0', padding: '10px', border: '1px solid #d9d9d9', borderRadius: '4px', width: '100px', textAlign: 'center' }}>
                      <span style={{ color: '#ff4d4f' }}>PDF</span>
                    </div>
                    <p style={{ margin: '8px 0' }}><strong>进口报关单：</strong></p>
                    <div style={{ margin: '5px 0', padding: '10px', border: '1px solid #d9d9d9', borderRadius: '4px', width: '100px', textAlign: 'center' }}>
                      <span style={{ color: '#999' }}>上传</span>
                    </div>
                    <p style={{ margin: '8px 0' }}><strong>运输条件：</strong>常温</p>
                    <p style={{ margin: '8px 0' }}><strong>是否为植入类：</strong>是</p>
                    <p style={{ margin: '8px 0' }}><strong>是否有说明书：</strong>否</p>
                  </div>

                  {/* 第三列 */}
                  <div>
                    <p style={{ margin: '8px 0' }}><strong>注册/备案产品名称：</strong>{selectedProduct.productName}</p>
                    <p style={{ margin: '8px 0' }}><strong>医保耗材代码：</strong>C0221030000000000710000038</p>
                    <p style={{ margin: '8px 0' }}><strong>采购价格：</strong>180.00</p>
                    <p style={{ margin: '8px 0' }}><strong>医疗器械类型：</strong>Ⅲ类</p>
                    <p style={{ margin: '8px 0' }}><strong>发证日期：</strong>2023-03-15</p>
                    <p style={{ margin: '8px 0' }}><strong>截止日期：</strong><span style={{ color: '#52c41a' }}>2028-03-14</span></p>
                    <p style={{ margin: '8px 0' }}><strong>是否一次性耗材：</strong>是</p>
                    <p style={{ margin: '8px 0' }}><strong>是否有产品合格证：</strong>否</p>
                    <p style={{ margin: '8px 0' }}><strong>操作手册：</strong>-</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 供应商详情 */}
        {selectedSupplier && (
          <div>
            {/* 标签页导航 */}
            <div style={{ borderBottom: '1px solid #e8e8e8', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Space size="large">
                <Button 
                  key="basic-info" 
                  type="link" 
                  style={{ 
                    fontSize: '16px', 
                    fontWeight: activeTab === 'basic' ? 'bold' : 'normal',
                    color: activeTab === 'basic' ? '#1890ff' : '#333333',
                    borderBottom: activeTab === 'basic' ? '2px solid #1890ff' : 'none'
                  }}
                  onClick={() => setActiveTab('basic')}
                >
                  基本信息
                </Button>
                <Button 
                  key="qualification" 
                  type="link" 
                  style={{ 
                    fontSize: '16px', 
                    fontWeight: activeTab === 'qualification' ? 'bold' : 'normal',
                    color: activeTab === 'qualification' ? '#1890ff' : '#333333',
                    borderBottom: activeTab === 'qualification' ? '2px solid #1890ff' : 'none'
                  }}
                  onClick={() => setActiveTab('qualification')}
                >
                  资质证照
                </Button>
                <Button 
                  key="contract" 
                  type="link" 
                  style={{ 
                    fontSize: '16px', 
                    fontWeight: activeTab === 'contract' ? 'bold' : 'normal',
                    color: activeTab === 'contract' ? '#1890ff' : '#333333',
                    borderBottom: activeTab === 'contract' ? '2px solid #1890ff' : 'none'
                  }}
                  onClick={() => setActiveTab('contract')}
                >
                  授权合同
                </Button>
              </Space>
              <Button key="add-btn" type="primary" icon={<PlusOutlined />} style={{ borderRadius: '4px' }}>
                添加
              </Button>
            </div>

            {/* 基本信息页面 */}
            {activeTab === 'basic' && (
              <div style={{ padding: '0 20px' }}>
                <div style={{ marginBottom: 30 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
                    <div>
                      <p style={{ margin: '8px 0' }}><strong style={{ color: '#ff4d4f' }}>*</strong><strong>企业类型：</strong>经营企业</p>
                      <p style={{ margin: '8px 0' }}><strong style={{ color: '#ff4d4f' }}>*</strong><strong>供应商名称：</strong>{selectedSupplier.supplierName}</p>
                      <p style={{ margin: '8px 0' }}><strong>企业负责人：</strong>-</p>
                      <p style={{ margin: '8px 0' }}><strong>库房地址：</strong>-</p>
                      <p style={{ margin: '8px 0' }}><strong style={{ color: '#ff4d4f' }}>*</strong><strong>开户名：</strong>-</p>
                    </div>
                    <div>
                      <p style={{ margin: '8px 0' }}><strong style={{ color: '#ff4d4f' }}>*</strong><strong>拼音缩写：</strong>XJ</p>
                      <p style={{ margin: '8px 0' }}><strong>所属地区：</strong>-</p>
                      <p style={{ margin: '8px 0' }}><strong>经营场所：</strong>-</p>
                      <p style={{ margin: '8px 0' }}><strong style={{ color: '#ff4d4f' }}>*</strong><strong>银行账号：</strong>-</p>
                    </div>
                    <div>
                      <p style={{ margin: '8px 0' }}><strong>法人：</strong>-</p>
                      <p style={{ margin: '8px 0' }}><strong>地址：</strong>-</p>
                      <p style={{ margin: '8px 0' }}><strong style={{ color: '#ff4d4f' }}>*</strong><strong>开户行：</strong>-</p>
                      <p style={{ margin: '8px 0' }}><strong style={{ color: '#ff4d4f' }}>*</strong><strong>开户证明：</strong>-</p>
                    </div>
                  </div>
                  
                  <div style={{ marginTop: 20 }}>
                    <p style={{ margin: '8px 0' }}><strong style={{ color: '#ff4d4f' }}>*</strong><strong>企业联系人：</strong>-</p>
                  </div>
                  
                  <div style={{ marginTop: 20 }}>
                    <p style={{ margin: '8px 0' }}><strong>经营方式：</strong>批发</p>
                    <p style={{ margin: '8px 0' }}><strong>经营范围：</strong>-</p>
                  </div>
                </div>
              </div>
            )}

            {/* 资质证照页面 */}
            {activeTab === 'qualification' && (
              <div style={{ padding: '0 20px' }}>
                <div style={{ marginBottom: 30 }}>
                  <div style={{ marginBottom: 20 }}>
                    <p style={{ margin: '8px 0' }}><strong>供应商：</strong>{selectedSupplier.supplierName}</p>
                    <p style={{ margin: '8px 0' }}><strong>生产/代理类别：</strong>{selectedSupplier.basicInfo.productionType}</p>
                  </div>
                  
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 40 }}>
                    {/* 营业执照信息 */}
                    <div style={{ flex: 1, minWidth: 350 }}>
                      <p style={{ margin: '8px 0' }}><strong>营业执照信用代码：</strong>{selectedSupplier.basicInfo.businessLicenseCode}</p>
                      <div style={{ margin: '8px 0', padding: '15px', border: '2px solid #52c41a', borderRadius: '4px', backgroundColor: '#f6ffed' }}>
                        <p style={{ margin: '6px 0' }}><strong style={{ color: '#1890ff' }}>营业执照有效期：</strong>{selectedSupplier.qualifications.find(q => q.type === '营业执照')?.expiryDate}</p>
                        <p style={{ margin: '6px 0' }}><strong style={{ color: '#1890ff' }}>营业执照：</strong></p>
                        <div style={{ marginTop: 8, height: 100, border: '1px dashed #d9d9d9', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff' }}>
                          <span style={{ color: '#999999' }}>点击上传营业执照</span>
                        </div>
                      </div>
                    </div>

                    {/* 生产许可证信息 */}
                    <div style={{ flex: 1, minWidth: 350 }}>
                      <p style={{ margin: '8px 0' }}><strong>生产许可证号：</strong>{selectedSupplier.basicInfo.productionLicenseNumber}</p>
                      <div style={{ margin: '8px 0', padding: '15px', border: '2px solid #52c41a', borderRadius: '4px', backgroundColor: '#f6ffed' }}>
                        <p style={{ margin: '6px 0' }}><strong style={{ color: '#1890ff' }}>生产许可证有效期：</strong>{selectedSupplier.qualifications.find(q => q.type === '生产许可证')?.expiryDate}</p>
                        <p style={{ margin: '6px 0' }}><strong style={{ color: '#1890ff' }}>生产许可证：</strong></p>
                        <div style={{ marginTop: 8, height: 100, border: '1px dashed #d9d9d9', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff' }}>
                          <span style={{ color: '#999999' }}>点击上传生产许可证</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 其他资质信息 */}
                <div style={{ marginTop: 30 }}>
                  <p style={{ margin: '8px 0' }}><strong>生产商家登记号：</strong>{selectedSupplier.basicInfo.manufacturerRegistrationNumber}</p>
                  <p style={{ margin: '8px 0' }}><strong>备案证明日期：</strong>{selectedSupplier.basicInfo.recordCertificateDate}</p>
                  <div style={{ margin: '8px 0', padding: '10px', border: '1px solid #e8e8e8', borderRadius: '4px' }}>
                    <p style={{ margin: '4px 0' }}><strong>备案凭证：</strong></p>
                    <div style={{ marginTop: 8, height: 80, border: '1px dashed #d9d9d9', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9f9f9' }}>
                      <span style={{ color: '#999999' }}>点击上传备案凭证</span>
                    </div>
                  </div>
                  
                  <div style={{ marginTop: 20 }}>
                    <p style={{ margin: '8px 0' }}><strong>消毒许可证号：</strong>{selectedSupplier.basicInfo.disinfectionLicenseNumber}</p>
                    <p style={{ margin: '8px 0' }}><strong>消毒许可证有效期：</strong>{selectedSupplier.basicInfo.disinfectionLicenseExpiryDate}</p>
                    <div style={{ margin: '8px 0', padding: '10px', border: '1px solid #e8e8e8', borderRadius: '4px' }}>
                      <p style={{ margin: '4px 0' }}><strong>消毒许可证：</strong></p>
                      <div style={{ marginTop: 8, height: 80, border: '1px dashed #d9d9d9', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9f9f9' }}>
                        <span style={{ color: '#999999' }}>点击上传消毒许可证</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 授权合同页面 */}
            {activeTab === 'contract' && (
              <div style={{ padding: '0 20px' }}>
                <div style={{ marginBottom: 20 }}>
                  <p style={{ margin: '8px 0', color: '#ff4d4f' }}><strong>*授权书列表：</strong></p>
                </div>
                <Card>
                  <Table
                    key="contract-table"
                    columns={[
                      {
                        title: '#',
                        dataIndex: 'index',
                        key: 'index',
                        width: 60,
                        render: (_, record, index) => index + 1
                      },
                      {
                        title: '授权书编码',
                        dataIndex: 'code',
                        key: 'code',
                        width: 150
                      },
                      {
                        title: '授权书文件',
                        dataIndex: 'file',
                        key: 'file',
                        width: 150,
                        render: (_, record) => (
                          <Button 
                            key={`file-${record.key || Math.random()}`}
                            type="link" 
                            icon={<FileOutlined />}
                          >
                            查看文件
                          </Button>
                        )
                      },
                      {
                        title: '授权书生效日',
                        dataIndex: 'effectiveDate',
                        key: 'effectiveDate',
                        width: 120
                      },
                      {
                        title: '授权书效期',
                        dataIndex: 'expiryDate',
                        key: 'expiryDate',
                        width: 120
                      },
                      {
                        title: '备注',
                        dataIndex: 'remark',
                        key: 'remark',
                        flex: 1
                      }
                    ]}
                    dataSource={[]}
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
                    locale={{
                      emptyText: (
                        <div key="empty-text" style={{ padding: '40px 0', textAlign: 'center' }}>
                          <InboxOutlined style={{ fontSize: 48, color: '#ccc', marginBottom: 16 }} />
                          <p>暂无数据</p>
                        </div>
                      )
                    }}
                    size="small"
                  />
                </Card>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* 供应链资质模态框 */}
      <Modal
        title={`${supplyChainData?.productName} - 供应链资质`}
        open={showSupplyChainModal}
        onCancel={() => setShowSupplyChainModal(false)}
        width={1000}
        footer={[
          <Button key="close" onClick={() => setShowSupplyChainModal(false)}>
            关闭
          </Button>,
        ]}
      >
        {supplyChainData && (
          <div>
            {/* 流程进度 */}
            <div style={{ marginBottom: 20, padding: '10px 0', borderBottom: '1px solid #e8e8e8' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ color: '#1890ff', marginRight: 10 }}>流程进度</span>
                <span style={{ marginRight: 10 }}>&gt;</span>
                <span style={{ color: '#1890ff', textDecoration: 'underline' }}>0 点击展开流程审核信息</span>
              </div>
            </div>

            {/* 供应链名称信息 */}
            <div style={{ marginBottom: 20, padding: '10px 0', borderBottom: '1px solid #e8e8e8' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
                <div>
                  <p style={{ margin: '5px 0', fontSize: '12px' }}><strong style={{ color: '#ff4d4f' }}>*</strong><strong>供应链名称：</strong></p>
                  <p style={{ margin: '5px 0' }}>朝日送科贸(北京)有限公司</p>
                </div>
                <div>
                  <p style={{ margin: '5px 0', fontSize: '12px' }}><strong style={{ color: '#ff4d4f' }}>*</strong><strong>生产商名称：</strong></p>
                  <p style={{ margin: '5px 0' }}><span style={{ color: '#1890ff', textDecoration: 'underline' }}>朝日送科贸(北京)有限公司</span></p>
                </div>
                <div>
                  <p style={{ margin: '5px 0', fontSize: '12px' }}><strong style={{ color: '#ff4d4f' }}>*</strong><strong>供应商名称：</strong></p>
                  <p style={{ margin: '5px 0' }}><span style={{ color: '#1890ff', textDecoration: 'underline' }}>合肥博雅医疗科技有限公司</span></p>
                </div>
              </div>
            </div>

            {/* 公司切换标签 */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 40, padding: '10px 0' }}>
                <div 
                  style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                  onClick={() => setSelectedCompany('asahi')}
                >
                  <span style={{ marginRight: 10 }}><FileOutlined /></span>
                  <span style={{ marginRight: 10, color: selectedCompany === 'asahi' ? '#1890ff' : '#333', fontWeight: selectedCompany === 'asahi' ? 'bold' : 'normal', borderBottom: selectedCompany === 'asahi' ? '2px solid #1890ff' : 'none' }}>朝日送科贸(北京)有限公司</span>
                  <span style={{ color: '#1890ff' }}>&gt;</span>
                </div>
                <div 
                  style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                  onClick={() => setSelectedCompany('hefei')}
                >
                  <span style={{ marginRight: 10 }}><FileOutlined /></span>
                  <span style={{ marginRight: 10, color: selectedCompany === 'hefei' ? '#1890ff' : '#333', fontWeight: selectedCompany === 'hefei' ? 'bold' : 'normal', borderBottom: selectedCompany === 'hefei' ? '2px solid #1890ff' : 'none' }}>合肥博雅医疗科技有限公司</span>
                  <span style={{ color: '#1890ff' }}>&gt;</span>
                </div>
              </div>
            </div>

            {/* 公司名称和标签页 */}
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ margin: '0 0 15px 0', fontSize: '16px', fontWeight: 'bold' }}>
                {selectedCompany === 'hefei' ? '合肥博雅医疗科技有限公司' : '朝日送科贸(北京)有限公司'}
              </h2>
              
              {/* 标签页导航 */}
              <div style={{ display: 'flex', borderBottom: '1px solid #e8e8e8', marginBottom: 20 }}>
                <Button 
                  key="basic"
                  type="link" 
                  style={{ 
                    fontSize: '14px', 
                    fontWeight: supplyChainTab === 'basic' ? 'bold' : 'normal',
                    color: supplyChainTab === 'basic' ? '#1890ff' : '#333',
                    borderBottom: supplyChainTab === 'basic' ? '2px solid #1890ff' : 'none',
                    padding: '8px 16px'
                  }}
                  onClick={() => setSupplyChainTab('basic')}
                >
                  基本信息
                </Button>
                <Button 
                  key="qualification"
                  type="link" 
                  style={{ 
                    fontSize: '14px', 
                    fontWeight: supplyChainTab === 'qualification' ? 'bold' : 'normal',
                    color: supplyChainTab === 'qualification' ? '#1890ff' : '#333',
                    borderBottom: supplyChainTab === 'qualification' ? '2px solid #1890ff' : 'none',
                    padding: '8px 16px'
                  }}
                  onClick={() => setSupplyChainTab('qualification')}
                >
                  资质证照
                </Button>
                <Button 
                  key="contract"
                  type="link" 
                  style={{ 
                    fontSize: '14px', 
                    fontWeight: supplyChainTab === 'contract' ? 'bold' : 'normal',
                    color: supplyChainTab === 'contract' ? '#1890ff' : '#333',
                    borderBottom: supplyChainTab === 'contract' ? '2px solid #1890ff' : 'none',
                    padding: '8px 16px'
                  }}
                  onClick={() => setSupplyChainTab('contract')}
                >
                  授权合同
                </Button>
                <div style={{ flex: 1 }}></div>
                <Button 
                  key="edit"
                  type="primary" 
                  size="small"
                  style={{ borderRadius: '4px' }}
                >
                  编辑
                </Button>
              </div>

              {/* 基本信息内容 */}
              {supplyChainTab === 'basic' && (
                <div style={{ padding: '0 20px' }}>
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 20 }}>
                      <div>
                        <p style={{ margin: '8px 0' }}><strong style={{ color: '#ff4d4f' }}>*</strong><strong>企业类型：</strong>{selectedCompany === 'hefei' ? '经营企业' : '生产企业'}</p>
                      </div>
                      <div>
                        <p style={{ margin: '8px 0' }}><strong style={{ color: '#ff4d4f' }}>*</strong><strong>供应商名称：</strong>{selectedCompany === 'hefei' ? '合肥博雅医疗科技有限公司' : '朝日送科贸(北京)有限公司'}</p>
                      </div>
                      <div>
                        <p style={{ margin: '8px 0' }}><strong style={{ color: '#ff4d4f' }}>*</strong><strong>拼音缩写：</strong>{selectedCompany === 'hefei' ? 'HFBYLYKJYGS' : 'ZRSDKMBJYXGS'}</p>
                      </div>
                      <div>
                        <p style={{ margin: '8px 0' }}><strong style={{ color: '#ff4d4f' }}>*</strong><strong>法人：</strong>{selectedCompany === 'hefei' ? '苏芬' : '张三'}</p>
                      </div>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 20 }}>
                      <div>
                        <p style={{ margin: '8px 0' }}><strong style={{ color: '#ff4d4f' }}>*</strong><strong>所属地区：</strong>{selectedCompany === 'hefei' ? '安徽省/合肥市/肥东县' : '北京市/朝阳区'}</p>
                      </div>
                      <div>
                        <p style={{ margin: '8px 0' }}><strong style={{ color: '#ff4d4f' }}>*</strong><strong>地址：</strong>{selectedCompany === 'hefei' ? '安徽省合肥市肥东县肥东经开区金阳路26号3号楼507室' : '北京市朝阳区建国路88号'}</p>
                      </div>
                      <div>
                        <p style={{ margin: '8px 0' }}><strong style={{ color: '#ff4d4f' }}>*</strong><strong>库房地址：</strong>{selectedCompany === 'hefei' ? '安徽省合肥市肥东县肥东经济开发区金阳路26号3号楼507室' : '北京市朝阳区建国路88号仓库'}</p>
                      </div>
                      <div>
                        <p style={{ margin: '8px 0' }}><strong style={{ color: '#ff4d4f' }}>*</strong><strong>经营属性：</strong>-</p>
                      </div>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 20 }}>
                      <div>
                        <p style={{ margin: '8px 0' }}><strong style={{ color: '#ff4d4f' }}>*</strong><strong>开户名：</strong>{selectedCompany === 'hefei' ? '合肥博雅医疗科技有限公司' : '朝日送科贸(北京)有限公司'}</p>
                      </div>
                      <div>
                        <p style={{ margin: '8px 0' }}><strong style={{ color: '#ff4d4f' }}>*</strong><strong>银行账号：</strong>{selectedCompany === 'hefei' ? '1023401021001164789' : '1023401021001164790'}</p>
                      </div>
                      <div>
                        <p style={{ margin: '8px 0' }}><strong style={{ color: '#ff4d4f' }}>*</strong><strong>开户行：</strong>{selectedCompany === 'hefei' ? '徽商银行股份有限公司合肥桐城北支行' : '中国工商银行北京市朝阳区支行'}</p>
                      </div>
                      <div>
                        <p style={{ margin: '8px 0' }}><strong style={{ color: '#ff4d4f' }}>*</strong><strong>开户证明：</strong></p>
                        <div style={{ marginTop: 5, padding: '10px', border: '1px solid #d9d9d9', borderRadius: '4px', width: '100px', textAlign: 'center' }}>
                          <span style={{ color: '#ff4d4f' }}>PDF</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: 20 }}>
                    <p style={{ margin: '8px 0' }}><strong style={{ color: '#ff4d4f' }}>*</strong><strong>企业联系人：</strong>{selectedCompany === 'hefei' ? '叶凡(业务员)/18356479907' : '李四(经理)/13800138000'}</p>
                  </div>
                  
                  <div style={{ marginBottom: 20 }}>
                    <p style={{ margin: '8px 0' }}><strong>经营方式：</strong>{selectedCompany === 'hefei' ? '批发零售' : '生产销售'}</p>
                    <p style={{ margin: '8px 0' }}><strong>经营范围：</strong>{selectedCompany === 'hefei' ? '许可项目：药品零售；第三类医疗器械经营（依法须经批准的项目，经相关部门批准后方可开展经营活动，具体经营项目以相关部门批准文件或许可证件为准）一般项目：第一类医疗器械销售；第二类医疗器械销售；保健食品（预包装）销售；食品销售（仅销售预包装食品）；消毒剂销售（不含危险化学品）；日用百货销售；化妆品批发；化妆品零售；个人卫生用品销售；电子产品销售；仪器仪表销售；第二类医疗器械租赁；第一类医疗器械租赁；工程和技术研究和试验发展；技术服务、技术开发、技术咨询、技术交流、技术转让、技术推广；健康咨询服务（不含诊疗服务）；普通货物仓储服务（不含危险化学品等需许可审批的项目）；电子专用设备销售；会议及展览服务；广告设计、代理；广告发布；广告制作；软件开发；项目策划与公关服务；市场营销策划；企业管理；企业形象策划；企业管理咨询；信息咨询服务（不含许可类信息咨询服务）；货物进出口；技术进出口；进出口代理；新能源汽车销售；汽车销售；新能源汽车电附件销售；新能源汽车换电设施销售；汽车零配件零售（除许可业务外，可自主依法经营法律法规非禁止或限制的项目）' : '许可项目：第二类医疗器械生产；第三类医疗器械生产；第三类医疗器械经营；药品生产；药品批发；药品零售（依法须经批准的项目，经相关部门批准后方可开展经营活动，具体经营项目以相关部门批准文件或许可证件为准）一般项目：第一类医疗器械生产；第一类医疗器械销售；第二类医疗器械销售；技术服务、技术开发、技术咨询、技术交流、技术转让、技术推广；货物进出口；技术进出口；进出口代理（除依法须经批准的项目外，凭营业执照依法自主开展经营活动）'}</p>
                  </div>
                </div>
              )}

              {/* 资质证照内容 */}
              {supplyChainTab === 'qualification' && (
                <div style={{ padding: '0 20px' }}>
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 40, marginBottom: 20 }}>
                      <div>
                        <p style={{ margin: '8px 0' }}><strong>证书类型：</strong>第二类</p>
                        <p style={{ margin: '8px 0' }}><strong>资质证照批准编号：</strong>{selectedCompany === 'hefei' ? '3141001023971035' : '1101001023971036'}</p>
                        <p style={{ margin: '8px 0' }}><strong>营业执照有效期：</strong><span style={{ color: '#52c41a' }}>2029-12-31</span></p>
                        <p style={{ margin: '8px 0' }}><strong>资质：</strong></p>
                        <div style={{ marginTop: 5, padding: '10px', border: '1px solid #d9d9d9', borderRadius: '4px', width: '100px', textAlign: 'center' }}>
                          <span style={{ color: '#ff4d4f' }}>PDF</span>
                        </div>
                      </div>
                      <div>
                        <p style={{ margin: '8px 0' }}><strong>经营许可证号：</strong>{selectedCompany === 'hefei' ? '合肥市蜀山区经营许可证20170420号' : '北京市朝阳区经营许可证20170421号'}</p>
                        <p style={{ margin: '8px 0' }}><strong>经营许可证有效期：</strong><span style={{ color: '#52c41a' }}>2028-12-31</span></p>
                        <p style={{ margin: '8px 0' }}><strong>资质：</strong></p>
                        <div style={{ marginTop: 5, padding: '10px', border: '1px solid #d9d9d9', borderRadius: '4px', width: '100px', textAlign: 'center' }}>
                          <span style={{ color: '#ff4d4f' }}>PDF</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 授权合同内容 */}
              {supplyChainTab === 'contract' && (
                <div style={{ padding: '0 20px' }}>
                  <div style={{ marginBottom: 20 }}>
                    <p style={{ margin: '8px 0', color: '#ff4d4f', fontWeight: 'bold' }}>*授权书列表：</p>
                  </div>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid #e8e8e8' }}>
                          <th style={{ padding: '8px', textAlign: 'left', width: '60px' }}>#</th>
                          <th style={{ padding: '8px', textAlign: 'left', width: '150px' }}>授权书编码</th>
                          <th style={{ padding: '8px', textAlign: 'left', width: '150px' }}>授权书文件</th>
                          <th style={{ padding: '8px', textAlign: 'left', width: '120px' }}>授权书生效日</th>
                          <th style={{ padding: '8px', textAlign: 'left', width: '120px' }}>授权书效期</th>
                          <th style={{ padding: '8px', textAlign: 'left' }}>备注</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr key="1" style={{ borderBottom: '1px solid #e8e8e8' }}>
                          <td style={{ padding: '8px' }}>1</td>
                          <td style={{ padding: '8px' }}>公司印章鉴发</td>
                          <td style={{ padding: '8px' }}>
                            <div style={{ padding: '10px', border: '1px solid #d9d9d9', borderRadius: '4px', width: '100px', textAlign: 'center', display: 'inline-block' }}>
                              <span style={{ color: '#ff4d4f' }}>PDF</span>
                            </div>
                          </td>
                          <td style={{ padding: '8px' }}>-</td>
                          <td style={{ padding: '8px' }}>-</td>
                          <td style={{ padding: '8px' }}>-</td>
                        </tr>
                        <tr key="2" style={{ borderBottom: '1px solid #e8e8e8' }}>
                          <td style={{ padding: '8px' }}>2</td>
                          <td style={{ padding: '8px' }}>被授权人身份证明件</td>
                          <td style={{ padding: '8px' }}>
                            <div style={{ padding: '10px', border: '1px solid #d9d9d9', borderRadius: '4px', width: '100px', textAlign: 'center', display: 'inline-block' }}>
                              <span style={{ color: '#ff4d4f' }}>PDF</span>
                            </div>
                          </td>
                          <td style={{ padding: '8px' }}>-</td>
                          <td style={{ padding: '8px' }}>-</td>
                          <td style={{ padding: '8px' }}>-</td>
                        </tr>
                        <tr key="3" style={{ borderBottom: '1px solid #e8e8e8' }}>
                          <td style={{ padding: '8px' }}>3</td>
                          <td style={{ padding: '8px' }}>被授权人销售委托书</td>
                          <td style={{ padding: '8px' }}>
                            <div style={{ padding: '10px', border: '1px solid #d9d9d9', borderRadius: '4px', width: '100px', textAlign: 'center', display: 'inline-block' }}>
                              <span style={{ color: '#ff4d4f' }}>PDF</span>
                            </div>
                          </td>
                          <td style={{ padding: '8px' }}>-</td>
                          <td style={{ padding: '8px' }}>-</td>
                          <td style={{ padding: '8px' }}>-</td>
                        </tr>
                        <tr key="4" style={{ borderBottom: '1px solid #e8e8e8' }}>
                          <td style={{ padding: '8px' }}>4</td>
                          <td style={{ padding: '8px' }}>法人授权委托书</td>
                          <td style={{ padding: '8px' }}>
                            <div style={{ padding: '10px', border: '1px solid #d9d9d9', borderRadius: '4px', width: '100px', textAlign: 'center', display: 'inline-block' }}>
                              <span style={{ color: '#ff4d4f' }}>PDF</span>
                            </div>
                          </td>
                          <td style={{ padding: '8px' }}>2024-01-01</td>
                          <td style={{ padding: '8px', color: '#ff4d4f' }}>2024-12-31</td>
                          <td style={{ padding: '8px' }}>-</td>
                        </tr>
                        <tr key="5" style={{ borderBottom: '1px solid #e8e8e8' }}>
                          <td style={{ padding: '8px' }}>5</td>
                          <td style={{ padding: '8px' }}>质量保证协议书</td>
                          <td style={{ padding: '8px' }}>
                            <div style={{ padding: '10px', border: '1px solid #d9d9d9', borderRadius: '4px', width: '100px', textAlign: 'center', display: 'inline-block' }}>
                              <span style={{ color: '#ff4d4f' }}>PDF</span>
                            </div>
                          </td>
                          <td style={{ padding: '8px' }}>2024-01-01</td>
                          <td style={{ padding: '8px', color: '#ff4d4f' }}>2024-12-31</td>
                          <td style={{ padding: '8px' }}>-</td>
                        </tr>
                        <tr key="6">
                          <td style={{ padding: '8px' }}>6</td>
                          <td style={{ padding: '8px' }}>销售合同</td>
                          <td style={{ padding: '8px' }}>
                            <div style={{ padding: '10px', border: '1px solid #d9d9d9', borderRadius: '4px', width: '100px', textAlign: 'center', display: 'inline-block' }}>
                              <span style={{ color: '#ff4d4f' }}>PDF</span>
                            </div>
                          </td>
                          <td style={{ padding: '8px' }}>2024-01-01</td>
                          <td style={{ padding: '8px', color: '#ff4d4f' }}>2024-12-31</td>
                          <td style={{ padding: '8px' }}>-</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SupplierQualificationWarning;