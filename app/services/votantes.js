import axios from 'axios'
import { serverConfig } from '../../config/localConfig'

const apiUrl = serverConfig.apiUrl,
    recurso = 'votantes'

const service = {
    find: (token) => {
        return axios.get(`${apiUrl}/${recurso}`, { headers: { "Authorization": token } })
    },
    get: (id, token) => {
        return axios.get(`${apiUrl}/${recurso}/${id}`, { headers: { "Authorization": token } })
    },
    add: (data, token) => {
        return axios.post(`${apiUrl}/${recurso}`, data, { headers: { "Authorization": token } })
    },
    update: (data, id, token) => {
        return axios.put(`${apiUrl}/${recurso}/${id}`, data, { headers: { "Authorization": token } })
    }
}

export default service