import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router'
import serialize from 'form-serialize'
/* Components */
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
/* Actions */
/*Services */
import services from '../../services/bookings'
import listingServices from '../../services/listings'
/*Helpers */
import { pushPath } from 'helpers/helpers'

/*Globals*/
const { TextArea } = Input
const InputGroup = Input.Group
const Option = Select.Option
const FormItem = Form.Item
const dateFormat = 'YYYY/MM/DD'
const RangePicker = DatePicker.RangePicker
const RadioGroup = Radio.Group;
/**Constants */
import config from './config'
import { error } from 'util';

const fields = [
    { label: 'Language', key: 'language' },
    { label: 'Currency', key: 'currency' },
    { label: 'Product', key: 'product' },
    { label: 'Start Date', key: 'start_date' },
    { label: '# People', key: 'people' },
    { label: 'Discount %', key: 'discount' },
    { label: 'Cliente Name', key: 'client_name' },
    { label: 'Email', key: 'email' },
    { label: 'Phone', key: 'phone' }],
    updatePath = 'update/:id'
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
            summary: null,//Es el resumen de la venta, en estos momentos es igual a lo devuelto por /price
            isReset: false,
            method: 'add'//Metodo usado para realizar la peticion a la API
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.form != nextProps.form)
            this.updateSummary()
    }

    componentWillMount() {
        const { params, form, route } = this.props
        /**
         * Verificamos la ruta para saber si cargar o no la informacion del usuario
         */
        if (route.path === updatePath) {
            services.get(params.id)
                .then(response => {
                    this.loadBookingInformation(response.data)
                    this.setState({ method: 'update' })
                })
                .catch(error => {
                    Modal.error({
                        title: 'Contact the guys, an error has occurred.',
                        content: `Code error ${error.response.data.code}: ${error.response.data.message}`,
                    })
                    pushPath('/dashboard/bookings')
                })
        }
    }

    componentWillUpdate(nextProps, nextState) {
        const { form, route } = nextProps
        /**
         * Validamos si la ruta cambio, de esta manera sabemos si paso de /update:id a /add
         *
         * Importante verificar la variable *isReset* con esta variable garantizamos que no se
         * borre la informacion cada vez que se actualice el componente
         */
        if (route.path != updatePath && !this.state.isReset) {
            this.props.form.resetFields()
            this.setState({ isReset: true })
        }
    }

    render() {
        const { getFieldDecorator } = this.props.form
        const { phone } = this.state

        return (
            <Row>
                <Col span={18}>
                    <Form onSubmit={this.handleSaveBooking}>
                        <Row gutter={12}>{/* 
                            <Col span={24}>
                                <FormItem label="Product">
                                    {getFieldDecorator('item_id', config.product)(
                                        <AutoComplete
                                            name="item_id"
                                            dataSource={this.state.productMatch}
                                            onChange={this.autocompleteProduct}
                                            placeholder="Type the product to book" />)}
                                </FormItem>
                            </Col> */}
                            <Col span={8}>
                                <FormItem label="Cédula">
                                    {getFieldDecorator('cedula', config.cedula)
                                        (<InputNumber className='inputnumber-full-width' />)}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label="Nombre">
                                    {getFieldDecorator('nombre', config.nombre)
                                        (<Input />)}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label="Apellido">
                                    {getFieldDecorator('apellido')
                                        (<Input />)}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label="Dirección">
                                    {getFieldDecorator('direccion')
                                        (<InputNumber className='inputnumber-full-width' />)}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label="Teléfono">
                                    {getFieldDecorator('telefono')
                                        (<InputNumber className='inputnumber-full-width' />)}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label="Teléfono celular">
                                    {getFieldDecorator('celular')
                                        (<InputNumber className='inputnumber-full-width' />)}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label="Correo Electrónico">
                                    {getFieldDecorator('correo', config.correo)
                                        (<Input placeholder="john@mail.com" />)}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={12} type="flex" justify="center">
                            <Col
                                span={3}>
                                <Link to='/dashboard' className="ant-btn ant-btn-primary width-parent">Cancel</Link>
                            </Col>
                            <Col
                                span={3} >
                                <Button className='width-parent' type="primary" htmlType="submit">Save</Button>
                            </Col>
                        </Row>
                    </Form>
                </Col>
            </Row >
        )
    }

    getSummary = () => {
        const dataForm = this.props.form.getFieldsValue(),
            summary = this.state.summary
        let summaryJSX = <p>No data</p>

        if (summary)
            summaryJSX = [
                <p key='subtotal'>{(summary.currency).toUpperCase()} {summary.basePrice}X{summary.qty} = {summary.basePrice * summary.qty}</p>,
                <p key='fee'>Service fee 5% = {summary.fee}</p>,
                <p key='total'>Total = {summary.total}</p>]
        return (
            <Card bordered={false} style={{ width: 300, margin: 'auto' }}>
                {summaryJSX}
            </Card>)
    }

    updateSummary = () => {
        const
            { form } = this.props,
            { language, checkInOut, currency, item_id, qty_people } = form.getFieldsValue()

        if (qty_people && checkInOut && currency && language && item_id) {
            services.getPrice(
                (item_id.split(' - '))[0],
                qty_people,
                checkInOut[0].format('YYYY-MM-DD'),
                checkInOut[1].format('YYYY-MM-DD'),
                currency,
                language)
                .then(price => {
                    this.setState({ summary: price.data })
                })
        }
    }

    //UPDATE BOOKING
    /**
     * Carga la información del booking en el formulario para actualizar
     */
    loadBookingInformation = (booking) => {
        const { form } = this.props,
            product = booking && booking.product.info
                ? booking.product.info
                : null

        form.setFieldsValue({
            user_phone: booking.user_phone,
            discount: booking.discount ? booking.discount : 0,
            checkInOut: [
                moment(booking.start_date, dateFormat),
                moment(booking.end_date, dateFormat)
            ],
            qty_people: booking.qty_people,
            chat: booking.chat,
            user_email: booking.user_email,
            user_name: booking.user_name,
            user_phone: booking.user_phone ? booking.user_phone : '',
            language: booking.language,
            currency: booking.currency,
            item_id: (product && product.title) ? product.wp_id + ' - ' + product.title : ''
        })
    }

    //ADD BOOKING
    handleSaveBooking = (e) => {
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
     * Manejador de formulario envio de reserva.
     */
    sendBooking = (e) => {
        e.preventDefault()
        const { form, params } = this.props,
            id = (params && params.id) ? params.id : null
        sending = true
        /**Validacion de campos */
        form.validateFields((err, fieldsValue) => {
            this.validationForm(ok => {
                if (ok) {
                    this.saveBooking(form, id)
                        .then(resBook => {
                            let dataForm = form.getFieldsValue()
                            let params = {
                                less_payment: dataForm.min_payment ? dataForm.min_payment : 100
                            }
                            services.send(resBook.id, params)
                                .then(res => {
                                    console.log(res)
                                    Modal.info({
                                        title: 'Success!',
                                        content: (
                                            <div>
                                                <p>You payment request sended. less payment requiered: {params.less_payment}</p>
                                            </div>
                                        ),
                                        onOk() {
                                            pushPath('/dashboard')
                                        }
                                    })
                                })
                        })
                }
            })
        })

    }

    /**
     * Permite guardar el booking que se esta diligenciando
     */
    saveBooking = (form, id, status) => {
        const summary = this.state.summary
        let data = form.getFieldsValue()

        if (data.checkInOut) {
            data.start_date = data.checkInOut[0].format('YYYYMMDD')
            data.end_date = data.checkInOut[1].format('YYYYMMDD')
            delete data.checkInOut
        }
        if (data.item_id) {
            data.item_id = (data.item_id.split(' - '))[0]
        }
        /**Eliminando campos del formulario de enviar */
        if (data.min_payment) {
            delete data.min_payment
        }
        /**Serializamos los datos en detalle del precio */
        data.pricing = summary
        data.quantity = summary.qty
        data.status = status ? status : 'NEW'//Solo es NEW en caso de que sea una nueva reserva
        data.subtotal = summary.total
        data.price = summary.basePrice
        data.trm = summary.trm
        data.total = summary.total + summary.fee
        /**
         * Se usan dos tipos de metodos, [update] y [add], para el caso de
         * add, solo recibe (data) por lo tanto el segundo parametro es omitido.
         */
        return services[this.state.method](data, id)
            .then(res => {
                let message = 'You booking is save'
                /**
                 * Tratamiento despues de actualizar un booking.
                 * 
                 * Verificamos que el metodo usado sea "update" y que la respuesta del servidor
                 * sea OK "200"
                 */
                if (this.state.method === 'update' && res.status == 200) {
                    message = 'You booking is update'
                    data.id = id
                }
                //Tratamiento despues de guardar un booking
                if (res.data && res.data.success) {
                    data.id = res.data.response.newId
                }

                if (!sending)
                    Modal.info({
                        title: 'Success!',
                        content: (
                            <div>
                                <p>{message}</p>
                            </div>
                        ),
                        onOk() {
                            pushPath('/dashboard')
                        }
                    })
                else sending = false

                return data //Retornamos la data para manipularla en el formulario de envio de reserva
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

    disabledDate(current) {
        // Can not select days before today and today
        return current && current.valueOf() < Date.now();
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

/*
function mapStateToProps(state) {
    return {
                                    }
                                    } */

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({}, dispatch)
    }
}

export default connect(null, mapDispatchToProps)(Form.create()(Agregar))