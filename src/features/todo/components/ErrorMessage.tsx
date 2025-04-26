"use client"

import { memo } from 'react'

type Props = {
  message: string
}

export const ErrorMessage = memo(({ message }: Props) => {
  return (
    <div
      role="alert"
      className="p-4 mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 animate-fade-in"
    >
      <p className="font-medium">エラー</p>
      <p>{message}</p>
    </div>
  )
})