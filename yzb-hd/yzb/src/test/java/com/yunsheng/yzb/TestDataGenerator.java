package com.yunsheng.yzb;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Statement;

public class TestDataGenerator {
    public static void main(String[] args) {
        String url = "jdbc:mysql://localhost:3306/yzb?useUnicode=true&characterEncoding=UTF-8&useSSL=false&serverTimezone=UTC";
        String user = "root";
        String password = "123456";
        
        try (Connection conn = DriverManager.getConnection(url, user, password)) {
            System.out.println("Connected to database successfully!");
            
            // 1. 删除现有测试数据
            deleteExistingData(conn);
            
            // 2. 生成物资数据
            generateMaterialData(conn);
            
            // 3. 生成采购订单数据
            generatePurchaseOrderData(conn);
            
            // 4. 生成采购订单明细
            generatePurchaseOrderItems(conn);
            
            // 5. 生成收货单数据
            generateReceiptData(conn);
            
            // 6. 生成收货单明细
            generateReceiptItems(conn);
            
            // 7. 更新采购订单明细的已收数量
            updateReceivedQuantity(conn);
            
            // 8. 生成入库单数据
            generateStockInOrderData(conn);
            
            // 9. 生成入库单明细
            generateStockInItems(conn);
            
            // 10. 更新采购订单明细的已入库数量
            updateStockedQuantity(conn);
            
            // 11. 生成库存数据
            generateInventoryData(conn);
            
            // 12. 生成库存流水数据
            generateInventoryTransactionData(conn);
            
            System.out.println("Test data generation completed successfully!");
            
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
    
    private static void deleteExistingData(Connection conn) throws SQLException {
        System.out.println("Deleting existing test data...");
        String[] tables = {
            "scm_inventory_transaction",
            "scm_inventory",
            "scm_stock_in_item",
            "scm_stock_in_order",
            "scm_purchase_receive_item",
            "scm_purchase_receive",
            "scm_purchase_order_item",
            "scm_purchase_order",
            "scm_material"
        };
        
        for (String table : tables) {
            String sql = "DELETE FROM " + table;
            try (Statement stmt = conn.createStatement()) {
                stmt.executeUpdate(sql);
            }
        }
    }
    
    private static void generateMaterialData(Connection conn) throws SQLException {
        System.out.println("Generating material data...");
        String sql = "INSERT INTO scm_material (material_code, name, material_type, specification, model, min_package, unit, purchase_price, supplier_id, supplier_name, qualification_id, registration_number, manufacturer, storage_condition, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        try (PreparedStatement pstmt = conn.prepareStatement(sql)) {
            // Material 1
            pstmt.setString(1, "MAT001");
            pstmt.setString(2, "Disposable Syringe");
            pstmt.setString(3, "Medical Device");
            pstmt.setString(4, "1ml");
            pstmt.setString(5, "SYR-001");
            pstmt.setString(6, "100pcs/box");
            pstmt.setString(7, "pc");
            pstmt.setDouble(8, 2.50);
            pstmt.setInt(9, 1);
            pstmt.setString(10, "Shanghai Medical Device Co.");
            pstmt.setInt(11, 2);
            pstmt.setString(12, "SH20200001");
            pstmt.setString(13, "Shanghai Medical Device Co.");
            pstmt.setString(14, "Room Temp");
            pstmt.setString(15, "active");
            pstmt.executeUpdate();
            
            // Material 2
            pstmt.setString(1, "MAT002");
            pstmt.setString(2, "Medical Mask");
            pstmt.setString(3, "Medical Device");
            pstmt.setString(4, "N95");
            pstmt.setString(5, "MASK-001");
            pstmt.setString(6, "50pcs/box");
            pstmt.setString(7, "pc");
            pstmt.setDouble(8, 3.00);
            pstmt.setInt(9, 1);
            pstmt.setString(10, "Shanghai Medical Device Co.");
            pstmt.setInt(11, 2);
            pstmt.setString(12, "SH20200001");
            pstmt.setString(13, "Shanghai Medical Device Co.");
            pstmt.setString(14, "Room Temp");
            pstmt.setString(15, "active");
            pstmt.executeUpdate();
        }
    }
    
    private static void generatePurchaseOrderData(Connection conn) throws SQLException {
        System.out.println("Generating purchase order data...");
        String sql = "INSERT INTO scm_purchase_order (order_number, department_id, department_name, supplier_id, supplier_name, operator_name, plan_type, status, remark, total_amount, item_count, submit_time, audit_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())";
        
        try (PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setString(1, "PO20240001");
            pstmt.setInt(2, 1);
            pstmt.setString(3, "Head Office");
            pstmt.setInt(4, 1);
            pstmt.setString(5, "Shanghai Medical Device Co.");
            pstmt.setString(6, "admin");
            pstmt.setString(7, "Regular Purchase");
            pstmt.setString(8, "completed");
            pstmt.setString(9, "Regular medical supplies purchase");
            pstmt.setDouble(10, 1250.00);
            pstmt.setInt(11, 2);
            pstmt.executeUpdate();
        }
    }
    
    private static void generatePurchaseOrderItems(Connection conn) throws SQLException {
        System.out.println("Generating purchase order items...");
        String sql = "INSERT INTO scm_purchase_order_item (purchase_order_id, material_id, material_code, material_name, specification, model, unit, manufacturer, supplier_name, registration_number, unit_price, quantity, received_quantity, stocked_quantity, amount, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        try (PreparedStatement pstmt = conn.prepareStatement(sql)) {
            // Item 1
            pstmt.setInt(1, 1);
            pstmt.setInt(2, 1);
            pstmt.setString(3, "MAT001");
            pstmt.setString(4, "Disposable Syringe");
            pstmt.setString(5, "1ml");
            pstmt.setString(6, "SYR-001");
            pstmt.setString(7, "pc");
            pstmt.setString(8, "Shanghai Medical Device Co.");
            pstmt.setString(9, "Shanghai Medical Device Co.");
            pstmt.setString(10, "SH20200001");
            pstmt.setDouble(11, 2.50);
            pstmt.setInt(12, 200);
            pstmt.setInt(13, 0);
            pstmt.setInt(14, 0);
            pstmt.setDouble(15, 500.00);
            pstmt.setString(16, "pending");
            pstmt.executeUpdate();
            
            // Item 2
            pstmt.setInt(1, 1);
            pstmt.setInt(2, 2);
            pstmt.setString(3, "MAT002");
            pstmt.setString(4, "Medical Mask");
            pstmt.setString(5, "N95");
            pstmt.setString(6, "MASK-001");
            pstmt.setString(7, "pc");
            pstmt.setString(8, "Shanghai Medical Device Co.");
            pstmt.setString(9, "Shanghai Medical Device Co.");
            pstmt.setString(10, "SH20200001");
            pstmt.setDouble(11, 3.00);
            pstmt.setInt(12, 250);
            pstmt.setInt(13, 0);
            pstmt.setInt(14, 0);
            pstmt.setDouble(15, 750.00);
            pstmt.setString(16, "pending");
            pstmt.executeUpdate();
        }
    }
    
    private static void generateReceiptData(Connection conn) throws SQLException {
        System.out.println("Generating receipt data...");
        String sql = "INSERT INTO scm_purchase_receive (receive_number, purchase_order_id, order_number, supplier_id, supplier_name, supplier_code, department_name, buyer, contact_person, contact_phone, order_date, expected_delivery_date, actual_delivery_date, receiver, status, total_amount, item_count, remark) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURDATE(), CURDATE(), CURDATE(), ?, ?, ?, ?, ?)";
        
        try (PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setString(1, "RCV20240001");
            pstmt.setInt(2, 1);
            pstmt.setString(3, "PO20240001");
            pstmt.setInt(4, 1);
            pstmt.setString(5, "Shanghai Medical Device Co.");
            pstmt.setString(6, "SUP001");
            pstmt.setString(7, "Head Office");
            pstmt.setString(8, "admin");
            pstmt.setString(9, "Manager Zhang");
            pstmt.setString(10, "13800138000");
            pstmt.setString(11, "admin");
            pstmt.setString(12, "completed");
            pstmt.setDouble(13, 1250.00);
            pstmt.setInt(14, 2);
            pstmt.setString(15, "All goods received");
            pstmt.executeUpdate();
        }
    }
    
    private static void generateReceiptItems(Connection conn) throws SQLException {
        System.out.println("Generating receipt items...");
        String sql = "INSERT INTO scm_purchase_receive_item (receive_id, purchase_order_item_id, product_code, product_name, specification, model, manufacturer, registration_number, unit, price, quantity, actual_received_quantity, amount, batch_number, production_date, expiry_date, status, shortage_reason) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 2 YEAR), ?, NULL)";
        
        try (PreparedStatement pstmt = conn.prepareStatement(sql)) {
            // Item 1
            pstmt.setInt(1, 1);
            pstmt.setInt(2, 1);
            pstmt.setString(3, "MAT001");
            pstmt.setString(4, "Disposable Syringe");
            pstmt.setString(5, "1ml");
            pstmt.setString(6, "SYR-001");
            pstmt.setString(7, "Shanghai Medical Device Co.");
            pstmt.setString(8, "SH20200001");
            pstmt.setString(9, "pc");
            pstmt.setDouble(10, 2.50);
            pstmt.setInt(11, 200);
            pstmt.setInt(12, 200);
            pstmt.setDouble(13, 500.00);
            pstmt.setString(14, "BATCH001");
            pstmt.setString(15, "completed");
            pstmt.executeUpdate();
            
            // Item 2
            pstmt.setInt(1, 1);
            pstmt.setInt(2, 2);
            pstmt.setString(3, "MAT002");
            pstmt.setString(4, "Medical Mask");
            pstmt.setString(5, "N95");
            pstmt.setString(6, "MASK-001");
            pstmt.setString(7, "Shanghai Medical Device Co.");
            pstmt.setString(8, "SH20200001");
            pstmt.setString(9, "pc");
            pstmt.setDouble(10, 3.00);
            pstmt.setInt(11, 250);
            pstmt.setInt(12, 250);
            pstmt.setDouble(13, 750.00);
            pstmt.setString(14, "BATCH002");
            pstmt.setString(15, "completed");
            pstmt.executeUpdate();
        }
    }
    
    private static void updateReceivedQuantity(Connection conn) throws SQLException {
        System.out.println("Updating purchase order items received quantity...");
        String sql = "UPDATE scm_purchase_order_item SET received_quantity = quantity WHERE purchase_order_id = 1";
        try (Statement stmt = conn.createStatement()) {
            stmt.executeUpdate(sql);
        }
    }
    
    private static void generateStockInOrderData(Connection conn) throws SQLException {
        System.out.println("Generating stock in order data...");
        String sql = "INSERT INTO scm_stock_in_order (stock_in_number, receive_id, receive_number, purchase_order_id, order_number, stock_in_type, department_name, operator_name, supplier_name, stock_in_date, status, material_count, total_amount, remark) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURDATE(), ?, ?, ?, ?)";
        
        try (PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setString(1, "STKIN20240001");
            pstmt.setInt(2, 1);
            pstmt.setString(3, "RCV20240001");
            pstmt.setInt(4, 1);
            pstmt.setString(5, "PO20240001");
            pstmt.setString(6, "Purchase Stock In");
            pstmt.setString(7, "Head Office");
            pstmt.setString(8, "admin");
            pstmt.setString(9, "Shanghai Medical Device Co.");
            pstmt.setString(10, "completed");
            pstmt.setInt(11, 2);
            pstmt.setDouble(12, 1250.00);
            pstmt.setString(13, "Purchase stock in");
            pstmt.executeUpdate();
        }
    }
    
    private static void generateStockInItems(Connection conn) throws SQLException {
        System.out.println("Generating stock in items...");
        String sql = "INSERT INTO scm_stock_in_item (stock_in_order_id, receive_item_id, material_id, material_code, material_name, material_type, specification, model, min_package, unit, purchase_price, order_quantity, stock_in_quantity, purchase_amount, supplier_name, manufacturer, registration_number, batch_number, production_date, expiry_date, status, remark) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 2 YEAR), ?, NULL)";
        
        try (PreparedStatement pstmt = conn.prepareStatement(sql)) {
            // Item 1
            pstmt.setInt(1, 1);
            pstmt.setInt(2, 1);
            pstmt.setInt(3, 1);
            pstmt.setString(4, "MAT001");
            pstmt.setString(5, "Disposable Syringe");
            pstmt.setString(6, "Medical Device");
            pstmt.setString(7, "1ml");
            pstmt.setString(8, "SYR-001");
            pstmt.setString(9, "100pcs/box");
            pstmt.setString(10, "pc");
            pstmt.setDouble(11, 2.50);
            pstmt.setInt(12, 200);
            pstmt.setInt(13, 200);
            pstmt.setDouble(14, 500.00);
            pstmt.setString(15, "Shanghai Medical Device Co.");
            pstmt.setString(16, "Shanghai Medical Device Co.");
            pstmt.setString(17, "SH20200001");
            pstmt.setString(18, "BATCH001");
            pstmt.setString(19, "completed");
            pstmt.executeUpdate();
            
            // Item 2
            pstmt.setInt(1, 1);
            pstmt.setInt(2, 2);
            pstmt.setInt(3, 2);
            pstmt.setString(4, "MAT002");
            pstmt.setString(5, "Medical Mask");
            pstmt.setString(6, "Medical Device");
            pstmt.setString(7, "N95");
            pstmt.setString(8, "MASK-001");
            pstmt.setString(9, "50pcs/box");
            pstmt.setString(10, "pc");
            pstmt.setDouble(11, 3.00);
            pstmt.setInt(12, 250);
            pstmt.setInt(13, 250);
            pstmt.setDouble(14, 750.00);
            pstmt.setString(15, "Shanghai Medical Device Co.");
            pstmt.setString(16, "Shanghai Medical Device Co.");
            pstmt.setString(17, "SH20200001");
            pstmt.setString(18, "BATCH002");
            pstmt.setString(19, "completed");
            pstmt.executeUpdate();
        }
    }
    
    private static void updateStockedQuantity(Connection conn) throws SQLException {
        System.out.println("Updating purchase order items stocked quantity...");
        String sql = "UPDATE scm_purchase_order_item SET stocked_quantity = quantity WHERE purchase_order_id = 1";
        try (Statement stmt = conn.createStatement()) {
            stmt.executeUpdate(sql);
        }
    }
    
    private static void generateInventoryData(Connection conn) throws SQLException {
        System.out.println("Generating inventory data...");
        String sql = "INSERT INTO scm_inventory (material_id, material_code, material_name, category, specification, model, warehouse, shelf, batch_number, production_date, expiry_date, min_package, unit, purchase_price, current_stock, min_stock, max_stock, expiry_warning_days, registration_number, supplier, manufacturer, stock_status, warning, last_inbound) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 2 YEAR), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURDATE())";
        
        try (PreparedStatement pstmt = conn.prepareStatement(sql)) {
            // Inventory 1
            pstmt.setInt(1, 1);
            pstmt.setString(2, "MAT001");
            pstmt.setString(3, "Disposable Syringe");
            pstmt.setString(4, "Medical Device");
            pstmt.setString(5, "1ml");
            pstmt.setString(6, "SYR-001");
            pstmt.setString(7, "Main Warehouse");
            pstmt.setString(8, "A1-01");
            pstmt.setString(9, "BATCH001");
            pstmt.setString(10, "100pcs/box");
            pstmt.setString(11, "pc");
            pstmt.setDouble(12, 2.50);
            pstmt.setInt(13, 200);
            pstmt.setInt(14, 50);
            pstmt.setInt(15, 500);
            pstmt.setInt(16, 90);
            pstmt.setString(17, "SH20200001");
            pstmt.setString(18, "Shanghai Medical Device Co.");
            pstmt.setString(19, "Shanghai Medical Device Co.");
            pstmt.setString(20, "Normal");
            pstmt.setString(21, "No");
            pstmt.executeUpdate();
            
            // Inventory 2
            pstmt.setInt(1, 2);
            pstmt.setString(2, "MAT002");
            pstmt.setString(3, "Medical Mask");
            pstmt.setString(4, "Medical Device");
            pstmt.setString(5, "N95");
            pstmt.setString(6, "MASK-001");
            pstmt.setString(7, "Main Warehouse");
            pstmt.setString(8, "A1-02");
            pstmt.setString(9, "BATCH002");
            pstmt.setString(10, "50pcs/box");
            pstmt.setString(11, "pc");
            pstmt.setDouble(12, 3.00);
            pstmt.setInt(13, 250);
            pstmt.setInt(14, 50);
            pstmt.setInt(15, 500);
            pstmt.setInt(16, 90);
            pstmt.setString(17, "SH20200001");
            pstmt.setString(18, "Shanghai Medical Device Co.");
            pstmt.setString(19, "Shanghai Medical Device Co.");
            pstmt.setString(20, "Normal");
            pstmt.setString(21, "No");
            pstmt.executeUpdate();
        }
    }
    
    private static void generateInventoryTransactionData(Connection conn) throws SQLException {
        System.out.println("Generating inventory transaction data...");
        String sql = "INSERT INTO scm_inventory_transaction (inventory_id, material_id, material_code, material_name, batch_number, operation_type, quantity, balance_quantity, reference_no, operator_name, remark, operation_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())";
        
        try (PreparedStatement pstmt = conn.prepareStatement(sql)) {
            // Transaction 1
            pstmt.setInt(1, 1);
            pstmt.setInt(2, 1);
            pstmt.setString(3, "MAT001");
            pstmt.setString(4, "Disposable Syringe");
            pstmt.setString(5, "BATCH001");
            pstmt.setString(6, "Stock In");
            pstmt.setInt(7, 200);
            pstmt.setInt(8, 200);
            pstmt.setString(9, "STKIN20240001");
            pstmt.setString(10, "admin");
            pstmt.setString(11, "Purchase stock in");
            pstmt.executeUpdate();
            
            // Transaction 2
            pstmt.setInt(1, 2);
            pstmt.setInt(2, 2);
            pstmt.setString(3, "MAT002");
            pstmt.setString(4, "Medical Mask");
            pstmt.setString(5, "BATCH002");
            pstmt.setString(6, "Stock In");
            pstmt.setInt(7, 250);
            pstmt.setInt(8, 250);
            pstmt.setString(9, "STKIN20240001");
            pstmt.setString(10, "admin");
            pstmt.setString(11, "Purchase stock in");
            pstmt.executeUpdate();
        }
    }
}
