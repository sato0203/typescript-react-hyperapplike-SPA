import { React,app, ComponentActions } from "./lib/hyperapplike";
import * as serviceWorker from './serviceWorker';
import _states, { States } from "./states";
import _actions, { Actions } from "./actions"
import Count from "./views/Count"
import {Route, BrowserRouter} from "react-router-dom"
import "./index.css"

const view = (state:States, actions:ComponentActions<States,Actions>) => (
  <BrowserRouter>
    <div>
      <Route exact path='/' render ={() => <Count state={state} actions={actions}/>} />
    </div>
  </BrowserRouter>
);

const element = document.getElementById('root');

app(_states, _actions, view, document.getElementById("root"));

serviceWorker.unregister();
