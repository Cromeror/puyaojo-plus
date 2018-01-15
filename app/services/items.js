import axios from 'axios'
import { serverConfig } from '../../config/localConfig'

const apiUrl = serverConfig.apiUrl

const service = {
    get: (params) => {
        return axios.get(`${apiUrl}/item`, {
            params
        })
    }
}

export default service