<template>
  <div class="todo-edit-container">
    <h1>Edit Todo</h1>
    <div v-if="todo">
      <label>Title:</label>
      <input v-model="todo.title" type="text" />

      <label>Status:</label>
      <select v-model="todo.status">
        <option value="hold">Hold</option>
        <option value="inProgress">In Progress</option>
        <option value="testing">Testing</option>
        <option value="completed">Completed</option>
      </select>

      <label>Created Date:</label>
      <input type="date" v-model="formattedCreateDate" disabled />

      <label>Completion Date:</label>
      <input type="date" v-model="formattedCompletionDate" />

      <button @click="saveTodo">Save</button>
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

    const formattedCreateDate = computed(() => {
      return todo.value?.createDate ? new Date(todo.value.createDate).toISOString().substr(0, 10) : '';
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

    const saveTodo = () => {
      if (todo.value) {
        todoStore.updateTodo(todo.value);
        router.push('/');
      }
    };

    return {
      todo,
      formattedCreateDate,
      formattedCompletionDate,
      saveTodo
    };
  }
});
</script>

<style scoped>
.todo-edit-container {
  max-width: 600px;
  margin: 50px auto;
  padding: 20px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}
label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}
input, select {
  width: 100%;
  margin-bottom: 20px;
  padding: 10px;
  font-size: 16px;
  border: 2px solid #3498db;
  border-radius: 5px;
}
button {
  background-color: #3498db;
  color: white;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
}
</style>
