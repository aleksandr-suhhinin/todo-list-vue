<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script lang="ts">
import TodoList from './components/TodoList.vue';

export default {
  name: 'App',
  components: {
    TodoList,
  },
};
</script>
