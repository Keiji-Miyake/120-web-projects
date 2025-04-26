# アクティブコンテキスト

## 現在の作業状況
- プロジェクトの初期設定フェーズ
- Todo アプリケーションの基本実装の準備中

## 最新の進捗
1. プロジェクトの基本設計完了
   - モノレポ構成の決定
   - 技術スタックの選定
   - 実装計画の策定

2. 必要なドキュメントの作成
   - `projectbrief.md`: プロジェクト概要
   - `techContext.md`: 技術的な背景
   - `todo-app.md`: Todo アプリの仕様
   - `actions.md`: アクションプラン

## 次のステップ
### 1. 環境セットアップ
```bash
# リポジトリの初期化と基本設定
mkdir 120-web-projects
cd 120-web-projects
git init
echo "# 120 Web Projects" > README.md
git add README.md
git commit -m "chore: initial commit"

# モノレポの構成
pnpm init
mkdir -p apps/projects/001_todo-app
```

### 2. Todo アプリのセットアップ
```bash
cd apps/projects/001_todo-app
pnpm create next-app . \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"
```

### 3. 追加設定
- Prettier の設定
- Husky の設定
- Jest の設定
- GitHub Actions の設定

## 懸念事項
1. データ永続化
   - Cloudflare KV の利用検討
   - IndexedDB のフォールバック実装

2. オフライン対応
   - Service Worker の実装
   - キャッシュ戦略の検討

## メトリクス
- 信頼度スコア: 8/10 (環境セットアップは標準的な手順)
- 予想完了時間: 1時間以内
- リスク: 低 (標準的なセットアップ手順に従う)