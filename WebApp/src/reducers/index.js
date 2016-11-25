import {combineReducers} from "redux"
import {routerReducer} from "react-router-redux"
import api from "./apiReducer"

export default combineReducers({
    api,
    routing: routerReducer,
})