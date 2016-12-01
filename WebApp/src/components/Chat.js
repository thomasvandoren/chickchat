import React, {PropTypes} from "react"
import {connect} from "react-redux"

function renderMessage (message) {
    return (
        <li key={message.id}>
            {message.text}
        </li>
    )
}

const rootStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    height: "100%"
}

export class Chat extends React.Component {
    render () {
        return (
            <div style={rootStyle}>
                <ul>
                    {this.props.messages.map(renderMessage)}
                </ul>
            </div>
        )
    }
}

Chat.propTypes = {
    messages: PropTypes.array
}

function mapStateToProps (state) {
    return {
        messages: state.messages || []
    }
}

export default connect(
    mapStateToProps
)(Chat)
