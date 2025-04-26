// Testing Libraryのセットアップ
import '@testing-library/jest-dom';

// コンソールエラーの抑制
const originalError = console.error;
console.error = (...args: unknown[]) => {
  const [message] = args;
  if (
    typeof message === 'string' &&
    message.includes('Warning: ReactDOM.render is no longer supported in React 18')
  ) {
    return;
  }
  originalError.call(console, ...args);
};

// JestDOMのマッチャー拡張
expect.extend({
  // カスタムマッチャーがあれば追加
});
