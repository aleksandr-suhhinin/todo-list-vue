<template>
  <div class="todo-list-container container">
    <div class="kanban-board">
      <!-- Hold Column -->
      <div class="kanban-column">
        <h3 class="text-center">Hold</h3>
        <div class="todo-column">
          <TodoItem
            v-for="todo in todosByStatus('hold')"
            :key="todo.id"
            :todo="todo"
            @editTodo="editTodo"
            @deleteTodo="deleteTodo"
            @toggleTodo="toggleTodoCompletion"
          />
        </div>
      </div>

      <!-- In Progress Column -->
      <div class="kanban-column">
        <h3 class="text-center">In Progress</h3>
        <div class="todo-column">
          <TodoItem
            v-for="todo in todosByStatus('inProgress')"
            :key="todo.id"
            :todo="todo"
            @editTodo="editTodo"
            @deleteTodo="deleteTodo"
            @toggleTodo="toggleTodoCompletion"
          />
        </div>
      </div>

      <!-- Testing Column -->
      <div class="kanban-column">
        <h3 class="text-center">Testing</h3>
        <div class="todo-column">
          <TodoItem
            v-for="todo in todosByStatus('testing')"
            :key="todo.id"
            :todo="todo"
            @editTodo="editTodo"
            @deleteTodo="deleteTodo"
            @toggleTodo="toggleTodoCompletion"
          />
        </div>
      </div>

      <!-- Completed Column -->
      <div class="kanban-column">
        <h3 class="text-center">Completed</h3>
        <div class="todo-column">
          <TodoItem
            v-for="todo in todosByStatus('completed')"
            :key="todo.id"
            :todo="todo"
            @editTodo="editTodo"
            @deleteTodo="deleteTodo"
            @toggleTodo="toggleTodoCompletion"
          />
        </div>
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

    const todosByStatus = (status: TodoStatus) => {
      return todos.value.filter((todo) => todo.status === status);
    };

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
      todosByStatus
    };
  },
});
</script>

<style scoped>
.todo-list-container {
  padding: 20px;
}

.kanban-board {
  display: flex;
  justify-content: space-between;
  gap: 20px; /* Расстояние между колонками */
}

.kanban-column {
  width: 300px; /* Фиксированная ширина колонок */
  background-color: #f8f9fa;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.todo-column {
  min-height: 400px;
}

h3 {
  margin-bottom: 20px;
}

.todo-item {
  margin-bottom: 10px;
}
</style>
