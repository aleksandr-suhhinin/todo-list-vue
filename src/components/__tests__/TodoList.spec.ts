import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createRouter, createWebHistory } from 'vue-router';
import TodoList from '../TodoList.vue';
import { setActivePinia } from 'pinia';
import { createTestingPinia } from '@pinia/testing';
import { TodoStatus } from '../../types/todo';
import type { Plugin } from 'vue';

const initialTodos = [
  {
    id: 1,
    title: 'Test Todo 1',
    text: 'Test text 1',
    status: TodoStatus.Hold,
    completed: false,
    createDate: new Date()
  },
  {
    id: 2,
    title: 'Test Todo 2',
    text: 'Test text 2',
    status: TodoStatus.InProgress,
    completed: false,
    createDate: new Date()
  }
];

vi.mock('../utils/db', () => ({
  db: {
    addTodo: vi.fn().mockResolvedValue({}),
    updateTodo: vi.fn().mockResolvedValue({}),
    deleteTodo: vi.fn().mockResolvedValue({}),
    getAllTodos: vi.fn().mockResolvedValue(initialTodos),
  }
}));

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/edit/:id',
      name: 'edit-todo',
      component: { template: '<div>Edit Todo</div>' }
    }
  ]
});

describe('TodoList', () => {
  let pinia: Plugin | [Plugin, ...any[]];

  beforeEach(() => {

    pinia = createTestingPinia({
      createSpy: vi.fn,
      stubActions: false,
      initialState: {
        todoStore: {
          todos: initialTodos
        }
      }
    });
    setActivePinia(pinia);
    vi.clearAllMocks();
  });

  it('renders all columns', async () => {
    const wrapper = mount(TodoList, {
      global: {
        plugins: [router, pinia]
      }
    });

    await wrapper.vm.$nextTick();
    const headers = wrapper.findAll('h3');
    headers.forEach((element, index) => {
      expect(element.text()).toBe(['Hold', 'In Progress', 'Testing', 'Completed'][index]);
    });
  });

  it('filters todos by status correctly', async () => {
    const wrapper = mount(TodoList, {
      global: {
        plugins: [router, pinia]
      }
    });

    await wrapper.vm.$nextTick();

    expect(wrapper.vm.holdTodos.length).toBe(1);
    expect(wrapper.vm.inProgressTodos.length).toBe(1);
    expect(wrapper.vm.testingTodos.length).toBe(0);
    expect(wrapper.vm.completedTodos.length).toBe(0);
  });

  it('deletes todo correctly', async () => {
    const wrapper = mount(TodoList, {
      global: {
        plugins: [router, pinia]
      }
    });

    await wrapper.vm.$nextTick();

    const initialTodosLength = wrapper.vm.todos.length;

    await wrapper.vm.deleteTodo(1);

    expect(wrapper.vm.todos.length).toBe(initialTodosLength - 1);
    expect(wrapper.vm.todos.find(todo => todo.id === 1)).toBeUndefined();
  });

  it('toggles todo completion status', async () => {
    const wrapper = mount(TodoList, {
      global: {
        plugins: [router, pinia]
      }
    });

    await wrapper.vm.$nextTick();

    const todo = wrapper.vm.todos[0];
    const initialCompletionStatus = todo.completed;

    await wrapper.vm.toggleTodoCompletion(todo.id);

    expect(todo.completed).toBe(!initialCompletionStatus);
  });

  it('shows loading state initially', async () => {
    const wrapper = mount(TodoList, {
      global: {
        plugins: [router, pinia]
      }
    });

    expect(wrapper.text()).toContain('Loading...');
  });
});
