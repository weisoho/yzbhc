import React from 'react';
import { Card, Row, Col, Button, Space } from 'antd';
import { SearchOutlined, PlusOutlined, ExportOutlined } from '@ant-design/icons';

const SearchForm = ({ children, onSearch, onAdd, onExport, showAdd = true, showExport = true, title }) => {
  return (
    <Card title={title} style={{ marginBottom: 16 }}>
      <Row gutter={[16, 0]} align="middle">
        {children}
        <Col xs={24} sm={12} md={12} lg={8}>
          <Space>
            <Button type="primary" icon={<SearchOutlined />} style={{ minWidth: 100 }} onClick={onSearch}>
              查询
            </Button>
            {showAdd && (
              <Button type="default" icon={<PlusOutlined />} style={{ minWidth: 100 }} onClick={onAdd}>
                新建
              </Button>
            )}
            {showExport && (
              <Button icon={<ExportOutlined />} style={{ minWidth: 100 }} onClick={onExport}>
                导出
              </Button>
            )}
          </Space>
        </Col>
      </Row>
    </Card>
  );
};

export default SearchForm;
