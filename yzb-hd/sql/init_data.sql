
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