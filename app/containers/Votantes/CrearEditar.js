import React, { Component } from 'react'
import { Link } from 'react-router'
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
/*Services */
import servicioPuesto from '../../services/puestos'
import servicioVotantes from '../../services/votantes'
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
    puestosEncontrados = []//almacena los puestos encontrados cuando ingresamos informacion en el campo de puesto.

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

    componentDidMount() {
        const { userToken, votanteId, form } = this.props
        if (votanteId)
            servicioVotantes.get(votanteId, userToken)
                .then(votante => {
                    votante = votante.data
                    form.setFieldsValue({
                        cedula: votante.cedula,
                        nombre: votante.nombre,
                        apellido: votante.apellido,
                        telefono: votante.telefono,
                        direccion: votante.direccion,
                        correo: votante.correo,
                        mesa: votante.zonificacion.mesa,
                        departamento: votante.zonificacion.puesto.departamento,
                        municipio: votante.zonificacion.puesto.municipio,
                        puesto: votante.zonificacion.puesto.puesto
                    })
                })
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
        const { userToken, form } = this.props
        let dataForm = form.getFieldsValue()

        if (userToken && dataForm.puesto) {
            //Peticion a la base de datos
            servicioPuesto.find(userToken, { puesto: dataForm.puesto })
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

    handleSave = (e) => {
        e.preventDefault();
        const { userToken, votanteId, form } = this.props
        let data = form.getFieldsValue()
        data.zonificacion = {
            puestoId: data.puesto,
            mesa: data.mesa
        }

        if (votanteId && votanteId > 0)
            servicioVotantes.update(data, votanteId, userToken)
                .then(r => {
                    console.log('UPDATE')
                    console.log(r.data)
                })
        else
            servicioVotantes.add(data, userToken)
                .then(r => {
                    console.log(r.data)
                })
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

export default (Form.create()(Agregar))