import { beforeEach, describe, expect, it } from 'vitest';
import { TodoApp } from './todo-app';

describe('TodoApp', () => {
  let app: TodoApp;
  let todoForm: HTMLFormElement;
  let todoInput: HTMLInputElement;
  let todoList: HTMLUListElement;

  beforeEach(() => {
    // DOMをリセット
    document.body.innerHTML = `
      <form id="todo-form">
        <input id="todo-input" type="text" />
      </form>
      <div class="todo-filters">
        <button class="filter-btn active" data-filter="all">すべて</button>
        <button class="filter-btn" data-filter="active">未完了</button>
        <button class="filter-btn" data-filter="completed">完了済み</button>
      </div>
      <ul id="todo-list"></ul>
    `;

    // 要素の参照を取得
    todoForm = document.getElementById('todo-form') as HTMLFormElement;
    todoInput = document.getElementById('todo-input') as HTMLInputElement;
    todoList = document.getElementById('todo-list') as HTMLUListElement;

    // LocalStorageをクリア
    localStorage.clear();

    // アプリケーションを初期化
    app = new TodoApp();
  });

  function addTodo(text: string): void {
    todoInput.value = text;
    const submitEvent = new Event('submit');
    Object.defineProperty(submitEvent, 'preventDefault', { value: () => {} });
    todoForm.dispatchEvent(submitEvent);
  }

  function getTodoItems(): NodeListOf<Element> {
    return document.querySelectorAll('.todo-item');
  }

  function simulateEvent(element: HTMLElement, eventType: string): void {
    const event = new Event(eventType, { bubbles: true });
    element.dispatchEvent(event);
  }

  it('新しいTodoを追加できること', () => {
    addTodo('テストタスク');

    const todoItems = getTodoItems();
    expect(todoItems.length).toBe(1);

    const todoText = todoItems[0]?.querySelector('.todo-text');
    expect(todoText?.textContent).toBe('テストタスク');
  });

  it('Todoを完了状態に切り替えられること', () => {
    addTodo('テストタスク');

    const todoItems = getTodoItems();
    const todoItem = todoItems[0];
    expect(todoItem).toBeDefined();

    const checkbox = todoItem.querySelector('input[type="checkbox"]') as HTMLInputElement;
    expect(checkbox).toBeDefined();
    expect(checkbox.checked).toBe(false);
    expect(todoItem.classList.contains('completed')).toBe(false);

    // チェックボックスの状態を変更してイベントを発火
    checkbox.checked = true;
    simulateEvent(checkbox, 'change');

    // 状態が更新されたことを確認
    expect(todoItem.classList.contains('completed')).toBe(true);
  });

  it('Todoを削除できること', () => {
    addTodo('テストタスク');
    expect(getTodoItems().length).toBe(1);

    const deleteButton = document.querySelector('.todo-delete') as HTMLButtonElement;
    expect(deleteButton).not.toBeNull();

    simulateEvent(deleteButton, 'click');
    expect(getTodoItems().length).toBe(0);
  });

  it('フィルターが正しく機能すること', () => {
    addTodo('タスク1');
    addTodo('タスク2');

    const todoItems = getTodoItems();
    expect(todoItems.length).toBe(2);

    const checkbox = todoItems[0].querySelector('input[type="checkbox"]') as HTMLInputElement;
    checkbox.checked = true;
    simulateEvent(checkbox, 'change');

    const completedFilter = document.querySelector('[data-filter="completed"]') as HTMLButtonElement;
    simulateEvent(completedFilter, 'click');

    const filteredItems = getTodoItems();
    expect(filteredItems.length).toBe(1);
    expect(filteredItems[0].classList.contains('completed')).toBe(true);
  });

  it('LocalStorageにTodoが保存されること', () => {
    addTodo('テストタスク');

    const savedTodos = localStorage.getItem('todos');
    expect(savedTodos).not.toBeNull();

    const todos = JSON.parse(savedTodos ?? '[]');
    expect(todos.length).toBe(1);
    expect(todos[0].text).toBe('テストタスク');
  });
});