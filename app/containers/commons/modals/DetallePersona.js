import React, { Component } from 'react'
/* Components */
import {
    Row,
    Col,
    Input,
    Modal
} from 'antd'
/* Actions */
/*Services */
/*Helpers */
import { pushPath } from 'helpers/helpers'
/*Globals*/

if (__DEVCLIENT__) {
    require('./style.scss')
}

class DetallePersona extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            confirmLoading: false,
            visible: false
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.visible)
            this.setState({ visible: nextProps.visible })
    }

    render() {
        const { detail } = this.props,
            { confirmLoading, visible } = this.state
        //console.log(visible)
        return (
            <Modal title="Cédula encontrada"
                visible={visible}
                okText='Guardar'
                onOk={this.handleOk}
                confirmLoading={confirmLoading}
                cancelText='Cancelar'
                onCancel={this.handleCancel}>
                <Row type="flex" justify="center">
                    <Col md={24}>
                        <h1>Cédula</h1>
                        <h2>1047445488</h2>
                        <h3>Departamento:</h3>
                        <h3>Municipio:</h3>
                        <h3>Puesto:</h3>
                        <h3>Dirección Puesto:</h3>
                        <h3>Fecha de inscripción:</h3>
                        <h3>Mesa:</h3>
                        {detail}
                    </Col>
                </Row >
            </Modal>

        )
    }

    handleOk = () => {
        /*  setTimeout(() => {
             this.setState({
                 visible: false,
                 confirmLoading: false,
             });
         }, 2000); */
        this.setState({
            visible: false
        });
    }

    handleCancel = () => {
        this.setState({
            visible: false,
        });
    }
}

export default (DetallePersona)