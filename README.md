# 120 Web Projects

## 概要

このリポジトリは、初心者から上級者までを対象とした120個のWebプロジェクトを集約したモノレポジトリです。各プロジェクトは独立したディレクトリで管理され、実践的なWeb開発スキルの習得を目的としています。

## 特徴

- **モノレポ構成**：複数のWebアプリやツールを一元管理
- **技術スタック**：Next.js, TypeScript, Tailwind CSS, ESLint, Prettier など
- **難易度別プロジェクト**：初心者向けから上級者向けまで幅広くカバー
- **ドキュメント充実**：進捗や設計方針は[`memory_bank/`](memory_bank)配下に記録

## ディレクトリ構成例

```tree
002_calculator/      # サンプルプロジェクト（電卓アプリ）
memory_bank/         # ドキュメント・進捗管理
public/              # 静的ファイル
src/                 # 共通ライブラリ・ユーティリティ
...
```

## セットアップ

```bash
git clone <このリポジトリのURL>
cd 120-web-projects
pnpm install
```

## プロジェクトの追加例

```bash
mkdir -p apps/projects/001_todo-app
cd apps/projects/001_todo-app
pnpm create next-app . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

## 進捗・計画

- [プロジェクト計画一覧](memory_bank/projects.md)
- [進捗状況](memory_bank/progress.md)
- [アクティブコンテキスト](memory_bank/activeContext.md)

## ライセンス

MIT
