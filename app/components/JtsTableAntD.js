import React from 'react'
import moment, { calendarFormat } from 'moment'
/**Components */
import {
    Table,
    Row,
    Col,
    Input,
    Button,
    Select,
    Icon
} from 'antd'

const Option = Select.Option,
    Search = Input.Search

class JtsTableAntD extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            columns: props.columns ? props.columns : new Array(),
            dataSource: props.dataSource ? props.dataSource : new Array(),
            queryCriteria: 'default',
            query: '',
            scroll: { x: 1000, y: 500 }
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props) {
            if (this.props.dataSource != nextProps.dataSource)
                this.setState({ dataSource: nextProps.dataSource })
            if (this.props.scroll != nextProps.scroll)
                this.setState({ scroll: nextProps.scroll })
        }
    }

    render() {
        const { columns, dataSource } = this.state
        const { id, searchVisible, onRowClick } = this.props
        const defaultColumns = this.props.columns

        return (
            <div key={id}>
                <Row gutter={16} key={`row-columnCustomizer-${id}`}>
                    {defaultColumns &&
                        this.loadTableCustomizer(defaultColumns)}
                </Row>
                {searchVisible &&
                    <Row gutter={16} style={{ marginTop: 20, marginBottom: 10 }}>
                        <Col
                            key='query-criteria-content'
                            sm={24}
                            md={3}>
                            {this.loadOptionSearch(columns)}
                        </Col>
                        <Col
                            sm={24}
                            md={9}>
                            <Row gutter={12}>
                                <Col
                                    md={20}>
                                    <Search
                                        id="input-search"
                                        placeholder="Input search text"
                                        onSearch={value => this.onSearch(value)}
                                        enterButton
                                    />
                                </Col>
                                <Col
                                    md={4}>
                                    <Button shape="circle" icon="close" onClick={this.onSearchClear} />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                }
                <Table
                    key={`jtstable-antd-${id}`}
                    id={id}
                    columns={columns}
                    dataSource={dataSource}
                    scroll={this.state.scroll}
                    size={this.props.size || 'default'}
                    onRowClick={this.props.onRowClick || null}
                    bordered />
            </div>
        )
    }

    /**
     * Permite conocer el criterio de busqueda
     */
    handleChange = (value) => {
        this.setState({ queryCriteria: value })
    }

    /**
     * Realiza la busqueda tomando los valores que ingresa el usuario
     * en el campo de busqueda
     */
    onSearch = (e) => {
        const { query, queryCriteria } = this.state,
            { dataSource } = this.props,
            reg = new RegExp(e, 'gi')
        let result = new Array()

        for (const data of dataSource) {
            let dataValue = ''

            /**
             * Verificamos el criterio de busqueda, si busca por ALL tenemos que
             * obtener solo los valores de las columnas visible.
             */
            if (queryCriteria == 'default' || queryCriteria == 'all') {
                for (const column of this.state.columns) {
                    dataValue += column.dataIndex
                        ? data[column.dataIndex] || ''//Tambien verficamos que el dataIndex buscado exista
                        : ''
                }
            } else
                dataValue = data[queryCriteria] || ''

            if (dataValue.match(reg)) {
                result.push(data)
            }
        }
        this.setState({ dataSource: result })
    }

    /**
     * Realiza una limpieza de los resultados de busqueda
     */
    onSearchClear = (e) => {
        document.getElementById('input-search').value = ''
        this.setState({ dataSource: this.props.dataSource })
    }

    onSelectColum = e => {
        if (e.target.checked) {
            this.addHeaderItem(e.target.id)
        } else {
            this.removeHeaderItem(e.target.id)
        }
    }

    loadOptionSearch = (columns) => {
        let options = new Array()
        options.push(<Option key='all' value='all'>All</Option>)
        for (const column of columns) {
            options.push(
                <Option
                    key={column.key}
                    value={column.dataIndex}>
                    {column.title}
                </Option>)
        }
        return (
            <Select
                key='query-criteria'
                defaultValue="all"
                style={{ width: '100%' }}
                onChange={this.handleChange}>
                {options}
            </Select>)
    }

    loadTableCustomizer = (columns) => {
        const { id } = this.props
        let checkboxes = new Array()
        for (let column of columns) {
            checkboxes.push(
                <Col
                    xs={24}
                    sm={12}
                    md={6}
                    xl={4}
                    key={`col-${id}-${column.key}`}>
                    <input type="checkbox"
                        key={`checkbox-${id}-${column.key}`}
                        id={column.key}
                        name={column.key}
                        value={column.key}
                        defaultChecked='true'
                        onChange={this.onSelectColum}
                        style={{
                            width: 'auto',
                            display: 'inline-block',
                            marginRight: 5
                        }} />
                    <label key={`label-${id}-${column.key}`}>{column.title}</label>
                </Col>)
        }
        return checkboxes
    }

    /**
     * Remueve una columna de la tabla
     */
    removeHeaderItem = (index) => {
        this.setState(prevState => {
            let columns = [...prevState.columns]
            for (let i = 0; columns.length; i++) {
                if (columns[i].key === index) {
                    columns.splice(i, 1)
                    this.setState({ scroll: { x: this.resizeTableX(columns.length), y: this.state.y } })
                    break
                }
            }
            return { columns }
        })
    }

    /**
     * Recalcula el ancho de la tabla distribuyendo equitativamente el ancho de las columnas.
     * 
     * **Importante:** No tiene en cuenta las columnas que tienen ancho personalizado.
     */
    resizeTableX = (columns) => {
        let x = this.state.scroll.x / columns//Calculamos el valor por columna equitativamente
        return x * (columns - 1)//Restamos una columna y recalculamos el tamaño total de la tabla
    }

    addHeaderItem = index => {
        const defaultColumns = this.props.columns
        this.setState(prevState => {
            let columns = [...prevState.columns]
            for (let i = 0; defaultColumns.length; i++) {
                if (defaultColumns[i].key === index) {
                    columns.push(defaultColumns[i])
                    break
                }
            }
            return { columns }
        })
    }
}


export default (JtsTableAntD)