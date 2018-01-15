import { SET_UI_VARS, CHANGE_MODAL_VISIBILITY, SET_CURRENT_MODAL, SELECT_MENU_ITEM } from '../types'

export function initUIVars(width, height, isMobile) {
    return dispatch => {
        dispatch({ type: SET_UI_VARS, width, height, isMobile })
    }
}

export function setCurrentModal(modal, visibility = false) {
    return { type: SET_CURRENT_MODAL, content: modal, visibility }
}

export function changeModalVisibility(visibility) {
    return { type: CHANGE_MODAL_VISIBILITY, visibility }
}

export function selectMenuItem(menuItemSelected) {
    return { type: SELECT_MENU_ITEM, menuItemSelected }
}