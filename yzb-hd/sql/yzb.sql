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

 Date: 21/02/2026 22:03:45
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `ys_user`;
CREATE TABLE `ys_user`  (
                            `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
                            `user_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '用户名',
                            `password` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '密码',
                            `user_dep` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '用户部门',
                            `dep_id` int(11) NOT NULL COMMENT '部门id',
                            PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of user
-- ----------------------------

-- ----------------------------
-- Table structure for user_token
-- ----------------------------
DROP TABLE IF EXISTS `user_token`;
CREATE TABLE `user_token`  (
                               `id` int(11) NOT NULL COMMENT 'id',
                               `user_token` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT 'token',
                               `cdate` datetime NOT NULL COMMENT '登录时间',
                               `expiratedtime` datetime NOT NULL COMMENT '过期时间',
                               `user_id` int(11) NOT NULL COMMENT '用户id',
                               PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of user_token
-- ----------------------------

SET FOREIGN_KEY_CHECKS = 1;



-- =============================================
-- 权限管理系统数据库设计
-- 基于RBAC模型，支持用户-角色-权限三层架构
-- =============================================

-- 1. 角色表
DROP TABLE IF EXISTS `sys_role`;
CREATE TABLE `sys_role` (
                            `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '角色ID',
                            `role_name` VARCHAR(50) NOT NULL COMMENT '角色名称',
                            `role_code` VARCHAR(50) NOT NULL COMMENT '角色编码',
                            `role_desc` VARCHAR(200) DEFAULT NULL COMMENT '角色描述',
                            `data_scope` TINYINT DEFAULT 1 COMMENT '数据权限范围：1-全部 2-本部门及以下 3-本部门 4-仅本人 5-自定义',
                            `status` TINYINT DEFAULT 1 COMMENT '状态：0-禁用 1-启用',
                            `sort_order` INT DEFAULT 0 COMMENT '排序',
                            `create_by` BIGINT DEFAULT NULL COMMENT '创建人',
                            `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                            `update_by` BIGINT DEFAULT NULL COMMENT '更新人',
                            `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
                            `is_deleted` TINYINT DEFAULT 0 COMMENT '删除标记：0-未删除 1-已删除',
                            PRIMARY KEY (`id`),
                            UNIQUE KEY `uk_role_code` (`role_code`),
                            KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='角色表';

-- 2. 权限表（菜单/按钮/接口）
DROP TABLE IF EXISTS `sys_permission`;
CREATE TABLE `sys_permission` (
                                  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '权限ID',
                                  `parent_id` BIGINT DEFAULT 0 COMMENT '父权限ID，0表示顶级',
                                  `permission_name` VARCHAR(50) NOT NULL COMMENT '权限名称',
                                  `permission_code` VARCHAR(100) NOT NULL COMMENT '权限编码',
                                  `permission_type` TINYINT NOT NULL COMMENT '权限类型：1-菜单 2-按钮 3-接口',
                                  `path` VARCHAR(200) DEFAULT NULL COMMENT '路由路径',
                                  `component` VARCHAR(200) DEFAULT NULL COMMENT '组件路径',
                                  `icon` VARCHAR(50) DEFAULT NULL COMMENT '图标',
                                  `method` VARCHAR(10) DEFAULT NULL COMMENT 'HTTP方法：GET/POST/PUT/DELETE',
                                  `api_pattern` VARCHAR(200) DEFAULT NULL COMMENT 'API路径匹配模式',
                                  `status` TINYINT DEFAULT 1 COMMENT '状态：0-禁用 1-启用',
                                  `sort_order` INT DEFAULT 0 COMMENT '排序',
                                  `create_by` BIGINT DEFAULT NULL COMMENT '创建人',
                                  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                                  `update_by` BIGINT DEFAULT NULL COMMENT '更新人',
                                  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
                                  `is_deleted` TINYINT DEFAULT 0 COMMENT '删除标记：0-未删除 1-已删除',
                                  PRIMARY KEY (`id`),
                                  UNIQUE KEY `uk_permission_code` (`permission_code`),
                                  KEY `idx_parent_id` (`parent_id`),
                                  KEY `idx_type_status` (`permission_type`, `status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='权限表';

-- 3. 用户角色关联表
DROP TABLE IF EXISTS `sys_user_role`;
CREATE TABLE `sys_user_role` (
                                 `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
                                 `user_id` BIGINT NOT NULL COMMENT '用户ID',
                                 `role_id` BIGINT NOT NULL COMMENT '角色ID',
                                 `create_by` BIGINT DEFAULT NULL COMMENT '创建人',
                                 `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                                 PRIMARY KEY (`id`),
                                 UNIQUE KEY `uk_user_role` (`user_id`, `role_id`),
                                 KEY `idx_user_id` (`user_id`),
                                 KEY `idx_role_id` (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户角色关联表';

-- 4. 角色权限关联表
DROP TABLE IF EXISTS `sys_role_permission`;
CREATE TABLE `sys_role_permission` (
                                       `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
                                       `role_id` BIGINT NOT NULL COMMENT '角色ID',
                                       `permission_id` BIGINT NOT NULL COMMENT '权限ID',
                                       `create_by` BIGINT DEFAULT NULL COMMENT '创建人',
                                       `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                                       PRIMARY KEY (`id`),
                                       UNIQUE KEY `uk_role_permission` (`role_id`, `permission_id`),
                                       KEY `idx_role_id` (`role_id`),
                                       KEY `idx_permission_id` (`permission_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='角色权限关联表';

-- 5. 部门表（用于数据权限）
DROP TABLE IF EXISTS `sys_department`;
CREATE TABLE `sys_department` (
                                  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '部门ID',
                                  `parent_id` BIGINT DEFAULT 0 COMMENT '父部门ID，0表示顶级',
                                  `dept_name` VARCHAR(50) NOT NULL COMMENT '部门名称',
                                  `dept_code` VARCHAR(50) NOT NULL COMMENT '部门编码',
                                  `leader` VARCHAR(50) DEFAULT NULL COMMENT '负责人',
                                  `phone` VARCHAR(20) DEFAULT NULL COMMENT '联系电话',
                                  `email` VARCHAR(50) DEFAULT NULL COMMENT '邮箱',
                                  `status` TINYINT DEFAULT 1 COMMENT '状态：0-禁用 1-启用',
                                  `sort_order` INT DEFAULT 0 COMMENT '排序',
                                  `create_by` BIGINT DEFAULT NULL COMMENT '创建人',
                                  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                                  `update_by` BIGINT DEFAULT NULL COMMENT '更新人',
                                  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
                                  `is_deleted` TINYINT DEFAULT 0 COMMENT '删除标记：0-未删除 1-已删除',
                                  PRIMARY KEY (`id`),
                                  UNIQUE KEY `uk_dept_code` (`dept_code`),
                                  KEY `idx_parent_id` (`parent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='部门表';

-- 6. 角色数据权限关联表（自定义数据权限）
DROP TABLE IF EXISTS `sys_role_dept`;
CREATE TABLE `sys_role_dept` (
                                 `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
                                 `role_id` BIGINT NOT NULL COMMENT '角色ID',
                                 `dept_id` BIGINT NOT NULL COMMENT '部门ID',
                                 `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                                 PRIMARY KEY (`id`),
                                 UNIQUE KEY `uk_role_dept` (`role_id`, `dept_id`),
                                 KEY `idx_role_id` (`role_id`),
                                 KEY `idx_dept_id` (`dept_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='角色数据权限关联表';

-- 7. 更新现有用户表（添加部门关联）
ALTER TABLE `ys_user`
    ADD COLUMN `status` TINYINT DEFAULT 1 COMMENT '状态：0-禁用 1-启用',
ADD COLUMN `phone` VARCHAR(20) DEFAULT NULL COMMENT '手机号',
ADD COLUMN `email` VARCHAR(50) DEFAULT NULL COMMENT '邮箱',
ADD COLUMN `avatar` VARCHAR(200) DEFAULT NULL COMMENT '头像',
ADD COLUMN `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
ADD COLUMN `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
                                                                                                             ADD COLUMN `last_login_time` DATETIME DEFAULT NULL COMMENT '最后登录时间',
                                                                                                             ADD COLUMN `is_deleted` TINYINT DEFAULT 0 COMMENT '删除标记：0-未删除 1-已删除',
                                                                                                             ADD INDEX `idx_status` (`status`);

-- =============================================
-- 初始化基础数据
-- =============================================

-- 插入超级管理员角色
INSERT INTO `sys_role` (`id`, `role_name`, `role_code`, `role_desc`, `data_scope`, `status`, `sort_order`)
VALUES (1, '超级管理员', 'SUPER_ADMIN', '拥有系统所有权限', 1, 1, 1);

-- 插入普通管理员角色
INSERT INTO `sys_role` (`id`, `role_name`, `role_code`, `role_desc`, `data_scope`, `status`, `sort_order`)
VALUES (2, '部门管理员', 'DEPT_ADMIN', '管理本部门及下级部门数据', 2, 1, 2);

-- 插入普通用户角色
INSERT INTO `sys_role` (`id`, `role_name`, `role_code`, `role_desc`, `data_scope`, `status`, `sort_order`)
VALUES (3, '普通用户', 'USER', '查看和操作个人数据', 4, 1, 3);

-- 插入顶级部门
INSERT INTO `sys_department` (`id`, `parent_id`, `dept_name`, `dept_code`, `status`, `sort_order`)
VALUES (1, 0, '总公司', 'ROOT', 1, 1);

-- 插入权限示例（菜单）
INSERT INTO `sys_permission` (`id`, `parent_id`, `permission_name`, `permission_code`, `permission_type`, `path`, `icon`, `status`, `sort_order`)
VALUES
    (1, 0, '系统管理', 'system', 1, '/system', 'setting', 1, 1),
    (2, 1, '用户管理', 'system:user', 1, '/system/user', 'user', 1, 1),
    (3, 1, '角色管理', 'system:role', 1, '/system/role', 'team', 1, 2),
    (4, 1, '权限管理', 'system:permission', 1, '/system/permission', 'lock', 1, 3),
    (5, 1, '部门管理', 'system:dept', 1, '/system/dept', 'apartment', 1, 4);

-- 插入权限示例（按钮）
INSERT INTO `sys_permission` (`id`, `parent_id`, `permission_name`, `permission_code`, `permission_type`, `status`, `sort_order`)
VALUES
    (101, 2, '新增用户', 'system:user:add', 2, 1, 1),
    (102, 2, '编辑用户', 'system:user:edit', 2, 1, 2),
    (103, 2, '删除用户', 'system:user:delete', 2, 1, 3),
    (104, 2, '查询用户', 'system:user:query', 2, 1, 4);

-- 插入权限示例（接口）
INSERT INTO `sys_permission` (`id`, `parent_id`, `permission_name`, `permission_code`, `permission_type`, `method`, `api_pattern`, `status`, `sort_order`)
VALUES
    (201, 2, '用户列表接口', 'api:user:list', 3, 'GET', '/api/user/list', 1, 1),
    (202, 2, '用户详情接口', 'api:user:detail', 3, 'GET', '/api/user/{id}', 1, 2),
    (203, 2, '创建用户接口', 'api:user:create', 3, 'POST', '/api/user', 1, 3),
    (204, 2, '更新用户接口', 'api:user:update', 3, 'PUT', '/api/user/{id}', 1, 4),
    (205, 2, '删除用户接口', 'api:user:delete', 3, 'DELETE', '/api/user/{id}', 1, 5);

-- 为超级管理员分配所有权限
INSERT INTO `sys_role_permission` (`role_id`, `permission_id`)
SELECT 1, id FROM `sys_permission` WHERE `is_deleted` = 0;
