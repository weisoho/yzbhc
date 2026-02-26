/*
 Navicat Premium Data Transfer

 Source Server         : root
 Source Server Type    : MySQL
 Source Server Version : 50519
 Source Host           : localhost:3306
 Source Schema         : yzb

 Target Server Type    : MySQL
 Target Server Version : 50519
 File Encoding         : 65001

 Date: 25/02/2026 21:08:59
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for asset
-- ----------------------------
DROP TABLE IF EXISTS `asset`;
CREATE TABLE `asset`  (
                          `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
                          `asset_code` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '资产编码',
                          `asset_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '资产名字',
                          `asset_typeid` int(11) NOT NULL COMMENT '资产类型id',
                          `asset_typename` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '资产类型名称',
                          `spe_model` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '规格型号',
                          `manufacturer` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '生产厂商',
                          `purchase_date` datetime NOT NULL COMMENT '购置日期',
                          `orig_value` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '原值',
                          `service_life` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '年限',
                          `dep_id` int(11) NOT NULL COMMENT '使用部门id',
                          `dep_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '使用部门名称',
                          `sto_location` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '存放地点',
                          `resp_person` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '责任人',
                          `asset_state` int(1) NOT NULL DEFAULT 1 COMMENT '资产状态1再用2闲置3维修4待报废',
                          `depr_method` int(1) NOT NULL DEFAULT 1 COMMENT '折旧方法1直线法2双倍余额递减法3年数总和法',
                          `serial_num` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '序列号',
                          `asset_desc` varchar(2000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '资产描述',
                          `attachment` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '附件',
                          `cdate` datetime NOT NULL COMMENT '创建时间',
                          `udate` datetime NOT NULL COMMENT '更新时间',
                          PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '资产表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of asset
-- ----------------------------

-- ----------------------------
-- Table structure for asset_type
-- ----------------------------
DROP TABLE IF EXISTS `asset_type`;
CREATE TABLE `asset_type`  (
                               `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
                               `asset_code` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '资产类型编码',
                               `asset_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '资产类型名称',
                               `asset_desc` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '资产类型描述',
                               `cdate` datetime NOT NULL COMMENT '创建时间',
                               `asset_state` int(1) NOT NULL DEFAULT 1 COMMENT '1启用0停用',
                               PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '资产类型' ROW_FORMAT = Compact;

-- ----------------------------
-- Records of asset_type
-- ----------------------------

-- ----------------------------
-- Table structure for sys_department
-- ----------------------------
DROP TABLE IF EXISTS `sys_department`;
CREATE TABLE `sys_department`  (
                                   `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '部门ID',
                                   `parent_id` bigint(20) NULL DEFAULT 0 COMMENT '父部门ID，0表示顶级',
                                   `dept_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '部门名称',
                                   `dept_code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '部门编码',
                                   `leader` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '负责人',
                                   `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '联系电话',
                                   `email` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '邮箱',
                                   `status` tinyint(4) NULL DEFAULT 1 COMMENT '状态：0-禁用 1-启用',
                                   `sort_order` int(11) NULL DEFAULT 0 COMMENT '排序',
                                   `create_by` bigint(20) NULL DEFAULT NULL COMMENT '创建人',
                                   `create_time` datetime NOT NULL COMMENT '创建时间',
                                   `update_by` bigint(20) NULL DEFAULT NULL COMMENT '更新人',
                                   `update_time` datetime NOT NULL COMMENT '更新时间',
                                   `is_deleted` tinyint(4) NULL DEFAULT 0 COMMENT '删除标记：0-未删除 1-已删除',
                                   PRIMARY KEY (`id`) USING BTREE,
                                   UNIQUE INDEX `uk_dept_code`(`dept_code`) USING BTREE,
                                   INDEX `idx_parent_id`(`parent_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '部门表' ROW_FORMAT = Compact;

-- ----------------------------
-- Records of sys_department
-- ----------------------------

-- ----------------------------
-- Table structure for sys_permission
-- ----------------------------
DROP TABLE IF EXISTS `sys_permission`;
CREATE TABLE `sys_permission`  (
                                   `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '权限ID',
                                   `parent_id` bigint(20) NULL DEFAULT 0 COMMENT '父权限ID，0表示顶级',
                                   `permission_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '权限名称',
                                   `permission_code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '权限编码',
                                   `permission_type` tinyint(4) NOT NULL COMMENT '权限类型：1-菜单 2-按钮 3-接口',
                                   `path` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '路由路径',
                                   `component` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '组件路径',
                                   `icon` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '图标',
                                   `method` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT 'HTTP方法：GET/POST/PUT/DELETE',
                                   `api_pattern` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT 'API路径匹配模式',
                                   `status` tinyint(4) NULL DEFAULT 1 COMMENT '状态：0-禁用 1-启用',
                                   `sort_order` int(11) NULL DEFAULT 0 COMMENT '排序',
                                   `create_by` bigint(20) NULL DEFAULT NULL COMMENT '创建人',
                                   `create_time` datetime NOT NULL COMMENT '创建时间',
                                   `update_by` bigint(20) NULL DEFAULT NULL COMMENT '更新人',
                                   `update_time` datetime NOT NULL COMMENT '更新时间',
                                   `is_deleted` tinyint(4) NULL DEFAULT 0 COMMENT '删除标记：0-未删除 1-已删除',
                                   PRIMARY KEY (`id`) USING BTREE,
                                   UNIQUE INDEX `uk_permission_code`(`permission_code`) USING BTREE,
                                   INDEX `idx_parent_id`(`parent_id`) USING BTREE,
                                   INDEX `idx_type_status`(`permission_type`, `status`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '权限表' ROW_FORMAT = Compact;

-- ----------------------------
-- Records of sys_permission
-- ----------------------------

-- ----------------------------
-- Table structure for sys_role
-- ----------------------------
DROP TABLE IF EXISTS `sys_role`;
CREATE TABLE `sys_role`  (
                             `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '角色ID',
                             `role_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '角色名称',
                             `role_code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '角色编码',
                             `role_desc` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '角色描述',
                             `data_scope` tinyint(4) NULL DEFAULT 1 COMMENT '数据权限范围：1-全部 2-本部门及以下 3-本部门 4-仅本人 5-自定义',
                             `status` tinyint(4) NULL DEFAULT 1 COMMENT '状态：0-禁用 1-启用',
                             `sort_order` int(11) NULL DEFAULT 0 COMMENT '排序',
                             `create_by` bigint(20) NULL DEFAULT NULL COMMENT '创建人',
                             `create_time` datetime NOT NULL COMMENT '创建时间',
                             `update_by` bigint(20) NULL DEFAULT NULL COMMENT '更新人',
                             `update_time` datetime NOT NULL COMMENT '更新时间',
                             `is_deleted` tinyint(4) NULL DEFAULT 0 COMMENT '删除标记：0-未删除 1-已删除',
                             PRIMARY KEY (`id`) USING BTREE,
                             UNIQUE INDEX `uk_role_code`(`role_code`) USING BTREE,
                             INDEX `idx_status`(`status`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '角色表' ROW_FORMAT = Compact;

-- ----------------------------
-- Records of sys_role
-- ----------------------------

-- ----------------------------
-- Table structure for sys_role_dept
-- ----------------------------
DROP TABLE IF EXISTS `sys_role_dept`;
CREATE TABLE `sys_role_dept`  (
                                  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
                                  `role_id` bigint(20) NOT NULL COMMENT '角色ID',
                                  `dept_id` bigint(20) NOT NULL COMMENT '部门ID',
                                  `create_time` datetime NOT NULL COMMENT '创建时间',
                                  PRIMARY KEY (`id`) USING BTREE,
                                  UNIQUE INDEX `uk_role_dept`(`role_id`, `dept_id`) USING BTREE,
                                  INDEX `idx_role_id`(`role_id`) USING BTREE,
                                  INDEX `idx_dept_id`(`dept_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '角色数据权限关联表' ROW_FORMAT = Compact;

-- ----------------------------
-- Records of sys_role_dept
-- ----------------------------

-- ----------------------------
-- Table structure for sys_role_permission
-- ----------------------------
DROP TABLE IF EXISTS `sys_role_permission`;
CREATE TABLE `sys_role_permission`  (
                                        `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
                                        `role_id` bigint(20) NOT NULL COMMENT '角色ID',
                                        `permission_id` bigint(20) NOT NULL COMMENT '权限ID',
                                        `create_by` bigint(20) NULL DEFAULT NULL COMMENT '创建人',
                                        `create_time` datetime NOT NULL COMMENT '创建时间',
                                        PRIMARY KEY (`id`) USING BTREE,
                                        UNIQUE INDEX `uk_role_permission`(`role_id`, `permission_id`) USING BTREE,
                                        INDEX `idx_role_id`(`role_id`) USING BTREE,
                                        INDEX `idx_permission_id`(`permission_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '角色权限关联表' ROW_FORMAT = Compact;

-- ----------------------------
-- Records of sys_role_permission
-- ----------------------------

-- ----------------------------
-- Table structure for sys_user_role
-- ----------------------------
DROP TABLE IF EXISTS `sys_user_role`;
CREATE TABLE `sys_user_role`  (
                                  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
                                  `user_id` bigint(20) NOT NULL COMMENT '用户ID',
                                  `role_id` bigint(20) NOT NULL COMMENT '角色ID',
                                  `create_by` bigint(20) NULL DEFAULT NULL COMMENT '创建人',
                                  `create_time` datetime NOT NULL COMMENT '创建时间',
                                  PRIMARY KEY (`id`) USING BTREE,
                                  UNIQUE INDEX `uk_user_role`(`user_id`, `role_id`) USING BTREE,
                                  INDEX `idx_user_id`(`user_id`) USING BTREE,
                                  INDEX `idx_role_id`(`role_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '用户角色关联表' ROW_FORMAT = Compact;

-- ----------------------------
-- Records of sys_user_role
-- ----------------------------

-- ----------------------------
-- Table structure for transfer
-- ----------------------------
DROP TABLE IF EXISTS `transfer`;
CREATE TABLE `transfer`  (
                             `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
                             `asset_id` int(11) NOT NULL COMMENT '资产id',
                             `dep_id` int(11) NOT NULL COMMENT '调拨来源',
                             `cdate` datetime NOT NULL COMMENT '创建时间',
                             `udate` datetime NOT NULL COMMENT '更新时间',
                             `transfer_code` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '调拨单号',
                             `asset_code` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '资产编码',
                             `asset_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '资产名称',
                             `asset_typeid` int(11) NOT NULL COMMENT '资产id',
                             `asset_typename` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '资产类型名称',
                             `spe_model` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '规格型号',
                             `orig_value` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '原值',
                             `bedep_id` int(11) NOT NULL COMMENT '接受部门',
                             PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '调拨' ROW_FORMAT = Compact;

-- ----------------------------
-- Records of transfer
-- ----------------------------

-- ----------------------------
-- Table structure for user_token
-- ----------------------------
DROP TABLE IF EXISTS `user_token`;
CREATE TABLE `user_token`  (
                               `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
                               `user_token` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT 'token',
                               `cdate` datetime NOT NULL COMMENT '登录时间',
                               `expiratedtime` datetime NOT NULL COMMENT '过期时间',
                               `user_id` int(11) NOT NULL COMMENT '用户id',
                               PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of user_token
-- ----------------------------
INSERT INTO `user_token` VALUES (1, 'd83e20b6-6657-4edc-ac81-d4c6aa33f11d', '2026-02-23 18:01:43', '2026-03-23 18:01:43', 1);

-- ----------------------------
-- Table structure for warehouse
-- ----------------------------
DROP TABLE IF EXISTS `warehouse`;
CREATE TABLE `warehouse`  (
                              `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
                              `ware_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '仓库名称',
                              `position` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '位置',
                              `charge_person` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '负责人',
                              `capacity` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '容量',
                              `cdate` datetime NOT NULL COMMENT '创建时间',
                              `status` int(1) NOT NULL DEFAULT 1 COMMENT '状态',
                              PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '仓库' ROW_FORMAT = Compact;

-- ----------------------------
-- Records of warehouse
-- ----------------------------

-- ----------------------------
-- Table structure for ys_user
-- ----------------------------
DROP TABLE IF EXISTS `ys_user`;
CREATE TABLE `ys_user`  (
                            `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
                            `user_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '用户名',
                            `password` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '密码',
                            `user_dep` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '用户部门',
                            `dep_id` int(11) NOT NULL COMMENT '部门id',
                            PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of ys_user
-- ----------------------------
INSERT INTO `ys_user` VALUES (1, '1', '1', '1', 1);

SET FOREIGN_KEY_CHECKS = 1;
