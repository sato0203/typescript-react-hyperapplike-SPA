import { React,app, ComponentActions } from "./lib/hyperapplike";
import * as serviceWorker from './serviceWorker';
import _states, { States } from "./states";
import _actions, { Actions } from "./actions"

const view = (state:States, actions:ComponentActions<States,Actions>) => (
  <div>
    <h1>{state.count}</h1>
    <button onClick={() => actions.count.down(1)}>-</button>
    <button onClick={() => actions.count.up(1)}>+</button>
  </div>
);

const element = document.getElementById('root');

app(_states, _actions, view, document.getElementById("root"));

serviceWorker.unregister();
