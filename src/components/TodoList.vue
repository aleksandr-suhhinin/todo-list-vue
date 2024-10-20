<template>
  <div class="todo-list-container">
    <h1>Todo List</h1>
    <div class="input-container">
      <input v-model="newTodo" @keyup.enter="addTodo" placeholder="Add a new todo" />
      <button @click="addTodo" class="add-btn">Add</button>
    </div>
    <div v-if="filteredTodos.length > 0" class="todos-container">
      <TodoItem
        v-for="todo in filteredTodos"
        :key="todo.id"
        :todo="todo"
        @deleteTodo="deleteTodo"
        @toggleTodo="toggleTodoCompletion"
      />
    </div>
    <div v-else class="no-todos">No todos found.</div>
    <div class="filters">
      <button @click="filterTodos('all')" :class="{ active: filter === 'all' }">All</button>
      <button @click="filterTodos('active')" :class="{ active: filter === 'active' }">Active</button>
      <button @click="filterTodos('completed')" :class="{ active: filter === 'completed' }">Completed</button>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import TodoItem from './TodoItem.vue';
import { Todo } from '../types/todo';
import { db } from '../utils/db';

export default defineComponent({
  name: 'TodoList',
  components: { TodoItem },
  setup() {
    const newTodo = ref('');
    const todos = ref<Todo[]>([]);
    const filter = ref<'all' | 'active' | 'completed'>('all');

    onMounted(async () => {
      todos.value = await db.getAllTodos();
    });

    const addTodo = async () => {
      if (newTodo.value.trim()) {
        const newTodoItem: Todo = {
          id: Date.now(),
          text: newTodo.value,
          completed: false,
        };
        todos.value.push(newTodoItem);
        newTodo.value = '';
        const cleanTodo = JSON.parse(JSON.stringify(newTodoItem));
        await db.addTodo(cleanTodo);
      }
    };

    const deleteTodo = async (id: number) => {
      todos.value = todos.value.filter((todo) => todo.id !== id);
      await db.deleteTodo(id);
    };

  const toggleTodoCompletion = async (id: number) => {

    const todo = todos.value.find((todo) => todo.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      await db.updateTodo({...todo});
    }

  };


    const filteredTodos = computed(() => {
      if (filter.value === 'all') {
        return todos.value;
      }
      return todos.value.filter((todo) =>
        filter.value === 'completed' ? todo.completed : !todo.completed
      );
    });

    const filterTodos = (newFilter: 'all' | 'active' | 'completed') => {
      filter.value = newFilter;
    };

    return {
      newTodo,
      todos,
      addTodo,
      deleteTodo,
      toggleTodoCompletion,
      filteredTodos,
      filterTodos,
    };
  },
});
</script>
<style scoped>
.todo-list-container {
  max-width: 600px;
  margin: 50px auto;
  padding: 20px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

.input-container {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

input {
  width: 75%;
  padding: 10px;
  border: 2px solid #3498db;
  border-radius: 5px;
  font-size: 16px;
}

.add-btn {
  background-color: #3498db;
  color: white;
  margin-left: 10px;
}

.todos-container {
  margin-top: 20px;
  padding: 0 10px;
}

.no-todos {
  text-align: center;
  color: #7f8c8d;
}

.filters {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.filters button {
  background-color: #ecf0f1;
  color: #2c3e50;
  margin: 0 5px;
}

.filters button.active {
  background-color: #3498db;
  color: white;
}
</style>
