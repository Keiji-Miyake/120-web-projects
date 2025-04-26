import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { TodoList } from '../../components/TodoList'
import type { Todo, Props } from '../../types'

describe('TodoList', () => {
  const mockTodos: Todo[] = [
    { id: '1', text: 'タスク1', completed: false, createdAt: new Date() },
    { id: '2', text: 'タスク2', completed: true, createdAt: new Date() },
  ]

  const mockHandlers: Pick<Props, 'onToggle' | 'onDelete'> = {
    onToggle: jest.fn(),
    onDelete: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('空の状態を正しく表示する', () => {
    render(<TodoList todos={[]} onToggle={mockHandlers.onToggle} onDelete={mockHandlers.onDelete} />)
    expect(screen.getByText('タスクがありません')).toBeInTheDocument()
  })

  it('Todoリストを正しく表示する', () => {
    render(<TodoList todos={mockTodos} onToggle={mockHandlers.onToggle} onDelete={mockHandlers.onDelete} />)

    // タスクテキストの表示確認
    expect(screen.getByText('タスク1')).toBeInTheDocument()
    expect(screen.getByText('タスク2')).toBeInTheDocument()

    // チェックボックスの状態確認
    const checkboxes = screen.getAllByRole('checkbox')
    expect(checkboxes[0]).not.toBeChecked()
    expect(checkboxes[1]).toBeChecked()

    // 削除ボタンの存在確認
    const deleteButtons = screen.getAllByRole('button', { name: /を削除/ })
    expect(deleteButtons).toHaveLength(2)
  })

  it('チェックボックスのクリックで onToggle が呼ばれる', () => {
    render(<TodoList todos={mockTodos} onToggle={mockHandlers.onToggle} onDelete={mockHandlers.onDelete} />)

    const firstCheckbox = screen.getAllByRole('checkbox')[0]
    fireEvent.click(firstCheckbox)

    expect(mockHandlers.onToggle).toHaveBeenCalledTimes(1)
    expect(mockHandlers.onToggle).toHaveBeenCalledWith('1')
  })

  it('削除ボタンのクリックで onDelete が呼ばれる', () => {
    render(<TodoList todos={mockTodos} onToggle={mockHandlers.onToggle} onDelete={mockHandlers.onDelete} />)

    const firstDeleteButton = screen.getAllByRole('button', { name: /を削除/ })[0]
    fireEvent.click(firstDeleteButton)

    expect(mockHandlers.onDelete).toHaveBeenCalledTimes(1)
    expect(mockHandlers.onDelete).toHaveBeenCalledWith('1')
  })

  it('完了状態に応じてテキストスタイルが変更される', () => {
    render(<TodoList todos={mockTodos} onToggle={mockHandlers.onToggle} onDelete={mockHandlers.onDelete} />)

    // 未完了タスクのスタイル確認
    const incompleteText = screen.getByText('タスク1')
    expect(incompleteText).toHaveStyle({
      textDecoration: 'none',
      color: '#111827',
    })

    // 完了タスクのスタイル確認
    const completeText = screen.getByText('タスク2')
    expect(completeText).toHaveStyle({
      textDecoration: 'line-through',
      color: '#6B7280',
    })
  })

  it('アクセシビリティ属性が適切に設定されている', () => {
    render(<TodoList todos={mockTodos} onToggle={mockHandlers.onToggle} onDelete={mockHandlers.onDelete} />)

    // チェックボックスのアクセシビリティ
    expect(screen.getByLabelText('タスク1を完了としてマーク')).toBeInTheDocument()
    expect(screen.getByLabelText('タスク2を完了としてマーク')).toBeInTheDocument()

    // 削除ボタンのアクセシビリティ
    expect(screen.getByRole('button', { name: 'タスク1を削除' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'タスク2を削除' })).toBeInTheDocument()
  })
})
