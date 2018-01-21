import React, { Component } from 'react'
import { Link } from 'react-router'
/* Components */
import {
    Input,
    Row,
    Col,
    Button,
    Card,
    Icon
} from 'antd'
/* Actions */
/*Services */
import services from '../../services/votantes'
/*Helpers */
import { pushPath } from 'helpers/helpers'
import config from './config'
import { error } from 'util';
/*Constants*/
const
    Meta = Card.Meta,
    dateFormat = 'YYYY/MM/DD'

class BookingsManagement extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { data } = this.props

        return (
            <Card
                actions={
                    [<Icon type='edit' />,
                    <Icon type='delete' />]}>
                <Row type="flex" justify="end">
                    <Icon type='close' onClick={this.onClose} />
                </Row>
                {data
                    ? <Row gutter={12} type="flex" justify="center">
                        <Col span={24}>
                            <h1 className='card-title'>{data.nombre} {data.apellido}</h1>
                        </Col>
                        <Col span={24}>
                            <h3 className='card-subtitle'>{data.cedula}</h3>
                        </Col>
                        <Col span={22}>
                            <h4>Dirección: {data.direccion}</h4>
                            <h4>Teléfono: {data.telefono}</h4>
                            <h4>Celular: {data.celular}</h4>
                            <h4>Correo electrónico: {data.correo}</h4>
                        </Col>
                    </Row>
                    : <Row>No data</Row>}
            </Card >
        )
    }
    onClose = () => {
        console.log('Cerrar')
    }
}

export default (BookingsManagement)