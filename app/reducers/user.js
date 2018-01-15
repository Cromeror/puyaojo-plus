import { combineReducers } from 'redux'
import {
    USER_LOGIN,
    USER_LOGOUT,
    USER_LOGIN_ERROR
} from 'types'

const authenticated = (state = false, action) => {
    switch (action.type) {
        case USER_LOGIN:
            return true

        case USER_LOGOUT:
            return false

        default:
            return state
    }
}

const data = (state = null, action = {}) => {
    switch (action.type) {
        case USER_LOGIN:
            return action.data

        case USER_LOGOUT:
            return null

        default:
            return state
    }
}

const error = (state = null, action = {}) => {
    switch (action.type) {
        case USER_LOGIN_ERROR:
            return { loginError: action.data.loginError }

        default:
            return state
    }
}

const user = combineReducers({
    authenticated,
    data,
    error
})

export default user