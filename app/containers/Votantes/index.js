import React, { Component } from 'react'
import { connect } from 'react-redux'
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

    render() {
        return (this.props.children)
    }
}

export default (Dashboard)