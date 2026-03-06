import React, { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Table,
  Form,
  Input,
  Modal,
  message,
  Popconfirm,
  Select,
  InputNumber,
  Spin,
  Alert,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  LockOutlined,
} from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;

/**
 * 院区管理组件
 * 新建、修改新院区信息及其统计信息
 * 分院操作、查看等权限不可在用户界面操作，需在单独的端口进行操作，或者在扫描到对应加密密钥（加密狗）后自动打开页面
 */
const CampusManagement = () => {
  // 状态管理
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [campuses, setCampuses] = useState([]);
  const [editingCampus, setEditingCampus] = useState(null);
  const [viewingCampus, setViewingCampus] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authKey, setAuthKey] = useState('');
  const [isAuthModalVisible, setIsAuthModalVisible] = useState(false);

  // 模拟数据 - 实际项目中应从API获取
  const mockCampuses = [
    {
      id: 1,
      name: '总院',
      code: 'HQ',
      address: '北京市海淀区中关村南大街5号',
      contactPerson: '张三',
      contactPhone: '13800138000',
      status: 'active',
      parentId: null,
      level: 1,
      statistics: {
        totalBuildings: 10,
        totalFloors: 50,
        totalRooms: 500,
        totalArea: 100000,
        totalDepartments: 30,
        totalStaff: 2000,
        totalBeds: 1000,
      },
    },
    {
      id: 2,
      name: '东院',
      code: 'EAST',
      address: '北京市朝阳区东三环中路39号',
      contactPerson: '李四',
      contactPhone: '13900139000',
      status: 'active',
      parentId: 1,
      level: 2,
      statistics: {
        totalBuildings: 5,
        totalFloors: 25,
        totalRooms: 250,
        totalArea: 50000,
        totalDepartments: 20,
        totalStaff: 1000,
        totalBeds: 500,
      },
    },
    {
      id: 3,
      name: '西院',
      code: 'WEST',
      address: '北京市西城区西直门南大街11号',
      contactPerson: '王五',
      contactPhone: '13700137000',
      status: 'active',
      parentId: 1,
      level: 2,
      statistics: {
        totalBuildings: 4,
        totalFloors: 20,
        totalRooms: 200,
        totalArea: 40000,
        totalDepartments: 15,
        totalStaff: 800,
        totalBeds: 400,
      },
    },
  ];

  // 初始化数据
  useEffect(() => {
    setCampuses(mockCampuses);
  }, []);

  // 打开授权模态框
  const showAuthModal = () => {
    setIsAuthModalVisible(true);
  };

  // 处理授权
  const handleAuth = () => {
    // 实际项目中应验证加密狗或密钥
    if (authKey === 'system') {
      setIsAuthorized(true);
      setIsAuthModalVisible(false);
      message.success('授权成功');
    } else {
      message.error('授权失败，请输入正确的系统密钥');
    }
  };

  // 打开新建模态框
  const showCreateModal = () => {
    if (!isAuthorized) {
      showAuthModal();
      return;
    }
    setEditingCampus(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  // 打开编辑模态框
  const showEditModal = (campus) => {
    if (!isAuthorized) {
      showAuthModal();
      return;
    }
    setEditingCampus(campus);
    form.setFieldsValue({
      ...campus,
      ...campus.statistics,
    });
    setIsModalVisible(true);
  };

  // 打开查看模态框
  const showViewModal = (campus) => {
    setViewingCampus(campus);
    setIsViewModalVisible(true);
  };

  // 关闭模态框
  const handleCancel = () => {
    setIsModalVisible(false);
    setIsViewModalVisible(false);
    setIsAuthModalVisible(false);
  };

  // 处理表单提交
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setIsSubmitting(true);

      // 分离基本信息和统计信息
      const {
        totalBuildings,
        totalFloors,
        totalRooms,
        totalArea,
        totalDepartments,
        totalStaff,
        totalBeds,
        ...basicInfo
      } = values;

      const statistics = {
        totalBuildings,
        totalFloors,
        totalRooms,
        totalArea,
        totalDepartments,
        totalStaff,
        totalBeds,
      };

      const campusData = {
        ...basicInfo,
        statistics,
      };

      if (editingCampus) {
        // 更新院区
        const updatedCampuses = campuses.map((campus) =>
          campus.id === editingCampus.id ? { ...campus, ...campusData } : campus
        );
        setCampuses(updatedCampuses);
        message.success('院区信息更新成功');
      } else {
        // 新建院区
        const newCampus = {
          id: campuses.length + 1,
          ...campusData,
          status: 'active',
          level: basicInfo.parentId ? 2 : 1,
        };
        setCampuses([...campuses, newCampus]);
        message.success('院区信息创建成功');
      }

      setIsModalVisible(false);
    } catch (error) {
      console.error('表单验证失败:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 处理删除
  const handleDelete = (id) => {
    if (!isAuthorized) {
      showAuthModal();
      return;
    }

    // 检查是否有子院区
    const hasChildren = campuses.some((campus) => campus.parentId === id);
    if (hasChildren) {
      message.error('该院区下有子院区，无法删除');
      return;
    }

    const updatedCampuses = campuses.filter((campus) => campus.id !== id);
    setCampuses(updatedCampuses);
    message.success('院区删除成功');
  };

  // 表格列配置
  const columns = [
    {
      title: '院区名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '院区编码',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
      ellipsis: true,
    },
    {
      title: '负责人',
      dataIndex: 'contactPerson',
      key: 'contactPerson',
    },
    {
      title: '联系电话',
      dataIndex: 'contactPhone',
      key: 'contactPhone',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <span style={{ color: status === 'active' ? '#52c41a' : '#ff4d4f' }}>
          {status === 'active' ? '启用' : '禁用'}
        </span>
      ),
    },
    {
      title: '级别',
      dataIndex: 'level',
      key: 'level',
      render: (level) => (level === 1 ? '总院' : '分院'),
    },
    {
      title: '操作',
      key: 'action',
      render: (_text, record) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => showViewModal(record)}
          >
            查看
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => showEditModal(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定删除此院区吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
            >
              删除
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Card
        title="院区管理"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={showCreateModal}
          >
            新建院区
          </Button>
        }
      >
        <Alert
          message="安全提示"
          description="院区管理涉及系统核心配置，操作前需要进行系统授权。"
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
        />

        <Table
          columns={columns}
          dataSource={campuses}
          rowKey="id"
          loading={isLoading}
          pagination={{ pageSize: 10 }}
        />

        {/* 授权模态框 */}
        <Modal
          title="系统授权"
          open={isAuthModalVisible}
          onOk={handleAuth}
          onCancel={handleCancel}
        >
          <p>请输入系统密钥或插入加密狗以获得操作权限</p>
          <Input
            placeholder="请输入系统密钥"
            value={authKey}
            onChange={(e) => setAuthKey(e.target.value)}
            style={{ marginTop: 16 }}
          />
          <p style={{ marginTop: 8, color: '#8c8c8c', fontSize: 12 }}>
            提示：系统密钥泄露会有严重风险，请妥善保管
          </p>
        </Modal>

        {/* 新建/编辑模态框 */}
        <Modal
          title={editingCampus ? "编辑院区" : "新建院区"}
          open={isModalVisible}
          onOk={handleSubmit}
          onCancel={handleCancel}
          confirmLoading={isSubmitting}
          width={800}
        >
          <Form
            form={form}
            layout="vertical"
          >
            <Form.Item
              label="院区名称"
              name="name"
              rules={[{ required: true, message: '请输入院区名称' }]}
            >
              <Input placeholder="请输入院区名称" />
            </Form.Item>

            <Form.Item
              label="院区编码"
              name="code"
              rules={[{ required: true, message: '请输入院区编码' }]}
            >
              <Input placeholder="请输入院区编码" />
            </Form.Item>

            <Form.Item
              label="院区地址"
              name="address"
              rules={[{ required: true, message: '请输入院区地址' }]}
            >
              <TextArea rows={2} placeholder="请输入院区地址" />
            </Form.Item>

            <Form.Item
              label="负责人"
              name="contactPerson"
              rules={[{ required: true, message: '请输入负责人' }]}
            >
              <Input placeholder="请输入负责人" />
            </Form.Item>

            <Form.Item
              label="联系电话"
              name="contactPhone"
              rules={[{ required: true, message: '请输入联系电话' }]}
            >
              <Input placeholder="请输入联系电话" />
            </Form.Item>

            <Form.Item
              label="上级院区"
              name="parentId"
            >
              <Select placeholder="请选择上级院区（可选）">
                <Option value={null}>无（作为总院）</Option>
                {campuses
                  .filter((campus) => campus.level === 1)
                  .map((campus) => (
                    <Option key={campus.id} value={campus.id}>
                      {campus.name}
                    </Option>
                  ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="院区状态"
              name="status"
            >
              <Select placeholder="请选择院区状态">
                <Option value="active">启用</Option>
                <Option value="inactive">禁用</Option>
              </Select>
            </Form.Item>

            <Card title="统计信息" style={{ marginTop: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                <Form.Item
                  label="建筑物数量"
                  name="totalBuildings"
                >
                  <InputNumber placeholder="请输入建筑物数量" />
                </Form.Item>

                <Form.Item
                  label="楼层总数"
                  name="totalFloors"
                >
                  <InputNumber placeholder="请输入楼层总数" />
                </Form.Item>

                <Form.Item
                  label="房间数量"
                  name="totalRooms"
                >
                  <InputNumber placeholder="请输入房间数量" />
                </Form.Item>

                <Form.Item
                  label="总建筑面积"
                  name="totalArea"
                >
                  <InputNumber placeholder="请输入总建筑面积" addonAfter="㎡" />
                </Form.Item>

                <Form.Item
                  label="科室数量"
                  name="totalDepartments"
                >
                  <InputNumber placeholder="请输入科室数量" />
                </Form.Item>

                <Form.Item
                  label="职工总数"
                  name="totalStaff"
                >
                  <InputNumber placeholder="请输入职工总数" />
                </Form.Item>

                <Form.Item
                  label="床位数量"
                  name="totalBeds"
                >
                  <InputNumber placeholder="请输入床位数量" />
                </Form.Item>
              </div>
            </Card>
          </Form>
        </Modal>

        {/* 查看模态框 */}
        <Modal
          title="院区详情"
          open={isViewModalVisible}
          onCancel={handleCancel}
          footer={[
            <Button key="close" onClick={handleCancel}>
              关闭
            </Button>,
          ]}
          width={800}
        >
          {viewingCampus && (
            <div>
              <div style={{ marginBottom: 16 }}>
                <h3 style={{ marginBottom: 8 }}>基本信息</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
                  <div>
                    <p><strong>院区名称：</strong>{viewingCampus.name}</p>
                    <p><strong>院区编码：</strong>{viewingCampus.code}</p>
                    <p><strong>院区地址：</strong>{viewingCampus.address}</p>
                  </div>
                  <div>
                    <p><strong>负责人：</strong>{viewingCampus.contactPerson}</p>
                    <p><strong>联系电话：</strong>{viewingCampus.contactPhone}</p>
                    <p><strong>院区状态：</strong>{viewingCampus.status === 'active' ? '启用' : '禁用'}</p>
                    <p><strong>院区级别：</strong>{viewingCampus.level === 1 ? '总院' : '分院'}</p>
                  </div>
                </div>
              </div>

              <Card title="统计信息">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                  <p><strong>建筑物数量：</strong>{viewingCampus.statistics.totalBuildings}</p>
                  <p><strong>楼层总数：</strong>{viewingCampus.statistics.totalFloors}</p>
                  <p><strong>房间数量：</strong>{viewingCampus.statistics.totalRooms}</p>
                  <p><strong>总建筑面积：</strong>{viewingCampus.statistics.totalArea} ㎡</p>
                  <p><strong>科室数量：</strong>{viewingCampus.statistics.totalDepartments}</p>
                  <p><strong>职工总数：</strong>{viewingCampus.statistics.totalStaff}</p>
                  <p><strong>床位数量：</strong>{viewingCampus.statistics.totalBeds}</p>
                </div>
              </Card>
            </div>
          )}
        </Modal>
      </Card>
    </div>
  );
};

export default CampusManagement;