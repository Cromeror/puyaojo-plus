import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
/* Components */
import { Menu, Icon } from 'antd';
const SubMenu = Menu.SubMenu;
/* Utils */
import { pathnames, keys } from '../utils/keys'

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
                defaultOpenKeys={['votacion', 'Liderazgo']}
                mode="inline"
                theme="dark">
                <Menu.Item key={keys.SELECT_MENU_ITEM_DEFAULT}>
                    <Link to="/dashboard/votantes">
                        <span><Icon type="appstore" /><span>Escritorio</span></span>
                    </Link>
                </Menu.Item>
                <SubMenu key="votacion" title={<span><Icon type="appstore" /><span>Votación</span></span>}>
                    <Menu.Item key={keys.SELECT_MENU_ITEM_VOTANTES}>
                        <Link to="/dashboard/votantes">
                            Votantes
                        </Link>
                    </Menu.Item>
                    <Menu.Item key={keys.SELECT_MENU_ITEM_CONSULTAR} >
                        <Link to={pathnames.PATH_CONSULTAR}>
                            Consultar
                        </Link>
                    </Menu.Item>
                </SubMenu>
                <SubMenu key="Liderazgo" title={<span><Icon type="appstore" /><span>Liderazgo</span></span>}>
                    <Menu.Item key={keys.SELECT_MENU_ITEM_LIDERES} >
                        <Link to={pathnames.PATH_LIDERES}>
                            Lideres
                        </Link>
                    </Menu.Item>
                </SubMenu>
                <Menu.Item key={keys.SELECT_MENU_ITEM_CERRAR_SESION} >
                    <Link to="/dashboard">
                        Cerrar sesión
                        </Link>
                </Menu.Item>
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