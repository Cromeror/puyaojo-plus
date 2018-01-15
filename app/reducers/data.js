import { GET_ALL_DATA } from 'types'

const data = (state = { language: 'es' }, action) => {
    switch (action.type) {
        case GET_ALL_DATA:
            return Object.assign({}, action.data)

        default:
            return state
    }
}

export default data