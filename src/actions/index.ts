import states from "../states"

const actions =  {
    count:{
        down:   (value:number) => (state:typeof states) => ({ count: state.count - value }),
        up:     (value:number) => (state:typeof states) => ({ count: state.count + value })
    } 
};

export type Actions = typeof actions
export default actions