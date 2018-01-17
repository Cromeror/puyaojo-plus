import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

/**Components */
import {
    Form,
    Alert,
    Icon,
    Input,
    Button,
    Row
} from 'antd'
/* Actions */
import { login, signup } from 'actions/user'
/* Helpers */
import { pushPath } from 'helpers/helpers'
/**Constants */
const FormItem = Form.Item;

class Login extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            isLogin: true,
            error: false
        }
    }
    componentWillMount() {
        if (this.props.user.authenticated)
            pushPath('/dashboard')
    }

    componentWillUpdate(nextProps) {
        if (this.props.user != nextProps.user) {
            if (nextProps.user.authenticated) {
                pushPath('/dashboard')
            }
        }
    }

    render() {
        const { isLogin, error } = this.state
        const { getFieldDecorator } = this.props.form

        return (
            <div className="col-12 col-offset-6" id="login-box">
                <Form
                    className="login-form"
                    id="login-form"
                    onSubmit={this.handleOnSubmit}>
                    <FormItem>
                        {getFieldDecorator('email', {
                            rules: [{ required: true, message: 'Please input your username!' }],
                        })(<Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />)}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('password', {
                            rules: [{ required: true, message: 'Please input your Password!' }],
                        })(<Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />)}
                    </FormItem>
                    <FormItem>
                        <Button
                            type="primary"
                            htmlType="submit">Log in</Button>
                    </FormItem>
                    {(this.props.errors && this.props.errors.loginError)
                        && <Row>
                            <Alert
                                type="error"
                                message="Access Denied"
                                description={this.props.errors.loginError.message}
                            />
                        </Row>}
                </Form>
            </div>
        )
    }

    switchLogin2signUp = e => {
        e.preventDefault()
        this.setState(prevState => {
            return { isLogin: !prevState.isLogin }
        })
    }

    /**
     * Manejador para el boton de inicio de sesión
     */
    handleOnSubmit = e => {
        e.preventDefault()
        const
            { isLogin } = this.state,
            { actions, form } = this.props,
            formFields = form.getFieldsValue()
        //Importante definir la strategia
        formFields.strategy = "local"
        if (isLogin) {
            actions.login(formFields)
        } else {
            actions.signup(formFields)
        }
    }
}

function mapStateToProps(state) {
    return {
        data: state.data,
        user: state.user,
        errors: state.user.error
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ login, signup }, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Login))