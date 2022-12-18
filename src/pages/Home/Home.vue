<template>
  <div class="playerUi" :class="{ playing: playStatus }">
    <div class="image" :style="bgStyleObj"></div>
    <div class="wave"></div>
    <div class="wave"></div>
    <div class="wave"></div>
    <div class="container">
      <div class="s-name-box" ref="sNameBoxRef">
        <i class="l-bg" :class="{ 'l-bg-zindex': animationStatus }"></i>
        <div class="s-name" :class="{ add_animation: animationStatus }">
          <span class="name text" ref="textRef">{{ nameText }}</span>
          <span class="name" ref="text2Ref"></span>
        </div>
        <i class="r-bg" ref="rBgRef"></i>
      </div>

      <div class="player__controls">
        <div class="player__times">
          <div class="player__time player__time--current">{{ currentTime }}</div>
          <div class="player__time player__time--duration">{{ duration }}</div>
        </div>
        <div class="controls__footer">
          <span class="prevBtn button iconfont" :class="{ 'icon-love': likeMusicStatus, 'icon-aixin-xian': !likeMusicStatus }" @click="likeMusicDebounced"></span>
          <span class="playBtn button zmdi" @click="playAudio" :class="{ 'zmdi-play-circle': !playStatus, 'zmdi-pause-circle': playStatus }"></span>
          <span class="nextBtn button zmdi zmdi-skip-next" @click="nextPlayThrottled"></span>
        </div>
      </div>
      <audio id="audio" ref="audio" @loadedmetadata="loadedMetaData" @pause="pause" @ended="ended" @waiting="waiting" @playing="playing" @canplay="canplay"></audio>
    </div>
  </div>
</template>

<script setup>
import { nextTick } from 'vue';
import { throttle, debounce } from 'lodash';
import { reqPersonalFm, reqTrackUrl, reqLikeMusic } from '@/api';

const audio = $ref();
const duration = $ref('0:00');
const currentTime = $ref('0:00');
const playStatus = $ref(false);
const nameText = $ref('');
const sNameBoxRef = $ref();
const textRef = $ref();
const text2Ref = $ref();
const rBgRef = $ref();
const animationStatus = $ref(false);
let index = 0;
let timerId = null;
const tracks = $ref([]);
const bgStyleObj = $ref({});
let trackCount;

const likeMusicStatus = $ref(false);

async function getPersonalFm() {
  try {
    const { data, code } = await reqPersonalFm();
    if (code == 200) {
      data.forEach((trackObj) => {
        const { name, duration } = trackObj;
        const { id } = trackObj.privilege;
        const { picUrl } = trackObj.album;
        tracks.push({ name, duration, trackId: id, picUrl });
      });
      loadTrack(index);
    } else {
      throw data;
    }
  } catch (error) {
    console.log(err, '音频数据请求失败');
  }

  trackCount = tracks.length;
}
getPersonalFm();

function formatTime(s) {
  return (s - (s %= 60)) / 60 + (9 < s ? ':' : ':0') + s;
}
async function loadTrack(id) {
  console.log('load...');
  timerId && clearTimeout(timerId);
  likeMusicStatus = false;
  audio.src = '';
  bgStyleObj = {
    background: `url(${tracks[id].picUrl}) 75% center / cover no-repeat`
  };
  audio.src = await getTrackUrl(tracks[id].trackId);
  nameText = tracks[id].name;
  await nextTick();
  isAddAnimation(id);
}

async function getTrackUrl(id) {
  try {
    const { code, data } = await reqTrackUrl({ id });
    if (code == 200) {
      return data[0].url;
    }
    throw code;
  } catch (err) {
    console.log(err, '当前音乐获取播放地址失败');
    nextPlay();
  }
}

const likeMusicDebounced = debounce(likeMusic, 500, {
  leading: true
});

async function likeMusic() {
  likeMusicStatus = !likeMusicStatus;
  try {
    const data = await reqLikeMusic({
      id: tracks[index].trackId,
      like: likeMusicStatus
    });
    const statusMsg = likeMusicStatus ? '喜欢成功' : '取消喜欢成功';
    if (data.code == 200) {
      console.log(statusMsg);
      return;
    }
    throw data;
  } catch (err) {
    likeMusicStatus = false;
    console.log('喜欢音乐接口调用失败', err);
  }
}

function playAudio() {
  if (playStatus) {
    audio.pause();
    playStatus = false;
    return;
  }
  audio.play();
}

function nextPlay() {
  currentTime = '0:00';
  console.log('next...');
  if (index + 1 < trackCount) {
    index++;
  } else {
    console.log('超过了');
    tracks.length = 0;
    index = 0;
    audio.pause();
    getPersonalFm();
    return;
  }

  loadTrack(index);
}

function canplay() {
  console.log(playStatus);
  playStatus && audio.play();
}

const nextPlayThrottled = throttle(nextPlay, 800, {
  trailing: false
});

function getcurrentTime() {
  timerId = setTimeout(() => {
    console.log('currentTime start...');
    currentTime = formatTime(Math.round(audio.currentTime));
    getcurrentTime();
  }, 1000);
}

function loadedMetaData() {
  duration = formatTime(Math.round(audio.duration));
}

function pause() {
  currentTime = formatTime(Math.round(audio.currentTime));
  console.log('pause...');
  clearTimeout(timerId);
}

async function playing() {
  playStatus = true;
  getcurrentTime();
  console.log('因缺少数据而暂停或延迟的状态已结束，正准备播放...');
}

function waiting() {
  playStatus = false;
  clearTimeout(timerId);
  console.log('因暂时性缺少数据，播放暂停。');
}

function ended() {
  setTimeout(() => {
    nextPlay();
  }, 1000);
  console.log('play end');
}

function isAddAnimation(id) {
  animationStatus = false;
  text2Ref.innerHTML = ``;
  if (textRef.clientWidth > sNameBoxRef.clientWidth) {
    rBgRef.style.zIndex = 6;
    text2Ref.innerHTML = tracks[id].name;
    setTimeout(() => {
      animationStatus = true;
    }, 1000);
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inconsolata&display=swap');
.playerUi {
  position: relative;
  display: flex;
  justify-content: center;
  width: 300px;
  height: 566px;
  background-color: white;
  overflow: hidden;
  /* margin: 24px auto; */
  border-radius: 5px;
  user-select: none;
  box-shadow: 0px 8px 28px -9px rgb(0 0 0 / 45%);
}

.playerUi .wave {
  position: absolute;
  height: 750px;
  width: 750px;
  opacity: 0.6;
  left: 0;
  top: 0;
  margin-left: -72%;
  margin-top: -131%;
  border-radius: 40%;
  background: radial-gradient(#353535, #383737);
}

.wave:nth-child(2),
.wave:nth-child(3) {
  top: 10px;
}

.playing .wave {
  border-radius: 40%;
  animation: wave_move 3000ms infinite linear;
}

.wave {
  border-radius: 40%;
  animation: wave_move 55s infinite linear;
}

.playing .wave:nth-child(2) {
  animation-duration: 4000ms;
}

.wave:nth-child(2) {
  animation-duration: 50s;
}

.playing .wave:nth-child(3) {
  animation-duration: 5000ms;
}

.wave:nth-child(3) {
  animation-duration: 45s;
}

.playerUi .image {
  /* background: url('http://static1.squarespace.com/static/530b728de4b04fc9b23a5988/t/569880381a5203aa7d44c1a8/1452834873397/00.jpg?format=1000w') no-repeat 75%; */
  /* background-size: cover; */
  position: absolute;
  z-index: 1;
  opacity: 0.3;
  height: 300px;
  width: 300px;
  filter: grayscale(100%);
}

.playerUi .image::after {
  height: 100px;
  content: '';
  top: 200px;
  position: absolute;
  width: 100%;
  z-index: 1;
  background: linear-gradient(rgba(9, 2, 4, 0), #444);
}

@keyframes wave_move {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.container {
  width: 100%;
  position: absolute;
  bottom: 0;
  padding: 10px;
}

.s-name-box {
  position: relative;
  overflow: hidden;
  height: 34px;
  width: 50%;
  display: flex;
  margin-left: 6px;
}

.s-name {
  display: flex;
  height: 34px;
  width: auto;
  line-height: 34px;
  white-space: nowrap;
  margin-left: 10px;
  font-size: 16px;
  font-family: 'Reem Kufi', 'Noto Sans SC', sans-serif;
  color: #4b4a4a;
}

.s-name-box .add_animation {
  animation: move linear 16s infinite;
}

.name {
  padding-right: 20px;
  letter-spacing: 1px;
}

.text {
  width: auto;
}

.s-name-box .l-bg {
  position: absolute;
  height: 100%;
  width: 21px;
  z-index: -1;
  background-image: linear-gradient(-90deg, transparent 0%, #fff 69%);
}

.s-name-box .l-bg-zindex {
  z-index: 6;
}

.s-name-box .r-bg {
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  width: 21px;
  z-index: -1;
  background-image: linear-gradient(90deg, transparent 0%, #fff 60%);
}

@keyframes move {
  0% {
    transform: translateX(0);
  }

  100% {
    transform: translateX(-50%);
  }
}

.player__controls {
  display: flex;
  width: 100%;
  flex-wrap: wrap;
}

.player__times {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  font-size: 14px;
  color: rgb(179, 179, 179);
  font-family: 'Inconsolata', 'Noto Sans SC', sans-serif;
  margin-right: 17px;
}

.player__time--duration {
  margin-left: 8px;
}

.player__time--duration::before {
  content: '⁄';
  margin-right: 10px;
}

.controls__footer {
  flex: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  padding: 10px 0 10px 0;
  color: #4a5464;
}

.button {
  font-size: 40px;
  cursor: pointer;
  transition: 0.5s;
}

.button:active {
  opacity: 0.75;
  transform: scale(0.75);
}

.playBtn {
  margin: 0 80px;
  font-size: 50px;
}

.prevBtn {
  font-size: 29px;
  transition: all 0.15s linear;
}
.icon-love {
  color: #ff564c;
}

nextBtn {
}
</style>
