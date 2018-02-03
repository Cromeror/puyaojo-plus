import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router'
import serialize from 'form-serialize'
var xpath = require('xpath')
    , dom = require('xmldom').DOMParser
import moment, { lang } from 'moment'
import {
    Input,
    InputNumber,
    Select,
    Row,
    Icon,
    DatePicker,
    Col,
    Button,
    Card,
    Radio,
    Form,
    Modal
} from 'antd'
/* Components */
import AutoComplete from '../../components/AutoComplete'
/* Actions */
/*Services */
import servicioPuesto from '../../services/puestos'
/*Helpers */
import { pushPath } from 'helpers/helpers'
import config from './config'
import { error } from 'util'
import { pathnames } from '../../utils/keys'
/*Globals*/
const { TextArea } = Input
const InputGroup = Input.Group
const Search = Input.Search
const Option = Select.Option
const FormItem = Form.Item
const dateFormat = 'YYYY/MM/DD'
const RangePicker = DatePicker.RangePicker
const RadioGroup = Radio.Group

const updatePath = 'update/:id'
let sending = false,
    puestosEncontrados = []

/**
 * Importan en lo posible no usar componentWillReceiveProps genera un 
 * bucle infinito cuando se usa setFieldsValue de Ant-D
 */
class Agregar extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            phone: {
                value: 0,
            },
            dataSourcePuesto: [],
            puesto: null
        }
    }

    render() {
        const { getFieldDecorator } = this.props.form
        const { phone } = this.state

        return (
            <Row >
                <Form onSubmit={this.handleSave}>
                    <Row gutter={24} type="flex" justify="center">
                        <Col span={14}>
                            <Row gutter={12}>
                                <Col span={24}>
                                    <FormItem label="Cédula">
                                        {getFieldDecorator('cedula', config.cedula)
                                            (<InputNumber className='inputnumber-full-width' />)}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem label="Nombre">
                                        {getFieldDecorator('nombre', config.nombre)
                                            (<Input />)}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem label="Apellido">
                                        {getFieldDecorator('apellido')
                                            (<Input />)}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem label="Teléfono">
                                        {getFieldDecorator('telefono')
                                            (<InputNumber className='inputnumber-full-width' />)}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem label="Correo Electrónico">
                                        {getFieldDecorator('correo')
                                            (<Input placeholder="john@mail.com" />)}
                                    </FormItem>
                                </Col>
                                <Col span={24}>
                                    <FormItem label="Dirección">
                                        {getFieldDecorator('direccion')
                                            (<Input />)}
                                    </FormItem>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={8}>
                            <Row gutter={12}>
                                <Col span={20}>
                                    <FormItem label="Puesto de votación">
                                        {getFieldDecorator('puesto', config.puesto)
                                            (<AutoComplete
                                                dataSource={this.state.dataSourcePuesto}
                                                onChange={this.handleChangePuesto}
                                                onSelect={this.selectPuesto}
                                                placeholder="Ingrese"
                                            />)}
                                    </FormItem>
                                </Col>
                                <Col span={4}>
                                    <FormItem label="Mesa">
                                        {getFieldDecorator('mesa')
                                            (<InputNumber className='inputnumber-full-width' />)}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem label="Departamento">
                                        {getFieldDecorator('departamento', config.departamento)
                                            (<Input />)}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem label="Municipio">
                                        {getFieldDecorator('municipio', config.municipio)
                                            (<Input />)}
                                    </FormItem>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row gutter={12} type="flex" justify="center">
                        <Col
                            span={3}>
                            <Link to={pathnames.PATH_DASHBOARD} className="ant-btn ant-btn-primary width-parent">Cancel</Link>
                        </Col>
                        <Col
                            span={3} >
                            <Button className='width-parent' type="primary" htmlType="submit">Save</Button>
                        </Col>
                    </Row>
                </Form>
            </Row >
        )
    }

    /**
     * Maneja los cambios en cualquier campo que tenga que ver con el puesto de votacion
     */
    handleChangePuesto = (value) => {
        const { user, form } = this.props
        let dataForm = form.getFieldsValue()

        if (user && user.token && dataForm.puesto) {
            //Peticion a la base de datos
            servicioPuesto.find(user.token, { puesto: dataForm.puesto })
                .then(puestos => {
                    puestosEncontrados = puestos.data
                    let dataSourcePuesto = new Array()
                    for (const elemento of puestosEncontrados) {
                        dataSourcePuesto.push({ value: parseInt(elemento.id), text: elemento.puesto })
                    }
                    this.setState({ dataSourcePuesto })
                })
        }
    }

    selectPuesto = (value) => {
        const { form } = this.props
        for (const iterator of puestosEncontrados) {
            if (value == iterator.id)
                form.setFieldsValue({
                    municipio: iterator.municipio,
                    departamento: iterator.departamento
                })
        }
    }

    //ADD BOOKING
    handleSave = (e) => {
        e.preventDefault();
        const { form, params } = this.props
        /**Validacion de campos */
        /**
         * Validacion de campos del formulario, el callback recibe un ok
         * que indica true si pasa la validacion o false si a sucedido un error.
         */
        this.validationForm(ok => {
            const id = (params && params.id) ? params.id : null
            if (ok) {
                const votante = form.getFieldsValue()
                console.log(votante)
            }
            //this.saveBooking(form, id)
        })
    }

    /**
     * Permite guardar el booking que se esta diligenciando
     */
    saveBooking = (form, id, status) => {
        let data = form.getFieldsValue()
        console.log(data)
    }

    validationForm = (callback) => {
        let form = this.props.form
        form.validateFields((err, fieldsValue) => {
            let
                validateStatus = 'success',
                errorMsg = null,
                patt = /^([0-9]|-)*$/g,
                ok = true

            if (fieldsValue.user_phone && !patt.test(fieldsValue.user_phone)) {
                validateStatus = 'error'
                errorMsg = 'Use number and (-)'
                ok = false
            }

            this.setState({
                phone: {
                    validateStatus,
                    errorMsg,
                    value: fieldsValue.user_phone
                },
            })

            if (err || !ok) {
                return;
            }

            callback(true)
        })
    }
}

function mapStateToProps(state) {
    return {
        user: state.user.data
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({}, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Agregar))