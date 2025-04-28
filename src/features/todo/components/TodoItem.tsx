"use client"

import type { Todo } from '../types'

interface Props {
  todo: Todo
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

export const TodoItem = ({ todo, onToggle, onDelete }: Props) => {
  return (
    <div className="flex items-center gap-2 p-2 border rounded" data-testid="todo-item">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        className="h-4 w-4"
        data-testid="todo-checkbox"
        aria-label={`${todo.text}を完了としてマーク`}
      />
      <span
        className={`flex-1 ${todo.completed ? 'line-through text-gray-500' : ''}`}
      >
        {todo.text}
      </span>
      <button
        type="button"
        onClick={() => onDelete(todo.id)}
        className="flex items-center gap-1 px-2 py-1 rounded bg-red-500 text-white hover:bg-red-700 transition-colors cursor-pointer"
        data-testid="todo-delete-button"
        title="このタスクを削除"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
        {`${todo.text}を削除`}
      </button>
    </div>
  )
}
