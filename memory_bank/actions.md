# アクション計画

## 初期セットアップ
```bash
# 1. モノレポの作成
git init 120-web-projects
cd 120-web-projects

# 2. pnpm の初期化
pnpm init

# 3. ディレクトリ構造の作成
mkdir -p apps/web
mkdir -p apps/projects/001_todo-app
mkdir -p packages/ui
mkdir -p packages/config

# 4. Next.js プロジェクトの作成
cd apps/projects/001_todo-app
pnpm create next-app . \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"

# 5. 追加パッケージのインストール
pnpm add -D \
  prettier \
  prettier-plugin-tailwindcss \
  husky \
  lint-staged \
  @testing-library/react \
  @testing-library/jest-dom \
  jest \
  jest-environment-jsdom \
  @types/jest

# 6. Git の設定
cd ../../..
git init
echo "node_modules" > .gitignore
echo ".next" >> .gitignore
echo "dist" >> .gitignore
echo ".env" >> .gitignore
```

## 設定ファイル
### 1. package.json
```json
{
  "name": "120-web-projects",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "pnpm --filter 001_todo-app dev",
    "build": "pnpm --filter 001_todo-app build",
    "start": "pnpm --filter 001_todo-app start",
    "lint": "pnpm --filter 001_todo-app lint",
    "test": "pnpm --filter 001_todo-app test",
    "prepare": "husky install"
  }
}
```

### 2. .prettierrc
```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 80
}
```

### 3. .eslintrc.json
```json
{
  "extends": [
    "next/core-web-vitals",
    "prettier"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "import/order": [
      "error",
      {
        "groups": [
          "builtin",
          "external",
          "internal",
          ["parent", "sibling"],
          "index",
          "object",
          "type"
        ],
        "newlines-between": "always",
        "alphabetize": {
          "order": "asc"
        }
      }
    ]
  }
}
```

## GitHub Actions
### .github/workflows/ci.yml
```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm lint
      - run: pnpm test
```

## デプロイ設定
### 1. Cloudflare Pages
- プロジェクト名: `120-web-projects`
- ビルドコマンド: `pnpm build`
- ビルド出力ディレクトリ: `apps/projects/001_todo-app/.next`
- 環境変数:
  - `NODE_VERSION`: 18
  - `PNPM_VERSION`: 8

## 次のステップ
1. リポジトリの作成とプッシュ
2. Cloudflare Pages の設定
3. CI/CD パイプラインの確認
4. Todo アプリの実装開始