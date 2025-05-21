import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';

// Testing Library の設定
configure({ testIdAttribute: 'data-testid' });

// コンソールエラーの抑制
const originalError = console.error;
console.error = (...args: unknown[]) => {
  const [message] = args;
  if (
    typeof message === 'string' &&
    (
      message.includes('Warning: ReactDOM.render is no longer supported in React 18') ||
      // React Hooksに関する警告を抑制
      message.includes('Warning: Invalid hook call') ||
      // テスト実行中のその他の一般的な警告を抑制
      message.includes('Warning: An update to') ||
      message.includes('Warning: Cannot update a component')
    )
  ) {
    return;
  }
  originalError.call(console, ...args);
};

// グローバルなモック設定
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// JestDOMのマッチャー拡張
expect.extend({
  // カスタムマッチャーがあれば追加
});
