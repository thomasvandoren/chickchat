import {combineReducers} from "redux"
import {routerReducer} from "react-router-redux"
import api from "./apiReducer"
import messages from "./messagesReducer"

export default combineReducers({
    api,
    messages,
    routing: routerReducer
})
