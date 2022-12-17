<template>
  <div class="playlist-track_page">
    <h2>当前歌单歌曲</h2>
    <ul>
      <li v-for="track in tracks" :key="track.id" @click="$router.push(`/home?id=${track.id}&name=${track.name}`)">
        {{ track.name }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';

import { reqPlaylistTrack } from '@/api';

const route = useRoute();
const id = route.params.id;

const tracks = $ref([]);

async function getPlaylistTrack() {
  const { songs } = await reqPlaylistTrack({ id });
  songs.forEach((song) => {
    const { name, id } = song;
    tracks.push({ name, id });
  });
}
getPlaylistTrack();
</script>

<style scoped>
.playlist-track_page {
  width: 300px;
  height: 566px;
  overflow: hidden;
  overflow-y: scroll;
  border-radius: 5px;
  box-shadow: 0px 8px 28px -9px rgb(0 0 0 / 45%);
  background-color: #030303;

  padding: 10px;
}

h2 {
  color: white;
  font-size: 18px;
  font-weight: 700;
}

li {
  color: white;
}
</style>
