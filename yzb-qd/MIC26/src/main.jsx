/**
 * 应用入口文件
 * 负责初始化React应用，配置路由和全局上下文
 */

// 导入React核心库
import React from 'react';
// 导入ReactDOM渲染器
import ReactDOM from 'react-dom/client';
// 导入路由组件
import { BrowserRouter as Router } from 'react-router-dom';
// 导入应用主组件
import App from './App.jsx';
// 导入全局样式
import './index.css';
// 导入Ant Design重置样式
import 'antd/dist/reset.css';
// 导入应用全局上下文
import { AppProvider } from './context/AppContext.jsx';
// 导入页面可见性上下文（最高优先级初始化）
import { PageVisibilityProvider } from './contexts/PageVisibilityContext.jsx';
// 导入院区上下文
import { CampusProvider } from './contexts/CampusContext.jsx';

/**
 * 配置样式插入目标
 * 确保样式能够正确注入到DOM中
 */
const styleTarget = document.getElementById('style-target');

// 如果找不到style-target元素，动态创建一个
if (!styleTarget) {
  const div = document.createElement('div');
  div.id = 'style-target';
  document.head.appendChild(div);
}

/**
 * 渲染应用根组件
 * 使用React.StrictMode启用严格模式，帮助发现潜在问题
 * 包裹PageVisibilityProvider提供页面可见性状态管理（最高优先级）
 * 包裹CampusProvider提供院区状态管理
 * 包裹AppProvider提供全局状态管理
 * 使用Router提供路由功能
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PageVisibilityProvider>
      <CampusProvider>
        <AppProvider>
          <Router
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true
            }}
          >
            <App />
          </Router>
        </AppProvider>
      </CampusProvider>
    </PageVisibilityProvider>
  </React.StrictMode>
);