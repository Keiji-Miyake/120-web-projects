import { JSDOM } from 'jsdom';
import { afterEach, beforeEach } from 'vitest';

const dom = new JSDOM(`
<!DOCTYPE html>
<html>
  <body>
    <form id="todo-form">
      <input id="todo-input" type="text" />
    </form>
    <div class="todo-filters">
      <button class="filter-btn active" data-filter="all">すべて</button>
      <button class="filter-btn" data-filter="active">未完了</button>
      <button class="filter-btn" data-filter="completed">完了済み</button>
    </div>
    <ul id="todo-list"></ul>
  </body>
</html>
`, {
  url: 'http://localhost',
  referrer: 'http://localhost',
  contentType: 'text/html',
});

// DOMの設定
Object.defineProperty(globalThis, 'document', {
  value: dom.window.document,
  writable: true,
  configurable: true
});

Object.defineProperty(globalThis, 'window', {
  value: dom.window,
  writable: true,
  configurable: true
});

// Cryptoのモック
Object.defineProperty(globalThis.window, 'crypto', {
  value: {
    randomUUID: () => '123e4567-e89b-12d3-a456-426614174000',
    subtle: {
      encrypt: () => Promise.resolve(new ArrayBuffer(0)),
      decrypt: () => Promise.resolve(new ArrayBuffer(0)),
      sign: () => Promise.resolve(new ArrayBuffer(0)),
      verify: () => Promise.resolve(false),
      digest: () => Promise.resolve(new ArrayBuffer(0)),
      generateKey: () => Promise.resolve({} as CryptoKey),
      deriveKey: () => Promise.resolve({} as CryptoKey),
      deriveBits: () => Promise.resolve(new ArrayBuffer(0)),
      importKey: () => Promise.resolve({} as CryptoKey),
      exportKey: () => Promise.resolve(new ArrayBuffer(0)),
      wrapKey: () => Promise.resolve(new ArrayBuffer(0)),
      unwrapKey: () => Promise.resolve({} as CryptoKey)
    },
    getRandomValues: <T extends ArrayBufferView>(array: T) => array
  },
  writable: true,
  configurable: true
});

// LocalStorageのモック
const createLocalStorageMock = () => ({
  store: {} as Record<string, string>,
  getItem(key: string): string | null {
    return this.store[key] || null;
  },
  setItem(key: string, value: string): void {
    this.store[key] = value;
  },
  removeItem(key: string): void {
    delete this.store[key];
  },
  clear(): void {
    this.store = {};
  },
  key(index: number): string | null {
    return Object.keys(this.store)[index] || null;
  },
  length: 0
});

let localStorageMock = createLocalStorageMock();

Object.defineProperty(globalThis, 'localStorage', {
  get: () => localStorageMock,
  configurable: true
});

// テストのセットアップとクリーンアップ
beforeEach(() => {
  localStorageMock = createLocalStorageMock();
  const todoList = document.getElementById('todo-list');
  if (todoList) {
    todoList.innerHTML = '';
  }
  const allButton = document.querySelector('[data-filter="all"]') as HTMLButtonElement;
  if (allButton) {
    allButton.classList.add('active');
  }
});

afterEach(() => {
  localStorageMock.clear();
  const todoList = document.getElementById('todo-list');
  if (todoList) {
    todoList.innerHTML = '';
  }
});

// DOMContentLoadedイベントの発火
window.document.dispatchEvent(new Event('DOMContentLoaded', {
  bubbles: true,
  cancelable: true
}));