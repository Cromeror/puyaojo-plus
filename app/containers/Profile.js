import React, { Component } from 'react'
import { connect } from 'react-redux'

class Profile extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="contentWrapper">
                Hola profile
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

export default connect(mapStateToProps)(Profile)