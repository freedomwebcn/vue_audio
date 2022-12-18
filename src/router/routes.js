import Home from '@/pages/Home/Home.vue';
import Login from '@/pages/Login/Login.vue';

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
  }
];

export default routes;
