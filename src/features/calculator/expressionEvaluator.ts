/**
 * 演算子を表す列挙型
 */
export enum Operator {
  Add = '+',
  Subtract = '-',
  Multiply = '*',
  Divide = '/',
}

/**
 * 式を構成するトークンの型定義
 * number型の数値または演算子のいずれかを保持します
 */
export type ExpressionToken = number | Operator;

/**
 * 式の評価を行うクラス
 * 演算子の優先順位を考慮して数式を評価します
 */
export class ExpressionEvaluator {
  /**
   * 演算子の優先順位を定義したマップ
   * - 乗算・除算: 2
   * - 加算・減算: 1
   */
  private static readonly operatorPrecedence: Map<Operator, number> = new Map([
    [Operator.Multiply, 2],
    [Operator.Divide, 2],
    [Operator.Add, 1],
    [Operator.Subtract, 1],
  ]);

  /**
   * トークンの配列を受け取り、演算子の優先順位に従って式を評価します
   * @param tokens - 評価する式を構成するトークンの配列
   * @returns 式の評価結果
   * @throws {Error} 不正な式や演算子が含まれる場合
   */
  public evaluate(tokens: ExpressionToken[]): number {
    if (!tokens.length) {
      throw new Error('Empty expression');
    }

    // 乗算・除算を先に評価
    const firstPass = this.evaluateByPrecedence(tokens, 2);
    // 加算・減算を評価
    const result = this.evaluateByPrecedence(firstPass, 1);

    // 最終結果が複数のトークンを含む場合はエラー
    if (result.length !== 1) {
      throw new Error('Invalid expression structure');
    }

    // 最終結果が数値でない場合はエラー
    if (typeof result[0] !== 'number') {
      throw new Error('Expression did not evaluate to a number');
    }

    return result[0];
  }

  /**
   * 指定された優先順位の演算を評価します
   * @param tokens - 評価するトークンの配列
   * @param precedence - 評価する演算子の優先順位
   * @returns 評価後のトークンの配列
   */
  private evaluateByPrecedence(tokens: ExpressionToken[], precedence: number): ExpressionToken[] {
    const result: ExpressionToken[] = [];
    let i = 0;

    while (i < tokens.length) {
      const current = tokens[i];

      if (this.isOperator(current) && this.getOperatorPrecedence(current) === precedence) {
        if (i === 0 || i === tokens.length - 1) {
          throw new Error(`Invalid operator position: ${current}`);
        }

        const prev = result.pop();
        const next = tokens[i + 1];

        if (typeof prev !== 'number' || typeof next !== 'number') {
          throw new Error('Invalid operands');
        }

        result.push(this.calculateOperation(prev, current, next));
        i += 2;
      } else {
        result.push(current);
        i++;
      }
    }

    return result;
  }

  /**
   * 二項演算を実行します
   * @param left - 左辺の値
   * @param operator - 演算子
   * @param right - 右辺の値
   * @returns 演算結果
   * @throws {Error} 0での除算が行われた場合
   */
  private calculateOperation(left: number, operator: Operator, right: number): number {
    switch (operator) {
      case Operator.Add:
        return left + right;
      case Operator.Subtract:
        return left - right;
      case Operator.Multiply:
        return left * right;
      case Operator.Divide:
        if (right === 0) {
          throw new Error('Division by zero');
        }
        return left / right;
      default:
        throw new Error(`Unknown operator: ${operator}`);
    }
  }

  /**
   * トークンが演算子かどうかを判定します
   * @param token - 判定するトークン
   * @returns 演算子の場合true
   */
  private isOperator(token: ExpressionToken): token is Operator {
    return typeof token === 'string' && token in Operator;
  }

  /**
   * 演算子の優先順位を取得します
   * @param operator - 優先順位を取得する演算子
   * @returns 演算子の優先順位
   */
  private getOperatorPrecedence(operator: Operator): number {
    return ExpressionEvaluator.operatorPrecedence.get(operator) ?? 0;
  }
}