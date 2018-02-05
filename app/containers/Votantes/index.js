import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
    Button,
    Col,
    Row
} from 'antd';
/**Components */
import Listar from './Listar'
import CrearEditar from './CrearEditar'
/* Helpers */
import { pushPath } from 'helpers/helpers'
import { pathnames as utilPathnames } from '../../utils/keys'
/* Styles */
if (__DEVCLIENT__) {
    require('./style.scss')
}


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
            if (this.props.params && this.props.params.id)
                paramsId = this.props.params.id
        }
    }

    componentWillReceiveProps(nextProps, nextState) {
        /**
         * Verificamos que haya un cambio de usuario, usualmente sucede cuando se ingresa a la 
         * pagina por primera vez.
         */
        if (this.props.user && this.props.user != nextProps.user) {
            this.renderChild(nextProps.location.pathname, nextProps.user.token)
        }
        /**
         * Verificamos que haya un cambio de ruta para renderizar el child
         */
        if (this.props.location != nextProps.location) {
            this.renderChild(nextProps.location.pathname)
        }
    }

    componentWillUpdate() {
        //Actualiza el parameto id, esto para saber que id se esta modificando
        paramsId = this.props.params.id
    }

    render() {
        return (
            <Row>
                {this.state.child}
            </Row>)
    }

    renderChild = (pathname, userToken) => {
        //Verificamos la ecistencia del Token para realizar peticiones desde los subComponentes
        const token = userToken || this.props.user && this.props.user.token ? this.props.user.token : null
        switch (pathname) {
            case utilPathnames.PATH_VOTANTES_AGREGAR:
                this.setState({ child: <CrearEditar userToken={token} /> })
                break;
            case utilPathnames.PATH_VOTANTES_ACTUALIZAR + '/' + paramsId:
                this.setState({ child: <CrearEditar votanteId={paramsId} userToken={token} /> })
                break
            default:
                this.setState({ child: <Listar /> })
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