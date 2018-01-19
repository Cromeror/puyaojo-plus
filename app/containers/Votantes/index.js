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

class Dashboard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            rowSelected: null,
            widthMaster: 24,
            widthDetail: 0
        }
    }

    render() {
        const { widthDetail, widthMaster } = this.state
        return (
            <Row>
                Votantes
                <Button type="primary">Agregar</Button>
                <Col span={widthMaster}>
                    <Votantes
                        onRowClick={this.onRowClick} />
                </Col>
                <Col span={widthDetail}>
                    <Detalle data={this.state.rowSelected} />
                </Col>
            </Row>)
    }

    onRowClick = (row) => {
        this.setState({
            widthMaster: 18,
            widthDetail: 6,
            rowSelected: row
        })
    }
}

export default (Dashboard)