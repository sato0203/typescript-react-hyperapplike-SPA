import states, { States } from "../states"
import * as _ from "lodash";
import { HyperAppLikeActions, TransactionFunc, ActionTools } from "../lib/hyperapplike";
import { Actions } from ".";

export const actions = {
    up:   (value:number) => (tools:ActionTools<States,Actions>) => {
        tools.setTransaction(state => {
            state.count.value += value;
            return state;
        })
    },
    down: (value: number) => (tools:ActionTools<States,Actions>) => {
        tools.setTransaction(state => {
            state.count.value -= value;
            return state;
        })
    },
    upDown: () => (tools:ActionTools<States,Actions>) => {
        console.dir(tools.getActions().count)
        tools.getActions().count.up(5);
        tools.getActions().count.down(2);
    },
};

//型チェックのための無意味な変数
const typeCheckActions:HyperAppLikeActions<typeof states> = actions

export default actions