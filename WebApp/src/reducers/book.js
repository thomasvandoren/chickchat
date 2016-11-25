import createReducer from "./utils/createReducer"

const initialState = []

export default createReducer(initialState, {
    LOAD_BOOKS_SUCCESS(state, payload) {
        return payload
    }
})