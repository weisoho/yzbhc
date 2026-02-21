import React, { useState, useEffect, useRef } from 'react';
import { CloseOutlined } from '@ant-design/icons';

const TabNavigation = ({ tabs, activeTab, onTabClick, onTabClose }) => {
  const [hoveredTab, setHoveredTab] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 阻止标签页内容的文本选择和复制
    const preventSelection = (e) => {
      e.preventDefault();
      return false;
    };

    const preventCopy = (e) => {
      e.preventDefault();
      return false;
    };

    container.addEventListener('selectstart', preventSelection);
    container.addEventListener('copy', preventCopy);
    container.addEventListener('cut', preventCopy);

    // 添加 CSS 样式
    container.style.userSelect = 'none';
    container.style.webkitUserSelect = 'none';

    return () => {
      container.removeEventListener('selectstart', preventSelection);
      container.removeEventListener('copy', preventCopy);
      container.removeEventListener('cut', preventCopy);
    };
  }, []);

  const handleTabClick = (tab) => {
    onTabClick(tab);
  };

  const handleTabClose = (e, tab) => {
    e.stopPropagation();
    onTabClose(tab);
  };

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
        const isHovered = hoveredTab === tab.key;
        const isHomeTab = tab.key === '/';
        
        return (
          <div
            key={tab.key}
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
            }}
          >
            <span style={{
              flex: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              fontSize: 14,
              fontWeight: 400,
            }}>
              {tab.title}
            </span>
            
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
      })}
    </div>
  );
};

export default TabNavigation;