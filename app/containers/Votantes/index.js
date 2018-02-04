import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
    Button,
    Col,
    Row
} from 'antd';
/**Components */
import All from './All'
import Agregar from './Agregar'
/* Helpers */
import { pushPath } from 'helpers/helpers'
import { pathnames as utilPathnames } from '../../utils/keys'
/* Styles */
if (__DEVCLIENT__) {
    require('./style.scss')
}
/*Contantes */
let paramsId = ''
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
            paramsId = nextProps.params.id
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
        //Verificamos la ecistencia del Token para realizar peticiones desde los subComponentes
        const token = this.props.user && this.props.user.token ? this.props.user.token : null
        switch (pathname) {
            case utilPathnames.PATH_VOTANTES_AGREGAR:
                this.setState({ child: <Agregar userToken={token} /> })
                break;
            case utilPathnames.PATH_VOTANTES_ACTUALIZAR + '/' + paramsId:
                this.setState({ child: <Agregar votanteId={paramsId} userToken={token} /> })
                break
            default:
                this.setState({ child: <All /> })
                break
        }
    }
}

function mapStateToProps(state) {
    return {
        user: state.user.data
    }
}

export default connect(mapStateToProps)(Index)