import { createRouter, createWebHistory } from 'vue-router';
import TodoList from '../components/TodoList.vue';
import TodoEdit from '../components/TodoEdit.vue';

import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/edit/:id',
    component: TodoEdit,
    props: true
  },
  { path: '/', component: TodoList },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
