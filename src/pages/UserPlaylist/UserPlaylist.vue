<template>
  <div class="playlist-page">
    <div class="card-profile">
      <div class="card-profile_visual">
        <div class="bg" :style="bgStyleObj"></div>
      </div>
      <img :src="profile.avatarUrl" alt="" class="avt_img" />
    </div>
    <div class="playlist">
      <div class="playlist-header">
        <span class="create-playlist">创建的歌单</span>
        <span class="collect-playlist">收藏的歌单</span>
      </div>
      <div class="playlist-content">
        <ul>
          <li v-for="item in createPlaylistData" :key="item.id" :data-id="item.id">
            <img :src="item.coverImgUrl" alt="" />
            <div>
              <h3>{{ item.name }}</h3>
              <p>{{ item.trackCount }}首，播放{{ item.playCount }}次</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reqUserAccountInfo, reqUserPlaylist } from '@/api';

const profile = $ref({});
let uid;
const createPlaylistData = $ref([]);
const collectPlaylistData = $ref([]);
const bgStyleObj = $ref();

async function getUserAccountInfo() {
  ({ profile } = await reqUserAccountInfo());
  uid = profile.userId;

  bgStyleObj = {
    background: `url(${profile.backgroundUrl}) top center`,
    backgroundSize: `cover`
  };
  getUserPlaylist();
}
getUserAccountInfo();

async function getUserPlaylist() {
  let { playlist } = await reqUserPlaylist({ uid });
  formatData(playlist);
}

function formatData(data) {
  data.forEach((playlist) => {
    if (playlist.userId == uid) {
      const { name, trackCount, coverImgUrl, playCount, id } = playlist;
      createPlaylistData.push({ name, trackCount, coverImgUrl, playCount, id });
    } else {
      const { name, trackCount, coverImgUrl, playCount, id } = playlist;
      collectPlaylistData.push({ name, trackCount, nickname: playlist.creator.nickname, coverImgUrl, playCount, id });
    }
  });
}
</script>

<style scoped>
.playlist-page {
  width: 300px;
  height: 566px;
  position: relative;
  overflow: hidden;
  overflow-y: scroll;
  border-radius: 5px;
  box-shadow: 0px 8px 28px -9px rgb(0 0 0 / 45%);
}

.card-profile {
  width: 100%;
  display: flex;
  justify-content: center;
  position: relative;
  background: #fff;
  border-radius: 10px;
  z-index: 1;
  box-shadow: 0 0 5px rgb(0 0 0 / 10%);
}

.card-profile_visual {
  width: 300px;
  height: 186px;
  overflow: hidden;
  position: relative;
  /* border-top-left-radius: 10px;
  border-top-right-radius: 10px; */
}
.card-profile_visual .bg {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 0;
  background: url(./01.png);
}

.avt_img {
  width: 64px;
  height: 64px;
  position: absolute;
  bottom: -32px;
  border-radius: 50%;
}

.playlist {
  padding: 43px 10px 0px 10px;
}

.playlist-header {
  display: flex;
  justify-content: space-between;
  padding: 0 15px;
  font-size: 14px;
}

.playlist-header .create-playlist {
  color: rgb(253, 57, 58);
}

.playlist-header .collect-playlist {
  color: rgb(50, 50, 50);
}
.playlist-content {
  padding: 15px 0 0 0;
  margin-bottom: 15px;
}
.playlist-content ul {
  display: grid;
  row-gap: 10px;
}

.playlist-content ul li {
  display: flex;
}

.playlist-content li img {
  width: 50px;
  height: 50px;
  margin-right: 10px;
  border-radius: 5px;
  object-fit: cover;
}

.playlist-content li div {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding: 5px 0;
}
.playlist-content li h3 {
  font-weight: normal;
  font-size: 15px;
  flex: 100%;
  white-space: nowrap;
  max-width: 216px;
  text-overflow: ellipsis;

  overflow: hidden;
}
.playlist-content li p {
  font-size: 12px;
  color: rgb(170, 170, 170);
}
</style>
