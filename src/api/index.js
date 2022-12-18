import ajax from './ajax';

// 手机登录 不可用
// export const reqPhoneLogin = () => ajax('/login/cellphone?');

// 游客登录
export const reqAnonimousLogin = () => ajax('/register/anonimous');

// 私人FM 接口做了缓存 需要添加时间戳获取最新数据
export const reqPersonalFm = () => ajax(`/personal_fm?timestamp=${Date.now()}`);

// 根据音乐Id获取音乐播放地址
export const reqTrackUrl = ({ id }) => ajax(`/song/url/v1?id=${id}&level=standard`);

// 喜欢音乐
export const reqLikeMusic = ({ id, like }) => ajax(`/like?id=${id}&like=${like}&timestamp=${Date.now()}`);
