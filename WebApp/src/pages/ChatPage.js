import React, {PropTypes} from "react"
import {connect} from "react-redux"
import Fetch from "../components/Fetch"

export class ChatPage extends React.Component {
    componentWillMount() {

    }

    render() {
        return (
            <div>
                <h1>Hello World</h1>
                <Fetch />
            </div>
        )
    }
}

ChatPage.propTypes = {};

ChatPage.mapStateToProps = (state) => {
    return {}
}

export default connect(
    ChatPage.mapStateToProps,
    {}
)(ChatPage)
