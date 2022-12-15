<template>
  <div class="my-app">
    <router-view></router-view>
    <h1>Audio Card</h1>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inconsolata&display=swap');

.my-app {
  margin: 24px auto;
  display: grid;
  justify-content: center;
  row-gap: 16px;
}

h1 {
  text-align: center;
  font-size: 16px;
  font-weight: normal;
  color: #b6b4b4f1;
  font-family: 'Reem Kufi', 'Noto Sans SC', sans-serif;
}
</style>
