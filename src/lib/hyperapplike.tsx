import React, { useState, ReactComponentElement, useEffect } from "react";
import ReactDOM from "react-dom";
import * as _ from "lodash"

export type TransactionFunc<S> = (curState:S) => S
export type ActionTools<S,A> = {
  setTransaction:(func: TransactionFunc<S>) => void,
  getCurState:() => S,
  getActions:() => ComponentActions<S,A>
}
type HyperAppLikeActionCall<S> = (tools:ActionTools<S,any>) => void
type HyperAppLikeAction<S, V> = ((value: V) => HyperAppLikeActionCall<S>)
type HyperAppLikeActionVoid<S> = (() => HyperAppLikeActionCall<S>)

export type HyperAppLikeActions<S> = {
  [key: string]: HyperAppLikeAction<S, any> | HyperAppLikeActionVoid<S> | HyperAppLikeActions<S>
}

export type HyperAppProps<S, A> = {
  state: S,
  actions: ComponentActions<S, A>
}
export type HyperAppFunctionalComponent<S, A, P = undefined> = P extends undefined ? React.FunctionComponent<HyperAppProps<S, A>> : React.FunctionComponent<HyperAppProps<S, A> & P>
export type HyperAppComponent<S, A, P = undefined> = P extends undefined ? React.Component<HyperAppProps<S, A>> : React.Component<HyperAppProps<S, A> & P>
export type ComponentActions<S, A> = { [P in keyof A]: A[P] extends HyperAppLikeActionVoid<S> ? () => void : A[P] extends HyperAppLikeAction<S, infer I> ? (value: I) => void : ComponentActions<S, A[P]> }

function isPromise(obj: any): boolean {
  return obj instanceof Promise || (obj && typeof obj.then === 'function');
}



function useApp<S extends Object, A extends HyperAppLikeActions<S>>(initialState: S, actionsDefs: A) {
  const [reactState, reactSetState] = useState(initialState);

  /*こっちでも状態管理するように設定、非同期対応のgetCurStateのため*/
  let state = reactState;
  const setState = (s: S) => {
    state = s
    reactSetState(s);
  }
  /*------------------------------------------------------*/

  //Transaction
  const transactionQueue = new Array<TransactionFunc<S>>();
  let isExecutingTransaction = false;
  
  const  setTransactionImpl = (userDefinedTransaction:TransactionFunc<S>) => {
    transactionQueue.push(userDefinedTransaction); 
  }

  function executeTransactionLoop(){
    if(!isExecutingTransaction && transactionQueue.length > 0){
      isExecutingTransaction = true;
      const tgtFunc = transactionQueue.pop()
      setState(tgtFunc!(_.cloneDeep(state)))
      isExecutingTransaction = false;
      if(transactionQueue.length >0)
        executeTransactionLoop()
    }
    setTimeout(executeTransactionLoop,0)
  }

  executeTransactionLoop();

  //以下ユーザーに渡す用

  const mapToSetState = (userDefinedActions: HyperAppLikeActions<S>) => {
    const keys = Object.keys(userDefinedActions);
    const answer = keys.reduce((prev, cur) => {
      const prop = userDefinedActions[cur];
      if (typeof (prop) === "function") {
        const componentAction = (value: any) => prop(value)({
          setTransaction:(transactionFunc:TransactionFunc<S>) => setTransactionImpl(transactionFunc),
          getCurState:() => _.cloneDeep(state),
          getActions:() => actions
        })
        prev[cur] = componentAction;
        return prev
      }
      prev[cur] = mapToSetState(prop as HyperAppLikeActions<S>)
      return prev
    }, {} as any) as ComponentActions<S, A>
    return answer
  }
  const actions = mapToSetState(actionsDefs)
  return {
    reactState,
    actions
  };
}

export function app<S extends Object, A extends HyperAppLikeActions<S>>(initialState: S, actionsDefs: A, view: (state: S, action: ComponentActions<S, A>) => JSX.Element, element: any) {
  const App = () => {
    const { reactState, actions } = useApp<S, A>(initialState, actionsDefs);
    return view(reactState, actions);
  }
  ReactDOM.render(<App />, element);
}

export { React };


export function useDidMount(initializeFunction: () => void) {
  const [isInitialize, setIsInitialize] = useState(false)
  useEffect(() => {
    if (!isInitialize) {
      initializeFunction();
      setIsInitialize(true);
    }
  })
}