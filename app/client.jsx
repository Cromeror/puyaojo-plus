import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { Router, browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import createRoutes from './routes'
import { GET_ALL_DATA, LOAD_LANDING_DATA } from './types'
import configureStore from './store/configureStore'
import fetchDataForRoute from './utils/fetchDataForRoute'
import { selectMenuItem } from 'utils/routes'

var ReactGA = require('react-ga')

// Grab the state from a global injected into
// server-generated HTML
const initialState = window.__INITIAL_STATE__
const store = configureStore(initialState, browserHistory)
const history = syncHistoryWithStore(browserHistory, store)
const routes = createRoutes(store)

/**
 * Callback function handling frontend route changes.
 */
function onUpdate() {
  // Prevent duplicate fetches when first loaded.
  // Explanation: On server-side render, we already have __INITIAL_STATE__
  // So when the client side onUpdate kicks in, we do not need to fetch twice.
  // We set it to null so that every subsequent client-side navigation will
  // still trigger a fetch data.
  // Read more: https://github.com/choonkending/react-webpack-node/pull/203#discussion_r60839356
  if (window.__INITIAL_STATE__ !== null) {
    window.__INITIAL_STATE__ = null
    return
  }

  const { pathname, query } = this.state.location
  if (!window.previousLocation) window.previousLocation = ''
  var isRoot = pathname === '/'

  if (window.previousLocation !== pathname) {
    window.scrollTo(0, 0)
    ReactGA.set({ page: window.location.pathname })
    ReactGA.pageview(window.location.pathname)
  }
  window.previousLocation = pathname

  selectMenuItem(pathname, store.dispatch)

  /* Habilitar si es necesario - Se hace un fetch de los datos de una ruta cuando se cambia de ruta
    desde el front
  fetchDataForRoute(this.state).then(data => {
    if (data) {
      if (isRoot) {
        return store.dispatch({ type: GET_ALL_DATA, data: data })
      }
    }
  })*/
}

// Router converts <Route> element hierarchy to a route config:
// Read more https://github.com/rackt/react-router/blob/latest/docs/Glossary.md#routeconfig
render(
  <Provider store={store}>
    <Router history={history} onUpdate={onUpdate}>
      {routes}
    </Router>
  </Provider>, document.getElementById('app'))
