import React, { Component } from 'react'
import { connect } from 'react-redux'

class People extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="contentWrapper">
                Hola People
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

export default connect(mapStateToProps)(People)