import React, {PropTypes} from "react"
import {connect} from "react-redux"
import Fetch from "../components/Fetch"
import Chat from "../components/Chat"
import {AppBar} from "material-ui"

export class ChatPage extends React.Component {
    componentWillMount() {

    }

    render() {
        return (
            <div style={{height: "100%", display: "flex", flexDirection: "column"}}>
                <AppBar title="ChickChat" showMenuIconButton={false} />
                <Chat />
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
