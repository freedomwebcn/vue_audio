<template>
  <div class="login-page">
    <div class="bg_img" :style="styleObject"></div>
    <Transition>
      <span class="tip" v-if="tipStatus" :style="{ backgroundColor: tipMsg.bgColor }">{{ tipMsg.text }}</span>
    </Transition>
    <div class="login-mode">
      <h2 class="">Hello</h2>
      <!-- 手机登录 -->
      <!-- <div class="login">
        <input type="text" class="phone comm" placeholder="请输入手机号码" v-model="phone" />
        <input type="passworld" class="passworld comm" placeholder="请输入验证码" v-model="captcha" />
        <button class="btn phone-login" @click="login">
          <span v-if="!loadingStatus">登录</span>
          <div v-else class="va-progress-circle va-progress-circle--indeterminate va-button__loader" style="width: 16px; height: 16px">
            <svg class="va-progress-circle__wrapper" viewBox="0 0 40 40">
              <circle
                class="va-progress-circle__overlay"
                cx="50%"
                cy="50%"
                r="18.5"
                fill="none"
                stroke="#FFFFFF"
                stroke-width="7.5%"
                stroke-dasharray="116.23892818282235"
                stroke-dashoffset="116.23892818282235"
              ></circle>
            </svg>
          </div>
        </button>
        <button class="btn send_captcha-btn" @click="getPhoneCaptcha">{{ sendCaptchaBtnText }}</button>
      </div> -->
      <!-- 二维码登录 -->
      <div class="qr_login">
        <img :src="qrUrl" alt="" />
        <p>
          使用
          <span>网易云音乐APP</span>
          扫码登录
        </p>
        <!-- <button class="btn" @click="qrLogin">二维码登录</button> -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { reqQRKey, reqQRInfoByKey, reqCheckQRStatusByKey, reqPhoneLogin, reqPhoneCaptcha, reqVerifyePhoneCaptcha, reqLoginRefresh } from '@/api';
import localStorage from '@/tools/localStorage.js';

const { setItem, getItem } = localStorage();
const router = useRouter();
const tipStatus = $ref(false);
const imgList = ['19e165e754643e1e037ac179c5f183ce.png', 'a57082c4353ba26293c5ec3e1301cceb.jpg', 'bb0eaff8b56676ccfb19eea1bfdf6346.jpg', '2b0a52b3198afd45506d01db2d3dec2e.jpg'];
let currentBgUrl = '';
const styleObject = $ref({});
let currentBgIndex = parseInt(getItem('index'));
const phone = $ref();
const captcha = $ref();
const tipMsg = $ref({
  text: '',
  bgColor: ''
});
let timerId;
const sendCaptchaBtnText = $ref('发送验证码');
const loadingStatus = $ref(false);

if (currentBgIndex >= 0) {
  currentBgIndex = currentBgIndex >= imgList.length - 1 ? 0 : ++currentBgIndex;
  currentBgUrl = imgList[currentBgIndex];
  setStyleObject();
  setItem('index', currentBgIndex);
} else {
  currentBgIndex = 0;
  currentBgUrl = imgList[currentBgIndex];
  setStyleObject();
  setItem('index', currentBgIndex);
}

function setStyleObject() {
  styleObject = {
    background: `url(https://pan.whgpc.com/view.php/${currentBgUrl})  center top / cover`
  };
}

async function qrLogin() {
  let key;
  try {
    const { code, data } = await reqQRKey();
    if (code == 200) {
      key = data.unikey;
      getQRInfoByKey(key);
    } else {
      throw { code };
    }
  } catch (err) {
    console.log(err.code);
  }
}
qrLogin();

let qrUrl = $ref('https://i.postimg.cc/7L5x03LY/02.webp');
async function getQRInfoByKey(key) {
  try {
    const { code, data } = await reqQRInfoByKey({ key });
    if (code == 200) {
      qrUrl = data.qrimg;
      checkQRStatusByKey(key);
    } else {
      throw { code };
    }
  } catch (err) {
    console.log('获取二维码详情失败', err.code);
  }
}

// 轮询接口 检测扫码状态
async function checkQRStatusByKey(key) {
  let timerId;
  timerId = setInterval(async () => {
    const qrStatus = await reqCheckQRStatusByKey({ key });
    if (qrStatus.code === 800) {
      qrLogin(); //二维码过期 重新获取二维码
      console.log('二维码已过期');
      clearInterval(timerId);
    }

    // 这一步会返回cookie
    if (qrStatus.code === 803) {
      clearInterval(timerId);
      loginSuccess(qrStatus.cookie);
    }
  }, 3000);
}

let time = $ref(60);
let setIntervalId = null;
let flag = true;

async function getPhoneCaptcha() {
  console.log('test');
  if (!verifyePhone()) return;
  if (!flag) return;
  flag = false;
  sendCaptchaBtnText = `重新发送验证码(${time})`;
  setIntervalId = setInterval(() => {
    time--;
    if (time < 0) {
      flag = true;
      clearInterval(setIntervalId);
      sendCaptchaBtnText = '发送验证码';
      time = 60;
      return;
    }
    sendCaptchaBtnText = `重新发送验证码(${time})`;
  }, 1000);

  try {
    const { code, message } = await reqPhoneCaptcha({ phone });
    if (code == 200) {
      getTipMsg({ msg: '验证码发送成功，请及时查看', bgColor: '#07c160' });
    } else {
      throw { message };
    }
  } catch (err) {
    getTipMsg({ msg: err.message });
  }
}

function verifyePhone() {
  if (!phone) {
    getTipMsg({ msg: '请先输入手机号' });
    return false;
  } else if (phone && phone.length != 11) {
    getTipMsg({ msg: '请输入11位手机号码' });
    return false;
  }
  return true;
}

async function login() {
  if (!verifyePhone() || loadingStatus) return;
  if (verifyePhone() && !captcha) {
    getTipMsg({ msg: '请输入验证码' });
    return;
  }
  loadingStatus = true;
  try {
    const { code, message } = await reqVerifyePhoneCaptcha({ phone, captcha });
    if (code == 200) {
      phoneLogin();
      return;
    }
    throw { message };
  } catch (err) {
    loadingStatus = false;
    getTipMsg({ msg: err.message });
  }
}

async function phoneLogin() {
  try {
    const data = await reqPhoneLogin({ phone, captcha });
    if (data.code == 200) {
      loginSuccess(data);
      return;
    }
    throw data;
  } catch (err_data) {
    console.log(err_data);
    loadingStatus = false;
    alert('登录失败');
  }
}

function loginSuccess(data) {
  setItem(`login_account_data`, data, true);
  loadingStatus = false;
  getTipMsg({ msg: '登录成功，正在跳转', bgColor: '#07c160' });
  setTimeout(() => {
    router.replace({ path: '/home' });
  }, 3000);
}

function getTipMsg({ msg, bgColor = 'rgb(238 10 36)' }) {
  console.log('test tipmsg');
  tipMsg.text = msg;
  tipMsg.bgColor = bgColor;
  tipStatus = true;
  timerId && clearTimeout(timerId);
  timerId = setTimeout(() => (tipStatus = false), 3000);
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@500&display=swap');
.login-page {
  width: 300px;
  height: 566px;
  position: relative;
  overflow: hidden;
  border-radius: 5px;
  box-shadow: 0px 8px 28px -9px rgb(0 0 0 / 45%);
}

.tip {
  position: absolute;
  z-index: 999;
  top: 0;
  width: 100%;
  padding: 6px 0;
  text-align: center;
  /* background: rgb(238 10 36); */
  font-size: 13px;
  color: white;
  font-family: 'Noto Serif SC', serif !important;
  /* will-change: transfrom; */
}

.v-enter-active,
.v-leave-active {
  transform: translateY(0);
  transition: all 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: translateY(-100%);
}

.bg_img {
  position: relative;
  width: 100%;
  height: 100%;
  /* background: url() top center; */
  background-size: cover;
  opacity: 0.8;
}

.login-mode {
  display: flex;
  flex-wrap: wrap;
  padding: 23% 26px 0px 26px;
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  align-items: baseline;
  flex-direction: column;
  background-color: rgba(0, 0, 0, 0.6);
}
.login-mode h2 {
  margin: 20px 0;
  font-size: 30px;
  color: white;
  font-family: 'Montserrat', sans-serif;
}

.login {
  display: grid;
  grid-template-columns: 100%;
  width: 100%;
  row-gap: 25px;
  padding-top: 68px;
  border-color: white;
}

.login .comm {
  border: none;
  outline: none;
  color: white;
  font-size: 16px;
  padding: 5px;
  border-bottom: 1px solid #c4c6cc;
  background: none;
  font-family: 'Noto Serif SC', serif !important;
}

.login .comm::placeholder {
  color: #c0c3c9;
  font-size: 15px;
}
.login .phone {
  margin: 10px 0 0 0;
}

.login .passworld {
}

.login-mode .btn {
  padding: 7px;
  border: none;
  border-color: transparent;
  color: rgb(241, 241, 241);
  border-radius: 3px;
  background: transparent;
  font-size: 15px;
  font-weight: 500;
  font-family: 'Noto Serif SC', serif !important;
  transition: 0.5s;
}
.login-mode .btn:active {
  opacity: 0.75;
  transform: scale(0.75);
}

.login .phone-login {
  width: 248px;
  height: 31px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  margin: 18px 0 0 0;
  background: #3472f0;
}

.va-button__loader {
  width: 16px;
  height: 16px;
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.va-progress-circle__wrapper {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  margin: auto;
  transform: rotate(-90deg);
  display: flex;
  justify-content: center;
  align-items: center;
  animation: va-progress-circle__wrapper--indeterminate 2s linear infinite;
}

.va-progress-circle__overlay {
  animation: va-progress-circle__overlay--indeterminate 2s ease-in-out infinite;
  transition: all ease 2s;
}

@keyframes va-progress-circle__wrapper--indeterminate {
  to {
    transform: rotate(270deg);
  }
}

@keyframes va-progress-circle__overlay--indeterminate {
  0% {
    stroke-dasharray: 1, 125;
    stroke-dashoffset: 0;
  }

  50% {
    stroke-dasharray: 125, 125;
    stroke-dashoffset: -65px;
  }

  to {
    stroke-dasharray: 125, 125;
    stroke-dashoffset: -125px;
  }
}

.login .send_captcha-btn {
  background-color: #969090ab;
}

.qr_login {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding-top: 48px;
}

.qr_login .btn {
  width: 180px;
  height: 31px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #3472f0;
}
.qr_login img {
  width: 180px;
  height: 180px;
  margin-bottom: 25px;
}

.qr_login p {
  color: white;
}

.qr_login p span {
  color: rgb(248, 50, 50);
}
</style>
