import React from 'react';
import { Spin, Card, Typography } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const { Text } = Typography;

// 加载组件，用于显示加载状态
const Loading = ({ 
  spinning = true, 
  tip = '加载中...', 
  size = 'large',
  fullScreen = false,
  style = {},
  children 
}) => {
  // 自定义加载图标
  const antIcon = <LoadingOutlined style={{ fontSize: 24, color: '#667eea' }} spin />;

  // 全屏加载样式
  const fullScreenStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    ...style,
  };

  // 普通加载样式
  const normalStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
    ...style,
  };

  // 渲染加载内容
  const renderContent = () => (
    <div style={{ textAlign: 'center', padding: '24px' }}>
      {antIcon}
      {tip && (
        <Text style={{ 
          display: 'block', 
          marginTop: 12, 
          fontSize: 14, 
          color: '#666',
        }}>
          {tip}
        </Text>
      )}
    </div>
  );

  // 如果没有子组件，直接显示加载状态
  if (!children) {
    return fullScreen ? (
      <div style={fullScreenStyle}>{renderContent()}</div>
    ) : (
      <Card bordered={false} style={normalStyle}>
        {renderContent()}
      </Card>
    );
  }

  // 如果有子组件，使用Spin包裹
  return (
    <Spin
      spinning={spinning}
      tip={tip}
      indicator={antIcon}
      size={size}
      fullscreen={fullScreen}
      style={style}
    >
      {children}
    </Spin>
  );
};

// 页面加载组件
export const PageLoading = ({ tip = '页面加载中...' }) => {
  return (
    <Loading 
      fullScreen 
      tip={tip}
      style={{
        backgroundColor: 'rgba(248, 249, 250, 0.9)',
      }}
    />
  );
};

// 列表加载组件
export const ListLoading = ({ tip = '数据加载中...', count = 5 }) => {
  return (
    <div style={{ padding: 16 }}>
      <div style={{ textAlign: 'center', marginBottom: 16, color: '#666', fontSize: 14 }}>{tip}</div>
      {Array.from({ length: count }).map((_, index) => (
        <Card 
          key={index} 
          bordered={false} 
          style={{
            marginBottom: 16,
            opacity: 0.6,
          }}
        >
          <div style={{ height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Spin indicator={<LoadingOutlined style={{ fontSize: 20, color: '#667eea' }} spin />} />
          </div>
        </Card>
      ))}
    </div>
  );
};

export default Loading;
