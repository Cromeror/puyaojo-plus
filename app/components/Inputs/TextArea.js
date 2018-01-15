import React, { PropTypes } from 'react'
import initInput from './initInput'

class TextArea extends React.Component {
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
            rows,
            label,
            placeholder,
            defaultValue,
            className,
            changeHandler,
            valueChanged
        } = this.props

        return (
            <div className={className ? className : ''}>
                {label &&
                    <label style={{ marginBottom: 5, display: 'block' }}>
                        {label}
                    </label>
                }

                <textarea
                    id={id}
                    name={name ? name : ''}
                    required={required}
                    rows={rows ? rows : 2}
                    placeholder={placeholder ? placeholder : ''}
                    value={valueChanged}
                    defaultValue={defaultValue}
                    maxLength={maxLength}
                    onChange={changeHandler}
                    style={{ resize: 'none' }}>
                </textarea>

                {showRemaining &&
                    <label>{translations.remaining[language]}<span> {remaining}</span></label>
                }
            </div>
        )
    }
}

export default initInput(TextArea)