import React, { PropTypes } from 'react'

const translations = {
    invalidType: {
        "es": "Tipo inválido. Los validos son: text, textArea, number y phone",
        "en": "Invalid type. The valid ones are: text, textArea, number & phone"
    }
}

class Input extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { type, language } = this.props
        let lang = language ? language : 'en'
        let inputInstance = this.getInputInstance(type)

        return (
            <div>
                {inputInstance ?
                    inputInstance
                    :
                    <div>
                        <h5>{translations.invalidType[lang]}</h5>
                    </div>
                }
            </div>
        )
    }

    getInputInstance(type) {
        var inputInstance = false

        switch (type) {
            case 'text':
                inputInstance = 'InputText'
                break

            case 'textArea':
                inputInstance = 'TextArea'
                break

            case 'number':
                inputInstance = 'InputNumber'
                break

            case 'phone':
                inputInstance = 'InputPhone'
                break
        }

        if (inputInstance) {
            inputInstance = require(`./${inputInstance}`)
            let Component = React.createFactory(inputInstance.default)
            inputInstance = <Component {...this.props} />
        }

        return inputInstance
    }
}

export default (Input)