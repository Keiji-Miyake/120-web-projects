import { TodoApp } from '@/features/todo/components/TodoApp'
import type { Project } from '../types'

const projectData: Project = {
  id: '001',
  title: 'シンプルなTodoアプリ',
  description: 'React + TypeScript + TailwindCSS を使用した基本的なTodoアプリです。タスクの追加、完了、削除などの基本機能を実装しています。',
  component: TodoApp,
}

export default projectData
