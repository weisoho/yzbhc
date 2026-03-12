package com.yunsheng.yzb.common;

/**
 * 供应链模块常量定义。
 */
public final class ScmConstants {

    private ScmConstants() {
    }

    public static final String STATUS_ACTIVE = "active";
    public static final String STATUS_INACTIVE = "inactive";

    public static final String SUPPLIER_AVAILABLE = "可用";
    public static final String SUPPLIER_UNAVAILABLE = "不可用";

    public static final String QUALIFICATION_VALID = "有效";
    public static final String QUALIFICATION_EXPIRING = "即将过期";
    public static final String QUALIFICATION_EXPIRED = "已过期";

    public static final String PURCHASE_DRAFT = "待提交";
    public static final String PURCHASE_WAIT_AUDIT = "待审核";
    public static final String PURCHASE_REJECTED = "已驳回";
    public static final String PURCHASE_WAIT_RECEIVE = "待收货";
    public static final String PURCHASE_WAIT_STOCK_IN = "待入库";
    public static final String PURCHASE_COMPLETED = "已完成";

    public static final String RECEIPT_WAIT_STOCK_IN = "待入库";
    public static final String RECEIPT_COMPLETED = "已完成";

    public static final String STOCK_IN_COMPLETED = "已完成";
    public static final String STOCK_OUT_COMPLETED = "已完成";
    public static final String STOCK_OUT_UNDOABLE = "可撤销";
    public static final String STOCK_OUT_UNDONE = "已撤销";

    public static final String LOG_SUCCESS = "success";
    public static final String LOG_WARNING = "warning";
    public static final String LOG_ERROR = "error";

    public static final String INVENTORY_NORMAL = "normal";
    public static final String INVENTORY_LOW = "low";
    public static final String INVENTORY_HIGH = "high";
    public static final String INVENTORY_OUT = "out";

    public static final String WARNING_LOW_STOCK = "low_stock";
    public static final String WARNING_OVERSTOCK = "overstock";
    public static final String WARNING_EXPIRING = "expiring";
}