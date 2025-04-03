export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

export class TodoApp {
  private todos: Todo[] = [];
  private todoList: HTMLUListElement;
  private todoForm: HTMLFormElement;
  private todoInput: HTMLInputElement;
  private filterButtons: NodeListOf<HTMLButtonElement>;

  constructor() {
    const todoListElement = document.getElementById('todo-list');
    const todoFormElement = document.getElementById('todo-form');
    const todoInputElement = document.getElementById('todo-input');

    if (!todoListElement || !todoFormElement || !todoInputElement) {
      throw new Error('Required DOM elements not found');
    }

    this.todoList = todoListElement as HTMLUListElement;
    this.todoForm = todoFormElement as HTMLFormElement;
    this.todoInput = todoInputElement as HTMLInputElement;
    this.filterButtons = document.querySelectorAll('.filter-btn');

    this.initializeApp();
  }

  private initializeApp(): void {
    this.clearAll();
    this.addEventListeners();
  }

  private clearAll(): void {
    this.todos = [];
    this.todoList.innerHTML = '';
    localStorage.clear();
  }

  private addEventListeners(): void {
    this.todoForm.addEventListener('submit', (e: Event) => {
      e.preventDefault();
      const text = this.todoInput.value.trim();
      if (text) {
        this.addTodo(text);
        this.todoInput.value = '';
      }
    });

    for (const button of this.filterButtons) {
      button.addEventListener('click', () => this.handleFilter(button));
    }
  }

  private addTodo(text: string): void {
    const todo: Todo = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      createdAt: new Date()
    };

    this.todos = [todo, ...this.todos];
    this.saveTodos();
    this.renderTodos();
  }

  private deleteTodo(id: string): void {
    this.todos = this.todos.filter(todo => todo.id !== id);
    this.saveTodos();
    this.renderTodos();
  }

  private updateTodoStatus(id: string, completed: boolean): void {
    const todoItem = this.todoList.querySelector(`[data-id="${id}"]`);
    if (todoItem) {
      if (completed) {
        todoItem.classList.add('completed');
      } else {
        todoItem.classList.remove('completed');
      }
    }
  }

  private toggleTodo(id: string, completed: boolean): void {
    this.todos = this.todos.map(todo =>
      todo.id === id ? { ...todo, completed } : todo
    );
    this.updateTodoStatus(id, completed);
    this.saveTodos();
  }

  private handleFilter(clickedButton: HTMLButtonElement): void {
    for (const button of this.filterButtons) {
      button.classList.remove('active');
    }
    clickedButton.classList.add('active');
    this.renderTodos();
  }

  private getFilteredTodos(): Todo[] {
    const activeFilter = document.querySelector('.filter-btn.active')?.getAttribute('data-filter');
    switch (activeFilter) {
      case 'active':
        return this.todos.filter(todo => !todo.completed);
      case 'completed':
        return this.todos.filter(todo => todo.completed);
      default:
        return this.todos;
    }
  }

  private renderTodos(): void {
    const filteredTodos = this.getFilteredTodos();
    this.todoList.innerHTML = '';

    for (const todo of filteredTodos) {
      const li = document.createElement('li');
      li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
      li.dataset.id = todo.id;

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'todo-checkbox';
      checkbox.checked = todo.completed;
      checkbox.addEventListener('change', () => {
        this.toggleTodo(todo.id, checkbox.checked);
      });

      const span = document.createElement('span');
      span.className = 'todo-text';
      span.textContent = todo.text;

      const deleteButton = document.createElement('button');
      deleteButton.className = 'todo-delete';
      deleteButton.textContent = '削除';
      deleteButton.addEventListener('click', () => this.deleteTodo(todo.id));

      li.appendChild(checkbox);
      li.appendChild(span);
      li.appendChild(deleteButton);
      this.todoList.appendChild(li);
    }
  }

  private saveTodos(): void {
    localStorage.setItem('todos', JSON.stringify(this.todos));
  }
}