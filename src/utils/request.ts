import axios from 'axios';
import type { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// 全局配置
axios.defaults.timeout = 30000; // 设置请求超时时间为30秒
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'; // 设置全局请求头
axios.defaults.withCredentials = false; // 禁用跨域请求时携带凭证

// 请求拦截器
axios.interceptors.request.use(
  (request: InternalAxiosRequestConfig) => {
    // 你可以在这里添加请求前的操作，例如添加token
    return request;
  },
  (error: AxiosError) => {
    console.error('请求失败，请稍后重试'); // 请求失败的错误处理
    return Promise.reject(error);
  }
);

// 响应拦截器
axios.interceptors.response.use(
  (response: AxiosResponse) => {
    // 在这里可以对响应数据进行处理
    return response.data; // 直接返回响应数据的data部分
  },
  (error: AxiosError) => {
    if (error.response) {
      const data = error.response.data;
      console.error('请求失败，请稍后重试：' + data); // 响应失败的错误处理
    } else {
      console.error('请求失败，请稍后重试:' + error); // 其他错误处理
    }
    return Promise.reject(error);
  }
);

export default axios;
