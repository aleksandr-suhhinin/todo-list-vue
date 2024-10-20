<template>
  <div class="todo-list-container container">
    <div class="kanban-board">
      <!-- Hold Column -->
      <div class="kanban-column" id="hold">
        <h3 class="text-center">Hold</h3>
        <div class="todo-column">
          <draggable :list="todosByStatus('hold')" group="tasks" @start="onDragStart" @end="onDrop">
            <template #item="{ element }">
              <div class="todo-item-wrapper" :id="element.id">
                <TodoItem
                  v-for="todo in todosByStatus('hold')"
                  :key="todo.id"
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
      <div class="kanban-column" id="inProgress">
        <h3 class="text-center">In Progress</h3>
        <div class="todo-column">
          <draggable :list="todosByStatus('inProgress')" group="tasks" @start="onDragStart" @end="onDrop">
            <template #item="{ element }">
              <div class="todo-item-wrapper" :id="element.id">
                <TodoItem
                  v-for="todo in todosByStatus('inProgress')"
                  :key="todo.id"
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
      <div class="kanban-column" id="testing">
        <h3 class="text-center">Testing</h3>
        <div class="todo-column">
          <draggable :list="todosByStatus('testing')" group="tasks" @start="onDragStart" @end="onDrop">
            <template #item="{ element }">
              <div class="todo-item-wrapper" :id="element.id">
                <TodoItem
                  v-for="todo in todosByStatus('testing')"
                  :key="todo.id"
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
      <div class="kanban-column" id="completed">
        <h3 class="text-center">Completed</h3>
        <div class="todo-column">
          <draggable :list="todosByStatus('completed')" group="tasks" @start="onDragStart" @end="onDrop">
            <template #item="{ element }">
              <div class="todo-item-wrapper" :id="element.id">
                <TodoItem
                  :todo="element"
                  v-for="todo in todosByStatus('completed')"
                  :key="todo.id"
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
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
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
    const newTodo = ref('');
    const todos = ref<Todo[]>([]);
    const filter = ref<'all' | 'active' | 'completed'>('all');
    const draggedItem = ref<Todo | null>(null);

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

    const onDragStart = (event) => {
      draggedItem.value = event.item;
      console.log('Drag started:', draggedItem.value);
    };

    const onDrop = async (event) => {
      const todo = draggedItem.value; // Используем сохранённую задачу

      if (!todo || !todo.id) {
        console.error('Task does not have a valid ID:', todo);
        return;
      }

      const newStatus = event.to.parentElement.id as TodoStatus;

      // if (!todo.id) {
      //   console.error('Task does not have a valid ID:', todo);
      //   return;
      // }
      if (todo && todo.status !== newStatus) {
        todo.status = newStatus;
        const cleanTodo = {
          id: todo.id,
          title: todo.title,
          text: todo.text,
          status: todo.status,
          createDate: todo.createDate,
          completionDate: todo.completionDate,
          completed: todo.completed,
        };

        await db.updateTodo(cleanTodo);
        draggedItem.value = null;
        console.log('Task dropped and updated:', cleanTodo);
      }
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
      todosByStatus,
      onDrop,
      onDragStart
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

h3 {
  margin-bottom: 20px;
}

.todo-item {
  margin-bottom: 10px;
}

.todo-item-wrapper {
  user-select: none;
  cursor: grab;
}

.todo-item-wrapper:active {
  cursor: grabbing;
}
</style>
