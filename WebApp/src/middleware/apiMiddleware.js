import template from "url-template"
import {stringify as qsStringify} from "query-string"
import {normalize} from "normalizr"
import fetchJSON from "../util/fetchJSON"
import {getToken, loggedIn} from "../util/AuthService"

function replaceUrlTemplate(urlTemplate, pathParams = {}, queryParams = {}) {
    const url = template.parse(urlTemplate).expand(pathParams);
    const queryString = qsStringify(queryParams);
    return `${url}${queryString && '?' + queryString}`
}

export function createApiMiddleware(fetchJSON, normalize) {
    return ({dispatch, getState}) => next => action => {
        const endpointName = action.apiEndpoint;

        if (!endpointName) {
            return next(action)
        }

        const {endpoints} = getState().api;
        const endpoint = endpoints[endpointName];

        if (!endpoint) {
            throw new Error(`unknown API endpoint '${endpointName}'`)
        }

        dispatch({type: action.type, payload: action.payload});

        const {method, url: urlTemplate} = endpoint;
        const requestOptions = {
            method
        };

        if (!['get', 'head'].includes(method.toLowerCase())) {
            requestOptions.body = JSON.stringify(action.payload);
            requestOptions.headers = {
                ...requestOptions.headers,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }

        if (loggedIn()) {
            requestOptions.headers = {
                ...requestOptions.headers,
                'Authorization': 'Bearer ' + getToken()
            }
        }

        const url = replaceUrlTemplate(urlTemplate, action.pathParams, action.queryParams);

        return fetchJSON(url, requestOptions)
            .then((response) => {
                if (action.schema) {
                    response = normalize(response, action.schema)
                }

                if (typeof action.success === 'function') {
                    action.success(dispatch, getState, response)
                } else {
                    dispatch({type: `${action.type}_SUCCESS`, payload: response})
                }

                return response
            })
            .catch((error) => {
                console.error(error)

                if (typeof action.failure === 'function') {
                    action.failure(dispatch, getState, error)
                } else {
                    dispatch({type: `${action.type}_FAILURE`, payload: error})
                }
            })
    }
}

export default createApiMiddleware(fetchJSON, normalize)
