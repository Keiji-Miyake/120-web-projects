/** 演算子の型定義 */
export type Operator = '+' | '-' | '*' | '/';

/** 電卓の状態を管理するインターフェース */
export interface CalculatorState {
    display: string;
    firstOperand: number | null;
    operator: Operator | null;
    waitingForSecondOperand: boolean;
}

/** 計算エラーの型 */
export class CalculationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'CalculationError';
    }
}

export class Calculator {
    private state: CalculatorState;

    constructor() {
        this.state = {
            display: '0',
            firstOperand: null,
            operator: null,
            waitingForSecondOperand: false
        };
    }

    /**
     * 数字の入力を処理する
     * @param digit 入力された数字
     */
    public inputDigit(digit: string): void {
        if (this.state.waitingForSecondOperand) {
            this.state.display = digit;
            this.state.waitingForSecondOperand = false;
        } else {
            this.state.display = this.state.display === '0' ? digit : this.state.display + digit;
        }
    }

    /**
     * 演算子の入力を処理する
     * @param operator 入力された演算子
     */
    public inputOperator(operator: Operator): void {
        const inputValue = Number.parseFloat(this.state.display);

        if (this.state.firstOperand === null) {
            this.state.firstOperand = inputValue;
        } else if (this.state.operator) {
            const result = this.calculate();
            this.state.display = String(result);
            this.state.firstOperand = result;
        }

        this.state.waitingForSecondOperand = true;
        this.state.operator = operator;
    }

    /**
     * 計算を実行する
     */
    public calculate(): number {
        if (this.state.firstOperand === null || this.state.operator === null) {
            return Number.parseFloat(this.state.display);
        }

        const secondOperand = Number.parseFloat(this.state.display);

        if (this.state.operator === '/' && secondOperand === 0) {
            throw new CalculationError('0で割ることはできません');
        }

        let result: number;

        switch (this.state.operator) {
            case '+':
                result = this.state.firstOperand + secondOperand;
                break;
            case '-':
                result = this.state.firstOperand - secondOperand;
                break;
            case '*':
                result = this.state.firstOperand * secondOperand;
                break;
            case '/':
                result = this.state.firstOperand / secondOperand;
                break;
            default:
                throw new CalculationError('無効な演算子です');
        }

        // 計算結果を整数または小数第5位までに制限
        return Number(result.toFixed(5));
    }

    /**
     * イコールボタンの処理
     */
    public performCalculation(): string {
        try {
            const result = this.calculate();
            // 計算過程を一時的に保存
            const formula = `${this.state.firstOperand} ${this.state.operator} ${Number.parseFloat(this.state.display)} = `;
            
            this.state.display = String(result);
            this.state.firstOperand = null;
            this.state.operator = null;
            this.state.waitingForSecondOperand = false;

            // 計算結果を返す前に計算過程を返す
            return formula;
        } catch (error) {
            if (error instanceof CalculationError) {
                this.state.display = error.message;
            } else {
                this.state.display = 'エラー';
            }
            this.clear();
            return '';
        }
    }

    /**
     * 電卓をクリアする
     */
    public clear(): void {
        this.state = {
            display: '0',
            firstOperand: null,
            operator: null,
            waitingForSecondOperand: false
        };
    }

    /**
     * 現在の表示値を取得する
     */
    public getDisplay(): string {
        return this.state.display;
    }

    /**
     * 現在の数式を取得する
     */
    public getFormula(): string {
        if (this.state.firstOperand === null) {
            return '';
        }
        return `${this.state.firstOperand} ${this.state.operator || ''} `;
    }
}