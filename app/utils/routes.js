import {
    SELECT_MENU_ITEM_DEFAULT,
    SELECT_MENU_ITEM_ADD_BOOKING,
    SELECT_MENU_ITEM_ALL_BOOKING,
    SELECT_MENU_ITEM_UPDATE_BOOKING
} from 'utils/keys'
import { selectMenuItem as selectMenuItemAction } from 'actions/ui'
SELECT_MENU_ITEM_UPDATE_BOOKING
export const selectMenuItem = (pathname, dispatch) => {
    switch (pathname) {
        case '/dashboard/bookings/add':
            dispatch(selectMenuItemAction(SELECT_MENU_ITEM_ADD_BOOKING))
            break;
        case '/dashboard/bookings/update':
            dispatch(selectMenuItemAction(SELECT_MENU_ITEM_UPDATE_BOOKING))
            break;
        default:
            dispatch(selectMenuItemAction(SELECT_MENU_ITEM_DEFAULT))
            break;
    }
}