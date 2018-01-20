import React, { Component } from 'react'
import { connect } from 'react-redux'
/**Components */
import Votantes from './Votantes'
import Detalle from './Detalle'
/* Helpers */
import { pushPath } from 'helpers/helpers'
import { Col, Row } from 'antd/lib/grid';
import { Button } from 'antd';
/* Styles */
if (__DEVCLIENT__) {
    require('./style.scss')
}
const
    ADD = '/dashboard/votantes/agregar',
    UPDATE = '/dashboard/votantes/actualizar'

class Dashboard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            rowSelected: null,
            widthMaster: 24,
            widthDetail: 0
        }
    }

    componentWillMount() {
        if (this.props) {
            if (this.props.location) {
                const pathname = this.props.location.pathname
                switch (pathname) {
                    case ADD:
                        break;
                    case UPDATE:
                        break;
                    default:
                        break;
                }
            }
        }
    }

    render() {
        const { widthDetail, widthMaster } = this.state
        return (
            <Row>
                Votantes
                <Votantes
                    onRowClick={this.onRowClick} />
            </Row>)
    }
}

export default (Dashboard)