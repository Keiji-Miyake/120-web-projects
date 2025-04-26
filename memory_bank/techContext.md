# 技術コンテキスト

## プロジェクトセットアップ
### 開発環境
```bash
# プロジェクト作成
pnpm create next-app 120-web-projects \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"

# 必要なパッケージのインストール
cd 120-web-projects
pnpm add -D prettier prettier-plugin-tailwindcss husky lint-staged
```

### リポジトリ設定
- **ホスト:** GitHub
- **可視性:** Public
- **ライセンス:** MIT License

### Cloudflare Pages の設定
1. **デプロイメント設定**
   ```
   Build command: pnpm build
   Build output directory: .next
   Root directory: apps/projects/[project-name]
   ```

2. **環境変数管理**
   - Cloudflare環境変数を使用
   - 本番/開発環境で分離

3. **ドメイン設定**
   - メインサイト: `120-web-projects.pages.dev`
   - 個別プロジェクト: `[project-name].120-web-projects.pages.dev`

## データ永続化
### 主要データストア
- **LocalStorage + IndexedDB**
  - オフライン対応
  - クライアントサイドのみ
  - 容量制限を考慮

### バックアップ (オプション)
- **Cloudflare KV**
  - 無料枠の範囲内で使用
  - データの永続化
  - 同期機能の実装

## 品質管理
### リンター設定
```js
// .eslintrc.js
module.exports = {
  extends: [
    'next/core-web-vitals',
    'prettier',
  ],
  rules: {
    // プロジェクト固有のルール
  }
};
```

### Prettier設定
```js
// .prettierrc.js
module.exports = {
  semi: true,
  singleQuote: true,
  trailingComma: 'all',
  printWidth: 80,
};
```

### Git Hooks
```js
// .husky/pre-commit
pnpm lint-staged

// package.json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

## パフォーマンス最適化
### ビルド設定
- Next.js App Routerの利用
- 画像最適化の有効化
- ルートレベルのキャッシング

### モニタリング
- Cloudflare Analyticsの利用
- Web Vitalsの計測
- エラー監視

## アクセシビリティ
### 基本対応
- WAI-ARIAの適用
- キーボード操作の対応
- スクリーンリーダー対応

### UI/UX設計
- レスポンシブデザイン
- ダークモード対応
- 色のコントラスト比の確保

## セキュリティ
### 実装方針
- Content Security Policy
- CORS設定
- XSS対策

### 依存関係管理
- 定期的な更新確認
- 脆弱性スキャン
- パッケージのロックファイル管理