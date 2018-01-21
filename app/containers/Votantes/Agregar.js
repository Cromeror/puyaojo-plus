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
    AutoComplete,
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
/* Actions */
/*Services */
import consulta from '../../services/consulta'
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
let sending = false

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
            productMatch: [],
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
                                {/* <Search
                                id="input-search"
                                placeholder="Digite número de cédula"
                                onSearch={value => this.onSearch(value)}
                                enterButton /> */}
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
                                            (<Input />)}
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

    onSearch = (value) => {
        console.log(value)
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
            /**
             * Importante siempre verificar si recibimos el ID y obtenerlo
             * para que saveBooking() pueda guardar o actualizar.
             */
            const id = (params && params.id) ? params.id : null
            if (ok)
                this.saveBooking(form, id)
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

    /**
     * Manejador de autocompletado, es usado en Input de producto.
     */
    autocompleteProduct = (value) => {
        const { form } = this.props
        if (value) {
            let data = form.getFieldsValue()
            listingServices.find({ s: value, lang: data.language ? data.language : 'en' })
                .then(res => {
                    let results = new Array()
                    for (const element of res.data.listings.concat(res.data.events)) {
                        results.push(`${element.wp_id} - ${element.title}`)
                    }
                    this.setState({
                        productMatch: results
                    });
                })
        }
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