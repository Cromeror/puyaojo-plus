import React, { Component } from 'react'
import { connect } from 'react-redux'
/* import { bindActionCreators } from 'redux' */
import { Link } from 'react-router'
/* Components */
import JtsTableAntD from 'components/JtsTableAntD'
import { Table, Icon, Divider } from 'antd'
/* Actions */
/*Services */
import services from 'services/votantes'
/*Helpers */
import { objectSorter } from 'helpers/helpers'

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
            headers: []
        }
    }

    componentWillReceiveProps(nextProps, nextState) {
        if (this.props) {
            if (this.props.user != nextProps.user)
                services.find(nextProps.user.token)
                    .then(bookings => {
                        this.setState({ datos: bookings.data })
                    })
        }
    }

    render() {
        const { datos, headers } = this.state
        return (
            <div >
                <div className="row">
                    <div className="col s12">
                        <JtsTableAntD
                            searchVisible
                            columns={columns}
                            dataSource={datos}
                            id='votantes' />
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        user: state.user.data
    }
}

export default connect(mapStateToProps)(VerVotantes)