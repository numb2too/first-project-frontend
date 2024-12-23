
import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Home from '../views/Home.vue';
import FormQuery from '../views/FormQuery.vue';

const routes = [
  { path: '/', name: 'Login', component: Login },
  { path: '/home', name: 'Home', component: Home },
  { path: '/forms/:formName', name: 'FormQuery', component: FormQuery },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

