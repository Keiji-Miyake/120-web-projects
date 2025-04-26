"use client"

import { useState, memo } from 'react'
import type { TodoFormProps } from '../types'
import { ErrorMessage } from './ErrorMessage'

export const TodoForm = memo(({ onSubmit }: TodoFormProps) => {
  const [text, setText] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (!text.trim()) {
        setError('タスクを入力してください')
        return
      }
      if (text.length > 100) {
        setError('タスクは100文字以内で入力してください')
        return
      }
      onSubmit(text)
      setText('')
      setError('')
    } catch (err) {
      setError('タスクの追加に失敗しました')
    }
  }

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value)
    if (error) setError('')
  }

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      {error && <ErrorMessage message={error} />}
      <div className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={handleTextChange}
          className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          placeholder="新しいタスクを入力"
          aria-label="新しいタスクの入力"
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className={`px-4 py-2 rounded cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
            ${
              text.trim()
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
        >
          追加
        </button>
      </div>
    </form>
  )
})