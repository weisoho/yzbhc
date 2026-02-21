// API请求封装

// 基础URL
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

// 请求超时时间
const TIMEOUT = 30000;

// 创建请求实例
class API {
  constructor() {
    this.baseURL = BASE_URL;
    this.timeout = TIMEOUT;
    this.token = null;
  }

  // 设置token
  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  // 获取token
  getToken() {
    if (!this.token) {
      this.token = localStorage.getItem('token');
    }
    return this.token;
  }

  // 移除token
  removeToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  // 处理请求头
  getHeaders(headers = {}) {
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    // 添加认证token
    const token = this.getToken();
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    return { ...defaultHeaders, ...headers };
  }

  // 处理请求
  async request(url, options = {}) {
    const { method = 'GET', headers, data, params } = options;

    // 构建完整URL
    let fullUrl = `${this.baseURL}${url}`;

    // 添加查询参数
    if (params && Object.keys(params).length > 0) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value);
        }
      });
      fullUrl += `?${searchParams.toString()}`;
    }

    // 构建请求配置
    const config = {
      method,
      headers: this.getHeaders(headers),
      credentials: 'include',
    };

    // 添加请求体
    if (data) {
      config.body = JSON.stringify(data);
    }

    // 创建请求超时控制
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);
    config.signal = controller.signal;

    try {
      // 发送请求
      const response = await fetch(fullUrl, config);
      clearTimeout(timeoutId);

      // 处理响应
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw {
          status: response.status,
          message: errorData.message || '请求失败',
          data: errorData,
        };
      }

      // 解析响应数据
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error.name === 'AbortError') {
        throw { status: 408, message: '请求超时' };
      }

      throw error;
    }
  }

  // GET请求
  get(url, params, options = {}) {
    return this.request(url, { ...options, method: 'GET', params });
  }

  // POST请求
  post(url, data, options = {}) {
    return this.request(url, { ...options, method: 'POST', data });
  }

  // PUT请求
  put(url, data, options = {}) {
    return this.request(url, { ...options, method: 'PUT', data });
  }

  // DELETE请求
  delete(url, params, options = {}) {
    return this.request(url, { ...options, method: 'DELETE', params });
  }

  // PATCH请求
  patch(url, data, options = {}) {
    return this.request(url, { ...options, method: 'PATCH', data });
  }

  // 上传文件
  upload(url, formData, options = {}) {
    const headers = {
      'Content-Type': 'multipart/form-data',
      ...options.headers,
    };
    return this.request(url, { ...options, method: 'POST', data: formData, headers });
  }

  // 下载文件
  async download(url, params, options = {}) {
    const response = await this.request(url, {
      ...options,
      method: 'GET',
      params,
      headers: {
        ...options.headers,
        'Content-Type': 'application/octet-stream',
      },
      responseType: 'blob',
    });

    // 创建下载链接
    const blob = new Blob([response]);
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = options.filename || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(downloadUrl);

    return response;
  }
}

// 创建API实例
const api = new API();

// 导出API实例
export default api;

// 导出常用的HTTP方法
export const { get, post, put, delete: del, patch, upload, download } = api;
