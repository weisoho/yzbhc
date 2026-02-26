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
                          `asset_code` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '资产编码',
                          `asset_name` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '资产名字',
                          `asset_typeid` int(11) NOT NULL COMMENT '资产类型id',
                          `asset_typename` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '资产类型名称',
                          `spe_model` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '规格型号',
                          `manufacturer` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '生产厂商',
                          `purchase_date` datetime NOT NULL COMMENT '购置日期',
                          `orig_value` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '原值',
                          `service_life` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '年限',
                          `dep_id` int(11) NOT NULL COMMENT '使用部门id',
                          `dep_name` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '使用部门名称',
                          `sto_location` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '存放地点',
                          `resp_person` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '责任人',
                          `asset_state` tinyint(1) NOT NULL DEFAULT 1 COMMENT '资产状态1在用2闲置3维修4待报废',
                          `depr_method` tinyint(1) NOT NULL DEFAULT 1 COMMENT '折旧方法1直线法2双倍余额递减法3年数总和法',
                          `serial_num` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '序列号',
                          `asset_desc` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '资产描述',
                          `attachment` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '附件',
                          `cdate` datetime NOT NULL COMMENT '创建时间',
                          `udate` datetime NOT NULL COMMENT '更新时间',
                          PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '资产表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of asset
-- ----------------------------

-- ----------------------------
-- Table structure for asset_type
-- ----------------------------
DROP TABLE IF EXISTS `asset_type`;
CREATE TABLE `asset_type`  (
                               `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
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
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '部门表' ROW_FORMAT = DYNAMIC;

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
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '权限表' ROW_FORMAT = DYNAMIC;

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
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '角色表' ROW_FORMAT = DYNAMIC;

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
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '角色数据权限关联表' ROW_FORMAT = DYNAMIC;

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
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '角色权限关联表' ROW_FORMAT = DYNAMIC;

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
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '用户角色关联表' ROW_FORMAT = DYNAMIC;

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
                             `dep_id` int(11) NOT NULL COMMENT '调拨来源部门id',
                             `cdate` datetime NOT NULL COMMENT '创建时间',
                             `udate` datetime NOT NULL COMMENT '更新时间',
                             `transfer_code` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '调拨单号',
                             `asset_code` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '资产编码',
                             `asset_name` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '资产名称',
                             `asset_typeid` int(11) NOT NULL COMMENT '资产类型id',
                             `asset_typename` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '资产类型名称',
                             `spe_model` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '规格型号',
                             `orig_value` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '原值',
                             `bedep_id` int(11) NOT NULL COMMENT '接受部门id',
                             PRIMARY KEY (`id`) USING BTREE,
                             INDEX `idx_asset_id`(`asset_id`) USING BTREE -- 新增索引
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '调拨' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of transfer
-- ----------------------------

-- ----------------------------
-- Table structure for user_token
-- ----------------------------
DROP TABLE IF EXISTS `user_token`;
CREATE TABLE `user_token`  (
                               `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
                               `user_token` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'token',
                               `cdate` datetime NOT NULL COMMENT '登录时间',
                               `expiratedtime` datetime NOT NULL COMMENT '过期时间',
                               `user_id` int(11) NOT NULL COMMENT '用户id',
                               `is_valid` tinyint(1) NOT NULL DEFAULT 1 COMMENT '是否有效：1有效 0失效',
                               PRIMARY KEY (`id`) USING BTREE,
                               UNIQUE INDEX `uk_token`(`user_token`) USING BTREE, -- 新增唯一索引
                               INDEX `idx_user_id`(`user_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of user_token
-- ----------------------------
INSERT INTO `user_token` VALUES (1, 'd83e20b6-6657-4edc-ac81-d4c6aa33f11d', '2026-02-23 18:01:43', '2026-03-23 18:01:43', 1, 1);

-- ----------------------------
-- Table structure for warehouse
-- ----------------------------
DROP TABLE IF EXISTS `warehouse`;
CREATE TABLE `warehouse`  (
                              `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
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
                            `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '用户ID',
                            `user_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '用户名',
                            `password` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '密码（加密后）',
                            `user_dep` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '用户部门',
                            `dep_id` bigint(20) NOT NULL COMMENT '部门id',
                            `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                            `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
                            `status` tinyint(1) NOT NULL DEFAULT 1 COMMENT '状态：1启用 0禁用',
                            PRIMARY KEY (`id`) USING BTREE,
                            UNIQUE INDEX `uk_user_name`(`user_name`) USING BTREE -- 用户名唯一
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of ys_user
-- ----------------------------
-- 插入用户
INSERT INTO `ys_user` VALUES (1, 'admin', '123456', '领导部门', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1);

SET FOREIGN_KEY_CHECKS = 1;

-- =============================================
-- 初始化基础数据
-- =============================================

-- 插入超级管理员角色
INSERT INTO `sys_role` (`id`, `role_name`, `role_code`, `role_desc`, `data_scope`, `status`, `sort_order`, `create_time`, `update_time`)
VALUES (1, '超级管理员', 'SUPER_ADMIN', '拥有系统所有权限', 1, 1, 1, NOW(), NOW());

-- 插入普通管理员角色
INSERT INTO `sys_role` (`id`, `role_name`, `role_code`, `role_desc`, `data_scope`, `status`, `sort_order`, `create_time`, `update_time`)
VALUES (2, '部门管理员', 'DEPT_ADMIN', '管理本部门及下级部门数据', 2, 1, 2, NOW(), NOW());

-- 插入普通用户角色
INSERT INTO `sys_role` (`id`, `role_name`, `role_code`, `role_desc`, `data_scope`, `status`, `sort_order`, `create_time`, `update_time`)
VALUES (3, '普通用户', 'USER', '查看和操作个人数据', 4, 1, 3, NOW(), NOW());

-- 插入顶级部门
INSERT INTO `sys_department` (`id`, `parent_id`, `dept_name`, `dept_code`, `status`, `sort_order`, `create_time`, `update_time`)
VALUES (1, 0, '总公司', 'ROOT', 1, 1, NOW(), NOW());

-- 插入权限示例（菜单）
INSERT INTO `sys_permission` (`id`, `parent_id`, `permission_name`, `permission_code`, `permission_type`, `path`, `icon`, `status`, `sort_order`, `create_time`, `update_time`)
VALUES
    (1, 0, '系统管理', 'system', 1, '/system', 'setting', 1, 1, NOW(), NOW()),
    (2, 1, '用户管理', 'system:user', 1, '/system/user', 'user', 1, 1, NOW(), NOW()),
    (3, 1, '角色管理', 'system:role', 1, '/system/role', 'team', 1, 2, NOW(), NOW()),
    (4, 1, '权限管理', 'system:permission', 1, '/system/permission', 'lock', 1, 3, NOW(), NOW()),
    (5, 1, '部门管理', 'system:dept', 1, '/system/dept', 'apartment', 1, 4, NOW(), NOW());

-- 插入权限示例（按钮）
INSERT INTO `sys_permission` (`id`, `parent_id`, `permission_name`, `permission_code`, `permission_type`, `status`, `sort_order`, `create_time`, `update_time`)
VALUES
    (101, 2, '新增用户', 'system:user:add', 2, 1, 1, NOW(), NOW()),
    (102, 2, '编辑用户', 'system:user:edit', 2, 1, 2, NOW(), NOW()),
    (103, 2, '删除用户', 'system:user:delete', 2, 1, 3, NOW(), NOW()),
    (104, 2, '查询用户', 'system:user:query', 2, 1, 4, NOW(), NOW()),
    (105, 2, '分配用户角色', 'system:user:assign', 2, 1, 5, NOW(), NOW()),
    -- 角色管理按钮权限
    (106, 3, '新增角色', 'system:role:add', 2, 1, 1, NOW(), NOW()),
    (107, 3, '编辑角色', 'system:role:edit', 2, 1, 2, NOW(), NOW()),
    (108, 3, '删除角色', 'system:role:delete', 2, 1, 3, NOW(), NOW()),
    (109, 3, '查询角色', 'system:role:query', 2, 1, 4, NOW(), NOW()),
    (110, 3, '分配角色权限', 'system:role:assign', 2, 1, 5, NOW(), NOW()),
    -- 权限管理按钮权限
    (111, 4, '新增权限', 'system:permission:add', 2, 1, 1, NOW(), NOW()),
    (112, 4, '编辑权限', 'system:permission:edit', 2, 1, 2, NOW(), NOW()),
    (113, 4, '删除权限', 'system:permission:delete', 2, 1, 3, NOW(), NOW()),
    (114, 4, '查询权限', 'system:permission:query', 2, 1, 4, NOW(), NOW());

-- 插入权限示例（接口）
INSERT INTO `sys_permission` (`id`, `parent_id`, `permission_name`, `permission_code`, `permission_type`, `method`, `api_pattern`, `status`, `sort_order`, `create_time`, `update_time`)
VALUES
    (201, 2, '用户列表接口', 'api:user:list', 3, 'GET', '/api/user/list', 1, 1, NOW(), NOW()),
    (202, 2, '用户详情接口', 'api:user:detail', 3, 'GET', '/api/user/{id}', 1, 2, NOW(), NOW()),
    (203, 2, '创建用户接口', 'api:user:create', 3, 'POST', '/api/user', 1, 3, NOW(), NOW()),
    (204, 2, '更新用户接口', 'api:user:update', 3, 'PUT', '/api/user/{id}', 1, 4, NOW(), NOW()),
    (205, 2, '删除用户接口', 'api:user:delete', 3, 'DELETE', '/api/user/{id}', 1, 5, NOW(), NOW()),
    -- 登录接口
    (206, 0, '登录接口', 'api:login', 3, 'GET', '/public/login', 1, 6, NOW(), NOW()),
    -- 资产相关接口
    (207, 0, '新增资产接口', 'api:asset:add', 3, 'POST', '/yzb/addAsset', 1, 7, NOW(), NOW()),
    (208, 0, '编辑资产接口', 'api:asset:update', 3, 'POST', '/yzb/updateAsset', 1, 8, NOW(), NOW()),
    (209, 0, '资产查询接口', 'api:asset:select', 3, 'POST', '/yzb/selectAsset', 1, 9, NOW(), NOW()),
    -- 资产类型相关接口
    (210, 0, '新增资产类型接口', 'api:asset:type:add', 3, 'POST', '/yzb/addAssetType', 1, 10, NOW(), NOW()),
    (211, 0, '编辑资产类型接口', 'api:asset:type:update', 3, 'POST', '/yzb/updateAssetType', 1, 11, NOW(), NOW()),
    (212, 0, '资产类型查询接口', 'api:asset:type:select', 3, 'POST', '/yzb/selectAssetType', 1, 12, NOW(), NOW()),
    -- 维修相关接口
    (213, 0, '新增维修接口', 'api:repair:add', 3, 'POST', '/yzb/addRepair', 1, 13, NOW(), NOW()),
    (214, 0, '编辑维修接口', 'api:repair:update', 3, 'POST', '/yzb/updateRepair', 1, 14, NOW(), NOW()),
    (215, 0, '维修查询接口', 'api:repair:select', 3, 'POST', '/yzb/selectRepairList', 1, 15, NOW(), NOW()),
    -- 仓库相关接口
    (216, 0, '新增仓库接口', 'api:warehouse:add', 3, 'POST', '/yzb/addWarehouse', 1, 16, NOW(), NOW()),
    (217, 0, '删除仓库接口', 'api:warehouse:delete', 3, 'POST', '/yzb/delWarehouse', 1, 17, NOW(), NOW()),
    (218, 0, '编辑仓库接口', 'api:warehouse:update', 3, 'POST', '/yzb/updateWarehouse', 1, 18, NOW(), NOW()),
    (219, 0, '仓库查询接口', 'api:warehouse:select', 3, 'POST', '/yzb/selectWarehouse', 1, 19, NOW(), NOW()),
    (220, 0, '测试接口', 'api:test', 3, 'GET', '/yzb/test', 1, 20, NOW(), NOW()),
    -- 权限相关接口
    (221, 0, '获取当前用户权限接口', 'api:permission:current', 3, 'GET', '/api/permission/current', 1, 21, NOW(), NOW()),
    (222, 0, '获取用户菜单树接口', 'api:permission:menu:tree', 3, 'GET', '/api/permission/menu/tree', 1, 22, NOW(), NOW()),
    (223, 0, '获取所有权限树接口', 'api:permission:tree', 3, 'GET', '/api/permission/tree', 1, 23, NOW(), NOW()),
    (224, 0, '根据角色获取权限接口', 'api:permission:role', 3, 'GET', '/api/permission/role/{roleId}', 1, 24, NOW(), NOW()),
    (225, 0, '创建权限接口', 'api:permission:create', 3, 'POST', '/api/permission', 1, 25, NOW(), NOW()),
    (226, 0, '更新权限接口', 'api:permission:update', 3, 'PUT', '/api/permission/{id}', 1, 26, NOW(), NOW()),
    (227, 0, '删除权限接口', 'api:permission:delete', 3, 'DELETE', '/api/permission/{id}', 1, 27, NOW(), NOW()),
    (228, 0, '批量删除权限接口', 'api:permission:batch:delete', 3, 'DELETE', '/api/permission/batch', 1, 28, NOW(), NOW()),
    -- 角色相关接口
    (229, 0, '查询所有角色接口', 'api:role:list', 3, 'GET', '/api/role/list', 1, 29, NOW(), NOW()),
    (230, 0, '根据ID查询角色接口', 'api:role:get', 3, 'GET', '/api/role/{id}', 1, 30, NOW(), NOW()),
    (231, 0, '根据用户ID查询角色接口', 'api:role:user', 3, 'GET', '/api/role/user/{userId}', 1, 31, NOW(), NOW()),
    (232, 0, '创建角色接口', 'api:role:create', 3, 'POST', '/api/role', 1, 32, NOW(), NOW()),
    (233, 0, '更新角色接口', 'api:role:update', 3, 'PUT', '/api/role/{id}', 1, 33, NOW(), NOW()),
    (234, 0, '删除角色接口', 'api:role:delete', 3, 'DELETE', '/api/role/{id}', 1, 34, NOW(), NOW()),
    (235, 0, '为角色分配权限接口', 'api:role:assign:permission', 3, 'POST', '/api/role/{roleId}/permissions', 1, 35, NOW(), NOW()),
    (236, 0, '为用户分配角色接口', 'api:role:assign:user', 3, 'POST', '/api/role/user/{userId}/roles', 1, 36, NOW(), NOW());

-- 为超级管理员分配所有权限
INSERT INTO `sys_role_permission` (`role_id`, `permission_id`, `create_time`)
SELECT 1, id, NOW() FROM `sys_permission` WHERE `is_deleted` = 0;

-- 为admin用户分配超级管理员角色
INSERT INTO `sys_user_role` (`user_id`, `role_id`, `create_time`)
VALUES (1, 1, NOW());