ALTER TABLE adverse_event_record
  ADD COLUMN status tinyint NOT NULL DEFAULT 1 COMMENT '状态 1待处理 2处理中 3已完成' AFTER occurrence_date;

ALTER TABLE consumable_quality_issue
  ADD COLUMN status tinyint NOT NULL DEFAULT 1 COMMENT '状态 1待处理 2处理中 3已完成' AFTER occurrence_date;

UPDATE adverse_event_record
SET status = 1
WHERE status IS NULL;

UPDATE consumable_quality_issue
SET status = 1
WHERE status IS NULL;