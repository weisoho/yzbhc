import React from 'react';
import { Modal, Card, Button, Typography, Space } from 'antd';
import { EnvironmentOutlined, CheckOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const CampusSelectorModal = ({ visible, onCancel, onSelect, currentCampus, currentCampusId, campuses = [] }) => {
  const campusList = campuses.map((campus) => ({
    id: campus.id,
    name: campus.deptName || campus.name,
    description: campus.remark || campus.address || '该院区暂未维护说明信息',
  }));

  return (
    <Modal
      title="选择登录院区"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
      centered
      maskClosable={false}
    >
      <div style={{ padding: '16px 0' }}>
        <Text type="secondary" style={{ marginBottom: 24, display: 'block' }}>
          请选择您要登录的院区，选择后系统将根据院区权限加载相应功能
        </Text>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', 
          gap: 16,
          marginBottom: 24
        }}>
          {campusList.map((campus) => (
            <Card
              key={campus.id}
              hoverable
              onClick={() => onSelect(campus.id)}
              style={{
                border: Number(currentCampusId) === Number(campus.id)
                  ? '2px solid #667eea' 
                  : '1px solid #f0f0f0',
                borderRadius: 8,
                cursor: 'pointer',
                transition: 'all 0.3s',
                position: 'relative',
                overflow: 'hidden'
              }}
              styles={{ body: { padding: 16 } }}
            >
              {Number(currentCampusId) === Number(campus.id) && (
                <div style={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  background: '#667eea',
                  color: 'white',
                  borderRadius: '50%',
                  width: 24,
                  height: 24,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12
                }}>
                  <CheckOutlined />
                </div>
              )}
              
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                <EnvironmentOutlined style={{ 
                  fontSize: 20, 
                  color: '#667eea',
                  marginRight: 8 
                }} />
                <Title level={5} style={{ margin: 0, color: '#262626' }}>
                  {campus.name}
                </Title>
              </div>
              
              <Text type="secondary" style={{ fontSize: 12 }}>
                {campus.description}
              </Text>
              
              <div style={{ 
                marginTop: 12, 
                paddingTop: 12, 
                borderTop: '1px solid #f0f0f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <Text type="secondary" style={{ fontSize: 11 }}>
                  点击选择此院区
                </Text>
                <Button 
                  type={Number(currentCampusId) === Number(campus.id) ? 'primary' : 'default'}
                  size="small"
                  style={{
                    background: Number(currentCampusId) === Number(campus.id) ? '#667eea' : 'transparent',
                    borderColor: Number(currentCampusId) === Number(campus.id) ? '#667eea' : '#d9d9d9'
                  }}
                >
                  {Number(currentCampusId) === Number(campus.id) ? '已选择' : '选择'}
                </Button>
              </div>
            </Card>
          ))}
        </div>
        
        <div style={{ 
          background: '#f6ffed', 
          border: '1px solid #b7eb8f', 
          borderRadius: 6,
          padding: 16,
          marginTop: 24
        }}>
          <Space direction="vertical" size={8} style={{ width: '100%' }}>
            <Text strong style={{ color: '#52c41a' }}>
              当前选择：{currentCampus || '未选择院区'}
            </Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              提示：院区选择将影响您可访问的功能模块和数据权限。如需切换院区，可随时点击状态栏中的院区名称进行更改。
            </Text>
          </Space>
        </div>
      </div>
    </Modal>
  );
};

export default CampusSelectorModal;