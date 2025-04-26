/** 演算子の型定義 */
export type Operator = '+' | '-' | '*' | '/';

/** 電卓の状態を管理するインターフェース */
export interface CalculatorState {
    display: string;
    firstOperand: number | null;
    operator: Operator | null;
    waitingForSecondOperand: boolean;
    calculationHistory: string;
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
            waitingForSecondOperand: false,
            calculationHistory: ''
        };
    }

    /**
     * 数字の入力を処理する
     * @param digit 入力された数字
     */
    public inputDigit(digit: string): void {
        if (this.state.waitingForSecondOperand) {
            // 負号入力対応: 直前が演算子で「-」なら負の数として扱う
            if (digit === '-' && (this.state.display === '0' || this.state.display === '')) {
                this.state.display = '-';
            } else {
                this.state.display = digit;
            }
            this.state.waitingForSecondOperand = false;
        } else {
            // 既に「-」のみの場合は数字を連結
            if (this.state.display === '0') {
                this.state.display = digit;
            } else if (this.state.display === '-') {
                this.state.display = `-${digit}`;
            } else {
                this.state.display = `${this.state.display}${digit}`;
            }
        }
    }

    /**
     * 符号を反転する
     */
    public toggleSign(): void {
        // 0や空文字は何もしない
        if (this.state.display === '0' || this.state.display === '') return;
        this.state.display = this.state.display.startsWith('-') 
            ? this.state.display.slice(1)
            : `-${this.state.display}`;
    }

    /**
     * 演算子の入力を処理する
     * @param operator 入力された演算子
     */
    public inputOperator(operator: Operator): void {
        console.log(`[DEBUG] inputOperator START: history="${this.state.calculationHistory}", display="${this.state.display}", operatorInput="${operator}"`);
        const inputValue = Number.parseFloat(this.state.display);

        if (this.state.waitingForSecondOperand) {
            // 直前が演算子入力の場合は演算子だけを差し替える
            if (this.state.calculationHistory.length > 0) {
                // 末尾の演算子を置換
                this.state.calculationHistory = this.state.calculationHistory.replace(/[\+\-\*\/] $/, `${operator} `);
            }
            this.state.operator = operator;
            // ログ出力：inputOperator終了時の内部状態
            console.log(`[DEBUG] inputOperator END (operator replaced): history="${this.state.calculationHistory}", display="${this.state.display}", firstOperand=${this.state.firstOperand}, operatorSet="${this.state.operator}"`);
            return;
        }

        if (this.state.firstOperand === null) {
            // 最初の数値入力時
            this.state.firstOperand = inputValue;
            this.state.calculationHistory = `${this.state.calculationHistory}${inputValue} ${operator} `;
        } else if (this.state.operator) {
            // 連続した演算時（演算子2回押し防止済み）
            try {
                const result = this.calculate();
                this.state.display = String(result);
                this.state.firstOperand = result;
                this.state.calculationHistory = `${this.state.calculationHistory}${result} ${operator} `;
            } catch (error) {
                this.handleCalculationError(error);
                return;
            }
        }

        this.state.waitingForSecondOperand = true;
        this.state.operator = operator;
        // ログ出力：inputOperator終了時の内部状態
        console.log(`[DEBUG] inputOperator END: history="${this.state.calculationHistory}", display="${this.state.display}", firstOperand=${this.state.firstOperand}, operatorSet="${this.state.operator}"`);
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
            // 計算過程を記録
            const formula = `${this.state.calculationHistory}${Number.parseFloat(this.state.display)} = `;
            
            this.state.display = String(result);
            this.state.firstOperand = null;
            this.state.operator = null;
            this.state.waitingForSecondOperand = false;
            this.state.calculationHistory = '';

            return formula;
        } catch (error) {
            this.handleCalculationError(error);
            return '';
        }
    }

    /**
     * 計算エラーを処理する
     */
    private handleCalculationError(error: unknown): void {
        if (error instanceof CalculationError) {
            this.state.display = error.message;
            // エラーメッセージを表示した後、1秒後にクリアする
            setTimeout(() => this.clear(), 1000);
        } else {
            this.state.display = 'エラー';
            setTimeout(() => this.clear(), 1000);
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
            waitingForSecondOperand: false,
            calculationHistory: ''
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
        return this.state.calculationHistory;
    }
}
