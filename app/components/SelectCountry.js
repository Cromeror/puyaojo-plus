import React, { Component } from 'react'
import axios from 'axios'

export default class SelectCountry extends Component {
    constructor(props) {
        super(props)

        this.service = 'https://restcountries.eu/rest/v1/all'
        this.state = {
            countries: []
        }
    }

    componentDidMount() {
        this.getCountries(this.service)
    }

    render() {
        const { name, defaultValue, required, defaultText, className, label } = this.props
        var countries = []
        var i = 0

        for (var country of this.state.countries) {
            if (country.ab === 'US' || country.ab === 'CO') {
                countries.unshift(<option key={'sc-op-' + i} value={country.ab}>{country.name}</option>)
            }
            else {
                countries.push(<option key={'sc-op-' + i} value={country.ab}>{country.name}</option>)
            }
            i++
        }

        return (
            <div className={"input-field " + (className ? className : 'col s12 m6')}>
                <label htmlFor="name" style={{ marginBottom: 5, display: 'block' }}>{label ? label : 'Country'}</label>
                <select
                    className="browser-default"
                    name={name ? name : 'selectCountryComponent'}
                    defaultValue={defaultValue ? defaultValue : ''}
                    required={required ? required : false}>
                    <option value="">{defaultText ? defaultText : 'Select country'}</option>
                    {countries}
                </select>
            </div>
        )
    }

    getCountries(service) {
        var that = this

        axios.get(service).then(response => {
            var json = response.data
            var data = []

            for (var i = 0; i < json.length; i++) {
                data.push({ name: json[i].name, ab: json[i].alpha2Code })
            }
            that.setState({ countries: data })
        }).catch(error => {
            console.log('Hubo un error al intentar cargar las ciudades')
        })
    }
}