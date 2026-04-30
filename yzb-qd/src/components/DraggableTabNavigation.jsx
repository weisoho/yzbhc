/**
 * 可拖拽的标签页导航组件
 * 提供标签页的显示、点击、关闭和拖拽排序功能
 */

import React, { useState, useEffect, useRef } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { Dropdown } from 'antd';

/**
 * 可拖拽的标签页导航组件
 * @param {Object} props - 组件属性
 * @param {Array} props.tabs - 标签页列表
 * @param {Object} props.activeTab - 当前激活的标签页
 * @param {Function} props.onTabClick - 标签页点击回调
 * @param {Function} props.onTabClose - 标签页关闭回调
 * @param {Function} props.onTabsReorder - 标签页重新排序回调
 */
const DraggableTabNavigation = ({ tabs, activeTab, onTabClick, onTabClose, onCloseTabs, onTabsReorder }) => {
  // 悬停的标签页
  const [hoveredTab, setHoveredTab] = useState(null);
  // 正在拖拽的标签页
  const [draggingTab, setDraggingTab] = useState(null);
  // 拖拽经过的标签页
  const [dragOverTab, setDragOverTab] = useState(null);
  // 容器引用
  const containerRef = useRef(null);

  /**
   * 组件挂载时设置事件监听
   * 阻止标签页内容的文本选择和复制
   */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 阻止标签页内容的文本选择
    const preventSelection = (e) => {
      e.preventDefault();
      return false;
    };

    // 阻止标签页内容的复制
    const preventCopy = (e) => {
      e.preventDefault();
      return false;
    };

    // 添加事件监听
    container.addEventListener('selectstart', preventSelection);
    container.addEventListener('copy', preventCopy);
    container.addEventListener('cut', preventCopy);

    // 添加 CSS 样式
    container.style.userSelect = 'none';
    container.style.webkitUserSelect = 'none';

    // 清理事件监听
    return () => {
      container.removeEventListener('selectstart', preventSelection);
      container.removeEventListener('copy', preventCopy);
      container.removeEventListener('cut', preventCopy);
    };
  }, []);

  /**
   * 处理标签页点击
   * @param {Object} tab - 点击的标签页
   */
  const handleTabClick = (tab) => {
    onTabClick(tab);
  };

  /**
   * 处理标签页关闭
   * @param {Object} e - 事件对象
   * @param {Object} tab - 要关闭的标签页
   */
  const handleTabClose = (e, tab) => {
    e.stopPropagation();
    onTabClose(tab);
  };

  const buildContextMenuItems = (tab) => {
    const currentIndex = tabs.findIndex((item) => item.key === tab.key);
    const closableTabs = tabs.filter((item) => item.key !== '/');
    const leftClosable = tabs.slice(1, currentIndex).length > 0;
    const rightClosable = tabs.slice(currentIndex + 1).filter((item) => item.key !== '/').length > 0;

    return [
      { key: 'current', label: '关闭当前', disabled: tab.key === '/' },
      { key: 'left', label: '关闭左侧', disabled: !leftClosable },
      { key: 'right', label: '关闭右侧', disabled: !rightClosable },
      { key: 'others', label: '关闭其他', disabled: closableTabs.length <= 1 },
      { key: 'all', label: '关闭全部', disabled: closableTabs.length === 0 },
    ];
  };

  const handleContextMenuClick = ({ key }, tab) => {
    if (!onCloseTabs) {
      return;
    }
    onCloseTabs(key, tab);
  };

  /**
   * 拖拽开始处理
   * @param {Object} e - 拖拽事件对象
   * @param {Object} tab - 要拖拽的标签页
   */
  const handleDragStart = (e, tab) => {
    if (tab.key === '/') return; // 首页标签不能拖拽
    
    setDraggingTab(tab);
    e.dataTransfer.setData('text/plain', tab.key);
    e.dataTransfer.effectAllowed = 'move';
    
    // 设置拖拽图像
    const dragImage = e.target.cloneNode(true);
    dragImage.style.position = 'absolute';
    dragImage.style.top = '-1000px';
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 0, 0);
    
    // 清理拖拽图像
    setTimeout(() => {
      document.body.removeChild(dragImage);
    }, 0);
  };

  /**
   * 拖拽经过处理
   * @param {Object} e - 拖拽事件对象
   * @param {Object} tab - 拖拽经过的标签页
   */
  const handleDragOver = (e, tab) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    if (tab.key !== '/' && tab.key !== draggingTab?.key) {
      setDragOverTab(tab);
    }
  };

  /**
   * 拖拽离开处理
   * @param {Object} e - 拖拽事件对象
   * @param {Object} tab - 拖拽离开的标签页
   */
  const handleDragLeave = (e, tab) => {
    if (dragOverTab?.key === tab.key) {
      setDragOverTab(null);
    }
  };

  /**
   * 拖拽放置处理
   * @param {Object} e - 拖拽事件对象
   * @param {Object} targetTab - 放置目标标签页
   */
  const handleDrop = (e, targetTab) => {
    e.preventDefault();
    
    // 验证拖拽操作是否有效
    if (!draggingTab || targetTab.key === '/' || draggingTab.key === targetTab.key) {
      setDraggingTab(null);
      setDragOverTab(null);
      return;
    }

    // 重新排序标签
    const newTabs = [...tabs];
    const draggingIndex = newTabs.findIndex(tab => tab.key === draggingTab.key);
    const targetIndex = newTabs.findIndex(tab => tab.key === targetTab.key);
    
    if (draggingIndex !== -1 && targetIndex !== -1) {
      // 移除拖拽的标签
      const [draggedTab] = newTabs.splice(draggingIndex, 1);
      // 插入到目标位置
      newTabs.splice(targetIndex, 0, draggedTab);
      
      // 调用回调函数更新标签顺序
      onTabsReorder(newTabs);
    }

    // 重置拖拽状态
    setDraggingTab(null);
    setDragOverTab(null);
  };

  /**
   * 拖拽结束处理
   */
  const handleDragEnd = () => {
    setDraggingTab(null);
    setDragOverTab(null);
  };

  /**
   * 渲染组件
   */
  return (
    <div 
      ref={containerRef}
      style={{
        display: 'flex',
        background: '#ffffff',
        padding: '0 16px',
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        border: '1px solid #e8e8e8',
        overflowX: 'auto',
        overflowY: 'hidden',
        height: 48,
        alignItems: 'center',
        margin: '16px 0',
      }}
    >
      {tabs.map((tab) => {
        const isActive = activeTab?.key === tab.key;
        const isHomeTab = tab.key === '/';
        const isDragging = draggingTab?.key === tab.key;
        const isDragOver = dragOverTab?.key === tab.key;
        
        const tabNode = (
          <div
            key={tab.key}
            draggable={!isHomeTab}
            onDragStart={(e) => handleDragStart(e, tab)}
            onDragOver={(e) => handleDragOver(e, tab)}
            onDragLeave={(e) => handleDragLeave(e, tab)}
            onDrop={(e) => handleDrop(e, tab)}
            onDragEnd={handleDragEnd}
            onClick={() => handleTabClick(tab)}
            onMouseEnter={(e) => {
              setHoveredTab(tab.key);
              if (!isActive) {
                e.currentTarget.style.background = '#e6f7ff';
                e.currentTarget.style.borderColor = '#91d5ff';
              }
            }}
            onMouseLeave={(e) => {
              setHoveredTab(null);
              if (!isActive) {
                e.currentTarget.style.background = '#f5f5f5';
                e.currentTarget.style.borderColor = '#d9d9d9';
              }
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '0 16px',
              height: 36,
              marginRight: 4,
              borderRadius: 6,
              cursor: 'pointer',
              position: 'relative',
              background: isActive ? '#e6f7ff' : '#f5f5f5',
              color: '#000000d9',
              border: isActive ? '1px solid #91d5ff' : '1px solid #d9d9d9',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap',
              minWidth: 100,
              maxWidth: 200,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              opacity: isDragging ? 0.5 : 1,
              borderColor: isDragOver ? '#1677ff' : (isActive ? '#91d5ff' : '#d9d9d9'),
              boxShadow: isDragOver ? '0 0 0 2px rgba(22, 119, 255, 0.2)' : 'none',
            }}
          >
            {/* 标签页标题 */}
            <span style={{
              flex: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              fontSize: 14,
              fontWeight: 400,
            }}>
              {tab.title}
            </span>
            
            {/* 关闭按钮（首页标签页不显示） */}
            {!isHomeTab && (
              <div
                onClick={(e) => handleTabClose(e, tab)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 16,
                  height: 16,
                  marginLeft: 8,
                  borderRadius: '50%',
                  background: 'rgba(0, 0, 0, 0.06)',
                  color: '#00000073',
                  fontSize: 10,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => {
                  e.stopPropagation();
                  e.currentTarget.style.background = 'rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.stopPropagation();
                  e.currentTarget.style.background = 'rgba(0, 0, 0, 0.06)';
                }}
              >
                <CloseOutlined />
              </div>
            )}
            
            {/* 激活标签页下划线 */}
            {isActive && (
              <div style={{
                position: 'absolute',
                bottom: -1,
                left: 0,
                right: 0,
                height: 2,
                background: '#1677ff',
                borderRadius: '1px 1px 0 0',
              }} />
            )}
          </div>
        );

        if (isHomeTab) {
          return tabNode;
        }

        return (
          <Dropdown
            key={tab.key}
            trigger={['contextMenu']}
            menu={{
              items: buildContextMenuItems(tab),
              onClick: (info) => handleContextMenuClick(info, tab),
            }}
          >
            {tabNode}
          </Dropdown>
        );
      })}
    </div>
  );
};

export default DraggableTabNavigation;