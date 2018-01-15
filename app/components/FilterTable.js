import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { Table, Column, Cell } from 'fixed-data-table-2'
import Dimensions from 'react-dimensions'

const TextCell = ({ rowIndex, type, rows, col, onSelectRow, ...props }) => (
    <Cell {...props} onClick={onSelectRow.bind(null, rows[rowIndex])}>
        {type == 'date' ? moment(rows[rowIndex][col]).format('MM/DD/YYYY') : rows[rowIndex][col]}
    </Cell>
)

class FilterTable extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            filteredDataList: props.rows ? props.rows : [],
            sortBy: props.defaultSort,
            sortDir: null,
            columnWidths: {}
        }

        this._onColumnResizeEndCallback = this._onColumnResizeEndCallback.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.rows != nextProps.rows) {
            this.init(nextProps)
        }
    }

    componentWillMount() {
        this.init(this.props)
    }

    render() {
        const { filteredDataList, maxWidth, columnWidths, sortBy } = this.state
        const { headers, onSelectRow, containerWidth } = this.props
        let columns = []
        let rowsLength = filteredDataList.length
        let filters = false

        if (rowsLength >= 0) {
            let options = []

            for (var column of headers) {
                columns.push(
                    <Column
                        columnKey={column.id}
                        header={this._renderHeader(column.label, column.id)}
                        cell={<TextCell type={column.type} rows={filteredDataList} col={column.id} onSelectRow={onSelectRow} />}
                        width={columnWidths[column.id]}
                        isResizable={true}
                    />
                )
                options.push(<option value={column.id}>{column.label}</option>)
            }

            filters = (
                <div className="col s3">
                    <label>Filtrar por:</label>
                    <select value={sortBy} onChange={this.onChangeSelectFilter} style={{ marginTop: 5, display: 'inherit' }}>
                        {options}
                    </select>
                </div>
            )
        }

        return (
            <div className="row">
                <div className="col s12 noPadding">
                    {filters && filters}
                    <div className="col s12 m3">
                        <input id="FDT-search" placeholder="Texto a filtrar" onChange={this._onFilterChange.bind(this, sortBy)} style={{ height: 35, marginTop: 28 }} />
                    </div>
                    <div className="col s12 m3">
                        <button className="btn-primary" onClick={(e) => { document.getElementById('FDT-search').value = ''; this._onFilterChange(false, false) }} style={{ marginTop: 28 }}>Limpiar</button>
                    </div>
                    <div className="col s12 m3" style={{ marginTop: 30, textAlign: 'right' }}>
                        {rowsLength} records
                    </div>
                </div>

                <div className="col s12" style={{ marginTop: 10 }}>
                    <Table
                        id="filterTable"
                        rowHeight={60}
                        headerHeight={70}
                        rowsCount={rowsLength}
                        width={containerWidth}
                        height={90 + ((rowsLength > 10 ? 10 : rowsLength) * 60)}
                        touchScrollEnabled={true}
                        onColumnResizeEndCallback={this._onColumnResizeEndCallback}
                        isColumnResizing={false}
                        {...this.props}
                    >
                        {columns && columns}
                    </Table>
                </div>
            </div>
        )
    }

    onChangeSelectFilter = e => {
        this.setState({ sortBy: e.target.value })
    }

    init(props) {
        const { headers } = props
        const filteredDataList = props.rows
        let columnWidths = {}
        let itemsLength = 1080 / headers.length

        for (let column of headers) {
            columnWidths[column.id] = itemsLength + 40
        }

        this.setState({ columnWidths, filteredDataList })
    }

    _onColumnResizeEndCallback(newColumnWidth, columnKey) {
        this.setState(({ columnWidths }) => ({
            columnWidths: {
                ...columnWidths,
                [columnKey]: newColumnWidth,
            }
        }));
    }

    _renderHeader(label, cellDataKey) {
        var sortDirArrow = ''

        if (this.state.sortDir !== null) {
            sortDirArrow = this.state.sortDir === 'DESC' ? ' ↓' : ' ↑'
        }

        return <div style={{ padding: '0px 10px' }}>
            <a className="centerAlign" onClick={this._sortRowsBy.bind(this, cellDataKey)} style={{ cursor: 'pointer', display: 'block', marginTop: 10 }}>{label + (this.state.sortBy === cellDataKey ? sortDirArrow : '')}</a>
            {/*<div>
                <input style={{ width: 100 + '%', height: 25 }} onChange={this._onFilterChange.bind(this, cellDataKey)} />
            </div>*/}
        </div>
    }

    _onFilterChange(cellDataKey, event) {
        const { filteredDataList } = this.state

        if (!event || !event.target.value) {
            this.setState({ filteredDataList: this.props.rows })
        }

        var filterBy = event.target.value.toString().toLowerCase()
        var size = filteredDataList.length
        var filteredList = []

        for (var index = 0; index < size; index++) {
            var v = filteredDataList[index][cellDataKey]
            if (v && v.toString().toLowerCase().indexOf(filterBy) !== -1) {
                filteredList.push(filteredDataList[index])
            }
        }

        this.setState({
            filteredDataList: filteredList
        })
    }

    _sortRowsBy(cellDataKey) {
        console.log('Sort By ' + cellDataKey)
        var sortDir = this.state.sortDir
        var sortBy = cellDataKey

        if (sortBy === this.state.sortBy) {
            sortDir = this.state.sortDir === 'ASC' ? 'DESC' : 'ASC'
        } else {
            sortDir = 'DESC'
        }

        var rows = this.state.filteredDataList.slice()
        rows.sort((a, b) => {
            var sortVal = 0

            if (a[sortBy] > b[sortBy]) {
                sortVal = 1
            }
            if (a[sortBy] < b[sortBy]) {
                sortVal = -1
            }

            if (sortDir === 'DESC') {
                sortVal = sortVal * -1
            }

            return sortVal
        })

        this.setState({ sortBy, sortDir, filteredDataList: rows })
    }
}


export default Dimensions({
    elementResize: true
})(FilterTable)