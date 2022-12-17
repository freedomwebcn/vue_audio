import Home from '@/pages/Home/Home.vue';
import Login from '@/pages/Login/Login.vue';
import UserPlaylist from '@/pages/UserPlaylist/UserPlaylist.vue';
import PlaylistTrack from '@/pages/PlaylistTrack/PlaylistTrack.vue';

const routes = [
  {
    path: '/',
    redirect: {
      name: 'Home'
    }
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/Login',
    name: 'Login',
    component: Login
  },
  {
    path: '/UserPlaylist',
    name: 'UserPlaylist',
    component: UserPlaylist
  },
  {
    path: '/PlaylistTrack/:id',
    name: 'PlaylistTrack',
    component: PlaylistTrack
  }
];

export default routes;
