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
const Search = Input.Search

class ResultadoConsulta extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            confirmLoading: false,
            visible: true
        }
    }

    componentWillReceiveProps(nextProps) {
        //
    }

    render() {
        const { detalle, visible } = this.props,
            { confirmLoading } = this.state
        return (
            <Modal title="Title"
                visible={visible}
                onOk={this.handleOk}
                confirmLoading={confirmLoading}
                onCancel={this.handleCancel}>
                <Row type="flex" justify="center">
                    <Col md={6}>
                        {detalle}
                    </Col>
                </Row >
            </Modal>

        )
    }

    handleOk = () => {
        this.setState({
            ModalText: 'The modal will be closed after two seconds',
            confirmLoading: true,
        });
        setTimeout(() => {
            this.setState({
                visible: false,
                confirmLoading: false,
            });
        }, 2000);
    }

    handleCancel = () => {
        console.log('Clicked cancel button');
        this.setState({
            visible: false,
        });
    }
}

export default (ResultadoConsulta)