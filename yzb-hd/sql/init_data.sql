
-- 插入供应商示例数据
INSERT INTO `supplier` (`id`, `name`, `contact_person`, `contact_phone`, `address`, `registration_number`, `enterprise_type`, `status`, `create_time`, `update_time`) VALUES
(1, '上海医疗器械有限公司', '张经理', '13800138000', '上海市浦东新区张江高科园区', 'SH20230001', '生产企业', '1', NOW(), NOW()),
(2, '北京康健医药有限公司', '李经理', '13900139000', '北京市朝阳区CBD', 'BJ20230002', '经营企业', '1', NOW(), NOW());

-- 插入供应商资质示例数据
INSERT INTO `supplier_qualification` (`id`, `supplier_id`, `type`, `license_number`, `license_type`, `issue_date`, `expiry_date`, `issuing_authority`, `license_file`, `status`, `create_time`, `update_time`) VALUES
(1, 1, 'BUSINESS_LICENSE', '91310000XXXXXXXXXX', '营业执照', '2020-01-01', '2030-01-01', '上海市市场监督管理局', NULL, '1', NOW(), NOW()),
(2, 1, 'BUSINESS_CERTIFICATE', '沪食药监械生产许20200001号', '医疗器械生产许可证', '2020-06-01', '2025-06-01', '上海市药品监督管理局', NULL, '1', NOW(), NOW()),
(3, 2, 'INSPECTION_REPORT', 'JC20230001', '产品检验报告', '2023-01-15', '2024-01-15', '北京市医疗器械检验所', NULL, '1', NOW(), NOW());
