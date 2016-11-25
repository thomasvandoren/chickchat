import React, {PropTypes} from "react"
import getMuiTheme from "material-ui/styles/getMuiTheme"
import injectTapEventPlugin from "react-tap-event-plugin"

injectTapEventPlugin()

const muiTheme = getMuiTheme({});

export default class App extends React.Component {
    getChildContext() {
        return {muiTheme}
    }

    render() {
        let children = null;
        if (this.props.children) {
            children = React.cloneElement(this.props.children, {
                auth: this.props.route.auth //sends auth instance from route to children
            })
        }

        return (
            <div style={{height: "100%", margin: 0}} className='app'>
                {children}
            </div>
        )
    }
}

App.childContextTypes = {
    muiTheme: PropTypes.object.isRequired
};
