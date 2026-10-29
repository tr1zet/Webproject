import { createRouter, createWebHashHistory } from 'vue-router';
import AboutPage from '../pages/AboutPage.vue';
import LoginPage from '../pages/LoginPage.vue';
import RegisterPage from '../pages/RegisterPage.vue';
import TodoPage from '../pages/TodoPage.vue';
import { useUserStore } from '../stores/user';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', redirect: { name: 'about' } },
    { path: '/login', name: 'login', component: LoginPage, meta: { guestOnly: true, title: 'Вход' } },
    { path: '/register', name: 'register', component: RegisterPage, meta: { guestOnly: true, title: 'Регистрация' } },
    { path: '/tasks', name: 'tasks', component: TodoPage, meta: { requiresAuth: true, title: 'Мои задачи' } },
    { path: '/about', name: 'about', component: AboutPage, meta: { title: 'О приложении' } },
    { path: '/:pathMatch(.*)*', redirect: { name: 'about' } }
  ],
  scrollBehavior: () => ({ top: 0 })
});

router.beforeEach((to) => {
  const userStore = useUserStore();

  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } };
  }

  if (to.meta.guestOnly && userStore.isAuthenticated) {
    return { name: 'tasks' };
  }

  return true;
});

router.afterEach((to) => {
  document.title = `${to.meta.title ?? 'To-Do'} — To-Do`;
});

export default router;
