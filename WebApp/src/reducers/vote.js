import createReducer from "./utils/createReducer"

const initialState = []

export default createReducer(initialState, {
    UPDATE_VOTE(state, payload) {
        return payload.orderedBooks
    },
    GET_VOTE_SUCCESS(state, payload) {
        return payload.orderedBooks
    }
})