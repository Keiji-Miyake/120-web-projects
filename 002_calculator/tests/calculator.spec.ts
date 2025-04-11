import { test, expect } from '@playwright/test';

// 電卓アプリの基本的な機能テスト
test.describe('電卓アプリのテスト', () => {
  // 各テスト前にページを開く
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('初期表示が0であることを確認', async ({ page }) => {
    const display = await page.locator('#display');
    await expect(display).toHaveValue('0');
  });

  test('数字ボタンをクリックすると表示されることを確認', async ({ page }) => {
    // 数字の5をクリック
    await page.locator('#num5').click();
    const display = await page.locator('#display');
    await expect(display).toHaveValue('5');
  });

  test('複数の数字ボタンをクリックすると連結されることを確認', async ({ page }) => {
    // 数字の1, 2, 3をクリック
    await page.locator('#num1').click();
    await page.locator('#num2').click();
    await page.locator('#num3').click();
    const display = await page.locator('#display');
    await expect(display).toHaveValue('123');
  });

  test('足し算の計算が正しいことを確認', async ({ page }) => {
    // 2 + 3 = 5 の計算
    await page.locator('#num2').click();
    await page.locator('#add').click();
    await page.locator('#num3').click();
    await page.locator('#equals').click();
    const display = await page.locator('#display');
    await expect(display).toHaveValue('5');
  });

  test('引き算の計算が正しいことを確認', async ({ page }) => {
    // 8 - 3 = 5 の計算
    await page.locator('#num8').click();
    await page.locator('#subtract').click();
    await page.locator('#num3').click();
    await page.locator('#equals').click();
    const display = await page.locator('#display');
    await expect(display).toHaveValue('5');
  });

  test('掛け算の計算が正しいことを確認', async ({ page }) => {
    // 2 * 3 = 6 の計算
    await page.locator('#num2').click();
    await page.locator('#multiply').click();
    await page.locator('#num3').click();
    await page.locator('#equals').click();
    const display = await page.locator('#display');
    await expect(display).toHaveValue('6');
  });

  test('割り算の計算が正しいことを確認', async ({ page }) => {
    // 6 / 2 = 3 の計算
    await page.locator('#num6').click();
    await page.locator('#divide').click();
    await page.locator('#num2').click();
    await page.locator('#equals').click();
    const display = await page.locator('#display');
    await expect(display).toHaveValue('3');
  });

  test('クリアボタンが正しく動作することを確認', async ({ page }) => {
    // 数字を入力してからクリア
    await page.locator('#num5').click();
    await page.locator('#num6').click();
    await page.locator('#clear').click();
    const display = await page.locator('#display');
    await expect(display).toHaveValue('0');
  });

  test('連続した計算が正しく動作することを確認', async ({ page }) => {
    // 2 + 3 = 5, その後 * 2 = 10 の連続計算
    await page.locator('#num2').click();
    await page.locator('#add').click();
    await page.locator('#num3').click();
    await page.locator('#equals').click();
    await page.locator('#multiply').click();
    await page.locator('#num2').click();
    await page.locator('#equals').click();
    const display = await page.locator('#display');
    await expect(display).toHaveValue('10');
  });
});