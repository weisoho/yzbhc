import React, { useState } from 'react';
import { Card, Select, Button, Space } from 'antd';

const { Option } = Select;

const UserPermissionSettings = () => {
  const [permissions, setPermissions] = useState({
    modules: {
      dashboard: true,
      stockIn: true,
      inventory: false,
      stockOut: false,
      inventoryCheck: false,
      reports: false,
      masterData: false,
      operation: false
    },
    actions: {
      view: true,
      add: true,
      edit: false,
      delete: false,
      audit: false
    }
  });

  const users = [
    { key: '1', username: 'admin', name: '管理员', accountType: '管理员' },
    { key: '2', username: 'user1', name: '张三', accountType: '操作员' },
    { key: '3', username: 'user2', name: '李四', accountType: '操作员' },
  ];

  const handleModulePermissionChange = (module, checked) => {
    setPermissions(prev => ({
      ...prev,
      modules: {
        ...prev.modules,
        [module]: checked
      }
    }));
  };

  const handleActionPermissionChange = (action, checked) => {
    setPermissions(prev => ({
      ...prev,
      actions: {
        ...prev.actions,
        [action]: checked
      }
    }));
  };

  return (
    <div style={{ padding: '0 16px' }}>
      <h1 style={{ marginBottom: 24 }}>用户权限设定</h1>
      
      <Card>
        <Space wrap style={{ marginBottom: 16, width: '100%' }}>
          <Select placeholder="选择用户" style={{ width: 200, minWidth: '150px' }}>
            {users.map((user) => (
              <Option key={user.key} value={user.username}>{user.name} ({user.username})</Option>
            ))}
          </Select>
          <Button type="primary">查询</Button>
        </Space>
        
        <div>
          <h3>权限设置</h3>
          <div style={{ padding: '16px 0' }}>
            <div style={{ marginBottom: 16 }}>
              <h4>模块权限</h4>
              <Space wrap>
                <div style={{ marginRight: 24 }}>
                  <input 
                    type="checkbox" 
                    checked={permissions.modules.dashboard} 
                    onChange={(e) => handleModulePermissionChange('dashboard', e.target.checked)} 
                  /> 首页仪表盘
                </div>
                <div style={{ marginRight: 24 }}>
                  <input 
                    type="checkbox" 
                    checked={permissions.modules.stockIn} 
                    onChange={(e) => handleModulePermissionChange('stockIn', e.target.checked)} 
                  /> 入库管理
                </div>
                <div style={{ marginRight: 24 }}>
                  <input 
                    type="checkbox" 
                    checked={permissions.modules.inventory} 
                    onChange={(e) => handleModulePermissionChange('inventory', e.target.checked)} 
                  /> 库存管理
                </div>
                <div style={{ marginRight: 24 }}>
                  <input 
                    type="checkbox" 
                    checked={permissions.modules.stockOut} 
                    onChange={(e) => handleModulePermissionChange('stockOut', e.target.checked)} 
                  /> 消耗出库
                </div>
                <div style={{ marginRight: 24 }}>
                  <input 
                    type="checkbox" 
                    checked={permissions.modules.inventoryCheck} 
                    onChange={(e) => handleModulePermissionChange('inventoryCheck', e.target.checked)} 
                  /> 库存盘点
                </div>
                <div style={{ marginRight: 24 }}>
                  <input 
                    type="checkbox" 
                    checked={permissions.modules.reports} 
                    onChange={(e) => handleModulePermissionChange('reports', e.target.checked)} 
                  /> 仓库报表
                </div>
                <div style={{ marginRight: 24 }}>
                  <input 
                    type="checkbox" 
                    checked={permissions.modules.masterData} 
                    onChange={(e) => handleModulePermissionChange('masterData', e.target.checked)} 
                  /> 主档维护
                </div>
                <div style={{ marginRight: 24 }}>
                  <input 
                    type="checkbox" 
                    checked={permissions.modules.operation} 
                    onChange={(e) => handleModulePermissionChange('operation', e.target.checked)} 
                  /> 运营组管理
                </div>
              </Space>
            </div>
            
            <div>
              <h4>操作权限</h4>
              <Space wrap>
                <div style={{ marginRight: 24 }}>
                  <input 
                    type="checkbox" 
                    checked={permissions.actions.view} 
                    onChange={(e) => handleActionPermissionChange('view', e.target.checked)} 
                  /> 查看
                </div>
                <div style={{ marginRight: 24 }}>
                  <input 
                    type="checkbox" 
                    checked={permissions.actions.add} 
                    onChange={(e) => handleActionPermissionChange('add', e.target.checked)} 
                  /> 新增
                </div>
                <div style={{ marginRight: 24 }}>
                  <input 
                    type="checkbox" 
                    checked={permissions.actions.edit} 
                    onChange={(e) => handleActionPermissionChange('edit', e.target.checked)} 
                  /> 编辑
                </div>
                <div style={{ marginRight: 24 }}>
                  <input 
                    type="checkbox" 
                    checked={permissions.actions.delete} 
                    onChange={(e) => handleActionPermissionChange('delete', e.target.checked)} 
                  /> 删除
                </div>
                <div style={{ marginRight: 24 }}>
                  <input 
                    type="checkbox" 
                    checked={permissions.actions.audit} 
                    onChange={(e) => handleActionPermissionChange('audit', e.target.checked)} 
                  /> 审核
                </div>
              </Space>
            </div>
          </div>
          
          <Space>
            <Button type="primary">保存权限</Button>
            <Button>重置</Button>
          </Space>
        </div>
      </Card>
    </div>
  );
};

export default UserPermissionSettings;
