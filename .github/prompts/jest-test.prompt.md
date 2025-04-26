# Jestテスト生成プロンプト

テスト対象のファイルパスが指定されていない場合は、テスト対象のファイルについて質問してください。

## テスト要件

以下の要件に従って、Jestテストコードを生成してください：

1. **テストの構造化**: describe/itブロックを適切に階層化して、テストを整理する
2. **テスト命名規則**: テスト名は「〜すべき」または「〜する場合」の形式で記述する
3. **セットアップとティアダウン**: beforeEach/afterEachを適切に使用してテストの前後処理を整理する
4. **モックとスタブ**: 外部依存性は適切にモック化する（jest.mockなど）
5. **スナップショットテスト**: UIコンポーネントの場合は、スナップショットテストを含める
6. **境界値テスト**: エッジケースや境界条件のテストを含める
7. **AAA パターン**: 各テストは「Arrange-Act-Assert」パターンに従う
8. **データ分離**: テストデータは分離し、可能な限り再利用可能にする
9. **読みやすさ**: 期待される動作を明確に伝えるためのテストコードを書く
10. **カバレッジ**: 主要なコードパスがカバーされていることを確認する

## コード構造

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ComponentName } from './ComponentName';

describe('ComponentName', () => {
  // テストのセットアップ
  beforeEach(() => {
    // セットアップコード
  });

  afterEach(() => {
    // クリーンアップコード
    jest.clearAllMocks();
  });

  it('初期状態で正しくレンダリングされるべき', () => {
    // Arrange
    render(<ComponentName />);
    
    // Act (ユーザーインタラクションが必要な場合)
    
    // Assert
    expect(screen.getByText('期待されるテキスト')).toBeInTheDocument();
  });

  it('ユーザーイベント発生時に適切に動作するべき', () => {
    // Arrange
    const mockHandler = jest.fn();
    render(<ComponentName onAction={mockHandler} />);
    
    // Act
    fireEvent.click(screen.getByRole('button'));
    
    // Assert
    expect(mockHandler).toHaveBeenCalledTimes(1);
  });

  // その他のテストケース
});
```