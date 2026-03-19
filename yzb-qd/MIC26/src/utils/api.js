// API请求封装

// 基础URL
const BASE_URL = import.meta.env.VITE_REACT_APP_API_URL || '';

// 请求超时时间
const TIMEOUT = 30000;

// 请求重试次数
const RETRY_COUNT = 3;

// 创建请求实例
class API {
  constructor() {
    this.baseURL = BASE_URL;
    this.timeout = TIMEOUT;
    this.token = localStorage.getItem('token');
    this.retryCount = RETRY_COUNT;
    this.requestInterceptors = [];
    this.responseInterceptors = [];
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

  // 添加请求拦截器
  addRequestInterceptor(interceptor) {
    this.requestInterceptors.push(interceptor);
  }

  // 添加响应拦截器
  addResponseInterceptor(interceptor) {
    this.responseInterceptors.push(interceptor);
  }

  // 处理请求头
  getHeaders(headers = {}) {
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    // 添加认证token
    const token = this.getToken();
    if (token) {
      defaultHeaders['token'] = token;
    }

    return { ...defaultHeaders, ...headers };
  }

  // 处理请求
  async request(url, options = {}, retry = 0) {
    let { method = 'GET', headers, data, params } = options;

    // 应用请求拦截器
    for (const interceptor of this.requestInterceptors) {
      const result = interceptor({ url, method, headers, data, params });
      if (result) {
        ({ url, method, headers, data, params } = result);
      }
    }

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
        // 401未授权处理
        if (response.status === 401) {
          this.removeToken();
          // 可以在这里添加跳转到登录页的逻辑
        }

        // 500及以上服务器错误，尝试重试
        if (response.status >= 500 && retry < this.retryCount) {
          console.log(`请求失败，正在重试(${retry + 1}/${this.retryCount})...`);
          return this.request(url, options, retry + 1);
        }

        const errorData = await response.json().catch(() => ({}));
        const error = {
          status: response.status,
          message: errorData.message || '请求失败',
          data: errorData,
        };

        // 应用响应拦截器处理错误
        for (const interceptor of this.responseInterceptors) {
          const result = interceptor(null, error);
          if (result) {
            throw result;
          }
        }

        throw error;
      }

      // 解析响应数据
      const responseData = await response.json();

      // 应用响应拦截器处理成功响应
      for (const interceptor of this.responseInterceptors) {
        const result = interceptor(responseData, null);
        if (result) {
          return result;
        }
      }

      return responseData;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error.name === 'AbortError') {
        const timeoutError = { status: 408, message: '请求超时' };
        
        // 应用响应拦截器处理超时错误
        for (const interceptor of this.responseInterceptors) {
          const result = interceptor(null, timeoutError);
          if (result) {
            throw result;
          }
        }

        throw timeoutError;
      }

      // 网络错误，尝试重试
      if (!error.status && retry < this.retryCount) {
        console.log(`网络错误，正在重试(${retry + 1}/${this.retryCount})...`);
        return this.request(url, options, retry + 1);
      }

      // 应用响应拦截器处理其他错误
      for (const interceptor of this.responseInterceptors) {
        const result = interceptor(null, error);
        if (result) {
          throw result;
        }
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
    // 注意：当使用FormData时，浏览器会自动设置Content-Type为multipart/form-data
    const headers = {
      ...options.headers,
    };
    // 移除Content-Type，让浏览器自动设置
    delete headers['Content-Type'];
    return this.request(url, { ...options, method: 'POST', data: formData, headers });
  }

  // 下载文件
  async download(url, params, options = {}) {
    const response = await fetch(`${this.baseURL}${url}${params && Object.keys(params).length > 0 ? `?${new URLSearchParams(params).toString()}` : ''}`, {
      method: 'GET',
      headers: this.getHeaders({
        ...options.headers,
        'Content-Type': 'application/octet-stream',
      }),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw {
        status: response.status,
        message: errorData.message || '下载失败',
        data: errorData,
      };
    }

    // 获取文件名
    const contentDisposition = response.headers.get('content-disposition');
    let filename = options.filename || 'download';
    if (contentDisposition) {
      const matches = /filename="([^"]+)"/.exec(contentDisposition);
      if (matches && matches[1]) {
        filename = decodeURIComponent(matches[1]);
      }
    }

    // 创建下载链接
    const blob = await response.blob();
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(downloadUrl);

    return blob;
  }

  // 批量请求
  async batchRequests(requests) {
    const responses = await Promise.all(requests);
    return responses;
  }
}

// 创建API实例
const api = new API();

// 添加默认请求拦截器
api.addRequestInterceptor((config) => {
  // 可以在这里添加请求前的处理，如添加时间戳、签名等
  return config;
});

// 添加默认响应拦截器
api.addResponseInterceptor((response, error) => {
  if (error) {
    // 统一错误处理
    console.error('API请求错误:', error);
    console.error('错误详情:', error.data);
    // 可以在这里添加错误提示逻辑
  }
  return response || error;
});

// 导出API实例
export default api;

// 导出常用的HTTP方法
export const { get, post, put, delete: del, patch, upload, download, batchRequests } = api;
