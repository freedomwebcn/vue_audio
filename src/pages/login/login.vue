<template>
  <div class="login-page">
    <div class="bg_img"></div>
    <span class="tip">66</span>

    <div class="login-mode">
      <h2 class="">Hello</h2>
      <div class="login">
        <input type="text" class="phone comm" placeholder="请输入手机号" />
        <input type="text" class="passworld comm" placeholder="请输入密码" />

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
// const tips = $ref('');
async function anonimousLogin() {
  try {
    // const data = await reqAnonimousLogin();
    const data = 'fglkdfgkfkgfggh';
    setItem('token', data);
    tips = '登录成功，正在跳转！';
    setTimeout(() => {
      router.replace({ path: '/home' });
    }, 1000);
  } catch (err) {
    console.log(err);
  }
}
</script>

<style scoped>
.login-page {
  width: 300px;
  height: 566px;
  margin: 58px auto;
  position: relative;
}

.tip {
  position: absolute;
  /* top: 0; */
}

.bg_img {
  position: relative;
  width: 100%;
  height: 100%;
  /* background: url(/01) top center; */
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
}

.login .comm {
  border: none;
  outline: none;
  color: white;
  font-size: 16px;
  padding: 5px;
  border-bottom: 1px solid #b0b3b9;
  background: none;
  font-family: 'Noto Serif SC', serif !important;
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
}

.login .phone-login {
  margin: 18px 0 0 0;
  background: #3472f0;
}

.login .anonimous_login {
  background-color: #969090ab;
}
</style>
