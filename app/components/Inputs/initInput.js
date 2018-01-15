import React, { Component, PropTypes } from 'react'

const translations = {
    remaining: {
        "en": "Characters remaining",
        "es": "Caracteres restantes"
    }
}

export default function initInput(Input) {
    class MainInput extends Component {
        constructor(props) {
            super(props)

            this.maxLengthDef = 524288 //Maximo de caracteres permitidos para un input
            let maxLength = props.maxLength
            let remaining = (props && maxLength && maxLength <= this.maxLengthDef)
                ? maxLength
                : this.maxLengthDef

            this.state = {
                valueChanged: false,
                value: false,
                remaining
            }
        }

        render() {
            const { remaining, valueChanged, value } = this.state
            const { defaultValue } = this.props
            return (
                <Input
                    defaultValue={defaultValue ? defaultValue : null}
                    valueChanged={value ? value : (!valueChanged ? (defaultValue ? defaultValue : null) : null)}
                    translations={translations}
                    remaining={remaining}
                    changeHandler={this.changeHandler.bind(this)}
                    {...this.props} />
            )
        }

        changeHandler = e => {
            const { pattern, showRemaining } = this.props
            const { valueChanged } = this.state
            const str = e.target.value.toString()
            let patt = pattern ? pattern : /^([A-Za-z0-9À-ÿ\u00f1\u00d1\,\.\:\;\ \?\¿\!\¡])*$/g

            if (patt.test(str)) {
                if (showRemaining) {
                    const { id, maxLength } = this.props
                    let input = document.getElementById(id)
                    let characters = input.value.length
                    let remainingCharacters = maxLength - characters

                    if (!valueChanged) {
                        this.setState({ remaining: remainingCharacters, valueChanged: true, value: str })
                    } else {
                        this.setState({ remaining: remainingCharacters, value: str })
                    }
                } else {
                    if (!valueChanged) {
                        this.setState({ valueChanged: true, value: str })
                    } else {
                        this.setState({ value: str })
                    }
                }
            }
        }
    }

    MainInput.propTypes = {
        id: PropTypes.string.isRequired, //Html id requerido
        maxLength: PropTypes.number, //tamaño maximo de caracteres permitidos
        showRemaining: PropTypes.bool, //mostrar o no caracteres restantes
        type: PropTypes.string.isRequired, //text o textarea
        name: PropTypes.string.isRequired, //Html name
        required: PropTypes.bool, //Html required
        rows: PropTypes.number, //cuantas rows para textArea
        label: PropTypes.string, //label
        placeholder: PropTypes.string, //Html placeholder
        className: PropTypes.string, //react className
        pattern: PropTypes.string, //js pattern
        language: PropTypes.string, //Lenguaje si no se coloca se expecifica se toma en por defecto
        defaultValue: PropTypes.node //Valor por defecto
    }

    return MainInput
}