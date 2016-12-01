import React, {PropTypes} from "react"
import {connect} from "react-redux"

export class Chat extends React.Component {
    render () {
        return (
            <div style={rootStyle}>
                <ul>
                    {this.props.messages.map(renderMessage)}
                </ul>

                {/* Exercise 2: Add a ReplyBox component */}

            </div>
        )
    }
}

function renderMessage (message) {
    return (
        <li key={message.id}>

            {/* Exercise 3: Add message author */}

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

Chat.propTypes = {
    messages: PropTypes.array
}

function mapStateToProps (state) {
    return {
        messages: state.messages
    }
}

export default connect(
    mapStateToProps
)(Chat)
