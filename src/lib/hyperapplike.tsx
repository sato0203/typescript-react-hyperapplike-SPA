import React, { useState, ReactComponentElement } from "react";
import ReactDOM from "react-dom";

export type HyperAppLikeActions<S> = {
  [key:string]:((value:any) => (state:S) => S)|HyperAppLikeActions<S>
}

export type HyperAppView<S,A> = React.FunctionComponent<{
  state:S,
  actions:ComponentActions<S,A>
}>

export type ComponentActions<S,A> = {[P in keyof A]:A[P] extends (value:infer I) => (state:S) => S ? (value:I) => void : ComponentActions<S,A[P]>}

function useApp<S extends Object,A extends HyperAppLikeActions<S>>(initialState:S, actionsDefs:A){
  const [state, setState] = useState(initialState);
  const mapToSetState = (as:HyperAppLikeActions<S>) => {
    const keys = Object.keys(as);
    const answer = keys.reduce((prev,cur) => {
      const prop = as[cur];
      if(typeof(prop) === "function"){
        const componentAction = (value:any) => setState(prop(value)(state))
        prev[cur] = componentAction;
        return prev
      }
      prev[cur] = mapToSetState(prop)
      return prev
    },{} as any) as ComponentActions<S,A>
    return answer
  }

  const actions = mapToSetState(actionsDefs)
  return {
    state,
    actions
  };
}

export function app<S extends Object,A extends HyperAppLikeActions<S>>(initialState:S , actionsDefs:A, view:(state:S,action:ComponentActions<S,A>) => JSX.Element, element:any) {
  const App = () => {
    const { state, actions } = useApp<S,A>(initialState, actionsDefs);
    return view(state, actions);
  } 
  ReactDOM.render(<App />, element);
}

export { React };
