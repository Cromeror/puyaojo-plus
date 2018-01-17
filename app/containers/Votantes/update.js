import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router'
import moment from 'moment'
/* Components */
import JtsTableAntD from 'components/JtsTableAntD'
import { Table, Icon, Divider } from 'antd'
/* Actions */

/*Services */
import services from 'services/bookings'
/*Helpers */
import { objectSorter } from 'helpers/helpers'

const dateFormat = 'YYYY/MM/DD'
const columns = [
    {
        title: 'Product',
        dataIndex: 'post_title',
        key: 'product',
        render: text => <a href="#">{text}</a>,
        width: 400,
        sorter: (a, b) => {
            return objectSorter(a, b, 'post_title')
        }
    },
    {
        title: 'Language',
        dataIndex: 'language',
        key: 'language',
        width: 150,
        sorter: (a, b) => {
            return objectSorter(a, b, 'language')
        }
    },
    {
        title: 'Currency',
        dataIndex: 'currency',
        key: 'currency',
        width: 150,
        sorter: (a, b) => {
            return objectSorter(a, b, 'currency')
        }
    },
    {
        title: 'Client name',
        dataIndex: 'user_name',
        key: 'client_name',
        width: 200,
        sorter: (a, b) => {
            return objectSorter(a, b, 'user_name')
        }
    },
    {
        title: 'Client email',
        dataIndex: 'client_email',
        key: 'user_email',
        width: 200
    },
    {
        title: 'People',
        dataIndex: 'qty_people',
        key: 'qty_people',
        width: 100,
        sorter: (a, b) => {
            return objectSorter(a, b, 'quantity')
        }
    },
    {
        title: 'Days number',
        dataIndex: 'qty_days',
        key: 'qty_days',
        width: 100,
        sorter: (a, b) => {
            return objectSorter(a, b, 'client_email')
        }
    },
    {
        title: 'Start date',
        key: 'start_date',
        width: 100,
        render: (text, record) => (
            <span>
                {moment(record.start_date).format(dateFormat)}
            </span>
        ),
        defaultSortOrder: 'descend',
        sorter: (a, b) => {
            return objectSorter(a, b, 'start_date')
        }
    },
    {
        title: 'End date',
        key: 'end_date',
        width: 100,
        render: (text, record) => (
            <span>
                {moment(record.end_date).format(dateFormat)}
            </span>
        ),
        sorter: (a, b) => {
            return objectSorter(a, b, 'end_date')
        }
    },
    {
        title: 'Total',
        dataIndex: 'total',
        key: 'total',
        width: 100
    },
    {
        title: 'Paid',
        dataIndex: 'amount_paid',
        key: 'amount_paid',
        width: 100
    },
    {
        title: 'Discount',
        dataIndex: 'discount',
        key: 'discount',
        width: 100,
        sorter: (a, b) => {
            return objectSorter(a, b, 'discount')
        }
    },
    {
        title: 'Payment requested',
        dataIndex: 'downpayment',
        key: 'downpayment',
        width: 100
    },
    {
        title: 'Booking status',
        dataIndex: 'status',
        key: 'status',
        width: 100,
        sorter: (a, b) => {
            return objectSorter(a, b, 'downpayment')
        }
    },
    {
        title: 'Action',
        key: 'action',
        width: 100,
        fixed: 'right',
        render: (text, record) => (
            <span>
                <Link to={`/dashboard/bookings/update/${record.id}`}>Update</Link>
            </span>
        ),
    }]

class Bookings extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            bookings: [],
            headers: []
        }
    }
    componentWillMount() {
        services.find()
            .then(bookings => {
                this.setState({ bookings: bookings.data })
            })
    }

    render() {
        const { bookings, headers } = this.state
        return (
            <div >
                <div className="row">
                    <div className="col s12">
                        <JtsTableAntD
                            searchVisible
                            columns={columns}
                            dataSource={bookings}
                            id='bookings' />
                    </div>
                </div>
            </div>
        )
    }

    onSelectRow = row => {
        console.log(row)
    }
}

export default (Bookings)