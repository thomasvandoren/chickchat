import React, {PropTypes as T} from "react"
import {replace} from "react-router-redux"
import {connect} from "react-redux"
import AuthService from "../util/AuthService"


export class Login extends React.Component {
    static propTypes = {
        location: T.object,
        auth: T.instanceOf(AuthService)
    }

    componentDidMount() {
        this.props.auth.lock.on('authenticated', (authResult) => {
            this.props.auth.lock.hide()
            const state = JSON.parse(authResult.state)
            if (state.pathname !== '/login' && state.pathname !== '/logout') {
                this.props.replace(state.pathname)
            } else {
                this.props.replace('/')
            }
        })
        if (this.props.auth.loggedIn()) {

            return
        }
        this.props.auth.login()
    }

    render() {
        return null;
    }
}

export default connect(undefined, {replace})(Login)