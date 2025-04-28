import { test, expect } from '@playwright/test';

// テストのタイムアウトを120秒に設定
test.setTimeout(120000);

test.beforeEach(async ({ page }) => {
  // ベースURLに移動し、ページの読み込みを待機
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');
  await page.waitForLoadState('networkidle');

  // Todoアプリのリンクを見つけて、表示されるまで待機
  const todoLink = page.getByRole('link', { name: 'シンプルなTodoアプリ' });
  await todoLink.waitFor({ state: 'visible', timeout: 30000 });

  // リンクをクリックし、ページ遷移を待機
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle' }),
    todoLink.click()
  ]);

  // 新しいページでTodo入力フィールドが表示されるまで待機
  const todoInput = page.locator('[data-testid="todo-input"]');
  try {
    await todoInput.waitFor({ 
      state: 'visible',
      timeout: 30000 
    });
  } catch (error) {
    // デバッグ情報を収集
    console.error('Todo入力フィールドが見つかりません');
    await page.screenshot({ path: 'test-results/debug-todo-input.png' });
    throw error;
  }
});

test.describe('Todoアプリの基本機能テスト', () => {
  test('新しいTodoを作成できる', async ({ page }) => {
    const todoInput = page.locator('[data-testid="todo-input"]');
    const todoList = page.locator('[data-testid="todo-list"]');

    await todoInput.fill('プレイライトでE2Eテストを実装する');
    await page.keyboard.press('Enter');

    await expect(todoList).toContainText('プレイライトでE2Eテストを実装する', {
      timeout: 10000
    });
  });

  test('複数のTodoを作成・管理できる', async ({ page }) => {
    const todoInput = page.locator('[data-testid="todo-input"]');
    const todoList = page.locator('[data-testid="todo-list"]');

    const todos = ['タスク1', 'タスク2', 'タスク3'];
    for (const todo of todos) {
      await todoInput.fill(todo);
      await page.keyboard.press('Enter');
      await expect(todoList).toContainText(todo, { timeout: 5000 });
    }

    // すべてのTodoが表示されていることを確認
    for (const todo of todos) {
      await expect(todoList).toContainText(todo);
    }
  });

  test('Todoの完了状態を切り替えできる', async ({ page }) => {
    const todoInput = page.locator('[data-testid="todo-input"]');
    const todoList = page.locator('[data-testid="todo-list"]');

    await todoInput.fill('完了状態のテスト');
    await page.keyboard.press('Enter');
    await expect(todoList).toContainText('完了状態のテスト', { timeout: 5000 });

    const checkbox = page.getByRole('checkbox').first();
    await checkbox.waitFor({ state: 'visible', timeout: 5000 });
    
    await checkbox.check();
    await expect(checkbox).toBeChecked();

    await checkbox.uncheck();
    await expect(checkbox).not.toBeChecked();
  });

  test('Todoを削除できる', async ({ page }) => {
    const todoInput = page.locator('[data-testid="todo-input"]');
    const todoList = page.locator('[data-testid="todo-list"]');

    await todoInput.fill('削除するタスク');
    await page.keyboard.press('Enter');
    await expect(todoList).toContainText('削除するタスク', { timeout: 5000 });

    const todoItem = page.locator('[data-testid="todo-item"]').first();
    await todoItem.hover();

    const deleteButton = page.getByRole('button', { name: '削除' });
    await deleteButton.waitFor({ state: 'visible', timeout: 5000 });
    await deleteButton.click();

    await expect(todoList).not.toContainText('削除するタスク', { timeout: 5000 });
  });

  test('空のTodoは作成できない', async ({ page }) => {
    const todoInput = page.locator('[data-testid="todo-input"]');
    const todoList = page.locator('[data-testid="todo-list"]');
    
    // 初期状態のTodo数を記録
    await todoList.waitFor({ state: 'visible', timeout: 5000 });
    const initialTodoCount = await todoList.locator('[data-testid="todo-item"]').count();

    // 空文字でEnterを押す
    await todoInput.fill('');
    await page.keyboard.press('Enter');

    // Todo数が変わっていないことを確認
    const currentTodoCount = await todoList.locator('[data-testid="todo-item"]').count();
    expect(currentTodoCount).toBe(initialTodoCount);
  });

  test('長いTodoの表示が適切に処理される', async ({ page }) => {
    const todoInput = page.locator('[data-testid="todo-input"]');
    const todoList = page.locator('[data-testid="todo-list"]');

    const longTodo = 'a'.repeat(100);
    await todoInput.fill(longTodo);
    await page.keyboard.press('Enter');

    const todoItem = page.locator('[data-testid="todo-item"]').first();
    await expect(todoItem).toBeVisible({ timeout: 5000 });
    
    // 表示が崩れていないことを視覚的に確認
    await todoItem.screenshot({ path: 'test-results/long-todo.png' });
  });
});
