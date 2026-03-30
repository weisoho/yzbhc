/*
 Navicat Premium Data Transfer

 Source Server         : 111.229.113.226
 Source Server Type    : MySQL
 Source Server Version : 80045 (8.0.45)
 Source Host           : 111.229.113.226:53302
 Source Schema         : yzb

 Target Server Type    : MySQL
 Target Server Version : 80045 (8.0.45)
 File Encoding         : 65001

 Date: 30/03/2026 07:31:52
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for asset
-- ----------------------------
DROP TABLE IF EXISTS `asset`;
CREATE TABLE `asset`  (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'id',
  `asset_code` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '资产编码',
  `asset_name` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '资产名字',
  `asset_typeid` int NOT NULL COMMENT '资产类型id',
  `asset_typename` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '资产类型名称',
  `spe_model` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '规格型号',
  `manufacturer` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '生产厂商',
  `purchase_date` datetime NOT NULL COMMENT '购置日期',
  `orig_value` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '原值',
  `service_life` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '年限',
  `dep_id` int NOT NULL COMMENT '使用部门id',
  `dep_name` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '使用部门名称',
  `sto_location` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '存放地点',
  `resp_person` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '责任人',
  `asset_state` tinyint(1) NOT NULL DEFAULT 1 COMMENT '资产状态1在用2闲置3维修4待报废',
  `depr_method` tinyint(1) NOT NULL DEFAULT 1 COMMENT '折旧方法1直线法2双倍余额递减法3年数总和法',
  `serial_num` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '序列号',
  `asset_desc` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '资产描述',
  `attachment` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '附件',
  `cdate` datetime NOT NULL COMMENT '创建时间',
  `udate` datetime NOT NULL COMMENT '更新时间',
  `inventory_id` int NOT NULL COMMENT '仓库id',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '资产表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of asset
-- ----------------------------

-- ----------------------------
-- Table structure for asset_repair
-- ----------------------------
DROP TABLE IF EXISTS `asset_repair`;
CREATE TABLE `asset_repair`  (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `asset_id` int NOT NULL COMMENT '资产ID',
  `repair_code` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '维修单号',
  `repair_date` datetime NOT NULL COMMENT '维修日期',
  `finish_date` datetime NULL DEFAULT NULL COMMENT '完成日期',
  `repair_type` int NOT NULL COMMENT '维修类型：1定期维修 2故障维修',
  `repair_reason` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '维修原因',
  `repair_content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '维修内容',
  `repair_bus` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '维修商家',
  `repair_person` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '维修人员',
  `repair_fee` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '维修费用',
  `repair_status` int NOT NULL COMMENT '维修状态：1待处理 2处理中 3已完成',
  `remark` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '备注',
  `cdate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `udate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '更新时间',
  `asset_code` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '资产编码',
  `asset_name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '资产名',
  `asset_type` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '资产类型',
  `asset_type_id` int NULL DEFAULT NULL COMMENT '资产类型iD',
  `manufacturer` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '厂家',
  `spe_model` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '型号规格',
  `dep_id` int NOT NULL COMMENT '科室id',
  `user_id` int NULL DEFAULT NULL COMMENT '创建人id',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_asset_id`(`asset_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '维修记录' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of asset_repair
-- ----------------------------

-- ----------------------------
-- Table structure for asset_transfer
-- ----------------------------
DROP TABLE IF EXISTS `asset_transfer`;
CREATE TABLE `asset_transfer`  (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'id',
  `asset_id` int NOT NULL COMMENT '资产id',
  `dep_id` int NOT NULL COMMENT '调拨来源部门id',
  `cdate` datetime NOT NULL COMMENT '创建时间',
  `udate` datetime NOT NULL COMMENT '更新时间',
  `transfer_code` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '调拨单号',
  `asset_code` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '资产编码',
  `asset_name` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '资产名称',
  `asset_typeid` int NOT NULL COMMENT '资产类型id',
  `asset_typename` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '资产类型名称',
  `spe_model` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '规格型号',
  `orig_value` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '原值',
  `bedep_id` int NOT NULL COMMENT '接受部门id',
  `user_id` int NOT NULL COMMENT '调拨人id',
  `user_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '调拨人',
  `dep_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `bedep_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `status` int NOT NULL DEFAULT 1 COMMENT '状态1待接受，2通过，3，拒绝',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_asset_id`(`asset_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '调拨' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of asset_transfer
-- ----------------------------

-- ----------------------------
-- Table structure for asset_transfer_record
-- ----------------------------
DROP TABLE IF EXISTS `asset_transfer_record`;
CREATE TABLE `asset_transfer_record`  (
  `id` int NOT NULL COMMENT 'id',
  `transfer_id` int NOT NULL COMMENT '调拨id',
  `cdate` datetime NOT NULL COMMENT '创建日期',
  `udate` datetime NOT NULL COMMENT '更新日期',
  `user_id` int NOT NULL COMMENT '接收人id',
  `user_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '接收人',
  `asset_status` int NOT NULL DEFAULT 1 COMMENT '1完好无损，2轻微磨损，3需要维修，4严重损坏',
  `asset_parts` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '配件清单',
  `remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '备注',
  `status` int NOT NULL DEFAULT 0 COMMENT '0待接受，1已接收，2未接受',
  `reason` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '原因',
  `resp_persion` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '责任人',
  `resp_persion_id` int NULL DEFAULT NULL COMMENT '新责任人iD',
  `inventory_id` int NOT NULL COMMENT '仓库id',
  `inventory_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '仓库名字',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '资产调拨明细' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of asset_transfer_record
-- ----------------------------

-- ----------------------------
-- Table structure for asset_type
-- ----------------------------
DROP TABLE IF EXISTS `asset_type`;
CREATE TABLE `asset_type`  (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'id',
  `asset_code` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '资产类型编码',
  `asset_name` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '资产类型名称',
  `asset_desc` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '资产类型描述',
  `cdate` datetime NOT NULL COMMENT '创建时间',
  `asset_state` tinyint(1) NOT NULL DEFAULT 1 COMMENT '1启用0停用',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '资产类型' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of asset_type
-- ----------------------------

-- ----------------------------
-- Table structure for check_inventory
-- ----------------------------
DROP TABLE IF EXISTS `check_inventory`;
CREATE TABLE `check_inventory`  (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'id',
  `che_code` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '盘点编码',
  `inventory_id` int NOT NULL COMMENT '仓库id',
  `inventory_name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '仓库名字',
  `cdate` datetime NOT NULL COMMENT '创建日期',
  `udate` datetime NOT NULL COMMENT '更新时间',
  `status` int NOT NULL DEFAULT 1 COMMENT '状态1盘点完成，0未盘点，2已记录损失盈利',
  `user_id` int NOT NULL COMMENT '盘点人id',
  `user_name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '盘点人名字',
  `dep_id` int NOT NULL COMMENT '盘点部门id',
  `dep_name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '盘点部门',
  `actual _num` int NULL DEFAULT -1 COMMENT '实际数量',
  `sys_num` int NULL DEFAULT NULL COMMENT '系统数量',
  `diff_reason` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '差异原因',
  `che_status` int NULL DEFAULT 0 COMMENT '1盘亏，2盘盈，0无差异',
  `che_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '盘点日期',
  PRIMARY KEY (`id`, `che_date`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci COMMENT = '盘点表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of check_inventory
-- ----------------------------
INSERT INTO `check_inventory` VALUES (1, 'PD20260326101347927', 4, '医用手套', '2026-03-26 10:13:48', '2026-03-26 10:13:48', 0, 1, 'admin', 11, '药剂科', 0, 200, NULL, 0, '2026-03-26 10:14:32');
INSERT INTO `check_inventory` VALUES (2, 'PD20260326101347597', 3, '一次性注射器', '2026-03-26 10:13:48', '2026-03-26 10:13:48', 0, 1, 'admin', 11, '药剂科', 0, 100, NULL, 0, '2026-03-26 10:14:32');
INSERT INTO `check_inventory` VALUES (3, 'PD20260326101347444', 1, 'Disposable Syringe', '2026-03-26 10:13:48', '2026-03-26 10:13:48', 0, 1, 'admin', 11, '药剂科', 0, 200, NULL, 0, '2026-03-26 10:14:32');
INSERT INTO `check_inventory` VALUES (4, 'PD20260326101347379', 2, 'Medical Mask', '2026-03-26 10:13:48', '2026-03-26 10:13:48', 0, 1, 'admin', 11, '药剂科', 0, 250, NULL, 0, '2026-03-26 10:14:32');

-- ----------------------------
-- Table structure for sample_item
-- ----------------------------
DROP TABLE IF EXISTS `sample_item`;
CREATE TABLE `sample_item`  (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `item_name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '项目名称',
  `item_code` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '项目编码',
  `dep_id` int NOT NULL COMMENT '科室ID',
  `dep_name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '科室名字',
  `item_state` int NOT NULL DEFAULT 1 COMMENT '1启用 0停用',
  `remark` varchar(2000) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '备注',
  `cdate` datetime NOT NULL COMMENT '创建时间',
  `udate` datetime NOT NULL COMMENT '更新时间',
  `is_charge` int NOT NULL DEFAULT 0 COMMENT '是否收费',
  `charge_code` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '收费编码',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci COMMENT = '样本-项目管理' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sample_item
-- ----------------------------
INSERT INTO `sample_item` VALUES (1, '测试', '11111', 1, '111', 1, NULL, '2026-03-24 17:01:50', '2026-03-24 17:01:50', 0, NULL);

-- ----------------------------
-- Table structure for sample_man
-- ----------------------------
DROP TABLE IF EXISTS `sample_man`;
CREATE TABLE `sample_man`  (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `sample_date` datetime NOT NULL COMMENT '日期',
  `dep_id` int NOT NULL COMMENT '科室ID',
  `dep_name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '科室名字',
  `detection_num` int NOT NULL DEFAULT 0 COMMENT '检测数',
  `user_id` int NOT NULL COMMENT '操作人ID',
  `user_name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '操作人',
  `remark` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '备注',
  `cdate` datetime NOT NULL COMMENT '创建时间',
  `udate` datetime NOT NULL COMMENT '更新时间',
  `item_id` int NOT NULL COMMENT '项目ID',
  `item_name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '项目名字',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci COMMENT = '样本量管理' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sample_man
-- ----------------------------

-- ----------------------------
-- Table structure for scm_exception_order
-- ----------------------------
DROP TABLE IF EXISTS `scm_exception_order`;
CREATE TABLE `scm_exception_order`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `order_no` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `purchase_order_id` bigint NULL DEFAULT NULL,
  `supplier_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `supplier_code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `department` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `buyer` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `contact_person` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `contact_phone` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `order_date` date NULL DEFAULT NULL,
  `expected_delivery_date` date NULL DEFAULT NULL,
  `actual_delivery_date` date NULL DEFAULT NULL,
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `reject_reason` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `timeout_reason` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `total_amount` decimal(12, 2) NULL DEFAULT NULL,
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `resubmitted_at` datetime NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_scm_exception_order_no`(`order_no` ASC) USING BTREE,
  INDEX `idx_scm_exception_order_status`(`status` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 12 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '异常订单' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of scm_exception_order
-- ----------------------------
INSERT INTO `scm_exception_order` VALUES (1, 'PO202403180001', 10, '上海医疗器械有限公司', 'SUP-EDIT-001', '手术室', '管理员', '管理员', '13100001111', '2026-03-18', '2026-03-21', NULL, '待验收', '到货数量不足，需补货', NULL, 255.00, '2026-03-18 20:17:32', '2026-03-18 20:26:17');
INSERT INTO `scm_exception_order` VALUES (3, 'PO202403180002', 11, '北京康健医药有限公司', 'SUP-TEST-002', '内科', '管理员', '管理员', '13900139000', '2026-03-18', '2026-03-23', NULL, '超时未验收', NULL, '供应商未按期送达', 15.00, '2026-03-18 20:31:37', NULL);
INSERT INTO `scm_exception_order` VALUES (4, 'PO202603180001', 9, '上海医疗器械有限公司', 'SUP-EX-R-9', '1', '张数', '张数', '13800138000', '2026-03-18', '2026-03-21', NULL, '已拒收', '到货数量不足，需补货', NULL, 25.50, '2026-03-18 20:35:13', NULL);
INSERT INTO `scm_exception_order` VALUES (5, 'PO202603170001', 8, '昆明有限公司', 'SUP-EX-R-8', '1', '李二', '李二', '13800138000', '2026-03-17', '2026-03-20', NULL, '已拒收', '到货数量不足，需补货', NULL, 2.50, '2026-03-18 20:35:13', NULL);
INSERT INTO `scm_exception_order` VALUES (6, 'PO-20260310-0003', 7, '昆明有限公司', 'SUP-EX-R-7', '急诊科', '王五', '王五', '13800138000', '2026-03-10', '2026-03-13', NULL, '已拒收', '到货数量不足，需补货', NULL, 0.00, '2026-03-18 20:35:13', NULL);
INSERT INTO `scm_exception_order` VALUES (7, 'PO-20260305-0002', 6, '上海医疗器械有限公司', 'SUP-EX-R-6', '外科', '李四', '李四', '13800138000', '2026-03-05', '2026-03-08', NULL, '已拒收', '到货数量不足，需补货', NULL, 0.00, '2026-03-18 20:35:13', NULL);
INSERT INTO `scm_exception_order` VALUES (8, 'PO-20260301-0001', 5, '上海医疗器械有限公司', 'SUP-EX-R-5', '内科', '张三', '张三', '13800138000', '2026-03-01', '2026-03-04', NULL, '已拒收', '到货数量不足，需补货', NULL, 0.00, '2026-03-18 20:35:13', NULL);
INSERT INTO `scm_exception_order` VALUES (11, 'PO20240001', 4, 'Shanghai Medical Device Co.', 'SUP-EX-T-4', 'Head Office', 'admin', 'admin', '13900139000', '2026-03-17', '2026-03-22', NULL, '超时未验收', NULL, '供应商未按期送达', 1250.00, '2026-03-18 20:35:13', NULL);

-- ----------------------------
-- Table structure for scm_inventory
-- ----------------------------
DROP TABLE IF EXISTS `scm_inventory`;
CREATE TABLE `scm_inventory`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `material_id` bigint NULL DEFAULT NULL,
  `material_code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `material_name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `category` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `specification` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `model` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `warehouse` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `shelf` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `batch_number` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `production_date` date NULL DEFAULT NULL,
  `expiry_date` date NULL DEFAULT NULL,
  `min_package` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `unit` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `purchase_price` decimal(12, 2) NULL DEFAULT NULL,
  `current_stock` int NOT NULL DEFAULT 0,
  `min_stock` int NOT NULL DEFAULT 0,
  `max_stock` int NOT NULL DEFAULT 0,
  `expiry_warning_days` int NOT NULL DEFAULT 90,
  `registration_number` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `supplier` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `manufacturer` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `stock_status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `warning` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `last_inbound` date NULL DEFAULT NULL,
  `create_time` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `dep_id` int NULL DEFAULT NULL,
  `user_id` int NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_scm_inventory_batch`(`material_code` ASC, `warehouse` ASC, `batch_number` ASC) USING BTREE,
  INDEX `idx_scm_inventory_status`(`stock_status` ASC) USING BTREE,
  INDEX `idx_scm_inventory_expiry`(`expiry_date` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '库存表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of scm_inventory
-- ----------------------------
INSERT INTO `scm_inventory` VALUES (1, 1, 'MAT001', 'Disposable Syringe', 'Medical Device', '1ml', 'SYR-001', 'Main Warehouse', 'A1-01', 'BATCH001', '2026-03-17', '2028-03-17', '100pcs/box', 'pc', 2.50, 200, 50, 500, 90, 'SH20200001', 'Shanghai Medical Device Co.', 'Shanghai Medical Device Co.', 'Normal', 'No', '2026-03-17', '2026-03-17 17:47:51', '2026-03-25 15:05:27', 11, 1);
INSERT INTO `scm_inventory` VALUES (2, 2, 'MAT002', 'Medical Mask', 'Medical Device', 'N95', 'MASK-001', 'Main Warehouse', 'A1-02', 'BATCH002', '2026-03-17', '2028-03-17', '50pcs/box', 'pc', 3.00, 250, 50, 500, 90, 'SH20200001', 'Shanghai Medical Device Co.', 'Shanghai Medical Device Co.', 'Normal', 'No', '2026-03-17', '2026-03-17 17:47:51', '2026-03-25 15:05:30', 11, 1);
INSERT INTO `scm_inventory` VALUES (3, 21, 'MAT202603180001', '一次性注射器', '耗材', '2ml', '2ml', '仓库2', '默认货位', 'TB20260317-001', '2026-02-15', '2027-03-17', '1', '支', 1.00, 100, 10, 1000, 90, 'REG-2ML-001', '上海医疗器械有限公司', '上海医疗器械厂', 'normal', NULL, '2026-03-18', '2026-03-18 19:34:09', '2026-03-18 19:34:09', NULL, NULL);
INSERT INTO `scm_inventory` VALUES (4, 22, 'MAT202603180002', '医用手套', '耗材', '中号', '中号', '仓库2', '默认货位', 'TB20260317-002', '2026-02-15', '2027-03-17', '1', '副', 2.00, 200, 10, 1000, 90, 'REG-GLV-001', '上海医疗器械有限公司', '上海医疗器械厂', 'normal', NULL, '2026-03-18', '2026-03-18 19:48:41', '2026-03-18 19:49:14', NULL, NULL);

-- ----------------------------
-- Table structure for scm_inventory_transaction
-- ----------------------------
DROP TABLE IF EXISTS `scm_inventory_transaction`;
CREATE TABLE `scm_inventory_transaction`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `inventory_id` bigint NOT NULL,
  `material_id` bigint NULL DEFAULT NULL,
  `material_code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `material_name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `batch_number` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `operation_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `quantity` int NOT NULL,
  `balance_quantity` int NOT NULL,
  `reference_no` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `operator_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `remark` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `operation_time` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_scm_inventory_transaction_inventory`(`inventory_id` ASC) USING BTREE,
  INDEX `idx_scm_inventory_transaction_material`(`material_code` ASC) USING BTREE,
  INDEX `idx_scm_inventory_transaction_time`(`operation_time` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '库存流水' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of scm_inventory_transaction
-- ----------------------------
INSERT INTO `scm_inventory_transaction` VALUES (1, 1, 1, 'MAT001', 'Disposable Syringe', 'BATCH001', 'Stock In', 200, 200, 'STKIN20240001', 'admin', 'Purchase stock in', '2026-03-17 17:47:51');
INSERT INTO `scm_inventory_transaction` VALUES (2, 2, 2, 'MAT002', 'Medical Mask', 'BATCH002', 'Stock In', 250, 250, 'STKIN20240001', 'admin', 'Purchase stock in', '2026-03-17 17:47:51');
INSERT INTO `scm_inventory_transaction` VALUES (3, 3, 21, 'MAT202603180001', '一次性注射器', 'TB20260317-001', '调拨入库', 100, 100, 'TR-20260317-0001', '???', '调拨验收入库', '2026-03-18 19:34:09');
INSERT INTO `scm_inventory_transaction` VALUES (4, 4, 22, 'MAT202603180002', '医用手套', 'TB20260317-002', '调拨入库', 50, 50, 'TR-20260317-0001', '???', '调拨验收入库', '2026-03-18 19:48:41');
INSERT INTO `scm_inventory_transaction` VALUES (5, 4, 22, 'MAT202603180002', '医用手套', 'TB20260317-002', '调拨入库', 150, 200, 'TR-20260317-0001', '???', '调拨验收入库', '2026-03-18 19:49:14');

-- ----------------------------
-- Table structure for scm_material
-- ----------------------------
DROP TABLE IF EXISTS `scm_material`;
CREATE TABLE `scm_material`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `material_code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '物资编码',
  `name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '物资名称',
  `material_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '物资类型',
  `specification` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '规格',
  `model` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '型号',
  `min_package` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '最小包装',
  `unit` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '单位',
  `purchase_price` decimal(12, 2) NOT NULL COMMENT '采购价格',
  `supplier_id` bigint NOT NULL COMMENT '供应商ID',
  `supplier_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '供应商名称',
  `qualification_id` bigint NOT NULL COMMENT '注册证ID',
  `registration_number` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '注册证号',
  `manufacturer` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '生产厂家',
  `storage_condition` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '储存条件',
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'active' COMMENT '状态',
  `create_time` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_scm_material_code`(`material_code` ASC) USING BTREE,
  UNIQUE INDEX `uk_scm_material_unique`(`supplier_id` ASC, `qualification_id` ASC, `name` ASC, `specification` ASC, `model` ASC) USING BTREE,
  INDEX `idx_scm_material_supplier`(`supplier_id` ASC) USING BTREE,
  INDEX `idx_scm_material_status`(`status` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 23 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '物资字典' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of scm_material
-- ----------------------------

-- ----------------------------
-- Table structure for scm_operation_log
-- ----------------------------
DROP TABLE IF EXISTS `scm_operation_log`;
CREATE TABLE `scm_operation_log`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `operation_time` datetime NOT NULL,
  `user_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `operation_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `content` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `ip` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `module_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `reference_no` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `create_time` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_scm_operation_log_time`(`operation_time` ASC) USING BTREE,
  INDEX `idx_scm_operation_log_type`(`operation_type` ASC) USING BTREE,
  INDEX `idx_scm_operation_log_status`(`status` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 84 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '操作日志' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of scm_operation_log
-- ----------------------------
INSERT INTO `scm_operation_log` VALUES (1, '2026-03-16 14:16:46', 'system', '维护', '新增供应商: 京康健医药有限公司', 'success', '0:0:0:0:0:0:0:1', '供应商维护', 'SUP202603160001', '2026-03-16 14:16:46');
INSERT INTO `scm_operation_log` VALUES (2, '2026-03-16 16:04:16', 'system', '维护', '新增供应商资质: 上海医疗器械有限公司 / INSPECTION_REPORT', 'success', '0:0:0:0:0:0:0:1', '供应商资质', '1', '2026-03-16 16:04:16');
INSERT INTO `scm_operation_log` VALUES (3, '2026-03-16 16:13:33', 'system', '维护', '新增供应商资质: 上海医疗器械有限公司 / BUSINESS_LICENSE', 'success', '0:0:0:0:0:0:0:1', '供应商资质', '1', '2026-03-16 16:13:33');
INSERT INTO `scm_operation_log` VALUES (4, '2026-03-16 17:16:10', 'system', '维护', '更新供应商: 上海医疗器械有限公司 -> 上海医疗器械有限公司', 'success', '0:0:0:0:0:0:0:1', '供应商维护', NULL, '2026-03-16 17:16:10');
INSERT INTO `scm_operation_log` VALUES (5, '2026-03-16 17:16:15', 'system', '删除', '删除供应商: 京康健医药有限公司', 'success', '0:0:0:0:0:0:0:1', '供应商维护', 'SUP202603160001', '2026-03-16 17:16:15');
INSERT INTO `scm_operation_log` VALUES (6, '2026-03-16 17:16:51', 'system', '维护', '更新供应商: 北京康健医药有限公司 -> 北京康健医药有限公司', 'success', '0:0:0:0:0:0:0:1', '供应商维护', NULL, '2026-03-16 17:16:51');
INSERT INTO `scm_operation_log` VALUES (7, '2026-03-16 17:34:33', 'system', '删除', '删除供应商资质: 1', 'success', '0:0:0:0:0:0:0:1', '供应商资质', '1', '2026-03-16 17:34:33');
INSERT INTO `scm_operation_log` VALUES (8, '2026-03-16 17:58:56', 'system', '维护', '新增供应商: 1', 'success', '0:0:0:0:0:0:0:1', '供应商维护', 'SUP202603160001', '2026-03-16 17:58:56');
INSERT INTO `scm_operation_log` VALUES (9, '2026-03-16 17:59:13', 'system', '删除', '删除供应商: 1', 'success', '0:0:0:0:0:0:0:1', '供应商维护', 'SUP202603160001', '2026-03-16 17:59:13');
INSERT INTO `scm_operation_log` VALUES (10, '2026-03-16 18:06:27', 'system', '维护', '更新供应商资质: BUSINESS_LICENSE', 'success', '0:0:0:0:0:0:0:1', '供应商资质', '913524356', '2026-03-16 18:06:27');
INSERT INTO `scm_operation_log` VALUES (11, '2026-03-16 18:07:41', 'system', '维护', '更新供应商资质: INSPECTION_REPORT', 'success', '0:0:0:0:0:0:0:1', '供应商资质', 'INSP-2025002', '2026-03-16 18:07:41');
INSERT INTO `scm_operation_log` VALUES (12, '2026-03-16 18:07:55', 'system', '维护', '更新供应商资质: INSPECTION_REPORT', 'success', '0:0:0:0:0:0:0:1', '供应商资质', 'INSP-2025001', '2026-03-16 18:07:55');
INSERT INTO `scm_operation_log` VALUES (13, '2026-03-16 18:09:04', 'system', '维护', '新增供应商资质: 上海医疗器械有限公司 / INSPECTION_REPORT', 'success', '0:0:0:0:0:0:0:1', '供应商资质', '122312', '2026-03-16 18:09:04');
INSERT INTO `scm_operation_log` VALUES (14, '2026-03-16 18:13:35', 'system', '维护', '更新供应商资质: BUSINESS_LICENSE', 'success', '0:0:0:0:0:0:0:1', '供应商资质', '913524356', '2026-03-16 18:13:35');
INSERT INTO `scm_operation_log` VALUES (15, '2026-03-16 18:14:08', 'system', '维护', '更新供应商资质: BUSINESS_CERTIFICATE', 'success', '0:0:0:0:0:0:0:1', '供应商资质', '1111111111111', '2026-03-16 18:14:08');
INSERT INTO `scm_operation_log` VALUES (16, '2026-03-16 18:15:49', 'system', '维护', '新增供应商资质: 上海医疗器械有限公司 / INSPECTION_REPORT', 'success', '0:0:0:0:0:0:0:1', '供应商资质', '12123124', '2026-03-16 18:15:49');
INSERT INTO `scm_operation_log` VALUES (17, '2026-03-16 18:17:13', 'system', '维护', '新增供应商: 南昌有限公司', 'success', '0:0:0:0:0:0:0:1', '供应商维护', 'SUP202603160001', '2026-03-16 18:17:13');
INSERT INTO `scm_operation_log` VALUES (18, '2026-03-16 18:19:21', 'system', '维护', '新增供应商资质: 上海医疗器械有限公司 / INSPECTION_REPORT', 'success', '0:0:0:0:0:0:0:1', '供应商资质', '1213', '2026-03-16 18:19:21');
INSERT INTO `scm_operation_log` VALUES (19, '2026-03-16 18:26:36', 'system', '维护', '新增供应商资质: 南昌有限公司 / INSPECTION_REPORT', 'success', '0:0:0:0:0:0:0:1', '供应商资质', '1', '2026-03-16 18:26:36');
INSERT INTO `scm_operation_log` VALUES (20, '2026-03-16 18:28:08', 'system', '删除', '删除供应商资质: 1213', 'success', '0:0:0:0:0:0:0:1', '供应商资质', '1213', '2026-03-16 18:28:08');
INSERT INTO `scm_operation_log` VALUES (21, '2026-03-16 18:40:30', 'system', '维护', '新增供应商资质: 南昌有限公司 / INSPECTION_REPORT', 'success', '0:0:0:0:0:0:0:1', '供应商资质', '17967464', '2026-03-16 18:40:30');
INSERT INTO `scm_operation_log` VALUES (22, '2026-03-16 18:48:46', 'system', '维护', '更新供应商资质: INSPECTION_REPORT', 'success', '0:0:0:0:0:0:0:1', '供应商资质', '17967464', '2026-03-16 18:48:46');
INSERT INTO `scm_operation_log` VALUES (23, '2026-03-16 18:48:59', 'system', '维护', '更新供应商资质: INSPECTION_REPORT', 'success', '0:0:0:0:0:0:0:1', '供应商资质', 'JC20230001', '2026-03-16 18:48:59');
INSERT INTO `scm_operation_log` VALUES (24, '2026-03-16 20:39:45', 'system', '维护', '更新供应商资质: BUSINESS_LICENSE', 'success', '0:0:0:0:0:0:0:1', '供应商资质', '913524356', '2026-03-16 20:39:45');
INSERT INTO `scm_operation_log` VALUES (25, '2026-03-16 20:40:14', 'system', '维护', '新增供应商资质: 上海医疗器械有限公司 / BUSINESS_LICENSE', 'success', '0:0:0:0:0:0:0:1', '供应商资质', '53623452', '2026-03-16 20:40:14');
INSERT INTO `scm_operation_log` VALUES (26, '2026-03-16 20:55:11', 'system', '维护', '新增供应商资质: 上海医疗器械有限公司 / BUSINESS_LICENSE', 'success', '0:0:0:0:0:0:0:1', '供应商资质', '2222222222', '2026-03-16 20:55:11');
INSERT INTO `scm_operation_log` VALUES (27, '2026-03-16 21:15:49', 'system', '维护', '新增供应商: 昆明有限公司', 'success', '0:0:0:0:0:0:0:1', '供应商维护', 'SUP202603160002', '2026-03-16 21:15:49');
INSERT INTO `scm_operation_log` VALUES (28, '2026-03-16 21:38:05', 'system', '维护', '新增供应商资质: 昆明有限公司 / BUSINESS_LICENSE', 'success', '0:0:0:0:0:0:0:1', '供应商资质', '666666', '2026-03-16 21:38:05');
INSERT INTO `scm_operation_log` VALUES (29, '2026-03-17 23:31:51', '李二', '新增', '创建采购单: PO202603170001', 'success', '0:0:0:0:0:0:0:1', '采购管理', 'PO202603170001', '2026-03-17 23:31:51');
INSERT INTO `scm_operation_log` VALUES (30, '2026-03-17 23:31:51', '李二', '提交', '提交采购单: PO202603170001', 'success', '0:0:0:0:0:0:0:1', '采购管理', 'PO202603170001', '2026-03-17 23:31:51');
INSERT INTO `scm_operation_log` VALUES (31, '2026-03-17 23:49:13', 'system', '新增', '新增物资字典: 1', 'success', '0:0:0:0:0:0:0:1', '物资字典', '1', '2026-03-17 23:49:13');
INSERT INTO `scm_operation_log` VALUES (32, '2026-03-18 16:30:09', 'system', '删除', '删除物资字典: 1', 'success', '0:0:0:0:0:0:0:1', '物资字典', '1', '2026-03-18 16:30:09');
INSERT INTO `scm_operation_log` VALUES (33, '2026-03-18 16:30:51', 'system', '新增', '新增物资字典: 1', 'success', '0:0:0:0:0:0:0:1', '物资字典', '1', '2026-03-18 16:30:51');
INSERT INTO `scm_operation_log` VALUES (34, '2026-03-18 16:30:59', 'system', '删除', '删除物资字典: 1', 'success', '0:0:0:0:0:0:0:1', '物资字典', '1', '2026-03-18 16:30:59');
INSERT INTO `scm_operation_log` VALUES (35, '2026-03-18 16:48:44', '张数', '新增', '创建采购单: PO202603180001', 'success', '0:0:0:0:0:0:0:1', '采购管理', 'PO202603180001', '2026-03-18 16:48:44');
INSERT INTO `scm_operation_log` VALUES (36, '2026-03-18 16:48:44', '张数', '提交', '提交采购单: PO202603180001', 'success', '0:0:0:0:0:0:0:1', '采购管理', 'PO202603180001', '2026-03-18 16:48:44');
INSERT INTO `scm_operation_log` VALUES (37, '2026-03-18 20:25:56', '管理员', '删除', '删除异常订单: PO202403180002', 'warning', '127.0.0.1', '异常订单', 'PO202403180002', '2026-03-18 20:25:56');
INSERT INTO `scm_operation_log` VALUES (38, '2026-03-18 20:26:17', '管理员', '提交', '重新提交异常订单: PO202403180001', 'success', '127.0.0.1', '异常订单', 'PO202403180001', '2026-03-18 20:26:17');
INSERT INTO `scm_operation_log` VALUES (39, '2026-03-18 20:56:43', '李', '新增', '创建采购单: PO202603180002', 'success', '0:0:0:0:0:0:0:1', '采购管理', 'PO202603180002', '2026-03-18 20:56:43');
INSERT INTO `scm_operation_log` VALUES (40, '2026-03-18 20:56:43', '李', '提交', '提交采购单: PO202603180002', 'success', '0:0:0:0:0:0:0:1', '采购管理', 'PO202603180002', '2026-03-18 20:56:43');
INSERT INTO `scm_operation_log` VALUES (41, '2026-03-18 21:08:46', 'admin', '审核', '通过采购单: PO202603180002', 'success', '0:0:0:0:0:0:0:1', '采购审核', 'PO202603180002', '2026-03-18 21:08:46');
INSERT INTO `scm_operation_log` VALUES (42, '2026-03-18 21:39:46', '无', '新增', '创建采购单: PO202603180003', 'success', '0:0:0:0:0:0:0:1', '采购管理', 'PO202603180003', '2026-03-18 21:39:46');
INSERT INTO `scm_operation_log` VALUES (43, '2026-03-18 22:01:03', 'admin', '提交', '提交采购单: PO202603180003', 'success', '0:0:0:0:0:0:0:1', '采购管理', 'PO202603180003', '2026-03-18 22:01:03');
INSERT INTO `scm_operation_log` VALUES (44, '2026-03-26 10:45:25', '测试', '新增', '创建采购单: PO202603260001', 'success', '0:0:0:0:0:0:0:1', '采购管理', 'PO202603260001', '2026-03-26 10:45:25');
INSERT INTO `scm_operation_log` VALUES (45, '2026-03-26 10:45:25', '测试', '提交', '提交采购单: PO202603260001', 'success', '0:0:0:0:0:0:0:1', '采购管理', 'PO202603260001', '2026-03-26 10:45:25');
INSERT INTO `scm_operation_log` VALUES (46, '2026-03-26 10:45:26', '测试', '新增', '创建采购单: PO202603260002', 'success', '0:0:0:0:0:0:0:1', '采购管理', 'PO202603260002', '2026-03-26 10:45:26');
INSERT INTO `scm_operation_log` VALUES (47, '2026-03-26 10:45:26', '测试', '提交', '提交采购单: PO202603260002', 'success', '0:0:0:0:0:0:0:1', '采购管理', 'PO202603260002', '2026-03-26 10:45:26');
INSERT INTO `scm_operation_log` VALUES (48, '2026-03-26 10:45:47', '管理员', '审核', '通过采购单: PO202603260002', 'success', '0:0:0:0:0:0:0:1', '采购审核', 'PO202603260002', '2026-03-26 10:45:47');
INSERT INTO `scm_operation_log` VALUES (49, '2026-03-26 10:45:51', '管理员', '审核', '驳回采购单: PO202603260001', 'warning', '0:0:0:0:0:0:0:1', '采购审核', 'PO202603260001', '2026-03-26 10:45:51');
INSERT INTO `scm_operation_log` VALUES (50, '2026-03-26 10:45:57', '管理员', '审核', '通过采购单: PO202603180003', 'success', '0:0:0:0:0:0:0:1', '采购审核', 'PO202603180003', '2026-03-26 10:45:57');
INSERT INTO `scm_operation_log` VALUES (51, '2026-03-26 10:45:57', '管理员', '审核', '通过采购单: PO202603180001', 'success', '0:0:0:0:0:0:0:1', '采购审核', 'PO202603180001', '2026-03-26 10:45:57');
INSERT INTO `scm_operation_log` VALUES (52, '2026-03-26 10:45:58', '管理员', '审核', '通过采购单: PO202603170001', 'success', '0:0:0:0:0:0:0:1', '采购审核', 'PO202603170001', '2026-03-26 10:45:58');
INSERT INTO `scm_operation_log` VALUES (53, '2026-03-26 21:45:56', 'system', '删除', '删除供应商资质: JC20230001', 'success', '112.96.35.179', '供应商资质', 'JC20230001', '2026-03-26 21:45:56');
INSERT INTO `scm_operation_log` VALUES (54, '2026-03-26 21:45:58', 'system', '删除', '删除供应商资质: 17967464', 'success', '112.96.35.179', '供应商资质', '17967464', '2026-03-26 21:45:58');
INSERT INTO `scm_operation_log` VALUES (55, '2026-03-26 21:46:00', 'system', '删除', '删除供应商资质: 12123124', 'success', '112.96.35.179', '供应商资质', '12123124', '2026-03-26 21:46:00');
INSERT INTO `scm_operation_log` VALUES (56, '2026-03-26 21:46:02', 'system', '删除', '删除供应商资质: 122312', 'success', '112.96.35.179', '供应商资质', '122312', '2026-03-26 21:46:02');
INSERT INTO `scm_operation_log` VALUES (57, '2026-03-26 21:46:04', 'system', '删除', '删除供应商资质: INSP-2025001', 'success', '112.96.35.179', '供应商资质', 'INSP-2025001', '2026-03-26 21:46:04');
INSERT INTO `scm_operation_log` VALUES (58, '2026-03-26 21:46:07', 'system', '删除', '删除供应商资质: INSP-2025002', 'success', '112.96.35.179', '供应商资质', 'INSP-2025002', '2026-03-26 21:46:07');
INSERT INTO `scm_operation_log` VALUES (59, '2026-03-26 21:46:14', 'system', '删除', '删除供应商资质: 666666', 'success', '112.96.35.179', '供应商资质', '666666', '2026-03-26 21:46:14');
INSERT INTO `scm_operation_log` VALUES (60, '2026-03-26 21:46:16', 'system', '删除', '删除供应商资质: 2222222222', 'success', '112.96.35.179', '供应商资质', '2222222222', '2026-03-26 21:46:16');
INSERT INTO `scm_operation_log` VALUES (61, '2026-03-26 21:46:19', 'system', '删除', '删除供应商资质: 53623452', 'success', '112.96.35.179', '供应商资质', '53623452', '2026-03-26 21:46:19');
INSERT INTO `scm_operation_log` VALUES (62, '2026-03-26 21:46:21', 'system', '删除', '删除供应商资质: 913524356', 'success', '112.96.35.179', '供应商资质', '913524356', '2026-03-26 21:46:21');
INSERT INTO `scm_operation_log` VALUES (63, '2026-03-26 21:46:36', 'system', '删除', '删除供应商资质: 1111111111111', 'success', '112.96.35.179', '供应商资质', '1111111111111', '2026-03-26 21:46:36');
INSERT INTO `scm_operation_log` VALUES (64, '2026-03-26 21:46:52', 'system', '删除', '删除供应商: 上海医疗器械有限公司', 'success', '112.96.35.179', '供应商维护', NULL, '2026-03-26 21:46:52');
INSERT INTO `scm_operation_log` VALUES (65, '2026-03-26 21:46:54', 'system', '删除', '删除供应商: 北京康健医药有限公司', 'success', '112.96.35.179', '供应商维护', NULL, '2026-03-26 21:46:54');
INSERT INTO `scm_operation_log` VALUES (66, '2026-03-26 21:46:56', 'system', '删除', '删除供应商: 南昌有限公司', 'success', '112.96.35.179', '供应商维护', 'SUP202603160001', '2026-03-26 21:46:56');
INSERT INTO `scm_operation_log` VALUES (67, '2026-03-26 21:46:57', 'system', '删除', '删除供应商: 昆明有限公司', 'success', '112.96.35.179', '供应商维护', 'SUP202603160002', '2026-03-26 21:46:57');
INSERT INTO `scm_operation_log` VALUES (68, '2026-03-26 21:47:20', 'system', '删除', '删除物资字典: 体温计', 'success', '112.96.35.179', '物资字典', 'MAT009', '2026-03-26 21:47:20');
INSERT INTO `scm_operation_log` VALUES (69, '2026-03-26 21:47:22', 'system', '删除', '删除物资字典: 棉签', 'success', '112.96.35.179', '物资字典', 'MAT010', '2026-03-26 21:47:22');
INSERT INTO `scm_operation_log` VALUES (70, '2026-03-26 21:47:24', 'system', '删除', '删除物资字典: Disposable Syringe', 'success', '112.96.35.179', '物资字典', 'MAT001', '2026-03-26 21:47:24');
INSERT INTO `scm_operation_log` VALUES (71, '2026-03-26 21:47:26', 'system', '删除', '删除物资字典: 医用手套', 'success', '112.96.35.179', '物资字典', 'MAT202603180002', '2026-03-26 21:47:26');
INSERT INTO `scm_operation_log` VALUES (72, '2026-03-26 21:47:27', 'system', '删除', '删除物资字典: 一次性注射器', 'success', '112.96.35.179', '物资字典', 'MAT202603180001', '2026-03-26 21:47:27');
INSERT INTO `scm_operation_log` VALUES (73, '2026-03-26 21:47:28', 'system', '删除', '删除物资字典: 医用口罩', 'success', '112.96.35.179', '物资字典', 'MAT003', '2026-03-26 21:47:28');
INSERT INTO `scm_operation_log` VALUES (74, '2026-03-26 21:47:30', 'system', '删除', '删除物资字典: 一次性手套', 'success', '112.96.35.179', '物资字典', 'MAT004', '2026-03-26 21:47:30');
INSERT INTO `scm_operation_log` VALUES (75, '2026-03-26 21:47:33', 'system', '删除', '删除物资字典: 注射器', 'success', '112.96.35.179', '物资字典', 'MAT005', '2026-03-26 21:47:33');
INSERT INTO `scm_operation_log` VALUES (76, '2026-03-26 21:47:34', 'system', '删除', '删除物资字典: 输液器', 'success', '112.96.35.179', '物资字典', 'MAT006', '2026-03-26 21:47:34');
INSERT INTO `scm_operation_log` VALUES (77, '2026-03-26 21:47:36', 'system', '删除', '删除物资字典: 纱布', 'success', '112.96.35.179', '物资字典', 'MAT007', '2026-03-26 21:47:36');
INSERT INTO `scm_operation_log` VALUES (78, '2026-03-26 21:47:37', 'system', '删除', '删除物资字典: 消毒液', 'success', '112.96.35.179', '物资字典', 'MAT008', '2026-03-26 21:47:37');
INSERT INTO `scm_operation_log` VALUES (79, '2026-03-26 21:47:39', 'system', '删除', '删除物资字典: Medical Mask', 'success', '112.96.35.179', '物资字典', 'MAT002', '2026-03-26 21:47:39');
INSERT INTO `scm_operation_log` VALUES (80, '2026-03-26 22:05:11', 'system', '维护', '新增供应商: 广州国科腾健生物科技有限公司', 'success', '112.96.35.179', '供应商维护', 'SUP202603260001', '2026-03-26 22:05:11');
INSERT INTO `scm_operation_log` VALUES (81, '2026-03-26 22:23:03', 'system', '维护', '新增供应商: 深圳华康生物医学工程有限公司', 'success', '112.96.35.179', '供应商维护', 'SUP202603260002', '2026-03-26 22:23:03');
INSERT INTO `scm_operation_log` VALUES (82, '2026-03-26 22:24:58', 'system', '删除', '删除供应商: 广州国科腾健生物科技有限公司', 'success', '112.96.35.179', '供应商维护', 'SUP202603260001', '2026-03-26 22:24:58');
INSERT INTO `scm_operation_log` VALUES (83, '2026-03-26 22:25:00', 'system', '删除', '删除供应商: 深圳华康生物医学工程有限公司', 'success', '112.96.35.179', '供应商维护', 'SUP202603260002', '2026-03-26 22:25:00');

-- ----------------------------
-- Table structure for scm_product_price_adjustment
-- ----------------------------
DROP TABLE IF EXISTS `scm_product_price_adjustment`;
CREATE TABLE `scm_product_price_adjustment`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `product_id` bigint NULL DEFAULT NULL,
  `material_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `material_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `specification` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `model` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `min_package` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `unit` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `purchase_price` decimal(10, 2) NULL DEFAULT NULL,
  `registration_number` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `supplier` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `manufacturer` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `adjustment_reason` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `current_price` decimal(10, 2) NULL DEFAULT NULL,
  `cost_price` decimal(10, 2) NULL DEFAULT NULL,
  `old_price` decimal(10, 2) NULL DEFAULT NULL,
  `new_price` decimal(10, 2) NULL DEFAULT NULL,
  `adjustment_amount` decimal(10, 2) NULL DEFAULT NULL,
  `adjustment_percent` decimal(10, 2) NULL DEFAULT NULL,
  `adjusted_by` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `adjusted_at` datetime NULL DEFAULT NULL,
  `create_time` datetime NULL DEFAULT NULL,
  `update_time` datetime NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 12 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of scm_product_price_adjustment
-- ----------------------------
INSERT INTO `scm_product_price_adjustment` VALUES (1, NULL, 'YZS-001', '一次性注射器', '医用耗材', '10ml', 'SYR-10', '100支/盒', '支', 0.45, '国械注准201526400846', '山东威高集团', '山东威高集团有限公司', '成本上涨', 0.85, 0.45, 0.80, NULL, 0.05, 6.25, '张三', '2026-03-17 20:32:12', '2026-03-17 20:32:12', '2026-03-17 20:32:12');
INSERT INTO `scm_product_price_adjustment` VALUES (2, NULL, 'YZS-002', '输液器', '医用耗材', '500ml', 'IV-500', '50套/盒', '套', 2.80, '国械注准201626400977', '山东威高集团', '山东威高集团有限公司', '市场竞争', 4.50, 2.80, 4.80, NULL, -0.30, -6.25, '李四', '2026-03-17 20:32:12', '2026-03-17 20:32:12', '2026-03-17 20:32:12');
INSERT INTO `scm_product_price_adjustment` VALUES (3, NULL, 'YZS-003', '医用棉签', '医用耗材', '100支/包', 'QJ-100', '50包/盒', '包', 1.20, '国械注准201726400472', '稳健医疗用品', '稳健医疗用品股份有限公司', '促销活动', 2.00, 1.20, 2.20, NULL, -0.20, -9.09, '王五', '2026-03-17 20:32:12', '2026-03-17 20:32:12', '2026-03-17 20:32:12');
INSERT INTO `scm_product_price_adjustment` VALUES (4, NULL, 'YZS-004', '酒精棉球', '医用耗材', '50g/瓶', 'JQ-50', '30瓶/盒', '瓶', 2.00, '国械注准201826400481', '稳健医疗用品', '稳健医疗用品股份有限公司', '库存清理', 3.50, 2.00, 3.20, NULL, 0.30, 9.38, '赵六', '2026-03-17 20:32:12', '2026-03-17 20:32:12', '2026-03-17 20:32:12');
INSERT INTO `scm_product_price_adjustment` VALUES (5, NULL, 'YLQ-001', '碘伏消毒液', '医用耗材', '500ml', 'DF-500', '20瓶/箱', '瓶', 7.50, '国械注准201926400459', '利尔康消毒科技', '利尔康消毒科技有限公司', '新品上市', 12.00, 7.50, 10.00, NULL, 2.00, 20.00, '孙七', '2026-03-17 20:32:12', '2026-03-17 20:32:12', '2026-03-17 20:32:12');
INSERT INTO `scm_product_price_adjustment` VALUES (6, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '新品上市', NULL, NULL, 0.85, NULL, 1.70, 200.00, NULL, '2026-03-17 23:52:05', '2026-03-17 23:52:05', '2026-03-17 23:52:05');
INSERT INTO `scm_product_price_adjustment` VALUES (7, 9, 'MAT001', 'Disposable Syringe', 'Medical Device', '1ml', 'SYR-001', '100pcs/box', 'pc', 2.50, 'SH20200001', 'Shanghai Medical Device Co.', 'Shanghai Medical Device Co.', '成本上涨', NULL, NULL, 2.50, 22.50, 20.00, 800.00, NULL, '2026-03-18 16:47:41', '2026-03-18 16:47:41', '2026-03-18 16:47:41');
INSERT INTO `scm_product_price_adjustment` VALUES (8, 9, 'MAT001', 'Disposable Syringe', 'Medical Device', '1ml', 'SYR-001', '100pcs/box', 'pc', 22.50, 'SH20200001', 'Shanghai Medical Device Co.', 'Shanghai Medical Device Co.', '其他原因', NULL, NULL, 22.50, 22.50, 0.00, 0.00, NULL, '2026-03-26 10:39:01', '2026-03-26 10:39:01', '2026-03-26 10:39:01');
INSERT INTO `scm_product_price_adjustment` VALUES (9, 9, 'MAT001', 'Disposable Syringe', 'Medical Device', '1ml', 'SYR-001', '100pcs/box', 'pc', 22.50, 'SH20200001', 'Shanghai Medical Device Co.', 'Shanghai Medical Device Co.', '其他原因', NULL, NULL, 22.50, 2333.50, 2311.00, 10271.11, NULL, '2026-03-26 10:39:17', '2026-03-26 10:39:17', '2026-03-26 10:39:17');
INSERT INTO `scm_product_price_adjustment` VALUES (10, 9, 'MAT001', 'Disposable Syringe', 'Medical Device', '1ml', 'SYR-001', '100pcs/box', 'pc', 2333.50, 'SH20200001', 'Shanghai Medical Device Co.', 'Shanghai Medical Device Co.', '成本上涨', NULL, NULL, 2333.50, 2333.50, 0.00, 0.00, NULL, '2026-03-26 10:40:23', '2026-03-26 10:40:23', '2026-03-26 10:40:23');
INSERT INTO `scm_product_price_adjustment` VALUES (11, 9, 'MAT001', 'Disposable Syringe', 'Medical Device', '1ml', 'SYR-001', '100pcs/box', 'pc', 2333.50, 'SH20200001', 'Shanghai Medical Device Co.', 'Shanghai Medical Device Co.', '其他原因: 123', NULL, NULL, 2333.50, 2333.50, 0.00, 0.00, NULL, '2026-03-26 10:41:13', '2026-03-26 10:41:13', '2026-03-26 10:41:13');

-- ----------------------------
-- Table structure for scm_purchase_order
-- ----------------------------
DROP TABLE IF EXISTS `scm_purchase_order`;
CREATE TABLE `scm_purchase_order`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `order_number` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '订单编号',
  `department_id` bigint NOT NULL COMMENT '部门ID',
  `department_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '部门名称',
  `supplier_id` bigint NOT NULL COMMENT '供应商ID',
  `supplier_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '供应商名称',
  `operator_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '操作人名称',
  `plan_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '计划类型',
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '状态',
  `remark` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '备注',
  `reject_reason` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '拒绝原因',
  `total_amount` decimal(12, 2) NOT NULL DEFAULT 0.00 COMMENT '总金额',
  `item_count` int NOT NULL DEFAULT 0 COMMENT '物品数量',
  `submit_time` datetime NULL DEFAULT NULL COMMENT '提交时间',
  `audit_time` datetime NULL DEFAULT NULL COMMENT '审核时间',
  `create_time` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_scm_purchase_order_number`(`order_number` ASC) USING BTREE,
  INDEX `idx_scm_purchase_order_status`(`status` ASC) USING BTREE,
  INDEX `idx_scm_purchase_order_supplier`(`supplier_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 16 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '采购单主表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of scm_purchase_order
-- ----------------------------
INSERT INTO `scm_purchase_order` VALUES (4, 'PO20240001', 1, 'Head Office', 1, 'Shanghai Medical Device Co.', 'admin', 'Regular Purchase', 'completed', 'Regular medical supplies purchase', NULL, 1250.00, 2, '2026-03-17 17:47:51', '2026-03-17 17:47:51', '2026-03-17 17:47:51', '2026-03-17 17:47:51');
INSERT INTO `scm_purchase_order` VALUES (5, 'PO-20260301-0001', 1, '内科', 1, '上海医疗器械有限公司', '张三', 'monthly', 'DRAFT', '月度常规采购', NULL, 0.00, 0, NULL, NULL, '2026-03-01 09:00:00', '2026-03-01 09:00:00');
INSERT INTO `scm_purchase_order` VALUES (6, 'PO-20260305-0002', 2, '外科', 1, '上海医疗器械有限公司', '李四', 'weekly', 'WAIT_AUDIT', '外科耗材补充', NULL, 0.00, 0, NULL, NULL, '2026-03-05 10:00:00', '2026-03-05 10:00:00');
INSERT INTO `scm_purchase_order` VALUES (7, 'PO-20260310-0003', 3, '急诊科', 6, '昆明有限公司', '王五', 'emergency', 'REJECTED', '急诊紧急采购', NULL, 0.00, 0, NULL, NULL, '2026-03-10 14:00:00', '2026-03-10 14:00:00');
INSERT INTO `scm_purchase_order` VALUES (8, 'PO202603170001', 1, '1', 6, '昆明有限公司', '李二', 'monthly', '待收货', '', NULL, 2.50, 1, '2026-03-17 23:31:51', '2026-03-26 10:45:57', '2026-03-17 23:31:51', '2026-03-26 10:45:57');
INSERT INTO `scm_purchase_order` VALUES (9, 'PO202603180001', 1, '1', 1, '上海医疗器械有限公司', '张数', 'weekly', '待收货', '', NULL, 25.50, 2, '2026-03-18 16:48:44', '2026-03-26 10:45:57', '2026-03-18 16:48:44', '2026-03-26 10:45:57');
INSERT INTO `scm_purchase_order` VALUES (10, 'PO202403180001', 1, '手术室', 1, '上海医疗器械有限公司', '管理员', '常规采购', '待收货', NULL, NULL, 255.00, 2, NULL, NULL, '2026-03-18 16:52:13', '2026-03-18 16:52:13');
INSERT INTO `scm_purchase_order` VALUES (11, 'PO202403180002', 2, '内科', 2, '北京康健医药有限公司', '管理员', '紧急采购', '待收货', NULL, NULL, 15.00, 2, NULL, NULL, '2026-03-18 16:52:13', '2026-03-18 16:52:13');
INSERT INTO `scm_purchase_order` VALUES (12, 'PO202603180002', 1, '1', 6, '昆明有限公司', '李', 'monthly', '待收货', '', NULL, 3.50, 1, '2026-03-18 20:56:43', '2026-03-18 21:08:46', '2026-03-18 20:56:43', '2026-03-18 21:08:46');
INSERT INTO `scm_purchase_order` VALUES (13, 'PO202603180003', 1, '1', 1, '上海医疗器械有限公司', '无', 'emergency', '待收货', '', NULL, 834.00, 5, '2026-03-18 22:01:03', '2026-03-26 10:45:57', '2026-03-18 21:39:46', '2026-03-26 10:45:57');
INSERT INTO `scm_purchase_order` VALUES (14, 'PO202603260001', 1, '1', 6, '昆明有限公司', '测试', 'monthly', '已驳回', '测试', NULL, 7163.00, 5, '2026-03-26 10:45:25', '2026-03-26 10:45:51', '2026-03-26 10:45:24', '2026-03-26 10:45:51');
INSERT INTO `scm_purchase_order` VALUES (15, 'PO202603260002', 1, '1', 6, '昆明有限公司', '测试', 'monthly', '待收货', '测试', NULL, 7163.00, 5, '2026-03-26 10:45:26', '2026-03-26 10:45:47', '2026-03-26 10:45:25', '2026-03-26 10:45:47');

-- ----------------------------
-- Table structure for scm_purchase_order_item
-- ----------------------------
DROP TABLE IF EXISTS `scm_purchase_order_item`;
CREATE TABLE `scm_purchase_order_item`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `purchase_order_id` bigint NOT NULL COMMENT '采购订单ID',
  `material_id` bigint NOT NULL COMMENT '物料ID',
  `material_code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '物料编码',
  `material_name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '物料名称',
  `specification` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '规格',
  `model` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '型号',
  `unit` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '单位',
  `manufacturer` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '制造商',
  `supplier_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '供应商名称',
  `registration_number` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '注册号',
  `unit_price` decimal(12, 2) NOT NULL COMMENT '单价',
  `quantity` int NOT NULL COMMENT '数量',
  `received_quantity` int NOT NULL DEFAULT 0 COMMENT '已收货数量',
  `stocked_quantity` int NOT NULL DEFAULT 0 COMMENT '已入库数量',
  `amount` decimal(12, 2) NOT NULL COMMENT '金额',
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '状态',
  `create_time` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_scm_purchase_order_item_order`(`purchase_order_id` ASC) USING BTREE,
  INDEX `idx_scm_purchase_order_item_material`(`material_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 32 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '采购单明细' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of scm_purchase_order_item
-- ----------------------------
INSERT INTO `scm_purchase_order_item` VALUES (7, 1, 1, 'MAT001', 'Disposable Syringe', '1ml', 'SYR-001', 'pc', 'Shanghai Medical Device Co.', 'Shanghai Medical Device Co.', 'SH20200001', 2.50, 200, 200, 200, 500.00, 'pending', '2026-03-17 17:47:51', '2026-03-17 17:47:51');
INSERT INTO `scm_purchase_order_item` VALUES (8, 1, 2, 'MAT002', 'Medical Mask', 'N95', 'MASK-001', 'pc', 'Shanghai Medical Device Co.', 'Shanghai Medical Device Co.', 'SH20200001', 3.00, 250, 250, 250, 750.00, 'pending', '2026-03-17 17:47:51', '2026-03-17 17:47:51');
INSERT INTO `scm_purchase_order_item` VALUES (9, 8, 9, 'MAT001', 'Disposable Syringe', '1ml', 'SYR-001', 'pc', 'Shanghai Medical Device Co.', 'Shanghai Medical Device Co.', 'SH20200001', 2.50, 1, 0, 0, 2.50, '待提交', '2026-03-17 23:31:51', '2026-03-17 23:31:51');
INSERT INTO `scm_purchase_order_item` VALUES (10, 9, 9, 'MAT001', 'Disposable Syringe', '1ml', 'SYR-001', 'pc', 'Shanghai Medical Device Co.', 'Shanghai Medical Device Co.', 'SH20200001', 22.50, 1, 0, 0, 22.50, '待提交', '2026-03-18 16:48:44', '2026-03-18 16:48:44');
INSERT INTO `scm_purchase_order_item` VALUES (11, 9, 10, 'MAT002', 'Medical Mask', 'N95', 'MASK-001', 'pc', 'Shanghai Medical Device Co.', 'Shanghai Medical Device Co.', 'SH20200001', 3.00, 1, 0, 0, 3.00, '待提交', '2026-03-18 16:48:44', '2026-03-18 16:48:44');
INSERT INTO `scm_purchase_order_item` VALUES (12, 10, 11, 'MAT003', '医用口罩', 'N95', 'N95-001', '盒', '医疗用品有限公司', '上海医疗器械有限公司', '国械注准202326400123', 25.00, 10, 0, 0, 250.00, '待收货', '2026-03-18 16:52:13', '2026-03-18 16:52:13');
INSERT INTO `scm_purchase_order_item` VALUES (13, 10, 12, 'MAT004', '一次性手套', '乳胶 M号', 'GL-301', '双', '乳胶制品厂', '上海医疗器械有限公司', '国械注准202326400789', 3.50, 10, 0, 0, 35.00, '待收货', '2026-03-18 16:52:13', '2026-03-18 16:52:13');
INSERT INTO `scm_purchase_order_item` VALUES (14, 11, 13, 'MAT005', '注射器', '5ml', 'SY-605', '支', '注射器制造厂', '北京康健医药有限公司', '国械注准202326409012', 1.20, 10, 0, 0, 12.00, '待收货', '2026-03-18 16:52:13', '2026-03-18 16:52:13');
INSERT INTO `scm_purchase_order_item` VALUES (15, 11, 10, 'MAT002', 'Medical Mask', 'N95', 'MASK-001', 'pc', 'Shanghai Medical Device Co.', '北京康健医药有限公司', 'SH20200001', 3.00, 1, 0, 0, 3.00, '待收货', '2026-03-18 16:52:13', '2026-03-18 16:52:13');
INSERT INTO `scm_purchase_order_item` VALUES (16, 12, 12, 'MAT004', '一次性手套', '乳胶 M号', 'GL-301', '双', '乳胶制品厂', '上海医疗器械有限公司', '国械注准202326400789', 3.50, 1, 0, 0, 3.50, '待提交', '2026-03-18 20:56:43', '2026-03-18 20:56:43');
INSERT INTO `scm_purchase_order_item` VALUES (17, 13, 9, 'MAT001', 'Disposable Syringe', '1ml', 'SYR-001', 'pc', 'Shanghai Medical Device Co.', 'Shanghai Medical Device Co.', 'SH20200001', 22.50, 17, 0, 0, 382.50, '待提交', '2026-03-18 21:39:46', '2026-03-18 21:39:46');
INSERT INTO `scm_purchase_order_item` VALUES (18, 13, 10, 'MAT002', 'Medical Mask', 'N95', 'MASK-001', 'pc', 'Shanghai Medical Device Co.', 'Shanghai Medical Device Co.', 'SH20200001', 3.00, 18, 0, 0, 54.00, '待提交', '2026-03-18 21:39:46', '2026-03-18 21:39:46');
INSERT INTO `scm_purchase_order_item` VALUES (19, 13, 12, 'MAT004', '一次性手套', '乳胶 M号', 'GL-301', '双', '乳胶制品厂', '上海医疗器械有限公司', '国械注准202326400789', 3.50, 19, 0, 0, 66.50, '待提交', '2026-03-18 21:39:46', '2026-03-18 21:39:46');
INSERT INTO `scm_purchase_order_item` VALUES (20, 13, 21, 'MAT202603180001', '一次性注射器', '2ml', '2ml', '支', '上海医疗器械厂', '上海医疗器械有限公司', 'REG-2ML-001', 1.00, 11, 0, 0, 11.00, '待提交', '2026-03-18 21:39:46', '2026-03-18 21:39:46');
INSERT INTO `scm_purchase_order_item` VALUES (21, 13, 17, 'MAT009', '体温计', '电子', 'TM-550', '支', '医疗器械公司', '昆明有限公司', '国械注准202326405678', 32.00, 10, 0, 0, 320.00, '待提交', '2026-03-18 21:39:46', '2026-03-18 21:39:46');
INSERT INTO `scm_purchase_order_item` VALUES (22, 14, 9, 'MAT001', 'Disposable Syringe', '1ml', 'SYR-001', 'pc', 'Shanghai Medical Device Co.', 'Shanghai Medical Device Co.', 'SH20200001', 2333.50, 3, 0, 0, 7000.50, '待提交', '2026-03-26 10:45:24', '2026-03-26 10:45:24');
INSERT INTO `scm_purchase_order_item` VALUES (23, 14, 10, 'MAT002', 'Medical Mask', 'N95', 'MASK-001', 'pc', 'Shanghai Medical Device Co.', 'Shanghai Medical Device Co.', 'SH20200001', 3.00, 4, 0, 0, 12.00, '待提交', '2026-03-26 10:45:24', '2026-03-26 10:45:24');
INSERT INTO `scm_purchase_order_item` VALUES (24, 14, 12, 'MAT004', '一次性手套', '乳胶 M号', 'GL-301', '双', '乳胶制品厂', '上海医疗器械有限公司', '国械注准202326400789', 3.50, 5, 0, 0, 17.50, '待提交', '2026-03-26 10:45:24', '2026-03-26 10:45:24');
INSERT INTO `scm_purchase_order_item` VALUES (25, 14, 21, 'MAT202603180001', '一次性注射器', '2ml', '2ml', '支', '上海医疗器械厂', '上海医疗器械有限公司', 'REG-2ML-001', 1.00, 5, 0, 0, 5.00, '待提交', '2026-03-26 10:45:24', '2026-03-26 10:45:24');
INSERT INTO `scm_purchase_order_item` VALUES (26, 14, 17, 'MAT009', '体温计', '电子', 'TM-550', '支', '医疗器械公司', '昆明有限公司', '国械注准202326405678', 32.00, 4, 0, 0, 128.00, '待提交', '2026-03-26 10:45:24', '2026-03-26 10:45:24');
INSERT INTO `scm_purchase_order_item` VALUES (27, 15, 9, 'MAT001', 'Disposable Syringe', '1ml', 'SYR-001', 'pc', 'Shanghai Medical Device Co.', 'Shanghai Medical Device Co.', 'SH20200001', 2333.50, 3, 0, 0, 7000.50, '待提交', '2026-03-26 10:45:25', '2026-03-26 10:45:25');
INSERT INTO `scm_purchase_order_item` VALUES (28, 15, 10, 'MAT002', 'Medical Mask', 'N95', 'MASK-001', 'pc', 'Shanghai Medical Device Co.', 'Shanghai Medical Device Co.', 'SH20200001', 3.00, 4, 0, 0, 12.00, '待提交', '2026-03-26 10:45:25', '2026-03-26 10:45:25');
INSERT INTO `scm_purchase_order_item` VALUES (29, 15, 12, 'MAT004', '一次性手套', '乳胶 M号', 'GL-301', '双', '乳胶制品厂', '上海医疗器械有限公司', '国械注准202326400789', 3.50, 5, 0, 0, 17.50, '待提交', '2026-03-26 10:45:25', '2026-03-26 10:45:25');
INSERT INTO `scm_purchase_order_item` VALUES (30, 15, 21, 'MAT202603180001', '一次性注射器', '2ml', '2ml', '支', '上海医疗器械厂', '上海医疗器械有限公司', 'REG-2ML-001', 1.00, 5, 0, 0, 5.00, '待提交', '2026-03-26 10:45:25', '2026-03-26 10:45:25');
INSERT INTO `scm_purchase_order_item` VALUES (31, 15, 17, 'MAT009', '体温计', '电子', 'TM-550', '支', '医疗器械公司', '昆明有限公司', '国械注准202326405678', 32.00, 4, 0, 0, 128.00, '待提交', '2026-03-26 10:45:25', '2026-03-26 10:45:25');

-- ----------------------------
-- Table structure for scm_purchase_receive
-- ----------------------------
DROP TABLE IF EXISTS `scm_purchase_receive`;
CREATE TABLE `scm_purchase_receive`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `receive_number` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `purchase_order_id` bigint NOT NULL,
  `order_number` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `supplier_id` bigint NOT NULL,
  `supplier_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `supplier_code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `department_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `buyer` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `contact_person` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `contact_phone` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `order_date` date NULL DEFAULT NULL,
  `expected_delivery_date` date NULL DEFAULT NULL,
  `actual_delivery_date` date NULL DEFAULT NULL,
  `receiver` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `total_amount` decimal(12, 2) NOT NULL DEFAULT 0.00,
  `item_count` int NOT NULL DEFAULT 0,
  `remark` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `create_time` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_scm_purchase_receive_number`(`receive_number` ASC) USING BTREE,
  INDEX `idx_scm_purchase_receive_order`(`purchase_order_id` ASC) USING BTREE,
  INDEX `idx_scm_purchase_receive_status`(`status` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '采购收货单' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of scm_purchase_receive
-- ----------------------------
INSERT INTO `scm_purchase_receive` VALUES (2, 'RCV20240001', 1, 'PO20240001', 1, 'Shanghai Medical Device Co.', 'SUP001', 'Head Office', 'admin', 'Manager Zhang', '13800138000', '2026-03-17', '2026-03-17', '2026-03-17', 'admin', 'completed', 1250.00, 2, 'All goods received', '2026-03-17 17:47:51', '2026-03-17 17:47:51');

-- ----------------------------
-- Table structure for scm_purchase_receive_item
-- ----------------------------
DROP TABLE IF EXISTS `scm_purchase_receive_item`;
CREATE TABLE `scm_purchase_receive_item`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `receive_id` bigint NOT NULL,
  `purchase_order_item_id` bigint NOT NULL,
  `product_code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `product_name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `specification` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `model` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `manufacturer` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `registration_number` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `unit` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `price` decimal(12, 2) NOT NULL,
  `quantity` int NOT NULL,
  `actual_received_quantity` int NOT NULL,
  `amount` decimal(12, 2) NOT NULL,
  `batch_number` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `production_date` date NULL DEFAULT NULL,
  `expiry_date` date NULL DEFAULT NULL,
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `shortage_reason` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `create_time` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_scm_purchase_receive_item_receive`(`receive_id` ASC) USING BTREE,
  INDEX `idx_scm_purchase_receive_item_order_item`(`purchase_order_item_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '采购收货明细' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of scm_purchase_receive_item
-- ----------------------------
INSERT INTO `scm_purchase_receive_item` VALUES (1, 1, 1, 'MAT001', 'Disposable Syringe', '1ml', 'SYR-001', 'Shanghai Medical Device Co.', 'SH20200001', 'pc', 2.50, 200, 200, 500.00, 'BATCH001', '2026-03-17', '2028-03-17', 'completed', NULL, '2026-03-17 17:47:51', '2026-03-17 17:47:51');
INSERT INTO `scm_purchase_receive_item` VALUES (2, 1, 2, 'MAT002', 'Medical Mask', 'N95', 'MASK-001', 'Shanghai Medical Device Co.', 'SH20200001', 'pc', 3.00, 250, 250, 750.00, 'BATCH002', '2026-03-17', '2028-03-17', 'completed', NULL, '2026-03-17 17:47:51', '2026-03-17 17:47:51');

-- ----------------------------
-- Table structure for scm_stock_in_item
-- ----------------------------
DROP TABLE IF EXISTS `scm_stock_in_item`;
CREATE TABLE `scm_stock_in_item`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `stock_in_order_id` bigint NOT NULL,
  `receive_item_id` bigint NULL DEFAULT NULL,
  `material_id` bigint NULL DEFAULT NULL,
  `material_code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `material_name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `material_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `specification` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `model` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `min_package` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `unit` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `purchase_price` decimal(12, 2) NOT NULL,
  `order_quantity` int NOT NULL,
  `stock_in_quantity` int NOT NULL,
  `purchase_amount` decimal(12, 2) NOT NULL,
  `supplier_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `manufacturer` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `registration_number` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `batch_number` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `production_date` date NOT NULL,
  `expiry_date` date NOT NULL,
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `remark` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `create_time` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `inventory_id` int NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_scm_stock_in_item_order`(`stock_in_order_id` ASC) USING BTREE,
  INDEX `idx_scm_stock_in_item_material`(`material_code` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '入库单明细' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of scm_stock_in_item
-- ----------------------------
INSERT INTO `scm_stock_in_item` VALUES (1, 1, 1, 1, 'MAT001', 'Disposable Syringe', 'Medical Device', '1ml', 'SYR-001', '100pcs/box', 'pc', 2.50, 200, 200, 500.00, 'Shanghai Medical Device Co.', 'Shanghai Medical Device Co.', 'SH20200001', 'BATCH001', '2026-03-17', '2028-03-17', 'completed', NULL, '2026-03-17 17:47:51', '2026-03-26 10:52:38', 1);
INSERT INTO `scm_stock_in_item` VALUES (2, 1, 2, 2, 'MAT002', 'Medical Mask', 'Medical Device', 'N95', 'MASK-001', '50pcs/box', 'pc', 3.00, 250, 250, 750.00, 'Shanghai Medical Device Co.', 'Shanghai Medical Device Co.', 'SH20200001', 'BATCH002', '2026-03-17', '2028-03-17', 'completed', NULL, '2026-03-17 17:47:51', '2026-03-26 10:52:41', 1);
INSERT INTO `scm_stock_in_item` VALUES (3, 4, NULL, 11, 'MAT003', '医用口罩', NULL, 'N95', 'N95-001', '10只/盒', '盒', 25.00, 10, 10, 250.00, '上海医疗器械有限公司', '医疗用品有限公司', '国械注准202326400123', 'B20240318', '2024-01-01', '2026-01-01', '已完成', NULL, '2026-03-18 17:05:36', '2026-03-26 10:52:43', 1);
INSERT INTO `scm_stock_in_item` VALUES (4, 5, NULL, 13, 'MAT005', '注射器', NULL, '5ml', 'SY-605', '100支/箱', '支', 1.20, 10, 10, 12.00, '北京康健医药有限公司', '注射器制造厂', '国械注准202326409012', 'B20240318-2', '2024-02-01', '2027-02-01', '已完成', NULL, '2026-03-18 17:05:36', '2026-03-26 10:52:48', 2);
INSERT INTO `scm_stock_in_item` VALUES (5, 1, 1, 1, 'MAT001', 'Disposable Syringe', 'Medical Device', '1ml', 'SYR-001', '100pcs/box', 'pc', 2.50, 200, 200, 500.00, 'Shanghai Medical Device Co.', 'Shanghai Medical Device Co.', 'SH20200001', 'BATCH001', '2026-03-17', '2028-03-17', 'completed', NULL, '2026-03-17 17:47:51', '2026-03-26 10:52:38', 1);

-- ----------------------------
-- Table structure for scm_stock_in_order
-- ----------------------------
DROP TABLE IF EXISTS `scm_stock_in_order`;
CREATE TABLE `scm_stock_in_order`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `stock_in_number` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `receive_id` bigint NULL DEFAULT NULL,
  `receive_number` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `purchase_order_id` bigint NULL DEFAULT NULL,
  `order_number` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `stock_in_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `department_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `operator_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `supplier_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `stock_in_date` date NOT NULL,
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `material_count` int NOT NULL DEFAULT 0,
  `total_amount` decimal(12, 2) NOT NULL DEFAULT 0.00,
  `remark` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `create_time` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_scm_stock_in_number`(`stock_in_number` ASC) USING BTREE,
  INDEX `idx_scm_stock_in_order_receive`(`receive_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '入库单主表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of scm_stock_in_order
-- ----------------------------
INSERT INTO `scm_stock_in_order` VALUES (1, 'STKIN20240001', 1, 'RCV20240001', 1, 'PO20240001', 'Purchase Stock In', 'Head Office', 'admin', 'Shanghai Medical Device Co.', '2026-03-17', 'completed', 2, 1250.00, 'Purchase stock in', '2026-03-17 17:47:51', '2026-03-17 17:47:51');
INSERT INTO `scm_stock_in_order` VALUES (4, 'SI202403180001', NULL, NULL, NULL, NULL, '初始化入库', '手术室', '管理员', '上海医疗器械有限公司', '2026-03-18', '已完成', 1, 250.00, NULL, '2026-03-18 17:05:36', '2026-03-18 17:05:36');
INSERT INTO `scm_stock_in_order` VALUES (5, 'SI202403180002', NULL, NULL, NULL, NULL, '初始化入库', '内科', '管理员', '北京康健医药有限公司', '2026-03-18', '已完成', 1, 12.00, NULL, '2026-03-18 17:05:36', '2026-03-18 17:05:36');

-- ----------------------------
-- Table structure for scm_stock_out_item
-- ----------------------------
DROP TABLE IF EXISTS `scm_stock_out_item`;
CREATE TABLE `scm_stock_out_item`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `stock_out_order_id` bigint NOT NULL COMMENT '出库订单ID',
  `inventory_id` bigint NOT NULL COMMENT '库存ID',
  `material_id` bigint NULL DEFAULT NULL COMMENT '物料ID',
  `material_code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '物料编码',
  `material_name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '物料名称',
  `material_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '物料类型',
  `specification` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '规格',
  `model` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '型号',
  `unit` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '单位',
  `supplier` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '供应商',
  `manufacturer` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '制造商',
  `registration_number` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '注册号',
  `batch_number` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '批号',
  `production_date` date NULL DEFAULT NULL COMMENT '生产日期',
  `expiry_date` date NULL DEFAULT NULL COMMENT '有效期至',
  `unit_price` decimal(12, 2) NULL DEFAULT NULL COMMENT '单价',
  `outbound_quantity` int NOT NULL COMMENT '出库数量',
  `outbound_date` date NOT NULL COMMENT '出库日期',
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '状态',
  `undo_status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '撤销状态',
  `reason` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '原因',
  `create_time` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_scm_stock_out_item_order`(`stock_out_order_id` ASC) USING BTREE,
  INDEX `idx_scm_stock_out_item_material`(`material_code` ASC) USING BTREE,
  INDEX `idx_scm_stock_out_item_undo`(`undo_status` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '出库单明细' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of scm_stock_out_item
-- ----------------------------
INSERT INTO `scm_stock_out_item` VALUES (1, 1, 1, 1, 'MAT001', 'Disposable Syringe', 'Medical Device', '1ml', 'SYR-001', 'pc', 'Shanghai Medical Device Co.', 'Shanghai Medical Device Co.', 'SH20200001', 'BATCH001', '2026-03-17', '2028-03-17', 2.50, 10, '2026-03-18', '已完成', '可撤销', '常规消耗', '2026-03-18 22:38:25', '2026-03-18 22:38:25');
INSERT INTO `scm_stock_out_item` VALUES (2, 1, 2, 2, 'MAT002', 'Medical Mask', 'Medical Device', 'N95', 'MASK-001', 'pc', 'Shanghai Medical Device Co.', 'Shanghai Medical Device Co.', 'SH20200001', 'BATCH002', '2026-03-17', '2028-03-17', 3.00, 20, '2026-03-18', '已完成', '可撤销', '常规消耗', '2026-03-18 22:38:25', '2026-03-18 22:38:25');
INSERT INTO `scm_stock_out_item` VALUES (3, 2, 1, 1, 'MAT001', 'Disposable Syringe', 'Medical Device', '1ml', 'SYR-001', 'pc', 'Shanghai Medical Device Co.', 'Shanghai Medical Device Co.', 'SH20200001', 'BATCH001', '2026-03-17', '2028-03-17', 2.50, 50, '2026-03-17', '已完成', '可撤销', '手术用量', '2026-03-18 22:38:25', '2026-03-18 22:38:25');
INSERT INTO `scm_stock_out_item` VALUES (4, 3, 2, 2, 'MAT002', 'Medical Mask', 'Medical Device', 'N95', 'MASK-001', 'pc', 'Shanghai Medical Device Co.', 'Shanghai Medical Device Co.', 'SH20200001', 'BATCH002', '2026-03-17', '2028-03-17', 3.00, 5, '2026-03-16', '已完成', '可撤销', '质控消耗', '2026-03-18 22:38:25', '2026-03-18 22:38:25');
INSERT INTO `scm_stock_out_item` VALUES (5, 1, 1, 1, 'MAT003', 'Surgical Gloves', 'Medical Device', 'Size 7.5', 'GLOVE-75', 'pair', 'Shanghai Medical Device Co.', 'Shanghai Medical Device Co.', 'SH20200001', 'BATCH003', '2026-03-15', '2028-03-15', 5.00, 10, '2026-03-15', '已完成', '已撤销', '过量出库', '2026-03-18 22:50:19', '2026-03-18 22:50:19');

-- ----------------------------
-- Table structure for scm_stock_out_order
-- ----------------------------
DROP TABLE IF EXISTS `scm_stock_out_order`;
CREATE TABLE `scm_stock_out_order`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `stock_out_number` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `stock_out_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `department_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `operator_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `reason` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `remark` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `outbound_date` date NOT NULL,
  `create_time` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_scm_stock_out_number`(`stock_out_number` ASC) USING BTREE,
  INDEX `idx_scm_stock_out_date`(`outbound_date` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '出库单主表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of scm_stock_out_order
-- ----------------------------
INSERT INTO `scm_stock_out_order` VALUES (1, 'SO202603180001', 'consumption', '耗材科', '管理员', '已完成', '常规消耗', '今日领用', '2026-03-18', '2026-03-18 22:38:25', '2026-03-18 22:38:25');
INSERT INTO `scm_stock_out_order` VALUES (2, 'SO202603170001', 'consumption', '手术室', '管理员', '已完成', '手术用量', '急诊手术', '2026-03-17', '2026-03-18 22:38:25', '2026-03-18 22:38:25');
INSERT INTO `scm_stock_out_order` VALUES (3, 'SO202603160001', 'quality', '检验科', '管理员', '已完成', '质控消耗', '日常质控', '2026-03-16', '2026-03-18 22:38:25', '2026-03-18 22:38:25');

-- ----------------------------
-- Table structure for scm_transfer_order
-- ----------------------------
DROP TABLE IF EXISTS `scm_transfer_order`;
CREATE TABLE `scm_transfer_order`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `transfer_number` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '调拨单号',
  `from_department_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '调出部门名称',
  `to_department_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '调入部门名称',
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '状态',
  `operator_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '操作人',
  `transfer_date` date NOT NULL COMMENT '调拨日期',
  `create_time` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_scm_transfer_order_number`(`transfer_number` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of scm_transfer_order
-- ----------------------------
INSERT INTO `scm_transfer_order` VALUES (1, 'TR-20260317-0001', '仓库1', '仓库2', 'completed', '张三', '2026-03-17', '2026-03-17 19:01:43');
INSERT INTO `scm_transfer_order` VALUES (2, 'TR-20260317-0002', '仓库2', '仓库1', 'completed', '李四', '2026-03-17', '2026-03-17 19:01:43');

-- ----------------------------
-- Table structure for scm_transfer_order_item
-- ----------------------------
DROP TABLE IF EXISTS `scm_transfer_order_item`;
CREATE TABLE `scm_transfer_order_item`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `transfer_order_id` bigint NOT NULL COMMENT '调拨单ID',
  `material_id` bigint NULL DEFAULT NULL,
  `material_code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `material_name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '物资名称',
  `specification` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '规格',
  `model` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `unit` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '单位',
  `manufacturer` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `supplier` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `registration_number` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `batch_number` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `production_date` date NULL DEFAULT NULL,
  `expiry_date` date NULL DEFAULT NULL,
  `acceptance_status` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'pending',
  `accepted_quantity` int NOT NULL DEFAULT 0,
  `acceptor` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `acceptance_date` date NULL DEFAULT NULL,
  `transfer_quantity` int NOT NULL COMMENT '调拨数量',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_scm_transfer_order_item_order`(`transfer_order_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of scm_transfer_order_item
-- ----------------------------
INSERT INTO `scm_transfer_order_item` VALUES (1, 1, 21, 'MAT202603180001', '一次性注射器', '2ml', '2ml', '个', '上海医疗器械厂', '上海医疗器械有限公司', 'REG-2ML-001', 'TB20260317-001', '2026-02-15', '2027-03-17', 'accepted', 100, '???', '2026-03-18', 100);
INSERT INTO `scm_transfer_order_item` VALUES (2, 1, 22, 'MAT202603180002', '医用手套', '中号', '中号', '副', '上海医疗器械厂', '上海医疗器械有限公司', 'REG-GLV-001', 'TB20260317-002', '2026-02-15', '2027-03-17', 'accepted', 200, '???', '2026-03-18', 200);
INSERT INTO `scm_transfer_order_item` VALUES (3, 2, 13, 'MAT005', '一次性注射器', '5ml', 'SY-605', '个', '注射器制造厂', '上海医疗器械有限公司', '国械注准202326409012', 'TB20260317-003', '2026-02-15', '2027-03-17', 'pending', 0, NULL, NULL, 50);
INSERT INTO `scm_transfer_order_item` VALUES (4, 2, 11, 'MAT003', '医用口罩', 'N95', 'N95-001', '个', '医疗用品有限公司', '上海医疗器械有限公司', '国械注准202326400123', 'TB20260317-004', '2026-02-15', '2027-03-17', 'pending', 0, NULL, NULL, 100);

-- ----------------------------
-- Table structure for supplier
-- ----------------------------
DROP TABLE IF EXISTS `supplier`;
CREATE TABLE `supplier`  (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '供应商ID',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '供应商名称',
  `contact_person` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '联系人',
  `contact_phone` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '联系电话',
  `address` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '地址',
  `registration_number` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '注册证号',
  `enterprise_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '企业类型',
  `status` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '1' COMMENT '状态',
  `certificate_count` int NULL DEFAULT 0 COMMENT '资质数量',
  `credit_code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '企业信用代码',
  `legal_representative` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '法定代表人',
  `registered_capital` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '注册资本',
  `registration_date` date NULL DEFAULT NULL COMMENT '注册日期',
  `tax_number` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '企业税号',
  `supplier_code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '院内供应商编码',
  `create_time` datetime NULL DEFAULT NULL COMMENT '创建时间',
  `update_time` datetime NULL DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_supplier_name`(`name` ASC) USING BTREE,
  UNIQUE INDEX `uk_supplier_code`(`supplier_code` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '供应商表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of supplier
-- ----------------------------

-- ----------------------------
-- Table structure for supplier_qualification
-- ----------------------------
DROP TABLE IF EXISTS `supplier_qualification`;
CREATE TABLE `supplier_qualification`  (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '资质ID',
  `supplier_id` int NULL DEFAULT NULL COMMENT '供应商ID',
  `type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '资质类型',
  `certificate_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '资质名称',
  `license_number` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '编号',
  `license_type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '具体类别',
  `issue_date` date NULL DEFAULT NULL COMMENT '发证日期',
  `expiry_date` date NULL DEFAULT NULL COMMENT '有效期至',
  `issuing_authority` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '发证机关',
  `attachment_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '附件名称',
  `license_file` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '文件路径',
  `status` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '1' COMMENT '状态',
  `create_time` datetime NULL DEFAULT NULL COMMENT '创建时间',
  `update_time` datetime NULL DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_supplier_id`(`supplier_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 16 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '供应商资质信息表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of supplier_qualification
-- ----------------------------

-- ----------------------------
-- Table structure for sys_department
-- ----------------------------
DROP TABLE IF EXISTS `sys_department`;
CREATE TABLE `sys_department`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '部门ID',
  `parent_id` bigint NULL DEFAULT 0 COMMENT '父部门ID，0表示顶级',
  `dept_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '部门名称',
  `org_type` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'DEPARTMENT' COMMENT '组织类型：CAMPUS/DEPARTMENT',
  `dept_code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '部门编码',
  `address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '地址',
  `leader` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '负责人',
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '联系电话',
  `email` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '邮箱',
  `remark` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '备注',
  `status` tinyint NULL DEFAULT 1 COMMENT '状态：0-禁用 1-启用',
  `sort_order` int NULL DEFAULT 0 COMMENT '排序',
  `create_by` bigint NULL DEFAULT NULL COMMENT '创建人',
  `create_time` datetime NOT NULL COMMENT '创建时间',
  `update_by` bigint NULL DEFAULT NULL COMMENT '更新人',
  `update_time` datetime NOT NULL COMMENT '更新时间',
  `is_deleted` tinyint NULL DEFAULT 0 COMMENT '删除标记：0-未删除 1-已删除',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_dept_code`(`dept_code` ASC) USING BTREE,
  INDEX `idx_parent_id`(`parent_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 15 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '部门表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sys_department
-- ----------------------------
INSERT INTO `sys_department` VALUES (1, 0, '总院区', 'CAMPUS', 'ROOT', '默认院区', '系统管理员', NULL, NULL, '系统初始化', 1, 1, NULL, '2026-03-16 14:05:23', NULL, '2026-03-24 10:39:49', 0);
INSERT INTO `sys_department` VALUES (2, 0, '东院区', 'CAMPUS', 'CAMPUS_EAST', '东院区', '系统管理员', NULL, NULL, '系统初始化', 1, 2, NULL, '2026-03-24 10:39:49', NULL, '2026-03-24 10:39:49', 0);
INSERT INTO `sys_department` VALUES (11, 1, '药剂科', 'DEPARTMENT', 'DEPT_PHARM_MAIN', '总院区', '药剂科主任', NULL, NULL, '系统初始化', 1, 1, NULL, '2026-03-24 10:39:49', NULL, '2026-03-24 10:39:49', 0);
INSERT INTO `sys_department` VALUES (12, 1, '手术室', 'DEPARTMENT', 'DEPT_OR_MAIN', '总院区', '手术室主任', NULL, NULL, '系统初始化', 1, 2, NULL, '2026-03-24 10:39:49', NULL, '2026-03-24 10:39:49', 0);
INSERT INTO `sys_department` VALUES (13, 2, '急诊科', 'DEPARTMENT', 'DEPT_ER_EAST', '东院区', '急诊科主任', NULL, NULL, '系统初始化', 1, 1, NULL, '2026-03-24 10:39:49', NULL, '2026-03-24 10:39:49', 0);
INSERT INTO `sys_department` VALUES (14, 2, '检验科', 'DEPARTMENT', 'DEPT_LAB_EAST', '东院区', '检验科主任', NULL, NULL, '系统初始化', 1, 2, NULL, '2026-03-24 10:39:49', NULL, '2026-03-24 10:39:49', 0);

-- ----------------------------
-- Table structure for sys_permission
-- ----------------------------
DROP TABLE IF EXISTS `sys_permission`;
CREATE TABLE `sys_permission`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '权限ID',
  `parent_id` bigint NULL DEFAULT 0 COMMENT '父权限ID，0表示顶级',
  `permission_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '权限名称',
  `permission_code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '权限编码',
  `permission_type` tinyint NOT NULL COMMENT '权限类型：1-菜单 2-按钮 3-接口',
  `path` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '路由路径',
  `component` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '组件路径',
  `icon` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '图标',
  `method` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT 'HTTP方法：GET/POST/PUT/DELETE',
  `api_pattern` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT 'API路径匹配模式',
  `status` tinyint NULL DEFAULT 1 COMMENT '状态：0-禁用 1-启用',
  `sort_order` int NULL DEFAULT 0 COMMENT '排序',
  `create_by` bigint NULL DEFAULT NULL COMMENT '创建人',
  `create_time` datetime NOT NULL COMMENT '创建时间',
  `update_by` bigint NULL DEFAULT NULL COMMENT '更新人',
  `update_time` datetime NOT NULL COMMENT '更新时间',
  `is_deleted` tinyint NULL DEFAULT 0 COMMENT '删除标记：0-未删除 1-已删除',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_permission_code`(`permission_code` ASC) USING BTREE,
  INDEX `idx_parent_id`(`parent_id` ASC) USING BTREE,
  INDEX `idx_type_status`(`permission_type` ASC, `status` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4105 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '权限表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sys_permission
-- ----------------------------
INSERT INTO `sys_permission` VALUES (1, 0, '运营组管理', 'system', 1, '/operation-group', NULL, 'control', NULL, NULL, 1, 15, NULL, '2026-03-16 14:05:23', NULL, '2026-03-26 14:19:35', 0);
INSERT INTO `sys_permission` VALUES (2, 1, '用户账户管理', 'system:user', 1, '/user-account-management', NULL, 'user', NULL, NULL, 1, 1, NULL, '2026-03-16 14:05:23', NULL, '2026-03-26 14:19:35', 0);
INSERT INTO `sys_permission` VALUES (3, 1, '用户角色模板', 'system:role', 1, '/user-role-template', NULL, 'team', NULL, NULL, 1, 2, NULL, '2026-03-16 14:05:23', NULL, '2026-03-26 14:19:35', 0);
INSERT INTO `sys_permission` VALUES (4, 1, '用户权限设定', 'system:permission', 1, '/user-permission-settings', NULL, 'setting', NULL, NULL, 1, 3, NULL, '2026-03-16 14:05:23', NULL, '2026-03-26 14:19:35', 0);
INSERT INTO `sys_permission` VALUES (5, 3001, '部门管理', 'system:dept', 1, '/department-management', NULL, 'apartment', NULL, NULL, 1, 1, NULL, '2026-03-16 14:05:23', NULL, '2026-03-26 14:19:35', 0);
INSERT INTO `sys_permission` VALUES (101, 2, '新增用户', 'system:user:add', 2, NULL, NULL, NULL, NULL, NULL, 1, 1, NULL, '2026-03-16 14:05:23', NULL, '2026-03-16 14:05:23', 0);
INSERT INTO `sys_permission` VALUES (102, 2, '编辑用户', 'system:user:edit', 2, NULL, NULL, NULL, NULL, NULL, 1, 2, NULL, '2026-03-16 14:05:23', NULL, '2026-03-16 14:05:23', 0);
INSERT INTO `sys_permission` VALUES (103, 2, '删除用户', 'system:user:delete', 2, NULL, NULL, NULL, NULL, NULL, 1, 3, NULL, '2026-03-16 14:05:23', NULL, '2026-03-16 14:05:23', 0);
INSERT INTO `sys_permission` VALUES (104, 2, '查询用户', 'system:user:query', 2, NULL, NULL, NULL, NULL, NULL, 1, 4, NULL, '2026-03-16 14:05:23', NULL, '2026-03-16 14:05:23', 0);
INSERT INTO `sys_permission` VALUES (105, 2, '分配用户角色', 'system:user:assign', 2, NULL, NULL, NULL, NULL, NULL, 1, 5, NULL, '2026-03-16 14:05:23', NULL, '2026-03-16 14:05:23', 0);
INSERT INTO `sys_permission` VALUES (106, 3, '新增角色', 'system:role:add', 2, NULL, NULL, NULL, NULL, NULL, 1, 1, NULL, '2026-03-16 14:05:23', NULL, '2026-03-16 14:05:23', 0);
INSERT INTO `sys_permission` VALUES (107, 3, '编辑角色', 'system:role:edit', 2, NULL, NULL, NULL, NULL, NULL, 1, 2, NULL, '2026-03-16 14:05:23', NULL, '2026-03-16 14:05:23', 0);
INSERT INTO `sys_permission` VALUES (108, 3, '删除角色', 'system:role:delete', 2, NULL, NULL, NULL, NULL, NULL, 1, 3, NULL, '2026-03-16 14:05:23', NULL, '2026-03-16 14:05:23', 0);
INSERT INTO `sys_permission` VALUES (109, 3, '查询角色', 'system:role:query', 2, NULL, NULL, NULL, NULL, NULL, 1, 4, NULL, '2026-03-16 14:05:23', NULL, '2026-03-16 14:05:23', 0);
INSERT INTO `sys_permission` VALUES (110, 3, '分配角色权限', 'system:role:assign', 2, NULL, NULL, NULL, NULL, NULL, 1, 5, NULL, '2026-03-16 14:05:23', NULL, '2026-03-16 14:05:23', 0);
INSERT INTO `sys_permission` VALUES (111, 4, '新增权限', 'system:permission:add', 2, NULL, NULL, NULL, NULL, NULL, 1, 1, NULL, '2026-03-16 14:05:23', NULL, '2026-03-16 14:05:23', 0);
INSERT INTO `sys_permission` VALUES (112, 4, '编辑权限', 'system:permission:edit', 2, NULL, NULL, NULL, NULL, NULL, 1, 2, NULL, '2026-03-16 14:05:23', NULL, '2026-03-16 14:05:23', 0);
INSERT INTO `sys_permission` VALUES (113, 4, '删除权限', 'system:permission:delete', 2, NULL, NULL, NULL, NULL, NULL, 1, 3, NULL, '2026-03-16 14:05:23', NULL, '2026-03-16 14:05:23', 0);
INSERT INTO `sys_permission` VALUES (114, 4, '查询权限', 'system:permission:query', 2, NULL, NULL, NULL, NULL, NULL, 1, 4, NULL, '2026-03-16 14:05:23', NULL, '2026-03-16 14:05:23', 0);
INSERT INTO `sys_permission` VALUES (201, 2, '用户列表接口', 'api:user:list', 3, NULL, NULL, NULL, 'GET', '/api/user/list', 1, 1, NULL, '2026-03-16 14:05:23', NULL, '2026-03-16 14:05:23', 0);
INSERT INTO `sys_permission` VALUES (202, 2, '用户详情接口', 'api:user:detail', 3, NULL, NULL, NULL, 'GET', '/api/user/{id}', 1, 2, NULL, '2026-03-16 14:05:23', NULL, '2026-03-16 14:05:23', 0);
INSERT INTO `sys_permission` VALUES (203, 2, '创建用户接口', 'api:user:create', 3, NULL, NULL, NULL, 'POST', '/api/user', 1, 3, NULL, '2026-03-16 14:05:23', NULL, '2026-03-16 14:05:23', 0);
INSERT INTO `sys_permission` VALUES (204, 2, '更新用户接口', 'api:user:update', 3, NULL, NULL, NULL, 'PUT', '/api/user/{id}', 1, 4, NULL, '2026-03-16 14:05:23', NULL, '2026-03-16 14:05:23', 0);
INSERT INTO `sys_permission` VALUES (205, 2, '删除用户接口', 'api:user:delete', 3, NULL, NULL, NULL, 'DELETE', '/api/user/{id}', 1, 5, NULL, '2026-03-16 14:05:23', NULL, '2026-03-16 14:05:23', 0);
INSERT INTO `sys_permission` VALUES (206, 0, '登录接口', 'api:login', 3, NULL, NULL, NULL, 'GET', '/public/login', 1, 6, NULL, '2026-03-16 14:05:23', NULL, '2026-03-16 14:05:23', 0);
INSERT INTO `sys_permission` VALUES (207, 0, '新增资产接口', 'api:asset:add', 3, NULL, NULL, NULL, 'POST', '/yzb/addAsset', 1, 7, NULL, '2026-03-16 14:05:23', NULL, '2026-03-16 14:05:23', 0);
INSERT INTO `sys_permission` VALUES (208, 0, '编辑资产接口', 'api:asset:update', 3, NULL, NULL, NULL, 'POST', '/yzb/updateAsset', 1, 8, NULL, '2026-03-16 14:05:23', NULL, '2026-03-16 14:05:23', 0);
INSERT INTO `sys_permission` VALUES (209, 0, '资产查询接口', 'api:asset:select', 3, NULL, NULL, NULL, 'POST', '/yzb/selectAsset', 1, 9, NULL, '2026-03-16 14:05:23', NULL, '2026-03-16 14:05:23', 0);
INSERT INTO `sys_permission` VALUES (210, 0, '新增资产类型接口', 'api:asset:type:add', 3, NULL, NULL, NULL, 'POST', '/yzb/addAssetType', 1, 10, NULL, '2026-03-16 14:05:23', NULL, '2026-03-16 14:05:23', 0);
INSERT INTO `sys_permission` VALUES (211, 0, '编辑资产类型接口', 'api:asset:type:update', 3, NULL, NULL, NULL, 'POST', '/yzb/updateAssetType', 1, 11, NULL, '2026-03-16 14:05:23', NULL, '2026-03-16 14:05:23', 0);
INSERT INTO `sys_permission` VALUES (212, 0, '资产类型查询接口', 'api:asset:type:select', 3, NULL, NULL, NULL, 'POST', '/yzb/selectAssetType', 1, 12, NULL, '2026-03-16 14:05:23', NULL, '2026-03-16 14:05:23', 0);
INSERT INTO `sys_permission` VALUES (213, 0, '新增维修接口', 'api:repair:add', 3, NULL, NULL, NULL, 'POST', '/yzb/addRepair', 1, 13, NULL, '2026-03-16 14:05:23', NULL, '2026-03-16 14:05:23', 0);
INSERT INTO `sys_permission` VALUES (214, 0, '编辑维修接口', 'api:repair:update', 3, NULL, NULL, NULL, 'POST', '/yzb/updateRepair', 1, 14, NULL, '2026-03-16 14:05:23', NULL, '2026-03-16 14:05:23', 0);
INSERT INTO `sys_permission` VALUES (215, 0, '维修查询接口', 'api:repair:select', 3, NULL, NULL, NULL, 'POST', '/yzb/selectRepairList', 1, 15, NULL, '2026-03-16 14:05:23', NULL, '2026-03-16 14:05:23', 0);
INSERT INTO `sys_permission` VALUES (216, 0, '新增仓库接口', 'api:warehouse:add', 3, NULL, NULL, NULL, 'POST', '/yzb/addWarehouse', 1, 16, NULL, '2026-03-16 14:05:23', NULL, '2026-03-16 14:05:23', 0);
INSERT INTO `sys_permission` VALUES (217, 0, '删除仓库接口', 'api:warehouse:delete', 3, NULL, NULL, NULL, 'POST', '/yzb/delWarehouse', 1, 17, NULL, '2026-03-16 14:05:23', NULL, '2026-03-16 14:05:23', 0);
INSERT INTO `sys_permission` VALUES (218, 0, '编辑仓库接口', 'api:warehouse:update', 3, NULL, NULL, NULL, 'POST', '/yzb/updateWarehouse', 1, 18, NULL, '2026-03-16 14:05:23', NULL, '2026-03-16 14:05:23', 0);
INSERT INTO `sys_permission` VALUES (219, 0, '仓库查询接口', 'api:warehouse:select', 3, NULL, NULL, NULL, 'POST', '/yzb/selectWarehouse', 1, 19, NULL, '2026-03-16 14:05:23', NULL, '2026-03-16 14:05:23', 0);
INSERT INTO `sys_permission` VALUES (220, 0, '测试接口', 'api:test', 3, NULL, NULL, NULL, 'GET', '/yzb/test', 1, 20, NULL, '2026-03-16 14:05:23', NULL, '2026-03-16 14:05:23', 0);
INSERT INTO `sys_permission` VALUES (221, 0, '获取当前用户权限接口', 'api:permission:current', 3, NULL, NULL, NULL, 'GET', '/api/permission/current', 1, 21, NULL, '2026-03-16 14:05:23', NULL, '2026-03-16 14:05:23', 0);
INSERT INTO `sys_permission` VALUES (222, 0, '获取用户菜单树接口', 'api:permission:menu:tree', 3, NULL, NULL, NULL, 'GET', '/api/permission/menu/tree', 1, 22, NULL, '2026-03-16 14:05:23', NULL, '2026-03-16 14:05:23', 0);
INSERT INTO `sys_permission` VALUES (223, 0, '获取所有权限树接口', 'api:permission:tree', 3, NULL, NULL, NULL, 'GET', '/api/permission/tree', 1, 23, NULL, '2026-03-16 14:05:23', NULL, '2026-03-16 14:05:23', 0);
INSERT INTO `sys_permission` VALUES (224, 0, '根据角色获取权限接口', 'api:permission:role', 3, NULL, NULL, NULL, 'GET', '/api/permission/role/{roleId}', 1, 24, NULL, '2026-03-16 14:05:23', NULL, '2026-03-16 14:05:23', 0);
INSERT INTO `sys_permission` VALUES (225, 0, '创建权限接口', 'api:permission:create', 3, NULL, NULL, NULL, 'POST', '/api/permission', 1, 25, NULL, '2026-03-16 14:05:23', NULL, '2026-03-16 14:05:23', 0);
INSERT INTO `sys_permission` VALUES (226, 0, '更新权限接口', 'api:permission:update', 3, NULL, NULL, NULL, 'PUT', '/api/permission/{id}', 1, 26, NULL, '2026-03-16 14:05:23', NULL, '2026-03-16 14:05:23', 0);
INSERT INTO `sys_permission` VALUES (227, 0, '删除权限接口', 'api:permission:delete', 3, NULL, NULL, NULL, 'DELETE', '/api/permission/{id}', 1, 27, NULL, '2026-03-16 14:05:23', NULL, '2026-03-16 14:05:23', 0);
INSERT INTO `sys_permission` VALUES (228, 0, '批量删除权限接口', 'api:permission:batch:delete', 3, NULL, NULL, NULL, 'DELETE', '/api/permission/batch', 1, 28, NULL, '2026-03-16 14:05:23', NULL, '2026-03-16 14:05:23', 0);
INSERT INTO `sys_permission` VALUES (229, 0, '查询所有角色接口', 'api:role:list', 3, NULL, NULL, NULL, 'GET', '/api/role/list', 1, 29, NULL, '2026-03-16 14:05:23', NULL, '2026-03-16 14:05:23', 0);
INSERT INTO `sys_permission` VALUES (230, 0, '根据ID查询角色接口', 'api:role:get', 3, NULL, NULL, NULL, 'GET', '/api/role/{id}', 1, 30, NULL, '2026-03-16 14:05:23', NULL, '2026-03-16 14:05:23', 0);
INSERT INTO `sys_permission` VALUES (231, 0, '根据用户ID查询角色接口', 'api:role:user', 3, NULL, NULL, NULL, 'GET', '/api/role/user/{userId}', 1, 31, NULL, '2026-03-16 14:05:23', NULL, '2026-03-16 14:05:23', 0);
INSERT INTO `sys_permission` VALUES (232, 0, '创建角色接口', 'api:role:create', 3, NULL, NULL, NULL, 'POST', '/api/role', 1, 32, NULL, '2026-03-16 14:05:23', NULL, '2026-03-16 14:05:23', 0);
INSERT INTO `sys_permission` VALUES (233, 0, '更新角色接口', 'api:role:update', 3, NULL, NULL, NULL, 'PUT', '/api/role/{id}', 1, 33, NULL, '2026-03-16 14:05:23', NULL, '2026-03-16 14:05:23', 0);
INSERT INTO `sys_permission` VALUES (234, 0, '删除角色接口', 'api:role:delete', 3, NULL, NULL, NULL, 'DELETE', '/api/role/{id}', 1, 34, NULL, '2026-03-16 14:05:23', NULL, '2026-03-16 14:05:23', 0);
INSERT INTO `sys_permission` VALUES (235, 0, '为角色分配权限接口', 'api:role:assign:permission', 3, NULL, NULL, NULL, 'POST', '/api/role/{roleId}/permissions', 1, 35, NULL, '2026-03-16 14:05:23', NULL, '2026-03-16 14:05:23', 0);
INSERT INTO `sys_permission` VALUES (236, 0, '为用户分配角色接口', 'api:role:assign:user', 3, NULL, NULL, NULL, 'POST', '/api/role/user/{userId}/roles', 1, 36, NULL, '2026-03-16 14:05:23', NULL, '2026-03-16 14:05:23', 0);
INSERT INTO `sys_permission` VALUES (3001, 0, '院区管理', 'menu:campus', 1, '/campus-group', NULL, 'team', NULL, NULL, 1, 14, NULL, '2026-03-26 14:19:35', NULL, '2026-03-26 14:19:35', 0);
INSERT INTO `sys_permission` VALUES (3002, 3001, '分院管理', 'menu:campus:management', 1, '/campus-management', NULL, 'team', NULL, NULL, 1, 2, NULL, '2026-03-26 14:19:35', NULL, '2026-03-26 14:19:35', 0);
INSERT INTO `sys_permission` VALUES (3003, 0, '操作日志', 'menu:operation-log', 1, '/operation-log', NULL, 'clock-circle', NULL, NULL, 1, 13, NULL, '2026-03-26 14:19:35', NULL, '2026-03-26 14:19:35', 0);
INSERT INTO `sys_permission` VALUES (3004, 0, '首页', 'menu:home', 1, '/', NULL, 'dashboard', NULL, NULL, 1, 1, NULL, '2026-03-26 14:19:35', NULL, '2026-03-26 14:19:35', 0);
INSERT INTO `sys_permission` VALUES (3100, 0, '供应商维护', 'menu:supplier', 1, '/supplier-group', NULL, 'team', NULL, NULL, 1, 2, NULL, '2026-03-26 14:19:35', NULL, '2026-03-26 14:19:35', 0);
INSERT INTO `sys_permission` VALUES (3101, 3100, '供应商管理', 'menu:supplier:maintenance', 1, '/supplier-maintenance', NULL, 'team', NULL, NULL, 1, 1, NULL, '2026-03-26 14:19:35', NULL, '2026-03-26 14:19:35', 0);
INSERT INTO `sys_permission` VALUES (3102, 3100, '供应商资质', 'menu:supplier:qualification', 1, '/supplier-qualification-group', NULL, 'team', NULL, NULL, 1, 2, NULL, '2026-03-26 14:19:35', NULL, '2026-03-26 14:19:35', 0);
INSERT INTO `sys_permission` VALUES (3103, 3102, '注册证', 'menu:supplier:inspection-report', 1, '/supplier-inspection-report', NULL, 'team', NULL, NULL, 1, 1, NULL, '2026-03-26 14:19:35', NULL, '2026-03-26 14:19:35', 0);
INSERT INTO `sys_permission` VALUES (3104, 3102, '经营许可证', 'menu:supplier:business-license', 1, '/supplier-business-license', NULL, 'team', NULL, NULL, 1, 2, NULL, '2026-03-26 14:19:35', NULL, '2026-03-26 14:19:35', 0);
INSERT INTO `sys_permission` VALUES (3105, 3102, '营业执照', 'menu:supplier:business-certificate', 1, '/supplier-business-certificate', NULL, 'team', NULL, NULL, 1, 3, NULL, '2026-03-26 14:19:35', NULL, '2026-03-26 14:19:35', 0);
INSERT INTO `sys_permission` VALUES (3106, 3100, '资质预警', 'menu:supplier:qualification-warning', 1, '/supplier-qualification-warning', NULL, 'warning', NULL, NULL, 1, 3, NULL, '2026-03-26 14:19:35', NULL, '2026-03-26 14:19:35', 0);
INSERT INTO `sys_permission` VALUES (3200, 0, '字典维护', 'menu:master-data', 1, '/master-data-group', NULL, 'setting', NULL, NULL, 1, 3, NULL, '2026-03-26 14:19:35', NULL, '2026-03-26 14:19:35', 0);
INSERT INTO `sys_permission` VALUES (3201, 3200, '物资字典', 'menu:product-catalog', 1, '/product-catalog', NULL, 'setting', NULL, NULL, 1, 1, NULL, '2026-03-26 14:19:35', NULL, '2026-03-26 14:19:35', 0);
INSERT INTO `sys_permission` VALUES (3202, 3200, '物资调价', 'menu:product-price-adjustment', 1, '/product-price-adjustment', NULL, 'setting', NULL, NULL, 1, 2, NULL, '2026-03-26 14:19:35', NULL, '2026-03-26 14:19:35', 0);
INSERT INTO `sys_permission` VALUES (3300, 0, '采购管理', 'menu:purchase', 1, '/purchase-group', NULL, 'shopping', NULL, NULL, 1, 4, NULL, '2026-03-26 14:19:35', NULL, '2026-03-26 14:19:35', 0);
INSERT INTO `sys_permission` VALUES (3301, 3300, '采购计划申请', 'menu:purchase-order-request', 1, '/purchase-order-request', NULL, 'shopping', NULL, NULL, 1, 1, NULL, '2026-03-26 14:19:35', NULL, '2026-03-26 14:19:35', 0);
INSERT INTO `sys_permission` VALUES (3302, 3300, '采购审核', 'menu:purchase-order-approval', 1, '/purchase-order-approval', NULL, 'shopping', NULL, NULL, 1, 2, NULL, '2026-03-26 14:19:35', NULL, '2026-03-26 14:19:35', 0);
INSERT INTO `sys_permission` VALUES (3303, 3300, '采购订单查询', 'menu:purchase-order-query', 1, '/purchase-order-query', NULL, 'shopping', NULL, NULL, 1, 3, NULL, '2026-03-26 14:19:35', NULL, '2026-03-26 14:19:35', 0);
INSERT INTO `sys_permission` VALUES (3400, 0, '入库管理', 'menu:stock-in', 1, '/stock-in-group', NULL, 'import', NULL, NULL, 1, 5, NULL, '2026-03-26 14:19:35', NULL, '2026-03-26 14:19:35', 0);
INSERT INTO `sys_permission` VALUES (3401, 3400, '采购收货', 'menu:purchase-receipt', 1, '/purchase-receipt', NULL, 'import', NULL, NULL, 1, 1, NULL, '2026-03-26 14:19:35', NULL, '2026-03-26 14:19:35', 0);
INSERT INTO `sys_permission` VALUES (3402, 3400, '采购入库', 'menu:purchase-order-acceptance', 1, '/purchase-order-acceptance', NULL, 'import', NULL, NULL, 1, 2, NULL, '2026-03-26 14:19:35', NULL, '2026-03-26 14:19:35', 0);
INSERT INTO `sys_permission` VALUES (3403, 3400, '初始化入库', 'menu:manual-stock-in', 1, '/manual-stock-in', NULL, 'import', NULL, NULL, 1, 3, NULL, '2026-03-26 14:19:35', NULL, '2026-03-26 14:19:35', 0);
INSERT INTO `sys_permission` VALUES (3404, 3400, '调拨验收入库', 'menu:transfer-acceptance', 1, '/transfer-acceptance', NULL, 'import', NULL, NULL, 1, 4, NULL, '2026-03-26 14:19:35', NULL, '2026-03-26 14:19:35', 0);
INSERT INTO `sys_permission` VALUES (3405, 3400, '入库单查询', 'menu:stock-in-detail', 1, '/stock-in-detail', NULL, 'import', NULL, NULL, 1, 5, NULL, '2026-03-26 14:19:35', NULL, '2026-03-26 14:19:35', 0);
INSERT INTO `sys_permission` VALUES (3406, 3400, '异常订单管理', 'menu:abnormal-order-management', 1, '/abnormal-order-management', NULL, 'warning', NULL, NULL, 1, 6, NULL, '2026-03-26 14:19:35', NULL, '2026-03-26 14:19:35', 0);
INSERT INTO `sys_permission` VALUES (3500, 0, '库存管理', 'menu:inventory', 1, '/inventory-group', NULL, 'database', NULL, NULL, 1, 6, NULL, '2026-03-26 14:19:35', NULL, '2026-03-26 14:19:35', 0);
INSERT INTO `sys_permission` VALUES (3501, 3500, '物资库存', 'menu:inventory-detail', 1, '/inventory-detail', NULL, 'database', NULL, NULL, 1, 1, NULL, '2026-03-26 14:19:35', NULL, '2026-03-26 14:19:35', 0);
INSERT INTO `sys_permission` VALUES (3502, 3500, '物资调拨', 'menu:inventory-transfer', 1, '/inventory-transfer', NULL, 'database', NULL, NULL, 1, 2, NULL, '2026-03-26 14:19:35', NULL, '2026-03-26 14:19:35', 0);
INSERT INTO `sys_permission` VALUES (3503, 3500, '近效期查询', 'menu:inventory-expiry', 1, '/inventory-expiry', NULL, 'warning', NULL, NULL, 1, 3, NULL, '2026-03-26 14:19:35', NULL, '2026-03-26 14:19:35', 0);
INSERT INTO `sys_permission` VALUES (3600, 0, '出库管理', 'menu:stock-out', 1, '/stock-out-group', NULL, 'export', NULL, NULL, 1, 7, NULL, '2026-03-26 14:19:35', NULL, '2026-03-26 14:19:35', 0);
INSERT INTO `sys_permission` VALUES (3601, 3600, '消耗出库', 'menu:stock-out-consumption', 1, '/stock-out-consumption', NULL, 'export', NULL, NULL, 1, 1, NULL, '2026-03-26 14:19:35', NULL, '2026-03-26 14:19:35', 0);
INSERT INTO `sys_permission` VALUES (3602, 3600, '消耗明细查询', 'menu:stock-out-detail', 1, '/stock-out-detail', NULL, 'export', NULL, NULL, 1, 2, NULL, '2026-03-26 14:19:35', NULL, '2026-03-26 14:19:35', 0);
INSERT INTO `sys_permission` VALUES (3603, 3600, '消耗统计', 'menu:stock-out-stats', 1, '/stock-out-stats', NULL, 'bar-chart', NULL, NULL, 1, 3, NULL, '2026-03-26 14:19:35', NULL, '2026-03-26 14:19:35', 0);
INSERT INTO `sys_permission` VALUES (3604, 3600, '消耗撤销', 'menu:stock-out-consumption-undo', 1, '/stock-out-consumption-undo', NULL, 'export', NULL, NULL, 1, 4, NULL, '2026-03-26 14:19:35', NULL, '2026-03-26 14:19:35', 0);
INSERT INTO `sys_permission` VALUES (3700, 0, '库存盘点', 'menu:inventory-check', 1, '/inventory-check-group', NULL, 'file', NULL, NULL, 1, 8, NULL, '2026-03-26 14:19:35', NULL, '2026-03-26 14:19:35', 0);
INSERT INTO `sys_permission` VALUES (3701, 3700, '盘点表生成', 'menu:inventory-check-generate', 1, '/inventory-check-generate', NULL, 'file', NULL, NULL, 1, 1, NULL, '2026-03-26 14:19:35', NULL, '2026-03-26 14:19:35', 0);
INSERT INTO `sys_permission` VALUES (3702, 3700, '盘点明细查询', 'menu:inventory-check-detail', 1, '/inventory-check-detail', NULL, 'file', NULL, NULL, 1, 2, NULL, '2026-03-26 14:19:35', NULL, '2026-03-26 14:19:35', 0);
INSERT INTO `sys_permission` VALUES (3703, 3700, '盘点损溢录入', 'menu:inventory-check-diff', 1, '/inventory-check-diff', NULL, 'file', NULL, NULL, 1, 3, NULL, '2026-03-26 14:19:35', NULL, '2026-03-26 14:19:35', 0);
INSERT INTO `sys_permission` VALUES (3800, 0, '仓库报表', 'menu:reports', 1, '/reports-group', NULL, 'bar-chart', NULL, NULL, 1, 9, NULL, '2026-03-26 14:19:35', NULL, '2026-03-26 14:19:35', 0);
INSERT INTO `sys_permission` VALUES (3801, 3800, '仓库入库明细', 'menu:reports-stock-in-detail', 1, '/reports-stock-in-detail', NULL, 'bar-chart', NULL, NULL, 1, 1, NULL, '2026-03-26 14:19:35', NULL, '2026-03-26 14:19:35', 0);
INSERT INTO `sys_permission` VALUES (3802, 3800, '仓库入库汇总', 'menu:reports-stock-in-summary', 1, '/reports-stock-in-summary', NULL, 'bar-chart', NULL, NULL, 1, 2, NULL, '2026-03-26 14:19:35', NULL, '2026-03-26 14:19:35', 0);
INSERT INTO `sys_permission` VALUES (3803, 3800, '仓库消耗明细', 'menu:reports-consumption-detail', 1, '/reports-consumption-detail', NULL, 'bar-chart', NULL, NULL, 1, 3, NULL, '2026-03-26 14:19:35', NULL, '2026-03-26 14:19:35', 0);
INSERT INTO `sys_permission` VALUES (3804, 3800, '仓库消耗汇总', 'menu:reports-consumption-summary', 1, '/reports-consumption-summary', NULL, 'bar-chart', NULL, NULL, 1, 4, NULL, '2026-03-26 14:19:35', NULL, '2026-03-26 14:19:35', 0);
INSERT INTO `sys_permission` VALUES (3805, 3800, '损耗汇总', 'menu:reports-loss-summary', 1, '/reports-loss-summary', NULL, 'bar-chart', NULL, NULL, 1, 5, NULL, '2026-03-26 14:19:35', NULL, '2026-03-26 14:19:35', 0);
INSERT INTO `sys_permission` VALUES (3900, 0, '固定资产管理', 'menu:fixed-assets', 1, '/fixed-assets-group', NULL, 'desktop', NULL, NULL, 1, 10, NULL, '2026-03-26 14:19:35', NULL, '2026-03-26 14:19:35', 0);
INSERT INTO `sys_permission` VALUES (3901, 3900, '资产字典维护', 'menu:fixed-assets-dictionary', 1, '/fixed-assets-dictionary', NULL, 'desktop', NULL, NULL, 1, 1, NULL, '2026-03-26 14:19:35', NULL, '2026-03-26 14:19:35', 0);
INSERT INTO `sys_permission` VALUES (3902, 3900, '资产新增', 'menu:fixed-assets-add', 1, '/fixed-assets-add', NULL, 'desktop', NULL, NULL, 1, 2, NULL, '2026-03-26 14:19:35', NULL, '2026-03-26 14:19:35', 0);
INSERT INTO `sys_permission` VALUES (3903, 3900, '资产明细查询', 'menu:fixed-assets-detail-query', 1, '/fixed-assets-detail-query', NULL, 'desktop', NULL, NULL, 1, 3, NULL, '2026-03-26 14:19:35', NULL, '2026-03-26 14:19:35', 0);
INSERT INTO `sys_permission` VALUES (3904, 3900, '固定资产调拨', 'menu:fixed-assets-transfer', 1, '/fixed-assets-transfer', NULL, 'desktop', NULL, NULL, 1, 4, NULL, '2026-03-26 14:19:35', NULL, '2026-03-26 14:19:35', 0);
INSERT INTO `sys_permission` VALUES (3905, 3900, '资产报废', 'menu:fixed-assets-scrap', 1, '/fixed-assets-scrap', NULL, 'desktop', NULL, NULL, 1, 5, NULL, '2026-03-26 14:19:35', NULL, '2026-03-26 14:19:35', 0);
INSERT INTO `sys_permission` VALUES (3906, 3900, '资产清理明细', 'menu:fixed-assets-scrap-detail', 1, '/fixed-assets-scrap-detail', NULL, 'desktop', NULL, NULL, 1, 6, NULL, '2026-03-26 14:19:35', NULL, '2026-03-26 14:19:35', 0);
INSERT INTO `sys_permission` VALUES (3907, 3900, '资产变更审核', 'menu:fixed-assets-change-audit', 1, '/fixed-assets-change-audit', NULL, 'desktop', NULL, NULL, 1, 7, NULL, '2026-03-26 14:19:35', NULL, '2026-03-26 14:19:35', 0);
INSERT INTO `sys_permission` VALUES (3908, 3900, '固定资产预警', 'menu:fixed-assets-warning', 1, '/fixed-assets-warning', NULL, 'warning', NULL, NULL, 1, 8, NULL, '2026-03-26 14:19:35', NULL, '2026-03-26 14:19:35', 0);
INSERT INTO `sys_permission` VALUES (3909, 3900, '资产维修记录', 'menu:fixed-assets-maintenance-record', 1, '/fixed-assets-maintenance-record', NULL, 'desktop', NULL, NULL, 1, 9, NULL, '2026-03-26 14:19:35', NULL, '2026-03-26 14:19:35', 0);
INSERT INTO `sys_permission` VALUES (4000, 0, '样本量管理', 'menu:sample', 1, '/sample-group', NULL, 'database', NULL, NULL, 1, 11, NULL, '2026-03-26 14:19:35', NULL, '2026-03-26 14:19:35', 0);
INSERT INTO `sys_permission` VALUES (4001, 4000, '项目字典', 'menu:sample-project-management', 1, '/sample-project-management', NULL, 'database', NULL, NULL, 1, 1, NULL, '2026-03-26 14:19:35', NULL, '2026-03-26 14:19:35', 0);
INSERT INTO `sys_permission` VALUES (4002, 4000, '样本量管理', 'menu:sample-quantity-management', 1, '/sample-quantity-management', NULL, 'database', NULL, NULL, 1, 2, NULL, '2026-03-26 14:19:35', NULL, '2026-03-26 14:19:35', 0);
INSERT INTO `sys_permission` VALUES (4100, 0, '异常事件记录', 'menu:abnormal-events', 1, '/abnormal-events-group', NULL, 'warning', NULL, NULL, 1, 12, NULL, '2026-03-26 14:19:35', NULL, '2026-03-26 14:19:35', 0);
INSERT INTO `sys_permission` VALUES (4101, 4100, '耗材质量问题记录', 'menu:consumables-quality-issue', 1, '/consumables-quality-issue', NULL, 'warning', NULL, NULL, 1, 1, NULL, '2026-03-26 14:19:35', NULL, '2026-03-26 14:19:35', 0);
INSERT INTO `sys_permission` VALUES (4102, 4100, '异常事件记录', 'menu:medical-device-adverse-event', 1, '/medical-device-adverse-event', NULL, 'warning', NULL, NULL, 1, 2, NULL, '2026-03-26 14:19:35', NULL, '2026-03-26 14:19:35', 0);
INSERT INTO `sys_permission` VALUES (4103, 4100, '仪器维修记录', 'menu:instrument-maintenance-record', 1, '/instrument-maintenance-record', NULL, 'warning', NULL, NULL, 1, 3, NULL, '2026-03-26 14:19:35', NULL, '2026-03-26 14:19:35', 0);
INSERT INTO `sys_permission` VALUES (4104, 4100, '维修记录', 'menu:maintenance-record', 1, '/maintenance-record', NULL, 'warning', NULL, NULL, 1, 4, NULL, '2026-03-26 14:19:35', NULL, '2026-03-26 14:19:35', 0);

-- ----------------------------
-- Table structure for sys_role
-- ----------------------------
DROP TABLE IF EXISTS `sys_role`;
CREATE TABLE `sys_role`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '角色ID',
  `role_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '角色名称',
  `role_code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '角色编码',
  `role_desc` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '角色描述',
  `data_scope` tinyint NULL DEFAULT 1 COMMENT '数据权限范围：1-全部 2-本部门及以下 3-本部门 4-仅本人 5-自定义',
  `status` tinyint NULL DEFAULT 1 COMMENT '状态：0-禁用 1-启用',
  `sort_order` int NULL DEFAULT 0 COMMENT '排序',
  `create_by` bigint NULL DEFAULT NULL COMMENT '创建人',
  `create_time` datetime NOT NULL COMMENT '创建时间',
  `update_by` bigint NULL DEFAULT NULL COMMENT '更新人',
  `update_time` datetime NOT NULL COMMENT '更新时间',
  `is_deleted` tinyint NULL DEFAULT 0 COMMENT '删除标记：0-未删除 1-已删除',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_role_code`(`role_code` ASC) USING BTREE,
  INDEX `idx_status`(`status` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '角色表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sys_role
-- ----------------------------
INSERT INTO `sys_role` VALUES (1, '超级管理员', 'SUPER_ADMIN', '拥有系统所有权限', 1, 1, 1, NULL, '2026-03-16 14:05:23', NULL, '2026-03-16 14:05:23', 0);
INSERT INTO `sys_role` VALUES (2, '部门管理员', 'DEPT_ADMIN', '管理本部门及下级部门数据', 2, 1, 2, NULL, '2026-03-16 14:05:23', NULL, '2026-03-16 14:05:23', 0);
INSERT INTO `sys_role` VALUES (3, '普通用户', 'USER', '查看和操作个人数据', 4, 1, 3, NULL, '2026-03-16 14:05:23', NULL, '2026-03-16 14:05:23', 0);

-- ----------------------------
-- Table structure for sys_role_dept
-- ----------------------------
DROP TABLE IF EXISTS `sys_role_dept`;
CREATE TABLE `sys_role_dept`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `role_id` bigint NOT NULL COMMENT '角色ID',
  `dept_id` bigint NOT NULL COMMENT '部门ID',
  `create_time` datetime NOT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_role_dept`(`role_id` ASC, `dept_id` ASC) USING BTREE,
  INDEX `idx_role_id`(`role_id` ASC) USING BTREE,
  INDEX `idx_dept_id`(`dept_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '角色数据权限关联表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sys_role_dept
-- ----------------------------
INSERT INTO `sys_role_dept` VALUES (1, 2, 11, '2026-03-24 10:39:49');
INSERT INTO `sys_role_dept` VALUES (2, 2, 12, '2026-03-24 10:39:49');
INSERT INTO `sys_role_dept` VALUES (3, 2, 13, '2026-03-24 10:39:49');
INSERT INTO `sys_role_dept` VALUES (4, 2, 14, '2026-03-24 10:39:49');

-- ----------------------------
-- Table structure for sys_role_permission
-- ----------------------------
DROP TABLE IF EXISTS `sys_role_permission`;
CREATE TABLE `sys_role_permission`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `role_id` bigint NOT NULL COMMENT '角色ID',
  `permission_id` bigint NOT NULL COMMENT '权限ID',
  `create_by` bigint NULL DEFAULT NULL COMMENT '创建人',
  `create_time` datetime NOT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_role_permission`(`role_id` ASC, `permission_id` ASC) USING BTREE,
  INDEX `idx_role_id`(`role_id` ASC) USING BTREE,
  INDEX `idx_permission_id`(`permission_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 254 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '角色权限关联表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sys_role_permission
-- ----------------------------
INSERT INTO `sys_role_permission` VALUES (1, 1, 1, NULL, '2026-03-16 14:05:23');
INSERT INTO `sys_role_permission` VALUES (2, 1, 2, NULL, '2026-03-16 14:05:23');
INSERT INTO `sys_role_permission` VALUES (3, 1, 3, NULL, '2026-03-16 14:05:23');
INSERT INTO `sys_role_permission` VALUES (4, 1, 4, NULL, '2026-03-16 14:05:23');
INSERT INTO `sys_role_permission` VALUES (5, 1, 5, NULL, '2026-03-16 14:05:23');
INSERT INTO `sys_role_permission` VALUES (6, 1, 101, NULL, '2026-03-16 14:05:23');
INSERT INTO `sys_role_permission` VALUES (7, 1, 102, NULL, '2026-03-16 14:05:23');
INSERT INTO `sys_role_permission` VALUES (8, 1, 103, NULL, '2026-03-16 14:05:23');
INSERT INTO `sys_role_permission` VALUES (9, 1, 104, NULL, '2026-03-16 14:05:23');
INSERT INTO `sys_role_permission` VALUES (10, 1, 105, NULL, '2026-03-16 14:05:23');
INSERT INTO `sys_role_permission` VALUES (11, 1, 106, NULL, '2026-03-16 14:05:23');
INSERT INTO `sys_role_permission` VALUES (12, 1, 107, NULL, '2026-03-16 14:05:23');
INSERT INTO `sys_role_permission` VALUES (13, 1, 108, NULL, '2026-03-16 14:05:23');
INSERT INTO `sys_role_permission` VALUES (14, 1, 109, NULL, '2026-03-16 14:05:23');
INSERT INTO `sys_role_permission` VALUES (15, 1, 110, NULL, '2026-03-16 14:05:23');
INSERT INTO `sys_role_permission` VALUES (16, 1, 111, NULL, '2026-03-16 14:05:23');
INSERT INTO `sys_role_permission` VALUES (17, 1, 112, NULL, '2026-03-16 14:05:23');
INSERT INTO `sys_role_permission` VALUES (18, 1, 113, NULL, '2026-03-16 14:05:23');
INSERT INTO `sys_role_permission` VALUES (19, 1, 114, NULL, '2026-03-16 14:05:23');
INSERT INTO `sys_role_permission` VALUES (20, 1, 201, NULL, '2026-03-16 14:05:23');
INSERT INTO `sys_role_permission` VALUES (21, 1, 202, NULL, '2026-03-16 14:05:23');
INSERT INTO `sys_role_permission` VALUES (22, 1, 203, NULL, '2026-03-16 14:05:23');
INSERT INTO `sys_role_permission` VALUES (23, 1, 204, NULL, '2026-03-16 14:05:23');
INSERT INTO `sys_role_permission` VALUES (24, 1, 205, NULL, '2026-03-16 14:05:23');
INSERT INTO `sys_role_permission` VALUES (25, 1, 206, NULL, '2026-03-16 14:05:23');
INSERT INTO `sys_role_permission` VALUES (26, 1, 207, NULL, '2026-03-16 14:05:23');
INSERT INTO `sys_role_permission` VALUES (27, 1, 208, NULL, '2026-03-16 14:05:23');
INSERT INTO `sys_role_permission` VALUES (28, 1, 209, NULL, '2026-03-16 14:05:23');
INSERT INTO `sys_role_permission` VALUES (29, 1, 210, NULL, '2026-03-16 14:05:23');
INSERT INTO `sys_role_permission` VALUES (30, 1, 211, NULL, '2026-03-16 14:05:23');
INSERT INTO `sys_role_permission` VALUES (31, 1, 212, NULL, '2026-03-16 14:05:23');
INSERT INTO `sys_role_permission` VALUES (32, 1, 213, NULL, '2026-03-16 14:05:23');
INSERT INTO `sys_role_permission` VALUES (33, 1, 214, NULL, '2026-03-16 14:05:23');
INSERT INTO `sys_role_permission` VALUES (34, 1, 215, NULL, '2026-03-16 14:05:23');
INSERT INTO `sys_role_permission` VALUES (35, 1, 216, NULL, '2026-03-16 14:05:23');
INSERT INTO `sys_role_permission` VALUES (36, 1, 217, NULL, '2026-03-16 14:05:23');
INSERT INTO `sys_role_permission` VALUES (37, 1, 218, NULL, '2026-03-16 14:05:23');
INSERT INTO `sys_role_permission` VALUES (38, 1, 219, NULL, '2026-03-16 14:05:23');
INSERT INTO `sys_role_permission` VALUES (39, 1, 220, NULL, '2026-03-16 14:05:23');
INSERT INTO `sys_role_permission` VALUES (40, 1, 221, NULL, '2026-03-16 14:05:23');
INSERT INTO `sys_role_permission` VALUES (41, 1, 222, NULL, '2026-03-16 14:05:23');
INSERT INTO `sys_role_permission` VALUES (42, 1, 223, NULL, '2026-03-16 14:05:23');
INSERT INTO `sys_role_permission` VALUES (43, 1, 224, NULL, '2026-03-16 14:05:23');
INSERT INTO `sys_role_permission` VALUES (44, 1, 225, NULL, '2026-03-16 14:05:23');
INSERT INTO `sys_role_permission` VALUES (45, 1, 226, NULL, '2026-03-16 14:05:23');
INSERT INTO `sys_role_permission` VALUES (46, 1, 227, NULL, '2026-03-16 14:05:23');
INSERT INTO `sys_role_permission` VALUES (47, 1, 228, NULL, '2026-03-16 14:05:23');
INSERT INTO `sys_role_permission` VALUES (48, 1, 229, NULL, '2026-03-16 14:05:23');
INSERT INTO `sys_role_permission` VALUES (49, 1, 230, NULL, '2026-03-16 14:05:23');
INSERT INTO `sys_role_permission` VALUES (50, 1, 231, NULL, '2026-03-16 14:05:23');
INSERT INTO `sys_role_permission` VALUES (51, 1, 232, NULL, '2026-03-16 14:05:23');
INSERT INTO `sys_role_permission` VALUES (52, 1, 233, NULL, '2026-03-16 14:05:23');
INSERT INTO `sys_role_permission` VALUES (53, 1, 234, NULL, '2026-03-16 14:05:23');
INSERT INTO `sys_role_permission` VALUES (54, 1, 235, NULL, '2026-03-16 14:05:23');
INSERT INTO `sys_role_permission` VALUES (55, 1, 236, NULL, '2026-03-16 14:05:23');
INSERT INTO `sys_role_permission` VALUES (64, 1, 3001, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (65, 1, 3002, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (66, 1, 3003, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (67, 1, 3004, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (68, 1, 3100, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (69, 1, 3101, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (70, 1, 3102, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (71, 1, 3103, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (72, 1, 3104, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (73, 1, 3105, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (74, 1, 3106, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (75, 1, 3200, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (76, 1, 3201, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (77, 1, 3202, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (78, 1, 3300, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (79, 1, 3301, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (80, 1, 3302, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (81, 1, 3303, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (82, 1, 3400, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (83, 1, 3401, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (84, 1, 3402, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (85, 1, 3403, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (86, 1, 3404, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (87, 1, 3405, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (88, 1, 3406, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (89, 1, 3500, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (90, 1, 3501, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (91, 1, 3502, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (92, 1, 3503, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (93, 1, 3600, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (94, 1, 3601, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (95, 1, 3602, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (96, 1, 3603, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (97, 1, 3604, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (98, 1, 3700, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (99, 1, 3701, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (100, 1, 3702, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (101, 1, 3703, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (102, 1, 3800, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (103, 1, 3801, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (104, 1, 3802, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (105, 1, 3803, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (106, 1, 3804, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (107, 1, 3805, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (108, 1, 3900, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (109, 1, 3901, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (110, 1, 3902, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (111, 1, 3903, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (112, 1, 3904, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (113, 1, 3905, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (114, 1, 3906, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (115, 1, 3907, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (116, 1, 3908, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (117, 1, 3909, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (118, 1, 4000, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (119, 1, 4001, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (120, 1, 4002, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (121, 1, 4100, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (122, 1, 4101, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (123, 1, 4102, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (124, 1, 4103, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (125, 1, 4104, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (127, 3, 3004, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (128, 2, 3004, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (129, 3, 3100, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (130, 2, 3100, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (131, 3, 3101, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (132, 2, 3101, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (133, 3, 3102, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (134, 2, 3102, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (135, 3, 3103, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (136, 2, 3103, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (137, 3, 3104, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (138, 2, 3104, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (139, 3, 3105, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (140, 2, 3105, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (141, 3, 3106, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (142, 2, 3106, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (143, 3, 3200, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (144, 2, 3200, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (145, 3, 3201, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (146, 2, 3201, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (147, 3, 3202, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (148, 2, 3202, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (149, 3, 3300, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (150, 2, 3300, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (151, 3, 3301, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (152, 2, 3301, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (153, 3, 3302, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (154, 2, 3302, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (155, 3, 3303, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (156, 2, 3303, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (157, 3, 3400, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (158, 2, 3400, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (159, 3, 3401, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (160, 2, 3401, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (161, 3, 3402, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (162, 2, 3402, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (163, 3, 3403, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (164, 2, 3403, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (165, 3, 3404, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (166, 2, 3404, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (167, 3, 3405, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (168, 2, 3405, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (169, 3, 3406, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (170, 2, 3406, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (171, 3, 3500, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (172, 2, 3500, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (173, 3, 3501, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (174, 2, 3501, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (175, 3, 3502, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (176, 2, 3502, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (177, 3, 3503, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (178, 2, 3503, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (179, 3, 3600, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (180, 2, 3600, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (181, 3, 3601, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (182, 2, 3601, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (183, 3, 3602, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (184, 2, 3602, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (185, 3, 3603, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (186, 2, 3603, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (187, 3, 3604, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (188, 2, 3604, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (189, 3, 3700, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (190, 2, 3700, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (191, 3, 3701, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (192, 2, 3701, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (193, 3, 3702, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (194, 2, 3702, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (195, 3, 3703, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (196, 2, 3703, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (197, 3, 3800, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (198, 2, 3800, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (199, 3, 3801, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (200, 2, 3801, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (201, 3, 3802, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (202, 2, 3802, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (203, 3, 3803, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (204, 2, 3803, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (205, 3, 3804, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (206, 2, 3804, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (207, 3, 3805, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (208, 2, 3805, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (209, 3, 3900, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (210, 2, 3900, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (211, 3, 3901, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (212, 2, 3901, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (213, 3, 3902, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (214, 2, 3902, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (215, 3, 3903, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (216, 2, 3903, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (217, 3, 3904, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (218, 2, 3904, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (219, 3, 3905, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (220, 2, 3905, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (221, 3, 3906, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (222, 2, 3906, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (223, 3, 3907, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (224, 2, 3907, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (225, 3, 3908, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (226, 2, 3908, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (227, 3, 3909, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (228, 2, 3909, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (229, 3, 4000, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (230, 2, 4000, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (231, 3, 4001, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (232, 2, 4001, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (233, 3, 4002, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (234, 2, 4002, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (235, 3, 4100, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (236, 2, 4100, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (237, 3, 4101, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (238, 2, 4101, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (239, 3, 4102, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (240, 2, 4102, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (241, 3, 4103, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (242, 2, 4103, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (243, 3, 4104, NULL, '2026-03-26 14:19:35');
INSERT INTO `sys_role_permission` VALUES (244, 2, 4104, NULL, '2026-03-26 14:19:35');

-- ----------------------------
-- Table structure for sys_user_role
-- ----------------------------
DROP TABLE IF EXISTS `sys_user_role`;
CREATE TABLE `sys_user_role`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `user_id` bigint NOT NULL COMMENT '用户ID',
  `role_id` bigint NOT NULL COMMENT '角色ID',
  `create_by` bigint NULL DEFAULT NULL COMMENT '创建人',
  `create_time` datetime NOT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_user_role`(`user_id` ASC, `role_id` ASC) USING BTREE,
  INDEX `idx_user_id`(`user_id` ASC) USING BTREE,
  INDEX `idx_role_id`(`role_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '用户角色关联表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sys_user_role
-- ----------------------------
INSERT INTO `sys_user_role` VALUES (1, 1, 1, NULL, '2026-03-24 10:39:49');
INSERT INTO `sys_user_role` VALUES (2, 2, 2, NULL, '2026-03-24 10:39:49');
INSERT INTO `sys_user_role` VALUES (3, 3, 2, NULL, '2026-03-24 10:39:49');
INSERT INTO `sys_user_role` VALUES (4, 4, 3, NULL, '2026-03-24 10:39:49');
INSERT INTO `sys_user_role` VALUES (5, 5, 3, 1, '2026-03-26 15:06:08');

-- ----------------------------
-- Table structure for user_token
-- ----------------------------
DROP TABLE IF EXISTS `user_token`;
CREATE TABLE `user_token`  (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'id',
  `user_token` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'token',
  `cdate` datetime NOT NULL COMMENT '登录时间',
  `expiratedtime` datetime NOT NULL COMMENT '过期时间',
  `user_id` int NOT NULL COMMENT '用户id',
  `is_valid` tinyint(1) NOT NULL DEFAULT 1 COMMENT '是否有效：1有效 0失效',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_token`(`user_token` ASC) USING BTREE,
  INDEX `idx_user_id`(`user_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 53 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of user_token
-- ----------------------------
INSERT INTO `user_token` VALUES (1, 'd83e20b6-6657-4edc-ac81-d4c6aa33f11d', '2026-02-23 18:01:43', '2026-03-23 18:01:43', 1, 1);
INSERT INTO `user_token` VALUES (2, 'c580bf25-3bbc-49db-a19c-39901efcc6fa', '2026-03-16 14:05:41', '2026-04-16 14:05:41', 1, 1);
INSERT INTO `user_token` VALUES (3, '608e9676-0f2b-467e-853e-fd2edb226c11', '2026-03-16 14:06:46', '2026-04-16 14:06:46', 1, 1);
INSERT INTO `user_token` VALUES (4, 'df262d66-c601-4561-b6ec-1d310974d305', '2026-03-16 20:16:17', '2026-04-16 20:16:17', 1, 1);
INSERT INTO `user_token` VALUES (5, '1a98f4d5-9ba8-4fab-accf-2aadbc59ce8a', '2026-03-16 22:56:07', '2026-04-16 22:56:07', 1, 1);
INSERT INTO `user_token` VALUES (6, '7e73ce2e-b55a-45bb-aaa6-f4cabc2a7fc2', '2026-03-16 23:04:13', '2026-04-16 23:04:13', 1, 1);
INSERT INTO `user_token` VALUES (7, '6b899123-477a-4fcf-9c4a-f40d25cc3f34', '2026-03-16 23:04:53', '2026-04-16 23:04:53', 1, 1);
INSERT INTO `user_token` VALUES (8, '1ed864ff-7ed7-4b66-8185-9becb5f912cf', '2026-03-16 23:07:27', '2026-04-16 23:07:27', 1, 1);
INSERT INTO `user_token` VALUES (9, '8b6b9770-4e2e-4472-9242-95b216ac1f78', '2026-03-17 13:20:37', '2026-04-17 13:20:37', 1, 1);
INSERT INTO `user_token` VALUES (10, 'baf1aaae-830f-4257-95e2-490083d10edb', '2026-03-17 13:20:50', '2026-04-17 13:20:50', 1, 1);
INSERT INTO `user_token` VALUES (11, 'e93838b7-42ba-4cc2-ac0c-997ccd37ec37', '2026-03-17 13:21:00', '2026-04-17 13:21:00', 1, 1);
INSERT INTO `user_token` VALUES (12, 'a7e8a0ea-d75e-4b61-8717-5c507f7a93b1', '2026-03-17 13:21:12', '2026-04-17 13:21:12', 1, 1);
INSERT INTO `user_token` VALUES (13, 'dec905c8-9877-4349-b24a-5d378d0e85d1', '2026-03-17 13:21:23', '2026-04-17 13:21:23', 1, 1);
INSERT INTO `user_token` VALUES (14, '6a2a5dc7-761e-4c1e-b61f-c2a6c4aae931', '2026-03-17 13:21:36', '2026-04-17 13:21:36', 1, 1);
INSERT INTO `user_token` VALUES (15, 'a441f5e1-b810-4c25-9bc9-31cdaa4463f6', '2026-03-17 13:21:42', '2026-04-17 13:21:42', 1, 1);
INSERT INTO `user_token` VALUES (16, '4ebfc385-894b-44b7-961b-c6b434ba6867', '2026-03-17 13:32:38', '2026-04-17 13:32:38', 1, 1);
INSERT INTO `user_token` VALUES (17, '900030f6-6cfc-4605-bb55-effded265be5', '2026-03-17 13:32:51', '2026-04-17 13:32:51', 1, 1);
INSERT INTO `user_token` VALUES (18, 'fda78b4f-8634-4827-a129-b7ac9ef19df7', '2026-03-17 13:37:11', '2026-04-17 13:37:11', 1, 1);
INSERT INTO `user_token` VALUES (19, 'c1d9ff46-bfb8-45b2-8ec1-230f5cfe8c24', '2026-03-17 13:37:54', '2026-04-17 13:37:54', 1, 1);
INSERT INTO `user_token` VALUES (20, '90ca0c84-128c-43df-b56d-45a4d102e527', '2026-03-17 13:44:15', '2026-04-17 13:44:15', 1, 1);
INSERT INTO `user_token` VALUES (21, '95c6cff9-87d9-49c8-a4f9-239eba7630ff', '2026-03-17 13:44:26', '2026-04-17 13:44:26', 1, 1);
INSERT INTO `user_token` VALUES (22, 'e86cbfe6-ef50-4079-8591-2a04796be41d', '2026-03-17 13:44:48', '2026-04-17 13:44:48', 1, 1);
INSERT INTO `user_token` VALUES (23, '25fbbd65-840c-47f0-bec5-0517e937a108', '2026-03-17 13:55:21', '2026-04-17 13:55:21', 1, 1);
INSERT INTO `user_token` VALUES (24, '5390bd9e-84b1-43ff-8646-1c28b8b99779', '2026-03-17 13:55:46', '2026-04-17 13:55:46', 1, 1);
INSERT INTO `user_token` VALUES (25, '29b0bd28-ec47-4caf-8680-203bf1c868fd', '2026-03-17 14:18:33', '2026-04-17 14:18:33', 1, 1);
INSERT INTO `user_token` VALUES (26, 'aaa6f661-54ad-40cb-99c2-dee751674b2f', '2026-03-17 14:18:38', '2026-04-17 14:18:38', 1, 1);
INSERT INTO `user_token` VALUES (27, 'cad2518a-04b9-4fc1-a0be-bcfcd5d1608d', '2026-03-17 14:42:01', '2026-04-17 14:42:01', 1, 1);
INSERT INTO `user_token` VALUES (28, 'd28c6146-e926-4d71-ae75-e64dfde64aa1', '2026-03-17 18:51:36', '2026-04-17 18:51:36', 1, 1);
INSERT INTO `user_token` VALUES (29, '1ca93d27-8e31-4bf6-8461-f522e7a0e210', '2026-03-17 21:05:05', '2026-04-17 21:05:05', 1, 1);
INSERT INTO `user_token` VALUES (30, '88356e05-ec12-436d-ad6a-f99c8da8e3e1', '2026-03-18 16:09:23', '2026-04-18 16:09:23', 1, 1);
INSERT INTO `user_token` VALUES (31, '0fef5e3e-a446-4663-9663-d588f8b4260b', '2026-03-18 16:13:02', '2026-04-18 16:13:02', 1, 1);
INSERT INTO `user_token` VALUES (32, '52b020e0-be34-483c-9d7f-855c3e13153f', '2026-03-18 19:02:54', '2026-04-18 19:02:54', 1, 1);
INSERT INTO `user_token` VALUES (33, '62e8ac3c-5eab-4960-b250-15f37b015efe', '2026-03-18 19:05:20', '2026-04-18 19:05:20', 1, 1);
INSERT INTO `user_token` VALUES (34, '01ac0b3d-fe19-43d7-8b71-4275a91fdbd8', '2026-03-24 10:58:14', '2026-04-24 10:58:14', 1, 1);
INSERT INTO `user_token` VALUES (35, '95b6954d-3dce-4b9f-9bb8-21bd1d197bbf', '2026-03-24 11:07:06', '2026-04-24 11:07:06', 1, 1);
INSERT INTO `user_token` VALUES (36, 'a620ce4c-5c61-4a28-93a0-03d2882fc7e9', '2026-03-24 12:25:29', '2026-04-24 12:25:29', 1, 1);
INSERT INTO `user_token` VALUES (37, 'e49d38ac-30a3-49f7-b0c0-fab709a81fcc', '2026-03-24 13:06:31', '2026-04-24 13:06:31', 1, 1);
INSERT INTO `user_token` VALUES (38, 'ee149f83-678c-4a2b-8c31-da348db49999', '2026-03-24 13:08:01', '2026-04-24 13:08:01', 1, 1);
INSERT INTO `user_token` VALUES (39, '324d6faf-ec77-4a6e-ba6b-e16bbe78743e', '2026-03-24 13:10:18', '2026-04-24 13:10:18', 1, 1);
INSERT INTO `user_token` VALUES (40, 'e947bb10-a50a-4b80-8b75-b7170598d85a', '2026-03-24 13:11:11', '2026-04-24 13:11:11', 1, 1);
INSERT INTO `user_token` VALUES (41, 'c0695ad0-3e11-41b2-953b-be6617dc135c', '2026-03-24 14:23:29', '2026-04-24 14:23:29', 1, 1);
INSERT INTO `user_token` VALUES (42, 'f3e072bf-b370-4188-84f3-a72824790bbe', '2026-03-24 14:28:55', '2026-04-24 14:28:55', 1, 1);
INSERT INTO `user_token` VALUES (43, '26ca7e61-feb8-4468-83dd-8098b14b9dec', '2026-03-25 16:19:42', '2026-04-25 16:19:42', 1, 1);
INSERT INTO `user_token` VALUES (44, '69c2a2c2-0de6-4577-a372-d040b0a4801c', '2026-03-25 21:06:32', '2026-04-25 21:06:32', 1, 1);
INSERT INTO `user_token` VALUES (45, '3e685946-188a-46bb-a056-ae059bf036aa', '2026-03-26 10:06:00', '2026-04-26 10:06:00', 1, 1);
INSERT INTO `user_token` VALUES (46, '00e5437c-8a4a-4094-9e2a-5d03659333d4', '2026-03-26 14:19:03', '2026-04-26 14:19:03', 1, 1);
INSERT INTO `user_token` VALUES (47, 'cfd38128-f195-45a2-a83c-0d79a0c9547c', '2026-03-26 14:19:12', '2026-04-26 14:19:12', 1, 1);
INSERT INTO `user_token` VALUES (48, '6f7b0bc7-947c-464c-869c-9d61c03fca39', '2026-03-26 15:04:19', '2026-04-26 15:04:19', 1, 1);
INSERT INTO `user_token` VALUES (49, 'a75843c6-442c-4b17-9bc8-26155e40d787', '2026-03-26 15:05:40', '2026-04-26 15:05:40', 5, 1);
INSERT INTO `user_token` VALUES (50, '7852d25b-6ecf-499e-a884-65b3ec89a51b', '2026-03-26 15:05:58', '2026-04-26 15:05:58', 1, 1);
INSERT INTO `user_token` VALUES (51, '32eb1e5e-44e1-4e12-a3ac-92778c17aa53', '2026-03-26 21:45:39', '2026-04-26 21:45:39', 1, 1);
INSERT INTO `user_token` VALUES (52, '3a936671-5f49-446f-aae5-5fe9645ddc6c', '2026-03-26 21:59:08', '2026-04-26 21:59:08', 1, 1);

-- ----------------------------
-- Table structure for warehouse
-- ----------------------------
DROP TABLE IF EXISTS `warehouse`;
CREATE TABLE `warehouse`  (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'id',
  `ware_name` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '仓库名称',
  `position` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '位置',
  `charge_person` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '负责人',
  `capacity` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '容量',
  `cdate` datetime NOT NULL COMMENT '创建时间',
  `status` tinyint(1) NOT NULL DEFAULT 1 COMMENT '状态：1启用 0停用',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '仓库' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of warehouse
-- ----------------------------

-- ----------------------------
-- Table structure for ys_user
-- ----------------------------
DROP TABLE IF EXISTS `ys_user`;
CREATE TABLE `ys_user`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `user_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '用户名',
  `password` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '密码（加密后）',
  `real_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '姓名',
  `user_dep` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '用户部门',
  `dep_id` bigint NOT NULL COMMENT '部门ID',
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '联系电话',
  `email` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '邮箱',
  `account_type` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '操作员' COMMENT '账号属性',
  `warehouse_scope` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '仓库权限范围',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `status` tinyint NOT NULL DEFAULT 1 COMMENT '状态：1启用 0禁用',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_user_name`(`user_name` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '用户表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of ys_user
-- ----------------------------
INSERT INTO `ys_user` VALUES (1, 'admin', '123456', '管理员', '药剂科', 11, NULL, NULL, '管理员', '全部仓库', '2026-03-16 14:05:23', '2026-03-24 10:39:49', 1);
INSERT INTO `ys_user` VALUES (2, 'lier', '000000', '李二', '手术室', 12, NULL, NULL, '科室管理员', '全部仓库', '2026-03-16 14:06:25', '2026-03-24 10:39:49', 1);
INSERT INTO `ys_user` VALUES (4, 'zhaoliu', '123456', '赵六', '检验科', 14, NULL, NULL, '操作员', '全部仓库', '2026-03-24 10:39:49', '2026-03-24 10:39:49', 1);
INSERT INTO `ys_user` VALUES (5, 'ceshi', '000000', '测试', '手术室', 12, '15070268187', NULL, '操作员', '仓库123', '2026-03-26 15:06:07', '2026-03-26 15:06:07', 1);

SET FOREIGN_KEY_CHECKS = 1;
