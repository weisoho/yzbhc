-- 后端增量升级脚本（现有 yzb 库直接执行）
-- 用途：合并 system_extension_schema.sql 与 scm_schema.sql
CREATE DATABASE IF NOT EXISTS yzb DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE yzb;

-- ===== 系统基础表扩展 =====
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

-- ===== SCM 业务表与供应商扩展 =====
SET NAMES utf8mb4;

SET @sql = IF (
    EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'supplier' AND column_name = 'legal_representative'),
    'SELECT 1',
    'ALTER TABLE supplier ADD COLUMN legal_representative varchar(100) DEFAULT NULL COMMENT ''法定代表人'' AFTER credit_code'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = IF (
    EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'supplier' AND column_name = 'registered_capital'),
    'SELECT 1',
    'ALTER TABLE supplier ADD COLUMN registered_capital varchar(100) DEFAULT NULL COMMENT ''注册资本'' AFTER legal_representative'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = IF (
    EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'supplier' AND column_name = 'registration_date'),
    'SELECT 1',
    'ALTER TABLE supplier ADD COLUMN registration_date date DEFAULT NULL COMMENT ''注册日期'' AFTER registered_capital'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = IF (
    EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'supplier' AND column_name = 'certificate_count'),
    'SELECT 1',
    'ALTER TABLE supplier ADD COLUMN certificate_count int DEFAULT 0 COMMENT ''资质数量'' AFTER status'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

ALTER TABLE supplier
    MODIFY COLUMN name varchar(255) NOT NULL COMMENT '供应商名称';

SET @sql = IF (
    EXISTS (SELECT 1 FROM information_schema.statistics WHERE table_schema = DATABASE() AND table_name = 'supplier' AND index_name = 'uk_supplier_name'),
    'SELECT 1',
    'ALTER TABLE supplier ADD UNIQUE KEY uk_supplier_name (name)'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = IF (
    EXISTS (SELECT 1 FROM information_schema.statistics WHERE table_schema = DATABASE() AND table_name = 'supplier' AND index_name = 'uk_supplier_code'),
    'SELECT 1',
    'ALTER TABLE supplier ADD UNIQUE KEY uk_supplier_code (supplier_code)'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = IF (
    EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'supplier_qualification' AND column_name = 'certificate_name'),
    'SELECT 1',
    'ALTER TABLE supplier_qualification ADD COLUMN certificate_name varchar(255) DEFAULT NULL COMMENT ''资质名称'' AFTER type'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = IF (
    EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'supplier_qualification' AND column_name = 'attachment_name'),
    'SELECT 1',
    'ALTER TABLE supplier_qualification ADD COLUMN attachment_name varchar(255) DEFAULT NULL COMMENT ''附件名称'' AFTER issuing_authority'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

CREATE TABLE IF NOT EXISTS scm_material (
    id bigint NOT NULL AUTO_INCREMENT,
    material_code varchar(50) NOT NULL COMMENT '物资编码',
    name varchar(200) NOT NULL COMMENT '物资名称',
    material_type varchar(50) NOT NULL COMMENT '物资类型',
    specification varchar(200) NOT NULL COMMENT '规格',
    model varchar(200) NOT NULL COMMENT '型号',
    min_package varchar(100) NOT NULL COMMENT '最小包装',
    unit varchar(50) NOT NULL COMMENT '单位',
    purchase_price decimal(12,2) NOT NULL COMMENT '采购价格',
    supplier_id bigint NOT NULL COMMENT '供应商ID',
    supplier_name varchar(255) NOT NULL COMMENT '供应商名称',
    qualification_id bigint NOT NULL COMMENT '注册证ID',
    registration_number varchar(100) NOT NULL COMMENT '注册证号',
    manufacturer varchar(255) NOT NULL COMMENT '生产厂家',
    storage_condition varchar(100) NOT NULL COMMENT '储存条件',
    status varchar(20) NOT NULL DEFAULT 'active' COMMENT '状态',
    create_time datetime DEFAULT CURRENT_TIMESTAMP,
    update_time datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_scm_material_code (material_code),
    UNIQUE KEY uk_scm_material_unique (supplier_id, qualification_id, name, specification, model),
    KEY idx_scm_material_supplier (supplier_id),
    KEY idx_scm_material_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='物资字典';

CREATE TABLE IF NOT EXISTS scm_purchase_order (
    id bigint NOT NULL AUTO_INCREMENT,
    order_number varchar(50) NOT NULL,
    department_id bigint NOT NULL,
    department_name varchar(100) NOT NULL,
    supplier_id bigint NOT NULL,
    supplier_name varchar(255) NOT NULL,
    operator_name varchar(100) NOT NULL,
    plan_type varchar(50) NOT NULL,
    status varchar(20) NOT NULL,
    remark varchar(500) DEFAULT NULL,
    reject_reason varchar(500) DEFAULT NULL,
    total_amount decimal(12,2) NOT NULL DEFAULT 0,
    item_count int NOT NULL DEFAULT 0,
    submit_time datetime DEFAULT NULL,
    audit_time datetime DEFAULT NULL,
    create_time datetime DEFAULT CURRENT_TIMESTAMP,
    update_time datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_scm_purchase_order_number (order_number),
    KEY idx_scm_purchase_order_status (status),
    KEY idx_scm_purchase_order_supplier (supplier_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='采购单主表';

CREATE TABLE IF NOT EXISTS scm_purchase_order_item (
    id bigint NOT NULL AUTO_INCREMENT,
    purchase_order_id bigint NOT NULL,
    material_id bigint NOT NULL,
    material_code varchar(50) NOT NULL,
    material_name varchar(200) NOT NULL,
    specification varchar(200) NOT NULL,
    model varchar(200) NOT NULL,
    unit varchar(50) NOT NULL,
    manufacturer varchar(255) NOT NULL,
    supplier_name varchar(255) NOT NULL,
    registration_number varchar(100) NOT NULL,
    unit_price decimal(12,2) NOT NULL,
    quantity int NOT NULL,
    received_quantity int NOT NULL DEFAULT 0,
    stocked_quantity int NOT NULL DEFAULT 0,
    amount decimal(12,2) NOT NULL,
    status varchar(20) NOT NULL,
    create_time datetime DEFAULT CURRENT_TIMESTAMP,
    update_time datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_scm_purchase_order_item_order (purchase_order_id),
    KEY idx_scm_purchase_order_item_material (material_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='采购单明细';

CREATE TABLE IF NOT EXISTS scm_purchase_receive (
    id bigint NOT NULL AUTO_INCREMENT,
    receive_number varchar(50) NOT NULL,
    purchase_order_id bigint NOT NULL,
    order_number varchar(50) NOT NULL,
    supplier_id bigint NOT NULL,
    supplier_name varchar(255) NOT NULL,
    supplier_code varchar(50) DEFAULT NULL,
    department_name varchar(100) NOT NULL,
    buyer varchar(100) NOT NULL,
    contact_person varchar(100) NOT NULL,
    contact_phone varchar(50) NOT NULL,
    order_date date DEFAULT NULL,
    expected_delivery_date date DEFAULT NULL,
    actual_delivery_date date DEFAULT NULL,
    receiver varchar(100) NOT NULL,
    status varchar(20) NOT NULL,
    total_amount decimal(12,2) NOT NULL DEFAULT 0,
    item_count int NOT NULL DEFAULT 0,
    remark varchar(500) DEFAULT NULL,
    create_time datetime DEFAULT CURRENT_TIMESTAMP,
    update_time datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_scm_purchase_receive_number (receive_number),
    KEY idx_scm_purchase_receive_order (purchase_order_id),
    KEY idx_scm_purchase_receive_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='采购收货单';

CREATE TABLE IF NOT EXISTS scm_purchase_receive_item (
    id bigint NOT NULL AUTO_INCREMENT,
    receive_id bigint NOT NULL,
    purchase_order_item_id bigint NOT NULL,
    product_code varchar(50) NOT NULL,
    product_name varchar(200) NOT NULL,
    specification varchar(200) NOT NULL,
    model varchar(200) NOT NULL,
    manufacturer varchar(255) NOT NULL,
    registration_number varchar(100) NOT NULL,
    unit varchar(50) NOT NULL,
    price decimal(12,2) NOT NULL,
    quantity int NOT NULL,
    actual_received_quantity int NOT NULL,
    amount decimal(12,2) NOT NULL,
    batch_number varchar(100) DEFAULT NULL,
    production_date date DEFAULT NULL,
    expiry_date date DEFAULT NULL,
    status varchar(20) NOT NULL,
    shortage_reason varchar(500) DEFAULT NULL,
    create_time datetime DEFAULT CURRENT_TIMESTAMP,
    update_time datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_scm_purchase_receive_item_receive (receive_id),
    KEY idx_scm_purchase_receive_item_order_item (purchase_order_item_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='采购收货明细';

CREATE TABLE IF NOT EXISTS scm_stock_in_order (
    id bigint NOT NULL AUTO_INCREMENT,
    stock_in_number varchar(50) NOT NULL,
    receive_id bigint DEFAULT NULL,
    receive_number varchar(50) DEFAULT NULL,
    purchase_order_id bigint DEFAULT NULL,
    order_number varchar(50) DEFAULT NULL,
    stock_in_type varchar(50) NOT NULL,
    department_name varchar(100) NOT NULL,
    operator_name varchar(100) NOT NULL,
    supplier_name varchar(255) NOT NULL,
    stock_in_date date NOT NULL,
    status varchar(20) NOT NULL,
    material_count int NOT NULL DEFAULT 0,
    total_amount decimal(12,2) NOT NULL DEFAULT 0,
    remark varchar(500) DEFAULT NULL,
    create_time datetime DEFAULT CURRENT_TIMESTAMP,
    update_time datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_scm_stock_in_number (stock_in_number),
    KEY idx_scm_stock_in_order_receive (receive_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='入库单主表';

CREATE TABLE IF NOT EXISTS scm_stock_in_item (
    id bigint NOT NULL AUTO_INCREMENT,
    stock_in_order_id bigint NOT NULL,
    receive_item_id bigint DEFAULT NULL,
    material_id bigint DEFAULT NULL,
    material_code varchar(50) NOT NULL,
    material_name varchar(200) NOT NULL,
    material_type varchar(50) DEFAULT NULL,
    specification varchar(200) NOT NULL,
    model varchar(200) NOT NULL,
    min_package varchar(100) NOT NULL,
    unit varchar(50) NOT NULL,
    purchase_price decimal(12,2) NOT NULL,
    order_quantity int NOT NULL,
    stock_in_quantity int NOT NULL,
    purchase_amount decimal(12,2) NOT NULL,
    supplier_name varchar(255) NOT NULL,
    manufacturer varchar(255) NOT NULL,
    registration_number varchar(100) NOT NULL,
    batch_number varchar(100) NOT NULL,
    production_date date NOT NULL,
    expiry_date date NOT NULL,
    status varchar(20) NOT NULL,
    remark varchar(500) DEFAULT NULL,
    create_time datetime DEFAULT CURRENT_TIMESTAMP,
    update_time datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_scm_stock_in_item_order (stock_in_order_id),
    KEY idx_scm_stock_in_item_material (material_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='入库单明细';

CREATE TABLE IF NOT EXISTS scm_inventory (
    id bigint NOT NULL AUTO_INCREMENT,
    material_id bigint DEFAULT NULL,
    material_code varchar(50) NOT NULL,
    material_name varchar(200) NOT NULL,
    category varchar(50) DEFAULT NULL,
    specification varchar(200) NOT NULL,
    model varchar(200) NOT NULL,
    warehouse varchar(100) NOT NULL,
    shelf varchar(100) DEFAULT NULL,
    batch_number varchar(100) NOT NULL,
    production_date date DEFAULT NULL,
    expiry_date date DEFAULT NULL,
    min_package varchar(100) DEFAULT NULL,
    unit varchar(50) DEFAULT NULL,
    purchase_price decimal(12,2) DEFAULT NULL,
    current_stock int NOT NULL DEFAULT 0,
    min_stock int NOT NULL DEFAULT 0,
    max_stock int NOT NULL DEFAULT 0,
    expiry_warning_days int NOT NULL DEFAULT 90,
    registration_number varchar(100) DEFAULT NULL,
    supplier varchar(255) DEFAULT NULL,
    manufacturer varchar(255) DEFAULT NULL,
    stock_status varchar(20) DEFAULT NULL,
    warning varchar(20) DEFAULT NULL,
    last_inbound date DEFAULT NULL,
    create_time datetime DEFAULT CURRENT_TIMESTAMP,
    update_time datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_scm_inventory_batch (material_code, warehouse, batch_number),
    KEY idx_scm_inventory_status (stock_status),
    KEY idx_scm_inventory_expiry (expiry_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='库存表';

CREATE TABLE IF NOT EXISTS scm_inventory_transaction (
    id bigint NOT NULL AUTO_INCREMENT,
    inventory_id bigint NOT NULL,
    material_id bigint DEFAULT NULL,
    material_code varchar(50) NOT NULL,
    material_name varchar(200) NOT NULL,
    batch_number varchar(100) DEFAULT NULL,
    operation_type varchar(50) NOT NULL,
    quantity int NOT NULL,
    balance_quantity int NOT NULL,
    reference_no varchar(50) DEFAULT NULL,
    operator_name varchar(100) DEFAULT NULL,
    remark varchar(500) DEFAULT NULL,
    operation_time datetime DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_scm_inventory_transaction_inventory (inventory_id),
    KEY idx_scm_inventory_transaction_material (material_code),
    KEY idx_scm_inventory_transaction_time (operation_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='库存流水';

CREATE TABLE IF NOT EXISTS scm_stock_out_order (
    id bigint NOT NULL AUTO_INCREMENT,
    stock_out_number varchar(50) NOT NULL,
    stock_out_type varchar(50) NOT NULL,
    department_name varchar(100) NOT NULL,
    operator_name varchar(100) NOT NULL,
    status varchar(20) NOT NULL,
    reason varchar(500) NOT NULL,
    remark varchar(500) DEFAULT NULL,
    outbound_date date NOT NULL,
    create_time datetime DEFAULT CURRENT_TIMESTAMP,
    update_time datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_scm_stock_out_number (stock_out_number),
    KEY idx_scm_stock_out_date (outbound_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='出库单主表';

CREATE TABLE IF NOT EXISTS scm_stock_out_item (
    id bigint NOT NULL AUTO_INCREMENT,
    stock_out_order_id bigint NOT NULL,
    inventory_id bigint NOT NULL,
    material_id bigint DEFAULT NULL,
    material_code varchar(50) NOT NULL,
    material_name varchar(200) NOT NULL,
    material_type varchar(50) DEFAULT NULL,
    specification varchar(200) DEFAULT NULL,
    model varchar(200) DEFAULT NULL,
    unit varchar(50) DEFAULT NULL,
    supplier varchar(255) DEFAULT NULL,
    manufacturer varchar(255) DEFAULT NULL,
    registration_number varchar(100) DEFAULT NULL,
    batch_number varchar(100) DEFAULT NULL,
    production_date date DEFAULT NULL,
    expiry_date date DEFAULT NULL,
    unit_price decimal(12,2) DEFAULT NULL,
    outbound_quantity int NOT NULL,
    outbound_date date NOT NULL,
    status varchar(20) NOT NULL,
    undo_status varchar(20) NOT NULL,
    reason varchar(500) DEFAULT NULL,
    create_time datetime DEFAULT CURRENT_TIMESTAMP,
    update_time datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_scm_stock_out_item_order (stock_out_order_id),
    KEY idx_scm_stock_out_item_material (material_code),
    KEY idx_scm_stock_out_item_undo (undo_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='出库单明细';

CREATE TABLE IF NOT EXISTS scm_operation_log (
    id bigint NOT NULL AUTO_INCREMENT,
    operation_time datetime NOT NULL,
    user_name varchar(100) DEFAULT NULL,
    operation_type varchar(50) DEFAULT NULL,
    content varchar(1000) DEFAULT NULL,
    status varchar(20) DEFAULT NULL,
    ip varchar(64) DEFAULT NULL,
    module_name varchar(100) DEFAULT NULL,
    reference_no varchar(50) DEFAULT NULL,
    create_time datetime DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_scm_operation_log_time (operation_time),
    KEY idx_scm_operation_log_type (operation_type),
    KEY idx_scm_operation_log_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='操作日志';

CREATE TABLE IF NOT EXISTS scm_exception_order (
    id bigint NOT NULL AUTO_INCREMENT,
    order_no varchar(50) NOT NULL,
    purchase_order_id bigint DEFAULT NULL,
    supplier_name varchar(255) DEFAULT NULL,
    supplier_code varchar(50) DEFAULT NULL,
    department varchar(100) DEFAULT NULL,
    buyer varchar(100) DEFAULT NULL,
    contact_person varchar(100) DEFAULT NULL,
    contact_phone varchar(50) DEFAULT NULL,
    order_date date DEFAULT NULL,
    expected_delivery_date date DEFAULT NULL,
    actual_delivery_date date DEFAULT NULL,
    status varchar(20) DEFAULT NULL,
    reject_reason varchar(500) DEFAULT NULL,
    timeout_reason varchar(500) DEFAULT NULL,
    total_amount decimal(12,2) DEFAULT NULL,
    created_at datetime DEFAULT CURRENT_TIMESTAMP,
    resubmitted_at datetime DEFAULT NULL,
    PRIMARY KEY (id),
    KEY idx_scm_exception_order_no (order_no),
    KEY idx_scm_exception_order_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='异常订单';