import { useEffect, useState } from 'react';
import {
	Alert,
	Button,
	Card,
	Checkbox,
	Col,
	Descriptions,
	Empty,
	Input,
	Modal,
	Row,
	Segmented,
	Select,
	Space,
	Table,
	Tag,
	Typography,
	message,
} from 'antd';
import {
	DownloadOutlined,
	EyeOutlined,
	ReloadOutlined,
	SearchOutlined,
	WarningOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import api, { getApiErrorMessage, getApiResponseMessage } from '../utils/api';

const { Text, Title } = Typography;

const DEFAULT_FILTERS = {
	supplier: '',
	certificateType: '',
	status: '',
	certificateNumber: '',
	manufacturer: '',
	productName: '',
	days: undefined,
};

const SUPPLIER_CERTIFICATE_OPTIONS = [
	{ label: '全部资质', value: '' },
	{ label: '营业执照', value: '营业执照' },
	{ label: '经营许可证', value: '经营许可证' },
	{ label: '产品检验报告', value: '产品检验报告' },
];

const STATUS_OPTIONS = [
	{ label: '全部状态', value: '' },
	{ label: '已过期', value: '已过期' },
	{ label: '即将过期', value: '即将过期' },
	{ label: '有效', value: '有效' },
];

const WARNING_DAY_OPTIONS = [
	{ label: '全部', value: undefined },
	{ label: '30天内', value: 30 },
	{ label: '60天内', value: 60 },
	{ label: '90天内', value: 90 },
];

const QUALIFICATION_PAGE_SIZE = 200;
const MATERIAL_PAGE_SIZE = 200;

const buildEmptyDetailState = () => ({
	open: false,
	mode: 'supplier',
	record: null,
	supplier: null,
	qualifications: [],
	materials: [],
});

const getWarningStatus = (expiryDate) => {
	const today = moment().startOf('day');
	const targetDate = moment(expiryDate).startOf('day');

	if (!targetDate.isValid()) {
		return { status: '无效日期', daysUntilExpiry: null };
	}

	const daysUntilExpiry = targetDate.diff(today, 'days');
	if (daysUntilExpiry < 0) {
		return { status: '已过期', daysUntilExpiry };
	}
	if (daysUntilExpiry <= 90) {
		return { status: '即将过期', daysUntilExpiry };
	}
	return { status: '有效', daysUntilExpiry };
};

const renderStatusTag = (status) => {
	const colorMap = {
		已过期: 'error',
		即将过期: 'warning',
		有效: 'success',
		无效日期: 'default',
	};

	return <Tag color={colorMap[status] || 'default'}>{status || '--'}</Tag>;
};

const renderRemainingDays = (daysUntilExpiry) => {
	if (typeof daysUntilExpiry !== 'number') {
		return <Text type="secondary">--</Text>;
	}
	if (daysUntilExpiry < 0) {
		return <Text type="danger">已过期 {Math.abs(daysUntilExpiry)} 天</Text>;
	}
	if (daysUntilExpiry <= 30) {
		return <Text type="danger">剩余 {daysUntilExpiry} 天</Text>;
	}
	if (daysUntilExpiry <= 90) {
		return <Text style={{ color: '#d46b08' }}>剩余 {daysUntilExpiry} 天</Text>;
	}
	return <Text type="success">剩余 {daysUntilExpiry} 天</Text>;
};

const containsKeyword = (value, keyword) => {
	if (!keyword) {
		return true;
	}
	return String(value || '').toLowerCase().includes(keyword.trim().toLowerCase());
};

const fetchAllPages = async (requester, pageSize) => {
	let pageNum = 1;
	let total = 0;
	let records = [];

	do {
		const response = await requester(pageNum, pageSize);
		if (response.code !== 1 || !response.data) {
			throw new Error(getApiResponseMessage(response, '加载数据失败'));
		}

		const currentRecords = Array.isArray(response.data.records) ? response.data.records : [];
		total = typeof response.data.total === 'number' ? response.data.total : currentRecords.length;
		records = [...records, ...currentRecords];
		pageNum += 1;
	} while (records.length < total);

	return records;
};

const SupplierQualificationWarning = () => {
	const [loading, setLoading] = useState(false);
	const [detailLoading, setDetailLoading] = useState(false);
	const [mainTab, setMainTab] = useState('supplier');
	const [statistics, setStatistics] = useState({ supplierCount: 0, manufacturerCount: 0, productCount: 0 });
	const [tabTotals, setTabTotals] = useState({ supplier: 0, manufacturer: 0, product: 0 });
	const [filters, setFilters] = useState(DEFAULT_FILTERS);
	const [submittedFilters, setSubmittedFilters] = useState(DEFAULT_FILTERS);
	const [onlyUnexpired, setOnlyUnexpired] = useState(true);
	const [selectedWarningKeys, setSelectedWarningKeys] = useState([]);
	const [allRows, setAllRows] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [detailState, setDetailState] = useState(buildEmptyDetailState());

	const normalizeQualification = (item) => {
		const { status, daysUntilExpiry } = getWarningStatus(item.expiryDate);
		return {
			key: item.id,
			id: item.id,
			supplierId: item.supplierId,
			supplierName: item.supplierName,
			certificateType: item.licenseType || item.type,
			certificateTypeCode: item.type,
			certificateName: item.certificateName,
			certificateNumber: item.licenseNumber,
			issueDate: item.issueDate,
			expiryDate: item.expiryDate,
			issuingAuthority: item.issuingAuthority,
			creditCode: item.creditCode,
			legalRepresentative: item.legalRepresentative,
			address: item.address,
			attachmentName: item.attachmentName,
			licenseFile: item.licenseFile,
			status,
			daysUntilExpiry,
		};
	};

	const fetchStatistics = async () => {
		try {
			const response = await api.get('/api/scm/suppliers/warning-statistics');
			if (response.code === 1 && response.data) {
				setStatistics(response.data);
				setTabTotals({
					supplier: response.data.supplierCount || 0,
					manufacturer: response.data.manufacturerCount || 0,
					product: response.data.productCount || 0,
				});
			}
		} catch (error) {
			message.warning(getApiErrorMessage(error, '预警统计加载失败，已使用当前查询结果'));
		}
	};

	const applyQualificationFilters = (rows, activeFilters) => rows.filter((row) => {
		if (mainTab === 'supplier' && activeFilters.certificateType && row.certificateType !== activeFilters.certificateType) {
			return false;
		}

		if (mainTab === 'product' && !containsKeyword(row.supplierName, activeFilters.supplier)) {
			return false;
		}

		if (activeFilters.status && row.status !== activeFilters.status) {
			return false;
		}

		if (onlyUnexpired && row.status === '已过期') {
			return false;
		}

		if (activeFilters.days !== undefined) {
			if (typeof row.daysUntilExpiry !== 'number' || row.daysUntilExpiry < 0 || row.daysUntilExpiry > activeFilters.days) {
				return false;
			}
		}

		return true;
	});

	const loadSupplierRows = async (activeFilters) => {
		const records = await fetchAllPages(
			(pageNum, innerPageSize) => api.get('/api/scm/suppliers/qualifications', {
				pageNum,
				pageSize: innerPageSize,
				certificateName: activeFilters.supplier,
				licenseNumber: activeFilters.certificateNumber,
			}),
			QUALIFICATION_PAGE_SIZE,
		);

		const rows = records
			.filter((item) => item.type !== 'REGISTRATION_CERTIFICATE')
			.map(normalizeQualification);

		return applyQualificationFilters(rows, activeFilters);
	};

	const loadProductRows = async (activeFilters) => {
		const records = await fetchAllPages(
			(pageNum, innerPageSize) => api.get('/api/scm/suppliers/qualifications', {
				pageNum,
				pageSize: innerPageSize,
				type: 'REGISTRATION_CERTIFICATE',
				certificateName: activeFilters.productName,
				licenseNumber: activeFilters.certificateNumber,
			}),
			QUALIFICATION_PAGE_SIZE,
		);

		const rows = records.map(normalizeQualification).map((item) => ({
			...item,
			productName: item.certificateName,
			productType: item.certificateType,
		}));

		return applyQualificationFilters(rows, activeFilters);
	};

	const loadManufacturerRows = async (activeFilters) => {
		const records = await fetchAllPages(
			(pageNum, innerPageSize) => api.get('/api/scm/materials', {
				pageNum,
				pageSize: innerPageSize,
				manufacturer: activeFilters.manufacturer,
				supplier: activeFilters.supplier,
				name: activeFilters.productName,
			}),
			MATERIAL_PAGE_SIZE,
		);

		const grouped = new Map();

		records.forEach((item) => {
			const groupKey = `${item.manufacturer || '未维护厂商'}__${item.supplierName || '未关联供应商'}`;
			if (!grouped.has(groupKey)) {
				grouped.set(groupKey, {
					key: groupKey,
					manufacturer: item.manufacturer || '未维护厂商',
					supplierNames: [item.supplierName].filter(Boolean),
					materialCount: 0,
					registrationNumbers: [],
					materialNames: [],
					materials: [],
				});
			}

			const currentGroup = grouped.get(groupKey);
			currentGroup.materialCount += 1;
			currentGroup.materials.push(item);
			if (item.supplierName && !currentGroup.supplierNames.includes(item.supplierName)) {
				currentGroup.supplierNames.push(item.supplierName);
			}
			if (item.registrationNumber && !currentGroup.registrationNumbers.includes(item.registrationNumber)) {
				currentGroup.registrationNumbers.push(item.registrationNumber);
			}
			if (item.name && !currentGroup.materialNames.includes(item.name)) {
				currentGroup.materialNames.push(item.name);
			}
		});

		return Array.from(grouped.values()).sort((left, right) => left.manufacturer.localeCompare(right.manufacturer));
	};

	const loadData = async () => {
		setLoading(true);
		try {
			let rows = [];
			if (mainTab === 'supplier') {
				rows = await loadSupplierRows(submittedFilters);
			} else if (mainTab === 'product') {
				rows = await loadProductRows(submittedFilters);
			} else {
				rows = await loadManufacturerRows(submittedFilters);
			}

			setAllRows(rows);
			setTabTotals((previous) => ({ ...previous, [mainTab]: rows.length }));
			setSelectedWarningKeys([]);
		} catch (error) {
			setAllRows([]);
			message.error(getApiErrorMessage(error, '加载资质预警数据失败'));
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchStatistics();
	}, []);

	useEffect(() => {
		setCurrentPage(1);
	}, [mainTab, submittedFilters, onlyUnexpired]);

	useEffect(() => {
		loadData();
	}, [mainTab, submittedFilters, onlyUnexpired]);

	const handleFilterChange = (field, value) => {
		setFilters((previous) => ({
			...previous,
			[field]: value,
		}));
	};

	const handleSearch = () => {
		setSubmittedFilters({ ...filters });
	};

	const handleReset = () => {
		setFilters(DEFAULT_FILTERS);
		setSubmittedFilters(DEFAULT_FILTERS);
		setOnlyUnexpired(true);
	};

	const handleOpenDetail = async (mode, record) => {
		setDetailState({
			open: true,
			mode,
			record,
			supplier: null,
			qualifications: [],
			materials: mode === 'manufacturer' ? record.materials || [] : [],
		});

		if (mode === 'manufacturer') {
			return;
		}

		setDetailLoading(true);
		try {
			const [supplierResponse, qualificationResponse] = await Promise.all([
				api.get(`/api/scm/suppliers/${record.supplierId}`),
				api.get(`/api/scm/suppliers/${record.supplierId}/qualifications`),
			]);

			if (supplierResponse.code !== 1 || !supplierResponse.data) {
				throw new Error(getApiResponseMessage(supplierResponse, '加载供应商详情失败'));
			}
			if (qualificationResponse.code !== 1 || !Array.isArray(qualificationResponse.data)) {
				throw new Error(getApiResponseMessage(qualificationResponse, '加载供应商资质失败'));
			}

			setDetailState((previous) => ({
				...previous,
				supplier: supplierResponse.data,
				qualifications: qualificationResponse.data.map(normalizeQualification),
			}));
		} catch (error) {
			message.error(getApiErrorMessage(error, '查看详情失败'));
		} finally {
			setDetailLoading(false);
		}
	};

	const closeDetail = () => {
		setDetailState(buildEmptyDetailState());
	};

	const handleExportSelectedWarnings = async () => {
		if (mainTab === 'manufacturer') {
			message.warning('厂商页为物资聚合视图，当前后台未提供资质预警导出接口');
			return;
		}

		if (!selectedWarningKeys.length) {
			message.warning('请先勾选要导出的资质预警记录');
			return;
		}

		try {
			setLoading(true);
			const response = await fetch(`${import.meta.env.VITE_REACT_APP_API_URL || ''}/api/scm/suppliers/qualifications/warnings/export`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					token: localStorage.getItem('token') || '',
				},
				body: JSON.stringify({ ids: selectedWarningKeys }),
				credentials: 'include',
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				throw new Error(getApiResponseMessage(errorData, '导出失败'));
			}

			const contentDisposition = response.headers.get('content-disposition');
			let filename = '资质预警.xlsx';
			if (contentDisposition) {
				const utf8FileNameMatch = /filename\*=UTF-8''([^;]+)/i.exec(contentDisposition);
				const normalFileNameMatch = /filename="?([^";]+)"?/i.exec(contentDisposition);
				if (utf8FileNameMatch && utf8FileNameMatch[1]) {
					filename = decodeURIComponent(utf8FileNameMatch[1]);
				} else if (normalFileNameMatch && normalFileNameMatch[1]) {
					filename = decodeURIComponent(normalFileNameMatch[1]);
				}
			}

			const blob = await response.blob();
			const downloadUrl = URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = downloadUrl;
			link.download = filename;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(downloadUrl);

			message.success(`导出成功，共 ${selectedWarningKeys.length} 条`);
		} catch (error) {
			message.error(getApiErrorMessage(error, '导出失败，请稍后重试'));
		} finally {
			setLoading(false);
		}
	};

	const supplierColumns = [
		{ title: '供应商名称', dataIndex: 'supplierName', key: 'supplierName', width: 180 },
		{ title: '资质名称', dataIndex: 'certificateName', key: 'certificateName', width: 180, render: (value) => value || '--' },
		{ title: '资质类型', dataIndex: 'certificateType', key: 'certificateType', width: 140 },
		{ title: '资质编号', dataIndex: 'certificateNumber', key: 'certificateNumber', width: 180 },
		{ title: '有效期至', dataIndex: 'expiryDate', key: 'expiryDate', width: 120, render: (value) => value || '--' },
		{ title: '剩余天数', dataIndex: 'daysUntilExpiry', key: 'daysUntilExpiry', width: 140, render: renderRemainingDays },
		{ title: '预警状态', dataIndex: 'status', key: 'status', width: 120, render: renderStatusTag },
		{
			title: '操作',
			key: 'action',
			width: 100,
			fixed: 'right',
			render: (_, record) => (
				<Button type="link" icon={<EyeOutlined />} onClick={() => handleOpenDetail('supplier', record)}>
					查看
				</Button>
			),
		},
	];

	const productColumns = [
		{ title: '产品名称', dataIndex: 'productName', key: 'productName', width: 200 },
		{ title: '产品类别', dataIndex: 'productType', key: 'productType', width: 140, render: (value) => value || '--' },
		{ title: '注册证号', dataIndex: 'certificateNumber', key: 'certificateNumber', width: 180 },
		{ title: '供应商', dataIndex: 'supplierName', key: 'supplierName', width: 180 },
		{ title: '有效期至', dataIndex: 'expiryDate', key: 'expiryDate', width: 120, render: (value) => value || '--' },
		{ title: '剩余天数', dataIndex: 'daysUntilExpiry', key: 'daysUntilExpiry', width: 140, render: renderRemainingDays },
		{ title: '预警状态', dataIndex: 'status', key: 'status', width: 120, render: renderStatusTag },
		{
			title: '操作',
			key: 'action',
			width: 100,
			fixed: 'right',
			render: (_, record) => (
				<Button type="link" icon={<EyeOutlined />} onClick={() => handleOpenDetail('product', record)}>
					查看
				</Button>
			),
		},
	];

	const manufacturerColumns = [
		{ title: '生产厂家', dataIndex: 'manufacturer', key: 'manufacturer', width: 220 },
		{ title: '关联供应商', dataIndex: 'supplierNames', key: 'supplierNames', width: 260, render: (value) => value?.length ? value.join('、') : '--' },
		{ title: '关联物资数', dataIndex: 'materialCount', key: 'materialCount', width: 120, render: (value) => <Text strong>{value}</Text> },
		{ title: '注册证号', dataIndex: 'registrationNumbers', key: 'registrationNumbers', width: 260, render: (value) => value?.length ? value.slice(0, 3).join('、') : '--' },
		{ title: '物资示例', dataIndex: 'materialNames', key: 'materialNames', width: 260, render: (value) => value?.length ? value.slice(0, 3).join('、') : '--' },
		{
			title: '操作',
			key: 'action',
			width: 100,
			fixed: 'right',
			render: (_, record) => (
				<Button type="link" icon={<EyeOutlined />} onClick={() => handleOpenDetail('manufacturer', record)}>
					查看
				</Button>
			),
		},
	];

	const currentColumns = mainTab === 'supplier' ? supplierColumns : mainTab === 'product' ? productColumns : manufacturerColumns;
	const currentTotal = allRows.length;
	const pagedRows = allRows.slice((currentPage - 1) * pageSize, currentPage * pageSize);
	const countMap = {
		supplier: mainTab === 'supplier' ? currentTotal : tabTotals.supplier,
		manufacturer: mainTab === 'manufacturer' ? currentTotal : tabTotals.manufacturer,
		product: mainTab === 'product' ? currentTotal : tabTotals.product,
	};

	const renderSearchArea = () => {
		if (mainTab === 'supplier') {
			return (
				<Space wrap size={12}>
					<Input placeholder="供应商名称" value={filters.supplier} onChange={(event) => handleFilterChange('supplier', event.target.value)} style={{ width: 220 }} />
					<Select options={SUPPLIER_CERTIFICATE_OPTIONS} value={filters.certificateType} onChange={(value) => handleFilterChange('certificateType', value)} style={{ width: 180 }} />
					<Select options={STATUS_OPTIONS} value={filters.status} onChange={(value) => handleFilterChange('status', value)} style={{ width: 150 }} />
					<Input placeholder="资质编号" value={filters.certificateNumber} onChange={(event) => handleFilterChange('certificateNumber', event.target.value)} style={{ width: 180 }} />
					<Select options={WARNING_DAY_OPTIONS} value={filters.days} onChange={(value) => handleFilterChange('days', value)} placeholder="到期天数" style={{ width: 140 }} />
				</Space>
			);
		}

		if (mainTab === 'product') {
			return (
				<Space wrap size={12}>
					<Input placeholder="产品名称" value={filters.productName} onChange={(event) => handleFilterChange('productName', event.target.value)} style={{ width: 220 }} />
					<Input placeholder="供应商名称" value={filters.supplier} onChange={(event) => handleFilterChange('supplier', event.target.value)} style={{ width: 220 }} />
					<Select options={STATUS_OPTIONS} value={filters.status} onChange={(value) => handleFilterChange('status', value)} style={{ width: 150 }} />
					<Input placeholder="注册证号" value={filters.certificateNumber} onChange={(event) => handleFilterChange('certificateNumber', event.target.value)} style={{ width: 180 }} />
					<Select options={WARNING_DAY_OPTIONS} value={filters.days} onChange={(value) => handleFilterChange('days', value)} placeholder="到期天数" style={{ width: 140 }} />
				</Space>
			);
		}

		return (
			<Space wrap size={12}>
				<Input placeholder="生产厂家" value={filters.manufacturer} onChange={(event) => handleFilterChange('manufacturer', event.target.value)} style={{ width: 220 }} />
				<Input placeholder="供应商名称" value={filters.supplier} onChange={(event) => handleFilterChange('supplier', event.target.value)} style={{ width: 220 }} />
				<Input placeholder="物资名称" value={filters.productName} onChange={(event) => handleFilterChange('productName', event.target.value)} style={{ width: 220 }} />
			</Space>
		);
	};

	return (
		<div style={{ padding: '0 16px 24px' }}>
			<Space direction="vertical" size={16} style={{ width: '100%' }}>
				<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
					<div>
						<Title level={3} style={{ marginBottom: 8 }}>资质预警</Title>
						<Text type="secondary">供应商与产品页已改为真实资质数据，厂商页按物资字典真实聚合，不再展示伪造详情。</Text>
					</div>
					<Space wrap>
						<Button icon={<ReloadOutlined />} onClick={loadData}>刷新</Button>
						<Button type="primary" icon={<DownloadOutlined />} onClick={handleExportSelectedWarnings} disabled={mainTab === 'manufacturer'}>
							批量导出
						</Button>
					</Space>
				</div>

				<Row gutter={[16, 16]}>
					<Col xs={24} md={8}>
						<Card size="small">
							<Text type="secondary">供应商预警</Text>
							<div style={{ marginTop: 8, fontSize: 28, fontWeight: 700 }}>{countMap.supplier ?? statistics.supplierCount}</div>
						</Card>
					</Col>
					<Col xs={24} md={8}>
						<Card size="small">
							<Text type="secondary">厂商聚合</Text>
							<div style={{ marginTop: 8, fontSize: 28, fontWeight: 700 }}>{countMap.manufacturer ?? statistics.manufacturerCount}</div>
						</Card>
					</Col>
					<Col xs={24} md={8}>
						<Card size="small">
							<Text type="secondary">产品预警</Text>
							<div style={{ marginTop: 8, fontSize: 28, fontWeight: 700 }}>{countMap.product ?? statistics.productCount}</div>
						</Card>
					</Col>
				</Row>

				<Card>
					<Space direction="vertical" size={16} style={{ width: '100%' }}>
						<div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
							<Segmented
								value={mainTab}
								onChange={(value) => setMainTab(value)}
								options={[
									{ label: `供应商 (${countMap.supplier || 0})`, value: 'supplier' },
									{ label: `厂商 (${countMap.manufacturer || 0})`, value: 'manufacturer' },
									{ label: `产品 (${countMap.product || 0})`, value: 'product' },
								]}
							/>
							<Space wrap>
								{mainTab !== 'manufacturer' && (
									<Checkbox checked={onlyUnexpired} onChange={(event) => setOnlyUnexpired(event.target.checked)}>
										仅查看未过期
									</Checkbox>
								)}
								{mainTab !== 'manufacturer' && <Text>已选择 {selectedWarningKeys.length} 项</Text>}
								{mainTab !== 'manufacturer' && selectedWarningKeys.length > 0 && (
									<Button type="link" onClick={() => setSelectedWarningKeys([])}>清空</Button>
								)}
							</Space>
						</div>

						{renderSearchArea()}

						<Space wrap>
							<Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>查询</Button>
							<Button icon={<ReloadOutlined />} onClick={handleReset}>重置</Button>
						</Space>

						{mainTab === 'manufacturer' && (
							<Alert
								type="warning"
								showIcon
								icon={<WarningOutlined />}
								message="当前后台未提供厂商资质/效期专用接口"
								description="该视图按照物资字典接口聚合展示真实厂商、供应商和注册证信息，因此这里不再显示伪造的过期数量，也不提供资质导出。"
							/>
						)}
					</Space>
				</Card>

				<Card bodyStyle={{ padding: 0 }}>
					<Table
						columns={currentColumns}
						dataSource={pagedRows}
						rowKey="key"
						loading={loading}
						locale={{ emptyText: <Empty description="暂无数据" /> }}
						pagination={{
							total: currentTotal,
							current: currentPage,
							pageSize,
							showSizeChanger: true,
							showQuickJumper: true,
							showTotal: (value) => `共 ${value} 条记录`,
							onChange: (page, size) => {
								setCurrentPage(page);
								setPageSize(size);
							},
						}}
						rowSelection={mainTab === 'manufacturer' ? undefined : {
							selectedRowKeys: selectedWarningKeys,
							onChange: (keys) => setSelectedWarningKeys(keys),
						}}
						scroll={{ x: 1180 }}
					/>
				</Card>
			</Space>

			<Modal
				title={detailState.mode === 'manufacturer' ? '厂商关联物资明细' : '资质详情'}
				open={detailState.open}
				onCancel={closeDetail}
				footer={[<Button key="close" onClick={closeDetail}>关闭</Button>]}
				width={detailState.mode === 'manufacturer' ? 960 : 880}
			>
				{detailState.mode === 'manufacturer' ? (
					<Space direction="vertical" size={16} style={{ width: '100%' }}>
						<Descriptions bordered size="small" column={1}>
							<Descriptions.Item label="生产厂家">{detailState.record?.manufacturer || '--'}</Descriptions.Item>
							<Descriptions.Item label="关联供应商">{detailState.record?.supplierNames?.join('、') || '--'}</Descriptions.Item>
							<Descriptions.Item label="关联物资数">{detailState.record?.materialCount || 0}</Descriptions.Item>
						</Descriptions>
						<Table
							rowKey="id"
							size="small"
							pagination={false}
							dataSource={detailState.materials}
							columns={[
								{ title: '物资名称', dataIndex: 'name', key: 'name', width: 180 },
								{ title: '规格', dataIndex: 'specification', key: 'specification', width: 140, render: (value) => value || '--' },
								{ title: '型号', dataIndex: 'model', key: 'model', width: 140, render: (value) => value || '--' },
								{ title: '供应商', dataIndex: 'supplierName', key: 'supplierName', width: 180 },
								{ title: '注册证号', dataIndex: 'registrationNumber', key: 'registrationNumber', width: 180, render: (value) => value || '--' },
								{ title: '存储条件', dataIndex: 'storageCondition', key: 'storageCondition', width: 120, render: (value) => value || '--' },
							]}
							scroll={{ x: 920 }}
						/>
					</Space>
				) : (
					<Space direction="vertical" size={16} style={{ width: '100%' }}>
						<Descriptions bordered size="small" column={2}>
							<Descriptions.Item label={detailState.mode === 'product' ? '产品名称' : '资质名称'}>{detailState.record?.certificateName || '--'}</Descriptions.Item>
							<Descriptions.Item label="供应商">{detailState.record?.supplierName || '--'}</Descriptions.Item>
							<Descriptions.Item label="资质类型">{detailState.record?.certificateType || '--'}</Descriptions.Item>
							<Descriptions.Item label="资质编号">{detailState.record?.certificateNumber || '--'}</Descriptions.Item>
							<Descriptions.Item label="发证日期">{detailState.record?.issueDate || '--'}</Descriptions.Item>
							<Descriptions.Item label="有效期至">{detailState.record?.expiryDate || '--'}</Descriptions.Item>
							<Descriptions.Item label="预警状态">{renderStatusTag(detailState.record?.status)}</Descriptions.Item>
							<Descriptions.Item label="剩余天数">{renderRemainingDays(detailState.record?.daysUntilExpiry)}</Descriptions.Item>
							<Descriptions.Item label="发证机构">{detailState.record?.issuingAuthority || '--'}</Descriptions.Item>
							<Descriptions.Item label="附件名称">{detailState.record?.attachmentName || '--'}</Descriptions.Item>
						</Descriptions>

						<Card size="small" title="供应商基础信息" loading={detailLoading}>
							<Descriptions bordered size="small" column={2}>
								<Descriptions.Item label="供应商名称">{detailState.supplier?.name || '--'}</Descriptions.Item>
								<Descriptions.Item label="企业类型">{detailState.supplier?.enterpriseType || '--'}</Descriptions.Item>
								<Descriptions.Item label="统一社会信用代码">{detailState.supplier?.creditCode || '--'}</Descriptions.Item>
								<Descriptions.Item label="法定代表人">{detailState.supplier?.legalRepresentative || '--'}</Descriptions.Item>
								<Descriptions.Item label="联系电话">{detailState.supplier?.contactPhone || '--'}</Descriptions.Item>
								<Descriptions.Item label="地址">{detailState.supplier?.address || '--'}</Descriptions.Item>
							</Descriptions>
						</Card>

						<Card size="small" title="该供应商全部资质" loading={detailLoading}>
							<Table
								rowKey="key"
								size="small"
								pagination={false}
								dataSource={detailState.qualifications}
								columns={[
									{ title: '资质名称', dataIndex: 'certificateName', key: 'certificateName', width: 180, render: (value) => value || '--' },
									{ title: '资质类型', dataIndex: 'certificateType', key: 'certificateType', width: 140 },
									{ title: '资质编号', dataIndex: 'certificateNumber', key: 'certificateNumber', width: 180 },
									{ title: '有效期至', dataIndex: 'expiryDate', key: 'expiryDate', width: 120, render: (value) => value || '--' },
									{ title: '预警状态', dataIndex: 'status', key: 'status', width: 120, render: renderStatusTag },
								]}
								scroll={{ x: 760 }}
							/>
						</Card>
					</Space>
				)}
			</Modal>
		</div>
	);
};

export default SupplierQualificationWarning;
