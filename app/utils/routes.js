import {
    SELECT_MENU_ITEM_DEFAULT,
    SELECT_MENU_ITEM_LIDERES,
    SELECT_MENU_ITEM_VOTANTES,
    SELECT_MENU_ITEM_ESCRITORIO
} from 'utils/keys'
import { selectMenuItem as selectMenuItemAction } from 'actions/ui'

export const selectMenuItem = (pathname, dispatch) => {
    switch (pathname) {
        default:
            dispatch(selectMenuItemAction(SELECT_MENU_ITEM_DEFAULT))
            break;
    }
}