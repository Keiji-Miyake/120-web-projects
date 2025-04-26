import type { Target } from 'framer-motion'

// カラー定数
const COLORS = {
  text: {
    primary: '#111827',
    secondary: '#6B7280',
  },
} as const

// テキストスタイル
const TEXT_STYLES = {
  default: {
    color: COLORS.text.primary,
    textDecoration: 'none' as const,
  },
  completed: {
    color: COLORS.text.secondary,
    textDecoration: 'line-through' as const,
  },
} as const

// アニメーションの型定義
type BaseAnimation = {
  opacity?: number
  y?: number
  x?: number
  scale?: number
}

// アニメーション状態の型定義
type AnimationState = {
  hidden: BaseAnimation
  visible: BaseAnimation
  exit?: BaseAnimation
  hover?: BaseAnimation
  tap?: BaseAnimation
}

// トランジション設定の型定義
type TodoTransition = {
  duration: number
}

export type TodoTransitions = {
  default: TodoTransition
  quick: TodoTransition
}

// 各要素のアニメーション設定の型定義
export type TodoAnimations = {
  empty: Pick<AnimationState, 'hidden' | 'visible'>
  item: Required<Pick<AnimationState, 'hidden' | 'visible' | 'exit' | 'hover'>>
  checkbox: Required<Pick<AnimationState, 'hover' | 'tap'>>
  text: typeof TEXT_STYLES
  button: Required<Pick<AnimationState, 'hover' | 'tap'>>
}

export type TodoAnimationResult = {
  animations: TodoAnimations
  transitions: TodoTransitions
}

/**
 * Todoリストのアニメーション設定を提供するカスタムフック
 *
 * @returns アニメーションとトランジションの設定
 */
export const useTodoAnimations = (): TodoAnimationResult => {
  const transitions: TodoTransitions = {
    default: { duration: 0.2 },
    quick: { duration: 0.1 },
  }

  const animations: TodoAnimations = {
    empty: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    },
    item: {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
      exit: { opacity: 0, x: -100 },
      hover: { scale: 1.02 },
    },
    checkbox: {
      hover: { scale: 1.05 },
      tap: { scale: 0.9 },
    },
    text: TEXT_STYLES,
    button: {
      hover: { scale: 1.05 },
      tap: { scale: 0.95 },
    },
  }

  return {
    animations,
    transitions,
  }
}