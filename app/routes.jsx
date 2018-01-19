import React from 'react'
import { Route, IndexRoute } from 'react-router'
/* Actions */
import { getUserInfo } from 'actions/user'
/**Components */
import App from 'containers/App'
/* Helpers */
import { getToken } from 'helpers/helpers'
import { selectMenuItem } from './utils/routes'

/*
 * @param {Redux Store}
 * We require store as an argument here because we wish to get
 * state from the store after it has been authenticated.
 */
export default store => {
    /* Si no esta logeado redirecciona a la raiz */
    const requireAuth = (nextState, replace, callback) => {
        if (typeof window === 'object') {
            const { location } = nextState
            var pathname = location.pathname
            let token = getToken()
            const { user: { authenticated } } = store.getState()

            selectMenuItem(pathname, store.dispatch)
            if (token && !authenticated) {
                store.dispatch(getUserInfo(token))
            }
            if ((pathname === '/') && token) {
                replace({ pathname: '/dashboard' })
            }
            if ((pathname !== '/') && !token) {
                replace({ pathname: '/' })
            }
        }
        callback()
    }

    return (
        <Route path="/" component={App} ignoreScrollBehavior>
            <IndexRoute getComponent={(location, cb) => {
                require.ensure([], require => {
                    cb(null, require('containers/Login').default)
                }, 'home')
            }} />,
           <Route
                key="dashboard"
                path="dashboard"/* 
                onEnter={requireAuth} */
                getComponent={(location, cb) => {
                    require.ensure([], require => {
                        cb(null, require('containers/Dashboard').default)
                    }, 'dashboard')
                }} >
                <IndexRoute getComponent={(location, cb) => {
                    require.ensure([], require => {
                        cb(null, require('containers/GestionPersonas').default)
                    }, 'viewBookingsIndex')
                }} />,
                <Route
                    key="votantes"
                    path="votantes"
                    getComponent={(location, cb) => {
                        require.ensure([], require => {
                            cb(null, require('containers/Votantes').default)
                        }, 'votantes')
                    }} >
                </Route>,
                <Route
                    key="consultar"
                    path="consultar"
                    getComponent={(location, cb) => {
                        require.ensure([], require => {
                            cb(null, require('containers/PuestoVotacion').default)
                        }, 'consultar')
                    }} >
                </Route>,
            </Route>,
            <Route
                key="signup"
                path="signup"
                getComponent={(location, cb) => {
                    require.ensure([], require => {
                        cb(null, require('containers/Signup').default)
                    }, 'signup')
                }} />,
            <Route
                key="signupConfirmation"
                path="signup/confirmation/:id"
                getComponent={(location, cb) => {
                    require.ensure([], require => {
                        cb(null, require('containers/SignupConfirmation').default)
                    }, 'signupConfirmation')
                }} />
        </Route>
    )
}
