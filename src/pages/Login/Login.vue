<template>
  <div class="login-page">
    <div class="bg_img" :style="styleObject"></div>
    <Transition>
      <span class="tip" v-if="loginStatus" :style="{ backgroundColor: tipMsg.bgColor }">{{ tipMsg.text }}</span>
    </Transition>
    <div class="login-mode">
      <h2 class="">Hello</h2>
      <div class="login">
        <input type="text" class="phone comm" placeholder="请输入手机号码" v-model="phone" />
        <input type="passworld" class="passworld comm" placeholder="请输入验证码" v-model="captcha" />
        <button class="btn phone-login" @click="login">登录</button>
        <button class="btn anonimous_login" @click="getPhoneCaptcha">{{ sendCaptchaBtnText }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { reqPhoneLogin, reqPhoneCaptcha, reqVerifyePhoneCaptcha, reqLoginRefresh } from '@/api';
import localStorage from '@/tools/localStorage.js';

const { setItem, getItem } = localStorage();
const router = useRouter();
const loginStatus = $ref(false);
const imgList = [
  '19e165e754643e1e037ac179c5f183ce.png',
  'a57082c4353ba26293c5ec3e1301cceb.jpg',
  'f082e02195053a4265e8c8b3ace48b82.jpg',
  'bb0eaff8b56676ccfb19eea1bfdf6346.jpg',
  '2b0a52b3198afd45506d01db2d3dec2e.jpg'
];
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

let time = $ref(10);
let setIntervalId = null;
let flag = true;
async function getPhoneCaptcha() {
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
      time = 10;
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
  if (!verifyePhone()) return;
  if (verifyePhone() && !captcha) {
    getTipMsg({ msg: '请输入验证码' });
    return;
  }
  try {
    const { code, message } = await reqVerifyePhoneCaptcha({ phone, captcha });
    if (code == 200) {
      phoneLogin();
      return;
    }
    throw { message };
  } catch (err) {
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
    alert('登录失败', err_data);
  }
}

function loginSuccess(data) {
  setItem(`login_account_data`, data, true);
  getTipMsg({ msg: '登录成功，正在跳转', bgColor: '#07c160' });
  setTimeout(() => {
    router.replace({ path: '/home' });
  }, 3000);
}

function getTipMsg({ msg, bgColor = 'rgb(238 10 36)' }) {
  tipMsg.text = msg;
  tipMsg.bgColor = bgColor;
  loginStatus = true;
  timerId && clearTimeout(timerId);
  timerId = setTimeout(() => (loginStatus = false), 3000);
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

.login .btn {
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
.login .btn:active {
  opacity: 0.75;
  transform: scale(0.75);
}

.login .phone-login {
  margin: 18px 0 0 0;
  background: #3472f0;
}

.login .anonimous_login {
  background-color: #969090ab;
}
</style>
