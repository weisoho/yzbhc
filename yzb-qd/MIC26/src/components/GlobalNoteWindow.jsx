import React, { useState, useEffect } from 'react';
import { Button, Tooltip, Modal, Tree, Checkbox, Row, Col, message, Switch, Input } from 'antd';
import { 
  FileTextOutlined,
  SettingOutlined,
  InfoCircleOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  EditOutlined
} from '@ant-design/icons';
import FloatingNoteWindow from './FloatingNoteWindow';
import { useNoteContext } from '../contexts/NoteContext';
import { usePageVisibility } from '../contexts/PageVisibilityContext';
import { getRecentNotes } from '../utils/noteStorage';
import './GlobalNoteWindow.css';

const GlobalNoteWindow = () => {
  const { 
    currentPage, 
    isNoteWindowVisible, 
    toggleNoteWindow,
    getNoteStatistics: getStats
  } = useNoteContext();
  
  // 使用页面可见性上下文
  const { 
    visibleKeys, 
    isInitialized,
    isPageVisible,
    setPageVisibility,
    setPagesVisibility,
    treeData: pageVisibilityTreeData,
    resetToDefault
  } = usePageVisibility();
  
  const [showSettings, setShowSettings] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [statistics, setStatistics] = useState({
    totalPages: 0,
    pagesWithNotes: 0,
    totalCharacters: 0
  });
  const [recentNotes, setRecentNotes] = useState([]);
  const [versionClickCount, setVersionClickCount] = useState(0);
  const [showHomeFeatureManager, setShowHomeFeatureManager] = useState(false);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [checkedKeys, setCheckedKeys] = useState([]);
  const [treeData, setTreeData] = useState([]);
  const [selectedPageInfo, setSelectedPageInfo] = useState(null);
  const [selectAll, setSelectAll] = useState(false);
  
  // 版本号文本状态
  const [versionText, setVersionText] = useState(() => {
    const savedVersionText = localStorage.getItem('appVersionText');
    return savedVersionText || '云晟健康0.1.1开发版';
  });

  // 加载统计信息
  useEffect(() => {
    const stats = getStats();
    setStatistics(stats);
    
    const recent = getRecentNotes(5);
    setRecentNotes(recent);
  }, [currentPage, getStats]);

  // 同步 PageVisibilityContext 的数据
  useEffect(() => {
    if (isInitialized && pageVisibilityTreeData) {
      setTreeData(pageVisibilityTreeData);
      setCheckedKeys(visibleKeys);
    }
  }, [isInitialized, visibleKeys, pageVisibilityTreeData]);

  // 监听页面可见性变化事件
  useEffect(() => {
    const handleVisibilityChanged = (e) => {
      if (e.detail && e.detail.visibleKeys) {
        setCheckedKeys(e.detail.visibleKeys);
      }
    };

    window.addEventListener('pageVisibilityChanged', handleVisibilityChanged);
    return () => {
      window.removeEventListener('pageVisibilityChanged', handleVisibilityChanged);
    };
  }, []);

  // 监听版本号文本变化事件（实现多组件同步）
  useEffect(() => {
    const handleVersionTextChanged = (e) => {
      if (e.detail && e.detail.versionText) {
        setVersionText(e.detail.versionText);
      }
    };

    window.addEventListener('versionTextChanged', handleVersionTextChanged);
    return () => {
      window.removeEventListener('versionTextChanged', handleVersionTextChanged);
    };
  }, []);

  // 处理设置按钮点击
  const handleSettingsClick = () => {
    setShowSettings(true);
  };

  // 处理信息按钮点击
  const handleInfoClick = () => {
    setShowInfo(true);
  };

  // 处理版本号点击
  const handleVersionClick = () => {
    const now = Date.now();
    const timeDiff = now - lastClickTime;
    
    // 如果点击间隔超过2秒，重置计数器
    if (timeDiff > 2000) {
      setVersionClickCount(1);
    } else {
      const newCount = versionClickCount + 1;
      setVersionClickCount(newCount);
      
      // 如果连续点击达到6次，显示主页功能管理窗口
      if (newCount >= 6) {
        setShowHomeFeatureManager(true);
        setVersionClickCount(0); // 重置计数器
      }
    }
    
    setLastClickTime(now);
  };

  // 渲染设置模态框
  const renderSettingsModal = () => (
    <Modal
      title="悬浮备注窗口设置"
      open={showSettings}
      onCancel={() => setShowSettings(false)}
      footer={[
        <Button key="close" onClick={() => setShowSettings(false)}>
          关闭
        </Button>
      ]}
    >
      <div className="settings-content">
        <div className="setting-item">
          <h4>数据统计</h4>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-label">总页面数</div>
              <div className="stat-value">{statistics.totalPages}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">有备注的页面</div>
              <div className="stat-value">{statistics.pagesWithNotes}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">总字符数</div>
              <div className="stat-value">{statistics.totalCharacters}</div>
            </div>
          </div>
        </div>
        
        <div className="setting-item">
          <h4>最近修改的备注</h4>
          {recentNotes.length > 0 ? (
            <div className="recent-notes-list">
              {recentNotes.map((note) => (
                <div key={note.id} className="recent-note-item">
                  <div className="recent-note-title">{note.pageTitle}</div>
                  <div className="recent-note-preview">
                    {note.content.length > 50 
                      ? `${note.content.substring(0, 50)}...` 
                      : note.content}
                  </div>
                  <div className="recent-note-time">
                    {new Date(note.lastModified).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-recent-notes">暂无最近修改的备注</div>
          )}
        </div>
        
        <div className="setting-item">
          <h4>使用说明</h4>
          <ul className="instructions-list">
            <li>点击右下角的笔记图标可以显示/隐藏悬浮窗口</li>
            <li>拖动窗口标题栏可以移动窗口位置</li>
            <li>拖动窗口右下角可以调整窗口大小</li>
            <li>点击编辑按钮可以切换编辑模式</li>
            <li>备注内容会自动保存，也可以手动点击保存按钮</li>
            <li>切换页面时，备注内容会自动切换到对应页面</li>
          </ul>
        </div>
        
        <div className="version-info" onClick={handleVersionClick}>
          {versionText}
        </div>
      </div>
    </Modal>
  );

  // 渲染主页功能管理模态框
  const renderHomeFeatureManagerModal = () => {
    // 处理树状图勾选事件
    const handleTreeCheck = (checkedKeysValue, info) => {
      // 过滤掉分组节点的key，只保留叶子节点的key
      const isLeafNode = (key) => {
        const findNode = (nodes, targetKey) => {
          for (const node of nodes) {
            if (node.key === targetKey) {
              return node;
            }
            if (node.children) {
              const found = findNode(node.children, targetKey);
              if (found) return found;
            }
          }
          return null;
        };
        
        const node = findNode(treeData, key);
        return node && (!node.children || node.children.length === 0);
      };
      
      const leafCheckedKeys = checkedKeysValue.filter(key => isLeafNode(key));
      setCheckedKeys(leafCheckedKeys);
      
      // 同步到 PageVisibilityContext
      const { checkedNodes } = info;
      // 获取所有叶子节点key（递归遍历所有节点）
      const getLeafKeys = (nodes) => {
        const keys = [];
        const traverse = (node) => {
          if (!node.children || node.children.length === 0) {
            keys.push(node.key);
          } else {
            // 递归遍历子节点
            node.children.forEach(child => traverse(child));
          }
        };
        nodes.forEach(node => traverse(node));
        return keys;
      };
      
      // 获取当前所有可见的叶子节点
      const currentVisibleLeafKeys = getLeafKeys(checkedNodes || []);
      
      // 获取所有可能的叶子节点（从 treeData 递归收集）
      const allLeafKeys = [];
      const collectAllLeafKeys = (nodes) => {
        nodes.forEach(node => {
          if (!node.children || node.children.length === 0) {
            allLeafKeys.push(node.key);
          } else {
            collectAllLeafKeys(node.children);
          }
        });
      };
      collectAllLeafKeys(treeData);
      
      // 计算隐藏和显示的页面
      const hiddenKeys = allLeafKeys.filter(key => !currentVisibleLeafKeys.includes(key));
      
      // 批量更新页面可见性
      if (currentVisibleLeafKeys.length > 0) {
        setPagesVisibility(currentVisibleLeafKeys, true);
      }
      if (hiddenKeys.length > 0) {
        setPagesVisibility(hiddenKeys, false);
      }
    };

    // 处理树节点选择事件（显示页面详情）
    const handleTreeSelect = (selectedKeys, info) => {
      const { node } = info;
      if (node && node.key) {
        const isVisible = isPageVisible(node.key);
        setSelectedPageInfo({
          key: node.key,
          title: node.title,
          visible: isVisible,
          isLeaf: !node.children || node.children.length === 0
        });
      }
    };

    // 处理单个页面可见性切换
    const handleTogglePageVisibility = (key) => {
      const newVisible = !isPageVisible(key);
      setPageVisibility(key, newVisible);
      
      // 更新本地checkedKeys
      setCheckedKeys(prev => {
        if (newVisible) {
          return [...new Set([...prev, key])];
        } else {
          return prev.filter(k => k !== key);
        }
      });
      
      // 更新选中的页面信息
      setSelectedPageInfo(prev => prev ? { ...prev, visible: newVisible } : null);
    };

    // 处理保存设置
    const handleSaveSettings = async () => {
      // 获取所有叶子节点（从 treeData 递归收集）
      const allLeafKeys = [];
      const collectAllLeafKeys = (nodes) => {
        nodes.forEach(node => {
          if (!node.children || node.children.length === 0) {
            allLeafKeys.push(node.key);
          } else {
            collectAllLeafKeys(node.children);
          }
        });
      };
      collectAllLeafKeys(treeData);
      
      // 计算当前可见的叶子节点
      const currentVisibleLeafKeys = allLeafKeys.filter(key => checkedKeys.includes(key));
      
      // 通过 PageVisibilityContext 保存配置（它会自动保存到配置文件）
      // 批量更新页面可见性
      if (currentVisibleLeafKeys.length > 0) {
        await setPagesVisibility(currentVisibleLeafKeys, true);
      }
      
      // 计算隐藏的页面
      const hiddenKeys = allLeafKeys.filter(key => !currentVisibleLeafKeys.includes(key) && key !== '/');
      if (hiddenKeys.length > 0) {
        await setPagesVisibility(hiddenKeys, false);
      }
      
      // 显示保存成功提示
      message.success('设置已保存到独立配置文件！刷新页面后配置将保持不变。');
      
      // 关闭窗口
      setShowHomeFeatureManager(false);
    };

    // 处理重置为默认
    const handleResetDefault = () => {
      resetToDefault();
      message.success('已重置为默认设置');
    };

    // 处理全选/取消全选
    const handleSelectAll = (e) => {
      const isChecked = e.target.checked;
      setSelectAll(isChecked);
      
      // 获取所有叶子节点
      const allLeafKeys = [];
      const collectAllLeafKeys = (nodes) => {
        nodes.forEach(node => {
          if (!node.children || node.children.length === 0) {
            allLeafKeys.push(node.key);
          } else {
            collectAllLeafKeys(node.children);
          }
        });
      };
      collectAllLeafKeys(treeData);
      
      // 过滤掉首页（始终显示）
      const selectableLeafKeys = allLeafKeys.filter(key => key !== '/');
      
      if (isChecked) {
        // 全选：添加所有可选择的叶子节点
        const newCheckedKeys = [...new Set([...checkedKeys, ...selectableLeafKeys])];
        setCheckedKeys(newCheckedKeys);
        setPagesVisibility(selectableLeafKeys, true);
      } else {
        // 取消全选：移除所有可选择的叶子节点
        const newCheckedKeys = checkedKeys.filter(key => !selectableLeafKeys.includes(key));
        setCheckedKeys(newCheckedKeys);
        setPagesVisibility(selectableLeafKeys, false);
      }
    };

    // 不再需要默认展开，所有结构默认折叠显示

    // 自定义树节点标题渲染，添加显示/隐藏状态指示
    const renderTreeTitle = (nodeData) => {
      const isVisible = isPageVisible(nodeData.key);
      const isLeaf = !nodeData.children || nodeData.children.length === 0;
      
      if (nodeData.key === '/') {
        return (
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>{nodeData.title}</span>
            <span style={{ color: '#52c41a', fontSize: 12 }}>(始终显示)</span>
          </span>
        );
      }
      
      return (
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>{nodeData.title}</span>
          {isLeaf && (
            <span style={{ 
              color: isVisible ? '#52c41a' : '#bfbfbf', 
              fontSize: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}>
              {isVisible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
              {isVisible ? '显示' : '隐藏'}
            </span>
          )}
        </span>
      );
    };

    // 为树数据添加自定义标题
    const addCustomTitle = (nodes) => {
      return nodes.map(node => ({
        ...node,
        title: renderTreeTitle(node),
        children: node.children ? addCustomTitle(node.children) : undefined
      }));
    };

    const treeDataWithCustomTitle = addCustomTitle(treeData);

    return (
      <Modal
        title="主页功能管理 - 显示/隐藏控制"
        open={showHomeFeatureManager}
        onCancel={() => setShowHomeFeatureManager(false)}
        width={900}
        maskClosable={false}
        footer={[
          <Button key="reset" onClick={handleResetDefault}>
            重置为默认
          </Button>,
          <Button key="save" type="primary" onClick={handleSaveSettings}>
            保存设置
          </Button>
        ]}
      >
        <div style={{ display: 'flex', height: '500px' }}>
          <div style={{ flex: '0 0 350px', borderRight: '1px solid #f0f0f0', paddingRight: '16px', overflowY: 'auto', overflowX: 'hidden' }}>
            <div style={{ marginBottom: 12, padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ margin: 0, fontSize: 13, color: '#666' }}>
                  勾选表示显示，取消勾选表示隐藏
                </p>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Checkbox 
                    checked={selectAll} 
                    onChange={handleSelectAll}
                    style={{ marginRight: 8 }}
                  />
                  <span style={{ fontSize: 13, color: '#666' }}>全选</span>
                </div>
              </div>
            </div>
            <Tree
              treeData={treeDataWithCustomTitle}
              checkable
              defaultExpandedKeys={[]}
              checkedKeys={checkedKeys}
              onCheck={handleTreeCheck}
              onSelect={handleTreeSelect}
              selectable
            />
          </div>
          <div style={{ flex: 1, paddingLeft: '24px', overflowY: 'auto', overflowX: 'hidden' }}>
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ marginBottom: 12, color: '#262626' }}>功能说明</h4>
              <p style={{ color: '#666', lineHeight: 1.6 }}>
                在左侧树状图中勾选或取消勾选功能项，可以实时控制主界面左侧功能栏中对应功能的显示或隐藏。
              </p>
              <p style={{ color: '#666', lineHeight: 1.6 }}>
                点击左侧功能项可以查看详情并进行单独控制。
              </p>
            </div>
            
            {selectedPageInfo && selectedPageInfo.isLeaf && (
              <div style={{ 
                padding: '16px', 
                backgroundColor: '#f6ffed', 
                borderRadius: 8,
                border: '1px solid #b7eb8f'
              }}>
                <h4 style={{ marginBottom: 16, color: '#262626' }}>
                  页面详情: {selectedPageInfo.title}
                </h4>
                <div style={{ marginBottom: 16 }}>
                  <p style={{ marginBottom: 8 }}>
                    <strong>页面路径:</strong> {selectedPageInfo.key}
                  </p>
                  <p style={{ marginBottom: 8 }}>
                    <strong>当前状态:</strong>{' '}
                    <span style={{ 
                      color: selectedPageInfo.visible ? '#52c41a' : '#f5222d',
                      fontWeight: 500
                    }}>
                      {selectedPageInfo.visible ? '显示' : '隐藏'}
                    </span>
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span>快速切换:</span>
                  <Switch
                    checked={selectedPageInfo.visible}
                    onChange={() => handleTogglePageVisibility(selectedPageInfo.key)}
                    checkedChildren="显示"
                    unCheckedChildren="隐藏"
                  />
                </div>
              </div>
            )}
            
            <div style={{ marginTop: '24px' }}>
              <h4 style={{ marginBottom: 12, color: '#262626' }}>统计信息</h4>
              <div style={{ display: 'flex', gap: '24px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
                    {checkedKeys.filter(key => key.startsWith('/')).length}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>显示页面数</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f5222d' }}>
                    {Math.max(0, treeData.reduce((count, node) => {
                      const countLeaves = (n) => {
                        if (!n.children || n.children.length === 0) {
                          return n.key === '/' ? 0 : 1;
                        }
                        return n.children.reduce((sum, child) => sum + countLeaves(child), 0);
                      };
                      return count + countLeaves(node);
                    }, 0) - checkedKeys.filter(key => key.startsWith('/')).length)}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>隐藏页面数</div>
                </div>
              </div>
            </div>
            
            {/* 版本号修改区域 */}
            <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #f0f0f0' }}>
              <h4 style={{ marginBottom: 16, color: '#262626' }}>
                <EditOutlined style={{ marginRight: 8 }} />
                版本号设置
              </h4>
              <div style={{ 
                padding: '16px', 
                backgroundColor: '#e6f7ff', 
                borderRadius: 8,
                border: '1px solid #91d5ff'
              }}>
                <p style={{ marginBottom: 12, color: '#666', fontSize: 13 }}>
                  修改下方文本将同步更新悬浮备注窗口设置页面中的版本号显示：
                </p>
                <Input
                  value={versionText}
                  onChange={(e) => {
                    const newText = e.target.value;
                    setVersionText(newText);
                    localStorage.setItem('appVersionText', newText);
                    // 触发自定义事件通知其他组件
                    window.dispatchEvent(new CustomEvent('versionTextChanged', { 
                      detail: { versionText: newText } 
                    }));
                  }}
                  placeholder="请输入版本号文本"
                  maxLength={50}
                  showCount
                  style={{ 
                    backgroundColor: '#fff',
                    borderRadius: 6
                  }}
                />
                <p style={{ marginTop: 12, color: '#999', fontSize: 12 }}>
                  提示：点击悬浮备注窗口设置页面底部的版本号区域（连续6次）可打开此功能管理页面
                </p>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    );
  };

  // 渲染信息模态框
  const renderInfoModal = () => (
    <Modal
      title="关于悬浮备注窗口"
      open={showInfo}
      onCancel={() => setShowInfo(false)}
      footer={[
        <Button key="close" onClick={() => setShowInfo(false)}>
          关闭
        </Button>
      ]}
    >
      <div className="info-content">
        <div className="info-section">
          <h4>功能特性</h4>
          <ul>
            <li>📝 为每个页面提供独立的备注记录</li>
            <li>💾 自动保存，数据永不丢失</li>
            <li>🔄 页面切换时自动同步备注内容</li>
            <li>📤 支持备注数据的导入导出</li>
            <li>🎨 可拖拽、可调整大小的悬浮窗口</li>
            <li>📱 响应式设计，适配不同屏幕尺寸</li>
          </ul>
        </div>
        
        <div className="info-section">
          <h4>使用场景</h4>
          <ul>
            <li>开发团队内部沟通和说明</li>
            <li>记录页面特定的开发注意事项</li>
            <li>保存临时的测试数据或配置信息</li>
            <li>记录bug修复步骤或解决方案</li>
            <li>团队协作时的上下文信息共享</li>
          </ul>
        </div>
        
        <div className="info-section">
          <h4>技术实现</h4>
          <ul>
            <li>基于React + Ant Design构建</li>
            <li>使用localStorage进行数据持久化</li>
            <li>支持拖拽和调整大小的交互</li>
            <li>自动保存机制，避免数据丢失</li>
            <li>响应式CSS设计</li>
          </ul>
        </div>
      </div>
    </Modal>
  );

  return (
    <>
      {/* 悬浮窗口控制按钮 */}
      <div className="global-note-controls">
        <div className="control-buttons">
          <Tooltip title="显示/隐藏备注窗口">
            <Button
              type="text"
              shape="circle"
              icon={<FileTextOutlined />}
              onClick={toggleNoteWindow}
              className="control-button control-button-primary"
            />
          </Tooltip>
          
          <Tooltip title="设置">
            <Button
              type="text"
              shape="circle"
              icon={<SettingOutlined />}
              onClick={handleSettingsClick}
              className="control-button"
            />
          </Tooltip>
          
          <Tooltip title="关于">
            <Button
              type="text"
              shape="circle"
              icon={<InfoCircleOutlined />}
              onClick={handleInfoClick}
              className="control-button"
            />
          </Tooltip>
        </div>
      </div>
      
      {/* 悬浮窗口 */}
      {isNoteWindowVisible && currentPage && (
        <FloatingNoteWindow
          pagePath={currentPage.path}
          pageTitle={currentPage.title}
          onClose={toggleNoteWindow}
        />
      )}
      
      {/* 模态框 */}
      {renderSettingsModal()}
      {renderInfoModal()}
      {renderHomeFeatureManagerModal()}
    </>
  );
};

export default GlobalNoteWindow;