import React, { PropTypes } from 'react'

const translations = {
    remaining: {
        es: 'Restantes',
        en: 'Remaining'
    }
}

class InputText extends React.Component {
    constructor(props) {
        super(props)

        this.staticType = {
            text: 'text',
            textarea: 'textarea'
        }
        this.maxLengthDef = 524288 //Maximo de caracteres permitidos para un input

        let maxLength = props.maxLength
        let remaining = (props && maxLength && maxLength <= this.maxLengthDef)
            ? maxLength
            : this.maxLengthDef

        this.state = {
            remaining
        }
    }

    render() {
        const { maxLength, showRemaining, type, name, required, rows, label, placeholder, className, pattern, style } = this.props
        const language = this.props.language ? this.props.language : 'en'
        const { remaining } = this.state

        return (
            <div>
                {(type && type == this.staticType.text) ?
                    <div className={className ? className : ''} style={style ? style : null}>
                        {label &&
                            <label style={{ marginBottom: 5, display: 'block' }}>
                                {label}
                            </label>
                        }
                        <input type="text"
                            id={this.staticType.text}
                            name={name ? name : ''}
                            required={required}
                            placeholder={placeholder ? placeholder : ''}
                            maxLength={maxLength ? maxLength : this.maxLengthDef}
                            onInput={this.remainingCharacters}
                            onKeyPress={this.validationCharacters}
                        />
                    </div>
                    :
                    <div className={className ? className : ''} style={style ? style : null}>
                        {label &&
                            <label style={{ marginBottom: 5, display: 'block' }}>
                                {label}
                            </label>
                        }
                        <textarea
                            id={this.staticType.textarea}
                            name={name ? name : ''}
                            required={required}
                            rows={rows ? rows : 2}
                            placeholder={placeholder ? placeholder : ''}
                            maxLength={maxLength ? maxLength : this.maxLengthDef}
                            onInput={this.remainingCharacters}
                            onKeyPress={this.validationCharacters}>
                        </textarea>
                    </div>
                }
                {showRemaining &&
                    <label>{translations.remaining[language]}<span> {remaining}</span></label>
                }
            </div>
        )
    }

    remainingCharacters = (e) => {
        const { remaining } = this.state
        const { maxLength, type } = this.props
        let inputType = (type && type == this.staticType.text)
            ? this.staticType.text
            : this.staticType.textarea

        let input = document.getElementById(inputType)
        let characters = input.value.length
        let remainingCharacters = maxLength - characters

        this.setState({ remaining: remainingCharacters })
    }

    validationCharacters = e => {
        const { pattern } = this.props
        let patt = pattern ? pattern : /([A-Za-z0-9\,\.\:\;\ \?\¿\!\¡])/i
        let charIn = e.key

        if (!patt.test(charIn))
            e.preventDefault()

    }
}

InputText.propTypes = {
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
    style: PropTypes.object //react object style
}

export default (InputText)