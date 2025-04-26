import { render, screen, fireEvent } from '@testing-library/react';
import { Calculator } from '../../components/Calculator';

describe('Calculator', () => {
  beforeEach(() => {
    render(<Calculator />);
  });

  describe('初期表示', () => {
    test('ディスプレイに0が表示される', () => {
      const display = screen.getByRole('textbox');
      expect(display).toHaveValue('0');
    });

    test('数式が空で表示される', () => {
      const formula = screen.getByRole('generic', { name: /formula/i });
      expect(formula).toHaveTextContent('');
    });
  });

  describe('数字の入力', () => {
    test('数字をクリックすると表示される', () => {
      const button = screen.getByRole('button', { name: '1' });
      fireEvent.click(button);
      const display = screen.getByRole('textbox');
      expect(display).toHaveValue('1');
    });

    test('連続して数字をクリックすると結合される', () => {
      const button1 = screen.getByRole('button', { name: '1' });
      const button2 = screen.getByRole('button', { name: '2' });
      fireEvent.click(button1);
      fireEvent.click(button2);
      const display = screen.getByRole('textbox');
      expect(display).toHaveValue('12');
    });

    test('小数点を入力できる', () => {
      const button1 = screen.getByRole('button', { name: '1' });
      const dotButton = screen.getByRole('button', { name: '.' });
      const button2 = screen.getByRole('button', { name: '5' });
      fireEvent.click(button1);
      fireEvent.click(dotButton);
      fireEvent.click(button2);
      const display = screen.getByRole('textbox');
      expect(display).toHaveValue('1.5');
    });

    test('同じ数字に2つの小数点は入力できない', () => {
      const button1 = screen.getByRole('button', { name: '1' });
      const dotButton = screen.getByRole('button', { name: '.' });
      const button2 = screen.getByRole('button', { name: '5' });
      fireEvent.click(button1);
      fireEvent.click(dotButton);
      fireEvent.click(button2);
      fireEvent.click(dotButton);
      const display = screen.getByRole('textbox');
      expect(display).toHaveValue('1.5');
    });

    test('15桁を超える数値は入力できない', () => {
      const button1 = screen.getByRole('button', { name: '1' });
      for (let i = 0; i < 16; i++) {
        fireEvent.click(button1);
      }
      const display = screen.getByRole('textbox');
      expect(display).toHaveValue('111111111111111');
    });
  });

  describe('演算子の入力', () => {
    test('数字の後に演算子をクリックすると数式に追加される', () => {
      const numberButton = screen.getByRole('button', { name: '1' });
      const operatorButton = screen.getByRole('button', { name: '+' });
      fireEvent.click(numberButton);
      fireEvent.click(operatorButton);
      const formula = screen.getByRole('generic', { name: /formula/i });
      expect(formula).toHaveTextContent('1 + ');
    });
  });

  describe('計算実行', () => {
    test('足し算が正しく実行される', () => {
      const button1 = screen.getByRole('button', { name: '2' });
      const plusButton = screen.getByRole('button', { name: '+' });
      const button2 = screen.getByRole('button', { name: '3' });
      const equalsButton = screen.getByRole('button', { name: '=' });

      fireEvent.click(button1);
      fireEvent.click(plusButton);
      fireEvent.click(button2);
      fireEvent.click(equalsButton);

      const display = screen.getByRole('textbox');
      expect(display).toHaveValue('5');
    });

    test('引き算が正しく実行される', () => {
      const button1 = screen.getByRole('button', { name: '5' });
      const minusButton = screen.getByRole('button', { name: '-' });
      const button2 = screen.getByRole('button', { name: '3' });
      const equalsButton = screen.getByRole('button', { name: '=' });

      fireEvent.click(button1);
      fireEvent.click(minusButton);
      fireEvent.click(button2);
      fireEvent.click(equalsButton);

      const display = screen.getByRole('textbox');
      expect(display).toHaveValue('2');
    });

    test('掛け算が正しく実行される', () => {
      const button1 = screen.getByRole('button', { name: '4' });
      const multiplyButton = screen.getByRole('button', { name: '×' });
      const button2 = screen.getByRole('button', { name: '3' });
      const equalsButton = screen.getByRole('button', { name: '=' });

      fireEvent.click(button1);
      fireEvent.click(multiplyButton);
      fireEvent.click(button2);
      fireEvent.click(equalsButton);

      const display = screen.getByRole('textbox');
      expect(display).toHaveValue('12');
    });

    test('割り算が正しく実行される', () => {
      const button1 = screen.getByRole('button', { name: '6' });
      const divideButton = screen.getByRole('button', { name: '÷' });
      const button2 = screen.getByRole('button', { name: '2' });
      const equalsButton = screen.getByRole('button', { name: '=' });

      fireEvent.click(button1);
      fireEvent.click(divideButton);
      fireEvent.click(button2);
      fireEvent.click(equalsButton);

      const display = screen.getByRole('textbox');
      expect(display).toHaveValue('3');
    });

    test('小数の計算が正しく実行される', () => {
      const button1 = screen.getByRole('button', { name: '1' });
      const dotButton = screen.getByRole('button', { name: '.' });
      const button5 = screen.getByRole('button', { name: '5' });
      const plusButton = screen.getByRole('button', { name: '+' });
      const button2 = screen.getByRole('button', { name: '2' });
      const equalsButton = screen.getByRole('button', { name: '=' });

      fireEvent.click(button1);
      fireEvent.click(dotButton);
      fireEvent.click(button5);
      fireEvent.click(plusButton);
      fireEvent.click(button2);
      fireEvent.click(equalsButton);

      const display = screen.getByRole('textbox');
      expect(display).toHaveValue('3.5');
    });

    test('0での割り算がエラーになる', () => {
      const button1 = screen.getByRole('button', { name: '6' });
      const divideButton = screen.getByRole('button', { name: '÷' });
      const button2 = screen.getByRole('button', { name: '0' });
      const equalsButton = screen.getByRole('button', { name: '=' });

      fireEvent.click(button1);
      fireEvent.click(divideButton);
      fireEvent.click(button2);
      fireEvent.click(equalsButton);

      const display = screen.getByRole('textbox');
      expect(display).toHaveValue('Error');
    });

    test('無効な式でエラーになる', () => {
      const button1 = screen.getByRole('button', { name: '6' });
      const equalsButton = screen.getByRole('button', { name: '=' });

      fireEvent.click(button1);
      fireEvent.click(equalsButton);

      const display = screen.getByRole('textbox');
      expect(display).toHaveValue('エラー');
    });
  });

  describe('クリア機能', () => {
    test('Cボタンを押すと表示がクリアされる', () => {
      const button = screen.getByRole('button', { name: '1' });
      const clearButton = screen.getByRole('button', { name: 'C' });
      
      fireEvent.click(button);
      fireEvent.click(clearButton);

      const display = screen.getByRole('textbox');
      const formula = screen.getByRole('generic', { name: /formula/i });
      
      expect(display).toHaveValue('0');
      expect(formula).toHaveTextContent('');
    });
  });

  describe('キーボード入力', () => {
    test('数字キーを押すと表示される', () => {
      fireEvent.keyDown(window, { key: '1' });
      const display = screen.getByRole('textbox');
      expect(display).toHaveValue('1');
    });

    test('演算子キーを押すと数式に追加される', () => {
      fireEvent.keyDown(window, { key: '1' });
      fireEvent.keyDown(window, { key: '+' });
      const formula = screen.getByRole('generic', { name: /formula/i });
      expect(formula).toHaveTextContent('1 + ');
    });

    test('Enterキーで計算が実行される', () => {
      fireEvent.keyDown(window, { key: '2' });
      fireEvent.keyDown(window, { key: '+' });
      fireEvent.keyDown(window, { key: '3' });
      fireEvent.keyDown(window, { key: 'Enter' });
      const display = screen.getByRole('textbox');
      expect(display).toHaveValue('5');
    });

    test('Escapeキーで表示がクリアされる', () => {
      fireEvent.keyDown(window, { key: '1' });
      fireEvent.keyDown(window, { key: 'Escape' });
      const display = screen.getByRole('textbox');
      const formula = screen.getByRole('generic', { name: /formula/i });
      expect(display).toHaveValue('0');
      expect(formula).toHaveTextContent('');
    });
  });
});
