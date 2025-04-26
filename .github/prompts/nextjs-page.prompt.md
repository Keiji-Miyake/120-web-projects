# Next.jsページコンポーネント生成プロンプト

ページ名が指定されていない場合は、必要なページ名について質問してください。

## ページ要件

以下の要件に従って、Next.jsのページコンポーネントを生成してください：

1. **App Routerの使用**: Next.js 13以降のApp Routerパターンを使用する
2. **TypeScriptの活用**: 適切に型を定義し、型安全性を確保する
3. **メタデータの設定**: SEOに最適化されたメタデータを設定する
4. **レイアウト対応**: 親レイアウトとの適切な統合
5. **サーバーコンポーネント**: 基本的にはServer Componentとして実装する
6. **データフェッチ**: 必要に応じてサーバー側でのデータフェッチを実装する
7. **エラーハンドリング**: エラー状態と読み込み状態の適切な処理
8. **静的生成とISR**: 可能な場合は静的生成とISRを活用する
9. **アクセシビリティ**: WAI-ARIAの属性を適切に使用する
10. **レスポンシブデザイン**: すべての画面サイズに対応するデザイン

## コード構造

```tsx
// ページコンポーネント
export const metadata = {
  title: '{PageTitle}',
  description: '{PageDescription}',
};

// 必要に応じてデータ取得関数を定義
export async function generateMetadata({ params }: { params: { id: string } }) {
  // 動的メタデータ生成
  return {
    title: `{PageTitle} - {DynamicTitle}`,
    // その他のメタデータ
  };
}

export async function generateStaticParams() {
  // 静的パスの生成（必要な場合）
  return [
    { id: '1' },
    { id: '2' }
    // ...
  ];
}

// デフォルトはサーバーコンポーネント
export default async function Page({ params }: { params: { id?: string } }) {
  // サーバー側でのデータ取得
  // const data = await fetchData(params.id);

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">{PageTitle}</h1>
      
      {/* ページの主要コンテンツ */}
      <section className="my-6">
        {/* コンテンツをここに配置 */}
      </section>
      
      {/* 必要に応じてクライアントコンポーネントをインポート */}
      {/* <ClientSideComponent data={data} /> */}
    </main>
  );
}

// 必要に応じてクライアントコンポーネントを定義
// "use client";
// 
// function ClientSideComponent({ data }) {
//   // クライアント側の状態と処理
//   return (
//     <div>
//       {/* クライアント側の内容 */}
//     </div>
//   );
// }
```