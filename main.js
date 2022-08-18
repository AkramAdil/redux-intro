console.log("Hello")

/*create actions*/
const BUY_MOBLIE = "BUY_MOBLIE"
const RETURN_MOBLIE = "RETURN_MOBLIE"

const BYU_LAPTOP = "BYU_LAPTOP"

const BUY_ACCESSORIES = "BUY_ACCESSORIES"
function buyMobile (amount) {
    return {
        type: BUY_MOBLIE,
        payload: amount
    }
}
function returnMobile (amount) {
    return {
        type: RETURN_MOBLIE,
        payload: amount
    }
}

function buyLaptop (amount){
    return {
        type: BYU_LAPTOP,
        payload: amount
    }
}

function buyAccessories() {
    return async (dispatch, getState)=>{
        const res = await fetch("https://fakestoreapi.com/products")
        const data = await res.json()
        dispatch({
            type: BUY_ACCESSORIES,
            payload: data
        })
        console.log(getState())
    }
}
/*reducer*/
function mobileReucer (state=100, action){
    switch (action.type) {
        case "BUY_MOBLIE":
            return state -action.payload;
        case "RETURN_MOBLIE":
            return state+action.payload;
        default:
            return state
    }
}

function laoptopReducer(state=10,action) {
    switch (action.type) {
        case BYU_LAPTOP: 
            return state-action.payload;   
        default:
            return state
    }
}
function accessoriesReducer(state=[],action) {
    switch (action.type) {
        case BUY_ACCESSORIES:
            return action.payload;
        default:
            return state;
    }
}
const reducers = Redux.combineReducers({
    mobile: mobileReucer,
    laptop: laoptopReducer,
    accessories: accessoriesReducer
})
const store = Redux.createStore(reducers, Redux.applyMiddleware(ReduxThunk))

store.dispatch(buyMobile(1))
store.dispatch(buyMobile(1))
store.dispatch(returnMobile(2))

store.dispatch(buyLaptop(1))
store.dispatch(buyLaptop(1))
store.dispatch(buyLaptop(4))
store.dispatch(buyAccessories())
console.log(store.getState())