import count from "./Count"

const actions =  {
    count:Object.assign({},count)
};

export type Actions = typeof actions
export default actions