import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'

import data from './data'
import ui from './ui'
import user from './user'

export const rootReducer = combineReducers({
  routing,
  ui,
  data,
  user
})

export default rootReducer
