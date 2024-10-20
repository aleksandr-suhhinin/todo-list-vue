import { defineStore } from 'pinia';
import type { Todo, TodoStatus } from '../types/todo';
import { db } from '../utils/db';

export const useTodoStore = defineStore('todoStore', {
  state: () => ({
    todos: [] as Todo[],
  }),
  actions: {
    async loadTodos() {
      this.todos = await db.getAllTodos();
    },
    async addTodo(todo: Todo) {
      this.todos.push(todo);
      await db.addTodo(todo);
    },
    async updateTodo(updatedTodo: Todo) {
      console.log('updateTodo', updatedTodo);
      const index = this.todos.findIndex(todo => todo.id === updatedTodo.id);
      if (index !== -1) {
        this.todos[index] = updatedTodo;
        await db.updateTodo({ ...updatedTodo });
      }
    },
    async deleteTodo(id: number) {
      this.todos = this.todos.filter(todo => todo.id !== id);
      await db.deleteTodo(id);
    },
    getTodoById(id: number) {
      return this.todos.find(todo => todo.id === id);
    },
  },

});
