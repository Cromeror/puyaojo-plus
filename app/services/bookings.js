import axios from 'axios'
import { serverConfig } from '../../config/localConfig'

const apiUrl = serverConfig.apiUrl

const service = {
    find: () => {
        return axios.get(apiUrl + '/bookings')
    },
    get: id => {
        return axios.get(`${apiUrl}/bookings/${id}`)
    },
    add: data => {
        data.source = serverConfig.appId
        return axios.post(apiUrl + '/bookings', { data })
    },
    update: (data, id) => {
        //data.source = serverConfig.appId
        return axios.put(`${apiUrl}/bookings/${id}`, data)
    },
    send: (id, params) => {
        return axios.get(`${apiUrl}/bookings/payment/${id}`,
            { params })
    },
    getPrice: (id, qtyPeople, startDate, endDate, currency, lang) => {
        return axios.get(`${apiUrl}/items/${id}/price`,
            {
                params: {
                    qtyPeople,
                    startDate,
                    endDate,
                    currency,
                    lang
                }
            })
    }
}

export default service