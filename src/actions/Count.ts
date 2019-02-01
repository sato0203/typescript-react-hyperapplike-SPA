import states from "../states"
import * as _ from "lodash";
import { HyperAppLikeActions } from "../lib/hyperapplike";

export const actions = {
    up:   (value:number) => (state:typeof states) => {
        const newState = _.cloneDeep(state)
        newState.count.value += value
        return newState;
    },
    down:   (value:number) => (state:typeof states) => {
        const newState = _.cloneDeep(state)
        newState.count.value -= value
        return newState;
    },
};

//型チェックのための無意味な変数
const typeCheckActions:HyperAppLikeActions<typeof states> = actions

export default actions