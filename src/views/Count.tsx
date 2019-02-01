import { States } from "../states";
import { ComponentActions, HyperAppView } from "../lib/hyperapplike";
import { Actions } from "../actions";
import * as React from "react"

export const view:HyperAppView<States,Actions> = (prop) => {
    return (
        <div>
            <h1>{prop.state.count.value}</h1>
            <button onClick={() => prop.actions.count.down(1)}>-</button>
            <button onClick={() => prop.actions.count.up(1)}>+</button>
        </div>
    )
}

export default view