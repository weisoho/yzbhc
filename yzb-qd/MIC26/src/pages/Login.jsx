import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Checkbox } from 'antd';
import { UserOutlined, LockOutlined, DatabaseOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = (values) => {
    setLoading(true);
    
    // 模拟登录验证
    setTimeout(() => {
      setLoading(false);
      
      // 简单的模拟验证：用户名admin，密码000000
      if (values.username === 'admin' && values.password === '000000') {
        // 保存登录状态
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', values.username);
        
        // 清除之前的院区选择状态，强制显示院区选择弹窗
        localStorage.removeItem('hasSelectedCampus');
        
        message.success('登录成功');
        navigate('/');
      } else {
        message.error('用户名或密码错误');
      }
    }, 1000);
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <Card 
        style={{
          width: 450,
          borderRadius: 16,
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
          border: 'none',
          overflow: 'hidden'
        }}
      >
        {/* 头部装饰 */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '30px',
          textAlign: 'center',
          margin: '-24px -24px 24px -24px'
        }}>
          <DatabaseOutlined style={{ fontSize: 48, color: '#fff', marginBottom: 16 }} />
          <Title level={3} style={{ color: '#fff', margin: 0, fontWeight: 500 }}>医智云管理系统</Title>
          <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: 14 }}>高效、智能的库存管理解决方案</Text>
        </div>
        
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
          autoComplete="off"
        >
          <Form.Item
            name="username"
            label={<Text strong style={{ fontSize: 14 }}>用户名</Text>}
            rules={[
              { required: true, message: '请输入用户名', trigger: 'blur' },
              { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' },
              { pattern: /^[a-zA-Z0-9_-]+$/, message: '用户名只能包含字母、数字、下划线和连字符', trigger: 'blur' }
            ]}
            validateTrigger={['onBlur', 'onChange']}
            style={{ marginBottom: 20 }}
          >
            <Input
              prefix={<UserOutlined style={{ color: '#667eea' }} />}
              placeholder="请输入用户名"
              size="large"
              style={{
                height: 48,
                borderRadius: 8,
                borderColor: '#e8e8e8',
                fontSize: 14,
              }}
            />
          </Form.Item>
          
          <Form.Item
            name="password"
            label={<Text strong style={{ fontSize: 14 }}>密码</Text>}
            rules={[
              { required: true, message: '请输入密码', trigger: 'blur' },
              { min: 6, max: 30, message: '密码长度在 6 到 30 个字符', trigger: 'blur' },
              { pattern: /^[a-zA-Z0-9_-]+$/, message: '密码只能包含字母、数字、下划线和连字符', trigger: 'blur' }
            ]}
            validateTrigger={['onBlur', 'onChange']}
            style={{ marginBottom: 24 }}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#667eea' }} />}
              placeholder="请输入密码"
              size="large"
              style={{
                height: 48,
                borderRadius: 8,
                borderColor: '#e8e8e8',
                fontSize: 14,
              }}
              visibilityToggle
            />
          </Form.Item>
          
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Checkbox>记住我</Checkbox>
              </div>
              <Text type="link" style={{ color: '#667eea' }}>
                忘记密码？
              </Text>
            </div>
          </Form.Item>

          <Form.Item style={{ marginBottom: 24 }}>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={loading}
              style={{
                height: 48,
                fontSize: 16,
                fontWeight: 500,
                borderRadius: 8,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                  boxShadow: '0 6px 16px rgba(102, 126, 234, 0.5)'
                }
              }}
            >
              登录
            </Button>
          </Form.Item>
        </Form>
        
        <div style={{ textAlign: 'center', paddingTop: 16, borderTop: '1px solid #f0f0f0' }}>
          <Text style={{ color: '#999', fontSize: 12 }}>
            @2026 南昌云晟健康科技有限公司
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default Login;