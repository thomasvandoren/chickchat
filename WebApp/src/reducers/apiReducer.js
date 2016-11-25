/**
 * @module reducers/apiReducer
 */
/**
 * Reducer for API state.
 *
 * This reducer stores the application state for the API endpoints that
 * are specified by [actions]{@link module:actions} and consumed by the
 * [API middleware]{@link module:store/middleware/apiMiddleware}.
 *
 * The state shape looks like this:
 *
 * ```js
 * appState.api = {
 *   endpoints: {
 *     getClass: {
 *       method: 'GET',
 *       url: '/classes/{id}'
 *     },
 *     createClass: {
 *       method: 'POST',
 *       url: '/classes'
 *     }
 *   }
 * }
 * ```
 *
 * @type {ReduxReducer}
 * @see {@link module:actions/apiActions}
 *
 * @name apiReducer
 */
import createReducer from "src/reducers/utils/createReducer"
import config from "src/config"

const initialState = {
    url: config.apiUrl,
    endpoints: {
        booksGET: {
            method: 'get',
            url: `${config.apiUrl}/book`
        },
        booksPOST: {
            method: 'post',
            url: `${config.apiUrl}/book`
        },
        voteGET: {
            method: 'get',
            url: `${config.apiUrl}/vote`
        },
        votePUT: {
            method: 'put',
            url: `${config.apiUrl}/vote`
        }
    }
};

export default createReducer(initialState, {
    DEAD(state) {
        return state
    }
})
