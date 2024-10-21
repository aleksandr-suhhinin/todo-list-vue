<template>
  <div class="todo-list-container container" v-if="!isLoading">
    <div class="header mb-4">
      <button
        @click="createNewTodo"
        class="btn btn-success create-todo-btn"
      >
        <Plus class="w-5 h-5" />
        <span>New Task</span>
      </button>
    </div>
    <div class="kanban-board">
      <!-- Hold Column -->
      <div class="kanban-column">
        <h3 class="text-center">Hold</h3>
        <div class="todo-column" id="hold">
          <draggable
            v-model="holdTodos"
            :group="{ name: 'tasks' }"
            item-key="id"
            class="dragArea">
            <template #item="{ element }">
              <div class="todo-item-wrapper" :id="element.id">
                <TodoItem
                  :todo="element"
                  @editTodo="editTodo"
                  @deleteTodo="deleteTodo"
                  @toggleTodo="toggleTodoCompletion"
                />
              </div>
            </template>
          </draggable>
        </div>
      </div>

      <!-- In Progress Column -->
      <div class="kanban-column">
        <h3 class="text-center">In Progress</h3>
        <div class="todo-column" id="inProgress">
          <draggable
            v-model="inProgressTodos"
            :group="{ name: 'tasks' }"
            item-key="id"
            class="dragArea">
            <template #item="{ element }">
              <div class="todo-item-wrapper" :id="element.id">
                <TodoItem
                  :todo="element"
                  @editTodo="editTodo"
                  @deleteTodo="deleteTodo"
                  @toggleTodo="toggleTodoCompletion"
                />
              </div>
            </template>
          </draggable>
        </div>
      </div>

      <!-- Testing Column -->
      <div class="kanban-column">
        <h3 class="text-center">Testing</h3>
        <div class="todo-column" id="testing">
          <draggable
            v-model="testingTodos"
            :group="{ name: 'tasks' }"
            item-key="id"
            class="dragArea">
            <template #item="{ element }">
              <div class="todo-item-wrapper" :id="element.id">
                <TodoItem
                  :todo="element"
                  @editTodo="editTodo"
                  @deleteTodo="deleteTodo"
                  @toggleTodo="toggleTodoCompletion"
                />
              </div>
            </template>
          </draggable>
        </div>
      </div>

      <!-- Completed Column -->
      <div class="kanban-column">
        <h3 class="text-center">Completed</h3>
        <div class="todo-column" id="completed">
          <draggable
            v-model="completedTodos"
            :group="{ name: 'tasks' }"
            item-key="id"
            class="dragArea">
            <template #item="{ element }">
              <div class="todo-item-wrapper" :id="element.id">
                <TodoItem
                  :todo="element"
                  @editTodo="editTodo"
                  @deleteTodo="deleteTodo"
                  @toggleTodo="toggleTodoCompletion"
                />
              </div>
            </template>
          </draggable>
        </div>
      </div>
    </div>
  </div>
  <div v-else>Loading...</div>
</template>

<script lang="ts">

import { defineComponent, ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import draggable from 'vuedraggable';
import TodoItem from './TodoItem.vue';
import { useTodoStore } from '../stores/todoStore';
import { TodoStatus, type Todo } from '../types/todo';
import { db } from '../utils/db';

export default defineComponent({
  name: 'TodoList',
  components: { TodoItem, draggable },
  setup() {
    const todoStore = useTodoStore();
    const router = useRouter();
    const todos = ref<Todo[]>([]);
    const isLoading = ref(true);

    const holdTodos = computed({
      get: () => todos.value.filter(todo => todo.status === TodoStatus.Hold),
      set: (value) => updateTodosList(value, TodoStatus.Hold)
    });

    const inProgressTodos = computed({
      get: () => todos.value.filter(todo => todo.status === TodoStatus.InProgress),
      set: (value) => updateTodosList(value, TodoStatus.InProgress)
    });

    const testingTodos = computed({
      get: () => todos.value.filter(todo => todo.status === TodoStatus.Testing),
      set: (value) => updateTodosList(value, TodoStatus.Testing)
    });

    const completedTodos = computed({
      get: () => todos.value.filter(todo => todo.status === TodoStatus.Completed),
      set: (value) => updateTodosList(value, TodoStatus.Completed)
    });

    const updateTodosList = async (value: Todo[], status: TodoStatus) => {
      const updatedTodos = [...todos.value];
      value.forEach(todo => {
        const index = updatedTodos.findIndex(t => t.id === todo.id);
        if (index !== -1) {
          updatedTodos[index] = { ...todo, status };
          db.updateTodo({ ...updatedTodos[index] });
        }
      });
      todos.value = updatedTodos;
    };

    onMounted(async () => {
      try {
        if (todoStore.todos.length === 0) {
          await todoStore.loadTodos();
        }
        todos.value = todoStore.todos;
      } catch (error) {
        console.error('Error loading todos:', error);
      } finally {
        isLoading.value = false;
      }
    });

    const editTodo = (id: number) => {
      router.push(`/edit/${id}`);
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

    const createNewTodo = async () => {

      const newTodo: Todo = {
        id: Date.now(),
        title: '',
        text: '',
        status: TodoStatus.Hold,
        completed: false,
        createDate: new Date(),
      };

      await db.addTodo(newTodo);
      todos.value.push(newTodo);
      router.push(`/edit/${newTodo.id}`);
    };

    return {
      todos,
      editTodo,
      deleteTodo,
      toggleTodoCompletion,
      createNewTodo,
      isLoading,
      holdTodos,
      inProgressTodos,
      testingTodos,
      completedTodos,
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
  gap: 20px;
}

.kanban-column {
  width: 300px;
  background-color: #f8f9fa;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.todo-column {
  min-height: 400px;
}

.dragArea {
  min-height: 50px;
}

h3 {
  margin-bottom: 20px;
}

.todo-item-wrapper {
  user-select: none;
  cursor: grab;
  margin-bottom: 8px;
}

.todo-item-wrapper:active {
  cursor: grabbing;
}

.create-todo-btn {
  transition: all 0.2s ease;
}

.create-todo-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
