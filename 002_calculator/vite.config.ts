import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  // プロジェクトのルートディレクトリ
  root: '.',

  // ビルド設定
  build: {
    // 出力ディレクトリ
    outDir: 'dist',
    // ソースマップを生成
    sourcemap: true,
  },

  // 開発サーバー設定
  server: {
    // ポート番号
    port: 3000,
    // ホットリロードを有効化
    hmr: true,
    },


  // TypeScript関連の設定
  resolve: {
    // TypeScriptの拡張子を解決
    extensions: ['.ts', '.js', '.json'],
  }
})