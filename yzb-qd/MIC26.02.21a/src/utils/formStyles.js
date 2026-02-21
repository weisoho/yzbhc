// 表单样式常量 - 基于耗材质量问题记录界面的格式规范
export const FORM_STYLES = {
  // 页面布局
  page: {
    padding: '0 16px'
  },
  
  // 标题样式
  title: {
    marginBottom: 24
  },
  
  // 卡片样式
  card: {
    marginBottom: 16
  },
  
  // 表单布局
  form: {
    // 搜索表单（inline布局）
    search: {
      layout: 'inline',
      rowGutter: [16, 16],
      colResponsive: {
        xs: 24,
        sm: 12,
        md: 8,
        lg: 6
      }
    },
    
    // 编辑/新增表单（vertical布局）
    edit: {
      layout: 'vertical',
      rowGutter: 16,
      colSpan: 12, // 两列布局
      modalWidth: 800
    }
  },
  
  // 表格样式
  table: {
    size: 'small',
    pagination: {
      style: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: '16px'
      }
    }
  },
  
  // 间距规范
  spacing: {
    titleBottom: 24,
    cardBottom: 16,
    rowGutter: 16,
    colGutter: 16,
    paginationTop: 16,
    sectionBottom: 24
  },
  
  // 文本域
  textArea: {
    rows: 4
  }
};

// 响应式列配置生成器
export const getResponsiveColProps = (config = {}) => {
  const defaultConfig = FORM_STYLES.form.search.colResponsive;
  return {
    xs: config.xs || defaultConfig.xs,
    sm: config.sm || defaultConfig.sm,
    md: config.md || defaultConfig.md,
    lg: config.lg || defaultConfig.lg
  };
};

// 表单布局样式生成器
export const getFormLayoutStyle = (type = 'search') => {
  if (type === 'search') {
    return {
      layout: FORM_STYLES.form.search.layout,
      rowGutter: FORM_STYLES.form.search.rowGutter
    };
  } else {
    return {
      layout: FORM_STYLES.form.edit.layout,
      rowGutter: FORM_STYLES.form.edit.rowGutter
    };
  }
};

// 模态框配置
export const getModalConfig = () => ({
  width: FORM_STYLES.form.edit.modalWidth
});