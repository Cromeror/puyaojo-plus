import React, { PropTypes, Children } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router'
import axios from 'axios'
/* Config */
import { serverConfig, emails } from '../../../config/localConfig'
import { isProduction } from '../../../config/app'
import { ENV } from '../../../config/env'
/* Page meta */
import Page from 'pages/Page'
import { title as metaTitle, meta, link } from 'pages/assets'
/* Components */
import { Layout, Menu, Breadcrumb, Button } from 'antd'
/* Actions */
import { logout, getUserInfo } from 'actions/user'
import { getAllData } from 'actions/example'
import { initUIVars } from 'actions/ui'
/* Helpers */
import { getToken } from 'helpers/helpers'
/**Images */
import jts_logo from 'images/logo-white.png'
/* Styles */
if (isProduction || __DEVCLIENT__) {
    require('css/main.scss')
}

const { Header, Content, Footer } = Layout

class App extends React.Component {
    constructor(props) {
        super(props)
    }

    componentWillMount() {
        const { actions } = this.props
        let token = getToken()
        /* Si existe un token se carga y se inicia session */
        if (token) {
            actions.getUserInfo(token)
        }
        /* Se obtiene el width y height del navegador */
        if (typeof window === 'object') {
            actions.initUIVars(window.innerWidth, window.innerHeight, window.innerWidth < 460)
        }
    }

    render() {
        const { data, location, children, user } = this.props

        return (
            <Page title={metaTitle} meta={meta} link={link}>
                <Layout className='container'>
                    <Header>
                        <Link to="/" className="logo">
                            <div style={{ margin: 'auto' }}>
                                <label >Powered by</label>
                                {/* <img className={"noPadding"} src={jts_logo} height="34px" /> */}
                            </div>
                        </Link>
                        {user.authenticated && this.loadUserNavBar(user.data)}
                    </Header>
                    {children}
                    <Footer>
                        <div >
                            <label >Powered by</label>
                            <Link to="/">
                                {/* <img className={"noPadding"} src={jts_logo} height="34px" /> */}
                            </Link>
                        </div>
                    </Footer>
                </Layout>
            </Page>
        )
    }

    loadUserNavBar = (user) => {
        return (
            <div style={{ float: 'right' }}>
                <Button
                    onClick={e => { this.props.actions.logout() }} >
                    Log out
                </Button>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        data: state.data,
        user: state.user
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ getAllData, initUIVars, getUserInfo, logout }, dispatch)
    }
}

App.propTypes = {
    children: PropTypes.object
}

export default connect(mapStateToProps, mapDispatchToProps)(App)