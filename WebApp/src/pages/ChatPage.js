import React, {PropTypes} from "react"
import {connect} from "react-redux"

export class ChatPage extends React.Component {
    componentWillMount() {

    }

    render() {
        return (
            <h1>Hello World</h1>
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
