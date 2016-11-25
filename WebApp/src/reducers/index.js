import {combineReducers} from "redux"
import {routerReducer} from "react-router-redux"
import api from "./apiReducer"
import books from "./book"
import displayBook from "./displayBook"
import vote from "./vote"

export default combineReducers({
    api,
    books,
    displayBook,
    routing: routerReducer,
    vote
})