import states, { States } from "../states"
import * as _ from "lodash";
import { HyperAppLikeActions } from "../lib/hyperapplike";

export const actions = {
    up:   (value:number) => (getCurState:() => States,setState:(s:States) => void) => {
        const newState = getCurState()
        newState.count.value += value
        setState(newState);
    },
    down: (value: number) => (getCurState: () => States, setState: (s: States) => void) => {
        const newState = getCurState()
        newState.count.value -= value
        setState(newState);
    },
};

//型チェックのための無意味な変数
const typeCheckActions:HyperAppLikeActions<typeof states> = actions

export default actions