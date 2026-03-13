-- 后端完整初始化脚本入口
-- 适用场景：空库或新环境初始化
-- 执行方式：在 mysql 客户端进入当前目录后执行本文件
-- 示例：mysql -h127.0.0.1 -P3306 -uroot -proot < backend_bootstrap.sql

CREATE DATABASE IF NOT EXISTS yzb DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE yzb;

SOURCE yzb.sql;
SOURCE init_data.sql;
SOURCE backend_upgrade.sql;