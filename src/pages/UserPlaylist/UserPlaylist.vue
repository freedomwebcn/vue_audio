<template>
  <div class="playlist-page">
    <div class="card-profile">
      <div class="card-profile_visual">
        <div class="bg" :style="bgStyleObj"></div>
      </div>
      <div class="card-profile_user-infos">
        <span class="infos_name comm">jack</span>
        <span class="infos_last-login-address comm">最后登陆地址:陕西</span>
        <img :src="profile.avatarUrl" alt="" class="avt_img" />
      </div>
    </div>

    <div class="playlist">
      <div class="playlist-header">
        <span class="create-playlist">创建的歌单</span>
        <span class="collect-playlist">收藏的歌单</span>
      </div>

      <div class="playlist-content">
        <ul>
          <li v-for="item in createPlaylistData" :key="item.id">
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
      collectPlaylistData.push({ name, trackCount, coverImgUrl, playCount, id });
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

  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}
.card-profile_visual .bg {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 0;
  background: url(./01.png);
}

.card-profile_user-infos {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  position: absolute;
  z-index: 3;

  margin: auto;
  top: calc(60% - 26px);
  color: #fff;
  text-align: center;
}

.card-profile_user-infos .comm {
  flex: 100%;
}

.card-profile_user-infos .infos_name {
  padding-bottom: 9px;
}

.infos_last-login-address {
  font-size: 14px;
  padding-bottom: 12px;
}

.card-profile_user-infos .avt_img {
  width: 64px;
  height: 64px;
  border-radius: 50%;
}

.playlist {
  padding: 56px 10px 0px 10px;
}

.playlist-header {
  display: flex;
  justify-content: space-between;
  padding: 0 15px;
}

.playlist-header .create-playlist {
  color: rgb(253, 57, 58);
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
  margin-right: 15px;
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
  font-size: 13px;
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
