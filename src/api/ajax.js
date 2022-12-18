import axios from 'axios';

const instance = axios.create({
  // baseURL: 'https://netease-bd5k4ejc4-coderwx1.vercel.app',

  baseURL: 'http://localhost:3000/',
  timeout: 8000
});

instance.interceptors.request.use(function (config) {
  const { cookie } = JSON.parse(window.localStorage.getItem('login_data') || '{}');
  config.url += `&cookie=${cookie}`;
  return config;
});

// 添加响应拦截器
instance.interceptors.response.use(
  function (response) {
    console.log(response);
    if (response.data.code == 200) {
      return response.data;
    }
  },
  function (error) {
    console.log(error);
    return Promise.reject(error);
  }
);

export default instance;
