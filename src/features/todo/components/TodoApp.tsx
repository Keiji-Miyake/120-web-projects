"use client"

import { useState, useCallback, useEffect } from 'react'
import { TodoForm } from './TodoForm'
import { TodoList } from './TodoList'
import { TodoErrorBoundary } from './TodoErrorBoundary'
import type { Todo } from '../types/index'

const FILTERS = [
  { key: 'all', label: 'すべて' },
  { key: 'active', label: '未完了' },
  { key: 'completed', label: '完了済み' },
] as const

type Filter = typeof FILTERS[number]['key']

export const TodoApp = () => {
  const [todos, setTodos] = useState<Todo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<Filter>('all')

  // LocalStorageからの初期化はクライアントサイドでのみ行う
  useEffect(() => {
    const loadTodos = () => {
      try {
        const saved = localStorage.getItem('todos')
        if (saved) {
          const parsedTodos = (JSON.parse(saved) as (Omit<Todo, 'createdAt'> & { createdAt: string })[])
            .map((t) => ({
              id: t.id,
              text: t.text,
              completed: t.completed,
              createdAt: new Date(t.createdAt),
            }))
          setTodos(parsedTodos)
        }
      } catch (error) {
        console.error('Failed to load todos:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadTodos()
  }, [])

  // 変更があった場合にLocalStorageに保存
  useEffect(() => {
    if (!isLoading) {  // 初期ロード時は保存しない
      localStorage.setItem('todos', JSON.stringify(todos))
    }
  }, [todos, isLoading])

  const handleAddTodo = useCallback((text: string) => {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      createdAt: new Date(),
    }
    setTodos((prev) => [newTodo, ...prev])
  }, [])

  const handleToggleTodo = useCallback((id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    )
  }, [])

  const handleDeleteTodo = useCallback((id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id))
  }, [])

  const getFilteredTodos = () => {
    switch (filter) {
      case 'active':
        return todos.filter((t) => !t.completed)
      case 'completed':
        return todos.filter((t) => t.completed)
      default:
        return todos
    }
  }

  // ローディング中はスケルトン表示
  if (isLoading) {
    return (
      <div className="container mx-auto p-4 max-w-2xl animate-pulse">
        <div className="h-8 w-48 bg-gray-200 rounded mb-4" />
        <div className="h-10 bg-gray-200 rounded mb-4" />
        <div className="flex gap-2 mb-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-8 w-20 bg-gray-200 rounded" />
          ))}
        </div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-gray-200 rounded" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <TodoErrorBoundary>
      <div className="container mx-auto p-4 max-w-2xl">
        <h1 className="text-2xl font-bold mb-4">Todoリスト</h1>
        <TodoForm onSubmit={handleAddTodo} />
        <div className="flex gap-2 mb-4">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              className={`filter-btn px-3 py-1 rounded cursor-pointer ${filter === f.key ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
              type="button"
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <TodoList
          todos={getFilteredTodos()}
          onToggle={handleToggleTodo}
          onDelete={handleDeleteTodo}
        />
      </div>
    </TodoErrorBoundary>
  )
}
