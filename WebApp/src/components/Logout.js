import React, {PropTypes as T} from "react"
import {connect} from "react-redux"
import {push} from "react-router-redux"
import AuthService from "../util/AuthService"

export class Logout extends React.Component {
    static propTypes = {
        auth: T.instanceOf(AuthService)
    }

    componentWillMount() {
        this.props.auth.logout()
        this.props.push('/')
    }

    render() {
        return null
    }
}


export default connect(undefined, {push})(Logout);