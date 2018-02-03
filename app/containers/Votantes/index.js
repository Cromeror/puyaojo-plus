import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
    Button,
    Col,
    Row
} from 'antd';
/**Components */
import Votantes from './Votantes'
import Agregar from './Agregar'
/* Helpers */
import { pushPath } from 'helpers/helpers'
import { pathnames as utilPathnames } from '../../utils/keys'
/* Styles */
if (__DEVCLIENT__) {
    require('./style.scss')
}

class Index extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            child: null
        }
    }

    componentWillMount() {
        if (this.props) {
            if (this.props.location) {
                this.renderChild(this.props.location.pathname)
            }
        }
    }

    componentWillReceiveProps(nextProps, nextState) {
        if (this.props.location != nextProps.location) {
            this.renderChild(nextProps.location.pathname)
        }
    }

    render() {
        return (
            <Row>
                {this.state.child}
            </Row>)
    }

    renderChild = (pathname) => {
        switch (pathname) {
            case utilPathnames.PATH_VOTANTES_AGREGAR:
                this.setState({ child: <Agregar /> })
                break;
            case utilPathnames.PATH_VOTANTES_ACTUALIZAR:
                this.setState({ child: <Agregar /> })
                break
            default:
                this.setState({ child: <Votantes /> })
                break
        }
    }
}

export default (Index)