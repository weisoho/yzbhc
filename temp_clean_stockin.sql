-- 清除所有入库数据，重置入库流程
DELETE FROM scm_stock_in_item;
DELETE FROM scm_stock_in_order;
-- 将已完成的收货单重置为待入库
UPDATE scm_purchase_receive SET status='待入库' WHERE status='completed';
SELECT 'Done' AS result;