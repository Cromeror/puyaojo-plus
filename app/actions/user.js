import {
    USER_LOGIN,
    USER_LOGOUT,
    USER_LOGIN_ERROR,
    SELECT_MENU_ITEM
} from '../types'
import { SELECT_MENU_ITEM_DEFAULT } from '../utils/keys'
import userService from '../services/user'
import { saveToken } from '../helpers/helpers'
import { selectMenuItem } from '../actions/ui'

/**
 * Permite hacer una petición a la API para solicitar la autenticación del usuario
 * @param {string} email
 * @param {string} password
 */
export function login(data) {
    return dispatch => {
        userService.login({ ...data }).then(response => {
            if (response.status == 201 && response.data) {
                saveToken(response.data.token)
                selectMenuItem(SELECT_MENU_ITEM_DEFAULT)
                dispatch({ type: USER_LOGIN, data: { ...response.data.user, token: response.data.accessToken } })
            } else {
                /**Dejar aqui hasta que se descarte el tratamiento de otras respuestas http distintas a las de error */
                console.log('La respuesta de la api no fue 201')
            }
        }).catch(error => {
            dispatch({ type: USER_LOGIN_ERROR, data: { loginError: error.response.data } })
        })
    }
}

export function logout() {
    return dispatch => {
        saveToken(null)
        dispatch({ type: USER_LOGOUT })
    }
}

export function signup(data, query) {
    return dispatch => {
        userService.signup(data, query)
            .then(response => {
                if (response.status == 201 && response.data) {
                    dispatch(login(data))
                } else {
                    console.log('Error al registrarse')
                }
            }).catch(error => {
                console.log(error)
            })
    }
}

export function confirm(id, data) {
    return dispatch => {
        userService.confirm(id, data)
            .then(response => {
                if (response.status == 200 && response.data) {
                    dispatch(login(data))
                } else {
                    console.log('Error al registrarse')
                }
            }).catch(error => {
                console.log(error)
            })
    }
}

export function getUserInfo(token) {
    return dispatch => {
        userService.getUserInfo(token)
            .then(response => {
                if (response.status == 200 && response.data) {
                    dispatch({ type: USER_LOGIN, data: { ...response.data, token: token } })
                }
                else {
                    logout()
                }
            }).catch(error => {
                console.log(error)
            })
    }
}