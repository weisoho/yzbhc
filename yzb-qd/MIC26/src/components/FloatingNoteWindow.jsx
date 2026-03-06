import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, Input, Button, Space, Modal, message } from 'antd';
import {
  SaveOutlined,
  DeleteOutlined,
  ExportOutlined,
  ImportOutlined,
  MinusOutlined
} from '@ant-design/icons';
import { saveNote, getNoteByPage, exportNotes, importNotes } from '../utils/noteStorage';
import './FloatingNoteWindow.css';

const { TextArea } = Input;

const FloatingNoteWindow = ({ pagePath, pageTitle, onClose }) => {
  // 窗口状态
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  
  // 窗口位置和尺寸
  const [position, setPosition] = useState({ x: window.innerWidth - 420, y: window.innerHeight - 320 });
  const [size, setSize] = useState({ width: 400, height: 300 });
  
  // 调整大小方向
  const [resizeDirection, setResizeDirection] = useState(null);
  
  // 备注内容
  const [noteContent, setNoteContent] = useState('');
  
  // 引用
  const windowRef = useRef(null);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const resizeStateRef = useRef({
    isActive: false,
    direction: null,
    startX: 0,
    startY: 0,
    startWidth: 0,
    startHeight: 0,
    startLeft: 0,
    startTop: 0
  });
  
  // 加载页面备注
  useEffect(() => {
    if (pagePath) {
      const note = getNoteByPage(pagePath);
      if (note) {
        setNoteContent(note.content);
      }
    }
  }, [pagePath]);
  

  
  // 窗口拖拽处理
  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
  }, [position.x, position.y]);
  
  // 处理拖动移动
  const handleDragMove = useCallback((e) => {
    if (!isDragging) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const newX = e.clientX - dragStartRef.current.x;
    const newY = e.clientY - dragStartRef.current.y;
    
    // 限制窗口在屏幕内
    const maxX = window.innerWidth - size.width;
    const maxY = window.innerHeight - size.height;
    
    setPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY))
    });
  }, [isDragging, size.width, size.height, setPosition]);
  
  // 结束拖动
  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);
  
  // 开始调整大小
  const handleResizeStart = useCallback((e, direction) => {
    e.preventDefault();
    e.stopPropagation();
    
    // 如果窗口已最小化，不调整大小
    if (isMinimized) return;
    
    setIsResizing(true);
    setResizeDirection(direction);
    
    // 保存初始状态到ref
    resizeStateRef.current = {
      isActive: true,
      direction,
      startX: e.clientX,
      startY: e.clientY,
      startWidth: size.width,
      startHeight: size.height,
      startLeft: position.x,
      startTop: position.y
    };
  }, [isMinimized, size.width, size.height, position.x, position.y]);
  
  // 处理调整大小移动
  const handleResizeMove = useCallback((e) => {
    if (!resizeStateRef.current.isActive) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const { direction, startX, startY, startWidth, startHeight, startLeft, startTop } = resizeStateRef.current;
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;
    
    let newWidth = startWidth;
    let newHeight = startHeight;
    let newX = startLeft;
    let newY = startTop;
    
    // 根据方向调整大小
    if (direction.includes('e')) {
      newWidth = Math.max(300, Math.min(800, startWidth + deltaX));
    }
    if (direction.includes('w')) {
      const widthChange = startWidth - deltaX;
      if (widthChange >= 300 && widthChange <= 800) {
        newWidth = widthChange;
        newX = startLeft + deltaX;
      }
    }
    if (direction.includes('s')) {
      newHeight = Math.max(200, Math.min(600, startHeight + deltaY));
    }
    if (direction.includes('n')) {
      const heightChange = startHeight - deltaY;
      if (heightChange >= 200 && heightChange <= 600) {
        newHeight = heightChange;
        newY = startTop + deltaY;
      }
    }
    
    // 边界检查：确保窗口保持在屏幕内
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    
    // 限制宽度和高度不超过屏幕尺寸
    newWidth = Math.min(newWidth, screenWidth);
    newHeight = Math.min(newHeight, screenHeight);
    
    // 限制位置在屏幕范围内
    newX = Math.max(0, Math.min(newX, screenWidth - newWidth));
    newY = Math.max(0, Math.min(newY, screenHeight - newHeight));
    
    // 更新尺寸和位置
    setSize({ width: newWidth, height: newHeight });
    if (newX !== startLeft || newY !== startTop) {
      setPosition({ x: newX, y: newY });
    }
  }, []);
  
  // 结束调整大小
  const handleResizeEnd = useCallback(() => {
    if (!resizeStateRef.current.isActive) return;
    
    resizeStateRef.current.isActive = false;
    setIsResizing(false);
    setResizeDirection(null);
  }, []);
  
  // 全局事件监听器
  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      if (resizeStateRef.current.isActive) {
        e.preventDefault();
        e.stopPropagation();
        handleResizeMove(e);
      } else if (isDragging) {
        e.preventDefault();
        e.stopPropagation();
        handleDragMove(e);
      }
    };
    
    const handleGlobalMouseUp = () => {
      if (resizeStateRef.current.isActive) {
        handleResizeEnd();
      } else if (isDragging) {
        handleDragEnd();
      }
    };
    
    document.addEventListener('mousemove', handleGlobalMouseMove);
    document.addEventListener('mouseup', handleGlobalMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, handleDragMove, handleDragEnd, handleResizeMove, handleResizeEnd]);
  
  // 最小化窗口（隐藏窗口）
  const handleMinimize = () => {
    if (onClose) {
      onClose();
    } else {
      setIsMinimized(true);
    }
  };
  

  
  // 保存备注
  const handleSaveNote = () => {
    if (!pagePath || !pageTitle) {
      message.warning('无法保存备注：缺少页面信息');
      return;
    }
    
    const success = saveNote(pagePath, pageTitle, noteContent);
    if (success) {
      if (noteContent.trim()) {
        message.success('备注已保存');
      } else {
        message.success('空备注已保存');
      }
    } else {
      message.error('保存备注失败');
    }
  };
  
  // 清空备注
  const handleClearNote = () => {
    Modal.confirm({
      title: '清空备注',
      content: '确定要清空当前页面的备注内容吗？',
      onOk: () => {
        setNoteContent('');
        // 立即保存空内容到存储
        if (pagePath && pageTitle) {
          const success = saveNote(pagePath, pageTitle, '');
          if (success) {
            message.success('备注已清空并保存');
          } else {
            message.error('清空备注失败');
          }
        } else {
          message.info('备注已清空');
        }
      }
    });
  };
  
  // 导出备注
  const handleExportNotes = () => {
    const exportData = exportNotes();
    const url = URL.createObjectURL(exportData.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = exportData.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    message.success('备注已导出');
  };
  
  // 导入备注
  const handleImportNotes = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const success = importNotes(event.target.result);
        if (success) {
          message.success('备注已导入');
          // 重新加载当前页面备注
          const note = getNoteByPage(pagePath);
          if (note) {
            setNoteContent(note.content);
          }
        } else {
          message.error('导入备注失败');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };
  

  
  // 处理窗口点击，防止事件冒泡
  const handleWindowClick = (e) => {
    e.stopPropagation();
  };
  
  // 处理空白区域鼠标按下（用于拖动）
  const handleBlankAreaMouseDown = useCallback((e) => {
    // 如果窗口已最小化，不拖动
    if (isMinimized) return;
    
    // 如果点击的是按钮、输入框或其他交互元素，不触发拖动
    const target = e.target;
    if (
      target.tagName === 'BUTTON' ||
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.closest('button') ||
      target.closest('input') ||
      target.closest('textarea')
    ) {
      return;
    }
    
    // 触发拖动
    handleMouseDown(e);
  }, [isMinimized, handleMouseDown]);
  
  // 获取调整大小光标
  const getResizeCursor = (direction) => {
    if (!direction) return 'default';
    switch (direction) {
      case 'n': return 'n-resize';
      case 's': return 's-resize';
      case 'e': return 'e-resize';
      case 'w': return 'w-resize';
      case 'ne': return 'ne-resize';
      case 'nw': return 'nw-resize';
      case 'se': return 'se-resize';
      case 'sw': return 'sw-resize';
      default: return 'default';
    }
  };
  
  const windowStyle = {
    position: 'fixed',
    left: `${position.x}px`,
    top: `${position.y}px`,
    width: `${size.width}px`,
    height: `${size.height}px`,
    zIndex: 9999,
    cursor: isDragging ? 'grabbing' : (isResizing ? getResizeCursor(resizeDirection) : 'default'),
    transition: (isDragging || isResizing) ? 'none' : 'all 0.2s ease'
  };
  
  return (
    <div
      ref={windowRef}
      className={`floating-note-window ${isDragging ? 'dragging' : ''} ${isResizing ? 'resizing' : ''}`}
      style={windowStyle}
      onClick={handleWindowClick}
    >
      <Card
        className="note-window-card"
        title={
          <div 
            className="window-header"
            onMouseDown={handleMouseDown}
          >
            <Space>
              <span className="window-title">
                {pageTitle ? `${pageTitle} - 开发备注` : '开发备注'}
              </span>
            </Space>
          </div>
        }
        onMouseDown={handleBlankAreaMouseDown}
        extra={
          <Space size="small">
            {!isMinimized && (
              <Button
                type="text"
                size="small"
                icon={<MinusOutlined />}
                onClick={handleMinimize}
                style={{ color: 'white' }}
              />
            )}
          </Space>
        }
        size="small"
        styles={{
          body: {
            padding: '12px',
            height: 'calc(100% - 57px)',
            overflow: 'hidden'
          }
        }}
      >
            <div className="note-content-area">
              <TextArea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="在此输入开发备注..."
                autoSize={{ minRows: 8, maxRows: 20 }}
                style={{ width: '100%', height: '100%', resize: 'none' }}
              />
            </div>
            
            <div className="window-footer">
              <Space>
                <Button
                  type="primary"
                  size="small"
                  icon={<SaveOutlined />}
                  onClick={handleSaveNote}
                >
                  保存
                </Button>
                <Button
                  size="small"
                  icon={<DeleteOutlined />}
                  onClick={handleClearNote}
                  danger
                >
                  清空
                </Button>
                <Button
                  size="small"
                  icon={<ExportOutlined />}
                  onClick={handleExportNotes}
                >
                  导出
                </Button>
                <Button
                  size="small"
                  icon={<ImportOutlined />}
                  onClick={handleImportNotes}
                >
                  导入
                </Button>
              </Space>

            </div>
      </Card>
      
      {/* 调整大小拖动区域 */}
      {!isMinimized && (
        <>
          {/* 上边缘 */}
          <div
            className="resize-edge"
            style={{
              top: 0,
              left: 0,
              right: 0,
              height: '5px',
              cursor: 'n-resize'
            }}
            onMouseDown={(e) => handleResizeStart(e, 'n')}
          />
          {/* 下边缘 */}
          <div
            className="resize-edge"
            style={{
              bottom: 0,
              left: 0,
              right: 0,
              height: '5px',
              cursor: 's-resize'
            }}
            onMouseDown={(e) => handleResizeStart(e, 's')}
          />
          {/* 左边缘 */}
          <div
            className="resize-edge"
            style={{
              top: 0,
              left: 0,
              bottom: 0,
              width: '5px',
              cursor: 'w-resize'
            }}
            onMouseDown={(e) => handleResizeStart(e, 'w')}
          />
          {/* 右边缘 */}
          <div
            className="resize-edge"
            style={{
              top: 0,
              right: 0,
              bottom: 0,
              width: '5px',
              cursor: 'e-resize'
            }}
            onMouseDown={(e) => handleResizeStart(e, 'e')}
          />
          {/* 左上角 */}
          <div
            className="resize-corner"
            style={{
              top: 0,
              left: 0,
              width: '10px',
              height: '10px',
              cursor: 'nw-resize'
            }}
            onMouseDown={(e) => handleResizeStart(e, 'nw')}
          />
          {/* 右上角 */}
          <div
            className="resize-corner"
            style={{
              top: 0,
              right: 0,
              width: '10px',
              height: '10px',
              cursor: 'ne-resize'
            }}
            onMouseDown={(e) => handleResizeStart(e, 'ne')}
          />
          {/* 左下角 */}
          <div
            className="resize-corner"
            style={{
              bottom: 0,
              left: 0,
              width: '10px',
              height: '10px',
              cursor: 'sw-resize'
            }}
            onMouseDown={(e) => handleResizeStart(e, 'sw')}
          />
          {/* 右下角 */}
          <div
            className="resize-corner"
            style={{
              bottom: 0,
              right: 0,
              width: '10px',
              height: '10px',
              cursor: 'se-resize'
            }}
            onMouseDown={(e) => handleResizeStart(e, 'se')}
          />
        </>
      )}

    </div>
  );
};

export default FloatingNoteWindow;