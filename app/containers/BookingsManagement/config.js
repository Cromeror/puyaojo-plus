export default {
    checkInOut: {
        rules: [{
            type: 'array',
            required: true,
            message: 'Please select date range!'
        }],
    },
    product: {
        rules: [{
            required: true,
            message: 'Required!'
        }],
    },
    language: {
        rules: [{
            required: true,
            message: 'Required!'
        }],
    },
    currency: {
        rules: [{
            required: true,
            message: 'Required!'
        }],
    },
    people: {
        rules: [{
            required: true,
            message: 'Required!'
        }],
    },
    clientName: {
        rules: [{
            required: true,
            message: 'Required!'
        }],
    },
    /* clientPhone: {
        rules: [{
            type: 'number',
            message: 'The phone must be numeric'
        }],
    }, */
    clientEmail: {
        rules: [{
            required: true,
            message: 'The email is required'
        }],
    },
    lessPayment: {
        rules: [{
            required: true,
            message: 'Is required'
        }],
    }
}