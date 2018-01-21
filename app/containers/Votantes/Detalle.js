import React, { Component } from 'react'
import { Link } from 'react-router'
/* Components */
import {
    Input,
    Row,
    Col,
    Button
} from 'antd'
/* Actions */
/*Services */
import services from '../../services/votantes'
/*Helpers */
import { pushPath } from 'helpers/helpers'
import config from './config'
import { error } from 'util';
/*Constants*/
const dateFormat = 'YYYY/MM/DD'

class BookingsManagement extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { data } = this.props

        if (!data)
            return <Row>No data</Row>

        return (
            <Row>
                <h1>{data.nombre} {data.apellido}</h1>
                <h3>{data.cedula}</h3>
                <h4>{data.direccion}</h4>
                <h4>{data.telefono}</h4>
                <h4>{data.celular}</h4>
                <h4>{data.correo}</h4>
                <Row gutter={12} type="flex" justify="center">
                    <Col
                        span={12} >
                        <Button className='width-parent' type="primary" htmlType="submit">Guardar</Button>
                    </Col>
                </Row>
            </Row >
        )
    }
}

export default (BookingsManagement)