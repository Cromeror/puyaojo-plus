import React, { Component } from 'react'
import { connect } from 'react-redux'

class Dashboard extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="contentWrapper">
                {this.props.children}
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

export default connect(mapStateToProps)(Dashboard)