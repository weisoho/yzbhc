import React, { useRef, useEffect } from 'react';

const ProtectedContent = ({ children, className, style }) => {
  const contentRef = useRef(null);

  useEffect(() => {
    const contentElement = contentRef.current;
    if (!contentElement) return;

    // 阻止选择文本
    const preventSelection = (e) => {
      e.preventDefault();
      return false;
    };

    // 阻止右键菜单
    const preventContextMenu = (e) => {
      e.preventDefault();
      return false;
    };

    // 阻止复制、剪切和粘贴
    const preventCopy = (e) => {
      e.preventDefault();
      return false;
    };

    // 添加事件监听器
    contentElement.addEventListener('selectstart', preventSelection);
    contentElement.addEventListener('contextmenu', preventContextMenu);
    contentElement.addEventListener('copy', preventCopy);
    contentElement.addEventListener('cut', preventCopy);
    contentElement.addEventListener('paste', preventCopy);

    // 添加 CSS 样式来阻止选择
    contentElement.style.userSelect = 'none';
    contentElement.style.webkitUserSelect = 'none';
    contentElement.style.msUserSelect = 'none';
    contentElement.style.mozUserSelect = 'none';

    // 添加 CSS 样式来阻止拖拽
    contentElement.style.webkitUserDrag = 'none';
    contentElement.style.userDrag = 'none';

    return () => {
      // 清理事件监听器
      contentElement.removeEventListener('selectstart', preventSelection);
      contentElement.removeEventListener('contextmenu', preventContextMenu);
      contentElement.removeEventListener('copy', preventCopy);
      contentElement.removeEventListener('cut', preventCopy);
      contentElement.removeEventListener('paste', preventCopy);
    };
  }, []);

  return (
    <div
      ref={contentRef}
      className={className}
      style={{
        ...style,
        cursor: 'default',
      }}
    >
      {children}
    </div>
  );
};

export default ProtectedContent;