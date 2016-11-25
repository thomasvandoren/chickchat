import React, {PropTypes} from "react"
import App from "./components/App"
import AuthService from "./util/AuthService"
import Login from "./components/Login"
import Logout from "./components/Logout"
import {Route, IndexRedirect} from "react-router"

const auth = new AuthService('', '')

const requireAuth = (nextState, replace) => {
    if (!auth.loggedIn()) {
        replace({pathname: '/login'})
    }
}

export const makeMainRoutes = () => {
    return <Route path="/" component={App} auth={auth}>
        <IndexRedirect to="/chat"/>
        <Route path="chat" component={Chat} onEnter={requireAuth}/>
        <Route path="login" component={Login}/>
        <Route path="logout" component={Logout}/>
    </Route>
}

export default makeMainRoutes