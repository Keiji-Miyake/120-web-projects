import { Calculator } from '@/features/calculator/components/Calculator'
import type { Project } from '../types'

const project: Project = {
  id: '002',
  title: '電卓アプリ',
  description: 'シンプルな電卓アプリケーション。基本的な四則演算を実行できます。高コントラストで視認性を確保し、アクセシビリティに配慮した設計です。',
  component: Calculator ,
  technologies: ['React', 'TypeScript', 'CSS Modules'],
  features: [
    '四則演算（加算、減算、乗算、除算）',
    'クリア機能',
    '小数点計算対応',
    'エラーハンドリング',
    'アクセシビリティ対応（高コントラスト、キーボード操作）'
  ]
}

export default project
