import React, { useState, useEffect } from 'react';
import { Button, Tooltip, Modal } from 'antd';
import { 
  FileTextOutlined,
  SettingOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import FloatingNoteWindow from './FloatingNoteWindow';
import { useNoteContext } from '../contexts/NoteContext';
import { getRecentNotes } from '../utils/noteStorage';
import './GlobalNoteWindow.css';

const GlobalNoteWindow = () => {
  const { 
    currentPage, 
    isNoteWindowVisible, 
    toggleNoteWindow,
    getNoteStatistics: getStats
  } = useNoteContext();
  
  const [showSettings, setShowSettings] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [statistics, setStatistics] = useState({
    totalPages: 0,
    pagesWithNotes: 0,
    totalCharacters: 0
  });
  const [recentNotes, setRecentNotes] = useState([]);

  // 加载统计信息
  useEffect(() => {
    const stats = getStats();
    setStatistics(stats);
    
    const recent = getRecentNotes(5);
    setRecentNotes(recent);
  }, [currentPage, getStats]);

  // 处理设置按钮点击
  const handleSettingsClick = () => {
    setShowSettings(true);
  };

  // 处理信息按钮点击
  const handleInfoClick = () => {
    setShowInfo(true);
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
      </div>
    </Modal>
  );

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
    </>
  );
};

export default GlobalNoteWindow;