<template>
  <div class="todo-item">
    <div class="todo-left">
      <input type="checkbox" v-model="todo.completed" @change="toggleCompletion" />
      <span :class="{ completed: todo.completed }">{{ todo.text }}</span>
    </div>
    <button @click="$emit('deleteTodo', todo.id)" class="delete-btn">Delete</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { Todo } from '../types/todo';

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
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #ecf0f1;
}

.todo-left {
  display: flex;
  align-items: center;
}

input[type="checkbox"] {
  margin-right: 10px;
}

span {
  font-size: 16px;
}

.completed {
  text-decoration: line-through;
  color: #7f8c8d;
}

.delete-btn {
  background-color: #e74c3c;
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 14px;
}

.delete-btn:hover {
  background-color: #c0392b;
}
</style>
