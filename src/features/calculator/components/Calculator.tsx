'use client';

import { type FC, useState, useCallback, useMemo, useEffect } from 'react';
import { Calculator as Calc, type Operator } from '@/features/calculator/calculator';
import styles from './Calculator.module.css';

export const Calculator: FC = () => {
  // Calculator クラスのインスタンスを生成
  const calc = useMemo(() => new Calc(), []);

  // React の表示用ステート
  const [display, setDisplay] = useState<string>(calc.getDisplay());
  const [formula, setFormula] = useState<string>(calc.getFormula());

  // 数字／小数点入力
  const handleNumberClick = useCallback((num: string) => {
    console.log('[DEBUG][Component] handleNumberClick:', num);
    calc.inputDigit(num);
    setDisplay(calc.getDisplay());
    setFormula(calc.getFormula());
  }, [calc]);

  // 演算子入力
  const handleOperatorClick = useCallback((operator: Operator) => {
    console.log('[DEBUG][Component] handleOperatorClick:', operator);
    calc.inputOperator(operator);
    setDisplay(calc.getDisplay());
    setFormula(calc.getFormula());
  }, [calc]);

  // クリア
  const handleClear = useCallback(() => {
    console.log('[DEBUG][Component] handleClear');
    calc.clear();
    setDisplay(calc.getDisplay());
    setFormula(calc.getFormula());
  }, [calc]);

  // +/- 切り替え
  const handleToggleSign = useCallback(() => {
    console.log('[DEBUG][Component] handleToggleSign');
    calc.toggleSign();
    setDisplay(calc.getDisplay());
  }, [calc]);

  // 計算実行
  const handleEquals = useCallback(() => {
    console.log('[DEBUG][Component] handleEquals');
    try {
      const formulaStr = calc.performCalculation();
      setFormula(formulaStr);
    } catch (e) {
      console.error('[DEBUG][Component] calculate error:', e);
    }
    setDisplay(calc.getDisplay());
  }, [calc]);

  // キーボード操作対応
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const key = event.key;
    if (/^[0-9.]$/.test(key)) {
      handleNumberClick(key);
      return;
    }
    switch (key) {
      case '+':
      case '-':
        handleOperatorClick(key as Operator);
        break;
      case '*':
        handleOperatorClick('*' as Operator);
        break;
      case '/':
        handleOperatorClick('/' as Operator);
        break;
      case 'Enter':
      case '=':
        handleEquals();
        break;
      case 'Escape':
        handleClear();
        break;
      default:
        break;
    }
  }, [handleNumberClick, handleOperatorClick, handleEquals, handleClear]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className={styles.calculator} role="application" aria-label="電卓">
      <div className={styles.formula} data-testid="formula" aria-live="polite">{formula}</div>
      <input 
        type="text" 
        className={styles.display} 
        value={display} 
        readOnly 
        aria-label="計算結果"
      />
      <fieldset className={styles.buttons}>
        <legend className="sr-only">数字と演算子</legend>
        <button type="button" className={`${styles.button} ${styles.clear}`} onClick={handleClear}>C</button>
        <button type="button" className={`${styles.button} ${styles.operator}`} onClick={() => handleOperatorClick('/' as Operator)}>÷</button>
        <button type="button" className={`${styles.button} ${styles.operator}`} onClick={() => handleOperatorClick('*' as Operator)}>×</button>
        <button type="button" className={`${styles.button} ${styles.operator}`} onClick={() => handleOperatorClick('-')}>-</button>
        <button type="button" className={styles.button} onClick={() => handleNumberClick('7')}>7</button>
        <button type="button" className={styles.button} onClick={() => handleNumberClick('8')}>8</button>
        <button type="button" className={styles.button} onClick={() => handleNumberClick('9')}>9</button>
        <button type="button" className={`${styles.button} ${styles.operator}`} onClick={() => handleOperatorClick('+')}>+</button>
        <button type="button" className={styles.button} onClick={() => handleNumberClick('4')}>4</button>
        <button type="button" className={styles.button} onClick={() => handleNumberClick('5')}>5</button>
        <button type="button" className={styles.button} onClick={() => handleNumberClick('6')}>6</button>
        <button type="button" className={styles.button} onClick={() => handleNumberClick('.')}>.</button>
        <button type="button" className={styles.button} onClick={() => handleNumberClick('1')}>1</button>
        <button type="button" className={styles.button} onClick={() => handleNumberClick('2')}>2</button>
        <button type="button" className={styles.button} onClick={() => handleNumberClick('3')}>3</button>
        <button type="button" className={styles.button} onClick={() => handleNumberClick('0')}>0</button>
        <button type="button" className={styles.button} onClick={handleToggleSign}>+/-</button>
        <button type="button" className={`${styles.button} ${styles.equals}`} onClick={handleEquals}>=</button>
      </fieldset>
    </div>
  );
};
