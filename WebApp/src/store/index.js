/**
 * This store integrates with the following middleware:
 * - [thunk middleware](https://github.com/gaearon/redux-thunk) - support for
 *   [thunked actions]{@link ReduxAction}
 * - [API middleware]{@link module:store/middleware/apiMiddleware} - handle
 *   HTTP requests
 * - [persist middleware]{@link module:store/middleware/persistMiddleware} -
 *   handle local storage
 * - [router middleware](https://github.com/reactjs/react-router-redux) - store
 *   router state in application state
 *
 * #### SOUP Integrated by this module
 * - [redux](https://github.com/reactjs/redux)
 * - [react-redux](https://github.com/reactjs/react-redux)
 * - [react-router-redux](https://github.com/reactjs/react-router-redux)
 * - [react-thunk](https://github.com/gaearon/redux-thunk)
 *
 * @module store
 */
import {applyMiddleware, createStore, compose} from "redux"
import thunk from "redux-thunk"
import {routerMiddleware} from "react-router-redux"
import apiMiddleware from "src/middleware/apiMiddleware"
import {browserHistory} from "react-router"
import reducer from "src/reducers"

let middleware = [
    thunk,
    apiMiddleware,
    routerMiddleware(browserHistory)
];

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducer, undefined, composeEnhancers(
    applyMiddleware(...middleware)
));

if (module.hot) {
    module.hot.accept('src/reducers', () => {
        const nextReducers = require('src/reducers');

        store.replaceReducer(nextReducers)
    })
}

export default store
