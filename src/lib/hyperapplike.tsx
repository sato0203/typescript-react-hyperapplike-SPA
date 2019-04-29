import React, { useState, ReactComponentElement, useEffect } from "react";
import ReactDOM from "react-dom";
import * as _ from "lodash"

type HyperAppLikeActionCall<S> = (getCurState: () => S, setState: (s: S) => void) => void
type HyperAppLikeAction<S, V> = ((value: V) => HyperAppLikeActionCall<S>)
type HyperAppLikeActionVoid<S> = (() => HyperAppLikeActionCall<S>)

export type HyperAppLikeActions<S> = {
  [key: string]: HyperAppLikeAction<S, any> | HyperAppLikeActionVoid<S> | HyperAppLikeActions<S>
}

export type HyperAppProps<S, A> = {
  state: S,
  actions: ComponentActions<S, A>
}
export type HyperAppView<S, A, P = undefined> = P extends undefined ? React.FunctionComponent<HyperAppProps<S, A>> : React.FunctionComponent<HyperAppProps<S, A> & P>
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
  const mapToSetState = (as: HyperAppLikeActions<S>) => {
    const keys = Object.keys(as);
    const answer = keys.reduce((prev, cur) => {
      const prop = as[cur];
      if (typeof (prop) === "function") {
        const componentAction = (value: any) => prop(value)(() => _.cloneDeep(state), setState)
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