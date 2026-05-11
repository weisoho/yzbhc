/*
 Navicat Premium Data Transfer

 Source Server         : 114.132.251.50
 Source Server Type    : MySQL
 Source Server Version : 80045 (8.0.45)
 Source Host           : 114.132.251.50:33066
 Source Schema         : yzb

 Target Server Type    : MySQL
 Target Server Version : 80045 (8.0.45)
 File Encoding         : 65001

 Date: 30/04/2026 22:51:54
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for adverse_event_record
-- ----------------------------
DROP TABLE IF EXISTS `adverse_event_record`;
CREATE TABLE `adverse_event_record`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键',
  `event_no` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '事件编号',
  `patient_name` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '患者姓名',
  `gender` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '性别',
  `age` int NULL DEFAULT NULL COMMENT '年龄',
  `patient_id` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '患者/条码号',
  `hospitalization_no` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '住院号',
  `involved_project` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '涉及项目',
  `event_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '事件名称',
  `occurrence_date` datetime NOT NULL COMMENT '发生日期',
  `status` tinyint NOT NULL DEFAULT 1 COMMENT '状态 1待处理 2处理中 3已完成',
  `event_summary` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '事件概述',
  `investigation_situation` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '调查情况',
  `event_analysis` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '事件分析',
  `event_summary_detail` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '事件总结',
  `handling_result` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '处理结果',
  `rectification_measures` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '整改措施',
  `attachment` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '附件',
  `recorder_id` int NULL DEFAULT NULL COMMENT '登记人ID',
  `recorder_name` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '登记人',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `delete_flag` tinyint NOT NULL DEFAULT 0 COMMENT '删除标记 0正常 1删除',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_adverse_event_no`(`event_no` ASC) USING BTREE,
  INDEX `idx_adverse_event_date`(`occurrence_date` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '医疗器械不良事件登记' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of adverse_event_record
-- ----------------------------

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
-- Table structure for asset_change_record
-- ----------------------------
DROP TABLE IF EXISTS `asset_change_record`;
CREATE TABLE `asset_change_record`  (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '主键',
  `change_code` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '变更单号',
  `asset_id` int NOT NULL COMMENT '资产ID',
  `asset_code` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '资产编码',
  `asset_name` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '资产名称',
  `change_type` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '变更类型',
  `old_value` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '原值',
  `new_value` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '新值',
  `change_reason` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '变更原因',
  `change_date` datetime NULL DEFAULT NULL COMMENT '计划变更日期',
  `applicant_id` int NULL DEFAULT NULL COMMENT '申请人ID',
  `applicant_name` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '申请人',
  `apply_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '申请时间',
  `audit_status` int NOT NULL DEFAULT 1 COMMENT '审核状态 1待审核 2已通过 3已驳回 4已撤销',
  `auditor_id` int NULL DEFAULT NULL COMMENT '审核人ID',
  `auditor_name` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '审核人',
  `audit_date` datetime NULL DEFAULT NULL COMMENT '审核时间',
  `audit_remark` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '审核意见',
  `execute_status` int NOT NULL DEFAULT 0 COMMENT '执行状态 0未执行 1处理中 2已完成',
  `executor_name` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '执行人',
  `execute_date` datetime NULL DEFAULT NULL COMMENT '执行时间',
  `scrap_value` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '报废净值/残值',
  `remark` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '备注',
  `delete_flag` tinyint NOT NULL DEFAULT 0 COMMENT '删除标记 0正常 1删除',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_asset_change_asset`(`asset_id` ASC) USING BTREE,
  INDEX `idx_asset_change_type`(`change_type` ASC) USING BTREE,
  INDEX `idx_asset_change_status`(`audit_status` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '资产报废及变更记录' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of asset_change_record
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
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '资产调拨明细' ROW_FORMAT = DYNAMIC;

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
-- Table structure for asset_warning_record
-- ----------------------------
DROP TABLE IF EXISTS `asset_warning_record`;
CREATE TABLE `asset_warning_record`  (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '主键',
  `asset_id` int NOT NULL COMMENT '资产ID',
  `asset_code` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '资产编码',
  `asset_name` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '资产名称',
  `warning_type` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '预警类型',
  `warning_level` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '预警级别',
  `warning_date` datetime NULL DEFAULT NULL COMMENT '预警日期',
  `due_date` datetime NULL DEFAULT NULL COMMENT '到期日期',
  `days_left` int NULL DEFAULT NULL COMMENT '剩余天数',
  `status` int NOT NULL DEFAULT 1 COMMENT '处理状态 1待处理 2处理中 3已完成',
  `description` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '预警描述',
  `action_required` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '建议措施',
  `handler_id` int NULL DEFAULT NULL COMMENT '处理人ID',
  `handler_name` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '处理人',
  `handle_time` datetime NULL DEFAULT NULL COMMENT '处理时间',
  `remark` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_asset_warning`(`asset_id` ASC, `warning_type` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '资产预警处理记录' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of asset_warning_record
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
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci COMMENT = '盘点表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of check_inventory
-- ----------------------------

-- ----------------------------
-- Table structure for consumable_quality_issue
-- ----------------------------
DROP TABLE IF EXISTS `consumable_quality_issue`;
CREATE TABLE `consumable_quality_issue`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键',
  `issue_no` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '问题编号',
  `inventory_id` bigint NOT NULL COMMENT '库存ID',
  `material_id` bigint NULL DEFAULT NULL COMMENT '物资ID',
  `material_code` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '物资编码',
  `material_name` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '物资名称',
  `specification` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '规格',
  `model` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '型号',
  `registration_number` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '注册证号',
  `manufacturer` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '生产厂家',
  `supplier_name` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '供应商',
  `batch_number` varchar(120) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '批号',
  `unique_code` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '物资唯一码',
  `production_date` date NULL DEFAULT NULL COMMENT '生产日期',
  `expiry_date` date NULL DEFAULT NULL COMMENT '有效期',
  `quantity` int NOT NULL COMMENT '问题数量',
  `occurrence_date` datetime NOT NULL COMMENT '发生日期',
  `status` tinyint NOT NULL DEFAULT 1 COMMENT '状态 1待处理 2处理中 3已完成',
  `issue_description` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '问题描述',
  `attachment` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '附件',
  `creator_id` int NULL DEFAULT NULL COMMENT '登记人ID',
  `creator_name` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '登记人',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `delete_flag` tinyint NOT NULL DEFAULT 0 COMMENT '删除标记 0正常 1删除',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_quality_issue_no`(`issue_no` ASC) USING BTREE,
  INDEX `idx_quality_issue_inventory`(`inventory_id` ASC) USING BTREE,
  INDEX `idx_quality_issue_date`(`occurrence_date` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '耗材质量问题登记' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of consumable_quality_issue
-- ----------------------------

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
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci COMMENT = '样本-项目管理' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sample_item
-- ----------------------------

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
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci COMMENT = '样本量管理' ROW_FORMAT = DYNAMIC;

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
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '异常订单' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of scm_exception_order
-- ----------------------------
INSERT INTO `scm_exception_order` VALUES (1, 'PO202604300002', 2, '南昌云晟健康科技有限公司', 'SUP202604300001', '11', '管理员', '管理员', NULL, '2026-04-30', '2026-05-03', '2026-04-30', '待验收', '部分到货', NULL, 475000.00, '2026-04-30 22:14:06', '2026-04-30 22:15:09');
INSERT INTO `scm_exception_order` VALUES (2, 'PO202604300001', 1, '南昌云晟健康科技有限公司', 'SUP202604300001', '11', '管理员', '管理员', NULL, '2026-04-30', '2026-05-03', '2026-04-30', '待验收', '部分到货', NULL, 475000.00, '2026-04-30 22:14:21', '2026-04-30 22:15:04');
INSERT INTO `scm_exception_order` VALUES (3, 'PO202604300004', 4, '南昌云晟健康科技有限公司', 'SUP202604300001', '11', '管理员', '管理员', NULL, '2026-04-30', '2026-05-03', '2026-04-30', '待验收', '部分到货', NULL, 475000.00, '2026-04-30 22:20:12', '2026-04-30 22:20:25');

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
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '物资字典' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of scm_material
-- ----------------------------
INSERT INTO `scm_material` VALUES (1, '1', 'FT3', 'IVD', '4×1.5ml', '4×1.5ml', '1个测试', '只', 950.00, 1, '南昌云晟健康科技有限公司', 1, '国械注进20162404586', '罗氏诊断', '2-8', 'active', '2026-04-30 22:07:08', '2026-04-30 22:12:35');

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
) ENGINE = InnoDB AUTO_INCREMENT = 36 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '操作日志' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of scm_operation_log
-- ----------------------------
INSERT INTO `scm_operation_log` VALUES (1, '2026-04-30 21:54:36', 'system', '维护', '新增供应商: 南昌云晟健康科技有限公司', 'success', '223.104.86.61', '供应商维护', 'SUP202604300001', '2026-04-30 21:54:36');
INSERT INTO `scm_operation_log` VALUES (2, '2026-04-30 21:56:14', 'system', '维护', '新增供应商资质: 南昌云晟健康科技有限公司 / REGISTRATION_CERTIFICATE', 'success', '223.104.86.61', '供应商资质', '国械注进20162404586', '2026-04-30 21:56:14');
INSERT INTO `scm_operation_log` VALUES (3, '2026-04-30 21:56:33', 'system', '维护', '更新供应商资质: INSPECTION_REPORT', 'success', '223.104.86.61', '供应商资质', '国械注进20162404586', '2026-04-30 21:56:33');
INSERT INTO `scm_operation_log` VALUES (4, '2026-04-30 21:58:07', 'system', '维护', '新增供应商: 罗氏诊断', 'success', '223.104.86.61', '供应商维护', 'SUP202604300002', '2026-04-30 21:58:07');
INSERT INTO `scm_operation_log` VALUES (5, '2026-04-30 21:59:40', 'system', '维护', '新增供应商资质: 罗氏诊断 / BUSINESS_LICENSE', 'success', '223.104.86.61', '供应商资质', '64236424', '2026-04-30 21:59:40');
INSERT INTO `scm_operation_log` VALUES (6, '2026-04-30 22:00:17', 'system', '维护', '新增供应商资质: 南昌云晟健康科技有限公司 / BUSINESS_CERTIFICATE', 'success', '223.104.86.61', '供应商资质', '91360122MAK6223Y2X', '2026-04-30 22:00:17');
INSERT INTO `scm_operation_log` VALUES (7, '2026-04-30 22:04:43', 'system', '维护', '更新供应商资质: BUSINESS_LICENSE', 'success', '223.104.86.61', '供应商资质', '64236424', '2026-04-30 22:04:43');
INSERT INTO `scm_operation_log` VALUES (8, '2026-04-30 22:05:42', 'system', '维护', '更新供应商资质: BUSINESS_LICENSE', 'success', '223.104.86.61', '供应商资质', '64236424', '2026-04-30 22:05:42');
INSERT INTO `scm_operation_log` VALUES (9, '2026-04-30 22:05:58', 'system', '维护', '更新供应商资质: BUSINESS_LICENSE', 'success', '223.104.86.61', '供应商资质', '64236424', '2026-04-30 22:05:58');
INSERT INTO `scm_operation_log` VALUES (10, '2026-04-30 22:06:47', 'system', '维护', '新增供应商资质: 南昌云晟健康科技有限公司 / BUSINESS_LICENSE', 'success', '223.104.86.61', '供应商资质', '64236424', '2026-04-30 22:06:47');
INSERT INTO `scm_operation_log` VALUES (11, '2026-04-30 22:07:08', 'system', '新增', '新增物资字典: FT3', 'success', '223.104.86.61', '物资字典', '1', '2026-04-30 22:07:08');
INSERT INTO `scm_operation_log` VALUES (12, '2026-04-30 22:11:43', '管理员', '新增', '创建采购单: PO202604300001', 'success', '223.104.86.61', '采购管理', 'PO202604300001', '2026-04-30 22:11:43');
INSERT INTO `scm_operation_log` VALUES (13, '2026-04-30 22:11:44', '管理员', '提交', '提交采购单: PO202604300001', 'success', '223.104.86.61', '采购管理', 'PO202604300001', '2026-04-30 22:11:44');
INSERT INTO `scm_operation_log` VALUES (14, '2026-04-30 22:12:35', 'system', '维护', '更新物资字典: FT3', 'success', '223.104.86.61', '物资字典', '1', '2026-04-30 22:12:35');
INSERT INTO `scm_operation_log` VALUES (15, '2026-04-30 22:12:54', '管理员', '新增', '创建采购单: PO202604300002', 'success', '223.104.86.61', '采购管理', 'PO202604300002', '2026-04-30 22:12:54');
INSERT INTO `scm_operation_log` VALUES (16, '2026-04-30 22:12:54', '管理员', '提交', '提交采购单: PO202604300002', 'success', '223.104.86.61', '采购管理', 'PO202604300002', '2026-04-30 22:12:54');
INSERT INTO `scm_operation_log` VALUES (17, '2026-04-30 22:13:17', '管理员', '审核', '通过采购单: PO202604300002', 'success', '223.104.86.61', '采购审核', 'PO202604300002', '2026-04-30 22:13:17');
INSERT INTO `scm_operation_log` VALUES (18, '2026-04-30 22:13:23', '管理员', '审核', '通过采购单: PO202604300001', 'success', '223.104.86.61', '采购审核', 'PO202604300001', '2026-04-30 22:13:23');
INSERT INTO `scm_operation_log` VALUES (19, '2026-04-30 22:14:06', '管理员', '收货', '采购收货: PO202604300002', 'warning', '223.104.86.61', '采购收货', 'RC202604300001', '2026-04-30 22:14:06');
INSERT INTO `scm_operation_log` VALUES (20, '2026-04-30 22:14:21', '管理员', '收货', '采购收货: PO202604300001', 'warning', '223.104.86.61', '采购收货', 'RC202604300002', '2026-04-30 22:14:21');
INSERT INTO `scm_operation_log` VALUES (21, '2026-04-30 22:15:04', '当前用户', '提交', '重新提交异常订单: PO202604300001', 'success', '223.104.86.61', '异常订单', 'PO202604300001', '2026-04-30 22:15:04');
INSERT INTO `scm_operation_log` VALUES (22, '2026-04-30 22:15:09', '当前用户', '提交', '重新提交异常订单: PO202604300002', 'success', '223.104.86.61', '异常订单', 'PO202604300002', '2026-04-30 22:15:09');
INSERT INTO `scm_operation_log` VALUES (23, '2026-04-30 22:17:14', 'system', '维护', '新增供应商资质: 南昌云晟健康科技有限公司 / REGISTRATION_CERTIFICATE', 'success', '223.104.86.61', '供应商资质', '国械注进201624045888', '2026-04-30 22:17:14');
INSERT INTO `scm_operation_log` VALUES (24, '2026-04-30 22:17:22', 'system', '删除', '删除供应商资质: 国械注进201624045888', 'success', '223.104.86.61', '供应商资质', '国械注进201624045888', '2026-04-30 22:17:22');
INSERT INTO `scm_operation_log` VALUES (25, '2026-04-30 22:17:43', 'system', '维护', '新增供应商资质: 南昌云晟健康科技有限公司 / REGISTRATION_CERTIFICATE', 'success', '223.104.86.61', '供应商资质', '国械注进201624045887', '2026-04-30 22:17:43');
INSERT INTO `scm_operation_log` VALUES (26, '2026-04-30 22:18:22', 'system', '维护', '新增供应商资质: 南昌云晟健康科技有限公司 / BUSINESS_LICENSE', 'success', '223.104.86.61', '供应商资质', '642364', '2026-04-30 22:18:22');
INSERT INTO `scm_operation_log` VALUES (27, '2026-04-30 22:19:00', '管理员', '新增', '创建采购单: PO202604300003', 'success', '223.104.86.61', '采购管理', 'PO202604300003', '2026-04-30 22:19:00');
INSERT INTO `scm_operation_log` VALUES (28, '2026-04-30 22:19:01', '管理员', '提交', '提交采购单: PO202604300003', 'success', '223.104.86.61', '采购管理', 'PO202604300003', '2026-04-30 22:19:01');
INSERT INTO `scm_operation_log` VALUES (29, '2026-04-30 22:19:09', '管理员', '审核', '通过采购单: PO202604300003', 'success', '223.104.86.61', '采购审核', 'PO202604300003', '2026-04-30 22:19:09');
INSERT INTO `scm_operation_log` VALUES (30, '2026-04-30 22:19:27', '管理员', '收货', '采购收货: PO202604300003', 'success', '223.104.86.61', '采购收货', 'RC202604300003', '2026-04-30 22:19:27');
INSERT INTO `scm_operation_log` VALUES (31, '2026-04-30 22:19:50', '管理员', '新增', '创建采购单: PO202604300004', 'success', '223.104.86.61', '采购管理', 'PO202604300004', '2026-04-30 22:19:50');
INSERT INTO `scm_operation_log` VALUES (32, '2026-04-30 22:19:50', '管理员', '提交', '提交采购单: PO202604300004', 'success', '223.104.86.61', '采购管理', 'PO202604300004', '2026-04-30 22:19:50');
INSERT INTO `scm_operation_log` VALUES (33, '2026-04-30 22:19:56', '管理员', '审核', '通过采购单: PO202604300004', 'success', '223.104.86.61', '采购审核', 'PO202604300004', '2026-04-30 22:19:56');
INSERT INTO `scm_operation_log` VALUES (34, '2026-04-30 22:20:12', '管理员', '收货', '采购收货: PO202604300004', 'warning', '223.104.86.61', '采购收货', 'RC202604300004', '2026-04-30 22:20:12');
INSERT INTO `scm_operation_log` VALUES (35, '2026-04-30 22:20:25', '当前用户', '提交', '重新提交异常订单: PO202604300004', 'success', '223.104.86.61', '异常订单', 'PO202604300004', '2026-04-30 22:20:25');

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
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of scm_product_price_adjustment
-- ----------------------------
INSERT INTO `scm_product_price_adjustment` VALUES (1, 1, '1', 'FT3', 'IVD', '4×1.5ml', '4×1.5ml', '100个测试', '只', 1000.00, '国械注进20162404586', '南昌云晟健康科技有限公司', '罗氏诊断', '渠道调整', NULL, NULL, 1000.00, 950.00, -50.00, -5.00, NULL, '2026-04-30 22:08:28', '2026-04-30 22:08:28', '2026-04-30 22:08:28');

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
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '采购单主表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of scm_purchase_order
-- ----------------------------
INSERT INTO `scm_purchase_order` VALUES (1, 'PO202604300001', 11, '11', 1, '南昌云晟健康科技有限公司', '管理员', 'monthly', '待入库', '1月计划', NULL, 950000.00, 1, '2026-04-30 22:11:43', '2026-04-30 22:13:23', '2026-04-30 22:11:43', '2026-04-30 22:14:21');
INSERT INTO `scm_purchase_order` VALUES (2, 'PO202604300002', 11, '11', 1, '南昌云晟健康科技有限公司', '管理员', 'monthly', '待入库', '', NULL, 950000.00, 1, '2026-04-30 22:12:54', '2026-04-30 22:13:17', '2026-04-30 22:12:54', '2026-04-30 22:14:06');
INSERT INTO `scm_purchase_order` VALUES (3, 'PO202604300003', 11, '11', 1, '南昌云晟健康科技有限公司', '管理员', 'monthly', '待入库', '', NULL, 950000.00, 1, '2026-04-30 22:19:01', '2026-04-30 22:19:09', '2026-04-30 22:19:00', '2026-04-30 22:19:27');
INSERT INTO `scm_purchase_order` VALUES (4, 'PO202604300004', 11, '11', 1, '南昌云晟健康科技有限公司', '管理员', 'monthly', '待入库', '', NULL, 950000.00, 1, '2026-04-30 22:19:50', '2026-04-30 22:19:56', '2026-04-30 22:19:50', '2026-04-30 22:20:12');

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
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '采购单明细' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of scm_purchase_order_item
-- ----------------------------
INSERT INTO `scm_purchase_order_item` VALUES (1, 1, 1, '1', 'FT3', '4×1.5ml', '4×1.5ml', '只', '罗氏诊断', '南昌云晟健康科技有限公司', '国械注进20162404586', 950.00, 1000, 500, 0, 950000.00, '部分到货', '2026-04-30 22:11:43', '2026-04-30 22:14:21');
INSERT INTO `scm_purchase_order_item` VALUES (2, 2, 1, '1', 'FT3', '4×1.5ml', '4×1.5ml', '只', '罗氏诊断', '南昌云晟健康科技有限公司', '国械注进20162404586', 950.00, 1000, 500, 0, 950000.00, '部分到货', '2026-04-30 22:12:54', '2026-04-30 22:14:06');
INSERT INTO `scm_purchase_order_item` VALUES (3, 3, 1, '1', 'FT3', '4×1.5ml', '4×1.5ml', '只', '罗氏诊断', '南昌云晟健康科技有限公司', '国械注进20162404586', 950.00, 1000, 1000, 0, 950000.00, '已到货', '2026-04-30 22:19:00', '2026-04-30 22:19:27');
INSERT INTO `scm_purchase_order_item` VALUES (4, 4, 1, '1', 'FT3', '4×1.5ml', '4×1.5ml', '只', '罗氏诊断', '南昌云晟健康科技有限公司', '国械注进20162404586', 950.00, 1000, 500, 0, 950000.00, '部分到货', '2026-04-30 22:19:50', '2026-04-30 22:20:12');

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
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '采购收货单' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of scm_purchase_receive
-- ----------------------------
INSERT INTO `scm_purchase_receive` VALUES (1, 'RC202604300001', 2, 'PO202604300002', 1, '南昌云晟健康科技有限公司', 'SUP202604300001', '11', '管理员', '管理员', '13800000000', '2026-04-30', '2026-05-03', '2026-04-30', '管理员', '待入库', 475000.00, 1, '', '2026-04-30 22:14:06', '2026-04-30 22:14:06');
INSERT INTO `scm_purchase_receive` VALUES (2, 'RC202604300002', 1, 'PO202604300001', 1, '南昌云晟健康科技有限公司', 'SUP202604300001', '11', '管理员', '管理员', '13800000000', '2026-04-30', '2026-05-03', '2026-04-30', '管理员', '待入库', 475000.00, 1, '', '2026-04-30 22:14:21', '2026-04-30 22:14:21');
INSERT INTO `scm_purchase_receive` VALUES (3, 'RC202604300003', 3, 'PO202604300003', 1, '南昌云晟健康科技有限公司', 'SUP202604300001', '11', '管理员', '管理员', '13800000000', '2026-04-30', '2026-05-03', '2026-04-30', '管理员', '待入库', 950000.00, 1, '', '2026-04-30 22:19:27', '2026-04-30 22:19:27');
INSERT INTO `scm_purchase_receive` VALUES (4, 'RC202604300004', 4, 'PO202604300004', 1, '南昌云晟健康科技有限公司', 'SUP202604300001', '11', '管理员', '管理员', '13800000000', '2026-04-30', '2026-05-03', '2026-04-30', '管理员', '待入库', 475000.00, 1, '', '2026-04-30 22:20:12', '2026-04-30 22:20:12');

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
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '采购收货明细' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of scm_purchase_receive_item
-- ----------------------------
INSERT INTO `scm_purchase_receive_item` VALUES (1, 1, 2, '1', 'FT3', '4×1.5ml', '4×1.5ml', '罗氏诊断', '国械注进20162404586', '只', 950.00, 1000, 500, 475000.00, NULL, NULL, NULL, '部分到货', '部分到货', '2026-04-30 22:14:06', '2026-04-30 22:14:06');
INSERT INTO `scm_purchase_receive_item` VALUES (2, 2, 1, '1', 'FT3', '4×1.5ml', '4×1.5ml', '罗氏诊断', '国械注进20162404586', '只', 950.00, 1000, 500, 475000.00, NULL, NULL, NULL, '部分到货', '部分到货', '2026-04-30 22:14:21', '2026-04-30 22:14:21');
INSERT INTO `scm_purchase_receive_item` VALUES (3, 3, 3, '1', 'FT3', '4×1.5ml', '4×1.5ml', '罗氏诊断', '国械注进20162404586', '只', 950.00, 1000, 1000, 950000.00, NULL, NULL, NULL, '已到货', '', '2026-04-30 22:19:27', '2026-04-30 22:19:27');
INSERT INTO `scm_purchase_receive_item` VALUES (4, 4, 4, '1', 'FT3', '4×1.5ml', '4×1.5ml', '罗氏诊断', '国械注进20162404586', '只', 950.00, 1000, 500, 475000.00, NULL, NULL, NULL, '部分到货', '部分到货', '2026-04-30 22:20:12', '2026-04-30 22:20:12');

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
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '供应商表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of supplier
-- ----------------------------
INSERT INTO `supplier` VALUES (1, '南昌云晟健康科技有限公司', '吴志欢', '15288335505', '江西省南昌市', NULL, '经营企业', '可用', 5, '91360122MAK6223Y2X', '吴志欢', '10', '2026-04-30', NULL, 'SUP202604300001', '2026-04-30 21:54:36', '2026-04-30 22:18:22');
INSERT INTO `supplier` VALUES (2, '罗氏诊断', '韦苏豪', '15288335505', '江西省南昌市', NULL, '生产企业', '可用', 1, '91360122MAK6223Y2X', '韦苏豪', '1000', '2026-03-03', NULL, 'SUP202604300002', '2026-04-30 21:58:07', '2026-04-30 22:05:58');

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
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '供应商资质信息表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of supplier_qualification
-- ----------------------------
INSERT INTO `supplier_qualification` VALUES (1, 1, 'REGISTRATION_CERTIFICATE', '游离三碘甲状腺原氨酸定标液', '国械注进20162404586', '产品检验报告', '2026-04-30', '2027-04-30', '检验机构', 'Certification_国械注进20162404586_FT3 III CalSet_20300113(1).pdf', '', '有效', '2026-04-30 21:56:14', '2026-04-30 21:56:33');
INSERT INTO `supplier_qualification` VALUES (2, 2, 'BUSINESS_LICENSE', '南昌云晟健康科技有限公司', '64236424', '经营许可证', '2026-04-01', '2027-04-30', '上海市市场监督管理局', 'Certification_国械注进20162404586_FT3 III CalSet_20300113(1).pdf', '', '有效', '2026-04-30 21:59:40', '2026-04-30 22:05:58');
INSERT INTO `supplier_qualification` VALUES (3, 1, 'BUSINESS_CERTIFICATE', '南昌云晟健康科技有限公司', '91360122MAK6223Y2X', '营业执照', '2026-04-01', '2030-01-01', '9', 'Certification_国械注进20162404586_FT3 III CalSet_20300113(1).pdf', '', '有效', '2026-04-30 22:00:17', '2026-04-30 22:00:17');
INSERT INTO `supplier_qualification` VALUES (4, 1, 'BUSINESS_LICENSE', '南昌云晟健康科技有限公司', '64236424', '经营许可证', '2026-04-30', '2027-04-30', '上海市市场监督管理局', '', '', '有效', '2026-04-30 22:06:47', '2026-04-30 22:06:47');
INSERT INTO `supplier_qualification` VALUES (6, 1, 'REGISTRATION_CERTIFICATE', '游离三碘甲状腺原酸', '国械注进201624045887', '产品检验报告', '2026-04-01', '2027-04-30', '检验机构', '', '', '有效', '2026-04-30 22:17:43', '2026-04-30 22:17:43');
INSERT INTO `supplier_qualification` VALUES (7, 1, 'BUSINESS_LICENSE', '南昌云晟健康科技有限公司', '642364', '经营许可证', '2026-04-15', '2026-04-30', '上海市市场监督管理局', '', '', '即将过期', '2026-04-30 22:18:22', '2026-04-30 22:18:22');

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
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of user_token
-- ----------------------------
INSERT INTO `user_token` VALUES (1, 'a554e9b9-d17a-4895-a76c-d113f250dc89', '2026-04-30 21:53:18', '2026-05-30 21:53:18', 1, 1);
INSERT INTO `user_token` VALUES (2, 'be6906f0-9476-483a-8925-6ad6e5b5404b', '2026-04-30 21:53:54', '2026-05-30 21:53:54', 1, 1);
INSERT INTO `user_token` VALUES (3, '49af84b1-8965-44be-ba35-909b342862e0', '2026-04-30 22:24:17', '2026-05-30 22:24:17', 1, 1);

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
