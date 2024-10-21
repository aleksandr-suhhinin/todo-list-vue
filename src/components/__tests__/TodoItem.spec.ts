import { shallowMount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import TodoItem from '@/components/TodoItem.vue';
import { type Todo, TodoStatus } from '@/types/todo';

describe('TodoItem.vue', () => {
  it('renders todo text', () => {
    const todo: Todo = {
      id: 1,
      text: 'Test Todo',
      completed: false,
      title: '',
      createDate: new Date(),
      status: TodoStatus.Hold
    };
    const wrapper = shallowMount(TodoItem, {
      props: { todo }
    });
    expect(wrapper.text()).toMatch(todo.text);
  });


  it('emits deleteTodo event when delete button is clicked', async () => {
    const todo: Todo = {
      id: 1,
      text: 'Test Todo',
      completed: false,
      title: '',
      createDate: new Date(),
      status: TodoStatus.Hold
    };
    const wrapper = shallowMount(TodoItem, {
      props: { todo }
    });
    const deleteButton = wrapper.findAll('button').at(1);
    if (deleteButton) {
      await deleteButton.trigger('click');
    }
    expect(wrapper.emitted().deleteTodo).toBeTruthy();
  });
});
