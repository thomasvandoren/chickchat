import createReducer from "./utils/createReducer"

const initialState = ""

export default createReducer(initialState, {
    SET_DISPLAY_BOOK(state, payload) {
        return payload
    }
})
