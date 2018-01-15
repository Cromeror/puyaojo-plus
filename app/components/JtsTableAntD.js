import React from 'react'
import moment, { calendarFormat } from 'moment'
/**Components */
import {
    Table,
    Row,
    Col,
    Input,
    Button,
    Select
} from 'antd'

const Option = Select.Option
class JtsTableAntD extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            columns: props.columns ? props.columns : new Array(),
            dataSource: props.dataSource ? props.dataSource : new Array(),
            queryCriteria: 'default',
            query: ''
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.dataSource != nextProps.dataSource)
            this.setState({ dataSource: nextProps.dataSource })
    }

    render() {
        const { columns, dataSource } = this.state
        const { id, searchVisible } = this.props
        const defaultColumns = this.props.columns

        return (
            <div key={id}>
                <Row gutter={16} key={`row-columnCustomizer-${id}`}>
                    {defaultColumns &&
                        this.loadTableCustomizer(defaultColumns)}
                </Row>
                {searchVisible &&
                    <Row gutter={16} style={{ marginTop: 20 }}>
                        <Col
                            key='query-criteria-content'
                            sm={24}
                            md={8}>
                            {this.loadOptionSearch(columns)}
                        </Col>
                        <Col
                            sm={24}
                            md={8}>
                            <Input
                                onChange={this.onInputChange}
                                placeholder='Search' />
                        </Col>
                        <Col>
                            <Button type="primary" onClick={this.onSearch} >Search</Button>
                        </Col>
                    </Row>
                }
                <Table
                    key={`jtstable-antd-${id}`}
                    id={id}
                    columns={columns}
                    dataSource={dataSource}
                    scroll={{ x: 1500, y: 500 }} />
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
     * Permite conocer el valor a buscar en la tabla
     */
    onInputChange = (e) => {
        this.setState({ query: e.target.value });
    }

    /**
     * Realiza la busqueda tomando los valores que ingresa el usuario
     * en el campo de busqueda
     */
    onSearch = (e) => {
        const { query, queryCriteria } = this.state,
            { dataSource } = this.props,
            reg = new RegExp(query, 'gi')
        let result = new Array()

        for (const data of dataSource) {
            const
                dataValue = queryCriteria == 'default' || queryCriteria == 'all'
                    ? JSON.stringify(data)
                    : (data[queryCriteria] ? data[queryCriteria] : ''),
                match = dataValue.match(reg)
            if (match) {
                result.push(data)
            }
        }
        this.setState({ dataSource: result })
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
        options.push(<Option key='default' value='default'>Select column for search</Option>)
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
                defaultValue="default"
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

    removeHeaderItem = (index) => {
        this.setState(prevState => {
            let columns = [...prevState.columns]
            for (let i = 0; columns.length; i++) {
                if (columns[i].key === index) {
                    columns.splice(i, 1)
                    break
                }
            }
            return { columns }
        })
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