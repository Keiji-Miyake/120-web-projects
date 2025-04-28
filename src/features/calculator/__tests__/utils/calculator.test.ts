import { Calculator, CalculationError } from '../../calculator';

describe('連続計算のテスト', () => {
  let calculator: Calculator;

  beforeEach(() => {
    calculator = new Calculator();
  });

  test('3つの数値の加算が正しく計算される', () => {
    calculator.inputDigit('8');
    calculator.inputOperator('+');
    calculator.inputDigit('8');
    calculator.inputOperator('+');
    calculator.inputDigit('8');
    
    const result = calculator.performCalculation();
    expect(result).toContain('8 + 16 + 8 =');
    expect(calculator.getDisplay()).toBe('24');
  });

  test('複数の演算子を含む計算が正しく処理される', () => {
    calculator.inputDigit('10');
    calculator.inputOperator('*');
    calculator.inputDigit('2');
    calculator.inputOperator('-');
    calculator.inputDigit('5');
    
    const result = calculator.performCalculation();
    expect(result).toContain('10 * 20 - 5 =');
    expect(calculator.getDisplay()).toBe('15');
  });
});
describe('Calculator', () => {
    let calculator: Calculator;

    beforeEach(() => {
        calculator = new Calculator();
    });

    describe('初期状態', () => {
        it('表示が0から始まる', () => {
            expect(calculator.getDisplay()).toBe('0');
        });

        it('数式が空の状態から始まる', () => {
            expect(calculator.getFormula()).toBe('');
        });
    });

    describe('数字の入力', () => {
        it('一桁の数字を入力できる', () => {
            calculator.inputDigit('5');
            expect(calculator.getDisplay()).toBe('5');
        });

        it('複数桁の数字を入力できる', () => {
            calculator.inputDigit('1');
            calculator.inputDigit('2');
            calculator.inputDigit('3');
            expect(calculator.getDisplay()).toBe('123');
        });

        it('先頭の0は上書きされる', () => {
            calculator.inputDigit('0');
            calculator.inputDigit('5');
            expect(calculator.getDisplay()).toBe('5');
        });
    });

    describe('演算処理', () => {
        describe('足し算', () => {
            it('基本的な足し算を実行できる', () => {
                calculator.inputDigit('5');
                calculator.inputOperator('+');
                calculator.inputDigit('3');
                calculator.performCalculation();
                expect(calculator.getDisplay()).toBe('8');
            });

            it('連続した足し算を実行できる', () => {
                calculator.inputDigit('5');
                calculator.inputOperator('+');
                calculator.inputDigit('3');
                calculator.inputOperator('+');
                calculator.inputDigit('2');
                calculator.performCalculation();
                expect(calculator.getDisplay()).toBe('10');
            });
        });

        describe('引き算', () => {
            it('基本的な引き算を実行できる', () => {
                calculator.inputDigit('8');
                calculator.inputOperator('-');
                calculator.inputDigit('3');
                calculator.performCalculation();
                expect(calculator.getDisplay()).toBe('5');
            });

            it('連続した引き算を実行できる', () => {
                calculator.inputDigit('10');
                calculator.inputOperator('-');
                calculator.inputDigit('3');
                calculator.inputOperator('-');
                calculator.inputDigit('2');
                calculator.performCalculation();
                expect(calculator.getDisplay()).toBe('5');
            });
        });

        describe('掛け算', () => {
            it('基本的な掛け算を実行できる', () => {
                calculator.inputDigit('4');
                calculator.inputOperator('*');
                calculator.inputDigit('3');
                calculator.performCalculation();
                expect(calculator.getDisplay()).toBe('12');
            });

            it('連続した掛け算を実行できる', () => {
                calculator.inputDigit('2');
                calculator.inputOperator('*');
                calculator.inputDigit('3');
                calculator.inputOperator('*');
                calculator.inputDigit('4');
                calculator.performCalculation();
                expect(calculator.getDisplay()).toBe('24');
            });
        });

        describe('割り算', () => {
            it('基本的な割り算を実行できる', () => {
                calculator.inputDigit('8');
                calculator.inputOperator('/');
                calculator.inputDigit('2');
                calculator.performCalculation();
                expect(calculator.getDisplay()).toBe('4');
            });

            it('小数点を含む割り算の結果は5桁までに制限される', () => {
                calculator.inputDigit('1');
                calculator.inputOperator('/');
                calculator.inputDigit('3');
                calculator.performCalculation();
                expect(calculator.getDisplay()).toBe('0.33333');
            });

            it('0による除算はエラーとなる', () => {
                calculator.inputDigit('8');
                calculator.inputOperator('/');
                calculator.inputDigit('0');
                calculator.performCalculation();
                expect(calculator.getDisplay()).toBe('0で割ることはできません');
            });
        });

        describe('複合的な計算', () => {
            it('異なる演算子を組み合わせた計算を実行できる', () => {
                calculator.inputDigit('2');
                calculator.inputOperator('+');
                calculator.inputDigit('3');
                calculator.inputOperator('*');
                calculator.inputDigit('4');
                calculator.performCalculation();
                expect(calculator.getDisplay()).toBe('20');
            });
        });
    });

    describe('計算履歴', () => {
        it('一つの演算の計算過程を記録する', () => {
            calculator.inputDigit('5');
            calculator.inputOperator('+');
            expect(calculator.getFormula()).toBe('5 + ');
            calculator.inputDigit('3');
            calculator.performCalculation();
            expect(calculator.getFormula()).toBe('');
        });

        it('連続した演算の計算過程を記録する', () => {
            calculator.inputDigit('5');
            calculator.inputOperator('+');
            calculator.inputDigit('3');
            calculator.inputOperator('*');
            expect(calculator.getFormula()).toBe('5 + 8 * ');
        });
    });

    describe('クリア機能', () => {
        it('電卓の状態を初期化できる', () => {
            calculator.inputDigit('5');
            calculator.inputOperator('+');
            calculator.inputDigit('3');
            calculator.clear();
            expect(calculator.getDisplay()).toBe('0');
            expect(calculator.getFormula()).toBe('');
        });

        it('エラー後に電卓の状態を初期化できる', () => {
            calculator.inputDigit('8');
            calculator.inputOperator('/');
            calculator.inputDigit('0');
            calculator.performCalculation();
            calculator.clear();
            expect(calculator.getDisplay()).toBe('0');
            expect(calculator.getFormula()).toBe('');
        });
    });
});
