# 120 Web Projects アーキテクチャ設計

## 変更履歴
| バージョン | 更新日       | 更新内容                     | 担当者       |
|------------|--------------|------------------------------|--------------|
| 1.0.0      | 2024-04-23   | 初版作成                     | 開発チーム   |
| 1.1.0      | 2025-04-23   | レビュー反映・詳細化         | Roo          |

## 1. アーキテクチャ概要

### プロジェクト構成
モノレポアーキテクチャを採用し、以下の構成でスケーラビリティと再利用性を実現します：

```
.
├── apps/               # 個別のアプリケーション
│   ├── web-app/       # Webアプリケーション (Next.js)
│   └── docs/          # ドキュメントサイト (Next.js)
├── packages/          # 共有パッケージ
│   ├── core/         # コアライブラリ (ビジネスロジック)
│   ├── ui/           # UIコンポーネント (React)
│   └── utilities/    # ユーティリティ関数
├── memory_bank/      # プロジェクト記録
├── docs/             # 設計ドキュメント
└── e2e/              # E2Eテスト (Playwright)
```

**選定理由**:
- モノレポ構成により、コードの再利用性と依存関係管理を最適化
- Next.jsを採用した理由：SSR/SSG対応、TypeScript統合、開発体験の良さ
- pnpm選択の理由：workspace機能、高速なインストール、ディスク効率

### 技術スタック
- **パッケージマネージャー:** pnpm (workspace機能活用)
- **言語:** TypeScript (strict mode有効)
- **フレームワーク:** Next.js 14 (App Router), React 18
- **スタイリング:** 
  - CSS Modules (スコープ付きスタイリング)
  - Tailwind CSS (ユーティリティファースト)
- **テスト:** 
  - Jest (単体テスト)
  - React Testing Library (コンポーネントテスト)
  - Playwright (E2Eテスト)
- **CI/CD:** 
  - GitHub Actions (ワークフロー自動化)
  - Cloudflare Pages (高速デプロイ)
- **データ永続化:** 
  - Cloudflare KV (サーバーサイド永続化)
  - IndexedDB (クライアントサイド永続化)

## 2. コアコンセプト

### 設計原則
- **SOLIDの徹底**:
  - 単一責任: 1コンポーネント/関数 = 1責務
  - 開放閉鎖: 拡張可能で修正不要な設計
  - リスコフの置換: 派生型は基底型と置換可能
  - インターフェース分離: クライアント固有のインターフェース
  - 依存性逆転: 抽象に依存し具象から独立

- **DRY (Don't Repeat Yourself)**: 
  - 共通機能は`packages/utilities`に集約
  - 重複コードは週次レビューで検出

- **KISS (Keep It Simple, Stupid)**: 
  - 複雑度メトリクス監視 (Cyclomatic Complexity < 10)
  - 過度な抽象化禁止

- **YAGNI (You Aren't Gonna Need It)**: 
  - 実際に必要になるまで機能を追加しない
  - 将来要件のためのプレースホルダー禁止

### フロントエンド設計
- **Atomic Design**:
  - Atoms: ボタン、入力欄など基本要素
  - Molecules: 複数Atomの組み合わせ
  - Organisms: 複数Moleculeの機能ブロック
  - Templates: ページレイアウト
  - Pages: 実際のページ実装

- **責務分離**:
  - Presentational Components: UI表示専用
  - Container Components: データ取得/状態管理

- **状態管理**:
  ```typescript
  // 状態管理の選択基準
  const useStateManagement = () => {
    // ローカル状態: useState
    const [count, setCount] = useState(0);
    
    // 複雑なローカル状態: useReducer
    const [state, dispatch] = useReducer(reducer, initialState);
    
    // グローバル状態: Context + useReducer
    const { state, dispatch } = useAppContext();
  }
  ```

- **型安全性**:
  - TypeScript strict mode必須
  - any型使用禁止 (代わりにunknown + type guard)
  - 戻り値型は明示的に宣言

### エラー処理
- **Result型の採用**:
  ```typescript
  type Result<T, E = Error> = 
    | { success: true; data: T }
    | { success: false; error: E };

  function safeOperation(): Result<string> {
    try {
      return { success: true, data: "成功" };
    } catch (error) {
      return { success: false, error: error as Error };
    }
  }
  ```

- **例外階層**:
  ```
  AppError
  ├── NetworkError
  ├── ValidationError
  └── BusinessError
  ```

- **グローバルハンドラー**:
  - Next.jsエラーページをカスタマイズ
  - 未捕捉エラーはSentryに報告

- **ユーザーメッセージ**:
  - 技術詳細は表示せず
  - 解決策を提示 (例: "再試行してください")

## 3. 品質管理

### テスト戦略
- **単体テスト**:
  - カバレッジ目標: 80% (core), 60% (ui)
  - テスト頻度: コミット毎
  - ツール: Jest + Testing Library

- **結合テスト**:
  - カバレッジ目標: 70%
  - テスト頻度: PR作成時
  - シナリオ: コンポーネント連携テスト

- **E2Eテスト**:
  - 主要フロー網羅: 認証、データ操作
  - ツール: Playwright
  - 実行環境: CI/CDパイプライン

- **アクセシビリティ**:
  - WCAG 2.1 AA準拠
  - axe-coreによる自動チェック

### コード品質
- **静的解析**:
  - ESLintルール: airbnb-typescriptをベース
  - Prettier設定: 一貫したフォーマット
  - コミット前フックで自動実行

- **型チェック**:
  - tsc --noEmitで型検証
  - CIパイプラインで必須チェック

- **パフォーマンス**:
  - Web Vitals監視 (LCP, FID, CLS)
  - バンドル分析: @next/bundle-analyzer

- **セキュリティ**:
  - npm audit定期実行
  - Snyk連携で脆弱性検知

## 4. CI/CD パイプライン

### 開発フロー
1. **Feature Branch作成**:
   - 命名規則: `feat/[issue-id]-[short-desc]`
   - 親ブランチ: main

2. **コードレビュー**:
   - 最小2人のapproveが必要
   - レビュー観点チェックリスト適用

3. **CI自動テスト**:
   - 必須パス: lint, type-check, test
   - オプション: e2e (mainマージ前)

4. **マージ**:
   - squash mergeのみ許可
   - コミットメッセージ規約準拠（Conventional Commits）

5. **自動デプロイ**:
   - mainマージ → ステージング環境
   - タグ作成 → 本番環境

### Conventional Commits
- **形式**: `<type>[optional scope]: <description>`
- **主要タイプ**:
  - `feat`: 新機能
  - `fix`: バグ修正
  - `docs`: ドキュメントのみの変更
  - `style`: コードの意味に影響しない変更（空白、フォーマットなど）
  - `refactor`: バグ修正でも機能追加でもないコード変更
  - `perf`: パフォーマンス向上のための変更
  - `test`: テストの追加・修正
  - `build`: ビルドシステムや外部依存関係の変更
  - `ci`: CI設定ファイルやスクリプトの変更
- **Breaking Changes**: `!`を付加し、本文に`BREAKING CHANGE:`を記載
- **スコープ**: 変更対象の機能やモジュール名（例: `feat(auth):`, `fix(api):`）
- **例**:
  ```
  feat(user): ユーザープロファイル編集機能を追加
  fix(payment): 決済エラー時のハンドリングを修正
  docs(api): APIドキュメントを更新
  test(auth): 認証フローのテストカバレッジを改善
  ```

### 自動化項目
| ステップ         | ツール              | 実行タイミング       |
|------------------|---------------------|----------------------|
| lint/format      | ESLint/Prettier     | コミット前/CI        |
| 型チェック       | TypeScript          | CI                   |
| ユニットテスト   | Jest                | コミット前/CI        |
| E2Eテスト        | Playwright          | マージ前CI           |
| 脆弱性チェック   | npm audit/Snyk      | 毎日1回              |
| ビルド           | Next.js             | デプロイ時           |
| デプロイ         | Cloudflare Pages    | mainマージ/タグ作成  |

**失敗時対応**:
1. 失敗ジョブのログ確認
2. ローカル再現
3. 緊急度に応じてホットフィックス or 通常修正

## 5. セキュリティ

### 実装方針
- **認証**:
  - JWT + HTTPOnly Cookie (Secure, SameSite=Strict)
  - トークン有効期限: アクセス30分/リフレッシュ7日
  - パスワードポリシー: 最小12文字、複雑度必須

- **認可**:
  - RBAC (Role-Based Access Control)
  - ロール定義: Admin, Editor, Viewer
  - 権限チェックはMiddlewareで一元的に

- **データ保護**:
  - 個人情報は暗号化保存
  - 画面顯示時はマスキング
  - GDPR/CCPA準拠

- **入出力処理**:
  - 入力バリデーション: Zodスキーマ
  - 出力エスケープ: Reactデフォルトエスケープ
  - ファイルアップロード: タイプ/サイズ制限

### 運用方針
- **脆弱性診断**:
  - 四半期ごと外部ペネトレーションテスト
  - 自動スキャン: 週次実行

- **依存パッケージ**:
  - バージョン固定 (package-lock.json)
  - 依存関係ツリーの可視化 (npm ls)

- **インシデント対応**:
  ```mermaid
  graph TD
    A[インシデント検知] --> B{深刻度}
    B -->|緊急| C[即時対応チーム召集]
    B -->|通常| D[次営業日対応]
    C --> E[原因調査]
    E --> F[緩和策実施]
    F --> G[根本原因分析]
    G --> H[再発防止策]
  ```

- **セキュリティパッチ**:
  - 重大度Critical: 24時間以内適用
  - High: 72時間以内
  - Medium: 次週リリースで

## 6. パフォーマンス最適化

### フロントエンド
- **Code Splitting**:
  - ページ単位: Next.js自動分割
  - コンポーネント単位: dynamic import
  - サードパーティ: 遅延読み込み

- **画像最適化**:
  - Next.js Imageコンポーネント
  - WebPフォーマット優先
  - レスポンシブ画像 (srcset)

- **キャッシュ戦略**:
  | リソース種別   | キャッシュポリシー       |
  |----------------|--------------------------|
  | HTML           | no-store                 |
  | JS/CSS         | immutable, 1年           |
  | 画像           | stale-while-revalidate   |

- **バンドル最適化**:
  - バンドル分析ツール定期実行
  - 重複依存関係の排除
  - 未使用コードの削除 (Tree Shaking)

### データアクセス
- **キャッシュ層**:
  - SWR (Stale-While-Revalidate)
  - キャッシュ期間: データ鮮度に応じて調整

- **クエリ最適化**:
  - GraphQLで必要なフィールドのみ取得
  - REST APIではfieldsパラメータをサポート

- **バッチ処理**:
  - 複数リクエストを1リクエストに集約
  - サーバーサイドでのデータ集計

## 7. 監視・ロギング

### 監視項目
| カテゴリ       | メトリクス                | 閾値           | 通知先         |
|----------------|---------------------------|----------------|----------------|
| 可用性         | アップタイム              | 99.9%          | Slack #alerts  |
| パフォーマンス | LCP (Largest Contentful Paint) | <2.5s     | Email          |
| エラー         | 5xxエラーレート           | <0.1%          | PagerDuty      |
| リソース       | メモリ使用率              | <80%           | Slack #ops     |

### ログ管理
- 構造化ログ
- エラートレース
- パフォーマンスメトリクス
- アクセスログ

## 8. アップデート・メンテナンス

### バージョニング
- Semantic Versioning準拠
- CHANGELOGの自動生成
- Breaking Changesの明示

### メンテナンス計画
- 依存関係の定期更新
- 技術的負債の管理
- パフォーマンス改善
- セキュリティアップデート

## 9. レビュー・品質管理プロセス

### コードレビュー基準
- SOLID原則の遵守
- パフォーマンスへの影響
- セキュリティリスク
- テストカバレッジ

### 定期レビュー項目
- アーキテクチャの評価
- パフォーマンス指標
- セキュリティ状態
- 技術の負債

## 10. ドキュメント管理

### 管理方針
- コードと同じリポジトリで管理
- 自動生成の活用
- バージョン管理の徹底
- 定期的なレビューと更新

### ドキュメント種類
- API仕様書
- コンポーネントカタログ
- 設計ドキュメント
- 運用マニュアル
