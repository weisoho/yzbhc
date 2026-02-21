import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { AppProvider } from './context/AppContext.jsx'

// 配置样式插入目标
const styleTarget = document.getElementById('style-target');

// 如果找不到style-target，创建一个
if (!styleTarget) {
  const div = document.createElement('div');
  div.id = 'style-target';
  document.head.appendChild(div);
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppProvider>
      <Router>
        <App />
      </Router>
    </AppProvider>
  </React.StrictMode>,
)