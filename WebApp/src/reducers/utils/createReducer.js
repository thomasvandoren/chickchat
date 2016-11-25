/**
 * @module reducers/utils/createReducer
 */

/**
 * Util for creating reducer from specification object.
 *
 * `createReducer` creates a reducer that takes an object specifying specific
 * handlers based on an {@link ActionType}.
 *
 * `handlers` should look like this:
 *
 * ```js
 * handlers = {
 *   'INCREMENT': (state, amount) => state + amount,
 *   'DECREMENT': (state, amount) => state - amount
 * }
 * ```
 *
 * @param  {*} initialState - initial state for reducer on initialization
 * @param  {object} handlers - map of actions this reducer handles to sub-reducers
 * for each action
 * @return {ReduxReducer}
 */
export default function createReducer(initialState, handlers) {
    return (state = initialState, action) => {
        return handlers[action.type]
            ? handlers[action.type](state, action.payload)
            : state
    }
}
