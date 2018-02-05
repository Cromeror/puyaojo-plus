import React from 'react'
import PropTypes from 'prop-types'
/**Components */
import {
    AutoComplete
} from 'antd'

class Index extends React.Component {
    constructor(props) {
        super(props)

        this.dataSource = []
    }

    componentWillReceiveProps(nextProps, nextState) {
        if (this.dataSource != nextProps.dataSource)
            this.dataSource = nextProps.dataSource
    }

    render() {
        return <AutoComplete
            value={this.props.value}
            dataSource={this.dataSource}
            placeholder={this.props.placeholder}
            onChange={this.props.onChange}
            onSelect={this.props.onSelect}
            onFocus={this.resetDataSource}
            onBlur={this.resetDataSource} />
    }

    resetDataSource = () => {
        this.setState({ dataSource: [] })
    }
}

Index.propTypes = {
    placeholder: PropTypes.string
}

export default Index