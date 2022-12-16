import ajax from './ajax';

// const { cookie } = JSON.parse(window.localStorage.getItem('login_data'));

// 手机登录
// export const reqPhoneLogin = () => ajax('/login/cellphone?');

// reqPhoneLogin();

// console.log(cookie);
// 游客登录
export const reqAnonimousLogin = () => ajax('/register/anonimous');

// 获取用户信息
export const reqUserInfo = () => ajax(`/user/subcount?cookie=${cookie}`);

//获取每日推荐
export const reqRecommendMusic = () => ajax(`/recommend/songs?cookie=${cookie}`);

// reqRecommendMusic();

// 检查音乐是否可用
export const reqCheckMusic = () => ajax(`/song/url?id=1989132518&cookie=${cookie}`);
// reqCheckMusic();
