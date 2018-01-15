import React, { Component } from 'react'
import { connect } from 'react-redux'
/* Component */
import { Layout } from 'antd';
const { Content, Sider } = Layout;
import LeftMenu from '../components/LeftMenu'
/* Helpers */
import { pushPath } from 'helpers/helpers'
/* Styles */
if (__DEVCLIENT__) {
    require('css/dashboard.scss')
}

class Dashboard extends React.Component {
    constructor(props) {
        super(props)
    }

    componentWillUpdate(nextProps) {
        if (this.props.user != nextProps.user) {
            if (!nextProps.user.authenticated) {
                pushPath('/')
            }
        }
    }

    render() {
        return (
            <Layout>
                <Sider width={200} style={{ background: '#fff' }}>
                    <LeftMenu />
                </Sider>
                <Layout>
                    <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
                        {this.props.children}
                    </Content>
                </Layout>
            </Layout>
        )
    }
}

function mapStateToProps(state) {
    return {
        data: state.data,
        user: state.user
    }
}

export default connect(mapStateToProps)(Dashboard)