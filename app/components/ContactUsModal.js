import React, { Component } from 'react'
import { connect } from 'react-redux'
import Recaptcha from 'react-recaptcha'
import serialize from 'form-serialize'

import { changeModalVisibility } from 'actions/ui'

import { getACFObject } from 'helpers/helpers'
import getTemplate from 'helpers/templates'

import landingService from 'services/landings'
import mailService from 'services/mail'
import SelectCountry from './SelectCountry'
import InputText from './InputText'
import Modal from './Modal'
import { emails } from '../../config/localConfig'
import { ENV } from '../../config/env'

/* Styles */
import classNames from 'classnames/bind'
import styles from 'css/components/ContactUsModal'
const cx = classNames.bind(styles)

/* traductions */
import traductions from 'helpers/traductions.json'
const strings = traductions.components['ContactUsModal']
const forms = traductions.forms

class ContactUsModal extends Component {
    constructor(props) {
        super(props)

        this.state = {
            validEmail: true,
            error: false,
            robot: true,
            message: false
        }
    }

    render() {
        const { validEmail, error, message } = this.state
        const { language } = this.props.landing

        return (
            <Modal>
                <div className={cx("contactus-form")}>
                    <h1 className="centerAlign">{strings.contactUs[language]}</h1>

                    <form id="contactus-form" onSubmit={this.sendContactUs}>
                        <div className="row">
                            <InputText
                                label={forms.name[language]}
                                type="text"
                                name="first_name"
                                className="col s12 m6"
                                required
                            />

                            <InputText
                                label={forms.lastname[language]}
                                type="text"
                                name="last_name"
                                className="col s12 m6"
                                required
                            />

                            <div className="col s12 m6">
                                <label htmlFor="name">{forms.email[language]}</label>
                                <input name="email" type="email" required pattern="[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$" />
                            </div>

                            <div className="col s12 m6">
                                <label htmlFor="name">{forms.confirmEmail[language]} <br />{!validEmail && <span className="red">{forms.matchEmails[language]}</span>}</label>
                                <input name="email_confirm" type="email" required pattern="[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$" autoComplete="off" onBlur={this.validateEmail.bind(this)} />
                            </div>

                            <div className="col s12 m6">
                                <label htmlFor="name">{forms.phone[language]}</label>
                                <input name="phone" type="number" />
                            </div>

                            <SelectCountry
                                class={"col s12 m6"}
                                label={forms.country[language]}
                                name={"country"}
                                required={true}
                                defaultValue={'US'}
                                defaultText={forms.selectCountry[language]}
                            />

                            <InputText
                                label={forms.observation[language]}
                                type="textarea"
                                name="message"
                                className="col s12"
                                rows={4}
                                required
                                style={{ marginBottom: 10 }}
                            />

                            <div className="col s3" />
                            <div className="col s12 m6 noMagin noPadding">
                                <Recaptcha theme="dark" sitekey="6LcO-TMUAAAAAAniTjUVQ6ISEbqUhJS4NE4BaUab" verifyCallback={this.verifyCallback.bind(this)} />
                            </div>
                            <div className="col s3" />

                            <div className="col s12 centerAlign noPadding">
                                {error && <p className="red">{error}</p>}
                                {message && <p style={{ color: 'green' }}>{message}</p>}
                                <button>{forms.submit[language]}</button>
                            </div>
                        </div>
                    </form>
                </div>
            </Modal>
        )
    }

    verifyCallback(response) {
        if (response) {
            this.setState({ robot: false })
        }
    }

    sendContactUs = e => {
        e.preventDefault()
        const { validEmail, robot } = this.state
        const { data, landing } = this.props
        const { language, landingId } = landing
        var form = document.getElementById('contactus-form')
        form = serialize(form, { hash: true })

        if (validEmail && !robot) {
            if (data && data.meta) {
                var meta = getACFObject(
                    data.meta,
                    'navbar',
                    ['logo']
                )
                meta = meta[0]

                /* Email User */
                var UserTemplate = getTemplate('contact', 'client', language, { logo: meta.logo, ...form })
                var dataEmailUser = {
                    to: ENV !== 'development' ? { [form.email]: "Jetsemani" } : { [emails.qa]: "Q&A Jetsemani" },
                    from: [emails.sender, "Donde.co"],
                    subject: strings.thankYou[language],
                    html: UserTemplate
                }

                mailService.sendMail(dataEmailUser, this.requestSent.bind(this))

                /* Email provider */
                var providerTemplate = getTemplate('contact', 'provider', language, { logo: meta.logo, ...form })
                var dataEmailProvider = {
                    to: ENV !== 'development' ? { [emails.contact]: "Jetsemani" } : { [emails.qa]: "Q&A Jetsemani" },
                    from: [emails.sender, "Donde.co"],
                    subject: strings.contactRequest[language],
                    html: providerTemplate
                }

                mailService.sendMail(dataEmailProvider, this.requestSent.bind(this))

                /* Se hace la insercion de los datos */
                delete form['email_confirm']
                delete form['g-recaptcha-response']
                form['landing_id'] = landingId

                landingService.createContactRequest(form).then(response => {
                    //console.log(response.data)
                }).catch(error => {
                    console.log(error)
                })
            }
        } else {
            var error = forms.matchEmails[language]

            if (robot) {
                error = forms.robotConfirm[language]
            }

            this.setState({ error: error })
        }
    }

    requestSent() {
        const { language } = this.props.landing
        this.setState({ message: forms.requestSend[language] })
        setTimeout(() => {
            this.props.changeModalVisibility(false)
        }, 2000);
    }

    validateEmail() {
        var form = document.getElementById('contactus-form')
        form = serialize(form, { hash: true })

        if (form.email != form['email_confirm']) {
            this.setState({ validEmail: false })
        } else {
            this.setState({ validEmail: true })
        }
    }
}

function mapStateToProps(state) {
    return {
        landing: state.landing,
        data: state.data
    }
}

export default connect(mapStateToProps, { changeModalVisibility })(ContactUsModal)