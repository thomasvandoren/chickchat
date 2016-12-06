import React, {PropTypes} from "react"
import {connect} from "react-redux"
import sLib from "../3rd/socketize.min"
sLib.noConflict()

const POLL_INTERVAL = 1000

export class Fetch extends React.Component {
    _onChange = () => {
        return this.props.update()
    }

    _poll = () => {
        this._onChange().then(
          () => {
            this.timer = setTimeout(this._poll, POLL_INTERVAL)
          }
        ).catch(() => {
          this.timer = setTimeout(this._poll, POLL_INTERVAL)
        })
    }

    componentDidMount() {
        const params = {
            public_key: 'eAmkRw_EZiVbJ79ZguAx1VM'
        }
        this.socketize = new Socketize.client(params)
        this.socketize.subscribeToKey('public/messages', this._onChange);
        this.timer = setTimeout(this._poll, POLL_INTERVAL)
    }

    componentWillUnmount() {
        this.socketize.unsubscribe('public/messages')
        if (this.timer) {
            clearTimeout(this.timer)
            this.timer = undefined
        }
    }

    render() {
        return null;
    }
}

Fetch.propTypes = {
    update: PropTypes.func
}

export default connect(undefined, {
    update: () => ({
        type: 'GET_MESSAGES',
        apiEndpoint: 'chatGET'
    })
})(Fetch)
