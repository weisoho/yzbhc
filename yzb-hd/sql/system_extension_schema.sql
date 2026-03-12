SET NAMES utf8mb4;

SET @sql = IF (
    EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'sys_department' AND column_name = 'org_type'),
    'SELECT 1',
    'ALTER TABLE sys_department ADD COLUMN org_type varchar(20) NOT NULL DEFAULT ''DEPARTMENT'' COMMENT ''组织类型：CAMPUS/DEPARTMENT'' AFTER dept_name'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = IF (
    EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'sys_department' AND column_name = 'address'),
    'SELECT 1',
    'ALTER TABLE sys_department ADD COLUMN address varchar(255) DEFAULT NULL COMMENT ''地址'' AFTER dept_code'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = IF (
    EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'sys_department' AND column_name = 'remark'),
    'SELECT 1',
    'ALTER TABLE sys_department ADD COLUMN remark varchar(500) DEFAULT NULL COMMENT ''备注'' AFTER email'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = IF (
    EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'ys_user' AND column_name = 'real_name'),
    'SELECT 1',
    'ALTER TABLE ys_user ADD COLUMN real_name varchar(50) DEFAULT NULL COMMENT ''姓名'' AFTER password'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = IF (
    EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'ys_user' AND column_name = 'phone'),
    'SELECT 1',
    'ALTER TABLE ys_user ADD COLUMN phone varchar(20) DEFAULT NULL COMMENT ''联系电话'' AFTER dep_id'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = IF (
    EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'ys_user' AND column_name = 'email'),
    'SELECT 1',
    'ALTER TABLE ys_user ADD COLUMN email varchar(50) DEFAULT NULL COMMENT ''邮箱'' AFTER phone'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = IF (
    EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'ys_user' AND column_name = 'account_type'),
    'SELECT 1',
    'ALTER TABLE ys_user ADD COLUMN account_type varchar(30) DEFAULT ''操作员'' COMMENT ''账号属性'' AFTER email'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = IF (
    EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'ys_user' AND column_name = 'warehouse_scope'),
    'SELECT 1',
    'ALTER TABLE ys_user ADD COLUMN warehouse_scope varchar(100) DEFAULT NULL COMMENT ''仓库权限范围'' AFTER account_type'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

UPDATE sys_department SET org_type = 'CAMPUS' WHERE parent_id = 0 AND (org_type IS NULL OR org_type = '' OR org_type = 'DEPARTMENT');
UPDATE sys_department SET org_type = 'DEPARTMENT' WHERE parent_id <> 0 AND (org_type IS NULL OR org_type = '');

UPDATE ys_user
SET real_name = COALESCE(real_name, user_name),
    account_type = COALESCE(account_type, '操作员'),
    status = COALESCE(status, 1);