module Plywood {
  export class AndAction extends Action {
    static fromJS(parameters: ActionJS): AndAction {
      return new AndAction(Action.jsToValue(parameters));
    }

    constructor(parameters: ActionValue) {
      super(parameters, dummyObject);
      this._ensureAction("and");
    }

    public getOutputType(inputType: string): string {
      this._checkInputType(inputType, 'BOOLEAN');
      return 'BOOLEAN';
    }

    protected _getFnHelper(inputFn: ComputeFn, expressionFn: ComputeFn): ComputeFn {
      return (d: Datum, c: Datum) => inputFn(d, c) && expressionFn(d, c);
    }

    protected _getJSHelper(inputJS: string, expressionJS: string): string {
      return '(' + inputJS + '&&' + expressionJS + ')';
    }

    protected _getSQLHelper(dialect: SQLDialect, inputSQL: string, expressionSQL: string): string {
      return '(' + inputSQL + ' AND ' + expressionSQL + ')';
    }

    protected _specialSimplify(simpleExpression: Expression): ActionSimplification {
      if (simpleExpression.equals(Expression.TRUE)) {
        return {
          simplification: Simplification.Remove
        };
      } else if (simpleExpression.equals(Expression.FALSE)) {
        return {
          simplification: Simplification.Wipe,
          expression: Expression.FALSE
        };
      } else if (simpleExpression instanceof ChainExpression) {
        var newActions = simpleExpression.actionize(this.action);
        if (!newActions) return null;
        return { simplification: Simplification.Replace, actions: newActions };
      }
      return null;
    }

    protected _specialFoldLiteral(literalInput: LiteralExpression): Expression {
      if (literalInput.equals(Expression.TRUE)) {
        return this.expression;
      } else if (literalInput.equals(Expression.FALSE)) {
        return Expression.FALSE;
      }
      return null;
    }
  }

  Action.register(AndAction);
}
