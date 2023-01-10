import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://netease-bd5k4ejc4-coderwx1.vercel.app',

  // baseURL: 'http://39.108.111.187:3000/',

  // baseURL: 'http://127.0.0.1:3000/',

  timeout: 8000
});

instance.interceptors.request.use(function (config) {
  const { cookie } = JSON.parse(window.localStorage.getItem('login_account_data') || '{}');
  config.url += cookie ? `&cookie=${encodeURIComponent(cookie)}` : '';
  return config;
});

// 添加响应拦截器
instance.interceptors.response.use(
  function (response) {
    console.log(response);
    if (response.data.code == 200) {
      return response.data;
    } else if (response.data.code == 400) {
      return response.data;
    }
  },
  function (error) {
    const { response } = error;
    if (response.data.code == 503) {
      return Promise.reject(response.data);
    }
    return Promise.reject(error);
  }
);

export default instance;
