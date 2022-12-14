import ajax from './ajax';

// 二维码登录 返回key值
export const reqQRKey = () => ajax(`/login/qr/key?timerstamp=${Date.now()}`);

// 根据返回的二维码 key 值 获取二维码base64 和 二维码信息
export const reqQRInfoByKey = ({ key }) => ajax(`/login/qr/create?key=${key}&qrimg=true&timerstamp=${Date.now()}`);

// 轮询此接口 检测二维码扫码状态
export const reqCheckQRStatusByKey = ({ key }) => ajax(`/login/qr/check?key=${key}&timerstamp=${Date.now()}`);

// 手机登录
export const reqPhoneLogin = ({ phone, captcha }) => ajax(`/login/cellphone?phone=${phone}&captcha=${captcha}`);

//发送手机验证码
export const reqPhoneCaptcha = ({ phone }) => ajax(`/captcha/sent?phone=${phone}`);

//验证手机登录验证码是否正确
export const reqVerifyePhoneCaptcha = ({ phone, captcha }) => ajax(`/captcha/verify?phone=${phone}&captcha=${captcha}`);

//刷新登录
export const reqLoginRefresh = () => ajax(`/user/account`);

// 每日推荐歌曲
export const reqRecommendSongs = () => ajax(`/recommend/songs`);

// 每日推荐歌单
export const reqRecommendPlaylist = () => ajax(`/recommend/resource`);

// 私人FM 接口做了缓存 需要添加时间戳获取最新数据
export const reqPersonalFm = () => ajax(`/personal_fm?timestamp=${Date.now()}`);

// 根据音乐Id获取音乐播放地址
export const reqTrackUrl = ({ id }) => ajax(`/song/url?id=${id}&br=128000`);

// 喜欢音乐
export const reqLikeMusic = ({ id, like }) => ajax(`/like?id=${id}&like=${like}&timestamp=${Date.now()}`);
