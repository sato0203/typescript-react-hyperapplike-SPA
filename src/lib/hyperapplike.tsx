import React, { useState } from "react";
import ReactDOM from "react-dom";
import { States } from "../states";
import _actions from "../actions";

export type Actions = {
  [key:string]:((value:any) => (state:States) => States)|Actions
}

type MapToComponentActions<T> = {[P in keyof T]:T[P] extends (value:infer I) => (state:States) => States ? (value:I) => void : MapToComponentActions<T[P]>}
type ComponentActions = MapToComponentActions<typeof _actions>

const useApp = (initialState:States, actionsDefs:Actions) => {
  const [state, setState] = useState(initialState);
  const mapToSetState = (as:Actions) => {
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
    },{} as any) as ComponentActions
    return answer
  }

  const actions = mapToSetState(actionsDefs)
  return {
    state,
    actions
  };
}

export function app(initialState:States , actionsDefs:Actions, view:any, element:any) {
  const App = () => {
    const { state, actions } = useApp(initialState, actionsDefs);
    return view(state, actions);
  } 
  ReactDOM.render(<App />, element);
}

export { React };
