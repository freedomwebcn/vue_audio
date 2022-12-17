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
export const reqUserPlaylist = ({ uid }) => ajax({ url: `/user/playlist?uid=${uid}&cookie=${cookie}`, withCredentials: true });

// 获取歌单内所有歌曲
export const reqCheckMusic = () => ajax(`/song/url?id=1989132518&cookie=${cookie}`);

// 检查音乐是否可用
// 必选参数: id: 歌单 id
// 可选参数: limit: 限制获取歌曲的数量，默认值为当前歌单的歌曲数量
// 可选参数 : offset : 默认值为0
export const reqPlaylistTrack = ({ id }) => ajax(`/playlist/track/all?id=${id}&cookie=${cookie}`);

// 根据Id获取音乐地址
export const reqTrackUrl = ({ id }) => ajax(`/song/url/v1?id=${id}&level=standard&cookie=${cookie}`);
