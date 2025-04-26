import { test, expect } from '@playwright/test';

test('Todo機能の基本的な操作テスト', async ({ page }) => {
  // アプリケーションにアクセス
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.waitForLoadState('domcontentloaded');
  
  // プロジェクトページに移動
  const todoLink = await page.getByRole('link', { name: 'シンプルなTodoアプリ' });
  await todoLink.waitFor({ state: 'visible' });
  await todoLink.click();

  // ページ遷移後の読み込み完了を待機
  await page.waitForLoadState('networkidle');
  await page.waitForLoadState('domcontentloaded');

  // 入力フィールドの表示を明示的に待つ
  const todoInput = page.locator('[data-testid="todo-input"]');
  await todoInput.waitFor({ state: 'visible', timeout: 10000 });

  // Todoの追加
  await todoInput.fill('プレイライトでE2Eテストを実装する');
  await page.keyboard.press('Enter');

  // Todoリストの表示を待つ
  const todoList = page.locator('[data-testid="todo-list"]');
  await todoList.waitFor({ state: 'visible' });
  
  // Todoが追加されたことを確認
  await expect(todoList).toContainText('プレイライトでE2Eテストを実装する');

  // 完了状態の切り替え
  const checkbox = page.getByRole('checkbox').first();
  await checkbox.waitFor({ state: 'visible' });
  await checkbox.click();
  await expect(checkbox).toBeChecked();

  // Todo削除ボタンの表示を待機し、削除を実行
  const todoItem = page.locator('[data-testid="todo-item"]').first();
  await todoItem.hover();
  
  const deleteButton = page.getByRole('button', { name: '削除' });
  await deleteButton.waitFor({ state: 'visible' });
  await deleteButton.click();

  // Todoが削除されたことを確認
  await expect(todoList).not.toContainText('プレイライトでE2Eテストを実装する');
});