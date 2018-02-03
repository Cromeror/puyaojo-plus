import axios from 'axios'
import { serverConfig } from '../../config/localConfig'

const apiUrl = serverConfig.apiUrl,
    recurso = 'puestos'

const service = {
    find: (token, params) => {
        return axios.get(`${apiUrl}/${recurso}`,
            {
                headers: {
                    "Authorization": token
                },
                params
            })
    },
    get: id => {
        return axios.get(`${apiUrl}/${recurso}/${id}`)
    },
    add: (data, token) => {
        return axios.post(`${apiUrl}/${recurso}`, data, { headers: { "Authorization": token } })
    },
    update: (data, id) => {
        //data.source = serverConfig.appId
        return axios.put(`${apiUrl}/${recurso}/${id}`, data)
    }
}

export default service