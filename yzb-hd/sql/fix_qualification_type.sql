-- 修复 Bug#2: 将原本错误存储为 INSPECTION_REPORT 的注册证数据修正为 REGISTRATION_CERTIFICATE
-- 1. 先将type从INSPECTION_REPORT更新为REGISTRATION_CERTIFICATE (已执行)
-- UPDATE supplier_qualification SET type='REGISTRATION_CERTIFICATE', license_type='注册证' WHERE type='INSPECTION_REPORT';
-- 2. 修复 license_type 字段中文值 (已执行)
UPDATE supplier_qualification SET license_type='注册证' WHERE type='REGISTRATION_CERTIFICATE';
