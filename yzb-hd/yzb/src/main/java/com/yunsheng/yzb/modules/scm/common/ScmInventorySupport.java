package com.yunsheng.yzb.modules.scm.common;

import com.yunsheng.yzb.modules.scm.entity.InventoryEntity;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

/**
 * 库存状态计算工具。
 */
public final class ScmInventorySupport {

    private ScmInventorySupport() {
    }

    public static void refreshStatus(InventoryEntity entity) {
        int currentStock = entity.getCurrentStock() == null ? 0 : entity.getCurrentStock();
        int minStock = entity.getMinStock() == null ? 0 : entity.getMinStock();
        int maxStock = entity.getMaxStock() == null ? Integer.MAX_VALUE : entity.getMaxStock();

        if (currentStock <= 0) {
            entity.setStockStatus(ScmConstants.INVENTORY_OUT);
        } else if (currentStock <= minStock) {
            entity.setStockStatus(ScmConstants.INVENTORY_LOW);
        } else if (currentStock > maxStock) {
            entity.setStockStatus(ScmConstants.INVENTORY_HIGH);
        } else {
            entity.setStockStatus(ScmConstants.INVENTORY_NORMAL);
        }

        LocalDate expiryDate = entity.getExpiryDate();
        Integer warningDays = entity.getExpiryWarningDays();
        if (expiryDate != null && warningDays != null) {
            long remainingDays = ChronoUnit.DAYS.between(LocalDate.now(), expiryDate);
            if (remainingDays <= warningDays) {
                entity.setWarning(ScmConstants.WARNING_EXPIRING);
                return;
            }
        }

        if (ScmConstants.INVENTORY_LOW.equals(entity.getStockStatus()) || ScmConstants.INVENTORY_OUT.equals(entity.getStockStatus())) {
            entity.setWarning(ScmConstants.WARNING_LOW_STOCK);
        } else if (ScmConstants.INVENTORY_HIGH.equals(entity.getStockStatus())) {
            entity.setWarning(ScmConstants.WARNING_OVERSTOCK);
        } else {
            entity.setWarning(null);
        }
    }
}