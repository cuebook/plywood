module Plywood {
  export class DivideAction extends Action {
    static fromJS(parameters: ActionJS): DivideAction {
      return new DivideAction(Action.jsToValue(parameters));
    }

    constructor(parameters: ActionValue) {
      super(parameters, dummyObject);
      this._ensureAction("divide");
      this._checkExpressionType('NUMBER');
    }

    public getOutputType(inputType: string): string {
      this._checkInputType(inputType, 'NUMBER');
      return 'NUMBER';
    }

    public _fillRefSubstitutions(typeContext: FullType, indexer: Indexer, alterations: Alterations): FullType {
      this.expression._fillRefSubstitutions(typeContext, indexer, alterations);
      return {
        type: 'NUMBER',
        remote: typeContext.remote
      };
    }

    protected _getFnHelper(inputFn: ComputeFn, expressionFn: ComputeFn): ComputeFn {
      return (d: Datum, c: Datum) => {
        return (inputFn(d, c) || 0) / (expressionFn(d, c) || 0);
      }
    }

    protected _getJSHelper(inputJS: string, expressionJS: string): string {
      return '(' + inputJS + '/' + expressionJS + ')';
    }

    protected _getSQLHelper(dialect: SQLDialect, inputSQL: string, expressionSQL: string): string {
      return '(' + inputSQL + '/' + expressionSQL + ')';
    }

    protected _specialSimplify(simpleExpression: Expression): ActionSimplification {
      if (simpleExpression.equals(Expression.ONE)) {
        return {
          simplification: Simplification.Remove
        };
      }
      return null;
    }
  }

  Action.register(DivideAction);
}
