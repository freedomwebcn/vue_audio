<template>
  <div class="login-page">
    <div class="bg_img"></div>

    <Transition>
      <span class="tip" v-if="loginStatus">欢迎回来</span>
    </Transition>

    <div class="login-mode">
      <h2 class="">Hello</h2>
      <div class="login">
        <input type="text" class="phone comm" placeholder="请输入手机号码" />
        <input type="passworld" class="passworld comm" placeholder="请输入密码" />

        <button class="btn phone-login">登录</button>
        <button class="btn anonimous_login" @click="anonimousLogin">游客登录</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
// import { reqAnonimousLogin } from '@/api';
import localStorage from '@/tools/localStorage.js';

const { setItem } = localStorage();
const router = useRouter();
const loginStatus = $ref(false);
async function anonimousLogin() {
  try {
    // const data = await reqAnonimousLogin();
    const data = 'fglkdfgkfkgfggh';
    loginSuccess(data);
  } catch (err) {
    alert('登录失败', err);
  }
}

function loginSuccess(data) {
  setItem('token', data);
  loginStatus = true;
  setTimeout(() => {
    router.replace({ path: '/home' });
  }, 2000);
}
</script>

<style scoped>
.login-page {
  width: 300px;
  height: 566px;
  margin: 58px auto;
  position: relative;
  overflow: hidden;
}

.tip {
  position: absolute;
  z-index: 999;
  top: 0;
  width: 100%;
  padding: 6px 0;
  text-align: center;
  background: #6ce036c4;
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
  background: url(./img/01.png) top center;
  background-size: cover;
  opacity: 0.5;
}

.login-mode {
  display: flex;
  flex-wrap: wrap;
  padding: 50% 50px 0px 50px;
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  align-items: baseline;
  flex-direction: column;
  background-color: rgba(0, 0, 0, 0.6);
}
.login-mode h2 {
  font-size: 30px;
  color: white;
}

.login {
  display: grid;
  grid-template-columns: 100%;
  width: 100%;
  row-gap: 25px;
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
  padding: 5px;
  border: none;
  border-color: transparent;
  color: rgb(241, 241, 241);
  border-radius: 3px;
  background: transparent;
  font-size: 15px;
  font-weight: 500;
  font-family: 'Noto Serif SC', serif !important;
  transition: 0.5s;
  user-select: none;
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
