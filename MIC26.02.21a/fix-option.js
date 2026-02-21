// 批量修复Option问题的脚本
// 使用Node.js执行：node fix-option.js

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

// 定义要修复的目录
const pagesDir = join(process.cwd(), 'src', 'pages');

// 获取所有页面文件
const pageFiles = readdirSync(pagesDir)
  .filter(file => file.endsWith('.jsx'))
  .map(file => join(pagesDir, file));

// 定义要修复的文件列表（优先修复核心页面）
const priorityFiles = [
  'Home.jsx',
  'Inventory.jsx',
  'InventoryDetail.jsx',
  'InventoryAdjust.jsx',
  'InventoryTransfer.jsx',
  'StockInAccept.jsx',
  'StockOutConsumption.jsx',
  'PurchaseOrderRequest.jsx',
  'PurchaseOrderApproval.jsx',
  'ReportsStockInSummary.jsx',
  'ReportsConsumptionSummary.jsx',
];

// 筛选出优先修复的文件
const filesToFix = pageFiles.filter(file => {
  const fileName = file.split('\\').pop();
  return priorityFiles.includes(fileName);
});

// 修复函数
function fixFile(filePath) {
  try {
    let content = readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    // 1. 移除Option解构
    content = content.replace(/const \{ Option \} = Select;/g, '');
    
    // 2. 替换<Option为<Select.Option
    content = content.replace(/<Option/g, '<Select.Option');
    
    // 3. 替换</Option>为</Select.Option>
    content = content.replace(/<\/Option>/g, '</Select.Option>');
    
    // 只有当内容有变化时才写入文件
    if (content !== originalContent) {
      writeFileSync(filePath, content, 'utf8');
      console.log(`✓ 已修复: ${filePath.split('\\').pop()}`);
    } else {
      console.log(`✓ 无需修复: ${filePath.split('\\').pop()}`);
    }
  } catch (error) {
    console.error(`✗ 修复失败: ${filePath.split('\\').pop()}`);
    console.error(error.message);
  }
}

// 执行修复
console.log('开始修复Option问题...');
console.log('====================');

filesToFix.forEach(file => {
  fixFile(file);
});

console.log('====================');
console.log('修复完成！');
console.log(`已处理 ${filesToFix.length} 个文件`);
