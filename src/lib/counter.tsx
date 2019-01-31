import { React, app } from "./hyperapplike";

const state = {
  count: 0
};

const actions = {
  down: (value:any) => (state:any) => ({ count: state.count - value }),
  up: (value:any) => (state:any) => ({ count: state.count + value })
};

const view = (state:any, actions:any) => (
  <div>
    <h1>{state.count}</h1>
    <button onClick={() => actions.down(1)}>-</button>
    <button onClick={() => actions.up(1)}>+</button>
  </div>
);

app(state, actions, view, document.getElementById("root"));
