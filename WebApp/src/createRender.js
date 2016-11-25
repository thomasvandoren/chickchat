import React from "react"
import ReactDOM from "react-dom"
import {browserHistory} from "react-router"
import {syncHistoryWithStore} from "react-router-redux"
import Root from "./components/Root"
import store from "./store"
import {AppContainer} from "react-hot-loader"
const history = syncHistoryWithStore(browserHistory, store);

const rootEl = document.getElementById('app');

export default function createRender() {
    function render() {
        ReactDOM.render(
            <AppContainer>
                <Root store={store} history={history}/>
            </AppContainer>,
            rootEl
        )
    }

    if (__HMR__) {
        const renderError = (error) => {
            const RedBox = require('redbox-react');
            ReactDOM.render(
                <RedBox error={error}/>,
                rootEl
            )
        };

        const hotRender = () => {
            try {
                render()
            } catch (error) {
                renderError(error)
            }
        };

        module.hot.decline("src/routes.js");
        module.hot.accept('src/components/Root', () => {
            const NewRoot = require('./components/Root')
            ReactDOM.render(
                <AppContainer>
                    <NewRoot store={store} history={syncHistoryWithStore(browserHistory, store)}/>
                </AppContainer>,
                rootEl
            )
        });

        return hotRender
    } else {
        return render
    }
}
