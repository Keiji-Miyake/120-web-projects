import { test, expect } from '@playwright/test';

test('電卓の基本的な操作テスト', async ({ page }) => {
  // アプリケーションにアクセス
  await page.goto('/');
  
  // 確実にページの読み込みを待機
  await page.waitForLoadState('networkidle');
  await page.waitForLoadState('domcontentloaded');
  
  // 電卓ページに移動
  const calculatorLink = await page.getByRole('link', { name: 'シンプルな電卓' });
  await calculatorLink.waitFor({ state: 'visible' });
  await calculatorLink.click();
  
  // ページ遷移後の読み込み完了を待機
  await page.waitForLoadState('networkidle');
  await page.waitForLoadState('domcontentloaded');

  // 入力フィールドの表示を待つ
  const display = page.locator('input[type="text"]');
  await display.waitFor({ state: 'visible', timeout: 10000 });

  // 簡単な足し算のテスト（1 + 2 = 3）
  // 各ボタンの存在確認
  const button1 = page.locator('button:has-text("1")');
  const buttonPlus = page.locator('button:has-text("+")');
  const button2 = page.locator('button:has-text("2")');
  const buttonEquals = page.locator('button:has-text("=")');

  await button1.waitFor({ state: 'visible' });
  await buttonPlus.waitFor({ state: 'visible' });
  await button2.waitFor({ state: 'visible' });
  await buttonEquals.waitFor({ state: 'visible' });

  await button1.click();
  await buttonPlus.click();
  await button2.click();
  await buttonEquals.click();

  // 結果が3であることを確認（タイムアウトを設定）
  await expect(display).toHaveValue('3', { timeout: 5000 });

  // クリアボタンの確認
  const clearButton = page.locator('button:has-text("C")');
  await clearButton.waitFor({ state: 'visible' });
  await clearButton.click();
  await expect(display).toHaveValue('0');

  // より複雑な計算（5 × 6 ÷ 2 = 15）
  const button5 = page.locator('button:has-text("5")');
  const buttonMultiply = page.locator('button:has-text("×")');
  const button6 = page.locator('button:has-text("6")');
  const buttonDivide = page.locator('button:has-text("÷")');

  await button5.waitFor({ state: 'visible' });
  await buttonMultiply.waitFor({ state: 'visible' });
  await button6.waitFor({ state: 'visible' });
  await buttonDivide.waitFor({ state: 'visible' });

  await button5.click();
  await buttonMultiply.click();
  await button6.click();
  await buttonDivide.click();
  await button2.click();
  await buttonEquals.click();

  // 結果が15であることを確認
  await expect(display).toHaveValue('15', { timeout: 5000 });

  // 小数点を含む計算（1.5 + 2.5 = 4）
  await clearButton.click();
  const buttonDecimal = page.locator('button:has-text(".")');
  await buttonDecimal.waitFor({ state: 'visible' });

  await button1.click();
  await buttonDecimal.click();
  await button5.click();
  await buttonPlus.click();
  await button2.click();
  await buttonDecimal.click();
  await button5.click();
  await buttonEquals.click();

  // 結果が4であることを確認
  await expect(display).toHaveValue('4', { timeout: 5000 });
});
