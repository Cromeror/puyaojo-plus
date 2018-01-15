import React from 'react'

if ('undefined' !== typeof window) {
    var Pikaday = require('pikaday');
}

export default class DatePickerRange extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const { dateIn, dateOut } = this.props;

        var startDate,
            endDate,
            updateStartDate = function () {
                startPicker.setStartRange(startDate);
                endPicker.setStartRange(startDate);
                endPicker.setMinDate(startDate);
            },
            updateEndDate = function () {
                startPicker.setEndRange(endDate);
                //startPicker.setMaxDate(endDate);
                endPicker.setEndRange(endDate);
            },
            startPicker = new Pikaday({
                field: document.getElementById('dateIn'),
                format: 'MM/DD/YYYY',
                minDate: new Date(),
                onSelect: function () {
                    startDate = this.getDate();
                    updateStartDate();
                    //endPicker.setMinDate(moment(startDate).startOf('day').add(1, 'days'))
                    endPicker.gotoDate(startDate);
                    endPicker.show();
                }
            }),
            endPicker = new Pikaday({
                field: document.getElementById('dateOut'),
                format: 'MM/DD/YYYY',
                minDate: new Date(),
                onSelect: function () {
                    endDate = this.getDate();
                    updateEndDate();
                }
            }),
            _startDate = startPicker.getDate(),
            _endDate = endPicker.getDate();
        if (_startDate) {
            startDate = _startDate;
            updateStartDate();
        }
        if (_endDate) {
            endDate = _endDate;
            updateEndDate();
        }
    }

    /**
     * labels: es un array de dos posiciones con los nombres de las etiquetas para los dos datepicker
     * nameIn: Es el atributo name del datePicker de entrada
     * nameOut: Es el atributo name del datePicker de salida
     * className: Lo usamos si queremos pasarle un estilo
     */
    render() {
        var { labels, nameIn, nameOut, className, required } = this.props
        let pickerClassName = className ? className : 'col s6 m4'

        return (
            <div>
                <div className={pickerClassName}>
                    {labels && <label>{labels[0]}</label>}
                    <input
                        className="inline"
                        type="text"
                        name={nameIn ? nameIn : "dateIn"}
                        id="dateIn"
                        required={required}
                        defaultValue={this.props.dateIn}
                        onKeyPress={this.handlerKeyPress} />
                </div>
                <div className={pickerClassName}>
                    {labels && <label>{labels[1]}</label>}
                    <input
                        className="inline"
                        type="text"
                        name={nameOut ? nameOut : "dateOut"}
                        id="dateOut"
                        required={required}
                        defaultValue={this.props.dateOut}
                        onKeyPress={this.handlerKeyPress} />
                </div>
            </div>
        )
    }
    handlerKeyPress = (e) => {
        e.preventDefault()
    }
}