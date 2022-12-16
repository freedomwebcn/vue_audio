import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://netease-bd5k4ejc4-coderwx1.vercel.app',
  timeout: 8000
});

instance.interceptors.request.use(function (config) {
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
    // return Promise.reject(error.message);
  }
);

export default instance;
