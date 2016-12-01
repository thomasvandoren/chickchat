import React, {PropTypes} from "react"
import {connect} from "react-redux"
import sLib from "../3rd/socketize.min"
sLib.noConflict()

const POLL_INTERVAL = 1000

export class Fetch extends React.Component {
    _onChange = () => {
    }

    _poll = () => {
        this._onChange()
        this.timer = setTimeout(this._poll, POLL_INTERVAL)
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

export default connect(undefined, {
    update: () => {
        return {
            type: 'UPDATE_CHAT',
            apiEndpoint: 'chatGET'
        }
    }
})(Fetch)
