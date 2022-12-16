import ajax from './ajax';

const { cookie } = JSON.parse(window.localStorage.getItem('login_data') || '{}');

// 手机登录
// export const reqPhoneLogin = () => ajax('/login/cellphone?');

// 游客登录
export const reqAnonimousLogin = () => ajax('/register/anonimous');

// 获取用户账号信息
export const reqUserAccountInfo = () => ajax(`/user/account?cookie=${cookie}`);

//获取每日推荐音乐
export const reqRecommendMusic = () => ajax(`/recommend/songs?cookie=${cookie}`);

//获取用户歌单  参数 uid ：用户id
export const reqUserPlaylist = ({ uid }) => ajax(`/user/playlist?uid=${uid}&cookie=${cookie}`);

// 检查音乐是否可用
export const reqCheckMusic = () => ajax(`/song/url?id=1989132518&cookie=${cookie}`);
