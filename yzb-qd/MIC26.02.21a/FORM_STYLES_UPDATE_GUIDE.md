# 表单样式统一更新指南

基于"耗材质量问题记录"界面的格式规范，已创建统一的表单样式系统。

## 已完成的工作

### 1. 创建了统一的样式常量文件
- 文件位置：`src/utils/formStyles.js`
- 包含了所有从"耗材质量问题记录"界面提取的格式规范

### 2. 已更新的页面文件
1. **SupplierMaintenance.jsx** - 供应商管理页面
2. **ProductCatalog.jsx** - 物资字典页面

### 3. 提取的格式规范

#### 页面布局
- 页面内边距：`padding: '0 16px'`
- 标题下边距：`marginBottom: 24`

#### 卡片样式
- 卡片下边距：`marginBottom: 16`

#### 搜索表单（inline布局）
- 表单布局：`layout="inline"`
- 行间距：`gutter={[16, 16]}`
- 响应式列配置：
  - xs: 24（移动端全宽）
  - sm: 12（平板半宽）
  - md: 8（桌面1/3宽）
  - lg: 6（大桌面1/4宽）

#### 编辑/新增表单（vertical布局）
- 表单布局：`layout="vertical"`
- 行间距：`gutter={16}`
- 列宽度：`span={12}`（两列布局）
- 模态框宽度：`width={800}`

#### 表格样式
- 表格大小：`size="small"`
- 分页样式：居中显示，上边距16px

#### 间距规范
- 标题间距：24px
- 卡片间距：16px
- 行间距：16px
- 列间距：16px
- 分页上边距：16px

## 如何更新其他表单页面

### 步骤1：导入样式工具
在每个需要更新的页面文件中，添加以下导入语句：

```jsx
import { FORM_STYLES, getResponsiveColProps, getFormLayoutStyle, getModalConfig } from '../utils/formStyles';
```

### 步骤2：更新页面布局
将原有的页面布局样式替换为：

```jsx
<div style={FORM_STYLES.page}>
  <h1 style={FORM_STYLES.title}>页面标题</h1>
  
  <Card style={FORM_STYLES.card}>
    {/* 表单内容 */}
  </Card>
</div>
```

### 步骤3：更新搜索表单
将原有的搜索表单替换为：

```jsx
<Form {...getFormLayoutStyle('search')}>
  <Row gutter={FORM_STYLES.form.search.rowGutter} style={{ width: '100%' }}>
    <Col {...getResponsiveColProps()}>
      <Form.Item name="fieldName" label="字段标签">
        <Input placeholder="请输入字段标签" />
      </Form.Item>
    </Col>
    {/* 更多表单项 */}
    <Col xs={24} sm={24} md={24} lg={24}>
      <Form.Item>
        <Space>
          {/* 操作按钮 */}
        </Space>
      </Form.Item>
    </Col>
  </Row>
</Form>
```

### 步骤4：更新表格分页样式
将原有的表格分页样式替换为：

```jsx
<Table 
  // ... 其他属性
  pagination={{
    // ... 其他配置
    style: FORM_STYLES.table.pagination.style
  }} 
  size={FORM_STYLES.table.size}
/>
```

### 步骤5：更新模态框表单
将原有的模态框表单替换为：

```jsx
<Modal
  // ... 其他属性
  {...getModalConfig()}
>
  <Form form={form} {...getFormLayoutStyle('edit')}>
    <Row gutter={FORM_STYLES.form.edit.rowGutter}>
      <Col span={FORM_STYLES.form.edit.colSpan}>
        <Form.Item name="fieldName" label="字段标签">
          <Input placeholder="请输入字段标签" />
        </Form.Item>
      </Col>
      {/* 更多表单项 */}
    </Row>
  </Form>
</Modal>
```

## 需要更新的页面列表

以下是项目中包含表单的页面文件（共40个），建议按优先级更新：

### 高优先级（核心业务页面）
1. PurchaseOrderRequest.jsx - 采购申请
2. PurchaseOrderApproval.jsx - 采购审批
3. Inventory.jsx - 库存管理
4. StockInAccept.jsx - 入库验收
5. StockOutConsumption.jsx - 出库消耗

### 中优先级（重要管理页面）
6. UserAccountManagement.jsx - 用户账户管理
7. DepartmentManagement.jsx - 部门管理
8. FixedAssetsAdd.jsx - 固定资产新增
9. FixedAssetsTransfer.jsx - 固定资产转移
10. MedicalDeviceAdverseEvent.jsx - 医疗器械不良事件

### 低优先级（其他页面）
其余30个页面文件

## 样式常量文件说明

### FORM_STYLES 对象结构
```javascript
export const FORM_STYLES = {
  page: { padding: '0 16px' },
  title: { marginBottom: 24 },
  card: { marginBottom: 16 },
  form: {
    search: { /* 搜索表单配置 */ },
    edit: { /* 编辑表单配置 */ }
  },
  table: { /* 表格配置 */ },
  spacing: { /* 间距规范 */ },
  textArea: { rows: 4 }
};
```

### 工具函数
1. `getResponsiveColProps()` - 获取响应式列配置
2. `getFormLayoutStyle(type)` - 获取表单布局样式（'search' 或 'edit'）
3. `getModalConfig()` - 获取模态框配置

## 注意事项

1. **保持一致性**：所有表单应使用相同的间距和布局规范
2. **响应式设计**：使用提供的响应式列配置确保在不同设备上的良好显示
3. **可维护性**：通过样式常量文件统一管理所有样式，便于后续修改
4. **渐进式更新**：可以按页面重要性逐步更新，无需一次性更新所有页面

## 验证更新效果

更新后，可以通过以下方式验证效果：
1. 检查页面布局是否统一
2. 验证表单间距是否一致
3. 测试响应式布局在不同屏幕尺寸下的表现
4. 确保所有功能正常工作