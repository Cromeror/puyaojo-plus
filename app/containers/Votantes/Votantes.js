import React, { Component } from 'react'
import { connect } from 'react-redux'
/* import { bindActionCreators } from 'redux' */
import { Link } from 'react-router'
/* Components */
import JtsTableAntD from 'components/JtsTableAntD'
import {
    Table,
    Icon,
    Divider,
    Col,
    Row,
    Button
} from 'antd'
import Detalle from './Detalle'
/* Actions */
/*Services */
import services from 'services/votantes'
/*Helpers */
import { objectSorter } from 'helpers/helpers'
import { pathnames as utilPathnames } from '../../utils/keys'

const dateFormat = 'YYYY/MM/DD'
const columns = [
    {
        title: 'Cédula',
        dataIndex: 'cedula',
        key: 'cedula',
        width: 150,
        sorter: (a, b) => {
            return objectSorter(a, b, 'cedula')
        }
    },
    {
        title: 'Nombre',
        dataIndex: 'nombre',
        key: 'nombre',
        width: 300,
        sorter: (a, b) => {
            return objectSorter(a, b, 'nombre')
        }
    },
    {
        title: 'Apellido',
        dataIndex: 'apellido',
        key: 'apellido',
        width: 300,
        sorter: (a, b) => {
            return objectSorter(a, b, 'apellido')
        }
    },
    {
        title: 'Teléfono',
        dataIndex: 'telefono',
        key: 'telefono',
        width: 200,
        sorter: (a, b) => {
            return objectSorter(a, b, 'telefono')
        }
    },
    {
        title: 'Celular',
        dataIndex: 'celular',
        key: 'celular',
        width: 200
    },
    {
        title: 'Dirección',
        dataIndex: 'direccion',
        key: 'direccion',
        width: 200,
        sorter: (a, b) => {
            return objectSorter(a, b, 'direccion')
        }
    },
    {
        title: 'Correo electrónico',
        dataIndex: 'email',
        key: 'email',
        width: 200,
        sorter: (a, b) => {
            return objectSorter(a, b, 'email')
        }
    }]

class VerVotantes extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            datos: [],
            headers: [],
            scroll: { x: 1500, y: 500 },
            rowSelected: null,
            widthMaster: 24,
            widthDetail: 0
        }
    }

    componentWillReceiveProps(nextProps, nextState) {
        if (this.props.user != nextProps.user) {
            this.loadData(nextProps.user.token)
        }
    }

    componentWillMount() {
        const { user, onRowClick } = this.props
        if (user) {
            this.loadData(user.token)
        }
    }

    render() {
        const {
            datos,
            headers,
            scroll,
            widthDetail,
            widthMaster } = this.state

        return (
            <Row>
                <h1>Votantes</h1>
                <Link to={utilPathnames.PATH_VOTANTES_AGREGAR}>Agregar</Link>
                <Col span={widthMaster}>
                    <JtsTableAntD
                        searchVisible
                        columns={columns}
                        dataSource={datos}
                        onRowClick={this.onRowClick}
                        scroll={scroll}
                        id='votantes' />
                </Col>
                <Col span={widthDetail}>
                    <Detalle data={this.state.rowSelected} />
                </Col>
            </Row>
        )
    }

    onRowClick = (row) => {
        this.setState({
            widthMaster: 18,
            widthDetail: 6,
            rowSelected: row
        })
    }

    loadData = (token) => {
        if (token) {
            services.find(token)
                .then(bookings => {
                    this.setState({ datos: bookings.data })
                })
        }
    }
}

function mapStateToProps(state) {
    return {
        user: state.user.data
    }
}

export default connect(mapStateToProps)(VerVotantes)