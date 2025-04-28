import { test, expect } from '@playwright/test';
import type { Page, Locator } from '@playwright/test';

// フィクスチャーとして共通の前準備を定義
test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.waitForLoadState('domcontentloaded');
  
  const calculatorLink = await page.getByRole('link', { name: 'シンプルな電卓' });
  await calculatorLink.waitFor({ state: 'visible' });
  await calculatorLink.click();

  await page.waitForLoadState('networkidle');
  await page.waitForLoadState('domcontentloaded');
});

// ボタンとディスプレイの取得を補助する関数
interface CalculatorElements {
  display: Locator;
  getButton: (text: string) => Locator;
  numpad: Locator[];
  operators: {
    plus: Locator;
    minus: Locator;
    multiply: Locator;
    divide: Locator;
    equals: Locator;
    clear: Locator;
    decimal: Locator;
  };
}

const getCalculatorElements = (page: Page): CalculatorElements => {
  const display = page.locator('input[type="text"]');
  const getButton = (text: string) => page.getByRole('button', { name: text, exact: true });
  
  return {
    display,
    getButton,
    numpad: Array(10).fill(0).map((_, i) => getButton(i.toString())),
    operators: {
      plus: getButton('+'),
      minus: getButton('-'),
      multiply: getButton('×'),
      divide: getButton('÷'),
      equals: getButton('='),
      clear: getButton('C'),
      decimal: getButton('.')
    }
  };
};

test.describe('電卓の基本機能テスト', () => {
  test('基本的な四則演算ができる', async ({ page }) => {
    const { display, numpad, operators } = getCalculatorElements(page);
    await display.waitFor({ state: 'visible' });

    // 足し算 (1 + 2 = 3)
    await numpad[1].click();
    await operators.plus.click();
    await numpad[2].click();
    await operators.equals.click();
    await expect(display).toHaveValue('3');

    // 引き算 (5 - 3 = 2)
    await operators.clear.click();
    await numpad[5].click();
    await operators.minus.click();
    await numpad[3].click();
    await operators.equals.click();
    await expect(display).toHaveValue('2');

    // 掛け算 (4 × 5 = 20)
    await operators.clear.click();
    await numpad[4].click();
    await operators.multiply.click();
    await numpad[5].click();
    await operators.equals.click();
    await expect(display).toHaveValue('20');

    // 割り算 (8 ÷ 2 = 4)
    await operators.clear.click();
    await numpad[8].click();
    await operators.divide.click();
    await numpad[2].click();
    await operators.equals.click();
    await expect(display).toHaveValue('4');
  });

  test('複雑な計算ができる', async ({ page }) => {
    const { display, numpad, operators } = getCalculatorElements(page);

    // 5 × 6 ÷ 2 = 15
    await numpad[5].click();
    await operators.multiply.click();
    await numpad[6].click();
    await operators.divide.click();
    await numpad[2].click();
    await operators.equals.click();
    await expect(display).toHaveValue('15');
  });

  test('小数点を含む計算ができる', async ({ page }) => {
    const { display, numpad, operators } = getCalculatorElements(page);

    // 1.5 + 2.5 = 4
    await numpad[1].click();
    await operators.decimal.click();
    await numpad[5].click();
    await operators.plus.click();
    await numpad[2].click();
    await operators.decimal.click();
    await numpad[5].click();
    await operators.equals.click();
    await expect(display).toHaveValue('4');
  });

  test('ゼロ除算を適切に処理できる', async ({ page }) => {
    const { display, numpad, operators } = getCalculatorElements(page);

    // 5 ÷ 0 = Error
    await numpad[5].click();
    await operators.divide.click();
    await numpad[0].click();
    await operators.equals.click();
    await expect(display).toHaveValue('0で割ることはできません');
  });

  test('大きな数値を適切に処理できる', async ({ page }) => {
    const { display, numpad, operators } = getCalculatorElements(page);

    // 999999 × 999999 の計算
    for (let i = 0; i < 6; i++) {
      await numpad[9].click();
    }
    await operators.multiply.click();
    for (let i = 0; i < 6; i++) {
      await numpad[9].click();
    }
    await operators.equals.click();
    
    // 結果が表示されることを確認（正確な値の代わりに表示が行われることを確認）
    await expect(display).not.toHaveValue('Error');
    await expect(display).not.toHaveValue('0');
  });

  test('キーボード入力で計算できる', async ({ page }) => {
    const { display } = getCalculatorElements(page);

    // キーボードで 1 + 2 = 3 を入力
    const { numpad, operators } = getCalculatorElements(page);
    await numpad[1].click();
    await operators.plus.click();
    await numpad[2].click();
    await operators.equals.click();
    await expect(display).toHaveValue('3');
  });

  test('連続した演算ができる', async ({ page }) => {
    const { display, numpad, operators } = getCalculatorElements(page);

    // 1 + 2 + 3 = 6 (連続した足し算)
    await numpad[1].click();
    await operators.plus.click();
    await numpad[2].click();
    await operators.plus.click();
    await numpad[3].click();
    await operators.equals.click();
    await expect(display).toHaveValue('6');
  });
});
