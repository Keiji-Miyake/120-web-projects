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
export type TodoListProps = {
  todos: Todo[]
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

/**
 * TodoFormコンポーネントのProps型定義
 */
export type TodoFormProps = {
  onSubmit: (text: string) => void
}
