import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
/**Configurations */
import { serverConfig } from '../../config/localConfig'
/** Actions */
import { confirm } from '../actions/user'

class Dashboard extends React.Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        const { location, params, actions } = this.props
        /* console.log(params)
        console.log(location) */
        if (!params && !params.id)
            console.log('Error no tengo el ID')

        if (!location.query && !location.query.key)
            console.log('Error no tengo la KEY')

        actions.confirm(params.id, { key: location.query.key })
    }

    render() {
        return (
            <div>
                <div className="row">
                    <div className="col s12">
                        <h1>Confirmed registration</h1>
                    </div>
                </div>
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
        actions: bindActionCreators({ confirm }, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)