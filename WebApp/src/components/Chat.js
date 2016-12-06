import moment from "moment"
import React, {PropTypes} from "react"
import {connect} from "react-redux"
import ReplyBox from "./ReplyBox"

export class Chat extends React.Component {
    render () {
        return (
            <div style={rootStyle}>
                <ul style={ulStyle} ref="messages">
                    {this.props.messages.map(renderMessage)}
                </ul>

                {/* Exercise 2: Add a ReplyBox component */}

                <ReplyBox />
            </div>
        )
    }

    componentDidUpdate (prevProps) {
        if (prevProps.messages.length === this.props.messages.length) {
            return
        }

        const element = this.refs.messages
        if (element) {
            element.scrollTop = element.scrollHeight
        }
    }
}

function renderMessage (message) {
    return (
      <div>
        <li key={message.messageId}>

            {/* Exercise 3: Add message author */}

            <hr/>

            <div style={userStyle}>
            <img src={message.author.picture} style={avatarStyle} />
            <br/>
            {message.author.name}
            <br/>
            {getMessageDate(message)}
            </div>
            <div style={contentStyle}>
            {getMessageBody(message)}
            </div>
        </li>
        </div>
    )
}

const userStyle = {
  display: "inline-block",
  justifyContent: "space-between",
}

const contentStyle = {
  display: "inline-block",
  justifyContent: "space-between",
  margin: "1em",
}

const ulStyle = {
    overflowY: "scroll",

    /* Exercise 4: Add your own styles */
    listStyle: "none",
}

const imageStyle = {
    maxWidth: "300px",
    maxHeight: "300px",
    objectFit: "contain",
}

const avatarStyle = {
    maxWidth: "100px",
    maxHeight: "100px",
    objectFit: "contain",
    borderRadius: "50%",
}

const rootStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    height: "100%"
}

function getMessageDate (message) {
    return moment(message.timestampUtc).format("dddd, h:mm A")
}

function getMessageBody (message) {
    if (message.data) {
        return <img src={message.data} style={imageStyle} />
    } else {
        return message.text
    }
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
