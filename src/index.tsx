import { React,app, ComponentActions } from "./lib/hyperapplike";
import * as serviceWorker from './serviceWorker';
import _states, { States } from "./states";
import _actions, { Actions } from "./actions"
import Count from "./views/Count"

const view = (state:States, actions:ComponentActions<States,Actions>) => (
  <Count state={state} actions={actions}/>
);

const element = document.getElementById('root');

app(_states, _actions, view, document.getElementById("root"));

serviceWorker.unregister();
