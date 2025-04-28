// CSSモジュールをモック
jest.mock('../../components/Calculator.module.css', () => ({
  calculator: 'calculator',
  display: 'display',
  formula: 'formula',
  buttons: 'buttons',
  button: 'button',
  operator: 'operator',
  equals: 'equals',
  clear: 'clear',
  'sr-only': 'sr-only'
}));

import { render, screen, fireEvent } from '@testing-library/react';
import { Calculator } from '../../components/Calculator';

describe('Calculator', () => {
  beforeEach(() => {
    render(<Calculator />);
  });

  describe('初期表示', () => {
    it('ディスプレイに0が表示される', () => {
      const display = screen.getByRole('textbox', { name: '計算結果' });
      expect(display).toHaveValue('0');
    });

    it('数式領域が空で表示される', () => {
      const formula = screen.getByTestId('formula');
      expect(formula).toHaveTextContent('');
    });
  });

  describe('数字の入力', () => {
    it('数字ボタンをクリックすると表示される', () => {
      fireEvent.click(screen.getByRole('button', { name: '1' }));
      const display = screen.getByRole('textbox', { name: '計算結果' });
      expect(display).toHaveValue('1');
    });

    it('複数の数字を続けて入力できる', () => {
      fireEvent.click(screen.getByRole('button', { name: '1' }));
      fireEvent.click(screen.getByRole('button', { name: '2' }));
      fireEvent.click(screen.getByRole('button', { name: '3' }));
      const display = screen.getByRole('textbox', { name: '計算結果' });
      expect(display).toHaveValue('123');
    });
  });

  describe('演算子の入力', () => {
    it('数字の後に演算子を入力すると式が表示される', () => {
      fireEvent.click(screen.getByRole('button', { name: '1' }));
      fireEvent.click(screen.getByRole('button', { name: '+' }));
      const formula = screen.getByTestId('formula');
      const expectedContent = formula.textContent?.trim();
      expect(expectedContent).toBe('1 +');
    });
  });

  describe('計算実行', () => {
    it('=ボタンをクリックすると計算結果が表示される', () => {
      fireEvent.click(screen.getByRole('button', { name: '1' }));
      fireEvent.click(screen.getByRole('button', { name: '+' }));
      fireEvent.click(screen.getByRole('button', { name: '2' }));
      fireEvent.click(screen.getByRole('button', { name: '=' }));
      const display = screen.getByRole('textbox', { name: '計算結果' });
      expect(display).toHaveValue('3');
    });
  });

  describe('クリア機能', () => {
    it('Cボタンをクリックすると表示がクリアされる', () => {
      fireEvent.click(screen.getByRole('button', { name: '1' }));
      fireEvent.click(screen.getByRole('button', { name: 'C' }));
      const display = screen.getByRole('textbox', { name: '計算結果' });
      const formula = screen.getByTestId('formula');
      expect(display).toHaveValue('0');
      expect(formula).toHaveTextContent('');
    });
  });
});
