"use client"

import { memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTodoAnimations } from '../hooks/useTodoAnimations'
import { TodoItem } from './TodoItem'
import type { Props } from '../types'

/**
 * Todoリストを表示するコンポーネント
 * アニメーション付きのリストアイテム、チェックボックス、削除ボタンを含む
 */
export const TodoList = memo(({ todos, onToggle, onDelete }: Props) => {
  const { animations, transitions } = useTodoAnimations()

  return (
    <motion.ul className="space-y-2">
      <AnimatePresence mode="popLayout" initial={false}>
        {todos.length === 0 ? (
          <motion.li
            key="empty"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={animations.empty}
            transition={transitions.default}
            className="p-4 text-center text-gray-500 bg-gray-50 rounded"
          >
            タスクがありません
          </motion.li>
        ) : (
          todos.map((todo) => (
            <motion.div
              key={todo.id}
              initial="hidden"
              animate="visible"
              exit="exit"
              whileHover="hover"
              variants={animations.item}
              transition={transitions.default}
            >
              <TodoItem todo={todo} onToggle={onToggle} onDelete={onDelete} />
            </motion.div>
          ))
        )}
      </AnimatePresence>
    </motion.ul>
  )
})
