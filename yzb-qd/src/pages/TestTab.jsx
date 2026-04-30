import React from 'react';
import { Button, Card, Space } from 'antd';
import { Link } from 'react-router-dom';

const TestTab = () => {
  return (
    <div style={{ padding: '0 16px' }}>
      <h1 style={{ marginBottom: 24 }}>标签页功能测试</h1>
      
      <Card style={{ marginBottom: 16 }}>
        <h3>测试导航到不同页面：</h3>
        <Space wrap>
          <Button type="primary">
            <Link to="/inventory-detail">库存明细查询</Link>
          </Button>
          <Button type="primary">
            <Link to="/inventory-adjust">商品信息调整</Link>
          </Button>
          <Button type="primary">
            <Link to="/inventory-transfer">库存调拨</Link>
          </Button>
          <Button type="primary">
            <Link to="/inventory-shelf">库存货架维护</Link>
          </Button>
          <Button type="primary">
            <Link to="/product-catalog">物资字典维护</Link>
          </Button>
          <Button type="primary">
            <Link to="/user-account-management">用户账户管理</Link>
          </Button>
        </Space>
      </Card>
      
      <Card>
        <h3>标签页功能说明：</h3>
        <ul>
          <li>点击上方按钮导航到不同页面，会自动创建新的标签页</li>
          <li>点击标签页可以切换到对应的页面</li>
          <li>鼠标悬停在标签页上会显示关闭按钮</li>
          <li>点击关闭按钮可以关闭标签页（首页标签页不能关闭）</li>
          <li>关闭当前活动的标签页会自动切换到最后一个标签页</li>
        </ul>
      </Card>
    </div>
  );
};

export default TestTab;