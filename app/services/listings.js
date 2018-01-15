import axios from 'axios'
import { serverConfig } from '../../config/localConfig'

const apiUrl = serverConfig.apiUrl

const service = {
    find: (params, id) => {
        return axios.get(`${apiUrl}/listings${id ? '/' + id : ''}`, {
            params
        })
    },
    get: (id) => {
        return axios.get(`${apiUrl}/listings${id ? '/' + id : ''}`)
    }
}

export default service