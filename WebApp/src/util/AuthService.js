import Auth0Lock from "auth0-lock"
import {isTokenExpired} from "./jwtHelper"

export default class AuthService {
    constructor(clientId, domain) {
        // Configure Auth0
        this.lock = new Auth0Lock(clientId, domain, {
            auth: {
                redirectUrl: window.location.origin + '/login',
                responseType: 'token',
                params: {
                    state: JSON.stringify({pathname: window.location.pathname})
                }
            }
        })
        // Add callback for lock `authenticated` event
        this.lock.on('authenticated', this._doAuthentication.bind(this))
        // binds login functions to keep this context
        this.login = this.login.bind(this)
    }

    _doAuthentication(authResult) {
        // Saves the user token
        this.state = authResult.state
        console.log(authResult)
        this.setToken(authResult.idToken)
    }

    login() {
        // Call the show method to display the widget.
        this.lock.show()
    }

    loggedIn() {
        // Checks if there is a saved token and it's still valid
        const token = this.getToken()
        return !!token && !isTokenExpired(token)
    }

    setToken(idToken) {
        // Saves user token to localStorage
        localStorage.setItem('id_token', idToken)
    }

    getToken() {
        // Retrieves the user token from localStorage
        return localStorage.getItem('id_token')
    }

    logout() {
        // Clear user token and profile data from localStorage
        localStorage.removeItem('id_token');
    }

    getRedirectOptions(hash) {
        const parseHash = this.lock.parseHash(hash)
        return hash.state
    }
}

export function loggedIn() {
    // Checks if there is a saved token and it's still valid
    const token = getToken()
    return !!token && !isTokenExpired(token)
}

export function getToken() {
    // Retrieves the user token from localStorage
    return localStorage.getItem('id_token')
}