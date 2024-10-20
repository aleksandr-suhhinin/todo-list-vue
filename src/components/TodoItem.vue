<template>
  <div class="todo-item card">
    <div class="card-body">
      <h5 class="card-title">{{ todo.title }}</h5>
      <p class="card-text">{{ todo.text }}</p>
      <p class="card-subtitle mb-2 text-muted">Status: {{ todo.status }}</p>
      <div class="d-flex justify-content-between">
        <button @click="$emit('editTodo', todo.id)" class="btn btn-primary btn-sm">Edit</button>
        <button @click="$emit('deleteTodo', todo.id)" class="btn btn-danger btn-sm">Delete</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import type { Todo } from '../types/todo';

export default defineComponent({
  name: 'TodoItem',
  props: {
    todo: {
      type: Object as PropType<Todo>,
      required: true,
    },
  },
  methods: {
    toggleCompletion() {
      this.$emit('toggleTodo', this.todo.id);
    },
  },
});
</script>


<style scoped>
.todo-item {
  margin-bottom: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card {
  background-color: #ffffff;
}

.card-body {
  padding: 10px;
}

.card-title {
  font-size: 16px;
  font-weight: bold;
}

.card-text {
  font-size: 14px;
  color: #333333;
}

.d-flex {
  display: flex;
}

.justify-content-between {
  justify-content: space-between;
}
</style>
