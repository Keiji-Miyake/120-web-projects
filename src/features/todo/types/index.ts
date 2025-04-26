/**
 * Todo項目の型定義
 */
export type Todo = {
  id: string
  text: string
  completed: boolean
  createdAt: Date
}

/**
 * TodoListコンポーネントのProps型定義
 */
export type Props = {
  todos: Todo[]
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}