import React, {PropTypes} from "react"
import {connect} from "react-redux"
import attachImage from "src/util/attachImage"

export class ReplyBox extends React.Component {
    onAttachImage = attachImage.bind(this)

    state = {
        text: "",
        data: "",
    }

    updateText = (e) => {
        this.setState({text: e.target.value})
    }

    sendReply = () => {
        this.props.replyText(this.state.text)
        this.setState({text: ""})
    }

    sendImage = () => {
      this.props.replyImage(this.state.data)
      this.setState({data: ""})
    }

    handleKey = (e) => {
      if (e.key === 'Enter') {
        this.sendReply()
      }
    }

    render () {
        return (
            <div>

                {/* Exercise 2: Render a text input and a button */}

                <input value={this.state.text} onChange={this.updateText} onKeyPress={this.handleKey(e)} />
                <button onClick={this.sendReply}>Send</button>

                <input type="file" onChange={this.onAttachImage} />
                <button onClick={this.sendImage}>Upload!</button>
            </div>
        )
    }
}

ReplyBox.propTypes = {
    replyImage: PropTypes.func,
    replyText: PropTypes.func
}

export default connect(undefined, {
    replyText: (text) => ({
        type: "REPLY",
        apiEndpoint: "chatPOST",
        payload: {text}
    }),
    replyImage: (data) => ({
        type: "REPLY",
        apiEndpoint: "chatPOST",
        payload: {data}
    })
})(ReplyBox)
