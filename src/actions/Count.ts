import states from "../states"

export default {
    down:   (value:number) => (state:typeof states) => ({ count: state.count - value }),
    up:     (value:number) => (state:typeof states) => ({ count: state.count + value })
};