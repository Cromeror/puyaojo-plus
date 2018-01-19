import React, { Component } from 'react'
/* Components */
import {
    Row,
    Col,
    Input
} from 'antd'
import ResultadoConsulta from 'containers/commons/ResultadoConsulta'
/* Actions */
/*Services */
/*Helpers */
import { pushPath } from 'helpers/helpers'

/*Globals*/
const Search = Input.Search

class PuestoVotacion extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            showResult: false
        }
    }

    render() {
        return (
            <Row type="flex" justify="center">
                <Col md={6}>
                    <Search
                        id="input-search"
                        placeholder="Digite número de cédula"
                        onSearch={value => this.onSearch(value)}
                        enterButton />
                </Col>
                <ResultadoConsulta
                    visible={this.state.showResult} />
            </Row >
        )
    }

    onSearch = (text) => {
        this.setState({ showResult: true })
    }
}

export default (PuestoVotacion)