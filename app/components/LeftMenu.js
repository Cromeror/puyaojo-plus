import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
/* Components */
import { Menu, Icon } from 'antd';
const SubMenu = Menu.SubMenu;
/* Utils */
import {
    SELECT_MENU_ITEM_ALL_BOOKING,
    SELECT_MENU_ITEM_ADD_BOOKING
} from '../utils/keys'

class LeftMenu extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
        }
    }

    render() {
        const { menuItemSelected } = this.props
        return (
            <Menu onClick={this.selectItem}
                defaultSelectedKeys={[menuItemSelected]}
                defaultOpenKeys={['booking_group']}
                mode="inline"
                theme="dark">
                <SubMenu key="booking_group" title={<span><Icon type="appstore" /><span>Bookings</span></span>}>
                    <Menu.Item key={SELECT_MENU_ITEM_ALL_BOOKING}>
                        <Link to="/dashboard/bookings">
                            Show All Bookings
                        </Link>
                    </Menu.Item>
                    <Menu.Item key={SELECT_MENU_ITEM_ADD_BOOKING} >
                        <Link to="/dashboard/bookings/add">
                            Add booking
                        </Link>
                    </Menu.Item>
                </SubMenu>
            </Menu>
        )
    }
}

function mapStateToProps(state) {
    return {
        menuItemSelected: state.ui.dashboard.menuItemSelected
    }
}

export default connect(mapStateToProps)(LeftMenu)