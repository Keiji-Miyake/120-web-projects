# Reactコンポーネント生成プロンプト

コンポーネント名が指定されていない場合は、必要なコンポーネント名を質問してください。

## コンポーネント要件

以下の要件に従って、Reactコンポーネントを生成してください：

1. **TypeScriptを使用**：すべてのコンポーネントはTypeScriptで記述し、適切に型付けする
2. **関数コンポーネントを使用**：クラスコンポーネントではなく関数コンポーネントを使用する
3. **React Hooks**：適切なReact Hooksを使用する（useState, useEffect, useCallback, useMemoなど）
4. **パフォーマンス**：不要な再レンダリングを避けるため、メモ化を適切に行う
5. **アクセシビリティ**：WAI-ARIAの属性を適切に使用して、アクセシブルなコンポーネントを作成する
6. **テスト**：コンポーネントのテストを書くための準備を整える（データ属性の追加など）
7. **スタイリング**：CSSモジュールを使用してスタイリングを行う
8. **レスポンシブデザイン**：モバイルファーストのアプローチでレスポンシブなコンポーネントを作成する
9. **エラーハンドリング**：必要に応じてエラー状態を適切に処理する
10. **ドキュメンテーション**：propsの説明をコメントに含める

## コード構造

```tsx
import React from 'react';
import styles from './{ComponentName}.module.css';

interface {ComponentName}Props {
  // propの型定義
}

/**
 * {ComponentName} - コンポーネントの説明
 */
export const {ComponentName}: React.FC<{ComponentName}Props> = ({ /* props */ }) => {
  // hooks

  // handlers

  // render
  return (
    <div className={styles.container}>
      {/* コンポーネントの内容 */}
    </div>
  );
};
```