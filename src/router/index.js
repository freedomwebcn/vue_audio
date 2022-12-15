import { createRouter, createWebHistory } from 'vue-router';
import routes from '@/router/routes.js';

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach(async (to, from, next) => {
  const token = window.localStorage.getItem('token');
  if (token) {
    if (to.name == 'Login') {
      next({ name: 'Home' });
    } else {
      next();
    }
  } else if (to.name !== 'Login') {
    next({ name: 'Login' });
  } else {
    next();
  }
});

export default router;
