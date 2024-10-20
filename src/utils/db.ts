import { openDB } from 'idb';
import type { Todo } from '../types/todo';

const DB_NAME = 'TodoDB';
const STORE_NAME = 'todos';

const dbPromise = openDB(DB_NAME, 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      db.createObjectStore(STORE_NAME, { keyPath: 'id' });
    }
  },
});

export const db = {
  async getAllTodos(): Promise<Todo[]> {
    return (await dbPromise).getAll(STORE_NAME);
  },
  async addTodo(todo: Todo) {
    return (await dbPromise).add(STORE_NAME, todo);
  },
  async deleteTodo(id: number) {
    return (await dbPromise).delete(STORE_NAME, id);
  },
  async updateTodo(todo: Todo) {
    return (await dbPromise).put(STORE_NAME, todo);
  },
};
