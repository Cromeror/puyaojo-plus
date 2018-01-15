import React, { PropTypes } from 'react'
import initInput from './initInput'

class InputPhone extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            valueChanged: false,
            value: ''
        }
    }

    componentWillMount() {
        const { defaultValue } = this.props
        if (defaultValue) {
            this.setState({ value: defaultValue })
        }
    }

    render() {
        const { valueChanged, value } = this.state
        const {
            id,
            translations,
            language,
            remaining,
            maxLength,
            name,
            required,
            label,
            placeholder,
            className,
            defaultValue
        } = this.props

        return (
            <div className={className ? className : ''}>
                {label &&
                    <label style={{ marginBottom: 5, display: 'block' }}>
                        {label}
                    </label>
                }
                <input
                    className="ant-input"
                    id={id}
                    type='text'
                    name={name ? name : null}
                    required={required}
                    placeholder={placeholder ? placeholder : null}
                    value={value}
                    onChange={this.changeHandler.bind(this)}
                />
            </div>
        )
    }

    changeHandler = e => {
        const str = e.target.value.toString()
        const { valueChanged } = this.state
        let patt = /^([0-9]|-)*$/g

        if (patt.test(str)) {
            if (!valueChanged) {
                this.setState({ valueChanged: true, value: str })
            } else {
                this.setState({ value: str })
            }
        }
    }
}

export default initInput(InputPhone)