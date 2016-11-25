import React, {PropTypes} from "react"
import App from "./components/App"
import AuthService from "./util/AuthService"
import ChatPage from "./pages/ChatPage"
import Login from "./components/Login"
import Logout from "./components/Logout"
import {Route, IndexRedirect} from "react-router"

const auth = new AuthService('5mEPvtSaOrH23TKWEebEBZZkHcE4N072', 'chickchat.auth0.com')

const requireAuth = (nextState, replace) => {
    if (!auth.loggedIn()) {
        replace({pathname: '/login'})
    }
}

export const makeMainRoutes = () => {
    return <Route path="/" component={App} auth={auth}>
        <IndexRedirect to="/chat"/>
        <Route path="chat" component={ChatPage} onEnter={requireAuth}/>
        <Route path="login" component={Login}/>
        <Route path="logout" component={Logout}/>
    </Route>
}

export default makeMainRoutes