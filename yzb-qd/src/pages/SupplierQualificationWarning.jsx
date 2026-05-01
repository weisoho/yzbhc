import { useEffect, useMemo, useState } from 'react';
import { Button, Card, Empty, Input, Segmented, Select, Space, Table, Tag, Typography, message } from 'antd';
import { DownloadOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import moment from 'moment';
import api, { getApiErrorMessage, getApiResponseMessage } from '../utils/api.js';

const { Title, Text } = Typography;

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

const TAB_DEFINITIONS = {
	registration: {
		label: '注册证',
		type: 'REGISTRATION_CERTIFICATE',
		certificateLabel: '注册证号',
	},
	businessLicense: {
		label: '经营许可证',
		type: 'BUSINESS_LICENSE',
		certificateLabel: '许可证号',
	},
	businessCertificate: {
		label: '营业执照',
		type: 'BUSINESS_CERTIFICATE',
		certificateLabel: '营业执照号',
	},
};

const DEFAULT_FILTERS = {
	supplierName: '',
	certificateName: '',
	certificateNumber: '',
	status: '',
	days: undefined,
};

const mapWarningStatus = (status) => {
	if (status === '已过期') return 'EXPIRED';
	if (status === '即将过期') return 'EXPIRING_SOON';
	if (status === '有效') return 'VALID';
	return undefined;
};

const getWarningStatus = (expiryDate) => {
	const today = moment().startOf('day');
	const targetDate = moment(expiryDate).startOf('day');
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
	return <Text style={{ color: '#d46b08' }}>剩余 {daysUntilExpiry} 天</Text>;
};

const getRecordList = (pageData) => {
	if (Array.isArray(pageData?.records)) {
		return pageData.records;
	}
	if (Array.isArray(pageData?.list)) {
		return pageData.list;
	}
	return [];
};

const SupplierQualificationWarning = () => {
	const [mainTab, setMainTab] = useState('registration');
	const [loading, setLoading] = useState(false);
	const [rows, setRows] = useState([]);
	const [selectedWarningKeys, setSelectedWarningKeys] = useState([]);
	const [filters, setFilters] = useState(DEFAULT_FILTERS);
	const [submittedFilters, setSubmittedFilters] = useState(DEFAULT_FILTERS);
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);

	const currentTabConfig = TAB_DEFINITIONS[mainTab];

	const loadData = async () => {
		setLoading(true);
		try {
			const response = await api.get('/api/scm/suppliers/qualifications/warnings', {
				pageNum: 1,
				pageSize: 500,
				type: currentTabConfig.type,
				certificateName: submittedFilters.certificateName || submittedFilters.supplierName,
				licenseNumber: submittedFilters.certificateNumber,
				warningStatus: mapWarningStatus(submittedFilters.status),
				warningDays: submittedFilters.days,
			});

			if (response.code !== 1 || !response.data) {
				throw new Error(getApiResponseMessage(response, '加载资质预警失败'));
			}

			const mappedRows = getRecordList(response.data)
				.map((item) => {
					const { status, daysUntilExpiry } = getWarningStatus(item.expiryDate);
					return {
						key: String(item.id),
						id: item.id,
						supplierName: item.supplierName || '--',
						certificateName: item.certificateName || '--',
						certificateNumber: item.licenseNumber || '--',
						certificateType: item.licenseType || item.type || '--',
						issueDate: item.issueDate || '--',
						expiryDate: item.expiryDate || '--',
						issuingAuthority: item.issuingAuthority || '--',
						status,
						daysUntilExpiry,
					};
				})
				.filter((item) => {
					if (submittedFilters.supplierName && !String(item.supplierName).includes(submittedFilters.supplierName)) {
						return false;
					}
					if (submittedFilters.status && item.status !== submittedFilters.status) {
						return false;
					}
					return true;
				})
				.sort((left, right) => (left.daysUntilExpiry ?? 0) - (right.daysUntilExpiry ?? 0));

			setRows(mappedRows);
			setSelectedWarningKeys([]);
		} catch (error) {
			setRows([]);
			message.error(getApiErrorMessage(error, '加载资质预警数据失败'));
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		setCurrentPage(1);
	}, [mainTab, submittedFilters]);

	useEffect(() => {
		loadData();
	}, [mainTab, submittedFilters]);

	const handleSearch = () => {
		setSubmittedFilters({ ...filters });
	};

	const handleReset = () => {
		setFilters(DEFAULT_FILTERS);
		setSubmittedFilters(DEFAULT_FILTERS);
	};

	const handleExportSelectedWarnings = async () => {
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

			const blob = await response.blob();
			const downloadUrl = URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = downloadUrl;
			link.download = `${currentTabConfig.label}_预警.xlsx`;
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

	const columns = useMemo(() => [
		{ title: '供应商名称', dataIndex: 'supplierName', key: 'supplierName', width: 180 },
		{ title: '资质名称', dataIndex: 'certificateName', key: 'certificateName', width: 180 },
		{ title: currentTabConfig.certificateLabel, dataIndex: 'certificateNumber', key: 'certificateNumber', width: 180 },
		{ title: '资质类型', dataIndex: 'certificateType', key: 'certificateType', width: 140 },
		{ title: '发证机构', dataIndex: 'issuingAuthority', key: 'issuingAuthority', width: 160 },
		{ title: '发证日期', dataIndex: 'issueDate', key: 'issueDate', width: 120 },
		{ title: '有效期至', dataIndex: 'expiryDate', key: 'expiryDate', width: 120 },
		{ title: '剩余天数', dataIndex: 'daysUntilExpiry', key: 'daysUntilExpiry', width: 140, render: renderRemainingDays },
		{ title: '预警状态', dataIndex: 'status', key: 'status', width: 120, render: renderStatusTag },
	], [currentTabConfig.certificateLabel]);

	const pagedRows = rows.slice((currentPage - 1) * pageSize, currentPage * pageSize);

	return (
		<div style={{ padding: '0 16px 24px' }}>
			<Space direction="vertical" size={16} style={{ width: '100%' }}>
				<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
					<Title level={3} style={{ marginBottom: 0 }}>资质预警</Title>
					<Space>
						<Button icon={<ReloadOutlined />} onClick={loadData}>刷新</Button>
						<Button type="primary" icon={<DownloadOutlined />} onClick={handleExportSelectedWarnings}>批量导出</Button>
					</Space>
				</div>

				<Card>
					<Space direction="vertical" size={16} style={{ width: '100%' }}>
						<Segmented
							value={mainTab}
							onChange={(value) => setMainTab(value)}
							options={Object.entries(TAB_DEFINITIONS).map(([value, config]) => ({
								label: `${config.label} (${value === mainTab ? rows.length : 0})`,
								value,
							}))}
						/>

						<Space wrap size={12}>
							<Input
								placeholder="供应商名称"
								value={filters.supplierName}
								onChange={(event) => setFilters((prev) => ({ ...prev, supplierName: event.target.value }))}
								style={{ width: 220 }}
							/>
							<Input
								placeholder="资质名称"
								value={filters.certificateName}
								onChange={(event) => setFilters((prev) => ({ ...prev, certificateName: event.target.value }))}
								style={{ width: 220 }}
							/>
							<Input
								placeholder={currentTabConfig.certificateLabel}
								value={filters.certificateNumber}
								onChange={(event) => setFilters((prev) => ({ ...prev, certificateNumber: event.target.value }))}
								style={{ width: 200 }}
							/>
							<Select
								options={STATUS_OPTIONS}
								value={filters.status}
								onChange={(value) => setFilters((prev) => ({ ...prev, status: value }))}
								style={{ width: 150 }}
							/>
							<Select
								options={WARNING_DAY_OPTIONS}
								value={filters.days}
								onChange={(value) => setFilters((prev) => ({ ...prev, days: value }))}
								placeholder="到期天数"
								style={{ width: 140 }}
							/>
						</Space>

						<Space>
							<Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>查询</Button>
							<Button icon={<ReloadOutlined />} onClick={handleReset}>重置</Button>
							<Text>已选择 {selectedWarningKeys.length} 项</Text>
						</Space>
					</Space>
				</Card>

				<Card bodyStyle={{ padding: 0 }}>
					<Table
						columns={columns}
						dataSource={pagedRows}
						rowKey="key"
						loading={loading}
						locale={{ emptyText: <Empty description="暂无数据" /> }}
						rowSelection={{
							selectedRowKeys: selectedWarningKeys,
							onChange: (keys) => setSelectedWarningKeys(keys),
						}}
						pagination={{
							total: rows.length,
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
						scroll={{ x: 1320 }}
					/>
				</Card>
			</Space>
		</div>
	);
};

export default SupplierQualificationWarning;
