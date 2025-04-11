import { Calculator } from './calculator';
import type { Operator } from './calculator';

// 電卓インスタンスの作成
const calculator = new Calculator();

// DOM要素の取得
const display = document.getElementById('display') as HTMLInputElement;
const formulaDisplay = document.getElementById('formula') as HTMLDivElement;
const numberButtons = document.querySelectorAll('.number');
const operatorButtons = document.querySelectorAll('.operator');
const equalsButton = document.getElementById('equals');
const clearButton = document.getElementById('clear');

// 表示を更新する関数
function updateDisplay(): void {
    display.value = calculator.getDisplay();
    formulaDisplay.textContent = calculator.getFormula();
}

// 数字ボタンのイベントリスナー
for (const button of numberButtons) {
    button.addEventListener('click', (e) => {
        const target = e.target as HTMLButtonElement;
        calculator.inputDigit(target.textContent || '');
        updateDisplay();
    });
}

// 演算子ボタンのイベントリスナー
for (const button of operatorButtons) {
    button.addEventListener('click', (e) => {
        const target = e.target as HTMLButtonElement;
        calculator.inputOperator(target.textContent as Operator);
        updateDisplay();
    });
}

// イコールボタンのイベントリスナー
equalsButton?.addEventListener('click', () => {
    const formula = calculator.performCalculation();
    formulaDisplay.textContent = formula;
    updateDisplay();
});

// クリアボタンのイベントリスナー
clearButton?.addEventListener('click', () => {
    calculator.clear();
    updateDisplay();
});

// キーボードイベントの処理
document.addEventListener('keydown', (e) => {
    e.preventDefault();
    
    const key = e.key;

    // 数字キーの処理
    if (/^[0-9]$/.test(key)) {
        calculator.inputDigit(key);
    }
    // 演算子キーの処理
    else if (['+', '-', '*', '/'].includes(key)) {
        calculator.inputOperator(key as Operator);
    }
    // Enterキーの処理（計算実行）
    else if (key === 'Enter') {
        const formula = calculator.performCalculation();
        formulaDisplay.textContent = formula;
    }
    // Escキーの処理（クリア）
    else if (key === 'Escape') {
        calculator.clear();
    }

    updateDisplay();
});

// 初期表示の更新
updateDisplay();