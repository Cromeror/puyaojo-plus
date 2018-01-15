import React, { PropTypes } from 'react'
import initInput from './initInput'

class InputText extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        const {
            id,
            translations,
            language,
            remaining,
            maxLength,
            showRemaining,
            name,
            required,
            label,
            defaultValue,
            placeholder,
            className,
            valueChanged,
            changeHandler
        } = this.props


        return (
            <div className={className ? className : ''}>
                {label &&
                    <label style={{ marginBottom: 5, display: 'block' }}>
                        {label}
                    </label>
                }
                <input
                    id={id}
                    type="text"
                    name={name ? name : ''}
                    required={required}
                    placeholder={placeholder ? placeholder : ''}
                    value={valueChanged}
                    maxLength={maxLength}
                    onChange={changeHandler}
                />

                {showRemaining &&
                    <label>{translations.remaining[language]}<span> {remaining}</span></label>
                }
            </div>
        )
    }
}

export default initInput(InputText)