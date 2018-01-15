import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import serialize from 'form-serialize'
/* Actions */
import { signup } from '../actions/user'

class Signup extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div >
                <div className="row">
                    <div className="col s12">
                        <div>
                            <h1 className="centerAlign">Signup</h1>

                            <div className="row">
                                <form id="signup-form" onSubmit={this.handleOnSubmit}>
                                    <div className="col s12 marginBottom">
                                        <label>Email:</label>
                                        <input
                                            name="email"
                                            type="email"
                                            pattern="[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$"
                                            required />
                                    </div>

                                    <div className="col s12 marginBottom">
                                        <label>Password:</label>
                                        <input name="password" type="password" required />
                                    </div>

                                    <div className="col s12 centerAlign">
                                        <button type="submit" className="btn-primary marginBottom">Signup</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    /**
     * Manejador para el boton de inicio de sesión
     */
    handleOnSubmit = e => {
        e.preventDefault()
        const { actions } = this.props
        let form = document.getElementById("signup-form")
        form = serialize(form, { hash: true })

        actions.signup(
            {
                email: form.email,
                password: form.password
            },
            {
                redirection: `${serverConfig.site}/signup/confirmation`
            })
    }
}

function mapStateToProps(state) {
    return {
        data: state.data,
        user: state.user
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ signup }, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Signup)