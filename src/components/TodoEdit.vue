<template>
  <div class="todo-edit-container container">
    <h1 class="mb-4">Edit Todo</h1>
    <div v-if="todo" class="mb-3">
      <div class="mb-3">
        <label class="form-label">Title:</label>
        <input v-model="todo.title" type="text" class="form-control" />
      </div>
      <div class="mb-3">
        <label class="form-label">Text:</label>
        <textarea v-model="todo.text" rows="5" class="form-control"></textarea>
      </div>
      <div class="mb-3">
        <label class="form-label">Status:</label>
        <select v-model="todo.status" class="form-select" @change="handleStatusChange">
          <option value="hold">Hold</option>
          <option value="inProgress">In Progress</option>
          <option value="testing">Testing</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      <div class="mb-3">
        <label class="form-label">Created Date:</label>
        <input type="date" v-model="formattedCreateDate" class="form-control" disabled />
      </div>

      <div class="mb-3">
        <label class="form-label">Completion Date:</label>
        <input type="date" v-model="formattedCompletionDate" class="form-control" />
      </div>

      <button @click="saveTodo" class="btn btn-primary">Save</button>
      <div class="d-inline-block mx-2"></div>
      <button @click="cancel" class="btn btn-secondary">Cancel</button>
    </div>
  </div>
</template>

<script lang = "ts">
import { defineComponent, computed, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useTodoStore } from '../stores/todoStore';
import type { TodoStatus, Todo } from '../types/todo';

export default defineComponent({
  props: {
    id: {
      type: String,
      required: true
    }
  },
  name: 'TodoEdit',
  setup(props) {
    const todoStore = useTodoStore();
    const router = useRouter();

    const todo = ref(todoStore.getTodoById(Number(props.id)));

    onMounted(() => {
      const todoFromStore = todoStore.getTodoById(Number(props.id));
      todo.value = todoStore.getTodoById(Number(props.id));
      if (todoFromStore) {
        todo.value = { ...todoFromStore };
      } else {
        console.error('Todo not found with ID:', props.id);
      }
    });

    const formattedCreateDate = computed({
      get() {
        return todo.value?.createDate ? new Date(todo.value.createDate).toISOString().substr(0, 10) : '';
      },
      set(value: string) {
        if (todo.value) {
          todo.value.createDate = new Date(value);
        }
      }
    });

    const formattedCompletionDate = computed({
      get() {
        return todo.value?.completionDate ? new Date(todo.value.completionDate).toISOString().substr(0, 10) : '';
      },
      set(value: string) {
        if (todo.value) {
          todo.value.completionDate = new Date(value);
        }
      }
    });

    const handleStatusChange = () => {
      if (todo.value?.status === 'completed') {
        todo.value.completed = true;
      } else {
        if (todo.value) {
          todo.value.completed = false;
        }
      }
    };

    const saveTodo = () => {
      if (todo.value) {
        todoStore.updateTodo(todo.value);
        router.push('/');
      }
    };

    const cancel = () => {
      router.push('/');
    };

    return {
      todo,
      formattedCreateDate,
      formattedCompletionDate,
      saveTodo,
      cancel,
      handleStatusChange
    };
  }
});
</script>

<style scoped>
.todo-edit-container {
  max-width: 600px;
  min-width: 600px;
  margin: 50px auto;
  padding: 20px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}
</style>
