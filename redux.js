function generateId () {
    return Math.random().toString(36).substring(2) + (new Date()).getTime().toString(36);
}
const flavorsList = document.getElementById('flavors')
const goalsList = document.getElementById('goals')

// rules of increasing predictability:
//1-Only an event can change the state of the store.
//2-The function that returns the new state needs to be a pure function.


//that how the library looks like

function createStore(reducer) { // the arguemnt represent the reducer that user make to give the library access to it and works
    let state
    let listeners = []

    const getState = () => state
    //we need to keep tracking everytime user call susbcribe and notifyevery
    //takes in functions that will be called when the state changes and add it to array
    const subscribe = (listener)=> {
        listeners.push(listener)
        //unsubscribe
        return ()=> {
            listeners = listeners.filter(l=>l!==listener)
        }
    }

    //function resposable for update the state and loop thorogh listeners
    const dispatch = (action)=> {
        state = reducer(state,action) //state has been updated
        // call each function that has a subscribe so it can know there is a new update in the state they subscibe to
        // kind of reporter that notify function about new updates
        listeners.forEach(listener=>listener()) 
    }
    return {
        getState,
        subscribe,
        dispatch
    }
}

//REDUSER//what user type to use library
//reudcer take state and action and return (not update) a new state dpending on the action.type
function flavorReducer(state=[],action) {
    switch (action.type) {
        case 'Add_Flavor':
            return state.concat([action.payload]);
        case 'Remove_Flavor': 
            return state.filter(flavor=>flavor.id !== action.id);
        case 'Toggle_Flavor':
            return state.map(flavor=>flavor.id!==action.id?flavor:Object.assign({},flavor,{healthy: !flavor.healthy}))
        default: 
            return state
    }
}

function goalsReducer(state=[],action) {
    switch (action.type) {
        case 'Add_Goal':
            return state.concat([action.payload]);
        case 'Remove_Goal': 
            return state.filter(goal=>goal.id !== action.id);
        default: 
            return state
    }
}

const appReducer = function (state={}, action) {
    return {
        flavors: flavorReducer(state.flavors, action),
        goals: goalsReducer(state.goals, action)
    }
}

const store = createStore(appReducer)

store.subscribe(()=>{
    const {flavors,goals} = store.getState()
    flavorsList.innerHTML = ''
    goalsList.innerHTML = ''
    flavors.forEach(addFlavorItem)
    goals.forEach(addGoalItem)
    //this happens whenever state changes
})
//actions//
const addActionFlavor = function (flavor) {
    return {
        type:'Add_Flavor',
        payload: flavor
    }
}
const addActionGoal = function (goal) {
    return {
        type: 'Add_Goal',
        payload:goal
    }
}
// store.dispatch({type:'Add_Flavor', payload: {flavor: "milk",id: 1,healthy:true}})
// store.dispatch({type:'Add_Flavor', payload: {flavor: "choco",id: 2,healthy: false}})
// store.dispatch({type:'Remove_Flavor', id: 1})
// store.dispatch({type:'Toggle_Flavor', id: 2})
// store.dispatch({type: 'Add_Goal', payload:{goal:"go to gym", id:0}})


//buttons//
const flavorBttn = document.getElementById("add-flavor")
const goalBttn = document.getElementById("add-goal")
//add falvor to falvors object in the state
function addFlavor () {
    const flavor = document.getElementById("flavor")
    const flavorValue = flavor.value
    flavor.value = ''
    store.dispatch(addActionFlavor({flavor:flavorValue,id:generateId(),healthy:false}))
}

//add goal to goals object in the state
function addGoal () {
    const goal = document.getElementById("goal")
    const goalValue = goal.value
    goal.value = ''
    store.dispatch(addActionGoal({goal:goalValue, id:generateId()}))
}

flavorBttn.addEventListener('click', addFlavor)
goalBttn.addEventListener('click', addGoal)

function createRemoveBttn (onClick) {
    const removeBttn = document.createElement('button')
    removeBttn.innerHTML = 'Remove Item'
    removeBttn.addEventListener('click',onClick)
    return removeBttn
}

function addFlavorItem (flavor) { // update flavors list whenever change happens to state
    const liItem = document.createElement('li')
    const text = document.createTextNode(flavor.flavor)
    liItem.appendChild(text)
    const removeButtn = createRemoveBttn(()=>store.dispatch({type:'Remove_Flavor',id:flavor.id}))
    liItem.appendChild(removeButtn)
    flavorsList.appendChild(liItem)
    liItem.style.textDecoration = flavor.healthy? 'line-through': 'none' // change style depending on healthy
    liItem.addEventListener('click', ()=>store.dispatch({type:'Toggle_Flavor', id: flavor.id})) // toggle healthy
}
function addGoalItem (goal) {// update goals list whenever change happens to state
    const liItem = document.createElement('li')
    const text = document.createTextNode(goal.goal)
    liItem.appendChild(text)
    goalsList.appendChild(liItem)
}