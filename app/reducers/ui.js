import { combineReducers } from 'redux'
import { SET_UI_VARS, SET_CURRENT_MODAL, CHANGE_MODAL_VISIBILITY, SELECT_MENU_ITEM } from '../types'
import { SELECT_MENU_ITEM_DEFAULT } from '../utils/keys'

const wVars = (state = { wWidth: 1024, wHeight: 768, loaded: false }, action = {}) => {
    switch (action.type) {

        case SET_UI_VARS:
            return { wWidth: action.width, wHeight: action.height, isMobile: action.isMobile, loaded: true }

        default:
            return state;
    }
}

const modal = (state = { data: null, visibility: false }, action = {}) => {
    switch (action.type) {
        case SET_CURRENT_MODAL:
            if (action.visibility) {
                return Object.assign({}, state, { content: action.content, visibility: action.visibility })
            } else {
                return Object.assign({}, state, { content: action.content })
            }

        case CHANGE_MODAL_VISIBILITY:
            return Object.assign({}, state, { visibility: action.visibility })

        default:
            return state
    }
}

const dashboard = (state = { menuItemSelected: SELECT_MENU_ITEM_DEFAULT }, action = {}) => {
    switch (action.type) {
        case SELECT_MENU_ITEM:
            return Object.assign({}, state, { menuItemSelected: action.menuItemSelected })
        default:
            return state
    }
}

const ui = combineReducers({
    wVars,
    modal,
    dashboard
})

export default ui