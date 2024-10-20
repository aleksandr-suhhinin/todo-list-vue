<template>
  <div class="todo-list-container container">
    <h1 class="mb-4">Todo List</h1>
    <div class="mb-3 mx-3">
      <div class="input-container">
        <input v-model="newTodo" @keyup.enter="addTodo" placeholder="Add a new todo" />
        <button @click="addTodo" class="btn btn-primary">Add</button>
      </div>
    </div>
    <div class="mb-3">
      <div v-if="filteredTodos.length > 0" class="todos-container">
        <TodoItem
          v-for="todo in filteredTodos"
          :key="todo.id"
          :todo="todo"
          @editTodo="editTodo"
          @deleteTodo="deleteTodo"
          @toggleTodo="toggleTodoCompletion"
        />
      </div>
      <div v-else class="no-todos">No todos found.</div>
    </div>
    <div class="mb-3">
      <div class="filters">
        <button @click="filterTodos('all')" :class="{ 'btn btn-primary' : filter === 'all',  'btn btn-secondary' : filter !== 'all'}">All</button>
        <button @click="filterTodos('active')" :class="{ 'btn btn-primary' : filter === 'active',  'btn btn-secondary' : filter !== 'active' }">Active</button>
        <button @click="filterTodos('completed')" :class="{ 'btn btn-primary' : filter === 'completed',  'btn btn-secondary' : filter !== 'completed' }">Completed</button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import TodoItem from './TodoItem.vue';
import { useTodoStore } from '../stores/todoStore';
import { TodoStatus, type Todo } from '../types/todo';
import { db } from '../utils/db';

export default defineComponent({
  name: 'TodoList',
  components: { TodoItem },
  setup() {
    const todoStore = useTodoStore();
    const router = useRouter();
    const newTodo = ref('');
    const todos = ref<Todo[]>([]);
    const filter = ref<'all' | 'active' | 'completed'>('all');

    onMounted(async () => {
      if (todoStore.todos.length === 0) {
        await todoStore.loadTodos();
      }
      todos.value = todoStore.todos;
    });


    const editTodo = (id: number) => {
      router.push(`/edit/${id}`);
    };

    const addTodo = async () => {
      if (newTodo.value.trim()) {
        const newTodoItem: Todo = {
          id: Date.now(),
          title: newTodo.value,
          completed: false,
          text: '',
          createDate: new Date(),
          status: TodoStatus.Hold,
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
      editTodo,
      deleteTodo,
      toggleTodoCompletion,
      filteredTodos,
      filterTodos,
      filter,
    };
  },
});
</script>
<style scoped>
.todo-list-container {
  max-width: 600px;
  min-width: 600px;
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

</style>
