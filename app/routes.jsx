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
        <Route
            path="/"
            component={App}
            onEnter={requireAuth}
            ignoreScrollBehavior>
            <IndexRoute getComponent={(location, cb) => {
                require.ensure([], require => {
                    cb(null, require('containers/Login').default)
                }, 'home')
            }} />,
           <Route
                key="dashboard"
                path="dashboard"
                getComponent={(location, cb) => {
                    require.ensure([], require => {
                        cb(null, require('containers/Dashboard').default)
                    }, 'dashboard')
                }} >
                <IndexRoute getComponent={(location, cb) => {
                    require.ensure([], require => {
                        cb(null, require('containers/Votantes').default)
                    }, 'votantesIndex')
                }} />,
                <Route
                    key="lideres"
                    path="lideres"
                    getComponent={(location, cb) => {
                        require.ensure([], require => {
                            cb(null, require('containers/Lideres').default)
                        }, 'lideres')
                    }} >
                </Route>,
                <Route
                    key="votantes"
                    path="votantes"
                    getComponent={(location, cb) => {
                        require.ensure([], require => {
                            cb(null, require('containers/Votantes').default)
                        }, 'votantes')
                    }} >
                    <Route
                        key="votantesAgregar"
                        path="agregar"
                        getComponent={(location, cb) => {
                            require.ensure([], require => {
                                cb(null, require('containers/Votantes').default)
                            }, 'votantesAgregar')
                        }} >
                    </Route>,
                    <Route
                        key="votantesActualizar"
                        path="actualizar/:id"
                        getComponent={(location, cb) => {
                            require.ensure([], require => {
                                cb(null, require('containers/Votantes').default)
                            }, 'votantesActualizar')
                        }} >
                    </Route>,
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
